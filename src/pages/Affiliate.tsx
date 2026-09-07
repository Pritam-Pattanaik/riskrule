import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Sparkles,
  Zap,
  Crown,
  Users,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useAffiliateStore } from '../stores/affiliateStore';
import AffiliateHero from '../components/affiliate/AffiliateHero';
import AffiliateMetrics from '../components/affiliate/AffiliateMetrics';
import ReferralShareCard from '../components/affiliate/ReferralShareCard';
import ReferralQRCodeCard from '../components/affiliate/ReferralQRCodeCard';
import AffiliateStatusCard from '../components/affiliate/AffiliateStatusCard';
import HowItWorksSection from '../components/affiliate/HowItWorksSection';
import WhyRecommendSection from '../components/affiliate/WhyRecommendSection';
import CommissionCalculator from '../components/affiliate/CommissionCalculator';
import MarketingResourcesSection, { ResourceItem } from '../components/affiliate/MarketingResourcesSection';
import PayoutHistoryTable from '../components/affiliate/PayoutHistoryTable';
import ProviderPayoutOverview from '../components/affiliate/ProviderPayoutOverview';
import TermsModal from '../components/affiliate/TermsModal';
import ResourcePreviewModal from '../components/affiliate/ResourcePreviewModal';
import { Card } from '../components/ui/Card';

export default function Affiliate() {
  const { profile } = useAuthStore();
  const {
    referralCode,
    referralLink,
    commissionPercent,
    monthlyRewardPerPro,
    userPlan,
    metrics,
    status,
    payouts,
    referredUsers,
    loading,
    fetchStats,
    updateCustomCode,
    upgradeToPro,
    simulateReferral,
  } = useAffiliateStore();

  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);

  // Real-time pro referrals count
  const proUsersCount = referredUsers && referredUsers.length > 0
    ? referredUsers.filter((u) => u.plan === 'PRO').length
    : (metrics?.conversions || 1);

  // Fetch real-time affiliate stats from database on load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const referralCardRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const payoutHistoryRef = useRef<HTMLDivElement>(null);

  const scrollToReferral = () => {
    referralCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToPayoutHistory = () => {
    payoutHistoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Real-time test simulation of a trader using this user's referral and taking the Pro plan
  const handleSimulateProReferral = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const names = ['Aarav Patel', 'Vikram Sen', 'Priya Nair', 'Kavita Joshi', 'Rohan Mehta', 'Sneha Kapoor'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const res = await simulateReferral(randomName, true);
    setIsSimulating(false);

    if (res.success) {
      toast.success(`🎉 20% Recurring Commission Credited: ₹${monthlyRewardPerPro}!`, {
        description: `Trader ${randomName} subscribed to Pro. ₹${monthlyRewardPerPro} (20% monthly recurring) added to your earnings balance!`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      });
    } else {
      toast.error(res.message || 'Simulation failed');
    }
  };

  // Real-time upgrade of self to Pro
  const handleUpgradeSelfToPro = async () => {
    if (isUpgrading) return;
    setIsUpgrading(true);
    const res = await upgradeToPro();
    setIsUpgrading(false);

    if (res.success) {
      toast.success('Your account is now on RiskRules Pro! 👑', {
        description: res.rewardCredited
          ? `Attribution verified: 20% recurring commission (₹${monthlyRewardPerPro}) was credited to the partner who referred you!`
          : 'Welcome to RiskRules Pro workstation features.',
      });
    } else {
      toast.error(res.message || 'Upgrade failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Real-time Status Notification Banner */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-violet-950/40 via-surface-1 to-surface-1 border border-violet-500/20 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
            <Zap className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">Dynamic Real-Time Partner Engine</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Live
              </span>
            </div>
            <p className="text-[11.5px] text-secondary mt-0.5">
              <strong className="text-amber-400 font-bold">{commissionPercent}% Recurring Commission</strong> automatically credited every month for each active referred trader on Pro (~₹{monthlyRewardPerPro}/mo per trader).
            </p>
          </div>
        </div>

        {/* Live Simulator Trigger Button */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSimulateProReferral}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-iris transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : `⚡ Test Live Pro Referral (+₹${monthlyRewardPerPro})`}</span>
          </motion.button>

          {userPlan !== 'PRO' && (
            <button
              onClick={handleUpgradeSelfToPro}
              disabled={isUpgrading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-surface-2 hover:bg-surface-3 border border-border transition-colors cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUpgrading ? 'Upgrading...' : 'Upgrade to Pro'}</span>
            </button>
          )}

          <button
            onClick={() => fetchStats()}
            title="Refresh Live Metrics"
            className="w-8 h-8 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border flex items-center justify-center text-tertiary hover:text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* 1. Master Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AffiliateHero
          referralLink={referralLink}
          referralCode={referralCode}
          commissionPercent={commissionPercent}
          monthlyRewardPerPro={monthlyRewardPerPro}
          onScrollToHowItWorks={scrollToHowItWorks}
          onScrollToReferralLink={scrollToReferral}
        />
      </motion.div>

      {/* 2. Provider Payout Command Center (Real-Time Pro User Commission & Payouts) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04 }}
      >
        <ProviderPayoutOverview
          proUsersCount={proUsersCount}
          monthlyRewardPerPro={monthlyRewardPerPro}
          commissionPercent={commissionPercent}
          totalEarnings={metrics.totalEarnings}
          availableBalance={metrics.availableBalance}
          nextPayoutDate={status.nextPayoutDate}
          onScrollToLedger={scrollToPayoutHistory}
        />
      </motion.div>

      {/* 3. Performance Overview KPI Row (Dynamic Data) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
        <AffiliateMetrics metrics={metrics} />
      </motion.div>

      {/* 3. Mid Grid: Referral Link + QR Code + Affiliate Status */}
      <motion.div
        ref={referralCardRef}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      >
        {/* Referral Link & Social Sharing */}
        <div className="lg:col-span-5 flex flex-col">
          <ReferralShareCard
            referralLink={referralLink}
            referralCode={referralCode}
            onUpdateCode={async (newCode) => {
              const res = await updateCustomCode(newCode);
              if (!res.success) {
                toast.error(res.error || 'Failed to update code');
              }
            }}
          />
        </div>

        {/* QR Code Card (Encodes real user referralLink) */}
        <div className="lg:col-span-3 flex flex-col">
          <ReferralQRCodeCard referralLink={referralLink} />
        </div>

        {/* Affiliate Status Card */}
        <div className="lg:col-span-4 flex flex-col">
          <AffiliateStatusCard
            memberSince={status.memberSince}
            referralTier={status.referralTier}
            nextPayoutDate={status.nextPayoutDate}
            activeReferrals={status.activeReferrals}
            tierTarget={status.tierTarget}
            onViewPayoutHistory={scrollToPayoutHistory}
          />
        </div>
      </motion.div>

      {/* 4. Three-Column Row: How It Works + Commission & Rewards + Marketing Resources */}
      <motion.div
        ref={howItWorksRef}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch"
      >
        <div className="flex flex-col">
          <HowItWorksSection />
        </div>
        <div className="flex flex-col">
          <CommissionCalculator onOpenTerms={() => setIsTermsOpen(true)} />
        </div>
        <div className="flex flex-col">
          <MarketingResourcesSection onSelectResource={(res) => setSelectedResource(res)} />
        </div>
      </motion.div>

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
                  <h3 className="text-base font-bold text-primary">Your Referred Traders (Live Roster)</h3>
                  <p className="text-xs text-secondary">
                    Traders who joined RiskRules using your referral link.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-violet-400 bg-surface-2 px-2.5 py-1 rounded-lg border border-border">
                {referredUsers.length} active referrals
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
                    <th className="py-2.5 px-4 text-right">Commission Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {referredUsers.map((trader) => {
                    const isPro = trader.plan === 'PRO';
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
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          {isPro ? (
                            <span className="text-emerald-400">+₹{monthlyRewardPerPro}/mo (20% Recurring)</span>
                          ) : (
                            <span className="text-tertiary">Pending Pro Upgrade</span>
                          )}
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

      {/* 5. Why Recommend RiskRules (6 Pillars of Journal & Discipline) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        <WhyRecommendSection />
      </motion.div>

      {/* 6. Payout History Table (Dynamic Payout Records) */}
      <motion.div
        ref={payoutHistoryRef}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        <PayoutHistoryTable
          payouts={payouts as any}
          totalPaidOut={metrics.totalEarnings}
          upcomingScheduled={Math.round(metrics.totalEarnings * 0.35) || 16400}
        />
      </motion.div>

      {/* Modals */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <ResourcePreviewModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        referralLink={referralLink}
      />
    </div>
  );
}
