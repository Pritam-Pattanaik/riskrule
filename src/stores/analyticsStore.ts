import { create } from 'zustand';
import { api } from '../lib/api';

// ─── Typed interfaces ─────────────────────────────────────────────────────────
export interface MistakeEntry {
  mistake: string;
  count: number;
  pnlImpact: number;
}

export interface SessionData {
  byWeekday: Record<number, { count: number; pnl: number }>;
  byHour: Record<number, { count: number; pnl: number }>;
}

export interface RiskData {
  avgWin: number;
  avgLoss: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  totalTrades: number;
}

export interface InstrumentEntry {
  name: string;
  pnl: number;
  count: number;
  winRate: number;
}

export interface InstrumentBreakdown {
  byInstrument: InstrumentEntry[];
  byMarket: InstrumentEntry[];
  byDirection: InstrumentEntry[];
}

export interface MonthlySummaryEntry {
  month: string;     // "YYYY-MM"
  pnl: number;
  grossPnl: number;
  charges: number;
  count: number;
  winRate: number;
  profitFactor: number;
}

export interface StrategyComparisonEntry {
  name: string;
  pnl: number;
  count: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  expectancy: number;
}

export interface ChargesSummary {
  totalCharges: number;
  totalGross: number;
  totalNet: number;
  tradeCount: number;
  avgChargesPerTrade: number;
  chargesAsPctOfGross: number;
}

export interface DisciplineScoreEntry {
  score: number;
  pnl: number;
  count: number;
  winRate: number;
  avgPnl: number;
}

export interface DisciplineCorrelation {
  byScore: DisciplineScoreEntry[];
  dimensionAvgs: { dimension: string; avg: number }[];
  totalScored: number;
}

// ─── Date Range ───────────────────────────────────────────────────────────────
export type DatePreset = 'week' | 'month' | 'last_month' | '3months' | 'all';

export interface DateRange {
  preset: DatePreset;
  from?: string;  // ISO date "YYYY-MM-DD"
  to?: string;    // ISO date "YYYY-MM-DD"
}

function getPresetRange(preset: DatePreset): { from?: string; to?: string } {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (preset === 'all') return {};

  if (preset === 'week') {
    const day = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
    return { from: fmt(start), to: fmt(today) };
  }

  if (preset === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: fmt(start), to: fmt(today) };
  }

  if (preset === 'last_month') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);
    return { from: fmt(start), to: fmt(end) };
  }

  if (preset === '3months') {
    const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    return { from: fmt(start), to: fmt(today) };
  }

  return {};
}

// ─── Store ────────────────────────────────────────────────────────────────────
interface AnalyticsState {
  // Core data
  mistakes: MistakeEntry[];
  session: SessionData | null;
  risk: RiskData | null;
  instrumentBreakdown: InstrumentBreakdown | null;
  monthlySummary: MonthlySummaryEntry[];
  strategyComparison: StrategyComparisonEntry[];
  chargesSummary: ChargesSummary | null;
  disciplineCorrelation: DisciplineCorrelation | null;

  // Loading states (granular for progressive rendering)
  loading: boolean;
  loadingSecondary: boolean;

  // Date range
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  // Fetch actions
  fetchAnalytics: () => Promise<void>;
  fetchSecondaryAnalytics: () => Promise<void>;
  invalidate: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Data
  mistakes: [],
  session: null,
  risk: null,
  instrumentBreakdown: null,
  monthlySummary: [],
  strategyComparison: [],
  chargesSummary: null,
  disciplineCorrelation: null,

  // Loading
  loading: false,
  loadingSecondary: false,

  // Date range — default to current month
  dateRange: { preset: 'month' },

  setDateRange: (range) => {
    set({ dateRange: range });
    // Automatically refetch when date range changes
    get().fetchAnalytics();
    get().fetchSecondaryAnalytics();
  },

  invalidate: () => set({
    mistakes: [],
    session: null,
    risk: null,
    instrumentBreakdown: null,
    monthlySummary: [],
    strategyComparison: [],
    chargesSummary: null,
    disciplineCorrelation: null,
    loading: false,
    loadingSecondary: false,
  }),

  fetchAnalytics: async () => {
    const { dateRange } = get();
    const { from, to } = dateRange.preset === 'all' ? {} : getPresetRange(dateRange.preset);
    // Support custom range override
    const resolvedFrom = dateRange.from || from;
    const resolvedTo = dateRange.to || to;

    const buildParams = () => {
      const params = new URLSearchParams();
      if (resolvedFrom) params.set('from', resolvedFrom);
      if (resolvedTo) params.set('to', resolvedTo);
      return params.toString() ? `?${params.toString()}` : '';
    };
    const qs = buildParams();

    set({ loading: true });
    try {
      const [mistakes, session, risk] = await Promise.all([
        api.get<MistakeEntry[]>(`/analytics/mistakes${qs}`),
        api.get<SessionData>(`/analytics/session${qs}`),
        api.get<RiskData>(`/analytics/risk${qs}`),
      ]);
      set({ mistakes, session, risk, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchSecondaryAnalytics: async () => {
    const { dateRange } = get();
    const { from, to } = dateRange.preset === 'all' ? {} : getPresetRange(dateRange.preset);
    const resolvedFrom = dateRange.from || from;
    const resolvedTo = dateRange.to || to;

    const buildParams = () => {
      const params = new URLSearchParams();
      if (resolvedFrom) params.set('from', resolvedFrom);
      if (resolvedTo) params.set('to', resolvedTo);
      return params.toString() ? `?${params.toString()}` : '';
    };
    const qs = buildParams();

    set({ loadingSecondary: true });
    try {
      const [instrumentBreakdown, monthlySummary, strategyComparison, chargesSummary, disciplineCorrelation] = await Promise.all([
        api.get<InstrumentBreakdown>(`/analytics/instrument-breakdown${qs}`),
        api.get<MonthlySummaryEntry[]>(`/analytics/monthly-summary${qs}`),
        api.get<StrategyComparisonEntry[]>(`/analytics/strategy-comparison${qs}`),
        api.get<ChargesSummary>(`/analytics/charges-summary${qs}`),
        api.get<DisciplineCorrelation>(`/analytics/discipline-correlation${qs}`),
      ]);
      set({ instrumentBreakdown, monthlySummary, strategyComparison, chargesSummary, disciplineCorrelation, loadingSecondary: false });
    } catch {
      set({ loadingSecondary: false });
    }
  },
}));
