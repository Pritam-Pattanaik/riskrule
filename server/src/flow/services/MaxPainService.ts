import { OptionTick } from '../providers/IOptionsDataProvider';

export class MaxPainService {
  /**
   * Calculates the Max Pain strike price.
   * Max Pain is the strike price where option buyers lose the most money (and option sellers gain the most).
   */
  static calculateMaxPain(chain: OptionTick[]): number {
    if (chain.length === 0) return 0;

    // 1. Get all unique strikes
    const strikes = [...new Set(chain.map(tick => tick.strikePrice))].sort((a, b) => a - b);
    
    let minPain = Infinity;
    let maxPainStrike = 0;

    // 2. For each strike, calculate the total pain (intrinsic value * open interest)
    for (const testStrike of strikes) {
      let currentPain = 0;

      for (const tick of chain) {
        if (tick.optionType === 'CE') {
          // For calls, pain = max(0, testStrike - strikePrice) * openInterest
          if (testStrike > tick.strikePrice) {
            currentPain += (testStrike - tick.strikePrice) * tick.openInterest;
          }
        } else if (tick.optionType === 'PE') {
          // For puts, pain = max(0, strikePrice - testStrike) * openInterest
          if (testStrike < tick.strikePrice) {
            currentPain += (tick.strikePrice - testStrike) * tick.openInterest;
          }
        }
      }

      if (currentPain < minPain) {
        minPain = currentPain;
        maxPainStrike = testStrike;
      }
    }

    return maxPainStrike;
  }
}
