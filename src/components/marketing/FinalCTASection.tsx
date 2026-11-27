import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { btnPrimary, btnOnInk } from './MarketingBits';
import { TypedHeading } from './Perspective';
import { Reveal } from './Typewriter';
import { cn } from '../../lib/cn';

export default function FinalCTASection() {
  return (
    <section className="px-5 pb-16 sm:px-8 sm:pb-24" aria-label="Get started">
      <div className="ink relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl px-6 py-16 text-center shadow-raised sm:px-14 sm:py-24">
        <div className="floor-grid floor-grid-ink pointer-events-none" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[var(--brand-green)]/20 blur-[100px]" aria-hidden="true" />

        <div className="relative">
          <TypedHeading
            cps={34}
            start="top 80%"
            className="mx-auto max-w-4xl font-display text-[clamp(34px,6vw,68px)] font-bold leading-[1.04] tracking-[-0.03em] text-white"
            style={{ textWrap: 'balance' }}
          >
            Master your discipline before the next bad habit hits.
          </TypedHeading>
          <Reveal as="p" delay={1.2} start="top 80%" className="mx-auto mt-7 max-w-xl text-[18px] leading-[1.6] text-slate-300">
            Connect your broker or enter trades manually. Track your behavior live and get coached in real time.
          </Reveal>
          <Reveal delay={1.4} start="top 85%" className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className={cn(btnPrimary, 'h-12 px-6 text-base')}>
              Start free
              <ArrowRight size={17} strokeWidth={2} />
            </Link>
            <Link to="/pricing" className={cn(btnOnInk, 'h-12 px-6 text-base')}>See pricing</Link>
          </Reveal>
          <p className="mt-4 text-[13px] text-slate-400">Free plan, no credit card</p>
        </div>
      </div>
    </section>
  );
}
