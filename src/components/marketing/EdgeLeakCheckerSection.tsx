import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, CheckSquare, Square, Shield, Zap, 
  ArrowRight, CheckCircle2, DollarSign, Brain, Lock
} from 'lucide-react';
import { Reveal, HoverLift } from '../ui/Motion';
import { cn } from '../../lib/cn';

interface LeakItem {
  id: string;
  problem: string;
  annualLeakCost: number;
  bias: string;
  solution: string;
  iconName: string;
}

export default function EdgeLeakCheckerSection() {
  const leaks: LeakItem[] = [
    {
      id: 'revenge-sizing',
      problem: 'I increase contract sizing after a loss to quickly win back my capital.',
      annualLeakCost: 8400,
      bias: 'Revenge Tilt & Loss Escalation',
      solution: 'Automatic sizing caps + mandatory 15-min cooling off period following any loss.',
      iconName: 'Lock'
    },
    {
      id: 'stop-moving',
      problem: 'I widen or cancel my stop loss when price moves against me in hope mode.',
      annualLeakCost: 6200,
      bias: 'Loss Aversion & Hope Mode',
      solution: 'Hard stop-loss enforcement; stop widening requests are rejected by the API guardrail.',
      iconName: 'Shield'
    },
    {
      id: 'news-chasing',
      problem: 'I jump into volatile 1-minute candles during CPI, FOMC, or NFP releases.',
      annualLeakCost: 4800,
      bias: 'FOMO & Adverse Slippage Risk',
      solution: 'Automated 5-minute pre/post macroeconomic news lockout freezing new order entries.',
      iconName: 'Zap'
    },
    {
      id: 'spreadsheet-fatigue',
      problem: 'I abandon manual spreadsheet journals because logging trades takes too much time.',
      annualLeakCost: 3500,
      bias: 'Data Blindness & Loss of Edge',
      solution: 'Sub-second automatic broker sync (MT4/5, Tradovate, IBKR, Apex) with zero manual entry.',
      iconName: 'Brain'
    },
    {
      id: 'fatigue-trading',
      problem: 'I overtrade late at night or during quiet sessions out of boredom or fatigue.',
      annualLeakCost: 5100,
      bias: 'Circadian Fatigue & Discipline Drift',
      solution: 'Designated trading window locks that automatically block off-hours order routing.',
      iconName: 'Lock'
    },
  ];

  // Selected leaks state (default with first 2 checked)
  const [selectedLeaks, setSelectedLeaks] = useState<string[]>(['revenge-sizing', 'stop-moving', 'spreadsheet-fatigue']);

  const toggleLeak = (id: string) => {
    setSelectedLeaks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculate total leaked capital
  const totalLeakedCapital = leaks
    .filter(l => selectedLeaks.includes(l.id))
    .reduce((sum, l) => sum + l.annualLeakCost, 0);

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-20 relative z-20">
      
      {/* Chapter Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Reveal direction="up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-1 border border-danger/30 text-xs font-semibold text-danger mb-3 shadow-xs">
            <AlertTriangle size={14} className="text-danger" />
            <span>Interactive Trader Self-Assessment</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            Where are you leaking capital right now?
          </h2>
          <p className="text-base sm:text-lg text-secondary leading-relaxed">
            Select the psychological and execution mistakes you experience. See how much capital you leak annually and how RiskRules fixes them programmatically.
          </p>
        </Reveal>
      </div>

      {/* Interactive Assessment Container */}
      <Reveal direction="up" delay={0.1}>
        <div className="rounded-3xl bg-surface-1 border border-border p-6 sm:p-10 shadow-floating relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Checkbox List */}
            <div className="lg:col-span-7 space-y-3">
              <span className="font-display font-bold text-base text-primary block border-b border-border/80 pb-3">
                Select Your Trading Habits &amp; Vulnerabilities
              </span>

              {leaks.map((leak) => {
                const isSelected = selectedLeaks.includes(leak.id);
                return (
                  <button
                    key={leak.id}
                    onClick={() => toggleLeak(leak.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 outline-none focus-ring",
                      isSelected
                        ? "bg-surface-2 border-iris/40 shadow-sm"
                        : "bg-surface-0 border-border hover:bg-surface-1"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <CheckSquare size={20} className="text-iris" />
                      ) : (
                        <Square size={20} className="text-tertiary" />
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <p className={cn(
                        "text-xs sm:text-sm font-semibold leading-relaxed",
                        isSelected ? "text-primary" : "text-secondary"
                      )}>
                        "{leak.problem}"
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-stat">
                        <span className="text-danger font-bold">
                          Avg Loss: ~${leak.annualLeakCost.toLocaleString()}/yr
                        </span>
                        <span className="text-tertiary">|</span>
                        <span className="text-iris font-medium">
                          {leak.bias}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Diagnostic Output HUD */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-surface-0 border border-iris/30 space-y-6 shadow-card sticky top-24">
              
              <div className="border-b border-border/80 pb-4">
                <span className="text-xs font-mono-stat text-tertiary uppercase font-bold block">
                  Estimated Annual Capital Leaked
                </span>
                <p className="text-3xl sm:text-4xl font-mono-stat font-extrabold text-danger mt-1 tracking-tight">
                  ${totalLeakedCapital.toLocaleString()} / year
                </p>
                <p className="text-xs text-secondary mt-1">
                  Based on empirical retail trader performance metrics.
                </p>
              </div>

              {/* Selected Solutions Summary */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono-stat text-tertiary uppercase font-bold block">
                  The RiskRules Automated Fixes:
                </span>

                {selectedLeaks.length === 0 ? (
                  <p className="text-xs text-secondary italic">
                    Select one or more habits on the left to see the programmatic solutions.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {leaks
                      .filter(l => selectedLeaks.includes(l.id))
                      .map(leak => (
                        <div key={leak.id} className="p-3 rounded-xl bg-surface-1 border border-border text-xs space-y-1">
                          <span className="font-bold text-success flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="shrink-0" />
                            {leak.bias}
                          </span>
                          <p className="text-secondary leading-relaxed">
                            {leak.solution}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border">
                <Link
                  to="/signup"
                  className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-canvas font-display font-bold text-xs shadow-md hover:opacity-95 transition-all"
                >
                  <span>Plug Your Leaks With RiskRules</span>
                  <ArrowRight size={14} />
                </Link>
                <p className="text-[11px] text-tertiary text-center mt-2">
                  14-day free trial · Instant read-only setup
                </p>
              </div>

            </div>

          </div>

        </div>
      </Reveal>

    </section>
  );
}
