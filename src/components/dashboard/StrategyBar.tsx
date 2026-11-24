import React from 'react';
import { formatCurrency } from '../../lib/analytics';
import { cn } from '../../lib/cn';

interface StrategyBarProps {
  data: { name: string; pnl: number }[];
}

const MAX_ROWS = 6;

/**
 * Strategies ranked by net P&L. A ranked list with thin bars, so it reads
 * as a different kind of block from the equity curve above it.
 */
export default React.memo(function StrategyBar({ data }: StrategyBarProps) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-secondary">No strategies traded yet</p>;
  }

  const rows = [...data].sort((a, b) => b.pnl - a.pnl).slice(0, MAX_ROWS);
  const maxAbs = Math.max(...rows.map(r => Math.abs(r.pnl)), 1);

  return (
    <ul className="flex flex-col gap-4" aria-label="Strategy performance, ranked by net P&L">
      {rows.map((row, i) => {
        const isPos = row.pnl >= 0;
        const width = Math.max((Math.abs(row.pnl) / maxAbs) * 100, 2);
        return (
          <li key={row.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-[13px] text-primary">{row.name}</span>
              <span className={cn('shrink-0 font-mono text-[13px] tabular-nums', isPos ? 'text-primary' : 'text-danger')}>
                {isPos ? '+' : ''}{formatCurrency(row.pnl)}
              </span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-primary/[0.06]">
              <div
                className={cn(
                  'h-full rounded-full',
                  !isPos ? 'bg-danger/70' : i === 0 ? 'bg-accent' : 'bg-primary/30'
                )}
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
});
