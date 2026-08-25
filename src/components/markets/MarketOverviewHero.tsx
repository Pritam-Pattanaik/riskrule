/**
 * MarketOverviewHero — Premium Quote Strip
 *
 * Horizontally scrollable live market quote cards.
 * Features:
 * - Real-time flash animation on price change
 * - Sparkline micro-charts per symbol
 * - Status badge (OPEN / CLOSED / 24/7)
 * - Active symbol highlight synced with chart selection
 * - Loading skeletons
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '../../lib/cn';
import { useLiveMarketData } from '../../hooks/useLiveMarketData';

interface Props {
  activeSymbol?: string;
  onSelectSymbol?: (symbol: string) => void;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function QuoteSkeleton() {
  return (
    <div
      className="w-[210px] shrink-0 rounded-2xl p-4 animate-pulse bg-surface-0 border border-border"
    >
      <div className="flex justify-between mb-3">
        <div className="h-3 w-20 rounded-full bg-surface-2" />
        <div className="h-3 w-10 rounded-full bg-surface-1" />
      </div>
      <div className="h-6 w-28 rounded-lg mb-2 bg-surface-2" />
      <div className="h-3 w-20 rounded-full mb-4 bg-surface-1" />
      <div className="h-10 w-full rounded-lg bg-surface-1" />
    </div>
  );
}

// ─── Quote Card ───────────────────────────────────────────────────────────────

function QuoteCard({
  market,
  isActive,
  onClick,
  index,
}: {
  market: ReturnType<typeof useLiveMarketData>['data'][0];
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const isUp = market.changePercent >= 0;
  const color = isUp ? '#10b981' : '#ef4444';
  const flashUp = market.flash === 'up';
  const flashDown = market.flash === 'down';

  return (
    <motion.button
      key={market.id}
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className="w-[210px] shrink-0 rounded-2xl p-4 text-left relative overflow-hidden transition-all duration-200 group"
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.12) 100%)'
          : flashUp
          ? 'rgba(16,185,129,0.07)'
          : flashDown
          ? 'rgba(239,68,68,0.07)'
          : 'var(--color-surface-0)',
        border: isActive
          ? '1px solid rgba(139,92,246,0.35)'
          : flashUp
          ? '1px solid rgba(16,185,129,0.25)'
          : flashDown
          ? '1px solid rgba(239,68,68,0.25)'
          : '1px solid rgba(var(--color-border-rgb), 0.1)',
        boxShadow: isActive
          ? '0 4px 24px rgba(139,92,246,0.18), inset 0 1px 0 rgba(var(--color-border-rgb),0.08)'
          : 'none',
        cursor: 'pointer',
        outline: 'none',
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active top bar */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.8), rgba(59,130,246,0.6))' }}
        />
      )}

      {/* Flash overlay */}
      <AnimatePresence>
        {(flashUp || flashDown) && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: flashUp
                ? 'rgba(16,185,129,0.12)'
                : 'rgba(239,68,68,0.12)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Header row */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]"
          style={{
            color: isActive ? 'rgb(var(--color-iris))' : 'rgb(var(--color-text-secondary))',
            transition: 'color 0.2s',
          }}
        >
          {market.name}
        </span>

        {/* Status badge */}
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            background: market.status === 'OPEN'
              ? 'rgba(16,185,129,0.1)'
              : market.status === '24/7'
              ? 'rgba(59,130,246,0.1)'
              : 'rgba(var(--color-border-rgb), 0.05)',
            border: market.status === 'OPEN'
              ? '1px solid rgba(16,185,129,0.2)'
              : '1px solid rgba(var(--color-border-rgb), 0.1)',
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{
              background: market.status === 'OPEN' ? '#10b981' : market.status === '24/7' ? '#3b82f6' : '#6b7280',
              boxShadow: market.status === 'OPEN' ? '0 0 5px rgba(16,185,129,0.6)' : 'none',
              animation: (market.status === 'OPEN' || market.status === '24/7') ? 'pulse 2s infinite' : 'none',
            }}
          />
          <span
            className="text-[8.5px] font-bold"
            style={{
              color: market.status === 'OPEN' ? '#10b981' : market.status === '24/7' ? '#60a5fa' : '#6b7280',
            }}
          >
            {market.status}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-1">
        <span
          className="text-[22px] font-black tabular-nums tracking-tight leading-none transition-colors duration-300"
          style={{
            color: market.flash
              ? color
              : isActive
              ? 'rgb(var(--color-text-primary))'
              : 'rgb(var(--color-text-primary))',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {market.price >= 1000
            ? market.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })
            : market.price.toFixed(2)}
        </span>
      </div>

      {/* Change */}
      <div
        className="flex items-center gap-1 mb-3"
        style={{ color }}
      >
        {isUp
          ? <ArrowUpRight size={13} />
          : <ArrowDownRight size={13} />
        }
        <span className="text-[11px] font-bold tabular-nums">
          {isUp ? '+' : ''}{market.change.toFixed(2)}
        </span>
        <span className="text-[11px] font-bold tabular-nums opacity-80">
          ({isUp ? '+' : ''}{market.changePercent.toFixed(2)}%)
        </span>
      </div>

      {/* Sparkline */}
      {market.sparkline && market.sparkline.length > 1 && (
        <div className="h-9 w-full opacity-60 group-hover:opacity-90 transition-opacity">
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <LineChart data={market.sparkline.map((v, i) => ({ v, i }))}>
              <YAxis domain={['auto', 'auto']} hide />
              <Line
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketOverviewHero({ activeSymbol, onSelectSymbol }: Props = {}) {
  const { data: markets, loading, error } = useLiveMarketData();

  return (
    <section className="w-full mb-8">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: 'rgb(var(--color-success))',
              boxShadow: '0 0 8px rgba(var(--color-success), 0.7)',
              animation: 'pulse 2s infinite',
            }}
          />
          <span className="text-[11px] font-bold text-success tracking-widest uppercase">Live Market Data</span>
        </div>
        <span className="text-border text-[11px]">·</span>
        <span className="text-[11px] text-tertiary">
          {markets.length > 0 ? `${markets.length} instruments` : 'Connecting…'}
        </span>
        {onSelectSymbol && (
          <>
            <span className="text-border text-[11px]">·</span>
            <span className="text-[11px] text-tertiary">Click card to load chart</span>
          </>
        )}
      </div>

      {/* Scrollable quote strip */}
      <div
        className="w-full overflow-x-auto pb-2 -mx-1 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-3 w-max min-h-[170px]">
          {loading && markets.length === 0 ? (
            Array(6).fill(0).map((_, i) => <QuoteSkeleton key={i} />)
          ) : error && markets.length === 0 ? (
            <div
              className="flex items-center gap-2.5 px-6 py-4 rounded-2xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.15)',
                color: 'rgba(239,68,68,0.7)',
                minWidth: '320px',
              }}
            >
              <AlertCircle size={16} />
              <div>
                <p className="font-semibold">Market data unavailable</p>
                <p className="text-[11px] opacity-70 mt-0.5">Check backend connection</p>
              </div>
            </div>
          ) : (
            markets.map((market, i) => (
              <QuoteCard
                key={market.id}
                market={market}
                isActive={activeSymbol?.toLowerCase() === market.id.toLowerCase()}
                onClick={() => onSelectSymbol?.(market.id)}
                index={i}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
