import React from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { Target, TrendingUp, TrendingDown, BarChart2, Activity } from 'lucide-react';

interface SummaryStatProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
}

function SummaryStat({ label, value, sub, icon }: SummaryStatProps) {
  return (
    <div className="flex-1 min-w-[120px] px-5 py-4 flex flex-col gap-1">
      <p className="flow-stat-label flex items-center gap-1.5">
        {icon} {label}
      </p>
      <div className="text-[24px] font-bold text-primary leading-none tabular-nums">{value}</div>
      {sub && <div className="text-[12px] font-medium mt-0.5">{sub}</div>}
    </div>
  );
}

export function FlowSummaryBar() {
  const { intelligence, isLoading } = useFlowStore();

  if (isLoading && !intelligence) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 h-[72px] flow-skeleton rounded-[12px]" />
        ))}
      </div>
    );
  }
  if (!intelligence) return null;

  const { maxPain, atmIV, ivRank, pcrOI, pcrSignal, ivSignal, spotPrice } = intelligence;

  const ivPercentile = ivRank != null ? Math.round(ivRank * 10) : null; // rough approximation
  const ivLabel = ivSignal === 'compressed' ? 'Low Volatility' : ivSignal === 'elevated' ? 'High Volatility' : 'Normal';
  const ivColor = ivSignal === 'compressed' ? 'text-[rgb(var(--color-warning))]' : ivSignal === 'elevated' ? 'text-[rgb(var(--color-danger))]' : 'text-secondary';

  const rankLabel = ivRank != null ? (ivRank < 30 ? 'Low' : ivRank > 70 ? 'High' : 'Medium') : '';
  const rankColor = ivRank != null ? (ivRank < 30 ? 'text-[rgb(var(--color-warning))]' : ivRank > 70 ? 'text-[rgb(var(--color-danger))]' : 'text-secondary') : 'text-secondary';

  const maxPainDist = spotPrice > 0 ? ((maxPain - spotPrice) / spotPrice * 100).toFixed(2) : null;

  const pcrLabel = pcrSignal === 'bullish' ? 'Bullish' : pcrSignal === 'bearish' ? 'Bearish' : 'NEUTRAL';
  const pcrColor = pcrSignal === 'bullish' ? 'text-[rgb(var(--color-success))]' : pcrSignal === 'bearish' ? 'text-[rgb(var(--color-danger))]' : 'text-secondary';

  return (
    <div className="flow-card rounded-[12px] flex flex-wrap divide-x divide-[rgba(var(--color-border-rgb),0.06)]">
      <SummaryStat
        label="Max Pain"
        icon={<Target className="w-3 h-3" />}
        value={maxPain.toLocaleString('en-IN')}
        sub={
          maxPainDist != null ? (
            <span className={Number(maxPainDist) < 0 ? 'text-[rgb(var(--color-danger))]' : 'text-[rgb(var(--color-success))]'}>
              {Number(maxPainDist) >= 0 ? '▲' : '▼'} {Math.abs(Number(maxPainDist))}%
            </span>
          ) : null
        }
      />
      <SummaryStat
        label="ATM IV"
        icon={<Activity className="w-3 h-3" />}
        value={atmIV != null ? atmIV.toFixed(1) : '—'}
        sub={<span className={ivColor}>{ivLabel}</span>}
      />
      <SummaryStat
        label="IV Percentile"
        icon={<TrendingUp className="w-3 h-3" />}
        value={ivPercentile != null ? `${ivPercentile}%` : '—'}
        sub={<span className={rankColor}>{rankLabel}</span>}
      />
      <SummaryStat
        label="IV Rank"
        icon={<BarChart2 className="w-3 h-3" />}
        value={ivRank != null ? Math.round(ivRank) : '—'}
        sub={<span className={rankColor}>{rankLabel}</span>}
      />
      <SummaryStat
        label="Put-Call Ratio"
        icon={<TrendingDown className="w-3 h-3" />}
        value={pcrOI.toFixed(2)}
        sub={<span className={pcrColor}>{pcrLabel}</span>}
      />
    </div>
  );
}
