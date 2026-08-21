import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, Command } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SlashCommand {
  command: string;
  label: string;
  description: string;
  message: string;
}

const SLASH_COMMANDS: SlashCommand[] = [
  { command: '/short',    label: 'Make it shorter',   description: 'Summarize the last response in 2 sentences',      message: 'Give me a 2-sentence summary of your last response.' },
  { command: '/detail',   label: 'Explain more',       description: 'Give a full detailed breakdown',                   message: 'Now give me the full detailed breakdown and analysis.' },
  { command: '/plan',     label: 'Pre-market plan',    description: 'Build my game plan for today',                     message: 'Build my pre-market game plan for today — bias, levels, risk limits, and A+ setups.' },
  { command: '/debrief',  label: 'Post-market debrief',description: 'Score my execution today',                         message: 'Score my execution today — plan adherence, best trade, worst decision, lesson for tomorrow.' },
  { command: '/risk',     label: 'Risk audit',         description: 'Audit my risk management',                         message: 'Run a complete risk audit on my recent trades. Where am I bleeding money?' },
  { command: '/psych',    label: 'Psychology check',   description: 'Diagnose emotional trading patterns',              message: 'Diagnose my psychological trading patterns. What emotional traps am I falling into?' },
  { command: '/perf',     label: 'Performance report', description: 'Full performance statistics',                      message: 'Give me a full performance report — expectancy, profit factor, win rate, and best setups.' },
  { command: '/rules',    label: 'Rules check',        description: 'Which rules am I breaking?',                       message: 'Which of my trading rules have I been breaking most often? Give specific examples.' },
];

// Time-aware rotating placeholders
function getSmartPlaceholder(): string {
  const h = new Date().getHours();
  if (h < 9) return 'Type /plan for your pre-market game plan…';
  if (h < 10) return 'Markets opening — ask about setup criteria or watchlist…';
  if (h < 15) return 'Ask about a specific trade, setup, or market condition…';
  if (h < 16) return 'Type /debrief to review today\'s execution…';
  return 'Ask me anything — trading, finance, psychology, or general questions…';
}

interface Props {
  onSubmit: (content: string) => void;
  onStop: () => void;
  isTyping: boolean;
  hasMessages: boolean;
  disabled?: boolean;
}

export default function SmartInput({ onSubmit, onStop, isTyping, hasMessages, disabled }: Props) {
  const [input, setInput] = useState('');
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  const placeholder = getSmartPlaceholder();

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Detect slash commands
  useEffect(() => {
    if (input.startsWith('/')) {
      const filter = input.slice(1).toLowerCase();
      setSlashFilter(filter);
      setSlashOpen(true);
      setSelectedIndex(0);
    } else {
      setSlashOpen(false);
      setSlashFilter('');
    }
  }, [input]);

  const filteredCommands = SLASH_COMMANDS.filter(
    c => c.command.slice(1).includes(slashFilter) || c.label.toLowerCase().includes(slashFilter)
  );

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping || disabled) return;
    onSubmit(trimmed);
    setInput('');
    setSlashOpen(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const applySlashCommand = (cmd: SlashCommand) => {
    setInput('');
    setSlashOpen(false);
    // Small delay so UI updates before sending
    setTimeout(() => onSubmit(cmd.message), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (slashOpen && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1)); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); return; }
      if (e.key === 'Tab' || (e.key === 'Enter' && slashOpen)) {
        e.preventDefault();
        applySlashCommand(filteredCommands[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') { setSlashOpen(false); return; }
    }
    if (e.key === 'Enter' && !e.shiftKey && !slashOpen) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape' && isTyping) {
      e.preventDefault();
      onStop();
    }
  };

  return (
    <div className="relative w-full">
      {/* Slash command popover */}
      {slashOpen && filteredCommands.length > 0 && (
        <div
          ref={slashRef}
          className="absolute bottom-full left-0 right-0 mb-2 bg-surface-0 border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 z-50"
        >
          <div className="px-3 py-2 border-b border-border/50">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Commands</span>
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filteredCommands.map((cmd, i) => (
              <button
                key={cmd.command}
                onClick={() => applySlashCommand(cmd)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  i === selectedIndex ? "bg-accent/10 text-primary" : "hover:bg-surface-1 text-secondary"
                )}
              >
                <code className={cn("text-[11px] font-mono font-bold shrink-0", i === selectedIndex ? "text-accent" : "text-tertiary")}>
                  {cmd.command}
                </code>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-primary">{cmd.label}</div>
                  <div className="text-[10px] text-tertiary truncate">{cmd.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main input container */}
      <div className={cn(
        "relative rounded-2xl border bg-surface-0 transition-all duration-200 overflow-hidden",
        "shadow-[0_2px_16px_rgba(0,0,0,0.12)]",
        input.length > 0 || isTyping
          ? "border-accent/40 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_2px_16px_rgba(0,0,0,0.12)]"
          : "border-border/60 hover:border-border"
      )}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent px-4 pt-3.5 pb-3 pr-14 text-sm text-primary placeholder:text-tertiary/60 focus:outline-none resize-none min-h-[50px] max-h-[200px] leading-relaxed disabled:opacity-50"
          rows={1}
        />

        {/* Hint row */}
        <div className="flex items-center justify-between px-4 pb-2.5">
          <div className="flex items-center gap-3 text-[10px] text-tertiary/50">
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-surface-1 border border-border rounded text-[9px] font-mono">Enter</kbd>
              <span>send</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-surface-1 border border-border rounded text-[9px] font-mono">Shift+Enter</kbd>
              <span>newline</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-surface-1 border border-border rounded text-[9px] font-mono">/</kbd>
              <span>commands</span>
            </span>
          </div>

          {isTyping ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-2 border border-border text-xs font-semibold text-tertiary hover:text-loss hover:bg-loss/5 hover:border-loss/30 transition-all"
              title="Stop generating (Esc)"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || disabled}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
                input.trim() && !disabled
                  ? "bg-accent text-white shadow-sm shadow-accent/20 hover:bg-accent/90"
                  : "bg-surface-2 text-tertiary cursor-not-allowed opacity-40"
              )}
              title="Send message (Enter)"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-tertiary/40 mt-2">
        Educational mentorship only · Not SEBI registered investment advice
      </p>
    </div>
  );
}
