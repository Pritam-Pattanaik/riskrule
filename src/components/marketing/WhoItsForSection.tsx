import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bitcoin, CalendarRange, Trophy, Zap } from 'lucide-react';
import { Section, IconTile, card } from './MarketingBits';
import { cn } from '../../lib/cn';

const people = [
  {
    icon: Zap,
    who: 'Intraday options traders',
    pain: 'One bad hour can erase the week.',
    body: 'See the trades you took after your daily limit, the hours that cost you most and every size jump after a loss.',
    to: '/features',
    cta: 'See the rules and review',
  },
  {
    icon: Trophy,
    who: 'Funded-account traders',
    pain: 'One breach can end the account.',
    body: 'Enter your firm’s daily loss and trade-count limits, then review each session against them before the firm does.',
    to: '/prop-traders',
    cta: 'For funded traders',
  },
  {
    icon: Bitcoin,
    who: 'Crypto derivatives traders',
    pain: 'A market that never closes needs rules that do.',
    body: 'Import fills from Delta Exchange and hold your sessions to the same limits as your equity trades.',
    to: '/features#journal',
    cta: 'How imports work',
  },
  {
    icon: CalendarRange,
    who: 'Swing and positional traders',
    pain: 'Fewer trades, bigger consequences.',
    body: 'Tag the setup behind every position, compare setups by expectancy and keep the plan in your journal next to the result.',
    to: '/workspace',
    cta: 'See the workspace',
  },
];

export default function WhoItsForSection() {
  return (
    <Section id="who" title="Built for the way you trade" lead="Pick the one that sounds like your week.">
      <ul className="grid gap-5 sm:grid-cols-2">
        {people.map((p, i) => (
          <li key={p.who}>
            <Link
              to={p.to}
              className={cn(
                card,
                'hover-lift group flex h-full flex-col gap-5 p-7 outline-none focus-visible:ring-2 focus-visible:ring-accent'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <IconTile icon={p.icon} tone={i === 1 ? 'ink' : 'green'} />
                <ArrowRight size={18} className="mt-1 text-tertiary transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-tertiary">{p.who}</p>
                <h3 className="mt-1 font-display text-[24px] font-semibold leading-tight tracking-tight text-primary">{p.pain}</h3>
                <p className="mt-3 text-[15px] leading-6 text-secondary">{p.body}</p>
              </div>
              <span className="mt-auto text-[14px] font-semibold text-accent">{p.cta}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
