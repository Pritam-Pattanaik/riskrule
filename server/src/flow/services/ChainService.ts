/**
 * ChainService — Option Chain Data Accessor
 *
 * Reads the current option chain snapshot from Redis (primary)
 * or in-memory cache (fallback). Uses the dynamic expiry from SpotService.
 */

import { redis } from '../../lib/redis';
import { inMemoryChainCache } from './ChainCache';
import { OptionTick } from '../providers/IOptionsDataProvider';
import { SpotService } from './SpotService';
import { logger } from '../../lib/logger';

export class ChainService {
  /**
   * Fetches the option chain for a given symbol.
   * Uses the nearest live expiry — never a hardcoded date.
   */
  static async getChain(symbol: string, expiryDate?: string): Promise<OptionTick[]> {
    const expiry = expiryDate ?? SpotService.getNearestExpiry(symbol);
    const key = `flow:oi:${symbol}:${expiry}`;
    let data: Record<string, string> | null = null;
    const chain: OptionTick[] = [];

    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        data = await redis.hgetall(key);
      }
    } catch (error) {
      logger.warn(`[ChainService] Redis error fetching chain for ${symbol}, falling back to inMemoryCache:`, error);
    }

    // Process Redis data if available
    if (data && Object.keys(data).length > 0) {
      for (const value of Object.values(data)) {
        if (value) {
          try {
            const tick = JSON.parse(value as string);
            // Validate parsed tick has required fields
            if (tick.strikePrice && tick.optionType && tick.openInterest >= 0) {
              chain.push(tick);
            }
          } catch (e) {
            logger.warn(`[ChainService] Failed to parse tick from Redis: ${e}`);
          }
        }
      }
      if (chain.length > 0) return chain;
    }

    // Fallback to in-memory cache with exact key
    const memoryData = inMemoryChainCache.get(key);
    if (memoryData) {
      const memoryTicks = Object.values(memoryData).filter(
        tick => tick.strikePrice && tick.optionType && tick.openInterest >= 0
      );
      if (memoryTicks.length > 0) return memoryTicks;
    }

    // Dynamic fallback: find any active expiry key for this symbol
    for (const [k, v] of inMemoryChainCache.entries()) {
      if (k.startsWith(`flow:oi:${symbol}:`)) {
        const ticks = Object.values(v).filter(
          tick => tick.strikePrice && tick.optionType && tick.openInterest >= 0
        );
        if (ticks.length > 0) return ticks;
      }
    }

    return [];
  }

  /**
   * Get current active expiry date dynamically.
   */
  static getActiveExpiry(symbol?: string): string {
    if (symbol) {
      for (const k of inMemoryChainCache.keys()) {
        if (k.startsWith(`flow:oi:${symbol}:`)) {
          const parts = k.split(':');
          if (parts.length >= 4) return parts[3];
        }
      }
    }
    return SpotService.getNearestExpiry(symbol);
  }
}
