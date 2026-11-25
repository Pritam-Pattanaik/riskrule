import React from 'react';
import { Check, Minus } from 'lucide-react';
import { PageHero, Section, CtaBand } from '../../components/marketing/MarketingBits';
import PricingSection from '../../components/marketing/PricingSection';
import TrustTicker from '../../components/marketing/TrustTicker';
import { cn } from '../../lib/cn';

type Cell = boolean | string;
const rows: { label: string; starter: Cell; pro: Cell; elite: Cell }[] = [
  { label: 'Broker connections', starter: '1', pro: 'Unlimited', elite: 'Unlimited' },
  { label: 'R:R expectancy calculations', starter: true, pro: true, elite: true },
  { label: '30-day performance ledger', starter: true, pro: true, elite: true },
  { label: 'Setup attribution tags', starter: true, pro: true, elite: true },
  { label: 'AI trading coach', starter: false, pro: true, elite: true },
  { label: 'Voice playback for coach responses', starter: false, pro: true, elite: true },
  { label: 'Daily loss limit tracking', starter: false, pro: true, elite: true },
  { label: 'Economic calendar and volatility alerts', starter: false, pro: true, elite: true },
  { label: 'CSV exports for accounting', starter: false, pro: true, elite: true },
  { label: 'Broker sync through webhooks', starter: false, pro: true, elite: true },
  { label: 'Voice co-pilot with custom personas', starter: false, pro: false, elite: true },
  { label: 'Multi-account copy ledgers', starter: false, pro: false, elite: true },
  { label: 'Strategy alert webhooks and API access', starter: false, pro: false, elite: true },
  { label: 'A dedicated desk architect', starter: false, pro: false, elite: true },
  { label: 'Priority support', starter: false, pro: false, elite: true },
];

function Mark({ v }: { v: Cell }) {
  if (typeof v === 'string') return <span className="font-mono-stat text-[13px] text-primary">{v}</span>;
  return v ? (
    <>
      <Check size={18} strokeWidth={2.5} className="mx-auto text-accent" aria-hidden="true" />
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <Minus size={18} className="mx-auto text-tertiary/60" aria-hidden="true" />
      <span className="sr-only">Not included</span>
    </>
  );
}

export default function Pricing() {
  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero
        title="Start free. Pay when it earns its place."
        lead="Every plan includes the trade journal. Move to PRO when you want the coach and live limit tracking."
      />

      <PricingSection />

      <Section title="Compare plans" lead="Everything each plan includes, side by side.">
        <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-surface shadow-card">
          <table className="w-full min-w-[640px] border-collapse text-left text-[14.5px]">
            <thead>
              <tr className="border-b border-primary/10 bg-surface-1">
                <th scope="col" className="px-5 py-4 font-semibold text-primary">Feature</th>
                {['Starter', 'PRO', 'ELITE'].map(h => (
                  <th key={h} scope="col" className={cn('w-28 px-3 py-4 text-center font-semibold', h === 'PRO' ? 'text-accent' : 'text-primary')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {rows.map(r => (
                <tr key={r.label} className="hover:bg-surface-1/60">
                  <th scope="row" className="px-5 py-3.5 font-normal text-secondary">{r.label}</th>
                  <td className="px-3 py-3.5 text-center"><Mark v={r.starter} /></td>
                  <td className="bg-[var(--brand-green)]/[0.05] px-3 py-3.5 text-center"><Mark v={r.pro} /></td>
                  <td className="px-3 py-3.5 text-center"><Mark v={r.elite} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] text-tertiary">Prices are in Indian rupees. Yearly billing saves 20%. Payments are processed by Razorpay.</p>
      </Section>

      <TrustTicker />
      <div className="pt-16" />
      <CtaBand />
    </div>
  );
}
