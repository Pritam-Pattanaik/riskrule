import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, BookOpen, Brain, CalendarClock, Gauge, Globe, Link2, ListChecks,
  Mic, Newspaper, Target, Users, Zap,
} from 'lucide-react';
import { PageHero, Section, IconTile, card, btnPrimary, btnSecondary, CtaBand } from '../../components/marketing/MarketingBits';
import TrustTicker from '../../components/marketing/TrustTicker';
import { cn } from '../../lib/cn';

type Feature = { icon: React.ElementType; title: string; body: string };

const groups: { id: string; title: string; lead: string; tone: 'green' | 'red' | 'ink'; items: Feature[] }[] = [
  {
    id: 'journal',
    title: 'A journal that fills itself in',
    lead: 'Spend your time reviewing trades, not typing them.',
    tone: 'green',
    items: [
      { icon: Link2, title: 'Broker imports', body: 'Pull fills from Dhan, Angel One or Delta Exchange. Add a trade by hand when you need to.' },
      { icon: BarChart3, title: 'Net P&L after charges', body: 'Every trade shows what you kept, not just what the chart paid. Futures and options lots are handled for you.' },
      { icon: BookOpen, title: 'Daily journal', body: 'Market bias, key levels, watchlist, reflection and mood in one page per day, next to the trades it describes.' },
      { icon: Target, title: 'Strategies and setups', body: 'Tag each trade with the setup behind it, then compare setups by expectancy, win rate and average R.' },
    ],
  },
  {
    id: 'rules',
    title: 'Your rules, checked every session',
    lead: 'Write the limits you already know you should trade by. RiskRule reads each session against them.',
    tone: 'red',
    items: [
      { icon: Gauge, title: 'Daily loss limit', body: 'See the exact trade that crossed your limit and every trade taken after it.' },
      { icon: ListChecks, title: 'Trading rules', body: 'Trades per day, maximum loss per trade, trading hours, allowed markets and instruments, plus rules in your own words.' },
      { icon: CalendarClock, title: 'Discipline score', body: 'Each trade is scored against your plan, so a good day and a disciplined day are no longer the same thing.' },
      { icon: Target, title: 'Goals and habits', body: 'Track the habits you are building, such as journaling before the open, and see your streaks.' },
    ],
  },
  {
    id: 'ai',
    title: 'A coach that has read your journal',
    lead: 'Lunar AI works from your own trades, so its notes are about you.',
    tone: 'ink',
    items: [
      { icon: Brain, title: 'Lunar AI', body: 'Ask for a pre-market plan, a post-market debrief, a risk audit or a psychology check, or ask your own question.' },
      { icon: Mic, title: 'Voice replies', body: 'Hear the coach read its review aloud, including in Hindi, while you scroll through your trades.' },
      { icon: Zap, title: 'Calculated, then explained', body: 'RiskRule does the arithmetic. The AI only interprets numbers it was given, so it cannot invent your P&L.' },
    ],
  },
  {
    id: 'market',
    title: 'Context from the market',
    lead: 'Know what the market was doing when you made the trade.',
    tone: 'green',
    items: [
      { icon: Globe, title: 'Markets', body: 'Index quotes, sector heatmap, breadth and a watchlist, streamed live during market hours.' },
      { icon: Newspaper, title: 'News that is sorted', body: 'Headlines are triaged and scored for likely sector impact, with an educational disclaimer on every analysis.' },
      { icon: Zap, title: 'Flow', body: 'Option-chain reading for Nifty, Bank Nifty and Fin Nifty: open interest, put-call ratio, max pain and implied volatility.' },
      { icon: Users, title: 'Referrals', body: 'Share your link from the app and track the people who join and upgrade through it.' },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero
        title="Everything a trader reviews, in one place."
        lead="A trade journal, a rulebook that checks itself, an AI coach and market tools. Built around the Indian market day."
      >
        <Link to="/signup" className={btnPrimary}>Start free <ArrowRight size={16} strokeWidth={2} /></Link>
        <Link to="/pricing" className={btnSecondary}>Compare plans</Link>
      </PageHero>

      <TrustTicker />

      {groups.map((g, gi) => (
        <Section key={g.id} id={g.id} title={g.title} lead={g.lead} className={cn(gi % 2 === 1 && 'bg-surface-1/60')}>
          <ul className={cn('grid gap-5 sm:grid-cols-2', g.items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4')}>
            {g.items.map(f => (
              <li key={f.title} className={cn(card, 'hover-lift flex flex-col gap-4 p-6')}>
                <IconTile icon={f.icon} tone={g.tone} />
                <div>
                  <h3 className="font-display text-[19px] font-semibold tracking-tight text-primary">{f.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-6 text-secondary">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <CtaBand />
    </div>
  );
}
