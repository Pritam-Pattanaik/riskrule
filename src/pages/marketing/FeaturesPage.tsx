import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, RefreshCw, Layers, Brain, Lock, CheckCircle, BarChart2, 
  Sliders, ArrowRight, AlertTriangle, Cpu, Database, Eye, Terminal, Flame,
  CheckCircle2, XCircle, Clock, Headphones, Volume2, Mic, Radio, Play, Pause, Sparkles
} from 'lucide-react';
import { Reveal, HoverLift, StaggerContainer, StaggerItem, NumberCounter } from '../../components/ui/Motion';
import { cn } from '../../lib/cn';
import TrustTicker from '../../components/marketing/TrustTicker';

export default function FeaturesPage() {
  const [selectedPillar, setSelectedPillar] = useState<number>(0);
  const [activeVoicePrompt, setActiveVoicePrompt] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const voiceDemos = [
    {
      title: 'Sizing Spike Warning',
      trigger: 'Order placement for 10 NQ contracts (3x standard sizing)',
      speech: '"Warning. This order represents a 250% position sizing spike above your average. Take a breath. Consider scaling down to your planned 3 contracts."',
      tone: 'Calm & Direct',
      type: 'RISK_INTERVENTION'
    },
    {
      title: 'Post-Loss Grounding Cue',
      trigger: 'Second consecutive stop-out on E-mini S&P',
      speech: '"Second consecutive loss detected. Step away from the keys for 3 minutes. Your edge is statistical—do not force an entry into low liquidity."',
      tone: 'Grounding & Psychological',
      type: 'TILT_PREVENTION'
    },
    {
      title: 'Macro News Countdown',
      trigger: 'T-180 seconds until CPI Release',
      speech: '"Attention. Consumer Price Index release in 3 minutes. High slippage expected. All automated order locks are now actively engaged."',
      tone: 'Institutional Alert',
      type: 'NEWS_SHIELD'
    },
    {
      title: 'Target Reached & Scale Out',
      trigger: 'Position reached +2.4R profit target',
      speech: '"Target 1 reached at plus 2.4R. Moving stop loss to breakeven according to your verified trade plan. Excellent discipline."',
      tone: 'Reinforcement',
      type: 'EXECUTION_REWARD'
    },
  ];

  const pillars = [
    {
      id: 0,
      badge: 'PILLAR 01 · PROP PROTECTION',
      title: 'Automated Daily Drawdown Lockouts',
      icon: Lock,
      color: 'danger',
      desc: 'Set strict daily loss thresholds modeled directly on FTMO, Apex, and Topstep parameters. When your stop-out barrier is approached, RiskRule initiates an automated cooling-off lockout, blocking further API order transmissions to eliminate emotional tilt spirals.',
      stats: '100% Breaches Blocked',
      highlights: [
        'Trailing & balance-based drawdown detection',
        'Automatic 24-hour API order routing freeze',
        'Customizable buffer warnings at 75% and 90% loss thresholds',
        'Direct integration with prop firm evaluation rules'
      ]
    },
    {
      id: 1,
      badge: 'PILLAR 02 · REAL-TIME AUDIO',
      title: 'Real-Time AI Voice Guidance & Audio Co-Pilot',
      icon: Headphones,
      color: 'iris',
      desc: 'When charts move fast and stress induces tunnel vision, looking away to read alerts is impossible. RiskRule speaks directly into your ears—whispering sizing confirmations, risk warnings, pacing cues, and news countdowns in sub-300ms neural real-time voice.',
      stats: '< 300ms Spoken Latency',
      highlights: [
        'Natural low-latency neural voice synthesis directly in headphones',
        'Verbal position sizing warnings before order routing',
        'Spoken macroeconomic countdowns (e.g. "T-3 minutes to CPI announcement")',
        'Psychological grounding cues after consecutive stop-outs',
        'Hands-free voice trade reflection & mental state logging'
      ]
    },
    {
      id: 2,
      badge: 'PILLAR 03 · ZERO SPREADSHEETS',
      title: 'Sub-Second Broker Synchronization',
      icon: RefreshCw,
      color: 'accent',
      desc: 'Never manually log another spreadsheet again. RiskRule connects seamlessly to MetaTrader 4/5, Interactive Brokers, Tradovate, Binance, and Apex. Every fill, execution timestamp, commission fee, and slippage delta is ingested within 800 milliseconds.',
      stats: '0.8ms Ingestion Latency',
      highlights: [
        'Instant read-only API & webhook integrations',
        'Zero manual CSV uploads or formula errors',
        'Accurate slippage and broker fee reconciliation',
        'Multi-account aggregate or isolated portfolio tracking'
      ]
    },
    {
      id: 3,
      badge: 'PILLAR 04 · QUANT EDGE',
      title: 'AI Expectancy & Mathematical Edge Scoring',
      icon: Brain,
      color: 'iris',
      desc: 'Replace gut feeling with verified probability. Our quantitative attribution model calculates your Sharpe ratio, Sortino ratio, profit factor, and R:R distribution by strategy, setup type, time of day, and market regime.',
      stats: '+2.4R Average Expectancy',
      highlights: [
        'Automated Monte Carlo draw simulations',
        'Time-of-day edge attribution analytics',
        'Setup-specific win rate and R-multiple grading',
        'Continuous edge decay warnings during shifting market regimes'
      ]
    },
    {
      id: 4,
      badge: 'PILLAR 05 · MACRO INTELLIGENCE',
      title: 'Pre-News High-Impact Event Lockouts',
      icon: Flame,
      color: 'gold',
      desc: 'Volatility spikes around CPI, FOMC, and Non-Farm Payrolls often trigger unmanageable slippage. RiskRule monitors the macroeconomic calendar in real time, automatically notifying you and locking order submissions 5 minutes before Tier-1 releases.',
      stats: '0 Unplanned Slippage Events',
      highlights: [
        'Live economic calendar sync with impact tags',
        'Configurable pre-news lockout timer (1-15 min)',
        'Post-news spread widening alerts',
        'Historical event volatility heatmaps'
      ]
    },
    {
      id: 5,
      badge: 'PILLAR 06 · ASSET AGNOSTIC',
      title: 'Multi-Asset Execution Coverage',
      icon: Layers,
      color: 'success',
      desc: 'Whether you trade E-mini Nasdaq futures, gold spot, forex majors, single-stock options, or crypto perps, RiskRule handles tick values, multiplier contracts, and currency conversions automatically.',
      stats: '400+ Instruments Supported',
      highlights: [
        'Futures: NQ, ES, CL, GC, ZB, RTY',
        'Forex & Commodities: EURUSD, GBPUSD, XAUUSD',
        'Crypto: BTC, ETH perpetual swaps and spot',
        'Equities & ETFs: SPY, QQQ, AAPL, NVDA'
      ]
    },
    {
      id: 6,
      badge: 'PILLAR 07 · ZERO TRUST',
      title: 'Bank-Grade Read-Only Security Vault',
      icon: Shield,
      color: 'accent',
      desc: 'Your capital is sacred. RiskRule operates exclusively with Read-Only API permissions. We never request execution rights or withdrawal access. All credentials are encrypted with AES-256 and stored in SOC-2 compliant hardware security modules.',
      stats: '256-Bit Hardware Encryption',
      highlights: [
        'Zero withdrawal or fund transfer permissions',
        'End-to-end TLS 1.3 encrypted data pipelines',
        'Instant single-click credential revocation',
        'Zero selling or sharing of user trading data'
      ]
    },
  ];

  const activePillar = pillars[selectedPillar];

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full pt-28 sm:pt-36 pb-20 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div 
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] max-w-[90vw] h-[400px] rounded-full blur-[140px] opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(99, 102, 241, 0.25) 50%, transparent 80%)' }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-border bg-surface-1/80 text-xs font-semibold text-primary shadow-xs">
              <Cpu size={14} className="text-iris" />
              <span>The 7 Institutional Engineering Pillars</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6">
              Built to protect capital when <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-iris to-success bg-clip-text text-transparent">
                human emotion fails.
              </span>
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              Explore the mathematical architecture behind the RiskRule execution engine—including real-time AI voice guidance, programmatic lockouts, and sub-second broker telemetry.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary text-canvas font-bold text-sm shadow-md hover:opacity-95 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight size={15} />
              </Link>
              <a
                href="#voice-co-pilot-demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface-1/60 text-primary font-semibold text-sm hover:bg-surface-2 transition-all"
              >
                <Headphones size={15} className="text-iris" />
                <span>Hear Live AI Voice Demo</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Interactive 7 Pillars Showcase ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-8 relative z-20 mb-16">
        
        {/* Pillar Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = selectedPillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillar(pillar.id)}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 min-h-[110px] outline-none focus-ring",
                  isSelected
                    ? "bg-surface-2 border-border-hover shadow-card ring-1 ring-iris/40"
                    : "bg-surface-1/60 border-border/70 hover:bg-surface-1 hover:border-border"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center",
                  isSelected ? "bg-primary text-canvas" : "bg-surface-2 text-iris"
                )}>
                  <Icon size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-mono-stat text-tertiary block font-bold">0{pillar.id + 1}</span>
                  <span className="text-xs font-display font-bold text-primary leading-tight line-clamp-1">
                    {pillar.title.split(' ')[0]} {pillar.title.split(' ')[1]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Deep-Dive Display Card */}
        <Reveal direction="up" delay={0.05}>
          <div className="rounded-3xl bg-surface-1 border border-border p-8 sm:p-12 shadow-floating relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Pillar Details */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-mono-stat font-extrabold uppercase tracking-wider text-iris px-3 py-1 rounded-full bg-iris/10 border border-iris/20 inline-block">
                  {activePillar.badge}
                </span>

                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {activePillar.title}
                </h2>

                <p className="text-base sm:text-lg text-secondary leading-relaxed">
                  {activePillar.desc}
                </p>

                <div className="space-y-3 pt-2">
                  {activePillar.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-medium text-secondary">
                      <CheckCircle2 size={17} className="text-success shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-surface-0 border border-border inline-flex items-center gap-3">
                    <span className="text-xs font-mono-stat text-tertiary uppercase">Performance Verified:</span>
                    <span className="text-sm font-mono-stat font-bold text-success">{activePillar.stats}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-tech Visual Mockup */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-0 border border-border space-y-4 font-mono-stat">
                <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
                  <span className="text-tertiary font-bold">SYSTEM AUDIT // 0{activePillar.id + 1}</span>
                  <span className="text-success font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    LIVE PROTOCOL
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-surface-1 border border-border space-y-2">
                  <span className="text-[11px] text-tertiary uppercase block">Active Rule Check</span>
                  <p className="text-xs font-bold text-primary leading-relaxed">
                    ENFORCING: {activePillar.title}
                  </p>
                  <p className="text-[11px] text-success">
                    ✓ Threshold validation passed with 0 execution breaches.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="text-[10px] text-tertiary uppercase block">Response Time</span>
                    <span className="font-bold text-primary">&lt; 1.2ms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="text-[10px] text-tertiary uppercase block">Uptime SLA</span>
                    <span className="font-bold text-success">99.99%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Marquee Feature Showcase: Real-Time AI Voice Guidance & Audio Co-Pilot ── */}
      <section id="voice-co-pilot-demo" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-16 relative z-20 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-iris/15 border border-iris/30 text-xs font-semibold text-iris mb-3 shadow-xs">
              <Headphones size={14} className="text-iris" />
              <span>Hands-Free Trading Co-Pilot</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              Real-Time AI Voice Guidance While Trading.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              When the market accelerates, reading text alerts creates visual friction. RiskRule speaks directly to you through low-latency neural audio—grounding your psychology and calling out risk before you pull the trigger.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.1}>
          <div className="rounded-3xl bg-surface-1 border border-iris/40 p-6 sm:p-10 shadow-floating relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-iris/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Selector */}
              <div className="lg:col-span-5 space-y-3">
                <span className="font-display font-bold text-base text-primary block border-b border-border/80 pb-3">
                  Sample Live Spoken Scenarios
                </span>

                {voiceDemos.map((demo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVoicePrompt(idx)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left transition-all duration-200 space-y-1.5 outline-none focus-ring",
                      activeVoicePrompt === idx
                        ? "bg-surface-2 border-iris/50 shadow-sm ring-1 ring-iris/30"
                        : "bg-surface-0 border-border hover:bg-surface-1"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs font-mono-stat font-bold">
                      <span className="text-primary">{demo.title}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded uppercase",
                        demo.type === 'RISK_INTERVENTION' ? "bg-danger/15 text-danger" :
                        demo.type === 'TILT_PREVENTION' ? "bg-gold/15 text-gold" :
                        demo.type === 'NEWS_SHIELD' ? "bg-accent/15 text-accent" :
                        "bg-success/15 text-success"
                      )}>
                        {demo.type}
                      </span>
                    </div>
                    <p className="text-xs text-secondary line-clamp-1">{demo.trigger}</p>
                  </button>
                ))}
              </div>

              {/* Right Audio HUD Player */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-surface-0 border border-iris/30 space-y-6 shadow-card">
                
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-iris text-white flex items-center justify-center font-bold shadow-md">
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-primary">Neural Voice Synthesis Engine</h4>
                      <p className="text-xs text-secondary font-medium">Sub-300ms Spoken Latency · Low Cognitive Load</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono-stat px-2.5 py-1 rounded-full bg-success/15 text-success font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    LIVE AUDIO STREAM
                  </span>
                </div>

                {/* Animated Sound Wave Visualizer Mockup */}
                <div className="p-5 rounded-2xl bg-surface-1 border border-border space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono-stat">
                    <span className="text-tertiary">SPOKEN PROMPT AUDIO</span>
                    <span className="text-iris font-bold">TONE: {voiceDemos[activeVoicePrompt].tone}</span>
                  </div>

                  {/* Sound Wave Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-12 py-1">
                    {[16, 28, 42, 24, 38, 48, 30, 44, 22, 36, 48, 32, 20, 40, 26, 34, 18, 28].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}px` }}
                        className="w-1.5 bg-gradient-to-t from-accent to-iris rounded-full animate-pulse"
                      />
                    ))}
                  </div>

                  {/* Spoken Quote */}
                  <div className="p-3.5 rounded-xl bg-surface-0 border border-iris/20 text-sm text-primary font-medium italic leading-relaxed">
                    {voiceDemos[activeVoicePrompt].speech}
                  </div>
                </div>

                {/* Feature Tags */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono-stat">
                  <div className="p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="text-tertiary text-[10px] uppercase block">Voice Personas</span>
                    <span className="font-bold text-primary">Apex Desk &amp; Zen Guardian</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="text-tertiary text-[10px] uppercase block">Voice Input Mode</span>
                    <span className="font-bold text-success">Hands-Free Mental Check-in</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Architecture Comparison: Manual Spreadsheets vs RiskRule ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-20 relative z-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal direction="up">
            <p className="text-xs font-mono-stat font-bold uppercase tracking-widest text-iris mb-2.5">
              The Architecture Difference
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              Why manual spreadsheets fail modern traders.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              See the mathematical reality of switching from delayed emotional journaling to real-time programmatic risk enforcement.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Legacy Spreadsheet Card */}
          <Reveal direction="up" delay={0.05}>
            <div className="p-8 rounded-3xl bg-surface-1 border border-border/80 space-y-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center text-danger">
                      <XCircle size={22} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-primary">Manual Excel / Notion Journals</h3>
                      <p className="text-xs text-danger font-mono-stat">Post-Mortem Only · Zero Protection</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono-stat px-2.5 py-1 rounded bg-danger/10 text-danger font-bold">LEGACY</span>
                </div>

                <ul className="space-y-4 text-sm text-secondary">
                  <li className="flex items-start gap-3">
                    <XCircle size={17} className="text-danger shrink-0 mt-0.5" />
                    <span>Trades are logged hours after session ends—zero protection during active revenge tilt.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle size={17} className="text-danger shrink-0 mt-0.5" />
                    <span>Prone to human error, missed fees, inaccurate slippage calculations, and forgotten stops.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle size={17} className="text-danger shrink-0 mt-0.5" />
                    <span>85% of traders abandon manual entry within 30 days due to spreadsheet fatigue.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle size={17} className="text-danger shrink-0 mt-0.5" />
                    <span>No spoken or automated alert when daily prop firm drawdown limit is triggered.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-xs font-mono-stat text-danger font-bold text-center">
                AVERAGE RETENTION: 21 DAYS BEFORE QUIT
              </div>
            </div>
          </Reveal>

          {/* RiskRule Algorithmic Card */}
          <Reveal direction="up" delay={0.1}>
            <div className="p-8 rounded-3xl bg-surface-1 border border-iris/40 shadow-card space-y-6 h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-iris/10 rounded-full blur-3xl -z-10" />

              <div>
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-iris text-white flex items-center justify-center font-bold shadow-md">
                      <Zap size={22} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-primary">RiskRule Quantitative Engine</h3>
                      <p className="text-xs text-success font-mono-stat">Real-Time Audio Sync · Active Tilt Blocking</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono-stat px-2.5 py-1 rounded bg-success/15 text-success font-bold">ALGORITHMIC</span>
                </div>

                <ul className="space-y-4 text-sm text-secondary">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-success shrink-0 mt-0.5" />
                    <span>Real-time spoken AI voice coaching delivers instant grounding without looking away.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-success shrink-0 mt-0.5" />
                    <span>Sub-second direct broker sync ingests fills, fees, and timestamps automatically.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-success shrink-0 mt-0.5" />
                    <span>Prop firm compliance rules auto-configured for FTMO, Apex, Topstep, and FundedNext.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-success shrink-0 mt-0.5" />
                    <span>Continuous statistical expectancy and Monte Carlo drawdown simulations.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-xs font-mono-stat text-success font-bold text-center">
                PROVEN DRAWDOWN COMPLIANCE: 99.4%
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Broker Ticker ── */}
      <TrustTicker />

      {/* ── Closing Section ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 text-center">
        <Reveal direction="up">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            Protect your capital with institutional rules.
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto mb-8">
            Join thousands of prop firm and discretionary traders trading with mathematically verified discipline.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-canvas font-bold text-base shadow-lg hover:opacity-95 transition-all"
            >
              <span>Start Free Now</span>
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/ai-coach"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface-1 text-primary font-semibold text-base hover:bg-surface-2 transition-all"
            >
              <Brain size={16} className="text-iris" />
              <span>Explore AI Behavioral Coach</span>
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
