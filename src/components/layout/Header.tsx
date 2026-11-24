import React, { useState, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { RefreshCw, ChevronRight, Menu, Search } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useBrokerStore } from '../../stores/brokerStore';
import { useTradeStore } from '../../stores/tradeStore';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { CMD_KEY } from '../../lib/osUtils';

function relativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 10)  return 'just now';
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Header({ onSearch }: { onSearch?: () => void }) {
  const location = useLocation();
  const { setSidebarOpen } = useUIStore();
  const { connections, syncConnection } = useBrokerStore();
  const fetchTrades = useTradeStore(s => s.fetchTrades);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastManualSync, setLastManualSync] = useState<Date | null>(null);
  const slug = location.pathname.split('/')[2] ?? '';
  const section = ['markets', 'flow', 'ai-coach'].includes(slug) ? 'Research'
    : ['trades', 'journal', 'strategies', 'vault', 'goals', 'analytics'].includes(slug) ? 'Trading journal'
    : ['affiliate', 'settings'].includes(slug) ? 'Account' : 'Overview';

  const latestSyncedAt = React.useMemo(() => {
    const times = connections
      .filter(c => c.isActive && c.lastSyncedAt)
      .map(c => new Date(c.lastSyncedAt!).getTime())
      .filter(t => !isNaN(t));
    const extra = lastManualSync ? lastManualSync.getTime() : 0;
    if (times.length === 0 && !extra) return null;
    return new Date(Math.max(...times, extra));
  }, [connections, lastManualSync]);

  const handleSync = useCallback(async () => {
    if (isSyncing) return;
    const active = connections.filter(c => c.isActive);
    if (!active.length) return;
    setIsSyncing(true);
    try {
      const results = await Promise.allSettled(active.map(c => syncConnection(c.broker)));
      await fetchTrades();
      if (results.every(r => r.status === 'fulfilled' && !r.value.error && !r.value.alreadySyncing)) setLastManualSync(new Date());
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, connections, syncConnection, fetchTrades]);

  const activeConnections = connections.filter(c => c.isActive).length;

  return (
    <>
      <header className="flex h-12 w-full shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">

        {/* Left — Mobile menu + Breadcrumbs */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <Menu className="h-4 w-4" />
          </Button>
          <nav className="flex items-center gap-2 text-xs text-secondary" aria-label="Breadcrumb">
            <Link to="/app" className="rounded transition-colors hover:text-accent">Workspace</Link><ChevronRight size={13} />
            <span className="font-medium text-primary">{section}</span>
          </nav>
        </div>

        {/* Right — search and sync status */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {onSearch && (
            <button
              onClick={onSearch}
              aria-label="Search workspace"
              className="flex h-8 items-center gap-2 rounded-lg border border-border bg-surface-1 px-2.5 text-tertiary outline-none transition-colors hover:bg-surface-2 hover:text-secondary focus-visible:ring-2 focus-visible:ring-accent sm:w-56 lg:hidden"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden flex-1 text-left text-[13px] sm:inline">Search</span>
              <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] sm:inline">{CMD_KEY} K</kbd>
            </button>
          )}
          {activeConnections > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-muted">
                {latestSyncedAt ? `Synced ${relativeTime(latestSyncedAt)}` : 'Not synced'}
              </span>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                title="Force sync broker trades"
                aria-label="Force sync broker trades"
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg',
                  'text-tertiary hover:text-primary hover:bg-surface-2 transition-colors',
                  'focus:outline-none focus-ring disabled:opacity-40'
                )}
              >
                <RefreshCw className={cn('h-3.5 w-3.5', isSyncing && 'animate-spin text-accent')} />
              </button>
            </div>
          )}
        </div>
      </header>


    </>
  );
}
