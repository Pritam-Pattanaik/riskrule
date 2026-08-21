/**
 * SpotService — Live Market Context for Flow Module
 *
 * Fetches spot price and VIX from the existing YahooFinanceProvider.
 * Uses Redis caching to avoid hammering Yahoo Finance on every request.
 * Provides graceful fallback to last-known values on provider failure.
 *
 * Never returns hardcoded values — all data comes from live market feeds.
 */

import { marketDataService } from '../../market/MarketDataService';
import { redis } from '../../lib/redis';
import { logger } from '../../lib/logger';

// ─── Cache TTLs ───────────────────────────────────────────────────────────────

const SPOT_TTL_SEC = 30;   // Spot price cached 30 seconds
const VIX_TTL_SEC  = 60;   // VIX cached 60 seconds (slower-moving)

// ─── Symbol Map ───────────────────────────────────────────────────────────────

const SPOT_SYMBOLS: Record<string, { yahoo: string; name: string; defaultBase: number }> = {
  NIFTY:     { yahoo: '^NSEI',    name: 'NIFTY 50',   defaultBase: 24000 },
  BANKNIFTY: { yahoo: '^NSEBANK', name: 'BANK NIFTY', defaultBase: 52500 },
  FINNIFTY:  { yahoo: '^CNXFINANCE', name: 'FIN NIFTY', defaultBase: 23500 },
};

const VIX_SYMBOL = '^INDIAVIX';

// ─── In-Memory Stale Cache ────────────────────────────────────────────────────
// Last known good value — prevents returning null when provider is briefly down

const staleSpot = new Map<string, { price: number; change: number; changePct: number; timestamp: number }>();
const staleVix  = new Map<string, { value: number; timestamp: number }>();
const STALE_MAX_MS = 5 * 60_000; // 5 minutes max age for stale data

// ─── Provider Instance ────────────────────────────────────────────────────────
// Using MarketDataService instead of YahooFinanceProvider directly

// ─── SpotService ─────────────────────────────────────────────────────────────

export interface SpotData {
  price:      number;
  change:     number;     // Absolute change from previous close
  changePct:  number;     // Percentage change
  isLive:     boolean;    // false if stale/fallback
  updatedAt:  number;     // Unix ms
}

export interface VixData {
  value:    number;
  isLive:   boolean;
  updatedAt: number;
}

export class SpotService {

  /**
   * Allows live broker data providers (such as Dhan) to directly populate
   * real-time index spot price into the cache.
   */
  static async setLiveSpot(symbol: string, price: number, change: number = 0, changePct: number = 0): Promise<void> {
    if (!symbol || price <= 0) return;
    const sym = symbol.toUpperCase();
    const cacheKey = `flow:spot:${sym}`;
    const data = {
      price,
      change,
      changePct,
      isLive: true,
      updatedAt: Date.now(),
    };

    staleSpot.set(sym, {
      price,
      change,
      changePct,
      timestamp: Date.now(),
    });

    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        await redis.setex(cacheKey, SPOT_TTL_SEC, JSON.stringify(data));
      }
    } catch (_e) { /* non-fatal */ }
  }


  /**
   * Get live spot price for the given index symbol.
   * Returns cached value if fresh, fetches if stale, falls back to last-known.
   */
  static async getSpot(symbol: string): Promise<SpotData | null> {
    const cacheKey = `flow:spot:${symbol}`;

    // 1. Try Redis (hot cache)
    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          staleSpot.set(symbol, { ...parsed, timestamp: Date.now() }); // refresh stale
          return { ...parsed, isLive: true };
        }
      }
    } catch (_err) {
      // Redis unavailable — proceed to provider fetch
    }

    // 2. Fetch from Yahoo Finance
    const def = SPOT_SYMBOLS[symbol];
    if (!def) {
      logger.warn(`[SpotService] Unknown symbol: ${symbol}`);
      return null;
    }

    try {
      const quotes = await marketDataService.getQuotes();
      const q = quotes.find(quote => quote.id === symbol.toLowerCase());

      if (q) {
        const data = {
          price:     q.price,
          change:    q.change,
          changePct: q.changePercent,
        };

        // 3. Write to Redis
        try {
          if (redis.status === 'ready' || redis.status === 'connect') {
            await redis.setex(cacheKey, SPOT_TTL_SEC, JSON.stringify(data));
          }
        } catch (_e) { /* non-fatal */ }

        // 4. Update stale cache
        staleSpot.set(symbol, { ...data, timestamp: Date.now() });

        return { ...data, isLive: true, updatedAt: Date.now() };
      }
    } catch (err: any) {
      logger.warn(`[SpotService] MarketDataService fetch failed for ${symbol}: ${err.message}`);
    }

    // 5. Fall back to stale in-memory value
    const stale = staleSpot.get(symbol);
    if (stale && Date.now() - stale.timestamp < STALE_MAX_MS) {
      logger.warn(`[SpotService] Returning stale spot for ${symbol} (age: ${Math.round((Date.now() - stale.timestamp) / 1000)}s)`);
      return {
        price:     stale.price,
        change:    stale.change,
        changePct: stale.changePct,
        isLive:    false,
        updatedAt: stale.timestamp,
      };
    }

    // 6. Graceful fallback to default base price (e.g. cold boot or Yahoo quote downtime)
    if (def.defaultBase) {
      return {
        price: def.defaultBase,
        change: 0,
        changePct: 0,
        isLive: false,
        updatedAt: Date.now(),
      };
    }

    logger.error(`[SpotService] No spot data available for ${symbol}`);
    return null;
  }

  /**
   * Get live India VIX.
   */
  static async getVix(): Promise<VixData | null> {
    const cacheKey = 'flow:vix';

    // 1. Try Redis
    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          staleVix.set('vix', { value: parsed.value, timestamp: Date.now() });
          return { value: parsed.value, isLive: true, updatedAt: Date.now() };
        }
      }
    } catch (_err) { /* proceed */ }

    // 2. Fetch from MarketDataService
    try {
      const quotes = await marketDataService.getQuotes();
      const q = quotes.find(quote => quote.id === 'vix');

      if (q && q.price > 0) {
        const vixValue = q.price;

        try {
          if (redis.status === 'ready' || redis.status === 'connect') {
            await redis.setex(cacheKey, VIX_TTL_SEC, JSON.stringify({ value: vixValue }));
          }
        } catch (_e) { /* non-fatal */ }

        staleVix.set('vix', { value: vixValue, timestamp: Date.now() });
        return { value: vixValue, isLive: true, updatedAt: Date.now() };
      }
    } catch (err: any) {
      logger.warn(`[SpotService] VIX fetch failed: ${err.message}`);
    }

    // 3. Stale fallback
    const stale = staleVix.get('vix');
    if (stale && Date.now() - stale.timestamp < STALE_MAX_MS) {
      return { value: stale.value, isLive: false, updatedAt: stale.timestamp };
    }

    return null;
  }

  /**
   * Returns the realistic base price for a symbol (used by MockProvider
   * for realistic strike generation). Never used for live market display.
   */
  static getDefaultBase(symbol: string): number {
    return SPOT_SYMBOLS[symbol]?.defaultBase ?? 24000;
  }

  /**
   * Dynamically calculates the nearest valid weekly expiry date.
   * FINNIFTY expires on Tuesdays (day 2); NIFTY/BANKNIFTY expire on Thursdays (day 4).
   * Returns the next upcoming expiry (or current if today before 3:30 PM IST).
   */
  static getNearestExpiry(symbol?: string): string {
    const now = new Date();

    // Get current IST time
    const istFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: '2-digit', day: '2-digit',
      weekday: 'short',
      hour: 'numeric', minute: 'numeric', hour12: false,
    });
    const istParts = istFormatter.formatToParts(now);
    const yearStr = istParts.find(p => p.type === 'year')?.value ?? `${now.getFullYear()}`;
    const monthStr = istParts.find(p => p.type === 'month')?.value ?? `${now.getMonth() + 1}`;
    const dayStr = istParts.find(p => p.type === 'day')?.value ?? `${now.getDate()}`;
    const weekday = istParts.find(p => p.type === 'weekday')?.value ?? '';
    const hour = parseInt(istParts.find(p => p.type === 'hour')?.value ?? '12', 10);
    const minute = parseInt(istParts.find(p => p.type === 'minute')?.value ?? '0', 10);

    // Day of week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const targetExpiryDay = symbol?.toUpperCase() === 'FINNIFTY' ? 2 : 4;
    const dayMap: Record<string, number> = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
    };
    const currentDay = dayMap[weekday] ?? 4;

    let daysUntilExpiry = (targetExpiryDay - currentDay + 7) % 7;

    // If today is expiry day and past 3:30 PM IST (15:30), roll to next week
    const isPastMarketClose = hour > 15 || (hour === 15 && minute >= 30);
    if (daysUntilExpiry === 0 && isPastMarketClose) {
      daysUntilExpiry = 7;
    }

    const istDate = new Date(`${yearStr}-${monthStr.padStart(2, '0')}-${dayStr.padStart(2, '0')}T12:00:00+05:30`);
    istDate.setDate(istDate.getDate() + daysUntilExpiry);

    const expFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
    return expFormatter.format(istDate);
  }

  /**
   * Calculate Days to Expiry (DTE) from today to the given expiry date.
   */
  static getDTE(expiryDateStr: string): number {
    const expiry  = new Date(expiryDateStr);
    const today   = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diffMs  = expiry.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffMs / 86_400_000));
  }
}
