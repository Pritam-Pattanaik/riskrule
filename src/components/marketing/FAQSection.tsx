import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { container, textLink, h2Class } from './MarketingBits';
import { cn } from '../../lib/cn';

const faqs = [
  {
    q: 'Which brokers can I connect to RiskRule?',
    a: 'Connect Dhan, Angel One, or Delta Exchange—or enter trades manually. Charges and net P&L are calculated automatically.',
  },
  {
    q: 'How does RiskRule track my daily loss limit?',
    a: 'Set your daily loss cap in your discipline rules. RiskRule monitors your session live, alerts you the moment you cross your limit, and flags any trades taken afterward.',
  },
  {
    q: 'Can I use RiskRule without connecting a broker?',
    a: 'Yes. Enter trades manually to track net P&L, behavioral leaks, discipline rules, and your daily Discipline Score.',
  },
  {
    q: 'What can I track in RiskRule?',
    a: 'You can track behavioral leaks like revenge trading, oversizing, overtrading, and tilt hours alongside your emotions, Discipline Score, charges, and net P&L.',
  },
  {
    q: 'How is the AI coach different from a trading bot?',
    a: 'Lunar AI never places trades for you. It watches your behavior in real time, alerts you when emotions take over, and reviews every session with you.',
  },
  {
    q: 'Can I cancel my subscription without losing my history?',
    a: 'Yes. Cancel from the billing section of your settings with one click and no termination fee. You keep read access to your exported ledgers and journals.',
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-24" aria-label="Frequently asked questions">
      <div className={cn(container, 'grid gap-12 lg:grid-cols-12 lg:gap-16')}>

        <header className="lg:col-span-4">
          <h2 className={h2Class}>Questions traders ask</h2>
          <p className="mt-4 text-[17px] leading-7 text-secondary">
            Broker sync, real-time coaching, and account settings.
          </p>
          <div className="mt-6">
            <Link to="/faq" className={textLink}>
              Read the full FAQ
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </header>

        <div className="rounded-2xl border border-primary/10 bg-surface px-6 shadow-card lg:col-span-8">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            const answerId = `faq-answer-${idx}`;
            return (
              <div key={item.q} className="border-b border-primary/10 last:border-b-0">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="text-[17px] font-medium leading-6 text-primary">{item.q}</span>
                  <Plus
                    size={18}
                    strokeWidth={2}
                    className={cn('shrink-0 text-tertiary transition-transform duration-200', isOpen && 'rotate-45 text-accent')}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={answerId}
                  role="region"
                  className={cn('grid transition-[grid-template-rows] duration-200', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-[15px] leading-7 text-secondary">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
