/**
 * StrikeSelector — Meaningful Strikes Algorithm
 *
 * Selects 11-15 most informative strikes from the full option chain.
 * Based on the principle that 80%+ of retail trading decisions only need:
 * - ATM and nearby strikes (context)
 * - Highest OI strikes (where money is concentrated = support/resistance)
 * - Highest ΔOI strikes (where money is actively moving = momentum)
 * - Max Pain level (expiry gravity zone)
 *
 * The full chain remains available via Expert Mode — this selection
 * is for the default experience only.
 */

import { OptionTick } from '../providers/IOptionsDataProvider';
import { MeaningfulStrike, OISignal, SignalEngine } from './SignalEngine';

// ── Target count ──────────────────────────────────────────────────────────────
const MIN_STRIKES = 11;
const MAX_STRIKES = 15;

// ── OI signal label maps ──────────────────────────────────────────────────────
const OI_SIGNAL_LABELS: Record<OISignal, { expert: string; guided: string }> = {
  LONG_BUILDUP:   { expert: 'Long Buildup ↑',     guided: 'Buyers Adding ↑' },
  SHORT_BUILDUP:  { expert: 'Short Buildup ↓',    guided: 'Sellers Adding ↓' },
  SHORT_COVERING: { expert: 'Short Covering ↑',   guided: 'Sellers Retreating ↑' },
  LONG_UNWINDING: { expert: 'Long Unwinding ↓',   guided: 'Buyers Giving Up ↓' },
  NEUTRAL:        { expert: 'Neutral',             guided: 'Stable' },
};

export class StrikeSelector {
  /**
   * Select 11-15 meaningful strikes from the full option chain.
   *
   * @param chain      - Full option chain (all strikes from ChainService)
   * @param spotPrice  - Current spot price (from SpotService — not hardcoded)
   * @param maxPain    - Max Pain strike (from MaxPainService)
   * @returns Sorted array of 11-15 MeaningfulStrike objects
   */
  static select(
    chain: OptionTick[],
    spotPrice: number,
    maxPain: number,
    spotChangePct: number = 0,
  ): MeaningfulStrike[] {
    if (spotPrice <= 0) return [];

    if (chain.length === 0) {
      // No real data yet — return empty so UI shows '---' rather than fake values
      return [];
    }


    // ── Step 1: Build strike map (CE and PE per strike) ────────────────────
    const strikeMap = new Map<number, { ce: OptionTick | null; pe: OptionTick | null }>();
    for (const tick of chain) {
      if (!strikeMap.has(tick.strikePrice)) {
        strikeMap.set(tick.strikePrice, { ce: null, pe: null });
      }
      const entry = strikeMap.get(tick.strikePrice)!;
      if (tick.optionType === 'CE') entry.ce = tick;
      else if (tick.optionType === 'PE') entry.pe = tick;
    }
    const allStrikes = [...strikeMap.keys()].sort((a, b) => a - b);
    if (allStrikes.length === 0) return [];

    // ── Step 2: Find ATM (nearest to spot) ─────────────────────────────────
    const atmStrike = allStrikes.reduce((prev, curr) =>
      Math.abs(curr - spotPrice) < Math.abs(prev - spotPrice) ? curr : prev
    );
    const atmIdx = allStrikes.indexOf(atmStrike);

    // ── Step 3: Identify high-OI and high-ΔOI strikes ──────────────────────
    let callWall1 = 0, callWall2 = 0, highCallDOI = 0;
    let putWall1  = 0, putWall2  = 0, highPutDOI  = 0;
    let maxCallOI = -Infinity, secondCallOI = -Infinity;
    let maxPutOI  = -Infinity, secondPutOI  = -Infinity;
    let maxCallDOI = -Infinity, maxPutDOI   = -Infinity;

    for (const [strike, entry] of strikeMap) {
      // Call walls
      if (entry.ce) {
        if (entry.ce.openInterest > maxCallOI) {
          secondCallOI = maxCallOI; callWall2 = callWall1;
          maxCallOI = entry.ce.openInterest; callWall1 = strike;
        } else if (entry.ce.openInterest > secondCallOI) {
          secondCallOI = entry.ce.openInterest; callWall2 = strike;
        }
        // ΔOI
        const ceDOI = Math.abs((entry.ce as any).changeInOI ?? 0);
        if (ceDOI > maxCallDOI) { maxCallDOI = ceDOI; highCallDOI = strike; }
      }
      // Put walls
      if (entry.pe) {
        if (entry.pe.openInterest > maxPutOI) {
          secondPutOI = maxPutOI; putWall2 = putWall1;
          maxPutOI = entry.pe.openInterest; putWall1 = strike;
        } else if (entry.pe.openInterest > secondPutOI) {
          secondPutOI = entry.pe.openInterest; putWall2 = strike;
        }
        const peDOI = Math.abs((entry.pe as any).changeInOI ?? 0);
        if (peDOI > maxPutDOI) { maxPutDOI = peDOI; highPutDOI = strike; }
      }
    }

    // ── Step 4: Candidate set ───────────────────────────────────────────────
    const candidates = new Map<number, Set<string>>();

    const add = (strike: number, reason: string) => {
      if (strike <= 0 || !strikeMap.has(strike)) return;
      if (!candidates.has(strike)) candidates.set(strike, new Set());
      candidates.get(strike)!.add(reason);
    };

    // Priority selections
    add(callWall1,  'highest_call_oi');
    add(callWall2,  'second_call_oi');
    add(highCallDOI,'highest_call_doi');
    add(atmStrike,  'atm');
    // ATM neighbors
    if (atmIdx > 0)                         add(allStrikes[atmIdx - 1], 'atm_minus_1');
    if (atmIdx < allStrikes.length - 1)     add(allStrikes[atmIdx + 1], 'atm_plus_1');
    add(putWall1,   'highest_put_oi');
    add(putWall2,   'second_put_oi');
    add(highPutDOI, 'highest_put_doi');
    if (maxPain > 0) add(maxPain, 'max_pain');

    // ── Step 5: Fill to MIN_STRIKES with ATM neighbors ──────────────────────
    let extraOffset = 2;
    while (candidates.size < MIN_STRIKES && extraOffset <= 5) {
      const below = atmIdx >= extraOffset ? allStrikes[atmIdx - extraOffset] : 0;
      const above  = atmIdx + extraOffset < allStrikes.length ? allStrikes[atmIdx + extraOffset] : 0;
      if (below) add(below, `atm_minus_${extraOffset}`);
      if (above) add(above, `atm_plus_${extraOffset}`);
      extraOffset++;
    }

    // ── Step 6: Trim to MAX_STRIKES by removing low-priority strikes ────────
    let selectedStrikes = [...candidates.keys()].sort((a, b) => a - b);
    while (selectedStrikes.length > MAX_STRIKES) {
      // Remove edge strikes that have fewest reasons
      const minReasons = Math.min(...selectedStrikes.map(s => candidates.get(s)!.size));
      const toRemove = selectedStrikes.find(s =>
        candidates.get(s)!.size === minReasons &&
        s !== atmStrike &&
        s !== callWall1 &&
        s !== putWall1 &&
        s !== maxPain
      );
      if (toRemove) {
        selectedStrikes = selectedStrikes.filter(s => s !== toRemove);
        candidates.delete(toRemove);
      } else {
        break; // Can't trim further safely
      }
    }

    // ── Step 7: Build MeaningfulStrike objects ──────────────────────
    return selectedStrikes.map(strike => {
      const reasons   = [...(candidates.get(strike) ?? [])];
      const entry     = strikeMap.get(strike)!;
      const isATM     = strike === atmStrike;
      const isMaxPain = strike === maxPain;

      const ceChangeInOI  = (entry.ce as any)?.changeInOI ?? 0;
      const peChangeInOI  = (entry.pe as any)?.changeInOI ?? 0;

      // OI signals: Call options move positively with spot; Put options move inversely
      const ceSignal: OISignal | null = entry.ce
        ? SignalEngine.classifyOISignal(spotChangePct, ceChangeInOI)
        : null;
      const peSignal: OISignal | null = entry.pe
        ? SignalEngine.classifyOISignal(-spotChangePct, peChangeInOI)
        : null;

      return {
        strike,
        label:       this.buildLabel(reasons, isATM, isMaxPain),
        reasons,
        callOI:      entry.ce?.openInterest ?? 0,
        callDOI:     ceChangeInOI,
        callLTP:     entry.ce?.ltp ?? 0,
        callSignal:  ceSignal,
        putOI:       entry.pe?.openInterest ?? 0,
        putDOI:      peChangeInOI,
        putLTP:      entry.pe?.ltp ?? 0,
        putSignal:   peSignal,
        isATM,
        isMaxPain,
      } as MeaningfulStrike;
    });
  }

  private static buildLabel(reasons: string[], isATM: boolean, isMaxPain: boolean): string {
    if (isATM && isMaxPain) return 'ATM + Expiry Zone';
    if (isATM) return 'ATM';
    if (isMaxPain) return 'Expiry Zone';
    if (reasons.includes('highest_call_oi')) return 'Call Wall';
    if (reasons.includes('second_call_oi'))  return 'Call Resistance';
    if (reasons.includes('highest_put_oi'))  return 'Put Wall';
    if (reasons.includes('second_put_oi'))   return '2nd Support';
    if (reasons.includes('highest_call_doi'))return 'Active Calls';
    if (reasons.includes('highest_put_doi')) return 'Active Puts';
    return 'Notable';
  }

  /**
   * Provides the full OI signal label for display.
   */
  static getSignalLabel(signal: OISignal, mode: 'expert' | 'guided'): string {
    return OI_SIGNAL_LABELS[signal]?.[mode] ?? signal;
  }
}
