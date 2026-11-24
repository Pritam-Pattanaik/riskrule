import React from 'react';
import { container } from './MarketingBits';
import { cn } from '../../lib/cn';
import dhan from '../../assets/brokers/dhan.svg';
import angelone from '../../assets/brokers/angelone.svg';
import delta from '../../assets/brokers/delta_exchange_mark.svg';

const brokers = [
  { name: 'Dhan', logo: dhan },
  { name: 'Angel One', logo: angelone },
  { name: 'Delta Exchange', logo: delta },
];

/** Supported brokers. Only brokers with a working import are listed. */
export default function TrustTicker() {
  return (
    <section className="border-y border-primary/10 bg-surface" aria-label="Supported broker integrations">
      <div className={cn(container, 'flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10')}>
        <p className="shrink-0 text-[14px] font-medium text-secondary">Imports your trades from</p>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {brokers.map(b => (
            <li key={b.name} className="flex items-center gap-2.5">
              <img src={b.logo} alt="" className="h-7 w-auto max-w-[44px] rounded-md object-contain" loading="lazy" />
              <span className="text-[15px] font-semibold text-primary">{b.name}</span>
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-tertiary sm:text-right">or add trades by hand</p>
      </div>
    </section>
  );
}
