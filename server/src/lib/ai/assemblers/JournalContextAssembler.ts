import { prisma } from '../../../db';
import { cache } from '../../redis';
import { logger } from '../../logger';

export interface AssembledJournalContext {
  count: number;
  serializedJournals: string;
}

export class JournalContextAssembler {
  private static CACHE_TTL_SECONDS = 300; // 5 minutes

  static async assemble(userId: string): Promise<AssembledJournalContext> {
    const cacheKey = `ai:journal-context:${userId}`;

    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err: any) {
      logger.warn(`[JournalContextAssembler] Cache get failed: ${err.message}`);
    }

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 3,
    });

    if (!entries || entries.length === 0) {
      const emptyResult = {
        count: 0,
        serializedJournals: 'No journal reflections recorded yet.',
      };
      return emptyResult;
    }

    const serialized = entries.map(entry => {
      const dateStr = entry.date ? new Date(entry.date).toISOString().split('T')[0] : 'Unknown';
      const mood = entry.mood ? `[Mood: ${entry.mood}]` : '';
      const reflection = entry.reflection ? `"${entry.reflection.replace(/\n+/g, ' ').slice(0, 120)}"` : '';
      const improve = entry.whatToImprove ? `Fix: "${entry.whatToImprove.replace(/\n+/g, ' ').slice(0, 80)}"` : '';

      return `• [${dateStr}] ${mood} ${reflection} ${improve}`.trim();
    }).join('\n');

    const result = {
      count: entries.length,
      serializedJournals: serialized,
    };

    try {
      await cache.setex(cacheKey, this.CACHE_TTL_SECONDS, JSON.stringify(result));
    } catch (err: any) {
      logger.warn(`[JournalContextAssembler] Cache set failed: ${err.message}`);
    }

    return result;
  }

  static async clearCache(userId: string): Promise<void> {
    try {
      await cache.del(`ai:journal-context:${userId}`);
    } catch (err: any) {
      logger.warn(`[JournalContextAssembler] Cache del failed: ${err.message}`);
    }
  }
}
