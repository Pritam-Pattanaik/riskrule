import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Send, Trash2, ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import AnimatedChatIcon from './AnimatedChatIcon';
import ChatMessage from './ChatMessage';
import QuickReplies from './QuickReplies';
import TypingIndicator from './TypingIndicator';
import type { ChatMessage as Msg } from './useChatbot';

interface Props {
  messages: Msg[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
  onClose?: () => void;
}

export default function ChatWindow({ messages, isTyping, onSend, onClear, onClose }: Props) {
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Focus input on desktop when opened
  useEffect(() => {
    if (window.innerWidth >= 768) {
      const id = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(id);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive (only if user is near bottom)
  useEffect(() => {
    const el = bodyRef.current;
    if (!el || !isNearBottom) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [messages, isTyping, isNearBottom]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const threshold = 80;
    setIsNearBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    onSend(trimmed);
    setInput('');
    inputRef.current?.focus();
  };

  const handleQuickReply = (text: string) => {
    if (isTyping) return;
    onSend(text);
    inputRef.current?.focus();
  };

  // Find the last bot message's followUps
  const lastBotMsg = [...messages].reverse().find((m) => m.role === 'bot');
  const showFollowUps = !isTyping && lastBotMsg?.followUps?.length;

  return (
    <div className="relative flex h-full flex-col">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-sky-200/80 bg-white shadow-sm">
            <AnimatedChatIcon size={30} animated />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0F172A] bg-[var(--brand-green)]" />
          </span>
          <div>
            <p className="text-[13px] font-semibold leading-none text-white">RiskRule Guide</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {isTyping ? 'Thinking…' : 'Always online · Ask anything'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] md:hidden"
              aria-label="Close chat"
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </div>

      {/* ── Messages body ───────────────────────────────────── */}
      <div
        ref={bodyRef}
        onScroll={handleScroll}
        className="chatbot-scrollbar flex-1 space-y-4 overflow-y-auto px-3 py-4"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Follow-up quick replies after the last bot message */}
        {showFollowUps && (
          <QuickReplies replies={lastBotMsg!.followUps!} onSelect={handleQuickReply} />
        )}
      </div>

      {/* Scroll-to-bottom button */}
      {!isNearBottom && (
        <button
          onClick={() => {
            bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
          }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-white/15 p-1.5 text-white backdrop-blur transition-all hover:bg-white/25"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={16} />
        </button>
      )}

      {/* ── Input ───────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 px-3 py-3"
      >
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 transition-colors focus-within:border-[var(--brand-green)]/40">
          <input
            ref={inputRef}
            type="text"
            value={input}
            maxLength={400}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pricing, brokers, Lunar AI…"
            className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-slate-500"
            aria-label="Type your question"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150',
              input.trim() && !isTyping
                ? 'bg-[var(--brand-green)] text-[#0F172A] hover:bg-[var(--brand-green)]/80 active:scale-95'
                : 'cursor-not-allowed text-slate-500',
            )}
            aria-label="Send message"
          >
            <Send size={13} strokeWidth={2.5} />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-slate-500">
          Powered by RiskRule · <Link to="/faq" className="underline underline-offset-2 hover:text-slate-300">Full FAQ</Link> · <Link to="/signup" className="underline underline-offset-2 hover:text-slate-300">Start free</Link>
        </p>
      </form>
    </div>
  );
}
