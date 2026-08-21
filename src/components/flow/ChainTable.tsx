import React, { useEffect, useState, useCallback } from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { api } from '../../lib/api';

interface ChainRow {
  strike: number;
  // CALLS
  callOI?: number;
  callChgOI?: number;
  callVolume?: number;
  callIV?: number;
  callLTP?: number;
  callChng?: number;
  callBidQty?: number;
  callAsk?: number;
  callAskQty?: number;
  // PUTS
  putBidQty?: number;
  putBid?: number;
  putAsk?: number;
  putAskQty?: number;
  putChng?: number;
  putLTP?: number;
  putIV?: number;
  putVolume?: number;
  putChgOI?: number;
  putOI?: number;
}

function fmt(n?: number, decimals = 0): string {
  if (n == null || isNaN(n)) return '-';
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function ChangeCell({ value }: { value?: number }) {
  if (value == null || isNaN(value)) return <span className="text-secondary">-</span>;
  const isPos = value > 0;
  const isNeg = value < 0;
  return (
    <span className={isPos ? 'text-[rgb(var(--color-success))] font-medium' : isNeg ? 'text-[rgb(var(--color-danger))] font-medium' : 'text-secondary'}>
      {isPos ? '+' : ''}{value.toFixed(2)}
    </span>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-secondary whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <td className={`py-2 px-2 text-[12px] tabular-nums ${className}`} style={style}>
      {children}
    </td>
  );
}

interface ChainTableProps {
  strikeFilter: string;
}

export function ChainTable({ strikeFilter }: ChainTableProps) {
  const { selectedIndex, intelligence } = useFlowStore();
  const [chain, setChain] = useState<ChainRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atmStrike = intelligence?.atmStrike ?? intelligence?.spotPrice ?? 0;

  const loadChain = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const json = await api.get<any>(`/v1/flow/chain/${selectedIndex}`);
      if (json?.success && Array.isArray(json.data?.chain)) {
        setChain(json.data.chain);
      } else {
        setError(json?.error || 'Failed to load option chain.');
        setChain([]);
      }
    } catch (e: any) {
      setError(e.message || 'Network error loading chain.');
      setChain([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedIndex]);

  useEffect(() => {
    loadChain();
  }, [loadChain]);

  // Export chain to CSV
  const handleDownloadCsv = useCallback(() => {
    if (!chain.length) return;
    const header = [
      'Call OI','Call ChgOI','Call Volume','Call IV','Call LTP','Call Chng',
      'Call Bid Qty','Call Ask','Call Ask Qty',
      'Strike',
      'Put Bid Qty','Put Bid','Put Ask','Put Ask Qty','Put Chng',
      'Put LTP','Put IV','Put Volume','Put ChgOI','Put OI',
    ].join(',');
    const rows = chain.map(r => [
      r.callOI ?? '', r.callChgOI ?? '', r.callVolume ?? '', r.callIV ?? '', r.callLTP ?? '', r.callChng ?? '',
      r.callBidQty ?? '', r.callAsk ?? '', r.callAskQty ?? '',
      r.strike,
      r.putBidQty ?? '', r.putBid ?? '', r.putAsk ?? '', r.putAskQty ?? '', r.putChng ?? '',
      r.putLTP ?? '', r.putIV ?? '', r.putVolume ?? '', r.putChgOI ?? '', r.putOI ?? '',
    ].join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `chain-${selectedIndex}-${Date.now()}.csv`;
    a.click();
  }, [chain, selectedIndex]);

  // Filter rows
  const filteredChain = React.useMemo(() => {
    if (!chain.length || !atmStrike) return chain;
    const atmIdx = chain.findIndex(r => Math.abs(r.strike - atmStrike) < 50);
    if (atmIdx < 0 || strikeFilter === 'All') return chain;
    const range = strikeFilter === 'ATM±2' ? 2 : strikeFilter === 'ATM±5' ? 5 : 5;
    if (strikeFilter === 'ATM') return chain.slice(Math.max(0, atmIdx - 5), atmIdx + 6);
    return chain.slice(Math.max(0, atmIdx - range), atmIdx + range + 1);
  }, [chain, atmStrike, strikeFilter]);

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-secondary">
            <div className="w-6 h-6 border-2 border-[rgb(var(--color-iris))] border-t-transparent rounded-full animate-spin" />
            <span className="text-[13px] font-medium">Loading Option Chain…</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-[12px] border border-[rgba(var(--color-warning),0.20)] bg-[rgba(var(--color-warning),0.06)] p-6 text-center">
        <p className="text-[13px] text-secondary mb-3">{error}</p>
        <button
          onClick={loadChain}
          className="px-4 py-1.5 rounded-lg bg-[rgb(var(--color-surface-2))] hover:bg-[rgb(var(--color-surface-3))] text-[13px] font-semibold text-primary transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!filteredChain.length) {
    return (
      <div className="flow-empty">
        <p className="text-[13px] text-secondary">No option chain data available for {selectedIndex}.</p>
        <button
          onClick={loadChain}
          className="px-4 py-1.5 rounded-lg bg-[rgb(var(--color-surface-2))] hover:bg-[rgb(var(--color-surface-3))] text-[13px] font-semibold text-primary transition-colors"
        >
          Reload Chain
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] bg-[rgb(var(--color-surface-1))] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[900px]">
          <colgroup>
            <col span={9} />
            <col style={{ width: 90 }} />
            <col span={10} />
          </colgroup>
          <thead>
            {/* Section labels */}
            <tr className="border-b border-[rgba(var(--color-border-rgb),0.06)]">
              <td colSpan={9} className="py-1.5 text-center text-[11px] font-bold tracking-widest uppercase text-[rgb(var(--color-success))] bg-[rgba(var(--color-success),0.05)]">
                CALLS
              </td>
              <td className="py-1.5 bg-[rgb(var(--color-surface-0))]" />
              <td colSpan={10} className="py-1.5 text-center text-[11px] font-bold tracking-widest uppercase text-[rgb(var(--color-danger))] bg-[rgba(var(--color-danger),0.05)]">
                PUTS
              </td>
            </tr>
            {/* Column headers */}
            <tr className="border-b border-[rgba(var(--color-border-rgb),0.08)] bg-[rgb(var(--color-surface-0))]">
              <Th className="text-right">OI</Th>
              <Th className="text-right">CHNG IN OI</Th>
              <Th className="text-right">VOLUME</Th>
              <Th className="text-right">IV</Th>
              <Th className="text-right">LTP</Th>
              <Th className="text-right">CHNG</Th>
              <Th className="text-right">BID QTY</Th>
              <Th className="text-right">ASK</Th>
              <Th className="text-right">ASK QTY</Th>
              <Th className="text-center font-bold text-primary">STRIKE</Th>
              <Th className="text-left">BID QTY</Th>
              <Th className="text-left">BID</Th>
              <Th className="text-left">ASK</Th>
              <Th className="text-left">ASK QTY</Th>
              <Th className="text-left">CHNG</Th>
              <Th className="text-left">LTP</Th>
              <Th className="text-left">IV</Th>
              <Th className="text-left">VOLUME</Th>
              <Th className="text-left">CHNG IN OI</Th>
              <Th className="text-left">OI</Th>
            </tr>
          </thead>
            {(() => {
              const maxOI = Math.max(1, ...filteredChain.map(r => Math.max(r.callOI || 0, r.putOI || 0)));

              return filteredChain.map((row, idx) => {
                const isATM = atmStrike > 0 && Math.abs(row.strike - atmStrike) < 50;
                const rowBg = isATM
                  ? 'bg-[rgba(var(--color-iris),0.08)]'
                  : idx % 2 === 0
                    ? ''
                    : 'bg-[rgba(var(--color-border-rgb),0.02)]';

                const callOIPct = Math.min(100, ((row.callOI || 0) / maxOI) * 100);
                const putOIPct  = Math.min(100, ((row.putOI  || 0) / maxOI) * 100);

                return (
                  <tr
                    key={row.strike}
                    className={`border-b border-[rgba(var(--color-border-rgb),0.04)] hover:bg-[rgba(var(--color-border-rgb),0.04)] transition-colors ${rowBg}`}
                  >
                    {/* CALLS */}
                    <Td className="text-right text-secondary relative overflow-hidden font-medium">
                      {row.callOI ? (
                        <div
                          className="absolute inset-y-1 right-0 bg-[rgba(239,68,68,0.14)] rounded-l pointer-events-none transition-all duration-300"
                          style={{ width: `${callOIPct}%` }}
                        />
                      ) : null}
                      <span className="relative z-10">{fmt(row.callOI)}</span>
                    </Td>
                    <Td className="text-right"><ChangeCell value={row.callChgOI} /></Td>
                    <Td className="text-right text-secondary">{fmt(row.callVolume)}</Td>
                    <Td className="text-right text-secondary">{fmt(row.callIV, 2)}</Td>
                    <Td className="text-right text-primary font-medium">{fmt(row.callLTP, 2)}</Td>
                    <Td className="text-right"><ChangeCell value={row.callChng} /></Td>
                    <Td className="text-right text-secondary">{fmt(row.callBidQty)}</Td>
                    <Td className="text-right text-secondary">{fmt(row.callAsk, 2)}</Td>
                    <Td className="text-right text-secondary">{fmt(row.callAskQty)}</Td>

                    {/* Strike */}
                    <Td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`font-bold text-[13px] ${isATM ? 'text-[rgb(var(--color-iris))] underline underline-offset-2' : 'text-primary'}`}>
                          {row.strike.toLocaleString('en-IN')}
                        </span>
                        {isATM && (
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-[rgba(var(--color-iris),0.15)] text-[rgb(var(--color-iris))] leading-none">
                            ATM
                          </span>
                        )}
                      </div>
                    </Td>

                    {/* PUTS */}
                    <Td className="text-left text-secondary">{fmt(row.putBidQty)}</Td>
                    <Td className="text-left text-secondary">{fmt(row.putBid, 2)}</Td>
                    <Td className="text-left text-secondary">{fmt(row.putAsk, 2)}</Td>
                    <Td className="text-left text-secondary">{fmt(row.putAskQty)}</Td>
                    <Td className="text-left"><ChangeCell value={row.putChng} /></Td>
                    <Td className="text-left text-primary font-medium">{fmt(row.putLTP, 2)}</Td>
                    <Td className="text-left text-secondary">{fmt(row.putIV, 2)}</Td>
                    <Td className="text-left text-secondary">{fmt(row.putVolume)}</Td>
                    <Td className="text-left"><ChangeCell value={row.putChgOI} /></Td>
                    <Td className="text-left text-secondary relative overflow-hidden font-medium">
                      {row.putOI ? (
                        <div
                          className="absolute inset-y-1 left-0 bg-[rgba(16,185,129,0.14)] rounded-r pointer-events-none transition-all duration-300"
                          style={{ width: `${putOIPct}%` }}
                        />
                      ) : null}
                      <span className="relative z-10">{fmt(row.putOI)}</span>
                    </Td>
                  </tr>
                );
              });
            })()}
        </table>
      </div>
    </div>
  );

}

