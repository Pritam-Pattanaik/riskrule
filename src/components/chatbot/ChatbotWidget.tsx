import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import ChatWindow from './ChatWindow';
import AnimatedChatIcon from './AnimatedChatIcon';
import { useChatbot } from './useChatbot';

const NUDGE_DISMISSED_KEY = 'riskrule-chatbot-nudge-dismissed';

interface Props {
  /** Raises the mobile FAB so it clears the sticky mobile CTA bar. */
  liftOnMobile?: boolean;
}

/**
 * Floating chatbot widget — an animated dancing/waving robot mascot FAB in the
 * bottom-right that expands into a glass-card chat window.
 *
 * Desktop: 380 × 520 fixed card anchored above the FAB.
 * Mobile : full-screen overlay with safe-area padding.
 */
export default function ChatbotWidget({ liftOnMobile = false }: Props) {
  const { pathname } = useLocation();
  const { isOpen, toggleOpen, messages, isTyping, sendMessage, clearHistory, hasUnread } = useChatbot(pathname);
  const prevPathRef = useRef(pathname);
  const [showNudge, setShowNudge] = useState(false);

  // Show a friendly, dismissible first-visit greeting nudge after a few seconds on desktop
  useEffect(() => {
    if (isOpen) {
      setShowNudge(false);
      return;
    }
    try {
      if (localStorage.getItem(NUDGE_DISMISSED_KEY)) return;
    } catch {
      return;
    }
    const timer = setTimeout(() => {
      if (window.innerWidth >= 768) {
        setShowNudge(true);
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const dismissNudge = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowNudge(false);
    try {
      localStorage.setItem(NUDGE_DISMISSED_KEY, '1');
    } catch { /* ignore */ }
  };

  const handleOpenToggle = () => {
    if (!isOpen) dismissNudge();
    toggleOpen();
  };

  // Close with Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleOpen();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, toggleOpen]);

  // On mobile full-screen overlay, close when navigating via a chat link
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      if (isOpen && window.innerWidth < 768) {
        toggleOpen();
      }
    }
  }, [pathname, isOpen, toggleOpen]);

  return (
    <>
      {/* ── Chat window ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm md:hidden"
              onClick={toggleOpen}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.92 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'bottom right' }}
              className={cn(
                'fixed z-[999] flex flex-col overflow-hidden',
                'rounded-2xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-xl',
                'shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.05)]',
                // Mobile: full-screen overlay
                'top-0 left-0 right-0 bottom-0',
                'max-md:rounded-none max-md:border-0',
                // Desktop: fixed card anchored bottom-right, above the FAB
                'md:top-auto md:left-auto md:right-6 md:bottom-24 md:w-[380px] md:h-[520px]',
              )}
              role="dialog"
              aria-label="Chat with RiskRule Guide"
            >
              <ChatWindow
                messages={messages}
                isTyping={isTyping}
                onSend={sendMessage}
                onClear={clearHistory}
                onClose={toggleOpen}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating action button ──────────────────────────── */}
      <div
        className={cn(
          'fixed right-4 z-[1000] flex items-center gap-3 transition-[bottom] duration-200 sm:bottom-6 sm:right-6',
          liftOnMobile ? 'bottom-20' : 'bottom-5',
        )}
      >
        <motion.button
          onClick={handleOpenToggle}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          className={cn(
            'group peer relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5CFBFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]',
            isOpen
              ? 'border border-white/15 bg-[#0F172A] text-white shadow-[0_12px_36px_-8px_rgb(0_0_0/0.55)] hover:bg-[#1E293B]'
              : 'border border-sky-200/90 bg-white shadow-[0_12px_32px_-6px_rgb(14_116_144/0.32),0_4px_12px_-2px_rgb(15_23_42/0.12)] hover:shadow-[0_16px_40px_-6px_rgb(56_189_248/0.45)]',
          )}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          aria-expanded={isOpen}
        >
          {/* Ambient pulse ring when closed */}
          {!isOpen && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full bg-cyan-400/35"
              style={{ animation: 'chatbot-pulse 2.4s ease-out infinite' }}
              aria-hidden="true"
            />
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex items-center justify-center"
              >
                <X size={22} strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ scale: 0.65, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.65, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex items-center justify-center"
              >
                <AnimatedChatIcon size={54} animated />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Unread badge */}
          {hasUnread && !isOpen && (
            <span className="absolute right-0.5 top-0.5 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
              !
            </span>
          )}
        </motion.button>

        {/* Dismissible proactive greeting nudge (first visit) */}
        <AnimatePresence>
          {!isOpen && showNudge && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-20 hidden items-center gap-1 whitespace-nowrap rounded-full border border-sky-200/90 bg-white/95 py-1.5 pl-3.5 pr-2 text-[12.5px] font-medium text-[#0B4884] shadow-lg backdrop-blur-md transition-colors hover:bg-sky-50 md:flex"
            >
              <button
                type="button"
                onClick={handleOpenToggle}
                className="cursor-pointer rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5CFBFF]"
              >
                Questions about plans or brokers? 👋
              </button>
              <button
                type="button"
                onClick={dismissNudge}
                aria-label="Dismiss chat greeting"
                className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle desktop hover greeting pill when nudge is dismissed */}
        {!isOpen && !showNudge && (
          <div
            className="pointer-events-none absolute right-20 hidden translate-x-2 whitespace-nowrap rounded-full border border-sky-200/80 bg-white/95 px-3.5 py-1.5 text-[12.5px] font-medium text-[#0B4884] opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 md:block"
            aria-hidden="true"
          >
            Hi! Ask me about RiskRule
          </div>
        )}
      </div>
    </>
  );
}
