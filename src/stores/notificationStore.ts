import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, BASE_URL } from '../lib/api';
import { toast } from 'sonner';
import { useVoiceStore } from './voiceStore';

export type NotificationCategory = 'Trading' | 'Risk' | 'Market' | 'AI' | 'Reports';
export type NotificationPriority = 'Critical' | 'Warning' | 'Success' | 'Information';
export type NotificationDisplayScope = 'global' | 'in-app' | 'both';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  category: NotificationCategory;
  priority: NotificationPriority;
  displayScope?: NotificationDisplayScope;
  isRead: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export type NotificationFilter = 'All' | NotificationCategory | 'Unread';

interface NotificationState {
  notifications: NotificationItem[];
  filter: NotificationFilter;
  isPanelOpen: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  isConnected: boolean; // For SSE state
  error: string | null;

  // ── System (OS) Notification Preferences ──────────────────────────────
  globalNotificationsEnabled: boolean;
  notifPermission: NotificationPermission;
  categoryGlobalOverrides: Partial<Record<NotificationCategory, boolean>>;
  priorityGlobalOverrides: Partial<Record<NotificationPriority, boolean>>;
  flashTabTitle: boolean;
  /** Callback registered by useSystemNotifications to fire OS notifications */
  _systemNotifCallback: ((item: NotificationItem) => void) | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  initializeSSE: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  setFilter: (filter: NotificationFilter) => void;
  setPanelOpen: (isOpen: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;

  // ── System Notification Actions ───────────────────────────────────────
  setGlobalNotificationsEnabled: (enabled: boolean) => void;
  setNotifPermission: (permission: NotificationPermission) => void;
  setCategoryGlobalOverride: (category: NotificationCategory, enabled: boolean) => void;
  setPriorityGlobalOverride: (priority: NotificationPriority, enabled: boolean) => void;
  setFlashTabTitle: (enabled: boolean) => void;
  setSystemNotifCallback: (cb: ((item: NotificationItem) => void) | null) => void;
}

// Global SSE connection instance so it's not duplicated
let eventSource: EventSource | null = null;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      filter: 'All',
      isPanelOpen: false,
      soundEnabled: true,
      soundVolume: 0.5,
      isConnected: false,
      error: null,

      // ── System Notification State ─────────────────────────────────────
      globalNotificationsEnabled: true,
      notifPermission: 'default' as NotificationPermission,
      categoryGlobalOverrides: {},
      priorityGlobalOverrides: {},
      flashTabTitle: true,
      _systemNotifCallback: null,

      fetchNotifications: async () => {
        try {
          const data = await api.get<NotificationItem[]>('/notifications');
          set({ notifications: data, error: null });
        } catch (error: any) {
          console.error('[Notifications] Fetch error:', error);
          set({ error: error.message || 'Failed to load notifications' });
        }
      },

      initializeSSE: () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // If already connected or connecting, do not re-initialize
        if (eventSource && (eventSource.readyState === EventSource.OPEN || eventSource.readyState === EventSource.CONNECTING)) {
          return;
        }

        if (eventSource) {
          eventSource.close();
        }

        // Pass token in URL for bulletproof authentication across all environments
        const sseUrl = token
          ? `${BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`
          : `${BASE_URL}/notifications/stream`;

        eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.onopen = () => {
          console.log('[Notifications] SSE Connected');
          set({ isConnected: true });
        };

        eventSource.onerror = (err) => {
          console.error('[Notifications] SSE Error:', err);
          set({ isConnected: false });
          // EventSource will automatically try to reconnect
        };

        // Listen for new notifications
        eventSource.addEventListener('new_notification', (e) => {
          try {
            const parsed = JSON.parse(e.data);
            const newItem: NotificationItem = {
              id: parsed.id,
              title: parsed.title,
              description: parsed.description,
              timestamp: new Date(parsed.createdAt).getTime(),
              category: parsed.category,
              priority: parsed.priority,
              displayScope: parsed.displayScope || 'both',
              isRead: parsed.isRead,
              actionLabel: parsed.actionLabel,
              actionUrl: parsed.actionUrl,
            };

            set((state) => {
              // Grouping / De-duplication: Ignore exact same title within 5 minutes
              const isDuplicate = state.notifications.some(n => 
                !n.isRead && 
                n.title === newItem.title && 
                (newItem.timestamp - n.timestamp) < 5 * 60 * 1000
              );

              if (isDuplicate) {
                return state;
              }

              // Keep maximum of 50 notifications to prevent memory bloat
              const updated = [newItem, ...state.notifications].slice(0, 50);
              
              return { notifications: updated, error: null };
            });

            // Trigger a UI Toast Notification for real-time visibility
            toast.info(newItem.title, {
              description: newItem.description,
              duration: newItem.priority === 'Critical' ? 10000 : 5000,
            });

            // ── Fire system (OS) notification via registered callback ───
            const callback = get()._systemNotifCallback;
            if (callback) {
              callback(newItem);
            }

            // ── Auto-speak notification if Voice AI engine is enabled ───
            try {
              useVoiceStore.getState().speakNotification(newItem.title, newItem.description);
            } catch (vErr) {
              console.warn('[Notifications] Voice speak error:', vErr);
            }

            // Auto-dismiss (mark as read) for Information and Success after 8 seconds
            if (newItem.priority === 'Information' || newItem.priority === 'Success') {
              setTimeout(() => {
                get().markAsRead(newItem.id);
              }, 8000);
            }
          } catch (error) {
            console.error('[Notifications] Failed to parse SSE event:', error);
          }
        });
      },

      markAsRead: async (id) => {
        // Optimistic UI update
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, isRead: true } : n
          )
        }));

        try {
          await api.patch(`/notifications/${id}/read`, {});
        } catch (e) {
          console.error('Failed to mark read', e);
        }
      },

      markAllAsRead: async () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true }))
        }));

        try {
          await api.patch(`/notifications/read-all`, {});
        } catch (e) {
          console.error('Failed to mark all read', e);
        }
      },

      clearAll: async () => {
        set({ notifications: [] });

        try {
          await api.delete(`/notifications`);
        } catch (e) {
          console.error('Failed to clear all', e);
        }
      },

      deleteNotification: async (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));

        try {
          await api.delete(`/notifications/${id}`);
        } catch (e) {
          console.error('Failed to delete', e);
        }
      },

      setFilter: (filter) => set({ filter }),
      
      setPanelOpen: (isOpen) => set({ isPanelOpen: isOpen }),
      
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      
      setSoundVolume: (volume) => set({ soundVolume: volume }),

      // ── System Notification Actions ───────────────────────────────────
      setGlobalNotificationsEnabled: (enabled) => set({ globalNotificationsEnabled: enabled }),

      setNotifPermission: (permission) => set({ notifPermission: permission }),

      setCategoryGlobalOverride: (category, enabled) =>
        set((state) => ({
          categoryGlobalOverrides: {
            ...state.categoryGlobalOverrides,
            [category]: enabled,
          },
        })),

      setPriorityGlobalOverride: (priority, enabled) =>
        set((state) => ({
          priorityGlobalOverrides: {
            ...state.priorityGlobalOverrides,
            [priority]: enabled,
          },
        })),

      setFlashTabTitle: (enabled) => set({ flashTabTitle: enabled }),

      setSystemNotifCallback: (cb) => set({ _systemNotifCallback: cb }),

    }),
    {
      name: 'riskrules-notifications-settings',
      partialize: (state) => ({ 
        soundEnabled: state.soundEnabled, 
        soundVolume: state.soundVolume,
        globalNotificationsEnabled: state.globalNotificationsEnabled,
        categoryGlobalOverrides: state.categoryGlobalOverrides,
        priorityGlobalOverrides: state.priorityGlobalOverrides,
        flashTabTitle: state.flashTabTitle,
      }), // ONLY persist settings, data comes from DB
    }
  )
);

