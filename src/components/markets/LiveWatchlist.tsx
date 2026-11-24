import { useLiveMarketData } from '../../hooks/useMarketData';

export default function LiveWatchlist({ onSelect }: { onSelect?: (symbol: string) => void }) {
  const { data: quotes, loading, error } = useLiveMarketData();
  return <section className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
    <h2 className="border-b border-border px-4 py-3 font-semibold">Market watch</h2>
    <div className="min-h-0 overflow-y-auto">
      {quotes.length ? <table className="desk-table w-full text-right text-sm"><thead className="sticky top-0 bg-surface-1 text-xs"><tr><th className="p-2 text-left">Instrument</th><th>Price</th><th className="px-3">Change</th></tr></thead>
      <tbody>{quotes.map(q => <tr className="border-t border-border" key={q.id}><td className="p-2 text-left"><button className="font-medium hover:text-accent" onClick={() => onSelect?.(q.id)}>{q.name}</button></td>
      <td>{q.price.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td><td className={'px-3 ' + (q.changePercent < 0 ? 'text-danger' : 'text-success')}>{q.changePercent > 0 ? '+' : ''}{q.changePercent.toFixed(2)}%</td></tr>)}</tbody></table>
      : <p className="p-4 text-sm text-secondary">{loading && !error ? 'Loading instruments…' : 'No quotes available.'}</p>}
    </div>
  </section>;
}
