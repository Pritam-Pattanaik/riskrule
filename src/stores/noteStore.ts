import { create } from 'zustand';
import { api } from '../lib/api';

interface NoteState {
  notes: any[];
  loading: boolean;
  loadError: boolean;
  fetchNotes: () => Promise<void>;
  addNote: (note: any) => Promise<void>;
  updateNote: (id: string, updates: any) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  loading: false,
  loadError: false,
  fetchNotes: async () => {
    set({ loading: true, loadError: false, notes: [] });
    try {
      const notes = await api.get<any[]>('/notes');
      set({ notes, loading: false });
    } catch {
      set({ loading: false, loadError: true });
    }
  },
  addNote: async (note) => {
    try {
      const newNote = await api.post<any>('/notes', note);
      set({ notes: [newNote, ...get().notes] });
    } catch (e) {
      throw e;
    }
  },
  updateNote: async (id, updates) => {
    try {
      const updated = await api.patch<any>(`/notes/${id}`, updates);
      set({ notes: get().notes.map(n => n.id === id ? updated : n) });
    } catch (e) {
      console.error(e);
    }
  },
  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set({ notes: get().notes.filter(n => n.id !== id) });
    } catch (e) {
      console.error(e);
    }
  }
}));
