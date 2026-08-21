import { Request, Response, NextFunction } from 'express';
import { redis, cache } from '../lib/redis';
import { logger } from '../lib/logger';

/**
 * LockService — Distributed sync lock and rate limiting.
 *
 * H1 fix: Previously created its own separate ioredis instance.
 * Now reuses the shared `redis` client from lib/redis.ts to avoid
 * two competing Redis connections with independent reconnect cycles.
 *
 * Falls back to in-memory Map when Redis is unavailable (same as lib/redis.ts).
 */

interface LockEntry {
  lockedAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class LockService {
  private syncLocks = new Map<string, LockEntry>();
  private rateLimits = new Map<string, RateLimitEntry>();
  private readonly lockTimeoutMs = 60_000; // 60s auto-expire safety limit

  // ─── Sync Lock ────────────────────────────────────────────────────────────

  public async acquireSyncLock(key: string): Promise<boolean> {
    try {
      // Redis SET NX PX — atomic acquire + expiry
      const result = await redis.set(`lock:${key}`, '1', 'PX', this.lockTimeoutMs, 'NX');
      return result === 'OK';
    } catch {
      // Redis unavailable — fall back to in-memory lock
      const now = Date.now();
      const existing = this.syncLocks.get(key);
      if (existing && now - existing.lockedAt < this.lockTimeoutMs) {
        return false;
      }
      this.syncLocks.set(key, { lockedAt: now });
      return true;
    }
  }

  public async releaseSyncLock(key: string): Promise<void> {
    try {
      await redis.del(`lock:${key}`);
    } catch {
      this.syncLocks.delete(key);
    }
  }

  // ─── Auth Rate Limiter Middleware ─────────────────────────────────────────
  // 20 requests per 15 minutes per IP (default)

  public authRateLimit(maxRequests = 20, windowMs = 15 * 60_000) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const ip = (
        (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown'
      ).split(',')[0].trim();

      const key = `ratelimit:auth:${ip}`;

      try {
        const current = await redis.incr(key);
        if (current === 1) {
          await redis.pexpire(key, windowMs);
        }
        if (current > maxRequests) {
          const ttl = await redis.pttl(key);
          res.set('Retry-After', String(Math.ceil(ttl / 1000)));
          res.status(429).json({
            error: `Too many requests. Try again in ${Math.ceil(ttl / 60000)} minute(s).`,
          });
          return;
        }
        return next();
      } catch {
        // Redis unavailable — fall back to in-memory rate limit
        const now = Date.now();
        const entry = this.rateLimits.get(ip);

        if (!entry || now > entry.resetAt) {
          this.rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
          return next();
        }

        if (entry.count >= maxRequests) {
          const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
          res.set('Retry-After', String(retryAfterSec));
          res.status(429).json({
            error: `Too many requests. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).`,
          });
          return;
        }

        entry.count++;
        next();
      }
    };
  }
}

export const lockService = new LockService();
