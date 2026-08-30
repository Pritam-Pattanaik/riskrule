/**
 * MarketBreadth — Institutional Bloomberg/TradingView Class Market Breadth Engine
 *
 * Powered by SSE Live Market Quotes & Sector Streams.
 * Features:
 * - Hero Speedometer SVG Gauge (Width 340px, Height 175px, 16px Arc Stroke)
 * - 5-Zone Market Regimes with glowing aura tracks and tick marks (0%, 20%, 40%, 60%, 80%, 100%)
 * - Trigonometric SVG Tapered Sword Needle & Metallic 3-Ring Center Pivot
 * - Institutional Market Sentiment Badge with Aura Glow
 * - Elevated 3-Stat Metric Cards (Advancing / Declining / Unchanged) with progress bars
 * - Trading Terminal Sector Breadth Matrix (Interactive Hover Tiles)
 * - Volume Leaders & Turnover Table with Tickers, Prices & Volume Intensity Bars
 * - Generous vertical rhythm (p-6, gap-6) & zero visual compression
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, ArrowDownRight, Info, Layers, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { useLiveMarketData } from '../../hooks/useLiveMarketData';
import { cn } from '../../lib/cn';

// ─── 5-Zone Market Regimes ───────────────────────────────────────────────────

export type MarketRegime = 'STRONGLY_BEARISH' | 'BEARISH' | 'NEUTRAL' | 'BULLISH' | 'STRONGLY_BULLISH';

interface RegimeConfig {
  label: string;
  shortLabel: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
}

const REGIMES: Record<MarketRegime, RegimeConfig> = {
  STRONGLY_BEARISH: {
    label: 'Strongly Bearish Regime',
    shortLabel: 'Strongly Bearish',
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.12)',
    border: 'rgba(220,38,38,0.35)',
    glow: 'rgba(220,38,38,0.25)',
  },
  BEARISH: {
    label: 'Bearish Market Regime',
    shortLabel: 'Bearish Market',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.35)',
    glow: 'rgba(249,115,22,0.20)',
  },
  NEUTRAL: {
    label: 'Consolidation / Neutral',
    shortLabel: 'Neutral Market',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.12)',
    border: 'rgba(234,179,8,0.35)',
    glow: 'rgba(234,179,8,0.20)',
  },
  BULLISH: {
    label: 'Bullish Market Regime',
    shortLabel: 'Bullish Market',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.35)',
    glow: 'rgba(16,185,129,0.20)',
  },
  STRONGLY_BULLISH: {
    label: 'Strongly Bullish Regime',
    shortLabel: 'Strongly Bullish',
    color: '#059669',
    bg: 'rgba(5,150,105,0.15)',
    border: 'rgba(5,150,105,0.40)',
    glow: 'rgba(5,150,105,0.30)',
  },
};

function getRegime(bullishPct: number): MarketRegime {
  if (bullishPct < 20) return 'STRONGLY_BEARISH';
  if (bullishPct < 40) return 'BEARISH';
  if (bullishPct < 60) return 'NEUTRAL';
  if (bullishPct < 80) return 'BULLISH';
  return 'STRONGLY_BULLISH';
}

// ─── Hero SVG Speedometer Meter ──────────────────────────────────────────────

function SpeedometerGauge({ bullishPct }: { bullishPct: number }) {
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPct(bullishPct), 120);
    return () => clearTimeout(t);
  }, [bullishPct]);

  const regimeKey = getRegime(animatedPct);
  const regime = REGIMES[regimeKey];

  // Map 0% - 100% to angle -90° (far left, 9 o'clock) to +90° (far right, 3 o'clock)
  const targetAngle = (animatedPct / 100) * 180 - 90;

  // Gauge Geometry (Expanded 340px ViewBox 280x145)
  // Center (140, 115), Radius 90
  const cx = 140;
  const cy = 115;
  const r = 90;

  // Polar to Cartesian SVG path helper
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  // 5 Color Arc Segments (0-20, 20-40, 40-60, 60-80, 80-100)
  const segments = [
    { start: -90, end: -54, color: '#dc2626' }, // Strongly Bearish
    { start: -54, end: -18, color: '#f97316' }, // Bearish
    { start: -18, end: 18, color: '#eab308' },  // Neutral
    { start: 18, end: 54, color: '#10b981' },   // Bullish
    { start: 54, end: 90, color: '#059669' },   // Strongly Bullish
  ];

  // Tick marks at 0%, 20%, 40%, 60%, 80%, 100%
  const tickAngles = [-90, -54, -18, 18, 54, 90];

  // Mathematical SVG Tapered Sword Needle Coordinates
  const angleRad = (targetAngle * Math.PI) / 180;
  const needleLen = 72;
  const tipX = cx + needleLen * Math.sin(angleRad);
  const tipY = cy - needleLen * Math.cos(angleRad);
  const cwX = cx - 14 * Math.sin(angleRad);
  const cwY = cy + 14 * Math.cos(angleRad);

  return (
    <div className="flex flex-col items-center select-none py-2">
      {/* Hero Meter SVG Canvas */}
      <div className="relative w-full max-w-[340px] h-[175px] flex justify-center items-center">
        <svg viewBox="0 0 280 145" className="w-full h-full overflow-visible">
          {/* Outer Track Base */}
          <path
            d={describeArc(cx, cy, r, -90, 90)}
            fill="none"
            stroke="rgb(var(--color-surface-2))"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* 5 Vivid Segment Arcs */}
          {segments.map((seg, idx) => (
            <path
              key={idx}
              d={describeArc(cx, cy, r, seg.start, seg.end)}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeLinecap="butt"
              opacity="0.9"
              className="transition-all duration-300 hover:opacity-100"
            />
          ))}

          {/* Active Segment Glowing Aura */}
          <path
            d={describeArc(cx, cy, r, -90, 90)}
            fill="none"
            stroke={regime.color}
            strokeWidth="3"
            opacity="0.6"
          />

          {/* Tick Lines & Numerals */}
          {tickAngles.map((angleVal, i) => {
            const innerP = polarToCartesian(cx, cy, r - 12, angleVal);
            const outerP = polarToCartesian(cx, cy, r + 12, angleVal);
            const textP = polarToCartesian(cx, cy, r - 26, angleVal);
            const labelVal = i * 20;

            return (
              <g key={i}>
                <line
                  x1={innerP.x}
                  y1={innerP.y}
                  x2={outerP.x}
                  y2={outerP.y}
                  stroke="rgb(var(--color-border-rgb))"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <text
                  x={textP.x}
                  y={textP.y}
                  fill="rgb(var(--color-text-secondary))"
                  fontSize="10"
                  fontWeight="800"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {labelVal}%
                </text>
              </g>
            );
          })}

          {/* Center Glow Base */}
          <circle cx={cx} cy={cy} r="18" fill={regime.color} opacity="0.18" />

          {/* Trigonometric Tapered Sword Needle */}
          <line
            x1={cwX}
            y1={cwY}
            x2={tipX}
            y2={tipY}
            stroke="rgb(var(--color-text-primary))"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Glowing Active Needle Tip */}
          <circle
            cx={tipX}
            cy={tipY}
            r="4.5"
            fill={regime.color}
            className="transition-all duration-700 ease-out"
          />

          {/* Center Metallic 3-Ring Pivot Cap */}
          <circle cx={cx} cy={cy} r="10" fill="rgb(var(--color-surface))" stroke="rgb(var(--color-text-primary))" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r="6" fill="rgb(var(--color-surface-2))" stroke={regime.color} strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="3" fill={regime.color} />
        </svg>
      </div>

      {/* Institutional Market Sentiment Badge */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between gap-3 px-5 py-2 rounded-xl border shadow-md mt-2 w-full max-w-[320px] backdrop-blur-md"
        style={{
          background: regime.bg,
          borderColor: regime.border,
          boxShadow: `0 4px 20px ${regime.glow}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: regime.color }} />
          <span className="text-xs font-black uppercase tracking-wider font-mono" style={{ color: regime.color }}>
            {regime.label}
          </span>
        </div>
        <span className="text-xs font-mono font-black border-l pl-3 border-border/40 text-primary tabular-nums">
          {animatedPct.toFixed(0)}% BULLS
        </span>
      </motion.div>
    </div>
  );
}

// ─── Main MarketBreadth Component ─────────────────────────────────────────────

export default function MarketBreadth() {
  const { data: quotes } = useLiveMarketData();

  const advances = quotes.filter(q => q.changePercent > 0);
  const declines = quotes.filter(q => q.changePercent < 0);
  const unchanged = quotes.filter(q => q.changePercent === 0);
  const total = advances.length + declines.length + unchanged.length || 1;

  const advPct = (advances.length / total) * 100;
  const decPct = (declines.length / total) * 100;
  const unchPct = (unchanged.length / total) * 100;
  const ratio = declines.length > 0 ? (advances.length / declines.length).toFixed(2) : '∞';
  const bullPct = (advances.length / (quotes.length || 1)) * 100;

  const volumeLeaders = [...quotes]
    .filter(q => q.volume > 0)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 4);

  const maxVol = volumeLeaders[0]?.volume || 1;

  // Sector breadth summary (computed dynamically from instruments)
  const sectorBreadth = [
    { name: 'Banking', symbol: 'BANKNIFTY', status: quotes.find(q => q.id === 'banknifty')?.changePercent ?? 0 },
    { name: 'Index', symbol: 'SENSEX', status: quotes.find(q => q.id === 'sensex')?.changePercent ?? 0 },
    { name: 'Volatility', symbol: 'INDIA VIX', status: quotes.find(q => q.id === 'vix')?.changePercent ?? 0 },
    { name: 'Energy', symbol: 'CRUDE', status: quotes.find(q => q.id === 'crude')?.changePercent ?? 0 },
    { name: 'Metals', symbol: 'GOLD', status: quotes.find(q => q.id === 'gold')?.changePercent ?? 0 },
  ];

  if (quotes.length === 0) {
    return (
      <div className="card p-6 border border-border shadow-card animate-pulse rounded-2xl">
        <div className="h-6 w-40 bg-surface-2 rounded-lg mb-4" />
        <div className="h-44 w-full bg-surface-1 rounded-2xl mb-4" />
        <div className="h-16 w-full bg-surface-2 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="card p-6 border border-border shadow-card flex flex-col gap-6 rounded-2xl relative overflow-hidden">
      {/* ─── 1. Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue/10 border border-blue/20 text-blue shrink-0 shadow-xs">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-primary leading-none flex items-center gap-2">
              Market Breadth Engine
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </h3>
            <p className="text-xs text-tertiary mt-1 font-medium">Institutional real-time SSE breadth & sentiment</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 border border-border shadow-xs">
          <Info size={13} className="text-secondary" />
          <span className="text-xs font-mono font-bold text-primary">A/D {ratio}</span>
        </div>
      </div>

      {/* ─── 2. HERO ELEMENT: SVG Speedometer Gauge ─────────────────────────── */}
      <SpeedometerGauge bullishPct={bullPct} />

      {/* ─── 3. Elevated 3-Stat Metric Cards Grid ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {/* Advancing Card */}
        <div className="p-3.5 rounded-xl bg-surface-1 border border-success/30 shadow-xs hover:border-success/60 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10.5px] font-extrabold uppercase text-success tracking-wider font-mono">Advancing</span>
            <TrendingUp size={12} className="text-success" />
          </div>
          <div className="flex items-baseline gap-1.5 font-mono my-1">
            <span className="text-xl font-black text-success tabular-nums">{advances.length}</span>
            <span className="text-xs font-bold text-success/80">({advPct.toFixed(0)}%)</span>
          </div>
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-border-subtle mt-1">
            <div className="h-full bg-success transition-all duration-500 rounded-full" style={{ width: `${advPct}%` }} />
          </div>
        </div>

        {/* Declining Card */}
        <div className="p-3.5 rounded-xl bg-surface-1 border border-danger/30 shadow-xs hover:border-danger/60 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10.5px] font-extrabold uppercase text-danger tracking-wider font-mono">Declining</span>
            <TrendingDown size={12} className="text-danger" />
          </div>
          <div className="flex items-baseline gap-1.5 font-mono my-1">
            <span className="text-xl font-black text-danger tabular-nums">{declines.length}</span>
            <span className="text-xs font-bold text-danger/80">({decPct.toFixed(0)}%)</span>
          </div>
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-border-subtle mt-1">
            <div className="h-full bg-danger transition-all duration-500 rounded-full" style={{ width: `${decPct}%` }} />
          </div>
        </div>

        {/* Unchanged Card */}
        <div className="p-3.5 rounded-xl bg-surface-1 border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10.5px] font-extrabold uppercase text-secondary tracking-wider font-mono">Unchanged</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
          </div>
          <div className="flex items-baseline gap-1.5 font-mono my-1">
            <span className="text-xl font-black text-primary tabular-nums">{unchanged.length}</span>
            <span className="text-xs font-bold text-secondary">({unchPct.toFixed(0)}%)</span>
          </div>
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-border-subtle mt-1">
            <div className="h-full bg-tertiary transition-all duration-500 rounded-full" style={{ width: `${unchPct}%` }} />
          </div>
        </div>
      </div>

      {/* ─── 4. Trading Terminal Sector Breadth Matrix ──────────────────────── */}
      <div className="p-4 rounded-xl bg-surface-1/80 border border-border-subtle flex flex-col gap-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-secondary flex items-center gap-2">
            <Layers size={13} className="text-accent" />
            Sector Breadth Matrix
          </span>
          <span className="text-[10px] font-mono font-bold text-tertiary uppercase tracking-wider">5 Core Sectors</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {sectorBreadth.map(sec => {
            const isUp = sec.status >= 0;
            return (
              <div
                key={sec.name}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl border text-center font-mono transition-all hover:scale-[1.03] cursor-pointer shadow-xs",
                  isUp
                    ? "bg-success/10 border-success/30 text-success hover:border-success/60"
                    : "bg-danger/10 border-danger/30 text-danger hover:border-danger/60"
                )}
              >
                <span className="text-[10px] font-extrabold truncate w-full uppercase tracking-tight">{sec.name}</span>
                <span className="text-xs font-black tabular-nums mt-1">
                  {isUp ? '+' : ''}{sec.status.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 5. Institutional Volume Leaders Table ──────────────────────────── */}
      {volumeLeaders.length > 0 && (
        <div className="pt-3 border-t border-border/40">
          <div className="text-xs font-black uppercase tracking-wider mb-2.5 text-secondary flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap size={13} className="text-amber-500" />
              Volume Leaders & Turnover
            </span>
            <span className="text-[10px] font-mono font-normal text-tertiary">Real-time SSE Feed</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {volumeLeaders.map(q => {
              const isUp = q.changePercent >= 0;
              const volPct = Math.min(100, Math.max(15, (q.volume / maxVol) * 100));
              return (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-1 border border-border-subtle hover:bg-surface-2 hover:border-border transition-all shadow-xs"
                >
                  {/* Left: Ticker name */}
                  <div className="flex items-center gap-2 min-w-0 w-28">
                    <span className="text-xs font-black uppercase truncate text-primary font-mono tracking-tight">
                      {q.id.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-bold text-tertiary uppercase hidden sm:inline">{q.status}</span>
                  </div>

                  {/* Middle: Volume Intensity Bar */}
                  <div className="flex-1 mx-3 hidden sm:block">
                    <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-border-subtle">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", isUp ? "bg-success" : "bg-danger")}
                        style={{ width: `${volPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Right: Price + % Change */}
                  <div className="flex items-center gap-3 font-mono text-xs font-bold tabular-nums shrink-0">
                    <span className="text-primary font-mono">
                      {q.price >= 1000
                        ? q.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })
                        : q.price.toFixed(2)}
                    </span>
                    <div
                      className={cn(
                        "flex items-center gap-0.5 px-2 py-0.5 rounded-lg border font-bold text-xs",
                        isUp
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-danger/10 text-danger border-danger/30"
                      )}
                    >
                      {isUp ? <ArrowUpRight size={12} strokeWidth={2.5} /> : <ArrowDownRight size={12} strokeWidth={2.5} />}
                      <span>{isUp ? '+' : ''}{q.changePercent.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
