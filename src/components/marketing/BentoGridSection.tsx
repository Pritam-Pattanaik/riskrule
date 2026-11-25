import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section, card, textLink, SampleTag } from './MarketingBits';
import { cn } from '../../lib/cn';
import dhan from '../../assets/brokers/dhan.svg';
import angelone from '../../assets/brokers/angelone.svg';
import delta from '../../assets/brokers/delta_exchange_mark.svg';

const hours = [
  { h: '09', v: -0.9 }, { h: '10', v: 1.2 }, { h: '11', v: 1.9 }, { h: '12', v: 0.4 },
  { h: '13', v: 1.4 }, { h: '14', v: -0.3 }, { h: '15', v: 0.9 },
];

const wave = [14, 26, 18, 34, 22, 40, 28, 16, 36, 24, 12, 30, 20, 38, 16, 26, 14, 22];

/** Four features on a 12-column grid, each showing the state it produces. */
export default function BentoGridSection() {
  return (
    <Section
      id="features"
      title="See how your rules hold up"
      lead="Compare each trading session with your risk limits and use the journal to review what happened."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">

        <article className={cn(card, 'hover-lift flex flex-col justify-between gap-8 p-7 md:col-span-7')}>
          <div>
            <h3 className="font-display text-[24px] font-semibold leading-tight tracking-tight text-primary">Daily loss tracking</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-6 text-secondary">
              Set a daily loss limit. Your trade review shows where losses crossed the limit and flags trades taken afterward.
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-baseline justify-between text-[13px]">
              <span className="text-secondary">Limit used</span>
              <span className="font-mono-stat text-danger">₹2,100 of ₹2,000</span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-[#22C55E] via-[#F59E0B] to-[var(--brand-red)]" />
              <div className="absolute inset-y-0 right-[4.5%] w-0.5 bg-primary" aria-hidden="true" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-primary/10 pt-4 text-[13px]">
              <span className="flex items-center gap-2 text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-red)]" aria-hidden="true" />
                Daily loss limit reached
              </span>
              <SampleTag>Example</SampleTag>
            </div>
          </div>
        </article>

        <article className="ink hover-lift flex flex-col justify-between gap-8 rounded-2xl border border-white/10 p-7 shadow-card md:col-span-5">
          <div>
            <h3 className="font-display text-[24px] font-semibold leading-tight tracking-tight text-white">Voice guidance</h3>
            <p className="mt-3 text-[15px] leading-6 text-slate-300">
              Listen to Lunar AI’s trade reviews and suggested next steps while you go through your journal.
            </p>
          </div>
          <div>
            <div className="flex h-12 items-center gap-[3px]" aria-hidden="true">
              {wave.map((h, i) => (
                <span key={i} className="w-1 rounded-full bg-[var(--brand-green)]" style={{ height: h, opacity: 0.35 + (i % 5) * 0.13 }} />
              ))}
            </div>
            <p className="mt-4 border-t ink-line pt-4 text-[15px] leading-6 text-slate-100">
              “Both losses came after you increased your usual position size.”
            </p>
          </div>
        </article>

        <article className={cn(card, 'hover-lift flex flex-col justify-between gap-8 p-7 md:col-span-5')}>
          <div>
            <h3 className="font-display text-[24px] font-semibold leading-tight tracking-tight text-primary">Broker trade imports</h3>
            <p className="mt-3 text-[15px] leading-6 text-secondary">
              Bring trade history into your journal from Dhan, Angel One, or Delta Exchange. You can also enter trades manually.
            </p>
          </div>
          <ul className="flex items-center gap-3 border-t border-primary/10 pt-4">
            {[['Dhan', dhan], ['Angel One', angelone], ['Delta Exchange', delta]].map(([name, logo]) => (
              <li key={name} className="flex items-center gap-2 rounded-lg border border-primary/10 bg-surface-1 py-1.5 pl-1.5 pr-3 text-[13px] font-medium text-primary">
                <img src={logo} alt="" className="h-6 w-6 rounded object-contain" loading="lazy" />
                {name}
              </li>
            ))}
          </ul>
        </article>

        <article className={cn(card, 'hover-lift flex flex-col justify-between gap-8 p-7 md:col-span-7')}>
          <div>
            <h3 className="font-display text-[24px] font-semibold leading-tight tracking-tight text-primary">Expectancy by setup and hour</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-6 text-secondary">
              Win rate hides more than it shows. RiskRule works out which setups and which times of day earn money and which
              ones quietly drain the account.
            </p>
          </div>
          <div className="border-t border-primary/10 pt-4">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[13px] text-tertiary">Expectancy</p>
                <p className="mt-2 font-mono-stat text-[30px] font-medium leading-none text-success">+1.8R</p>
              </div>
              <div className="flex h-20 flex-1 items-center gap-2" role="img" aria-label="Expectancy by hour of day: negative at 09, positive from 10 to 13, slightly negative at 14">
                {hours.map(({ h, v }) => (
                  <div key={h} className="relative flex h-full flex-1 flex-col items-center justify-center">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-primary/10" aria-hidden="true" />
                    <span
                      className={cn('absolute w-full rounded-[3px]', v >= 0 ? 'bg-[var(--brand-green)]' : 'bg-[var(--brand-red)]')}
                      style={v >= 0 ? { bottom: '50%', height: `${v * 20}%` } : { top: '50%', height: `${-v * 20}%` }}
                    />
                    <span className="absolute -bottom-5 font-mono-stat text-[10px] text-tertiary">{h}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4 text-[13px]">
              <p className="text-secondary">Skipping the 09:30 open lifts win rate by 14 points</p>
              <SampleTag>Example figures</SampleTag>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-8">
        <Link to="/features" className={textLink}>
          See every feature
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </Section>
  );
}
