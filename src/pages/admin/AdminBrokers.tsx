import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Link2, Wifi, WifiOff, Clock, Users, RefreshCw, Search,
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Power,
  ExternalLink, Activity, ArrowUpRight, Check, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { notify } from '../../lib/notify';
import { formatCurrency } from '../../utils/currency';
import AnimatedNumber from '../../components/admin/AnimatedNumber';
import { SkeletonCard, SkeletonTable } from '../../components/admin/SkeletonLoader';
import { BrokerLogo } from '../../components/settings/brokers/BrokerLogo';

interface BrokerConnection {
  id: string;
  userId: string;
  broker: string;
  accountAlias: string | null;
  clientId: string | null;
  isActive: boolean;
  lastSyncedAt: string | null;
  tokenExpiry: string | null;
  tokenHealth: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'STATIC_KEY' | 'NO_TOKEN';
  daysRemaining: number | null;
  createdAt: string | null;
  tradesCount: number;
  totalPnl: number;
  lastTradeDate: string | null;
  user: { id: string; email: string; fullName: string | null };
}

interface GatewayItem {
  id: string;
  name: string;
  color: string;
  type: string;
  latency: string;
  connectedAccounts: number;
  activeAccounts: number;
  routedTrades: number;
  totalPnl: number;
  lastSync: string | null;
  status: 'ONLINE' | 'STANDBY' | 'AVAILABLE';
}

interface BrokerData {
  connections: BrokerConnection[];
  gatewayMatrix: GatewayItem[];
  stats: {
    totalAccounts: number;
    activeAccounts: number;
    inactiveAccounts: number;
    totalTradesRouted: number;
    onlineGatewaysCount: number;
    totalGateways: number;
    expiringTokensCount: number;
  };
}

export default function AdminBrokers() {
  const [data, setData] = useState<BrokerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBroker, setSelectedBroker] = useState<string>('all');
  const [selectedHealth, setSelectedHealth] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const fetchBrokers = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      const result = await api.get<BrokerData>('/admin/brokers');
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch broker gateway telemetry');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const handleToggleStatus = async (conn: BrokerConnection) => {
    try {
      setTogglingId(conn.id);
      const newStatus = !conn.isActive;
      await api.patch(`/admin/brokers/${conn.id}/status`, { isActive: newStatus });
      notify.success(
        `Broker connection ${newStatus ? 'activated' : 'deactivated'}`,
        `${conn.broker.toUpperCase()} for ${conn.user.email}`
      );
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          connections: prev.connections.map(c => c.id === conn.id ? { ...c, isActive: newStatus } : c),
          stats: {
            ...prev.stats,
            activeAccounts: prev.stats.activeAccounts + (newStatus ? 1 : -1),
            inactiveAccounts: prev.stats.inactiveAccounts + (newStatus ? -1 : 1),
          }
        };
      });
    } catch (err: any) {
      notify.error('Failed to toggle broker status', err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSyncBroker = async (conn: BrokerConnection) => {
    try {
      setSyncingId(conn.id);
      const res: any = await api.post(`/admin/brokers/${conn.id}/sync`, {});
      notify.success(`Gateway ping successful`, res.message || `${conn.broker} connection verified`);
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          connections: prev.connections.map(c =>
            c.id === conn.id ? { ...c, lastSyncedAt: res.lastSyncedAt || new Date().toISOString() } : c
          )
        };
      });
    } catch (err: any) {
      notify.error('Failed to sync gateway', err.message);
    } finally {
      setSyncingId(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (date: string | null) => {
    if (!date) return 'Never synced';
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ${mins}m ago`;
    return `${mins}m ago`;
  };

  // Filtered Connections
  const filteredConnections = useMemo(() => {
    if (!data?.connections) return [];
    return data.connections.filter(c => {
      // Search
      const matchesSearch = !searchQuery ||
        c.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.user.fullName && c.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.clientId && c.clientId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.accountAlias && c.accountAlias.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.broker.toLowerCase().includes(searchQuery.toLowerCase());

      // Broker
      const matchesBroker = selectedBroker === 'all' || c.broker.toLowerCase() === selectedBroker.toLowerCase();

      // Health
      const matchesHealth = selectedHealth === 'all' ||
        (selectedHealth === 'ALERT' && (c.tokenHealth === 'EXPIRED' || c.tokenHealth === 'EXPIRING_SOON')) ||
        c.tokenHealth === selectedHealth;

      // Status
      const matchesStatus = selectedStatus === 'all' ||
        (selectedStatus === 'ACTIVE' && c.isActive) ||
        (selectedStatus === 'INACTIVE' && !c.isActive);

      return matchesSearch && matchesBroker && matchesHealth && matchesStatus;
    });
  }, [data?.connections, searchQuery, selectedBroker, selectedHealth, selectedStatus]);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
        <SkeletonTable rows={6} cols={7} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary/60 mb-1">
            <Link to="/app/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/app/admin" className="hover:text-primary transition-colors text-secondary">Admin</Link>
            <span>&gt;</span>
            <span className="text-primary font-medium">Brokers & Gateway Health</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight flex items-center gap-2.5">
            <Link2 className="w-5 h-5 text-indigo-400" />
            Broker Gateway Command Center
          </h1>
          <p className="text-xs md:text-sm text-secondary">
            Live bridge telemetry, API token lifecycle, and routing across supported Indian & Global execution gateways
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-1 border border-border text-xs text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gateways Live</span>
          </div>
          <button
            onClick={() => fetchBrokers(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-surface-1 hover:bg-surface-2 border border-border text-primary rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-secondary'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => fetchBrokers()} className="underline hover:text-rose-200 text-xs font-semibold">Retry</button>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Connected Vaults */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Connected Vaults</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber value={data.stats.totalAccounts} className="text-2xl font-bold text-primary" />
              <span className="text-xs text-emerald-400 font-medium">({data.stats.activeAccounts} Active)</span>
            </div>
            <p className="text-[11px] text-secondary/60 mt-1">Multi-broker trader accounts</p>
          </div>

          {/* Card 2: Gateway Matrix */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Online Gateways</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">{data.stats.onlineGatewaysCount}</span>
              <span className="text-xs text-secondary/70 font-mono">/ {data.stats.totalGateways} Supported</span>
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">Operational bridge connectivity</p>
          </div>

          {/* Card 3: Routed Trades */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Routed Trades</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber value={data.stats.totalTradesRouted} className="text-2xl font-bold text-primary" />
              <span className="text-xs text-blue-400 font-medium">Logged</span>
            </div>
            <p className="text-[11px] text-secondary/60 mt-1">Across all live execution bridges</p>
          </div>

          {/* Card 4: Token Alerts */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Token Alerts</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${data.stats.expiringTokensCount > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                {data.stats.expiringTokensCount > 0 ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${data.stats.expiringTokensCount > 0 ? 'text-amber-400' : 'text-primary'}`}>
                {data.stats.expiringTokensCount}
              </span>
              <span className="text-xs text-secondary/70">Vaults</span>
            </div>
            <p className="text-[11px] text-amber-400/80 mt-1">
              {data.stats.expiringTokensCount > 0 ? 'Expiring soon or expired' : 'All active tokens healthy'}
            </p>
          </div>
        </div>
      )}

      {/* Gateway Status Matrix */}
      {data?.gatewayMatrix && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-primary tracking-wide uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Supported Indian & Global Gateways
            </h2>
            <span className="text-xs text-secondary/60">Click any gateway to filter accounts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {data.gatewayMatrix.map((gateway) => {
              const isSelected = selectedBroker.toLowerCase() === gateway.id.toLowerCase();
              return (
                <button
                  key={gateway.id}
                  onClick={() => setSelectedBroker(isSelected ? 'all' : gateway.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-surface-2 border-indigo-500/60 ring-1 ring-indigo-500/30'
                      : 'bg-surface/60 border-border hover:border-border-hover hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <BrokerLogo providerId={gateway.id} size="sm" />
                    <span
                      className={`w-2 h-2 rounded-full ${
                        gateway.status === 'ONLINE'
                          ? 'bg-emerald-400 animate-pulse'
                          : gateway.status === 'STANDBY'
                          ? 'bg-amber-400'
                          : 'bg-zinc-600'
                      }`}
                      title={`Status: ${gateway.status}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-primary truncate">{gateway.name}</h3>
                    <p className="text-[10px] text-secondary/70 truncate">{gateway.type}</p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-primary">{gateway.connectedAccounts} <span className="font-normal text-secondary/60">vaults</span></span>
                    <span className="font-mono text-[10px] text-secondary/70">{gateway.latency}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Connection Directory & Filter Bar */}
      <div className="space-y-3">
        {/* Single-Row Filter Hub */}
        <div className="p-3 rounded-xl bg-surface/70 backdrop-blur-md border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trader name, email, client ID, or alias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-1/60 border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-primary placeholder-secondary/50 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Broker Dropdown */}
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="bg-surface-1 border border-border rounded-lg px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Gateways</option>
              <option value="dhan">Dhan</option>
              <option value="zerodha">Zerodha</option>
              <option value="angelone">AngelOne</option>
              <option value="delta_exchange">Delta Exchange</option>
              <option value="groww">Groww</option>
              <option value="bullforce">BullForce Paper</option>
            </select>

            {/* Health Dropdown */}
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="bg-surface-1 border border-border rounded-lg px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Token Health</option>
              <option value="ALERT">Attention Required</option>
              <option value="VALID">Valid Tokens</option>
              <option value="STATIC_KEY">Static API Keys</option>
              <option value="EXPIRED">Expired</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-surface-1 border border-border rounded-lg px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            {(searchQuery || selectedBroker !== 'all' || selectedHealth !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBroker('all');
                  setSelectedHealth('all');
                  setSelectedStatus('all');
                }}
                className="px-2.5 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Compact Table (Zero Horizontal Scroll) */}
        <div className="bg-surface/70 backdrop-blur-md rounded-xl border border-border overflow-hidden shadow-xl">
          <table className="w-full text-left table-fixed border-collapse">
            <thead className="bg-surface-1/70 text-[11px] font-semibold text-secondary uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-3 w-[15%]">Gateway</th>
                <th className="py-3 px-3 w-[18%]">Trader</th>
                <th className="py-3 px-3 w-[16%]">Client ID / Vault</th>
                <th className="py-3 px-3 w-[13%]">Trades Routed</th>
                <th className="py-3 px-3 w-[15%]">Token Health</th>
                <th className="py-3 px-3 w-[12%]">Last Sync</th>
                <th className="py-3 px-3 w-[11%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredConnections.map((conn) => (
                <tr key={conn.id} className="hover:bg-surface-1/40 transition-colors group">
                  {/* Gateway & Logo */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <BrokerLogo providerId={conn.broker} size="sm" />
                      <div className="truncate">
                        <span className="font-semibold text-primary capitalize block truncate">
                          {conn.broker.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-secondary/60 uppercase">
                          {conn.accountAlias || 'Primary Vault'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Trader */}
                  <td className="py-3 px-3">
                    <Link
                      to={`/app/admin/users/${conn.userId}`}
                      className="group/user block truncate hover:text-indigo-400 transition-colors"
                    >
                      <span className="font-medium text-primary block truncate group-hover/user:text-indigo-400">
                        {conn.user.fullName || 'Anonymous Trader'}
                      </span>
                      <span className="text-[11px] text-secondary/70 block truncate">
                        {conn.user.email}
                      </span>
                    </Link>
                  </td>

                  {/* Client ID */}
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-primary/90 bg-surface-1 px-2 py-0.5 rounded border border-border/70 truncate block max-w-[130px]">
                      {conn.clientId || 'Default ID'}
                    </span>
                  </td>

                  {/* Trades Routed */}
                  <td className="py-3 px-3">
                    <div>
                      <span className="font-semibold text-primary block">
                        {conn.tradesCount} <span className="text-[10px] font-normal text-secondary/60">trades</span>
                      </span>
                      {conn.tradesCount > 0 && (
                        <span className={`text-[10px] font-mono font-medium ${conn.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {formatCurrency(conn.totalPnl)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Token Health */}
                  <td className="py-3 px-3">
                    {conn.tokenHealth === 'VALID' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Valid {conn.daysRemaining ? `(${conn.daysRemaining}d)` : ''}
                      </span>
                    )}
                    {conn.tokenHealth === 'EXPIRING_SOON' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        Expires Soon
                      </span>
                    )}
                    {conn.tokenHealth === 'EXPIRED' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="w-3 h-3" />
                        Expired
                      </span>
                    )}
                    {conn.tokenHealth === 'STATIC_KEY' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Key className="w-3 h-3" />
                        API Secret
                      </span>
                    )}
                    {conn.tokenHealth === 'NO_TOKEN' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                        Unset
                      </span>
                    )}
                  </td>

                  {/* Last Sync */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-secondary text-[11px]" title={formatDate(conn.lastSyncedAt)}>
                      <Clock className="w-3 h-3 text-secondary/50 shrink-0" />
                      <span className="truncate">{getTimeSince(conn.lastSyncedAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Force Sync Ping */}
                      <button
                        onClick={() => handleSyncBroker(conn)}
                        disabled={syncingId === conn.id}
                        title="Ping and force-sync gateway"
                        className="p-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-secondary hover:text-primary transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncingId === conn.id ? 'animate-spin text-indigo-400' : ''}`} />
                      </button>

                      {/* Active Status Toggle */}
                      <button
                        onClick={() => handleToggleStatus(conn)}
                        disabled={togglingId === conn.id}
                        title={conn.isActive ? 'Deactivate bridge' : 'Activate bridge'}
                        className={`p-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                          conn.isActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredConnections.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondary">
                    <Link2 className="w-8 h-8 text-secondary/30 mx-auto mb-2" />
                    <p className="font-medium text-primary">No broker connections match filters</p>
                    <p className="text-xs text-secondary/70 mt-1">Try resetting search keywords or broker filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer Summary */}
          <div className="px-4 py-2.5 bg-surface-1/50 border-t border-border flex items-center justify-between text-xs text-secondary">
            <span>Showing {filteredConnections.length} of {data?.connections.length || 0} broker connections</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Bridge
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Token Expiring
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Expired
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
