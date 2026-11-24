import React from 'react';
import { PageHero, container, CtaBand } from '../../components/marketing/MarketingBits';
import { cn } from '../../lib/cn';

type Kind = 'New' | 'Improved' | 'Security';
const kindStyle: Record<Kind, string> = {
  New: 'bg-[var(--brand-green)]/15 text-success',
  Improved: 'bg-primary/8 text-secondary',
  Security: 'bg-[var(--brand-red)]/12 text-danger',
};

const releases: { month: string; title: string; items: { kind: Kind; text: string }[] }[] = [
  {
    month: 'November 2026',
    title: 'Safer billing and referral payouts',
    items: [
      { kind: 'Security', text: 'Plan upgrades are only applied after a verified payment, and each payment can only activate a plan once.' },
      { kind: 'Security', text: 'Referral commissions are credited from real payments only, and payouts can no longer be claimed twice.' },
      { kind: 'Improved', text: 'Paid plans now end on the date you paid for.' },
    ],
  },
  {
    month: 'October 2026',
    title: 'Beta sign-ups and a clearer front page',
    items: [
      { kind: 'New', text: 'Join the beta from the site header and get updates before the public launch.' },
      { kind: 'Improved', text: 'Rewritten landing pages that show what the product does with sample data.' },
    ],
  },
  {
    month: 'September 2026',
    title: 'Payments, referrals and voice',
    items: [
      { kind: 'New', text: 'Upgrade to PRO or ELITE with Razorpay checkout, monthly or yearly.' },
      { kind: 'New', text: 'Referrals: share your link from the app and track the people who join.' },
      { kind: 'New', text: 'Lunar AI can read its replies aloud, including in Hindi.' },
      { kind: 'Improved', text: 'Rebuilt broker connection flow and sync reliability.' },
      { kind: 'Improved', text: 'All prices and figures shown in rupees.' },
      { kind: 'Improved', text: 'New sign-in and sign-up screens.' },
    ],
  },
  {
    month: 'August 2026',
    title: 'Rules engine and the AI coach',
    items: [
      { kind: 'New', text: 'A library of trading rules by situation, with strategies you can manage and attach to trades.' },
      { kind: 'New', text: 'Lunar AI coach, backed by faster and deeper language models.' },
      { kind: 'New', text: 'Password reset by email.' },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero title="What changed in RiskRule." lead="The most recent work first." />

      <section className="py-14 sm:py-20" aria-label="Release history">
        <div className={cn(container, 'max-w-[820px]')}>
          <ol className="relative border-l border-primary/15 pl-8 sm:pl-10">
            {releases.map((r, i) => (
              <li key={r.month} className="relative pb-14 last:pb-0">
                <span
                  className={cn('absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-canvas sm:-left-[49px]', i === 0 ? 'bg-[var(--brand-green)] ring-4 ring-[var(--brand-green)]/20' : 'bg-primary/30')}
                  aria-hidden="true"
                />
                <p className="font-mono-stat text-[13px] text-tertiary">{r.month}</p>
                <h2 className="mt-1 font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-primary">{r.title}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {r.items.map(it => (
                    <li key={it.text} className="flex items-start gap-3 text-[15px] leading-6 text-secondary">
                      <span className={cn('mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[12px] font-semibold', kindStyle[it.kind])}>{it.kind}</span>
                      <span>{it.text}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
