import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Link2,
  PlayCircle,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Calendar,
  Copy,
  Crown,
} from 'lucide-react';
import { toast } from 'sonner';

interface AffiliateHeroProps {
  referralLink: string;
  referralCode?: string;
  commissionPercent?: number;
  monthlyRewardPerPro?: number;
  onScrollToHowItWorks?: () => void;
  onScrollToReferralLink?: () => void;
}

export default function AffiliateHero({
  referralLink,
  referralCode = 'RISKRULE',
  commissionPercent = 20,
  monthlyRewardPerPro = 400,
  onScrollToHowItWorks,
  onScrollToReferralLink,
}: AffiliateHeroProps) {
  const [activeTradersCount, setActiveTradersCount] = useState<number>(30);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute live projected monthly and annual recurring income
  const monthlyEarnings = activeTradersCount * monthlyRewardPerPro;
  const annualEarnings = monthlyEarnings * 12;

  // Determine dynamic partner tier based on volume
  const getTierInfo = (count: number) => {
    if (count >= 50) return { name: 'VIP Partner', rate: '30%', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
    if (count >= 20) return { name: 'Pro Partner', rate: '25%', color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' };
    return { name: 'Standard Partner', rate: '20%', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
  };

  const currentTier = getTierInfo(activeTradersCount);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Referral link copied to clipboard!', {
      description: 'Share it with traders, channels, and followers.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    });
    if (onScrollToReferralLink) {
      onScrollToReferralLink();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-surface-1/95 via-surface-1/90 to-surface-0/95 border border-white/[0.08] p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-2xl transition-all">
      {/* Background Ambient Glows & Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
        {/* Left Column: Messaging & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
              Official Partner Network • {commissionPercent}% Recurring
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-primary leading-[1.12]">
              Earn with{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(139,92,246,0.3)]">
                RiskRules
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-primary/90 leading-snug">
              Share better trading habits. Grow your community. Earn{' '}
              <span className="text-amber-400 font-semibold">20% recurring lifetime income</span>.
            </p>
          </div>

          {/* Detailed Subtitle */}
          <p className="text-secondary text-xs sm:text-sm leading-relaxed max-w-xl">
            Empower your community with India’s leading trading journal & trader discipline platform. Help traders eliminate emotional mistakes, track edge, and master risk—while earning recurring commissions on every active Pro trader.
          </p>

          {/* 4 Value Pillars (Fintech Micro-Badges) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-surface-0/60 border border-border/80 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-primary truncate">20% Recurring</p>
                <p className="text-[10px] text-tertiary truncate">₹{monthlyRewardPerPro}/mo per Pro</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-0/60 border border-border/80 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-primary truncate">30-Day Cookie</p>
                <p className="text-[10px] text-tertiary truncate">Full attribution</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-0/60 border border-border/80 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-primary truncate">15th Payouts</p>
                <p className="text-[10px] text-tertiary truncate">Direct Bank / UPI</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-0/60 border border-border/80 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-primary truncate">No Limits</p>
                <p className="text-[10px] text-tertiary truncate">Zero earning cap</p>
              </div>
            </div>
          </div>

          {/* Action CTAs & Community Social Proof */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary Glowing Amber CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 shadow-gold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
                <span>Get My Referral Link</span>
              </motion.button>

              {/* Secondary Ghost Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onScrollToHowItWorks}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-secondary hover:text-primary bg-surface-2/70 hover:bg-surface-2 border border-border hover:border-violet-500/30 transition-all duration-200 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-violet-400" />
                <span>How It Works</span>
              </motion.button>
            </div>

            {/* Social Proof Line */}
            <div className="flex items-center gap-2 pt-1 text-xs text-secondary">
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-surface-1 bg-violet-600 flex items-center justify-center text-[9px] font-bold text-white">
                  A
                </div>
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-surface-1 bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
                  R
                </div>
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-surface-1 bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white">
                  V
                </div>
              </div>
              <span className="text-[11.5px] text-tertiary">
                Trusted by <strong className="text-secondary font-semibold">1,200+ trading educators</strong>, prop traders, and community creators across India.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Tech Interactive Partner Earning Pass & Simulator */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl bg-surface-0/80 border border-violet-500/30 backdrop-blur-xl p-5 sm:p-6 shadow-iris overflow-hidden space-y-4">
            {/* Ambient Top Glow in Card */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header: Live MRR Indicator */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Revenue Projection
                </span>
                <p className="text-xs font-semibold text-secondary">Estimated Monthly Earnings</p>
              </div>
              <div className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1 ${currentTier.color}`}>
                <Crown className="w-3 h-3" />
                <span>{currentTier.name} ({currentTier.rate})</span>
              </div>
            </div>

            {/* Big Currency Readout */}
            <div className="bg-gradient-to-br from-surface-1/90 to-surface-2/60 border border-border/80 rounded-2xl p-4 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-tertiary uppercase font-mono font-bold tracking-wider">Projected MRR</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  +₹{annualEarnings.toLocaleString('en-IN')}/yr
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-display font-extrabold text-primary tracking-tight">
                  ₹{monthlyEarnings.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-mono text-tertiary">/ month recurring</span>
              </div>
              <p className="text-[11px] text-secondary">
                Based on <strong className="text-primary font-bold">{activeTradersCount} active Pro traders</strong> subscribed at ₹1,999/mo (20% share).
              </p>
            </div>

            {/* Interactive Volume Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Referred Pro Traders:
                </label>
                <span className="font-mono font-bold text-amber-400 text-sm bg-surface-2 px-2 py-0.5 rounded-md border border-border">
                  {activeTradersCount} Traders
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={activeTradersCount}
                onChange={(e) => setActiveTradersCount(Number(e.target.value))}
                className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none"
              />
              {/* Quick Presets */}
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                {[5, 15, 30, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => setActiveTradersCount(count)}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      activeTradersCount === count
                        ? 'bg-violet-600 text-white font-bold shadow-xs'
                        : 'bg-surface-2 text-tertiary hover:text-secondary'
                    }`}
                  >
                    {count} {count === 50 ? '👑' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Compact KPI Summary Cells */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-surface-1/70 border border-border/70">
                <span className="text-[10px] text-tertiary block">Monthly/User</span>
                <span className="text-xs font-mono font-bold text-primary">₹{monthlyRewardPerPro}</span>
              </div>
              <div className="p-2 rounded-xl bg-surface-1/70 border border-border/70">
                <span className="text-[10px] text-tertiary block">Commission</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{commissionPercent}%</span>
              </div>
              <div className="p-2 rounded-xl bg-surface-1/70 border border-border/70">
                <span className="text-[10px] text-tertiary block">Payout Day</span>
                <span className="text-xs font-mono font-bold text-violet-400">15th Mo.</span>
              </div>
            </div>

            {/* Quick Referral Bar */}
            <div className="pt-2 border-t border-border/60">
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-1 border border-border/80">
                <span className="text-[11px] font-mono text-secondary px-2 truncate flex-1 select-all">
                  {referralLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
