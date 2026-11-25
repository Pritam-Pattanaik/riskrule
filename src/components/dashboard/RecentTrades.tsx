import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Trade } from '../../types';
import { formatCurrency, formatDate } from '../../lib/analytics';
import { tradeDate } from '../../lib/tradePeriod';

export default function RecentTrades({ trades, period }: { trades: Trade[]; period: string }) {
  const recent = [...trades].sort((a, b) => Date.parse(tradeDate(b)) - Date.parse(tradeDate(a))).slice(0, 5);
  if (!recent.length) return <p className="py-5 text-sm text-secondary">No trades in this period.</p>;
  return (
    <ul className="divide-y divide-primary/10">
      {recent.map(trade => (
        <li key={trade.id}>
          <Link className="group grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-3 hover:bg-surface-1 focus-visible:outline-accent" to={'/app/trades?' + new URLSearchParams({ search: trade.symbol, date: period })}>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-primary">{trade.symbol}</p>
              <p className="mt-0.5 text-xs text-secondary">{formatDate(tradeDate(trade))} · {trade.market} · {trade.direction}</p></div>
            <span className={'font-mono text-sm tabular-nums ' + (trade.status === 'OPEN' || !trade.netPnl ? 'text-secondary' : trade.netPnl > 0 ? 'text-success' : 'text-danger')}>
              {trade.status === 'OPEN' ? 'Open' : (trade.netPnl > 0 ? '+' : '') + formatCurrency(trade.netPnl)}
            </span>
            <ChevronRight size={16} className="text-tertiary group-hover:text-primary" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
