import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ChevronDown, Shield, Lock, Terminal, HelpCircle, 
  MessageSquare, ArrowRight, Zap, RefreshCw, Brain, Award, CheckCircle2
} from 'lucide-react';
import { Reveal, HoverLift } from '../../components/ui/Motion';
import { cn } from '../../lib/cn';
import TrustTicker from '../../components/marketing/TrustTicker';

interface FAQItem {
  q: string;
  a: string;
  category: 'all' | 'brokers' | 'ai' | 'prop' | 'security' | 'billing';
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const allFaqs: FAQItem[] = [
    {
      category: 'brokers',
      q: 'How does RiskRule connect to my brokerage without risking my trading capital?',
      a: 'RiskRule integrates strictly through standard OAuth 2.0 and Read-Only API tokens. When linking MetaTrader 4/5, Interactive Brokers, Tradovate, or custom webhooks, you explicitly leave "Order Execution" and "Fund Withdrawal" permissions disabled. Our servers cannot initiate trades or move funds under any technical circumstance.'
    },
    {
      category: 'brokers',
      q: 'What is the sync latency for trade execution and order fills?',
      a: 'Broker synchronization runs asynchronously via high-speed webhooks and Server-Sent Events (SSE) with sub-second latency (< 800ms). Your native trading charts and terminal execution speeds are completely unaffected.'
    },
    {
      category: 'prop',
      q: 'How does the automated daily drawdown lockout work with evaluation prop firms?',
      a: 'You input your specific prop challenge threshold (e.g. $2,000 maximum daily loss on Apex or 5% on FTMO). When your account equity reaches the warning buffer, RiskRule intervenes by locking further order routing from your connected tools and initiating an automated 24-hour cooling off period, preserving your challenge status.'
    },
    {
      category: 'prop',
      q: 'Does RiskRule support trailing drawdown thresholds (e.g., Apex, TradeDay)?',
      a: 'Yes. RiskRule tracks both end-of-day and live intraday trailing drawdown peaks tick-by-tick. You can configure high-water-mark tracking so that your allowable loss adjusts dynamically with floating profit.'
    },
    {
      category: 'ai',
      q: 'What makes the AI Behavioral Coach different from automated trading bots?',
      a: 'RiskRule is strictly a quantitative risk management and discipline workstation—we do not sell retail trading signal bots. The AI Behavioral Coach analyzes your real-time order history to identify psychological flaws (such as sizing spikes after a loss, trading during fatigue hours, or revenge trading) and prevents unmanaged risk before it hurts your equity.'
    },
    {
      category: 'ai',
      q: 'Can I customize the behavioral rules and sensitivity of the AI Coach?',
      a: 'Yes. You can customize max consecutive loss triggers, position sizing caps, cooldown timers, and blacklisted macroeconomic release windows directly from your Settings dashboard.'
    },
    {
      category: 'security',
      q: 'Is my historical trading data encrypted and private?',
      a: 'Yes. All data is encrypted in transit using TLS 1.3 and at rest using AES-256 in SOC-2 Type II compliant data centers. We never sell, share, or monetize your trading records, strategy parameters, or execution data.'
    },
    {
      category: 'security',
      q: 'Can I export my records for tax filing and firm audit verification?',
      a: 'Absolutely. You can export complete verified ledgers including timestamps, slippage deltas, commission fees, and R:R multiples in standard CSV, Excel, or PDF formats anytime.'
    },
    {
      category: 'billing',
      q: 'Do I need a credit card to start the free trial?',
      a: 'No credit card is required to create an account and begin using the free starter tier or 14-day Pro trial.'
    },
    {
      category: 'billing',
      q: 'Can I cancel or switch my plan at any time?',
      a: 'Yes. You can cancel, upgrade, or downgrade your subscription directly in your account billing portal with a single click. There are zero cancellation fees or lock-in contracts.'
    },
  ];

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'brokers', label: 'Broker Sync' },
    { id: 'ai', label: 'AI Coach & Tilt' },
    { id: 'prop', label: 'Prop Firms' },
    { id: 'security', label: 'Security & Vault' },
    { id: 'billing', label: 'Billing & Plans' },
  ];

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(faq => {
      const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full pt-28 sm:pt-36 pb-16 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div 
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] max-w-[90vw] h-[350px] rounded-full blur-[140px] opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.40) 0%, rgba(59, 114, 255, 0.20) 50%, transparent 80%)' }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-border bg-surface-1/80 text-xs font-semibold text-primary shadow-xs">
              <HelpCircle size={14} className="text-iris" />
              <span>Knowledge Base &amp; Technical Documentation</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6">
              Frequently Asked <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-iris to-accent bg-clip-text text-transparent">
                Questions.
              </span>
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              Find transparent technical answers regarding broker read-only connections, automated prop lockouts, AI cognitive models, and data security.
            </p>

            {/* Live Search Bar */}
            <div className="w-full max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
              <input
                type="text"
                placeholder="Search questions (e.g. broker sync, Apex lockout, security, billing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface-1 border border-border focus:border-iris/50 focus:ring-2 focus:ring-iris/20 text-sm text-primary placeholder:text-tertiary outline-none transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono-stat text-tertiary hover:text-primary"
                >
                  Clear
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Category Filter Pills ── */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-12 relative z-20">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-display font-semibold transition-all border outline-none focus-ring",
                activeCategory === cat.id
                  ? "bg-primary text-canvas border-primary shadow-xs"
                  : "bg-surface-1 border-border text-secondary hover:text-primary hover:bg-surface-2"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQ Accordion Matrix ── */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 relative z-20 mb-20">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface-1 border border-border space-y-3">
            <p className="text-base font-semibold text-primary">No questions found matching "{searchQuery}"</p>
            <p className="text-xs text-secondary">Try searching for different terms or reset your category filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-2 text-xs font-bold text-iris hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <Reveal key={idx} direction="up" delay={0.03 * idx}>
                  <div
                    className={cn(
                      "rounded-2xl border transition-all duration-200 overflow-hidden",
                      isOpen
                        ? "bg-surface-1 border-border-hover shadow-card"
                        : "bg-surface-0 border-border hover:border-border-hover"
                    )}
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left outline-none focus-ring min-h-[56px] gap-4"
                    >
                      <span className="font-display font-bold text-base sm:text-lg text-primary">
                        {item.q}
                      </span>
                      <div className={cn(
                        "w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-secondary transition-transform duration-300 shrink-0",
                        isOpen && "rotate-180 bg-primary text-canvas"
                      )}>
                        <ChevronDown size={18} strokeWidth={2.5} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-secondary leading-relaxed border-t border-border/50">
                        <p className="pt-3">{item.a}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Direct Support / Live Concierge Card ── */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-20 mb-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-surface-1 border border-iris/40 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono-stat text-iris font-bold uppercase">
              <MessageSquare size={15} />
              <span>Dedicated Risk Engineer Support</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-primary">Have a specific technical question?</h3>
            <p className="text-sm text-secondary max-w-md leading-relaxed">
              Our quantitative support team is available 24/7 to assist with broker connections, custom webhook setups, and prop rules.
            </p>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-canvas font-bold text-sm hover:opacity-95 transition-all shrink-0 shadow-md"
          >
            <span>Ask Support Desk</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Trust Ticker ── */}
      <TrustTicker />

    </div>
  );
}
