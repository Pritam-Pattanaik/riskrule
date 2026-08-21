import { prisma } from '../../db';
import { createNotification } from '../../services/notificationService';
import { OptionTick } from '../providers/IOptionsDataProvider';
import { logger } from '../../lib/logger';

interface CachedAlert {
  id: string;
  userId: string;
  symbol: string;
  strike: number | null;
  optionType: string | null;
  alertType: string;
  threshold: any;
  direction: string;
  cooldownSeconds: number;
  lastTriggeredAt: Date | null;
  isActive: boolean;
}

export class AlertEngine {
  // In-memory cache key: `${symbol}:${strike}:${optionType}`
  private static alertMap = new Map<string, CachedAlert[]>();
  private static lastLoadedAt = 0;
  private static readonly CACHE_TTL_MS = 60_000; // 60s background refresh
  private static isRefreshing = false;

  /**
   * Refreshes in-memory alert cache from DB.
   * Safe against concurrent calls.
   */
  public static async refreshCache(): Promise<void> {
    if (this.isRefreshing) return;
    this.isRefreshing = true;

    try {
      const activeAlerts = await prisma.optionAlert.findMany({
        where: { isActive: true },
      });

      const newMap = new Map<string, CachedAlert[]>();

      for (const alert of activeAlerts) {
        const key = this.getCacheKey(alert.symbol, alert.strike, alert.optionType);
        const list = newMap.get(key) || [];
        list.push(alert as CachedAlert);
        newMap.set(key, list);
      }

      this.alertMap = newMap;
      this.lastLoadedAt = Date.now();
      logger.debug(`[AlertEngine] Cache refreshed: ${activeAlerts.length} active alerts`);
    } catch (error: any) {
      // Don't crash ingestion if DB query fails during quota / network issues
      logger.warn(`[AlertEngine] Cache refresh failed: ${error.message}`);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Invalidates cache immediately (call after alert create/delete/update)
   */
  public static invalidate(): void {
    this.lastLoadedAt = 0;
    this.refreshCache().catch(() => {});
  }

  private static getCacheKey(symbol: string, strike: number | null, optionType: string | null): string {
    return `${(symbol || '').toUpperCase()}:${strike ?? 0}:${optionType || ''}`;
  }

  /**
   * Processes a new tick against in-memory active alerts.
   * Zero DB queries on non-matching ticks!
   */
  static async check(tick: OptionTick): Promise<void> {
    try {
      // 1. Refresh cache in background if stale
      if (Date.now() - this.lastLoadedAt > this.CACHE_TTL_MS) {
        this.refreshCache().catch(() => {});
      }

      // 2. Exact match in-memory lookup
      const key = this.getCacheKey(tick.symbol, tick.strikePrice, tick.optionType);
      const matchingAlerts = this.alertMap.get(key);

      if (!matchingAlerts || matchingAlerts.length === 0) {
        return; // Fast path: 0 DB queries!
      }

      const now = new Date();

      for (const alert of matchingAlerts) {
        // Enforce cooldown in memory
        if (alert.lastTriggeredAt) {
          const secondsSince = (now.getTime() - new Date(alert.lastTriggeredAt).getTime()) / 1000;
          if (secondsSince < alert.cooldownSeconds) {
            continue;
          }
        }

        let isTriggered = false;
        let currentValue = 0;

        switch (alert.alertType) {
          case 'OI_CHANGE':
            currentValue = tick.openInterest;
            isTriggered = alert.direction === 'ABOVE'
              ? currentValue > Number(alert.threshold)
              : currentValue < Number(alert.threshold);
            break;

          case 'PRICE_BREAKOUT':
            currentValue = tick.ltp;
            isTriggered = alert.direction === 'ABOVE'
              ? currentValue > Number(alert.threshold)
              : currentValue < Number(alert.threshold);
            break;

          case 'IV_SPIKE':
            currentValue = tick.impliedVolatility || 0;
            isTriggered = alert.direction === 'ABOVE'
              ? currentValue > Number(alert.threshold)
              : currentValue < Number(alert.threshold);
            break;
        }

        if (isTriggered) {
          // Immediately update in-memory timestamp to prevent double triggers
          alert.lastTriggeredAt = now;

          // Asynchronously persist and notify
          this.triggerAlert(alert, tick, currentValue, now).catch((err) => {
            logger.error(`[AlertEngine] Trigger alert error for ${alert.id}:`, err);
          });
        }
      }
    } catch (error) {
      logger.error(`[AlertEngine] Error checking alerts for ${tick.symbol}:`, error);
    }
  }

  private static async triggerAlert(alert: CachedAlert, tick: OptionTick, triggerValue: number, now: Date) {
    try {
      // 1. Record history
      const history = await prisma.alertHistory.create({
        data: {
          alertId: alert.id,
          userId: alert.userId,
          symbol: alert.symbol,
          strike: alert.strike,
          alertType: alert.alertType,
          triggerValue,
          thresholdValue: alert.threshold,
          aiExplanation: `Your alert for ${alert.symbol} ${alert.strike || ''}${alert.optionType || ''} triggered because ${alert.alertType} reached ${triggerValue}.`,
          wasRead: false,
        }
      });

      // 2. Update DB cooldown
      await prisma.optionAlert.update({
        where: { id: alert.id },
        data: { lastTriggeredAt: now }
      });

      // 3. Send global notification
      await createNotification({
        userId: alert.userId,
        title: `Flow Alert: ${alert.symbol}`,
        description: history.aiExplanation || '',
        category: 'Market',
        priority: 'Warning',
      });
    } catch (err: any) {
      logger.error(`[AlertEngine] Failed to persist triggered alert ${alert.id}:`, err.message);
    }
  }
}
