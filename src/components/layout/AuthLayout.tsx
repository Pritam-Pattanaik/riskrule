import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Gauge, LineChart, MessageSquareText } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { cn } from '../../lib/cn';
import dhan from '../../assets/brokers/dhan.svg';
import angelone from '../../assets/brokers/angelone.svg';
import delta from '../../assets/brokers/delta_exchange_mark.svg';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const points = [
  { icon: LineChart, text: 'Imports your trades from Dhan, Angel One and Delta Exchange' },
  { icon: Gauge, text: 'Checks every session against the daily loss limit you set' },
  { icon: MessageSquareText, text: 'Lunar AI reviews the trades that broke your rules' },
];

/** A small static session: the line crosses the limit once. Decorative, so it is hidden from assistive tech. */
function MiniSession() {
  const pts: [number, number][] = [[0, 70], [40, 58], [80, 64], [120, 92], [160, 84], [200, 128], [236, 150], [280, 168]];
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x + 8} ${y}`).join(' ');
  return (
    <svg viewBox="0 0 300 190" className="h-auto w-full" aria-hidden="true">
      <line x1="8" x2="292" y1="70" y2="70" stroke="rgb(248 250 252 / 0.25)" />
      <line x1="8" x2="292" y1="134" y2="134" stroke="#EF4444" strokeOpacity="0.7" strokeDasharray="4 4" />
      <rect x="210" y="12" width="82" height="166" fill="#EF4444" fillOpacity="0.07" />
      <path d={d} pathLength={1} className="draw-line" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="210" cy="134" r="5" fill="#EF4444" stroke="#0F172A" strokeWidth="2" className="fill-in" />
      <text x="12" y="62" fontSize="9" fill="#CBD5E1" fontFamily="DM Mono, monospace">₹0</text>
      <text x="12" y="127" fontSize="9" fill="#F87171" fontFamily="DM Mono, monospace">limit</text>
    </svg>
  );
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="landing flex h-screen w-full overflow-hidden bg-canvas font-sans text-primary">

      {/* Left: what you get */}
      <aside className="ink relative hidden h-full w-[46%] max-w-[600px] shrink-0 flex-col justify-between overflow-hidden p-12 lg:flex xl:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--brand-green)]/20 blur-[110px]" aria-hidden="true" />
        <div className="hero-backdrop pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

        <Link to="/" className="relative w-fit rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]" aria-label="RiskRule home">
          <Logo variant="full" size="lg" className="[&>span]:!text-white" />
        </Link>

        <div className="relative my-auto py-10">
          <h1 className="max-w-md font-display text-[40px] font-bold leading-[1.05] tracking-[-0.035em] text-white xl:text-[46px]" style={{ textWrap: 'balance' }}>
            Know exactly where the day went wrong.
          </h1>

          <ul className="mt-9 flex max-w-md flex-col gap-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3.5 text-[15px] leading-6 text-slate-200">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#4ADE80]" aria-hidden="true">
                  <Icon size={16} strokeWidth={1.9} />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-10 max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-[12px] text-slate-400">
              <span>Daily loss limit ₹2,000</span>
              <span>Sample session</span>
            </div>
            <MiniSession />
          </div>
        </div>

        <div className="relative flex items-center gap-3 text-[13px] text-slate-400">
          <span>Syncs with</span>
          {[dhan, angelone, delta].map((src, i) => (
            <img key={i} src={src} alt="" className="h-6 w-auto max-w-[36px] rounded object-contain opacity-90" />
          ))}
        </div>
      </aside>

      {/* Right: the form */}
      <main className="relative flex h-full flex-1 flex-col overflow-y-auto bg-canvas px-5 py-6 sm:px-10">
        <div className="flex w-full shrink-0 items-center justify-between">
          <Link to="/" className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden" aria-label="RiskRule home">
            <Logo variant="full" size="md" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-surface-1 lg:ml-auto"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-[420px] py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8">
                <h2 className="font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-primary">{title}</h2>
                <p className="mt-2 text-[15px] leading-6 text-secondary">{subtitle}</p>
              </div>

              {children}

              <p className={cn('mt-10 border-t border-primary/10 pt-5 text-[12.5px] leading-5 text-tertiary')}>
                By continuing you agree to the{' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-medium text-accent ">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-medium text-accent ">Privacy Policy</Link>.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
