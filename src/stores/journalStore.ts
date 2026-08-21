import { create } from 'zustand';
import { api } from '../lib/api';
import { JournalEntry } from '../types';

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

function normalizeEntry(entry: any): JournalEntry {
  if (!entry) return entry;
  const dateStr = entry.date instanceof Date
    ? entry.date.toISOString().split('T')[0]
    : (typeof entry.date === 'string' ? entry.date.split('T')[0] : entry.date);
  return {
    ...entry,
    date: dateStr,
  };
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  loading: false,
  error: null,

  fetchEntries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<JournalEntry[]>('/journal');
      const normalized = (response || []).map(normalizeEntry);
      set({ entries: normalized, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch journal entries', loading: false });
    }
  },

  addEntry: async (entry) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<JournalEntry>('/journal', entry);
      const normalized = normalizeEntry(response);
      set((state) => {
        const withoutDate = state.entries.filter(e => e.date !== normalized.date && e.id !== normalized.id);
        return {
          entries: [normalized, ...withoutDate],
          loading: false,
        };
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to add journal entry', loading: false });
      throw error;
    }
  },

  updateEntry: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch<JournalEntry>(`/journal/${id}`, updates);
      const normalized = normalizeEntry(response);
      set((state) => ({
        entries: state.entries.map((entry) => 
          entry.id === id ? normalized : entry
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update journal entry', loading: false });
      throw error;
    }
  },

  deleteEntry: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/journal/${id}`);
      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete journal entry', loading: false });
      throw error;
    }
  },
}));

