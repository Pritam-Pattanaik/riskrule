import React from 'react';
import { Target, TrendingUp, Activity, BarChart2, Zap, Brain, ShieldAlert } from 'lucide-react';
import { useTradeStore } from '../../stores/tradeStore';
import { useInsightStore } from '../../stores/insightStore';
import { isToday } from 'date-fns';
import { cn } from '../../lib/cn';
import { formatCurrency } from '../../lib/analytics';

export default function AIInsightsPanel() {
  const { trades, dailySummaries } = useTradeStore();
  const { coachMemory } = useInsightStore();
  
  // Calculate Today's P&L and Win Rate
  const todaysTrades = trades.filter(t => isToday(new Date(t.date)));
  const todaysPnl = todaysTrades.reduce((sum, t) => sum + (t.netPnl || 0), 0);
  const todaysWins = todaysTrades.filter(t => (t.netPnl || 0) > 0).length;
  const todaysWinRate = todaysTrades.length > 0 ? Math.round((todaysWins / todaysTrades.length) * 100) : 0;
  
  // Get today's discipline score from summaries (mapped to canonical 1-5 scale)
  const todayKey = new Date().toISOString().split('T')[0];
  const rawDiscipline = dailySummaries[todayKey]?.averageDiscipline || 0;
  const todaysDiscipline = rawDiscipline > 5 ? (rawDiscipline / 2).toFixed(1) : (rawDiscipline || 4.5);

  const getPnlColor = (pnl: number) => {
    if (pnl > 0) return 'text-success';
    if (pnl < 0) return 'text-loss';
    return 'text-secondary';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-success';
    if (score >= 2.5) return 'text-warning';
    return 'text-loss';
  };

  return (
    <div className="flex flex-col h-full w-[280px] bg-surface-0 border-l border-border shrink-0 animate-in slide-in-from-right-4 duration-300 hidden lg:flex">
      <div className="p-4 border-b border-border bg-surface-0/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-sm font-bold text-primary flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          Live Insights
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        
        {/* Today's Performance */}
        <div>
          <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Today's Session</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-1 rounded-xl p-3 border border-border">
              <div className="flex items-center gap-1.5 mb-1 text-tertiary">
                <Target className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Net P&L</span>
              </div>
              <div className={cn("text-lg font-bold truncate", getPnlColor(todaysPnl))}>
                {todaysPnl >= 0 ? '+' : ''}{formatCurrency(todaysPnl)}
              </div>
            </div>
            
            <div className="bg-surface-1 rounded-xl p-3 border border-border">
              <div className="flex items-center gap-1.5 mb-1 text-tertiary">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Win Rate</span>
              </div>
              <div className="text-lg font-bold text-primary">
                {todaysWinRate}%
              </div>
            </div>
          </div>
        </div>

        {/* Behavioral Metrics */}
        <div>
          <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Behavior & Discipline</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface-1 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                  <BarChart2 className="w-3.5 h-3.5 text-accent" />
                </div>
                <span className="text-xs font-bold text-secondary">Discipline Score</span>
              </div>
              <span className={cn("text-sm font-bold", getScoreColor(Number(todaysDiscipline)))}>
                {todaysDiscipline}/5
              </span>
            </div>

            {/* Active Coach Memories / Patterns */}
            {coachMemory && coachMemory.length > 0 && (
              <div className="p-3 bg-surface-1 rounded-xl border border-border space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-warning" />
                  <span className="text-xs font-bold text-secondary">Active Patterns</span>
                </div>
                <div className="space-y-1.5">
                  {coachMemory.slice(0, 2).map((m: any) => (
                    <div key={m.id} className="text-[11px] bg-surface-2 p-1.5 rounded text-secondary flex items-center justify-between">
                      <span className="truncate max-w-[170px] font-medium">{m.title}</span>
                      <span className={cn(
                        "text-[9px] font-bold px-1 py-0.5 rounded",
                        m.severity === 'critical' ? 'bg-loss/20 text-loss' : 'bg-warning/20 text-warning'
                      )}>
                        {m.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Trades Snippet */}
        <div>
          <h3 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Recent Executions</h3>
          <div className="space-y-2">
            {todaysTrades.slice(0, 3).map(trade => (
              <div key={trade.id} className="flex items-center justify-between p-2.5 bg-surface-1 rounded-lg border border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0",
                    trade.direction === 'LONG' ? "bg-success/10 text-success" : "bg-loss/10 text-loss"
                  )}>
                    {trade.direction}
                  </span>
                  <span className="text-xs font-bold text-primary truncate">{trade.symbol}</span>
                </div>
                <span className={cn("text-xs font-bold shrink-0", getPnlColor(trade.netPnl))}>
                  {trade.netPnl >= 0 ? '+' : ''}{formatCurrency(trade.netPnl)}
                </span>
              </div>
            ))}
            {todaysTrades.length === 0 && (
              <div className="text-center py-4 text-xs text-tertiary italic">
                No trades executed today.
              </div>
            )}
          </div>
        </div>
        
        {/* AI Next Action */}
        <div className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 blur-2xl rounded-full" />
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-widest">AI Suggestion</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            {todaysPnl < 0 
              ? "Session risk limit active. If drawdown approaches your daily max threshold, take a cooling period." 
              : "Disciplined execution in progress. Protect gains by maintaining standard risk per setup."}
          </p>
        </div>

      </div>
    </div>
  );
}
