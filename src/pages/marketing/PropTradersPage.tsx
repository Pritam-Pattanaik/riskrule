import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { PageHero, Section, card, btnPrimary, btnSecondary, CtaBand, SampleTag } from '../../components/marketing/MarketingBits';
import TrustTicker from '../../components/marketing/TrustTicker';
import { cn } from '../../lib/cn';

const rulebook = [
  ['Maximum loss per day', '₹10,000'],
  ['Maximum loss per trade', '₹3,000'],
  ['Trades per day', '5'],
  ['Trading window', '09:15 to 14:30'],
  ['Allowed instruments', 'Nifty and Bank Nifty options'],
];

const checks = [
  { ok: true, text: 'Every rule from your evaluation or funded-account agreement, written down once' },
  { ok: true, text: 'Each synced session compared with those rules, with breaches marked on the trade' },
  { ok: true, text: 'The trades taken after a limit, and what they cost' },
  { ok: false, text: 'RiskRule does not place, block or modify orders at your broker' },
];

function Rulebook() {
  return (
    <div className={cn(card, 'p-6 shadow-raised')}>
      <div className="flex items-center justify-between border-b border-primary/10 pb-3">
        <p className="text-sm font-semibold text-primary">Your rulebook</p>
        <SampleTag>Example rules</SampleTag>
      </div>
      <dl className="divide-y divide-primary/10 text-[14.5px]">
        {rulebook.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-secondary">{k}</dt>
            <dd className="text-right font-mono-stat text-primary">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function PropTradersPage() {
  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero
        title="Keep your funded account by keeping your rules."
        lead="Funded and evaluation accounts end on one bad day. Put your firm’s limits in RiskRule and see, after every session, how close you came."
        aside={<Rulebook />}
      >
        <Link to="/signup" className={btnPrimary}>Start free <ArrowRight size={16} strokeWidth={2} /></Link>
        <Link to="/pricing" className={btnSecondary}>See PRO</Link>
      </PageHero>

      <TrustTicker />

      <Section title="What it does, and what it does not" lead="Plain terms, so you know exactly what you are relying on.">
        <ul className="grid gap-4 sm:grid-cols-2">
          {checks.map(c => (
            <li key={c.text} className={cn(card, 'flex items-start gap-4 p-5')}>
              <span
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  c.ok ? 'bg-[var(--brand-green)]/15 text-accent' : 'bg-[var(--brand-red)]/12 text-danger'
                )}
                aria-hidden="true"
              >
                {c.ok ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
              </span>
              <p className="text-[15px] leading-6 text-primary">{c.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-[13px] leading-5 text-tertiary">
          Your firm’s own dashboard remains the source of truth for its rules. Use RiskRule to review your behaviour, and check the firm’s figures before you rely on any limit.
        </p>
      </Section>

      <CtaBand title="Review the day before your firm does" lead="Add your rules, import your trades and see where you stood against each limit." />
    </div>
  );
}
