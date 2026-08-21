import React from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { TrendingUp, TrendingDown, Info, Activity } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export function SentimentPanel() {
  const { intelligence, isLoading } = useFlowStore();

  if (isLoading && !intelligence) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="h-32 bg-surface-1 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.05)] animate-pulse" />
        <div className="h-32 bg-surface-1 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.05)] animate-pulse" />
        <div className="h-32 bg-surface-1 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.05)] animate-pulse" />
      </div>
    );
  }

  if (!intelligence) return null;

  const { pcrSignal, ivSignal } = intelligence;

  // Derive logical pressure language based on option flows
  const buyingPressure = pcrSignal === 'bullish'
    ? 'Strong'
    : pcrSignal === 'bearish'
      ? 'Subdued'
      : ivSignal === 'compressed' ? 'Accumulating' : 'Moderate';

  const sellingPressure = pcrSignal === 'bearish'
    ? 'Strong'
    : pcrSignal === 'bullish'
      ? 'Subdued'
      : ivSignal === 'elevated' ? 'Distributing' : 'Moderate';

  const buyingSubtext = pcrSignal === 'bullish'
    ? 'Put writers aggressively defending support'
    : pcrSignal === 'bearish'
      ? 'Cautious call buyer participation'
      : 'Balanced options demand';

  const sellingSubtext = pcrSignal === 'bearish'
    ? 'Call writers adding heavy resistance overhead'
    : pcrSignal === 'bullish'
      ? 'Minimal call resistance building'
      : 'Order flow in equilibrium';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {/* 1. Buying / Support Force */}
      <div className="p-5 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] bg-[rgb(var(--color-surface-1))] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[rgb(var(--color-success))]" />
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[rgb(var(--color-success))]">
              BUYING / SUPPORT FORCE
            </h3>
          </div>
          <p className="text-[26px] font-extrabold text-primary mb-2 leading-none">{buyingPressure}</p>
        </div>
        <p className="text-[13px] text-secondary flex items-center gap-1.5 mt-1">
          <Info className="w-3.5 h-3.5 opacity-60 shrink-0" />
          <span>{buyingSubtext}</span>
        </p>
      </div>

      {/* 2. Selling / Resistance Force */}
      <div className="p-5 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] bg-[rgb(var(--color-surface-1))] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-[rgb(var(--color-danger))]" />
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[rgb(var(--color-danger))]">
              SELLING / RESISTANCE FORCE
            </h3>
          </div>
          <p className="text-[26px] font-extrabold text-primary mb-2 leading-none">{sellingPressure}</p>
        </div>
        <p className="text-[13px] text-secondary flex items-center gap-1.5 mt-1">
          <Info className="w-3.5 h-3.5 opacity-60 shrink-0" />
          <span>{sellingSubtext}</span>
        </p>
      </div>
      
      {/* 3. Market Strength (PCR) */}
      <div className="p-5 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] bg-[rgb(var(--color-surface-1))] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-secondary" />
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                MARKET STRENGTH (PCR)
                <Tooltip content="Put-Call Ratio (PCR) = Total Put OI ÷ Total Call OI. PCR > 1.3 indicates bullish support (put writing). PCR < 0.7 indicates bearish resistance (call writing).">
                  <Info className="w-3.5 h-3.5 cursor-help opacity-60 shrink-0" />
                </Tooltip>
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <p className="text-[28px] font-bold text-primary leading-none tabular-nums">
              {intelligence.pcrIsValid ? intelligence.pcrOI.toFixed(2) : '---'}
            </p>
            <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-[4px] ${
              !intelligence.pcrIsValid ? 'bg-surface-2 text-muted' :
              pcrSignal === 'bullish' ? 'bg-[rgba(var(--color-success),0.15)] text-[rgb(var(--color-success))]' :
              pcrSignal === 'bearish' ? 'bg-[rgba(var(--color-danger),0.15)] text-[rgb(var(--color-danger))]' :
              'bg-surface-2 text-secondary'
            }`}>
              {intelligence.pcrIsValid ? pcrSignal : 'NO DATA'}
            </span>
          </div>
        </div>

        <div>
          {/* Simple visual bar for PCR */}
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden relative">
            {intelligence.pcrIsValid && (
              <div 
                className={`h-full absolute left-0 rounded-full transition-all duration-500 ${
                  intelligence.pcrOI > 1.1 ? 'bg-[rgb(var(--color-success))]' :
                  intelligence.pcrOI < 0.9 ? 'bg-[rgb(var(--color-danger))]' :
                  'bg-[rgb(var(--color-warning))]'
                }`}
                style={{ width: `${Math.min(Math.max((intelligence.pcrOI - 0.4) / 1.2 * 100, 5), 95)}%` }}
              />
            )}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-surface-1 -translate-x-1/2" />
          </div>
          <div className="flex justify-between text-[10px] uppercase font-bold text-muted mt-2">
            <span>Bearish (0.4)</span>
            <span>Neutral (1.0)</span>
            <span>Bullish (1.6)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
