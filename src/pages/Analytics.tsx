import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useTradeStore } from '../stores/tradeStore';
import { ExpectancyClient } from '../lib/expectancyClient';
import type { ExpectancyMetrics } from '../workers/expectancyWorker';
import {
  Activity, AlertCircle, Clock, ShieldAlert, TrendingDown, Cpu,
  Sparkles, BarChart3, Layers, ArrowUpDown, Calendar, Receipt,
  Flame, Target,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../lib/analytics';
import { cn } from '../lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import AnalyticsDateFilter from '../components/analytics/AnalyticsDateFilter';

// Lazy-load heavy chart components
const EquityCurveAnalytics = lazy(() => import('../components/analytics/EquityCurveAnalytics'));
const PnlDistribution      = lazy(() => import('../components/analytics/PnlDistribution'));
const StrategyComparison   = lazy(() => import('../components/analytics/StrategyComparison'));
const InstrumentBreakdown  = lazy(() => import('../components/analytics/InstrumentBreakdown'));
const MonthlySummary       = lazy(() => import('../components/analytics/MonthlySummary'));
const DisciplineAnalytics  = lazy(() => import('../components/analytics/DisciplineAnalytics'));
const ChargesAnalytics     = lazy(() => import('../components/analytics/ChargesAnalytics'));
const StreakAnalytics      = lazy(() => import('../components/analytics/StreakAnalytics'));

// ─── Tab definitions ──────────────────────────────────────────────────────────
type Tab = 'overview' | 'risk' | 'strategy' | 'behavior' | 'performance';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'overview',    label: 'Overview',     icon: BarChart3 },
  { key: 'risk',        label: 'Risk & P&L',   icon: ShieldAlert },
  { key: 'strategy',   label: 'Strategy',      icon: Target },
  { key: 'behavior',   label: 'Behavior',      icon: Sparkles },
  { key: 'performance', label: 'Performance',  icon: Calendar },
];

// ─── Reusable section card ────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children, className }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('bg-surface border border-border rounded-2xl p-6 shadow-xs', className)}>
      <div className="mb-4">
        <h2 className="text-base font-bold font-ui text-primary">{title}</h2>
        {subtitle && <p className="text-xs text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Mini KPI card ────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, trend }: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: 'positive' | 'negative' | 'neutral';
}) {
  const valueColor = trend === 'positive' ? 'text-success' : trend === 'negative' ? 'text-danger' : 'text-primary';
  return (
    <div className="p-5 bg-surface border border-border rounded-xl shadow-xs hover:shadow-card transition-shadow">
      <div className="flex items-center gap-2 mb-2 text-tertiary">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className={cn('text-2xl font-bold font-mono tabular-nums', valueColor)}>{value}</p>
      {sub && <p className="text-xs text-tertiary mt-1">{sub}</p>}
    </div>
  );
}

// ─── Weekday / Hour row ───────────────────────────────────────────────────────
function SessionRow({ label, pnl, count }: { label: string; pnl: number; count: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-1 rounded-lg border border-border-subtle hover:border-border transition-colors">
      <div>
        <p className="font-semibold text-sm text-primary">{label}</p>
        <p className="text-xs text-tertiary mt-0.5">{count} trade{count !== 1 ? 's' : ''}</p>
      </div>
      <span className={cn('font-mono text-sm font-bold', pnl >= 0 ? 'text-success' : 'text-danger')}>
        {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Analytics() {
  const {
    mistakes, session, risk, loading,
    instrumentBreakdown, monthlySummary, strategyComparison,
    chargesSummary, disciplineCorrelation, loadingSecondary,
    dateRange, setDateRange,
    fetchAnalytics, fetchSecondaryAnalytics,
  } = useAnalyticsStore();
  const { trades, fetchTrades } = useTradeStore();
  const [workerMetrics, setWorkerMetrics] = useState<ExpectancyMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
    fetchSecondaryAnalytics();
    if (trades.length === 0) fetchTrades();
  }, [fetchAnalytics, fetchSecondaryAnalytics, fetchTrades, trades.length]);

  // Filter trades clientside to match the server date range for worker computations
  const filteredTrades = React.useMemo(() => {
    if (dateRange.preset === 'all') return trades;
    const getPresetBounds = () => {
      const today = new Date(); today.setHours(23, 59, 59, 999);
      if (dateRange.preset === 'week') {
        const day = today.getDay();
        const start = new Date(today); start.setDate(today.getDate() - day + (day === 0 ? -6 : 1)); start.setHours(0,0,0,0);
        return { start, end: today };
      }
      if (dateRange.preset === 'month') {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start, end: today };
      }
      if (dateRange.preset === 'last_month') {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
        return { start, end };
      }
      if (dateRange.preset === '3months') {
        const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        return { start, end: today };
      }
      return null;
    };
    const bounds = getPresetBounds();
    if (!bounds) return trades;
    return trades.filter(t => {
      const d = t.isCarryForward && t.exitTime ? new Date(t.exitTime) : new Date(t.date);
      return d >= bounds.start && d <= bounds.end;
    });
  }, [trades, dateRange]);

  // Run Web Worker on filtered trades
  useEffect(() => {
    let mounted = true;
    if (filteredTrades.length > 0) {
      ExpectancyClient.analyze(filteredTrades).then(res => { if (mounted) setWorkerMetrics(res); });
    } else {
      setWorkerMetrics(null);
    }
    return () => { mounted = false; };
  }, [filteredTrades]);

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const orderedDays = [1, 2, 3, 4, 5, 6, 0];
  const formatHourLabel = (hour: number) => {
    const s = `${hour.toString().padStart(2, '0')}:00`;
    const e = `${((hour + 1) % 24).toString().padStart(2, '0')}:00`;
    return `${s} – ${e}`;
  };

  const SuspenseFallback = () => <div className="h-[200px] bg-surface-1 rounded-lg animate-pulse" />;

  return (
    <div className="flex flex-col gap-6 w-full pb-20 max-w-6xl mx-auto">

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary tracking-tight">Analytics</h1>
          <p className="text-secondary mt-1 text-sm">Deep mathematical breakdown of your trading performance.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {workerMetrics && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-1 border border-border text-[10px] font-semibold text-iris">
              <Cpu className="w-3 h-3" />
              Monte Carlo Active
            </div>
          )}
          <AnalyticsDateFilter value={dateRange} onChange={setDateRange} />
        </div>
      </motion.div>

      {/* ── Top KPI Row — always visible ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
        ) : (
          <>
            <KpiCard
              label="Expectancy"
              value={workerMetrics ? formatCurrency(workerMetrics.expectancyDollar) : (risk?.expectancy ? formatCurrency(risk.expectancy) : '₹0')}
              sub="Avg P&L per trade"
              icon={ShieldAlert}
              trend={((workerMetrics?.expectancyDollar ?? risk?.expectancy ?? 0) > 0) ? 'positive' : 'negative'}
            />
            <KpiCard
              label="Profit Factor"
              value={workerMetrics ? workerMetrics.profitFactor.toFixed(2) : (risk?.profitFactor?.toFixed(2) ?? '0.00')}
              sub="Total wins ÷ total losses"
              icon={Activity}
              trend={(workerMetrics?.profitFactor ?? risk?.profitFactor ?? 0) >= 1.5 ? 'positive' : (workerMetrics?.profitFactor ?? risk?.profitFactor ?? 0) >= 1 ? 'neutral' : 'negative'}
            />
            <KpiCard
              label="Win Rate"
              value={workerMetrics ? formatPercent(workerMetrics.winRate) : formatPercent(risk?.winRate ?? 0)}
              sub={workerMetrics ? `${workerMetrics.profitTrades}W / ${workerMetrics.lossTrades}L` : `${risk?.totalTrades ?? 0} trades`}
              icon={Clock}
              trend={(workerMetrics?.winRate ?? risk?.winRate ?? 0) >= 50 ? 'positive' : 'negative'}
            />
            <KpiCard
              label="R-Multiple"
              value={workerMetrics ? `${workerMetrics.expectancyR > 0 ? '+' : ''}${workerMetrics.expectancyR.toFixed(2)}R` : '—'}
              sub={workerMetrics?.expectancyR !== 0 ? 'Per trade expectancy' : 'Requires stop loss data'}
              icon={AlertCircle}
              trend={workerMetrics ? (workerMetrics.expectancyR > 0 ? 'positive' : 'negative') : 'neutral'}
            />
          </>
        )}
      </motion.div>

      {/* ── Monte Carlo Callout ── */}
      {workerMetrics && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 bg-surface-1 border border-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-1 flex-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-warning uppercase tracking-widest">
              <TrendingDown className="w-3.5 h-3.5" />
              95th Percentile · 500× Monte Carlo Simulation
            </div>
            <h3 className="text-base font-display font-bold text-primary">
              Max Probable Drawdown:{' '}
              <span className="font-mono text-danger">{formatCurrency(workerMetrics.monteCarlo95thDrawdown)}</span>
            </h3>
            <p className="text-xs text-secondary">
              Keep account buffer above this threshold. Historical max drawdown: <span className="font-mono text-primary font-semibold">{formatCurrency(workerMetrics.maxDrawdown)}</span>
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center p-4 bg-surface-0 rounded-xl border border-border min-w-[140px] text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">R-Multiple</span>
            <span className={cn('text-2xl font-mono font-bold mt-1', workerMetrics.expectancyR > 0 ? 'text-success' : workerMetrics.expectancyR < 0 ? 'text-danger' : 'text-secondary')}>
              {workerMetrics.expectancyR > 0 ? '+' : ''}{workerMetrics.expectancyR.toFixed(2)}R
            </span>
            <span className="text-[10px] text-secondary mt-0.5">Per execution avg</span>
          </div>
        </motion.div>
      )}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 p-1 bg-surface-1 border border-border rounded-xl w-full overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 outline-none whitespace-nowrap flex-1 justify-center',
                'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
                active ? 'text-white' : 'text-secondary hover:text-primary'
              )}
              aria-selected={active}
            >
              {active && (
                <motion.div
                  layoutId="analyticsTab"
                  className="absolute inset-0 bg-iris rounded-lg shadow-sm"
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >

          {/* ══════════════════════════════════════════════════
              TAB: OVERVIEW
          ══════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <>
              {/* Equity Curve */}
              <SectionCard title="Equity Curve" subtitle="Cumulative P&L with drawdown overlay">
                <ErrorBoundary>
                  <Suspense fallback={<SuspenseFallback />}>
                    <EquityCurveAnalytics trades={filteredTrades} />
                  </Suspense>
                </ErrorBoundary>
              </SectionCard>

              {/* Streak + Session side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Streak & Consistency" subtitle="Win/loss streaks and day-profitability rate">
                  <ErrorBoundary>
                    <Suspense fallback={<SuspenseFallback />}>
                      <StreakAnalytics trades={filteredTrades} />
                    </Suspense>
                  </ErrorBoundary>
                </SectionCard>

                {/* Performance by Day */}
                <SectionCard title="Performance by Weekday" subtitle="Net P&L by trading day (IST)">
                  {loading ? (
                    <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                  ) : session?.byWeekday && Object.keys(session.byWeekday).length > 0 ? (
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {orderedDays
                        .filter(d => session.byWeekday[d] !== undefined)
                        .map(d => (
                          <SessionRow key={d} label={weekdays[d]} pnl={session.byWeekday[d].pnl} count={session.byWeekday[d].count} />
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-tertiary py-4">No session data for this period.</p>
                  )}
                </SectionCard>
              </div>

              {/* Intraday by Hour */}
              {session?.byHour && Object.keys(session.byHour).length > 0 && (
                <SectionCard title="Intraday Performance by Hour (IST)" subtitle="Which market execution windows yield highest profitability">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {Object.keys(session.byHour)
                      .map(h => parseInt(h, 10))
                      .sort((a, b) => a - b)
                      .map(hour => (
                        <SessionRow
                          key={hour}
                          label={formatHourLabel(hour)}
                          pnl={session.byHour[hour].pnl}
                          count={session.byHour[hour].count}
                        />
                      ))}
                  </div>
                </SectionCard>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: RISK & P&L
          ══════════════════════════════════════════════════ */}
          {activeTab === 'risk' && (
            <>
              {/* P&L Distribution */}
              <SectionCard
                title="P&L Distribution"
                subtitle="Histogram of trade outcomes — reveals whether profit comes from few big wins or consistent smaller gains"
              >
                <ErrorBoundary>
                  <Suspense fallback={<SuspenseFallback />}>
                    <PnlDistribution trades={filteredTrades} />
                  </Suspense>
                </ErrorBoundary>
              </SectionCard>

              {/* Charges */}
              <SectionCard title="Charges & Cost Analysis" subtitle="Impact of brokerage, taxes and other charges on profitability">
                <ErrorBoundary>
                  <Suspense fallback={<SuspenseFallback />}>
                    <ChargesAnalytics data={chargesSummary} loading={loadingSecondary} />
                  </Suspense>
                </ErrorBoundary>
              </SectionCard>

              {/* Avg Win / Loss card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-surface border border-border rounded-xl shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-2">Avg Win</p>
                  <p className="text-2xl font-bold font-mono text-success">{formatCurrency(risk?.avgWin ?? 0)}</p>
                  <p className="text-xs text-tertiary mt-1">Average winning trade net P&L</p>
                </div>
                <div className="p-5 bg-surface border border-border rounded-xl shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-2">Avg Loss</p>
                  <p className="text-2xl font-bold font-mono text-danger">{formatCurrency(-(risk?.avgLoss ?? 0))}</p>
                  <p className="text-xs text-tertiary mt-1">Average losing trade net P&L</p>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: STRATEGY
          ══════════════════════════════════════════════════ */}
          {activeTab === 'strategy' && (
            <>
              <SectionCard
                title="Strategy Comparison"
                subtitle="Head-to-head performance breakdown across all strategies"
              >
                <ErrorBoundary>
                  <Suspense fallback={<SuspenseFallback />}>
                    <StrategyComparison data={strategyComparison} loading={loadingSecondary} />
                  </Suspense>
                </ErrorBoundary>
              </SectionCard>

              {/* Instrument Breakdown */}
              <SectionCard
                title="Instrument & Direction Breakdown"
                subtitle="P&L segmented by CE/PE/FUT/EQ, market, and trade direction (Long/Short)"
              >
                <ErrorBoundary>
                  <Suspense fallback={<SuspenseFallback />}>
                    <InstrumentBreakdown data={instrumentBreakdown} loading={loadingSecondary} />
                  </Suspense>
                </ErrorBoundary>
              </SectionCard>
            </>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: BEHAVIOR
          ══════════════════════════════════════════════════ */}
          {activeTab === 'behavior' && (
            <>
              {/* Discipline Analytics */}
              <SectionCard
                title="Discipline Score Analytics"
                subtitle="Correlation between discipline score (1–5) and trade outcomes"
              >
                <ErrorBoundary>
                  <Suspense fallback={<SuspenseFallback />}>
                    <DisciplineAnalytics data={disciplineCorrelation} loading={loadingSecondary} />
                  </Suspense>
                </ErrorBoundary>
              </SectionCard>

              {/* Mistake Attribution */}
              <SectionCard
                title="Mistake Attribution"
                subtitle="Which recurring mistakes cost the most and appear most frequently"
              >
                {loading ? (
                  <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
                ) : !mistakes.length ? (
                  <p className="text-sm text-tertiary py-4">No mistakes recorded in this period.</p>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {mistakes.map((m, i) => {
                      const isLoss = m.pnlImpact < 0;
                      const isGain = m.pnlImpact > 0;
                      return (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-surface-1 rounded-lg border border-border-subtle hover:border-border transition-colors">
                          <div>
                            <p className="font-bold text-sm text-primary">{m.mistake}</p>
                            <p className="text-xs text-tertiary mt-0.5">{m.count} occurrence{m.count !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest mb-0.5">P&L Impact</p>
                            <p className={cn('font-mono text-sm font-bold', isLoss ? 'text-danger' : isGain ? 'text-success' : 'text-secondary')}>
                              {isGain ? '+' : ''}{formatCurrency(m.pnlImpact)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: PERFORMANCE (Monthly)
          ══════════════════════════════════════════════════ */}
          {activeTab === 'performance' && (
            <>
              <SectionCard
                title="Monthly Performance Summary"
                subtitle="Period-over-period comparison with month-on-month change"
              >
                <ErrorBoundary>
                  <Suspense fallback={<SuspenseFallback />}>
                    <MonthlySummary data={monthlySummary} loading={loadingSecondary} />
                  </Suspense>
                </ErrorBoundary>
              </SectionCard>
            </>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
