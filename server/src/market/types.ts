/**
 * Canonical Market Data Models — RiskRules V2
 *
 * Every provider MUST normalize its response into these types.
 * The frontend never sees provider-specific shapes.
 */

// ─── Market Quote ─────────────────────────────────────────────────────────────

export type MarketStatus = 'OPEN' | 'CLOSED' | '24/7';
export type TrendDirection = 'up' | 'down' | 'flat';
export type ProviderName = 'yahoo' | 'moneycontrol' | 'cache';

export interface MarketQuote {
  id: string;             // Stable display key: 'nifty', 'sensex', 'btc', etc.
  symbol: string;         // Raw symbol: '^NSEI', 'GC=F', etc.
  name: string;           // Display name: 'NIFTY 50'
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  marketCap?: number;
  status: MarketStatus;
  updatedAt: number;      // Unix milliseconds
  sparkline: number[];    // Intraday close prices for mini chart
  provider: ProviderName;
  flash?: 'up' | 'down' | null; // Frontend-only flash indicator
}

// ─── Chart Candle ─────────────────────────────────────────────────────────────

export interface ChartCandle {
  time: number;   // Unix seconds (lightweight-charts format)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  value: number;  // Same as close — for area chart series
}

// ─── News Article ─────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: number;  // Unix seconds
  imageUrl?: string;
  category?: string;    // 'markets' | 'earnings' | 'economy' | 'general'
  relatedSymbols?: string[];
}

// ─── Sector Performance ───────────────────────────────────────────────────────

export interface SectorQuote {
  id: string;
  name: string;
  symbol: string;
  changePercent: number;
  volume?: number;
  isLive: boolean;
  provider: ProviderName;
}

// ─── AI Market Summary ────────────────────────────────────────────────────────

export type MarketSentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'MIXED';

export interface MarketSummary {
  sentiment: MarketSentiment;
  highlights: string[];
  risks: string[];
  eventsToWatch: string[];
  educationalInsight: string;
  disclaimer: string;
  generatedAt: number;   // Unix ms
}

// ─── Economic Calendar Event ──────────────────────────────────────────────────

export type EventImpact = 'high' | 'medium' | 'low';

export interface CalendarEvent {
  id: string;
  title: string;
  country: string;          // 'IN', 'US', 'EU', etc.
  countryFlag: string;      // '🇮🇳', '🇺🇸', etc.
  date: string;             // 'YYYY-MM-DD'
  time: string;             // 'HH:MM' in IST
  timezone: string;         // 'IST', 'EST', etc.
  impact: EventImpact;
  forecast?: string;
  previous?: string;
  actual?: string | null;
  description?: string;
}

// ─── Provider Health ──────────────────────────────────────────────────────────

export interface ProviderHealth {
  name: ProviderName;
  healthy: boolean;
  failCount: number;
  lastFailAt: number | null;
  lastSuccessAt: number | null;
  recoveryAt: number | null;  // When to next attempt if unhealthy
}

// ─── Symbol Map ───────────────────────────────────────────────────────────────

export interface SymbolDefinition {
  id: string;
  symbol: string;
  name: string;
  category: 'index' | 'commodity' | 'currency' | 'crypto';
}

export const TRACKED_SYMBOLS: SymbolDefinition[] = [
  { id: 'nifty',      symbol: '^NSEI',        name: 'NIFTY 50',     category: 'index'    },
  { id: 'banknifty',  symbol: '^NSEBANK',      name: 'BANK NIFTY',   category: 'index'    },
  { id: 'finnifty',   symbol: '^CNXFINANCE',   name: 'FIN NIFTY',    category: 'index'    },
  { id: 'sensex',     symbol: '^BSESN',        name: 'SENSEX',       category: 'index'    },
  { id: 'vix',        symbol: '^INDIAVIX',     name: 'INDIA VIX',    category: 'index'    },
  { id: 'usdinr',     symbol: 'USDINR=X',      name: 'USD/INR',      category: 'currency' },
  { id: 'gold',       symbol: 'GC=F',          name: 'Gold',         category: 'commodity'},
  { id: 'silver',     symbol: 'SI=F',          name: 'Silver',       category: 'commodity'},
  { id: 'crude',      symbol: 'CL=F',          name: 'Crude Oil',    category: 'commodity'},
];

export const SECTOR_SYMBOLS: SymbolDefinition[] = [
  { id: 'niftyit',    symbol: '^CNXIT',               name: 'NIFTY IT',     category: 'index'   },
  { id: 'niftyauto',  symbol: '^CNXAUTO',             name: 'NIFTY AUTO',   category: 'index'   },
  { id: 'niftypharma',symbol: '^CNXPHARMA',           name: 'NIFTY PHARMA', category: 'index'   },
  { id: 'niftymetal', symbol: '^CNXMETAL',            name: 'NIFTY METAL',  category: 'index'   },
  { id: 'niftyfmcg',  symbol: '^CNXFMCG',             name: 'NIFTY FMCG',   category: 'index'   },
  { id: 'niftyenergy',symbol: '^CNXENERGY',           name: 'NIFTY ENERGY', category: 'index'   },
  { id: 'niftyrealty',symbol: '^CNXREALTY',           name: 'NIFTY REALTY', category: 'index'   },
];

// ─── Timeframe Map ────────────────────────────────────────────────────────────

export const TIMEFRAME_MAP: Record<string, { interval: string; range: string; cacheTtlSec: number }> = {
  // Intraday charts (1m candles) — refresh every 5 minutes while market is open
  '1D':  { interval: '1m',  range: '1d',  cacheTtlSec: 300  },
  '5D':  { interval: '5m',  range: '5d',  cacheTtlSec: 300  },
  // Medium-term daily charts — refresh every 10 minutes (data changes less frequently)
  '1M':  { interval: '1d',  range: '1mo', cacheTtlSec: 600  },
  '3M':  { interval: '1d',  range: '3mo', cacheTtlSec: 600  },
  // Long-term daily charts — refresh every 15 minutes (minimal intraday change)
  '6M':  { interval: '1d',  range: '6mo', cacheTtlSec: 900  },
  '1Y':  { interval: '1d',  range: '1y',  cacheTtlSec: 900  },
  'YTD': { interval: '1d',  range: 'ytd', cacheTtlSec: 900  },
  // Max range monthly candles — essentially static; cache for 1 hour
  'Max': { interval: '1mo', range: 'max', cacheTtlSec: 3600 },
};
