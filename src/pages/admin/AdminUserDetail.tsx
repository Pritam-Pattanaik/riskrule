import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, ShieldCheck, TrendingUp, BookOpen, Link, Brain, BarChart3, Award, DollarSign, Users, Building2, Smartphone } from 'lucide-react';
import { api } from '../../lib/api';
import { SkeletonCard, SkeletonTable } from '../../components/admin/SkeletonLoader';

interface UserDetail {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber?: string | null;
  role: 'USER' | 'SUB_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  plan?: string;
  referralCode?: string | null;
  affiliateClicks?: number;
  referredById?: string | null;
  referrer?: { id: string; fullName: string | null; email: string; referralCode: string | null } | null;
  referredUsers?: any[];
  affiliateEarnings?: any[];
  affiliatePayouts?: any[];
  flowPreferences?: any;
  trades: any[];
  strategies: any[];
  journal: any[];
  brokerConnections: any[];
  aiInsights: any[];
}

const tabs = [
  { key: 'trades', label: 'Trades', icon: TrendingUp },
  { key: 'strategies', label: 'Strategies', icon: BarChart3 },
  { key: 'journal', label: 'Journal', icon: BookOpen },
  { key: 'brokerConnections', label: 'Broker Connections', icon: Link },
  { key: 'aiInsights', label: 'AI Insights', icon: Brain },
  { key: 'affiliate', label: 'Affiliate & Referrals', icon: Award },
] as const;

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
    ADMIN: 'bg-info/10 text-info border border-info/20',
    SUB_ADMIN: 'bg-warning/10 text-warning border border-warning/20',
    USER: 'bg-success/10 text-success border border-success/20',
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
        setError(err.message || 'Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const renderTradesTab = () => {
    const trades = userData?.trades || [];
    if (trades.length === 0) return <EmptyState label="No trades found" />;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-hover/50 text-text-secondary border-b border-border-color">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Symbol</th>
              <th className="px-6 py-4 font-medium">Market</th>
              <th className="px-6 py-4 font-medium">Direction</th>
              <th className="px-6 py-4 font-medium">Entry</th>
              <th className="px-6 py-4 font-medium">Exit</th>
              <th className="px-6 py-4 font-medium text-right">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {trades.map((t: any, i: number) => (
              <tr key={i} className="hover:bg-surface-hover transition-colors">
                <td className="px-6 py-4 text-text-secondary whitespace-nowrap">{new Date(t.entryDate || t.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-text-primary font-medium">{t.symbol}</td>
                <td className="px-6 py-4 text-text-secondary">{t.market || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.direction === 'LONG' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>{t.direction || '-'}</span>
                </td>
                <td className="px-6 py-4 text-text-secondary">₹{Number(t.entryPrice || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-text-secondary">₹{Number(t.exitPrice || 0).toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-medium ${(t.pnl || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                    {(t.pnl || 0) >= 0 ? '+' : ''}₹{Number(t.pnl || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStrategiesTab = () => {
    const strategies = userData?.strategies || [];
    if (strategies.length === 0) return <EmptyState label="No strategies found" />;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((s: any, i: number) => (
          <div key={i} className="bg-base rounded-lg border border-border-color p-4 hover:border-brand-500/30 transition-colors">
            <h4 className="text-text-primary font-medium mb-1">{s.name || 'Unnamed Strategy'}</h4>
            <p className="text-text-secondary text-sm mb-3 line-clamp-2">{s.description || 'No description'}</p>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span>Win Rate: <span className="text-success font-medium">{s.winRate || 0}%</span></span>
              <span>Trades: {s.tradeCount || 0}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderJournalTab = () => {
    const entries = userData?.journal || [];
    if (entries.length === 0) return <EmptyState label="No journal entries found" />;
    return (
      <div className="space-y-3">
        {entries.map((j: any, i: number) => (
          <div key={i} className="bg-base rounded-lg border border-border-color p-4 hover:border-brand-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-text-primary font-medium">{j.title || 'Untitled'}</h4>
              <span className="text-text-secondary text-xs">{new Date(j.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-text-secondary text-sm line-clamp-3">{j.content || j.notes || 'No content'}</p>
            {j.mood && (
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-brand-500/10 text-brand-500">{j.mood}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderBrokersTab = () => {
    const connections = userData?.brokerConnections || [];
    if (connections.length === 0) return <EmptyState label="No broker connections found" />;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-hover/50 text-text-secondary border-b border-border-color">
            <tr>
              <th className="px-6 py-4 font-medium">Broker</th>
              <th className="px-6 py-4 font-medium">Client ID</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Synced</th>
              <th className="px-6 py-4 font-medium">Connected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {connections.map((b: any, i: number) => (
              <tr key={i} className="hover:bg-surface-hover transition-colors">
                <td className="px-6 py-4 text-text-primary font-medium">{b.broker || b.brokerName || '-'}</td>
                <td className="px-6 py-4 text-text-secondary font-mono text-xs">{b.clientId || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${b.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>{b.status || 'unknown'}</span>
                </td>
                <td className="px-6 py-4 text-text-secondary">{b.lastSynced ? new Date(b.lastSynced).toLocaleString() : 'Never'}</td>
                <td className="px-6 py-4 text-text-secondary">{new Date(b.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAITab = () => {
    const insights = userData?.aiInsights || [];
    if (insights.length === 0) return <EmptyState label="No AI insights found" />;
    return (
      <div className="space-y-3">
        {insights.map((a: any, i: number) => (
          <div key={i} className="bg-base rounded-lg border border-border-color p-4 hover:border-brand-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.type === 'warning' ? 'bg-warning/10 text-warning' :
                a.type === 'suggestion' ? 'bg-info/10 text-info' :
                  'bg-purple-500/10 text-purple-500'
                }`}>{a.type || 'insight'}</span>
              <span className="text-text-secondary text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-text-secondary text-sm">{a.content || a.message || 'No content'}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderAffiliateTab = () => {
    const referredUsers = userData?.referredUsers || [];
    const earnings = userData?.affiliateEarnings || [];
    const payouts = userData?.affiliatePayouts || [];
    const proReferrals = referredUsers.filter((u: any) => u.plan === 'PRO').length;
    const totalEarned = earnings.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) || (proReferrals * 400);
    const totalPaid = payouts.filter((p: any) => p.status === 'Paid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    return (
      <div className="space-y-6">
        {/* Affiliate Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-1 border border-border">
            <span className="text-xs text-text-secondary">Referral Code</span>
            <div className="text-lg font-bold font-mono text-brand-500 mt-1">
              {userData?.referralCode || 'NOT_ACTIVATED'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-1 border border-border">
            <span className="text-xs text-text-secondary">Link Clicks</span>
            <div className="text-lg font-bold font-mono text-text-primary mt-1">
              {(userData?.affiliateClicks || 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-1 border border-border">
            <span className="text-xs text-text-secondary">Referred Traders</span>
            <div className="text-lg font-bold font-mono text-text-primary mt-1">
              {referredUsers.length} <span className="text-xs font-normal text-success">({proReferrals} Pro)</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-1 border border-border">
            <span className="text-xs text-text-secondary">Total Commissions</span>
            <div className="text-lg font-bold font-mono text-success mt-1">
              ₹{totalEarned.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Partner Registered Bank / UPI Coordinates */}
        {userData?.flowPreferences?.bankDetails && (
          <div className="p-4 rounded-xl bg-surface-1 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary flex items-center gap-2">
                {userData.flowPreferences.bankDetails.type === 'UPI' ? (
                  <Smartphone className="w-4 h-4 text-brand-500" />
                ) : (
                  <Building2 className="w-4 h-4 text-success" />
                )}
                <span>Registered Settlement Bank / UPI Coordinates</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-success/10 text-success border border-success/20">
                {userData.flowPreferences.bankDetails.type === 'UPI' ? 'UPI VPA' : 'Direct IMPS / NEFT'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-2/60 border border-border">
                <div className="text-[10px] text-text-secondary">Beneficiary Name</div>
                <div className="font-semibold text-text-primary mt-0.5">
                  {userData.flowPreferences.bankDetails.accountHolder || 'Not specified'}
                </div>
              </div>
              {userData.flowPreferences.bankDetails.type === 'UPI' ? (
                <div className="p-2.5 rounded-lg bg-surface-2/60 border border-border sm:col-span-3">
                  <div className="text-[10px] text-text-secondary">UPI ID / VPA</div>
                  <div className="font-mono font-bold text-brand-500 mt-0.5">
                    {userData.flowPreferences.bankDetails.upiId || 'Not provided'}
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-2.5 rounded-lg bg-surface-2/60 border border-border">
                    <div className="text-[10px] text-text-secondary">Bank Name</div>
                    <div className="font-semibold text-text-primary mt-0.5">
                      {userData.flowPreferences.bankDetails.bankName || 'Not specified'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-2/60 border border-border">
                    <div className="text-[10px] text-text-secondary">Account Number</div>
                    <div className="font-mono font-bold text-text-primary mt-0.5">
                      {userData.flowPreferences.bankDetails.accountNumber || 'Not specified'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-2/60 border border-border">
                    <div className="text-[10px] text-text-secondary">IFSC Code</div>
                    <div className="font-mono font-bold text-brand-500 mt-0.5">
                      {userData.flowPreferences.bankDetails.ifsc || 'Not specified'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Referred by who? */}
        {userData?.referrer && (
          <div className="p-4 rounded-xl bg-surface-1/60 border border-border flex items-center justify-between text-xs">
            <span className="text-text-secondary">This trader was referred by:</span>
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <span>{userData.referrer.fullName || userData.referrer.email}</span>
              <code className="text-brand-500 font-mono">({userData.referrer.referralCode})</code>
            </span>
          </div>
        )}

        {/* Referred Traders Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-500" />
            <span>Traders Referred by this User ({referredUsers.length})</span>
          </h3>

          {referredUsers.length === 0 ? (
            <EmptyState label="This user has not referred any traders yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-hover/50 text-text-secondary border-b border-border-color">
                  <tr>
                    <th className="px-4 py-3 font-medium text-xs">Name</th>
                    <th className="px-4 py-3 font-medium text-xs">Email</th>
                    <th className="px-4 py-3 font-medium text-xs">Plan</th>
                    <th className="px-4 py-3 font-medium text-xs">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {referredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-surface-hover transition-colors">
                      <td className="px-4 py-3 font-semibold text-text-primary text-xs">{u.fullName || 'Anonymous'}</td>
                      <td className="px-4 py-3 text-text-secondary text-xs font-mono">{u.email}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.plan === 'PRO' ? 'bg-success/10 text-success' : 'bg-surface-hover text-text-secondary'
                          }`}>{u.plan}</span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trades': return renderTradesTab();
      case 'strategies': return renderStrategiesTab();
      case 'journal': return renderJournalTab();
      case 'brokerConnections': return renderBrokersTab();
      case 'aiInsights': return renderAITab();
      case 'affiliate': return renderAffiliateTab();
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-32 bg-surface-hover rounded animate-pulse"></div>
        <SkeletonCard />
        <SkeletonTable rows={5} cols={5} />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button onClick={() => navigate('/app/admin/users')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>
        <div className="bg-danger/10 border border-danger/50 text-danger p-4 rounded-lg">
          {error || 'User not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <button onClick={() => navigate('/app/admin/users')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Users
      </button>

      {/* User Header */}
      <div className="bg-surface rounded-xl border border-border-color p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 flex-shrink-0">
            {userData.role === 'SUPER_ADMIN' ? <ShieldCheck className="w-8 h-8" /> :
              userData.role === 'ADMIN' || userData.role === 'SUB_ADMIN' ? <Shield className="w-8 h-8" /> :
                <User className="w-8 h-8" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-text-primary">{userData.fullName || 'Anonymous User'}</h1>
              <span className={`px-2.5 py-1 rounded text-xs font-medium ${roleBadge(userData.role)}`}>
                {userData.role}
              </span>
            </div>
            <div className="flex items-center gap-4 text-text-secondary text-sm flex-wrap">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{userData.email}</span>
              {userData.phoneNumber && (
                <span className="flex items-center gap-1.5 font-mono"><Phone className="w-4 h-4" />{userData.phoneNumber}</span>
              )}
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Joined {new Date(userData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border-color overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = (userData as any)[tab.key]?.length || 0;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.key
                ? 'text-brand-500 border-brand-500'
                : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-color'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-brand-500/10 text-brand-500' : 'bg-surface-hover text-text-secondary'
                }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-surface rounded-xl border border-border-color overflow-hidden">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-text-secondary">{label}</p>
    </div>
  );
}
