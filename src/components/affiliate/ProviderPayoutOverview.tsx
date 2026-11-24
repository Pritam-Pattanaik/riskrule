import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Calendar,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Building2,
  Smartphone,
  ShieldCheck,
  X,
  FileSpreadsheet,
  Zap,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/Card';
import { useAffiliateStore } from '../../stores/affiliateStore';

export default function ProviderPayoutOverview() {
  const { bankDetails, saveBankDetails, requestPayout, metrics } = useAffiliateStore();
  const payoutMethod = bankDetails;
  const displayAvailableBalance = metrics.availableBalance;
  const configured = bankDetails.type === 'UPI' ? Boolean(bankDetails.upiId) : Boolean(bankDetails.accountNumber && bankDetails.ifsc);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const [selectedType, setSelectedType] = useState(bankDetails.type);
  const [tempAccount, setTempAccount] = useState('');
  const [tempIfsc, setTempIfsc] = useState('');
  const [tempHolder, setTempHolder] = useState('');
  const [tempUpi, setTempUpi] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [saving, setSaving] = useState(false);

  function editMethod() {
    setSelectedType(bankDetails.type);
    setTempAccount(bankDetails.accountNumber);
    setTempIfsc(bankDetails.ifsc);
    setTempHolder(bankDetails.accountHolder);
    setTempUpi(bankDetails.upiId);
    setIsMethodModalOpen(true);
  }

  async function handleSavePayoutMethod(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    if (!tempHolder.trim() || (selectedType === 'BANK' ? !tempAccount.trim() || !tempIfsc.trim() : !tempUpi.includes('@'))) {
      toast.error('Complete the payout details before saving.');
      return;
    }
    setSaving(true);
    try {
      const result = await saveBankDetails({ type: selectedType, accountHolder: tempHolder.trim(),
        accountNumber: selectedType === 'BANK' ? tempAccount.trim() : '', ifsc: selectedType === 'BANK' ? tempIfsc.trim().toUpperCase() : '',
        bankName: selectedType === 'BANK' ? 'Bank transfer' : 'UPI', upiId: selectedType === 'UPI' ? tempUpi.trim() : '' });
      if (!result.success) { toast.error(result.error || 'Could not save payout details.'); return; }
      setIsMethodModalOpen(false);
      toast.success('Payout details saved.');
    } finally { setSaving(false); }
  }

  const handleConfirmEarlyPayout = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0 || isNaN(amount)) {
      toast.error('Please enter a valid payout amount');
      return;
    }
    if (amount > displayAvailableBalance) {
      toast.error('Requested amount exceeds available balance');
      return;
    }

    setIsRequesting(true);
    const res = await requestPayout(amount, bankDetails.type, bankDetails);
    setIsRequesting(false);
    
    if (res.success) {
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      toast.success('Payout request submitted.');
    } else {
      toast.error(res.message || 'Failed to request payout');
    }
  };

  return (
    <Card className="desk-panel space-y-4">
      <h2 className="text-lg font-semibold">Payouts</h2>
      <dl className="grid grid-cols-2 gap-4">
        {[['Total earnings', metrics.totalEarnings], ['Available balance', displayAvailableBalance]].map(([name,value]) =>
          <div key={name}><dt className="text-sm text-secondary">{name}</dt><dd className="mt-1 text-xl font-semibold tabular-nums">₹{value.toLocaleString('en-IN')}</dd></div>)}
      </dl>
      <div className="flex flex-wrap gap-2"><button className="desk-button" onClick={editMethod}>Payout settings</button>
        <button className="desk-button" disabled={!configured || displayAvailableBalance <= 0} onClick={() => setIsWithdrawModalOpen(true)}>Request payout</button></div>
      {/* Modal 1: Update Payout Settings (Bank / UPI) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMethodModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-surface-1 border border-border rounded-2xl p-6 shadow-2xl space-y-5 relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-primary">Configure Payout Method</h3>
                      <p className="text-xs text-secondary">Where should we transfer your 20% recurring earnings?</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMethodModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-surface-2 text-tertiary hover:text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tab Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-0 border border-border">
                  <button
                    type="button"
                    onClick={() => setSelectedType('BANK')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedType === 'BANK'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Bank Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedType('UPI')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedType === 'UPI'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>UPI</span>
                  </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSavePayoutMethod} className="space-y-4">
                  {selectedType === 'BANK' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-secondary">Account Holder Name</label>
                        <input
                          type="text"
                          value={tempHolder} aria-label="Account holder name"
                          onChange={(e) => setTempHolder(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-none focus:border-violet-500 font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-secondary">Bank Account Number</label>
                        <input
                          type="password"
                          value={tempAccount} aria-label="Bank account number"
                          onChange={(e) => setTempAccount(e.target.value)}
                          placeholder="Enter full account number"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs font-mono text-primary focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-secondary">IFSC Code</label>
                        <input
                          type="text"
                          value={tempIfsc} aria-label="IFSC code"
                          onChange={(e) => setTempIfsc(e.target.value.toUpperCase())}
                          placeholder="e.g. HDFC0001842"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs font-mono text-primary uppercase focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-secondary">Account Holder Name</label>
                        <input
                          type="text"
                          value={tempHolder} aria-label="Account holder name"
                          onChange={(e) => setTempHolder(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-none focus:border-violet-500 font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-secondary">UPI ID / VPA</label>
                        <input
                          type="text"
                          value={tempUpi} aria-label="UPI ID"
                          onChange={(e) => setTempUpi(e.target.value)}
                          placeholder="e.g. username@okhdfcbank or 9876543210@paytm"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs font-mono text-primary focus:outline-none focus:border-violet-500"
                        />
                        <p className="text-[11px] text-tertiary">Enter the UPI ID where you want to receive payouts.</p>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setIsMethodModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-surface-2 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" disabled={saving}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors cursor-pointer"
                    >
                      Save Details
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Modal 2: Premium Request Payout Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isWithdrawModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-gradient-to-b from-surface-1 to-surface-0 border border-violet-500/20 rounded-[2rem] p-6 shadow-[0_0_80px_-20px_rgba(139,92,246,0.15)] relative overflow-hidden"
              >
                {/* Top ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-violet-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                        <Zap className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary tracking-tight">Withdraw Funds</h3>
                        <p className="text-[11px] text-emerald-400 font-medium">Review your payout request</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsWithdrawModalOpen(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-2 hover:bg-surface-3 text-tertiary hover:text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Input Area (Massive Banking Style) */}
                  <div className="py-6 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-semibold text-secondary uppercase tracking-widest">Amount to transfer</span>
                    <div className="flex items-center justify-center gap-1 w-full relative group">
                      <span className="text-3xl font-display font-bold text-tertiary group-focus-within:text-primary transition-colors">₹</span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0"
                        max={displayAvailableBalance}
                        className="w-auto min-w-[2ch] max-w-full bg-transparent text-5xl sm:text-6xl font-display font-black text-primary text-center focus:outline-none placeholder:text-tertiary/30 caret-violet-500"
                        style={{ width: `${Math.max(withdrawAmount.length, 1)}ch` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[11px] text-tertiary font-medium">
                        Available: <span className="text-primary font-mono">₹{displayAvailableBalance.toLocaleString('en-IN')}</span>
                      </span>
                      <button 
                        onClick={() => setWithdrawAmount(displayAvailableBalance.toString())}
                        className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  {/* Destination Details */}
                  <div className="mt-4 p-4 rounded-2xl bg-surface-1/50 border border-border backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center border border-border">
                          {payoutMethod.type === 'BANK' ? <Building2 className="w-3.5 h-3.5 text-secondary" /> : <Smartphone className="w-3.5 h-3.5 text-secondary" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{payoutMethod.type === 'BANK' ? 'Bank Transfer' : 'UPI Transfer'}</p>
                          <p className="text-[10px] font-mono text-secondary mt-0.5">{payoutMethod.type === 'BANK' ? `••••${payoutMethod.accountNumber.slice(-4)}` : payoutMethod.upiId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-400">Free</p>
                        <p className="text-[10px] text-tertiary">Processing Fee</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer / Actions */}
                  <div className="pt-6">
                    <button
                      onClick={handleConfirmEarlyPayout}
                      disabled={isRequesting || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > displayAvailableBalance}
                      className="w-full group relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold text-white overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {/* Dynamic animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 transition-transform group-hover:scale-[1.02]" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity" />
                      
                      <span className="relative z-10 flex items-center gap-2">
                        {isRequesting ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin" />
                            Processing Transfer...
                          </>
                        ) : (
                          <>
                            Request Transfer
                            <ArrowUpRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>
                    <p className="text-[10px] text-tertiary text-center mt-4">
                      You can track the status of this request in payout history.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </Card>
  );
}
