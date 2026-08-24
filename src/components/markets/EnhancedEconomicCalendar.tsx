/**
 * EnhancedEconomicCalendar — Premium Economic Event Calendar
 *
 * Fetches live events from backend (curated Indian & global macro events).
 * Features: impact-coded tiles, countdown timer, grouped by date, filterable.
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, RefreshCw, Flame } from 'lucide-react';
import { useEconomicCalendar, type CalendarEvent } from '../../hooks/useMarketData';

// ─── Config ───────────────────────────────────────────────────────────────────

const IMPACT_CFG = {
  high:   { label: 'HIGH',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   dot: '#ef4444' },
  medium: { label: 'MED',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',   dot: '#f59e0b' },
  low:    { label: 'LOW',    color: '#6b7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.15)', dot: '#6b7280' },
} as const;

type ImpactFilter = 'all' | 'high' | 'medium' | 'low';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown({ date, time }: { date: string; time: string }) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const update = () => {
      const target = new Date(`${date}T${time}:00`);
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setLabel('Passed'); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      if (h > 24) { setLabel(`${Math.floor(h / 24)}d ${h % 24}h`); return; }
      if (h > 0)  { setLabel(`${h}h ${m}m`); return; }
      setLabel(`${m}m`);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [date, time]);

  return (
    <span
      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
      style={{ color: 'rgba(var(--color-border-rgb),0.3)', background: 'rgba(var(--color-border-rgb),0.04)' }}
    >
      {label}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CalSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map(n => (
        <div
          key={n}
          className="h-16 rounded-xl animate-pulse"
          style={{ background: 'rgba(var(--color-border-rgb),0.04)', animationDelay: `${n * 100}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Event Row ────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: CalendarEvent }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = IMPACT_CFG[event.impact];

  return (
    <button
      onClick={() => setExpanded(v => !v)}
      className="w-full text-left rounded-xl p-3 transition-all duration-150 group"
      style={{
        background: expanded ? 'rgba(var(--color-border-rgb),0.04)' : 'rgba(var(--color-border-rgb),0.02)',
        border: `1px solid ${expanded ? 'rgba(var(--color-border-rgb),0.1)' : 'rgba(var(--color-border-rgb),0.05)'}`,
        outline: 'none',
      }}
      onMouseEnter={e => !expanded && ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--color-border-rgb),0.08)')}
      onMouseLeave={e => !expanded && ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(var(--color-border-rgb),0.05)')}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Left */}
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Impact column */}
          <div className="flex flex-col items-center gap-1.5 pt-0.5 flex-shrink-0">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: cfg.dot,
                boxShadow: event.impact === 'high' ? `0 0 6px ${cfg.dot}80` : 'none',
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-base leading-none">{event.countryFlag}</span>
              <span
                className="text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
              >
                {event.impact === 'high' && <Flame size={8} className="inline mr-0.5 -mt-0.5" />}
                {cfg.label}
              </span>
              <span
                className="flex items-center gap-1 text-[9px] font-mono"
                style={{ color: 'rgba(var(--color-border-rgb),0.3)' }}
              >
                <Clock size={8} />
                {event.time} {event.timezone}
              </span>
              <Countdown date={event.date} time={event.time} />
            </div>
            <p className="text-[12.5px] font-semibold leading-snug truncate" style={{ color: 'rgba(var(--color-border-rgb),0.8)' }}>
              {event.title}
            </p>
          </div>
        </div>

        {/* Data cols */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {event.forecast != null && (
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(var(--color-border-rgb),0.2)' }}>Fcst</p>
              <p className="text-[11px] font-mono font-semibold" style={{ color: 'rgba(var(--color-border-rgb),0.55)' }}>{event.forecast}</p>
            </div>
          )}
          {event.previous != null && (
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(var(--color-border-rgb),0.2)' }}>Prev</p>
              <p className="text-[11px] font-mono" style={{ color: 'rgba(var(--color-border-rgb),0.35)' }}>{event.previous}</p>
            </div>
          )}
          {event.actual != null && (
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(var(--color-border-rgb),0.2)' }}>Act</p>
              <p className="text-[11px] font-mono font-black" style={{ color: 'rgb(var(--color-text-primary))' }}>{event.actual}</p>
            </div>
          )}
          <ChevronDown
            size={12}
            className="transition-transform duration-200 flex-shrink-0"
            style={{ color: 'rgba(var(--color-border-rgb),0.2)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </div>

      {/* Description (expanded) */}
      {expanded && event.description && (
        <div
          className="mt-2.5 pt-2.5 text-[11.5px] leading-relaxed"
          style={{ borderTop: '1px solid rgba(var(--color-border-rgb),0.06)', color: 'rgba(var(--color-border-rgb),0.4)' }}
        >
          {event.description}
        </div>
      )}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EnhancedEconomicCalendar() {
  const { events, loading, error } = useEconomicCalendar(30);
  const [filter, setFilter] = useState<ImpactFilter>('all');

  const filtered = events.filter(e => filter === 'all' || e.impact === filter);

  const grouped = filtered.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();
  const highCount = events.filter(e => e.impact === 'high').length;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col"
      style={{ background: 'rgba(var(--color-border-rgb),0.02)', border: '1px solid rgba(var(--color-border-rgb),0.07)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}
          >
            <Calendar size={14} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-primary/90 leading-none">Economic Calendar</h3>
            <p className="text-[10px] text-primary/25 mt-0.5">Upcoming macro events</p>
          </div>
          {highCount > 0 && (
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {highCount} HIGH
            </span>
          )}
        </div>
        {loading && <RefreshCw size={13} className="text-violet-400 animate-spin" />}
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {(['all', 'high', 'medium', 'low'] as ImpactFilter[]).map(f => {
          const isActive = filter === f;
          const color = f === 'all' ? '#a78bfa' : IMPACT_CFG[f as Exclude<ImpactFilter, 'all'>].color;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all capitalize"
              style={{
                background: isActive ? `${color}18` : 'rgba(var(--color-border-rgb),0.04)',
                color: isActive ? color : 'rgba(var(--color-border-rgb),0.3)',
                border: isActive ? `1px solid ${color}40` : '1px solid rgba(var(--color-border-rgb),0.06)',
              }}
            >
              {f === 'all' ? 'All' : f}
              {f !== 'all' && (
                <span
                  className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block align-middle"
                  style={{ background: IMPACT_CFG[f].dot }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '480px' }}>
        {loading && events.length === 0 && <CalSkeleton />}

        {!loading && error && (
          <div className="text-center py-8">
            <Calendar size={28} className="mx-auto mb-2 opacity-20" style={{ color: 'rgb(var(--color-text-primary))' }} />
            <p className="text-[12px]" style={{ color: 'rgba(var(--color-border-rgb),0.25)' }}>Calendar unavailable</p>
          </div>
        )}

        {!loading && !error && sortedDates.length === 0 && (
          <div className="text-center py-8">
            <Calendar size={28} className="mx-auto mb-2 opacity-20" style={{ color: 'rgb(var(--color-text-primary))' }} />
            <p className="text-[12px]" style={{ color: 'rgba(var(--color-border-rgb),0.25)' }}>No events for this filter</p>
          </div>
        )}

        {sortedDates.map(date => (
          <div key={date}>
            {/* Date header */}
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: '#a78bfa' }}
              >
                {formatDate(date)}
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.15)' }} />
              <span className="text-[9px] font-semibold" style={{ color: 'rgba(var(--color-border-rgb),0.2)' }}>
                {grouped[date].length} events
              </span>
            </div>
            <div className="space-y-2">
              {grouped[date].map(evt => <EventRow key={evt.id} event={evt} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
