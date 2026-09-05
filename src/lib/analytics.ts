import type { Trade, DashboardStats } from '../types';
import { formatCurrency, formatCompactCurrency, formatPercentage as formatPercent } from '../utils/currency';

export { formatCurrency, formatCompactCurrency, formatPercent };

/** Convert any date value to a local-timezone YYYY-MM-DD string.
 *  Using new Date(str).toLocaleDateString ensures the calendar date
 *  matches the user's IST clock, not the UTC offset of the ISO string. */
function getLocalDateKey(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function computeStats(trades: Trade[]): DashboardStats {
  if (trades.length === 0) {
    return { totalPnl: 0, winRate: 0, avgRR: 0, avgDiscipline: 0, totalTrades: 0 };
  }

  const totalPnl = trades.reduce((sum, t) => sum + t.netPnl, 0);

  // Exclude OPEN trades from win rate — they have netPnl=0 but are not wins or losses.
  // Including them deflates win rate artificially.
  const closedTrades = trades.filter(t => t.status !== 'OPEN');
  const wins = closedTrades.filter(t => t.status === 'WIN').length;
  const winRate = closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0;

  const winTrades = closedTrades.filter(t => t.status === 'WIN');
  const lossTrades = closedTrades.filter(t => t.status === 'LOSS');
  const avgWin = winTrades.length > 0 ? winTrades.reduce((s, t) => s + t.netPnl, 0) / winTrades.length : 0;
  const avgLoss = lossTrades.length > 0 ? Math.abs(lossTrades.reduce((s, t) => s + t.netPnl, 0) / lossTrades.length) : 0;
  const avgRR = avgLoss > 0 ? avgWin / avgLoss : (winTrades.length > 0 ? 999 : 0);

  const scoredTrades = trades.filter(t => t.disciplineScore != null);
  const avgDiscipline = scoredTrades.length > 0
    ? scoredTrades.reduce((s, t) => s + (t.disciplineScore ?? 0), 0) / scoredTrades.length
    : 0;

  return { totalPnl, winRate, avgRR, avgDiscipline, totalTrades: trades.length };
}

export function computeCumulativePnl(trades: Trade[]): { date: string; pnl: number }[] {
  const getEffectiveTime = (t: Trade) => t.isCarryForward && t.exitTime ? new Date(t.exitTime).getTime() : new Date(t.date).getTime();
  const sorted = [...trades].sort((a, b) => getEffectiveTime(a) - getEffectiveTime(b));
  let cumulative = 0;
  return sorted.map(t => {
    cumulative += t.netPnl;
    const effectiveDate = t.isCarryForward && t.exitTime ? t.exitTime : t.date;
    return { date: effectiveDate, pnl: cumulative };
  });
}

export function computeStrategyPnl(trades: Trade[]): { name: string; pnl: number }[] {
  const stratMap = new Map<string, number>();
  trades.forEach(t => {
    const name = t.strategyName || 'Untagged';
    stratMap.set(name, (stratMap.get(name) || 0) + t.netPnl);
  });
  return Array.from(stratMap.entries())
    .map(([name, pnl]) => ({ name, pnl }))
    .sort((a, b) => b.pnl - a.pnl);
}

export function computeDisciplineDistribution(trades: Trade[]): { name: string; value: number; color: string }[] {
  const scored = trades.filter(t => t.disciplineScore != null);
  const perfect = scored.filter(t => t.disciplineScore! >= 4).length;
  const good = scored.filter(t => t.disciplineScore === 3).length;
  const poor = scored.filter(t => t.disciplineScore! <= 2).length;

  return [
    { name: 'Perfect (4-5)', value: perfect, color: '#10d990' },
    { name: 'Good (3)', value: good, color: '#f59e0b' },
    { name: 'Poor (1-2)', value: poor, color: '#ff4b6e' },
  ];
}



export function computeCurrentStreak(trades: Trade[]): { type: 'WIN' | 'LOSS' | 'NONE'; count: number } {
  if (trades.length === 0) return { type: 'NONE', count: 0 };
  const sorted = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const dailyPnl = new Map<string, number>();
  sorted.forEach(t => {
    const dateOnly = getLocalDateKey(t.date);
    dailyPnl.set(dateOnly, (dailyPnl.get(dateOnly) || 0) + t.netPnl);
  });
  
  const days = Array.from(dailyPnl.entries()).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  if (days.length === 0) return { type: 'NONE', count: 0 };

  const currentType = days[0][1] > 0 ? 'WIN' : days[0][1] < 0 ? 'LOSS' : 'NONE';
  if (currentType === 'NONE') return { type: 'NONE', count: 0 };

  let count = 0;
  for (const [, pnl] of days) {
    if ((currentType === 'WIN' && pnl > 0) || (currentType === 'LOSS' && pnl < 0)) {
      count++;
    } else {
      break;
    }
  }

  return { type: currentType, count };
}
