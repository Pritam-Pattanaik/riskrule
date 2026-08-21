/**
 * MarketWorker — SSE Broadcaster
 *
 * Responsibilities:
 * - Poll market quotes and sectors on a scheduled interval
 * - Broadcast price updates to SSE clients via EventEmitter
 * - Maintain an in-memory cache for instant /quotes REST responses
 *
 * All data fetching is delegated to MarketDataService (provider waterfall + Redis caching).
 * Chart pre-warming is NOT done here — charts have their own 300s TTL and are
 * fetched on-demand. Pre-warming every 60s was burning 2 Yahoo API calls per minute
 * unnecessarily. (C1 fix)
 */

import { EventEmitter } from 'events';
import { marketDataService } from '../market/MarketDataService';
import { MarketQuote, TRACKED_SYMBOLS } from '../market/types';
import { logger } from '../lib/logger';

import { isIndianMarketOpen } from '../lib/marketHours';

// 90s poll: gives Redis (60s TTL) time to expire naturally between fetches.
// Keeps Yahoo request rate at ~40 req/hour across all tracked symbols.
const POLLING_INTERVAL_MS = 90_000;

class MarketWorker extends EventEmitter {
  private cache: MarketQuote[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private isFetching = false;

  constructor() {
    super();
    this.setMaxListeners(0); // Unlimited SSE client listeners
  }

  public start(): void {
    if (this.intervalId) return;

    // Fast boot: hydrate cache from Redis immediately (no Yahoo hit if cache is warm)
    marketDataService.getQuotes(TRACKED_SYMBOLS)
      .then(quotes => {
        if (quotes.length > 0 && this.cache.length === 0) {
          this.cache = quotes;
          logger.info(`[MarketWorker] Fast boot: populated ${quotes.length} quotes from cache`);
        }
      })
      .catch(err => {
        logger.warn(`[MarketWorker] Fast boot cache read failed: ${err.message}`);
      })
      .finally(() => {
        // First live fetch — staggered 5s after boot to avoid startup Yahoo burst
        setTimeout(() => this.fetchData(), 5_000);
      });

    this.intervalId = setInterval(() => this.fetchData(), POLLING_INTERVAL_MS);
    logger.info(`[MarketWorker] Started — polling every ${POLLING_INTERVAL_MS / 1000}s`);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('[MarketWorker] Stopped');
    }
  }

  public getCache(): MarketQuote[] {
    return this.cache;
  }

  private async fetchData(): Promise<void> {
    if (this.isFetching) return;
    if (!isIndianMarketOpen() && this.cache.length > 0) {
      logger.debug('[MarketWorker] Market closed — skipping live quote poll');
      return;
    }
    this.isFetching = true;

    try {
      // Fetch quotes and sectors in parallel — charts are on-demand only (C1 fix)
      const [quotes] = await Promise.all([
        marketDataService.getQuotes(TRACKED_SYMBOLS),
        marketDataService.getSectors(), // pre-warms sector cache for the next 120s
      ]);

      if (quotes.length === 0) {
        logger.warn('[MarketWorker] Empty quotes from service — keeping previous cache');
        return;
      }

      // Only broadcast when price data has changed (avoids SSE spam on flat markets)
      const prevJSON = JSON.stringify(this.cache.map(q => `${q.id}:${q.price}`));
      const nextJSON = JSON.stringify(quotes.map(q => `${q.id}:${q.price}`));

      if (prevJSON !== nextJSON) {
        this.cache = quotes;
        this.emit('update', this.cache);
        logger.debug(`[MarketWorker] Price update broadcast to SSE clients`);
      } else {
        this.cache = quotes; // Update timestamps silently
      }

    } catch (err: any) {
      logger.error(`[MarketWorker] Fetch cycle error: ${err.message}`);
    } finally {
      this.isFetching = false;
    }
  }
}

export const marketWorker = new MarketWorker();
