import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid, Cell, LabelList,
} from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { StrategyComparisonEntry } from '../../stores/analyticsStore';
import { Trophy, TrendingDown } from 'lucide-react';

interface StrategyComparisonProps {
  data: StrategyComparisonEntry[];
  loading?: boolean;
}

const StratTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as StrategyComparisonEntry;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-float px-3 py-2.5 min-w-[180px] space-y-1.5"
    >
      <p className="text-xs font-bold text-primary truncate max-w-[200px]">{d.name}</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
        <span className="text-tertiary">Net P&L</span>
        <span className={cn('font-mono font-bold', d.pnl >= 0 ? 'text-success' : 'text-danger')}>{d.pnl >= 0 ? '+' : ''}{formatCurrency(d.pnl)}</span>
        <span className="text-tertiary">Win Rate</span>
        <span className="font-mono font-bold text-primary">{formatPercent(d.winRate)}</span>
        <span className="text-tertiary">Profit Factor</span>
        <span className="font-mono font-bold text-primary">{d.profitFactor >= 999 ? '∞' : d.profitFactor.toFixed(2)}</span>
        <span className="text-tertiary">Trades</span>
        <span className="font-mono font-bold text-primary">{d.count}</span>
      </div>
    </motion.div>
  );
};

export default function StrategyComparison({ data, loading }: StrategyComparisonProps) {
  if (loading) return <div className="h-[200px] bg-surface-1 rounded-lg animate-pulse" />;
  if (!data.length) return (
    <div className="flex items-center justify-center h-[200px] text-sm text-secondary">
      No strategy data for this period
    </div>
  );

  const best = data.find(d => d.pnl === Math.max(...data.map(x => x.pnl)));
  const worst = data.find(d => d.pnl === Math.min(...data.map(x => x.pnl)));

  return (
    <div className="space-y-4">
      {/* Best / Worst callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {best && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success/6 border border-success/15">
            <Trophy className="w-4 h-4 text-success flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-success">Best Strategy</p>
              <p className="text-sm font-bold text-primary truncate">{best.name}</p>
              <p className="text-xs font-mono text-success">+{formatCurrency(best.pnl)} · {formatPercent(best.winRate)} WR</p>
            </div>
          </div>
        )}
        {worst && worst !== best && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-danger/6 border border-danger/15">
            <TrendingDown className="w-4 h-4 text-danger flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-danger">Needs Review</p>
              <p className="text-sm font-bold text-primary truncate">{worst.name}</p>
              <p className="text-xs font-mono text-danger">{formatCurrency(worst.pnl)} · {formatPercent(worst.winRate)} WR</p>
            </div>
          </div>
        )}
      </div>

      {/* Bar chart */}
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 60, left: 8, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.08)" horizontal={false} />
            <XAxis
              type="number" tickFormatter={v => formatCurrency(v)}
              tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="name" width={90}
              tick={{ fill: 'rgb(var(--color-text-primary))', fontSize: 10, fontWeight: 600 }}
              tickFormatter={v => v.length > 12 ? v.slice(0, 12) + '…' : v}
              axisLine={false} tickLine={false}
            />
            <RechartsTooltip content={<StratTooltip />} cursor={{ fill: 'rgb(var(--color-border) / 0.06)' }} wrapperStyle={{ outline: 'none' }} />
            <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
              <LabelList
                dataKey="pnl"
                position="right"
                formatter={(v: number) => `${v >= 0 ? '+' : ''}${formatCurrency(v)}`}
                style={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
              />
              {data.map((d, i) => (
                <Cell key={i} fill={d.pnl >= 0 ? 'rgb(var(--color-success) / 0.7)' : 'rgb(var(--color-danger) / 0.7)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {['Strategy', 'Trades', 'Win Rate', 'Avg Win', 'Avg Loss', 'PF', 'Net P&L'].map(h => (
                <th key={h} className="text-left py-2 pr-4 text-[10px] font-bold uppercase tracking-widest text-tertiary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-b border-border-subtle hover:bg-surface-1 transition-colors">
                <td className="py-2.5 pr-4 font-semibold text-primary max-w-[120px] truncate">{d.name}</td>
                <td className="py-2.5 pr-4 font-mono text-secondary">{d.count}</td>
                <td className="py-2.5 pr-4 font-mono font-bold text-primary">{formatPercent(d.winRate)}</td>
                <td className="py-2.5 pr-4 font-mono text-success">+{formatCurrency(d.avgWin)}</td>
                <td className="py-2.5 pr-4 font-mono text-danger">{formatCurrency(-d.avgLoss)}</td>
                <td className="py-2.5 pr-4 font-mono font-bold text-primary">{d.profitFactor >= 999 ? '∞' : d.profitFactor.toFixed(2)}</td>
                <td className={cn('py-2.5 pr-4 font-mono font-bold', d.pnl >= 0 ? 'text-success' : 'text-danger')}>
                  {d.pnl >= 0 ? '+' : ''}{formatCurrency(d.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
