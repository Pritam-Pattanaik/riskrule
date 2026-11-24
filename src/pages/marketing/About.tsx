import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, HandCoins, Scale } from 'lucide-react';
import { PageHero, Section, IconTile, card, btnPrimary, btnSecondary, CtaBand } from '../../components/marketing/MarketingBits';
import { cn } from '../../lib/cn';

const principles = [
  {
    icon: Calculator,
    title: 'Your numbers come from your trades',
    body: 'We calculate P&L, expectancy and discipline from the fills your broker reports. The AI explains those numbers. It never makes them up.',
  },
  {
    icon: HandCoins,
    title: 'We earn from subscriptions only',
    body: 'RiskRule is not a broker. We do not sell signals, take the other side of a trade or earn when you trade more.',
  },
  {
    icon: Scale,
    title: 'We tell you what the tool cannot do',
    body: 'RiskRule reviews and flags. It does not place orders, give investment advice or guarantee results, and it says so in the product.',
  },
];

export default function About() {
  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero
        title="Built for traders who keep losing to the same mistake."
        lead="Most retail traders can read a chart. What costs them money is the trade after the limit, the bigger size after a loss, the entry they planned to skip. RiskRule exists to make those patterns visible."
      >
        <Link to="/signup" className={btnPrimary}>Start free <ArrowRight size={16} strokeWidth={2} /></Link>
        <Link to="/features" className={btnSecondary}>See the features</Link>
      </PageHero>

      <Section title="How we build" lead="Three commitments that shape every screen.">
        <ul className="grid gap-5 md:grid-cols-3">
          {principles.map(p => (
            <li key={p.title} className={cn(card, 'flex flex-col gap-4 p-7')}>
              <IconTile icon={p.icon} />
              <h3 className="font-display text-[21px] font-semibold leading-tight tracking-tight text-primary">{p.title}</h3>
              <p className="text-[15px] leading-6 text-secondary">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="See your last month the way a coach would" lead="Import your trades and let RiskRule show what the pattern was." />
    </div>
  );
}
