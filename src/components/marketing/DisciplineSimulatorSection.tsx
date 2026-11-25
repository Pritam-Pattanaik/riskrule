import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section, card, btnPrimary } from './MarketingBits';
import { cn } from '../../lib/cn';

const fmtInr = (n: number) => `${n < 0 ? '−' : '+'}₹${Math.abs(n).toLocaleString('en-IN')}`;

export default function DisciplineSimulatorSection() {
  const [score, setScore] = useState<number>(85);

  const pnl = Math.round(((score - 60) / 38) * 78000);
  const winRate = (42 + (score / 98) * 32).toFixed(1);
  const avgRR = (1.1 + (score / 98) * 1.8).toFixed(1);
  const skipped = Math.round((score / 98) * 14);
  const saved = Math.round(((score - 50) / 48) * 48000);

  const status =
    score >= 80 ? 'Challenge passed'
    : score >= 65 ? 'Near breakeven, high variance'
    : 'Account blown, drawdown breach';

  const diagnosis =
    score < 65
      ? { title: 'Severe tilt', body: 'Size doubles or triples after losses, stops get moved out in hope, and trades pile up around news.' }
      : score < 80
      ? { title: 'Rules followed most days', body: 'Three good weeks, then one red Friday where an emotional revenge session wipes out most of the month.' }
      : { title: 'Rules followed consistently', body: 'The example trader risks at most 1% per trade and stops for the day at their loss limit.' };

  // Simulated equity curve: a fall, a drift, or a climb depending on the score
  const path =
    score < 60 ? 'M 0 30 Q 80 20 150 70 T 280 110 T 380 90 T 500 145'
    : score < 75 ? 'M 0 90 Q 70 60 140 100 T 260 70 T 380 95 T 500 75'
    : (() => {
        const c = Math.min(15, 60 - (score - 75) * 1.8);
        return `M 0 130 Q 100 ${c + 70} 180 ${c + 40} T 320 ${c + 20} T 430 ${c + 5} T 500 10`;
      })();

  return (
    <Section
      id="discipline-simulator"
      title="See what following your rules does to the curve"
      lead="Drag the slider to change how closely you follow your rules. The numbers are a simulation, not a result."
    >
      <div className={cn(card, 'grid gap-0 overflow-hidden lg:grid-cols-12')}>

        {/* Controls */}
        <div className="border-b border-primary/10 p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="flex items-baseline justify-between">
            <label htmlFor="discipline-score" className="text-[13px] text-tertiary">Rules followed</label>
            <span className="font-mono-stat text-[28px] font-medium leading-none text-primary">{score}%</span>
          </div>
          <input
            id="discipline-score"
            type="range"
            min={50}
            max={98}
            step={1}
            value={score}
            onChange={e => setScore(Number(e.target.value))}
            className="mt-5 h-1.5 w-full cursor-pointer accent-accent"
          />
          <div className="mt-2 flex justify-between font-mono-stat text-xs text-tertiary">
            <span>50% impulsive</span>
            <span>75%</span>
            <span>98% rule-bound</span>
          </div>

          <div className="mt-8 border-t border-primary/10 pt-6">
            <p className="text-[13px] text-tertiary">What this trader does</p>
            <p className="mt-2 text-[17px] font-medium text-primary">{diagnosis.title}</p>
            <p className="mt-2 text-[15px] leading-6 text-secondary">{diagnosis.body}</p>
          </div>

          <p className="mt-6 flex items-center justify-between border-t border-primary/10 pt-4 text-[13px]">
            <span className="text-tertiary">Prop evaluation</span>
            <span className="text-primary">{status}</span>
          </p>
        </div>

        {/* Output */}
        <div className="p-6 sm:p-8 lg:col-span-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13px] text-tertiary">Simulated 90-day P&amp;L</p>
              <p className={cn('mt-2 font-mono-stat text-[32px] font-medium leading-none', pnl >= 0 ? 'text-success' : 'text-danger')}>
                {fmtInr(pnl)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-tertiary">Average R:R</p>
              <p className="mt-2 font-mono-stat text-[24px] font-medium leading-none text-primary">{avgRR}R</p>
            </div>
          </div>

          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="mt-6 h-40 w-full overflow-visible" role="img"
            aria-label="Simulated equity curve for the selected score">
            <line x1="0" x2="500" y1="75" y2="75" stroke="rgb(var(--color-text-primary) / 0.12)" />
            <path d={path} fill="none" stroke="rgb(var(--color-text-primary))" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
              className="transition-[d] duration-300" />
          </svg>
          <div className="mt-2 flex justify-between font-mono-stat text-xs text-tertiary">
            <span>Day 1</span><span>Day 30</span><span>Day 60</span><span>Day 90</span>
          </div>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-primary/10 border-t border-primary/10 pt-5">
            <div className="pr-4">
              <dt className="text-[13px] text-tertiary">Win rate</dt>
              <dd className="mt-2 font-mono-stat text-[17px] text-primary">{winRate}%</dd>
            </div>
            <div className="px-4">
              <dt className="text-[13px] text-tertiary">Impulsive trades skipped</dt>
              <dd className="mt-2 font-mono-stat text-[17px] text-primary">{skipped}</dd>
            </div>
            <div className="pl-4">
              <dt className="text-[13px] text-tertiary">Drawdown avoided</dt>
              <dd className="mt-2 font-mono-stat text-[17px] text-primary">₹{saved.toLocaleString('en-IN')}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/signup" className={btnPrimary}>
          Start free
          <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
      </div>
    </Section>
  );
}
