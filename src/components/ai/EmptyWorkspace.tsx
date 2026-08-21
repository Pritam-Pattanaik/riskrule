import React from 'react';
import {
  Brain, Shield, Sparkles, Target, BookOpen, Sunrise,
  TrendingUp, ArrowUpRight
} from 'lucide-react';
import { useTradeStore } from '../../stores/tradeStore';
import { isToday } from 'date-fns';
import { cn } from '../../lib/cn';
import SmartInput from './SmartInput';
import { useInsightStore } from '../../stores/insightStore';

const QUICK_ACTIONS = [
  {
    mode: 'general',
    title: 'Performance Check',
    prompt: 'Give me a concise performance check — key numbers and the single most important thing to fix.',
    icon: <TrendingUp className="w-4 h-4" />,
    accent: 'group-hover:border-accent/40 group-hover:bg-accent/5',
    iconColor: 'text-accent',
  },
  {
    mode: 'risk',
    title: 'Risk Audit',
    prompt: 'Audit my risk management. Where am I bleeding money and what is my biggest exposure right now?',
    icon: <Shield className="w-4 h-4" />,
    accent: 'group-hover:border-red-500/40 group-hover:bg-red-500/5',
    iconColor: 'text-red-400',
  },
  {
    mode: 'psychology',
    title: 'Mental Edge',
    prompt: 'What is my biggest psychological trap right now? Give me a concrete protocol to fix it.',
    icon: <Sparkles className="w-4 h-4" />,
    accent: 'group-hover:border-purple-500/40 group-hover:bg-purple-500/5',
    iconColor: 'text-purple-400',
  },
  {
    mode: 'premarket',
    title: 'Pre-Market Plan',
    prompt: 'Build my pre-market game plan — directional bias, key levels, A+ setup criteria, and risk limits.',
    icon: <Sunrise className="w-4 h-4" />,
    accent: 'group-hover:border-amber-500/40 group-hover:bg-amber-500/5',
    iconColor: 'text-amber-400',
  },
  {
    mode: 'strategy',
    title: 'Strategy Review',
    prompt: 'Which of my trading setups has the strongest edge and which ones are costing me money?',
    icon: <Target className="w-4 h-4" />,
    accent: 'group-hover:border-blue-500/40 group-hover:bg-blue-500/5',
    iconColor: 'text-blue-400',
  },
  {
    mode: 'postmarket',
    title: 'Debrief Today',
    prompt: 'Score my execution today — plan adherence, best decision, worst decision, and key lesson.',
    icon: <BookOpen className="w-4 h-4" />,
    accent: 'group-hover:border-violet-500/40 group-hover:bg-violet-500/5',
    iconColor: 'text-violet-400',
  },
];

interface Props {
  onSelectAction: (prompt: string, mode?: string) => void;
}

export default function EmptyWorkspace({ onSelectAction }: Props) {
  const { trades } = useTradeStore();
  const isTyping = useInsightStore(s => s.isTyping);
  const stopGeneration = useInsightStore(s => s.stopGeneration);
  const sendMessage = useInsightStore(s => s.sendMessage);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todaysTrades = trades.filter(t => isToday(new Date(t.date)));
  const todaysPnl = todaysTrades.reduce((sum, t) => sum + (t.netPnl || 0), 0);
  const wins = todaysTrades.filter(t => (t.netPnl || 0) > 0).length;
  const winRate = todaysTrades.length > 0 ? Math.round((wins / todaysTrades.length) * 100) : null;
  const hasData = todaysTrades.length > 0;

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center justify-center min-h-full px-4 py-8">
          <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500">

            {/* Brain icon + greeting */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                <Brain className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-xl font-bold text-primary tracking-tight mb-1">{greeting}</h1>
              <p className="text-sm text-tertiary">
                {hasData
                  ? `${todaysTrades.length} trade${todaysTrades.length !== 1 ? 's' : ''} logged today. What would you like to review?`
                  : 'Ask me anything — trading, finance, psychology, or general questions.'
                }
              </p>
            </div>

            {/* Today's stats — only if data exists */}
            {hasData && (
              <div className="flex items-center gap-3 justify-center mb-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-0 border border-border shadow-sm">
                  <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">P&L</span>
                  <span className={cn("text-sm font-bold font-mono", todaysPnl >= 0 ? "text-success" : "text-loss")}>
                    {todaysPnl >= 0 ? '+' : ''}₹{Math.abs(todaysPnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                {winRate !== null && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-0 border border-border shadow-sm">
                    <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Win%</span>
                    <span className={cn("text-sm font-bold font-mono", winRate >= 50 ? "text-success" : "text-warning")}>
                      {winRate}%
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-0 border border-border shadow-sm">
                  <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Trades</span>
                  <span className="text-sm font-bold font-mono text-primary">{todaysTrades.length}</span>
                </div>
              </div>
            )}

            {/* Quick actions grid */}
            <div className="mb-6">
              <p className="text-[9px] font-bold text-tertiary uppercase tracking-widest mb-3 text-center">Quick diagnostics</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action.mode}
                    onClick={() => onSelectAction(action.prompt, action.mode)}
                    className={cn(
                      "group flex flex-col items-start gap-2 p-3 rounded-xl border border-border bg-surface-0",
                      "text-left transition-all duration-200 hover:shadow-sm hover:-translate-y-px",
                      action.accent
                    )}
                  >
                    <div className={cn("w-7 h-7 rounded-lg bg-surface-1 flex items-center justify-center transition-colors group-hover:bg-transparent", action.iconColor)}>
                      {action.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-primary leading-tight">{action.title}</div>
                    </div>
                    <ArrowUpRight className={cn("w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all -mt-1 self-end", action.iconColor)} />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Input pinned to bottom */}
      <div className="shrink-0 px-4 pb-4 pt-3 bg-gradient-to-t from-canvas via-canvas/98 to-transparent">
        <div className="max-w-xl mx-auto">
          <SmartInput
            onSubmit={(text) => sendMessage(text)}
            onStop={stopGeneration}
            isTyping={isTyping}
            hasMessages={false}
          />
        </div>
      </div>
    </div>
  );
}
