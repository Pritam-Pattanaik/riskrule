import { prisma } from '../../../db';
import { cache } from '../../redis';
import { logger } from '../../logger';

export interface AssembledUserProfile {
  rulesSerialized: string;
  strategiesSerialized: string;
  goalsSerialized: string;
}

export class UserProfileAssembler {
  private static CACHE_TTL_SECONDS = 3600; // 1 hour

  static async assemble(userId: string): Promise<AssembledUserProfile> {
    const cacheKey = `ai:user-profile:${userId}`;

    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err: any) {
      logger.warn(`[UserProfileAssembler] Cache get failed: ${err.message}`);
    }

    const [rules, strategies, goals] = await Promise.all([
      prisma.tradingRule.findFirst({ where: { userId } }),
      prisma.strategy.findMany({ where: { userId }, take: 10 }),
      prisma.goal.findMany({ where: { userId, active: true }, take: 5 }),
    ]);

    // Format rules
    let rulesSerialized = 'No custom trading rules defined.';
    if (rules) {
      const ruleItems: string[] = [];
      if (rules.windowStart && rules.windowEnd) {
        ruleItems.push(`• Allowed Trading Window: ${rules.windowStart} to ${rules.windowEnd}`);
      }
      if (rules.maxTradesPerDay) {
        ruleItems.push(`• Max Trades Per Day: ${rules.maxTradesPerDay}`);
      }
      if (rules.maxDailyLoss) {
        ruleItems.push(`• Max Daily Loss Limit: ₹${rules.maxDailyLoss.toString()}`);
      }
      if (rules.maxLossPerTrade) {
        ruleItems.push(`• Max Loss Per Trade: ₹${rules.maxLossPerTrade.toString()}`);
      }
      if (rules.allowedMarkets && rules.allowedMarkets.length > 0) {
        ruleItems.push(`• Allowed Markets: ${rules.allowedMarkets.join(', ')}`);
      }
      if (rules.allowedInstruments && rules.allowedInstruments.length > 0) {
        ruleItems.push(`• Allowed Instruments: ${rules.allowedInstruments.join(', ')}`);
      }
      if ((rules as any).description) {
        ruleItems.push(`• Trading Manifesto / Philosophy: ${(rules as any).description}`);
      }
      if ((rules as any).customRules && (rules as any).customRules.length > 0) {
        ruleItems.push(`• Core Discipline Commandments:\n  - ${(rules as any).customRules.join('\n  - ')}`);
      }
      if (ruleItems.length > 0) {
        rulesSerialized = ruleItems.join('\n');
      }
    }

    // Format strategies
    const strategiesSerialized = strategies.length > 0
      ? strategies.map(s => `• ${s.name}${s.description ? ` (${s.description})` : ''}${s.rules ? ` - Rules: ${s.rules}` : ''}`).join('\n')
      : 'No explicit strategies defined.';

    // Format goals
    const goalsSerialized = goals.length > 0
      ? goals.map(g => `• [${g.type.toUpperCase()}] ${g.description}${g.target ? ` (Target: ${g.target})` : ''}`).join('\n')
      : 'No active accountability goals.';

    const result: AssembledUserProfile = {
      rulesSerialized,
      strategiesSerialized,
      goalsSerialized,
    };

    try {
      await cache.setex(cacheKey, this.CACHE_TTL_SECONDS, JSON.stringify(result));
    } catch (err: any) {
      logger.warn(`[UserProfileAssembler] Cache set failed: ${err.message}`);
    }

    return result;
  }

  static async clearCache(userId: string): Promise<void> {
    try {
      await cache.del(`ai:user-profile:${userId}`);
    } catch (err: any) {
      logger.warn(`[UserProfileAssembler] Cache del failed: ${err.message}`);
    }
  }
}
