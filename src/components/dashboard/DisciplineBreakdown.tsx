import React from 'react';
import { formatPercent } from '../../lib/analytics';

interface DisciplineBreakdownProps {
  data: { name: string; value: number; color: string }[];
}

// Perfect and poor carry meaning. The middle band stays neutral.
const SEGMENT_COLORS: Record<string, string> = {
  'Perfect (4-5)': 'bg-success',
  'Good (3)':      'bg-primary/30',
  'Poor (1-2)':    'bg-danger',
};

/** Share of trades by discipline score: one stacked bar and a three-row key. */
export default React.memo(function DisciplineBreakdown({ data }: DisciplineBreakdownProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return <p className="py-8 text-center text-sm text-secondary">No rated trades yet</p>;
  }

  return (
    <div role="img" aria-label="Discipline distribution">
      <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
        {data.filter(d => d.value > 0).map(d => (
          <div
            key={d.name}
            className={SEGMENT_COLORS[d.name] ?? 'bg-primary/30'}
            style={{ width: `${(d.value / total) * 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {data.map(d => (
          <li key={d.name} className="flex items-center gap-2 text-[13px]">
            <span className={`h-2 w-2 shrink-0 rounded-full ${SEGMENT_COLORS[d.name] ?? 'bg-primary/30'}`} aria-hidden="true" />
            <span className="text-secondary">{d.name}</span>
            <span className="ml-auto font-mono tabular-nums text-primary">{d.value}</span>
            <span className="w-12 text-right font-mono tabular-nums text-tertiary">
              {formatPercent((d.value / total) * 100)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});
