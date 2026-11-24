import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageHero, container, CtaBand } from '../../components/marketing/MarketingBits';
import { cn } from '../../lib/cn';

type Category = 'brokers' | 'rules' | 'ai' | 'billing';
const categories: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'brokers', label: 'Brokers and trades' },
  { id: 'rules', label: 'Rules and limits' },
  { id: 'ai', label: 'Lunar AI' },
  { id: 'billing', label: 'Plans and billing' },
];

const faqs: { category: Category; q: string; a: string }[] = [
  { category: 'brokers', q: 'Which brokers can I import trades from?', a: 'RiskRule imports trades from Dhan, Angel One and Delta Exchange. You can also add trades by hand, so the journal works with any broker.' },
  { category: 'brokers', q: 'Can I use the journal without connecting a broker?', a: 'Yes. Add trades manually to track net P&L, strategy performance and how well you followed your rules.' },
  { category: 'brokers', q: 'Does RiskRule place or change orders?', a: 'No. RiskRule reads your trade history and reviews it. It never places, modifies or cancels an order at your broker.' },
  { category: 'brokers', q: 'What can I track on each trade?', a: 'Entry and exit prices, quantity, charges, net P&L, the strategy behind it, tags, mistakes, a checklist and your notes on the decision.' },
  { category: 'rules', q: 'How does RiskRule track my daily loss limit?', a: 'Set your daily loss limit in your trading rules. The session review shows the trade that crossed it and flags every trade taken afterward.' },
  { category: 'rules', q: 'Which rules can I set?', a: 'A daily loss limit, a maximum loss per trade, trades per day, a trading window, the markets and instruments you allow, and rules written in your own words.' },
  { category: 'rules', q: 'Is this useful on a funded or evaluation account?', a: 'Yes. Enter the limits from your firm’s agreement and review each session against them. Your firm’s own dashboard stays the source of truth for its rules.' },
  { category: 'ai', q: 'How is Lunar AI different from a trading bot?', a: 'Lunar AI reviews your trading history and helps you spot habits such as sizing up after a loss or trading outside your planned hours. It does not trade and it does not give buy or sell calls.' },
  { category: 'ai', q: 'Does the AI calculate my P&L?', a: 'No. RiskRule calculates P&L, win rate, drawdown and discipline scores. The AI explains figures it is given, so it cannot invent your results.' },
  { category: 'ai', q: 'Can the coach read its replies aloud?', a: 'Yes. Voice playback is available on PRO and ELITE, including Hindi voices.' },
  { category: 'billing', q: 'What does each plan cost?', a: 'Starter is free. PRO is ₹1,499 a month, or ₹1,199 a month billed yearly. ELITE is ₹3,999 a month, or ₹3,199 a month billed yearly.' },
  { category: 'billing', q: 'How do I pay, and can I cancel?', a: 'Payments are processed by Razorpay. You can cancel from the billing section of your settings with no termination fee.' },
  { category: 'billing', q: 'Is RiskRule a registered investment adviser?', a: 'No. RiskRule is a journaling, analytics and AI-coaching tool. Nothing in it is a recommendation to buy or sell, and trading involves risk of loss.' },
];

export default function FAQPage() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<'all' | Category>('all');
  const [open, setOpen] = useState<string | null>(faqs[0].q);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter(f => (active === 'all' || f.category === active) && (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)));
  }, [query, active]);

  return (
    <div className="w-full bg-canvas text-primary">
      <PageHero title="Questions traders ask." lead="Brokers, rules, the AI coach and billing, answered plainly." />

      <section className="py-14 sm:py-20" aria-label="Frequently asked questions">
        <div className={cn(container, 'max-w-[860px]')}>
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tertiary" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search questions, for example Dhan or daily loss"
              aria-label="Search questions"
              className="h-12 w-full rounded-xl border border-primary/15 bg-surface pl-11 pr-4 text-[15px] text-primary outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted hover:border-primary/30 focus:border-accent focus:shadow-[0_0_0_3px_rgb(var(--color-accent)/0.18)]"
            />
          </div>

          <div role="group" aria-label="Filter by topic" className="mt-4 flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                aria-pressed={active === c.id}
                className={cn(
                  'h-9 rounded-full border px-4 text-[13.5px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  active === c.id ? 'border-primary bg-primary text-inverse' : 'border-primary/15 bg-surface text-secondary hover:border-primary/30 '
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-primary/10 bg-surface px-6 shadow-card">
            {shown.length === 0 ? (
              <p className="py-10 text-center text-[15px] text-secondary">
                No question matches “{query}”. Clear the search or pick another topic.
              </p>
            ) : (
              shown.map((item, idx) => {
                const isOpen = open === item.q;
                const id = `faq-${idx}`;
                return (
                  <div key={item.q} className="border-b border-primary/10 last:border-b-0">
                    <button
                      onClick={() => setOpen(isOpen ? null : item.q)}
                      aria-expanded={isOpen}
                      aria-controls={id}
                      className="flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span className="text-[17px] font-medium leading-6 text-primary">{item.q}</span>
                      <Plus size={18} strokeWidth={2} className={cn('shrink-0 text-tertiary transition-transform duration-200', isOpen && 'rotate-45 text-accent')} aria-hidden="true" />
                    </button>
                    <div id={id} role="region" className={cn('grid transition-[grid-template-rows] duration-200', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 text-[15px] leading-7 text-secondary">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
