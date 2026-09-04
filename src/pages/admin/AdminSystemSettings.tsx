import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings, Shield, ShieldAlert, Cpu, ToggleLeft, ToggleRight,
  Save, Megaphone, CheckCircle2, AlertTriangle, Loader2,
  RefreshCw, Power, Radio, Sliders, Bell, UserPlus, Lock,
  User, Key, Check, LogOut, Mail, Globe, Sparkles
} from 'lucide-react';
import { api } from '../../lib/api';
import { notify } from '../../lib/notify';
import { useAuthStore } from '../../stores/authStore';
import { SkeletonCard } from '../../components/admin/SkeletonLoader';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface ToggleSettingConfig {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  danger?: boolean;
}

const GOVERNANCE_TOGGLES: ToggleSettingConfig[] = [
  {
    key: 'enable_ai_coach',
    label: 'AI Coach & Cognitive Interventions',
    description: 'Autonomous trade evaluations, emotional bias detection, and trader chat coaching.',
    icon: Cpu,
  },
  {
    key: 'enable_broker_sync',
    label: 'Broker Gateway Auto-Sync',
    description: 'Automated order and execution ingestion across Dhan, Zerodha, AngelOne, and Delta Exchange.',
    icon: RefreshCw,
  },
  {
    key: 'enable_user_registration',
    label: 'Public Trader Signups',
    description: 'Allow new traders to self-register. When disabled, access is invite-only.',
    icon: UserPlus,
  },
  {
    key: 'enable_email_alerts',
    label: 'Risk & Drawdown Dispatcher',
    description: 'Automated notification routing when personal trading rules or max drawdown are breached.',
    icon: Bell,
  },
  {
    key: 'maintenance_mode',
    label: 'Platform Maintenance Shield',
    description: 'Restricts trader dashboard access and displays an operational maintenance banner.',
    icon: ShieldAlert,
    danger: true,
  },
];

export default function AdminSystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { profile, updateProfile } = useAuthStore();
  const [adminName, setAdminName] = useState(profile?.fullName || 'System Super Admin');
  const [adminPhone, setAdminPhone] = useState(profile?.phoneNumber || '');
  const [adminSaving, setAdminSaving] = useState(false);

  // Form States
  const [announcementText, setAnnouncementText] = useState('');
  const [fastModel, setFastModel] = useState('llama-3.3-70b-versatile');
  const [deepModel, setDeepModel] = useState('nvidia/nemotron-4-340b-instruct');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ settings: SystemSetting[] }>('/admin/settings');
      setSettings(res.settings);

      const ann = res.settings.find(s => s.key === 'system_announcement');
      if (ann) setAnnouncementText(ann.value);

      const fast = res.settings.find(s => s.key === 'primary_fast_model');
      if (fast) setFastModel(fast.value);

      const deep = res.settings.find(s => s.key === 'primary_deep_model');
      if (deep) setDeepModel(deep.value);

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch platform system settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSettingValue = (key: string, fallback = ''): string => {
    return settings.find(s => s.key === key)?.value ?? fallback;
  };

  const isToggleActive = (key: string): boolean => {
    return getSettingValue(key, 'false') === 'true';
  };

  const handleUpdateSetting = async (key: string, value: string, label = key) => {
    try {
      setSavingKey(key);
      await api.patch('/admin/settings', { key, value });
      setSettings(prev => {
        const exists = prev.some(s => s.key === key);
        if (exists) {
          return prev.map(s => s.key === key ? { ...s, value, updatedAt: new Date().toISOString() } : s);
        }
        return [...prev, { id: 'temp', key, value, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
      });
      notify.success(`Setting updated: ${label}`, `Saved value: ${value || '(empty)'}`);
    } catch (err: any) {
      notify.error(`Failed to update ${label}`, err.message);
    } finally {
      setSavingKey(null);
    }
  };

  const handleToggle = (key: string, label: string) => {
    const current = isToggleActive(key);
    handleUpdateSetting(key, current ? 'false' : 'true', label);
  };

  const isMaintenanceActive = isToggleActive('maintenance_mode');

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAdminSaving(true);
      const res = await updateProfile({
        fullName: adminName,
        phoneNumber: adminPhone,
      });
      if (res.error) throw new Error(res.error);
      notify.success('Super Admin Profile Updated', 'Administrative identity changes saved successfully.');
    } catch (err: any) {
      notify.error('Failed to update admin profile', err.message);
    } finally {
      setAdminSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary/60 mb-1">
            <Link to="/app/admin" className="hover:text-primary transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <Link to="/app/admin" className="hover:text-primary transition-colors text-secondary">Admin</Link>
            <span>&gt;</span>
            <span className="text-primary font-medium">Settings</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-indigo-400" />
            Platform Governance & System Settings
          </h1>
          <p className="text-xs md:text-sm text-secondary">
            Global feature flags, AI engine parameters, system announcements, and operational posture
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
            isMaintenanceActive
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-surface-1 border-border text-secondary'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isMaintenanceActive ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`}></span>
            <span>{isMaintenanceActive ? 'Maintenance Mode Active' : 'Normal Operations'}</span>
          </div>

          <button
            onClick={() => fetchSettings()}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-surface-1 hover:bg-surface-2 border border-border text-primary rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-secondary" />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Operational Maintenance Warning Banner */}
      {isMaintenanceActive && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-rose-200">Emergency Maintenance Shield is Active</h3>
            <p className="mt-0.5 text-rose-300/90">
              Traders accessing the platform will see an operational maintenance notice. Only Super Admins can currently navigate the platform.
            </p>
          </div>
        </div>
      )}

      {/* Section 1: Core Platform Governance Toggles */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          Core Platform Feature Flags
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GOVERNANCE_TOGGLES.map((t) => {
            const active = isToggleActive(t.key);
            const isSaving = savingKey === t.key;
            const Icon = t.icon;

            return (
              <div
                key={t.key}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  active
                    ? t.danger
                      ? 'bg-rose-500/5 border-rose-500/30'
                      : 'bg-surface/80 border-indigo-500/30'
                    : 'bg-surface/50 border-border opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    active
                      ? t.danger ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'
                      : 'bg-surface-1 text-secondary'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-primary">{t.label}</h3>
                      {t.danger && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                          High Impact
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-secondary/80 mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(t.key, t.label)}
                  disabled={isSaving}
                  className={`shrink-0 p-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                    active
                      ? t.danger
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-surface-1 border-border text-secondary hover:text-primary'
                  }`}
                  title={active ? 'Disable' : 'Enable'}
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : active ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: AI Multi-Model Parameters & Architecture */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          AI Engine Provider Routing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fast Model Card */}
          <div className="p-4 rounded-xl bg-surface/70 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Fast Engine</span>
                <h3 className="text-xs font-bold text-primary">Conversational Chat & Low-Latency Scoring</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active Provider
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-secondary block font-medium">Model Designation</label>
              <select
                value={fastModel}
                onChange={(e) => {
                  setFastModel(e.target.value);
                  handleUpdateSetting('primary_fast_model', e.target.value, 'Primary Fast Model');
                }}
                className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-indigo-500"
              >
                <option value="llama-3.3-70b-versatile">Groq LLaMA 3.3 70B Versatile (Default)</option>
                <option value="llama-3.1-8b-instant">Groq LLaMA 3.1 8B Instant (Ultra-Fast)</option>
                <option value="mixtral-8x7b-32768">Groq Mixtral 8x7B (32k Context)</option>
              </select>
            </div>
            <p className="text-[11px] text-secondary/60">
              Powers low-latency user chat Q&A, discipline rule checks, and quick trade classification.
            </p>
          </div>

          {/* Deep Model Card */}
          <div className="p-4 rounded-xl bg-surface/70 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Analytical Engine</span>
                <h3 className="text-xs font-bold text-primary">Deep Reasoning & Psychological Patterns</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active Provider
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-secondary block font-medium">Model Designation</label>
              <select
                value={deepModel}
                onChange={(e) => {
                  setDeepModel(e.target.value);
                  handleUpdateSetting('primary_deep_model', e.target.value, 'Primary Deep Model');
                }}
                className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-indigo-500"
              >
                <option value="nvidia/nemotron-4-340b-instruct">NVIDIA Nemotron 4 340B (Default)</option>
                <option value="minimax-abab6.5s">MiniMax Abab 6.5s (Deep Reasoning)</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Institutional)</option>
              </select>
            </div>
            <p className="text-[11px] text-secondary/60">
              Powers end-of-day journal synthesis, revenge trading detection, and multi-week trader reflections.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Platform System Announcement */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
          Global Platform Announcement Broadcast
        </h2>

        <div className="p-4 rounded-xl bg-surface/70 border border-border space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-secondary block font-medium">Broadcast Message</label>
            <textarea
              rows={3}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. Scheduled broker gateway maintenance this Saturday 11:00 PM IST..."
              className="w-full bg-surface-1 border border-border rounded-lg p-3 text-xs text-primary placeholder-secondary/50 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          {/* Live Preview */}
          {announcementText.trim() && (
            <div className="space-y-1">
              <span className="text-[10px] text-secondary/70 uppercase tracking-wider font-semibold block">Live Trader View Preview</span>
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2.5">
                <Megaphone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-medium">{announcementText}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-[11px] text-secondary/60">
              Leave blank to disable platform announcement banner.
            </span>
            <button
              onClick={() => handleUpdateSetting('system_announcement', announcementText.trim(), 'Platform Announcement')}
              disabled={savingKey === 'system_announcement'}
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {savingKey === 'system_announcement' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Publish Broadcast</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Super Admin Identity & Platform Security */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-rose-400" />
          Super Admin Profile & Security Authority
        </h2>

        <div className="p-4 rounded-xl bg-surface/70 border border-border">
          <form onSubmit={handleSaveAdminProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-secondary block font-medium">Administrative Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-rose-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-secondary block font-medium">Admin Master Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full bg-surface-1/50 border border-border/50 rounded-lg px-3 py-2 text-xs text-secondary/70 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-secondary block font-medium">Emergency Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-xs text-primary focus:outline-none focus:border-rose-500/50"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-[11px] text-secondary/70">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>Active Authority: <strong>SUPER_ADMIN</strong> (Unrestricted Platform Governance)</span>
              </div>

              <button
                type="submit"
                disabled={adminSaving}
                className="flex items-center gap-2 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {adminSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
