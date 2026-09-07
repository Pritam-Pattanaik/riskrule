import React from 'react';
import { Share2, UserCheck, Wallet, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '../ui/Card';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Share Partner Link',
      tag: 'Instant Setup',
      subtitle: 'Distribute via social, YouTube, or private groups',
      description:
        'Share your personalized referral link or QR code with trading communities, YouTube subscribers, or social followers.',
      icon: Share2,
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      numColor: 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-iris',
      perks: ['90-Day Cookie', 'First-Click Protection'],
    },
    {
      number: '02',
      title: 'Traders Join & Journal',
      tag: 'Auto Attribution',
      subtitle: 'Sync accounts & log disciplined trades',
      description:
        'Traders register, sync their broker accounts, and immediately track their execution discipline and strategy edges.',
      icon: UserCheck,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      numColor: 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-md',
      perks: ['Broker Auto-Sync', 'Free Tier Access'],
    },
    {
      number: '03',
      title: 'Earn 20% Recurring MRR',
      tag: 'Lifetime Commission',
      subtitle: 'Predictable monthly payouts direct to bank/UPI',
      description:
        'Earn ₹400/mo (20% recurring) for every active Pro trader, credited automatically for as long as they stay subscribed.',
      icon: Wallet,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      numColor: 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md',
      perks: ['Monthly Settlements', 'Zero Earning Caps'],
    },
  ];

  return (
    <Card elevation="card" className="p-6 h-full flex flex-col justify-between space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Sparkles className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary">How It Works</h3>
            <p className="text-[11.5px] text-tertiary">Simple 3-step recurring earning model</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-2 text-secondary border border-border">
          Automated
        </span>
      </div>

      {/* 3 Step Vertical Flow Cards */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="p-3.5 rounded-xl bg-surface-0/70 border border-border/80 hover:border-violet-500/40 transition-all duration-200 group relative"
            >
              <div className="flex items-start gap-3">
                {/* Step Number Circle */}
                <div
                  className={`w-9 h-9 rounded-xl ${step.numColor} flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h4 className="text-xs font-bold text-primary truncate group-hover:text-violet-300 transition-colors">
                        {step.title}
                      </h4>
                    </div>
                    <span
                      className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${step.badgeColor}`}
                    >
                      {step.tag}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-secondary leading-snug">
                    {step.description}
                  </p>

                  {/* Micro-perks badges */}
                  <div className="flex items-center gap-2 pt-1">
                    {step.perks.map((perk, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center gap-1 text-[10px] text-tertiary font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{perk}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Guarantee Banner */}
      <div className="pt-2 border-t border-border/50">
        <div className="flex items-center justify-between text-[11px] text-tertiary">
          <span className="flex items-center gap-1 text-secondary">
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Real-time attribution & first-click lock</span>
          </span>
          <span className="font-mono text-emerald-400 font-semibold">100% Automated</span>
        </div>
      </div>
    </Card>
  );
}
