/**
 * SignalEngine — Deterministic Options Market Signal Generator
 *
 * The Intelligence Layer between raw option chain data and the AI narrative.
 *
 * All signal classifications are deterministic (no LLM, no randomness).
 * Every output carries a validity flag — invalid inputs produce invalid signals.
 *
 * Signals produced:
 * - PCR signal + trend direction
 * - Max Pain distance and zone signal
 * - IV rank and cost signal
 * - VIX mood signal
 * - Per-strike OI activity (Long Buildup / Short Buildup / Short Covering / Long Unwinding)
 * - Meaningful strike selection (11-15 strikes max for UI rendering)
 * - Overall agreement score (deterministic 0-100)
 * - Overall bias (bullish / neutral / bearish)
 */

import { OptionTick } from '../providers/IOptionsDataProvider';
import { PCRService } from './PCRService';
import { MaxPainService } from './MaxPainService';
import { IVService } from './IVService';
import { StrikeSelector } from './StrikeSelector';

// ── VIX thresholds for Indian market ─────────────────────────────────────────
const VIX_COMPLACENCY  = 12;
const VIX_NORMAL_HIGH  = 18;
const VIX_ELEVATED_HIGH = 25;

// ── PCR thresholds ────────────────────────────────────────────────────────────
const PCR_BULLISH_THRESHOLD = 1.3;
const PCR_BEARISH_THRESHOLD = 0.7;

// ── Max Pain distance threshold ───────────────────────────────────────────────
const MAX_PAIN_AT_SPOT_PCT = 0.5; // Within 0.5% = "at spot"

// ── OI Signal types ───────────────────────────────────────────────────────────
export type OISignal =
  | 'LONG_BUILDUP'
  | 'SHORT_BUILDUP'
  | 'SHORT_COVERING'
  | 'LONG_UNWINDING'
  | 'NEUTRAL';

export type PCRSignalType = 'bullish' | 'neutral' | 'bearish';
export type MaxPainSignalType = 'above_spot' | 'at_spot' | 'below_spot';
export type IVSignalType = 'elevated' | 'normal' | 'compressed';
export type VIXSignalType = 'fear' | 'elevated' | 'neutral' | 'complacency';
export type OverallBias = 'bullish' | 'neutral' | 'bearish';
export type DataQuality = 'live' | 'stale';

// ── Meaningful Strike ─────────────────────────────────────────────────────────
export interface MeaningfulStrike {
  strike:      number;
  label:       string;   // "Call Wall", "Put Wall", "ATM", etc.
  reasons:     string[]; // Why this strike was selected
  callOI:      number;
  callDOI:     number;   // Delta OI (change since session open)
  callLTP:     number;
  callSignal:  OISignal | null;
  putOI:       number;
  putDOI:      number;
  putLTP:      number;
  putSignal:   OISignal | null;
  isATM:       boolean;
  isMaxPain:   boolean;
}

// ── Full FlowIntelligence output ──────────────────────────────────────────────
export interface FlowIntelligence {
  symbol:          string;
  expiry:          string;
  dte:             number;
  spotPrice:       number;
  spotChange:      number;
  spotChangePct:   number;
  isSpotLive:      boolean;

  // Support & Resistance (Full Chain Walls)
  supportStrike:    number;
  supportOI:        number;
  resistanceStrike: number;
  resistanceOI:     number;

  // PCR
  pcrOI:           number;
  pcrSignal:       PCRSignalType;
  pcrIsValid:      boolean;
  totalCallOI:     number;
  totalPutOI:      number;

  // Max Pain
  maxPain:         number;
  maxPainSignal:   MaxPainSignalType;
  maxPainDistPct:  number; // % distance from spot (positive = above, negative = below)

  // IV
  atmIV:           number;
  atmStrike:       number;
  ivRank:          number;   // 0-100 (approximate without historical data)
  ivSignal:        IVSignalType;
  ivIsValid:       boolean;

  // VIX
  vix:             number;
  vixSignal:       VIXSignalType;
  isVixLive:       boolean;

  // Meaningful Strikes (11-15 max)
  meaningfulStrikes: MeaningfulStrike[];

  // Agreement Score (deterministic)
  agreementScore:  number;  // 0-100
  agreementCount:  number;  // how many of 4 signals agree
  overallBias:     OverallBias;

  // Support & Resistance (Highest Put OI / Highest Call OI)
  supportStrike?:    number;
  resistanceStrike?: number;
  maxPutOI?:         number;
  maxCallOI?:        number;

  // Market & Broker State
  isMarketClosed?: boolean;
  brokerStatus?:   'connected' | 'expired' | 'missing';
  brokerMessage?:  string | null;

  // Data Quality
  dataQuality:     DataQuality;
  dataAge:         number;  // seconds since last tick
  lastUpdated:     number;  // Unix ms
  generatedAt:     number;  // Unix ms (when signals were computed)
}

// ── SignalEngine ──────────────────────────────────────────────────────────────

export class SignalEngine {
  /**
   * Compute the full FlowIntelligence from raw inputs.
   * This is a pure deterministic function — given the same inputs, produces the same output.
   */
  static compute(params: {
    symbol:         string;
    expiry:         string;
    dte:            number;
    chain:          OptionTick[];
    spotPrice:      number;
    spotChange:     number;
    spotChangePct:   number;
    isSpotLive:     boolean;
    vix:            number | null;
    isVixLive:      boolean;
    dataQuality:    DataQuality;
    lastUpdated:    number;
    isMarketClosed?: boolean;
    brokerStatus?:   'connected' | 'expired' | 'missing';
    brokerMessage?:  string | null;
  }): FlowIntelligence {
    const {
      symbol, expiry, dte, chain,
      spotPrice, spotChange, spotChangePct, isSpotLive,
      vix, isVixLive, dataQuality, lastUpdated,
      isMarketClosed, brokerStatus, brokerMessage
    } = params;

    const now = Date.now();
    const dataAge = Math.round((now - lastUpdated) / 1000);

    // ── Primary Support & Resistance (Put Wall <= Spot & Call Wall >= Spot) ────────
    // Support (Put Wall): Highest Put OI at or below current spot price
    let supportStrike = 0;
    let supportOI = -1;
    let fallbackSupportStrike = 0;
    let fallbackSupportOI = -1;

    // Resistance (Call Wall): Highest Call OI at or above current spot price
    let resistanceStrike = 0;
    let resistanceOI = -1;
    let fallbackResistanceStrike = 0;
    let fallbackResistanceOI = -1;

    const maxSupportThreshold = spotPrice > 0 ? spotPrice * 1.005 : Infinity;
    const minResistanceThreshold = spotPrice > 0 ? spotPrice * 0.995 : 0;

    for (const tick of chain) {
      if (tick.optionType === 'PE') {
        if (tick.openInterest > fallbackSupportOI) {
          fallbackSupportOI = tick.openInterest;
          fallbackSupportStrike = tick.strikePrice;
        }
        if (tick.strikePrice <= maxSupportThreshold && tick.openInterest > supportOI) {
          supportOI = tick.openInterest;
          supportStrike = tick.strikePrice;
        }
      }
      if (tick.optionType === 'CE') {
        if (tick.openInterest > fallbackResistanceOI) {
          fallbackResistanceOI = tick.openInterest;
          fallbackResistanceStrike = tick.strikePrice;
        }
        if (tick.strikePrice >= minResistanceThreshold && tick.openInterest > resistanceOI) {
          resistanceOI = tick.openInterest;
          resistanceStrike = tick.strikePrice;
        }
      }
    }

    if (supportStrike === 0) supportStrike = fallbackSupportStrike;
    if (resistanceStrike === 0) resistanceStrike = fallbackResistanceStrike;

    // ── PCR ────────────────────────────────────────────────────────────────────
    const pcrResult  = PCRService.calculateOIPCR(chain);
    const pcrSignal  = pcrResult.isValid ? PCRService.classify(pcrResult.value) : 'neutral';

    // ── Max Pain ───────────────────────────────────────────────────────────────
    const maxPain = MaxPainService.calculateMaxPain(chain);
    let maxPainSignal: MaxPainSignalType = 'at_spot';
    let maxPainDistPct = 0;
    if (spotPrice > 0 && maxPain > 0) {
      maxPainDistPct = ((maxPain - spotPrice) / spotPrice) * 100;
      if (maxPainDistPct > MAX_PAIN_AT_SPOT_PCT)  maxPainSignal = 'above_spot';
      else if (maxPainDistPct < -MAX_PAIN_AT_SPOT_PCT) maxPainSignal = 'below_spot';
    }

    // ── IV ─────────────────────────────────────────────────────────────────────
    const ivResult = IVService.calculateAtmIV(chain, spotPrice);
    // Without 52-week historical data, estimate IVR using VIX as proxy.
    // VIX roughly correlates with ATM IV for NIFTY. IVR = (IV - 10) / (30 - 10) * 100
    const ivRank   = ivResult.isValid
      ? IVService.calculateIVRank(ivResult.value, 10, 30)
      : 50;
    const ivSignal = IVService.classifyIV(ivRank);

    // ── VIX ────────────────────────────────────────────────────────────────────
    const vixValue = vix ?? 0;
    const vixSignal: VIXSignalType = this.classifyVIX(vixValue);

    // ── VIX directional signal ─────────────────────────────────────────────────
    const vixBias: OverallBias = this.vixToBias(vixSignal);

    // ── Max Pain directional signal ────────────────────────────────────────────
    const maxPainBias: OverallBias = maxPainSignal === 'above_spot'
      ? 'bullish'  // Max Pain above spot → gravity pulls price up
      : maxPainSignal === 'below_spot'
        ? 'bearish'
        : 'neutral';

    // ── Agreement Score ────────────────────────────────────────────────────────
    // Each of the 4 signals votes bullish/neutral/bearish.
    // Agreement = how many vote the same as the plurality direction.
    const votes: OverallBias[] = [
      pcrSignal,
      maxPainBias,
      ivSignal === 'compressed' ? 'bullish' : ivSignal === 'elevated' ? 'bearish' : 'neutral',
      vixBias,
    ];

    const bullishVotes = votes.filter(v => v === 'bullish').length;
    const bearishVotes = votes.filter(v => v === 'bearish').length;
    const neutralVotes = votes.filter(v => v === 'neutral').length;

    let overallBias: OverallBias;
    let agreementCount: number;

    if (bullishVotes > bearishVotes && bullishVotes > neutralVotes) {
      overallBias    = 'bullish';
      agreementCount = bullishVotes;
    } else if (bearishVotes > bullishVotes && bearishVotes > neutralVotes) {
      overallBias    = 'bearish';
      agreementCount = bearishVotes;
    } else {
      overallBias    = 'neutral';
      agreementCount = neutralVotes;
    }

    // Map agreement count (1-4) to score (20-80)
    const agreementScore = Math.round((agreementCount / 4) * 100);

    // ── Support & Resistance (Maximum Put OI / Maximum Call OI) ──────────────
    let supportStrike = 0;
    let maxPutOI = 0;
    let resistanceStrike = 0;
    let maxCallOI = 0;

    for (const tick of chain) {
      if (tick.optionType === 'PE' && tick.openInterest > maxPutOI) {
        maxPutOI = tick.openInterest;
        supportStrike = tick.strikePrice;
      } else if (tick.optionType === 'CE' && tick.openInterest > maxCallOI) {
        maxCallOI = tick.openInterest;
        resistanceStrike = tick.strikePrice;
      }
    }

    // ── Meaningful Strikes ─────────────────────────────────────────────────────
    const meaningfulStrikes = StrikeSelector.select(chain, spotPrice, maxPain, spotChangePct);

    return {
      symbol,
      expiry,
      dte,
      spotPrice,
      spotChange,
      spotChangePct,
      isSpotLive,

<<<<<<< HEAD
      pcrOI:       pcrResult.isValid ? pcrResult.value : 1.0,
      pcrSignal:   pcrResult.isValid ? pcrSignal : 'neutral',
      pcrIsValid:  pcrResult.isValid,
=======
      supportStrike,
      supportOI,
      resistanceStrike,
      resistanceOI,

      pcrOI:       pcrResult.callOI > 0 ? pcrResult.value : 1.00,
      pcrSignal,
      pcrIsValid:  pcrResult.callOI > 0,
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
      totalCallOI: pcrResult.callOI,
      totalPutOI:  pcrResult.putOI,

      maxPain:         maxPain > 0 ? maxPain : (spotPrice > 0 ? Math.round(spotPrice / 50) * 50 : 0),
      maxPainSignal,
      maxPainDistPct:  Math.round(maxPainDistPct * 100) / 100,

      atmIV:       ivResult.isValid ? ivResult.value : (vixValue > 0 ? vixValue : 12.5),
      atmStrike:   ivResult.atmStrike || (spotPrice > 0 ? Math.round(spotPrice / 50) * 50 : 0),
      ivRank,
      ivSignal,
      ivIsValid:   ivResult.isValid,

      vix:         vixValue,
      vixSignal,
      isVixLive,

      meaningfulStrikes,

      // Direct Support & Resistance from max OI
      supportStrike:    supportStrike > 0 ? supportStrike : undefined,
      resistanceStrike: resistanceStrike > 0 ? resistanceStrike : undefined,
      maxPutOI:         maxPutOI > 0 ? maxPutOI : undefined,
      maxCallOI:        maxCallOI > 0 ? maxCallOI : undefined,

      agreementScore,
      agreementCount,
      overallBias,

      isMarketClosed,
      brokerStatus,
      brokerMessage,

      dataQuality,
      dataAge,
      lastUpdated,
      generatedAt: now,
    };
  }

  // ── VIX Classifiers ───────────────────────────────────────────────────────

  static classifyVIX(vix: number): VIXSignalType {
    if (vix <= 0) return 'neutral';
    if (vix < VIX_COMPLACENCY)  return 'complacency';
    if (vix < VIX_NORMAL_HIGH)  return 'neutral';
    if (vix < VIX_ELEVATED_HIGH) return 'elevated';
    return 'fear';
  }

  static vixToBias(vixSignal: VIXSignalType): OverallBias {
    if (vixSignal === 'fear')        return 'bearish';
    if (vixSignal === 'elevated')    return 'bearish';
    if (vixSignal === 'complacency') return 'bullish';
    return 'neutral';
  }

  /**
   * Classifies a per-strike OI signal based on price direction and ΔOI.
   * Price direction is computed from changeInOI perspective + underlying spot direction.
   *
   * @param spotChangePct  - Percentage change of underlying today
   * @param changeInOI     - Change in OI for this strike (positive = OI adding, negative = closing)
   */
  static classifyOISignal(spotChangePct: number, changeInOI: number): OISignal {
    const spotUp  = spotChangePct >= 0;
    const oiUp    = changeInOI > 0;

    if (spotUp  && oiUp)  return 'LONG_BUILDUP';
    if (!spotUp && oiUp)  return 'SHORT_BUILDUP';
    if (spotUp  && !oiUp) return 'SHORT_COVERING';
    if (!spotUp && !oiUp) return 'LONG_UNWINDING';
    return 'NEUTRAL';
  }
}
