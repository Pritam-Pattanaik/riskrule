import React from 'react';
import { container, card } from './MarketingBits';
import { cn } from '../../lib/cn';

const events = [
  { time: '08:30', zone: 'EST', event: 'US Consumer Price Index (CPI)', impact: 'High', dot: 'bg-danger',
    note: 'Fills can slip badly in the first minutes after the release.' },
  { time: '10:00', zone: 'EST', event: 'US Consumer Sentiment Index', impact: 'Moderate', dot: 'bg-tertiary',
    note: 'Liquidity can thin out around the New York morning midpoint.' },
  { time: '14:00', zone: 'EST', event: 'FOMC rate decision and press conference', impact: 'Critical', dot: 'bg-danger',
    note: 'The release and press conference can both move markets.' },
];

export default function MarketNewsSection() {
  return (
    <section className="scroll-mt-16 border-t border-primary/10 py-16 sm:py-24" aria-label="Market news">
      <div className={cn(container, 'grid items-center gap-12 lg:grid-cols-12 lg:gap-16')}>

        <div className="lg:col-span-5">
          <h2 className="font-serif text-[36px] leading-[1.1] text-primary sm:text-[44px]">
            Keep track of market-moving events
          </h2>
          <p className="mt-4 text-[17px] leading-7 text-secondary">
            Check market news and scheduled releases from the same workspace where you review your trades.
          </p>
          <div className="mt-8 border-t border-primary/10 pt-6">
            <h3 className="text-[17px] font-medium text-primary">Economic calendar</h3>
            <p className="mt-2 text-[15px] leading-6 text-secondary">
              See scheduled events such as FOMC decisions, CPI releases, and nonfarm payrolls.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className={cn(card, 'p-6 sm:p-7')}>
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <p className="text-sm font-medium text-primary">Economic calendar</p>
              <p className="text-[13px] text-tertiary">Sample events</p>
            </div>
            <ul className="divide-y divide-primary/10">
              {events.map(e => (
                <li key={e.event} className="grid grid-cols-[4.5rem_1fr] gap-4 py-5 last:pb-0">
                  <p className="font-mono-stat text-[13px] leading-6 text-tertiary">
                    {e.time} <span className="text-[11px]">{e.zone}</span>
                  </p>
                  <div>
                    <p className="flex flex-wrap items-center justify-between gap-x-4">
                      <span className="text-[15px] text-primary">{e.event}</span>
                      <span className="flex items-center gap-2 text-[13px] text-secondary">
                        <span className={cn('h-1.5 w-1.5 rounded-full', e.dot)} aria-hidden="true" />
                        {e.impact}
                      </span>
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-secondary">{e.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
