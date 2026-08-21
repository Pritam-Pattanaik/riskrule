import React from 'react';
import { formatCurrency, formatPercent } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { MonthlySummaryEntry } from '../../stores/analyticsStore';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MonthlySummaryProps {
  data: MonthlySummaryEntry[];
  loading?: boolean;
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export default function MonthlySummary({ data, loading }: MonthlySummaryProps) {
  if (loading) return <div className="h-[200px] bg-surface-1 rounded-lg animate-pulse" />;
  if (!data.length) return (
    <div className="flex items-center justify-center h-[120px] text-sm text-secondary">No monthly data available</div>
  );

  // Compute mom change
  const withChange = data.map((entry, i) => {
    const prev = i > 0 ? data[i - 1].pnl : null;
    const change = prev !== null ? entry.pnl - prev : null;
    return { ...entry, momChange: change };
  });

  // Running totals
  const totalPnl = data.reduce((s, d) => s + d.pnl, 0);
  const totalCharges = data.reduce((s, d) => s + d.charges, 0);
  const bestMonth = data.reduce((best, d) => (!best || d.pnl > best.pnl) ? d : best, data[0]);
  const worstMonth = data.reduce((worst, d) => (!worst || d.pnl < worst.pnl) ? d : worst, data[0]);
  const profitableMonths = data.filter(d => d.pnl > 0).length;

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Net P&L', value: formatCurrency(totalPnl), color: totalPnl >= 0 ? 'text-success' : 'text-danger' },
          { label: 'Green Months', value: `${profitableMonths} / ${data.length}`, color: 'text-primary' },
          { label: 'Best Month', value: formatCurrency(bestMonth.pnl), color: 'text-success' },
          { label: 'Total Charges', value: formatCurrency(totalCharges), color: 'text-warning' },
        ].map(stat => (
          <div key={stat.label} className="p-3 bg-surface-1 rounded-lg border border-border-subtle">
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{stat.label}</p>
            <p className={cn('text-sm font-bold font-mono mt-0.5', stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[560px]">
          <thead>
            <tr className="border-b border-border">
              {['Month', 'Trades', 'Win %', 'Gross P&L', 'Charges', 'Net P&L', 'MoM'].map(h => (
                <th key={h} className="text-left py-2 pr-4 text-[10px] font-bold uppercase tracking-widest text-tertiary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...withChange].reverse().map((d, i) => {
              const isGreen = d.pnl > 0;
              const isRed = d.pnl < 0;
              const MomIcon = d.momChange === null ? Minus : d.momChange > 0 ? TrendingUp : TrendingDown;
              const momColor = d.momChange === null ? 'text-tertiary' : d.momChange > 0 ? 'text-success' : 'text-danger';
              return (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-border-subtle transition-colors',
                    isGreen ? 'hover:bg-success/4' : isRed ? 'hover:bg-danger/4' : 'hover:bg-surface-1'
                  )}
                >
                  <td className="py-2.5 pr-4 font-semibold text-primary">{monthLabel(d.month)}</td>
                  <td className="py-2.5 pr-4 font-mono text-secondary">{d.count}</td>
                  <td className="py-2.5 pr-4 font-mono font-bold text-primary">{formatPercent(d.winRate)}</td>
                  <td className={cn('py-2.5 pr-4 font-mono', isGreen ? 'text-success' : isRed ? 'text-danger' : 'text-secondary')}>
                    {d.grossPnl >= 0 ? '+' : ''}{formatCurrency(d.grossPnl)}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-warning">{formatCurrency(d.charges)}</td>
                  <td className={cn('py-2.5 pr-4 font-mono font-bold', isGreen ? 'text-success' : isRed ? 'text-danger' : 'text-secondary')}>
                    {d.pnl >= 0 ? '+' : ''}{formatCurrency(d.pnl)}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={cn('flex items-center gap-1 text-[10px] font-mono font-semibold', momColor)}>
                      <MomIcon className="w-3 h-3" />
                      {d.momChange !== null ? `${d.momChange >= 0 ? '+' : ''}${formatCurrency(d.momChange)}` : '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border">
              <td className="py-2.5 pr-4 font-bold text-primary text-xs">Total</td>
              <td className="py-2.5 pr-4 font-mono font-bold text-primary">{data.reduce((s, d) => s + d.count, 0)}</td>
              <td className="py-2.5 pr-4 font-mono text-tertiary">—</td>
              <td className="py-2.5 pr-4 font-mono font-bold text-primary">{formatCurrency(data.reduce((s, d) => s + d.grossPnl, 0))}</td>
              <td className="py-2.5 pr-4 font-mono font-bold text-warning">{formatCurrency(totalCharges)}</td>
              <td className={cn('py-2.5 pr-4 font-mono font-bold', totalPnl >= 0 ? 'text-success' : 'text-danger')}>
                {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
