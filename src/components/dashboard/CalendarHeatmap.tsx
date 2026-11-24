import React from 'react';
import type { Trade } from '../../types';
import { getLocalYYYYMMDD } from '../../lib/dateUtils';
import { formatCurrency } from '../../lib/analytics';

interface CalendarHeatmapProps {
  trades: Trade[];
}

const DAYS = 90;
const WEEKS = Math.ceil(DAYS / 7);

// Each step means something: loss size on the left, profit size on the right.
const LEVELS = {
  none:      'rgb(var(--color-text-primary) / 0.06)',
  flat:      'rgb(var(--color-text-primary) / 0.24)',
  smallWin:  'rgb(var(--color-success) / 0.40)',
  bigWin:    'rgb(var(--color-success) / 0.90)',
  smallLoss: 'rgb(var(--color-danger) / 0.40)',
  bigLoss:   'rgb(var(--color-danger) / 0.90)',
};

function cellColor(pnl: number | undefined): string {
  if (pnl === undefined) return LEVELS.none;
  if (pnl > 1000)  return LEVELS.bigWin;
  if (pnl > 0)     return LEVELS.smallWin;
  if (pnl < -1000) return LEVELS.bigLoss;
  if (pnl < 0)     return LEVELS.smallLoss;
  return LEVELS.flat; // traded, broke even
}

export default React.memo(function CalendarHeatmap({ trades }: CalendarHeatmapProps) {
  const today = new Date();
  const days: string[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(getLocalYYYYMMDD(d));
  }

  const pnlMap = new Map<string, number>();
  trades.forEach(t => {
    const d = t.isCarryForward && t.exitTime ? new Date(t.exitTime) : new Date(t.date);
    const key = getLocalYYYYMMDD(d);
    pnlMap.set(key, (pnlMap.get(key) || 0) + t.netPnl);
  });

  const legend = [LEVELS.bigLoss, LEVELS.smallLoss, LEVELS.none, LEVELS.smallWin, LEVELS.bigWin];
  const isEmpty = trades.length === 0;

  return (
    <div role="img" aria-label="Heatmap of daily P&L for the last 90 days">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-primary">Daily P&amp;L</h2>
        <span className="text-xs text-tertiary">Last 90 days</span>
      </div>

      <div className="relative">
        <div
          className="grid max-w-[392px] gap-1"
          style={{
            gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
            gridTemplateRows: 'repeat(7, auto)',
            gridAutoFlow: 'column',
            opacity: isEmpty ? 0.4 : 1,
          }}
        >
          {days.map(dateString => {
            const pnl = pnlMap.get(dateString);
            return (
              <div
                key={dateString}
                title={`${dateString}: ${pnl !== undefined ? formatCurrency(pnl) : 'No trades'}`}
                className="aspect-square rounded-[4px] transition-opacity duration-150 hover:opacity-70"
                style={{ background: cellColor(pnl) }}
              />
            );
          })}
        </div>
        {isEmpty && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-secondary">
            Not enough data yet
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-tertiary">
        <span>Loss</span>
        {legend.map((color, i) => (
          <span key={i} className="h-3 w-3 rounded-[4px]" style={{ background: color }} aria-hidden="true" />
        ))}
        <span>Profit</span>
      </div>
    </div>
  );
});
