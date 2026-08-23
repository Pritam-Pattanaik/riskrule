import React, { useState, useMemo } from 'react';
import {
  Shield, Plus, Search, Star, Edit3, Trash2, Eye,
  Sparkles, CheckCircle2, AlertTriangle, X, RefreshCw,
  BookOpen, Target, Zap, Lightbulb, Compass, Filter
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { PREBUILT_RULES, PREBUILT_RULE_CATEGORIES, PrebuiltRule } from '../../constants/prebuiltRules';
import { Button } from '../../components/ui/Button';
import { notify } from '../../lib/notify';
import { cn } from '../../lib/cn';
import { RuleDetailModal } from '../../components/settings/RuleDetailModal';

const CATEGORY_OPTIONS: { id: PrebuiltRule['category']; label: string }[] = [
  { id: 'risk', label: '🛡️ Risk & Capital' },
  { id: 'open_gaps', label: '🌅 Market Open & Gaps' },
  { id: 'breakout_traps', label: '🎯 Breakouts & Traps' },
  { id: 'trends', label: '📈 Trends & Momentum' },
  { id: 'range_chop', label: '🌊 Choppy & Sideways' },
  { id: 'news_events', label: '📰 News & High Volatility' },
  { id: 'expiry_options', label: '⚡ Expiry & Options' },
  { id: 'management', label: '📊 Trade Management' },
  { id: 'drawdowns', label: '📉 Drawdowns & Tilts' },
  { id: 'winning_greed', label: '🏆 Winning & Greed Control' },
  { id: 'psychology', label: '🧠 Mindset & Stress' },
  { id: 'routine', label: '⏰ Daily Prep & Journaling' },
];

const LOCAL_STORAGE_KEY = 'tradevault_admin_rules_library_v2';

import { api } from '../../lib/api';

export default function AdminTradingRules() {
  const [rulesList, setRulesList] = useState<PrebuiltRule[]>(PREBUILT_RULES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch rules from database on mount
  const fetchRulesFromDb = async () => {
    try {
      setLoading(true);
      const data = await api.get<PrebuiltRule[]>('/platform-rules');
      if (Array.isArray(data) && data.length > 0) {
        setRulesList(data);
      }
    } catch (e) {
      console.error('Failed to fetch platform rules from database, using defaults', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRulesFromDb();
  }, []);

  // Modals state
  const [selectedRuleForView, setSelectedRuleForView] = useState<PrebuiltRule | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [isCreateOrEditOpen, setIsCreateOrEditOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PrebuiltRule | null>(null);
  const [saving, setSaving] = useState(false);

  const [ruleToDelete, setRuleToDelete] = useState<PrebuiltRule | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PrebuiltRule['category']>('risk');
  const [formSituation, setFormSituation] = useState('');
  const [formBadge, setFormBadge] = useState('Essential');
  const [formDescription, setFormDescription] = useState('');
  const [formIsBeginner, setFormIsBeginner] = useState(false);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingRule(null);
    setFormTitle('');
    setFormCategory('risk');
    setFormSituation('General Market Condition');
    setFormBadge('Essential');
    setFormDescription('');
    setFormIsBeginner(false);
    setIsCreateOrEditOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (rule: PrebuiltRule) => {
    setEditingRule(rule);
    setFormTitle(rule.title);
    setFormCategory(rule.category);
    setFormSituation(rule.situation || 'General Execution');
    setFormBadge(rule.badge);
    setFormDescription(rule.description);
    setFormIsBeginner(rule.isBeginnerRecommended);
    setIsCreateOrEditOpen(true);
  };

  // Handle Form Submit
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      notify.error('Please enter both rule title and description');
      return;
    }

    const categoryObj = CATEGORY_OPTIONS.find(c => c.id === formCategory);
    const categoryLabel = categoryObj ? categoryObj.label.replace(/^.*? /, '') : 'Risk & Capital';

    const payload = {
      title: formTitle.trim(),
      category: formCategory,
      categoryLabel,
      situation: formSituation.trim() || 'Active Trading',
      badge: formBadge.trim() || 'Essential',
      description: formDescription.trim(),
      isBeginnerRecommended: formIsBeginner,
    };

    setSaving(true);
    try {
      if (editingRule) {
        // Edit in DB
        const updated = await api.patch<PrebuiltRule>(`/platform-rules/${editingRule.id}`, payload);
        setRulesList(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...updated } : r));
        notify.success(`Rule "${formTitle}" updated in database.`);
      } else {
        // Create in DB
        const created = await api.post<PrebuiltRule>('/platform-rules', payload);
        setRulesList(prev => [created, ...prev]);
        notify.success(`New platform rule "${formTitle}" saved to database.`);
      }
      setIsCreateOrEditOpen(false);
    } catch (err: any) {
      notify.error(err?.message || 'Failed to save rule in database');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return;
    try {
      await api.delete(`/platform-rules/${ruleToDelete.id}`);
      setRulesList(prev => prev.filter(r => r.id !== ruleToDelete.id));
      notify.success(`Rule "${ruleToDelete.title}" deleted from database.`);
    } catch (err: any) {
      notify.error(err?.message || 'Failed to delete rule');
    } finally {
      setDeleteModalOpen(false);
      setRuleToDelete(null);
    }
  };

  // Reset to Factory Library in Database
  const handleResetToFactory = async () => {
    if (window.confirm('Reset the rules library to official TradeVault factory defaults (62 situational rules) in the database?')) {
      try {
        setLoading(true);
        const res = await api.post<{ success: boolean; rules: PrebuiltRule[] }>('/platform-rules/reset', {});
        if (res?.rules) {
          setRulesList(res.rules);
        } else {
          await fetchRulesFromDb();
        }
        notify.success('Rules library reset to official 62 factory defaults in database.');
      } catch (err: any) {
        notify.error(err?.message || 'Failed to reset rules');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return rulesList.filter(rule => {
      if (selectedCategory === 'beginner' && !rule.isBeginnerRecommended) return false;
      if (selectedCategory !== 'all' && selectedCategory !== 'beginner' && rule.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
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
  }, [rulesList, selectedCategory, search]);

  // Statistics
  const beginnerCount = rulesList.filter(r => r.isBeginnerRecommended).length;
  const riskCount = rulesList.filter(r => r.category === 'risk' || r.category === 'drawdowns').length;
  const executionCount = rulesList.filter(r => r.category === 'management' || r.category === 'trends' || r.category === 'open_gaps' || r.category === 'breakout_traps').length;

  return (
    <div className="space-y-7 animate-fadeIn pb-24 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iris/10 text-iris text-xs font-bold mb-2.5 border border-iris/20">
            <Shield size={12} /> Platform Governance & Rules Master Library
          </div>
          <h1 className="font-display text-3xl font-black text-primary tracking-tight">Rules Library Management</h1>
          <p className="text-sm text-tertiary mt-1 max-w-2xl leading-relaxed">
            Curate, edit, and govern the 60+ pre-built trading discipline rules across diverse market scenarios (Openings, Breakouts, Trends, Choppy Ranges, Options, Drawdowns).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleResetToFactory}
            className="h-11 px-4 text-xs font-bold gap-2"
          >
            <RefreshCw size={14} /> Reset Defaults
          </Button>
          <Button
            type="button"
            onClick={handleOpenCreate}
            className="h-11 px-5 text-xs font-bold shadow-iris gap-2 shrink-0"
          >
            <Plus size={16} /> Create Platform Rule
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-tertiary">Total Library Rules</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary font-display">{rulesList.length}</span>
            <span className="text-xs text-iris font-semibold">Situational Rules</span>
          </div>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gold flex items-center gap-1">
            <Star size={12} className="fill-gold" /> Beginner Essentials
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-gold font-display">{beginnerCount}</span>
            <span className="text-xs text-tertiary">1-Click Starter</span>
          </div>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-danger">Risk & Drawdown Shields</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-danger font-display">{riskCount}</span>
            <span className="text-xs text-tertiary">Capital Protection</span>
          </div>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent">Execution & Strategy Triggers</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-accent font-display">{executionCount}</span>
            <span className="text-xs text-tertiary">Market Setups</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by rule title, market situation (e.g. gap-up, 15m candle close, drawdown), or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-1 border border-border text-primary rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-iris/50 focus:bg-surface transition-all"
            />
          </div>
          <span className="text-xs text-tertiary font-mono self-center sm:self-auto shrink-0">
            Showing {filteredRules.length} of {rulesList.length} rules
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-border pt-3">
          {PREBUILT_RULE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
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

      {/* Rules Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="card p-5 flex flex-col justify-between group hover:border-border-hover transition-all bg-surface-1 hover:bg-surface-2/70 space-y-4"
          >
            <div className="space-y-2.5">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-[9px] font-bold uppercase tracking-wider text-tertiary">
                    {rule.categoryLabel}
                  </span>
                  {rule.isBeginnerRecommended && (
                    <span className="px-2 py-0.5 rounded-md bg-gold/10 text-gold border border-gold/25 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Star size={9} className="fill-gold" /> Beginner
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono font-bold text-muted uppercase">
                  {rule.badge}
                </span>
              </div>

              {/* Title, Situation & Description */}
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-base text-primary group-hover:text-iris transition-colors">
                  {rule.title}
                </h4>

                {rule.situation && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-tertiary">
                    <span className="w-1.5 h-1.5 rounded-full bg-iris" />
                    <span className="truncate">When: <strong className="text-secondary font-semibold">{rule.situation}</strong></span>
                  </div>
                )}

                <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                  {rule.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedRuleForView(rule);
                  setViewModalOpen(true);
                }}
                className="text-xs font-semibold text-tertiary hover:text-iris flex items-center gap-1 transition-colors"
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(rule)}
                  className="p-1.5 rounded-lg text-tertiary hover:text-primary hover:bg-surface transition-colors"
                  title="Edit Rule"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRuleToDelete(rule);
                    setDeleteModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-tertiary hover:text-danger hover:bg-danger/10 transition-colors"
                  title="Delete Rule"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT RULE MODAL */}
      <Dialog.Root open={isCreateOrEditOpen} onOpenChange={setIsCreateOrEditOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md animate-fadeIn" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-surface-1 p-6 sm:p-7 border border-border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-iris/10 text-iris border border-iris/20">
                  <Shield size={18} />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-primary font-display">
                    {editingRule ? 'Edit Platform Rule' : 'Create Platform Rule'}
                  </Dialog.Title>
                  <p className="text-xs text-tertiary">Configure pre-built situational rule parameters for the platform library.</p>
                </div>
              </div>
              <Dialog.Close className="text-tertiary hover:text-primary p-1.5 rounded-lg">
                <X size={18} />
              </Dialog.Close>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">
                  Rule Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Max 1% to 2% Risk Per Trade"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-surface px-4 text-xs text-primary font-medium placeholder:text-muted outline-none focus:border-iris/50"
                />
              </div>

              {/* Situation / Context Tag */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">
                  Market Situation / Trigger Context
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gap-Up > 1%, 3rd Loss in a Row, Mid-Day 11:30 AM - 1:15 PM"
                  value={formSituation}
                  onChange={(e) => setFormSituation(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-surface px-4 text-xs text-primary font-medium outline-none focus:border-iris/50"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-11 rounded-xl border border-border bg-surface px-3 text-xs text-primary font-medium outline-none focus:border-iris/50"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Essential, Capital Guard"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-surface px-4 text-xs text-primary font-medium outline-none focus:border-iris/50"
                  />
                </div>
              </div>

              {/* Beginner Essential Checkbox */}
              <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Star size={13} className="text-gold fill-gold" /> Recommend to Beginners
                  </span>
                  <p className="text-[11px] text-tertiary">
                    Include in the "12 Recommended Beginner Essentials" 1-click starter preset.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formIsBeginner}
                  onChange={(e) => setFormIsBeginner(e.target.checked)}
                  className="w-4 h-4 rounded text-iris focus:ring-iris cursor-pointer"
                />
              </div>

              {/* Description / Principle */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-tertiary mb-1.5 block">
                  Rule Principle & Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the specific condition, quantitative threshold, and purpose of this rule..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface p-3.5 text-xs text-primary font-medium placeholder:text-muted outline-none focus:border-iris/50 resize-none leading-relaxed"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsCreateOrEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="shadow-iris">
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog.Root open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md animate-fadeIn" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-surface-1 p-6 border border-border shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-danger">
              <div className="p-2.5 rounded-xl bg-danger/10 border border-danger/20">
                <AlertTriangle size={20} />
              </div>
              <Dialog.Title className="text-lg font-bold font-display text-primary">
                Delete Platform Rule?
              </Dialog.Title>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to remove <strong className="text-primary font-semibold">"{ruleToDelete?.title}"</strong> from the platform library?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Delete Rule
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* PREVIEW RULE MODAL */}
      <RuleDetailModal
        rule={selectedRuleForView}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        isActive={false}
        onToggleActive={() => {
          notify.info('Rule preview mode in Superadmin.');
        }}
      />

    </div>
  );
}
