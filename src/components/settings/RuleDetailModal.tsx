import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Shield,
  Star,
  Check,
  Plus,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Zap,
  Target,
  Compass,
  TrendingUp,
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';
import { PrebuiltRule } from '../../constants/prebuiltRules';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';

interface RuleDetailModalProps {
  rule: PrebuiltRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive: boolean;
  onToggleActive: (rule: PrebuiltRule) => void;
}

export function RuleDetailModal({
  rule,
  open,
  onOpenChange,
  isActive,
  onToggleActive,
}: RuleDetailModalProps) {
  if (!rule) return null;

  const handleToggle = () => {
    onToggleActive(rule);
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'risk':
      case 'drawdowns':
        return {
          icon: Shield,
          badgeCls: 'bg-danger/10 text-danger border-danger/25',
          accentBorder: 'border-danger/30',
          accentBg: 'from-danger/10 via-surface-1 to-surface-1',
          dot: 'bg-danger',
        };
      case 'open_gaps':
      case 'breakout_traps':
        return {
          icon: Target,
          badgeCls: 'bg-accent/10 text-accent border-accent/25',
          accentBorder: 'border-accent/30',
          accentBg: 'from-accent/10 via-surface-1 to-surface-1',
          dot: 'bg-accent',
        };
      case 'trends':
      case 'management':
      case 'winning_greed':
        return {
          icon: TrendingUp,
          badgeCls: 'bg-iris/10 text-iris border-iris/25',
          accentBorder: 'border-iris/30',
          accentBg: 'from-iris/10 via-surface-1 to-surface-1',
          dot: 'bg-iris',
        };
      case 'news_events':
      case 'range_chop':
        return {
          icon: AlertTriangle,
          badgeCls: 'bg-gold/10 text-gold border-gold/25',
          accentBorder: 'border-gold/30',
          accentBg: 'from-gold/10 via-surface-1 to-surface-1',
          dot: 'bg-gold',
        };
      case 'expiry_options':
        return {
          icon: Zap,
          badgeCls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
          accentBorder: 'border-emerald-500/30',
          accentBg: 'from-emerald-500/10 via-surface-1 to-surface-1',
          dot: 'bg-emerald-400',
        };
      case 'psychology':
        return {
          icon: Sparkles,
          badgeCls: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
          accentBorder: 'border-purple-500/30',
          accentBg: 'from-purple-500/10 via-surface-1 to-surface-1',
          dot: 'bg-purple-400',
        };
      case 'routine':
      default:
        return {
          icon: BookOpen,
          badgeCls: 'bg-iris/10 text-iris border-iris/25',
          accentBorder: 'border-iris/30',
          accentBg: 'from-iris/10 via-surface-1 to-surface-1',
          dot: 'bg-iris',
        };
    }
  };

  const theme = getCategoryTheme(rule.category);
  const IconComponent = theme.icon;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-surface-1 p-6 sm:p-7 border border-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] space-y-6 max-h-[90vh] overflow-y-auto animate-scaleIn">
          
          {/* Top Header Row */}
          <div className="flex items-start justify-between gap-4 pb-1">
            <div className="space-y-2.5 flex-1">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5', theme.badgeCls)}>
                  <IconComponent size={12} />
                  {rule.categoryLabel}
                </span>

                {rule.isBeginnerRecommended && (
                  <span className="px-2.5 py-1 rounded-lg bg-gold/10 text-gold border border-gold/25 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Star size={11} className="fill-gold" /> Beginner Essential
                  </span>
                )}

                {rule.situation && (
                  <span className="px-2.5 py-1 rounded-lg bg-surface-2 text-primary border border-border text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Compass size={11} className="text-iris" /> Situation: {rule.situation}
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-lg bg-surface-2 text-tertiary border border-border text-[11px] font-bold uppercase tracking-wider font-mono">
                  {rule.badge}
                </span>
              </div>

              {/* Title */}
              <Dialog.Title className="text-xl sm:text-2xl font-black text-primary tracking-tight font-display leading-snug">
                {rule.title}
              </Dialog.Title>
            </div>

            {/* Sleek Close Button */}
            <Dialog.Close className="text-tertiary hover:text-primary transition-colors p-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border/60 shrink-0">
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* Section 1: Core Commandment (Clean Highlighted Box) */}
          <div className={cn(
            'p-5 rounded-2xl border bg-gradient-to-r space-y-2 relative overflow-hidden',
            theme.accentBg,
            theme.accentBorder
          )}>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-tertiary">
              <Sparkles size={13} className="text-iris" />
              <span>The Core Rule Principle</span>
            </div>
            <p className="text-sm font-semibold text-primary leading-relaxed">
              "{rule.description}"
            </p>
          </div>

          {/* Section 2: Why This Protects Your Capital */}
          <div className="p-4.5 rounded-2xl bg-surface-2/60 border border-border/70 space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gold">
              <Lightbulb size={14} className="shrink-0" />
              <span>Why This Rule Protects Your Capital</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              {rule.category === 'risk' || rule.category === 'drawdowns'
                ? 'Risk and drawdown management rules prevent catastrophic account blowouts. Even with a 40% win rate, adhering strictly to mathematical risk parameters ensures long-term compounding profitability and protects you from emotional account destruction.'
                : rule.category === 'open_gaps' || rule.category === 'breakout_traps'
                ? 'Opening and breakout discipline eliminates FOMO and impulse chasing. Professional traders do not try to trade every spike — they wait patiently for prime probability confluence before deploying real capital.'
                : rule.category === 'trends' || rule.category === 'management' || rule.category === 'winning_greed'
                ? 'Trade management and trend-following separate amateur hopefuls from professional risk managers. Locking in gains, trailing stops, and respecting invalidation points guarantees you never turn a winner into a devastating loss.'
                : rule.category === 'psychology'
                ? 'Trading is 80% emotional regulation. Psychological pitfalls like revenge trading, greed, and loss aversion cause 90% of retail failures. Establishing psychological barriers keeps your mind stoic and objective.'
                : rule.category === 'expiry_options'
                ? 'Options are decaying derivatives with non-linear gamma and theta curves. Strict instrument rules protect you from theta bleed, IV crush post-events, and low liquidity slippage.'
                : rule.category === 'news_events'
                ? 'Binary news events cause erratic whipsaws and wide spread slippage. Pre-news safeguards preserve capital from sudden gap risks.'
                : 'Consistent preparation and journaling create a continuous quantitative feedback loop that accelerates your learning curve by 10x.'}
            </p>
          </div>

          {/* Section 3: Execution Protocol */}
          <div className="p-4.5 rounded-2xl bg-surface-2/60 border border-border/70 space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-success">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Actionable Execution Protocol</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 text-secondary">
                <span className="px-2 py-0.5 rounded-md bg-surface-1 border border-border font-mono font-bold text-[10px] text-iris shrink-0 mt-0.5">
                  STEP 1
                </span>
                <span className="leading-relaxed">
                  Calculate risk, exact lot size, and invalidation levels <strong className="text-primary font-semibold">prior to order placement</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-secondary">
                <span className="px-2 py-0.5 rounded-md bg-surface-1 border border-border font-mono font-bold text-[10px] text-iris shrink-0 mt-0.5">
                  STEP 2
                </span>
                <span className="leading-relaxed">
                  Automate the execution via broker bracket orders or hard GTT stop-loss orders immediately upon entry.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-secondary">
                <span className="px-2 py-0.5 rounded-md bg-surface-1 border border-border font-mono font-bold text-[10px] text-iris shrink-0 mt-0.5">
                  STEP 3
                </span>
                <span className="leading-relaxed">
                  Log your execution in TradeVault right after closing the trade to receive personalized AI coach feedback.
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-5 border-t border-border/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            {/* Status Pill on Left */}
            <div className="flex items-center gap-2">
              <span className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border',
                isActive
                  ? 'bg-success/10 text-success border-success/25'
                  : 'bg-surface-2 text-tertiary border-border'
              )}>
                <span className={cn('w-2 h-2 rounded-full', isActive ? 'bg-success animate-pulse' : 'bg-tertiary')} />
                {isActive ? 'Active in My Rulebook' : 'Not Active Yet'}
              </span>
            </div>

            {/* Buttons on Right */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant={isActive ? 'danger' : 'primary'}
                size="sm"
                onClick={handleToggle}
                className="h-10 px-5 text-xs font-bold gap-2 w-full sm:w-auto shadow-sm"
              >
                {isActive ? (
                  <>
                    <X size={14} /> Remove from Active Rules
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Add to Active Commandments
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 text-xs font-bold w-full sm:w-auto"
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
