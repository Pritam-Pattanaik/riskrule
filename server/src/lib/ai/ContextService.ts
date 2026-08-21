import { TradeContextAssembler, AssembledTradeContext } from './assemblers/TradeContextAssembler';
import { JournalContextAssembler, AssembledJournalContext } from './assemblers/JournalContextAssembler';
import { UserProfileAssembler, AssembledUserProfile } from './assemblers/UserProfileAssembler';
import { MemoryContextAssembler, AssembledMemoryContext } from './assemblers/MemoryContextAssembler';
import { MarketContextAssembler, AssembledMarketContext } from './assemblers/MarketContextAssembler';
import { logger } from '../logger';

export interface MasterAIContext {
  userId: string;
  mode: string;
  tradeContext: AssembledTradeContext;
  journalContext: AssembledJournalContext;
  userProfile: AssembledUserProfile;
  memoryContext: AssembledMemoryContext;
  marketContext: AssembledMarketContext;
}

export class ContextService {
  /**
   * Assembles complete, multi-dimensional coaching context in parallel.
   */
  static async assembleMasterContext(userId: string, mode: string = 'general'): Promise<MasterAIContext> {
    const startTime = Date.now();

    try {
      const [
        tradeContext,
        journalContext,
        userProfile,
        memoryContext,
        marketContext,
      ] = await Promise.all([
        TradeContextAssembler.assemble(userId),
        JournalContextAssembler.assemble(userId),
        UserProfileAssembler.assemble(userId),
        MemoryContextAssembler.assemble(userId, mode),
        MarketContextAssembler.assemble(),
      ]);

      const elapsed = Date.now() - startTime;
      logger.info(`[ContextService] Assembled master context for user ${userId} in ${elapsed}ms`);

      return {
        userId,
        mode,
        tradeContext,
        journalContext,
        userProfile,
        memoryContext,
        marketContext,
      };
    } catch (err: any) {
      logger.error(`[ContextService] Critical error assembling context: ${err.message}`);
      throw err;
    }
  }

  /**
   * Invalidate user-specific context caches on trade/journal updates.
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    await Promise.all([
      TradeContextAssembler.clearCache(userId),
      JournalContextAssembler.clearCache(userId),
      UserProfileAssembler.clearCache(userId),
      MemoryContextAssembler.clearCache(userId),
    ]);
  }
}
