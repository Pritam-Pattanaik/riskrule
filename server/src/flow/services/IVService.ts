/**
 * IVService — Implied Volatility Analysis
 *
 * Calculates ATM IV using the actual spot price (not a hardcoded value).
 * The spot price must be passed in from SpotService — this service
 * never fetches market data directly.
 */

import { OptionTick } from '../providers/IOptionsDataProvider';

// ── Validation ranges ─────────────────────────────────────────────────────────
const IV_MIN = 3;    // IV cannot be below 3% for index options
const IV_MAX = 150;  // IV above 150% is unrealistic for index options

export interface ATMIVResult {
  value:      number;  // IV percentage (e.g. 15.56)
  atmStrike:  number;  // The strike identified as ATM
  isValid:    boolean; // false if IV is out of plausible range
}

export class IVService {
  /**
   * Calculates ATM Implied Volatility using the actual spot price.
   *
   * @param chain       - Full option chain ticks
   * @param spotPrice   - Current spot price (from SpotService, never hardcoded)
   * @returns ATMIVResult with validity flag
   */
  static calculateAtmIV(chain: OptionTick[], spotPrice: number): ATMIVResult {
    if (chain.length === 0 || spotPrice <= 0) {
      return { value: 0, atmStrike: 0, isValid: false };
    }

    // Find the strike closest to actual spot price
    let closestStrike = chain[0].strikePrice;
    let minDiff = Math.abs(chain[0].strikePrice - spotPrice);

    for (const tick of chain) {
      const diff = Math.abs(tick.strikePrice - spotPrice);
      if (diff < minDiff) {
        minDiff = diff;
        closestStrike = tick.strikePrice;
      }
    }

    // Get CE and PE IV for the ATM strike
    const atmTicks = chain.filter(
      t => t.strikePrice === closestStrike &&
           t.impliedVolatility !== undefined &&
           t.impliedVolatility > 0
    );

    if (atmTicks.length === 0) {
      return { value: 0, atmStrike: closestStrike, isValid: false };
    }

    // Average CE and PE IV at ATM
    const totalIv = atmTicks.reduce((sum, tick) => sum + (tick.impliedVolatility ?? 0), 0);
    const avgIv   = totalIv / atmTicks.length;

    // Validate IV is within plausible range
    const isValid = avgIv >= IV_MIN && avgIv <= IV_MAX;

    return {
      value:     isValid ? Math.round(avgIv * 100) / 100 : 0,
      atmStrike: closestStrike,
      isValid,
    };
  }

  /**
   * Computes IV Rank (0-100) given current IV and the range over a lookback period.
   * Higher = more expensive options (good time to sell premium).
   * Lower = cheaper options (good time to buy).
   *
   * @param currentIv  - Current ATM IV
   * @param ivLow52    - 52-week low IV (from historical data or approximation)
   * @param ivHigh52   - 52-week high IV
   */
  static calculateIVRank(currentIv: number, ivLow52: number, ivHigh52: number): number {
    if (ivHigh52 <= ivLow52 || currentIv <= 0) return 50; // default neutral
    const rank = ((currentIv - ivLow52) / (ivHigh52 - ivLow52)) * 100;
    return Math.round(Math.max(0, Math.min(100, rank)));
  }

  /**
   * Classifies IV rank into a human-readable signal.
   */
  static classifyIV(ivRank: number): 'elevated' | 'normal' | 'compressed' {
    if (ivRank >= 70) return 'elevated';
    if (ivRank <= 30) return 'compressed';
    return 'normal';
  }
}
