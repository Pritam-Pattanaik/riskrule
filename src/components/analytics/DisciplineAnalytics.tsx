import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { DisciplineCorrelation as IDiscipline } from '../../stores/analyticsStore';
import { BREAKDOWN_LABELS } from '../../types';

interface DisciplineAnalyticsProps {
  data: IDiscipline | null;
  loading?: boolean;
}

const ScoreTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-float px-3 py-2 min-w-[150px] space-y-1"
    >
      <p className="text-xs font-bold text-primary">Score {d.score}/5</p>
      <div className="text-[10px] space-y-0.5">
        <div className="flex justify-between gap-4"><span className="text-tertiary">Avg P&L</span>
          <span className={cn('font-mono font-bold', d.avgPnl >= 0 ? 'text-success' : 'text-danger')}>
            {d.avgPnl >= 0 ? '+' : ''}{formatCurrency(d.avgPnl)}
          </span>
        </div>
        <div className="flex justify-between gap-4"><span className="text-tertiary">Win Rate</span>
          <span className="font-mono font-bold text-primary">{formatPercent(d.winRate)}</span>
        </div>
        <div className="flex justify-between gap-4"><span className="text-tertiary">Trades</span>
          <span className="font-mono font-bold text-primary">{d.count}</span>
        </div>
      </div>
    </motion.div>
  );
};

const SCORE_LABELS: Record<number, string> = {
  1: 'Very Poor', 2: 'Poor', 3: 'Good', 4: 'Great', 5: 'Perfect',
};

export default function DisciplineAnalytics({ data, loading }: DisciplineAnalyticsProps) {
  if (loading) return <div className="h-[300px] bg-surface-1 rounded-lg animate-pulse" />;
  if (!data || data.totalScored === 0) return (
    <div className="flex items-center justify-center h-[120px] text-sm text-secondary">
      No discipline-scored trades in this period
    </div>
  );

  const chartData = data.byScore.filter(d => d.count > 0).map(d => ({
    ...d,
    label: `${SCORE_LABELS[d.score] || d.score} (${d.score})`,
  }));

  return (
    <div className="space-y-6">
      {/* Score-PnL bar chart */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-3">Avg P&L by Discipline Score</p>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.08)" vertical={false} />
              <XAxis
                dataKey="score"
                tickFormatter={v => SCORE_LABELS[v] ? `${SCORE_LABELS[v]}` : `${v}`}
                tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 9 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tickFormatter={v => formatCurrency(v)}
                tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
                axisLine={false} tickLine={false} dx={-4}
              />
              <RechartsTooltip content={<ScoreTooltip />} cursor={{ fill: 'rgb(var(--color-border) / 0.06)' }} wrapperStyle={{ outline: 'none' }} />
              <Bar dataKey="avgPnl" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => {
                  const hue = Math.round((d.score - 1) / 4 * 120); // 0=red, 120=green
                  const color = d.avgPnl >= 0 ? 'rgb(var(--color-success) / 0.7)' : 'rgb(var(--color-danger) / 0.7)';
                  return <Cell key={i} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score rows */}
      <div className="space-y-2">
        {data.byScore.filter(d => d.count > 0).map(d => {
          const isPnlPos = d.avgPnl >= 0;
          const pct = d.score / 5;
          return (
            <div key={d.score} className="p-3.5 bg-surface-1 rounded-lg border border-border-subtle">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">Score {d.score}/5</span>
                  <span className="text-[10px] text-tertiary font-medium">— {SCORE_LABELS[d.score]}</span>
                </div>
                <span className="text-xs text-tertiary">{d.count} trades · {formatPercent(d.winRate)} WR</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct * 100}%`,
                      background: `hsl(${Math.round(pct * 120)}, 60%, 45%)`,
                    }}
                  />
                </div>
                <span className={cn('font-mono text-sm font-bold w-24 text-right', isPnlPos ? 'text-success' : 'text-danger')}>
                  Avg {isPnlPos ? '+' : ''}{formatCurrency(d.avgPnl)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dimension Breakdown */}
      {data.dimensionAvgs.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-3">Avg Score by Discipline Dimension</p>
          <div className="space-y-2">
            {data.dimensionAvgs
              .map(d => {
                const label = BREAKDOWN_LABELS.find(b => b.key === d.dimension)?.label || d.dimension;
                return { ...d, label };
              })
              .sort((a, b) => a.avg - b.avg)
              .map((d, i) => {
                const pct = (d.avg / 5) * 100;
                const hue = Math.round((d.avg / 5) * 120);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-secondary w-[130px] flex-shrink-0">{d.label}</span>
                    <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: `hsl(${hue}, 60%, 45%)` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-primary w-8 text-right">{d.avg.toFixed(1)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
