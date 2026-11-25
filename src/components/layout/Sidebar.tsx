import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, LayoutDashboard, BarChart3, BookOpen, Brain,
  Target, Settings, Shield, ScrollText, Globe, Zap,
  ChevronLeft, ChevronRight, X, Search, Bell, Handshake
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { NotificationPanel } from '../notifications';
import { cn } from '../../lib/cn';
import * as Tooltip from '@radix-ui/react-tooltip';
import UserProfileDropdown from './UserProfileDropdown';
import { prefetchRoute } from '../../lib/prefetch';
import { Logo } from '../ui/Logo';
import { CMD_KEY } from '../../lib/osUtils';

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

/** One easing and one duration for everything that moves, so the sidebar, labels and page margin stay in step. */
const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]';

/**
 * Icons sit at a fixed x position (12px gutter + 13px padding + 9px half icon = 34px, the centre of the 68px rail),
 * so collapsing only fades the labels. Nothing slides, jumps or reflows.
 */
const rowBase =
  'group relative flex h-9 w-full items-center gap-3 rounded-lg px-[13px] text-left text-[13px] font-medium outline-none ' +
  'transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent';

function Label({ expanded, children, className }: { expanded: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden={!expanded}
      className={cn(
        'min-w-0 flex-1 truncate transition-opacity duration-200',
        expanded ? 'opacity-100 delay-75' : 'pointer-events-none opacity-0',
        className
      )}
    >
      {children}
    </span>
  );
}

function RailTip({ expanded, label, children }: { expanded: boolean; label: React.ReactNode; children: React.ReactElement }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      {!expanded && (
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={12}
            className="animate-in z-50 flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-primary shadow-floating"
          >
            {label}
          </Tooltip.Content>
        </Tooltip.Portal>
      )}
    </Tooltip.Root>
  );
}

function SidebarBody({ expanded, onSearch, onNavigate, onClose, mobile }: {
  expanded: boolean;
  onSearch: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
  mobile?: boolean;
}) {
  const location = useLocation();
  const { profile } = useAuthStore();
  const { notifications, setPanelOpen } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navGroups: NavGroup[] = React.useMemo(() => {
    if (profile?.role === 'SUPER_ADMIN') {
      return [
        { label: 'Admin Portal', items: [{ name: 'Admin Dashboard', path: '/app/admin', icon: Shield }] },
        { label: 'System', items: [{ name: 'Settings', path: '/app/settings', icon: Settings }] },
      ];
    }

    const groups: NavGroup[] = [
      {
        label: 'Workspace',
        items: [
          { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
          { name: 'Market & news', path: '/app/markets', icon: Globe },
          { name: 'Flow', path: '/app/flow', icon: Zap },
          { name: 'Lunar AI', path: '/app/ai-coach', icon: Brain },
        ],
      },
      {
        label: 'Trading journal',
        items: [
          { name: 'Trades', path: '/app/trades', icon: BarChart3 },
          { name: 'Analytics', path: '/app/analytics', icon: TrendingUp },
          { name: 'Journal', path: '/app/journal', icon: BookOpen },
          { name: 'Strategies', path: '/app/strategies', icon: Target },
          { name: 'Goals', path: '/app/goals', icon: Shield },
          { name: 'Knowledge vault', path: '/app/vault', icon: ScrollText },
        ],
      },
      {
        label: 'Account',
        items: [
          { name: 'Referrals', path: '/app/affiliate', icon: Handshake },
          { name: 'Settings', path: '/app/settings', icon: Settings },
        ],
      },
    ];

    if (profile?.role === 'ADMIN' || profile?.role === 'SUB_ADMIN') {
      groups.push({ label: 'Admin', items: [{ name: 'Admin Panel', path: '/app/admin', icon: Shield }] });
    }
    return groups;
  }, [profile?.role]);

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/app' && location.pathname.startsWith(path));

  return (
    <div className="flex h-full flex-col overflow-hidden border-r border-border bg-surface">
      {/* Brand */}
      <div className="flex h-[68px] shrink-0 items-center px-3">
        <Link to="/app" onClick={onNavigate} aria-label="RiskRule dashboard" className="flex h-9 min-w-0 items-center gap-2.5 rounded-lg px-[10px] outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <Logo variant="icon" size="md" />
          <span
            aria-hidden={!expanded}
            className={cn(
              'overflow-hidden whitespace-nowrap font-display text-xl font-bold leading-none tracking-tight text-primary transition-[max-width,opacity] duration-300',
              EASE,
              expanded ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'
            )}
          >
            Risk<span className="riskrule-wordmark-rule">Rule</span>
          </span>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-tertiary transition-colors hover:bg-surface-2 hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search and notifications */}
      <div className="shrink-0 space-y-1 px-3 pb-3">
        <RailTip expanded={expanded} label={<>Search <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">{CMD_KEY} K</kbd></>}>
          <button
            onClick={() => { onNavigate?.(); onSearch(); }}
            aria-label="Search workspace"
            className={cn(rowBase, 'border border-border bg-surface-1 text-tertiary hover:bg-surface-2 hover:text-secondary')}
          >
            <Search className="h-[18px] w-[18px] shrink-0" />
            <Label expanded={expanded} className="font-normal">Search workspace</Label>
            <kbd
              aria-hidden="true"
              className={cn(
                'rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-tertiary transition-opacity duration-200',
                expanded ? 'opacity-100 delay-75' : 'pointer-events-none absolute right-2 opacity-0'
              )}
            >
              {CMD_KEY} K
            </kbd>
          </button>
        </RailTip>

        <RailTip expanded={expanded} label={`Notifications${unreadCount ? ` (${unreadCount})` : ''}`}>
          <button
            onClick={() => { onNavigate?.(); setPanelOpen(true); }}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            className={cn(rowBase, 'text-secondary hover:bg-surface-1 hover:text-primary')}
          >
            <span className="relative shrink-0">
              <Bell className="h-[18px] w-[18px] text-tertiary transition-colors group-hover:text-primary" />
              {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-surface bg-accent" aria-hidden="true" />}
            </span>
            <Label expanded={expanded}>Notifications</Label>
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  'rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-inverse transition-opacity duration-200',
                  expanded ? 'opacity-100' : 'pointer-events-none absolute right-2 opacity-0'
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </RailTip>
      </div>

      {/* Navigation */}
      <nav aria-label="Workspace" className="scrollbar-none min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4">
        {navGroups.map(group => (
          <div key={group.label} className="mb-1">
            {/* Heading and divider share one 28px slot, so the list never shifts when the label fades. */}
            <div className="relative flex h-7 items-center px-[13px]" aria-hidden={!expanded}>
              <p className={cn('text-[11px] font-semibold text-tertiary transition-opacity duration-200', expanded ? 'opacity-100 delay-75' : 'opacity-0')}>
                {group.label}
              </p>
              <span className={cn('absolute inset-x-[13px] top-1/2 h-px bg-border transition-opacity duration-200', expanded ? 'opacity-0' : 'opacity-100')} />
            </div>

            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <RailTip expanded={expanded} label={item.name}>
                      <Link
                        to={item.path}
                        aria-label={item.name}
                        aria-current={active ? 'page' : undefined}
                        onMouseEnter={() => prefetchRoute(item.path)}
                        onFocus={() => prefetchRoute(item.path)}
                        onClick={onNavigate}
                        className={cn(rowBase, active ? 'bg-accent/10 text-accent' : 'text-secondary hover:bg-surface-1 hover:text-primary')}
                      >
                        {active && (
                          <motion.span
                            layoutId={mobile ? 'sidebar-active-mobile' : 'sidebar-active-desktop'}
                            className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-accent"
                            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                          />
                        )}
                        <item.icon className={cn('h-[18px] w-[18px] shrink-0 transition-colors', active ? 'text-accent' : 'text-tertiary group-hover:text-primary')} />
                        <Label expanded={expanded}>{item.name}</Label>
                        {item.badge && expanded && (
                          <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wider text-inverse">{item.badge}</span>
                        )}
                      </Link>
                    </RailTip>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div className="flex h-[60px] shrink-0 items-center gap-3 border-t border-border pl-[18px] pr-3">
        <UserProfileDropdown collapsed={!expanded} />
        <div
          aria-hidden={!expanded}
          className={cn('min-w-0 flex-1 transition-opacity duration-200', expanded ? 'opacity-100 delay-75' : 'pointer-events-none opacity-0')}
        >
          <p className="truncate text-[13px] font-semibold leading-4 text-primary">{profile?.fullName || 'Trader'}</p>
          <p className="truncate text-[11px] leading-4 text-tertiary">{profile?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ onSearch }: { onSearch: () => void }) {
  const location = useLocation();
  const { profile } = useAuthStore();
  const { fetchNotifications, initializeSSE } = useNotificationStore();
  const { sidebarOpen, setSidebarOpen, desktopSidebarExpanded, toggleDesktopSidebar } = useUIStore();

  // Close the mobile drawer when the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    if (profile) {
      fetchNotifications();
      initializeSSE();
    }
  }, [profile, fetchNotifications, initializeSSE]);

  return (
    <>
      <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
        {/* Desktop rail */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 lg:block',
            EASE,
            desktopSidebarExpanded ? 'w-[240px]' : 'w-[68px]'
          )}
        >
          <SidebarBody expanded={desktopSidebarExpanded} onSearch={onSearch} />
          <button
            onClick={toggleDesktopSidebar}
            aria-label={desktopSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={desktopSidebarExpanded}
            className="absolute -right-3 top-[22px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-tertiary shadow-xs outline-none transition-colors hover:bg-surface-2 hover:text-primary focus-visible:ring-2 focus-visible:ring-accent"
          >
            {desktopSidebarExpanded ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation"
              >
                <SidebarBody expanded mobile onSearch={onSearch} onNavigate={() => setSidebarOpen(false)} onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Tooltip.Provider>
      <NotificationPanel />
    </>
  );
}
