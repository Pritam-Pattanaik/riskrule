import { useLiveMarketData } from '../../hooks/useMarketData';

export default function MarketBreadth() {
  const { data: quotes, loading, error } = useLiveMarketData();
  const gain = quotes.filter(q => q.changePercent > 0).length;
  const loss = quotes.filter(q => q.changePercent < 0).length;
  const leaders = [...quotes].filter(q => q.volume > 0).sort((a,b) => b.volume - a.volume).slice(0,4);
  return <section className="desk-panel space-y-4"><h2 className="font-semibold">Market breadth</h2>
    {quotes.length ? <>
      <p className="text-sm text-secondary">Price direction across {quotes.length} tracked instruments</p>
      <div className="flex h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div className="bg-success" style={{width: gain / quotes.length * 100 + '%'}} /><div className="bg-danger" style={{width: loss / quotes.length * 100 + '%'}} />
      </div>
      <dl className="grid grid-cols-3 text-sm">{[['Advancing',gain],['Declining',loss],['Unchanged',quotes.length-gain-loss]].map(([label,n]) =>
        <div key={label}><dt className="text-xs text-secondary">{label}</dt><dd className="mt-1 text-lg font-semibold">{n}</dd></div>)}</dl>
      {leaders.length > 0 && <div className="border-t border-border pt-4"><h3 className="text-sm font-semibold">Volume leaders</h3><ul className="mt-2 divide-y divide-border">{leaders.map(q => <li key={q.id} className="flex justify-between py-2 text-sm"><span>{q.name}</span><span className="tabular-nums">{q.volume.toLocaleString('en-IN')}</span></li>)}</ul></div>}
    </> : <p className="text-sm text-secondary">{loading && !error ? 'Loading quotes…' : 'Breadth is unavailable until quotes arrive.'}</p>}
  </section>;
}
