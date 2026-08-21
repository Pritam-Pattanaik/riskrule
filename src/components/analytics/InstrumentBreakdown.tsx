import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { InstrumentBreakdown as IBreakdown } from '../../stores/analyticsStore';

interface InstrumentBreakdownProps {
  data: IBreakdown | null;
  loading?: boolean;
}

const BreakdownTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-float px-3 py-2 min-w-[150px] space-y-1"
    >
      <p className="text-xs font-bold text-primary">{d.name}</p>
      <div className="text-[10px] space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-tertiary">Net P&L</span>
          <span className={cn('font-mono font-bold', d.pnl >= 0 ? 'text-success' : 'text-danger')}>
            {d.pnl >= 0 ? '+' : ''}{formatCurrency(d.pnl)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-tertiary">Win Rate</span>
          <span className="font-mono font-bold text-primary">{formatPercent(d.winRate)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-tertiary">Trades</span>
          <span className="font-mono font-bold text-primary">{d.count}</span>
        </div>
      </div>
    </motion.div>
  );
};

function BreakdownChart({ title, items }: { title: string; items: IBreakdown['byInstrument'] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{title}</p>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={items} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border) / 0.08)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 10, fontWeight: 600 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={v => formatCurrency(v)}
              tick={{ fill: 'rgb(var(--color-text-secondary))', fontSize: 9, fontFamily: 'DM Mono, monospace' }}
              axisLine={false} tickLine={false} dx={-4}
            />
            <RechartsTooltip content={<BreakdownTooltip />} cursor={{ fill: 'rgb(var(--color-border) / 0.06)' }} wrapperStyle={{ outline: 'none' }} />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {items.map((d, i) => (
                <Cell key={i} fill={d.pnl >= 0 ? 'rgb(var(--color-success) / 0.7)' : 'rgb(var(--color-danger) / 0.7)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DirectionCard({ name, pnl, winRate, count }: { name: string; pnl: number; winRate: number; count: number }) {
  const isLong = name.toUpperCase().includes('LONG') || name.toUpperCase() === 'BUY';
  const isProfitable = pnl >= 0;
  return (
    <div className={cn(
      'p-4 rounded-xl border',
      isProfitable ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">{name}</span>
        <span className="text-[10px] font-semibold text-tertiary">{count} trades</span>
      </div>
      <p className={cn('text-xl font-bold font-mono', isProfitable ? 'text-success' : 'text-danger')}>
        {isProfitable ? '+' : ''}{formatCurrency(pnl)}
      </p>
      <p className="text-xs text-secondary mt-1">{formatPercent(winRate)} Win Rate</p>
    </div>
  );
}

export default function InstrumentBreakdown({ data, loading }: InstrumentBreakdownProps) {
  if (loading) return <div className="h-[300px] bg-surface-1 rounded-lg animate-pulse" />;
  if (!data) return (
    <div className="flex items-center justify-center h-[200px] text-sm text-secondary">No data for this period</div>
  );

  return (
    <div className="space-y-6">
      {/* Long vs Short Cards */}
      {data.byDirection.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-3">Long vs Short</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.byDirection.map((d, i) => (
              <DirectionCard key={i} name={d.name} pnl={d.pnl} winRate={d.winRate} count={d.count} />
            ))}
          </div>
        </div>
      )}

      {/* Instrument Type */}
      {data.byInstrument.length > 0 && (
        <BreakdownChart title="By Instrument Type (CE / PE / FUT / EQ)" items={data.byInstrument} />
      )}

      {/* Market */}
      {data.byMarket.length > 0 && (
        <BreakdownChart title="By Market (F&O / NSE / MCX)" items={data.byMarket} />
      )}

      {/* Detail rows */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Full Breakdown</p>
        {[...data.byInstrument].sort((a, b) => b.pnl - a.pnl).map((d, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-surface-1 rounded-lg border border-border-subtle hover:border-border transition-colors">
            <div>
              <p className="text-sm font-bold text-primary">{d.name}</p>
              <p className="text-xs text-tertiary mt-0.5">{d.count} trades · {formatPercent(d.winRate)} WR</p>
            </div>
            <p className={cn('font-mono text-sm font-bold', d.pnl >= 0 ? 'text-success' : 'text-danger')}>
              {d.pnl >= 0 ? '+' : ''}{formatCurrency(d.pnl)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
