import React, { useMemo } from 'react';
import { formatCurrency } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { Trade } from '../../types';
import { Flame, TrendingDown, Zap, Calendar, BarChart2 } from 'lucide-react';

interface StreakAnalyticsProps {
  trades: Trade[];
}

interface DayResult { date: string; pnl: number; count: number }

function computeStreaks(trades: Trade[]) {
  const closed = trades.filter(t => t.status !== 'OPEN');

  // Build daily PnL map
  const dayMap = new Map<string, DayResult>();
  for (const t of closed) {
    const d = t.isCarryForward && t.exitTime ? new Date(t.exitTime) : new Date(t.date);
    const key = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const existing = dayMap.get(key) || { date: key, pnl: 0, count: 0 };
    existing.pnl += t.netPnl;
    existing.count += 1;
    dayMap.set(key, existing);
  }

  const days = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  // Current streak
  let currentStreak = 0;
  let currentType: 'WIN' | 'LOSS' | 'NONE' = 'NONE';
  if (days.length) {
    const lastDay = days[days.length - 1];
    currentType = lastDay.pnl > 0 ? 'WIN' : lastDay.pnl < 0 ? 'LOSS' : 'NONE';
    if (currentType !== 'NONE') {
      for (let i = days.length - 1; i >= 0; i--) {
        const p = days[i].pnl;
        if ((currentType === 'WIN' && p > 0) || (currentType === 'LOSS' && p < 0)) currentStreak++;
        else break;
      }
    }
  }

  // Longest streaks
  let longestWin = 0, longestLoss = 0, run = 0, runType: 'WIN' | 'LOSS' | null = null;
  for (const d of days) {
    const t = d.pnl > 0 ? 'WIN' : d.pnl < 0 ? 'LOSS' : null;
    if (t === null) { run = 0; runType = null; continue; }
    if (t === runType) run++;
    else { run = 1; runType = t; }
    if (t === 'WIN' && run > longestWin) longestWin = run;
    if (t === 'LOSS' && run > longestLoss) longestLoss = run;
  }

  // Consistency
  const greenDays = days.filter(d => d.pnl > 0).length;
  const redDays = days.filter(d => d.pnl < 0).length;
  const consistency = days.length > 0 ? (greenDays / days.length) * 100 : 0;

  // Avg trades per day
  const totalTrades = days.reduce((s, d) => s + d.count, 0);
  const avgPerDay = days.length > 0 ? totalTrades / days.length : 0;

  return { currentStreak, currentType, longestWin, longestLoss, consistency, greenDays, redDays, totalDays: days.length, avgPerDay };
}

export default function StreakAnalytics({ trades }: StreakAnalyticsProps) {
  const stats = useMemo(() => computeStreaks(trades), [trades]);

  if (!trades.length) return (
    <div className="flex items-center justify-center h-[100px] text-sm text-secondary">No trades to analyze</div>
  );

  const streakColor = stats.currentType === 'WIN' ? 'text-success' : stats.currentType === 'LOSS' ? 'text-danger' : 'text-secondary';
  const streakBg = stats.currentType === 'WIN' ? 'bg-success/8 border-success/20' : stats.currentType === 'LOSS' ? 'bg-danger/8 border-danger/20' : 'bg-surface-1 border-border';
  const StreakIcon = stats.currentType === 'WIN' ? Flame : stats.currentType === 'LOSS' ? TrendingDown : Zap;

  const consistencyColor = stats.consistency >= 60 ? 'text-success' : stats.consistency >= 45 ? 'text-warning' : 'text-danger';

  return (
    <div className="space-y-4">
      {/* Current streak hero */}
      <div className={cn('flex items-center gap-4 p-4 rounded-xl border', streakBg)}>
        <div className={cn('flex items-center justify-center w-12 h-12 rounded-xl border', streakBg)}>
          <StreakIcon className={cn('w-6 h-6', streakColor)} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Current Streak</p>
          <p className={cn('text-2xl font-bold font-mono', streakColor)}>
            {stats.currentStreak} {stats.currentType === 'WIN' ? '🔥' : stats.currentType === 'LOSS' ? '📉' : ''}
          </p>
          <p className="text-xs text-secondary mt-0.5">
            {stats.currentType === 'WIN' ? 'Consecutive green days' : stats.currentType === 'LOSS' ? 'Consecutive red days' : 'No active streak'}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            icon: Flame,
            label: 'Longest Win Streak',
            value: `${stats.longestWin} days`,
            color: 'text-success',
            bg: 'bg-surface-1 border-border-subtle',
          },
          {
            icon: TrendingDown,
            label: 'Longest Loss Streak',
            value: `${stats.longestLoss} days`,
            color: 'text-danger',
            bg: 'bg-surface-1 border-border-subtle',
          },
          {
            icon: BarChart2,
            label: 'Consistency Score',
            value: `${stats.consistency.toFixed(0)}%`,
            color: consistencyColor,
            bg: 'bg-surface-1 border-border-subtle',
          },
          {
            icon: Calendar,
            label: 'Green Days',
            value: `${stats.greenDays} / ${stats.totalDays}`,
            color: 'text-success',
            bg: 'bg-surface-1 border-border-subtle',
          },
          {
            icon: Calendar,
            label: 'Red Days',
            value: `${stats.redDays} / ${stats.totalDays}`,
            color: 'text-danger',
            bg: 'bg-surface-1 border-border-subtle',
          },
          {
            icon: Zap,
            label: 'Avg Trades/Day',
            value: stats.avgPerDay.toFixed(1),
            color: 'text-primary',
            bg: 'bg-surface-1 border-border-subtle',
          },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={cn('p-3.5 rounded-xl border', stat.bg)}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-3.5 h-3.5 text-tertiary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary leading-tight">{stat.label}</p>
              </div>
              <p className={cn('text-lg font-bold font-mono', stat.color)}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Consistency bar */}
      <div className="p-3.5 bg-surface-1 rounded-xl border border-border-subtle">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Profitability Consistency</p>
          <span className={cn('text-xs font-bold font-mono', consistencyColor)}>{stats.consistency.toFixed(0)}%</span>
        </div>
        <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
          {Array.from({ length: stats.totalDays }).map((_, i) => {
            // We don't have the raw days array here, use approximation
            const isGreen = i < stats.greenDays;
            const isRed = !isGreen;
            return null; // Skip per-day visualization without raw days — handled by green/red counts
          })}
        </div>
        <div className="flex h-2.5 rounded-full overflow-hidden">
          <div className="bg-success/60 transition-all duration-700 rounded-l-full" style={{ width: `${stats.consistency}%` }} />
          <div className="bg-danger/40 transition-all duration-700 rounded-r-full" style={{ width: `${100 - stats.consistency}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-tertiary mt-1">
          <span>{stats.greenDays} profitable</span>
          <span>{stats.redDays} unprofitable</span>
        </div>
      </div>
    </div>
  );
}
