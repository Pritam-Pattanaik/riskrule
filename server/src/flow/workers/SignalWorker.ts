/**
 * SignalWorker — Background Intelligence Computation
 *
 * Runs every 30 seconds. Independently of any HTTP request, it:
 * 1. Reads the current option chain snapshot from ChainService
 * 2. Fetches live spot price and VIX from SpotService
 * 3. Runs SignalEngine to compute FlowIntelligence
 * 4. Writes FlowIntelligence to Redis (for intelligence endpoint to serve instantly)
 * 5. Determines if signals changed meaningfully (to decide whether to regenerate narrative)
 * 6. Broadcasts FlowIntelligence update via SSE if signals changed
 * 7. Queues narrative regeneration via NarrativeEngine if signals changed AND narrative cache expired
 *
 * This completely decouples signal computation from HTTP requests.
 * Every intelligence endpoint hit is a Redis cache read, never a computation.
 */

import { ChainService } from '../services/ChainService';
import { SpotService } from '../services/SpotService';
import { SignalEngine, FlowIntelligence, DataQuality } from '../services/SignalEngine';
import { NarrativeEngine } from '../services/NarrativeEngine';
import { flowDataWorker } from './FlowDataWorker';
import { redis } from '../../lib/redis';
import { logger } from '../../lib/logger';
import { isIndianMarketOpen } from '../../lib/marketHours';

// ── Cache Keys ────────────────────────────────────────────────────────────────
export const INTELLIGENCE_CACHE_KEY = (symbol: string) => `flow:intelligence:${symbol}`;
const INTELLIGENCE_TTL_SEC = 60; // 60s TTL — worker refreshes every 30s

// ── SSE clients registry ──────────────────────────────────────────────────────
// Maps symbol → Set of Response objects for active SSE connections
import type { Response } from 'express';
const sseClients = new Map<string, Set<Response>>();

export function registerSSEClient(symbol: string, res: Response): void {
  if (!sseClients.has(symbol)) sseClients.set(symbol, new Set());
  sseClients.get(symbol)!.add(res);
}

export function unregisterSSEClient(symbol: string, res: Response): void {
  sseClients.get(symbol)?.delete(res);
}

// ── Previous intelligence (for change detection) ──────────────────────────────
const previousIntelligence = new Map<string, FlowIntelligence>();

// ── SignalWorker ──────────────────────────────────────────────────────────────

class SignalWorker {
  private intervals = new Map<string, NodeJS.Timeout>();
<<<<<<< HEAD
  private INTERVAL_MS = 5_000; // 5 seconds for rapid real-time response
=======
  private INTERVAL_MS = 5_000; // 5 seconds interval for real-time updates
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46

  start(symbols: string[]): void {
    logger.info(`[SignalWorker] Starting for: ${symbols.join(', ')}`);
    for (const symbol of symbols) {
      // Run immediately on start, then every 5s
      this.compute(symbol).catch(err =>
        logger.error(`[SignalWorker] Initial compute failed for ${symbol}:`, err)
      );
      const interval = setInterval(() => {
        this.compute(symbol).catch(err =>
          logger.error(`[SignalWorker] Periodic compute failed for ${symbol}:`, err)
        );
      }, this.INTERVAL_MS);
      this.intervals.set(symbol, interval);
    }
  }

  stop(): void {
    for (const [symbol, interval] of this.intervals) {
      clearInterval(interval);
      logger.info(`[SignalWorker] Stopped for ${symbol}`);
    }
    this.intervals.clear();
  }

  private async compute(symbol: string): Promise<void> {
    try {
      const marketOpen = isIndianMarketOpen();
      const providerInfo = flowDataWorker.getProviderStatus();

      // If market is closed and we already have intelligence calculated, keep last snapshot
      if (!marketOpen && previousIntelligence.has(symbol)) {
        const cached = previousIntelligence.get(symbol)!;
        cached.isMarketClosed = true;
        cached.brokerStatus = providerInfo.status;
        cached.brokerMessage = providerInfo.lastError;
        return;
      }

      const expiry = ChainService.getActiveExpiry(symbol);
      const dte    = SpotService.getDTE(expiry);

      let chain = await ChainService.getChain(symbol);

      if (chain.length === 0 && providerInfo.status === 'connected') {
        try {
          await flowDataWorker.pollNow();
          chain = await ChainService.getChain(symbol);
        } catch (_pollErr) {
          // ignore error and proceed
        }
      }

      // ── 2. Fetch market context ────────────────────────────────────────────
      const [spotData, vixData] = await Promise.all([
        SpotService.getSpot(symbol),
        SpotService.getVix(),
      ]);

      const spotPrice   = spotData?.price    ?? 0;
      const isSpotLive  = spotData?.isLive   ?? false;
      const vix         = vixData?.value     ?? 0;
      const isVixLive   = vixData?.isLive    ?? false;

      // ── 3. Data quality determination ─────────────────────────────────────
      const dataQuality: DataQuality = 'live';
      const lastUpdated = spotData?.updatedAt ?? Date.now();

      // ── 4. Compute intelligence ────────────────────────────────────────────
      const intelligence = SignalEngine.compute({
        symbol,
        expiry,
        dte,
        chain,
        spotPrice,
        spotChange:     spotData?.change    ?? 0,
        spotChangePct:  spotData?.changePct ?? 0,
        isSpotLive,
        vix:           vix > 0 ? vix : null,
        isVixLive,
        dataQuality,
        lastUpdated,
        isMarketClosed: !marketOpen,
        brokerStatus:   providerInfo.status,
        brokerMessage:  providerInfo.lastError,
      });

      // ── 5. Store in Redis ──────────────────────────────────────────────────
      try {
        if (redis.status === 'ready' || redis.status === 'connect') {
          await redis.setex(
            INTELLIGENCE_CACHE_KEY(symbol),
            INTELLIGENCE_TTL_SEC,
            JSON.stringify(intelligence)
          );
        }
      } catch (redisErr) {
        logger.warn(`[SignalWorker] Redis write failed for ${symbol}:`, redisErr);
      }

      // ── 6. Detect meaningful signal change ────────────────────────────────
      const prev = previousIntelligence.get(symbol);
      const hasChanged = this.hasSignificantChange(prev, intelligence);

      previousIntelligence.set(symbol, intelligence);

      // ── 7. Broadcast to SSE clients if changed ────────────────────────────
      if (hasChanged) {
        this.broadcastToSSEClients(symbol, intelligence);
      }

      // ── 8. Regenerate narrative if signals changed ─────────────────────────
      if (hasChanged) {
        // Fire-and-forget — narrative generation is async and cached
        NarrativeEngine.generateNarrative(intelligence).catch(err =>
          logger.error(`[SignalWorker] Narrative generation failed for ${symbol}:`, err)
        );
      }

      logger.debug(
        `[SignalWorker] ${symbol} | bias:${intelligence.overallBias} | ` +
        `PCR:${intelligence.pcrOI.toFixed(3)} | Sup:${intelligence.supportStrike} | Res:${intelligence.resistanceStrike} | changed:${hasChanged}`
      );

    } catch (error) {
      logger.error(`[SignalWorker] compute() error for ${symbol}:`, error);
    }
  }

  /**
   * Detect if signals or ticks changed enough to warrant an SSE push.
   * Broadcasts immediately on any spot or OI tick update.
   */
  private hasSignificantChange(prev: FlowIntelligence | undefined, curr: FlowIntelligence): boolean {
    if (!prev) return true; // Always push on first computation

<<<<<<< HEAD
    // Key levels and metrics changed
    if (prev.supportStrike !== curr.supportStrike) return true;
    if (prev.resistanceStrike !== curr.resistanceStrike) return true;
    if (Math.abs(prev.pcrOI - curr.pcrOI) >= 0.005) return true;
    if (prev.overallBias !== curr.overallBias) return true;
    if (prev.pcrSignal   !== curr.pcrSignal)   return true;
    if (prev.maxPainSignal !== curr.maxPainSignal) return true;
    if (prev.maxPain !== curr.maxPain) return true;
    if (prev.vixSignal   !== curr.vixSignal)   return true;
    if (prev.ivSignal    !== curr.ivSignal)     return true;
=======
    if (prev.spotPrice !== curr.spotPrice) return true;
    if (prev.pcrOI !== curr.pcrOI) return true;
    if (prev.supportStrike !== curr.supportStrike) return true;
    if (prev.resistanceStrike !== curr.resistanceStrike) return true;
    if (prev.overallBias !== curr.overallBias) return true;
    if (prev.agreementScore !== curr.agreementScore) return true;
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46

    // Heartbeat update every 5s if last update > 5s
    if (curr.generatedAt - prev.generatedAt >= 5000) return true;

    return false;
  }

  private broadcastToSSEClients(symbol: string, intelligence: FlowIntelligence): void {
    const clients = sseClients.get(symbol);
    if (!clients || clients.size === 0) return;

    const data = `data: ${JSON.stringify({ type: 'intelligence', payload: intelligence })}\n\n`;
    const toRemove: Response[] = [];

    for (const res of clients) {
      try {
        res.write(data);
      } catch (_err) {
        toRemove.push(res);
      }
    }

    // Clean up dead connections
    for (const res of toRemove) {
      clients.delete(res);
    }
  }

  /**
   * Public method to get current intelligence (for HTTP requests).
   * Reads from Redis cache first. Falls back to on-demand computation.
   */
  async getIntelligence(symbol: string): Promise<FlowIntelligence | null> {
    // 1. Try Redis cache (fastest path)
    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        const cached = await redis.get(INTELLIGENCE_CACHE_KEY(symbol));
        if (cached) return JSON.parse(cached);
      }
    } catch (_e) { /* proceed */ }

    // 2. Return last in-memory intelligence if available
    const inMem = previousIntelligence.get(symbol);
    if (inMem) return inMem;

    // 3. Force a synchronous computation (cold start)
    await this.compute(symbol);
    return previousIntelligence.get(symbol) ?? null;
  }
}

export const signalWorker = new SignalWorker();
