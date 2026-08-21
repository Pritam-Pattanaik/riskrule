import React from 'react';
import { formatCurrency, formatPercent } from '../../lib/analytics';
import { cn } from '../../lib/cn';
import type { ChargesSummary as ICharges } from '../../stores/analyticsStore';
import { Receipt, TrendingDown, Banknote, Calculator } from 'lucide-react';

interface ChargesAnalyticsProps {
  data: ICharges | null;
  loading?: boolean;
}

export default function ChargesAnalytics({ data, loading }: ChargesAnalyticsProps) {
  if (loading) return <div className="h-[160px] bg-surface-1 rounded-lg animate-pulse" />;
  if (!data) return (
    <div className="flex items-center justify-center h-[100px] text-sm text-secondary">No data for this period</div>
  );

  const stats = [
    {
      icon: Banknote,
      label: 'Gross P&L',
      value: formatCurrency(data.totalGross),
      sub: 'Before charges',
      color: data.totalGross >= 0 ? 'text-success' : 'text-danger',
      bg: data.totalGross >= 0 ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20',
    },
    {
      icon: Receipt,
      label: 'Total Charges',
      value: formatCurrency(data.totalCharges),
      sub: `₹${data.avgChargesPerTrade.toFixed(0)} avg / trade`,
      color: 'text-warning',
      bg: 'bg-warning/5 border-warning/20',
    },
    {
      icon: TrendingDown,
      label: 'Charges Impact',
      value: `${data.chargesAsPctOfGross.toFixed(1)}%`,
      sub: 'Of gross P&L eaten',
      color: data.chargesAsPctOfGross > 20 ? 'text-danger' : data.chargesAsPctOfGross > 10 ? 'text-warning' : 'text-secondary',
      bg: data.chargesAsPctOfGross > 20 ? 'bg-danger/5 border-danger/20' : 'bg-surface-1 border-border-subtle',
    },
    {
      icon: Calculator,
      label: 'Net P&L',
      value: formatCurrency(data.totalNet),
      sub: `Across ${data.tradeCount} trades`,
      color: data.totalNet >= 0 ? 'text-success' : 'text-danger',
      bg: data.totalNet >= 0 ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={cn('p-4 rounded-xl border', stat.bg)}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5 text-tertiary" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">{stat.label}</p>
              </div>
              <p className={cn('text-xl font-bold font-mono', stat.color)}>{stat.value}</p>
              <p className="text-[11px] text-tertiary mt-1">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Visual bar showing gross → charges → net */}
      {data.totalGross > 0 && (
        <div className="p-4 bg-surface-1 rounded-xl border border-border-subtle space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Gross → Net Breakdown</p>
          <div className="flex items-center gap-2 h-6">
            <div className="flex-1 flex h-full rounded-lg overflow-hidden">
              <div
                className="bg-success/60 flex items-center justify-center text-[9px] font-bold text-success transition-all duration-700"
                style={{ width: `${Math.max(5, 100 - data.chargesAsPctOfGross)}%` }}
              >
                Net
              </div>
              <div
                className="bg-warning/60 flex items-center justify-center text-[9px] font-bold text-warning transition-all duration-700"
                style={{ width: `${Math.min(95, data.chargesAsPctOfGross)}%` }}
              >
                {data.chargesAsPctOfGross.toFixed(0)}% charges
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-tertiary font-mono">
            <span>{formatCurrency(data.totalNet)} kept</span>
            <span>{formatCurrency(data.totalCharges)} paid in charges</span>
          </div>
        </div>
      )}

      {/* Alert if charges are too high */}
      {data.chargesAsPctOfGross > 25 && (
        <div className="p-3.5 rounded-lg bg-danger/8 border border-danger/20">
          <p className="text-xs font-semibold text-danger">
            ⚠️ High charge ratio detected — {data.chargesAsPctOfGross.toFixed(1)}% of gross P&L is lost to brokerage & taxes.
            Consider reducing trade frequency or switching to a lower-cost broker.
          </p>
        </div>
      )}
    </div>
  );
}
