/**
 * FlowDataWorker — Options Tick Ingestion Pipeline
 *
 * Responsibilities:
 * 1. Connect to the data provider (Mock or live TrueData)
 * 2. Receive raw option ticks
 * 3. Track previousOI per strike/type for accurate ΔOI snapshot
 * 4. Write clean ticks to in-memory cache (always)
 * 5. Write to Redis for SSE broadcast (best-effort)
 * 6. Run AlertEngine against each tick
 *
 * Critical fix: changeInOI stored in cache is a SNAPSHOT (current - previous snapshot),
 * NOT a cumulative sum. The old code had `cell.callChange += changeInOI` which caused
 * unbounded growth (the e+43 bug).
 */

import { IOptionsDataProvider, OptionTick } from '../providers/IOptionsDataProvider';
import { DhanOptionsProvider } from '../providers/DhanOptionsProvider';
import { AlertEngine } from '../services/AlertEngine';
import { inMemoryChainCache } from '../services/ChainCache';
import { logger } from '../../lib/logger';
import { redis } from '../../lib/redis';

// ── Validated OptionTick with guaranteed changeInOI ───────────────────────────
type ValidatedTick = OptionTick & { changeInOI: number };

// ── Per-strike OI tracker ─────────────────────────────────────────────────────
// Tracks the last-stored OI for each strike/type so we can compute accurate ΔOI.
// key = `${symbol}:${expiry}:${strike}:${type}`
const previousOIMap = new Map<string, number>();

export class FlowDataWorker {
  private provider: DhanOptionsProvider | null = null;
  private isRunning = false;
  private symbols: string[] = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'];

  async start(symbols: string[]): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.symbols = symbols;

    try {
      this.provider = new DhanOptionsProvider();
      this.provider.onTick(async (tick) => {
        await this.handleTick(tick);
      });
      await this.provider.connect();

      if (this.provider.hasValidCredentials()) {
        logger.info('[FlowDataWorker] Connected to live Dhan option chain provider');
      } else {
        logger.warn('[FlowDataWorker] Dhan credentials missing or expired. Connect Dhan in Settings to stream live option chain.');
      }

      await this.provider.subscribe(symbols);

      logger.info(`[FlowDataWorker] Started for symbols: ${symbols.join(', ')}`);
    } catch (err) {
      logger.error('[FlowDataWorker] Failed to start:', err);
      this.isRunning = false;
    }
  }

  public getProviderStatus(): { status: 'connected' | 'expired' | 'missing'; lastError: string | null } {
    if (!this.provider) {
      this.provider = new DhanOptionsProvider();
      this.provider.onTick(async (tick) => {
        await this.handleTick(tick);
      });
      this.provider.subscribe(this.symbols).catch(() => {});
      this.provider.connect().catch(() => {});
    }
    return {
      status: this.provider.getBrokerStatus(),
      lastError: this.provider.getLastError(),
    };
  }

  public async reloadProvider(): Promise<boolean> {
    if (!this.provider) {
      this.provider = new DhanOptionsProvider();
      this.provider.onTick(async (tick) => {
        await this.handleTick(tick);
      });
      await this.provider.subscribe(this.symbols);
      await this.provider.connect();
    }
    const reloaded = await this.provider.reloadCredentials();
    if (reloaded) {
      await this.provider.pollNow();
    }
    return reloaded;
  }

  public async reloadCredentials(): Promise<void> {
    await this.reloadProvider();
  }

  public async pollNow(): Promise<void> {
    if (this.provider) {
      await this.provider.pollNow();
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    this.isRunning = false;
    try {
      await this.provider?.disconnect();
      logger.info('[FlowDataWorker] Stopped');
    } catch (err) {
      logger.error('[FlowDataWorker] Error during stop:', err);
    }
  }

  private async handleTick(rawTick: OptionTick): Promise<void> {
    try {
      // ── 1. Validate tick ──────────────────────────────────────────────────
      if (!this.isValidTick(rawTick)) {
        logger.debug(`[FlowDataWorker] Rejected invalid tick: ${rawTick.symbol} ${rawTick.strikePrice}${rawTick.optionType}`);
        return;
      }

      // ── 2. Compute accurate ΔOI (snapshot, not cumulative) ────────────────
      const oiKey = `${rawTick.symbol}:${rawTick.expiryDate}:${rawTick.strikePrice}:${rawTick.optionType}`;
      const prevOI = previousOIMap.get(oiKey);

      // changeInOI = current OI - previous OI snapshot
      // If no previous (first tick for this strike), use provider-supplied changeInOI or 0
      let changeInOI: number;
      if (prevOI !== undefined) {
        changeInOI = rawTick.openInterest - prevOI;
      } else {
        // First tick — use whatever the provider says (MockProvider supplies session delta)
        changeInOI = (rawTick as any).changeInOI ?? 0;
      }

      // Update the tracker
      previousOIMap.set(oiKey, rawTick.openInterest);

      // ── 3. Build clean validated tick ─────────────────────────────────────
      const tick: ValidatedTick = {
        ...rawTick,
        changeInOI,
      };

      // ── 4. In-memory cache (always first — UI works without Redis) ─────────
      const cacheKey = `flow:oi:${tick.symbol}:${tick.expiryDate}`;
      const field    = `${tick.strikePrice}:${tick.optionType}`;

      let memoryMap = inMemoryChainCache.get(cacheKey);
      if (!memoryMap) {
        memoryMap = {};
        inMemoryChainCache.set(cacheKey, memoryMap);
      }
      memoryMap[field] = tick;

      // ── 5. Redis persistence + Pub/Sub (best-effort) ──────────────────────
      try {
        if (redis.status === 'ready' || redis.status === 'connect') {
          await redis.hset(cacheKey, field, JSON.stringify(tick));
          await redis.publish(`flow:channel:${tick.symbol}`, JSON.stringify(tick));
        }
      } catch (_redisErr) {
        // Redis unavailable — in-memory cache already updated, UI unaffected
      }

      // ── 6. Alert Engine ───────────────────────────────────────────────────
      await AlertEngine.check(tick);

    } catch (error) {
      logger.error(`[FlowDataWorker] Tick error for ${rawTick.symbol}:`, error);
    }
  }

  /**
   * Validates a raw option tick before processing.
   * Rejects ticks with impossible or missing values.
   */
  private isValidTick(tick: OptionTick): boolean {
    if (!tick.symbol || !tick.expiryDate || !tick.strikePrice || !tick.optionType) return false;
    if (tick.ltp < 0) return false;
    if (tick.openInterest < 0) return false;
    if (tick.strikePrice <= 0) return false;
    if (!['CE', 'PE'].includes(tick.optionType)) return false;
    if (tick.impliedVolatility !== undefined && (tick.impliedVolatility <= 0 || tick.impliedVolatility > 200)) return false;
    return true;
  }
}

export const flowDataWorker = new FlowDataWorker();
