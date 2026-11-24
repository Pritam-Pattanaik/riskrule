import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useTradeStrategies } from '../../hooks/useTradeStrategies';
import { Trade } from '../../types';
import Button from '../ui/Button';
import { getLocalDateTimeString } from '../../lib/dateUtils';

interface TradeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Trade | null;
}

export default function TradeFormModal({ isOpen, onClose, onSave, initialData }: TradeFormModalProps) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const strategies = useTradeStrategies(isOpen);
  const [formData, setFormData] = useState({
    symbol: '',
    market: 'NSE' as Trade['market'],
    instrumentType: 'EQ' as Trade['instrumentType'],
    direction: 'LONG' as Trade['direction'],
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    charges: '',
    strategyId: '',
    date: getLocalDateTimeString(),
    notes: '',
    setupDescription: '',
    mindset: '',
    learnings: '',
    disciplineScore: '',
    stopLoss: '',
    mistakes: [] as string[],
    checklist: {} as Record<string, boolean>,
  });

  useEffect(() => {
    setSaveError('');
    if (initialData) {
      setFormData({
        symbol: initialData.symbol,
        market: initialData.market,
        instrumentType: initialData.instrumentType,
        direction: initialData.direction,
        entryPrice: initialData.entryPrice.toString(),
        exitPrice: initialData.exitPrice.toString(),
        quantity: initialData.quantity.toString(),
        charges: initialData.charges.toString(),
        strategyId: initialData.strategyId || '',
        date: getLocalDateTimeString(new Date(initialData.date)),
        notes: initialData.decisionNotes || '',
        setupDescription: initialData.setupDescription || '',
        mindset: initialData.mindset || '',
        learnings: initialData.learnings || '',
        disciplineScore: initialData.disciplineScore ? initialData.disciplineScore.toString() : '',
        stopLoss: initialData.stopLoss ? initialData.stopLoss.toString() : '',
        mistakes: initialData.mistakes || [],
        checklist: initialData.checklist || {},
      });
    } else {
      setFormData({
        symbol: '',
        market: 'NSE',
        instrumentType: 'EQ',
        direction: 'LONG',
        entryPrice: '',
        exitPrice: '',
        quantity: '',
        charges: '',
        strategyId: '',
        date: getLocalDateTimeString(),
        notes: '',
        setupDescription: '',
        mindset: '',
        learnings: '',
        disciplineScore: '',
        stopLoss: '',
        mistakes: [],
        checklist: {},
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaveError('');
    const entry = parseFloat(formData.entryPrice) || 0;
    const exit = parseFloat(formData.exitPrice) || 0;
    const qty = parseInt(formData.quantity) || 0;
    const charges = parseFloat(formData.charges) || 0;
    
    // Calculate PNL
    let pnl = 0;
    if (formData.direction === 'LONG') {
      pnl = (exit - entry) * qty;
    } else {
      pnl = (entry - exit) * qty;
    }
    
    const netPnl = pnl - charges;
    const status = netPnl > 0 ? 'WIN' : netPnl < 0 ? 'LOSS' : 'BREAKEVEN';

    const trade = {
      symbol: formData.symbol.trim().toUpperCase(),
      market: formData.market,
      instrumentType: formData.instrumentType,
      direction: formData.direction,
      entryPrice: entry,
      exitPrice: exit,
      quantity: qty,
      pnl,
      charges,
      netPnl,
      status,
      date: new Date(formData.date).toISOString(),
      source: 'manual',
      strategyId: formData.strategyId || null,
      decisionNotes: formData.notes,
      setupDescription: formData.setupDescription,
      mindset: formData.mindset,
      learnings: formData.learnings,
      isManualOverride: !!formData.disciplineScore,
      manualScore: formData.disciplineScore ? parseInt(formData.disciplineScore) : undefined,
      disciplineScore: formData.disciplineScore ? parseInt(formData.disciplineScore) : undefined,
      stopLoss: parseFloat(formData.stopLoss) || null,
      mistakes: formData.mistakes,
      checklist: formData.checklist,
    };
    setSaving(true);
    try {
      await onSave(trade);
      onClose();
    } catch {
      setSaveError('Could not save this trade. Your entries are still here. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={saving ? () => {} : onClose}
      title={initialData ? 'Edit trade' : 'Log a trade'}
      footer={<>
        <Button variant="ghost" disabled={saving} onClick={onClose}>Cancel</Button>
        <Button type="submit" form="trade-form" disabled={saving} className="bg-none bg-[#22C55E] text-[#0F172A] hover:bg-[#0E9F6E] shadow-none">
          {saving ? 'Saving…' : 'Save trade'}
        </Button>
      </>}
    >
          <form id="trade-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="trade-symbol" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Symbol</label>
                <input id="trade-symbol"
                  required
                  type="text"
                  pattern={String.raw`.*\S.*`}
                  placeholder="e.g. NIFTY or AAPL"
                  className="input-base uppercase"
                  value={formData.symbol}
                  onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="trade-date" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Date & Time</label>
                <input id="trade-date"
                  required
                  type="datetime-local"
                  className="input-base"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="trade-market" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Market</label>
                <select id="trade-market"
                  className="input-base"
                  value={formData.market}
                  onChange={e => setFormData({ ...formData, market: e.target.value as Trade['market'] })}
                >
                  <option value="NSE">NSE</option>
                  <option value="BSE">BSE</option>
                  <option value="F&O">F&O</option>
                  <option value="Crypto">Crypto</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="trade-instrument" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Instrument</label>
                <select id="trade-instrument"
                  className="input-base"
                  value={formData.instrumentType}
                  onChange={e => setFormData({ ...formData, instrumentType: e.target.value as Trade['instrumentType'] })}
                >
                  <option value="EQ">Equity</option>
                  <option value="CE">Call (CE)</option>
                  <option value="PE">Put (PE)</option>
                  <option value="FUT">Future</option>
                  <option value="CRYPTO">Crypto</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="trade-direction" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Direction</label>
                <select id="trade-direction"
                  className="input-base"
                  value={formData.direction}
                  onChange={e => setFormData({ ...formData, direction: e.target.value as Trade['direction'] })}
                >
                  <option value="LONG">Long</option>
                  <option value="SHORT">Short</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="trade-quantity" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Quantity</label>
                <input id="trade-quantity"
                  required
                  type="number"
                  min="1"
                  step="1"
                  className="input-base"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="trade-entry" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Entry Price</label>
                <input id="trade-entry"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-base font-number"
                  value={formData.entryPrice}
                  onChange={e => setFormData({ ...formData, entryPrice: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="trade-exit" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Exit Price</label>
                <input id="trade-exit"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-base font-number"
                  value={formData.exitPrice}
                  onChange={e => setFormData({ ...formData, exitPrice: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="trade-charges" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Charges (Optional)</label>
                <input id="trade-charges"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-base font-number"
                  value={formData.charges}
                  onChange={e => setFormData({ ...formData, charges: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="trade-stop" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Stop Loss</label>
                <input id="trade-stop"
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-base font-number"
                  value={formData.stopLoss}
                  onChange={e => setFormData({ ...formData, stopLoss: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="trade-mistakes" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Mistakes (comma-separated)</label>
              <input id="trade-mistakes"
                type="text"
                placeholder="e.g. FOMO, early exit, oversized"
                className="input-base"
                value={formData.mistakes.join(', ')}
                onChange={e => setFormData({ ...formData, mistakes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="trade-strategy" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Strategy (Optional)</label>
                <select id="trade-strategy" className="input-base" value={formData.strategyId}
                  onChange={e => setFormData({ ...formData, strategyId: e.target.value })}>
                  <option value="">No strategy</option>
                  {strategies.data?.map(strategy => <option key={strategy.id} value={strategy.id}>{strategy.name}</option>)}
                </select>
                {strategies.isError && <p className="text-xs text-danger">Strategies could not be loaded.</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="trade-score" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Manual Score Override (1-5)</label>
                </div>
                <select id="trade-score"
                  className="input-base"
                  value={formData.disciplineScore}
                  onChange={e => setFormData({ ...formData, disciplineScore: e.target.value })}
                >
                  <option value="">Not rated</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="trade-setup" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Setup Description</label>
              <textarea id="trade-setup"
                rows={2}
                className="input-base resize-none"
                placeholder="Describe your setup..."
                value={formData.setupDescription}
                onChange={e => setFormData({ ...formData, setupDescription: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="trade-mindset" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Mindset</label>
              <textarea id="trade-mindset"
                rows={2}
                className="input-base resize-none"
                placeholder="What was your mental state?"
                value={formData.mindset}
                onChange={e => setFormData({ ...formData, mindset: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="trade-notes" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Decision Notes</label>
              <textarea id="trade-notes"
                rows={2}
                className="input-base resize-none"
                placeholder="Why did you take this trade?"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="trade-learnings" className="text-[11px] text-secondary font-medium uppercase tracking-wider">Learnings</label>
              <textarea id="trade-learnings"
                rows={2}
                className="input-base resize-none"
                placeholder="What did you learn from this trade?"
                value={formData.learnings}
                onChange={e => setFormData({ ...formData, learnings: e.target.value })}
              ></textarea>
            </div>

            {saveError && <p role="alert" className="text-sm text-danger">{saveError}</p>}
          </form>
    </Modal>
  );
}
