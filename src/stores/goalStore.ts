import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { api } from '../lib/api';

interface GoalState {
  goals: any[];
  loadedFor: string | null;
  loadError: boolean;
  loading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: any) => Promise<void>;
  completeGoal: (id: string, date: string, completed: boolean) => Promise<boolean>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  loadedFor: null,
  loadError: false,
  loading: false,
  fetchGoals: async () => {
    const owner = useAuthStore.getState().user?.id;
    if (!owner) return;
    set({ loading: true, loadError: false });
    try {
      const data = await api.get<any[]>('/goals');
      if (useAuthStore.getState().user?.id === owner) set({ goals: data, loadedFor: owner, loading: false });
    } catch {
      if (useAuthStore.getState().user?.id === owner) set({ loading: false, loadedFor: owner, loadError: true });
    }
  },
  addGoal: async (goal) => {
    try {
      const newGoal = await api.post<any>('/goals', goal);
      set({ goals: [...get().goals, { ...newGoal, completions: [] }] });
    } catch (e) {
      throw e;
    }
  },
  completeGoal: async (id, date, completed) => {
    try {
      const owner = useAuthStore.getState().user?.id;
      const comp = await api.post<any>(`/goals/${id}/complete`, { date, completed });
      if (useAuthStore.getState().user?.id !== owner) return false;
      set({
        goals: get().goals.map(g => {
          if (g.id === id) {
            return { ...g, completions: [...(g.completions ?? []), comp] };
          }
          return g;
        })
      });
      return true;
    } catch {
      return false;
    }
  }
}));
