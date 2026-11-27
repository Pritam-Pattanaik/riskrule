import React from 'react';
import { Section, card } from './MarketingBits';
import { cn } from '../../lib/cn';

/** Three steps in a fixed order, so the numbers are real. */
const steps = [
  {
    title: 'Connect Your Broker',
    body: 'Link Dhan, Angel One, or Delta Exchange—or enter trades manually. Charges and net P&L are calculated automatically.',
    chip: (
      <ul className="flex flex-wrap gap-2 text-[12.5px] font-medium text-primary">
        {['Dhan', 'Angel One', 'Delta Exchange'].map(b => (
          <li key={b} className="rounded-md border border-primary/10 bg-surface-1 px-2 py-1">{b}</li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Set Your Discipline Rules',
    body: 'Define your daily loss limit, max trades per day, ideal trading hours, and allowed instruments.',
    chip: (
      <ul className="flex flex-wrap gap-2 font-mono-stat text-[12px] text-primary">
        {['Daily loss ₹2,000', '5 trades', '09:15–11:30'].map(r => (
          <li key={r} className="rounded-md border border-primary/10 bg-surface-1 px-2 py-1">{r}</li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Get Coached in Real Time',
    body: 'As you trade, RiskRule tracks your behavior, alerts you the moment emotions take over, and reviews every session with you.',
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
    <Section id="how-it-works" title="How It Works" lead="Three steps, and the first takes a few minutes.">
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
