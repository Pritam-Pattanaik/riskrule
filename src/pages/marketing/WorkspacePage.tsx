import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, Brain, Globe, LayoutDashboard, Zap } from 'lucide-react';
import { PageHero, Section, IconTile, card, btnPrimary, btnSecondary, textLink, CtaBand, SampleTag } from '../../components/marketing/MarketingBits';
import TrustTicker from '../../components/marketing/TrustTicker';
import InteractiveDashboard from '../../components/marketing/InteractiveDashboard';
import RiskCalculator from '../../components/marketing/RiskCalculator';
import { cn } from '../../lib/cn';

const rooms = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    body: 'Net P&L, win rate, discipline, strategy results and a calendar of green and red days, for any period you pick.',
  },
  {
    icon: BarChart3,
    title: 'Trades and analytics',
    body: 'Every fill with charges taken out. Sort by setup, instrument or hour to see where the edge is and where it leaks.',
  },
  {
    icon: BookOpen,
    title: 'Journal',
    body: 'Write your market bias, key levels and watchlist before the open, then your reflection and mood after the close.',
  },
  {
    icon: Globe,
    title: 'Markets and news',
    body: 'Index quotes, a sector heatmap, an economic calendar and a news feed that is sorted by what is likely to matter.',
  },
  {
    icon: Zap,
    title: 'Flow',
    body: 'Option-chain reading for Nifty, Bank Nifty and Fin Nifty: open interest, put-call ratio, max pain and implied volatility.',
  },
  {
    icon: Brain,
    title: 'Lunar AI',
    body: 'A coach that reads your own journal and answers questions about your habits, risk and plan.',
  },
];

function TodayCard() {
  return (
    <div className={cn(card, 'p-6 shadow-raised')}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-primary">Today</p>
        <SampleTag />
      </div>
      <p className="mt-4 text-[13px] text-tertiary">Net P&amp;L</p>
      <p className="mt-1 font-mono-stat text-[34px] font-medium leading-none text-danger">−₹820</p>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-[13px] text-secondary">
          <span>Daily loss limit used</span>
          <span className="font-mono-stat text-primary">41%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-[41%] rounded-full bg-[var(--brand-green)]" />
        </div>
      </div>
      <ul className="mt-5 divide-y divide-primary/10 border-t border-primary/10 text-[13px]">
        {[['09:31', 'NIFTY 24100 CE', '+₹640', true], ['10:14', 'BANKNIFTY', '−₹820', false], ['10:52', 'NIFTY 24000 PE', '−₹640', false]].map(([t, s, p, up]) => (
          <li key={t as string} className="flex h-10 items-center gap-3">
            <span className="w-11 font-mono-stat text-tertiary">{t}</span>
            <span className="flex-1 truncate text-primary">{s}</span>
            <span className={cn('font-mono-stat', up ? 'text-success' : 'text-danger')}>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero
        title="One workspace for the whole trading day."
        lead="Dashboard, trade ledger, journal, markets and the AI coach all read from the same trades, so every number agrees."
        aside={<TodayCard />}
      >
        <Link to="/signup" className={btnPrimary}>Start free <ArrowRight size={16} strokeWidth={2} /></Link>
        <Link to="/pricing" className={btnSecondary}>See pricing</Link>
      </PageHero>

      <TrustTicker />

      <Section title="Six rooms, one set of numbers" lead="Open the one you need. Nothing is re-entered between them.">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map(r => (
            <li key={r.title} className={cn(card, 'hover-lift flex flex-col gap-4 p-6')}>
              <IconTile icon={r.icon} />
              <div>
                <h3 className="font-display text-[20px] font-semibold tracking-tight text-primary">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-6 text-secondary">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <InteractiveDashboard showLink={false} />
      <RiskCalculator />

      <div className="-mt-6 pb-16 text-center sm:-mt-10">
        <Link to="/features" className={textLink}>Read about every feature <ArrowRight size={16} strokeWidth={2} /></Link>
      </div>
      <CtaBand />
    </div>
  );
}
