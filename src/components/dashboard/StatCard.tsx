import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface StatCardProps {
  label: string;
  value: string;
  subLabel: string;
  /** Kept so existing callers still compile. Stat cards are numbers, so it is not drawn. */
  icon?: LucideIcon;
  colorType: 'pnl' | 'winrate' | 'rr' | 'discipline' | 'default';
  rawValue: number;
}

export default React.memo(function StatCard({ label, value, subLabel, colorType, rawValue }: StatCardProps) {
  // Only P&L carries a semantic color. Every other figure stays in the text ramp.
  const valueClass = colorType === 'pnl'
    ? (rawValue >= 0 ? 'text-success' : 'text-danger')
    : 'text-primary';

  return (
    <div className="h-full min-h-[112px] rounded-lg border border-primary/10 bg-surface p-5">
      <p className="text-[13px] text-secondary">{label}</p>
      <p className={cn('mt-3 font-mono text-[28px] leading-none font-medium tabular-nums', valueClass)}>
        {colorType === 'pnl' && (
          <span className="sr-only">{rawValue >= 0 ? 'Profit: ' : 'Loss: '}</span>
        )}
        {value}
      </p>
      <p className="mt-3 text-xs text-tertiary">{subLabel}</p>
    </div>
  );
});
