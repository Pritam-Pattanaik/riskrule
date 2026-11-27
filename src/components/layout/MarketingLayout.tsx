import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { useUIStore } from '../../stores/uiStore';
import BetaModal from '../marketing/BetaModal';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import { container, btnPrimary } from '../marketing/MarketingBits';

const navLinks = [
  { name: 'Workspace', path: '/workspace' },
  { name: 'Features', path: '/features' },
  { name: 'AI coach', path: '/ai-coach' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'FAQ', path: '/faq' },
];

const footerColumns = [
  {
    title: 'Product',
    links: [
      { name: 'Workspace', to: '/workspace' },
      { name: 'Features', to: '/features' },
      { name: 'AI coach', to: '/ai-coach' },
      { name: 'For funded traders', to: '/prop-traders' },
      { name: 'Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'FAQ', to: '/faq' },
      { name: 'Changelog', to: '/changelog' },
    ],
  },
  { title: 'Company', links: [{ name: 'About', to: '/about' }] },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy', to: '/privacy' },
      { name: 'Terms', to: '/terms' },
    ],
  },
];

const quietLink =
  'text-sm font-medium text-secondary transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md';

export default function MarketingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const location = useLocation();
  const { token } = useAuthStore();
  const { setBetaModalOpen } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
      setPastHero(window.scrollY > 720);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="landing flex min-h-screen flex-col overflow-x-hidden bg-canvas text-primary">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2">
        Skip to main content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-16 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-200',
          scrolled
            ? 'border-primary/10 bg-canvas/85 shadow-[0_1px_0_rgb(15_23_42/0.02),0_8px_24px_-12px_rgb(15_23_42/0.12)]'
            : 'border-transparent bg-canvas/60'
        )}
      >
        <div className={cn(container, 'flex h-full items-center justify-between gap-6')}>
          <Link to="/" className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="RiskRule home">
            <Logo variant="full" size="md" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={cn(
                  quietLink,
                  'relative px-3 py-2',
                  'after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--brand-green)] after:transition-transform after:duration-200',
                  isActive(link.path) && 'text-primary after:scale-x-100'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            {token ? (
              <Link to="/app" className={cn(btnPrimary, 'h-10 px-4 text-sm')}>Open app</Link>
            ) : (
              <>
                <button onClick={() => setBetaModalOpen(true)} className={cn(quietLink, 'hidden px-3 py-2 xl:inline')}>
                  Join the beta
                </button>
                <Link to="/login" className={cn(quietLink, 'px-3 py-2')}>Sign in</Link>
                <Link to="/signup" className={cn(btnPrimary, 'h-10 px-4 text-sm')}>Start free</Link>
              </>
            )}
          </div>

          <button
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="touch-target -mr-2 rounded-xl p-2 text-secondary transition-colors lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-canvas px-5 pb-10 pt-24 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between border-b border-primary/10 py-4 font-display text-[28px] font-semibold leading-none tracking-tight text-secondary transition-colors ',
                    isActive(link.path) && 'text-primary'
                  )}
                >
                  {link.name}
                  <ArrowRight size={18} className="text-tertiary" aria-hidden="true" />
                </Link>
              ))}
            </nav>

            <div className="mt-10 flex flex-col gap-3">
              {token ? (
                <Link to="/app" onClick={() => setMobileMenuOpen(false)} className={cn(btnPrimary, 'w-full')}>
                  Open app
                </Link>
              ) : (
                <>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className={cn(btnPrimary, 'w-full')}>
                    Start free
                  </Link>
                  <div className="flex items-center justify-center gap-6 pt-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={quietLink}>Sign in</Link>
                    <button
                      onClick={() => { setMobileMenuOpen(false); setBetaModalOpen(true); }}
                      className={quietLink}
                    >
                      Join the beta
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" tabIndex={-1} className="mt-16 flex-1 scroll-mt-16 outline-none">
        <Outlet />
      </main>

      <footer className="ink" aria-label="Site">
        <div className={cn(container, 'grid grid-cols-2 gap-x-8 gap-y-10 py-16 md:grid-cols-[1.6fr_repeat(4,1fr)]')}>
          <div className="col-span-2 md:col-span-1">
            <Logo variant="full" size="md" className="[&>span]:!text-white" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              The trading journal that checks every session against your own rules. Built for Indian traders.
            </p>
            {!token && (
              <Link to="/signup" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-green)] transition-colors ">
                Start free <ArrowRight size={15} aria-hidden="true" />
              </Link>
            )}
          </div>

          {footerColumns.map(col => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="rounded-md text-sm text-slate-400 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ink-line border-t">
          <div className={cn(container, 'flex flex-col gap-3 py-6 pb-24 text-[13px] leading-5 text-slate-400 sm:pb-6')}>
            <p>
              RiskRule is a journaling, analytics and AI-coaching tool. It is not a broker or an investment adviser, and
              nothing here is a recommendation to trade. Trading involves risk of loss.
            </p>
            <p>© 2026 RiskRule, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Phones only: a persistent way to start once the hero has scrolled away. */}
      <AnimatePresence>
        {!token && pastHero && !mobileMenuOpen && !location.pathname.startsWith('/privacy') && !location.pathname.startsWith('/terms') && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-primary/10 bg-canvas/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden"
          >
            <Link to="/signup" className={cn(btnPrimary, 'w-full')}>Start free</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <BetaModal />
      <ChatbotWidget
        liftOnMobile={!token && pastHero && !mobileMenuOpen && !location.pathname.startsWith('/privacy') && !location.pathname.startsWith('/terms')}
      />
    </div>
  );
}
