import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, ReferenceLine, ReferenceDot, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { formatCurrency, formatCompactCurrency, formatDate } from '../../lib/analytics';
import { cn } from '../../lib/cn';

interface PnLCurveProps {
  data: { date: string; pnl: number }[];
}

const MONO = 'DM Mono, Geist Mono, ui-monospace, monospace';
const tick = { fill: 'rgb(var(--color-text-tertiary))', fontSize: 11, fontFamily: MONO };

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: PnLCurveProps['data'][number] }[] }) => {
  if (!active || !payload?.length) return null;
  const dp = payload[0].payload;
  const val: number = dp.pnl;
  const isPos = val >= 0;
  return (
    <div className="rounded-sm border border-primary/10 bg-surface px-3 py-2 min-w-[128px] shadow-xs">
      <p className="text-xs text-tertiary tabular-nums">{dp.date ? formatDate(dp.date) : 'Before first close'}</p>
      <p className={cn('mt-1 text-sm font-medium font-mono tabular-nums', isPos ? 'text-success' : 'text-danger')}>
        {isPos ? '+' : ''}{formatCurrency(val)}
      </p>
    </div>
  );
};

export default function PnLCurve({ data }: PnLCurveProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-secondary">No P&amp;L data for this period</p>
      </div>
    );
  }

  const last = data[data.length - 1];
  const points = [{ date: '', pnl: 0 }, ...data].map((point, index) => ({ ...point, index }));
  const ink = last.pnl < 0 ? 'rgb(var(--color-danger))' : 'rgb(var(--color-success))';

  return (
    <div role="img" aria-label="Cumulative profit and loss curve" style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pnlFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ink} stopOpacity={0.16} />
              <stop offset="100%" stopColor={ink} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgb(var(--color-text-primary) / 0.06)" />
          <XAxis
            dataKey="index"
            tickFormatter={index => points[index]?.date ? formatDate(points[index].date) : 'Start'}
            tick={tick}
            axisLine={false} tickLine={false} dy={8} minTickGap={24}
          />
          <YAxis
            tickFormatter={v => (v === 0 ? '₹0' : formatCompactCurrency(v))}
            tick={tick}
            axisLine={false} tickLine={false} width={64}
          />
          {/* Zero rule: the baseline every figure is read against */}
          <ReferenceLine y={0} stroke="rgb(var(--color-text-primary) / 0.32)" strokeWidth={1} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgb(var(--color-text-primary) / 0.24)', strokeWidth: 1 }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Area
            type="linear" dataKey="pnl"
            stroke={ink} strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4, fill: ink, strokeWidth: 2, stroke: 'rgb(var(--color-surface))' }}
            fill="url(#pnlFill)" fillOpacity={1}
            isAnimationActive={false}
          />
          {/* The accent marks where the curve stands now */}
          <ReferenceDot
            x={data.length} y={last.pnl} r={5}
            fill={ink} stroke="rgb(var(--color-surface))" strokeWidth={2}
            ifOverflow="visible"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
