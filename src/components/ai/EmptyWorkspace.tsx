import React from 'react';
import {
  Brain, Shield, Sparkles, Target, BookOpen, Sunrise,
  TrendingUp, ArrowUpRight
} from 'lucide-react';
import { useTradeStore } from '../../stores/tradeStore';
import { tradeDate, periodBounds, inPeriod } from '../../lib/tradePeriod';
import { formatCurrency } from '../../lib/analytics';
import SmartInput from './SmartInput';
import { useInsightStore } from '../../stores/insightStore';

const QUICK_ACTIONS = [
  {
    mode: 'general',
    title: 'Performance Check',
    prompt: 'Give me a concise performance check — key numbers and the single most important thing to fix.',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    mode: 'risk',
    title: 'Risk Audit',
    prompt: 'Audit my risk management. Where am I bleeding money and what is my biggest exposure right now?',
    icon: <Shield className="w-4 h-4" />,
  },
  {
    mode: 'psychology',
    title: 'Mental Edge',
    prompt: 'What is my biggest psychological trap right now? Give me a concrete protocol to fix it.',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    mode: 'premarket',
    title: 'Pre-Market Plan',
    prompt: 'Build my pre-market game plan — directional bias, key levels, A+ setup criteria, and risk limits.',
    icon: <Sunrise className="w-4 h-4" />,
  },
  {
    mode: 'strategy',
    title: 'Strategy Review',
    prompt: 'Which of my trading setups has the strongest edge and which ones are costing me money?',
    icon: <Target className="w-4 h-4" />,
  },
  {
    mode: 'postmarket',
    title: 'Debrief Today',
    prompt: 'Score my execution today — plan adherence, best decision, worst decision, and key lesson.',
    icon: <BookOpen className="w-4 h-4" />,
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

  const today = periodBounds('today');
  const closed = trades.filter(t => t.status !== 'OPEN' && inPeriod(tradeDate(t), today));
  const net = closed.reduce((sum, trade) => sum + trade.netPnl, 0);
  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div><h2 className="text-2xl font-semibold">Start a conversation</h2>
          <p className="desk-description">Review a session, a trading rule or a strategy from your journal.</p></div>
        {closed.length > 0 && <p className="rounded-lg border border-border bg-surface-1 px-4 py-3 text-sm">
          Today · {closed.length} closed {closed.length === 1 ? 'trade' : 'trades'} · <strong>{formatCurrency(net)}</strong> net P&amp;L</p>}
        <div className="grid gap-2 sm:grid-cols-2">{QUICK_ACTIONS.map(action =>
          <button key={action.mode} disabled={isTyping} onClick={() => onSelectAction(action.prompt, action.mode)}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-left text-sm font-medium hover:border-accent">
            <span className="text-accent">{action.icon}</span>{action.title}<ArrowUpRight size={14} className="ml-auto text-tertiary" />
          </button>)}</div>
      </div>
    </div>
    <div className="border-t border-border bg-surface p-4"><div className="mx-auto max-w-2xl">
      <SmartInput onSubmit={text => sendMessage(text)} onStop={stopGeneration} isTyping={isTyping} hasMessages={false} />
    </div></div>
  </div>;
}
