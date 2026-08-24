/**
 * LiveAISummary — Premium AI Market Summary Card
 *
 * Groq-powered market sentiment analysis with:
 * - Sentiment gauge with animated indicator
 * - Highlight / Risk sections
 * - Events to Watch
 * - Educational insight
 * - Stale data warning
 * - SEBI-compliant disclaimer
 * - Auto-refresh every 16 min (via hook)
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Brain, Sparkles, TrendingUp, TrendingDown, AlertTriangle,
  RefreshCw, BookOpen, Shield, Eye, Minus, Zap,
} from 'lucide-react';
import { useAISummary, type MarketSummary, type MarketSentiment } from '../../hooks/useMarketData';

// ─── Sentiment config ──────────────────────────────────────────────────────────

const SENTIMENT: Record<MarketSentiment, {
  label: string; color: string; bg: string; border: string;
  glow: string; icon: typeof TrendingUp;
}> = {
  BULLISH: { label: 'Bullish',  color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)',  glow: 'rgba(16,185,129,0.15)',  icon: TrendingUp   },
  BEARISH: { label: 'Bearish',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   glow: 'rgba(239,68,68,0.15)',   icon: TrendingDown },
  NEUTRAL: { label: 'Neutral',  color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.2)',  glow: 'none',                   icon: Minus        },
  MIXED:   { label: 'Mixed',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  glow: 'rgba(245,158,11,0.1)',   icon: Zap          },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(var(--color-border-rgb),0.02)', border: '1px solid rgba(var(--color-border-rgb),0.07)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl animate-pulse" style={{ background: 'rgba(139,92,246,0.15)' }} />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 rounded-lg animate-pulse w-40" style={{ background: 'rgba(var(--color-border-rgb),0.08)' }} />
          <div className="h-3 rounded-lg animate-pulse w-28" style={{ background: 'rgba(var(--color-border-rgb),0.05)' }} />
        </div>
      </div>
      <div className="space-y-2.5 mb-4">
        {[100, 85, 90, 70].map((w, i) => (
          <div key={i} className="h-3 rounded-full animate-pulse" style={{ background: 'rgba(var(--color-border-rgb),0.05)', width: `${w}%`, animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map(i => (
          <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'rgba(var(--color-border-rgb),0.04)', animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Info section ─────────────────────────────────────────────────────────────

function InfoSection({
  icon: Icon,
  label,
  items,
  color,
  bg,
  border,
  bullet = '•',
}: {
  icon: typeof TrendingUp;
  label: string;
  items: string[];
  color: string;
  bg: string;
  border: string;
  bullet?: string;
}) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <Icon size={11} style={{ color }} />
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>
          {label}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: 'rgba(var(--color-border-rgb),0.6)' }}>
            <span className="mt-0.5 shrink-0 font-bold text-[10px]" style={{ color }}>{bullet}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LiveAISummary() {
  const { summary, loading, retrying, error, refresh } = useAISummary();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    if (summary?.generatedAt) {
      setLastUpdated(
        new Date(summary.generatedAt).toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
        })
      );
    }
  }, [summary]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refresh]);

  // Loading state
  if (loading) {
    return (
      <div>
        <Skeleton />
        {retrying && (
          <p className="text-[10px] text-center mt-2" style={{ color: 'rgba(var(--color-border-rgb),0.25)' }}>
            Retrying AI connection…
          </p>
        )}
      </div>
    );
  }

  // Error state
  if (error || !summary) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(var(--color-border-rgb),0.02)', border: '1px solid rgba(239,68,68,0.15)' }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <Brain size={15} className="text-violet-400" />
          </div>
          <h3 className="text-[14px] font-bold text-primary/90">AI Market Summary</h3>
        </div>
        <div className="text-center py-6">
          <AlertTriangle size={28} className="mx-auto mb-2.5" style={{ color: '#f59e0b', opacity: 0.7 }} />
          <p className="text-[13px] font-semibold mb-1" style={{ color: 'rgba(var(--color-border-rgb),0.6)' }}>Summary unavailable</p>
          <p className="text-[11px] max-w-[220px] mx-auto mb-4" style={{ color: 'rgba(var(--color-border-rgb),0.3)' }}>
            The AI service is temporarily unavailable. Check back shortly.
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[12px] font-bold mx-auto transition-all disabled:opacity-50"
            style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Retrying…' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  const cfg = SENTIMENT[summary.sentiment] ?? SENTIMENT.NEUTRAL;
  const SentIcon = cfg.icon;

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'rgba(var(--color-border-rgb),0.02)', border: '1px solid rgba(var(--color-border-rgb),0.07)' }}
    >
      {/* Ambient glow from sentiment */}
      {cfg.glow !== 'none' && (
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)` }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}
          >
            <Brain size={15} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-primary/90 leading-none flex items-center gap-1.5">
              AI Market Summary
              <Sparkles size={11} className="text-violet-400 animate-pulse" />
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(var(--color-border-rgb),0.3)' }}>
              {lastUpdated ? `Updated ${lastUpdated} IST` : 'Groq · Live analysis'}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(var(--color-border-rgb),0.04)' }}
          title="Refresh AI summary"
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(var(--color-border-rgb),0.08)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(var(--color-border-rgb),0.04)')}
        >
          <RefreshCw
            size={12}
            className={`transition-all ${isRefreshing ? 'animate-spin text-violet-400' : 'text-primary/25'}`}
          />
        </button>
      </div>

      {/* Stale banner */}
      {summary.isStale && (
        <div
          className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <AlertTriangle size={12} style={{ color: '#f59e0b' }} className="flex-shrink-0" />
          <p className="text-[11px] font-medium" style={{ color: '#fbbf24' }}>
            {summary.staleAgeMinutes}m old — AI is regenerating
          </p>
        </div>
      )}

      {/* Sentiment badge */}
      <div
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-black mb-4"
        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, boxShadow: cfg.glow !== 'none' ? `0 0 12px ${cfg.glow}` : 'none' }}
      >
        <SentIcon size={14} />
        {cfg.label} Market
      </div>

      {/* Highlights + Risks */}
      <div className="grid grid-cols-1 gap-2.5 mb-2.5">
        {summary.highlights.length > 0 && (
          <InfoSection
            icon={TrendingUp}
            label="Key Highlights"
            items={summary.highlights}
            color="#10b981"
            bg="rgba(16,185,129,0.06)"
            border="rgba(16,185,129,0.15)"
          />
        )}
        {summary.risks.length > 0 && (
          <InfoSection
            icon={AlertTriangle}
            label="Risk Factors"
            items={summary.risks}
            color="#f59e0b"
            bg="rgba(245,158,11,0.06)"
            border="rgba(245,158,11,0.15)"
          />
        )}
      </div>

      {/* Events to Watch */}
      {summary.eventsToWatch?.length > 0 && (
        <div className="mb-2.5">
          <InfoSection
            icon={Eye}
            label="Events to Watch"
            items={summary.eventsToWatch}
            color="#a78bfa"
            bg="rgba(139,92,246,0.06)"
            border="rgba(139,92,246,0.15)"
            bullet="→"
          />
        </div>
      )}

      {/* Educational Insight */}
      {summary.educationalInsight && (
        <div
          className="rounded-xl p-3.5 mb-4"
          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen size={11} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Educational Insight</span>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(var(--color-border-rgb),0.55)' }}>
            {summary.educationalInsight}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 pt-3" style={{ borderTop: '1px solid rgba(var(--color-border-rgb),0.06)' }}>
        <Shield size={11} className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(var(--color-border-rgb),0.2)' }} />
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(var(--color-border-rgb),0.2)' }}>
          {summary.disclaimer}
        </p>
      </div>
    </div>
  );
}
