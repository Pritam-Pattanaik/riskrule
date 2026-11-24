import React from 'react';
import { Section, card } from './MarketingBits';
import { cn } from '../../lib/cn';

/** Three steps in a fixed order, so the numbers are real. */
const steps = [
  {
    title: 'Import your trades',
    body: 'Link Dhan, Angel One or Delta Exchange, or add trades by hand. Charges and net P&L are worked out for you.',
    chip: (
      <ul className="flex flex-wrap gap-2 text-[12.5px] font-medium text-primary">
        {['Dhan', 'Angel One', 'Delta Exchange'].map(b => (
          <li key={b} className="rounded-md border border-primary/10 bg-surface-1 px-2 py-1">{b}</li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Set your limits',
    body: 'Write down the rules you already trade by: a daily loss, trades per day, your trading hours and the instruments you allow.',
    chip: (
      <ul className="flex flex-wrap gap-2 font-mono-stat text-[12px] text-primary">
        {['Daily loss ₹2,000', '5 trades', '09:15–11:30'].map(r => (
          <li key={r} className="rounded-md border border-primary/10 bg-surface-1 px-2 py-1">{r}</li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Review each session',
    body: 'See where a limit was crossed, which trades came after it, and what Lunar AI would change before tomorrow.',
    chip: (
      <p className="flex items-center gap-2 text-[13px] text-danger">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-red)]" aria-hidden="true" />
        <span>2 trades after the limit</span>
      </p>
    ),
  },
];

export default function TraderJourneySection() {
  return (
    <Section id="how-it-works" title="From raw fills to a session you can learn from" lead="Three steps, and the first takes a few minutes.">
      <ol className="grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className={cn(card, 'relative flex flex-col gap-5 p-7')}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-mono-stat text-[14px] font-medium text-inverse">
              {i + 1}
            </span>
            <div>
              <h3 className="font-display text-[22px] font-semibold leading-tight tracking-tight text-primary">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-secondary">{s.body}</p>
            </div>
            <div className="mt-auto border-t border-primary/10 pt-4">{s.chip}</div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
