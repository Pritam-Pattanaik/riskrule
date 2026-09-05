import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, X, ChevronDown, ChevronUp, Sparkles, Shield, Zap, 
  HelpCircle, ArrowRight, Sliders, CheckCircle2, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, StaggerContainer, StaggerItem, HoverLift, NumberCounter } from '../../components/ui/Motion';
import { cn } from '../../lib/cn';
import TrustTicker from '../../components/marketing/TrustTicker';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [calculatorCapital, setCalculatorCapital] = useState<number>(100000);

  // Capital Preservation Math
  const estimatedAnnualBlowoutLoss = (calculatorCapital * 0.12).toFixed(0); // 12% avg saved
  const softwareAnnualCost = billingCycle === 'annual' ? 9590 : 11988;
  const netEstimatedSavings = Number(estimatedAnnualBlowoutLoss) - softwareAnnualCost;
  const estimatedROI = ((netEstimatedSavings / softwareAnnualCost) * 100).toFixed(0);

  const plans = [
    {
      name: 'Starter',
      badge: 'FREE FOREVER',
      priceMonthly: '₹0',
      priceAnnual: '₹0',
      period: 'lifetime free',
      description: 'For beginners establishing basic trading discipline and manual journaling.',
      features: [
        { label: '50 Synced Trades / Month', included: true },
        { label: 'Basic Expectancy & R:R Analytics', included: true },
        { label: 'Single Broker Account Connection', included: true },
        { label: 'Daily Drawdown Warnings (Visual)', included: true },
        { label: 'AI Behavioral Coach Core', included: false },
        { label: 'Automated API Order Lockouts', included: false },
        { label: 'Pre-News Macro Event Freeze', included: false },
        { label: 'Prop Firm Evaluation Tracker', included: false },
      ],
      cta: 'Start Free Forever',
      ctaVariant: 'secondary' as const,
      highlight: false,
    },
    {
      name: 'PRO',
      badge: 'MOST POPULAR',
      priceMonthly: '₹1,499',
      priceAnnual: '₹1,199',
      period: 'per month, billed annually',
      description: 'For funded prop traders and active discretionary desks requiring hard risk lockouts.',
      features: [
        { label: 'Unlimited Trade Synchronization', included: true },
        { label: 'Full Institutional Expectancy Matrix', included: true },
        { label: 'Up to 5 Broker & Prop Accounts (Apex, FTMO)', included: true },
        { label: 'Automated Hard Drawdown Lockouts', included: true },
        { label: 'Real-Time AI Behavioral Coach & Tilt Shield', included: true },
        { label: 'Real-Time AI Voice Guidance & Audio Co-Pilot', included: true },
        { label: 'Macro News High-Impact Lockouts (FOMC/CPI)', included: true },
        { label: 'Sub-second Webhook Telemetry (<1ms)', included: true },
        { label: 'Custom Enterprise Webhook Integrations', included: false },
      ],
      cta: 'Start 14-Day Free PRO Trial',
      ctaVariant: 'primary' as const,
      highlight: true,
    },
    {
      name: 'ELITE',
      badge: 'MULTI-ACCOUNT',
      priceMonthly: '₹3,999',
      priceAnnual: '₹3,199',
      period: 'per month, billed annually',
      description: 'For syndicate managers, family offices, and multi-allocation portfolio traders.',
      features: [
        { label: 'Everything in PRO', included: true },
        { label: 'Real-Time AI Voice Co-Pilot (Custom Personas)', included: true },
        { label: 'Unlimited Broker & Prop Firm Accounts', included: true },
        { label: 'Advanced Monte Carlo Simulation Engine', included: true },
        { label: 'Cross-Account Risk Aggregation & Hedging', included: true },
        { label: 'Dedicated Account Risk Engineer', included: true },
        { label: 'Custom Python / C++ API Access', included: true },
        { label: 'Priority Sub-Millisecond SSE Feed', included: true },
        { label: '24/7 VIP Emergency Trade Desk Support', included: true },
      ],
      cta: 'Launch ELITE Tier',
      ctaVariant: 'secondary' as const,
      highlight: false,
    },
  ];

  const comparisonFeatures = [
    { name: 'Trade Sync Capacity', starter: '50 / mo', pro: 'Unlimited', elite: 'Unlimited' },
    { name: 'Connected Broker / Prop Accounts', starter: '1 Account', pro: '5 Accounts', elite: 'Unlimited' },
    { name: 'Automated Drawdown Lockouts', starter: 'Visual Warning', pro: 'Hard API Freeze', elite: 'Hard API Freeze' },
    { name: 'Real-Time AI Voice Co-Pilot', starter: 'Disabled', pro: 'Neural Voice Guidance', elite: 'Custom Voice Personas' },
    { name: 'AI Behavioral Tilt Detection', starter: 'Disabled', pro: 'Active (Real-time)', elite: 'Active (Custom Rules)' },
    { name: 'Pre-News Macro Lockout Shield', starter: 'Disabled', pro: 'Active (Tier-1)', elite: 'Active (Full Calendar)' },
    { name: 'Prop Evaluation Rules Matrix', starter: 'Basic', pro: 'FTMO, Apex, Topstep', elite: 'All Firms + Custom' },
    { name: 'Expectancy & Monte Carlo Engine', starter: 'Basic', pro: 'Standard 1k Sim', elite: 'Advanced 10k Sim' },
    { name: 'Data Security & Encryption', starter: 'AES-256 TLS 1.3', pro: 'AES-256 TLS 1.3', elite: 'SOC-2 Dedicated Vault' },
  ];

  const faqs = [
    {
      q: 'Do I need to enter a credit card to start the free trial?',
      a: 'No. You can start exploring RiskRule without entering any payment information or credit card credentials.'
    },
    {
      q: 'How does the annual discount work?',
      a: 'When choosing the annual billing plan, you receive an immediate 20% discount applied to your total invoice.'
    },
    {
      q: 'Can I connect multiple prop firm accounts (e.g. Apex + FTMO)?',
      a: 'Yes. The Pro plan allows you to sync up to 5 concurrent accounts, while the Elite tier offers unlimited broker and prop firm connections with unified portfolio risk metrics.'
    },
    {
      q: 'Can I cancel or change plans anytime?',
      a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time with a single click in your Settings dashboard.'
    },
  ];

  return (
    <div className="w-full relative overflow-hidden bg-canvas text-primary">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full pt-28 sm:pt-36 pb-16 flex flex-col items-center justify-center overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div 
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] max-w-[90vw] h-[400px] rounded-full blur-[140px] opacity-25"
            style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.40) 0%, rgba(16, 185, 129, 0.20) 50%, transparent 80%)' }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center z-10">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-border bg-surface-1/80 text-xs font-semibold text-primary shadow-xs">
              <Sparkles size={14} className="text-iris" />
              <span>Predictable Investment in Disciplined Execution</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.08] mb-6">
              Invest in mathematically <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-iris to-success bg-clip-text text-transparent">
                defended capital.
              </span>
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              A single prevented tilt session pays for years of software. Choose the plan engineered for your trading stage.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-surface-1 border border-border shadow-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-display font-bold transition-all duration-200 outline-none focus-ring",
                  billingCycle === 'monthly'
                    ? "bg-primary text-canvas shadow-xs"
                    : "text-secondary hover:text-primary"
                )}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-display font-bold transition-all duration-200 flex items-center gap-2 outline-none focus-ring",
                  billingCycle === 'annual'
                    ? "bg-primary text-canvas shadow-xs"
                    : "text-secondary hover:text-primary"
                )}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full bg-success text-canvas text-[10px] font-extrabold uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Pricing Cards Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-20 mb-20">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch" staggerChildren={0.1}>
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
            return (
              <StaggerItem key={plan.name} className="h-full">
                <HoverLift 
                  className={cn(
                    "p-8 sm:p-9 rounded-3xl flex flex-col justify-between relative h-full transition-all duration-300",
                    plan.highlight 
                      ? "bg-surface-1 border-2 border-iris shadow-[0_0_40px_rgba(99,102,241,0.25)] ring-1 ring-iris/50" 
                      : "bg-surface-1/80 border border-border hover:border-border-hover shadow-card"
                  )}
                >
                  {/* Highlight Glow Tag */}
                  {plan.badge && (
                    <div className={cn(
                      "absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-mono-stat font-extrabold px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-wider shadow-md",
                      plan.highlight
                        ? "bg-gradient-to-r from-accent to-iris text-white shadow-iris"
                        : "bg-surface-2 border border-border text-secondary"
                    )}>
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className={cn(
                      "font-display text-2xl font-bold mb-2 tracking-tight",
                      plan.highlight ? "text-primary" : "text-primary"
                    )}>
                      {plan.name}
                    </h3>
                    <p className="text-xs text-secondary mb-6 min-h-[38px] leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-border/80">
                      <span className="font-mono-stat text-4xl sm:text-5xl font-extrabold text-primary tracking-tight tabular-nums">
                        {price}
                      </span>
                      {price !== '₹0' && (
                        <span className="text-xs font-mono-stat text-tertiary">/mo</span>
                      )}
                    </div>

                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className={cn(
                          "flex items-start gap-3 text-xs font-medium leading-relaxed",
                          f.included ? "text-primary" : "text-tertiary opacity-60"
                        )}>
                          {f.included ? (
                            <Check size={16} className="text-success shrink-0 mt-0.5 stroke-[2.5]" />
                          ) : (
                            <X size={16} className="text-tertiary shrink-0 mt-0.5 stroke-[2]" />
                          )}
                          <span>{f.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/signup"
                    className={cn(
                      "w-full min-h-[46px] inline-flex items-center justify-center rounded-xl text-xs font-bold text-center transition-all focus-ring shadow-sm",
                      plan.highlight
                        ? "bg-gradient-to-r from-accent to-iris text-white hover:opacity-95 shadow-md shadow-iris/20"
                        : "bg-surface-2 border border-border text-primary hover:bg-surface-elevated"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* ── Interactive Capital Protection ROI Calculator ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 relative z-20 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Reveal direction="up">
            <p className="text-xs font-mono-stat font-bold uppercase tracking-widest text-success mb-2.5">
              Capital Preservation Calculator
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
              Calculate your software ROI from prevented tilt.
            </h2>
            <p className="text-base sm:text-lg text-secondary leading-relaxed">
              Drag your total funded capital to calculate estimated annual savings from avoided daily drawdown breaches.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-surface-1 border border-border p-6 sm:p-10 shadow-card">
            
            {/* Slider Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="font-display font-bold text-base text-primary">Your Total Trading Capital</span>
                <span className="text-lg font-mono-stat font-extrabold text-primary">${calculatorCapital.toLocaleString()}</span>
              </div>

              <div className="space-y-3">
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={10000}
                  value={calculatorCapital}
                  onChange={(e) => setCalculatorCapital(Number(e.target.value))}
                  className="w-full accent-success cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-tertiary font-mono-stat">
                  <span>$10,000</span>
                  <span>$100,000</span>
                  <span>$250,000</span>
                  <span>$500,000</span>
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed">
                Quantitative study reveals that disciplined automated lockouts prevent an average of 12% in catastrophic tilt losses per year for discretionary traders.
              </p>
            </div>

            {/* Result Column */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-surface-0 border border-success/30 space-y-4 shadow-card">
              <div className="flex justify-between items-center border-b border-border/80 pb-3">
                <span className="text-xs font-mono-stat font-extrabold uppercase text-tertiary">Estimated Annual Impact</span>
                <span className="text-xs font-mono-stat text-success font-bold">ROI: +{estimatedROI}%</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[11px] font-mono-stat text-tertiary uppercase">Prevented Tilt Losses</span>
                  <p className="text-2xl font-bold font-mono-stat text-success mt-1">+${Number(estimatedAnnualBlowoutLoss).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-1 border border-border">
                  <span className="text-[11px] font-mono-stat text-tertiary uppercase">Annual Software Cost</span>
                  <p className="text-2xl font-bold font-mono-stat text-primary mt-1">₹{softwareAnnualCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-xs font-mono-stat text-success flex items-center justify-between font-bold">
                <span>Net Estimated Capital Protected:</span>
                <span className="text-sm">+${(Number(estimatedAnnualBlowoutLoss) - 150).toLocaleString()}</span>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      {/* ── Detailed Comparison Matrix ── */}
      <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 relative z-20 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Reveal direction="up">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4">
              Full Feature Comparison Matrix
            </h2>
            <p className="text-base text-secondary">
              Review institutional specifications across all plan tiers.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.1}>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface-1">
            <table className="w-full text-left text-xs font-mono-stat">
              <thead>
                <tr className="border-b border-border bg-surface-0/80 text-tertiary uppercase">
                  <th className="py-4 px-5">Capability / Specification</th>
                  <th className="py-4 px-4 text-center">Starter</th>
                  <th className="py-4 px-4 text-center text-iris font-bold">PRO</th>
                  <th className="py-4 px-4 text-center text-primary font-bold">ELITE</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="border-b border-border/40 hover:bg-surface-2/40 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-primary">{row.name}</td>
                    <td className="py-3.5 px-4 text-center text-secondary">{row.starter}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-iris">{row.pro}</td>
                    <td className="py-3.5 px-4 text-center text-primary">{row.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ── FAQ Section ── */}
      <section className="w-full max-w-[960px] mx-auto px-4 sm:px-6 py-12 relative z-20 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Reveal direction="up">
            <h2 className="font-display text-3xl font-bold text-primary tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-secondary">
              Common questions regarding subscriptions, billing, and trial policies.
            </p>
          </Reveal>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 0.05}>
              <div className="p-5 rounded-2xl bg-surface-1 border border-border space-y-2">
                <h4 className="font-display font-bold text-base text-primary">{faq.q}</h4>
                <p className="text-sm text-secondary leading-relaxed">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Trust Ticker ── */}
      <TrustTicker />

    </div>
  );
}
