import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, TrendingUp, BarChart2, Activity, Globe } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import MarketOverviewHero from '../components/markets/MarketOverviewHero';
import LiveAISummary from '../components/markets/LiveAISummary';
import MarketBreadth from '../components/markets/MarketBreadth';
import LiveSectorHeatmap from '../components/markets/LiveSectorHeatmap';
import EnhancedEconomicCalendar from '../components/markets/EnhancedEconomicCalendar';
import BreakingNewsTimeline, { NewsItem } from '../components/markets/BreakingNewsTimeline';
import MarketIntelligenceCenter from '../components/markets/MarketIntelligenceCenter';
import { NewsEngineFeed } from '../components/markets/NewsEngineFeed';
import { DigestPanel } from '../components/markets/DigestPanel';
import LiveWatchlist from '../components/markets/LiveWatchlist';

type MarketTab = 'overview' | 'engine' | 'digest';

const TAB_CONFIG: {
  id: MarketTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  description: string;
}[] = [
  {
    id: 'overview',
    label: 'Market Overview',
    icon: <TrendingUp size={14} />,
    description: 'Live prices, sectors, heatmap',
  },
  {
    id: 'engine',
    label: 'AI Intelligence',
    icon: <Zap size={14} />,
    badge: 'Live',
    badgeColor: '#10b981',
    description: 'Real-time AI market analysis',
  },
  {
    id: 'digest',
    label: "Today's Digest",
    icon: <BarChart2 size={14} />,
    description: 'Pre-market daily briefing',
  },
];

// ─── Animated Tab indicator ───────────────────────────────────────────────────

function TabNav({ active, onChange }: { active: MarketTab; onChange: (t: MarketTab) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface-1 border border-border backdrop-blur-md">
      {TAB_CONFIG.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            id={`markets-tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              letterSpacing: isActive ? '-0.01em' : '0',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isActive
                ? 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(59,130,246,0.18) 100%)'
                : 'transparent',
              color: isActive ? 'rgb(var(--color-iris))' : 'rgb(var(--color-text-secondary))',
              boxShadow: isActive
                ? '0 2px 12px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.08)'
                : 'none',
              borderTop: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
            }}
            title={tab.description}
          >
            <span style={{ opacity: isActive ? 1 : 0.55, transition: 'opacity 0.2s' }}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span style={{
                fontSize: '9px',
                padding: '2px 6px',
                borderRadius: '20px',
                background: `rgba(16,185,129,0.15)`,
                color: '#10b981',
                fontWeight: 800,
                letterSpacing: '0.5px',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Page header ──────────────────────────────────────────────────────────────

function PageHeader() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const istTime = new Date(time.getTime() + (5.5 * 60 * 60 * 1000));
  const hours = istTime.getUTCHours();
  const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istTime.getUTCSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;

  // NSE market hours: Mon-Fri 9:15 AM–3:30 PM IST
  const isWeekday = [1, 2, 3, 4, 5].includes(istTime.getUTCDay());
  const totalMins = istTime.getUTCHours() * 60 + istTime.getUTCMinutes();
  const isMarketHours = totalMins >= 555 && totalMins < 930; // 9:15 to 15:30
  const isMarketOpen = isWeekday && isMarketHours;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      {/* Title block */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.2) 100%)',
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 4px 16px rgba(139,92,246,0.2)',
          }}
        >
          <Globe size={18} className="text-iris" />
        </div>
        <div>
          <h1 className="text-[22px] font-black text-primary tracking-tight leading-none">
            Market Intelligence
          </h1>
          <p className="text-[12px] text-tertiary mt-0.5 font-medium">
            NSE · BSE · Commodities · Forex
          </p>
        </div>
      </div>

      {/* Live clock + market status */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-1 border border-border"
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: isMarketOpen ? '#10b981' : '#6b7280',
              boxShadow: isMarketOpen ? '0 0 8px rgba(16,185,129,0.6)' : 'none',
              animation: isMarketOpen ? 'pulse 2s infinite' : 'none',
            }}
          />
          <span className="text-[11px] font-bold" style={{ color: isMarketOpen ? '#10b981' : '#6b7280' }}>
            NSE {isMarketOpen ? 'OPEN' : 'CLOSED'}
          </span>
          <span className="text-border text-[11px]">·</span>
          <span className="font-mono text-[12px] text-secondary tabular-nums">
            {h12}:{minutes}:{seconds} {ampm} IST
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper with premium glass styling ───────────────────────────────

function SectionCard({
  children,
  className = '',
  gradient,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-surface-0 border border-border ${className}`}
      style={{
        background: gradient || 'var(--color-surface-0)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Markets Page ────────────────────────────────────────────────────────

export default function Markets() {
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [activeTab, setActiveTab] = useState<MarketTab>('overview');
  const [selectedSymbol, setSelectedSymbol] = useState('nifty');

  const [searchParams, setSearchParams] = useSearchParams();

  // Deep-link support via URL params — read on mount only.
  const initialParamsRef = React.useRef(searchParams);
  useEffect(() => {
    const tab = initialParamsRef.current.get('tab') as MarketTab;
    if (tab && ['overview', 'engine', 'digest'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []); // intentionally empty — reads once on mount via stable ref

  // Write tab changes back to URL
  const handleTabChange = (tab: MarketTab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  useEffect(() => {
    if (selectedArticle) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedArticle]);

  // ─── Article detail view ───────────────────────────────────────────────────
  if (selectedArticle) {
    return (
      <div
        className="w-full min-h-screen pb-24 bg-canvas"
      >
        <div
          className="w-full border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)' }}
        >
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-4">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2.5 text-sm font-semibold text-tertiary hover:text-primary transition-colors group"
            >
              <div className="p-1.5 rounded-lg transition-colors group-hover:bg-surface-1 bg-surface-0 border border-border">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Market Intelligence
            </button>
          </div>
        </div>
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MarketIntelligenceCenter article={{
            id: selectedArticle.id,
            headline: selectedArticle.title,
            source: selectedArticle.source,
            url: (selectedArticle as any).url || '',
            publishedAt: (selectedArticle as any).publishedAt
              ? new Date((selectedArticle as any).publishedAt).getTime() / 1000
              : Date.now() / 1000 - 3600,
            summary: 'Fetching market analysis…',
          }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen pb-24 bg-canvas"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ─── Page Header ───────────────────────────────────────────────── */}
        <PageHeader />

        {/* ─── Tab Navigation ────────────────────────────────────────────── */}
        <div className="mb-8">
          <TabNav active={activeTab} onChange={handleTabChange} />
        </div>

        {/* ─── Market Overview Tab ────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div
            key="overview"
            style={{ animation: 'fadeSlideUp 0.3s ease forwards' }}
          >
            {/* Quote strip */}
            <MarketOverviewHero
              activeSymbol={selectedSymbol}
              onSelectSymbol={setSelectedSymbol}
            />

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">

              {/* ── Left / Main Column (8/12) ───────────────────────────── */}
              <div className="xl:col-span-8 flex flex-col gap-6">
                {/* AI Summary + Market Breadth side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LiveAISummary />
                  <MarketBreadth />
                </div>

                {/* Sector Heatmap */}
                <LiveSectorHeatmap />
              </div>

              {/* ── Right Sidebar (4/12) ────────────────────────────────── */}
              <div className="xl:col-span-4 flex flex-col gap-6">

                {/* Watchlist */}
                <div style={{ height: '400px' }}>
                  <LiveWatchlist />
                </div>

                {/* Breaking News */}
                <BreakingNewsTimeline onAnalyze={setSelectedArticle} />

                {/* Economic Calendar */}
                <EnhancedEconomicCalendar />
              </div>
            </div>
          </div>
        )}

        {/* ─── AI Intelligence Engine Tab ─────────────────────────────────── */}
        {activeTab === 'engine' && (
          <div
            key="engine"
            style={{ animation: 'fadeSlideUp 0.3s ease forwards' }}
          >
            {/* Engine header banner */}
            <div
              className="rounded-2xl p-6 mb-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.05) 50%, rgba(0,0,0,0) 100%)',
                border: '1px solid rgba(139,92,246,0.18)',
              }}
            >
              {/* Glow orb */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
              />

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
                    >
                      <Zap size={15} className="text-iris" />
                    </div>
                    <h2 className="text-[19px] font-black text-primary tracking-tight">
                      AI Market Intelligence Engine
                    </h2>
                  </div>
                  <p className="text-[13px] text-tertiary leading-relaxed max-w-xl">
                    Continuous NSE/BSE/RBI news monitoring with real-time AI sector-level impact
                    analysis. All analysis is educational only — not investment advice.
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div
                    className="px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-[11px] font-bold tracking-widest text-success">
                        EDUCATIONAL MODE
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-tertiary">SEBI Compliant</span>
                </div>
              </div>
            </div>

            {/* Feed */}
            <SectionCard className="p-6 min-h-[60vh]">
              <NewsEngineFeed />
            </SectionCard>
          </div>
        )}

        {/* ─── Today's Digest Tab ─────────────────────────────────────────── */}
        {activeTab === 'digest' && (
          <div
            key="digest"
            style={{ animation: 'fadeSlideUp 0.3s ease forwards' }}
          >
            {/* Digest header banner */}
            <div
              className="rounded-2xl p-6 mb-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 50%, rgba(0,0,0,0) 100%)',
                border: '1px solid rgba(59,130,246,0.18)',
              }}
            >
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}
              />

              <div className="flex items-start justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}
                    >
                      <BarChart2 size={15} className="text-accent" />
                    </div>
                    <h2 className="text-[19px] font-black text-primary tracking-tight">
                      Pre-Market Digest
                    </h2>
                  </div>
                  <p className="text-[13px] text-tertiary leading-relaxed">
                    AI-generated daily briefing published at{' '}
                    <span className="text-secondary font-semibold">7:30 AM IST</span> on trading days.
                    Includes sector-level overnight impact and global developments.
                  </p>
                </div>

                <div
                  className="px-3 py-1.5 rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <Activity size={11} className="text-accent" />
                    <span className="text-[11px] font-bold tracking-widest text-accent">
                      DAILY BRIEF
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-3xl">
              <SectionCard className="p-6">
                <DigestPanel />
              </SectionCard>
            </div>
          </div>
        )}

      </div>

      {/* Fade-slide animation */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
