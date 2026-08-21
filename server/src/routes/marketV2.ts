/**
 * Market V2 Router — Unified Market Data API
 *
 * All routes flow through MarketDataService which handles:
 * - Provider waterfall (Yahoo → MoneyControl)
 * - Redis caching
 * - Request deduplication
 * - Response normalization
 *
 * The old market.ts routes are preserved for backward compatibility
 * but now delegate to this service layer.
 *
 * Endpoints:
 *   GET  /api/market/quotes           — Live market quotes (all tracked symbols)
 *   GET  /api/market/stream           — SSE live quote stream
 *   GET  /api/market/chart/:symbol    — Historical OHLCV chart data
 *   GET  /api/market/sectors          — Live sector performance
 *   GET  /api/market/news             — Market news from Yahoo Finance RSS
 *   GET  /api/market/ai-summary       — AI-generated market summary (SSE stream)
 *   GET  /api/market/calendar         — Economic calendar events
 *   GET  /api/market/health           — Provider health status
 */

import { Router, Response, Request, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { marketWorker } from '../services/MarketWorker';
import { marketDataService } from '../market/MarketDataService';
import { yahooNewsService } from '../market/YahooNewsService';
import { marketAIService } from '../market/MarketAIService';
import { economicCalendarService } from '../market/EconomicCalendarService';
import { logger } from '../lib/logger';
import { redis, cache } from '../lib/redis';
import { pipelineDb } from '../db/pipeline';

const router = Router();

// ─── Per-User Market Rate Limiter (M3 fix) ────────────────────────────────────
// Prevents a single user from hammering Yahoo Finance through our API.
// Chart endpoint is tightest (each miss hits Yahoo). Quotes/sectors served from
// cache so get more generous limits.

function marketRateLimit(maxPerMinute: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as AuthRequest).userId || req.ip || 'anon';
    const key = `ratelimit:market:${userId}:${maxPerMinute}`;

    try {
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, 60);
      if (count > maxPerMinute) {
        res.status(429).json({ error: 'Too many market data requests. Please wait a moment.' });
        return;
      }
    } catch {
      // Redis unavailable — fail open (don't block users)
    }
    next();
  };
}

const chartRateLimit = marketRateLimit(30);   // 30 chart requests/min per user
const quoteRateLimit = marketRateLimit(60);   // 60 quote requests/min per user
const sectorRateLimit = marketRateLimit(30);  // 30 sector requests/min per user
const newsRateLimit = marketRateLimit(30);    // 30 news requests/min per user

// ─── Quotes ───────────────────────────────────────────────────────────────────

router.get('/quotes', authenticate, quoteRateLimit, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // MarketWorker cache is always fresh (refreshed on 90s cycle)
    const workerCache = marketWorker.getCache();
    if (workerCache && workerCache.length > 0) {
      res.json(workerCache);
      return;
    }
    // Fallback to MarketDataService (provider waterfall + Redis cache)
    const quotes = await marketDataService.getQuotes();
    res.json(quotes);
  } catch (err: any) {
    logger.error(`[Market Routes] GET /quotes error: ${err.message}`);
    res.status(500).json({ error: 'Market data temporarily unavailable' });
  }
});

// ─── SSE Stream ───────────────────────────────────────────────────────────────

router.get('/stream', authenticate, (req: AuthRequest, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',   // Disable Nginx buffering for SSE
  });

  // Send initial data immediately (no blank screen)
  const initialCache = marketWorker.getCache();
  if (initialCache && initialCache.length > 0) {
    res.write(`data: ${JSON.stringify(initialCache)}\n\n`);
  }

  const updateListener = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  marketWorker.on('update', updateListener);

  // Heartbeat every 30s to keep connection alive through proxies
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30_000);

  req.on('close', () => {
    marketWorker.removeListener('update', updateListener);
    clearInterval(heartbeat);
  });
});

// ─── Chart ────────────────────────────────────────────────────────────────────

router.get('/chart/:symbol', authenticate, chartRateLimit, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const symbol = decodeURIComponent(String(req.params.symbol));
    const timeframe = String(req.query.timeframe || '1D');

    const candles = await marketDataService.getChart(symbol, timeframe);

    if (!candles.length) {
      res.status(503).json({ error: 'Chart data temporarily unavailable' });
      return;
    }

    res.json(candles);
  } catch (err: any) {
    logger.error(`[Market Routes] GET /chart error: ${err.message}`);
    res.status(500).json({ error: 'Chart data error' });
  }
});

// ─── Sectors ──────────────────────────────────────────────────────────────────

router.get('/sectors', authenticate, sectorRateLimit, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sectors = await marketDataService.getSectors();
    res.json(sectors);
  } catch (err: any) {
    logger.error(`[Market Routes] GET /sectors error: ${err.message}`);
    res.status(500).json({ error: 'Sector data unavailable' });
  }
});

// ─── News ─────────────────────────────────────────────────────────────────────

router.get('/news', authenticate, newsRateLimit, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(String(req.query.limit || '25'), 10);
    const symbol = req.query.symbol ? String(req.query.symbol) : undefined;
    const cacheKey = `market:news:api:${symbol || 'all'}:${limit}`;

    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        res.json(JSON.parse(cached));
        return;
      }
    } catch { /* ignore cache read error */ }

    // Fetch processed news from the News Engine
    // We only want items that have passed triage (relevant=true).
    const rawItems = await pipelineDb.newsRawItem.findMany({
      where: {
        status: { in: ['TRIAGED', 'SCORED', 'DELIVERED'] },
        triage: { relevant: true },
        ...(symbol ? {
          OR: [
            { headline: { contains: symbol, mode: 'insensitive' } },
            { body: { contains: symbol, mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        triage: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    // If no triaged news found in DB, fallback to live market news feeds
    if (rawItems.length === 0) {
      const liveArticles = await yahooNewsService.getMarketNews(limit);
      if (liveArticles.length > 0) {
        const responsePayload = { articles: liveArticles, count: liveArticles.length, source: 'live-market-feed' };
        try {
          await cache.setex(cacheKey, 60, JSON.stringify(responsePayload));
        } catch { /* ignore */ }
        res.json(responsePayload);
        return;
      }
    }

    const articles = rawItems.map((item: any) => ({
      id: item.id,
      headline: item.headline,
      summary: item.body || '',
      url: item.url || '',
      source: item.source,
      publishedAt: Math.floor(new Date(item.publishedAt).getTime() / 1000), // convert to epoch seconds
      category: item.triage?.category || 'market',
    }));

    const responsePayload = { articles, count: articles.length, source: 'ai-news-engine' };

    try {
      await cache.setex(cacheKey, 60, JSON.stringify(responsePayload));
    } catch { /* ignore cache write error */ }

    res.json(responsePayload);
  } catch (err: any) {
    logger.error(`[Market Routes] GET /news error: ${err.message}`);
    res.status(500).json({ error: 'News data unavailable' });
  }
});

// ─── AI Summary (Passive / Read-Only) ─────────────────────────────────────────

router.get('/ai-summary', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  const AI_CACHE_KEY = 'market:ai-summary:v2';

  try {
    // 1. Try Redis cache (populated by background worker)
    try {
      const cached = await cache.get(AI_CACHE_KEY);
      if (cached) {
        res.json(JSON.parse(cached));
        return;
      }
    } catch { /* ignore */ }

    // 2. Fallback to stale memory cache
    const stale = marketAIService.getStaleSummary();
    if (stale) {
      logger.warn('[Market Routes] AI summary missing from Redis, serving stale fallback');
      res.json(stale);
      return;
    }

    // 3. Fallback to on-demand generation
    const generated = await marketAIService.generateSummaryJSON();
    if (generated) {
      res.json(generated);
      return;
    }

    res.status(503).json({ error: 'AI summary temporarily unavailable' });
  } catch (err: any) {
    logger.error(`[Market Routes] GET /ai-summary error: ${err.message}`);
    res.status(500).json({ error: 'AI service error' });
  }
});

// ─── AI Summary Stream (SSE) ──────────────────────────────────────────────────

router.get('/ai-summary/stream', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  try {
    await marketAIService.streamSummary(res);
  } catch (err: any) {
    logger.error(`[Market Routes] AI stream error: ${err.message}`);
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Stream failed' })}\n\n`);
    res.end();
  }
});

// ─── Economic Calendar ────────────────────────────────────────────────────────

router.get('/calendar', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(String(req.query.limit || '30'), 10);
    const events = await economicCalendarService.getEvents(limit);
    res.json({ events, count: events.length });
  } catch (err: any) {
    logger.error(`[Market Routes] GET /calendar error: ${err.message}`);
    res.status(500).json({ error: 'Calendar data unavailable' });
  }
});

// ─── Provider Health ──────────────────────────────────────────────────────────

router.get('/health', authenticate, (_req: AuthRequest, res: Response) => {
  const health = marketDataService.getHealthStatus();
  res.json(health);
});

export default router;
