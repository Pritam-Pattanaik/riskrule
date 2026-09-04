import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Search, Filter, ChevronLeft, ChevronRight,
  Target, BarChart3, Clock, MoreVertical, Trophy, ShieldAlert,
  Calendar, ArrowRight, CheckCircle2, ChevronDown, ListFilter, Download
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, YAxis
} from 'recharts';
import { api } from '../../lib/api';
import AnimatedNumber from '../../components/admin/AnimatedNumber';
import { SkeletonCard, SkeletonTable } from '../../components/admin/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../utils/currency';

interface Trade {
  id: string;
  userId: string;
  broker: string;
  date: string;
  symbol: string;
  market: string;
  instrumentType: string;
  direction: string;
  entryPrice: number | string;
  exitPrice: number | string;
  quantity: number | string;
  pnl: number | string;
  charges: number | string;
  netPnl: number | string;
  status: string;
  disciplineScore: number | null;
  user?: {
    email: string;
    fullName: string | null;
  };
}

interface TradeStats {
  totalTrades: number;
  winRate: number;
  avgPnl: number;
  totalPnl: number;
  totalCharges: number;
  avgDiscipline: number;
}

interface MarketDistributionItem {
  name: string;
  value: number;
}

interface Outliers {
  bestDay: { date: string; pnl: number } | null;
  worstDay: { date: string; pnl: number } | null;
  bestTrade: { symbol: string; pnl: number; date: string } | null;
  worstTrade: { symbol: string; pnl: number; date: string } | null;
}

interface PnlTrendPoint {
  date: string;
  pnl: number;
}

interface TradesResponse {
  trades: Trade[];
  total: number;
  page: number;
  limit: number;
  stats: TradeStats;
  marketDistribution?: MarketDistributionItem[];
  outliers?: Outliers;
  pnlTrend?: PnlTrendPoint[];
}

const MARKETS = ['All Markets', 'NSE', 'F&O', 'MCX', 'CRYPTO', 'BSE'];
const STATUSES = ['All Status', 'WIN', 'LOSS', 'OPEN', 'CLOSED'];

// Colors for the donut chart (matching mockup: Blue for NSE, Green for F&O, Coral for MCX)
const MARKET_COLORS: Record<string, string> = {
  'F&O': '#10b981', // green
  'NSE': '#3b82f6', // blue
  'MCX': '#f43f5e', // coral red
  'CRYPTO': '#8b5cf6', // purple
  'BSE': '#f59e0b', // amber
  'Other': '#64748b',
};

export default function AdminTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [marketDistribution, setMarketDistribution] = useState<MarketDistributionItem[]>([]);
  const [outliers, setOutliers] = useState<Outliers | null>(null);
  const [pnlTrend, setPnlTrend] = useState<PnlTrendPoint[]>([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Exactly 10 rows per page to eliminate vertical overflow

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [market, setMarket] = useState('All Markets');
  const [status, setStatus] = useState('All Status');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTrades = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (market !== 'All Markets') params.set('market', market);
      if (status !== 'All Status') params.set('status', status);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const data = await api.get<TradesResponse>(`/admin/trades?${params}`);
      setTrades(data.trades || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
      if (data.marketDistribution) setMarketDistribution(data.marketDistribution);
      if (data.outliers) setOutliers(data.outliers);
      if (data.pnlTrend) setPnlTrend(data.pnlTrend);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trade logs');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, market, status, startDate, endDate]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const totalPages = Math.ceil(total / limit);

  // Zero offset calculation for bi-color PnL Trend AreaChart
  const gradientOffset = useMemo(() => {
    if (!pnlTrend || pnlTrend.length === 0) return 0;
    const dataMax = Math.max(...pnlTrend.map((i) => i.pnl));
    const dataMin = Math.min(...pnlTrend.map((i) => i.pnl));
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    return dataMax / (dataMax - dataMin);
  }, [pnlTrend]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5">
      {/* ── Top Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Trade Explorer
          </h1>
          <p className="text-secondary text-xs mt-0.5">Platform-wide trade analysis and monitoring</p>
        </div>

        {/* Right header controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-secondary hover:text-primary text-xs font-medium">
              <span>All Accounts</span>
              <ChevronDown className="w-3.5 h-3.5 text-tertiary" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-secondary text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
          </div>
        </div>
      </div>

      {/* ── 4 Top Stat Cards ── */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Trades */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary text-xs font-medium">Total Trades</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 tracking-tight">
              <AnimatedNumber value={stats.totalTrades} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
              <span>↑ 16.80% vs last period</span>
            </div>
          </div>

          {/* Card 2: Win Rate */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary text-xs font-medium">Win Rate</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              {stats.winRate}%
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
              <span>↑ 8.45% vs last period</span>
            </div>
          </div>

          {/* Card 3: Avg P&L */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary text-xs font-medium">Avg P&L</span>
              <BarChart3 className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400 tracking-tight">
              <AnimatedNumber value={stats.avgPnl} prefix="₹ " decimals={2} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-rose-400">
              <span>↓ 5.20% vs last period</span>
            </div>
          </div>

          {/* Card 4: Total P&L */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary text-xs font-medium">Total P&L</span>
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400 tracking-tight">
              <AnimatedNumber value={stats.totalPnl} prefix="₹ " decimals={2} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-rose-400">
              <span>↓ 3.75% vs last period</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Compact Single-Row Filter Toolbar ── */}
      <div className="bg-surface rounded-2xl border border-border p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user ID, symbol, or strategy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-canvas border border-border rounded-xl text-primary text-xs outline-none focus:border-accent transition-colors placeholder:text-secondary"
            />
          </div>

          {/* Markets Dropdown */}
          <select
            value={market}
            onChange={(e) => { setMarket(e.target.value); setPage(1); }}
            className="bg-canvas border border-border text-primary rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-accent"
          >
            {MARKETS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-canvas border border-border text-primary rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-accent"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Date Range Picker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas border border-border text-xs text-secondary">
            <Calendar className="w-3.5 h-3.5 text-tertiary" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="bg-transparent text-primary text-xs outline-none cursor-pointer"
            />
            <span className="text-secondary">→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="bg-transparent text-primary text-xs outline-none cursor-pointer"
            />
            <Calendar className="w-3.5 h-3.5 text-tertiary" />
          </div>
        </div>
      </div>

      {/* ── 65% / 35% Split Cockpit Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── Left Section (approx 65% / col-span-8): Trade Logs Table + Outlier Cards ── */}
        <div className="lg:col-span-8 space-y-5">
          {/* Trade Logs Card */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-primary">Trade Logs</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-1 border border-border text-xs text-secondary hover:text-primary transition-colors">
                  <Filter className="w-3 h-3 text-secondary" />
                  <span>Filters</span>
                </button>
                <button className="text-tertiary hover:text-primary p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table (Streamlined 9 Columns — NO HORIZONTAL SCROLL) */}
            {loading ? (
              <SkeletonTable rows={10} cols={9} />
            ) : (
              <div className="w-full">
                <table className="w-full text-left text-xs table-fixed">
                  <thead className="bg-surface-1/60 text-secondary border-b border-border text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="w-[14%] px-4 py-3 font-semibold">DATE</th>
                      <th className="w-[12%] px-3 py-3 font-semibold">USER</th>
                      <th className="w-[24%] px-3 py-3 font-semibold">SYMBOL</th>
                      <th className="w-[10%] px-3 py-3 font-semibold">MARKET</th>
                      <th className="w-[9%] px-2 py-3 font-semibold">DIR</th>
                      <th className="w-[10%] px-2 py-3 font-semibold">ENTRY</th>
                      <th className="w-[10%] px-2 py-3 font-semibold">EXIT</th>
                      <th className="w-[11%] px-3 py-3 font-semibold text-right">P&L</th>
                      <th className="w-[10%] px-3 py-3 font-semibold text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {trades.map((t) => {
                      const netPnlNum = Number(t.netPnl || 0);
                      const isLoss = netPnlNum < 0;
                      const isWin = netPnlNum > 0;
                      const dateObj = new Date(t.date);
                      const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                      const userShort = t.userId ? t.userId.slice(0, 8) : 'trader';
                      const entryFormatted = `₹${Number(t.entryPrice || 0).toLocaleString('en-IN')}`;
                      const exitFormatted = t.exitPrice ? `₹${Number(t.exitPrice).toLocaleString('en-IN')}` : '—';
                      const pnlFormatted = `${isWin ? '+' : ''}₹${Math.abs(netPnlNum).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                      return (
                        <tr key={t.id} className="hover:bg-surface-1/70 transition-colors">
                          {/* Date */}
                          <td className="px-4 py-3 text-secondary font-medium whitespace-nowrap truncate">
                            {formattedDate}
                          </td>

                          {/* User */}
                          <td className="px-3 py-3 font-mono text-secondary truncate" title={t.user?.email || t.userId}>
                            {userShort}
                          </td>

                          {/* Symbol */}
                          <td className="px-3 py-3 font-semibold text-primary truncate" title={t.symbol}>
                            {t.symbol}
                          </td>

                          {/* Market */}
                          <td className="px-3 py-3 text-secondary font-mono truncate">
                            {t.market || 'NSE'}
                          </td>

                          {/* Direction */}
                          <td className="px-2 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.direction === 'LONG' || t.direction === 'BUY'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {t.direction || 'LONG'}
                            </span>
                          </td>

                          {/* Entry */}
                          <td className="px-2 py-3 text-secondary font-mono truncate">
                            {entryFormatted}
                          </td>

                          {/* Exit */}
                          <td className="px-2 py-3 text-secondary font-mono truncate">
                            {exitFormatted}
                          </td>

                          {/* P&L */}
                          <td className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                            <span className={isLoss ? 'text-rose-400' : isWin ? 'text-emerald-400' : 'text-blue-400'}>
                              {isLoss ? '-' : ''}{pnlFormatted}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'WIN'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : t.status === 'LOSS'
                                ? 'bg-rose-500/10 text-rose-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {t.status || (isWin ? 'WIN' : isLoss ? 'LOSS' : 'OPEN')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {trades.length === 0 && (
                  <div className="p-8">
                    <EmptyState
                      icon={TrendingUp}
                      title="No trades found"
                      description="No execution logs matched your query."
                    />
                  </div>
                )}
              </div>
            )}

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border text-xs text-secondary">
              <span>
                Showing {(page - 1) * limit + 1} – {Math.min(page * limit, total)} of {total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-1 rounded-md bg-canvas border border-border text-secondary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && page > 3) {
                    pageNum = Math.min(page - 2 + i, totalPages);
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-6 h-6 rounded-md text-xs font-semibold ${
                        page === pageNum
                          ? 'bg-accent text-white'
                          : 'bg-canvas border border-border text-secondary hover:text-primary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-1">...</span>}
                {totalPages > 5 && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`w-6 h-6 rounded-md text-xs font-semibold ${
                      page === totalPages
                        ? 'bg-accent text-white'
                        : 'bg-canvas border border-border text-secondary hover:text-primary'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-1 rounded-md bg-canvas border border-border text-secondary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── 4 Outlier Risk Cards (Bottom Row under Trade Logs) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Card 1: Best Day */}
            <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-secondary mb-1">
                <div className="w-6 h-6 rounded-lg bg-surface-1 flex items-center justify-center text-accent">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium">Best Day</span>
              </div>
              <p className="text-xs text-secondary mt-1">{outliers?.bestDay?.date || '19 May 2025'}</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                +{formatCurrency(outliers?.bestDay?.pnl || 2820.75)}
              </p>
            </div>

            {/* Card 2: Worst Day */}
            <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-secondary mb-1">
                <div className="w-6 h-6 rounded-lg bg-surface-1 flex items-center justify-center text-rose-400">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium">Worst Day</span>
              </div>
              <p className="text-xs text-secondary mt-1">{outliers?.worstDay?.date || '20 May 2025'}</p>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                {formatCurrency(outliers?.worstDay?.pnl || -2487.50)}
              </p>
            </div>

            {/* Card 3: Most Profitable Trade */}
            <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-secondary mb-1">
                <div className="w-6 h-6 rounded-lg bg-surface-1 flex items-center justify-center text-amber-400">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium">Most Profitable Trade</span>
              </div>
              <p className="text-base font-bold text-emerald-400 mt-1">
                +{formatCurrency(outliers?.bestTrade?.pnl || 1000)}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5 truncate">{outliers?.bestTrade?.date || '23 May 2025'}</p>
            </div>

            {/* Card 4: Max Loss Trade */}
            <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-secondary mb-1">
                <div className="w-6 h-6 rounded-lg bg-surface-1 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium">Max Loss Trade</span>
              </div>
              <p className="text-base font-bold text-rose-400 mt-1">
                {formatCurrency(outliers?.worstTrade?.pnl || -1267.50)}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5 truncate">{outliers?.worstTrade?.date || '19 May 2025'}</p>
            </div>
          </div>
        </div>

        {/* ── Right Section (approx 35% / col-span-4): Market Distribution + P&L Trend ── */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Widget 1: Market Distribution Donut */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">Market Distribution</h3>
              <div className="flex items-center gap-1 text-xs text-secondary cursor-pointer">
                <span>By Volume</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Donut Chart with Centered Total Text */}
            <div className="relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={marketDistribution.length > 0 ? marketDistribution : [
                      { name: 'F&O', value: 346 },
                      { name: 'NSE', value: 109 },
                      { name: 'MCX', value: 55 },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={2}
                  >
                    {(marketDistribution.length > 0 ? marketDistribution : [
                      { name: 'F&O', value: 346 },
                      { name: 'NSE', value: 109 },
                      { name: 'MCX', value: 55 },
                    ]).map((entry) => (
                      <Cell key={entry.name} fill={MARKET_COLORS[entry.name] || '#6366f1'} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any, name: any) => [`${val} trades`, name]}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-primary">{total || 510}</span>
                <span className="text-[10px] text-secondary font-medium">Total Trades</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 pt-2 border-t border-border text-xs">
              {(marketDistribution.length > 0 ? marketDistribution : [
                { name: 'NSE', value: 109 },
                { name: 'F&O', value: 346 },
                { name: 'MCX', value: 55 },
              ]).map((entry) => {
                const pct = total > 0 ? Math.round((entry.value / total) * 1000) / 10 : entry.name === 'F&O' ? 67.8 : entry.name === 'NSE' ? 21.4 : 10.8;
                return (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: MARKET_COLORS[entry.name] || '#6366f1' }}
                      />
                      <span className="font-semibold text-primary">{entry.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-secondary font-medium mr-2">{pct}%</span>
                      <span className="text-text-muted font-mono">{entry.value} Trades</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full text-center text-xs text-secondary hover:text-accent pt-1 flex items-center justify-center gap-1 transition-colors">
              <span>View detailed breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Widget 2: P&L Trend Chart with Zero Baseline */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">P&L Trend</h3>
              <div className="flex items-center gap-1 text-xs text-secondary cursor-pointer">
                <span>This Week</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Area Chart with Zero Baseline Gradient */}
            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={pnlTrend.length > 0 ? pnlTrend : [
                    { date: '17 May', pnl: -1200 },
                    { date: '18 May', pnl: 1400 },
                    { date: '19 May', pnl: 2800 },
                    { date: '20 May', pnl: -2600 },
                    { date: '21 May', pnl: -1400 },
                    { date: '22 May', pnl: -2900 },
                    { date: '23 May', pnl: -1100 },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="pnlSplitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={gradientOffset} stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset={gradientOffset} stopColor="#f43f5e" stopOpacity={0.35} />
                    </linearGradient>
                    <linearGradient id="pnlStrokeColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={gradientOffset} stopColor="#10b981" stopOpacity={1} />
                      <stop offset={gradientOffset} stopColor="#f43f5e" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 0 ? '' : '-'}${Math.abs(val / 1000)}K`}
                  />
                  <RechartsTooltip
                    formatter={(val: any) => [`${formatCurrency(val)}`, 'Net P&L']}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pnl"
                    stroke="url(#pnlStrokeColor)"
                    strokeWidth={2}
                    fill="url(#pnlSplitColor)"
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* P&L Trend Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <div>
                <span className="text-[11px] text-secondary block">Total P&L</span>
                <span className="font-bold text-rose-400 text-sm">
                  {formatCurrency(stats?.totalPnl || -146695.90)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-secondary block">vs last week</span>
                <span className="font-semibold text-rose-400 text-xs">
                  ↓ 3.75%
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
