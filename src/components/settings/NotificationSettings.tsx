import React, { useState } from 'react';
import {
  Bell, Globe, Volume2, VolumeX, AlertTriangle, Info,
  Target, TrendingDown, Activity, Brain, FileText,
  CheckCircle2, XCircle, HelpCircle, Play, Sparkles,
  Send, Radio, Clock, ShieldAlert, ArrowUpRight,
  Sliders, Layers, Eye
} from 'lucide-react';
import { useNotificationStore, NotificationCategory, NotificationPriority } from '../../stores/notificationStore';
import { useSystemNotifications } from '../../hooks/useSystemNotifications';
import { useNotificationSound } from '../../hooks/useNotificationSound';
import { useVoiceStore } from '../../stores/voiceStore';
import { api } from '../../lib/api';
import { notify } from '../../lib/notify';
import { cn } from '../../lib/cn';

// ─── Category Configuration ─────────────────────────────────────────────────
interface CategoryRow {
  category: NotificationCategory;
  label: string;
  icon: React.ElementType;
  description: string;
  defaultGlobal: boolean;
}

const CATEGORY_ROWS: CategoryRow[] = [
  {
    category: 'Risk',
    label: 'Risk Alerts',
    icon: TrendingDown,
    description: 'Max loss breaches, kill-switch triggers, and margin warnings',
    defaultGlobal: true,
  },
  {
    category: 'Trading',
    label: 'Trade Alerts',
    icon: Target,
    description: 'Entry/exit confirmations, order failures, and sync issues',
    defaultGlobal: true,
  },
  {
    category: 'Market',
    label: 'Market Alerts',
    icon: Activity,
    description: 'Significant price moves, PCR shifts, and volatility spikes',
    defaultGlobal: true,
  },
  {
    category: 'AI',
    label: 'AI Coach Insights',
    icon: Brain,
    description: 'Behavioral warnings, discipline patterns, and trading suggestions',
    defaultGlobal: true,
  },
  {
    category: 'Reports',
    label: 'Reports & Digests',
    icon: FileText,
    description: 'Weekly reviews, monthly reflections, and analytics summaries',
    defaultGlobal: true,
  },
];

// ─── Priority Configuration ─────────────────────────────────────────────────
interface PriorityRow {
  priority: NotificationPriority;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const PRIORITY_ROWS: PriorityRow[] = [
  {
    priority: 'Critical',
    label: 'Critical Alerts',
    icon: AlertTriangle,
    description: 'Risk breaches, margin shortfall, execution failures',
    color: 'text-danger bg-danger/10 border-danger/25',
  },
  {
    priority: 'Warning',
    label: 'Warning Alerts',
    icon: ShieldAlert,
    description: 'Revenge trading patterns, volatility spikes, unusual OI',
    color: 'text-warning bg-warning/10 border-warning/25',
  },
  {
    priority: 'Success',
    label: 'Success Confirmations',
    icon: CheckCircle2,
    description: 'Broker ledger ingestion, trade sync, target achievements',
    color: 'text-success bg-success/10 border-success/25',
  },
  {
    priority: 'Information',
    label: 'Information & Insights',
    icon: Info,
    description: 'Weekly reviews, monthly reflections, coach recommendations',
    color: 'text-info bg-info/10 border-info/25',
  },
];

// ─── Test Simulation Presets ────────────────────────────────────────────────
interface TestPreset {
  id: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  description: string;
  icon: React.ElementType;
  scopeBadge: string;
  color: string;
  actionUrl: string;
}

const TEST_PRESETS: TestPreset[] = [
  {
    id: 'risk-critical',
    category: 'Risk',
    priority: 'Critical',
    title: '🚨 Max Daily Loss Barrier Exceeded',
    description: 'Daily drawdown reached -₹3,250 against your ₹3,000 threshold. Prop kill-switch suggested.',
    icon: TrendingDown,
    scopeBadge: 'Global OS + In-App',
    color: 'text-danger border-danger/30 bg-danger/10',
    actionUrl: '/app/analytics',
  },
  {
    id: 'ai-warning',
    category: 'AI',
    priority: 'Warning',
    title: '🧠 AI Suggestion: Revenge Trading Detected',
    description: 'Lunar AI noticed 3 rapid consecutive losses with 2x escalated position sizing on NIFTY.',
    icon: Brain,
    scopeBadge: 'Global OS + In-App',
    color: 'text-warning border-warning/30 bg-warning/10',
    actionUrl: '/app/ai-coach',
  },
  {
    id: 'trade-critical',
    category: 'Trading',
    priority: 'Critical',
    title: '⚡ Broker Order Rejected: Insufficient Margin',
    description: 'Broker execution failed for BANKNIFTY 52000 CE. Required margin: ₹48,000.',
    icon: Target,
    scopeBadge: 'Global OS + In-App',
    color: 'text-danger border-danger/30 bg-danger/10',
    actionUrl: '/app/trades',
  },
  {
    id: 'market-warning',
    category: 'Market',
    priority: 'Warning',
    title: '📈 Flow Alert: Heavy Call Unwinding',
    description: 'Sudden call unwinding detected at 24500 strike (-38.2L OI) ahead of weekly expiry.',
    icon: Activity,
    scopeBadge: 'Global OS + In-App',
    color: 'text-info border-info/30 bg-info/10',
    actionUrl: '/app/flow',
  },
  {
    id: 'report-info',
    category: 'Reports',
    priority: 'Information',
    title: '📊 Weekly Performance Review Ready',
    description: 'Your weekly trading discipline scorecard and PnL breakdown for Week 34 is generated.',
    icon: FileText,
    scopeBadge: 'Global OS + In-App',
    color: 'text-secondary border-border bg-surface-2',
    actionUrl: '/app/journal',
  },
  {
    id: 'trade-success',
    category: 'Trading',
    priority: 'Success',
    title: '✅ Automated Broker Ledger Synchronized',
    description: 'Successfully ingested 14 trade executions from Zerodha Kite with 0 discrepancies.',
    icon: CheckCircle2,
    scopeBadge: 'Global OS + In-App',
    color: 'text-success border-success/30 bg-success/10',
    actionUrl: '/app/trades',
  },
];

// ─── Permission Status Badge ─────────────────────────────────────────────────
function PermissionBadge({ permission }: { permission: NotificationPermission }) {
  switch (permission) {
    case 'granted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 border border-success/30 text-success text-[11px] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Granted
        </span>
      );
    case 'denied':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/15 border border-danger/30 text-danger text-[11px] font-bold">
          <XCircle className="w-3.5 h-3.5" /> Blocked
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/15 border border-warning/30 text-warning text-[11px] font-bold">
          <HelpCircle className="w-3.5 h-3.5" /> Not Asked
        </span>
      );
  }
}

// ─── Pixel-Perfect Toggle Switch Component ──────────────────────────────────
function ToggleSwitch({
  enabled,
  onToggle,
  disabled = false,
  size = 'md',
}: {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}) {
  const isSm = size === 'sm';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-all duration-200 ease-out focus:outline-none select-none',
        isSm ? 'w-10 h-6 p-0.5' : 'w-12 h-7 p-1',
        enabled
          ? 'bg-iris border border-iris shadow-[0_0_14px_rgba(99,102,241,0.45)]'
          : 'bg-surface-3 hover:bg-surface-4 border border-border hover:border-border-hover',
        disabled && 'opacity-35 cursor-not-allowed pointer-events-none'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-out',
          'w-5 h-5',
          enabled
            ? (isSm ? 'translate-x-4' : 'translate-x-5')
            : 'translate-x-0'
        )}
      />
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function NotificationSettings() {
  const {
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    globalNotificationsEnabled,
    setGlobalNotificationsEnabled,
    categoryGlobalOverrides,
    setCategoryGlobalOverride,
    priorityGlobalOverrides,
    setPriorityGlobalOverride,
    flashTabTitle,
    setFlashTabTitle,
  } = useNotificationStore();

  const { permission, isSupported, requestPermission, sendSystemNotification } = useSystemNotifications();
  const { playSound } = useNotificationSound();

  const [activeCountdowns, setActiveCountdowns] = useState<Record<string, number>>({});

  const isCategoryEnabled = (cat: NotificationCategory, defaultGlobal: boolean): boolean => {
    const override = categoryGlobalOverrides[cat];
    if (override !== undefined) return override;
    return defaultGlobal;
  };

  const isPriorityEnabled = (priority: NotificationPriority): boolean => {
    const override = priorityGlobalOverrides[priority];
    if (override !== undefined) return override;
    return true; // Default all priorities to enabled
  };

  const dispatchTestAlert = async (preset: TestPreset) => {
    if (activeCountdowns[preset.id] !== undefined) return;

    if ('Notification' in window && Notification.permission !== 'granted') {
      const p = await requestPermission();
      if (p !== 'granted') {
        notify.warning('Browser notification permission is required for Desktop OS alerts.');
        return;
      }
    }

    notify.info(`⏱️ 5-second countdown started for ${preset.title}! Switch tabs or minimize now.`);
    
    let secondsLeft = 5;
    setActiveCountdowns((prev) => ({ ...prev, [preset.id]: 5 }));

    const interval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        clearInterval(interval);
        setActiveCountdowns((prev) => {
          const next = { ...prev };
          delete next[preset.id];
          return next;
        });

        // 1. Play audio chime
        playSound(preset.priority);

        // 2. Speak alert if voice AI engine is enabled
        try {
          useVoiceStore.getState().speakNotification(preset.title, preset.description);
        } catch (vErr) {
          console.warn('[NotificationTest] Voice speak error:', vErr);
        }

        // 3. Direct desktop OS notification
        sendSystemNotification({
          id: 'test-' + Date.now(),
          title: preset.title,
          description: preset.description,
          category: preset.category,
          priority: preset.priority,
          displayScope: 'both',
          timestamp: Date.now(),
          isRead: false,
          actionLabel: 'View Details',
          actionUrl: preset.actionUrl,
        });

        // 3. Dispatch to backend for database persistence and SSE stream broadcast
        api.post('/notifications/test', {
          category: preset.category,
          priority: preset.priority,
          title: preset.title,
          description: preset.description,
          displayScope: 'both',
          actionLabel: 'View Details',
          actionUrl: preset.actionUrl,
        }).catch((err) => {
          console.error('[NotificationTest] Backend emission error:', err);
        });

        notify.success(`Simulated ${preset.priority} alert emitted!`);
      } else {
        setActiveCountdowns((prev) => ({ ...prev, [preset.id]: secondsLeft }));
      }
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── Section A: In-App Sound Settings ──────────────────────────── */}
      <div className="card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-iris/15 text-iris border border-iris/25 flex items-center justify-center shrink-0 shadow-sm">
              <Volume2 size={22} />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-primary">
                In-App Notification Audio & Chimes
              </h4>
              <p className="text-xs text-tertiary mt-0.5">
                Real-time synthesized acoustic feedback when alerts and trades execute.
              </p>
            </div>
          </div>
          <ToggleSwitch enabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
        </div>

        {soundEnabled && (
          <div className="space-y-5 pt-1">
            {/* Volume Slider */}
            <div className="space-y-3 p-4 rounded-2xl bg-surface-1 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                    Alert Volume Level
                  </label>
                  {soundVolume >= 0.8 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-iris/15 text-iris border border-iris/25">
                      MAX CLARITY
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-primary tabular-nums px-2 py-0.5 rounded-lg bg-surface-2 border border-border/50">
                  {Math.round(soundVolume * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-surface-3 rounded-full appearance-none cursor-pointer accent-iris
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
                           [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-iris [&::-webkit-slider-thumb]:cursor-pointer
                           transition-all"
              />

              {/* Sound Test Buttons */}
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-tertiary font-medium mr-1">Preview chimes:</span>
                <button
                  type="button"
                  onClick={() => playSound('Information')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-surface-2 hover:bg-surface-3 border border-border/60 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-info" /> Info Chime
                </button>
                <button
                  type="button"
                  onClick={() => playSound('Success')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-success bg-success/10 hover:bg-success/20 border border-success/30 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-success" /> Success Chord
                </button>
                <button
                  type="button"
                  onClick={() => playSound('Warning')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-warning bg-warning/10 hover:bg-warning/20 border border-warning/30 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-warning" /> Warning Beep
                </button>
                <button
                  type="button"
                  onClick={() => playSound('Critical')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-danger bg-danger/10 hover:bg-danger/20 border border-danger/30 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-danger" /> Critical Alarm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Section B: System (OS) Notifications & Customization ──────── */}
      <div className="card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-accent/15 text-accent border border-accent/25 flex items-center justify-center shrink-0 shadow-sm">
              <Globe size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h4 className="font-display font-bold text-base text-primary">
                  System Notifications (OS) & Cross-Tab Customization
                </h4>
                <PermissionBadge permission={permission} />
              </div>
              <p className="text-xs text-tertiary mt-0.5">
                Configure how RiskRules alerts reach you when browsing other tabs or apps.
              </p>
            </div>
          </div>
        </div>

        {!isSupported && (
          <div className="p-4 rounded-2xl bg-warning/10 border border-warning/25 text-xs text-warning font-semibold flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            Your browser does not support the Web Notifications API.
          </div>
        )}

        {isSupported && permission === 'denied' && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 space-y-2">
            <div className="flex items-center gap-2 text-danger text-xs font-bold">
              <XCircle className="w-4 h-4" />
              System notifications are blocked by your browser
            </div>
            <p className="text-xs text-tertiary leading-relaxed pl-6">
              To enable: click the lock/settings icon in your browser URL bar → Permissions → Notifications → set to <strong>Allow</strong>.
            </p>
          </div>
        )}

        {isSupported && permission === 'default' && (
          <div className="p-4 rounded-2xl bg-iris/10 border border-iris/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-iris/20 border border-iris/30 text-iris flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Grant Browser Notification Permission</p>
                <p className="text-[11px] text-tertiary mt-0.5">Click to allow RiskRules to send OS alerts when the tab is in the background.</p>
              </div>
            </div>
            <button
              onClick={requestPermission}
              className="px-4 py-2 text-xs font-bold text-white bg-iris hover:bg-iris/90 rounded-xl transition-all shadow-md shrink-0 active:scale-95"
            >
              Request Permission
            </button>
          </div>
        )}

        {/* Master Toggle */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-surface-1 border border-border/50">
          <div className="flex items-center gap-3.5">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
              globalNotificationsEnabled ? "bg-accent/15 border-accent/30 text-accent" : "bg-surface-2 border-border text-tertiary"
            )}>
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Enable Global System Notifications</p>
              <p className="text-xs text-tertiary mt-0.5">
                Master switch — displays native desktop notifications on your operating system when unfocused
              </p>
            </div>
          </div>
          <ToggleSwitch
            enabled={globalNotificationsEnabled}
            onToggle={() => setGlobalNotificationsEnabled(!globalNotificationsEnabled)}
            disabled={!isSupported || permission === 'denied'}
          />
        </div>

        {/* ── Cross-Tab Title Flashing Feature ───────────────────────────── */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-surface-1 border border-border/50">
          <div className="flex items-center gap-3.5">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
              flashTabTitle ? "bg-iris/15 border-iris/30 text-iris" : "bg-surface-2 border-border text-tertiary"
            )}>
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Flash Browser Tab Title on Other Tabs</p>
              <p className="text-xs text-tertiary mt-0.5">
                Alternates tab title with &quot;(1) 🔔 Alert&quot; so you notice new alerts even without looking at desktop banners
              </p>
            </div>
          </div>
          <ToggleSwitch
            enabled={flashTabTitle}
            onToggle={() => setFlashTabTitle(!flashTabTitle)}
          />
        </div>

        {globalNotificationsEnabled && isSupported && permission !== 'denied' && (
          <div className="space-y-6 pt-2">
            {/* ── Priority-Level Routing ───────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-iris" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Priority-Level OS Routing
                  </h5>
                </div>
                <span className="text-[11px] text-tertiary font-medium">
                  Toggle which severity levels trigger OS alerts
                </span>
              </div>

              <div className="rounded-2xl border border-border/60 overflow-hidden divide-y divide-border/40 bg-surface-0 shadow-sm">
                {PRIORITY_ROWS.map((row) => {
                  const Icon = row.icon;
                  const enabled = isPriorityEnabled(row.priority);
                  return (
                    <div
                      key={row.priority}
                      className="flex items-center justify-between px-5 py-3.5 bg-surface-0 hover:bg-surface-1/50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border', row.color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-primary truncate">{row.label}</p>
                          <p className="text-xs text-tertiary truncate">{row.description}</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        size="sm"
                        enabled={enabled}
                        onToggle={() => setPriorityGlobalOverride(row.priority, !enabled)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Category-Level Routing ───────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Category-Level Routing
                  </h5>
                </div>
                <span className="text-[11px] text-tertiary font-medium">
                  Toggle specific categories for desktop alerts
                </span>
              </div>

              <div className="rounded-2xl border border-border/60 overflow-hidden divide-y divide-border/40 bg-surface-0 shadow-sm">
                {CATEGORY_ROWS.map((row) => {
                  const Icon = row.icon;
                  const enabled = isCategoryEnabled(row.category, row.defaultGlobal);
                  return (
                    <div
                      key={row.category}
                      className="flex items-center justify-between px-5 py-3.5 bg-surface-0 hover:bg-surface-1/50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border',
                            enabled
                              ? 'bg-iris/15 border-iris/30 text-iris shadow-xs'
                              : 'bg-surface-1 border-border text-tertiary'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-primary truncate">{row.label}</p>
                          <p className="text-xs text-tertiary truncate">{row.description}</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        size="sm"
                        enabled={enabled}
                        onToggle={() => setCategoryGlobalOverride(row.category, !enabled)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-1/60 border border-border/40 flex items-start gap-2.5 text-xs text-tertiary leading-relaxed">
              <Info className="w-4 h-4 text-iris shrink-0 mt-0.5" />
              <span>
                System notifications display when RiskRules is running in the background or minimized. If you completely close the browser tab, notifications will pause until you return.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ─── Section C: Live End-to-End Simulation & Verification ────────── */}
      <div className="card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-success/15 text-success border border-success/25 flex items-center justify-center shrink-0 shadow-sm">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h4 className="font-display font-bold text-base text-primary">
                  Live Alert Testing & Verification Suite
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-iris/10 border border-iris/20 text-iris text-[10px] font-bold">
                  SSE REAL-TIME
                </span>
              </div>
              <p className="text-xs text-tertiary mt-0.5">
                Click any alert to trigger a 5-second countdown. Switch to another tab to test desktop and tab title notifications!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-iris/10 border border-iris/25 text-iris text-xs font-semibold shrink-0">
            <Clock className="w-4 h-4 text-iris" />
            <span>5s Switch-Tab Delay on all tests</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEST_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const countdown = activeCountdowns[preset.id];
            const isCounting = countdown !== undefined;

            return (
              <div
                key={preset.id}
                className={cn(
                  'p-5 rounded-2xl bg-surface-1 border transition-all flex flex-col justify-between gap-4 shadow-xs',
                  isCounting ? 'border-iris ring-1 ring-iris/40 bg-iris/5' : 'border-border/60 hover:border-border'
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn('p-1.5 rounded-lg border', preset.color)}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold text-primary">{preset.category} • {preset.priority}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-iris/15 text-iris border-iris/25">
                      {preset.scopeBadge}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-primary">{preset.title}</h5>
                    <p className="text-xs text-tertiary leading-relaxed mt-1">{preset.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-tertiary">
                    {isCounting ? (
                      <span className="text-iris font-semibold animate-pulse">Switch tabs now!</span>
                    ) : (
                      <span>5-second delay to switch tabs</span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => dispatchTestAlert(preset)}
                    disabled={isCounting}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs shrink-0',
                      isCounting
                        ? 'bg-iris text-white shadow-md'
                        : 'bg-surface-2 hover:bg-surface-3 border border-border text-primary'
                    )}
                  >
                    {isCounting ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-white animate-spin" />
                        Alert in {countdown}s...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-accent" />
                        Dispatch Live Test
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
