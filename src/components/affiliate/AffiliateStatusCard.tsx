import React from 'react';
import { ShieldCheck, ArrowRight, Calendar, Award, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

interface AffiliateStatusCardProps {
  memberSince?: string;
  referralTier?: string;
  nextPayoutDate?: string;
  activeReferrals?: number;
  tierTarget?: number;
  onViewPayoutHistory?: () => void;
}

export default function AffiliateStatusCard({
  memberSince = '20 Aug 2025',
  referralTier = 'Standard (20%)',
  nextPayoutDate = '15 Sep 2025',
  activeReferrals = 31,
  tierTarget = 50,
  onViewPayoutHistory,
}: AffiliateStatusCardProps) {
  const progressPercent = Math.min(Math.round((activeReferrals / tierTarget) * 100), 100);

  return (
    <Card elevation="card" className="p-6 flex flex-col justify-between space-y-4">
      {/* Header with Active Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-primary">Your Affiliate Status</h3>
        </div>

        {/* Pulsing Active Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Active</span>
        </div>
      </div>

      {/* 3 Key Status Indicators */}
      <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/60">
        <div className="space-y-1">
          <span className="text-[11px] text-tertiary flex items-center gap-1">
            <Calendar className="w-3 h-3 text-secondary" />
            <span>Member since</span>
          </span>
          <p className="text-xs font-semibold text-primary">{memberSince}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-tertiary flex items-center gap-1">
            <Award className="w-3 h-3 text-secondary" />
            <span>Referral Tier</span>
          </span>
          <p className="text-xs font-semibold text-primary">{referralTier}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-tertiary flex items-center gap-1">
            <Clock className="w-3 h-3 text-secondary" />
            <span>Next Payout</span>
          </span>
          <p className="text-xs font-semibold text-emerald-400">{nextPayoutDate}</p>
        </div>
      </div>

      {/* Tier Progress toward Pro Partner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-secondary font-medium">Progress to Pro Tier (25%)</span>
          <span className="font-mono text-tertiary">
            {activeReferrals} / {tierTarget} referrals
          </span>
        </div>
        <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden border border-border/40">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Link to Payout History */}
      <button
        onClick={onViewPayoutHistory}
        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors pt-1 cursor-pointer group"
      >
        <span>View Payout History</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </Card>
  );
}
