import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, AlertCircle, CheckCircle2, Shield, Zap, Terminal, 
  ArrowRight, Sliders, MessageSquare, Target, Activity, Flame, Lock, 
  RefreshCw, TrendingDown, Eye, Headphones, Volume2, Mic, Radio, Play
} from 'lucide-react';
import { Reveal, HoverLift, StaggerContainer, StaggerItem, NumberCounter } from '../../components/ui/Motion';
import { cn } from '../../lib/cn';

interface Scenario {
  id: string;
  title: string;
  trigger: string;
  bias: string;
  severity: 'high' | 'critical' | 'moderate';
  aiMessage: string;
  actionTaken: string;
  capitalSaved: string;
  spokenAudio: string;
}

export default function AICoachPage() {
  const scenarios: Scenario[] = [
    {
      id: 'sizing-spike',
      title: 'Position Sizing Spike (3x)',
      trigger: 'Order submitted for 12 contracts on NQ (Standard baseline: 3 contracts)',
      bias: 'Revenge Tilt & Risk Escalation',
      severity: 'critical',
      aiMessage: 'Detected a 300% position sizing spike immediately following a -1.2R loss on ES. Historical telemetry indicates an 89% probability of negative expectancy when sizing up during active drawdown.',
      actionTaken: 'Order routing intercepted and locked for 15-minute cooling off interval.',
      capitalSaved: '+₹48,000 Saved',
      spokenAudio: '"Warning. Position sizing spike detected on Nasdaq futures. Order routing is temporarily locked to protect your drawdown buffer."'
    },
    {
      id: 'consecutive-loss',
      title: '3 Consecutive Losses',
      trigger: 'Account recorded 3 stopped-out trades in 42 minutes',
      bias: 'Gambler\'s Fallacy & Emotional Fatigue',
      severity: 'high',
      aiMessage: 'Session loss frequency exceeded normal distribution. Decision variance has increased by 4.2x with shortened trade duration. Your edge is currently degraded.',
      actionTaken: 'Mandatory 1-hour session lockout enforced. Journal reflection prompted.',
      capitalSaved: '+₹32,500 Saved',
      spokenAudio: '"Session loss limit triggered. Step away from your desk for 60 minutes. Your statistical edge has degraded."'
    },
    {
      id: 'fomc-chase',
      title: 'Pre-FOMC News Chasing',
      trigger: 'Market buy order sent 2 minutes before Federal Reserve Rate Decision',
      bias: 'FOMO & Uncontrolled Slippage Exposure',
      severity: 'critical',
      aiMessage: 'High-impact macroeconomic event in T-120 seconds. Bid-ask spread on index futures has widened 450%. High likelihood of 15+ tick adverse slippage.',
      actionTaken: 'Macro news lockout protocol triggered. Order blocked until 5 minutes post-release.',
      capitalSaved: '+₹25,000 Saved',
      spokenAudio: '"Federal Reserve interest rate decision in 2 minutes. High adverse slippage expected. Order entry is frozen until volatility normalizes."'
    },
    {
      id: 'stop-widening',
      title: 'Stop Loss Widened Mid-Trade',
      trigger: 'Stop loss modified from 20,400 to 20,350 while in floating drawdown',
      bias: 'Loss Aversion & Hope Mode',
      severity: 'high',
      aiMessage: 'Rule violation: Original trade plan specified a 20-point risk budget. Moving stop loss outward exposes account to 2.5x planned loss.',
      actionTaken: 'Stop modification rejected. Original stop loss strictly held by broker vault.',
      capitalSaved: '+₹15,000 Saved',
      spokenAudio: '"Stop loss modification rejected. Hope mode detected. Original planned invalidation level remains enforced."'
    },
    {
      id: 'late-night',
      title: 'Overnight Impulsive Session',
      trigger: 'New order submitted at 02:15 AM outside designated trading plan window',
      bias: 'Circadian Fatigue & Lack of Focus',
      severity: 'moderate',
      aiMessage: 'Execution outside defined trading hours. Historical analytics indicate win rate drops from 68% to 22% between 01:00 and 05:00.',
      actionTaken: 'Off-hours guardrail triggered. Requires explicit plan confirmation to execute.',
      capitalSaved: '+₹18,200 Saved',
      spokenAudio: '"Off-hours trading detected at 2:15 AM. Historical analytics confirm reduced edge during fatigue hours."'
    },
  ];

  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);

  const cognitiveBiases = [
    {
      title: 'Loss Aversion',
      desc: 'Holding losing trades far beyond designated invalidation levels in the desperate hope they break even.',
      solution: 'Automated hard stop enforcement with zero mid-trade widening allowed.'
    },
    {
      title: 'Revenge Tilt',
      desc: 'Instantly increasing position size or re-entering after a stop-out to "win back" lost capital.',
      solution: 'Mandatory 15-minute cooling off period following stop-out clusters.'
    },
    {
      title: 'Overconfidence Spike',
      desc: 'Sizing up recklessly after a 4+ winning trade streak, giving back all profits on a single bad setup.',
      solution: 'Dynamic volatility and streak position sizing caps.'
    },
    {
      title: 'News FOMO Chasing',
      desc: 'Jumping into volatile market candles seconds after CPI or Non-Farm Payrolls announcements.',
      solution: 'Automated 5-minute pre/post macroeconomic news lockout.'
    },
    {
      title: 'Recency Bias',
      desc: 'Abandoning a verified positive-expectancy strategy after just 2 normal statistical losses.',
      solution: 'Monte Carlo expectancy analytics showing 1,000-trade probability distributions.'
    },
    {
      title: 'Discipline Drift',
      desc: 'Gradually trading off-plan setups or unverified tickers when bored during quiet market sessions.',
      solution: 'Pre-flight trading checklist and approved instrument whitelist.'
    },
  ];

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full pt-28 sm:pt-36 pb-20 flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div 
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] max-w-[90vw] h-[450px] rounded-full blur-[140px] opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(168, 85, 247, 0.20) 50%, transparent 80%)' }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-iris/30 bg-iris/10 text-xs font-semibold text-iris shadow-xs">
              <Sparkles size={14} className="text-iris" />
              <span>Real-Time Cognitive Intelligence &amp; Spoken Voice Core</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6">
              The AI behavioral coach that <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-iris to-accent bg-clip-text text-transparent">
                speaks and intervenes in real time.
              </span>
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              Willpower alone cannot protect your account during high-stress drawdowns. RiskRules analyzes order telemetry and speaks audio guidance directly into your ears to enforce discipline before tilt takes over.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary text-canvas font-bold text-sm shadow-md hover:opacity-95 transition-all"
              >
                <span>Activate AI Voice Coach Free</span>
                <ArrowRight size={15} />
              </Link>
              <a
                href="#interactive-ai-demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface-1/60 text-primary font-semibold text-sm hover:bg-surface-2 transition-all"
              >
                <Brain size={15} className="text-iris" />
                <span>Test Live Simulator</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Interactive AI Coach Simulator Centerpiece ── */}
      <section id="interactive-ai-demo" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 relative z-20 mb-20 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Reveal direction="up">
            <p className="text-xs font-mono-stat font-bold uppercase tracking-widest text-iris mb-2.5">
              Interactive Behavioral &amp; Audio Engine
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              Select a trader mistake to test the AI voice &amp; risk intervention.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              Click through the scenarios below to see how RiskRules analyzes live order stream anomalies, provides spoken verbal cues, and locks rogue orders.
            </p>
          </Reveal>
        </div>

        {/* Scenario Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc)}
              className={cn(
                "px-4 py-2.5 rounded-xl border text-xs font-display font-bold transition-all duration-200 outline-none focus-ring",
                activeScenario.id === sc.id
                  ? "bg-primary text-canvas border-primary shadow-sm"
                  : "bg-surface-1 border-border text-secondary hover:text-primary hover:bg-surface-2"
              )}
            >
              {sc.title}
            </button>
          ))}
        </div>

        {/* Dynamic Simulation Card */}
        <Reveal direction="up" delay={0.1}>
          <div className="rounded-3xl bg-surface-1 border border-border p-6 sm:p-10 shadow-floating relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left: Trigger & Telemetry */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-xs font-mono-stat text-tertiary uppercase font-bold">EVENT TELEMETRY</span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded text-[10px] font-mono-stat font-extrabold uppercase",
                    activeScenario.severity === 'critical' ? "bg-danger/15 text-danger border border-danger/30" : "bg-gold/15 text-gold border border-gold/30"
                  )}>
                    {activeScenario.severity} RISK EVENT
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-0 border border-border space-y-2">
                  <span className="text-[11px] font-mono-stat text-tertiary uppercase block">Observed Action</span>
                  <p className="text-sm font-semibold text-primary">
                    {activeScenario.trigger}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-0 border border-border space-y-1">
                  <span className="text-[11px] font-mono-stat text-tertiary uppercase block">Diagnosed Cognitive Bias</span>
                  <p className="text-sm font-bold text-iris">
                    {activeScenario.bias}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-between font-mono-stat text-xs">
                  <span className="text-secondary font-medium">Estimated Capital Saved:</span>
                  <span className="text-success font-extrabold text-sm">{activeScenario.capitalSaved}</span>
                </div>
              </div>

              {/* Right: AI NLP Response & Guardrail Intervention */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-surface-0 border border-iris/40 space-y-6 shadow-card">
                
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-iris text-white flex items-center justify-center font-bold shadow-md">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-primary">RiskRules AI Behavioral Core</h4>
                      <p className="text-xs text-secondary font-medium">Spoken Audio + Real-Time Telemetry Debrief</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono-stat px-2.5 py-1 rounded-full bg-success/15 text-success font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> INTERVENED
                  </span>
                </div>

                {/* Spoken Voice Guidance Box */}
                <div className="p-4 rounded-2xl bg-iris/10 border border-iris/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-stat text-iris font-bold">
                    <span className="flex items-center gap-1.5"><Volume2 size={14} className="animate-pulse" /> SPOKEN VOICE GUIDANCE</span>
                    <span className="text-success">SUB-300MS AUDIO</span>
                  </div>
                  <p className="text-sm text-primary font-medium italic">
                    {activeScenario.spokenAudio}
                  </p>
                </div>

                {/* AI Diagnostic Speech Bubble */}
                <div className="p-4 rounded-2xl bg-surface-1 border border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono-stat text-iris font-bold">
                    <Sparkles size={14} />
                    <span>DETAILED QUANTITATIVE ANALYSIS</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed font-medium">
                    "{activeScenario.aiMessage}"
                  </p>
                </div>

                {/* Enforced System Action */}
                <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono-stat font-bold text-danger">
                    <span>ENFORCED SYSTEM ACTION</span>
                    <span className="flex items-center gap-1"><Lock size={12} /> PROTOCOL LOCKED</span>
                  </div>
                  <p className="text-xs font-semibold text-danger leading-relaxed">
                    {activeScenario.actionTaken}
                  </p>
                </div>

              </div>

            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Marquee Feature: Real-Time AI Voice Guidance & Spoken Co-Pilot ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 relative z-20 mb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface-1 border border-border shadow-card relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iris/15 border border-iris/30 text-xs font-mono-stat text-iris font-bold uppercase">
                <Headphones size={14} />
                <span>Auditory Co-Pilot Mode</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                Whispers discipline directly into your ears.
              </h2>
              <p className="text-base text-secondary leading-relaxed font-normal">
                During fast market breakouts and high-stress drawdowns, reading screen notifications breaks visual focus. RiskRules's neural audio engine delivers spoken cues right when you need them—calming your heart rate and grounding your execution.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Spoken position sizing confirmations before order submission",
                  "Macroeconomic news audio countdowns (T-5, T-3, T-1 min to CPI/FOMC)",
                  "Grounding cues & breathing pacing after consecutive stop-outs",
                  "Hands-free voice trade reflection & mental state audio logging"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-medium text-secondary">
                    <CheckCircle2 size={17} className="text-success shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-surface-0 border border-iris/40 space-y-5 shadow-card">
              <div className="flex items-center justify-between border-b border-border pb-3 text-xs font-mono-stat">
                <span className="text-tertiary font-bold">VOICE CO-PILOT HUD</span>
                <span className="text-success font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                  AUDIO MONITORING ACTIVE
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-surface-1 border border-border space-y-4">
                <div className="flex items-center justify-between text-xs font-mono-stat">
                  <span className="text-iris font-bold flex items-center gap-2">
                    <Volume2 size={16} className="text-iris" />
                    <span>NEURAL VOICE SYNTHESIZER</span>
                  </span>
                  <span className="text-tertiary">PERSONA: APEX QUANT</span>
                </div>

                {/* Animated Waveform */}
                <div className="flex items-center justify-center gap-1.5 h-10 py-1">
                  {[12, 24, 38, 20, 32, 44, 28, 40, 18, 30, 44, 26, 16, 36, 22, 30, 14, 24].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-1.5 bg-gradient-to-t from-accent to-iris rounded-full animate-pulse"
                    />
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-surface-0 border border-iris/20 text-xs text-primary font-mono-stat text-center">
                  "Target 1 achieved at plus 2.4R. Stop moved to breakeven."
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono-stat">
                <div className="p-3 rounded-xl bg-surface-1 border border-border text-center">
                  <span className="text-tertiary text-[10px] uppercase block">Response Latency</span>
                  <span className="font-bold text-success">&lt; 280ms</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-1 border border-border text-center">
                  <span className="text-tertiary text-[10px] uppercase block">Voice Recognition</span>
                  <span className="font-bold text-iris">Whisper V3 Native</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Cognitive Biases Breakdown Grid ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="up">
            <p className="text-xs font-mono-stat font-bold uppercase tracking-widest text-iris mb-2.5">
              The Science of Trading Psychology
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              6 psychological biases that bankrupt retail traders.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              Every trader battles these evolutionary human biases. RiskRules replaces willpower with programmatic guardrails and voice guidance.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cognitiveBiases.map((bias, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 0.05}>
              <div className="p-7 rounded-3xl bg-surface-1 border border-border hover:border-border-hover transition-all duration-200 h-full flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-xl text-primary">{bias.title}</h3>
                    <span className="text-xs font-mono-stat text-tertiary">0{idx + 1}</span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">
                    {bias.desc}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-0 border border-iris/20 space-y-1">
                  <span className="text-[10px] font-mono-stat text-iris font-bold uppercase block">RiskRules Solution</span>
                  <p className="text-xs font-semibold text-primary leading-relaxed">
                    {bias.solution}
                  </p>
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
            Stop losing money to emotional tilt.
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto mb-8">
            Deploy the AI Behavioral Coach and Voice Co-Pilot to your trading terminal in seconds with read-only broker security.
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
              to="/prop-traders"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface-1 text-primary font-semibold text-base hover:bg-surface-2 transition-all"
            >
              <Target size={16} className="text-gold" />
              <span>See Prop Firm Rules Tracker</span>
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
