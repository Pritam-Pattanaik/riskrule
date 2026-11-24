import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { container, textLink, h2Class } from './MarketingBits';
import { cn } from '../../lib/cn';

const faqs = [
  {
    q: 'Which brokers can I import trades from?',
    a: 'RiskRule supports trade imports from Dhan, Angel One, and Delta Exchange. You can also enter trades manually in your journal.',
  },
  {
    q: 'How does RiskRule track my daily loss limit?',
    a: 'Set your daily loss limit in your trading rules. The discipline review flags trades taken after your recorded losses crossed that limit.',
  },
  {
    q: 'Can I use the journal without connecting a broker?',
    a: 'Yes. Add trades manually to track net P&L, strategy performance, and adherence to your trading rules.',
  },
  {
    q: 'What can I track in my trading journal?',
    a: 'You can track entry and exit prices, fees, net P&L, strategies, and notes about the decisions behind your trades.',
  },
  {
    q: 'How is the AI coach different from a trading bot?',
    a: 'Lunar AI reviews your trading history and helps you identify habits such as sizing up after losses or trading outside your planned hours.',
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
            Broker imports, trade reviews, and account settings.
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
