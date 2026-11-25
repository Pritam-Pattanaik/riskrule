import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTradeStore } from '../stores/tradeStore';
import { useBrokerStore } from '../stores/brokerStore';

const AUTO_SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function useAutoSync() {
  const initialize = useAuthStore(state => state.initialize);
  const fetchTrades = useTradeStore(state => state.fetchTrades);
  const token = useAuthStore(state => state.token);
  const userId = useAuthStore(state => state.user?.id);
  const loading = useAuthStore(state => state.loading);
  const fetchConnections = useBrokerStore(state => state.fetchConnections);
  const syncAll = useBrokerStore(state => state.syncAll);

  const startedFor = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (loading || !userId || !token) {
      startedFor.current = null;
      return;
    }

    if (startedFor.current !== userId) {
      startedFor.current = userId;
      void Promise.all([fetchTrades(), fetchConnections()]).then(() => {
        if (useAuthStore.getState().user?.id !== userId) return;
        if (useBrokerStore.getState().connections.some(c => c.isActive)) {
          syncAll().catch(err => console.warn('[AutoSync] Background sync error:', err));
        }
      });
    }

    intervalRef.current = setInterval(async () => {
      const { isSyncing, connections } = useBrokerStore.getState();
      if (isSyncing || !connections.some(c => c.isActive)) return;
      syncAll().catch(err => console.warn('[PeriodicSync] Error:', err));
    }, AUTO_SYNC_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loading, userId, token, fetchTrades, fetchConnections, syncAll]);
}
