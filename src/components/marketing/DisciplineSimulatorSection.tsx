import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Shield, Brain, Sliders, AlertCircle, 
  CheckCircle2, ArrowRight, Zap, Target, Lock, Award
} from 'lucide-react';
import { Reveal, HoverLift, NumberCounter } from '../ui/Motion';
import { cn } from '../../lib/cn';

export default function DisciplineSimulatorSection() {
  const [disciplineScore, setDisciplineScore] = useState<number>(85);

  // Dynamic calculations based on discipline score
  const isProfitable = disciplineScore >= 70;
  
  // Simulated stats
  const calculatedPnL = Math.round(((disciplineScore - 60) / 38) * 78000);
  const winRate = (42 + (disciplineScore / 98) * 32).toFixed(1);
  const avgRR = (1.1 + (disciplineScore / 98) * 1.8).toFixed(1);
  const revengeLossesBlocked = Math.round((disciplineScore / 98) * 14);
  const capitalSaved = Math.round(((disciplineScore - 50) / 48) * 48000);
  
  // Prop Challenge status
  const propStatus = disciplineScore >= 80 
    ? { text: 'CHALLENGE PASSED (FUNDED)', color: 'text-success bg-success/15 border-success/30' }
    : disciplineScore >= 65 
    ? { text: 'NEAR BREAKEVEN (HIGH VARIANCE)', color: 'text-gold bg-gold/15 border-gold/30' }
    : { text: 'ACCOUNT BLOWN (DRAWDOWN BREACH)', color: 'text-danger bg-danger/15 border-danger/30' };

  // SVG dynamic curve points based on discipline
  const generatePath = () => {
    if (disciplineScore < 60) {
      // Downward catastrophic spiral
      return {
        d: "M 0 30 Q 80 20 150 70 T 280 110 T 380 90 T 500 145",
        area: "M 0 30 Q 80 20 150 70 T 280 110 T 380 90 T 500 145 L 500 150 L 0 150 Z",
        color: "rgb(var(--color-danger))",
        stroke: "text-danger"
      };
    } else if (disciplineScore < 75) {
      // Choppy stagnant curve
      return {
        d: "M 0 90 Q 70 60 140 100 T 260 70 T 380 95 T 500 75",
        area: "M 0 90 Q 70 60 140 100 T 260 70 T 380 95 T 500 75 L 500 150 L 0 150 Z",
        color: "rgb(var(--color-gold))",
        stroke: "text-gold"
      };
    } else {
      // Smooth institutional upward compounding curve
      const curvature = Math.min(15, 60 - (disciplineScore - 75) * 1.8);
      return {
        d: `M 0 130 Q 100 ${curvature + 70} 180 ${curvature + 40} T 320 ${curvature + 20} T 430 ${curvature + 5} T 500 10`,
        area: `M 0 130 Q 100 ${curvature + 70} 180 ${curvature + 40} T 320 ${curvature + 20} T 430 ${curvature + 5} T 500 10 L 500 150 L 0 150 Z`,
        color: "rgb(var(--color-success))",
        stroke: "text-success"
      };
    }
  };

  const currentPath = generatePath();

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-20 relative z-20">
      
      {/* Chapter Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Reveal direction="up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-1 border border-iris/30 text-xs font-semibold text-iris mb-3 shadow-xs">
            <Sliders size={14} className="text-iris" />
            <span>Interactive Profitability Engine</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            See how discipline transforms your equity curve.
          </h2>
          <p className="text-base sm:text-lg text-secondary leading-relaxed">
            Drag the slider to adjust your execution discipline. Watch how eliminating tilt, sizing spikes, and broken stop-losses turns a losing trader into a consistently funded professional.
          </p>
        </Reveal>
      </div>

      {/* Interactive Simulator Container */}
      <Reveal direction="up" delay={0.1}>
        <div className="rounded-3xl bg-surface-1 border border-border p-6 sm:p-10 shadow-floating relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Control Column */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-5 rounded-2xl bg-surface-0 border border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono-stat font-extrabold uppercase text-tertiary">
                    Execution Discipline Score
                  </span>
                  <span className={cn(
                    "font-mono-stat text-2xl font-extrabold",
                    disciplineScore >= 80 ? "text-success" : disciplineScore >= 65 ? "text-gold" : "text-danger"
                  )}>
                    {disciplineScore}%
                  </span>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min={50}
                    max={98}
                    step={1}
                    value={disciplineScore}
                    onChange={(e) => setDisciplineScore(Number(e.target.value))}
                    className="w-full accent-iris cursor-pointer h-2 bg-surface-2 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-tertiary font-mono-stat">
                    <span>50% (Emotional Gambler)</span>
                    <span>75% (Breakeven)</span>
                    <span>98% (Institutional Pro)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Behavioral Diagnosis */}
              <div className="p-5 rounded-2xl bg-surface-0 border border-border space-y-3">
                <span className="text-[11px] font-mono-stat text-tertiary uppercase font-bold block">
                  Simulated Trader Behavior
                </span>

                {disciplineScore < 65 ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-danger font-bold flex items-center gap-1.5">
                      <AlertCircle size={15} /> Severe Psychological Tilt Detected
                    </p>
                    <p className="text-secondary leading-relaxed">
                      Frequent 2x-3x position sizing spikes after losses, stop losses moved outward in hope mode, and erratic trading during high-impact news spikes.
                    </p>
                  </div>
                ) : disciplineScore < 80 ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-gold font-bold flex items-center gap-1.5">
                      <AlertCircle size={15} /> Inconsistent Rule Enforcement
                    </p>
                    <p className="text-secondary leading-relaxed">
                      Good trading for 3 weeks followed by a single "Red Friday" where 80% of monthly profits are wiped out in an emotional revenge session.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <p className="text-success font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> RiskRule Algorithmic Protection Active
                    </p>
                    <p className="text-secondary leading-relaxed">
                      Strict 1% max risk per trade, automated 24H daily drawdown lockout, AI behavioral intervention on sizing spikes, and clean positive expectancy.
                    </p>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className={cn(
                "p-3.5 rounded-xl border text-xs font-mono-stat font-extrabold flex items-center justify-between",
                propStatus.color
              )}>
                <span>PROP EVALUATION STATUS:</span>
                <span>{propStatus.text}</span>
              </div>

            </div>

            {/* Right Output HUD */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-surface-0 border border-border space-y-6 shadow-card">
              
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="text-xs font-mono-stat text-tertiary uppercase block font-bold">Simulated 90-Day P&L</span>
                  <p className={cn(
                    "text-3xl sm:text-4xl font-mono-stat font-extrabold tracking-tight mt-1",
                    calculatedPnL >= 0 ? "text-success" : "text-danger"
                  )}>
                    {calculatedPnL >= 0 ? `+$${calculatedPnL.toLocaleString()}` : `-$${Math.abs(calculatedPnL).toLocaleString()}`}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono-stat text-tertiary uppercase block font-bold">Expectancy (Avg R:R)</span>
                  <p className="text-xl font-mono-stat font-bold text-iris mt-1">{avgRR}R multiple</p>
                </div>
              </div>

              {/* Dynamic SVG Visual Chart */}
              <div className="w-full h-44 sm:h-52 bg-surface-1/50 rounded-2xl border border-border p-3 relative flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono-stat text-tertiary">
                  <span>SIMULATED EQUITY TRAJECTORY</span>
                  <span className={cn("font-bold", currentPath.stroke)}>
                    {disciplineScore >= 75 ? "● POSITIVE COMPOUNDING" : "● CAPITAL DECAY"}
                  </span>
                </div>

                <div className="w-full h-32 relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="simGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={currentPath.color} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={currentPath.color} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={currentPath.area}
                      fill="url(#simGradient)"
                      className="transition-all duration-300 ease-out"
                    />
                    <path
                      d={currentPath.d}
                      fill="none"
                      stroke={currentPath.color}
                      strokeWidth="3"
                      className="transition-all duration-300 ease-out"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] text-tertiary font-mono-stat">
                  <span>Day 1</span>
                  <span>Day 30</span>
                  <span>Day 60</span>
                  <span>Day 90</span>
                </div>
              </div>

              {/* 3 Metric Chips */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono-stat">
                <div className="p-3 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[10px] text-tertiary uppercase block">Win Rate</span>
                  <span className="text-base font-bold text-primary mt-0.5 block">{winRate}%</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[10px] text-tertiary uppercase block">Tilt Losses Blocked</span>
                  <span className="text-base font-bold text-iris mt-0.5 block">{revengeLossesBlocked} Trades</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[10px] text-tertiary uppercase block">Drawdown Protected</span>
                  <span className="text-base font-bold text-success mt-0.5 block">+${capitalSaved.toLocaleString()}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-secondary font-medium">
              <Zap size={15} className="text-iris shrink-0" />
              <span>RiskRule enforces this level of discipline automatically via sub-second broker APIs.</span>
            </div>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-canvas font-display font-bold text-xs shadow-sm hover:opacity-95 transition-all shrink-0"
            >
              <span>Automate Your Discipline Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </Reveal>

    </section>
  );
}
