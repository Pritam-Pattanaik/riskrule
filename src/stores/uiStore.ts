import { create } from 'zustand';
import {
  APPEARANCE_STORAGE_KEY, SYSTEM_COLOR_QUERY, getWorkspacePalette, isWorkspacePath,
  readWorkspaceAppearance, workspaceCssTokens, type WorkspaceAppearance,
} from '../lib/workspaceAppearance';

function readPreference(key: string) {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePreference(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function applyTheme(theme: UIState['theme'], palette?: ReturnType<typeof getWorkspacePalette>) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.toggleAttribute('data-workspace-appearance', Boolean(palette));
  if (palette) {
    for (const [name, value] of Object.entries(workspaceCssTokens(palette))) root.style.setProperty(name, value);
  }
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', palette?.canvas ?? (theme === 'dark' ? '#0F172A' : '#F8FAFC'));
}

interface UIState {
  sidebarOpen: boolean; // Mobile drawer
  desktopSidebarExpanded: boolean; // Desktop width toggle
  theme: 'dark' | 'light';
  appearance: WorkspaceAppearance;
  systemDark: boolean;
  betaModalOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setDesktopSidebarExpanded: (isExpanded: boolean) => void;
  toggleDesktopSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  saveAppearance: (appearance: WorkspaceAppearance) => boolean;
  syncThemePath: (path: string) => void;
  syncSystemTheme: (dark: boolean) => void;
  setBetaModalOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => {
  let legacyTheme: UIState['theme'] = readPreference('tv-theme') === 'dark' ? 'dark' : 'light';
  let workspaceActive = typeof window !== 'undefined' && isWorkspacePath(window.location.pathname);
  const savedSidebar = readPreference('tv-sidebar-expanded');
  const initialSidebarExpanded = savedSidebar !== null ? savedSidebar === 'true' : true;
  const appearance = readWorkspaceAppearance(readPreference(APPEARANCE_STORAGE_KEY), legacyTheme);
  const systemDark = typeof window !== 'undefined' && (window.matchMedia?.(SYSTEM_COLOR_QUERY).matches ?? false);

  function reconcile(appearance: WorkspaceAppearance, systemDark: boolean) {
    const palette = workspaceActive ? getWorkspacePalette(appearance, systemDark) : undefined;
    const mode = palette?.mode ?? legacyTheme;
    applyTheme(mode, palette);
    return mode;
  }

  return {
    sidebarOpen: false, // hidden on mobile by default
    desktopSidebarExpanded: initialSidebarExpanded,
    theme: reconcile(appearance, systemDark),
    appearance,
    systemDark,
    betaModalOpen: false,
    setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setDesktopSidebarExpanded: (isExpanded) => {
      writePreference('tv-sidebar-expanded', String(isExpanded));
      set({ desktopSidebarExpanded: isExpanded });
    },
    toggleDesktopSidebar: () => set((state) => {
      const newVal = !state.desktopSidebarExpanded;
      writePreference('tv-sidebar-expanded', String(newVal));
      return { desktopSidebarExpanded: newVal };
    }),
    setTheme: (theme) => {
      const { appearance, systemDark, saveAppearance } = get();
      if (workspaceActive) {
        saveAppearance({ ...appearance, theme });
      } else {
        legacyTheme = theme;
        writePreference('tv-theme', theme);
        set({ theme: reconcile(appearance, systemDark) });
      }
    },
    toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
    saveAppearance: (appearance) => {
      const persisted = writePreference(APPEARANCE_STORAGE_KEY, JSON.stringify(appearance));
      set({ appearance, theme: reconcile(appearance, get().systemDark) });
      return persisted;
    },
    syncThemePath: (path) => {
      const next = isWorkspacePath(path);
      if (next === workspaceActive) return;
      workspaceActive = next;
      const { appearance, systemDark } = get();
      set({ theme: reconcile(appearance, systemDark) });
    },
    syncSystemTheme: (systemDark) => {
      const { appearance, systemDark: previous, theme } = get();
      if (previous === systemDark) return;
      set({ systemDark, theme: workspaceActive && appearance.theme === 'system' ? reconcile(appearance, systemDark) : theme });
    },
    setBetaModalOpen: (isOpen) => set({ betaModalOpen: isOpen }),
  };
});
