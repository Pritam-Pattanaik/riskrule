import { prisma } from '../../../db';
import { cache } from '../../redis';
import { logger } from '../../logger';

export interface AssembledMemoryContext {
  count: number;
  serializedMemories: string;
}

export class MemoryContextAssembler {
  private static CACHE_TTL_SECONDS = 300; // 5 minutes

  static async assemble(userId: string, mode: string = 'general'): Promise<AssembledMemoryContext> {
    const cacheKey = `ai:coach-memory:${userId}`;

    let memories: any[] = [];

    // Try cache
    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        memories = JSON.parse(cached);
      }
    } catch (err: any) {
      logger.warn(`[MemoryContextAssembler] Cache get failed: ${err.message}`);
    }

    if (memories.length === 0) {
      memories = await prisma.coachMemory.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });

      if (memories.length > 0) {
        try {
          await cache.setex(cacheKey, this.CACHE_TTL_SECONDS, JSON.stringify(memories));
        } catch (err: any) {
          logger.warn(`[MemoryContextAssembler] Cache set failed: ${err.message}`);
        }
      }
    }

    if (!memories || memories.length === 0) {
      return {
        count: 0,
        serializedMemories: 'No persistent behavioral flaws or memory patterns logged yet.',
      };
    }

    // Rank memories by multi-factor scoring
    const ranked = [...memories].sort((a, b) => {
      const scoreA = this.calculatePriorityScore(a, mode);
      const scoreB = this.calculatePriorityScore(b, mode);
      return scoreB - scoreA;
    });

    const topMemories = ranked.slice(0, 5);

    const serialized = topMemories.map(m => {
      const sev = (m.severity || 'warning').toUpperCase();
      const count = m.count || 1;
      const prevCount = m.previousCount || 0;
      const delta = count - prevCount;
      const trend = delta > 0 ? `Escalating (+${delta})` : delta < 0 ? 'Improving' : 'Stable';
      const avgPnl = m.avgPnl ? `Avg Impact: ₹${Math.round(m.avgPnl).toLocaleString('en-IN')}` : '';

      return `• [${m.title || m.patternType}] (${sev} | Trend: ${trend} | Occurrences: ${count})
  ${m.description || ''} ${avgPnl}`;
    }).join('\n');

    return {
      count: memories.length,
      serializedMemories: serialized,
    };
  }

  private static calculatePriorityScore(memory: any, mode: string): number {
    // S: Severity weight (0.35)
    let s = 0.5;
    if (memory.severity === 'critical') s = 1.0;
    else if (memory.severity === 'resolved' || memory.severity === 'positive') s = 0.1;

    // R: Recency decay (0.25)
    const daysSince = memory.updatedAt
      ? (Date.now() - new Date(memory.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      : 30;
    const r = Math.exp(-0.1 * Math.min(daysSince, 30));

    // F: Financial impact (0.20)
    const avgLoss = Math.abs(memory.avgPnl || 0);
    const f = Math.min(1.0, avgLoss / 10000);

    // M: Mode relevance (0.20)
    let m = 0.5;
    const pType = (memory.patternType || '').toLowerCase();
    if (mode === 'psychology' && (pType.includes('revenge') || pType.includes('boredom') || pType.includes('fomo'))) {
      m = 1.0;
    } else if (mode === 'risk' && (pType.includes('size') || pType.includes('stop') || pType.includes('loss'))) {
      m = 1.0;
    } else if (mode === 'premarket' && pType.includes('loss_day')) {
      m = 1.0;
    }

    return 0.35 * s + 0.25 * r + 0.20 * f + 0.20 * m;
  }

  static async clearCache(userId: string): Promise<void> {
    try {
      await cache.del(`ai:coach-memory:${userId}`);
    } catch (err: any) {
      logger.warn(`[MemoryContextAssembler] Cache del failed: ${err.message}`);
    }
  }
}
