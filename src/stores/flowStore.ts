import { create } from 'zustand';
import { api } from '../lib/api';
import { FlowIntelligence, FlowNarrativeData } from '../types';

interface FlowState {
  // Config
  selectedIndex: string;
  setSelectedIndex: (index: string) => void;

  // Connection
  isConnected: boolean;
  setConnected: (status: boolean) => void;
  
  // Market & Broker State
  isMarketClosed: boolean;
  brokerStatus: 'connected' | 'expired' | 'missing' | null;
  brokerError: string | null;

  // Data State
  intelligence: FlowIntelligence | null;
  narrative: FlowNarrativeData | null;
  setIntelligence: (intelligence: FlowIntelligence) => void;
  setNarrative: (narrative: FlowNarrativeData) => void;
  
  // Loading & Errors
  isLoading: boolean;
  isNarrativeLoading: boolean;
  error: string | null;
  clearError: () => void;
  
  // Actions
  fetchIntelligence: (isBackground?: boolean) => Promise<void>;
  fetchNarrative: () => Promise<void>;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  selectedIndex: 'NIFTY',
  setSelectedIndex: (index) => {
    set({ selectedIndex: index, intelligence: null, narrative: null, error: null });
    // Reset and fetch new data
    get().fetchIntelligence();
  },
  
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),

  isMarketClosed: false,
  brokerStatus: null,
  brokerError: null,
  
  intelligence: null,
  setIntelligence: (intelligence) => set({
    intelligence,
    isMarketClosed: Boolean(intelligence.isMarketClosed),
    brokerStatus: intelligence.brokerStatus ?? 'connected',
    brokerError: intelligence.brokerMessage ?? null,
    error: null,
  }),
  
  narrative: null,
  setNarrative: (narrative) => set({ narrative }),
  
  isLoading: false,
  isNarrativeLoading: false,
  error: null,
  clearError: () => set({ error: null }),
  
  fetchIntelligence: async (isBackground = false) => {
    const { selectedIndex } = get();
    if (!isBackground) {
      set({ isLoading: true, error: null });
    }
    
    try {
      const json = await api.get<any>(`/v1/flow/intelligence/${selectedIndex}`);

      if (json?.brokerStatus) {
        set({ brokerStatus: json.brokerStatus, brokerError: json.error || null });
      }

      if (json?.isMarketClosed !== undefined) {
        set({ isMarketClosed: Boolean(json.isMarketClosed) });
      }

      if (json?.success && json?.data) {
        set({
          intelligence: json.data,
          isMarketClosed: Boolean(json.data.isMarketClosed),
          brokerStatus: json.data.brokerStatus || 'connected',
          brokerError: null,
          error: null,
        });
        get().fetchNarrative();
      } else if (json?.isMarketClosed && !json?.data) {
        set({ isMarketClosed: true, error: null });
      } else if (!isBackground) {
        const errorMsg = json?.error || 'Failed to load flow data.';
        set({ error: errorMsg });
      }
    } catch (err: any) {
      console.error('Failed to fetch intelligence', err);
      if (err?.brokerStatus) {
        set({ brokerStatus: err.brokerStatus, brokerError: err.message, error: err.message });
      } else if (err?.code === 'BROKER_EXPIRED') {
        set({ brokerStatus: 'expired', brokerError: err.message, error: err.message });
      } else if (err?.code === 'BROKER_DISCONNECTED') {
        set({ brokerStatus: 'missing', brokerError: err.message, error: err.message });
      } else if (!isBackground) {
        set({ error: err.message || 'Network error connecting to flow server' });
      }
    } finally {
      if (!isBackground) {
        set({ isLoading: false });
      }
    }
  },
  
  fetchNarrative: async () => {
    const { selectedIndex } = get();
    set({ isNarrativeLoading: true });
    
    try {
      const json = await api.get<any>(`/v1/flow/narrative/${selectedIndex}`);
      if (json?.success && json?.data) {
        set({ narrative: json.data });
      }
    } catch (err) {
      console.error('Failed to fetch narrative', err);
    } finally {
      set({ isNarrativeLoading: false });
    }
  }
}));
