import { create } from 'zustand';

function applyTheme(theme: UIState['theme']) {
  if (typeof document === 'undefined') return;
  const dark = theme === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#0F172A' : '#F8FAFC');
}

interface UIState {
  sidebarOpen: boolean; // Mobile drawer
  desktopSidebarExpanded: boolean; // Desktop width toggle
  theme: 'dark' | 'light';
  betaModalOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setDesktopSidebarExpanded: (isExpanded: boolean) => void;
  toggleDesktopSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setBetaModalOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => {
  const storage = typeof window === 'undefined' ? undefined : window.localStorage;
  const savedTheme = storage?.getItem('tv-theme') === 'dark' ? 'dark' : 'light';
  const savedSidebar = storage?.getItem('tv-sidebar-expanded') ?? null;
  const initialSidebarExpanded = savedSidebar !== null ? savedSidebar === 'true' : true;

  applyTheme(savedTheme);

  return {
    sidebarOpen: false, // hidden on mobile by default
    desktopSidebarExpanded: initialSidebarExpanded,
    theme: savedTheme,
    betaModalOpen: false,
    setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setDesktopSidebarExpanded: (isExpanded) => {
      localStorage.setItem('tv-sidebar-expanded', String(isExpanded));
      set({ desktopSidebarExpanded: isExpanded });
    },
    toggleDesktopSidebar: () => set((state) => {
      const newVal = !state.desktopSidebarExpanded;
      localStorage.setItem('tv-sidebar-expanded', String(newVal));
      return { desktopSidebarExpanded: newVal };
    }),
    setTheme: (theme) => {
      localStorage.setItem('tv-theme', theme);
      applyTheme(theme);
      set({ theme });
    },
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('tv-theme', newTheme);
        applyTheme(newTheme);
        return { theme: newTheme };
      }),
    setBetaModalOpen: (isOpen) => set({ betaModalOpen: isOpen }),
  };
});
