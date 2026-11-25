import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Lock, MessageSquareText, ShieldAlert } from 'lucide-react';
import { PageHero, Section, IconTile, card, btnPrimary, btnSecondary, CtaBand, SampleTag } from '../../components/marketing/MarketingBits';
import AICoachSection from '../../components/marketing/AICoachSection';
import { cn } from '../../lib/cn';

const commands = [
  { cmd: '/plan', title: 'Pre-market plan', body: 'Bias, levels, risk limits and the setups worth waiting for.' },
  { cmd: '/debrief', title: 'Post-market debrief', body: 'Plan adherence, your best trade, your worst decision and one lesson for tomorrow.' },
  { cmd: '/risk', title: 'Risk audit', body: 'Where position size and stops have been costing you.' },
  { cmd: '/psych', title: 'Psychology check', body: 'The emotional patterns that show up in your entries and exits.' },
  { cmd: '/perf', title: 'Performance report', body: 'Expectancy, profit factor, win rate and your best setups.' },
  { cmd: '/rules', title: 'Rules check', body: 'Which of your own rules you break most, with examples.' },
];

const principles = [
  { icon: Calculator, title: 'It never does your maths', body: 'P&L, win rate, drawdown and discipline scores are calculated by RiskRule. The coach only explains figures it is handed.' },
  { icon: MessageSquareText, title: 'It talks about your trades', body: 'Answers come from your journal and rules, not from a generic playbook.' },
  { icon: ShieldAlert, title: 'It does not give trade calls', body: 'Lunar AI is a review tool. It does not place orders and it does not tell you what to buy or sell.' },
  { icon: Lock, title: 'Your journal stays yours', body: 'Conversations are tied to your account and only you can open them.' },
];

function Conversation() {
  return (
    <div className={cn(card, 'p-5 shadow-raised sm:p-6')}>
      <div className="mb-4 flex items-center justify-between border-b border-primary/10 pb-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-green)]" aria-hidden="true" />
          Lunar AI
        </p>
        <SampleTag />
      </div>
      <div className="flex flex-col gap-3 text-[14.5px] leading-6">
        <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-inverse">/risk</p>
        <p className="max-w-[92%] rounded-2xl rounded-bl-md bg-surface-1 px-4 py-3 text-secondary">
          Your three biggest losses this month all came on the trade right after a stop-out, at{' '}
          <span className="font-semibold text-primary">2.1×</span> your usual size. Trades at normal size after a loss
          averaged <span className="font-semibold text-success">+₹310</span>.
        </p>
        <p className="max-w-[92%] rounded-2xl rounded-bl-md bg-surface-1 px-4 py-3 text-secondary">
          Consider a rule: after a loss, the next trade stays at base size. It is worth adding to your trading rules so your sessions are checked against it.
        </p>
      </div>
    </div>
  );
}

export default function AICoachPage() {
  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero
        title="A coach that has read every trade you took."
        lead="Lunar AI reviews your journal, finds the habits behind your losses and tells you what to look at before the next session."
        aside={<Conversation />}
      >
        <Link to="/signup" className={btnPrimary}>Try Lunar AI <ArrowRight size={16} strokeWidth={2} /></Link>
        <Link to="/pricing" className={btnSecondary}>See plans</Link>
      </PageHero>

      <Section title="Ask with a command, or in your own words" lead="Type a slash in the chat box to see the full list.">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {commands.map(c => (
            <li key={c.cmd} className={cn(card, 'hover-lift p-6')}>
              <code className="inline-block rounded-md bg-surface-1 px-2 py-1 font-mono-stat text-[13px] font-medium text-accent">{c.cmd}</code>
              <h3 className="mt-4 font-display text-[19px] font-semibold tracking-tight text-primary">{c.title}</h3>
              <p className="mt-2 text-[14.5px] leading-6 text-secondary">{c.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <AICoachSection />

      <Section title="What the coach will and will not do" lead="A coach you cannot trust to stay in its lane is worse than none.">
        <ul className="grid gap-5 sm:grid-cols-2">
          {principles.map(p => (
            <li key={p.title} className={cn(card, 'flex gap-4 p-6')}>
              <IconTile icon={p.icon} />
              <div>
                <h3 className="font-display text-[18px] font-semibold tracking-tight text-primary">{p.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-6 text-secondary">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-[13px] leading-5 text-tertiary">
          Lunar AI is for education and self-review. It is not investment advice, and RiskRule is not a registered investment adviser.
        </p>
      </Section>

      <CtaBand title="Start with the last trade you regret" lead="Add it to your journal and ask Lunar AI what the pattern was." />
    </div>
  );
}
