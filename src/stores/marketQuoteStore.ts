/**
 * marketQuoteStore — Singleton SSE Quote Store
 *
 * Solves MKT-01: Previously every component calling useLiveMarketData()
 * created its own independent EventSource, resulting in 3+ concurrent SSE
 * connections per Markets page load.
 *
 * This store holds a single SSE connection at the module level.
 * All components subscribe to the same Zustand state.
 * useLiveMarketData() becomes a thin selector over this store.
 *
 * Usage: Call initSSE() once from MainLayout on authenticated mount.
 */

import { create } from 'zustand';
import { api, BASE_URL } from '../lib/api';

// ─── MarketQuote Type (canonical definition lives here to avoid circular deps) ─

export interface MarketQuote {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  marketCap?: number;
  status: 'OPEN' | 'CLOSED' | '24/7';
  updatedAt: number;
  sparkline: number[];
  provider: string;
  flash?: 'up' | 'down' | null;
  // Backward compat aliases
  value?: number;
  pct?: number;
  trend?: 'up' | 'down' | 'flat';
}

// ─── Normalize Quotes (flash detection) ──────────────────────────────────────

function normalizeQuotes(newQuotes: MarketQuote[], prevData: MarketQuote[]): MarketQuote[] {
  return newQuotes.map(q => {
    const prev = prevData.find(p => p.id === q.id);
    const flash: 'up' | 'down' | null =
      prev && prev.price !== q.price
        ? q.price > prev.price ? 'up' : 'down'
        : null;

    return {
      ...q,
      value: q.price,
      pct: q.changePercent,
      trend: q.changePercent >= 0 ? 'up' : 'down',
      flash,
    } as MarketQuote;
  });
}

// ─── Module-level SSE (true singleton — survives re-renders) ──────────────────

let _sseInstance: EventSource | null = null;
let _flashTimer: ReturnType<typeof setTimeout> | null = null;
let _retryCount = 0;
let _retryTimeout: ReturnType<typeof setTimeout> | null = null;
const MAX_RETRIES = 10;
const BASE_DELAY_MS = 5_000;
const MAX_DELAY_MS = 60_000;

// ─── Store Interface ──────────────────────────────────────────────────────────

interface MarketQuoteState {
  quotes: MarketQuote[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  initSSE: () => void;
  cleanupSSE: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMarketQuoteStore = create<MarketQuoteState>((set, get) => ({
  quotes: [],
  loading: true,
  error: null,
  initialized: false,

  initSSE: () => {
    // Guard: only one SSE connection regardless of how many times initSSE is called
    if (get().initialized) return;
    set({ initialized: true });

    // 1. Warm up with REST snapshot for immediate rendering
    api.get<MarketQuote[]>('/market/quotes')
      .then(response => {
        if (response?.length > 0) {
          set({ quotes: normalizeQuotes(response, []), loading: false, error: null });
        }
      })
      .catch(() => {
        set({ error: 'Market data unavailable', loading: false });
      })
      .finally(() => {
        _connectSSE();
      });
  },

  cleanupSSE: () => {
    _disconnect();
    set({ initialized: false, loading: true, quotes: [], error: null });
  },
}));

// ─── SSE Connection (module-level, not inside the store) ─────────────────────

function _connectSSE() {
  if (_sseInstance) return; // Already connected

  const url = `${BASE_URL}/market/stream`;
  _sseInstance = new EventSource(url, { withCredentials: true });

  _sseInstance.onmessage = (event) => {
    try {
      const newQuotes = JSON.parse(event.data) as MarketQuote[];
      if (!Array.isArray(newQuotes) || newQuotes.length === 0) return;

      const state = useMarketQuoteStore.getState();
      const normalized = normalizeQuotes(newQuotes, state.quotes);

      useMarketQuoteStore.setState({ quotes: normalized, loading: false, error: null });

      // Clear flash after 300ms
      if (_flashTimer) clearTimeout(_flashTimer);
      _flashTimer = setTimeout(() => {
        useMarketQuoteStore.setState(s => ({
          quotes: s.quotes.map(q => ({ ...q, flash: null })),
        }));
      }, 300);

      _retryCount = 0; // Reset on success
    } catch { /* ignore parse errors */ }
  };

  _sseInstance.onerror = () => {
    _sseInstance?.close();
    _sseInstance = null;

    if (_retryCount >= MAX_RETRIES) {
      useMarketQuoteStore.setState({ error: 'Live market stream unavailable. Refresh to retry.' });
      return;
    }

    const delay = Math.min(BASE_DELAY_MS * Math.pow(2, _retryCount), MAX_DELAY_MS);
    _retryCount++;

    _retryTimeout = setTimeout(() => {
      _connectSSE();
    }, delay);
  };
}

function _disconnect() {
  if (_retryTimeout) { clearTimeout(_retryTimeout); _retryTimeout = null; }
  if (_flashTimer) { clearTimeout(_flashTimer); _flashTimer = null; }
  if (_sseInstance) { _sseInstance.close(); _sseInstance = null; }
  _retryCount = 0;
}
