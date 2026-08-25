/**
 * MarketBreadth — Premium A/D Ratio & Volume Leaders
 *
 * Computed from live SSE quote data. No hardcoded values.
 * Features:
 * - Animated A/D bar with gradient fill
 * - Market mood gauge
 * - Volume leaders with mini bars
 * - Real-time A/D ratio
 */

import React, { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { useLiveMarketData } from '../../hooks/useLiveMarketData';

// ─── Animated bar ─────────────────────────────────────────────────────────────

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div
      className="h-full rounded-full transition-all duration-700 ease-out"
      style={{ width: `${width}%`, background: color }}
    />
  );
}

// ─── Gauge arc ────────────────────────────────────────────────────────────────

function MoodGauge({ bullishPct }: { bullishPct: number }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(bullishPct), 300);
    return () => clearTimeout(t);
  }, [bullishPct]);

  // Semi-circle gauge: 0% = all bearish (left), 100% = all bullish (right)
  const angle = (animated / 100) * 180 - 90; // -90 = far left, +90 = far right

  const moodLabel = bullishPct >= 65 ? 'Bullish' : bullishPct <= 35 ? 'Bearish' : 'Mixed';
  const moodColor = bullishPct >= 65 ? '#10b981' : bullishPct <= 35 ? '#ef4444' : '#f59e0b';

  return (
    <div className="flex flex-col items-center py-3 mb-4">
      {/* Semi-circle */}
      <div className="relative w-28 h-14 overflow-hidden mb-2">
        {/* Track */}
        <svg viewBox="0 0 120 60" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#ef4444" stopOpacity="0.6" />
              <stop offset="50%"  stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d="M10,55 A50,50 0 0,1 110,55"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Needle */}
          <g transform={`translate(60,55) rotate(${angle})`}>
            <line x1="0" y1="0" x2="0" y2="-38" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <circle cx="0" cy="0" r="3" fill="white" />
          </g>
        </svg>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[13px] font-black" style={{ color: moodColor }}>{moodLabel}</span>
        <span className="text-[11px] font-mono" style={{ color: 'rgba(var(--color-border-rgb),0.3)' }}>
          {bullishPct.toFixed(0)}% bulls
        </span>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BreadthSkeleton() {
  return (
    <div className="space-y-3">
      {[80, 60, 70, 50].map((w, i) => (
        <div
          key={i}
          className="h-8 rounded-xl animate-pulse"
          style={{ background: 'rgba(var(--color-border-rgb),0.05)', width: `${w}%`, animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MarketBreadth() {
  const { data: quotes } = useLiveMarketData();

  const advances  = quotes.filter(q => q.changePercent > 0);
  const declines  = quotes.filter(q => q.changePercent < 0);
  const unchanged = quotes.filter(q => q.changePercent === 0);
  const total     = advances.length + declines.length + unchanged.length || 1;

  const advPct = (advances.length / total) * 100;
  const decPct = (declines.length / total) * 100;
  const ratio  = declines.length > 0 ? (advances.length / declines.length).toFixed(2) : '∞';
  const bullPct = (advances.length / (quotes.length || 1)) * 100;

  const volumeLeaders = [...quotes]
    .filter(q => q.volume > 0)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 4);
  const maxVol = volumeLeaders[0]?.volume || 1;

  if (quotes.length === 0) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(var(--color-border-rgb),0.02)', border: '1px solid rgba(var(--color-border-rgb),0.07)' }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <Activity size={14} className="text-blue-400" />
          </div>
          <h3 className="text-[14px] font-bold text-primary/90">Market Breadth</h3>
        </div>
        <BreadthSkeleton />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(var(--color-border-rgb),0.02)', border: '1px solid rgba(var(--color-border-rgb),0.07)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}
          >
            <Activity size={14} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-primary/90 leading-none">Market Breadth</h3>
            <p className="text-[10px] text-primary/30 mt-0.5">A/D ratio from live quotes</p>
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(var(--color-border-rgb),0.04)', border: '1px solid rgba(var(--color-border-rgb),0.07)' }}
          title="Advance/Decline Ratio"
        >
          <Info size={10} className="text-primary/30" />
          <span className="text-[11px] font-bold" style={{ color: 'rgba(var(--color-border-rgb),0.5)' }}>
            A/D {ratio}
          </span>
        </div>
      </div>

      {/* Mood gauge */}
      <MoodGauge bullishPct={bullPct} />

      {/* A/D bars */}
      <div className="space-y-2 mb-5">
        {[
          { label: 'Advancing', count: advances.length, pct: advPct, color: 'linear-gradient(90deg, rgba(16,185,129,0.5), rgba(16,185,129,0.8))', textColor: '#10b981' },
          { label: 'Declining', count: declines.length, pct: decPct, color: 'linear-gradient(90deg, rgba(239,68,68,0.5), rgba(239,68,68,0.8))', textColor: '#ef4444' },
          { label: 'Unchanged', count: unchanged.length, pct: (unchanged.length / total) * 100, color: 'linear-gradient(90deg, rgba(107,114,128,0.4), rgba(107,114,128,0.6))', textColor: '#6b7280' },
        ].map(row => (
          <div key={row.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-semibold" style={{ color: 'rgba(var(--color-border-rgb),0.35)' }}>{row.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black tabular-nums" style={{ color: row.textColor }}>{row.count}</span>
                <span className="text-[10px] font-mono" style={{ color: 'rgba(var(--color-border-rgb),0.2)' }}>
                  {row.pct.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(var(--color-border-rgb),0.06)' }}>
              <AnimatedBar pct={row.pct} color={row.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Volume leaders */}
      {volumeLeaders.length > 0 && (
        <>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(var(--color-border-rgb),0.2)' }}>
            Volume Leaders
          </div>
          <div className="space-y-2">
            {volumeLeaders.map(q => {
              const isUp = q.changePercent >= 0;
              return (
                <div key={q.id} className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-black uppercase w-16 truncate"
                    style={{ color: 'rgba(var(--color-border-rgb),0.45)' }}
                  >
                    {q.id.toUpperCase()}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(var(--color-border-rgb),0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(q.volume / maxVol) * 100}%`,
                        background: isUp ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)',
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-0.5 w-12 justify-end">
                    {isUp ? <ArrowUpRight size={10} className="text-emerald-500" /> : <ArrowDownRight size={10} className="text-red-500" />}
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: isUp ? '#10b981' : '#ef4444' }}>
                      {isUp ? '+' : ''}{q.changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
