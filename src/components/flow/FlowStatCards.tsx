import React from 'react';
import { useFlowStore } from '../../stores/flowStore';
import {
  Activity, TrendingUp, TrendingDown, Target, BarChart2, LineChart,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  accent?: 'default' | 'success' | 'danger' | 'warning' | 'iris';
  chart?: React.ReactNode;
}

function StatCard({ label, value, sub, icon, accent = 'default', chart }: StatCardProps) {
  const accentClasses: Record<string, string> = {
    default: 'border-[rgba(var(--color-border-rgb),0.08)] bg-[rgb(var(--color-surface-1))]',
    success: 'border-[rgba(var(--color-success),0.20)] bg-[rgba(var(--color-success),0.06)]',
    danger:  'border-[rgba(var(--color-danger),0.20)]  bg-[rgba(var(--color-danger),0.06)]',
    warning: 'border-[rgba(var(--color-warning),0.20)] bg-[rgba(var(--color-warning),0.06)]',
    iris:    'border-[rgba(var(--color-iris),0.20)]    bg-[rgba(var(--color-iris),0.06)]',
  };

  const labelColorClasses: Record<string, string> = {
    default: 'text-secondary',
    success: 'text-[rgb(var(--color-success))]',
    danger:  'text-[rgb(var(--color-danger))]',
    warning: 'text-[rgb(var(--color-warning))]',
    iris:    'text-[rgb(var(--color-iris))]',
  };

  return (
    <div className={`flow-card p-4 flex flex-col gap-2 min-w-0 rounded-[12px] border ${accentClasses[accent]}`}>
      <div className="flex items-center justify-between gap-2">
        <p className={`flow-stat-label ${labelColorClasses[accent]}`}>{label}</p>
        {icon && <div className="opacity-70 shrink-0">{icon}</div>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="flow-stat-value leading-none">{value}</div>
          {sub && <div className="mt-1.5 text-[11px] font-medium text-secondary">{sub}</div>}
        </div>
        {chart && <div className="shrink-0 opacity-80">{chart}</div>}
      </div>
    </div>
  );
}

/** Tiny sparkline-style mini bar chart from intelligence data */
function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  if (!values.length) return null;
  const max = Math.max(...values) || 1;
  return (
    <div className="flex items-end gap-[2px] h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm transition-all"
          style={{
            height: `${Math.max(10, (v / max) * 100)}%`,
            background: color,
            opacity: 0.5 + 0.5 * (i / values.length),
          }}
        />
      ))}
    </div>
  );
}

/** Compact mood gauge bar */
function MoodGauge({ bias }: { bias: string }) {
  const pct = bias === 'bullish' ? 85 : bias === 'bearish' ? 15 : 50;
  const color =
    bias === 'bullish' ? 'rgb(var(--color-success))' :
    bias === 'bearish' ? 'rgb(var(--color-danger))' :
    'rgb(var(--color-warning))';
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="h-1.5 w-full bg-[rgba(var(--color-border-rgb),0.10)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex justify-between text-[9px] uppercase font-bold tracking-wider text-muted">
        <span>Bearish</span><span>Neutral</span><span>Bullish</span>
      </div>
    </div>
  );
}

export function FlowStatCards() {
  const { intelligence, isLoading } = useFlowStore();

  if (isLoading && !intelligence) {
    return (
<<<<<<< HEAD
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flow-skeleton h-[96px] rounded-[12px]" />
=======
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flow-skeleton h-[92px] rounded-[12px]" />
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
        ))}
      </div>
    );
  }

  if (!intelligence) return null;

  const {
    overallBias, agreementScore, spotPrice, spotChangePct, spotChange,
<<<<<<< HEAD
    pcrOI, pcrSignal, pcrIsValid,
=======
    pcrOI, pcrSignal,
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
    meaningfulStrikes,
    supportStrike: directSupport,
    resistanceStrike: directResistance,
  } = intelligence;

  // Support  = strike with MAXIMUM PUT OI  (where put sellers/writers are maximum)
  // Resistance = strike with MAXIMUM CALL OI (where call sellers/writers are maximum)
  const putWall  = meaningfulStrikes?.find(s => s.reasons?.includes('highest_put_oi'));
  const callWall = meaningfulStrikes?.find(s => s.reasons?.includes('highest_call_oi'));

  const putStrike = directSupport ?? putWall?.strike ?? 0;
  const callStrike = directResistance ?? callWall?.strike ?? 0;

  const suppStrike = intelligence.supportStrike || putWall?.strike || 0;
  const resStrike  = intelligence.resistanceStrike || callWall?.strike || 0;

<<<<<<< HEAD
  // Calculate support and resistance distance & percentage from spot
  const putDistPts = spotPrice > 0 && putStrike > 0 ? Math.round(spotPrice - putStrike) : 0;
  const putDistPct = spotPrice > 0 && putStrike > 0 ? ((spotPrice - putStrike) / spotPrice) * 100 : 0;
=======
  const suppDistPts = spotPrice > 0 && suppStrike > 0 ? (spotPrice - suppStrike) : 0;
  const suppDistPct = spotPrice > 0 && suppStrike > 0 ? (suppDistPts / spotPrice) * 100 : 0;

  const resDistPts = spotPrice > 0 && resStrike > 0 ? (resStrike - spotPrice) : 0;
  const resDistPct = spotPrice > 0 && resStrike > 0 ? (resDistPts / spotPrice) * 100 : 0;

  const isSpotUp = spotChange >= 0;
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46

  const callDistPts = spotPrice > 0 && callStrike > 0 ? Math.round(callStrike - spotPrice) : 0;
  const callDistPct = spotPrice > 0 && callStrike > 0 ? ((callStrike - spotPrice) / spotPrice) * 100 : 0;

  // Mini sparkline data from strikes
  const sortedStrikes = [...(meaningfulStrikes ?? [])].sort((a, b) => a.strike - b.strike);
  const oiSparkValues = sortedStrikes.map(s => s.callOI + s.putOI).slice(0, 10);

  const pcrLabel =
    !pcrIsValid ? 'No Data' :
    pcrSignal === 'bullish' ? 'Bullish' :
    pcrSignal === 'bearish' ? 'Bearish' :
    'Neutral';

  return (
<<<<<<< HEAD
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
=======
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
      {/* 1. Market Mood */}
      <StatCard
        label="MARKET MOOD"
        icon={<Activity className="w-4 h-4 text-[rgb(var(--color-warning))]" />}
        accent={overallBias === 'bullish' ? 'success' : overallBias === 'bearish' ? 'danger' : 'warning'}
        value={<span className="text-[20px] font-extrabold uppercase tracking-tight">{overallBias}</span>}
        sub={
          <div className="w-full space-y-1.5 mt-1">
            <span className="text-[12px] text-secondary">{agreementScore}% conviction</span>
            <MoodGauge bias={overallBias} />
          </div>
        }
      />

      {/* 2. Support = Max Put OI strike */}
      <StatCard
        label="SUPPORT (MAX PUT OI)"
        icon={<ArrowUpRight className="w-4 h-4 text-[rgb(var(--color-success))]" />}
        accent={putStrike ? 'success' : 'default'}
        value={
          <span className="text-[24px] font-bold text-[rgb(var(--color-success))]">
<<<<<<< HEAD
            {putStrike ? putStrike.toLocaleString('en-IN') : '---'}
          </span>
        }
        sub={
          putStrike ? (
            <span className="text-[rgb(var(--color-success))] font-medium">
              ▼ {Math.abs(putDistPct).toFixed(2)}% below spot (-{putDistPts} pts)
            </span>
          ) : (
            <span className="text-muted text-[11px]">Awaiting live chain data</span>
=======
            {suppStrike > 0 ? suppStrike.toLocaleString() : '---'}
          </span>
        }
        sub={
          suppStrike > 0 ? (
            <span className="text-[rgb(var(--color-success))]">
              ▼ {suppDistPct.toFixed(2)}% below spot (-{suppDistPts.toFixed(0)} pts)
            </span>
          ) : (
            <span className="text-secondary">---</span>
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
          )
        }
      />

      {/* 3. Resistance = Max Call OI strike */}
      <StatCard
        label="RESISTANCE (MAX CALL OI)"
        icon={<ArrowDownRight className="w-4 h-4 text-[rgb(var(--color-danger))]" />}
        accent={callStrike ? 'danger' : 'default'}
        value={
          <span className="text-[24px] font-bold text-[rgb(var(--color-danger))]">
<<<<<<< HEAD
            {callStrike ? callStrike.toLocaleString('en-IN') : '---'}
          </span>
        }
        sub={
          callStrike ? (
            <span className="text-[rgb(var(--color-danger))] font-medium">
              ▲ {Math.abs(callDistPct).toFixed(2)}% above spot (+{callDistPts} pts)
            </span>
          ) : (
            <span className="text-muted text-[11px]">Awaiting live chain data</span>
=======
            {resStrike > 0 ? resStrike.toLocaleString() : '---'}
          </span>
        }
        sub={
          resStrike > 0 ? (
            <span className="text-[rgb(var(--color-danger))]">
              ▲ {resDistPct.toFixed(2)}% above spot (+{resDistPts.toFixed(0)} pts)
            </span>
          ) : (
            <span className="text-secondary">---</span>
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
          )
        }
      />

      {/* 4. Spot Price */}
      <StatCard
        label="SPOT PRICE"
        icon={<LineChart className="w-4 h-4 text-secondary" />}
        value={
          <span className="text-[24px] font-bold tabular-nums">
            {spotPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        }
        sub={
          <span className={isSpotUp ? 'text-[rgb(var(--color-success))] font-medium' : 'text-[rgb(var(--color-danger))] font-medium'}>
            {isSpotUp ? '▲' : '▼'} {Math.abs(spotChangePct).toFixed(2)}% ({isSpotUp ? '+' : ''}{spotChange.toFixed(2)})
          </span>
        }
        chart={
          oiSparkValues.length > 0 ? (
            <MiniSparkline values={oiSparkValues} color="#38bdf8" />
          ) : undefined
        }
      />

      {/* 5. PCR Total */}
      <StatCard
<<<<<<< HEAD
        label="PCR (TOTAL)"
=======
        label="PCR (Total)"
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
        icon={<Target className="w-4 h-4 text-secondary" />}
        value={
          <span className="text-[26px] font-bold tabular-nums">
            {pcrIsValid ? pcrOI.toFixed(2) : '---'}
          </span>
        }
        sub={<span className="text-secondary font-medium text-[13px]">{pcrLabel}</span>}
      />
    </div>
  );
}

