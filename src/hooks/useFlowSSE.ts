import { useEffect } from 'react';
import { useFlowStore } from '../stores/flowStore';
import { useAuthStore } from '../stores/authStore';
export function useFlowSSE() {
  const selectedIndex = useFlowStore((s) => s.selectedIndex);
  const fetchIntelligence = useFlowStore((s) => s.fetchIntelligence);
  const setIntelligence = useFlowStore((s) => s.setIntelligence);
  const fetchNarrative = useFlowStore((s) => s.fetchNarrative);
  const setConnected = useFlowStore((s) => s.setConnected);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;
    let autoRefreshInterval: ReturnType<typeof setInterval> | undefined;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 3;

    // We get the current session token to pass as a query parameter
    // so the backend can authenticate the SSE stream.
    const token = useAuthStore.getState().token || localStorage.getItem('token');
    if (!token) return;

    const connect = () => {
      // Close existing connection if any
      if (eventSource) {
        eventSource.close();
      }

      const url = `/api/v1/flow/stream?symbols=${selectedIndex}&token=${encodeURIComponent(token)}`;
      eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onopen = () => {
        setConnected(true);
        reconnectAttempts = 0; // Reset on successful connection
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'intelligence' && data.payload && data.payload.symbol === selectedIndex) {
            setIntelligence(data.payload);
            fetchNarrative();
          }
        } catch (_e) {
          // Keep-alive or invalid data
        }
      };

      eventSource.onerror = () => {
        setConnected(false);
        eventSource?.close();

        reconnectAttempts++;
        if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
          // Exponential backoff or fixed delay reconnect
          reconnectTimeout = setTimeout(connect, 3000);
        } else {
          console.error('[FlowSSE] Max reconnect attempts reached. Halting connection loop.');
        }
      };
    };

    connect();

    // 5-second automatic polling loop to guarantee continuous real-time updates
    autoRefreshInterval = setInterval(() => {
      fetchIntelligence();
    }, 5000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearTimeout(reconnectTimeout);
      clearInterval(autoRefreshInterval);
      setConnected(false);
    };
  }, [selectedIndex, fetchIntelligence, setIntelligence, fetchNarrative, setConnected]);
}
