import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, ArrowLeft, Bug, Lightbulb, Users, Gift, TrendingUp, Headset, Rocket } from 'lucide-react';
import { cn } from '../../lib/cn';

// Embedded Google Form URL
const BETA_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScSw5OH4S0mQyXiguYcPjaRd39m7WvlAdAI-8Pz9FvIcEFZlw/viewform?embedded=true";

export default function BetaModal() {
  const { betaModalOpen, setBetaModalOpen } = useUIStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const shouldReduceMotion = useReducedMotion();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (betaModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      // Reset state slightly after close animation finishes
      const timer = setTimeout(() => {
        setStep(1);
        setIframeLoaded(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [betaModalOpen]);

  const handleClose = () => {
    try {
      localStorage.setItem('betaModalSeen', 'true');
    } catch (e) {
      // Ignore localStorage errors
    }
    setBetaModalOpen(false);
  };

  return (
    <AnimatePresence>
      {betaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Join the Beta">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full bg-surface-0 border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300",
              step === 1 ? "max-w-[640px] max-h-[90vh]" : "max-w-[760px] h-[85vh] max-h-[800px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-surface-1/50 shrink-0">
              {step === 2 ? (
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors focus-ring rounded-lg px-2 py-1 -ml-2"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-iris" />
                  <span className="text-sm font-bold text-primary font-mono-stat uppercase tracking-wider">Join the Beta</span>
                </div>
              )}
              <button
                onClick={handleClose}
                className="p-2 text-secondary hover:text-primary transition-colors focus-ring rounded-xl hover:bg-surface-2 ml-auto"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-6 custom-scrollbar">
              {step === 1 ? (
                <div className="flex flex-col gap-8">
                  <div className="text-center space-y-3 mt-2">
                    <h2 className="text-3xl font-display font-extrabold text-primary tracking-tight">Become a Beta Tester</h2>
                    <p className="text-secondary text-base">Help us shape the trading journal you'll actually want to use.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-surface-1/50 border border-border rounded-xl p-5">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wide font-mono-stat mb-2">What is a beta user?</h3>
                      <p className="text-sm text-tertiary leading-relaxed">
                        A beta user is an early member who gets access to the product before the public launch and helps us improve it with real-world feedback.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide font-mono-stat flex items-center gap-2">
                          <Users size={16} className="text-iris" />
                          What will you do?
                        </h3>
                        <ul className="space-y-3">
                          {[
                            { text: 'Use the journal for your real trades', icon: TrendingUp },
                            { text: 'Report bugs and rough edges you find', icon: Bug },
                            { text: 'Share feedback and feature ideas', icon: Lightbulb },
                            { text: 'Join occasional short feedback calls or surveys', icon: Headset },
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-secondary">
                              <item.icon size={16} className="text-tertiary shrink-0 mt-0.5" />
                              <span className="leading-tight">{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide font-mono-stat flex items-center gap-2">
                          <Gift size={16} className="text-success" />
                          What do you get?
                        </h3>
                        <ul className="space-y-3">
                          {[
                            { text: 'Free early access', icon: Rocket },
                            { text: 'Direct influence on the roadmap', icon: TrendingUp },
                            { text: 'Priority support', icon: Headset },
                            { text: 'Special perks at launch (e.g. discounted/lifetime plan)', icon: Gift },
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-secondary">
                              <item.icon size={16} className="text-success/70 shrink-0 mt-0.5" />
                              <span className="leading-tight">{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 sm:pt-8">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto inline-flex justify-center items-center h-11 px-8 rounded-xl bg-primary text-canvas font-bold text-sm hover:opacity-95 transition-opacity focus-ring shadow-sm"
                    >
                      Fill up the form
                    </button>
                    <button
                      onClick={() => {
                        handleClose();
                        navigate('/login');
                      }}
                      className="w-full sm:w-auto inline-flex justify-center items-center h-11 px-8 rounded-xl text-secondary hover:text-primary font-medium text-sm transition-colors focus-ring"
                    >
                      Don't want
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[400px] flex flex-col bg-white rounded-xl overflow-hidden border border-border">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-0 z-10 gap-3 rounded-xl">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium text-secondary">Loading form...</span>
                    </div>
                  )}
                  <iframe
                    src={BETA_FORM_URL}
                    className="w-full h-full flex-1"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    onLoad={() => setIframeLoaded(true)}
                    title="Beta Form"
                  >
                    Loading…
                  </iframe>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
