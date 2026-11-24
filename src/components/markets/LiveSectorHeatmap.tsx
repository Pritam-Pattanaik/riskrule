import { useMarketSectors } from '../../hooks/useMarketData';

export default function LiveSectorHeatmap() {
  const { sectors, loading, error, refresh } = useMarketSectors();
  const sorted = [...sectors].sort((a, b) => b.changePercent - a.changePercent);
  return <section className="desk-panel space-y-3"><div className="flex items-center justify-between gap-2"><h2 className="font-semibold">Sector performance</h2>
    <button className="desk-button" disabled={loading} onClick={() => refresh()}>Refresh sectors</button></div>
    {error && <p className="text-sm text-secondary">Sector updates are currently unavailable.</p>}
    {sorted.length ? <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{sorted.map(s =>
      <div key={s.id} className={'rounded-lg border border-border p-3 ' + (s.changePercent < 0 ? 'bg-danger/5' : 'bg-success/5')}>
        <p className="text-xs font-medium">{s.name}</p><p className={'mt-1 text-lg tabular-nums ' + (s.changePercent < 0 ? 'text-danger' : 'text-success')}>{s.changePercent > 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</p>
        <p className="text-xs text-secondary">{s.provider === 'cache' ? 'Reference data' : s.provider + (s.isLive ? '' : ' · Cached')}</p></div>)}</div>
      : <p className="text-sm text-secondary">{loading ? 'Loading sectors…' : 'No sector quotes available.'}</p>}
  </section>;
}
