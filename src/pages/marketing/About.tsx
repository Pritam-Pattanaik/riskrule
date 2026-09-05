import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, Shield, Cpu, ArrowRight, CheckCircle2, Lock, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal, StaggerContainer, StaggerItem, HoverLift, NumberCounter } from '../../components/ui/Motion';
import aboutGraphic from '../../assets/images/about-graphic.png';
import TrustTicker from '../../components/marketing/TrustTicker';

export default function About() {
  const philosophies = [
    {
      title: 'Mathematical Objectivity',
      icon: Target,
      color: 'accent',
      desc: 'Numbers do not lie. We strip away emotional bias by presenting cold, hard empirical data regarding your win rates, Sharpe ratios, and drawdowns.'
    },
    {
      title: 'Continuous Edge Evolution',
      icon: Zap,
      color: 'success',
      desc: 'Markets shift across regimes. Our AI behavioral core monitors order execution to alert you whenever your statistical edge begins to decay.'
    },
    {
      title: 'Zero-Conflict Broker Model',
      icon: Shield,
      color: 'iris',
      desc: 'We do not sell trading signals and we never take the opposite side of your trades. We build risk management tools that solely protect your capital.'
    },
  ];

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary min-h-screen">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full pt-28 sm:pt-36 pb-20 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div 
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] max-w-[90vw] h-[400px] rounded-full blur-[140px] opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.40) 0%, rgba(16, 185, 129, 0.20) 50%, transparent 80%)' }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-border bg-surface-1/80 text-xs font-semibold text-primary shadow-xs">
              <Cpu size={14} className="text-iris" />
              <span>Built by Quant Traders · Engineered for Absolute Discipline</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6">
              Built for traders. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-iris to-success bg-clip-text text-transparent">
                Powered by AI.
              </span>
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              We believe sustainable profitability isn't about magical indicators—it's about strict risk enforcement, mathematical expectancy, and eliminating psychological tilt.
            </p>
          </Reveal>

          {/* Graphic Banner */}
          <Reveal delay={0.2} className="w-full max-w-4xl relative mt-4 mb-8">
            <div className="absolute inset-0 bg-iris/10 blur-[100px] rounded-full pointer-events-none -z-10" />
            <motion.img 
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              src={aboutGraphic} 
              alt="RiskRule AI Architecture" 
              className="w-full h-[360px] sm:h-[440px] object-cover rounded-3xl shadow-floating border border-border"
            />
          </Reveal>
        </div>
      </section>

      {/* ── Mission Section ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16">
        <Reveal className="p-8 sm:p-12 rounded-3xl bg-surface-1 border border-border shadow-card space-y-6">
          <span className="text-xs font-mono-stat text-iris font-bold uppercase tracking-wider">Our Mission</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Replacing emotional willpower with algorithmic certainty.
          </h2>
          <div className="space-y-4 text-base text-secondary leading-relaxed font-normal">
            <p>
              RiskRule was conceived by institutional prop traders and algorithmic engineers who grew tired of watching talented traders blow up funded accounts during a single 30-minute lapse in psychological discipline.
            </p>
            <p>
              Traditional trading journals are passive post-mortems—they tell you what went wrong hours after you have already lost your capital. RiskRule flips the paradigm by acting as an active, real-time risk guardian that detects tilt anomalies and locks orders before catastrophic damage occurs.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Key Company Stats ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 rounded-3xl bg-surface-1 border border-border text-center shadow-card">
          <div className="flex flex-col gap-1 sm:border-r border-border/70 pb-4 sm:pb-0">
            <span className="text-4xl sm:text-5xl font-mono-stat font-extrabold text-primary tabular-nums">
              ₹<NumberCounter value={142} />M+
            </span>
            <span className="text-xs font-mono-stat font-bold text-tertiary uppercase tracking-wider">Prop Capital Protected</span>
          </div>
          <div className="flex flex-col gap-1 sm:border-r border-border/70 pb-4 sm:pb-0">
            <span className="text-4xl sm:text-5xl font-mono-stat font-extrabold text-success tabular-nums">
              &lt; <NumberCounter value={1} />ms
            </span>
            <span className="text-xs font-mono-stat font-bold text-tertiary uppercase tracking-wider">Broker Telemetry Latency</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-mono-stat font-extrabold text-iris tabular-nums">
              <NumberCounter value={18400} />+
            </span>
            <span className="text-xs font-mono-stat font-bold text-tertiary uppercase tracking-wider">Revenge Spirals Blocked</span>
          </div>
        </div>
      </section>

      {/* ── Core Philosophy Cards ── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="up">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4">
              Our Core Principles
            </h2>
            <p className="text-base text-secondary">
              The non-negotiable engineering standards behind every line of code we ship.
            </p>
          </Reveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerChildren={0.1}>
          {philosophies.map((p, idx) => {
            const Icon = p.icon;
            return (
              <StaggerItem key={idx}>
                <HoverLift className="p-8 rounded-3xl bg-surface-1 border border-border h-full flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-iris/15 flex items-center justify-center text-iris">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-primary">{p.title}</h3>
                    <p className="text-sm text-secondary leading-relaxed">{p.desc}</p>
                  </div>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* ── Trust Ticker ── */}
      <TrustTicker />

      {/* ── Closing CTA ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center">
        <Reveal direction="up">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            Join the quantitative revolution.
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto mb-8">
            Protect your capital, pass your evaluations, and trade with absolute mathematical discipline.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-canvas font-bold text-base shadow-lg hover:opacity-95 transition-all"
          >
            <span>Start Building Edge Free</span>
            <ArrowRight size={17} />
          </Link>
        </Reveal>
      </section>

    </div>
  );
}
