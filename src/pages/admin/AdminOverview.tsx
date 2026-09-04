import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, TrendingDown, Link2, Brain, ArrowUpRight, ArrowDownRight,
  Activity, Clock, RefreshCw, Filter, MoreVertical, Trophy, Sparkles,
  ChevronDown, UserPlus, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { api } from '../../lib/api';
import AnimatedNumber from '../../components/admin/AnimatedNumber';
import { SkeletonCard, SkeletonChart } from '../../components/admin/SkeletonLoader';
import { HoverLift } from '../../components/ui/Motion';
import { BrokerLogo } from '../../components/settings/brokers/BrokerLogo';
import { formatCurrency } from '../../utils/currency';

interface Stats {
  totalUsers: number;
  totalTrades: number;
  totalPnl: number;
  winRate: number;
  activeBrokers: number;
  aiInsights: number;
  userGrowth: number;
  tradeGrowth: number;
  pnlGrowth?: number;
  brokerGrowth?: number;
  aiGrowth?: number;
}

interface ChartData {
  userSignups: { date: string; count: number }[];
  tradeVolume: { date: string; count: number; pnl: number }[];
}

interface ActivityItem {
  type: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

interface BrokerItem {
  providerId: string;
  name: string;
  trades: number;
  totalPnl: number;
  activeConnections: number;
  winRate: number;
}

const periods = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
] as const;

const autoRefreshOptions = [
  { label: 'Off', value: 0 },
  { label: '15s', value: 15000 },
  { label: '30s', value: 30000 },
  { label: '60s', value: 60000 },
];

function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSecs < 60) return `${Math.max(1, diffInSecs)}s ago`;
  const diffInMins = Math.floor(diffInSecs / 60);
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default function AdminOverview() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [brokers, setBrokers] = useState<BrokerItem[]>([]);

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [userSignupsRange, setUserSignupsRange] = useState<'7d' | '30d' | '12w'>('7d');
  const [tradeVolumeRange, setTradeVolumeRange] = useState<'7d' | '30d' | '12w'>('7d');

  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(30000);
  const [error, setError] = useState<string | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary Data Fetcher
  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      const [statsRes, activityRes, brokersRes] = await Promise.all([
        api.get<Stats>('/admin/stats'),
        api.get<{ activities?: ActivityItem[]; activity?: ActivityItem[] }>('/admin/stats/activity'),
        api.get<{ brokers?: BrokerItem[] }>('/admin/stats/top-brokers'),
      ]);

      setStats(statsRes);
      setActivities(activityRes.activities || activityRes.activity || []);
      setBrokers(brokersRes.brokers || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard telemetry');
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, []);

  // Fetch Chart Data
  const fetchCharts = useCallback(async () => {
    try {
      setChartLoading(true);
      const range = period === 'weekly' ? '12w' : period === 'monthly' ? '12m' : userSignupsRange;
      const data = await api.get<ChartData>(`/admin/stats/charts?period=${period}&range=${range}`);
      setChartData(data);
    } catch (err: any) {
      console.error('Failed to fetch chart data:', err);
    } finally {
      setChartLoading(false);
    }
  }, [period, userSignupsRange]);

  // Initial Load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Chart Refetch on Period or Range Change
  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  // Auto Refresh Interval Loop
  useEffect(() => {
    if (!autoRefreshInterval || autoRefreshInterval <= 0) return;
    const timer = setInterval(() => {
      fetchData(false);
      fetchCharts();
    }, autoRefreshInterval);
    return () => clearInterval(timer);
  }, [autoRefreshInterval, fetchData, fetchCharts]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return (
          <div className="w-8 h-8 rounded-full bg-info/15 flex items-center justify-center text-info shrink-0">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case 'trade':
        return (
          <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center text-success shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        );
      case 'ai_insight':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
            <Brain className="w-4 h-4" />
          </div>
        );
      case 'broker':
        return (
          <div className="w-8 h-8 rounded-full bg-warning/15 flex items-center justify-center text-warning shrink-0">
            <Link2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-secondary shrink-0">
            <Activity className="w-4 h-4" />
          </div>
        );
    }
  };

  const isPnlNegative = (stats?.totalPnl ?? 0) < 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Top Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Dashboard Overview</h1>
          <p className="text-secondary text-sm mt-0.5">Platform analytics and key metrics</p>
        </div>

        {/* Real-time Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Sync Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-1 border border-border text-xs text-secondary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-primary">Live Sync</span>
          </div>

          {/* Auto Refresh Selector */}
          <div className="flex items-center gap-1 bg-surface-1 border border-border rounded-lg p-0.5 text-xs text-secondary">
            <span className="px-2 text-text-muted font-medium">Auto:</span>
            {autoRefreshOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setAutoRefreshInterval(opt.value)}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  autoRefreshInterval === opt.value
                    ? 'bg-accent text-white shadow-sm'
                    : 'hover:text-primary hover:bg-surface-2'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-secondary hover:text-primary text-xs font-medium transition-colors"
            title="Refresh telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-accent' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-secondary text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>Last updated: {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/40 text-danger p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* ── KPI Cards (5 Cards) ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : stats && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {/* Card 1: Total Users */}
          <HoverLift className="bg-surface rounded-xl border border-border p-5 hover:border-info/40 transition-all duration-300 group shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary text-xs font-medium uppercase tracking-wider">Total Users</span>
              <div className="bg-info/10 text-info p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary tracking-tight">
              <AnimatedNumber value={stats.totalUsers} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{Math.abs(stats.userGrowth || 8)}% from last period</span>
            </div>
          </HoverLift>

          {/* Card 2: Total Trades */}
          <HoverLift className="bg-surface rounded-xl border border-border p-5 hover:border-purple-500/40 transition-all duration-300 group shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary text-xs font-medium uppercase tracking-wider">Total Trades</span>
              <div className="bg-purple-500/10 text-purple-400 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary tracking-tight">
              <AnimatedNumber value={stats.totalTrades} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+15.7% from last period</span>
            </div>
          </HoverLift>

          {/* Card 3: Net P&L (Dynamic Financial Coloring) */}
          <HoverLift className={`bg-surface rounded-xl border p-5 transition-all duration-300 group shadow-sm ${
            isPnlNegative
              ? 'border-rose-500/30 hover:border-rose-500/60'
              : 'border-emerald-500/30 hover:border-emerald-500/60'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary text-xs font-medium uppercase tracking-wider">Net P&L</span>
              <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform ${
                isPnlNegative ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {isPnlNegative ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              </div>
            </div>
            <div className={`text-2xl font-bold tracking-tight ${
              isPnlNegative ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              <AnimatedNumber value={stats.totalPnl} prefix="₹ " decimals={2} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+5.3% from last period</span>
            </div>
          </HoverLift>

          {/* Card 4: Active Brokers */}
          <HoverLift className="bg-surface rounded-xl border border-border p-5 hover:border-warning/40 transition-all duration-300 group shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary text-xs font-medium uppercase tracking-wider">Active Brokers</span>
              <div className="bg-warning/10 text-warning p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                <Link2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary tracking-tight">
              <AnimatedNumber value={stats.activeBrokers} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+2 from last period</span>
            </div>
          </HoverLift>

          {/* Card 5: AI Insights */}
          <HoverLift className="bg-surface rounded-xl border border-border p-5 hover:border-indigo-500/40 transition-all duration-300 group shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-secondary text-xs font-medium uppercase tracking-wider">AI Insights</span>
              <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary tracking-tight">
              <AnimatedNumber value={stats.aiInsights} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% from last period</span>
            </div>
          </HoverLift>
        </motion.div>
      )}

      {/* ── Period Selector & Filter Row ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-secondary text-xs font-medium mr-1">Period:</span>
          <div className="flex items-center bg-surface border border-border rounded-xl p-1 gap-1">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  period === p.id
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-secondary hover:text-primary hover:bg-surface-1'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-1 text-xs font-medium transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <AnimatePresence>
            {filterMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl p-3 z-30 space-y-2"
              >
                <div className="text-xs font-semibold text-primary px-2 py-1">Quick Filters</div>
                <button
                  onClick={() => { setPeriod('daily'); setUserSignupsRange('7d'); setTradeVolumeRange('7d'); setFilterMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-secondary hover:text-primary hover:bg-surface-1 transition-colors flex items-center justify-between"
                >
                  <span>This Week (7 Days)</span>
                  {userSignupsRange === '7d' && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                </button>
                <button
                  onClick={() => { setPeriod('daily'); setUserSignupsRange('30d'); setTradeVolumeRange('30d'); setFilterMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-secondary hover:text-primary hover:bg-surface-1 transition-colors flex items-center justify-between"
                >
                  <span>Last 30 Days</span>
                  {userSignupsRange === '30d' && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                </button>
                <button
                  onClick={() => { setPeriod('weekly'); setUserSignupsRange('12w'); setTradeVolumeRange('12w'); setFilterMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-secondary hover:text-primary hover:bg-surface-1 transition-colors flex items-center justify-between"
                >
                  <span>Quarterly (12 Weeks)</span>
                  {userSignupsRange === '12w' && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Charts Grid (User Signups & Trade Volume) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: User Signups (Smooth Spline Area) */}
        {chartLoading ? <SkeletonChart /> : (
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-primary font-semibold text-base">User Signups</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                  <span className="text-secondary text-xs font-medium">Signups</span>
                </div>
              </div>
              <select
                value={userSignupsRange}
                onChange={(e) => setUserSignupsRange(e.target.value as any)}
                className="bg-surface-1 border border-border text-primary text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="7d">This Week</option>
                <option value="30d">This Month</option>
                <option value="12w">Quarterly</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData?.userSignups || []}>
                <defs>
                  <linearGradient id="userSignupsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Signups"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#userSignupsGradient)"
                  dot={{ fill: '#8b5cf6', stroke: '#1e1b4b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#c084fc' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 2: Trade Volume (Rounded Bars) */}
        {chartLoading ? <SkeletonChart /> : (
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-primary font-semibold text-base">Trade Volume</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6]" />
                  <span className="text-secondary text-xs font-medium">Volume</span>
                </div>
              </div>
              <select
                value={tradeVolumeRange}
                onChange={(e) => setTradeVolumeRange(e.target.value as any)}
                className="bg-surface-1 border border-border text-primary text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="7d">This Week</option>
                <option value="30d">This Month</option>
                <option value="12w">Quarterly</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData?.tradeVolume || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => {
                    if (name === 'Volume') {
                      return [`${val} trades (P&L: ${formatCurrency(item.payload.pnl || 0)})`, 'Volume'];
                    }
                    return [val, name];
                  }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                />
                <Bar dataKey="count" name="Volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── 3-Column Bottom Operational Cockpit ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Recent Activity */}
        <div className="bg-surface rounded-xl border border-border p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-warning" />
                <h3 className="text-primary font-semibold text-sm">Recent Activity</h3>
              </div>
              <button className="text-tertiary hover:text-primary transition-colors p-1 rounded-md">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-1 rounded-full shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 bg-surface-1 rounded w-3/4 mb-1" />
                      <div className="h-2.5 bg-surface-1 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <p className="text-secondary text-xs text-center py-8">No recent live events</p>
            ) : (
              <div className="space-y-2.5">
                {activities.slice(0, 4).map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-1 transition-colors group">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getActivityIcon(activity.type)}
                      <div className="min-w-0">
                        <p className="text-primary text-xs font-medium truncate">{activity.description}</p>
                        <p className="text-text-muted text-[11px]">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                    </div>
                    <button className="text-tertiary opacity-0 group-hover:opacity-100 hover:text-primary transition-all p-1">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Top Brokers */}
        <div className="bg-surface rounded-xl border border-border p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-warning" />
                <h3 className="text-primary font-semibold text-sm">Top Brokers</h3>
              </div>
              <button
                onClick={() => navigate('/app/admin/brokers')}
                className="text-accent hover:text-accent/80 text-xs font-medium px-2 py-1 rounded-md bg-accent/10 hover:bg-accent/15 transition-colors"
              >
                View all
              </button>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-1 rounded-lg shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 bg-surface-1 rounded w-1/2 mb-1" />
                      <div className="h-2.5 bg-surface-1 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : brokers.length === 0 ? (
              <p className="text-secondary text-xs text-center py-8">No broker telemetry recorded</p>
            ) : (
              <div className="space-y-2.5">
                {brokers.slice(0, 3).map((broker) => {
                  const isLoss = broker.totalPnl < 0;
                  return (
                    <div key={broker.providerId} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-1 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <BrokerLogo
                          providerId={broker.providerId}
                          size="sm"
                          fallbackText={broker.name.slice(0, 2).toUpperCase()}
                        />
                        <div className="min-w-0">
                          <p className="text-primary text-xs font-semibold truncate">{broker.name}</p>
                          <p className="text-text-muted text-[11px]">
                            {broker.trades} trades {broker.activeConnections > 0 ? `· ${broker.activeConnections} active` : ''}
                          </p>
                        </div>
                      </div>
                      <div className={`text-xs font-semibold ${isLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {broker.totalPnl > 0 ? '+' : ''}{formatCurrency(broker.totalPnl)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: AI Insights Spotlight */}
        <div className="bg-surface rounded-xl border border-border p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-primary font-semibold text-sm">AI Insights</h3>
            </div>

            {/* Glowing 3D Radiant Orb Graphic */}
            <div className="flex items-center justify-center my-3 relative">
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Background Radiant Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/40 via-indigo-500/30 to-blue-500/20 blur-xl animate-pulse" />
                {/* Multi-layered Glassmorphic 3D Sphere */}
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-slate-950 p-[2px] shadow-[inset_0_2px_12px_rgba(255,255,255,0.4),0_8px_20px_rgba(139,92,246,0.4)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-900/90 via-indigo-800/80 to-purple-600/60 flex items-center justify-center backdrop-blur-md">
                    <Brain className="w-7 h-7 text-purple-200 drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats copy */}
            <div className="text-center space-y-1">
              <p className="text-primary text-sm font-semibold">
                {stats?.aiInsights ?? 31} insights generated
              </p>
              <p className="text-emerald-400 text-xs font-medium">
                +12% from last period
              </p>
            </div>
          </div>

          {/* CTA Action Button */}
          <button
            onClick={() => navigate('/app/admin/ai')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-accent to-purple-600 hover:from-accent/90 hover:to-purple-500 text-white font-medium text-xs shadow-md shadow-accent/20 transition-all group"
          >
            <span>View Insights</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
