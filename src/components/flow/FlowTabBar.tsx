import React from 'react';
import { RefreshCw } from 'lucide-react';

export type FlowTab =
  | 'market-turnover'
  | 'listings';

const TABS: { id: FlowTab; label: string }[] = [
  { id: 'market-turnover', label: 'Market Turnover' },
  { id: 'listings',        label: 'Listings' },
];

interface FlowTabBarProps {
  activeTab: FlowTab;
  onTabChange: (tab: FlowTab) => void;
  lastUpdated?: number | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function FlowTabBar({
  activeTab,
  onTabChange,
  lastUpdated,
  onRefresh,
  isRefreshing,
}: FlowTabBarProps) {
  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : null;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-[rgba(var(--color-border-rgb),0.08)]">
      {/* Tab list */}
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-none -mb-px">
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              id={`flow-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={[
                'px-4 py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-all duration-150',
                isActive
                  ? 'border-[rgb(var(--color-iris))] text-[rgb(var(--color-iris))]'
                  : 'border-transparent text-secondary hover:text-primary hover:border-[rgba(var(--color-border-rgb),0.20)]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Last updated + refresh */}
      {updatedLabel && (
        <div className="flex items-center gap-2 shrink-0 pb-3">
          <span className="text-[11px] text-secondary font-medium">
            Last Updated: {updatedLabel}
          </span>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh"
            className="p-1 rounded-[6px] hover:bg-[rgb(var(--color-surface-2))] text-secondary hover:text-primary transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
}
