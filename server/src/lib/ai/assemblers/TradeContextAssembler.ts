import { prisma } from '../../../db';
import { cache } from '../../redis';
import { logger } from '../../logger';
import { runAllPatterns, computeFullStats, analyzeDisciplineCorrelation, analyzeSymbolPerformance, BehavioralPattern } from '../analytics';
import { TradeContextSerializer } from '../TradeContextSerializer';

export interface AssembledTradeContext {
  totalTrades: number;
  recentTradesSerialized: string;
  statsSerialized: string;
  patterns: BehavioralPattern[];
  disciplineCorrelation: any;
  symbolPerformance: any;
  rawRecentTrades: any[];
}

export class TradeContextAssembler {
  private static CACHE_TTL_SECONDS = 300; // 5 minutes

  static async assemble(userId: string): Promise<AssembledTradeContext> {
    const cacheKey = `ai:trade-context:${userId}`;

    // 1. Try cache
    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err: any) {
      logger.warn(`[TradeContextAssembler] Cache get failed: ${err.message}`);
    }

    // 2. Fetch up to 100 most recent trades for calculations
    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 100,
    });

    if (!trades || trades.length === 0) {
      const emptyResult: AssembledTradeContext = {
        totalTrades: 0,
        recentTradesSerialized: 'No trades recorded yet.',
        statsSerialized: 'Total Trades: 0 (No trade history available).',
        patterns: [],
        disciplineCorrelation: { highDiscWinRate: 0, lowDiscWinRate: 0, delta: 0 },
        symbolPerformance: { best: 'N/A', worst: 'N/A', winRates: {} },
        rawRecentTrades: [],
      };
      return emptyResult;
    }

    // 3. Deterministic Computations
    const stats = computeFullStats(trades);
    const patterns = runAllPatterns(trades);
    const disciplineCorrelation = analyzeDisciplineCorrelation(trades);
    const symbolPerformance = analyzeSymbolPerformance(trades);

    const result: AssembledTradeContext = {
      totalTrades: trades.length,
      recentTradesSerialized: TradeContextSerializer.serializeRecentTrades(trades, 5),
      statsSerialized: TradeContextSerializer.serializeStats(stats),
      patterns,
      disciplineCorrelation,
      symbolPerformance,
      rawRecentTrades: trades.slice(0, 5),
    };

    // 4. Save to cache
    try {
      await cache.setex(cacheKey, this.CACHE_TTL_SECONDS, JSON.stringify(result));
    } catch (err: any) {
      logger.warn(`[TradeContextAssembler] Cache set failed: ${err.message}`);
    }

    return result;
  }

  static async clearCache(userId: string): Promise<void> {
    try {
      await cache.del(`ai:trade-context:${userId}`);
    } catch (err: any) {
      logger.warn(`[TradeContextAssembler] Cache del failed: ${err.message}`);
    }
  }
}
