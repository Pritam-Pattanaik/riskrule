import React from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { ChevronDown, CalendarDays, Download, LayoutGrid, List } from 'lucide-react';

const CONTRACT_TYPES = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'];
const SYMBOLS = [
  { value: 'NIFTY',     label: 'NIFTY 50' },
  { value: 'BANKNIFTY', label: 'BANK NIFTY' },
  { value: 'FINNIFTY',  label: 'FIN NIFTY' },
];
const STRIKE_PRICES = ['ATM', 'ATM±2', 'ATM±5', 'All'];

type ViewMode = 'grid' | 'list';

interface ChainControlsProps {
  strikeFilter: string;
  onStrikeFilterChange: (v: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (v: ViewMode) => void;
  onDownloadCsv: () => void;
}

function SelectWrapper({
  value, onChange, options, icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={[
          'appearance-none h-9 rounded-[8px] text-[13px] font-semibold',
          'bg-[rgb(var(--color-surface-1))] text-primary',
          'border border-[rgba(var(--color-border-rgb),0.10)]',
          'hover:border-[rgba(var(--color-border-rgb),0.20)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-iris))]',
          'transition-colors cursor-pointer',
          icon ? 'pl-8 pr-8' : 'pl-3 pr-8',
        ].join(' ')}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
    </div>
  );
}

export function ChainControls({
  strikeFilter,
  onStrikeFilterChange,
  viewMode,
  onViewModeChange,
  onDownloadCsv,
}: ChainControlsProps) {
  const { intelligence, selectedIndex, setSelectedIndex } = useFlowStore();

  const spotPrice   = intelligence?.spotPrice ?? 0;
  const expiry      = intelligence?.expiry;
  const expiryLabel = expiry
    ? new Date(expiry).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

  const lastUpdatedAt = intelligence?.calculatedAt
    ? new Date(intelligence.calculatedAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
      })
    : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Contracts for */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Contracts for:</span>
          <SelectWrapper
            value={selectedIndex}
            onChange={setSelectedIndex}
            options={CONTRACT_TYPES.map(v => ({ value: v, label: v }))}
          />
        </div>

        {/* Select Symbol */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Select Symbol</span>
          <SelectWrapper
            value={selectedIndex}
            onChange={setSelectedIndex}
            options={SYMBOLS}
          />
        </div>

        {/* Expiry Date */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Expiry Date</span>
          <div className="flex items-center gap-2 h-9 px-3 rounded-[8px] bg-[rgb(var(--color-surface-1))] border border-[rgba(var(--color-border-rgb),0.10)] text-[13px] font-semibold text-primary">
            <CalendarDays className="w-3.5 h-3.5 text-secondary" />
            {expiryLabel}
          </div>
        </div>

        {/* Strike Price */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Strike Price</span>
          <SelectWrapper
            value={strikeFilter}
            onChange={onStrikeFilterChange}
            options={STRIKE_PRICES.map(v => ({ value: v, label: v }))}
          />
        </div>

        <div className="flex-1" />

        {/* View mode toggles */}
        <div className="flex items-center border border-[rgba(var(--color-border-rgb),0.10)] rounded-[8px] overflow-hidden">
          <button
            id="flow-view-grid"
            onClick={() => onViewModeChange('grid')}
            title="Grid view"
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[rgb(var(--color-surface-2))] text-primary' : 'bg-[rgb(var(--color-surface-1))] text-secondary hover:text-primary'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            id="flow-view-list"
            onClick={() => onViewModeChange('list')}
            title="List view"
            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[rgb(var(--color-surface-2))] text-primary' : 'bg-[rgb(var(--color-surface-1))] text-secondary hover:text-primary'}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Download CSV */}
        <button
          id="flow-download-csv"
          onClick={onDownloadCsv}
          className="flex items-center gap-2 px-3 h-9 rounded-[8px] border border-[rgba(var(--color-border-rgb),0.10)] bg-[rgb(var(--color-surface-1))] text-[13px] font-semibold text-secondary hover:text-primary hover:bg-[rgb(var(--color-surface-2))] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download (.csv)
        </button>
      </div>

      {/* Underlying info bar */}
      {spotPrice > 0 && (
        <div className="flex items-center gap-3 text-[13px]">
          <span className="text-secondary font-medium">
            Underlying Index : <span className="font-bold text-primary">{selectedIndex} {spotPrice.toLocaleString()}</span>
          </span>
          {lastUpdatedAt && (
            <span className="text-secondary">
              As on {lastUpdatedAt}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
