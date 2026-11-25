import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Section, card, btnPrimary } from './MarketingBits';
import { cn } from '../../lib/cn';

interface LeakItem {
  id: string;
  problem: string;
  annualLeakCost: number;
  bias: string;
  solution: string;
}

const leaks: LeakItem[] = [
  {
    id: 'revenge-sizing',
    problem: 'I increase my size after a loss to win the money back.',
    annualLeakCost: 8400,
    bias: 'Revenge sizing',
    solution: 'Compare your size before and after losses in your trade history.',
  },
  {
    id: 'stop-moving',
    problem: 'I widen or cancel my stop when price moves against me.',
    annualLeakCost: 6200,
    bias: 'Moving stops',
    solution: 'Use trade notes to record when you moved a stop and how the trade ended.',
  },
  {
    id: 'news-chasing',
    problem: 'I jump into fast one-minute candles during CPI, FOMC or NFP.',
    annualLeakCost: 4800,
    bias: 'Chasing news',
    solution: 'Check the economic calendar and review the trades you made around those releases.',
  },
  {
    id: 'spreadsheet-fatigue',
    problem: 'I give up on my spreadsheet journal because logging takes too long.',
    annualLeakCost: 3500,
    bias: 'No journal',
    solution: 'Import trades from a supported broker to spend less time on manual entry.',
  },
  {
    id: 'fatigue-trading',
    problem: 'I overtrade late at night or in quiet sessions out of boredom.',
    annualLeakCost: 5100,
    bias: 'Overtrading',
    solution: 'Set your trading hours and review which trades fell outside them.',
  },
];

export default function EdgeLeakCheckerSection() {
  const [selected, setSelected] = useState<string[]>(['revenge-sizing', 'stop-moving', 'spreadsheet-fatigue']);

  const toggle = (id: string) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const active = leaks.filter(l => selected.includes(l.id));
  const total = active.reduce((sum, l) => sum + l.annualLeakCost, 0);

  return (
    <Section
      title="Where does the money leak?"
      lead="Tick the habits that sound familiar. The estimates are illustrative, not measured, but they show which fixes matter most."
    >
      <div className="grid items-start gap-6 lg:grid-cols-12">

        <ul className={cn(card, 'divide-y divide-primary/10 overflow-hidden lg:col-span-7')}>
          {leaks.map(leak => {
            const on = selected.includes(leak.id);
            return (
              <li key={leak.id}>
                <button
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => toggle(leak.id)}
                  className="flex w-full items-start gap-4 p-5 text-left transition-colors duration-150 hover:bg-surface-1"
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150',
                      on ? 'border-accent bg-accent text-inverse' : 'border-primary/25 text-transparent'
                    )}
                  >
                    <Check size={14} strokeWidth={2} />
                  </span>
                  <span className="flex-1">
                    <span className={cn('block text-[15px] leading-6', on ? 'text-primary' : 'text-secondary')}>
                      {leak.problem}
                    </span>
                    <span className="mt-1.5 flex flex-wrap gap-x-3 text-[13px] text-tertiary">
                      <span>{leak.bias}</span>
                      <span className="font-mono-stat">about ₹{leak.annualLeakCost.toLocaleString('en-IN')} a year</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside className={cn(card, 'p-6 sm:p-8 lg:sticky lg:top-24 lg:col-span-5')} aria-live="polite">
          <p className="text-[13px] text-tertiary">Estimated leak per year</p>
          <p className="mt-2 font-mono-stat text-[32px] font-medium leading-none text-danger">
            ₹{total.toLocaleString('en-IN')}
          </p>

          <div className="mt-6 border-t border-primary/10 pt-5">
            <p className="text-[13px] text-tertiary">What RiskRule does about it</p>
            {active.length === 0 ? (
              <p className="mt-3 text-[15px] leading-6 text-secondary">Tick a habit to see the matching rule.</p>
            ) : (
              <ul className="mt-3 divide-y divide-primary/10">
                {active.map(l => (
                  <li key={l.id} className="py-3 first:pt-0">
                    <p className="text-[15px] text-primary">{l.bias}</p>
                    <p className="mt-1 text-[13px] leading-5 text-secondary">{l.solution}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 border-t border-primary/10 pt-6">
            <Link to="/signup" className={cn(btnPrimary, 'w-full')}>
              Start free
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </aside>
      </div>
    </Section>
  );
}
