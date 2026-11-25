import React from 'react';
import { container } from './MarketingBits';
import { cn } from '../../lib/cn';
import { ScrollPlane } from './Perspective';
import { CountUp } from './Typewriter';

/**
 * The one public statistic on the page, with its source.
 * SEBI, study of individual equity F&O traders for FY25 (published July 2025):
 * about 91% made a net loss, aggregate net loss over ₹1 lakh crore, average about ₹1.1 lakh.
 */
export default function RealityStatSection() {
  return (
    <section className="border-b border-primary/10 bg-surface-1/60 py-16 sm:py-24" aria-labelledby="reality-title">
      <div className={cn(container, 'grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-20')}>
        <ScrollPlane from={{ rotateY: -42, x: -50, scale: 0.9 }} start="top 98%" end="center 55%" origin="0% 50%" perspective={900}>
          <p
            className="font-display text-[120px] font-bold leading-[0.85] tracking-[-0.06em] text-primary sm:text-[168px] lg:text-[200px]"
            aria-hidden="true"
          >
            <CountUp to={91} />
            <span className="text-[var(--brand-red)]">%</span>
          </p>
        </ScrollPlane>

        <div className="max-w-xl">
          <h2 id="reality-title" className="font-display text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-primary sm:text-[36px]" style={{ textWrap: 'balance' }}>
            <span className="sr-only">91% </span>
            of individual F&amp;O traders in India lost money in FY25.
          </h2>
          <dl className="mt-7 grid grid-cols-2 gap-6 border-y border-primary/10 py-6">
            <div>
              <dt className="text-[13px] text-tertiary">Net losses, all traders</dt>
              <dd className="mt-1 font-display text-[20px] font-semibold leading-tight tracking-tight text-danger sm:text-[24px]">over ₹1 lakh crore</dd>
            </div>
            <div>
              <dt className="text-[13px] text-tertiary">Average per trader</dt>
              <dd className="mt-1 font-display text-[20px] font-semibold leading-tight tracking-tight text-danger sm:text-[24px]">about ₹1.1 lakh</dd>
            </div>
          </dl>
          <p className="mt-6 text-[17px] leading-7 text-secondary">
            Most traders can read a chart. RiskRule is built around what is left: trading past a limit, sizing up after a loss and
            trading too often. It shows you which of those is yours.
          </p>
          <p className="mt-4 text-[12.5px] leading-5 text-tertiary">
            Source: SEBI study of individual equity F&amp;O traders, FY25, published July 2025. Net of transaction costs.
          </p>
        </div>
      </div>
    </section>
  );
}
