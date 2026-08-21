import { OptionTick } from '../providers/IOptionsDataProvider';

// Standard normal cumulative distribution function
function cnd(x: number): number {
  const a1 = 0.319381530;
  const a2 = -0.356563782;
  const a3 = 1.781477937;
  const a4 = -1.821255978;
  const a5 = 1.330274429;
  const l = Math.abs(x);
  const k = 1.0 / (1.0 + 0.2316419 * l);
  let w = 1.0 - 1.0 / Math.sqrt(2 * Math.PI) * Math.exp(-l * l / 2) * (a1 * k + a2 * k * k + a3 * Math.pow(k, 3) + a4 * Math.pow(k, 4) + a5 * Math.pow(k, 5));
  if (x < 0) {
    w = 1.0 - w;
  }
  return w;
}

// Standard normal probability density function
function pdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export class GreeksEngine {
  /**
   * Calculate Black-Scholes Greeks
   * @param S Current underlying price
   * @param K Strike price
   * @param T Time to expiration in years
   * @param r Risk-free interest rate (e.g., 0.05 for 5%)
   * @param sigma Implied volatility (e.g., 0.2 for 20%)
   * @param type Option type: 'CE' or 'PE'
   */
  static calculate(S: number, K: number, T: number, r: number, sigma: number, type: 'CE' | 'PE'): Greeks {
    if (T <= 0 || sigma <= 0 || S <= 0 || K <= 0) {
      return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
    }

    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2.0) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const Nd1 = cnd(d1);
    const Nd2 = cnd(d2);
    const nd1 = pdf(d1);

    const gamma = nd1 / (S * sigma * Math.sqrt(T));
    const vega = (S * nd1 * Math.sqrt(T)) / 100;

    let delta = 0;
    let theta = 0;
    let rho = 0;

    if (type === 'CE') {
      delta = Nd1;
      theta = (-(S * sigma * nd1) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2) / 365;
      rho = (K * T * Math.exp(-r * T) * Nd2) / 100;
    } else {
      delta = Nd1 - 1;
      theta = (-(S * sigma * nd1) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * cnd(-d2)) / 365;
      rho = (-K * T * Math.exp(-r * T) * cnd(-d2)) / 100;
    }

    return { delta, gamma, theta, vega, rho };
  }
}
