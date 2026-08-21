import React from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { useMarketStatus } from '../../hooks/useMarketStatus';
import { ChevronDown, Download, RefreshCw, Clock } from 'lucide-react';

const INDICES = [
  { value: 'NIFTY',     label: 'NIFTY 50' },
  { value: 'BANKNIFTY', label: 'BANK NIFTY' },
  { value: 'FINNIFTY',  label: 'FIN NIFTY' },
];

function useISTTime() {
  const [time, setTime] = React.useState('');
  React.useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date())
      );
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function FlowHeader() {
  const selectedIndex    = useFlowStore(s => s.selectedIndex);
  const setSelectedIndex = useFlowStore(s => s.setSelectedIndex);
  const isConnected      = useFlowStore(s => s.isConnected);
  const intelligence     = useFlowStore(s => s.intelligence);
  const fetchIntelligence = useFlowStore(s => s.fetchIntelligence);
  const isLoading        = useFlowStore(s => s.isLoading);
  const { isMarketOpen, label } = useMarketStatus();
  const istTime = useISTTime();

  const brokerStatus     = useFlowStore(s => s.brokerStatus);

  const overallBias = intelligence?.overallBias ?? 'neutral';
  const biasColor =
    overallBias === 'bullish' ? 'text-[rgb(var(--color-success))] bg-[rgba(var(--color-success),0.12)] border-[rgba(var(--color-success),0.25)]' :
    overallBias === 'bearish' ? 'text-[rgb(var(--color-danger))]  bg-[rgba(var(--color-danger),0.12)]  border-[rgba(var(--color-danger),0.25)]' :
    'text-[rgb(var(--color-warning))] bg-[rgba(var(--color-warning),0.12)] border-[rgba(var(--color-warning),0.25)]';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      {/* Left: Title block */}
      <div>
        <h1 className="text-[22px] font-bold text-primary leading-none tracking-tight">
          Options Flow
        </h1>
        <p className="text-secondary text-[13px] mt-1">
          Real-time institutional options flow and market insights
        </p>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Market Mode badge */}
        <span className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-[6px] border ${biasColor}`}>
          Market Mode
          <span className="font-extrabold">{overallBias.toUpperCase()}</span>
        </span>

        {/* Index selector */}
        <div className="relative">
          <select
            value={selectedIndex}
            onChange={e => setSelectedIndex(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 bg-[rgb(var(--color-surface-1))] text-[rgb(var(--color-text-primary))] border border-[rgba(var(--color-border-rgb),0.10)] rounded-[8px] text-[13px] font-semibold cursor-pointer hover:border-[rgba(var(--color-border-rgb),0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-iris))] transition-colors"
          >
            {INDICES.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
        </div>

        {/* IST Clock */}
        {istTime && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[rgb(var(--color-surface-1))] border border-[rgba(var(--color-border-rgb),0.08)] text-[13px] font-semibold text-secondary">
            <Clock className="w-3.5 h-3.5 opacity-60" />
            {istTime}
          </div>
        )}

        {/* Live / Market Closed / Broker Status badge */}
        <div
          role="status"
          className={[
            'flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[11px] font-semibold uppercase tracking-wider border transition-colors duration-200',
            brokerStatus === 'expired'
              ? 'bg-[rgba(var(--color-danger),0.10)] text-[rgb(var(--color-danger))] border-[rgba(var(--color-danger),0.20)]'
              : brokerStatus === 'missing'
                ? 'bg-[rgba(var(--color-warning),0.10)] text-[rgb(var(--color-warning))] border-[rgba(var(--color-warning),0.20)]'
                : isMarketOpen
                  ? 'bg-[rgba(var(--color-success),0.10)] text-[rgb(var(--color-success))] border-[rgba(var(--color-success),0.20)]'
                  : 'bg-[rgba(var(--color-warning),0.10)] text-[rgb(var(--color-warning))] border-[rgba(var(--color-warning),0.20)]',
          ].join(' ')}
        >
          <span className={[
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            brokerStatus === 'expired'
              ? 'bg-[rgb(var(--color-danger))]'
              : brokerStatus === 'missing'
                ? 'bg-[rgb(var(--color-warning))]'
                : isMarketOpen
                  ? 'bg-[rgb(var(--color-success))] animate-live-pulse'
                  : 'bg-[rgb(var(--color-warning))]',
          ].join(' ')} />
          {brokerStatus === 'expired' ? 'Broker Expired' : (brokerStatus === 'missing' ? 'Broker Needed' : (isMarketOpen ? 'Live' : label))}
        </div>

        {/* After Hours / Refresh */}
        <button
          onClick={() => fetchIntelligence()}
          disabled={isLoading}
          title="Refresh data"
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[rgb(var(--color-surface-1))] border border-[rgba(var(--color-border-rgb),0.08)] text-[13px] font-semibold text-secondary hover:text-primary hover:bg-[rgb(var(--color-surface-2))] transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isMarketOpen ? 'Refresh' : 'After Hours'}</span>
        </button>

        {/* Export CSV */}
        <button
          onClick={() => {
            // Export intelligence snapshot as CSV
            if (!intelligence) return;
            const rows = [
              ['Metric', 'Value'],
              ['Symbol', intelligence.symbol],
              ['Spot Price', intelligence.spotPrice],
              ['PCR OI', intelligence.pcrOI.toFixed(2)],
              ['Max Pain', intelligence.maxPain],
              ['ATM IV', intelligence.atmIV?.toFixed(1)],
              ['IV Rank', intelligence.ivRank ?? ''],
              ['VIX', intelligence.vix ?? ''],
              ['Overall Bias', intelligence.overallBias],
            ];
            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `flow-${intelligence.symbol}-${Date.now()}.csv`;
            a.click();
          }}
          disabled={!intelligence}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[rgb(var(--color-iris))] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-30"
        >
          <Download className="w-3.5 h-3.5" />
          Export (.csv)
        </button>
      </div>
    </div>
  );
}
