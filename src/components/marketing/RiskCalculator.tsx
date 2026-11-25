import React, { useState } from 'react';
import { Section, card, SampleTag } from './MarketingBits';
import { cn } from '../../lib/cn';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function Field({ id, label, suffix, children }: { id: string; label: string; suffix?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] font-semibold text-primary">{label}</label>
        {suffix && <span className="font-mono-stat text-[13px] text-secondary">{suffix}</span>}
      </div>
      {children}
    </div>
  );
}

const box =
  'h-11 w-full rounded-xl border border-primary/15 bg-surface px-4 font-mono-stat text-[15px] text-primary outline-none transition-[border-color,box-shadow] duration-150 hover:border-primary/30 focus:border-accent focus:shadow-[0_0_0_3px_rgb(var(--color-accent)/0.18)]';

/** Position-size calculator: the maths a trader does before every entry. */
export default function RiskCalculator() {
  const [capital, setCapital] = useState(200000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(125);
  const [stop, setStop] = useState(110);
  const [rr, setRr] = useState(2);

  const maxLoss = (capital * riskPct) / 100;
  const perUnit = Math.abs(entry - stop);
  const qty = perUnit > 0 ? Math.floor(maxLoss / perUnit) : 0;
  const outlay = qty * entry;
  const reward = qty * perUnit * rr;
  const breakeven = (1 / (1 + rr)) * 100;
  const valid = capital > 0 && entry > 0 && perUnit > 0;

  const num = (set: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => set(Number(e.target.value) || 0);

  return (
    <Section
      id="calculator"
      title="Size the trade before you take it"
      lead="Enter your capital, how much of it you will risk and where your stop sits. The result is the most you can buy without breaking your own rule."
    >
      <div className={cn(card, 'grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12')}>
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={e => e.preventDefault()}>
          <Field id="rc-capital" label="Trading capital">
            <input id="rc-capital" className={box} inputMode="decimal" value={capital || ''} onChange={num(setCapital)} aria-label="Trading capital in rupees" />
          </Field>
          <Field id="rc-risk" label="Risk per trade" suffix={`${riskPct.toFixed(2)}%`}>
            <input id="rc-risk" type="range" min="0.25" max="3" step="0.25" value={riskPct} onChange={e => setRiskPct(Number(e.target.value))}
              className="mt-3 h-1.5 w-full cursor-pointer accent-[#22C55E]" />
          </Field>
          <Field id="rc-entry" label="Entry price">
            <input id="rc-entry" className={box} inputMode="decimal" value={entry || ''} onChange={num(setEntry)} />
          </Field>
          <Field id="rc-stop" label="Stop-loss price">
            <input id="rc-stop" className={box} inputMode="decimal" value={stop || ''} onChange={num(setStop)} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="rc-rr" label="Target reward to risk" suffix={`${rr.toFixed(1)}R`}>
              <input id="rc-rr" type="range" min="1" max="5" step="0.5" value={rr} onChange={e => setRr(Number(e.target.value))}
                className="mt-3 h-1.5 w-full cursor-pointer accent-[#22C55E]" />
            </Field>
          </div>
        </form>

        <div className="ink flex flex-col justify-between gap-6 rounded-2xl p-6 sm:p-7" aria-live="polite">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-slate-400">Largest position you can take</p>
              <SampleTag onInk>Calculator</SampleTag>
            </div>
            <p className="mt-2 font-mono-stat text-[44px] font-medium leading-none tracking-tight text-white">
              {valid ? qty.toLocaleString('en-IN') : '—'}
              <span className="ml-2 text-[16px] text-slate-400">units</span>
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t ink-line pt-5 text-[14px]">
            <div>
              <dt className="text-slate-400">Most you can lose</dt>
              <dd className="mt-1 font-mono-stat text-[18px] text-[#F87171]">{valid ? `−${inr(qty * perUnit)}` : '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Reward at {rr.toFixed(1)}R</dt>
              <dd className="mt-1 font-mono-stat text-[18px] text-[#4ADE80]">{valid ? `+${inr(reward)}` : '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Capital in the trade</dt>
              <dd className="mt-1 font-mono-stat text-[18px] text-white">{valid ? inr(outlay) : '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Win rate to break even</dt>
              <dd className="mt-1 font-mono-stat text-[18px] text-white">{breakeven.toFixed(0)}%</dd>
            </div>
          </dl>
          <p className="text-[12.5px] leading-5 text-slate-400">
            Risk budget {inr(maxLoss)}. Units are shares or option quantity, so enter lot size yourself if you trade in lots. Charges and slippage are not included.
          </p>
        </div>
      </div>
    </Section>
  );
}
