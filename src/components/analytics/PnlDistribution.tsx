import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid, Cell, ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { Trade } from '../../types';

interface Bucket {
  label: string;
  from: number;
  to: number;
  count: number;
  isWin: boolean;
}

interface PnlDistributionProps {
  trades: Trade[];
}

const DistTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const dp = payload[0]?.payload as Bucket;
  if (!dp) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-float px-3 py-2 min-w-[140px] space-y-1"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{dp.label}</p>
      <p className={cn('text-sm font-bold font-mono', dp.isWin ? 'text-success' : 'text-danger')}>
        {dp.count} trade{dp.count !== 1 ? 's' : ''}
      </p>
    </motion.div>
  );
};

export default function PnlDistribution({ trades }: PnlDistributionProps) {
  const { buckets, stats } = useMemo(() => {
    const closed = trades.filter(t => t.status !== 'OPEN' && t.netPnl !== undefined);
    if (!closed.length) return { buckets: [], stats: null };

    const pnls = closed.map(t => t.netPnl);
    const minVal = Math.min(...pnls);
    const maxVal = Math.max(...pnls);
    const range = maxVal - minVal;

    // Dynamic bucket size — aim for ~10 buckets
    const rawStep = range / 10;
    // Round step to nearest nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(rawStep))));
    const step = Math.ceil(rawStep / magnitude) * magnitude || 500;

    const firstBucket = Math.floor(minVal / step) * step;
    const bucketList: Bucket[] = [];

    let curr = firstBucket;
    while (curr < maxVal + step) {
      const from = curr;
      const to = curr + step;
      const count = pnls.filter(p => p >= from && p < to).length;
      const midpoint = (from + to) / 2;
      const label = `${formatCurrency(from)} to ${formatCurrency(to)}`;
      bucketList.push({ label, from, to, count, isWin: midpoint >= 0 });
      curr += step;
    }

    const wins = closed.filter(t => t.netPnl > 0);
    const losses = closed.filter(t => t.netPnl < 0);
    const median = (arr: number[]) => {
      const s = [...arr].sort((a, b) => a - b);
      return s.length % 2 ? s[Math.floor(s.length / 2)] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
    };

    return {
      buckets: bucketList,
      stats: {
        mean: pnls.reduce((a, b) => a + b, 0) / pnls.length,
        median: median(pnls),
        winMedian: wins.length ? median(wins.map(t => t.netPnl)) : null,
        lossMedian: losses.length ? median(losses.map(t => t.netPnl)) : null,
        total: closed.length,
        winCount: wins.length,
        lossCount: losses.length,
      },
    };
  }, [trades]);

  if (!buckets.length) {
    return <div className="flex items-center justify-center h-[200px] text-sm text-secondary">No trade data for this period</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Mean P&L', value: formatCurrency(stats.mean), color: stats.mean >= 0 ? 'text-success' : 'text-danger' },
            { label: 'Median P&L', value: formatCurrency(stats.median), color: stats.median >= 0 ? 'text-success' : 'text-danger' },
            { label: 'Median Win', value: stats.winMedian !== null ? formatCurrency(stats.winMedian) : '—', color: 'text-success' },
            { label: 'Median Loss', value: stats.lossMedian !== null ? formatCurrency(stats.lossMedian) : '—', color: 'text-danger' },
          ].map(item => (
            <div key={item.label} className="p-3 bg-surface-1 rounded-lg border border-border-subtle">
              <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{item.label}</p>
              <p className={cn('text-sm font-bold font-mono mt-0.5', item.color)}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-secondary">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success/70 inline-block" />Winning trades</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-danger/70 inline-block" />Losing trades</span>
      </div>

      {/* Histogram */}
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barCategoryGap="4%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.08)" vertical={false} />
            <XAxis
              dataKey="label" hide
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
              axisLine={false} tickLine={false} dx={-4}
            />
            <ReferenceLine x={0} stroke="rgb(var(--color-border) / 0.4)" />
            <RechartsTooltip content={<DistTooltip />} cursor={{ fill: 'rgb(var(--color-border) / 0.06)' }} wrapperStyle={{ outline: 'none' }} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {buckets.map((b, i) => (
                <Cell
                  key={i}
                  fill={b.isWin ? 'rgb(var(--color-success) / 0.7)' : 'rgb(var(--color-danger) / 0.7)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* X-axis range labels */}
      <div className="flex justify-between text-[9px] text-tertiary font-mono px-1">
        <span>{buckets.length > 0 ? formatCurrency(buckets[0].from) : ''}</span>
        <span className="text-secondary text-[10px] font-semibold">P&L Distribution</span>
        <span>{buckets.length > 0 ? formatCurrency(buckets[buckets.length - 1].to) : ''}</span>
      </div>
    </div>
  );
}
