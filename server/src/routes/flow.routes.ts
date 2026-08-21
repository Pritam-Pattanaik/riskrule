/**
 * Flow Intelligence API Routes
 *
 * Production-ready endpoints for the Flow module.
 * All data comes from the SignalWorker intelligence pipeline — never hardcoded.
 *
 * Endpoints:
 *   GET  /api/v1/flow/intelligence/:symbol  — Primary intelligence endpoint (cached 30s)
 *   GET  /api/v1/flow/narrative/:symbol     — AI narrative endpoint (cached 5min)
 *   GET  /api/v1/flow/chain/:symbol         — Full option chain (Expert Mode only)
 *   GET  /api/v1/flow/stream                — SSE stream (intelligence updates)
 *   POST /api/v1/flow/alerts                — Create user alert
 *   GET  /api/v1/flow/alerts                — List user alerts
 *   DELETE /api/v1/flow/alerts/:id          — Delete user alert
 *
 * Security:
 *   - All endpoints require valid JWT authentication
 *   - Rate limiting applied to intelligence and narrative endpoints
 *   - Input validation on symbol parameter
 *   - SSE uses token query param (EventSource can't send headers)
 */

import { Router, Request, Response } from 'express';
import { authenticate, JWT_SECRET } from '../middleware/auth';
import { rateLimit } from 'express-rate-limit';
import { signalWorker, registerSSEClient, unregisterSSEClient } from '../flow/workers/SignalWorker';
import { flowDataWorker } from '../flow/workers/FlowDataWorker';
import { NarrativeEngine } from '../flow/services/NarrativeEngine';
import { ChainService } from '../flow/services/ChainService';
import { AlertEngine } from '../flow/services/AlertEngine';
import { isIndianMarketOpen } from '../lib/marketHours';
import { prisma } from '../db';
import { logger } from '../lib/logger';
import jwt from 'jsonwebtoken';

const router = Router();

// ── Allowed symbols ───────────────────────────────────────────────────────────
const ALLOWED_SYMBOLS = new Set(['NIFTY', 'BANKNIFTY', 'FINNIFTY']);

function validateSymbol(symbol: string): boolean {
  return ALLOWED_SYMBOLS.has(symbol.toUpperCase());
}

// ── Rate limiters ─────────────────────────────────────────────────────────────
const intelligenceLimiter = rateLimit({
  windowMs: 60_000,
  max:      60,     // 60 requests per minute (1/sec)
  message:  { error: 'Too many requests to intelligence endpoint' },
});

const narrativeLimiter = rateLimit({
  windowMs: 60_000,
  max:      10,     // 10 narrative requests per minute
  message:  { error: 'Too many requests to narrative endpoint' },
});

// ── GET /status ───────────────────────────────────────────────────────────────
router.get('/status', authenticate, (_req: Request, res: Response) => {
  const isMarketOpen = isIndianMarketOpen();
  const provider = flowDataWorker.getProviderStatus();
  return res.json({
    success: true,
    data: {
      isMarketOpen,
      brokerStatus: provider.status,
      brokerError: provider.lastError,
    },
  });
});

// ── GET /intelligence/:symbol ─────────────────────────────────────────────────

router.get(
  '/intelligence/:symbol',
  authenticate,
  intelligenceLimiter,
  async (req: Request, res: Response) => {
    const symbol = (req.params.symbol as string)?.toUpperCase() ?? '';

    if (!validateSymbol(symbol)) {
      return res.status(400).json({ error: `Unsupported symbol: ${symbol}. Supported: NIFTY, BANKNIFTY, FINNIFTY` });
    }

    try {
      let provider = flowDataWorker.getProviderStatus();
      if (provider.status !== 'connected') {
        try {
          await flowDataWorker.reloadProvider();
          provider = flowDataWorker.getProviderStatus();
        } catch (_reloadErr) {
          // ignore reload error
        }
      }

      const isMarketOpen = isIndianMarketOpen();
      let intelligence: any = null;
      try {
        intelligence = await signalWorker.getIntelligence(symbol);
      } catch (workerErr) {
        logger.warn(`[FlowRoutes] signalWorker error for ${symbol}:`, workerErr);
      }

      if (!intelligence) {
        if (provider.status === 'expired') {
          return res.status(401).json({
            error: 'Dhan SuperAPI session token has expired. Please re-authenticate your broker in Settings.',
            code: 'BROKER_EXPIRED',
            brokerStatus: 'expired',
          });
        }
        if (provider.status === 'missing') {
          return res.status(400).json({
            error: 'No Dhan broker connection found. Please connect Dhan in Settings to stream live options flow.',
            code: 'BROKER_DISCONNECTED',
            brokerStatus: 'missing',
          });
        }
        if (!isMarketOpen) {
          return res.status(200).json({
            success: true,
            isMarketClosed: true,
            message: 'Indian market is closed. Live data will resume when market opens (Mon–Fri 09:15 IST).',
            data: null,
          });
        }
        return res.status(503).json({
          error: 'Intelligence data is initializing. Please retry in a moment.',
          code: 'INITIALIZING',
        });
      }

      return res.json({
        success: true,
        data: {
          ...intelligence,
          isMarketClosed: !isMarketOpen,
          brokerStatus: provider.status,
        },
      });

    } catch (error: any) {
      logger.error(`[FlowRoutes] Intelligence error for ${symbol}:`, error);
      return res.status(500).json({ error: error.message || 'Failed to compute intelligence' });
    }
  }
);

// ── GET /narrative/:symbol ────────────────────────────────────────────────────

router.get(
  '/narrative/:symbol',
  authenticate,
  narrativeLimiter,
  async (req: Request, res: Response) => {
    const symbol = (req.params.symbol as string)?.toUpperCase() ?? '';

    if (!validateSymbol(symbol)) {
      return res.status(400).json({ error: `Unsupported symbol: ${symbol}` });
    }

    try {
      const intelligence = await signalWorker.getIntelligence(symbol);

      if (!intelligence) {
        return res.status(503).json({
          error: 'Narrative not available — intelligence data not ready',
          code: 'INITIALIZING',
        });
      }

      const narrative = await NarrativeEngine.generateNarrative(intelligence);

      if (!narrative) {
        return res.status(503).json({
          error: 'Narrative generation failed',
          code: 'NARRATIVE_FAILED',
        });
      }

      return res.json({ success: true, data: narrative });

    } catch (error: any) {
      logger.error(`[FlowRoutes] Narrative error for ${symbol}:`, error);
      return res.status(500).json({ error: 'Failed to generate narrative', detail: error.message });
    }
  }
);

// ── GET /chain/:symbol — Full chain for Expert Mode ───────────────────────────

router.get(
  '/chain/:symbol',
  authenticate,
  async (req: Request, res: Response) => {
    const symbol = (req.params.symbol as string)?.toUpperCase() ?? '';

    if (!validateSymbol(symbol)) {
      return res.status(400).json({ error: `Unsupported symbol: ${symbol}` });
    }

    try {
      const expiry = ChainService.getActiveExpiry(symbol);
      const chain  = await ChainService.getChain(symbol, expiry);

      if (chain.length === 0) {
        return res.json({
          success: true,
          data: { chain: [], expiry, symbol },
          message: 'Chain data is initializing',
        });
      }

      // Transform flat array of OptionTick to grouped array for ExpertChain UI
      const strikeMap = new Map<number, any>();
      for (const tick of chain) {
        const s = tick.strikePrice;
        if (!strikeMap.has(s)) {
          strikeMap.set(s, { strike: s });
        }
        const row = strikeMap.get(s);
        if (tick.optionType === 'CE') {
          row.callOI = tick.openInterest;
          row.callVol = tick.volume ?? 0;
          row.callLTP = tick.ltp;
        } else {
          row.putOI = tick.openInterest;
          row.putVol = tick.volume ?? 0;
          row.putLTP = tick.ltp;
        }
      }
      
      const groupedChain = Array.from(strikeMap.values()).sort((a, b) => a.strike - b.strike);

      return res.json({ success: true, data: { chain: groupedChain, expiry, symbol } });

    } catch (error: any) {
      logger.error(`[FlowRoutes] Chain error for ${symbol}:`, error);
      return res.status(500).json({ error: 'Failed to fetch chain', detail: error.message });
    }
  }
);

// ── GET /stream — SSE Stream ──────────────────────────────────────────────────
// Streams FlowIntelligence updates when signals change (not on every tick).
// Authentication via token query param (EventSource limitation).

router.get('/stream', authenticate, async (req: Request, res: Response) => {
  const symbols = ((req.query.symbols as string) ?? 'NIFTY').toUpperCase().split(',');

  // Validate symbols
  const validSymbols = symbols.filter(s => validateSymbol(s));
  if (validSymbols.length === 0) {
    return res.status(400).json({ error: 'No valid symbols provided' });
  }

  // Set SSE headers
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.flushHeaders();

  // Register this client for each symbol
  for (const symbol of validSymbols) {
    registerSSEClient(symbol, res);
  }

  // Send initial intelligence snapshot immediately
  for (const symbol of validSymbols) {
    try {
      const intelligence = await signalWorker.getIntelligence(symbol);
      if (intelligence) {
        res.write(`data: ${JSON.stringify({ type: 'intelligence', payload: intelligence })}\n\n`);
      }
    } catch (_e) { /* non-fatal — client will receive update in 30s */ }
  }

  // Keep-alive ping every 15 seconds
  const keepAlive = setInterval(() => {
    try {
      res.write(': keep-alive\n\n');
    } catch (_e) {
      clearInterval(keepAlive);
    }
  }, 15_000);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(keepAlive);
    for (const symbol of validSymbols) {
      unregisterSSEClient(symbol, res);
    }
    logger.debug(`[FlowRoutes] SSE client disconnected for ${validSymbols.join(',')}`);
  });
});

// ── POST /alerts — Create Alert ───────────────────────────────────────────────

router.post('/alerts', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { symbol, strike, optionType, alertType, direction, threshold, cooldownSeconds } = req.body;

  // Validation
  if (!symbol || !alertType || threshold === undefined) {
    return res.status(400).json({ error: 'symbol, alertType, and threshold are required' });
  }
  if (!validateSymbol(symbol)) {
    return res.status(400).json({ error: `Invalid symbol: ${symbol}` });
  }
  if (!['OI_CHANGE', 'PRICE_BREAKOUT', 'IV_SPIKE', 'PCR_THRESHOLD', 'VIX_SPIKE'].includes(alertType)) {
    return res.status(400).json({ error: 'Invalid alertType' });
  }
  if (direction && !['ABOVE', 'BELOW'].includes(direction)) {
    return res.status(400).json({ error: 'direction must be ABOVE or BELOW' });
  }
  if (typeof threshold !== 'number' || isNaN(threshold)) {
    return res.status(400).json({ error: 'threshold must be a number' });
  }

  try {
    const alert = await prisma.optionAlert.create({
      data: {
        user:            { connect: { id: userId } },
        symbol:          symbol.toUpperCase(),
        strike:          strike ?? 0,
        optionType:      optionType ?? null,
        alertType,
        direction:       direction ?? 'ABOVE',
        threshold,
        thresholdUnit:   'ABS',
        cooldownSeconds: cooldownSeconds ?? 300,
        isActive:        true,
      },
    });
    AlertEngine.invalidate();
    return res.status(201).json({ success: true, data: alert });
  } catch (error: any) {
    logger.error('[FlowRoutes] Create alert failed:', error);
    return res.status(500).json({ error: 'Failed to create alert' });
  }
});

// ── GET /alerts — List Alerts ─────────────────────────────────────────────────

router.get('/alerts', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const alerts = await prisma.optionAlert.findMany({
      where:   { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: alerts });
  } catch (error: any) {
    logger.error('[FlowRoutes] List alerts failed:', error);
    return res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// ── DELETE /alerts/:id ────────────────────────────────────────────────────────

router.delete('/alerts/:id', authenticate, async (req: Request, res: Response) => {
  const userId  = (req as any).userId;
  const alertId = req.params.id as string;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!alertId) return res.status(400).json({ error: 'Alert ID required' });

  try {
    const alert = await prisma.optionAlert.findFirst({ where: { id: alertId, userId } });
    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    await prisma.optionAlert.update({
      where: { id: alertId },
      data:  { isActive: false },
    });
    AlertEngine.invalidate();
    return res.json({ success: true, message: 'Alert deactivated' });
  } catch (error: any) {
    logger.error('[FlowRoutes] Delete alert failed:', error);
    return res.status(500).json({ error: 'Failed to delete alert' });
  }
});

export default router;
