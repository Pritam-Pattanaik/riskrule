import React from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { Activity, ShieldAlert, ArrowUpRight, ArrowDownRight, Anchor } from 'lucide-react';

export function MarketPulseBar() {
  const { intelligence, isLoading } = useFlowStore();

  if (isLoading || !intelligence) {
    return (
      <div className="flex animate-pulse gap-4">
        <div className="h-16 bg-surface-1 rounded-[12px] flex-1 border border-[rgba(var(--color-border-rgb),0.05)]" />
        <div className="h-16 bg-surface-1 rounded-[12px] flex-1 border border-[rgba(var(--color-border-rgb),0.05)]" />
        <div className="h-16 bg-surface-1 rounded-[12px] flex-1 border border-[rgba(var(--color-border-rgb),0.05)]" />
      </div>
    );
  }

  const { overallBias, maxPainSignal, vixSignal, agreementScore, spotPrice } = intelligence;

  // Derive visual colors
  const moodColor = overallBias === 'bullish' ? 'text-[rgb(var(--color-success))] bg-[rgba(var(--color-success),0.1)] border-[rgba(var(--color-success),0.2)]' :
                    overallBias === 'bearish' ? 'text-[rgb(var(--color-danger))] bg-[rgba(var(--color-danger),0.1)] border-[rgba(var(--color-danger),0.2)]' :
                    'text-[rgb(var(--color-warning))] bg-[rgba(var(--color-warning),0.1)] border-[rgba(var(--color-warning),0.2)]';

  const vixColor = vixSignal === 'fear' ? 'text-[rgb(var(--color-danger))]' :
                   vixSignal === 'elevated' ? 'text-[rgb(var(--color-warning))]' :
                   'text-[rgb(var(--color-success))]';

  const MoodIcon = overallBias === 'bullish' ? ArrowUpRight : overallBias === 'bearish' ? ArrowDownRight : Activity;

  const putWall = intelligence.meaningfulStrikes?.find(s => s.reasons?.includes('highest_put_oi'));
  const callWall = intelligence.meaningfulStrikes?.find(s => s.reasons?.includes('highest_call_oi'));

  const supportStrike = intelligence.supportStrike ?? putWall?.strike;
  const resistanceStrike = intelligence.resistanceStrike ?? callWall?.strike;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Market Mood */}
      <div className={`p-4 rounded-[12px] border flex items-center gap-4 transition-colors ${moodColor}`}>
        <div className="p-2 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(0,0,0,0.2)] rounded-full">
          <MoodIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider opacity-80">Market Mood</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-[20px] font-bold leading-none mt-1 uppercase">{overallBias}</h2>
            <span className="text-[12px] font-medium opacity-80">
              ({agreementScore}% conviction)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Zones (Support, Resistance, Max Pain) */}
      <div className="p-4 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] bg-surface-1 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Support</p>
          <p className="text-[16px] font-bold text-[rgb(var(--color-success))] mt-0.5">
            {supportStrike ? supportStrike.toLocaleString() : '---'}
          </p>
        </div>
        <div className="w-px h-8 bg-[rgba(var(--color-border-rgb),0.1)]" />
        <div className="flex flex-col items-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary flex items-center gap-1">
            <Anchor className="w-3 h-3" /> Expiry Magnet
          </p>
          <p className="text-[16px] font-bold text-primary mt-0.5">
            {intelligence.maxPain.toLocaleString()}
          </p>
        </div>
        <div className="w-px h-8 bg-[rgba(var(--color-border-rgb),0.1)]" />
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Resistance</p>
          <p className="text-[16px] font-bold text-[rgb(var(--color-danger))] mt-0.5">
            {resistanceStrike ? resistanceStrike.toLocaleString() : '---'}
          </p>
        </div>
      </div>

      {/* 3. Risk Meter & Spot */}
      <div className="p-4 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] bg-surface-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-surface-2 ${vixColor}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Risk Meter (VIX)</p>
            <p className={`text-[16px] font-bold mt-0.5 ${vixColor}`}>
              {intelligence.vix ? intelligence.vix.toFixed(2) : '---'}
              <span className="text-[12px] font-medium ml-2 opacity-80 uppercase">
                {vixSignal.replace('_', ' ')}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Spot Price</p>
          <p className="text-[16px] font-bold text-primary mt-0.5">{spotPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
