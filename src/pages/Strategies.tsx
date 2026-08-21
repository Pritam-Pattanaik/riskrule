import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Target, Loader2, Sparkles, User, Trash2, Layers, Search, Filter } from 'lucide-react';
import { useStrategyStore } from '../stores/strategyStore';
import { formatCurrency, formatPercent } from '../lib/analytics';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer, StaggerItem, NumberCounter } from '../components/ui/Motion';
import { StrategyFormModal } from '../components/trade/StrategyFormModal';
import { EmptyState } from '../components/ui/EmptyState';

type StrategyTab = 'ALL' | 'DEFAULT' | 'CUSTOM';

export default function Strategies() {
  const { strategies, fetchStrategies, deleteStrategy, loading } = useStrategyStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StrategyTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('ALL');

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const defaultStrategies = useMemo(() => strategies.filter(s => s.isDefault), [strategies]);
  const customStrategies = useMemo(() => strategies.filter(s => !s.isDefault), [strategies]);

  const filteredStrategies = useMemo(() => {
    return strategies.filter((strat) => {
      // Tab filter
      if (activeTab === 'DEFAULT' && !strat.isDefault) return false;
      if (activeTab === 'CUSTOM' && strat.isDefault) return false;

      // Market filter
      if (selectedMarket !== 'ALL') {
        if (!strat.market || !strat.market.includes(selectedMarket)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = strat.name.toLowerCase().includes(q);
        const matchDesc = strat.description?.toLowerCase().includes(q);
        const matchRules = strat.rules?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchRules) return false;
      }

      return true;
    });
  }, [strategies, activeTab, selectedMarket, searchQuery]);

  const allMarkets = useMemo(() => {
    const set = new Set<string>();
    strategies.forEach(s => s.market?.forEach(m => set.add(m)));
    return ['ALL', ...Array.from(set)];
  }, [strategies]);

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-primary tracking-tight">Strategy Vault</h1>
          <p className="text-xs text-tertiary mt-1">
            Access curated platform default setups and build your own custom strategies.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          className="w-max"
        >
          <Plus size={14} /> New Custom Strategy
        </Button>
      </motion.div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-surface-1 p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('ALL')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'ALL'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-tertiary hover:text-secondary'
            )}
          >
            <Layers size={13} />
            All Strategies
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-2 text-muted font-bold font-mono">
              {strategies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('DEFAULT')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'DEFAULT'
                ? 'bg-iris/10 text-iris border border-iris/20 shadow-xs'
                : 'text-tertiary hover:text-secondary'
            )}
          >
            <Sparkles size={13} className="text-iris" />
            Default Strategies
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-iris/10 text-iris font-bold font-mono">
              {defaultStrategies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOM')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2',
              activeTab === 'CUSTOM'
                ? 'bg-accent/10 text-accent border border-accent/20 shadow-xs'
                : 'text-tertiary hover:text-secondary'
            )}
          >
            <User size={13} className="text-accent" />
            Custom Strategies
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-accent/10 text-accent font-bold font-mono">
              {customStrategies.length}
            </span>
          </button>
        </div>

        {/* Search & Market filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search setups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-1 border border-border text-primary rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-accent"
            />
          </div>

          {allMarkets.length > 2 && (
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="bg-surface-1 border border-border text-primary rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-accent"
            >
              {allMarkets.map(m => (
                <option key={m} value={m}>{m === 'ALL' ? 'All Markets' : m}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading && strategies.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-iris" />
        </div>
      ) : filteredStrategies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="card p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-iris/10 border border-iris/20 flex items-center justify-center mx-auto mb-5">
            <Target className="w-7 h-7 text-iris" strokeWidth={1.8} />
          </div>
          <h3 className="font-display text-xl font-bold text-primary mb-2">
            {activeTab === 'CUSTOM'
              ? 'No Custom Strategies'
              : activeTab === 'DEFAULT'
              ? 'No Default Strategies'
              : 'No Strategies Found'}
          </h3>
          <p className="text-sm text-secondary max-w-md mx-auto mb-6 leading-relaxed">
            {activeTab === 'CUSTOM'
              ? 'Build your first custom strategy with your personal entry triggers, exit rules, and risk guidelines.'
              : 'Try adjusting your search query or filters to discover available setups.'}
          </p>
          <Button onClick={() => setModalOpen(true)} className="mx-auto">
            <Plus size={14} /> Create Custom Strategy
          </Button>
        </motion.div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" staggerChildren={0.07} alwaysAnimate>
          {filteredStrategies.map((strat) => {
            const totalPnl = strat.totalPnl || 0;
            const isProfitable = totalPnl >= 0;
            const winRate = strat.winRate || 0;
            const tradeCount = strat.tradeCount || strat.tradesCount || 0;
            const avgPnl = strat.avgPnl || 0;

            return (
              <StaggerItem key={strat.id}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="card-raised p-6 flex flex-col justify-between min-h-[280px] cursor-default group relative overflow-hidden"
                >
                  {/* Top stripe */}
                  <div className={cn(
                    'absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r',
                    strat.isDefault
                      ? 'from-iris via-iris to-iris/20'
                      : isProfitable
                      ? 'from-success to-success/20'
                      : 'from-danger to-danger/20'
                  )} />

                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-border pb-4 mb-4">
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        {strat.isDefault ? (
                          <span className="px-2 py-0.5 rounded-md bg-iris/10 text-iris border border-iris/20 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                            <Sparkles size={10} /> Default
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-surface-2 text-secondary border border-border text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                            <User size={10} /> Custom
                          </span>
                        )}
                        {strat.timeframe && (
                          <span className="px-1.5 py-0.5 rounded-md bg-surface-2 border border-border text-[9px] font-bold text-tertiary uppercase">
                            {strat.timeframe}
                          </span>
                        )}
                      </div>
                      <span className="font-display text-base font-bold text-primary truncate tracking-tight block group-hover:text-iris transition-colors duration-200">
                        {strat.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                        tradeCount === 0
                          ? "bg-surface-2 text-muted border-border"
                          : isProfitable
                          ? "bg-success/8 text-success border-success/20"
                          : "bg-danger/8 text-danger border-danger/20"
                      )}>
                        {tradeCount === 0 ? 'Untraded' : isProfitable ? 'Profitable' : 'Losing'}
                      </div>

                      {!strat.isDefault && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete custom strategy "${strat.name}"?`)) {
                              await deleteStrategy(strat.id);
                            }
                          }}
                          className="p-1 text-tertiary hover:text-danger hover:bg-danger/10 rounded transition-colors"
                          title="Delete Custom Strategy"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description / Rules */}
                  {strat.description ? (
                    <p className="text-xs text-tertiary leading-relaxed mb-4 line-clamp-2">{strat.description}</p>
                  ) : (
                    <div className="mb-4 h-5" />
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      {
                        label: 'Net P&L',
                        value: tradeCount > 0 ? (
                          <>{isProfitable ? '+' : ''}<NumberCounter value={totalPnl} format={(v) => formatCurrency(v)} duration={1} /></>
                        ) : '—',
                        className: tradeCount === 0 ? 'text-muted' : isProfitable ? 'text-success' : 'text-danger'
                      },
                      {
                        label: 'Win Rate',
                        value: tradeCount > 0 ? (
                          <NumberCounter value={winRate} format={(v) => formatPercent(v)} duration={1} />
                        ) : '—',
                        className: tradeCount === 0 ? 'text-muted' : 'text-iris'
                      },
                      {
                        label: 'Trades',
                        value: <NumberCounter value={tradeCount} duration={1} />,
                        className: 'text-primary'
                      },
                      {
                        label: 'Avg/Trade',
                        value: tradeCount > 0 ? (
                          <>{avgPnl >= 0 ? '+' : ''}<NumberCounter value={avgPnl} format={(v) => formatCurrency(v)} duration={1} /></>
                        ) : '—',
                        className: tradeCount === 0 ? 'text-muted' : avgPnl >= 0 ? 'text-success' : 'text-danger'
                      },
                    ].map(m => (
                      <div key={m.label}>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-0.5">{m.label}</p>
                        <p className={cn('text-sm font-bold font-mono tabular-nums', m.className)}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Win-rate bar */}
                  <div className="space-y-1.5 mt-auto">
                    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
                      <span className="text-danger">Loss {tradeCount > 0 ? (100 - winRate).toFixed(0) : 0}%</span>
                      <span className="text-success">Win {tradeCount > 0 ? winRate.toFixed(0) : 0}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden flex bg-surface-2">
                      <div className="h-full bg-success/80 transition-all duration-1000 ease-out rounded-l-full" style={{ width: `${tradeCount > 0 ? winRate : 0}%` }} />
                      <div className="h-full bg-danger/80 transition-all duration-1000 ease-out rounded-r-full" style={{ width: `${tradeCount > 0 ? 100 - winRate : 0}%` }} />
                    </div>
                  </div>

                  {/* Market tags */}
                  {strat.market && strat.market.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-border">
                      {strat.market.map(m => (
                        <span key={m} className="px-2 py-0.5 rounded-lg bg-surface-2 border border-border text-[9px] font-bold text-muted uppercase tracking-widest">{m}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      <StrategyFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
