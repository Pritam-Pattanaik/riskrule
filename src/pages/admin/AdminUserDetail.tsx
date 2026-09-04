import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, Calendar, Shield, ShieldCheck,
  TrendingUp, TrendingDown, BookOpen, Brain, BarChart3,
  Award, AlertTriangle, CheckCircle2, XCircle, Clock, ShieldAlert,
  Target, Link2
} from 'lucide-react';
import { api } from '../../lib/api';
import { SkeletonCard, SkeletonTable } from '../../components/admin/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { BrokerLogo } from '../../components/settings/brokers/BrokerLogo';
import { formatCurrency } from '../../utils/currency';

interface UserDetail {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber?: string | null;
  role: 'USER' | 'SUB_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  trades: any[];
  strategies: any[];
  journalEntries: any[];
  journal: any[];
  brokerConnections: any[];
  aiInsights: any[];
  coachMemories: any[];
  tradingRules: any;
  stats?: {
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalPnl: number;
    avgDisciplineScore: number;
    bestTrade: number;
    worstTrade: number;
  };
}

const tabs = [
  { key: 'trades', label: 'Trades', icon: TrendingUp },
  { key: 'discipline', label: 'Discipline & Rules', icon: ShieldAlert },
  { key: 'brokers', label: 'Broker Gateways', icon: Link2 },
  { key: 'strategies', label: 'Strategies', icon: Target },
  { key: 'journal', label: 'Journal & Bias', icon: BookOpen },
  { key: 'aiInsights', label: 'AI Coach Insights', icon: Brain },
] as const;

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    ADMIN: 'bg-info/10 text-info border border-info/30',
    SUB_ADMIN: 'bg-warning/10 text-warning border border-warning/30',
    USER: 'bg-surface-2 text-secondary border border-border',
  };
  return styles[role] || styles.USER;
};

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [activeTab, setActiveTab] = useState<string>('trades');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await api.get<UserDetail>(`/admin/users/${id}/detail`);
        setUserData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user telemetry');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-surface-1 animate-pulse" />
          <div className="h-6 bg-surface-1 rounded w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonTable rows={6} cols={6} />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <button
          onClick={() => navigate('/app/admin/users')}
          className="flex items-center gap-2 text-secondary hover:text-primary text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </button>
        <div className="bg-danger/10 border border-danger/40 text-danger p-6 rounded-2xl">
          <h3 className="font-semibold text-base mb-1">User Not Found</h3>
          <p className="text-sm">{error || 'The requested trader profile could not be loaded.'}</p>
        </div>
      </div>
    );
  }

  const stats = userData.stats || {
    totalTrades: userData.trades?.length || 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalPnl: 0,
    avgDisciplineScore: 0,
    bestTrade: 0,
    worstTrade: 0,
  };

  const isLoss = stats.totalPnl < 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Top Nav Back Bar ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/app/admin/users')}
          className="flex items-center gap-2 text-secondary hover:text-primary text-xs font-semibold px-3 py-1.5 rounded-xl bg-surface border border-border hover:bg-surface-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to User Directory</span>
        </button>
      </div>

      {/* ── Trader Profile Header Card ── */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-accent/20 shrink-0">
              {userData.fullName ? userData.fullName.slice(0, 2).toUpperCase() : userData.email.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-primary">{userData.fullName || 'Anonymous Trader'}</h1>
                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${roleBadge(userData.role)}`}>
                  {userData.role.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-secondary">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-tertiary" />
                  {userData.email}
                </span>
                {userData.phoneNumber && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-tertiary" />
                    {userData.phoneNumber}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-tertiary" />
                  Joined {new Date(userData.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Telemetry Pills */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-surface-1 border border-border text-center">
              <span className="text-[10px] uppercase tracking-wider text-secondary font-medium block">Discipline</span>
              <span className={`text-sm font-bold ${stats.avgDisciplineScore >= 75 ? 'text-emerald-400' : stats.avgDisciplineScore >= 50 ? 'text-warning' : 'text-rose-400'}`}>
                {stats.avgDisciplineScore > 0 ? `${stats.avgDisciplineScore}/100` : 'Unrated'}
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-surface-1 border border-border text-center">
              <span className="text-[10px] uppercase tracking-wider text-secondary font-medium block">Win Rate</span>
              <span className="text-sm font-bold text-primary">
                {stats.totalTrades > 0 ? `${stats.winRate}%` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Executive Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <span className="text-secondary text-xs font-medium block">Net P&L</span>
            <span className={`text-lg font-bold block mt-0.5 ${isLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
              {stats.totalPnl > 0 ? '+' : ''}{formatCurrency(stats.totalPnl)}
            </span>
          </div>
          <div>
            <span className="text-secondary text-xs font-medium block">Total Trades</span>
            <span className="text-lg font-bold text-primary block mt-0.5">
              {stats.totalTrades} trades
            </span>
          </div>
          <div>
            <span className="text-secondary text-xs font-medium block">Best Trade</span>
            <span className="text-lg font-bold text-emerald-400 block mt-0.5">
              +{formatCurrency(stats.bestTrade)}
            </span>
          </div>
          <div>
            <span className="text-secondary text-xs font-medium block">Worst Drawdown</span>
            <span className="text-lg font-bold text-rose-400 block mt-0.5">
              {formatCurrency(stats.worstTrade)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-accent text-accent font-semibold'
                  : 'border-transparent text-secondary hover:text-primary hover:border-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Area ── */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
        {/* Tab 1: Trades */}
        {activeTab === 'trades' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Execution History ({userData.trades?.length || 0})</h3>
            {userData.trades?.length === 0 ? (
              <EmptyState icon={TrendingUp} title="No trades recorded" description="This user has not executed or imported any trades." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-1/60 text-secondary border-b border-border text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Symbol</th>
                      <th className="px-4 py-3 font-semibold">Market</th>
                      <th className="px-4 py-3 font-semibold">Direction</th>
                      <th className="px-4 py-3 font-semibold text-center">Discipline</th>
                      <th className="px-4 py-3 font-semibold text-right">Net P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {userData.trades.map((t: any, i: number) => {
                      const tradeLoss = Number(t.netPnl || 0) < 0;
                      return (
                        <tr key={i} className="hover:bg-surface-1/80 transition-colors">
                          <td className="px-4 py-3 text-secondary text-xs whitespace-nowrap">
                            {new Date(t.date || t.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 font-semibold text-primary text-xs">
                            {t.symbol}
                            {t.instrumentType && <span className="ml-1.5 text-[10px] text-tertiary font-normal">({t.instrumentType})</span>}
                          </td>
                          <td className="px-4 py-3 text-secondary text-xs">{t.market || 'NSE'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              t.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {t.direction || 'BUY'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {t.disciplineScore != null ? (
                              <span className={`text-xs font-semibold ${t.disciplineScore >= 75 ? 'text-emerald-400' : t.disciplineScore >= 50 ? 'text-warning' : 'text-rose-400'}`}>
                                {t.disciplineScore}/100
                              </span>
                            ) : (
                              <span className="text-text-muted text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-xs whitespace-nowrap">
                            <span className={tradeLoss ? 'text-rose-400' : Number(t.netPnl || 0) > 0 ? 'text-emerald-400' : 'text-secondary'}>
                              {Number(t.netPnl || 0) > 0 ? '+' : ''}{formatCurrency(Number(t.netPnl || 0))}
                            </span>
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

        {/* Tab 2: Discipline & Risk Rules */}
        {activeTab === 'discipline' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3">Enforced Risk Parameters</h3>
              {userData.tradingRules ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-surface-1 border border-border">
                    <span className="text-xs text-secondary font-medium">Daily Loss Limit</span>
                    <p className="text-base font-bold text-primary mt-1">
                      {userData.tradingRules.maxDailyLoss ? formatCurrency(Number(userData.tradingRules.maxDailyLoss)) : 'Disabled'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-1 border border-border">
                    <span className="text-xs text-secondary font-medium">Max Trades / Day</span>
                    <p className="text-base font-bold text-primary mt-1">
                      {userData.tradingRules.maxTradesPerDay || 'No Cap'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-1 border border-border">
                    <span className="text-xs text-secondary font-medium">Allowed Window</span>
                    <p className="text-base font-bold text-primary mt-1">
                      {userData.tradingRules.windowStart && userData.tradingRules.windowEnd
                        ? `${userData.tradingRules.windowStart} - ${userData.tradingRules.windowEnd}`
                        : 'Full Market Hours'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-secondary text-xs">No custom trading rules configured. Default institutional discipline filters apply.</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary mb-3">Detected Behavioral Patterns ({userData.coachMemories?.length || 0})</h3>
              {userData.coachMemories?.length === 0 ? (
                <p className="text-secondary text-xs">No adverse behavioral patterns recorded.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.coachMemories.map((m: any) => (
                    <div key={m.id} className="p-4 rounded-xl bg-surface-1 border border-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-primary">{m.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-warning/10 text-warning border border-warning/20">
                          {m.severity || 'pattern'}
                        </span>
                      </div>
                      <p className="text-secondary text-xs leading-relaxed">{m.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-text-muted">
                        <span>Occurred: {m.count} times</span>
                        {m.avgPnl && <span>Impact: {formatCurrency(Number(m.avgPnl))}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Broker Gateways */}
        {activeTab === 'brokers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Connected Broker API Accounts ({userData.brokerConnections?.length || 0})</h3>
            {userData.brokerConnections?.length === 0 ? (
              <EmptyState icon={Link2} title="No broker connections" description="This user has not connected any broker APIs." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userData.brokerConnections.map((bc: any) => (
                  <div key={bc.id} className="p-4 rounded-xl bg-surface-1 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BrokerLogo providerId={bc.broker} size="md" fallbackText={bc.broker.slice(0, 2).toUpperCase()} />
                      <div>
                        <h4 className="text-sm font-semibold text-primary capitalize">{bc.broker}</h4>
                        <p className="text-xs text-secondary font-mono">{bc.clientId || 'Client Account'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        bc.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-surface-2 text-secondary'
                      }`}>
                        {bc.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {bc.isActive ? 'Active' : 'Offline'}
                      </span>
                      <span className="text-[10px] text-text-muted block mt-1">
                        {bc.lastSyncedAt ? `Synced ${new Date(bc.lastSyncedAt).toLocaleDateString()}` : 'Never synced'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Strategies */}
        {activeTab === 'strategies' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Active Playbooks & Strategies ({userData.strategies?.length || 0})</h3>
            {userData.strategies?.length === 0 ? (
              <EmptyState icon={Target} title="No strategies configured" description="User has not defined custom trading playbooks." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.strategies.map((s: any) => (
                  <div key={s.id} className="p-4 rounded-xl bg-surface-1 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-primary">{s.name}</h4>
                      {s.isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">Active</span>
                      )}
                    </div>
                    <p className="text-secondary text-xs line-clamp-2">{s.description || 'No playbook description'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Journal & Bias */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Trader Reflections ({userData.journalEntries?.length || 0})</h3>
            {userData.journalEntries?.length === 0 ? (
              <EmptyState icon={BookOpen} title="No journal entries" description="Trader has not submitted daily reflections." />
            ) : (
              <div className="space-y-3">
                {userData.journalEntries.map((j: any) => (
                  <div key={j.id} className="p-4 rounded-xl bg-surface-1 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">
                          {new Date(j.date).toLocaleDateString()}
                        </span>
                        {j.marketBias && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/10 text-accent uppercase">
                            {j.marketBias}
                          </span>
                        )}
                      </div>
                      {j.overallDiscipline != null && (
                        <span className="text-xs font-semibold text-emerald-400">
                          Discipline: {j.overallDiscipline}/100
                        </span>
                      )}
                    </div>
                    {j.whatWentWell && (
                      <p className="text-xs text-secondary">
                        <strong className="text-primary font-medium">Went Well:</strong> {j.whatWentWell}
                      </p>
                    )}
                    {j.whatToImprove && (
                      <p className="text-xs text-secondary">
                        <strong className="text-primary font-medium">Improvements:</strong> {j.whatToImprove}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: AI Insights */}
        {activeTab === 'aiInsights' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">AI Coach Feedback ({userData.aiInsights?.length || 0})</h3>
            {userData.aiInsights?.length === 0 ? (
              <EmptyState icon={Brain} title="No AI insights yet" description="AI Coach has not generated individual behavioral evaluations." />
            ) : (
              <div className="space-y-3">
                {userData.aiInsights.map((a: any) => (
                  <div key={a.id} className="p-4 rounded-xl bg-surface-1 border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-accent">
                        {a.type || 'Behavioral Note'}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-primary leading-relaxed">{a.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
