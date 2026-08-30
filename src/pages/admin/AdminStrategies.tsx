import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Search, Filter, ChevronLeft, ChevronRight, Eye, Edit3, Trash2,
  TrendingUp, BarChart3, Layers, CheckCircle2, XCircle, AlertTriangle,
  X, Loader2, ExternalLink, Sparkles, User, Plus, ShieldCheck
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from '../../lib/api';
import { notify } from '../../lib/notify';
import AnimatedNumber from '../../components/admin/AnimatedNumber';
import { SkeletonCard, SkeletonTable } from '../../components/admin/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';

interface StrategyOwner {
  id: string;
  email: string;
  fullName: string | null;
  role?: string;
}

interface AdminStrategy {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  rules: string | null;
  market: string[];
  timeframe: string | null;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
  user?: StrategyOwner;
  tradesCount: number;
  totalPnl: number;
  winRate: number;
  avgPnl: number;
}

interface StrategyStats {
  totalStrategies: number;
  defaultStrategies: number;
  customStrategies: number;
  activeStrategies: number;
  inactiveStrategies: number;
  totalTradesTagged: number;
  totalPnl: number;
}

interface StrategiesResponse {
  strategies: AdminStrategy[];
  total: number;
  page: number;
  limit: number;
  stats: StrategyStats;
}

type TypeFilter = 'ALL' | 'DEFAULT' | 'CUSTOM';

const MARKETS = ['ALL', 'EQUITY', 'F&O', 'COMMODITY', 'CURRENCY', 'CRYPTO'];
const STATUS_OPTIONS = [
  { label: 'All Status', value: 'ALL' },
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' }
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Recently Created' },
  { value: 'name', label: 'Strategy Name' },
];

const inputCls = 'bg-canvas border border-border text-primary rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-muted';

export default function AdminStrategies() {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<AdminStrategy[]>([]);
  const [stats, setStats] = useState<StrategyStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [market, setMarket] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedStrategy, setSelectedStrategy] = useState<AdminStrategy | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createDefaultModalOpen, setCreateDefaultModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Create default strategy form state
  const [defaultForm, setDefaultForm] = useState({
    name: '',
    description: '',
    rules: '',
    timeframe: '15m',
    market: ['EQUITY', 'F&O'],
    isActive: true,
  });

  // Edit form state
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
    rules: string;
    timeframe: string;
    market: string[];
    isActive: boolean;
    isDefault: boolean;
  }>({
    name: '',
    description: '',
    rules: '',
    timeframe: '',
    market: [],
    isActive: true,
    isDefault: false,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchStrategies = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order,
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      if (market !== 'ALL') params.set('market', market);
      if (statusFilter !== 'ALL') params.set('isActive', statusFilter);

      const data = await api.get<StrategiesResponse>(`/admin/strategies?${params}`);
      setStrategies(data.strategies || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch strategies');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, typeFilter, market, statusFilter, sort, order]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const handleCreateDefaultStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.post('/admin/strategies/default', defaultForm);
      notify.success('Default system strategy created successfully');
      setCreateDefaultModalOpen(false);
      setDefaultForm({
        name: '',
        description: '',
        rules: '',
        timeframe: '15m',
        market: ['EQUITY', 'F&O'],
        isActive: true,
      });
      fetchStrategies();
    } catch (err: any) {
      notify.error(err.message || 'Failed to create default strategy');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEdit = (strat: AdminStrategy) => {
    setSelectedStrategy(strat);
    setEditForm({
      name: strat.name || '',
      description: strat.description || '',
      rules: strat.rules || '',
      timeframe: strat.timeframe || '',
      market: Array.isArray(strat.market) ? strat.market : [],
      isActive: strat.isActive ?? true,
      isDefault: strat.isDefault ?? false,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStrategy) return;
    try {
      setActionLoading(true);
      await api.patch(`/admin/strategies/${selectedStrategy.id}`, editForm);
      notify.success('Strategy updated successfully');
      setEditModalOpen(false);
      fetchStrategies();
    } catch (err: any) {
      notify.error(err.message || 'Failed to update strategy');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (strat: AdminStrategy) => {
    try {
      await api.patch(`/admin/strategies/${strat.id}`, { isActive: !strat.isActive });
      notify.success(`Strategy marked as ${!strat.isActive ? 'Active' : 'Inactive'}`);
      setStrategies(prev => prev.map(s => s.id === strat.id ? { ...s, isActive: !s.isActive } : s));
      if (selectedStrategy && selectedStrategy.id === strat.id) {
        setSelectedStrategy(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
      }
    } catch (err: any) {
      notify.error(err.message || 'Failed to toggle strategy status');
    }
  };

  const handleDelete = async () => {
    if (!selectedStrategy) return;
    try {
      setActionLoading(true);
      await api.delete(`/admin/strategies/${selectedStrategy.id}`);
      notify.success('Strategy deleted successfully');
      setDeleteModalOpen(false);
      setSelectedStrategy(null);
      fetchStrategies();
    } catch (err: any) {
      notify.error(err.message || 'Failed to delete strategy');
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const statCards = [
    { label: 'Total Strategies', value: stats?.totalStrategies || 0, prefix: '', suffix: '', decimals: 0, colorClass: 'text-primary', icon: Target },
    { label: 'Default Setups', value: stats?.defaultStrategies || 0, prefix: '', suffix: '', decimals: 0, colorClass: 'text-iris', icon: Sparkles },
    { label: 'User Custom Setups', value: stats?.customStrategies || 0, prefix: '', suffix: '', decimals: 0, colorClass: 'text-accent', icon: User },
    { label: 'Cumulative P&L', value: stats?.totalPnl || 0, prefix: '₹', suffix: '', decimals: 2, colorClass: (stats?.totalPnl || 0) >= 0 ? 'text-success' : 'text-danger', icon: TrendingUp },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="p-2 rounded-xl bg-iris/10 text-iris">
              <Target className="w-6 h-6" />
            </div>
            Strategy Management
          </h1>
          <p className="text-secondary text-sm mt-1">
            Manage system-wide Default Strategies and supervise user Custom Strategies across RiskRules
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCreateDefaultModalOpen(true)}
          className="w-max"
        >
          <Plus size={16} /> New Default Strategy
        </Button>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="card p-6 hover:border-border-hover transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-secondary text-sm font-medium">{card.label}</span>
                  <Icon className={cn('w-5 h-5', card.colorClass)} />
                </div>
                <div className={cn('text-2xl font-bold font-mono', card.colorClass)}>
                  <AnimatedNumber value={card.value} prefix={card.prefix} suffix={card.suffix} decimals={card.decimals} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs & Search Filters */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => { setTypeFilter('ALL'); setPage(1); }}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2',
              typeFilter === 'ALL'
                ? 'bg-surface text-primary border border-border shadow-xs'
                : 'text-tertiary hover:text-secondary'
            )}
          >
            <Layers size={14} />
            All Strategies
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-surface-2 text-muted font-mono">
              {stats?.totalStrategies || 0}
            </span>
          </button>

          <button
            onClick={() => { setTypeFilter('DEFAULT'); setPage(1); }}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2',
              typeFilter === 'DEFAULT'
                ? 'bg-iris/10 text-iris border border-iris/20 shadow-xs'
                : 'text-tertiary hover:text-secondary'
            )}
          >
            <Sparkles size={14} className="text-iris" />
            Default Strategies (System)
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-iris/10 text-iris font-mono">
              {stats?.defaultStrategies || 0}
            </span>
          </button>

          <button
            onClick={() => { setTypeFilter('CUSTOM'); setPage(1); }}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2',
              typeFilter === 'CUSTOM'
                ? 'bg-accent/10 text-accent border border-accent/20 shadow-xs'
                : 'text-tertiary hover:text-secondary'
            )}
          >
            <User size={14} className="text-accent" />
            Custom Strategies (User-Defined)
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-accent/10 text-accent font-mono">
              {stats?.customStrategies || 0}
            </span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search strategies by name, rules, or user email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(inputCls, 'w-full pl-10')}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-tertiary" />
              <select
                value={market}
                onChange={(e) => { setMarket(e.target.value); setPage(1); }}
                className={inputCls}
              >
                {MARKETS.map((m) => (
                  <option key={m} value={m}>{m === 'ALL' ? 'All Markets' : m}</option>
                ))}
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className={inputCls}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className={inputCls}
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <button
              onClick={() => setOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className={cn(inputCls, 'hover:border-accent font-medium text-xs uppercase tracking-wider')}
              title="Toggle sort order"
            >
              {order.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Strategies Table */}
      {loading ? (
        <SkeletonTable rows={10} cols={7} />
      ) : strategies.length === 0 ? (
        <EmptyState
          icon={Target}
          title={typeFilter === 'DEFAULT' ? 'No Default Strategies' : typeFilter === 'CUSTOM' ? 'No Custom Strategies' : 'No strategies found'}
          description="No trading strategies match your current filter and search criteria."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-1 text-tertiary border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Type</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Strategy Name</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Creator / Owner</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Markets</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Trades</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Win Rate</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest text-right">Net P&L</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {strategies.map((strat) => {
                  const isProfitable = strat.totalPnl >= 0;
                  return (
                    <tr key={strat.id} className="hover:bg-surface-1/50 transition-colors">
                      {/* Type badge */}
                      <td className="px-4 py-3">
                        {strat.isDefault ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-iris/10 text-iris border border-iris/20 text-[9px] font-bold uppercase tracking-wider">
                            <Sparkles size={10} /> Default
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20 text-[9px] font-bold uppercase tracking-wider">
                            <User size={10} /> Custom
                          </span>
                        )}
                      </td>

                      {/* Strategy name & timeframe */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-bold text-primary text-sm hover:text-iris transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedStrategy(strat);
                              setViewModalOpen(true);
                            }}
                          >
                            {strat.name}
                          </span>
                          {strat.timeframe && (
                            <span className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[9px] font-bold text-tertiary uppercase">
                              {strat.timeframe}
                            </span>
                          )}
                        </div>
                        {strat.description && (
                          <p className="text-xs text-muted truncate max-w-xs mt-0.5">{strat.description}</p>
                        )}
                      </td>

                      {/* Owner */}
                      <td className="px-4 py-3">
                        {strat.isDefault ? (
                          <span className="text-xs font-semibold text-iris flex items-center gap-1">
                            <ShieldCheck size={12} /> System Admin
                          </span>
                        ) : strat.user ? (
                          <div>
                            <span
                              onClick={() => navigate(`/app/admin/users/${strat.user?.id}`)}
                              className="text-primary text-xs font-semibold hover:underline cursor-pointer flex items-center gap-1"
                            >
                              {strat.user.fullName || strat.user.email}
                              <ExternalLink size={10} className="text-tertiary" />
                            </span>
                            <span className="text-[11px] text-tertiary block">{strat.user.email}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>

                      {/* Markets */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {strat.market && strat.market.length > 0 ? (
                            strat.market.map((m) => (
                              <span key={m} className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[9px] font-bold text-muted uppercase">
                                {m}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted">All</span>
                          )}
                        </div>
                      </td>

                      {/* Trades Count */}
                      <td className="px-4 py-3 text-secondary text-xs font-mono font-medium">
                        {strat.tradesCount}
                      </td>

                      {/* Win Rate */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-iris">{strat.winRate}%</span>
                          <div className="w-12 h-1.5 rounded-full bg-surface-2 overflow-hidden flex">
                            <div className="h-full bg-success" style={{ width: `${strat.winRate}%` }} />
                            <div className="h-full bg-danger" style={{ width: `${100 - strat.winRate}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Net P&L */}
                      <td className="px-4 py-3 text-right">
                        <span className={cn('font-bold font-mono text-sm', isProfitable ? 'text-success' : 'text-danger')}>
                          {isProfitable ? '+' : ''}₹{Number(strat.totalPnl || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(strat)}
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer',
                            strat.isActive
                              ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
                              : 'bg-muted/10 text-muted border-muted/20 hover:bg-muted/20'
                          )}
                          title="Click to toggle status"
                        >
                          {strat.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedStrategy(strat);
                              setViewModalOpen(true);
                            }}
                            className="p-1.5 text-tertiary hover:text-iris hover:bg-surface-2 rounded-lg transition-colors"
                            title="View Strategy"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(strat)}
                            className="p-1.5 text-tertiary hover:text-primary hover:bg-surface-2 rounded-lg transition-colors"
                            title="Edit Strategy"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStrategy(strat);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-tertiary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                            title="Delete Strategy"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-secondary">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} strategies
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-1 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-medium text-primary px-2">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-1 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE DEFAULT STRATEGY MODAL */}
      <Dialog.Root open={createDefaultModalOpen} onOpenChange={setCreateDefaultModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-iris/10 text-iris">
                  <Sparkles size={18} />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-primary">New Default Strategy</Dialog.Title>
                  <p className="text-xs text-tertiary">Creates a system-wide strategy template available to all users</p>
                </div>
              </div>
              <Dialog.Close className="text-tertiary hover:text-primary transition-colors">
                <X size={20} />
              </Dialog.Close>
            </div>

            <form onSubmit={handleCreateDefaultStrategy} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Strategy Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Opening Range Breakout (ORB), Mean Reversion"
                  value={defaultForm.name}
                  onChange={e => setDefaultForm({ ...defaultForm, name: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Timeframe</label>
                <input
                  type="text"
                  placeholder="e.g. 5m, 15m, 1H, Daily"
                  value={defaultForm.timeframe}
                  onChange={e => setDefaultForm({ ...defaultForm, timeframe: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Summary / Concept</label>
                <textarea
                  rows={2}
                  placeholder="High-level description of this system setup..."
                  value={defaultForm.description}
                  onChange={e => setDefaultForm({ ...defaultForm, description: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Execution Rules & Criteria</label>
                <textarea
                  rows={4}
                  placeholder="1. Entry Condition: ...&#10;2. Stop Loss: ...&#10;3. Target: ..."
                  value={defaultForm.rules}
                  onChange={e => setDefaultForm({ ...defaultForm, rules: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setCreateDefaultModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Default Strategy'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* VIEW STRATEGY MODAL */}
      <Dialog.Root open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 border border-border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {selectedStrategy && (
              <>
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2.5 rounded-xl',
                      selectedStrategy.isDefault ? 'bg-iris/10 text-iris' : 'bg-accent/10 text-accent'
                    )}>
                      {selectedStrategy.isDefault ? <Sparkles size={20} /> : <Target size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Dialog.Title className="text-lg font-bold text-primary">
                          {selectedStrategy.name}
                        </Dialog.Title>
                        {selectedStrategy.isDefault ? (
                          <span className="px-2 py-0.5 rounded bg-iris/10 text-iris border border-iris/20 text-[9px] font-bold uppercase">
                            Default System
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 text-[9px] font-bold uppercase">
                            User Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-tertiary">
                        Created on {new Date(selectedStrategy.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Dialog.Close className="text-tertiary hover:text-primary transition-colors">
                    <X size={20} />
                  </Dialog.Close>
                </div>

                {/* Owner details */}
                <div className="card p-4 bg-surface-1 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                    {selectedStrategy.isDefault ? 'Strategy Type' : 'Strategy Owner'}
                  </span>
                  <div className="flex items-center justify-between">
                    {selectedStrategy.isDefault ? (
                      <div>
                        <p className="text-sm font-semibold text-primary">Platform Default Template</p>
                        <p className="text-xs text-secondary">Available system-wide to all traders</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-primary">{selectedStrategy.user?.fullName || 'Anonymous'}</p>
                          <p className="text-xs text-secondary">{selectedStrategy.user?.email}</p>
                        </div>
                        {selectedStrategy.user && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setViewModalOpen(false);
                              navigate(`/app/admin/users/${selectedStrategy.user?.id}`);
                            }}
                          >
                            <ExternalLink size={12} /> View Profile
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="card p-3 text-center">
                    <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest">Tagged Trades</span>
                    <p className="text-base font-bold font-mono text-primary mt-1">{selectedStrategy.tradesCount}</p>
                  </div>
                  <div className="card p-3 text-center">
                    <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest">Win Rate</span>
                    <p className="text-base font-bold font-mono text-iris mt-1">{selectedStrategy.winRate}%</p>
                  </div>
                  <div className="card p-3 text-center">
                    <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest">Total P&L</span>
                    <p className={cn('text-base font-bold font-mono mt-1', selectedStrategy.totalPnl >= 0 ? 'text-success' : 'text-danger')}>
                      {selectedStrategy.totalPnl >= 0 ? '+' : ''}₹{Number(selectedStrategy.totalPnl || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="card p-3 text-center">
                    <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest">Avg / Trade</span>
                    <p className={cn('text-base font-bold font-mono mt-1', selectedStrategy.avgPnl >= 0 ? 'text-success' : 'text-danger')}>
                      ₹{Number(selectedStrategy.avgPnl || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Configuration Details */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block mb-1">Timeframe</span>
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-surface-1 border border-border text-xs font-medium text-primary">
                      {selectedStrategy.timeframe || 'Not specified'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block mb-1">Target Markets</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStrategy.market && selectedStrategy.market.length > 0 ? (
                        selectedStrategy.market.map(m => (
                          <span key={m} className="px-2 py-0.5 rounded-lg bg-surface-1 border border-border text-xs text-primary font-medium">
                            {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted">All markets</span>
                      )}
                    </div>
                  </div>

                  {selectedStrategy.description && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block mb-1">Description</span>
                      <p className="text-xs text-secondary leading-relaxed bg-surface-1 p-3 rounded-lg border border-border">
                        {selectedStrategy.description}
                      </p>
                    </div>
                  )}

                  {selectedStrategy.rules && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block mb-1">Execution Rules & Setup Criteria</span>
                      <p className="text-xs text-secondary leading-relaxed bg-surface-1 p-3 rounded-lg border border-border whitespace-pre-line font-mono">
                        {selectedStrategy.rules}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal footer */}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setViewModalOpen(false);
                      handleOpenEdit(selectedStrategy);
                    }}
                  >
                    <Edit3 size={14} /> Edit Strategy
                  </Button>
                  <Button variant="secondary" onClick={() => setViewModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* EDIT STRATEGY MODAL */}
      <Dialog.Root open={editModalOpen} onOpenChange={setEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-iris/10 text-iris">
                  <Edit3 size={18} />
                </div>
                <Dialog.Title className="text-lg font-bold text-primary">Edit Strategy</Dialog.Title>
              </div>
              <Dialog.Close className="text-tertiary hover:text-primary transition-colors">
                <X size={20} />
              </Dialog.Close>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Strategy Name</label>
                <input
                  required
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Timeframe</label>
                <input
                  type="text"
                  placeholder="e.g. 5m, 1h, Daily"
                  value={editForm.timeframe}
                  onChange={e => setEditForm({ ...editForm, timeframe: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Rules & Criteria</label>
                <textarea
                  rows={4}
                  value={editForm.rules}
                  onChange={e => setEditForm({ ...editForm, rules: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-primary focus:border-accent outline-none font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={e => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-xs font-medium text-primary">Strategy is Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isDefault}
                    onChange={e => setEditForm({ ...editForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-iris focus:ring-iris"
                  />
                  <span className="text-xs font-medium text-primary">Is System Default Strategy</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* DELETE STRATEGY MODAL */}
      <Dialog.Root open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 border border-danger/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-danger">
              <div className="p-2.5 rounded-xl bg-danger/10">
                <AlertTriangle size={24} />
              </div>
              <Dialog.Title className="text-lg font-bold text-primary">Delete Strategy</Dialog.Title>
            </div>

            <p className="text-sm text-secondary leading-relaxed">
              Are you sure you want to delete strategy <strong className="text-primary">{selectedStrategy?.name}</strong>?
            </p>
            <div className="bg-danger/10 border border-danger/20 p-3 rounded-lg text-xs text-danger leading-relaxed">
              Trades tagged with this strategy will be unlinked safely. This action cannot be undone and will be recorded in the superadmin audit log.
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Delete'}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
