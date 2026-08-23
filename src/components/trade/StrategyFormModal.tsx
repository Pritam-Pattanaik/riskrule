import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Target, Loader2, Sparkles, Plus, Check, Lock, AlertTriangle } from 'lucide-react';
import { useStrategyStore } from '../../stores/strategyStore';
import { Strategy } from '../../types';
import { Button } from '../ui/Button';
import { notify } from '../../lib/notify';
import { cn } from '../../lib/cn';

interface StrategyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy?: Strategy | null; // If passed, editing custom strategy
  initialData?: Partial<Strategy> | null; // If passed, prefilling new strategy (e.g. cloning)
  onSuccess?: (strategy: Strategy) => void;
}

const COMMON_MARKETS = ['EQUITY', 'F&O', 'COMMODITY', 'CURRENCY', 'CRYPTO'];
const COMMON_TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', 'Daily'];

export function StrategyFormModal({
  open,
  onOpenChange,
  strategy,
  initialData,
  onSuccess,
}: StrategyFormModalProps) {
  const { addStrategy, updateStrategy, fetchStrategies } = useStrategyStore();
  const [loading, setLoading] = useState(false);
  const [customMarketInput, setCustomMarketInput] = useState('');

  const isEditing = Boolean(strategy && strategy.id);
  const isDefaultProtected = Boolean(strategy?.isDefault);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: '',
    timeframe: '5m',
    market: ['EQUITY', 'F&O'] as string[],
    isActive: true,
  });

  useEffect(() => {
    if (open) {
      if (strategy) {
        setFormData({
          name: strategy.name || '',
          description: strategy.description || '',
          rules: strategy.rules || '',
          timeframe: strategy.timeframe || '5m',
          market: Array.isArray(strategy.market) ? strategy.market : [],
          isActive: strategy.isActive !== false,
        });
      } else if (initialData) {
        setFormData({
          name: initialData.name ? `${initialData.name} (Custom)` : '',
          description: initialData.description || '',
          rules: initialData.rules || '',
          timeframe: initialData.timeframe || '5m',
          market: Array.isArray(initialData.market) ? initialData.market : ['EQUITY', 'F&O'],
          isActive: true,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          rules: '',
          timeframe: '5m',
          market: ['EQUITY', 'F&O'],
          isActive: true,
        });
      }
      setCustomMarketInput('');
    }
  }, [open, strategy, initialData]);

  const toggleMarket = (marketName: string) => {
    setFormData((prev) => {
      const exists = prev.market.includes(marketName);
      if (exists) {
        return { ...prev, market: prev.market.filter((m) => m !== marketName) };
      } else {
        return { ...prev, market: [...prev.market, marketName] };
      }
    });
  };

  const addCustomMarket = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const tag = customMarketInput.trim().toUpperCase();
    if (tag && !formData.market.includes(tag)) {
      setFormData((prev) => ({ ...prev, market: [...prev.market, tag] }));
      setCustomMarketInput('');
    }
  };

  const removeMarket = (marketName: string) => {
    setFormData((prev) => ({
      ...prev,
      market: prev.market.filter((m) => m !== marketName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDefaultProtected) {
      notify.error('Default platform strategies cannot be modified.');
      return;
    }

    if (!formData.name.trim()) {
      notify.error('Strategy name is required.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && strategy) {
        const updated = await updateStrategy(strategy.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          rules: formData.rules.trim() || undefined,
          timeframe: formData.timeframe.trim() || undefined,
          market: formData.market,
          isActive: formData.isActive,
        });
        notify.success('Custom strategy updated successfully');
        onSuccess?.(updated);
      } else {
        const created = await addStrategy({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          rules: formData.rules.trim() || undefined,
          timeframe: formData.timeframe.trim() || undefined,
          market: formData.market,
          isActive: formData.isActive,
        });
        notify.success('Custom strategy created successfully');
        onSuccess?.(created);
      }

      await fetchStrategies();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      notify.error(err.message || (isEditing ? 'Failed to update strategy' : 'Failed to create strategy'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 sm:p-7 border border-border shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                <Target size={20} />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-primary">
                  {isEditing ? 'Edit Custom Strategy' : initialData ? 'Clone Strategy as Custom' : 'New Custom Strategy'}
                </Dialog.Title>
                <p className="text-xs text-tertiary">
                  {isEditing
                    ? 'Modify your custom strategy specifications and execution rules'
                    : 'Build your personal trading setup with custom triggers and rules'}
                </p>
              </div>
            </div>
            <Dialog.Close className="text-tertiary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-1">
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* Guard Warning if Default */}
          {isDefaultProtected && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-danger">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Cannot Modify Default Strategy</strong>
                System default strategies are curated platform templates and cannot be directly modified.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Strategy Name */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">
                Strategy Name <span className="text-danger">*</span>
              </label>
              <input
                required
                disabled={isDefaultProtected || loading}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-1 border border-border rounded-lg px-3.5 py-2 text-sm text-primary placeholder:text-muted focus:border-accent outline-none disabled:opacity-50"
                placeholder="e.g. 15m VWAP Breakout, Gap & Go Setup"
              />
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">
                Timeframe
              </label>
              <div className="space-y-2">
                <input
                  disabled={isDefaultProtected || loading}
                  type="text"
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  className="w-full bg-surface-1 border border-border rounded-lg px-3.5 py-2 text-sm text-primary placeholder:text-muted focus:border-accent outline-none disabled:opacity-50"
                  placeholder="e.g. 5m, 15m, 1h, Daily"
                />
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TIMEFRAMES.map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      disabled={isDefaultProtected || loading}
                      onClick={() => setFormData({ ...formData, timeframe: tf })}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all',
                        formData.timeframe === tf
                          ? 'bg-accent/15 text-accent border-accent/30'
                          : 'bg-surface-1 text-tertiary border-border hover:text-secondary'
                      )}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Markets */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">
                Target Markets & Asset Classes
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_MARKETS.map((m) => {
                    const isSelected = formData.market.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        disabled={isDefaultProtected || loading}
                        onClick={() => toggleMarket(m)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1',
                          isSelected
                            ? 'bg-iris/15 text-iris border-iris/30'
                            : 'bg-surface-1 text-tertiary border-border hover:text-secondary'
                        )}
                      >
                        {isSelected && <Check size={11} />}
                        {m}
                      </button>
                    );
                  })}
                </div>

                {/* Additional / Custom Market Tags */}
                <div className="flex items-center gap-2">
                  <input
                    disabled={isDefaultProtected || loading}
                    type="text"
                    value={customMarketInput}
                    onChange={(e) => setCustomMarketInput(e.target.value)}
                    onKeyDown={addCustomMarket}
                    placeholder="Add custom market tag (press Enter)..."
                    className="flex-1 bg-surface-1 border border-border rounded-lg px-3 py-1.5 text-xs text-primary placeholder:text-muted focus:border-accent outline-none disabled:opacity-50"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!customMarketInput.trim() || isDefaultProtected || loading}
                    onClick={addCustomMarket}
                  >
                    <Plus size={12} /> Add
                  </Button>
                </div>

                {/* Selected Custom Tags */}
                {formData.market.some((m) => !COMMON_MARKETS.includes(m)) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.market
                      .filter((m) => !COMMON_MARKETS.includes(m))
                      .map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-surface-2 border border-border text-xs text-primary flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeMarket(tag)}
                            className="text-tertiary hover:text-danger ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Setup Thesis / Description */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">
                Setup Thesis & Overview
              </label>
              <textarea
                rows={2}
                disabled={isDefaultProtected || loading}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-1 border border-border rounded-lg px-3.5 py-2 text-sm text-primary placeholder:text-muted focus:border-accent outline-none min-h-[70px] disabled:opacity-50"
                placeholder="High-level concept, market condition requirements, or setup rationale..."
              />
            </div>

            {/* Execution Rules & Criteria */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">
                Execution Rules & Trigger Criteria
              </label>
              <textarea
                rows={4}
                disabled={isDefaultProtected || loading}
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="w-full bg-surface-1 border border-border rounded-lg px-3.5 py-2 text-xs font-mono text-primary placeholder:text-muted focus:border-accent outline-none min-h-[100px] disabled:opacity-50"
                placeholder="1. Entry Signal: Wait for candle close above key resistance...&#10;2. Stop Loss: 1 ATR below breakout level...&#10;3. Profit Target: 1:2 Risk-Reward ratio...&#10;4. Risk Rule: Max 1% account risk per trade."
              />
            </div>

            {/* Active Status (if editing) */}
            {isEditing && (
              <div className="flex items-center justify-between p-3 bg-surface-1 border border-border rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-primary">Strategy Status</p>
                  <p className="text-[11px] text-tertiary">Active strategies are highlighted in trade loggers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    disabled={isDefaultProtected || loading}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success"></div>
                </label>
              </div>
            )}

            {/* Form Footer Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || isDefaultProtected}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Create Custom Strategy'
                )}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
