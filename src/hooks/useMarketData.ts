/**
 * useMarketData — Enhanced Market Data Hook
 *
 * Provides:
 * - useLiveMarketData: SSE-backed live quotes (thin selector over marketQuoteStore)
 * - useLiveChartData: Chart data with abort controller
 * - useMarketNews: Real-time Yahoo Finance news
 * - useMarketSectors: Live sector performance
 * - useAISummary: Fetches AI market summary
 * - useEconomicCalendar: Live calendar events
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../lib/api';
import { useMarketQuoteStore, MarketQuote } from '../stores/marketQuoteStore';

export type { MarketQuote } from '../stores/marketQuoteStore';

// MarketQuote is defined in marketQuoteStore.ts (canonical source)
// and re-exported above. It's also imported here for internal use.

export interface ChartCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  value: number;
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: number;
  imageUrl?: string;
  category?: string;
}

export interface SectorQuote {
  id: string;
  name: string;
  symbol: string;
  changePercent: number;
  volume?: number;
  isLive: boolean;
  provider: string;
}

export type MarketSentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'MIXED';

export interface MarketSummary {
  sentiment: MarketSentiment;
  highlights: string[];
  risks: string[];
  eventsToWatch: string[];
  educationalInsight: string;
  disclaimer: string;
  generatedAt: number;
  /** Set by backend when serving a cached/stale summary */
  isStale?: boolean;
  staleAgeMinutes?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  date: string;
  time: string;
  timezone: string;
  impact: 'high' | 'medium' | 'low';
  forecast?: string;
  previous?: string;
  actual?: string | null;
  description?: string;
}

// ─── useLiveMarketData ────────────────────────────────────────────────────────
// Now a thin selector over marketQuoteStore.
// marketQuoteStore holds the single shared SSE connection — initialized once
// in MainLayout. This hook no longer opens any EventSource itself (MKT-01 fix).

export function useLiveMarketData() {
  const quotes = useMarketQuoteStore(s => s.quotes);
  const loading = useMarketQuoteStore(s => s.loading);
  const error = useMarketQuoteStore(s => s.error);
  // Preserve backward-compatible { data, loading, error } interface
  return { data: quotes, loading, error };
}


// ─── useLiveChartData ─────────────────────────────────────────────────────────

export function useLiveChartData(symbol: string, timeframe: string) {
  const [data, setData] = useState<ChartCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchChart = useCallback(async () => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      const response = await api.get<ChartCandle[]>(
        `/market/chart/${encodeURIComponent(symbol)}?timeframe=${timeframe}`
      );
      if (!controller.signal.aborted) {
        setData(response ?? []);
        setError(null);
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setError('Chart data unavailable');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [symbol, timeframe]);

  // Fetch chart data on mount or when symbol/timeframe changes
  useEffect(() => {
    fetchChart();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchChart, timeframe]); // timeframe is already part of fetchChart via useCallback, but listed explicitly for clarity

  return { data, loading, error, refresh: fetchChart };
}

// ─── useMarketNews ────────────────────────────────────────────────────────────

export function useMarketNews(limit = 20) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<{ articles: NewsArticle[]; count: number }>(
        `/market/news?limit=${limit}`
      );
      setArticles(res?.articles ?? []);
      setError(null);
    } catch (err: any) {
      setError('News unavailable');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { articles, loading, error, refresh: fetchNews };
}

// ─── useMarketSectors ─────────────────────────────────────────────────────────

export function useMarketSectors() {
  const [sectors, setSectors] = useState<SectorQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSectors = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await api.get<SectorQuote[]>('/market/sectors');
      if (res?.length > 0) {
        setSectors(res);
        setError(null);
      }
    } catch (err: any) {
      if (!isBackground) setError('Sector data unavailable');
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSectors(false);
  }, [fetchSectors]);

  // Auto-refresh every 5 minutes (H7 fix: sectors were never refreshed after initial mount)
  useEffect(() => {
    const interval = setInterval(() => fetchSectors(true), 5 * 60_000);
    return () => clearInterval(interval);
  }, [fetchSectors]);

  return { sectors, loading, error, refresh: fetchSectors };
}

// ─── useAISummary ─────────────────────────────────────────────────────────────

export function useAISummary() {
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // H6 fix: background refreshes don't reset loading state (prevents UI flicker).
  // isBackground=true means we already have a summary — just update it silently.
  const fetchSummary = useCallback(async (isRetry = false, isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    }
    if (isRetry) setRetrying(true);
    if (!isBackground) setError(null);

    try {
      const res = await api.get<MarketSummary>('/market/ai-summary');
      setSummary(res);
      setError(null);
    } catch (err: any) {
      if (!isRetry && err?.response?.status === 503) {
        // Startup grace period: background worker still generating — retry once after 3s
        setTimeout(() => fetchSummary(true, false), 3000);
        return;
      }
      if (!isBackground) {
        // Only show error if we have no data yet — don't replace existing good data
        setError('AI summary unavailable');
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Auto-refresh every 5 minutes (aligned with server's 5m generation cycle)
  // Background refresh — does not reset loading state or clear existing summary (H6 fix)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSummary(false, true);
    }, 5 * 60_000);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  return { summary, loading, retrying, error, refresh: fetchSummary };
}

// ─── useEconomicCalendar ──────────────────────────────────────────────────────

export function useEconomicCalendar(limit = 20) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCalendar = async () => {
      try {
        const res = await api.get<{ events: CalendarEvent[]; count: number }>(
          `/market/calendar?limit=${limit}`
        );
        if (isMounted) {
          setEvents(res?.events ?? []);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError('Calendar unavailable');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCalendar();
    // Refresh every hour
    const interval = setInterval(fetchCalendar, 60 * 60_000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [limit]);

  return { events, loading, error };
}
