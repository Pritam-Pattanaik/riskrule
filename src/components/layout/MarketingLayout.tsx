import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Menu, X, Shield, Terminal, Sparkles, Activity, ArrowRight, 
  ExternalLink, CheckCircle2, ChevronRight, Cpu, Lock, Layers
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/cn';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Logo } from '../ui/Logo';

export default function MarketingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { token } = useAuthStore();
  const shouldReduceMotion = useReducedMotion();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Trap focus and lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Workspace', path: '/workspace', badge: null },
    { name: 'Features', path: '/features', badge: null },
    { name: 'AI Coach', path: '/ai-coach', badge: 'AI' },
    { name: 'Prop Traders', path: '/prop-traders', badge: 'PROP' },
    { name: 'Investment', path: '/pricing', badge: null },
    { name: 'FAQ', path: '/faq', badge: null },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div id="main-content" className="flex flex-col min-h-screen bg-canvas text-primary font-sans overflow-x-hidden selection:bg-iris/25">
      
      {/* ── Sleek Glassmorphic Floating Navigation Bar ── */}
      <header
        className={cn(
          "fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 h-14 sm:h-[62px] z-50 flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ease-out rounded-full border w-[95%] max-w-[1200px]",
          scrolled 
            ? "bg-surface-1/90 backdrop-blur-2xl border-border-hover shadow-[0_8px_32px_rgba(0,0,0,0.5)]" 
            : "bg-surface-0/70 backdrop-blur-xl border-border/60 shadow-lg"
        )}
        aria-label="Main Navigation"
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group outline-none focus-ring rounded-xl shrink-0">
          <Logo variant="full" size="md" />
        </Link>

        {/* Desktop Navigation Routes with Animated Active Pill */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-surface-1/50 border border-border/40" aria-label="Main Navigation">
          {navLinks.map(link => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 outline-none focus-ring",
                  active 
                    ? "text-primary font-bold shadow-xs" 
                    : "text-secondary hover:text-primary hover:bg-surface-2/60"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute inset-0 bg-surface-2/90 border border-border-hover rounded-full -z-10 shadow-sm"
                  />
                )}
                <span>{link.name}</span>
                {link.badge && (
                  <span className={cn(
                    "text-[9px] font-mono-stat font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider",
                    link.badge === 'AI' 
                      ? "bg-iris/20 text-iris border border-iris/30" 
                      : "bg-gold/20 text-gold border border-gold/30"
                  )}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Live System Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1/70 border border-border/60 text-[11px] font-mono-stat text-tertiary">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="font-semibold text-primary">MARKETS LIVE</span>
          </div>

          {token ? (
            <Link
              to="/app"
              className="inline-flex items-center justify-center h-9 px-5 rounded-full bg-primary text-canvas text-xs font-bold hover:opacity-95 transition-all shadow-sm focus-ring"
            >
              Launch Terminal
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-semibold text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg focus-ring"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-gradient-to-r from-accent to-iris text-white text-xs font-bold hover:opacity-95 transition-all shadow-md shadow-accent/20 focus-ring"
              >
                <span>Get Started</span>
                <ArrowRight size={13} className="opacity-90" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="lg:hidden touch-target p-2 text-secondary hover:text-primary transition-colors rounded-xl focus-ring"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ── Accessible Mobile Menu Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            ref={mobileMenuRef}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-x-0 top-0 h-screen bg-canvas/98 backdrop-blur-3xl z-40 pt-24 px-6 pb-12 flex flex-col justify-between border-b border-border overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-mono-stat uppercase tracking-wider text-tertiary px-3 mb-1">
                Navigation Directory
              </p>
              <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
                {navLinks.map((link, idx) => {
                  const active = isActive(link.path);
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "text-base font-display font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-between border",
                          active
                            ? "bg-surface-2 text-primary border-border-hover shadow-xs"
                            : "text-secondary hover:text-primary hover:bg-surface-1 border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span>{link.name}</span>
                          {link.badge && (
                            <span className="text-[9px] font-mono-stat font-extrabold px-2 py-0.5 rounded bg-iris/20 text-iris border border-iris/30">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <ChevronRight size={16} className="text-tertiary" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 gap-2 text-xs font-medium text-tertiary">
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-surface-1 hover:text-primary">
                  About RiskRule
                </Link>
                <Link to="/changelog" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-surface-1 hover:text-primary flex items-center justify-between">
                  <span>Changelog</span>
                  <span className="text-[9px] px-1 bg-accent/20 text-accent font-bold rounded">v2.4</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-border">
              {token ? (
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[48px] inline-flex items-center justify-center bg-primary text-canvas rounded-xl font-bold text-base shadow-md"
                >
                  Launch Terminal
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full min-h-[48px] inline-flex items-center justify-center bg-surface-1 border border-border text-primary rounded-xl font-semibold text-base"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full min-h-[48px] inline-flex items-center justify-center bg-gradient-to-r from-accent to-iris text-white rounded-xl font-bold text-base shadow-md shadow-accent/20"
                  >
                    Start Free (No CC Required)
                  </Link>
                </>
              )}

              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-tertiary font-medium">
                <Shield size={14} className="text-success" />
                <span>Bank-Grade Read-Only OAuth Security</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Content ── */}
      <main className="flex-1 mt-14 sm:mt-16">
        <Outlet />
      </main>

      {/* ── Institutional Modern SaaS Footer ── */}
      <footer className="border-t border-border bg-surface-0/90 pt-20 pb-12 px-6 lg:px-12 text-secondary" aria-label="Institutional resources">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 pb-14 border-b border-border/60">
          
          {/* Column 1: Brand, Description, Socials (2 cols) */}
          <div className="col-span-2 lg:col-span-2 flex flex-col justify-between gap-8 pr-4">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <Logo variant="full" size="md" />
              </div>
              <p className="text-[13px] text-tertiary max-w-sm leading-relaxed font-medium">
                The institutional quantitative trading workspace engineered for funded prop traders and rule-based discretionary desks. Replace emotional willpower with mathematically verified discipline.
              </p>
              
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1 border border-border w-fit shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <span className="text-[11px] font-semibold text-primary">All Execution Engines Operational</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-bold text-primary tracking-wide uppercase font-mono-stat">Platform</p>
            <ul className="space-y-3 text-[13px] font-medium text-tertiary">
              <li><Link to="/workspace" className="hover:text-primary transition-colors">Trading Terminal</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/ai-coach" className="hover:text-primary transition-colors flex items-center gap-1.5">AI Coach <span className="px-1.5 py-0.2 rounded bg-iris/20 text-iris text-[9px] font-bold">SMART</span></Link></li>
              <li><Link to="/prop-traders" className="hover:text-primary transition-colors">Prop Firm Tracker</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Investment Plans</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-bold text-primary tracking-wide uppercase font-mono-stat">Resources</p>
            <ul className="space-y-3 text-[13px] font-medium text-tertiary">
              <li><Link to="/faq" className="hover:text-primary transition-colors">Knowledge Vault &amp; FAQ</Link></li>
              <li><Link to="/changelog" className="hover:text-primary transition-colors flex items-center gap-1.5">Changelog <span className="px-1.5 py-0.2 rounded bg-surface-2 text-[9px] font-bold text-primary">v2.4</span></Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Broker Sync Status</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Drawdown Calculator</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-bold text-primary tracking-wide uppercase font-mono-stat">Company</p>
            <ul className="space-y-3 text-[13px] font-medium text-tertiary">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Quantitative Research</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Institutional Partners</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security Architecture</a></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-bold text-primary tracking-wide uppercase font-mono-stat">Legal &amp; Trust</p>
            <ul className="space-y-3 text-[13px] font-medium text-tertiary">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">SOC-2 Compliance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Read-Only API Protocol</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Preferences</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-[12px] text-tertiary font-medium">
          <p>© 2026 RiskRule, Inc. Designed and engineered for high-frequency discipline.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-secondary font-semibold hidden sm:inline-block">Discipline Over Dopamine</span>
            <span className="hidden sm:inline-block">·</span>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
