import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { redis, cache } from '../lib/redis';
import { logger } from '../lib/logger';

// ─── Rate Limiter Configuration ─────────────────────────────────────────────
const WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 10;
const DAILY_LIMIT = 300;

/**
 * User-scoped rate limiter for AI Coach endpoints.
 * Enforces:
 * 1. Rolling window: 10 requests / 60 seconds per userId.
 * 2. Daily cap: 300 requests / 24 hours per userId.
 */
export async function aiRateLimiter(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const minuteKey = `ai:rate-limit:chat:${userId}`;
  const dailyKey = `ai:rate-limit:daily:${userId}`;

  try {
    // 1. Check daily budget first
    const dailyCountStr = await cache.get(dailyKey);
    const dailyCount = dailyCountStr ? parseInt(dailyCountStr, 10) : 0;

    if (dailyCount >= DAILY_LIMIT) {
      logger.warn(`[AIRateLimit] Daily cap reached for user ${userId}`);
      res.status(429).json({
        error: 'Daily AI Coach message limit reached (300/day). Your quota will reset at midnight UTC.',
        retryAfterSeconds: 86400,
        dailyRemaining: 0,
      });
      return;
    }

    // 2. Check rolling 60-second window
    const minuteCountStr = await cache.get(minuteKey);
    const minuteCount = minuteCountStr ? parseInt(minuteCountStr, 10) : 0;

    if (minuteCount >= MAX_REQUESTS_PER_WINDOW) {
      logger.warn(`[AIRateLimit] Rate limit exceeded for user ${userId} (${minuteCount} req/min)`);
      res.status(429).json({
        error: 'Too many messages sent. Please wait a moment before sending another message.',
        retryAfterSeconds: 15,
        dailyRemaining: Math.max(0, DAILY_LIMIT - dailyCount),
      });
      return;
    }

    // 3. Increment counters
    await cache.setex(minuteKey, WINDOW_SECONDS, (minuteCount + 1).toString());
    
    // Daily counter expires in 24 hours
    if (dailyCount === 0) {
      await cache.setex(dailyKey, 86400, '1');
    } else {
      await cache.set(dailyKey, (dailyCount + 1).toString());
    }

    // Attach remaining quota headers
    res.setHeader('X-RateLimit-Limit-Minute', MAX_REQUESTS_PER_WINDOW.toString());
    res.setHeader('X-RateLimit-Remaining-Minute', Math.max(0, MAX_REQUESTS_PER_WINDOW - (minuteCount + 1)).toString());
    res.setHeader('X-RateLimit-Daily-Remaining', Math.max(0, DAILY_LIMIT - (dailyCount + 1)).toString());

    next();
  } catch (err: any) {
    logger.error(`[AIRateLimit] Error evaluating rate limits: ${err?.message}`);
    // Fail open on unexpected error so service remains available
    next();
  }
}
