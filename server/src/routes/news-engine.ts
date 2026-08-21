/**
 * News Engine API Routes
 *
 * Exposes monitoring, admin controls, and the processed news feed.
 * Connected to the Supabase pipelineDb.
 *
 * Public (authenticated user):
 *   GET  /api/news-engine/feed              — processed news feed with sector filter
 *   GET  /api/news-engine/digest/today      — today's pre-market digest
 *   GET  /api/news-engine/sectors           — available sector buckets
 *
 * Health (any authenticated user):
 *   GET  /api/news-engine/health            — pipeline health status
 *
 * Admin (ADMIN or SUPER_ADMIN role only):
 *   GET  /api/news-engine/admin/stats       — detailed metrics
 *   GET  /api/news-engine/admin/failed      — dead-letter queue items
 *   POST /api/news-engine/admin/replay/:id  — replay a failed item
 *   POST /api/news-engine/admin/pause       — pause the pipeline
 *   POST /api/news-engine/admin/resume      — resume the pipeline
 *   GET  /api/news-engine/admin/review-queue — items awaiting human review
 *   PATCH /api/news-engine/admin/review/:id  — approve or reject an item
 *
 * COMPLIANCE: All feed responses include the SEBI educational disclaimer.
 */

import { Router, Request, Response } from 'express';
import { pipelineDb } from '../db/pipeline';
import { authenticate, requireRoles } from '../middleware/auth';
import { EDUCATIONAL_DISCLAIMER, SECTOR_KEYWORDS } from '../news-engine/config';
import { isEngineRunning, startNewsEngine, stopNewsEngine } from '../news-engine';
import { getTriageCircuitState } from '../news-engine/processing/TriageWorker';
import { getScoringStats } from '../news-engine/processing/ScoringWorker';
import { getSourceStats } from '../news-engine/ingestion/SourceRegistry';
import { queue, QUEUES } from '../news-engine/queue/InProcessQueue';
import { logger } from '../lib/logger';
import { cache } from '../lib/redis';
import { z } from 'zod';

const router = Router();

// ─── Health Endpoint ─────────────────────────────────────────────────────────

router.get('/health', authenticate, async (_req: Request, res: Response) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const [itemsLast1h, scoredLast1h, failedLast1h, triagePass] = await Promise.all([
      pipelineDb.newsRawItem.count({ where: { createdAt: { gte: oneHourAgo } } }),
      pipelineDb.newsRawItem.count({ where: { createdAt: { gte: oneHourAgo }, status: 'SCORED' } }),
      pipelineDb.newsRawItem.count({ where: { createdAt: { gte: oneHourAgo }, status: 'FAILED' } }),
      pipelineDb.newsTriage.count({ where: { createdAt: { gte: oneHourAgo }, relevant: true } }),
    ]);

    const triageTotal = await pipelineDb.newsTriage.count({ where: { createdAt: { gte: oneHourAgo } } });
    const triagePassRate = triageTotal > 0 ? (triagePass / triageTotal) : 0;

    const triageState = getTriageCircuitState();
    const scoringState = getScoringStats();

    const status = !isEngineRunning() ? 'down'
      : triageState.state === 'OPEN' ? 'degraded'
      : 'healthy';

    res.json({
      status,
      timestamp: new Date().toISOString(),
      circuitBreaker: triageState.state,
      metrics: {
        itemsIngestedLast1h: itemsLast1h,
        itemsScoredLast1h: scoredLast1h,
        itemsFailedLast1h: failedLast1h,
        triagePassRate: Math.round(triagePassRate * 100),
      },
      sources: getSourceStats(),
      estimatedDailyCostUsd: triageState.estimatedDailyCostUsd + scoringState.dailyCostUsd,
    });
  } catch (err: any) {
    logger.error(`[NewsEngine:Health] Failed: ${err.message}`);
    res.status(500).json({ error: 'Failed to compute health status' });
  }
});

// ─── Feed Endpoint ────────────────────────────────────────────────────────────

const feedQuerySchema = z.object({
  sector: z.string().optional(),
  direction: z.enum(['positive', 'negative', 'neutral', 'mixed']).optional(),
  urgency: z.enum(['breaking', 'routine']).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get('/feed', authenticate, async (req: Request, res: Response) => {
  const parsed = feedQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { sector, direction, urgency, limit, offset } = parsed.data;

  // Cache key based on query params
  const cacheKey = `news_engine:feed:${sector || 'all'}:${direction || 'all'}:${urgency || 'all'}:${limit}:${offset}`;

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  } catch { /* ignore cache read error */ }

  try {
    const where: any = {
      // Compliance: only serve approved items (or null if human review disabled)
      OR: [{ humanApproved: true }, { humanApproved: null }],
    };

    if (direction) where.direction = direction;
    if (sector) where.sectorImpact = { has: sector };

    const impacts = await pipelineDb.newsImpact.findMany({
      where,
      include: {
        rawItem: {
          include: {
            triage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    let feed = impacts
      .filter(impact => {
        if (urgency && impact.rawItem.triage?.urgency !== urgency) return false;
        return true;
      })
      .map(impact => ({
        id: impact.id,
        headline: impact.rawItem.headline,
        url: impact.rawItem.url,
        source: impact.rawItem.source,
        publishedAt: impact.rawItem.publishedAt,
        sectors: impact.sectorImpact,
        direction: impact.direction,
        confidence: impact.confidence,
        rationale: impact.rationale,
        historicalAnalogues: impact.historicalAnalogues,
        category: impact.rawItem.triage?.category || 'other',
        urgency: impact.rawItem.triage?.urgency || 'routine',
        mode: 'EDUCATIONAL_MODE',
        disclaimer: EDUCATIONAL_DISCLAIMER,
        scoredAt: impact.createdAt,
      }));

    // If no scored impacts exist yet (e.g. cold boot), fallback to latest news raw items
    if (feed.length === 0 && offset === 0) {
      const rawItems = await pipelineDb.newsRawItem.findMany({
        orderBy: { publishedAt: 'desc' },
        take: limit,
        include: { triage: true },
      });

      if (rawItems.length > 0) {
        feed = rawItems.map(item => ({
          id: item.id,
          headline: item.headline,
          url: item.url,
          source: item.source,
          publishedAt: item.publishedAt,
          sectors: (item.rawPayload as any)?.sectors?.length ? (item.rawPayload as any).sectors : ['General'],
          direction: 'neutral',
          confidence: 'medium',
          rationale: item.body || item.headline,
          historicalAnalogues: [] as any,
          category: item.triage?.category || 'macro',
          urgency: (item.triage?.urgency as 'breaking' | 'routine') || 'routine',
          mode: 'EDUCATIONAL_MODE',
          disclaimer: EDUCATIONAL_DISCLAIMER,
          scoredAt: item.createdAt,
        }));
      }
    }

    const responsePayload = { feed, total: feed.length, disclaimer: EDUCATIONAL_DISCLAIMER };
    
    try {
      await cache.set(cacheKey, JSON.stringify(responsePayload), 60); // 60s TTL
    } catch { /* ignore cache write error */ }

    res.json(responsePayload);
  } catch (err: any) {
    logger.error(`[NewsEngine:feed] ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch news feed' });
  }
});

// ─── Today's Digest ───────────────────────────────────────────────────────────

router.get('/digest/today', authenticate, async (_req: Request, res: Response) => {
  try {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const digest = await pipelineDb.newsDigest.findFirst({
      where: {
        date: { gte: todayDate },
        type: 'PRE_MARKET',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!digest) {
      return res.json({
        available: false,
        message: 'Pre-market digest not yet generated for today. Check back at 7:30 AM IST.',
        disclaimer: EDUCATIONAL_DISCLAIMER,
      });
    }

    res.json({
      available: true,
      digest: digest.content,
      generatedAt: digest.createdAt,
      disclaimer: EDUCATIONAL_DISCLAIMER,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch digest' });
  }
});

// ─── Sectors List ─────────────────────────────────────────────────────────────

router.get('/sectors', authenticate, (_req: Request, res: Response) => {
  res.json({
    sectors: Object.keys(SECTOR_KEYWORDS),
    disclaimer: EDUCATIONAL_DISCLAIMER,
  });
});

// ─── Admin: Stats ─────────────────────────────────────────────────────────────

router.get('/admin/stats', authenticate, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (_req, res) => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [ingested, deduplicated, triaged, scored, delivered, failed, complianceBlocks] =
      await Promise.all([
        pipelineDb.newsRawItem.count({ where: { createdAt: { gte: yesterday } } }),
        pipelineDb.newsRawItem.count({ where: { createdAt: { gte: yesterday } } }),
        pipelineDb.newsTriage.count({ where: { createdAt: { gte: yesterday }, relevant: true } }),
        pipelineDb.newsImpact.count({ where: { createdAt: { gte: yesterday } } }),
        pipelineDb.newsRawItem.count({ where: { status: 'DELIVERED', createdAt: { gte: yesterday } } }),
        pipelineDb.newsRawItem.count({ where: { status: 'FAILED', createdAt: { gte: yesterday } } }),
        pipelineDb.newsAuditLog.count({ where: { compliancePassed: false, timestamp: { gte: yesterday } } }),
      ]);

    const triageTotal = await pipelineDb.newsTriage.count({ where: { createdAt: { gte: yesterday } } });
    const triageState = getTriageCircuitState();
    const scoringState = getScoringStats();

    res.json({
      last24h: {
        itemsIngested: ingested,
        triagePassRate: triageTotal > 0 ? `${((triaged / triageTotal) * 100).toFixed(1)}%` : 'N/A',
        itemsScored: scored,
        itemsDelivered: delivered,
        itemsFailed: failed,
        complianceBlocks,
      },
      pipeline: {
        status: isEngineRunning() ? 'running' : 'stopped',
        triageCircuit: triageState.state,
        scoringCircuit: scoringState.circuitState,
        estimatedTodayCostUsd: (
          triageState.estimatedDailyCostUsd + scoringState.dailyCostUsd
        ).toFixed(4),
      },
      sources: getSourceStats(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: Failed Items ──────────────────────────────────────────────────────

router.get('/admin/failed', authenticate, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (_req, res) => {
  const items = await pipelineDb.newsRawItem.findMany({
    where: { status: 'FAILED' },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, source: true, headline: true, failureReason: true, createdAt: true },
  });
  res.json({ items, total: items.length });
});

// ─── Admin: Replay Item ───────────────────────────────────────────────────────

router.post('/admin/replay/:id', authenticate, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid UUID' });

  const item = await pipelineDb.newsRawItem.findUnique({ where: { id: parsed.data } });
  if (!item) return res.status(404).json({ error: 'Item not found' });

  await pipelineDb.newsRawItem.update({
    where: { id: parsed.data },
    data: { status: 'PENDING', failureReason: null },
  });

  queue.push(QUEUES.TRIAGE, item.id, {
    rawItemId: item.id,
    headline: item.headline,
    body: item.body || '',
    source: item.source,
    sectors: (item.rawPayload as any).sectors || [],
    publishedAt: item.publishedAt.toISOString(),
  });

  logger.info(`[Admin] Replayed item ${item.id} (replayed by admin)`);
  res.json({ success: true, message: `Item ${item.id} re-queued for triage` });
});

// ─── Admin: Pause/Resume ──────────────────────────────────────────────────────

router.post('/admin/pause', authenticate, requireRoles(['ADMIN', 'SUPER_ADMIN']), (_req, res) => {
  stopNewsEngine();
  logger.warn('[Admin] News engine PAUSED by admin');
  res.json({ success: true, message: 'News engine paused' });
});

router.post('/admin/resume', authenticate, requireRoles(['ADMIN', 'SUPER_ADMIN']), (_req, res) => {
  startNewsEngine();
  logger.info('[Admin] News engine RESUMED by admin');
  res.json({ success: true, message: 'News engine resumed' });
});

// ─── Admin: Review Queue ──────────────────────────────────────────────────────

router.get('/admin/review-queue', authenticate, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (_req, res) => {
  const items = await pipelineDb.newsImpact.findMany({
    where: { humanReviewRequired: true, humanApproved: null },
    include: { rawItem: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json({ items, total: items.length });
});

router.patch('/admin/review/:id', authenticate, requireRoles(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  const schema = z.object({ approved: z.boolean(), notes: z.string().optional() });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error.flatten() });

  const idSchema = z.string().uuid();
  if (!idSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'Invalid UUID' });

  await pipelineDb.newsImpact.update({
    where: { id: req.params.id as string },
    data: { humanApproved: body.data.approved, humanNotes: body.data.notes || null },
  });

  res.json({ success: true });
});

// ─── Watchlist Management ─────────────────────────────────────────────────────

router.get('/watchlist', authenticate, async (req: any, res: Response) => {
  const items = await pipelineDb.userWatchlist.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ watchlist: items, availableSectors: Object.keys(SECTOR_KEYWORDS) });
});

router.post('/watchlist', authenticate, async (req: any, res: Response) => {
  const schema = z.object({
    type: z.enum(['sector', 'ticker']),
    value: z.string().min(1).max(100),
  });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error.flatten() });

  try {
    const item = await pipelineDb.userWatchlist.create({
      data: { userId: req.userId, type: body.data.type, value: body.data.value },
    });
    res.json({ success: true, item });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Already in watchlist' });
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

router.delete('/watchlist/:id', authenticate, async (req: any, res: Response) => {
  const idSchema = z.string().uuid();
  if (!idSchema.safeParse(req.params.id).success) return res.status(400).json({ error: 'Invalid UUID' });

  await pipelineDb.userWatchlist.deleteMany({
    where: { id: req.params.id, userId: req.userId },
  });
  res.json({ success: true });
});

export default router;
