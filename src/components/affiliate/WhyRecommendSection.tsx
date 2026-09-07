import React from 'react';
import { BookOpen, BarChart3, Target, ShieldAlert, Scale, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

export default function WhyRecommendSection() {
  const features = [
    {
      id: 'journal',
      title: 'Trading Journal',
      tagline: 'Multi-Broker Automatic Sync & Trade Notes',
      description:
        'Help traders record every execution automatically, attach TradingView chart screenshots, tag emotional states, and log setup playbooks without manual spreadsheets.',
      icon: BookOpen,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      badge: 'Automated Sync',
    },
    {
      id: 'analytics',
      title: 'Performance Analytics',
      tagline: 'Institutional Metrics & Equity Curves',
      description:
        'Deep statistical breakdowns: win rate, profit factor, average R:R, duration analysis, drawdown depth, and cumulative PnL progression to spot strengths and weaknesses.',
      icon: BarChart3,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      badge: '30+ Key Stats',
    },
    {
      id: 'strategies',
      title: 'Strategy Tracking',
      tagline: 'Playbook Benchmarking & Setup Edges',
      description:
        'Empower traders to separate setups (breakouts, reversals, trend-following) and determine with mathematical proof which trading systems generate true alpha.',
      icon: Target,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      badge: 'Edge Verification',
    },
    {
      id: 'discipline',
      title: 'Trading Discipline',
      tagline: 'Anti-FOMO Alerts & Rule Breaches',
      description:
        'Flag revenge trades, over-leveraging, FOMO entries, and rule breaches before account blowups. Foster consistent psychology and strict routine adherence.',
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      badge: 'Behavioral Guard',
    },
    {
      id: 'risk',
      title: 'Risk Management',
      tagline: 'Position Sizing & Stop-Loss Adherence',
      description:
        'Built-in R-multiple position calculators, portfolio heat risk tracking, and max daily loss lockouts to protect trader capital across all market cycles.',
      icon: Scale,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      badge: 'Capital Protection',
    },
    {
      id: 'lunar',
      title: 'Lunar AI Insights',
      tagline: 'Personalized AI Performance Coaching',
      description:
        'AI analyzes historical execution logs, spots recurring trading mistakes, detects negative psychological cycles, and suggests actionable corrections after every session.',
      icon: BrainCircuit,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      badge: 'Proprietary AI',
    },
  ];

  return (
    <Card elevation="card" className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-primary">Why Recommend RiskRules?</h3>
          </div>
          <p className="text-xs text-secondary mt-1">
            RiskRules is the institutional-grade journal and performance analytics companion traders rely on every day.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-tertiary bg-surface-2 px-2 py-1 rounded-md border border-border">
            Journaling • Discipline • Risk
          </span>
        </div>
      </div>

      {/* 6 Grid Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-surface-0/60 border border-border/80 hover:border-border-hover transition-all duration-200 space-y-2.5 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.bg} ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-secondary border border-border/60">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-primary group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-medium text-secondary">{item.tagline}</p>
                </div>

                <p className="text-xs text-tertiary leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
