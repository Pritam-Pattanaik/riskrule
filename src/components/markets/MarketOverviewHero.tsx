import { useLiveMarketData } from '../../hooks/useMarketData';

export default function MarketOverviewHero({ activeSymbol, onSelectSymbol }: {
  activeSymbol: string; onSelectSymbol: (symbol: string) => void;
}) {
  const { data, loading, error } = useLiveMarketData();
  return <section aria-label="Market quotes" className="overflow-x-auto rounded-xl border border-border bg-surface">
    {data.length ? <div className="flex divide-x divide-border">{data.map(q => <button key={q.id}
      className="flex min-w-36 flex-1 flex-col items-start gap-1 px-4 py-3 text-left hover:bg-surface-1 aria-pressed:bg-accent/5"
      aria-pressed={q.id === activeSymbol} onClick={() => onSelectSymbol(q.id)}>
      <span className="whitespace-nowrap text-xs font-medium text-secondary">{q.name}</span>
      <strong className="text-lg tabular-nums">{q.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
      <span className={'text-xs tabular-nums ' + (q.changePercent < 0 ? 'text-danger' : 'text-success')}>{q.changePercent > 0 ? '+' : ''}{q.changePercent.toFixed(2)}%</span>
      <span className="whitespace-nowrap text-[11px] text-tertiary">{q.provider}{q.updatedAt ? " · " + new Date(q.updatedAt).toLocaleDateString("en-IN", {day: "numeric", month: "short"}) : ""}</span>
    </button>)}</div> : <p role="status" className="px-4 py-3 text-sm text-secondary">{loading && !error ? 'Loading index quotes…' : 'Index quotes are currently unavailable.'}</p>}
  </section>;
}
