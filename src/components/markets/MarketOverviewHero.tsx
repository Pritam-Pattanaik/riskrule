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
  const color = isUp ? 'rgb(var(--color-success))' : 'rgb(var(--color-danger))';
  const flashUp = market.flash === 'up';
  const flashDown = market.flash === 'down';

  return (
    <motion.button
      key={market.id}
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className={cn(
        "w-[215px] shrink-0 rounded-2xl p-4 text-left relative overflow-hidden transition-all duration-200 group border cursor-pointer outline-none select-none",
        isActive
          ? "bg-surface border-2 border-accent shadow-gold"
          : "bg-surface border-border hover:border-border-hover hover:-translate-y-0.5 shadow-xs hover:shadow-card"
      )}
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgb(var(--color-surface)) 0%, rgb(var(--color-surface-1)) 100%)'
          : flashUp
          ? 'rgba(5,150,105,0.08)'
          : flashDown
          ? 'rgba(220,38,38,0.08)'
          : undefined,
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active top bar */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-accent via-gold to-accent-hover"
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
                ? 'rgba(5,150,105,0.15)'
                : 'rgba(220,38,38,0.15)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Header row */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className={cn(
            "text-xs font-black uppercase tracking-wider truncate max-w-[120px]",
            isActive ? "text-accent" : "text-primary"
          )}
        >
          {market.name}
        </span>

        {/* Status badge */}
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0 border font-bold text-[9px]",
            market.status === 'OPEN'
              ? 'bg-success/10 text-success border-success/30'
              : market.status === '24/7'
              ? 'bg-blue/10 text-blue border-blue/30'
              : 'bg-surface-2 text-secondary border-border'
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              market.status === 'OPEN' ? 'bg-success animate-pulse' : market.status === '24/7' ? 'bg-blue animate-pulse' : 'bg-tertiary'
            )}
          />
          <span>{market.status}</span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-1">
        <span
          className={cn(
            "text-2xl font-black font-mono tabular-nums tracking-tight leading-none transition-colors duration-300",
            isActive ? "text-primary" : "text-primary"
          )}
        >
          {market.price >= 1000
            ? market.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })
            : market.price.toFixed(2)}
        </span>
      </div>

      {/* Change */}
      <div
        className={cn(
          "flex items-center gap-1 mb-3 text-xs font-bold font-mono tabular-nums",
          isUp ? "text-success" : "text-danger"
        )}
      >
        {isUp
          ? <ArrowUpRight size={14} strokeWidth={2.5} />
          : <ArrowDownRight size={14} strokeWidth={2.5} />
        }
        <span>
          {isUp ? '+' : ''}{market.change.toFixed(2)}
        </span>
        <span className="opacity-90">
          ({isUp ? '+' : ''}{market.changePercent.toFixed(2)}%)
        </span>
      </div>

      {/* Sparkline */}
      {market.sparkline && market.sparkline.length > 1 && (
        <div className="h-9 w-full group-hover:scale-105 transition-transform">
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <LineChart data={market.sparkline.map((v, i) => ({ v, i }))}>
              <YAxis domain={['auto', 'auto']} hide />
              <Line
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={2.5}
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
