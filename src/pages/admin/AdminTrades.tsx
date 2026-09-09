import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  TrendingUp,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Target,
  BarChart3,
  Users,
  User,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Sparkles,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { api } from '../../lib/api';
import AnimatedNumber from '../../components/admin/AnimatedNumber';
import { SkeletonCard, SkeletonTable, SkeletonChart } from '../../components/admin/SkeletonLoader';
import { cn } from '../../lib/cn';
import { EmptyState } from '../../components/ui/EmptyState';

interface UserMeta {
  id: string;
  email: string;
  fullName: string | null;
  role?: 'USER' | 'SUB_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt?: string;
  totalTrades?: number;
  netPnl?: number;
}

interface Trade {
  id: string;
  userId: string;
  user?: UserMeta;
  userName?: string;
  symbol: string;
  market: string;
  instrumentType?: string;
  direction?: string;
  entryPrice?: number | string;
  exitPrice?: number | string;
  quantity?: number | string;
  pnl?: number | string;
  netPnl?: number | string;
  status?: string;
  date?: string;
  entryDate?: string;
  exitTime?: string;
  broker?: string;
}

interface UserGroupStats {
  totalTrades: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  totalPnl: number;
  lastTradeDate: string | null;
}

interface UserGroup {
  user: UserMeta;
  stats: UserGroupStats;
  trades: Trade[];
}

interface OverallStats {
  totalUsers?: number;
  totalTrades: number;
  winRate: number;
  avgPnl: number;
  totalPnl: number;
}

interface GroupedResponse {
  userGroups: UserGroup[];
  totalUsers: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: OverallStats;
}

interface FlatTradesResponse {
  trades: Trade[];
  total: number;
  page: number;
  limit: number;
  stats: OverallStats;
}

const MARKETS = ['ALL', 'EQUITY', 'F&O', 'COMMODITY', 'CURRENCY', 'CRYPTO'];
const STATUSES = ['ALL', 'WIN', 'LOSS', 'OPEN', 'CLOSED', 'CANCELLED'];
const PIE_COLORS = ['#4F8EF7', '#22C55E', '#F43F5E', '#F59E0B', '#8B7CF8', '#EC4899'];

const inputCls =
  'bg-canvas border border-border text-primary rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-muted';

const roleBadge = (role?: string) => {
  const styles: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    ADMIN: 'bg-info/10 text-info border border-info/20',
    SUB_ADMIN: 'bg-warning/10 text-warning border border-warning/20',
    USER: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };
  return styles[role || 'USER'] || styles.USER;
};

export default function AdminTrades() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // View mode: 'grouped' (user cards), 'spotlight' (single user detail), 'stream' (flat chronological stream)
  const [viewMode, setViewMode] = useState<'grouped' | 'spotlight' | 'stream'>('grouped');

  // Selected specific user for spotlight mode
  const [selectedUserId, setSelectedUserId] = useState<string>(searchParams.get('userId') || 'ALL');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [market, setMarket] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // in grouped mode: 10 users per page; in flat/spotlight: 20 trades per page

  // Data states
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [flatTrades, setFlatTrades] = useState<Trade[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<OverallStats | null>(null);

  // Available users list for dropdown picker
  const [allUsers, setAllUsers] = useState<UserMeta[]>([]);
  const [loadingUsersList, setLoadingUsersList] = useState(false);

  // Expanded accordions state: Set of userIds
  const [expandedUserIds, setExpandedUserIds] = useState<Set<string>>(new Set());

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load user directory once for dropdown selection
  useEffect(() => {
    const loadUsersDirectory = async () => {
      try {
        setLoadingUsersList(true);
        const data = await api.get<UserMeta[]>('/admin/users');
        if (Array.isArray(data)) {
          setAllUsers(data);
        }
      } catch (err) {
        console.warn('Failed to load user directory for trade filter:', err);
      } finally {
        setLoadingUsersList(false);
      }
    };
    loadUsersDirectory();
  }, []);

  // Update selectedUserId when query param changes
  useEffect(() => {
    const paramUserId = searchParams.get('userId');
    if (paramUserId && paramUserId !== selectedUserId) {
      setSelectedUserId(paramUserId);
      setViewMode('spotlight');
    }
  }, [searchParams]);

  // Fetch data depending on active view mode
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: (viewMode === 'grouped' ? 10 : 20).toString(),
      });

      if (debouncedSearch) params.set('search', debouncedSearch);
      if (market !== 'ALL') params.set('market', market);
      if (status !== 'ALL') params.set('status', status);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      if (viewMode === 'grouped' && selectedUserId === 'ALL') {
        // Grouped by user mode
        const data = await api.get<GroupedResponse>(`/admin/trades/by-user?${params}`);
        setUserGroups(data.userGroups || []);
        setTotalItems(data.totalUsers || 0);
        setTotalPages(data.totalPages || 1);
        setStats(data.stats || null);

        // Auto-expand first 2 users if empty
        if (expandedUserIds.size === 0 && data.userGroups?.length > 0) {
          const initialExpanded = new Set<string>();
          data.userGroups.slice(0, 2).forEach((g) => initialExpanded.add(g.user.id));
          setExpandedUserIds(initialExpanded);
        }
      } else {
        // Spotlight mode (specific user) or Stream mode (flat chronological)
        if (selectedUserId !== 'ALL') {
          params.set('userId', selectedUserId);
        }
        const data = await api.get<FlatTradesResponse>(`/admin/trades?${params}`);
        setFlatTrades(data.trades || []);
        setTotalItems(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / (viewMode === 'grouped' ? 10 : 20)) || 1);
        setStats(data.stats || null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trade data');
    } finally {
      setLoading(false);
    }
  }, [page, viewMode, selectedUserId, debouncedSearch, market, status, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Expand / collapse single user
  const toggleUserExpanded = (userId: string) => {
    setExpandedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  // Expand all / collapse all
  const toggleAllExpanded = () => {
    if (expandedUserIds.size === userGroups.length) {
      setExpandedUserIds(new Set());
    } else {
      setExpandedUserIds(new Set(userGroups.map((g) => g.user.id)));
    }
  };

  // Switch to spotlight for a user
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setPage(1);
    if (userId === 'ALL') {
      setViewMode('grouped');
      searchParams.delete('userId');
      setSearchParams(searchParams);
    } else {
      setViewMode('spotlight');
      setSearchParams({ userId });
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setMarket('ALL');
    setStatus('ALL');
    setStartDate('');
    setEndDate('');
    setSelectedUserId('ALL');
    setViewMode('grouped');
    setPage(1);
    setSearchParams({});
  };

  // Active selected user meta
  const selectedUserMeta = useMemo(() => {
    if (selectedUserId === 'ALL') return null;
    return allUsers.find((u) => u.id === selectedUserId) || null;
  }, [selectedUserId, allUsers]);

  // Market distribution for pie chart
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    if (viewMode === 'grouped' && selectedUserId === 'ALL') {
      userGroups.forEach((g) => {
        g.trades.forEach((t) => {
          const m = t.market || 'Other';
          counts[m] = (counts[m] || 0) + 1;
        });
      });
    } else {
      flatTrades.forEach((t) => {
        const m = t.market || 'Other';
        counts[m] = (counts[m] || 0) + 1;
      });
    }
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      fill: PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [viewMode, selectedUserId, userGroups, flatTrades]);

  // Custom Tooltip for Market Breakdown Pie Chart (avoids black text on hover)
  const renderMarketTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    const data = item.payload;
    const name = item.name || data?.name || 'Market';
    const count = item.value ?? data?.value ?? 0;
    const color = data?.fill || item.color || '#4F8EF7';
    const total = pieData.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const percent = total > 0 ? ((count / total) * 100).toFixed(1) : '0';

    return (
      <div className="p-3 rounded-xl bg-surface-elevated/95 border border-border shadow-2xl backdrop-blur-md min-w-[150px] space-y-1.5 z-50">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="font-bold text-xs text-primary uppercase tracking-wider">
            {name}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4 pt-1.5 border-t border-border/50">
          <span className="text-[11px] text-secondary font-medium">Trade Volume:</span>
          <span className="text-sm font-bold font-mono text-emerald-400">
            {count.toLocaleString()}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4 text-[10px] text-tertiary">
          <span>Market Share:</span>
          <span className="font-mono font-semibold text-iris">
            {percent}%
          </span>
        </div>
      </div>
    );
  };

  // Top profitable traders in active view
  const topTraders = useMemo(() => {
    if (userGroups.length > 0) {
      return [...userGroups]
        .sort((a, b) => b.stats.totalPnl - a.stats.totalPnl)
        .slice(0, 5);
    }
    return [];
  }, [userGroups]);

  const statCards = [
    {
      label: 'Active Traders',
      value: stats?.totalUsers || (selectedUserId !== 'ALL' ? 1 : userGroups.length),
      prefix: '',
      suffix: '',
      decimals: 0,
      colorClass: 'text-iris',
      icon: Users,
    },
    {
      label: 'Total Trades',
      value: stats?.totalTrades || 0,
      prefix: '',
      suffix: '',
      decimals: 0,
      colorClass: 'text-iris',
      icon: TrendingUp,
    },
    {
      label: 'Win Rate',
      value: stats?.winRate || 0,
      prefix: '',
      suffix: '%',
      decimals: 1,
      colorClass: 'text-emerald-400',
      icon: Target,
    },
    {
      label: 'Total Net P&L',
      value: stats?.totalPnl || 0,
      prefix: '₹',
      suffix: '',
      decimals: 2,
      colorClass: (stats?.totalPnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400',
      icon: BarChart3,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-iris/10 border border-iris/20 flex items-center justify-center text-iris shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span>Super Admin Trades Explorer</span>
          </h1>
          <p className="text-secondary text-sm mt-1">
            Platform-wide trade analysis organized strictly on the basis of individual users
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="inline-flex p-1 bg-surface-1 border border-border rounded-xl shadow-inner self-start sm:self-auto">
          <button
            onClick={() => handleSelectUser('ALL')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all',
              viewMode === 'grouped' && selectedUserId === 'ALL'
                ? 'bg-canvas text-primary shadow-sm border border-border/80 font-semibold'
                : 'text-tertiary hover:text-primary hover:bg-surface-2/60',
            )}
            title="Group trades on the basis of each user"
          >
            <Users className="w-3.5 h-3.5 text-iris" />
            <span>Grouped by User</span>
          </button>

          <button
            onClick={() => {
              setViewMode('stream');
              setPage(1);
            }}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all',
              viewMode === 'stream' && selectedUserId === 'ALL'
                ? 'bg-canvas text-primary shadow-sm border border-border/80 font-semibold'
                : 'text-tertiary hover:text-primary hover:bg-surface-2/60',
            )}
            title="Raw chronological platform trade feed"
          >
            <Layers className="w-3.5 h-3.5 text-secondary" />
            <span>All Trades Stream</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => fetchData()} className="text-xs underline hover:opacity-80">
            Retry
          </button>
        </div>
      )}

      {/* Top Stat Cards */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="card p-5 hover:border-border-hover transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-secondary text-xs font-medium uppercase tracking-wider">
                      {card.label}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-surface-1 flex items-center justify-center">
                      <Icon className={cn('w-4 h-4', card.colorClass)} />
                    </div>
                  </div>
                  <div className={cn('text-2xl font-bold tracking-tight', card.colorClass)}>
                    <AnimatedNumber
                      value={card.value}
                      prefix={card.prefix}
                      suffix={card.suffix}
                      decimals={card.decimals}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Spotlight Header Banner (When a specific user is focused) */}
      {selectedUserId !== 'ALL' && (
        <div className="card p-5 border-iris/30 bg-iris/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSelectUser('ALL')}
              className="p-2 rounded-xl bg-canvas border border-border text-secondary hover:text-primary hover:bg-surface-1 transition-colors"
              title="Return to all traders"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-iris/30 to-purple-500/20 border border-iris/40 flex items-center justify-center text-iris font-bold text-lg shadow-sm">
              {(selectedUserMeta?.fullName || selectedUserMeta?.email || 'U').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-primary">
                  {selectedUserMeta?.fullName || 'Anonymous Trader'}
                </h2>
                <span
                  className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider',
                    roleBadge(selectedUserMeta?.role),
                  )}
                >
                  {selectedUserMeta?.role || 'USER'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-secondary mt-0.5">
                <span className="font-mono text-tertiary">{selectedUserMeta?.email}</span>
                <span>•</span>
                <span className="text-tertiary font-mono">ID: {selectedUserId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => navigate(`/admin/users/${selectedUserId}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas border border-border text-xs font-medium text-primary hover:bg-surface-1 transition-colors shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-iris" />
              <span>Full User Profile</span>
              <ExternalLink className="w-3 h-3 text-tertiary" />
            </button>
            <button
              onClick={() => handleSelectUser('ALL')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-1 border border-border text-xs font-medium text-secondary hover:text-primary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Exit Spotlight</span>
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Filter Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Trader Selector Dropdown */}
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <User className="w-4 h-4 text-iris absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedUserId}
                onChange={(e) => handleSelectUser(e.target.value)}
                className={cn(inputCls, 'w-full pl-9 font-medium text-primary cursor-pointer')}
                disabled={loadingUsersList}
              >
                <option value="ALL">👥 All Traders (Grouped by User)</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    👤 {u.fullName ? `${u.fullName} (${u.email})` : u.email}
                    {u.totalTrades ? ` — ${u.totalTrades} trades` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trader name, email, or symbol…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(inputCls, 'w-full pl-9')}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Market Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-tertiary hidden sm:block" />
            <select
              value={market}
              onChange={(e) => {
                setMarket(e.target.value);
                setPage(1);
              }}
              className={inputCls}
            >
              {MARKETS.map((m) => (
                <option key={m} value={m}>
                  {m === 'ALL' ? 'All Markets' : m}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={inputCls}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All Status' : s}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className={cn(inputCls, 'text-xs')}
              title="From date"
            />
            <span className="text-tertiary text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className={cn(inputCls, 'text-xs')}
              title="To date"
            />
          </div>

          {/* Reset Filters button */}
          {(searchQuery || market !== 'ALL' || status !== 'ALL' || startDate || endDate || selectedUserId !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-1 hover:bg-surface-2 text-xs text-secondary hover:text-primary transition-colors border border-border"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Trades Display (Grouped or Stream/Spotlight) */}
        <div className="lg:col-span-2 space-y-4">
          {/* VIEW 1: Grouped by User Mode */}
          {viewMode === 'grouped' && selectedUserId === 'ALL' ? (
            <div className="space-y-4">
              {/* Grouped Mode Toolbar */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-iris" />
                  <span className="text-sm font-semibold text-primary">
                    Traders Activity Breakdown
                  </span>
                  <span className="text-xs text-tertiary">
                    ({totalItems} {totalItems === 1 ? 'trader' : 'traders'} with trades)
                  </span>
                </div>

                {userGroups.length > 0 && (
                  <button
                    onClick={toggleAllExpanded}
                    className="text-xs font-medium text-iris hover:underline flex items-center gap-1"
                  >
                    {expandedUserIds.size === userGroups.length ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" /> Collapse All
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" /> Expand All
                      </>
                    )}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonTable key={i} rows={4} cols={5} />
                  ))}
                </div>
              ) : userGroups.length === 0 ? (
                <div className="card p-8 text-center">
                  <EmptyState
                    icon={Users}
                    title="No traders found"
                    description="No trades matched your active search or filter criteria. Try adjusting the filters above."
                  />
                </div>
              ) : (
                /* Trader Accordion Cards List */
                <div className="space-y-3">
                  {userGroups.map((group) => {
                    const isExpanded = expandedUserIds.has(group.user.id);
                    const isProfitable = group.stats.totalPnl >= 0;

                    return (
                      <div
                        key={group.user.id}
                        className={cn(
                          'card transition-all duration-200 overflow-hidden border',
                          isExpanded
                            ? 'border-iris/40 shadow-md bg-canvas'
                            : 'border-border hover:border-border-hover bg-surface-1/40',
                        )}
                      >
                        {/* Trader Summary Header (Click to expand) */}
                        <div
                          onClick={() => toggleUserExpanded(group.user.id)}
                          className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none hover:bg-surface-1/60 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-iris/20 to-purple-600/20 border border-iris/30 flex items-center justify-center font-bold text-sm text-iris flex-shrink-0">
                              {(group.user.fullName || group.user.email || 'U')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-primary text-sm">
                                  {group.user.fullName || 'Anonymous Trader'}
                                </span>
                                <span
                                  className={cn(
                                    'text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider',
                                    roleBadge(group.user.role),
                                  )}
                                >
                                  {group.user.role || 'USER'}
                                </span>
                              </div>
                              <div className="text-xs text-secondary flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-tertiary">{group.user.email}</span>
                                {group.stats.lastTradeDate && (
                                  <>
                                    <span>•</span>
                                    <span className="text-tertiary">
                                      Last:{' '}
                                      {new Date(group.stats.lastTradeDate).toLocaleDateString()}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Trader Performance Stats & Action Chevrons */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
                            <div className="flex items-center gap-3 text-right">
                              {/* Trades Count */}
                              <div className="px-2.5 py-1 rounded-lg bg-surface-1 border border-border text-center">
                                <div className="text-[10px] text-tertiary uppercase font-medium">
                                  Trades
                                </div>
                                <div className="text-xs font-bold text-primary">
                                  {group.stats.totalTrades}
                                </div>
                              </div>

                              {/* Win Rate */}
                              <div className="px-2.5 py-1 rounded-lg bg-surface-1 border border-border text-center">
                                <div className="text-[10px] text-tertiary uppercase font-medium">
                                  Win Rate
                                </div>
                                <div className="text-xs font-bold text-emerald-400">
                                  {group.stats.winRate}%
                                </div>
                              </div>

                              {/* Total P&L */}
                              <div className="px-3 py-1 rounded-lg bg-surface-1 border border-border text-right min-w-[90px]">
                                <div className="text-[10px] text-tertiary uppercase font-medium">
                                  Net P&L
                                </div>
                                <div
                                  className={cn(
                                    'text-xs font-bold',
                                    isProfitable ? 'text-emerald-400' : 'text-rose-400',
                                  )}
                                >
                                  {isProfitable ? '+' : ''}₹
                                  {Math.abs(group.stats.totalPnl).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Chevron Toggle */}
                            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-secondary hover:text-primary transition-colors flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Trade List for this User */}
                        {isExpanded && (
                          <div className="border-t border-border bg-canvas">
                            {/* Card sub-header with actions */}
                            <div className="px-4 py-2 bg-surface-1/50 border-b border-border flex items-center justify-between text-xs">
                              <span className="text-secondary font-medium">
                                Recent Trades for {group.user.fullName || group.user.email} (
                                {group.trades.length})
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectUser(group.user.id);
                                  }}
                                  className="text-iris hover:underline flex items-center gap-1 font-medium"
                                >
                                  <Target className="w-3.5 h-3.5" />
                                  <span>Spotlight Focus</span>
                                </button>
                                <span>•</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/users/${group.user.id}`);
                                  }}
                                  className="text-secondary hover:text-primary flex items-center gap-1"
                                >
                                  <span>User Profile</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {group.trades.length === 0 ? (
                              <div className="p-6 text-center text-secondary text-xs">
                                No trades matching the active filter criteria for this user.
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-surface-1 text-tertiary border-b border-border">
                                    <tr>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Date
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Symbol
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Market
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Dir
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Entry
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Exit
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Qty
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider text-right">
                                        Net P&L
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Status
                                      </th>
                                      <th className="px-4 py-2.5 font-semibold text-[10px] uppercase tracking-wider">
                                        Broker
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border/60">
                                    {group.trades.map((t) => {
                                      const tradeDate = t.date || t.entryDate;
                                      const netPnlVal = Number(t.netPnl ?? t.pnl ?? 0);
                                      return (
                                        <tr
                                          key={t.id}
                                          className="hover:bg-surface-1/40 transition-colors"
                                        >
                                          <td className="px-4 py-2.5 text-secondary whitespace-nowrap">
                                            {tradeDate
                                              ? new Date(tradeDate).toLocaleDateString()
                                              : '—'}
                                          </td>
                                          <td className="px-4 py-2.5 font-semibold text-primary">
                                            {t.symbol}
                                          </td>
                                          <td className="px-4 py-2.5 text-secondary">{t.market}</td>
                                          <td className="px-4 py-2.5">
                                            <span
                                              className={cn(
                                                'px-1.5 py-0.5 rounded text-[10px] font-semibold',
                                                t.direction === 'LONG'
                                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
                                              )}
                                            >
                                              {t.direction || '—'}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2.5 text-secondary">
                                            ₹{Number(t.entryPrice || 0).toLocaleString()}
                                          </td>
                                          <td className="px-4 py-2.5 text-secondary">
                                            {t.exitPrice
                                              ? `₹${Number(t.exitPrice).toLocaleString()}`
                                              : '—'}
                                          </td>
                                          <td className="px-4 py-2.5 text-secondary">
                                            {t.quantity ? Number(t.quantity).toLocaleString() : '—'}
                                          </td>
                                          <td className="px-4 py-2.5 text-right font-medium">
                                            <span
                                              className={cn(
                                                netPnlVal >= 0 ? 'text-emerald-400' : 'text-rose-400',
                                              )}
                                            >
                                              {netPnlVal >= 0 ? '+' : ''}₹
                                              {netPnlVal.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2.5">
                                            <span
                                              className={cn(
                                                'px-1.5 py-0.5 rounded text-[10px] font-semibold',
                                                t.status === 'WIN' || t.status === 'CLOSED'
                                                  ? 'bg-emerald-500/10 text-emerald-400'
                                                  : t.status === 'LOSS'
                                                  ? 'bg-rose-500/10 text-rose-400'
                                                  : t.status === 'OPEN'
                                                  ? 'bg-sky-500/10 text-sky-400'
                                                  : 'bg-surface-2 text-tertiary',
                                              )}
                                            >
                                              {t.status || 'CLOSED'}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2.5 text-tertiary capitalize">
                                            {t.broker || '—'}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* VIEW 2 & 3: Single Trader Spotlight OR Flat Chronological Stream */
            <div className="card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-surface-1/40">
                <div className="flex items-center gap-2">
                  {selectedUserId !== 'ALL' ? (
                    <>
                      <Target className="w-4 h-4 text-iris" />
                      <span className="text-sm font-semibold text-primary">
                        Trade Log for {selectedUserMeta?.fullName || selectedUserMeta?.email || selectedUserId}
                      </span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-semibold text-primary">
                        Platform Trade Audit Feed
                      </span>
                    </>
                  )}
                  <span className="text-xs text-tertiary">({totalItems} total)</span>
                </div>

                {selectedUserId !== 'ALL' && (
                  <button
                    onClick={() => handleSelectUser('ALL')}
                    className="text-xs text-iris hover:underline flex items-center gap-1 font-medium"
                  >
                    ← Back to All Traders
                  </button>
                )}
              </div>

              {loading ? (
                <SkeletonTable rows={10} cols={7} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-1 text-tertiary border-b border-border">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                          Date
                        </th>
                        {selectedUserId === 'ALL' && (
                          <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                            Trader
                          </th>
                        )}
                        <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                          Market
                        </th>
                        <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                          Dir
                        </th>
                        <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                          Entry
                        </th>
                        <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                          Exit
                        </th>
                        <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">
                          Net P&L
                        </th>
                        <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {flatTrades.map((t) => {
                        const tradeDate = t.date || t.entryDate;
                        const netPnlVal = Number(t.netPnl ?? t.pnl ?? 0);
                        const traderName =
                          t.user?.fullName || t.user?.email || t.userName || t.userId?.slice(0, 8);

                        return (
                          <tr key={t.id} className="hover:bg-surface-1/50 transition-colors">
                            <td className="px-4 py-3 text-secondary whitespace-nowrap text-xs">
                              {tradeDate ? new Date(tradeDate).toLocaleDateString() : '—'}
                            </td>

                            {selectedUserId === 'ALL' && (
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleSelectUser(t.userId)}
                                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface-2 hover:bg-surface-2/80 text-xs font-medium text-primary hover:text-iris transition-colors group"
                                  title="Filter solely to this user's trades"
                                >
                                  <User className="w-3 h-3 text-iris group-hover:scale-110 transition-transform" />
                                  <span>{traderName}</span>
                                </button>
                              </td>
                            )}

                            <td className="px-4 py-3 text-primary font-medium">{t.symbol}</td>
                            <td className="px-4 py-3 text-secondary text-xs">{t.market}</td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  'px-1.5 py-0.5 rounded text-xs font-semibold',
                                  t.direction === 'LONG'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
                                )}
                              >
                                {t.direction || '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-secondary text-xs">
                              ₹{Number(t.entryPrice || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-secondary text-xs">
                              {t.exitPrice ? `₹${Number(t.exitPrice).toLocaleString()}` : '—'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={cn(
                                  'font-semibold text-sm',
                                  netPnlVal >= 0 ? 'text-emerald-400' : 'text-rose-400',
                                )}
                              >
                                {netPnlVal >= 0 ? '+' : ''}₹
                                {netPnlVal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  'px-1.5 py-0.5 rounded text-xs font-medium',
                                  t.status === 'WIN' || t.status === 'CLOSED'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : t.status === 'LOSS'
                                    ? 'bg-rose-500/10 text-rose-400'
                                    : t.status === 'OPEN'
                                    ? 'bg-sky-500/10 text-sky-400'
                                    : 'bg-surface-2 text-tertiary',
                                )}
                              >
                                {t.status || 'CLOSED'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {flatTrades.length === 0 && (
                    <div className="p-8">
                      <EmptyState
                        icon={Target}
                        title="No trades found"
                        description="There are currently no trades matching your active search criteria."
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="card flex items-center justify-between px-6 py-4">
              <span className="text-secondary text-sm">
                Page {page} of {totalPages}{' '}
                <span className="text-tertiary text-xs">({totalItems} total records)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-canvas border border-border text-secondary hover:bg-surface-1 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-primary text-sm font-medium px-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-canvas border border-border text-secondary hover:bg-surface-1 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Market Distribution & Top Traders Leaderboard */}
        <div className="space-y-6">
          {/* Market Distribution Pie Chart */}
          <div className="card p-6">
            <h3 className="text-primary font-semibold text-sm mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-iris" />
              <span>Market Breakdown</span>
            </h3>
            {loading ? (
              <SkeletonChart />
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={renderMarketTooltip}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-secondary text-xs font-medium mr-1.5">{value}</span>
                    )}
                    wrapperStyle={{
                      color: 'rgb(var(--color-text-secondary))',
                      fontSize: '11px',
                      paddingTop: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-secondary text-xs">
                No market data
              </div>
            )}
          </div>

          {/* Top Traders Ranking (In Grouped Mode) */}
          {topTraders.length > 0 && viewMode === 'grouped' && selectedUserId === 'ALL' && (
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-primary font-semibold text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Top Profit Performers</span>
                </h3>
                <span className="text-[11px] text-tertiary">Active batch</span>
              </div>

              <div className="divide-y divide-border/60">
                {topTraders.map((trader, idx) => {
                  const isProfitable = trader.stats.totalPnl >= 0;
                  return (
                    <div
                      key={trader.user.id}
                      onClick={() => handleSelectUser(trader.user.id)}
                      className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-surface-1/50 px-2 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-tertiary w-4">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-primary group-hover:text-iris transition-colors">
                            {trader.user.fullName || trader.user.email}
                          </div>
                          <div className="text-[10px] text-tertiary">
                            {trader.stats.totalTrades} trades • {trader.stats.winRate}% win
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          'text-xs font-bold font-mono',
                          isProfitable ? 'text-emerald-400' : 'text-rose-400',
                        )}
                      >
                        {isProfitable ? '+' : ''}₹
                        {Math.abs(trader.stats.totalPnl).toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
