import React from 'react';
import { X } from 'lucide-react';
import { container } from './MarketingBits';
import { UnfoldHeading } from './Perspective';
import { Reveal, revealText, useTypewriter } from './Typewriter';
import { cn } from '../../lib/cn';

/** Each row is something a session review looks for, and the part of RiskRule that looks for it. */
const rows = [
  { text: 'Traded past the daily limit', by: 'Daily loss limit' },
  { text: 'Sized up after a loss', by: 'Position size against your average' },
  { text: 'Re-entered seconds after a stop-out', by: 'Time between trades' },
  { text: 'Took one trade too many', by: 'Trades per day rule' },
  { text: 'Traded in your worst hour', by: 'Expectancy by hour' },
  { text: 'Broke your own plan', by: 'Discipline score' },
];

// Where each row starts in the single stream of typed characters.
const starts = rows.map((_, i) => rows.slice(0, i).reduce((n, r) => n + r.text.length, 0));
const TOTAL = rows.reduce((n, r) => n + r.text.length, 0);

/**
 * Six behaviours in one clean list. The rows type out one after another when the list scrolls
 * into view, and the row being typed is lit.
 */
export default function BehavioursFloorSection() {
  const { ref, shown, armed } = useTypewriter({ total: TOTAL, cps: 48, start: 'top 75%' });

  return (
    <section className="ink relative overflow-hidden py-20 sm:py-28" aria-labelledby="behaviours-title">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[var(--brand-red)]/15 blur-[120px]" aria-hidden="true" />

      <div className={cn(container, 'relative grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16')}>
        <div>
          <UnfoldHeading className="font-display text-[34px] font-bold leading-[1.06] tracking-[-0.035em] text-white sm:text-[46px]" style={{ textWrap: 'balance' }}>
            <span id="behaviours-title">Six ways traders break their own rules.</span>
          </UnfoldHeading>
          <Reveal as="p" delay={0.4} className="mt-5 max-w-md text-[17px] leading-7 text-slate-300">
            Each one leaves a mark in your trade history. RiskRule looks for all six, in every session you import.
          </Reveal>
        </div>

        <ol
          ref={ref}
          data-tw={armed ? 'on' : 'pending'}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]"
        >
          {rows.map((r, i) => {
            const live = armed && shown > starts[i] && shown < starts[i] + r.text.length;
            return (
              <li
                key={r.text}
                className={cn(
                  'flex items-start gap-4 px-5 py-4 transition-colors duration-200 sm:gap-5 sm:px-7 sm:py-5',
                  i > 0 && 'border-t border-white/10',
                  live ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]',
                )}
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--brand-red)]/15 text-[#F87171]" aria-hidden="true">
                  <X size={16} strokeWidth={2.4} />
                </span>
                <div className="min-w-0">
                  <p className="font-sans text-[19px] font-semibold leading-snug tracking-[-0.01em] text-white sm:text-[22px]">
                    {revealText(r.text, shown - starts[i], live)}
                  </p>
                  <p className="mt-1 text-[13.5px] text-slate-400">Found by {r.by}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
