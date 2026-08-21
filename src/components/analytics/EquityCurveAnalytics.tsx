import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, ReferenceLine, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency, formatCompactCurrency, formatDate } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { Trade } from '../../types';

interface DrawdownPoint {
  date: string;
  equity: number;
  drawdown: number; // negative value — how far below peak (0 = at peak)
}

interface EquityCurveAnalyticsProps {
  trades: Trade[];
}

const EquityTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const dp = payload[0]?.payload as DrawdownPoint;
  if (!dp) return null;
  const isPos = dp.equity >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.15 }}
      className="glass-float px-3 py-2.5 min-w-[160px] space-y-1"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{formatDate(dp.date)}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] text-tertiary">Equity</span>
        <span className={cn('text-sm font-bold font-mono tabular-nums', isPos ? 'text-success' : 'text-danger')}>
          {isPos ? '+' : ''}{formatCurrency(dp.equity)}
        </span>
      </div>
      {dp.drawdown < 0 && (
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-tertiary">Drawdown</span>
          <span className="text-sm font-bold font-mono tabular-nums text-danger">
            {formatCurrency(dp.drawdown)}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default function EquityCurveAnalytics({ trades }: EquityCurveAnalyticsProps) {
  const data = useMemo<DrawdownPoint[]>(() => {
    const closed = trades.filter(t => t.status !== 'OPEN');
    const sorted = [...closed].sort((a, b) => {
      const tA = a.isCarryForward && a.exitTime ? new Date(a.exitTime).getTime() : new Date(a.date).getTime();
      const tB = b.isCarryForward && b.exitTime ? new Date(b.exitTime).getTime() : new Date(b.date).getTime();
      return tA - tB;
    });

    let equity = 0;
    let peak = 0;
    return sorted.map(t => {
      equity += t.netPnl;
      if (equity > peak) peak = equity;
      const drawdown = equity - peak; // <= 0
      const date = t.isCarryForward && t.exitTime ? t.exitTime : t.date;
      return { date, equity, drawdown };
    });
  }, [trades]);

  const stats = useMemo(() => {
    if (!data.length) return null;
    const maxEquity = Math.max(...data.map(d => d.equity));
    const minDrawdown = Math.min(...data.map(d => d.drawdown));
    const finalEquity = data[data.length - 1].equity;
    const maxDdPct = maxEquity > 0 ? Math.abs(minDrawdown / maxEquity) * 100 : 0;
    return { maxEquity, minDrawdown, finalEquity, maxDdPct };
  }, [data]);

  const isPositive = (stats?.finalEquity ?? 0) >= 0;
  const strokeColor = isPositive ? 'rgb(var(--color-success))' : 'rgb(var(--color-danger))';
  const gradientId = isPositive ? 'eqPos' : 'eqNeg';

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-secondary gap-3">
        <p className="text-sm font-medium">No closed trades in this period</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mini stat row */}
      {stats && (
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Net P&L</p>
            <p className={cn('text-lg font-bold font-mono tabular-nums mt-0.5', isPositive ? 'text-success' : 'text-danger')}>
              {isPositive ? '+' : ''}{formatCurrency(stats.finalEquity)}
            </p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Max Drawdown</p>
            <p className="text-lg font-bold font-mono tabular-nums mt-0.5 text-danger">
              {formatCurrency(stats.minDrawdown)} <span className="text-sm font-semibold text-tertiary">({stats.maxDdPct.toFixed(1)}%)</span>
            </p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Peak Equity</p>
            <p className="text-lg font-bold font-mono tabular-nums mt-0.5 text-success">
              {formatCurrency(stats.maxEquity)}
            </p>
          </div>
        </div>
      )}

      {/* Equity Curve */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.6} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--color-danger))" stopOpacity={0} />
                <stop offset="100%" stopColor="rgb(var(--color-danger))" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.08)" />
            <XAxis
              dataKey="date" tickFormatter={d => formatDate(d)}
              tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
              axisLine={false} tickLine={false} dy={10}
            />
            <YAxis
              tickFormatter={v => formatCompactCurrency(v)}
              tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
              axisLine={false} tickLine={false} dx={-4}
            />
            <ReferenceLine y={0} stroke="rgb(var(--color-border) / 0.3)" strokeDasharray="4 4" />
            <RechartsTooltip content={<EquityTooltip />} cursor={{ stroke: 'rgb(var(--color-iris) / 0.5)', strokeWidth: 1.5, strokeDasharray: '4 4' }} wrapperStyle={{ outline: 'none' }} />
            {/* Drawdown shaded area */}
            <Area type="monotone" dataKey="drawdown" stroke="transparent" fillOpacity={1} fill="url(#ddGrad)" />
            {/* Equity curve */}
            <Area
              type="monotone" dataKey="equity"
              stroke={strokeColor} strokeWidth={2.5}
              dot={false} activeDot={{ r: 5, fill: strokeColor, strokeWidth: 2, stroke: 'rgb(var(--color-canvas))' }}
              fillOpacity={1} fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Drawdown Timeline */}
      <div className="h-[80px] w-full">
        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1.5">Drawdown Depth</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="ddOnly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--color-danger))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="rgb(var(--color-danger))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis hide />
            <YAxis tickFormatter={v => formatCompactCurrency(v)} tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 8 }} axisLine={false} tickLine={false} dx={-4} tickCount={3} />
            <RechartsTooltip content={<EquityTooltip />} wrapperStyle={{ outline: 'none' }} />
            <Area type="monotone" dataKey="drawdown" stroke="rgb(var(--color-danger))" strokeWidth={1.5} dot={false} fillOpacity={1} fill="url(#ddOnly)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
