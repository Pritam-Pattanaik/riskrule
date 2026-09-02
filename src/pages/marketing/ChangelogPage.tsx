import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Zap, Shield, Brain, Terminal, RefreshCw, Layers, 
  CheckCircle2, ArrowRight, Tag, Calendar
} from 'lucide-react';
import { Reveal, HoverLift } from '../../components/ui/Motion';
import { cn } from '../../lib/cn';

export default function ChangelogPage() {
  const releases = [
    {
      version: 'v2.4.0',
      date: 'September 2026',
      badge: 'LATEST RELEASE',
      highlight: true,
      title: 'AI Behavioral Coach v2 & Sub-Second SSE Stream',
      description: 'Major platform upgrade delivering real-time sentiment analysis, instant cognitive tilt detection, and sub-millisecond market quote telemetry.',
      items: [
        { type: 'NEW', text: 'Real-time AI Behavioral Intervention Engine with natural language debriefs.' },
        { type: 'NEW', text: 'Server-Sent Events (SSE) live market quote pipeline (< 800ms latency).' },
        { type: 'IMPROVED', text: 'Prop firm trailing drawdown algorithm upgraded for Apex and Topstep.' },
        { type: 'IMPROVED', text: 'Dark obsidian UI overhaul with glassmorphic cards and Framer Motion micro-interactions.' },
        { type: 'FIX', text: 'Fixed timezone discrepancy in historical trade export CSVs.' },
      ]
    },
    {
      version: 'v2.3.2',
      date: 'August 2026',
      badge: 'BROKER SYNC',
      highlight: false,
      title: 'Tradovate & MetaTrader 5 Direct Webhook Ingestion',
      description: 'Expanded native integration suite to support instant order reconciliation for institutional futures and forex brokers.',
      items: [
        { type: 'NEW', text: 'Direct Tradovate OAuth 2.0 connection with sub-second order fill sync.' },
        { type: 'NEW', text: 'Automated pre-CPI and pre-FOMC economic news lockout timer.' },
        { type: 'IMPROVED', text: 'Enhanced Monte Carlo expectancy simulation accuracy to 10,000 runs.' },
        { type: 'SECURITY', text: 'Updated TLS 1.3 token vault encryption standards.' },
      ]
    },
    {
      version: 'v2.2.0',
      date: 'July 2026',
      badge: 'ANALYTICS',
      highlight: false,
      title: 'Institutional Expectancy Matrix & Sharpe Breakdown',
      description: 'Introduced deep quantitative edge attribution by strategy, instrument, time of day, and market regime.',
      items: [
        { type: 'NEW', text: 'Time-of-day edge attribution heatmap.' },
        { type: 'NEW', text: 'Multi-account aggregate portfolio risk dashboard.' },
        { type: 'IMPROVED', text: 'Sharpe, Sortino, and Profit Factor calculations optimized for intraday futures.' },
      ]
    },
  ];

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full pt-28 sm:pt-36 pb-16 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div 
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] max-w-[90vw] h-[350px] rounded-full blur-[140px] opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.40) 0%, rgba(16, 185, 129, 0.20) 50%, transparent 80%)' }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-border bg-surface-1/80 text-xs font-semibold text-primary shadow-xs">
              <Sparkles size={14} className="text-iris" />
              <span>Continuous Engineering Cadence</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6">
              Product Updates &amp; <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-iris to-accent bg-clip-text text-transparent">
                Release Notes.
              </span>
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              We ship weekly updates to keep your trading edge sharp. Track new features, broker integrations, and engine improvements.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 relative z-20 mb-20">
        <div className="space-y-12">
          {releases.map((rel, idx) => (
            <Reveal key={rel.version} direction="up" delay={idx * 0.08}>
              <div className={cn(
                "p-8 sm:p-10 rounded-3xl border transition-all relative overflow-hidden",
                rel.highlight
                  ? "bg-surface-1 border-iris/40 shadow-card"
                  : "bg-surface-1/70 border-border"
              )}>
                {/* Release Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-stat text-2xl font-extrabold text-primary">{rel.version}</span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-mono-stat font-extrabold uppercase",
                      rel.highlight ? "bg-iris/20 text-iris border border-iris/30" : "bg-surface-2 text-secondary"
                    )}>
                      {rel.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-stat text-tertiary">
                    <Calendar size={14} />
                    <span>{rel.date}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-primary">{rel.title}</h3>
                  <p className="text-sm sm:text-base text-secondary leading-relaxed">{rel.description}</p>
                </div>

                {/* Change list */}
                <div className="space-y-2.5 pt-4 border-t border-border/60">
                  {rel.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm font-medium">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-mono-stat font-extrabold shrink-0 mt-0.5",
                        item.type === 'NEW' ? "bg-success/15 text-success border border-success/30" :
                        item.type === 'IMPROVED' ? "bg-iris/15 text-iris border border-iris/30" :
                        item.type === 'SECURITY' ? "bg-accent/15 text-accent border border-accent/30" :
                        "bg-gold/15 text-gold border border-gold/30"
                      )}>
                        {item.type}
                      </span>
                      <span className="text-secondary">{item.text}</span>
                    </div>
                  ))}
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20 text-center">
        <Reveal direction="up">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4">
            Experience the latest version today.
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-xl mx-auto mb-8">
            Create your account in 30 seconds and start trading with algorithmic discipline.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-canvas font-bold text-base shadow-lg hover:opacity-95 transition-all"
          >
            <span>Get Started Free</span>
            <ArrowRight size={17} />
          </Link>
        </Reveal>
      </section>

    </div>
  );
}
