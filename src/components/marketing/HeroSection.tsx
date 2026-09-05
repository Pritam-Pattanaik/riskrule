import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, Shield, Terminal, Sparkles, Check, Sliders, Brain, Lock } from 'lucide-react';
import { Reveal } from '../ui/Motion';

export default function HeroSection() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full pt-28 sm:pt-36 pb-20 md:pb-28 flex flex-col items-center justify-center overflow-hidden">
      
      {/* ── Zero-CPU Static CSS Atmospheric Illumination ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] max-w-[90vw] h-[500px] rounded-full blur-[140px] opacity-25 dark:opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(16, 185, 129, 0.20) 50%, transparent 80%)' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(242,246,254,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(242,246,254,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
        
        {/* Status Pill Badge */}
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8 border border-border bg-surface-1/70 backdrop-blur-md text-xs font-medium text-secondary hover:border-border-hover transition-colors shadow-xs cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(32,196,117,0.8)]" />
            <span className="text-tertiary">|</span>
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <Lock size={13} className="text-iris" />
              <span>Zero Drawdown Breaches · Automated Discipline Layer</span>
            </span>
          </div>
        </Reveal>

        {/* Primary Display Headline */}
        <Reveal direction="up" delay={0.1}>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.05] mb-6 max-w-4xl mx-auto">
            Stop losing money to emotional tilt. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-iris to-success bg-clip-text text-transparent">
              Trade with programmatic discipline.
            </span>
          </h1>
        </Reveal>

        {/* Narrative Sub-text */}
        <Reveal direction="up" delay={0.15}>
          <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            90% of traders fail not because of entries, but because of revenge sizing, broken stop-losses, and psychological tilt in drawdown. RiskRule is the intelligent risk layer that intercepts emotional mistakes before they hit your broker, turning erratic trading into consistent, funded profitability.
          </p>
        </Reveal>

        {/* Action Conversion Trigger Button Group */}
        <Reveal direction="up" delay={0.2} className="w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8 w-full max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-canvas font-semibold text-base shadow-sm hover:opacity-95 transition-all duration-200 focus-ring"
            >
              <span>Start Building Discipline Free</span>
              <ArrowRight size={17} />
            </button>

            <a
              href="#discipline-simulator"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border border-border bg-surface-1/50 text-primary font-medium text-base hover:bg-surface-1 hover:border-border-hover transition-all duration-200 backdrop-blur-md focus-ring"
            >
              <Sliders size={16} className="text-iris" />
              <span>Test Profitability Simulator</span>
            </a>
          </div>

          {/* Trust Assurance Footers */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-tertiary pt-2">
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-success stroke-[2.5]" />
              <span>Automated 24H daily drawdown lockouts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-success stroke-[2.5]" />
              <span>Instant sub-second broker sync</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-success stroke-[2.5]" />
              <span>FTMO, Apex, Topstep compliant</span>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
