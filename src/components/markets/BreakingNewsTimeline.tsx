/**
 * BreakingNewsTimeline — Premium Live News Feed
 *
 * Pulls from the AI news engine feed. Timeline layout with
 * impact-coded dots, breaking news pulse animations, hover actions.
 */

import React, { useEffect, useState } from 'react';
import { Flame, Brain, ExternalLink, RefreshCw, Wifi, WifiOff, Newspaper } from 'lucide-react';
import { useNewsStore } from '../../stores/newsStore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsItem {
  publishedAt: string;
  url: string | null;
  id: string;
  title: string;
  source: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  sector: string;
  category: string;
  readTime: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const IMPACT = {
  high:   { dot: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.2)',  text: '#ef4444',  label: 'High' },
  medium: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b',  label: 'Med'  },
  low:    { dot: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10b981',  label: 'Low'  },
} as const;

const FILTERS = ['All', 'RBI', 'Results', 'Macro', 'Global'] as const;

const FILTER_MAP: Record<string, string[]> = {
  All:     [],
  RBI:     ['rbi', 'monetary policy', 'interest rate', 'central bank'],
  Results: ['earnings', 'results', 'quarterly', 'profit', 'revenue'],
  Macro:   ['macro', 'gdp', 'inflation', 'economy', 'fiscal', 'budget'],
  Global:  ['global', 'fed', 'us market', 'china', 'world', 'international'],
};

const DIR_LABEL: Record<string, string> = {
  positive: 'Bullish', negative: 'Bearish', neutral: 'Neutral', mixed: 'Mixed',
};

function confidenceToImpact(conf: string): 'high' | 'medium' | 'low' {
  if (conf === 'high') return 'high';
  if (conf === 'medium') return 'medium';
  return 'low';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function NewsSkeleton() {
  return (
    <div className="pl-5 space-y-5">
      {[1, 2, 3].map(n => (
        <div key={n} className="relative animate-pulse" style={{ animationDelay: `${n * 100}ms` }}>
          <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(var(--color-border-rgb),0.1)' }} />
          <div className="h-3 rounded-full w-24 mb-2" style={{ background: 'rgba(var(--color-border-rgb),0.07)' }} />
          <div className="h-3.5 rounded-lg w-full mb-1" style={{ background: 'rgba(var(--color-border-rgb),0.06)' }} />
          <div className="h-3.5 rounded-lg w-4/5" style={{ background: 'rgba(var(--color-border-rgb),0.04)' }} />
        </div>
      ))}
    </div>
  );
}

// ─── News Item Row ────────────────────────────────────────────────────────────

function NewsRow({ item, onAnalyze }: {
  item: { id: string; title: string; source: string; time: string; impact: 'high' | 'medium' | 'low'; sector: string; category: string; readTime: string; publishedAt: string; urgency: string; url: string | null; sectorTags: string[] };
  onAnalyze: (item: NewsItem) => void;
}) {
  const impact = IMPACT[item.impact];
  const isBreaking = item.urgency === 'breaking';

  return (
    <div className="relative pb-5 group">
      {/* Timeline dot */}
      <div
        className="absolute -left-[18px] top-[5px] w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{
          background: impact.dot,
          border: '2px solid rgba(13,13,18,1)',
          boxShadow: isBreaking ? `0 0 10px ${impact.dot}80, 0 0 4px ${impact.dot}` : 'none',
        }}
      />
      {isBreaking && (
        <div
          className="absolute -left-[18px] top-[5px] w-2.5 h-2.5 rounded-full animate-ping"
          style={{ background: impact.dot, opacity: 0.35 }}
        />
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        {isBreaking && (
          <span
            className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            ⚡ BREAKING
          </span>
        )}
        <span className="text-[10px] font-semibold" style={{ color: 'rgba(var(--color-border-rgb),0.35)' }}>{item.time}</span>
        <span style={{ color: 'rgba(var(--color-border-rgb),0.12)', fontSize: '10px' }}>·</span>
        <span className="text-[10px] font-bold" style={{ color: 'rgba(var(--color-border-rgb),0.3)' }}>{item.source}</span>
      </div>

      {/* Headline */}
      <button
        onClick={() => onAnalyze(item)}
        className="text-left w-full mb-2.5 text-[13px] font-semibold leading-snug transition-colors duration-150 cursor-pointer"
        style={{ color: 'rgba(var(--color-border-rgb),0.75)', background: 'none', border: 'none', padding: 0 }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(var(--color-border-rgb),0.95)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(var(--color-border-rgb),0.75)')}
      >
        {item.title}
      </button>

      {/* Tags + hover actions */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Sector tag */}
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(var(--color-border-rgb),0.05)', color: 'rgba(var(--color-border-rgb),0.35)', border: '1px solid rgba(var(--color-border-rgb),0.06)' }}
        >
          {item.sector}
        </span>

        {/* Confidence badge */}
        <span
          className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: impact.bg, color: impact.text, border: `1px solid ${impact.border}` }}
        >
          {impact.label}
        </span>

        {/* Hover actions */}
        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onAnalyze(item)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors"
            style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.2)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.12)')}
          >
            <Brain size={10} />
            <span>AI</span>
          </button>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-md transition-colors"
              style={{ color: 'rgba(var(--color-border-rgb),0.25)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(var(--color-border-rgb),0.6)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(var(--color-border-rgb),0.25)')}
            >
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props { onAnalyze: (item: NewsItem) => void }

export default function BreakingNewsTimeline({ onAnalyze }: Props) {
  const { engineFeed, loadingFeed, feedError, fetchEngineFeed } = useNewsStore();
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchEngineFeed({ limit: 20 });
    const interval = setInterval(() => {
      fetchEngineFeed({ limit: 20 });
    }, 5 * 60_000);
    return () => clearInterval(interval);
  }, [fetchEngineFeed]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEngineFeed({ limit: 20 });
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Map engine feed → display items
  const allItems = engineFeed
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 30)
    .map(item => ({
      id: item.id,
      title: item.headline,
      source: item.source,
      time: timeAgo(item.publishedAt),
      publishedAt: item.publishedAt,
      impact: confidenceToImpact(item.confidence),
      sector: item.sectors[0] || 'General',
      category: DIR_LABEL[item.direction] || 'News',
      readTime: '2 min',
      url: item.url,
      urgency: item.urgency,
      direction: item.direction,
      sectorTags: item.sectors.map((s: string) => s.toLowerCase()),
    }));

  const filtered = activeFilter === 'All'
    ? allItems.slice(0, 8)
    : allItems.filter(item => {
        const kws = FILTER_MAP[activeFilter] ?? [];
        const text = `${item.title} ${item.sector} ${item.sectorTags.join(' ')}`.toLowerCase();
        return kws.some(kw => text.includes(kw));
      }).slice(0, 8);

  const breakingCount = filtered.filter(i => i.urgency === 'breaking').length;

  return (
    <section className="desk-panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <Flame size={14} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-primary/90 leading-none">Market headlines</h3>
          </div>
          {breakingCount > 0 && (
            <span
              className="text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              {breakingCount} BREAKING
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {loadingFeed && <span className="text-xs text-secondary">Updating…</span>}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: 'rgba(var(--color-border-rgb),0.04)' }}
            title="Refresh news"
          >
            <RefreshCw size={12} className={`transition-all ${isRefreshing ? 'animate-spin text-violet-400' : 'text-secondary hover:text-primary'}`} />
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {FILTERS.map(f => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              aria-pressed={isActive}
              className="rounded-md border border-border px-2.5 py-1 text-xs text-secondary aria-pressed:bg-accent/10 aria-pressed:text-accent"
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loadingFeed && filtered.length === 0 && <NewsSkeleton />}

      {/* Timeline */}
      {!loadingFeed && filtered.length > 0 && (
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[3px] top-2 bottom-2 w-px"
            style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.4) 0%, rgba(var(--color-border-rgb),0.04) 100%)' }}
          />
          <div className="pl-5">
            {filtered.map(item => (
              <NewsRow key={item.id} item={item} onAnalyze={onAnalyze} />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!loadingFeed && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(var(--color-border-rgb),0.04)', border: '1px solid rgba(var(--color-border-rgb),0.07)' }}
          >
            <Newspaper size={18} className="text-tertiary" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-secondary">{feedError ? "Headlines are unavailable." : "No headlines in this category."}</p>
          </div>
        </div>
      )}
    </section>
  );
}
