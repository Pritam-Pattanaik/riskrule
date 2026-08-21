/**
 * PCRService — Put-Call Ratio Calculation with Validation
 *
 * PCR = Sum(Put OI) / Sum(Call OI)
 * Valid range for Indian index options: 0.3 to 4.0
 * Outside this range = data integrity issue — marked invalid.
 */

import { OptionTick } from '../providers/IOptionsDataProvider';

// Plausible PCR bounds for Indian index options
const PCR_MIN = 0.3;
const PCR_MAX = 4.0;

export interface PCRResult {
  value:    number;
  isValid:  boolean;
  callOI:   number;
  putOI:    number;
}

export class PCRService {
  /**
   * Calculates the Put-Call Ratio based on Open Interest.
   * Returns a validity flag — PCR outside 0.3–4.0 indicates data corruption.
   */
  static calculateOIPCR(chain: OptionTick[]): PCRResult {
    let callOI = 0;
    let putOI  = 0;

    for (const tick of chain) {
      if (tick.openInterest < 0) continue; // Skip corrupted OI values
      if (tick.optionType === 'CE') callOI += tick.openInterest;
      else if (tick.optionType === 'PE') putOI += tick.openInterest;
    }

    if (callOI === 0) {
      return { value: 0, isValid: false, callOI, putOI };
    }

    const pcr     = putOI / callOI;
    const isValid = pcr >= PCR_MIN && pcr <= PCR_MAX && !isNaN(pcr) && isFinite(pcr);

    return { value: Math.round(pcr * 10000) / 10000, isValid, callOI, putOI };
  }

  /**
   * Classifies PCR into a directional signal.
   * Based on historical Indian index options behavior.
   */
  static classify(pcr: number): 'bullish' | 'neutral' | 'bearish' {
    if (pcr > 1.3)  return 'bullish';  // More put protection = contrarian bullish
    if (pcr < 0.7)  return 'bearish';  // More call buying = market confident of rise? No — contrarian bearish (call wall building)
    return 'neutral';
  }

  /**
   * Volume PCR — less reliable but useful as confirmation.
   */
  static calculateVolumePCR(chain: OptionTick[]): PCRResult {
    let callVol = 0;
    let putVol  = 0;

    for (const tick of chain) {
      if (tick.volume < 0) continue;
      if (tick.optionType === 'CE') callVol += tick.volume;
      else if (tick.optionType === 'PE') putVol += tick.volume;
    }

    if (callVol === 0) {
      return { value: 0, isValid: false, callOI: callVol, putOI: putVol };
    }

    const pcr     = putVol / callVol;
    const isValid = pcr >= PCR_MIN && pcr <= PCR_MAX && isFinite(pcr);

    return { value: Math.round(pcr * 10000) / 10000, isValid, callOI: callVol, putOI: putVol };
  }
}
