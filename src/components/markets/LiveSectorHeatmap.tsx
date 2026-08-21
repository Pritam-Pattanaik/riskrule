/**
 * LiveSectorHeatmap — Premium Sector Performance Grid
 *
 * Real-time sector heatmap with intensity-coded tiles.
 * Auto-refreshes every 5 minutes (via useMarketSectors hook).
 */

import React from 'react';
import { Layers, ArrowUpRight, ArrowDownRight, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketSectors, type SectorQuote } from '../../hooks/useMarketData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getIntensity(change: number): { bg: string; border: string; glow: string } {
  const abs = Math.abs(change);
  if (change > 0) {
    if (abs > 2)   return { bg: 'rgba(16,185,129,0.22)', border: 'rgba(16,185,129,0.45)', glow: 'rgba(16,185,129,0.2)' };
    if (abs > 1)   return { bg: 'rgba(16,185,129,0.14)', border: 'rgba(16,185,129,0.28)', glow: 'rgba(16,185,129,0.1)' };
    if (abs > 0.3) return { bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.15)', glow: 'none' };
    return           { bg: 'rgba(16,185,129,0.03)', border: 'rgba(16,185,129,0.1)',  glow: 'none' };
  } else {
    if (abs > 2)   return { bg: 'rgba(239,68,68,0.22)', border: 'rgba(239,68,68,0.45)', glow: 'rgba(239,68,68,0.2)' };
    if (abs > 1)   return { bg: 'rgba(239,68,68,0.14)', border: 'rgba(239,68,68,0.28)', glow: 'rgba(239,68,68,0.1)' };
    if (abs > 0.3) return { bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.15)', glow: 'none' };
    return           { bg: 'rgba(239,68,68,0.03)', border: 'rgba(239,68,68,0.1)',  glow: 'none' };
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SectorSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
      {Array(7).fill(0).map((_, i) => (
        <div
          key={i}
          className="h-[72px] rounded-xl animate-pulse"
          style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Sector Tile ──────────────────────────────────────────────────────────────

function SectorTile({ sector, rank }: { sector: SectorQuote; rank: number }) {
  const isUp = sector.changePercent >= 0;
  const color = isUp ? '#10b981' : '#ef4444';
  const { bg, border, glow } = getIntensity(sector.changePercent);
  const absChange = Math.abs(sector.changePercent);

  return (
    <div
      className="rounded-xl p-3.5 relative overflow-hidden group transition-all duration-200 cursor-default"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: glow !== 'none' ? `0 4px 16px ${glow}` : 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${glow !== 'none' ? glow : 'rgba(0,0,0,0.2)'}`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = glow !== 'none' ? `0 4px 16px ${glow}` : 'none';
      }}
    >
      {/* Intensity progress bar at bottom */}
      <div
        className="absolute bottom-0 left-0 h-0.5 rounded-b-xl transition-all duration-500"
        style={{
          width: `${Math.min(absChange / 3, 1) * 100}%`,
          background: `linear-gradient(90deg, transparent, ${color})`,
        }}
      />

      {/* Rank badge (top performer) */}
      {rank <= 1 && (
        <div
          className="absolute top-2 right-2 text-[8px] font-black px-1.5 py-0.5 rounded-full"
          style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
        >
          #{rank + 1}
        </div>
      )}

      <div className="flex items-start justify-between mb-1">
        <span
          className="text-[11px] font-bold leading-tight pr-2"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {sector.name.replace('NIFTY ', '')}
        </span>
      </div>

      <div className="flex items-center gap-1" style={{ color }}>
        {isUp
          ? <ArrowUpRight size={13} strokeWidth={2.5} />
          : <ArrowDownRight size={13} strokeWidth={2.5} />
        }
        <span className="text-[14px] font-black tabular-nums">
          {isUp ? '+' : ''}{sector.changePercent.toFixed(2)}%
        </span>
      </div>

      {sector.volume !== undefined && sector.volume > 0 && (
        <p className="text-[9px] font-mono mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {(sector.volume / 1_000_000).toFixed(1)}M vol
        </p>
      )}
    </div>
  );
}

// ─── Summary stats bar ────────────────────────────────────────────────────────

function SummaryBar({ sectors }: { sectors: SectorQuote[] }) {
  const gainers = sectors.filter(s => s.changePercent > 0);
  const losers  = sectors.filter(s => s.changePercent < 0);
  const best    = sectors.reduce((a, b) => a.changePercent > b.changePercent ? a : b, sectors[0]);
  const worst   = sectors.reduce((a, b) => a.changePercent < b.changePercent ? a : b, sectors[0]);

  return (
    <div className="grid grid-cols-4 gap-2 mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      {[
        { label: 'Gainers', value: gainers.length, color: '#10b981' },
        { label: 'Losers',  value: losers.length,  color: '#ef4444' },
        { label: 'Best',    value: best  ? `+${best.changePercent.toFixed(2)}%`  : '—', color: '#10b981', sub: best?.name.replace('NIFTY ', '') },
        { label: 'Worst',   value: worst ? `${worst.changePercent.toFixed(2)}%`  : '—', color: '#ef4444', sub: worst?.name.replace('NIFTY ', '') },
      ].map(item => (
        <div key={item.label} className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.label}</p>
          <p className="text-[13px] font-black tabular-nums" style={{ color: item.color }}>{item.value}</p>
          {item.sub && <p className="text-[9px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.sub}</p>}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LiveSectorHeatmap() {
  const { sectors, loading, error, refresh } = useMarketSectors();
  const sorted = [...sectors].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}
          >
            <Layers size={14} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-white/90 leading-none">Sector Performance</h3>
            <p className="text-[10px] text-white/30 mt-0.5">NSE sectoral indices · Live</p>
          </div>
          {sectors.length > 0 && (
            <span
              className="text-[8.5px] font-black px-2 py-0.5 rounded-full tracking-widest"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              LIVE
            </span>
          )}
        </div>

        <button
          onClick={() => refresh()}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
          title="Refresh sectors"
        >
          <RefreshCw
            size={13}
            className={`text-white/25 transition-all ${loading ? 'animate-spin text-violet-400' : 'hover:text-white/50'}`}
          />
        </button>
      </div>

      {/* Loading */}
      {loading && sectors.length === 0 && <SectorSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <Layers size={24} className="mx-auto mb-2 opacity-30" />
          <p className="text-[12px]">Sector data unavailable</p>
        </div>
      )}

      {/* Content */}
      {sorted.length > 0 && (
        <>
          <SummaryBar sectors={sorted} />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {sorted.map((sector, i) => (
              <SectorTile key={sector.id} sector={sector} rank={i} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9.5px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {sorted.length} sectors · Yahoo Finance
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <TrendingUp size={9} className="text-emerald-500/50" />
                <span className="text-[9px] text-emerald-500/50">{sectors.filter(s => s.changePercent > 0).length} up</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown size={9} className="text-red-500/50" />
                <span className="text-[9px] text-red-500/50">{sectors.filter(s => s.changePercent < 0).length} down</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
