import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, Shield, Terminal, Sparkles, Check, Sliders, Brain, Lock } from 'lucide-react';
import { Reveal } from '../ui/Motion';
import { useUIStore } from '../../stores/uiStore';

export default function HeroSection() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { setBetaModalOpen } = useUIStore();

  return (
    <section className="relative w-full pt-20 sm:pt-24 pb-12 sm:pb-16 flex flex-col items-center justify-center overflow-hidden">
      
      {/* ── Zero-CPU Static CSS Atmospheric Illumination ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] max-w-[90vw] h-[500px] rounded-full blur-[140px] opacity-25 dark:opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(16, 185, 129, 0.20) 50%, transparent 80%)' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(242,246,254,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(242,246,254,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center z-10">
        
        {/* Status Pill Badge */}
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-4 sm:mb-5 border border-border bg-surface-1/70 backdrop-blur-md text-xs font-medium text-secondary hover:border-border-hover transition-colors shadow-xs cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(32,196,117,0.8)]" />
            <span className="text-tertiary">|</span>
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <Lock size={12} className="text-iris" />
              <span>Zero Drawdown Breaches · Automated Discipline Layer</span>
            </span>
          </div>
        </Reveal>

        {/* Primary Display Headline */}
        <Reveal direction="up" delay={0.1}>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary leading-[1.08] mb-3 sm:mb-4 max-w-4xl mx-auto">
            Stop losing money to emotional tilt. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-iris to-success bg-clip-text text-transparent">
              Trade with programmatic discipline.
            </span>
          </h1>
        </Reveal>

        {/* Value Proposition Callout & Narrative Sub-text */}
        <Reveal direction="up" delay={0.15}>
          <div className="max-w-2xl mx-auto mb-6 sm:mb-7">
            <p className="font-display text-base sm:text-xl font-semibold text-primary tracking-tight mb-2">
              Your broker records your trades.{' '}
              <span className="bg-gradient-to-r from-iris via-accent to-success bg-clip-text text-transparent font-bold">
                RiskRule helps you understand them.
              </span>
            </p>
            <p className="font-sans text-xs sm:text-sm md:text-base text-secondary max-w-xl mx-auto leading-relaxed font-normal">
              The intelligent risk layer that intercepts revenge sizing and emotional drawdown breaches before they hit your broker.
            </p>
          </div>
        </Reveal>

        {/* Action Conversion Trigger Button Group */}
        <Reveal direction="up" delay={0.2} className="w-full sm:w-auto">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-5 w-full max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/signup')}
              className="min-h-[44px] sm:min-h-[48px] inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-primary text-canvas font-semibold text-sm sm:text-base shadow-sm hover:opacity-95 transition-all duration-200 focus-ring"
            >
              <span>Start Building Discipline Free</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setBetaModalOpen(true)}
              className="min-h-[44px] sm:min-h-[48px] inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-iris/50 bg-iris/10 text-iris font-semibold text-sm sm:text-base hover:bg-iris/20 transition-all duration-200 focus-ring"
            >
              <Sparkles size={15} />
              <span>Join the Beta</span>
            </button>

            <a
              href="#workspace"
              className="min-h-[44px] sm:min-h-[48px] inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-border bg-surface-1/50 text-primary font-medium text-sm sm:text-base hover:bg-surface-1 hover:border-border-hover transition-all duration-200 backdrop-blur-md focus-ring"
            >
              <Sliders size={15} className="text-iris" />
              <span>Live Preview</span>
            </a>
          </div>

          {/* Trust Assurance Footers */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] sm:text-xs font-medium text-tertiary">
            <div className="flex items-center gap-1.5">
              <Check size={13} className="text-success stroke-[2.5]" />
              <span>Automated 24H daily drawdown lockouts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={13} className="text-success stroke-[2.5]" />
              <span>Instant sub-second broker sync</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={13} className="text-success stroke-[2.5]" />
              <span>FTMO, Apex, Topstep compliant</span>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
