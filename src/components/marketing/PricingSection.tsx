import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuthStore } from '../../stores/authStore';
import { useRazorpayCheckout } from '../../hooks/useRazorpayCheckout';
import { toast } from 'sonner';
import { Section, btnPrimary, btnSecondary, textLink } from './MarketingBits';

export default function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { openCheckout, isLoading: isCheckoutLoading } = useRazorpayCheckout({
    onSuccess: (plan) => {
      toast.success(`Welcome to RiskRule ${plan}`, {
        description: 'Your plan has been activated. Redirecting to your dashboard.',
      });
      useAuthStore.getState().initialize();
      setTimeout(() => navigate('/app'), 2000);
    },
    onFailure: (error) => {
      if (error !== 'Payment cancelled') {
        toast.error('Payment failed', { description: error });
      }
    },
  });

  const handlePlanCTA = (planName: string) => {
    if (planName === 'Starter' || !user) {
      navigate('/signup');
      return;
    }
    const planType = planName as 'PRO' | 'ELITE';
    openCheckout(planType, annualBilling ? 'annual' : 'monthly');
  };

  const plans = [
    {
      name: 'Starter',
      price: '₹0',
      period: 'a month',
      desc: 'Journaling and expectancy analytics for developing traders.',
      cta: 'Get started free',
      popular: false,
      features: [
        'Broker sync, 1 connection',
        'R:R expectancy calculations',
        '30-day performance ledger',
        'Setup attribution tags',
      ],
    },
    {
      name: 'PRO',
      price: annualBilling ? '₹1,199' : '₹1,499',
      period: annualBilling ? 'a month, billed yearly' : 'a month',
      desc: 'The full discipline workstation for funded prop accounts.',
      cta: 'Choose PRO',
      popular: true,
      features: [
        'Unlimited broker connections',
        'AI trading coach',
        'Voice playback for coach responses',
        'Daily loss limit tracking',
        'Economic calendar and volatility alerts',
        'CSV exports for accounting',
        'Broker sync through webhooks',
      ],
    },
    {
      name: 'ELITE',
      price: annualBilling ? '₹3,199' : '₹3,999',
      period: annualBilling ? 'a month, billed yearly' : 'a month',
      desc: 'For multi-account desks and proprietary evaluation firms.',
      cta: 'Choose ELITE',
      popular: false,
      features: [
        'Everything in PRO',
        'Voice co-pilot with custom personas',
        'Multi-account copy ledgers',
        'Strategy alert webhooks and API access',
        'A dedicated desk architect',
        'Priority support',
      ],
    },
  ];

  return (
    <Section
      id="pricing"
      title="Priced to pay for itself on one avoided mistake"
      lead="Change or cancel your plan at any time, with no termination fees."
    >
      {/* Billing toggle */}
      <div className="mb-8 flex items-center gap-4">
        <div role="group" aria-label="Billing period" className="flex gap-1 rounded-xl bg-surface-1 p-1">
          {[
            { label: 'Monthly', value: false },
            { label: 'Yearly', value: true },
          ].map(opt => (
            <button
              key={opt.label}
              onClick={() => setAnnualBilling(opt.value)}
              aria-pressed={annualBilling === opt.value}
              className={cn(
                'h-8 rounded-lg px-4 text-[13px] font-semibold transition-colors duration-150',
                annualBilling === opt.value
                  ? 'bg-primary text-inverse shadow-xs'
                  : 'text-secondary '
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="rounded-full bg-[var(--brand-green)]/15 px-2.5 py-1 text-[12px] font-semibold text-success">Yearly saves 20%</span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-stretch">
        {plans.map(plan => {
          const busy = isCheckoutLoading && plan.name !== 'Starter';
          const dark = plan.popular;
          return (
            <article
              key={plan.name}
              className={cn(
                'relative flex flex-col justify-between rounded-2xl border p-7 transition-shadow duration-200',
                dark
                  ? 'ink border-white/10 shadow-[0_30px_70px_-30px_rgb(15_23_42/0.6)] md:-my-3 md:py-10'
                  : 'border-primary/10 bg-surface shadow-card hover:shadow-card-hover'
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className={cn('font-display text-[22px] font-semibold tracking-tight', dark ? 'text-white' : 'text-primary')}>{plan.name}</h3>
                  {dark && (
                    <span className="rounded-full bg-[var(--brand-green)] px-2.5 py-1 text-[12px] font-semibold text-[#0F172A]">Most popular</span>
                  )}
                </div>
                <p className={cn('mt-2 min-h-12 text-[15px] leading-6', dark ? 'text-slate-300' : 'text-secondary')}>{plan.desc}</p>

                <p className={cn('mt-6 border-b pb-6', dark ? 'ink-line' : 'border-primary/10')}>
                  <span className={cn('block font-mono-stat text-[40px] font-medium leading-none tracking-tight', dark ? 'text-white' : 'text-primary')}>{plan.price}</span>
                  <span className={cn('mt-2 block text-[13px]', dark ? 'text-slate-400' : 'text-tertiary')}>{plan.period}</span>
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {plan.features.map(feat => (
                    <li key={feat} className={cn('flex items-start gap-3 text-[15px] leading-6', dark ? 'text-slate-200' : 'text-secondary')}>
                      <Check
                        size={17}
                        strokeWidth={2.5}
                        className={cn('mt-[3px] shrink-0', dark ? 'text-[var(--brand-green)]' : 'text-accent')}
                        aria-hidden="true"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePlanCTA(plan.name)}
                disabled={busy}
                className={cn('mt-8 w-full disabled:opacity-60', plan.popular ? btnPrimary : btnSecondary)}
              >
                {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                {plan.cta}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-8">
        <Link to="/pricing" className={textLink}>
          Compare plans in detail
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </Section>
  );
}
