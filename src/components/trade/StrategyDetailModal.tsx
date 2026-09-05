import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Target,
  Sparkles,
  User,
  Lock,
  Edit3,
  Trash2,
  Copy,
  Clock,
  TrendingUp,
  BarChart3,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Strategy } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';
import { formatCurrency, formatPercent } from '../../lib/analytics';

interface StrategyDetailModalProps {
  strategy: Strategy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (strategy: Strategy) => void;
  onClone?: (strategy: Strategy) => void;
  onDelete?: (strategyId: string) => Promise<void> | void;
}

export function StrategyDetailModal({
  strategy,
  open,
  onOpenChange,
  onEdit,
  onClone,
  onDelete,
}: StrategyDetailModalProps) {
  if (!strategy) return null;

  const totalPnl = strategy.totalPnl || 0;
  const isProfitable = totalPnl >= 0;
  const winRate = strategy.winRate || 0;
  const tradeCount = strategy.tradeCount || strategy.tradesCount || 0;
  const avgPnl = strategy.avgPnl || 0;

  const handleEdit = () => {
    if (strategy.isDefault) return;
    onOpenChange(false);
    onEdit?.(strategy);
  };

  const handleClone = () => {
    onOpenChange(false);
    onClone?.(strategy);
  };

  const handleDelete = async () => {
    if (strategy.isDefault) return;
    if (window.confirm(`Are you sure you want to delete your custom strategy "${strategy.name}"?`)) {
      onOpenChange(false);
      await onDelete?.(strategy.id);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface p-6 sm:p-7 border border-border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'p-3 rounded-xl shrink-0 mt-0.5',
                  strategy.isDefault
                    ? 'bg-iris/10 text-iris border border-iris/20'
                    : 'bg-accent/10 text-accent border border-accent/20'
                )}
              >
                {strategy.isDefault ? <Sparkles size={22} /> : <Target size={22} />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {strategy.isDefault ? (
                    <span className="px-2 py-0.5 rounded-md bg-iris/10 text-iris border border-iris/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={11} /> Platform Default
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-surface-2 text-secondary border border-border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <User size={11} /> Custom Strategy
                    </span>
                  )}

                  {strategy.timeframe && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-2 border border-border text-[10px] font-bold text-tertiary uppercase flex items-center gap-1">
                      <Clock size={10} /> {strategy.timeframe}
                    </span>
                  )}

                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1',
                      strategy.isActive !== false
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-muted/10 text-muted border-muted/20'
                    )}
                  >
                    <CheckCircle2 size={10} />
                    {strategy.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <Dialog.Title className="text-xl font-bold text-primary tracking-tight">
                  {strategy.name}
                </Dialog.Title>
              </div>
            </div>

            <Dialog.Close className="text-tertiary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-1">
              <X size={20} />
            </Dialog.Close>
          </div>

          {/* Default Notice or Custom Notice */}
          {strategy.isDefault ? (
            <div className="bg-iris/8 border border-iris/20 rounded-xl p-4 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-iris/15 text-iris shrink-0 mt-0.5">
                <Lock size={15} />
              </div>
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-iris mb-0.5 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Curated Platform Default Template (Read-Only)
                </p>
                <p className="text-secondary">
                  This strategy is maintained by RiskRule as an institutional default setup and cannot be directly modified or deleted. You can click <strong className="text-primary font-medium">Clone as Custom Strategy</strong> below to create your own editable copy.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-surface-1 border border-border rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-secondary">
                <User size={14} className="text-accent" />
                <span>Your personal custom setup. Fully customizable anytime.</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-accent/10 text-accent rounded border border-accent/20">
                Editable
              </span>
            </div>
          )}

          {/* Setup Overview / Description */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-tertiary flex items-center gap-1.5">
              <Layers size={13} /> Setup Overview & Concept
            </h4>
            <div className="bg-surface-1 border border-border rounded-xl p-4 text-xs text-secondary leading-relaxed">
              {strategy.description ? (
                <p className="whitespace-pre-line text-primary/90">{strategy.description}</p>
              ) : (
                <p className="text-muted italic">No overview or thesis provided for this strategy.</p>
              )}
            </div>
          </div>

          {/* Execution Rules & Criteria */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-tertiary flex items-center gap-1.5">
              <Target size={13} /> Execution Rules & Trigger Criteria
            </h4>
            <div className="bg-canvas border border-border rounded-xl p-4 text-xs font-mono text-primary/90 leading-relaxed overflow-x-auto">
              {strategy.rules ? (
                <div className="whitespace-pre-wrap">{strategy.rules}</div>
              ) : (
                <p className="text-muted italic font-sans text-xs">No specific entry/exit rules defined yet.</p>
              )}
            </div>
          </div>

          {/* Applicable Markets */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-tertiary flex items-center gap-1.5">
              <Tag size={13} /> Target Markets & Asset Classes
            </h4>
            <div className="flex flex-wrap gap-2">
              {strategy.market && strategy.market.length > 0 ? (
                strategy.market.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-lg bg-surface-1 border border-border text-xs font-bold text-secondary uppercase tracking-wider"
                  >
                    {m}
                  </span>
                ))
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-surface-1 border border-border text-xs text-muted">
                  All Markets (Universal)
                </span>
              )}
            </div>
          </div>

          {/* Personal Performance Analytics */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-tertiary flex items-center gap-1.5">
                <BarChart3 size={13} /> Personal Performance Statistics
              </h4>
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border',
                  tradeCount === 0
                    ? 'bg-surface-2 text-muted border-border'
                    : isProfitable
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-danger/10 text-danger border-danger/20'
                )}
              >
                {tradeCount === 0 ? 'Untraded' : isProfitable ? 'Profitable' : 'Losing'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface-1 border border-border rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-muted uppercase tracking-widest block mb-1">
                  Net Realized P&L
                </span>
                <p
                  className={cn(
                    'text-base font-bold font-mono',
                    tradeCount === 0 ? 'text-muted' : isProfitable ? 'text-success' : 'text-danger'
                  )}
                >
                  {tradeCount > 0 ? `${isProfitable ? '+' : ''}${formatCurrency(totalPnl)}` : '—'}
                </p>
              </div>

              <div className="bg-surface-1 border border-border rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-muted uppercase tracking-widest block mb-1">
                  Win Rate
                </span>
                <p className={cn('text-base font-bold font-mono', tradeCount === 0 ? 'text-muted' : 'text-iris')}>
                  {tradeCount > 0 ? formatPercent(winRate) : '—'}
                </p>
              </div>

              <div className="bg-surface-1 border border-border rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-muted uppercase tracking-widest block mb-1">
                  Tagged Trades
                </span>
                <p className="text-base font-bold font-mono text-primary">{tradeCount}</p>
              </div>

              <div className="bg-surface-1 border border-border rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-muted uppercase tracking-widest block mb-1">
                  Avg P&L / Trade
                </span>
                <p
                  className={cn(
                    'text-base font-bold font-mono',
                    tradeCount === 0 ? 'text-muted' : avgPnl >= 0 ? 'text-success' : 'text-danger'
                  )}
                >
                  {tradeCount > 0 ? `${avgPnl >= 0 ? '+' : ''}${formatCurrency(avgPnl)}` : '—'}
                </p>
              </div>
            </div>

            {/* Win-rate bar */}
            {tradeCount > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
                  <span className="text-danger">Losses {(100 - winRate).toFixed(0)}%</span>
                  <span className="text-success">Wins {winRate.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-surface-2">
                  <div
                    className="h-full bg-success/80 transition-all duration-500 rounded-l-full"
                    style={{ width: `${winRate}%` }}
                  />
                  <div
                    className="h-full bg-danger/80 transition-all duration-500 rounded-r-full"
                    style={{ width: `${100 - winRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            {strategy.isDefault ? (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Lock size={13} />
                <span>Default strategies cannot be modified</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  className="w-full sm:w-auto"
                >
                  <Trash2 size={14} /> Delete Strategy
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {strategy.isDefault ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleClone}
                  className="w-full sm:w-auto"
                >
                  <Copy size={14} /> Clone as Custom Strategy
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleEdit}
                  className="w-full sm:w-auto"
                >
                  <Edit3 size={14} /> Edit Strategy
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
