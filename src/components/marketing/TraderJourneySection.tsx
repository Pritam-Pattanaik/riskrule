import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, Brain, BarChart2, TrendingUp, Shield, Zap, 
  ArrowRight, CheckCircle2, Clock, DollarSign
} from 'lucide-react';
import { Reveal, HoverLift, StaggerContainer, StaggerItem } from '../ui/Motion';
import { cn } from '../../lib/cn';

export default function TraderJourneySection() {
  const steps = [
    {
      step: '01',
      phase: 'PRE-TRADE DISCIPLINE',
      title: 'Programmatic Risk Guardrails',
      icon: Lock,
      color: 'danger',
      description: 'Define your non-negotiable risk rules: maximum daily loss, maximum contract sizing, and trading time windows. When a rule is reached, RiskRules automatically freezes order routing for 24 hours.',
      benefit: 'Eliminates the catastrophic -10% tilt day that wipes out weeks of progress.',
      tags: ['Daily Loss Caps', 'Max Lot Sizing', 'Prop Drawdown Rules']
    },
    {
      step: '02',
      phase: 'IN-SESSION INTERVENTION',
      title: 'Real-Time AI Tilt Shield',
      icon: Brain,
      color: 'iris',
      description: 'Our AI Behavioral Coach monitors live order telemetry. If you attempt to 3x your position size after a loss or trade 2 minutes before FOMC, the AI intervenes with an instant natural language warning and cooldown.',
      benefit: 'Blocks emotional revenge trades in real time before they reach the broker.',
      tags: ['Tilt Detection', 'Sizing Anomaly Alerts', 'News Lockout Timer']
    },
    {
      step: '03',
      phase: 'POST-TRADE ATTRIBUTION',
      title: 'Mathematical Edge Discovery',
      icon: BarChart2,
      color: 'accent',
      description: 'Sub-second broker sync automatically ingests every fill, slippage delta, and fee. The expectancy engine isolates which setups, time-of-day sessions, and asset classes generate genuine positive mathematical edge.',
      benefit: 'Tells you exactly where you make money and where you leak capital.',
      tags: ['Sharpe & Sortino Ratio', 'Time-of-Day Edge', 'Monte Carlo Sims']
    },
    {
      step: '04',
      phase: 'SCALE & COMPOUND',
      title: 'Funded Prop Scaling & Growth',
      icon: TrendingUp,
      color: 'success',
      description: 'With emotional tilt eliminated and mathematical edge verified, pass evaluations across Apex, FTMO, Topstep, and FundedNext with ease. Protect your funded allocations and compound payouts consistently.',
      benefit: '3.4x higher prop evaluation pass rate with zero drawdown violations.',
      tags: ['Apex / FTMO Compatible', 'Payout Protection', 'Multi-Account Sync']
    },
  ];

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-20 relative z-20">
      
      {/* Chapter Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Reveal direction="up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-1 border border-border text-xs font-semibold text-primary mb-3 shadow-xs">
            <Zap size={14} className="text-success" />
            <span>The Consistency Blueprint</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            How RiskRules turns chaotic trading into steady profit.
          </h2>
          <p className="text-base sm:text-lg text-secondary leading-relaxed">
            You don't need another technical indicator. You need a systematic, algorithmic system that protects you from your own worst psychological impulses.
          </p>
        </Reveal>
      </div>

      {/* 4 Step Cards Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerChildren={0.1}>
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={idx}>
              <HoverLift className="p-7 rounded-3xl bg-surface-1 border border-border hover:border-border-hover transition-all duration-300 h-full flex flex-col justify-between space-y-6 shadow-card group">
                
                <div className="space-y-4">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all shadow-xs",
                      item.color === 'danger' ? "bg-danger/15 text-danger border border-danger/30" :
                      item.color === 'iris' ? "bg-iris/15 text-iris border border-iris/30" :
                      item.color === 'accent' ? "bg-accent/15 text-accent border border-accent/30" :
                      "bg-success/15 text-success border border-success/30"
                    )}>
                      <Icon size={22} />
                    </div>
                    <span className="font-mono-stat text-2xl font-extrabold text-tertiary group-hover:text-primary transition-colors">
                      {item.step}
                    </span>
                  </div>

                  {/* Phase badge */}
                  <span className="text-[10px] font-mono-stat font-extrabold uppercase tracking-wider text-tertiary block">
                    {item.phase}
                  </span>

                  <h3 className="font-display font-bold text-xl text-primary leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/60">
                  <div className="p-3 rounded-xl bg-surface-0 border border-border/80 text-[11px] font-medium text-success flex items-start gap-2">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <span><strong>Key Outcome:</strong> {item.benefit}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono-stat px-2 py-0.5 rounded-md bg-surface-2 text-tertiary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </HoverLift>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Interactive Flow Callout */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-surface-1 border border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="font-display font-bold text-base text-primary">
            Ready to stop the emotional boom-and-bust cycle?
          </h4>
          <p className="text-xs sm:text-sm text-secondary">
            Connect your broker in 30 seconds with read-only security and automate your execution discipline today.
          </p>
        </div>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-canvas font-display font-bold text-xs shadow-md hover:opacity-95 transition-all shrink-0"
        >
          <span>Start 4-Step Discipline Blueprint</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </section>
  );
}
