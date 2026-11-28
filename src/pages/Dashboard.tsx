import { lazy, Suspense, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChartNoAxesCombined, Plus, Unplug } from 'lucide-react';
import { useTradeStore } from '../stores/tradeStore';
import { useAuthStore } from '../stores/authStore';
import { useTradeStrategies } from '../hooks/useTradeStrategies';
import { computeCumulativePnl, computeCurrentStreak, computeDisciplineDistribution, computeStats, computeStrategyPnl, formatCurrency, formatPercent } from '../lib/analytics';
import { periods, periodBounds, inPeriod, tradeDate } from '../lib/tradePeriod';
import { notify } from '../lib/notify';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import RecentTrades from '../components/dashboard/RecentTrades';
import CalendarHeatmap from '../components/dashboard/CalendarHeatmap';
import GoalWidget from '../components/dashboard/GoalWidget';
import StrategyBar from '../components/dashboard/StrategyBar';
import DisciplineBreakdown from '../components/dashboard/DisciplineBreakdown';
import SessionRisk from '../components/dashboard/SessionRisk';

const PnLCurve = lazy(() => import('../components/dashboard/PnLCurve'));
const TradeFormModal = lazy(() => import('../components/trade/TradeFormModal'));
const panel = 'min-w-0 rounded-xl border border-primary/10 bg-surface p-5 sm:p-6';
const link = 'inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline';
const heading = 'text-base font-semibold text-primary';

export default function Dashboard() {
  const userId = useAuthStore(state => state.user?.id);
  const { trades, error, loading, loadedFor, fetchTrades, addTrade } = useTradeStore();
  const [params, setParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const selected = params.get('period') ?? 'week';
  const period = Object.hasOwn(periods, selected) ? selected as keyof typeof periods : 'week';
  const setPeriod = (value: string) => {
    const next = new URLSearchParams(params);
    next.set('period', value);
    setParams(next, { replace: true });
  };
  const now = new Date();
  const accountReady = !!userId && loadedFor === userId;
  const accountTrades = accountReady ? trades : [];
  const bounds = periodBounds(period, now);
  const today = periodBounds('today', now);
  const filtered = accountTrades.filter(t => inPeriod(tradeDate(t), bounds));
  const closed = filtered.filter(t => t.status !== 'OPEN');
  const allClosed = accountTrades.filter(t => t.status !== 'OPEN');
  const todayClosed = allClosed.filter(t => inPeriod(tradeDate(t), today));
  const stats = computeStats(closed);
  const scored = filtered.filter(t => t.disciplineScore != null);
  const wins = closed.filter(t => t.status === 'WIN').length;
  const streak = computeCurrentStreak(closed.map(t => ({ ...t, date: tradeDate(t) })));
  const catalog = useTradeStrategies(closed.some(t => !!t.strategyId && !t.strategyName));
  const strategyNames = new Map(catalog.data?.map(s => [s.id, s.name]));
  const strategies = computeStrategyPnl(closed.map(t => ({
    ...t, strategyName: t.strategyName || (t.strategyId ? strategyNames.get(t.strategyId) ?? 'Assigned strategy' : undefined),
  })));
  const hasTrades = accountTrades.length > 0;
  const waiting = !accountReady || (loading && !hasTrades);
  const dateLabel = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const ledger = '/app/trades?date=' + period;

  return (
    <main className="flex w-full flex-col gap-5 text-primary">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 flex items-center gap-2 text-sm text-secondary"><CalendarDays size={15} />{dateLabel}</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Trading dashboard</h1></div>
        <div className="flex flex-wrap gap-2">
          <Link to="/app/settings?tab=brokers" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-primary/15 bg-surface px-3 text-sm font-medium hover:bg-surface-1"><Unplug size={16} />Brokers</Link>
          <button onClick={() => setFormOpen(true)} disabled={waiting} className="desk-primary inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-50"><Plus size={17} />Log trade</button>
        </div>
      </header>

      {accountReady && error && <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-danger/30 bg-surface p-4 text-sm">
        <span>{hasTrades ? 'Could not refresh trades. Showing the last loaded figures.' : 'Could not load your trades.'}</span>
        <button className={link} onClick={fetchTrades} disabled={loading}>Retry</button>
      </div>}
      {waiting ? <div role="status" aria-label="Loading dashboard"><Skeleton className="h-72 w-full rounded-xl" /></div> : (!error || hasTrades) && <>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-4">
          <h2 className="text-lg font-semibold">Performance overview</h2>
          <div role="group" aria-label="Performance period" className="flex max-w-full flex-wrap gap-1 rounded-lg border border-primary/10 bg-surface p-1">
            {Object.entries(periods).map(([key, label]) => <button key={key} aria-pressed={period === key} onClick={() => setPeriod(key)}
              className={'min-h-8 rounded-md px-2.5 text-xs font-medium sm:px-3 ' + (period === key ? 'bg-primary text-inverse' : 'text-secondary hover:bg-surface-1')}>{label}</button>)}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
          <section className={panel} aria-labelledby="pnl-title">
            <div className="flex items-start justify-between gap-3">
              <div><h3 id="pnl-title" className="text-sm font-medium text-secondary">Cumulative net P&amp;L</h3>
                <p className={'mt-1 text-3xl font-semibold tabular-nums sm:text-4xl ' + (stats.totalPnl < 0 ? 'text-danger' : 'text-primary')}>{stats.totalPnl > 0 ? '+' : ''}{formatCurrency(stats.totalPnl)}</p></div>
              <Link to="/app/analytics" className={link}>Analytics <ArrowUpRight size={15} /></Link>
            </div>
            {closed.length ? <div className="mt-4 h-48 sm:h-56"><ErrorBoundary><Suspense fallback={<Skeleton className="h-full w-full" />}><PnLCurve data={computeCumulativePnl(closed)} /></Suspense></ErrorBoundary></div>
              : <div className="my-4 flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/15 bg-canvas px-4 text-center">
                <ChartNoAxesCombined size={22} className="text-accent" />
                <p className="text-sm font-semibold">{hasTrades ? 'No closed trades in this period' : 'Your first trade starts the chart'}</p>
                {!hasTrades ? <p className="max-w-xs text-xs leading-5 text-secondary">Log a completed trade or connect a broker to see your net P&amp;L after charges.</p>
                  : period !== 'all' && <button className={link} onClick={() => setPeriod('all')}>View all time <ArrowRight size={14} /></button>}
              </div>}
            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-primary/10 pt-4">
              {[['Closed trades', String(closed.length)], ['Win rate', closed.length ? formatPercent(stats.winRate) : '—'], ['Avg win / loss', wins && closed.some(t => t.status === 'LOSS') ? stats.avgRR.toFixed(2) + '×' : '—']].map(([label, value]) =>
                <div key={label}><dt className="text-xs text-secondary">{label}</dt><dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd></div>)}
            </dl>
          </section>
          <SessionRisk userId={userId!} opened={accountTrades.filter(t => inPeriod(t.date, today)).length} net={todayClosed.reduce((sum, t) => sum + t.netPnl, 0)} />
          <section className={panel}><div className="mb-2 flex items-baseline justify-between gap-2"><h2 className={heading}>Recent trades</h2><Link className={link} to={ledger}>View trades <ArrowRight size={15} /></Link></div>
            <RecentTrades trades={filtered} period={period} /></section>
          <section className={panel}><div className="mb-4 flex items-baseline justify-between gap-2"><h2 className={heading}>Discipline</h2><span className="text-sm text-secondary">{scored.length ? computeStats(scored).avgDiscipline.toFixed(1) + ' / 5 average' : 'Unrated'}</span></div>
            <DisciplineBreakdown data={computeDisciplineDistribution(scored)} />
            {streak.count > 0 && <p className="mt-4 border-t border-primary/10 pt-3 text-xs text-secondary">Latest streak in period · {streak.count} {streak.type === 'WIN' ? 'profitable' : 'losing'} trading {streak.count === 1 ? 'day' : 'days'}</p>}
          </section>
          <section className={panel}><div className="mb-4 flex items-baseline justify-between gap-2"><h2 className={heading}>Strategy performance</h2><Link className={link} to="/app/strategies">Strategies <ArrowUpRight size={15} /></Link></div>
            {catalog.isError && closed.some(t => t.strategyId && !t.strategyName) ? <button className={link} onClick={() => catalog.refetch()}>Retry loading strategy names</button> : <StrategyBar data={strategies} />}</section>
          <GoalWidget />
          <section className={panel}><CalendarHeatmap trades={allClosed} /></section>
          <section className={panel}><div className="mb-2 flex items-center gap-2"><BookOpen className="text-accent" size={18} /><h2 className={heading}>Trading journal</h2></div>
            <p className="mb-4 text-sm text-secondary">Record your market bias, watchlist and session reflection.</p><Link to="/app/journal" className={link}>Open journal <ArrowRight size={15} /></Link></section>
        </div>
      </>}
      {formOpen && <Suspense fallback={<p role="status">Opening trade form…</p>}><TradeFormModal isOpen onClose={() => setFormOpen(false)} onSave={async trade => {
        await addTrade(trade);
        if (!inPeriod(trade.date, bounds)) setPeriod('all');
        notify.success('Trade logged');
      }} /></Suspense>}
    </main>
  );
}
