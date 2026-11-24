import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section, card, btnPrimary, SampleTag } from './MarketingBits';
import { cn } from '../../lib/cn';

const PRO_YEARLY_MONTH = 1199;
const WEEKS_PER_MONTH = 4.3;
const inr = (n: number) => `₹${(Math.round(n / 100) * 100).toLocaleString('en-IN')}`;

/** A multiplication the trader controls. Both inputs are theirs, and the page says so. */
export default function LeakCalculatorSection() {
  const [trades, setTrades] = useState(3);
  const [loss, setLoss] = useState(1500);

  const month = trades * WEEKS_PER_MONTH * loss;
  const year = month * 12;
  const multiple = month / PRO_YEARLY_MONTH;

  return (
    <Section
      id="leak"
      title="What are your rule-breaking trades costing you?"
      lead="Think of the trades you took and knew you should not have. Put in how many a week and what each one cost on average."
    >
      <div className={cn(card, 'grid gap-8 p-6 shadow-raised sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12')}>
        <div className="flex flex-col justify-center gap-8">
          <div>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <label htmlFor="leak-trades" className="text-[15px] font-semibold text-primary">Rule-breaking trades a week</label>
              <span className="font-mono-stat text-[26px] font-medium leading-none text-primary">{trades}</span>
            </div>
            <input
              id="leak-trades" type="range" min="1" max="25" step="1" value={trades}
              onChange={e => setTrades(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-[#22C55E]"
            />
            <div className="mt-2 flex justify-between font-mono-stat text-[11px] text-tertiary"><span>1</span><span>25</span></div>
          </div>

          <div>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <label htmlFor="leak-loss" className="text-[15px] font-semibold text-primary">Average loss on each one</label>
              <span className="font-mono-stat text-[26px] font-medium leading-none text-primary">₹{loss.toLocaleString('en-IN')}</span>
            </div>
            <input
              id="leak-loss" type="range" min="500" max="15000" step="500" value={loss}
              onChange={e => setLoss(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-[#22C55E]"
            />
            <div className="mt-2 flex justify-between font-mono-stat text-[11px] text-tertiary"><span>₹500</span><span>₹15,000</span></div>
          </div>
        </div>

        <div className="ink flex flex-col justify-between gap-7 rounded-2xl p-6 sm:p-8" aria-live="polite">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-slate-400">Leaking every month</p>
              <SampleTag onInk>From your inputs</SampleTag>
            </div>
            <p className="mt-2 font-mono-stat text-[44px] font-medium leading-none tracking-tight text-[#F87171] sm:text-[56px]">
              −{inr(month)}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-6 border-t ink-line pt-6">
            <div>
              <dt className="text-[13px] text-slate-400">In a year</dt>
              <dd className="mt-1 font-mono-stat text-[20px] text-white">−{inr(year)}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-slate-400">A month of PRO costs</dt>
              <dd className="mt-1 font-mono-stat text-[20px] text-[#4ADE80]">₹1,199</dd>
            </div>
          </dl>

          <p className="text-[15px] leading-6 text-slate-200">
            That is about <span className="font-semibold text-white">{multiple >= 10 ? Math.round(multiple) : multiple.toFixed(1)}×</span> the monthly price of PRO on a yearly plan.
            Skipping a fraction of those trades pays for it.
          </p>

          <div>
            <Link to="/signup" className={cn(btnPrimary, 'w-full sm:w-auto')}>
              Find your real number
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <p className="mt-3 text-[12.5px] leading-5 text-slate-400">
              This only multiplies what you entered. Import your trades and RiskRule finds the actual ones.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
