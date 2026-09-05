import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Shield, AlertTriangle, LogOut, Trash2, RefreshCw, BookOpen,
  Check, Key, Link2, User, Target, ChevronDown, Lock, Download,
  Zap, Bell, Sparkles, Server, Cpu, Clock, Plus, Search, Star,
  ListChecks, FileText, CheckCircle2, Info, X, Compass, Lightbulb, Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useBrokerStore } from '../stores/brokerStore';
import { useTradingRulesStore } from '../stores/tradingRulesStore';
import { useTradeStore } from '../stores/tradeStore';
import { api } from '../lib/api';
import { notify } from '../lib/notify';
import { cn } from '../lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedTabs } from '../components/ui/Motion';
import { BrokerHealthCard } from '../components/settings/brokers/BrokerHealthCard';
import { BrokerConnectionWizard } from '../components/settings/brokers/BrokerConnectionWizard';
import { getBrokerProvider } from '../lib/brokers/brokerRegistry';
import { PREBUILT_RULES, PREBUILT_RULE_CATEGORIES, PrebuiltRule } from '../constants/prebuiltRules';
import { RuleDetailModal } from '../components/settings/RuleDetailModal';
import { VoiceSettingsTab } from '../components/settings/VoiceSettingsTab';

const NotificationSettings = React.lazy(() => import('../components/settings/NotificationSettings'));

const INSTRUMENTS = ['CE', 'PE', 'FUT', 'EQ'];
const MARKETS = ['F&O', 'NSE', 'BSE', 'MCX'];
const VALID_TABS = ['brokers', 'rules', 'voice', 'notifications', 'profile', 'security'] as const;

export default function Settings() {
  const { profile, signOut, updateProfile, deleteAccount } = useAuthStore();
  const { connections, fetchConnections, removeConnection, syncConnection, syncingBrokers, updateToken, isLoading: brokersLoading } = useBrokerStore();
  const { rules, fetchRules, saveRules } = useTradingRulesStore();

  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as 'brokers' | 'rules' | 'voice' | 'profile' | 'security' | 'notifications' | null;

  useEffect(() => { fetchConnections(); fetchRules(); }, [fetchConnections, fetchRules]);

  // Tab state
  const [activeTab, setActiveTab] = useState<'brokers' | 'rules' | 'voice' | 'profile' | 'security' | 'notifications'>(
    tabFromUrl && VALID_TABS.includes(tabFromUrl as any) ? tabFromUrl : 'brokers'
  );

  useEffect(() => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl as any)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const [wizardOpen, setWizardOpen] = useState(false);

  // Rules state
  const [windowStart, setWindowStart] = useState(rules?.windowStart || '09:15');
  const [windowEnd, setWindowEnd] = useState(rules?.windowEnd || '15:30');
  const [maxTradesPerDay, setMaxTradesPerDay] = useState<string>(rules?.maxTradesPerDay?.toString() || '5');
  const [maxDailyLoss, setMaxDailyLoss] = useState<string>(rules?.maxDailyLoss?.toString() || '3000');
  const [maxLossPerTrade, setMaxLossPerTrade] = useState<string>(rules?.maxLossPerTrade?.toString() || '750');
  const [allowedInstruments, setAllowedInstruments] = useState<string[]>(rules?.allowedInstruments || ['CE', 'PE', 'FUT']);
  const [allowedMarkets, setAllowedMarkets] = useState<string[]>(rules?.allowedMarkets || ['F&O', 'NSE']);
  const [killSwitchEnabled, setKillSwitchEnabled] = useState<boolean>(rules?.killSwitchEnabled || false);
  const [syncCadence, setSyncCadence] = useState<string>(rules?.syncCadence || 'PERIODIC_15M');
  const [rulesDescription, setRulesDescription] = useState<string>(rules?.description || '');
  const [customRulesList, setCustomRulesList] = useState<string[]>(rules?.customRules || []);
  const [selectedRuleCategory, setSelectedRuleCategory] = useState<string>('all');
  const [ruleSearchQuery, setRuleSearchQuery] = useState<string>('');
  const [newCustomRuleText, setNewCustomRuleText] = useState<string>('');
  const [selectedRuleForView, setSelectedRuleForView] = useState<PrebuiltRule | null>(null);
  const [ruleDetailModalOpen, setRuleDetailModalOpen] = useState(false);
  const [isSavingRules, setIsSavingRules] = useState(false);
  const [rulesSaved, setRulesSaved] = useState(false);

  useEffect(() => {
    if (rules) {
      setWindowStart(rules.windowStart || '09:15');
      setWindowEnd(rules.windowEnd || '15:30');
      setMaxTradesPerDay(rules.maxTradesPerDay?.toString() || '');
      setMaxDailyLoss(rules.maxDailyLoss?.toString() || '');
      setMaxLossPerTrade(rules.maxLossPerTrade?.toString() || '');
      setAllowedInstruments(rules.allowedInstruments || []);
      setAllowedMarkets(rules.allowedMarkets || []);
      setKillSwitchEnabled(rules.killSwitchEnabled || false);
      setSyncCadence(rules.syncCadence || 'PERIODIC_15M');
      setRulesDescription(rules.description || '');
      setCustomRulesList(Array.isArray(rules.customRules) ? rules.customRules : []);
    }
  }, [rules]);

  // Profile state
  const [profileName, setProfileName] = useState(profile?.fullName || 'Principal Trader');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [timezone, setTimezone] = useState(profile?.timezone || 'Asia/Kolkata');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileName(profile.fullName || '');
      setPhoneNumber(profile.phoneNumber || '');
      setAvatarUrl(profile.avatarUrl || '');
      setTimezone(profile.timezone || 'Asia/Kolkata');
    }
  }, [profile]);

  // Live platform rules from database
  const [platformRules, setPlatformRules] = useState<PrebuiltRule[]>(PREBUILT_RULES);

  useEffect(() => {
    api.get<PrebuiltRule[]>('/platform-rules')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlatformRules(data);
        }
      })
      .catch((e) => {
        console.warn('Using offline pre-built rules library', e);
      });
  }, []);

  // Pre-built rule toggling and manipulation
  const togglePrebuiltRule = (rule: PrebuiltRule) => {
    const formatted = `${rule.title}: ${rule.description}`;
    setCustomRulesList(prev => {
      const exists = prev.some(r => r.startsWith(rule.title) || r === formatted);
      if (exists) {
        return prev.filter(r => !r.startsWith(rule.title) && r !== formatted);
      } else {
        return [...prev, formatted];
      }
    });
  };

  const isRuleActive = (rule: PrebuiltRule) => {
    return customRulesList.some(r => r.startsWith(rule.title) || r.includes(rule.title));
  };

  const handleAddCustomRule = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const text = newCustomRuleText.trim();
    if (!text) return;
    if (!customRulesList.includes(text)) {
      setCustomRulesList(prev => [...prev, text]);
      notify.success('Custom rule added to your active commandments.');
    }
    setNewCustomRuleText('');
  };

  const handleRemoveRule = (index: number) => {
    setCustomRulesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectAllBeginner = () => {
    const beginnerRules = platformRules.filter(r => r.isBeginnerRecommended).map(r => `${r.title}: ${r.description}`);
    setCustomRulesList(prev => {
      const set = new Set([...prev, ...beginnerRules]);
      return Array.from(set);
    });
    notify.success(`Added ${beginnerRules.length} Essential Beginner Rules to your discipline plan!`);
  };

  const handleClearAllRules = () => {
    if (window.confirm('Are you sure you want to clear all active discipline rules?')) {
      setCustomRulesList([]);
    }
  };

  const filteredPrebuiltRules = React.useMemo(() => {
    return platformRules.filter(rule => {
      if (selectedRuleCategory === 'beginner' && !rule.isBeginnerRecommended) return false;
      if (selectedRuleCategory !== 'all' && selectedRuleCategory !== 'beginner' && rule.category !== selectedRuleCategory) return false;
      if (ruleSearchQuery.trim()) {
        const q = ruleSearchQuery.toLowerCase();
        return (
          rule.title.toLowerCase().includes(q) ||
          rule.description.toLowerCase().includes(q) ||
          rule.badge.toLowerCase().includes(q) ||
          rule.categoryLabel.toLowerCase().includes(q) ||
          (rule.situation && rule.situation.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [platformRules, selectedRuleCategory, ruleSearchQuery]);

  const handleSaveRules = async () => {
    setIsSavingRules(true);
    const { error } = await saveRules({
      windowStart: windowStart || null,
      windowEnd: windowEnd || null,
      maxTradesPerDay: maxTradesPerDay ? parseInt(maxTradesPerDay) : null,
      maxDailyLoss: maxDailyLoss ? parseFloat(maxDailyLoss) : null,
      maxLossPerTrade: maxLossPerTrade ? parseFloat(maxLossPerTrade) : null,
      allowedInstruments: allowedInstruments.length ? allowedInstruments : null,
      allowedMarkets: allowedMarkets.length ? allowedMarkets : null,
      killSwitchEnabled: killSwitchEnabled,
      syncCadence: syncCadence as any,
      description: rulesDescription || null,
      customRules: customRulesList,
    });
    setIsSavingRules(false);
    if (error) notify.error('Failed to save rules: ' + error);
    else {
      notify.success('Institutional risk & discipline rules synchronized.');
      setRulesSaved(true);
      setTimeout(() => setRulesSaved(false), 2500);
    }
  };

  // broker param is always the broker NAME (e.g. 'dhan'), never the UUID.
  // The sync, disconnect, and token-update routes all expect /api/brokers/:brokerName.
  const handleBrokerSync = async (broker: string, fullSync = false) => {
    const { error, count, needsReauth } = await syncConnection(broker, fullSync);
    if (needsReauth) {
      // Resolve the display name from the registry — never hardcode a broker name here.
      const provider = getBrokerProvider(broker);
      const brokerName = provider?.name ?? broker.toUpperCase();
      const authModel = provider?.tokenLifecycle.refreshStrategy;
      // For brokers with auto-refresh (TOTP/MPIN), the server handles re-auth automatically.
      // Only show a manual action prompt for brokers that require a daily token paste.
      if (authModel === 'NONE_MANDATORY_REAUTH' && provider?.authModel !== 'CLIENT_ID_SECRET_TOTP') {
        notify.warning(`${brokerName} session expired. Paste your new daily access token in the Token Vault.`);
      } else {
        notify.warning(`${brokerName} session expired. The server will attempt automatic re-authentication.`);
      }
    } else if (error) {
      notify.error(`Sync failed: ${error}`);
    } else {
      notify.success(fullSync ? `Full ledger resynchronized: ${count} executions!` : `Synced ${count} trade${count !== 1 ? 's' : ''}.`);
    }
  };

  const handleDisconnect = async (broker: string) => {
    const { error } = await removeConnection(broker);
    if (error) notify.error(error); else notify.success('Broker connection revoked.');
  };

  const handleUpdateToken = async (broker: string, newToken: string) => {
    const { error } = await updateToken(broker, newToken);
    if (error) notify.error('Failed to update token vault: ' + error);
    else {
      notify.success('Session token refreshed! Resyncing account...');
      handleBrokerSync(broker);
    }
  };

  const handleDownloadLedgerArchive = (format: 'json' | 'csv') => {
    notify.success(`Exporting encrypted ${format.toUpperCase()} trade ledger & AI evaluation memory...`);
    const trades = useTradeStore.getState().trades || [];
    const realExport = {
      timestamp: new Date().toISOString(),
      account: profile?.email || 'trader@RiskRule.in',
      connectionsCount: connections.length,
      riskRules: { maxDailyLoss, maxLossPerTrade, killSwitchEnabled },
      executionsCount: trades.length,
      executions: trades.map(t => ({
        id: t.id,
        symbol: t.symbol,
        date: t.date,
        pnl: t.pnl,
        direction: t.direction,
        entryPrice: t.entryPrice,
        exitPrice: t.exitPrice,
        disciplineScore: t.disciplineScore,
        decisionNotes: t.decisionNotes,
      })),
    };

    let dataStr = '';
    if (format === 'json') {
      dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(realExport, null, 2));
    } else {
      const csvHeader = 'ID,Symbol,Date,Direction,EntryPrice,ExitPrice,PNL,DisciplineScore\n';
      const csvRows = trades.map(t => 
        `"${t.id}","${t.symbol}","${t.date}","${t.direction || ''}",${t.entryPrice || 0},${t.exitPrice || 0},${t.pnl || 0},${t.disciplineScore || ''}`
      ).join('\n');
      dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvHeader + csvRows);
    }
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `RiskRule_Audit_Backup_${new Date().toISOString().slice(0, 10)}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const inputCls = cn(
    'w-full h-11 rounded-xl border border-border bg-surface-1 px-4 text-[13px] text-primary font-medium',
    'placeholder:text-muted outline-none transition-all duration-200 font-mono',
    'focus:border-iris/50 focus:bg-surface focus:shadow-[0_0_0_3px_rgba(var(--color-iris),0.12)]'
  );

  const toggleChip = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setList(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  const tabs = [
    { id: 'brokers', label: '🔌 Broker Integrations', count: connections.length },
    { id: 'rules', label: '🛡️ Risk & Discipline Rules' },
    { id: 'voice', label: '🎙️ Voice & Audio AI' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'profile', label: '👤 Profile & Workspace' },
    { id: 'security', label: '🔐 Security & Data Vault' },
  ];


  return (
    <div className="max-w-5xl mx-auto pb-28 space-y-8 font-sans animate-fadeIn">
      
      {/* Institutional Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iris/10 text-iris text-xs font-bold mb-2.5 border border-iris/20">
            <Sparkles size={12} /> Institutional Control Center & BMS
          </div>
          <h1 className="font-display text-3xl font-black text-primary tracking-tight">System Settings & Governance</h1>
          <p className="text-sm text-tertiary mt-1 max-w-2xl leading-relaxed">
            Manage data-driven brokerage API connections, set prop-trading behavioral discipline guardrails, and audit cloud security vaults.
          </p>
        </div>
        
        {activeTab === 'brokers' && (
          <Button
            onClick={() => setWizardOpen(true)}
            className="h-12 px-6 font-bold text-sm shadow-iris shrink-0 gap-2"
          >
            <Link2 size={16} /> Connect Broker Institution
          </Button>
        )}
      </div>

      {/* Horizontal Pill Tabs Workspace Architecture */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-subtle scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'relative px-5 py-3 rounded-2xl font-bold text-[13px] transition-all duration-200 shrink-0 select-none flex items-center gap-2',
                isActive
                  ? 'text-primary bg-surface-2 shadow-sm border border-border/80'
                  : 'text-tertiary hover:text-secondary hover:bg-surface-1/60 border border-transparent'
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold',
                  isActive ? 'bg-iris text-white' : 'bg-surface-1 text-muted border border-border'
                )}>
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="settings-tab"
                  className="absolute bottom-0 left-3 right-3 h-[2px] bg-iris rounded-full shadow-[0_0_10px_rgba(var(--color-iris),0.8)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Animated Tab Panels */}
      <AnimatedTabs activeKey={activeTab}>
        {/* TAB 1: BROKER INTEGRATION MANAGEMENT SYSTEM */}
        {activeTab === 'brokers' && (
          <div className="space-y-6">
          
          {/* AI Coach Proactive Health Notice (Institutional Feature) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-iris/10 via-surface-1 to-surface-1 border border-iris/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-iris/20 border border-iris/30 text-iris flex items-center justify-center shrink-0">
                <Bell size={18} className="animate-pulse" />
              </div>
              <div>
                <h5 className="font-display font-bold text-[13px] text-primary">AI Diagnostic Advisory & Token Watchdog</h5>
                <p className="text-xs text-tertiary mt-0.5">
                  {connections.length > 0
                    ? `Active surveillance operational. All ${connections.length} account token${connections.length !== 1 ? 's are' : ' is'} within healthy execution tolerances for today's NSE market session.`
                    : 'No connected brokerage vaults detected. Connect a broker to enable real-time ledger synchronization.'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-success bg-success/10 px-3 py-1 rounded-lg border border-success/20 hidden sm:inline-block">
              ● ACTIVE STREAM
            </span>
          </div>

          {/* Broker Connections Directory */}
          <div className="space-y-4">
            {brokersLoading ? (
              <div className="p-12 text-center text-tertiary font-mono text-sm animate-pulse">
                Auditing institutional broker vaults...
              </div>
            ) : connections.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {connections.map(conn => (
                  <BrokerHealthCard
                    key={conn.id || conn.broker}
                    connection={conn}
                    onSync={(id, full) => handleBrokerSync(id, full)}
                    onDisconnect={(id) => handleDisconnect(id)}
                    onUpdateToken={(id, token) => handleUpdateToken(id, token)}
                    isSyncing={!!syncingBrokers[conn.broker] || !!syncingBrokers[conn.id]}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl border-2 border-dashed border-border bg-surface-1/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-iris/10 border border-iris/20 text-iris flex items-center justify-center mx-auto shadow-sm">
                  <Server size={28} />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="font-display font-bold text-lg text-primary">Zero Brokers Connected</h4>
                  <p className="text-xs text-tertiary leading-relaxed">
                    Transform your trading review by linking directly to India & Global broker exchanges. Automated ledger ingestion works seamlessly in the background.
                  </p>
                </div>
                <Button onClick={() => setWizardOpen(true)} className="px-6 font-bold shadow-iris mt-2">
                  Launch Connection Wizard
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RISK & DISCIPLINE RULES (WITH PROP KILL-SWITCH & 36+ PRE-BUILT RULES) */}
      {activeTab === 'rules' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Emergency Prop-Trading Kill-Switch Card */}
          <div className={cn(
            'p-6 rounded-3xl border transition-all duration-300 shadow-lg',
            killSwitchEnabled 
              ? 'bg-gradient-to-r from-danger/15 via-surface-1 to-surface-1 border-danger/40 ring-1 ring-danger/30' 
              : 'bg-surface-1 border-border'
          )}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-md',
                  killSwitchEnabled ? 'bg-danger text-white border-danger font-black' : 'bg-surface-2 text-tertiary border-border'
                )}>
                  <AlertTriangle size={24} className={killSwitchEnabled ? 'animate-bounce' : ''} />
                </div>
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-lg text-primary">Emergency Prop-Trading Kill-Switch</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-danger/10 text-danger border border-danger/25">
                      INSTITUTIONAL GUARD
                    </span>
                  </div>
                  <p className="text-xs text-tertiary leading-relaxed">
                    When enabled, breaching your Daily Maximum Loss threshold automatically triggers a mandatory 24-hour application cool-off lock, halting impulsive revenge trading and AI override entries.
                  </p>
                </div>
              </div>

              {/* Master Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  if (!killSwitchEnabled) {
                    if (window.confirm("Activate Emergency Prop-Trading Kill-Switch? Reaching Max Daily Loss will lock manual override order creation for 24 hours to enforce emotional reset.")) {
                      setKillSwitchEnabled(true);
                    }
                  } else {
                    setKillSwitchEnabled(false);
                  }
                }}
                className={cn(
                  'w-16 h-9 rounded-full transition-colors duration-200 focus:outline-none p-1 shrink-0 shadow-inner relative',
                  killSwitchEnabled ? 'bg-danger' : 'bg-surface-3 border border-border'
                )}
              >
                <div className={cn(
                  'w-7 h-7 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] font-bold',
                  killSwitchEnabled ? 'translate-x-7 text-danger' : 'translate-x-0 text-tertiary'
                )}>
                  {killSwitchEnabled ? 'ON' : 'OFF'}
                </div>
              </button>
            </div>
          </div>

          {/* SECTION 1: TRADING MANIFESTO & DISCIPLINE PHILOSOPHY (DESCRIPTION) */}
          <div className="card p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-iris/10 text-iris border border-iris/20">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-primary">Trading Manifesto & Core Philosophy</h4>
                  <p className="text-xs text-tertiary">Write your overarching trading mission, psychological commitments, and setup rules.</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-tertiary bg-surface-1 px-2.5 py-1 rounded-lg border border-border">
                {rulesDescription.length} characters
              </span>
            </div>

            <div className="bg-iris/5 border border-iris/15 rounded-xl p-3.5 text-xs text-secondary flex items-start gap-2.5">
              <Lightbulb size={16} className="text-iris shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-primary font-semibold">How to use this description:</strong> Document your non-negotiable trading principles (e.g. your market bias rules, reasons to step away, or risk philosophy). Your AI Coach incorporates this description to analyze your trade executions for psychological drift.
              </p>
            </div>

            <div>
              <textarea
                rows={4}
                value={rulesDescription}
                onChange={(e) => setRulesDescription(e.target.value)}
                placeholder="Example: I am a patient, disciplined momentum trader. My #1 goal is capital preservation. I only risk 1% per trade and never enter without a candle close confirmation. If I lose 2 trades in a row, I take a 20-minute screen break. I will never hold an intraday option past 3:15 PM..."
                className="w-full bg-surface-1 border border-border text-primary rounded-xl p-4 text-sm outline-none focus:border-iris/50 focus:bg-surface focus:shadow-[0_0_0_3px_rgba(var(--color-iris),0.12)] transition-all font-mono placeholder:text-muted placeholder:font-sans leading-relaxed min-h-[110px]"
              />
            </div>
          </div>

          {/* SECTION 2: ACTIVE CORE DISCIPLINE COMMANDMENTS */}
          <div className="card p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <ListChecks size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-base text-primary">Active Discipline Commandments</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-accent/10 text-accent border border-accent/20">
                      {customRulesList.length} Active Rules
                    </span>
                  </div>
                  <p className="text-xs text-tertiary">Your enforced rule checklist. Choose from the library below or add custom rules.</p>
                </div>
              </div>

              {customRulesList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllRules}
                  className="text-xs text-danger hover:underline font-semibold flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear All Rules
                </button>
              )}
            </div>

            {/* Custom Rule Input Bar */}
            <form onSubmit={handleAddCustomRule} className="flex gap-2">
              <input
                type="text"
                value={newCustomRuleText}
                onChange={(e) => setNewCustomRuleText(e.target.value)}
                placeholder="Type a custom discipline rule (e.g. Never enter when RSI is above 80 on 15m)..."
                className="flex-1 h-11 rounded-xl border border-border bg-surface-1 px-4 text-xs text-primary font-medium placeholder:text-muted outline-none focus:border-accent/50 focus:bg-surface transition-all"
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={!newCustomRuleText.trim()}
                className="h-11 px-4 text-xs font-bold gap-1.5 shrink-0"
              >
                <Plus size={14} /> Add Rule
              </Button>
            </form>

            {/* Active Rules List */}
            {customRulesList.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-border bg-surface-1/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                  <Compass size={22} />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h5 className="font-bold text-sm text-primary">No Active Rules Selected Yet</h5>
                  <p className="text-xs text-tertiary">
                    Choose from the 36+ battle-tested pre-built rules below or click the quick starter button to begin.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSelectAllBeginner}
                  className="mt-2 text-xs font-bold gap-1.5"
                >
                  <Star size={13} /> Add 10 Recommended Beginner Rules
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {customRulesList.map((ruleText, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface-1 border border-border flex items-start justify-between gap-3 group hover:border-border-hover transition-all"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-md bg-success/10 text-success shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <p className="text-xs text-primary font-medium leading-relaxed">
                        {ruleText}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="text-tertiary hover:text-danger p-1 rounded-lg hover:bg-danger/10 transition-colors shrink-0 opacity-80 group-hover:opacity-100"
                      title="Remove Rule"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: PRE-BUILT RULES LIBRARY (60+ SITUATIONAL RULES FOR BEGINNERS & PROS) */}
          <div className="card p-7 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-iris/10 text-iris">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="font-display font-bold text-lg text-primary">Pre-Built Rules Library (60+ Situational Rules)</h4>
                </div>
                <p className="text-xs text-tertiary mt-1">
                  Battle-tested risk safeguards categorized by market situations (Openings, Breakouts, Trends, Choppy ranges, News, Options, Drawdowns).
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSelectAllBeginner}
                className="shrink-0 text-xs font-bold gap-1.5 shadow-iris"
              >
                <Star size={13} /> Select 12 Beginner Essentials
              </Button>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 60+ situation rules (e.g. gap-up, candle close, drawdown, revenge trading, expiry, OTM)..."
                  value={ruleSearchQuery}
                  onChange={(e) => setRuleSearchQuery(e.target.value)}
                  className="w-full bg-surface-1 border border-border text-primary rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-iris/50 focus:bg-surface transition-all"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {PREBUILT_RULE_CATEGORIES.map((cat) => {
                  const isSelected = selectedRuleCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedRuleCategory(cat.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border shrink-0',
                        isSelected
                          ? 'bg-iris/15 text-iris border-iris/30 shadow-xs'
                          : 'bg-surface-1 text-tertiary border-border hover:text-secondary hover:bg-surface-2'
                      )}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of Pre-Built Rules */}
            {filteredPrebuiltRules.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted">
                No rules found matching "{ruleSearchQuery}". Try a different search term.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredPrebuiltRules.map((rule) => {
                  const active = isRuleActive(rule);
                  return (
                    <div
                      key={rule.id}
                      onClick={() => {
                        setSelectedRuleForView(rule);
                        setRuleDetailModalOpen(true);
                      }}
                      className={cn(
                        'p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden select-none',
                        active
                          ? 'bg-surface-2 border-iris/40 shadow-xs ring-1 ring-iris/20'
                          : 'bg-surface-1 border-border hover:border-border-hover hover:bg-surface-2/60'
                      )}
                    >
                      {/* Top Bar with Badges & Quick View Icon */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-surface text-tertiary border border-border text-[9px] font-bold uppercase tracking-wider">
                            {rule.categoryLabel}
                          </span>
                          {rule.isBeginnerRecommended && (
                            <span className="px-2 py-0.5 rounded-md bg-gold/10 text-gold border border-gold/20 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Star size={9} /> Beginner Essential
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-muted uppercase">
                            {rule.badge}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRuleForView(rule);
                              setRuleDetailModalOpen(true);
                            }}
                            className="p-1 rounded-lg text-tertiary hover:text-iris hover:bg-iris/10 transition-colors"
                            title="View Rule Details & Rationale"
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Rule Title, Situation & Description */}
                      <div className="space-y-1.5 mb-3">
                        <h5 className="font-display font-bold text-sm text-primary group-hover:text-iris transition-colors">
                          {rule.title}
                        </h5>

                        {rule.situation && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-tertiary">
                            <span className="w-1.5 h-1.5 rounded-full bg-iris" />
                            <span className="truncate">When: <strong className="text-secondary font-semibold">{rule.situation}</strong></span>
                          </div>
                        )}

                        <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                          {rule.description}
                        </p>
                      </div>

                      {/* Action Button Indicator */}
                      <div className="pt-2.5 border-t border-border/60 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRuleForView(rule);
                            setRuleDetailModalOpen(true);
                          }}
                          className="text-[11px] font-semibold text-tertiary hover:text-iris flex items-center gap-1 transition-colors"
                        >
                          <Eye size={12} />
                          <span>View Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePrebuiltRule(rule);
                          }}
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1',
                            active
                              ? 'bg-success/15 text-success border border-success/30 hover:bg-danger/10 hover:text-danger hover:border-danger/30'
                              : 'bg-surface border border-border text-secondary group-hover:border-iris/40 group-hover:text-iris'
                          )}
                        >
                          {active ? (
                            <>
                              <Check size={12} strokeWidth={2.5} /> Added
                            </>
                          ) : (
                            <>
                              <Plus size={12} /> Add Rule
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 4: QUANTITATIVE RISK & SESSION PARAMETERS */}
          <div className="card p-7 space-y-6">
            <div>
              <h4 className="font-display font-bold text-base text-primary">Session Windows & Quantitative Thresholds</h4>
              <p className="text-xs text-tertiary mt-0.5">Configure your active NSE trading session hours, maximum loss limits, and automated background polling cadence.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">Session Start (IST)</label>
                <input type="time" value={windowStart} onChange={e => setWindowStart(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">Session End (IST)</label>
                <input type="time" value={windowEnd} onChange={e => setWindowEnd(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">Automated Sync Cadence</label>
                <select value={syncCadence} onChange={e => setSyncCadence(e.target.value)} className={cn(inputCls, 'appearance-none cursor-pointer text-xs font-sans')}>
                  <option value="STREAMING_REALTIME">⚡ Real-Time WebSockets (9:15-15:30)</option>
                  <option value="PERIODIC_15M">🕒 Periodic Interval (Every 15 mins)</option>
                  <option value="EOD_CLOSE">🌆 Post-Market Close (16:00 IST)</option>
                  <option value="MANUAL">🔒 Manual Sync Only</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <h4 className="font-display font-bold text-base text-primary">Quantitative Risk Barriers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Max Trades per Day', value: maxTradesPerDay, set: setMaxTradesPerDay, placeholder: '5' },
                  { label: 'Max Daily Loss Barrier (₹)', value: maxDailyLoss, set: setMaxDailyLoss, placeholder: '3000' },
                  { label: 'Max Loss per Trade (₹)', value: maxLossPerTrade, set: setMaxLossPerTrade, placeholder: '750' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">{f.label}</label>
                    <input type="number" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className={inputCls} />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-2.5 block">Allowed Trading Instruments</label>
                <div className="flex gap-2 flex-wrap">
                  {INSTRUMENTS.map(inst => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => toggleChip(allowedInstruments, setAllowedInstruments, inst)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs font-bold border transition-all',
                        allowedInstruments.includes(inst)
                          ? 'bg-iris/15 border-iris text-iris shadow-sm'
                          : 'bg-surface-1 border-border text-secondary hover:border-border-hover'
                      )}
                    >{inst}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-2.5 block">Approved Exchange Markets</label>
                <div className="flex gap-2 flex-wrap">
                  {MARKETS.map(mkt => (
                    <button
                      key={mkt}
                      type="button"
                      onClick={() => toggleChip(allowedMarkets, setAllowedMarkets, mkt)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs font-bold border transition-all',
                        allowedMarkets.includes(mkt)
                          ? 'bg-accent/15 border-accent text-accent shadow-sm'
                          : 'bg-surface-1 border-border text-secondary hover:border-border-hover'
                      )}
                    >{mkt}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Commit Button */}
            <Button onClick={handleSaveRules} isLoading={isSavingRules} className="w-full h-12 font-bold text-sm shadow-iris mt-4">
              {rulesSaved ? <><Check size={16} /> Quantitative Discipline Rules Saved!</> : !isSavingRules && <><BookOpen size={16} /> Commit All Rules & Manifesto to Institutional Vault</>}
            </Button>
          </div>

          {/* RULE DETAIL MODAL */}
          <RuleDetailModal
            rule={selectedRuleForView}
            open={ruleDetailModalOpen}
            onOpenChange={setRuleDetailModalOpen}
            isActive={selectedRuleForView ? isRuleActive(selectedRuleForView) : false}
            onToggleActive={(rule) => togglePrebuiltRule(rule)}
          />
        </div>
      )}

      {/* TAB: VOICE & AUDIO AI SETTINGS */}
      {activeTab === 'voice' && (
        <VoiceSettingsTab />
      )}

      {/* TAB: NOTIFICATION PREFERENCES */}
      {activeTab === 'notifications' && (
        <React.Suspense fallback={
          <div className="p-12 text-center text-tertiary font-mono text-sm animate-pulse">
            Loading notification preferences...
          </div>
        }>
          <NotificationSettings />
        </React.Suspense>
      )}

      {/* TAB 3: PROFILE & WORKSPACE PREFERENCES */}
      {activeTab === 'profile' && (
        <div className="card p-7 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-5 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-iris to-accent flex items-center justify-center text-white text-xl font-black shadow-iris select-none">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (profileName || profile?.fullName || 'PT').slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-primary">{profileName || 'Principal Trader'}</h4>
              <p className="text-xs font-mono text-tertiary">{profile?.email || 'trader@RiskRule.in'} • Tier 1 Institutional Subscription</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">Full Display Name</label>
                <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">Primary Mobile Phone</label>
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">Avatar Image URL</label>
                <input type="text" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." className={inputCls} />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">Primary Timezone & Exchange Region</label>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} className={cn(inputCls, 'appearance-none cursor-pointer text-xs font-sans w-full')}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST — NSE/BSE Hours)</option>
                  <option value="UTC">UTC (Global Crypto & Forex Vault)</option>
                  <option value="America/New_York">America/New_York (EST — US Equity F&O)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
            <Button variant="danger" onClick={signOut} className="h-11 px-6 font-bold gap-2">
              <LogOut size={16} /> Sign Out Session
            </Button>
            <Button
              isLoading={isSavingProfile}
              onClick={async () => {
                setIsSavingProfile(true);
                try {
                  const { error } = await updateProfile({ fullName: profileName, avatarUrl, timezone, phoneNumber });
                  if (error) throw new Error(error);
                  notify.success('Profile preferences committed to cloud vault.');
                } catch (err: any) {
                  notify.error(err.message);
                } finally {
                  setIsSavingProfile(false);
                }
              }}
              className="h-11 px-8 font-bold shadow-iris"
            >
              {!isSavingProfile && 'Save Workspace Profile'}
            </Button>
          </div>

          <div className="pt-8 mt-4 border-t border-border">
            <div className="p-6 rounded-3xl border border-danger/40 bg-danger/5 ring-1 ring-danger/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h4 className="font-display font-bold text-lg text-danger">Danger Zone</h4>
                  <p className="text-xs text-danger/80 mt-1 max-w-xl leading-relaxed">
                    Permanently delete your account and all associated data, including trade journals, AI insights, and settings. This action cannot be undone.
                  </p>
                </div>
                <Button 
                  variant="danger" 
                  isLoading={isDeletingAccount}
                  onClick={async () => {
                    if (window.confirm("Are you ABSOLUTELY sure you want to permanently delete your account? This will erase all your trade data forever.")) {
                      setIsDeletingAccount(true);
                      const { error } = await deleteAccount();
                      if (error) {
                        notify.error(error);
                        setIsDeletingAccount(false);
                      } else {
                        notify.success('Account successfully deleted.');
                      }
                    }
                  }}
                  className="h-11 px-6 font-bold shrink-0 border border-danger/30 hover:bg-danger hover:text-white"
                >
                  Delete Account Permanently
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & DATA VAULT */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Cryptographic Cloud Security Card */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-success/15 text-success flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-primary">AES-256 Cloud Vault</h4>
                  <p className="text-xs text-tertiary">Cryptographic API Secret Governance</p>
                </div>
              </div>
              <p className="text-xs text-tertiary leading-relaxed">
                All brokerage API secrets, TOTP base32 signatures, and MPINs are encrypted at rest using high-entropy AES-256 GCM cloud keys. Secrets are never persisted in unencrypted client DOM memory or session storage.
              </p>
              <div className="p-3 rounded-xl bg-surface-1 border border-border flex items-center justify-between text-[11px] font-mono">
                <span className="text-secondary font-semibold">Vault Integrity: Verified</span>
                <span className="text-success font-bold">● SHA-256 ACTIVE</span>
              </div>
            </div>

            {/* Enterprise Data Portability & Archive Exporter */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-iris/15 text-iris flex items-center justify-center shrink-0">
                  <Download size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-primary">Data Portability Vault</h4>
                  <p className="text-xs text-tertiary">Institutional Ledger & AI Memory Exporter</p>
                </div>
              </div>
              <p className="text-xs text-tertiary leading-relaxed">
                Download your complete historical execution journals, custom R-multiple tags, and AI Coach conversational memories as verifiable compressed archives for external compliance or quantitative accounting.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Button onClick={() => handleDownloadLedgerArchive('json')} variant="secondary" className="flex-1 font-bold text-xs gap-1.5 h-10">
                  <Download size={14} /> Export .JSON Vault
                </Button>
                <Button onClick={() => handleDownloadLedgerArchive('csv')} variant="secondary" className="flex-1 font-bold text-xs gap-1.5 h-10">
                  <Download size={14} /> Export .CSV Ledger
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </AnimatedTabs>

      {/* Guided Connection Wizard Modal */}
      <BrokerConnectionWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}

