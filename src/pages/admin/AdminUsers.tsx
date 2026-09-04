import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2,
  Users, ShieldCheck, Shield, User, AlertTriangle, X,
  TrendingUp, TrendingDown, Award, Link2, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import { notify } from '../../lib/notify';
import { SkeletonTable } from '../../components/admin/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { BrokerLogo } from '../../components/settings/brokers/BrokerLogo';
import { formatCurrency } from '../../utils/currency';

interface SystemUser {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber?: string | null;
  role: 'USER' | 'SUB_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  totalTrades: number;
  netPnl: number;
  disciplineScore: number;
  winRate: number;
  brokers: string[];
}

interface UsersSummary {
  totalUsers: number;
  totalPnl: number;
  avgDiscipline: number;
  activeBrokerUsersCount: number;
}

interface UsersResponse {
  users: SystemUser[];
  total: number;
  page: number;
  limit: number;
  summary?: UsersSummary;
}

const ROLES = ['ALL', 'USER', 'SUB_ADMIN', 'ADMIN', 'SUPER_ADMIN'] as const;

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Join Date' },
  { value: 'fullName', label: 'Name' },
  { value: 'totalTrades', label: 'Trades' },
  { value: 'netPnl', label: 'Net P&L' },
  { value: 'disciplineScore', label: 'Discipline Score' },
];

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    ADMIN: 'bg-info/10 text-info border border-info/30',
    SUB_ADMIN: 'bg-warning/10 text-warning border border-warning/30',
    USER: 'bg-surface-2 text-secondary border border-border',
  };
  return styles[role] || styles.USER;
};

const getDisciplinePill = (score: number) => {
  if (!score || score <= 0) {
    return <span className="text-xs text-text-muted">Unrated</span>;
  }
  if (score >= 75) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Award className="w-3 h-3" />
        {score}/100
      </span>
    );
  }
  if (score >= 50) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/20">
        {score}/100
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
      {score}/100
    </span>
  );
};

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [summary, setSummary] = useState<UsersSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<SystemUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order,
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (roleFilter !== 'ALL') params.set('role', roleFilter);

      const data = await api.get<UsersResponse>(`/admin/users/list?${params}`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      if (data.summary) setSummary(data.summary);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users directory');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, sort, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as SystemUser['role'] } : u)));
      notify.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      notify.error(err.message || 'Failed to update role');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setDeleting(true);
      await api.delete(`/admin/users/${deleteModal.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteModal.id));
      setTotal((prev) => prev - 1);
      setDeleteModal(null);
      notify.success('User removed successfully.');
    } catch (err: any) {
      notify.error(err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-3">
          <Users className="w-7 h-7 text-accent" />
          Trader & User Management
        </h1>
        <p className="text-secondary text-sm mt-1">
          Manage platform users, discipline ratings, broker gateways, and access control
        </p>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/40 text-danger p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* ── Summary Counters Banner ── */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl border border-border p-4 shadow-sm">
            <span className="text-secondary text-xs font-medium uppercase tracking-wider">Total Registered</span>
            <div className="text-xl font-bold text-primary mt-1">{summary.totalUsers} Traders</div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 shadow-sm">
            <span className="text-secondary text-xs font-medium uppercase tracking-wider">Active Broker Sessions</span>
            <div className="text-xl font-bold text-primary mt-1 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-warning" />
              {summary.activeBrokerUsersCount} Connected
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 shadow-sm">
            <span className="text-secondary text-xs font-medium uppercase tracking-wider">Avg Platform Discipline</span>
            <div className="text-xl font-bold text-primary mt-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              {summary.avgDiscipline || 0}/100
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 shadow-sm">
            <span className="text-secondary text-xs font-medium uppercase tracking-wider">Platform Trader Net P&L</span>
            <div className={`text-xl font-bold mt-1 ${summary.totalPnl < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatCurrency(summary.totalPnl)}
            </div>
          </div>
        </div>
      )}

      {/* ── Search & Filters Bar ── */}
      <div className="bg-surface rounded-xl border border-border p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-canvas border border-border rounded-xl text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-secondary"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-secondary" />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="bg-canvas border border-border text-primary rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-accent"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r === 'ALL' ? 'All Roles' : r.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Sort Column */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-canvas border border-border text-primary rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-accent"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Order Toggle */}
          <button
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-canvas border border-border rounded-xl text-secondary text-xs font-medium hover:text-primary hover:bg-surface-1 transition-colors"
          >
            {order === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {/* ── Table Section ── */}
      {loading ? (
        <SkeletonTable rows={8} cols={7} />
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-1/60 text-secondary border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Trader</th>
                  <th className="px-5 py-3.5 font-semibold">Role</th>
                  <th className="px-5 py-3.5 font-semibold">Brokers</th>
                  <th className="px-5 py-3.5 font-semibold">Discipline</th>
                  <th className="px-5 py-3.5 font-semibold text-center">Trades</th>
                  <th className="px-5 py-3.5 font-semibold text-center">Win Rate</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Net P&L</th>
                  {isSuperAdmin && <th className="px-5 py-3.5 font-semibold text-right">Governance</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => {
                  const isLoss = u.netPnl < 0;
                  return (
                    <tr key={u.id} className="hover:bg-surface-1/80 transition-colors">
                      {/* Trader Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-xs shrink-0">
                            {u.fullName ? u.fullName.slice(0, 2).toUpperCase() : u.email.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-primary block truncate">{u.fullName || 'Anonymous Trader'}</span>
                            <span className="text-secondary text-xs block truncate">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${roleBadge(u.role)}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Connected Brokers */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {u.brokers && u.brokers.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            {u.brokers.map((b) => (
                              <BrokerLogo key={b} providerId={b} size="sm" fallbackText={b.slice(0, 2).toUpperCase()} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-text-muted text-xs">None</span>
                        )}
                      </td>

                      {/* Discipline Rating */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getDisciplinePill(u.disciplineScore)}
                      </td>

                      {/* Total Trades */}
                      <td className="px-5 py-3.5 text-center text-secondary font-medium">
                        {u.totalTrades || 0}
                      </td>

                      {/* Win Rate */}
                      <td className="px-5 py-3.5 text-center text-secondary font-medium">
                        {u.totalTrades > 0 ? `${u.winRate}%` : '—'}
                      </td>

                      {/* Net P&L */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <span className={`font-semibold ${isLoss ? 'text-rose-400' : u.netPnl > 0 ? 'text-emerald-400' : 'text-secondary'}`}>
                          {u.netPnl > 0 ? '+' : ''}{formatCurrency(u.netPnl || 0)}
                        </span>
                      </td>

                      {/* Governance Actions */}
                      {isSuperAdmin && (
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Detail Link */}
                            <button
                              onClick={() => navigate(`/app/admin/users/${u.id}`)}
                              className="p-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 text-secondary hover:text-accent border border-border transition-colors"
                              title="Trader Telemetry"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Safe Role Selector */}
                            <select
                              value={u.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={u.id === currentUser?.id || u.role === 'SUPER_ADMIN'}
                              className="bg-canvas border border-border text-primary rounded-lg px-2 py-1 text-xs outline-none focus:border-accent disabled:opacity-40"
                            >
                              {u.role === 'SUPER_ADMIN' ? (
                                <option value="SUPER_ADMIN">Super Admin</option>
                              ) : (
                                <>
                                  <option value="USER">User</option>
                                  <option value="SUB_ADMIN">Sub Admin</option>
                                  <option value="ADMIN">Admin</option>
                                </>
                              )}
                            </select>

                            {/* Delete User */}
                            <button
                              onClick={() => setDeleteModal(u)}
                              disabled={u.id === currentUser?.id || u.role === 'SUPER_ADMIN'}
                              className="p-1.5 rounded-lg bg-surface-1 hover:bg-danger/15 text-secondary hover:text-danger border border-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Remove Trader"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="p-8">
                <EmptyState
                  icon={Users}
                  title="No traders found"
                  description="There are currently no platform users matching your filters."
                />
              </div>
            )}
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <span className="text-secondary text-xs">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} traders
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg bg-canvas border border-border text-secondary hover:text-primary hover:bg-surface-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      page === pageNum
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-canvas border border-border text-secondary hover:text-primary hover:bg-surface-1'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg bg-canvas border border-border text-secondary hover:text-primary hover:bg-surface-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">Remove Trader Account</h3>
                  <p className="text-secondary text-xs">Irreversible platform action</p>
                </div>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="ml-auto p-1.5 rounded-lg hover:bg-surface-1 text-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-secondary text-sm">
                Are you sure you want to remove <span className="font-semibold text-primary">{deleteModal.fullName || deleteModal.email}</span>?
                All associated trades, journal entries, and broker sessions will be permanently purged.
              </p>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 rounded-xl border border-border text-secondary hover:text-primary hover:bg-surface-1 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-danger hover:bg-danger/90 text-white text-xs font-semibold shadow-md shadow-danger/20 disabled:opacity-50 transition-colors"
                >
                  {deleting ? 'Removing...' : 'Confirm Removal'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
