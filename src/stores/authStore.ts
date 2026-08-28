import { create } from 'zustand';
import { api } from '../lib/api';

interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber?: string | null;
  avatarUrl: string | null;
  timezone: string | null;
  role: 'USER' | 'SUB_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';
}

interface AuthState {
  user: Profile | null;
  profile: Profile | null; // backwards compatibility alias
  session: { token: string } | null;
  token: string | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  deleteAccount: () => Promise<{ error: string | null }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  // Check localStorage for backward compat with any existing sessions
  session: localStorage.getItem('token') ? { token: localStorage.getItem('token')! } : null,
  token: localStorage.getItem('token'),
  loading: true,

  initialize: async () => {
    try {
      const data = await api.get<{ token?: string; user: Profile }>('/auth/me');
      const validToken = data.token || localStorage.getItem('token') || '';
      if (validToken && validToken !== 'cookie') {
        localStorage.setItem('token', validToken);
      }
      set({
        user: data.user,
        profile: data.user,
        session: validToken ? { token: validToken } : null,
        token: validToken || null,
        loading: false,
      });
    } catch (err) {
      localStorage.removeItem('token');
      set({ token: null, session: null, user: null, profile: null, loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      const data = await api.post<{ token: string; user: Profile }>('/auth/login', { email, password });
      // Store token in localStorage for backward compat with any code still reading it
      localStorage.setItem('token', data.token);
      set({ token: data.token, session: { token: data.token }, user: data.user, profile: data.user });
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  signUp: async (email, password, fullName, phoneNumber) => {
    try {
      const data = await api.post<{ token: string; user: Profile }>('/auth/signup', { email, password, fullName, phoneNumber });
      localStorage.setItem('token', data.token);
      set({ token: data.token, session: { token: data.token }, user: data.user, profile: data.user });
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  signOut: () => {
    // Call server to clear the HttpOnly cookie
    api.post('/auth/logout', {}).catch(() => {});
    localStorage.removeItem('token');
    set({ token: null, session: null, user: null, profile: null });
  },

  deleteAccount: async () => {
    try {
      await api.delete('/auth/account');
      localStorage.removeItem('token');
      set({ token: null, session: null, user: null, profile: null });
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  updateProfile: async (updates) => {
    try {
      const data = await api.patch<{ user: Profile }>('/auth/profile', updates);
      set({ user: data.user, profile: data.user });
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  },
}));
