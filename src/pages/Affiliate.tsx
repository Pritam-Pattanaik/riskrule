import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useAffiliateStore } from '../stores/affiliateStore';
import { Card } from '../components/ui/Card';
import ReferralShareCard from '../components/affiliate/ReferralShareCard';
import ProviderPayoutOverview from '../components/affiliate/ProviderPayoutOverview';
import PayoutHistoryTable from '../components/affiliate/PayoutHistoryTable';
import TermsModal from '../components/affiliate/TermsModal';
import ReferralQRCodeCard from '../components/affiliate/ReferralQRCodeCard';

export default function Affiliate() {
  const owner = useAuthStore(s => s.user?.id);
  const { loadedFor, error, loading, fetchStats, referralLink, referralCode, updateCustomCode, referredUsers, metrics, payouts } = useAffiliateStore();
  const [terms, setTerms] = useState(false);
  useEffect(() => { if (owner) fetchStats(); }, [owner, fetchStats]);
  return <div className="space-y-5"><header className="flex flex-wrap items-center justify-between gap-4">
    <div><h1>Referrals</h1><p className="desk-description">Invite another trader and track signups, earnings and payouts.</p></div>
    <button className="desk-button" disabled={loading} onClick={fetchStats}>{loading ? 'Refreshing…' : 'Refresh'}</button></header>
    {error && <p role="alert" className="desk-panel">Could not refresh your referral account. Try again.</p>}
    {owner && loadedFor === owner ? <>
      <div className="grid items-start gap-5 xl:grid-cols-2"><ReferralShareCard referralCode={referralCode} referralLink={referralLink} onUpdateCode={updateCustomCode}/><ProviderPayoutOverview /></div>
      <div className="desk-panel flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
        <span><strong>{metrics.clicks}</strong> link clicks</span><span><strong>{metrics.signups}</strong> signups</span><span><strong>{metrics.conversions}</strong> plan upgrades</span>
        <button className="desk-link" onClick={() => setTerms(true)}>Referral terms</button></div>
      {referralLink && <details className="desk-panel"><summary className="cursor-pointer text-sm font-semibold">Share by QR code</summary><div className="max-w-xs pt-3"><ReferralQRCodeCard referralLink={referralLink}/></div></details>}
      {/* Referred Traders (Real-Time Live Roster) */}
      {referredUsers && referredUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card elevation="card" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">Referred traders</h3>
                  <p className="text-xs text-secondary">
                    Traders who joined RiskRule using your referral link.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-violet-400 bg-surface-2 px-2.5 py-1 rounded-lg border border-border">
                {referredUsers.length} referrals
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-0 border-b border-border text-[11px] font-semibold text-tertiary uppercase tracking-wider">
                    <th className="py-2.5 px-4">Trader</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Joined Date</th>
                    <th className="py-2.5 px-4">Plan Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {referredUsers.map((trader) => {
                    const isPro = trader.plan === 'PRO' || trader.plan === 'ELITE';
                    return (
                      <tr key={trader.id} className="hover:bg-surface-0/60 transition-colors">
                        <td className="py-3 px-4 font-semibold text-primary">{trader.name}</td>
                        <td className="py-3 px-4 font-mono text-secondary text-[11px]">{trader.email}</td>
                        <td className="py-3 px-4 text-tertiary">{trader.joinedAt}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                              isPro
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-surface-2 text-secondary border-border'
                            }`}
                          >
                            {isPro && <Crown className="w-2.5 h-2.5 text-amber-400" />}
                            <span>{trader.plan}</span>
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      <PayoutHistoryTable payouts={payouts}/><TermsModal isOpen={terms} onClose={() => setTerms(false)}/>
    </> : !error && <p role="status" className="desk-panel">Loading your referral account…</p>}</div>;
}
