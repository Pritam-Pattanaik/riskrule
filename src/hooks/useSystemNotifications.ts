import { useEffect, useCallback, useRef } from 'react';
import { useNotificationStore, NotificationCategory, NotificationPriority } from '../stores/notificationStore';
import type { NotificationItem } from '../stores/notificationStore';

// ─── Default Category Routing ───────────────────────────────────────────────
const DEFAULT_GLOBAL_CATEGORIES: NotificationCategory[] = ['Risk', 'Trading', 'Market', 'AI', 'Reports'];

/**
 * Determines if a notification item should fire a system (OS) notification.
 * Respects the server's displayScope AND the user's category & priority overrides.
 */
export function shouldSendGlobal(
  item: NotificationItem,
  categoryOverrides: Partial<Record<NotificationCategory, boolean>>,
  priorityOverrides: Partial<Record<NotificationPriority, boolean>>
): boolean {
  // If the server explicitly locked to 'in-app', don't fire globally
  if (item.displayScope === 'in-app') return false;

  // Check category override
  const catOverride = categoryOverrides[item.category];
  if (catOverride === false) return false;

  // Check priority override
  const prioOverride = priorityOverrides[item.priority];
  if (prioOverride === false) return false;
  if (prioOverride === true) return true;
  if (catOverride === true) return true;

  // Default: Allow across all registered categories
  return DEFAULT_GLOBAL_CATEGORIES.includes(item.category);
}

// ─── Dynamic Tab Title Flasher (for when user is in other tabs) ─────────────
let _titleFlashInterval: any = null;
const ORIGINAL_TITLE = typeof document !== 'undefined' ? document.title || 'TradeVault' : 'TradeVault';

function flashTab(titleText: string) {
  if (typeof document === 'undefined') return;
  if (!document.hidden) return; // Only flash if user is on another tab

  if (_titleFlashInterval) clearInterval(_titleFlashInterval);

  let isAlternate = false;
  _titleFlashInterval = setInterval(() => {
    if (!document.hidden) {
      if (_titleFlashInterval) clearInterval(_titleFlashInterval);
      document.title = ORIGINAL_TITLE;
      return;
    }
    document.title = isAlternate ? titleText : `(1) 🔔 ${ORIGINAL_TITLE}`;
    isAlternate = !isAlternate;
  }, 1200);

  // Clear when window regains focus
  const clearOnFocus = () => {
    if (_titleFlashInterval) clearInterval(_titleFlashInterval);
    document.title = ORIGINAL_TITLE;
    window.removeEventListener('focus', clearOnFocus);
  };
  window.addEventListener('focus', clearOnFocus);
}

/**
 * Hook that manages the Web Notifications API and Cross-Tab Alert sync.
 * Mount this once inside the authenticated MainLayout.
 */
export function useSystemNotifications() {
  const {
    globalNotificationsEnabled,
    categoryGlobalOverrides,
    priorityGlobalOverrides,
    flashTabTitle,
    notifPermission,
    setNotifPermission,
    setSystemNotifCallback,
  } = useNotificationStore();

  // ── Permission Sync ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    setNotifPermission(Notification.permission);

    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'notifications' as PermissionName })
        .then((status) => {
          status.onchange = () => {
            if ('Notification' in window) {
              setNotifPermission(Notification.permission);
            }
          };
        })
        .catch(() => {});
    }
  }, [setNotifPermission]);

  // ── Send System Notification ─────────────────────────────────────────────
  const sendSystemNotification = useCallback((item: NotificationItem) => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const {
      globalNotificationsEnabled: enabled,
      categoryGlobalOverrides: catOverrides,
      priorityGlobalOverrides: prioOverrides,
      flashTabTitle: canFlash,
    } = useNotificationStore.getState();

    if (!enabled) return;
    if (!shouldSendGlobal(item, catOverrides, prioOverrides)) return;

    const priorityIcons: Record<string, string> = {
      Critical: '🚨',
      Warning: '⚠️',
      Success: '✅',
      Information: 'ℹ️',
    };

    const iconUrl = `${window.location.origin}/icon-192x192.png`;
    const titleText = `${priorityIcons[item.priority] ?? ''} ${item.title}`;

    try {
      // Unique tag per notification prevents browser from suppressing repeated alerts
      const uniqueTag = `tv-${item.category}-${item.id || Date.now()}`;

      const notificationOptions: NotificationOptions = {
        body: item.description,
        icon: iconUrl,
        badge: iconUrl,
        tag: uniqueTag,
        requireInteraction: item.priority === 'Critical',
        silent: false, // Ensure OS plays alert sound if enabled
      };

      const n = new Notification(titleText, notificationOptions);

      n.onclick = () => {
        window.focus();

        if (item.actionUrl) {
          window.history.pushState({}, '', item.actionUrl);
          window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
        }

        useNotificationStore.getState().markAsRead(item.id);
        n.close();
      };

      // ── Flash Tab Title if user is currently on another tab ──
      if (canFlash) {
        flashTab(titleText);
      }

      console.log('[SystemNotifications] Spawned desktop notification:', titleText);
    } catch (err) {
      console.error('[SystemNotifications] Notification constructor error:', err);
    }
  }, []);

  // ── Register Callback on Store ───────────────────────────────────────────
  const callbackRef = useRef(sendSystemNotification);
  callbackRef.current = sendSystemNotification;

  useEffect(() => {
    setSystemNotifCallback((item: NotificationItem) => callbackRef.current(item));
    return () => setSystemNotifCallback(null);
  }, [setSystemNotifCallback]);

  // ── Request Permission ───────────────────────────────────────────────────
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission === 'granted') {
        useNotificationStore.getState().setGlobalNotificationsEnabled(true);
      }
      return permission;
    } catch (err) {
      console.error('[SystemNotifications] Permission request error:', err);
      return 'denied';
    }
  }, [setNotifPermission]);

  return {
    permission: notifPermission,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
    requestPermission,
    sendSystemNotification,
  };
}
