export interface Trade {
  id: string;
  date: string;           // ISO string — entry time (when position was opened)
  exitTime?: string | null; // ISO string — when position was squared off (null for OPEN)
  isCarryForward?: boolean; // true when entry date ≠ exit date (overnight / multi-day hold)
  symbol: string;
  market: string;
  instrumentType: string;
  direction: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  charges: number;
  netPnl: number;
  status: string;
  strategyId?: string;
  strategyName?: string;
  setupDescription?: string;
  mindset?: string;
  decisionNotes?: string;
  learnings?: string;
  disciplineScore?: number;
  disciplineRawScore?: number | null;
  confidence?: number | null;
  tradingStyle?: string | null;
  behaviourProfile?: any | null;
  disciplineSignals?: Record<string, number>;
  disciplineBreakdown?: Record<string, number>;
  disciplineReasons?: string[];
  isManualOverride?: boolean;
  manualScore?: number | null;
  tags?: string[];
  stopLoss?: number | null;
  mistakes?: string[];
  checklist?: Record<string, boolean>;
  source: string;
}

export interface Strategy {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  rules?: string;
  market?: string[];
  timeframe?: string;
  isActive: boolean;
  isDefault?: boolean;
  totalPnl: number;
  winRate: number;
  tradeCount: number;
  tradesCount?: number;
  avgPnl: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  marketBias?: 'bullish' | 'bearish' | 'neutral';
  keyLevels?: string;
  watchlist?: string;
  newsNotes?: string;
  reflection?: string;
  whatWentWell?: string;
  whatToImprove?: string;
  mood?: string;
  overallDiscipline?: number;
  tags?: string[];
  image?: string;
}

export interface EnrichedNews {
  id: string;
  headline: string;
  url: string;
  publishedAt: number;
  source: string;
  image?: string;
  originalSummary?: string;
  aiSummary: string;
  tldr: string;
  whyItMatters: string;
  historicalContext: string;
  categories: string[];
  sectors: string[];
  companies: string[];
  financialTerms: { term: string; definition: string }[];
  shortTermImpact?: string;
  longTermImpact?: string;
  whatToWatchNext?: string;
  riskFactors?: string;
  probability?: number;
  confidence?: number;
  marketImpact?: { asset: string; impact: string; sentiment: string }[];
}

export interface AIInsight {
  id: string;
  type: 'deep_analysis' | 'weekly_digest' | 'trade_feedback';
  content: string;
  tradesAnalyzedCount: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  createdAt: string;
}

export interface AiMessage {
  id?: string;
  conversationId?: string;
  role: 'user' | 'assistant';
  content: string;
  disciplineEvaluation?: any;
  promptVersion?: string;
  feedback?: 'up' | 'down' | null;
  createdAt?: string;
}

export interface AiConversation {
  id: string;
  userId: string;
  title: string;
  preview?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: Record<string, number>;
}

export const BREAKDOWN_LABELS: { key: string; label: string }[] = [
  { key: 'entryTiming',       label: 'Entry Timing' },
  { key: 'holdTime',          label: 'Hold Time' },
  { key: 'sizing',            label: 'Position Size' },
  { key: 'revenge',           label: 'Revenge Avoidance' },
  { key: 'consistency',       label: 'Risk Consistency' },
  { key: 'personalRules',     label: 'Rule Compliance' },
];

export interface BrokerConnection {
  id: string;
  // Use string instead of a union — the registry (brokerRegistry.ts) is the source of truth
  // for all valid providerIds. A hardcoded union here silently breaks for Dhan, Delta, etc.
  broker: string;
  clientId: string;
  isActive: boolean;
  lastSyncedAt?: string;
  tokenExpiry?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  timezone: string;
}

export interface TradingRules {
  id?: string;
  windowStart?: string | null;           // "10:00" (IST 24h)
  windowEnd?: string | null;             // "14:00" (IST 24h)
  maxTradesPerDay?: number | null;
  maxDailyLoss?: number | null;          // INR
  maxLossPerTrade?: number | null;       // INR
  allowedInstruments?: string[] | null;  // CE | PE | FUT | EQ
  allowedMarkets?: string[] | null;      // F&O | NSE | BSE | MCX
  killSwitchEnabled?: boolean | null;    // Prop Trading emergency lock
  coolOffUntil?: string | null;          // ISO datetime timestamp for 24-hr lock
  syncCadence?: 'STREAMING_REALTIME' | 'PERIODIC_15M' | 'EOD_CLOSE' | 'MANUAL' | null;
  description?: string | null;           // Trading Manifesto & rules description
  customRules?: string[] | null;         // Selected / written discipline rules list
}

export interface DashboardStats {
  totalPnl: number;
  winRate: number;
  avgRR: number;
  avgDiscipline: number;
  totalTrades: number;
}

export type PCRSignalType = 'bullish' | 'neutral' | 'bearish';
export type MaxPainSignalType = 'above_spot' | 'at_spot' | 'below_spot';
export type IVSignalType = 'elevated' | 'normal' | 'compressed';
export type VIXSignalType = 'fear' | 'elevated' | 'neutral' | 'complacency';
export type OverallBias = 'bullish' | 'neutral' | 'bearish';

export interface MeaningfulStrike {
  strike: number;
  label: string;
  reasons: string[];
  callOI: number;
  callDOI: number;
  callLTP: number;
  callSignal: 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'SHORT_COVERING' | 'LONG_UNWINDING' | 'NEUTRAL' | null;
  putOI: number;
  putDOI: number;
  putLTP: number;
  putSignal: 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'SHORT_COVERING' | 'LONG_UNWINDING' | 'NEUTRAL' | null;
  isATM: boolean;
  isMaxPain: boolean;
}

export interface FlowIntelligence {
  symbol: string;
  expiry: string;
  dte: number;
  spotPrice: number;
  spotChange: number;
  spotChangePct: number;
  isSpotLive?: boolean;
  supportStrike?: number;
  supportOI?: number;
  resistanceStrike?: number;
  resistanceOI?: number;
  maxPutOI?: number;
  maxCallOI?: number;
  pcrOI: number;
  pcrVol?: number;
  pcrSignal: PCRSignalType;
  pcrIsValid?: boolean;
  totalCallOI?: number;
  totalPutOI?: number;
  maxPain: number;
  maxPainDistPct: number;
  maxPainSignal: MaxPainSignalType;
  atmIV: number;
  atmStrike?: number;
  ivRank?: number;
  ivSignal: IVSignalType;
  ivIsValid?: boolean;
  vix: number | null;
  vixSignal: VIXSignalType;
  isVixLive?: boolean;
  agreementScore: number;
  agreementCount: number;
  overallBias: OverallBias;
  meaningfulStrikes: MeaningfulStrike[];
  isMarketClosed?: boolean;
  brokerStatus?: 'connected' | 'expired' | 'missing';
  brokerMessage?: string | null;
  dataQuality?: 'live' | 'stale';
  dataAge?: number;
  lastUpdated?: number;
  generatedAt?: number;
  calculatedAt?: string;
}

export interface FlowNarrativeData {
  headline: string;
  observations: string[];
  watchPoints: string[];
  uncertainty?: string;
  source: 'groq' | 'template';
  generatedAt: string;
}
