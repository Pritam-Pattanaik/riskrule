/**
 * DigestPanel — Today's Pre-Market Digest
 * Premium redesign: clear empty state, rich digest view, sector breakdown
 */
import React, { useEffect } from 'react';
import { useNewsStore } from '../../stores/newsStore';
import { BookOpen, Clock, TrendingUp, TrendingDown, Minus, Activity, RefreshCw, Calendar } from 'lucide-react';

const DIR_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  positive: { icon: TrendingUp,   color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  negative: { icon: TrendingDown, color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  neutral:  { icon: Minus,        color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  mixed:    { icon: Activity,     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
};

// ─── Empty / Not-Yet-Generated State ─────────────────────────────────────────

function DigestEmptyState({ message }: { message?: string }) {
  return <div className="space-y-2 py-5">
    <h2 className="text-lg font-semibold">Daily digest</h2>
    <p className="text-sm text-secondary">{message || 'Today’s pre-market digest is not available yet.'}</p>
  </div>;
}

// ─── Digest Item Card ─────────────────────────────────────────────────────────

function DigestItem({ item, index }: { item: any; index: number }) {
  const cfg = DIR_CONFIG[item.direction] ?? DIR_CONFIG.neutral;
  const Icon = cfg.icon;

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl transition-colors"
      style={{ background: 'rgba(var(--color-border-rgb),0.025)', border: '1px solid rgba(var(--color-border-rgb),0.06)' }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(var(--color-border-rgb),0.045)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(var(--color-border-rgb),0.025)')}
    >
      {/* Index + Direction icon */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <span className="text-[10px] text-secondary font-mono">{String(index + 1).padStart(2, '0')}</span>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: cfg.bg }}>
          <Icon size={11} style={{ color: cfg.color }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-medium text-primary/80 leading-snug mb-1.5">{item.headline}</p>
        {item.sectors?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {item.sectors.slice(0, 3).map((s: string) => (
              <span
                key={s}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(139,92,246,0.09)', color: 'rgba(167,139,250,0.75)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Full Digest View ─────────────────────────────────────────────────────────

function DigestContent({ digest, allItems, sectors }: { digest: any; allItems: any[]; sectors: string[] }) {
  const sentimentMap = allItems.reduce((acc, item) => {
    acc[item.direction] = (acc[item.direction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominant = Object.entries(sentimentMap).sort(([,a],[,b]) => (b as number) - (a as number))[0]?.[0] ?? 'neutral';
  const DomIcon = DIR_CONFIG[dominant]?.icon ?? Minus;
  const domColor = DIR_CONFIG[dominant]?.color ?? '#6b7280';

  return (
    <div className="flex flex-col gap-5">

      {/* Digest header card */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(59,130,246,0.04) 100%)', border: '1px solid rgba(139,92,246,0.18)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen size={14} className="text-violet-400" />
              <span className="text-sm font-bold text-primary/85">Pre-Market Digest</span>
            </div>
            <p className="text-[12px] text-secondary">
              {allItems.length} events · {sectors.length} sectors analysed
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-secondary mb-0.5">Generated</p>
            <p className="text-[12px] font-bold text-secondary">
              {digest?.generatedAt
                ? new Date(digest.generatedAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
                  }) + ' IST'
                : '—'}
            </p>
          </div>
        </div>

        {/* Dominant sentiment bar */}
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(var(--color-border-rgb),0.06)' }}>
          <span className="text-[11px] text-secondary">Overall Tone:</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: domColor }}>
            <DomIcon size={11} />
            {dominant.charAt(0).toUpperCase() + dominant.slice(1)}
          </span>
          <div className="flex-1 h-1.5 rounded-full ml-2" style={{ background: 'rgba(var(--color-border-rgb),0.06)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((sentimentMap[dominant] || 0) / allItems.length) * 100}%`,
                background: domColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Active sectors */}
      {sectors.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-2.5">Active Sectors</p>
          <div className="flex flex-wrap gap-2">
            {sectors.map(s => (
              <span
                key={s}
                className="text-[11px] font-medium px-3 py-1 rounded-full"
                style={{ background: 'rgba(139,92,246,0.1)', color: 'rgba(167,139,250,0.85)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sentiment breakdown */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(sentimentMap).map(([dir, count]) => {
          const cfg = DIR_CONFIG[dir] ?? DIR_CONFIG.neutral;
          const Icon = cfg.icon;
          return (
            <div
              key={dir}
              className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(var(--color-border-rgb),0.03)', border: '1px solid rgba(var(--color-border-rgb),0.06)' }}
            >
              <Icon size={14} className="mx-auto mb-1" style={{ color: cfg.color }} />
              <p className="text-lg font-bold tabular-nums" style={{ color: cfg.color }}>{count as number}</p>
              <p className="text-[10px] text-secondary capitalize">{dir}</p>
            </div>
          );
        })}
      </div>

      {/* News items */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-2.5">
          All Items ({allItems.length})
        </p>
        <div className="flex flex-col gap-2">
          {allItems.slice(0, 12).map((item: any, i: number) => (
            <DigestItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg p-3" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}>
        <p className="text-[10px] text-amber-400/50 leading-relaxed">
          {digest?.disclaimer ?? '⚠️ Educational Use Only. All analysis is for educational purposes only. Not investment advice.'}
        </p>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function DigestPanel() {
  const { todayDigest, loadingDigest, fetchTodayDigest } = useNewsStore();

  useEffect(() => { fetchTodayDigest(); }, []);

  // Loading skeleton
  if (loadingDigest) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="rounded-xl p-4 h-24" style={{ background: 'rgba(var(--color-border-rgb),0.04)', border: '1px solid rgba(var(--color-border-rgb),0.07)' }} />
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(n => (
            <div key={n} className="rounded-xl p-3 h-16" style={{ background: 'rgba(var(--color-border-rgb),0.03)' }} />
          ))}
        </div>
        {[1,2,3].map(n => (
          <div key={n} className="rounded-xl p-3 h-14" style={{ background: 'rgba(var(--color-border-rgb),0.02)' }} />
        ))}
      </div>
    );
  }

  // Digest not yet available
  if (!todayDigest?.available) {
    return <DigestEmptyState message={todayDigest?.message} />;
  }

  const digest   = todayDigest.digest;
  const sectors  = digest?.sectors  ?? [];
  const allItems = digest?.allItems ?? [];

  return <DigestContent digest={digest} allItems={allItems} sectors={sectors} />;
}
