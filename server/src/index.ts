import dotenv from 'dotenv';
import path from 'path';

// Load environment variables gracefully from available locations
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

import * as Sentry from '@sentry/node';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dns from 'dns';
import { logger } from './lib/logger';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';

// Force IPv4 resolution for Neon/Prisma stability
dns.setDefaultResultOrder('ipv4first');

import authRoutes from './routes/auth';
import tradeRoutes from './routes/trades';
import brokerRoutes from './routes/brokers';
import tradingRulesRoutes from './routes/tradingRules';
import platformRulesRoutes from './routes/platformRules';
import strategyRoutes from './routes/strategies';
import journalRoutes from './routes/journal';
import adminRoutes from './routes/admin';
import aiRoutes from './routes/ai';
import newsRoutes from './routes/news';
import analyticsRoutes from './routes/analytics';
import reflectionsRoutes from './routes/reflections';
import goalsRoutes from './routes/goals';
import searchRoutes from './routes/search';
import notesRoutes from './routes/notes';
import marketRoutes from './routes/marketV2';
import notificationRoutes from './routes/notifications';
import newsEngineRoutes from './routes/news-engine';
import flowRoutes from './routes/flow.routes';
import voiceRoutes from './routes/voice';
import { startNewsEngine, stopNewsEngine } from './news-engine';
import { marketWorker } from './services/MarketWorker';
import { flowDataWorker } from './flow/workers/FlowDataWorker';
import { signalWorker } from './flow/workers/SignalWorker';

const app = express();

// Initialize Sentry (wrapped in try-catch for resilience in serverless environments)
if (process.env.SENTRY_DSN) {
  try {
    Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
    Sentry.setupExpressErrorHandler(app);
  } catch (err) {
    console.warn('Sentry initialization failed (non-fatal):', err);
  }
}

// Dynamic CORS configuration
app.use(cors({ origin: process.env.EXTERNAL_FRONTEND_URL || false, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());
app.use(helmet());

// ── CSRF Protection via csrf-csrf (double-submit cookie) ───────────────────────
// Replaces deprecated `csurf` which crashed in Vercel serverless environments.
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET || 'riskrule_csrf_fallback_2026_x99887766';
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  // In the double-submit pattern, the session identifier binds the token to the user.
  // We use the auth cookie value (or an empty string for unauthenticated requests like login).
  getSessionIdentifier: (req: express.Request) =>
    (req.cookies?.['auth-token'] as string) || (req.cookies?.token as string) || '',
  cookieName: 'csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  getCsrfTokenFromRequest: (req: express.Request) =>
    (req.headers['csrf-token'] as string) ||
    (req.headers['x-csrf-token'] as string) ||
    (req.body?._csrf as string) || '',
});

// Logging middleware
const morganFormat = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined';
app.use(morgan(morganFormat, { stream: { write: (msg: string) => logger.info(msg.trim()) } }));

// Static files
app.use(express.static(path.join(process.cwd(), 'public')));
app.get('/', (_req, res) => res.redirect('/api-tester.html'));

// CSRF Token endpoint — must be registered BEFORE the CSRF protection middleware
// so it can set the cookie and generate the token on first visit.
app.get('/api/auth/csrf', (req, res) => {
  try {
    const token = generateCsrfToken(req, res);
    res.json({ csrfToken: token });
  } catch (err: any) {
    logger.error('[CSRF] Token generation failed', { error: err?.message });
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
});

// Health check (no CSRF needed)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply CSRF protection to mutating API calls only.
// SSE streaming endpoints are excluded (EventSource cannot send custom headers).
const SSE_PATHS = ['/market/stream', '/market/ai-summary/stream', '/v1/flow/stream'];
app.use('/api', (req, res, next) => {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return next();
  if (SSE_PATHS.some(p => req.path.startsWith(p))) return next();
  return doubleCsrfProtection(req, res, next);
});



import { marketAIService } from './market/MarketAIService';

// Modular Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/trading-rules', tradingRulesRoutes);
app.use('/api/platform-rules', platformRulesRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/strategies', strategyRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reflections', reflectionsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/news-engine', newsEngineRoutes);
app.use('/api/v1/flow', flowRoutes);
app.use('/api/voice', voiceRoutes);

// Global Error Handler (catches CSRF errors and unhandled exceptions)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ error: 'Invalid or missing CSRF token' });
    return;
  }
  logger.error('[Unhandled Error]', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start News Engine Pipeline (only in persistent dev server or if explicitly enabled)
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_BACKGROUND_WORKERS === 'true') {
  try {
    startNewsEngine();
    marketWorker.start();
    marketAIService.startBackgroundWorker();
    flowDataWorker.start(['NIFTY', 'BANKNIFTY', 'FINNIFTY']);
    signalWorker.start(['NIFTY', 'BANKNIFTY', 'FINNIFTY']);
  } catch (workerErr: any) {
    logger.warn('[Workers] Failed to start background workers (non-fatal):', { error: workerErr?.message });
  }
}

// Graceful shutdown
process.on('SIGTERM', () => { stopNewsEngine(); marketWorker.stop(); flowDataWorker.stop(); signalWorker.stop(); process.exit(0); });
process.on('SIGINT', () => { stopNewsEngine(); marketWorker.stop(); flowDataWorker.stop(); signalWorker.stop(); process.exit(0); });

// Start Server in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🚀 RiskRule API Server running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  });
}

export default app;
