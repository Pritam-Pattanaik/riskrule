import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { container, btnPrimary, SampleTag } from './MarketingBits';
import { cn } from '../../lib/cn';

const behaviours = [
  'Alerts you the moment your lot size jumps after a loss',
  'Flags entries during the tilt hours where your focus drops',
  'Prompts a pause before revenge trading sets in',
  'Gives you a daily Discipline Score against your own plan',
];

/** Full-width ink band so the coach reads as a different room from the journal. */
export default function AICoachSection() {
  return (
    <section id="ai-coach" className="ink relative scroll-mt-20 overflow-hidden py-16 sm:py-24" aria-label="AI coach">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[var(--brand-green)]/10 blur-[110px]" aria-hidden="true" />
      <div className={cn(container, 'relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16')}>

        <div className="lg:col-span-6">
          <h2 className="font-display text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-[42px]" style={{ textWrap: 'balance' }}>
            Get coached in real time by Lunar AI
          </h2>
          <p className="mt-4 text-[17px] leading-7 text-slate-300">
            Lunar AI watches your trading behavior live, alerts you when fear, greed, or tilt take over, and reviews every session with you.
          </p>

          <ul className="mt-8 flex flex-col gap-3.5">
            {behaviours.map(item => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-6 text-slate-200">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]/15 text-[#4ADE80]" aria-hidden="true">
                  <Check size={13} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Link to="/ai-coach" className={btnPrimary}>
              Try the AI coach
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] backdrop-blur sm:p-7">
            <div className="flex items-center justify-between border-b ink-line pb-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-green)]" aria-hidden="true" />
                Lunar AI
              </p>
              <SampleTag onInk>Sample trade review</SampleTag>
            </div>

            <ul className="divide-y divide-white/10">
              <li className="py-5">
                <p className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-white">Position size</span>
                  <span className="font-mono-stat text-slate-400">14:02</span>
                </p>
                <p className="mt-2 text-[15px] leading-6 text-slate-300">
                  An order for 10 lots is <span className="font-semibold text-[#F87171]">250% above</span> your 30-day average size.
                </p>
              </li>
              <li className="py-5 pb-0">
                <p className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 font-medium text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-green)]" aria-hidden="true" />
                    Pattern to review
                  </span>
                  <span className="font-mono-stat text-slate-400">14:02</span>
                </p>
                <p className="mt-2 text-[15px] leading-6 text-slate-300">
                  “Trades where you sized up after a stop-out won 14% of the time. Compare them with trades at your usual size.”
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
