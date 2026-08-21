import { prisma } from '../db';
import { runAllPatterns, BehavioralPattern } from '../lib/ai/analytics';
import { MemoryContextAssembler } from '../lib/ai/assemblers/MemoryContextAssembler';
import { logger } from '../lib/logger';
import { lockService } from './lockService';

export class CoachMemoryWriter {
  /**
   * Synchronizes detected behavioral flaws into the CoachMemory database table.
   * Executes safely in background with distributed locking to prevent race conditions.
   */
  static async sync(userId: string): Promise<void> {
    if (!userId) return;

    const lockKey = `memory-sync:${userId}`;
    const acquired = await lockService.acquireSyncLock(lockKey);
    if (!acquired) {
      logger.info(`[CoachMemoryWriter] Sync already in progress for user ${userId}, skipping.`);
      return;
    }

    try {
      // 1. Fetch up to 500 recent trades for analysis
      const trades = await prisma.trade.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 500,
      });

      if (!trades || trades.length === 0) {
        return;
      }

      // 2. Detect behavioral patterns deterministically
      const detectedPatterns: BehavioralPattern[] = runAllPatterns(trades);

      // 3. Upsert each pattern into CoachMemory
      for (const pattern of detectedPatterns) {
        const existing = await prisma.coachMemory.findFirst({
          where: {
            userId,
            patternType: pattern.patternType,
          },
        });

        if (existing) {
          // Update existing pattern and advance trend metrics
          await prisma.coachMemory.update({
            where: { id: existing.id },
            data: {
              title: pattern.title,
              description: pattern.description,
              severity: pattern.severity,
              previousCount: existing.count,
              count: pattern.count,
              avgPnl: pattern.avgPnl,
              updatedAt: new Date(),
            },
          });
        } else {
          // Create new pattern
          await prisma.coachMemory.create({
            data: {
              userId,
              patternType: pattern.patternType,
              title: pattern.title,
              description: pattern.description,
              severity: pattern.severity,
              previousCount: 0,
              count: pattern.count,
              avgPnl: pattern.avgPnl,
              detectedAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }

      // 4. Invalidate memory cache so next AI message reflects fresh patterns
      await MemoryContextAssembler.clearCache(userId);
      logger.info(`[CoachMemoryWriter] Successfully synchronized ${detectedPatterns.length} memory patterns for user ${userId}`);
    } catch (err: any) {
      logger.error(`[CoachMemoryWriter] Memory sync failed for user ${userId}: ${err?.message}`);
    } finally {
      await lockService.releaseSyncLock(lockKey);
    }
  }
}
