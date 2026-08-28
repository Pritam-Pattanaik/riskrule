import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { cache } from '../lib/redis';
import { logger } from '../lib/logger';

// ─── Configuration ────────────────────────────────────────────────────────────
// Configurable via TTS_RATE_CAP_HOURLY env var (default: 20 TTS calls/hour/user)
// Past the cap the request still proceeds — ttsOrchestrator silently omits audio.

const TTS_RATE_CAP_HOURLY = parseInt(process.env.TTS_RATE_CAP_HOURLY || '20', 10);
const TTS_RATE_WINDOW_SEC = 3600; // 1 hour

/**
 * TTS rate limit middleware.
 *
 * Checks the hourly per-user TTS cap and attaches `req.ttsCapped: boolean`.
 * NEVER returns a 429 — audio failure is silent to the user.
 * The route handler reads req.ttsCapped and omits audio silently if true.
 *
 * This mirrors the pattern in aiRateLimiter.ts but for TTS-specific tracking.
 */
export async function ttsRateLimiter(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    // Let the authenticate middleware handle auth failures — not our concern here
    (req as any).ttsCapped = false;
    return next();
  }

  const key = `tts:rate:${userId}`;

  try {
    const countStr = await cache.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;

    if (count >= TTS_RATE_CAP_HOURLY) {
      logger.warn(`[TTS RateLimit] Hourly cap (${TTS_RATE_CAP_HOURLY}) reached for user ${userId}`);
      (req as any).ttsCapped = true;
      return next(); // Proceed — route handles silent fallback
    }

    // Increment counter with 1-hour rolling window
    if (count === 0) {
      await cache.setex(key, TTS_RATE_WINDOW_SEC, '1');
    } else {
      await cache.setex(key, TTS_RATE_WINDOW_SEC, (count + 1).toString());
    }

    (req as any).ttsCapped = false;
    next();
  } catch (err: any) {
    // Fail open — if Redis is down, don't block TTS
    logger.warn(`[TTS RateLimit] Rate check failed (fail-open): ${err?.message}`);
    (req as any).ttsCapped = false;
    next();
  }
}
