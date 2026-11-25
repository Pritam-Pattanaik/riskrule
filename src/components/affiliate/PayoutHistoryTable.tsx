import type { PayoutItem } from '../../stores/affiliateStore';

export default function PayoutHistoryTable({ payouts }: { payouts: PayoutItem[] }) {
  function exportHistory() {
    const rows = [['Date', 'Reference', 'Amount', 'Currency', 'Status'], ...payouts.map(p => [p.date, p.invoiceId || p.id, p.amount, p.currency, p.status])];
    const csv = rows.map(row => row.map(value => '"' + String(value ?? '').replaceAll('"','""') + '"').join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RiskRule-payouts.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="desk-panel space-y-4"><header className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="text-lg font-semibold">Payout history</h2>
    {payouts.length > 0 && <button className="desk-button" onClick={exportHistory}>Export CSV</button>}</header>
    {payouts.length ? <div className="overflow-x-auto"><table className="desk-table w-full text-left text-sm">
      <thead><tr>{['Date','Reference','Amount','Status'].map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead>
      <tbody>{payouts.map(p => <tr key={p.id} className="border-t border-border"><td className="p-2">{p.date}</td><td className="p-2">{p.invoiceId || p.id}</td><td className="p-2">{p.currency} {Number(p.amount).toLocaleString('en-IN')}</td><td className="p-2">{p.status}</td></tr>)}</tbody>
    </table></div> : <p className="text-sm text-secondary">Your payout requests will appear here.</p>}</section>;
}
