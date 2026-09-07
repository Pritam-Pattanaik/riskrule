import React, { useState } from 'react';
import { Gift, CheckCircle2, ArrowRight, Calculator, Trophy, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '../ui/Card';

interface CommissionCalculatorProps {
  onOpenTerms?: () => void;
}

export default function CommissionCalculator({ onOpenTerms }: CommissionCalculatorProps) {
  const [traders, setTraders] = useState<number>(12);
  const proPlanMonthly = 1999;

  // Tier calculation:
  // 1-19: 20% (₹400/trader)
  // 20-49: 25% (₹500/trader)
  // 50+: 30% (₹600/trader)
  const tierRate = traders >= 50 ? 30 : traders >= 20 ? 25 : 20;
  const tierName = traders >= 50 ? 'Master Elite' : traders >= 20 ? 'Pro Partner' : 'Starter Partner';
  const monthlyEarnings = Math.round((traders * proPlanMonthly * tierRate) / 100);

  const tiers = [
    {
      name: 'Starter',
      range: '1–19 Traders',
      rate: '20%',
      reward: '₹400/mo per Pro',
      color: 'text-violet-400',
      active: tierRate === 20,
    },
    {
      name: 'Pro Partner',
      range: '20–49 Traders',
      rate: '25%',
      reward: '₹500/mo per Pro',
      color: 'text-indigo-400',
      active: tierRate === 25,
    },
    {
      name: 'Master Elite',
      range: '50+ Traders',
      rate: '30%',
      reward: '₹600/mo per Pro',
      color: 'text-amber-400',
      active: tierRate === 30,
    },
  ];

  return (
    <Card elevation="card" className="p-6 h-full flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Gift className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary">Commission & Tiers</h3>
            <p className="text-[11.5px] text-tertiary">20% recurring base up to 30% VIP</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>20% Lifetime</span>
        </span>
      </div>

      {/* Main Commission Highlight Banner */}
      <div className="rounded-xl bg-gradient-to-br from-violet-950/40 via-surface-0 to-surface-0 border border-violet-500/20 p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold">
            Baseline Reward Model
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">₹400 / mo / trader</span>
        </div>
        <p className="text-xs text-secondary leading-snug">
          Receive <strong className="text-primary font-bold">20% monthly recurring commission</strong> for every active Pro trader (₹1,999/mo plan) for the entire lifetime of their subscription.
        </p>
      </div>

      {/* Tier Progression Ladder */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-tertiary">
          <span className="font-semibold text-secondary">Partner Tier Progression</span>
          <span className="text-[10px] font-mono">Automatic upgrades</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                t.active
                  ? 'bg-violet-950/30 border-violet-500/40 shadow-xs'
                  : 'bg-surface-0/60 border-border/70 opacity-80'
              }`}
            >
              <div className="text-[10px] font-bold text-tertiary uppercase truncate">{t.name}</div>
              <div className={`text-sm font-bold font-mono my-0.5 ${t.color}`}>{t.rate}</div>
              <div className="text-[9.5px] text-secondary font-mono leading-tight">{t.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Quick Estimator Slider */}
      <div className="p-3.5 rounded-xl bg-surface-0/70 border border-border/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-secondary font-semibold">Active Pro Traders:</span>
            <span className="font-mono font-bold text-primary bg-surface-2 px-2 py-0.5 rounded-md border border-border">
              {traders}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-tertiary block">Projected MRR</span>
            <span className="font-mono text-amber-400 font-bold text-xs">
              ₹{monthlyEarnings.toLocaleString()}/mo
            </span>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="60"
          value={traders}
          onChange={(e) => setTraders(Number(e.target.value))}
          className="w-full h-1.5 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />

        <div className="flex items-center justify-between text-[10px] text-tertiary">
          <span>Tier Rate: <strong className="text-violet-400 font-semibold">{tierRate}% ({tierName})</strong></span>
          <span>Zero withdrawal lockup</span>
        </div>
      </div>

      {/* Footer Link & Terms */}
      <div className="pt-2 border-t border-border/50 flex items-center justify-between">
        <button
          onClick={onOpenTerms}
          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer group"
        >
          <span>View Partner Agreement & Terms</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <span className="text-[10.5px] text-tertiary">Verified payouts</span>
      </div>
    </Card>
  );
}
