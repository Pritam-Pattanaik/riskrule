import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, Shield, Lock, CheckCircle2, TrendingUp, ArrowRight, 
  BarChart2, DollarSign, Star, Sliders, Users, ExternalLink, Zap
} from 'lucide-react';
import { Reveal, HoverLift, NumberCounter, StaggerContainer, StaggerItem } from '../../components/ui/Motion';
import { cn } from '../../lib/cn';
import TrustTicker from '../../components/marketing/TrustTicker';

export default function PropTradersPage() {
  const [selectedCapital, setSelectedCapital] = useState<number>(100000);
  const [selectedFirm, setSelectedFirm] = useState<string>('Apex');

  const propFirms = [
    {
      name: 'Apex Trader Funding',
      logo: 'APEX',
      badge: 'RITHMIC & TRADOVATE',
      dailyLossRule: 'No Daily Loss Cap (Trailing Threshold Only)',
      maxTrailingDrawdown: '$3,000 (3.0%)',
      profitTarget: '$6,000 (6.0%)',
      lockoutSupport: 'Real-time Trailing Auto-Lockout Active',
      rating: '4.9 / 5.0'
    },
    {
      name: 'FTMO',
      logo: 'FTMO',
      badge: 'MT4, MT5 & DXTRADE',
      dailyLossRule: '$5,000 (5.0% Daily Loss Limit)',
      maxTrailingDrawdown: '$10,000 (10.0% Max Loss)',
      profitTarget: '$10,000 (10.0% Step 1)',
      lockoutSupport: 'Daily Server Midnight Loss Lockout Active',
      rating: '4.9 / 5.0'
    },
    {
      name: 'Topstep',
      logo: 'TOPSTEP',
      badge: 'TRADOVATE & NINJATRADER',
      dailyLossRule: '$2,000 (2.0% Daily Loss Limit)',
      maxTrailingDrawdown: '$3,000 End of Day Drawdown',
      profitTarget: '$6,000 (6.0%)',
      lockoutSupport: 'EOD Trailing Auto-Lockout Active',
      rating: '4.8 / 5.0'
    },
    {
      name: 'FundedNext',
      logo: 'FUNDEDNEXT',
      badge: 'MT5 & C-TRADER',
      dailyLossRule: '$5,000 (5.0% Daily Loss Limit)',
      maxTrailingDrawdown: '$10,000 (10.0% Overall)',
      profitTarget: '$8,000 (8.0%)',
      lockoutSupport: 'Balance & Equity Sync Active',
      rating: '4.8 / 5.0'
    },
  ];

  // Simulator Calculations
  const maxDailyLoss = (selectedCapital * 0.04).toFixed(0);
  const totalMaxDrawdown = (selectedCapital * 0.08).toFixed(0);
  const targetProfit = (selectedCapital * 0.08).toFixed(0);
  const recommendedRiskPerTrade = (selectedCapital * 0.0075).toFixed(0);
  const maxContracts = Math.max(1, Math.floor(Number(recommendedRiskPerTrade) / 150));

  const verifiedTraderCases = [
    {
      name: 'Vikram Mehta',
      firm: 'Apex $300k PA Account',
      payout: '₹14.2 Lakhs ($17,200)',
      trades: '184 Trades',
      winRate: '71.2%',
      quote: 'The trailing threshold on Apex was my kryptonite for 2 years. RiskRule locked my terminal every day before I hit the threshold. Now I have 4 funded accounts.'
    },
    {
      name: 'Sneha Ramanujan',
      firm: 'FTMO $200k Challenge',
      payout: 'Passed Phase 1 & 2 in 18 Days',
      trades: '42 Trades',
      winRate: '68.5%',
      quote: 'RiskRule eliminated the anxiety of breaching the 5% daily drawdown rule. The software does the math and enforces the stop with zero delay.'
    },
    {
      name: 'Marcus Vance',
      firm: 'Topstep $150k Express',
      payout: '₹9.8 Lakhs ($11,800)',
      trades: '96 Trades',
      winRate: '74.0%',
      quote: 'If you trade prop firms without an algorithmic daily loss lockout, you are gambling. RiskRule is an essential piece of professional risk equipment.'
    },
  ];

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full pt-28 sm:pt-36 pb-20 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div 
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] max-w-[90vw] h-[400px] rounded-full blur-[140px] opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.40) 0%, rgba(99, 102, 241, 0.20) 50%, transparent 80%)' }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-gold/30 bg-gold/10 text-xs font-semibold text-gold shadow-xs">
              <Award size={14} className="text-gold" />
              <span>Engineered for Funded Prop Firm Compliance</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6">
              Pass your prop challenge and <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-gold to-success bg-clip-text text-transparent">
                protect your funded payouts.
              </span>
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              92% of failed prop challenges occur because of a single day of emotional tilt. RiskRule connects directly to your evaluation accounts to mathematically prevent daily drawdown violations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary text-canvas font-bold text-sm shadow-md hover:opacity-95 transition-all"
              >
                <span>Protect Your Prop Account Free</span>
                <ArrowRight size={15} />
              </Link>
              <a
                href="#prop-simulator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface-1/60 text-primary font-semibold text-sm hover:bg-surface-2 transition-all"
              >
                <Sliders size={15} className="text-gold" />
                <span>Simulate Challenge Rules</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Key Prop Stats Bar ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 mb-20">
        <Reveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 rounded-3xl bg-surface-1 border border-border text-center shadow-card">
            <div className="flex flex-col gap-1 sm:border-r border-border/70 pb-4 sm:pb-0">
              <span className="text-4xl sm:text-5xl font-mono-stat font-extrabold text-primary tabular-nums">
                ₹<NumberCounter value={142} />M+
              </span>
              <span className="text-xs font-mono-stat font-bold text-tertiary uppercase tracking-wider">Funded Allocation Protected</span>
            </div>
            <div className="flex flex-col gap-1 sm:border-r border-border/70 pb-4 sm:pb-0">
              <span className="text-4xl sm:text-5xl font-mono-stat font-extrabold text-success tabular-nums">
                <NumberCounter value={99} />.6%
              </span>
              <span className="text-xs font-mono-stat font-bold text-tertiary uppercase tracking-wider">Zero Drawdown Breach Rate</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-4xl sm:text-5xl font-mono-stat font-extrabold text-gold tabular-nums">
                <NumberCounter value={3} />.4x
              </span>
              <span className="text-xs font-mono-stat font-bold text-tertiary uppercase tracking-wider">Higher Challenge Pass Rate</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Interactive Prop Challenge Simulator ── */}
      <section id="prop-simulator" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 relative z-20 mb-20 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Reveal direction="up">
            <p className="text-xs font-mono-stat font-bold uppercase tracking-widest text-gold mb-2.5">
              Interactive Challenge Modeler
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              Simulate your prop account risk parameters.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              Select your funding allocation to see optimal position sizing, maximum allowable risk per trade, and automated lockout thresholds.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-surface-1 border border-border p-6 sm:p-10 shadow-card">
            
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-display font-bold text-base text-primary block border-b border-border/80 pb-3">
                Evaluation Setup Controls
              </span>

              {/* Capital Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-mono-stat text-secondary font-medium">Select Allocation Size</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[25000, 50000, 100000, 150000, 300000].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setSelectedCapital(cap)}
                      className={cn(
                        "py-2.5 px-2 rounded-xl text-xs font-mono-stat font-bold transition-all border outline-none focus-ring",
                        selectedCapital === cap
                          ? "bg-primary text-canvas border-primary shadow-sm"
                          : "bg-surface-0 border-border text-secondary hover:text-primary hover:bg-surface-2"
                      )}
                    >
                      ${(cap / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Prop Firm Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono-stat text-secondary font-medium">Select Evaluation Firm</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Apex', 'FTMO', 'Topstep', 'FundedNext'].map((firm) => (
                    <button
                      key={firm}
                      onClick={() => setSelectedFirm(firm)}
                      className={cn(
                        "py-2 px-2 rounded-xl text-xs font-display font-bold transition-all border outline-none focus-ring",
                        selectedFirm === firm
                          ? "bg-gold/20 text-gold border-gold/40 shadow-sm"
                          : "bg-surface-0 border-border text-secondary hover:text-primary hover:bg-surface-2"
                      )}
                    >
                      {firm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-0 border border-border space-y-2 text-xs font-mono-stat">
                <div className="flex justify-between text-secondary">
                  <span>Selected Allocation:</span>
                  <span className="font-bold text-primary">${selectedCapital.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Target Profit ({selectedFirm}):</span>
                  <span className="font-bold text-success">+${Number(targetProfit).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-secondary border-t border-border pt-2">
                  <span>Max Daily Drawdown Barrier:</span>
                  <span className="font-bold text-danger">-${Number(maxDailyLoss).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right Output Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-surface-0 border border-gold/40 space-y-5 shadow-card">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <span className="text-xs font-mono-stat font-extrabold uppercase text-tertiary">Recommended Math Guardrails</span>
                <span className="px-2 py-0.5 rounded bg-gold/15 text-gold text-[10px] font-mono-stat font-bold">PROP OPTIMIZED</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[11px] font-mono-stat text-tertiary uppercase">Max Safe Risk / Trade</span>
                  <p className="text-2xl font-bold font-mono-stat text-primary mt-1">${recommendedRiskPerTrade}</p>
                  <span className="text-[10px] text-tertiary">0.75% of capital</span>
                </div>

                <div className="p-4 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[11px] font-mono-stat text-tertiary uppercase">Max NQ Contract Size</span>
                  <p className="text-2xl font-bold font-mono-stat text-gold mt-1">{maxContracts} Contracts</p>
                  <span className="text-[10px] text-tertiary">Based on 20-pt stop</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-1 border border-danger/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono-stat">
                  <span className="text-secondary font-medium">Automatic Lockout Trigger:</span>
                  <span className="font-bold text-danger">-${maxDailyLoss} (Within 24H)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono-stat">
                  <span className="text-secondary font-medium">Total Account Max Loss Buffer:</span>
                  <span className="font-bold text-primary">${totalMaxDrawdown}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-1/50 border border-border/80 text-xs font-mono-stat text-tertiary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                <span>RiskRule monitors trailing threshold tick-by-tick to prevent violations.</span>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      {/* ── Prop Firm Compatibility Matrix ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-20 relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="up">
            <p className="text-xs font-mono-stat font-bold uppercase tracking-widest text-gold mb-2.5">
              Firm Rule Compatibility
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              Integrated with major prop firm protocols.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              Direct telemetry sync ensures automated lockout adherence according to each firm's specific evaluation contract.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {propFirms.map((firm, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 0.05}>
              <div className="p-7 rounded-3xl bg-surface-1 border border-border hover:border-border-hover transition-all duration-200 space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-primary">{firm.name}</h3>
                    <span className="text-xs font-mono-stat text-tertiary">{firm.badge}</span>
                  </div>
                  <span className="text-xs font-mono-stat px-2.5 py-1 rounded bg-gold/10 text-gold font-bold">
                    ★ {firm.rating}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono-stat">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-secondary">Daily Loss Policy:</span>
                    <span className="font-bold text-primary">{firm.dailyLossRule}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-secondary">Max Trailing Drawdown:</span>
                    <span className="font-bold text-danger">{firm.maxTrailingDrawdown}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-secondary">Profit Target:</span>
                    <span className="font-bold text-success">{firm.profitTarget}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-0 border border-success/30 flex items-center gap-2 text-xs font-mono-stat text-success font-semibold">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>{firm.lockoutSupport}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Verified Funded Trader Testimonials ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 relative z-20 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="up">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              Real funded traders. Real payouts.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              Read how funded professionals protect their capital allocations every trading day.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {verifiedTraderCases.map((c, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 0.05}>
              <div className="p-7 rounded-3xl bg-surface-1 border border-border hover:border-border-hover transition-all duration-200 h-full flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-1 text-gold mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-sm text-primary leading-relaxed italic mb-6">
                    "{c.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-primary">{c.name}</span>
                    <span className="text-[11px] font-mono-stat text-success font-bold">{c.payout}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono-stat text-tertiary">
                    <span>{c.firm}</span>
                    <span>Win Rate: {c.winRate}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center">
        <Reveal direction="up">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            Never blow another prop challenge.
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto mb-8">
            Connect your evaluation accounts in 30 seconds and activate automated drawdown lockouts today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-canvas font-bold text-base shadow-lg hover:opacity-95 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface-1 text-primary font-semibold text-base hover:bg-surface-2 transition-all"
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
