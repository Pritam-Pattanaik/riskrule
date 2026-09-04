import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ScrollText, Shield, UserMinus, Settings, RefreshCw, Filter,
  Search, Clock, User, ChevronLeft, ChevronRight, Eye, X,
  ShieldCheck, AlertTriangle, Key, Activity, Layers
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { api } from '../../lib/api';
import AnimatedNumber from '../../components/admin/AnimatedNumber';
import { SkeletonCard, SkeletonTable } from '../../components/admin/SkeletonLoader';

interface AuditLog {
  id: string;
  adminId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  details: string | null;
  timestamp: string;
  admin?: { id: string; email: string; fullName: string | null } | null;
}

interface AuditData {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  byAction: Record<string, number>;
  stats: {
    totalLogs: number;
    roleChanges: number;
    brokerEvents: number;
    settingsUpdates: number;
    activeAdminsCount: number;
  };
}

const ACTION_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  USER_ROLE_CHANGED: { label: 'Role Governance', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  CHANGE_ROLE: { label: 'Role Governance', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  BROKER_STATUS_TOGGLED: { label: 'Broker Status', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  BROKER_HEALTH_SYNC: { label: 'Broker Ping', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  MANUAL_SYNC: { label: 'Broker Ping', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  UPDATE_SETTING: { label: 'Setting Update', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  DELETE_USER: { label: 'User Deleted', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  LOGIN: { label: 'Admin Login', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
};

export default function AdminAuditLogs() {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  // Selected Log for inspection
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (actionFilter !== 'all') params.set('action', actionFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const result = await api.get<AuditData>(`/admin/audit-logs?${params.toString()}`);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, actionFilter, searchQuery]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTimeSince = (date: string | null) => {
    if (!date) return '—';
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ${mins}m ago`;
    return `${mins}m ago`;
  };

  if (loading && !data) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
        <SkeletonTable rows={8} cols={6} />
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
            <span className="text-primary font-medium">Audit Logs</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight flex items-center gap-2.5">
            <ScrollText className="w-5 h-5 text-indigo-400" />
            Administrative Audit Trail
          </h1>
          <p className="text-xs md:text-sm text-secondary">
            Immutable log of all administrative actions, permission shifts, and gateway interventions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-1 border border-border text-xs text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Audit Stream Active</span>
          </div>
          <button
            onClick={() => fetchLogs(true)}
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
          <button onClick={() => fetchLogs()} className="underline hover:text-rose-200 text-xs font-semibold">Retry</button>
        </div>
      )}

      {/* 4 Top KPI Cards */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Events */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Total Audit Events</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <ScrollText className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>
            <AnimatedNumber value={data.stats.totalLogs} className="text-2xl font-bold text-primary" />
            <p className="text-[11px] text-secondary/60 mt-1">Platform events recorded</p>
          </div>

          {/* Card 2: Role Governance */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Role Governance</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
            <AnimatedNumber value={data.stats.roleChanges} className="text-2xl font-bold text-blue-400" />
            <p className="text-[11px] text-secondary/60 mt-1">User & admin role transitions</p>
          </div>

          {/* Card 3: Broker Events */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Broker Events</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <AnimatedNumber value={data.stats.brokerEvents} className="text-2xl font-bold text-emerald-400" />
            <p className="text-[11px] text-secondary/60 mt-1">Health pings & gateway status changes</p>
          </div>

          {/* Card 4: Active Operators */}
          <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-border hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-secondary">Active Operators</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-purple-400" />
              </div>
            </div>
            <AnimatedNumber value={data.stats.activeAdminsCount} className="text-2xl font-bold text-purple-400" />
            <p className="text-[11px] text-secondary/60 mt-1">Authorized admin actors</p>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-surface/70 backdrop-blur-md border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, actor, target type, or audit payload..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-surface-1/60 border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-primary placeholder-secondary/50 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="bg-surface-1 border border-border rounded-lg px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Action Events</option>
              <option value="USER_ROLE_CHANGED">Role Changes</option>
              <option value="BROKER_STATUS_TOGGLED">Broker Status Toggles</option>
              <option value="BROKER_HEALTH_SYNC">Broker Gateway Pings</option>
              <option value="UPDATE_SETTING">Setting Updates</option>
              <option value="DELETE_USER">User Deletions</option>
            </select>

            {(searchQuery || actionFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActionFilter('all');
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* High-Density Zero-Scroll Table */}
        <div className="bg-surface/70 backdrop-blur-md rounded-xl border border-border overflow-hidden shadow-xl">
          <table className="w-full text-left table-fixed border-collapse">
            <thead className="bg-surface-1/70 text-[11px] font-semibold text-secondary uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-3 w-[16%]">Timestamp</th>
                <th className="py-3 px-3 w-[18%]">Admin Actor</th>
                <th className="py-3 px-3 w-[15%]">Event Action</th>
                <th className="py-3 px-3 w-[15%]">Target Scope</th>
                <th className="py-3 px-3 w-[28%]">Audit Payload Summary</th>
                <th className="py-3 px-3 w-[8%] text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {data?.logs.map((log) => {
                const config = ACTION_CONFIG[log.action] || {
                  label: log.action.replace(/_/g, ' '),
                  color: 'text-zinc-400',
                  bg: 'bg-zinc-500/10',
                  border: 'border-zinc-500/20'
                };

                return (
                  <tr key={log.id} className="hover:bg-surface-1/40 transition-colors group">
                    {/* Timestamp */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="text-primary font-medium block truncate">
                          {formatDate(log.timestamp)}
                        </span>
                        <span className="text-[10px] text-secondary/60">
                          {getTimeSince(log.timestamp)}
                        </span>
                      </div>
                    </td>

                    {/* Admin Actor */}
                    <td className="py-3 px-3">
                      <div className="truncate">
                        <span className="font-medium text-primary block truncate">
                          {log.admin?.fullName || 'Super Admin'}
                        </span>
                        <span className="text-[11px] text-secondary/70 block truncate">
                          {log.admin?.email || 'admin@tradevault.in'}
                        </span>
                      </div>
                    </td>

                    {/* Event Action */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color} border ${config.border}`}>
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {config.label}
                      </span>
                    </td>

                    {/* Target Scope */}
                    <td className="py-3 px-3">
                      <div>
                        <span className="text-primary font-mono text-[11px] block truncate">
                          {log.targetType}
                        </span>
                        {log.targetId && (
                          <span className="text-[10px] font-mono text-secondary/60 truncate block max-w-[120px]">
                            {log.targetId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Details Summary */}
                    <td className="py-3 px-3">
                      <p className="text-secondary text-xs truncate max-w-full font-sans" title={log.details || ''}>
                        {log.details || 'No additional payload'}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-secondary hover:text-primary transition-colors inline-flex items-center justify-center"
                        title="View audit record details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {(!data?.logs || data.logs.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary">
                    <ScrollText className="w-8 h-8 text-secondary/30 mx-auto mb-2" />
                    <p className="font-medium text-primary">No audit log records match filter</p>
                    <p className="text-xs text-secondary/70 mt-1">Try resetting search keywords or category filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="px-4 py-2.5 bg-surface-1/50 border-t border-border flex items-center justify-between text-xs text-secondary">
            <span>
              Showing {data?.logs.length ? (page - 1) * limit + 1 : 0} – {Math.min(page * limit, data?.total || 0)} of {data?.total || 0} audit logs
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-primary disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-medium text-primary px-1">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1 rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-primary disabled:opacity-30 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Detail Inspection Dialog Modal */}
      <Dialog.Root open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <Dialog.Content className="pointer-events-auto w-full max-w-xl max-h-[85vh] overflow-y-auto bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-in">
              {selectedLog && (
                <>
                  {/* Modal Header */}
                  <div className="flex items-start justify-between border-b border-border/70 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {ACTION_CONFIG[selectedLog.action]?.label || selectedLog.action}
                        </span>
                        <span className="text-xs text-secondary">
                          {formatDate(selectedLog.timestamp)}
                        </span>
                      </div>
                      <Dialog.Title className="text-lg font-bold text-primary">
                        Audit Record Details
                      </Dialog.Title>
                      <p className="text-xs text-secondary">
                        Operator: <span className="text-primary font-medium">{selectedLog.admin?.fullName || 'Super Admin'}</span> ({selectedLog.admin?.email || 'admin@tradevault.in'})
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-1 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Target Scope */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-1/60 border border-border/60 text-xs">
                    <div>
                      <span className="text-secondary/70 block text-[11px]">Target Entity Type</span>
                      <span className="font-mono text-primary font-semibold">{selectedLog.targetType}</span>
                    </div>
                    <div>
                      <span className="text-secondary/70 block text-[11px]">Target Entity ID</span>
                      <span className="font-mono text-primary text-[11px] truncate block">
                        {selectedLog.targetId || 'Global Platform'}
                      </span>
                    </div>
                  </div>

                  {/* Audit Payload Body */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">Audit Payload & Details</h3>
                    <div className="p-4 rounded-xl bg-surface-1/40 border border-border text-xs text-primary leading-relaxed whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
                      {(() => {
                        if (!selectedLog.details) return 'No payload recorded';
                        try {
                          return JSON.stringify(JSON.parse(selectedLog.details), null, 2);
                        } catch {
                          return selectedLog.details;
                        }
                      })()}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/70">
                    <span className="text-[11px] text-secondary/60">Log ID: {selectedLog.id}</span>
                    <Dialog.Close asChild>
                      <button className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors">
                        Close
                      </button>
                    </Dialog.Close>
                  </div>
                </>
              )}
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
