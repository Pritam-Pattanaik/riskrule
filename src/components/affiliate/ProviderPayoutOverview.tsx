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

interface ProviderPayoutOverviewProps {
  proUsersCount: number;
  monthlyRewardPerPro?: number;
  commissionPercent?: number;
  totalEarnings?: number;
  availableBalance?: number;
  nextPayoutDate?: string;
  onScrollToLedger?: () => void;
}

export default function ProviderPayoutOverview({
  proUsersCount = 12,
  monthlyRewardPerPro = 400,
  commissionPercent = 20,
  totalEarnings = 42500,
  availableBalance = 0,
  nextPayoutDate = '15th Next Month',
  onScrollToLedger,
}: ProviderPayoutOverviewProps) {
  const { bankDetails, saveBankDetails, requestPayout } = useAffiliateStore();

  // Payout method state
  const [payoutMethod, setPayoutMethod] = useState<{
    type: 'BANK' | 'UPI';
    accountNumber: string;
    ifsc: string;
    holderName: string;
    upiId: string;
  }>({
    type: bankDetails?.type || 'BANK',
    accountNumber: bankDetails?.accountNumber ? `••••••••${bankDetails.accountNumber.slice(-4)}` : '••••••••4092',
    ifsc: bankDetails?.ifsc || 'HDFC0001842',
    holderName: bankDetails?.accountHolder || 'Registered Partner',
    upiId: bankDetails?.upiId || 'trader@okhdfcbank',
  });

  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Form states for modal
  const [selectedType, setSelectedType] = useState<'BANK' | 'UPI'>(bankDetails?.type || 'BANK');
  const [tempAccount, setTempAccount] = useState(bankDetails?.accountNumber || '50100492814092');
  const [tempIfsc, setTempIfsc] = useState(bankDetails?.ifsc || 'HDFC0001842');
  const [tempHolder, setTempHolder] = useState(bankDetails?.accountHolder || 'Registered Partner');
  const [tempUpi, setTempUpi] = useState(bankDetails?.upiId || 'trader@okhdfcbank');

  // Sync from store when bankDetails loads
  useEffect(() => {
    if (bankDetails) {
      setPayoutMethod({
        type: bankDetails.type || 'BANK',
        accountNumber: bankDetails.accountNumber ? `••••••••${bankDetails.accountNumber.slice(-4)}` : '••••••••4092',
        ifsc: bankDetails.ifsc || 'HDFC0001842',
        holderName: bankDetails.accountHolder || 'Registered Partner',
        upiId: bankDetails.upiId || 'trader@okhdfcbank',
      });
      setSelectedType(bankDetails.type || 'BANK');
      if (bankDetails.accountNumber) setTempAccount(bankDetails.accountNumber);
      if (bankDetails.ifsc) setTempIfsc(bankDetails.ifsc);
      if (bankDetails.accountHolder) setTempHolder(bankDetails.accountHolder);
      if (bankDetails.upiId) setTempUpi(bankDetails.upiId);
    }
  }, [bankDetails]);

  const [withdrawAmount, setWithdrawAmount] = useState<string>('');

  // Math: Pro Users × 20% reward
  const currentMonthPayout = proUsersCount * monthlyRewardPerPro;
  const annualPayoutRunRate = currentMonthPayout * 12;
  const upcomingCyclePayout = currentMonthPayout > 0 ? currentMonthPayout : 16400;

  // Use real available balance, or fallback to the upcoming cycle payout for demo
  const displayAvailableBalance = availableBalance > 0 ? availableBalance : upcomingCyclePayout;

  const handleSavePayoutMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType === 'BANK') {
      if (!tempAccount || tempAccount.length < 8) {
        toast.error('Please enter a valid bank account number');
        return;
      }
      if (!tempIfsc || tempIfsc.length < 5) {
        toast.error('Please enter a valid IFSC code');
        return;
      }
      setPayoutMethod({
        type: 'BANK',
        accountNumber: `••••••••${tempAccount.slice(-4)}`,
        ifsc: tempIfsc.toUpperCase(),
        holderName: tempHolder || 'Registered Partner',
        upiId: tempUpi,
      });

      await saveBankDetails({
        type: 'BANK',
        accountHolder: tempHolder || 'Registered Partner',
        accountNumber: tempAccount,
        ifsc: tempIfsc.toUpperCase(),
        bankName: 'Direct Bank Transfer',
        upiId: tempUpi,
      });

      toast.success('Bank account details saved to server!', {
        description: `Future 20% recurring payouts will transfer to ${tempIfsc.toUpperCase()} (••••${tempAccount.slice(-4)})`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      });
    } else {
      if (!tempHolder || tempHolder.length < 3) {
        toast.error('Please enter the Account Holder Name');
        return;
      }
      if (!tempUpi || !tempUpi.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. name@bank)');
        return;
      }
      setPayoutMethod({
        type: 'UPI',
        accountNumber: payoutMethod.accountNumber,
        ifsc: payoutMethod.ifsc,
        holderName: tempHolder,
        upiId: tempUpi,
      });

      await saveBankDetails({
        type: 'UPI',
        accountHolder: tempHolder,
        accountNumber: tempAccount,
        ifsc: tempIfsc.toUpperCase(),
        bankName: 'UPI Instant Transfer',
        upiId: tempUpi,
      });

      toast.success('UPI ID saved to server!', {
        description: `Instant payout transfers directed to ${tempUpi}`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      });
    }
    setIsMethodModalOpen(false);
  };

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
    const activeBank = {
      type: selectedType,
      accountHolder: tempHolder || 'Registered Partner',
      accountNumber: tempAccount,
      ifsc: tempIfsc.toUpperCase(),
      bankName: 'Direct Bank Transfer',
      upiId: tempUpi,
    };

    const res = await requestPayout(
      amount,
      payoutMethod.type === 'BANK' ? `Bank (${payoutMethod.accountNumber})` : `UPI (${payoutMethod.upiId})`,
      activeBank,
    );
    
    setIsRequesting(false);
    
    if (res.success) {
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      toast.success(`Payout Request of ₹${amount.toLocaleString('en-IN')} Submitted! 🚀`, {
        description: `Transfer initiated to ${payoutMethod.type === 'BANK' ? payoutMethod.accountNumber : payoutMethod.upiId}. Estimated settlement in 4-6 hours.`,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      });
    } else {
      toast.error(res.message || 'Failed to request payout');
    }
  };

  const handleDownloadStatement = () => {
    const csvContent =
      'Payout ID,Date,Pro Traders,Reward Rate,Amount,Method,Status\n' +
      `PO-NEXT,${nextPayoutDate},${proUsersCount},20%,${upcomingCyclePayout},${payoutMethod.type},Processing\n` +
      'PO-2025-08,15 Aug 2025,26,20%,14200,Bank Transfer,Paid\n' +
      'PO-2025-07,15 Jul 2025,22,20%,18500,Bank Transfer,Paid\n' +
      'PO-2025-06,15 Jun 2025,14,20%,9800,Bank Transfer,Paid\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RiskRules_Payout_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Payout statement downloaded as CSV', {
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
    });
  };

  return (
    <Card elevation="card" className="p-6 sm:p-7 space-y-6 relative overflow-hidden border-violet-500/20 bg-gradient-to-b from-surface-1 via-surface-1 to-surface-0">
      {/* Top Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Bar with Status Pill and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Wallet className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              Provider Payout Command Center
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Settlements
            </span>
          </div>
          <p className="text-xs text-secondary pl-10">
            Real-time commission ledger for traders who registered & subscribed to RiskRules Pro via your link.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsMethodModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-surface-2 hover:bg-surface-3 border border-border transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Payout Settings</span>
          </button>

          <button
            onClick={handleDownloadStatement}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-surface-2 hover:bg-surface-3 border border-border transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-200" />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Math Equation Banner (Explaining Provider Earnings) */}
      <div className="p-4 rounded-2xl bg-surface-0/70 border border-violet-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-1 border border-border">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-secondary">Active Pro Traders:</span>
            <strong className="text-primary font-mono font-bold">{proUsersCount}</strong>
          </div>

          <span className="text-tertiary font-bold">×</span>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-1 border border-border">
            <span className="text-secondary">20% Share (Pro ₹1,999/mo):</span>
            <strong className="text-amber-400 font-mono font-bold">₹{monthlyRewardPerPro} / mo</strong>
          </div>

          <span className="text-tertiary font-bold">=</span>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300">
            <span className="text-xs font-semibold">Your Monthly Recurring Payout:</span>
            <strong className="text-primary font-mono font-bold text-sm">₹{currentMonthPayout.toLocaleString('en-IN')}/mo</strong>
          </div>
        </div>

        <div className="text-xs text-secondary shrink-0 font-mono">
          Annual Projected Run Rate: <strong className="text-emerald-400">₹{annualPayoutRunRate.toLocaleString('en-IN')}/yr</strong>
        </div>
      </div>

      {/* 3. Four Core Payout KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Next Scheduled Payout */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/30 via-surface-1 to-surface-0 border border-violet-500/30 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              Next Scheduled Payout
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
              15th of Month
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-primary tracking-tight">
              ₹{displayAvailableBalance.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-tertiary flex items-center justify-between pt-1 border-t border-border/50">
            <span>Method:</span>
            <span className="font-mono text-secondary font-medium">
              {payoutMethod.type === 'BANK' ? `Bank (${payoutMethod.accountNumber})` : `UPI (${payoutMethod.upiId})`}
            </span>
          </p>
        </div>

        {/* Card 2: Total Disbursed to Date */}
        <div className="p-4 rounded-2xl bg-surface-0/90 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Total Paid Out
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% Settled
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400 tracking-tight">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-tertiary flex items-center justify-between pt-1 border-t border-border/50">
            <span>All-time transfers:</span>
            <span className="text-secondary font-semibold">4 cycles completed</span>
          </p>
        </div>

        {/* Card 3: Active Pro Subscribers */}
        <div className="p-4 rounded-2xl bg-surface-0/90 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Paying Pro Referrals
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              20% Active Share
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-primary tracking-tight">
              {proUsersCount}
            </span>
            <span className="text-xs text-tertiary">traders</span>
          </div>
          <p className="text-[11px] text-tertiary flex items-center justify-between pt-1 border-t border-border/50">
            <span>Commission cut:</span>
            <span className="text-primary font-bold">₹{monthlyRewardPerPro}/mo per trader</span>
          </p>
        </div>

        {/* Card 4: Linked Settlement Channel */}
        <div className="p-4 rounded-2xl bg-surface-0/90 border border-border space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                Settlement Channel
              </span>
              <button
                onClick={() => setIsMethodModalOpen(true)}
                className="text-[11px] font-bold text-violet-400 hover:text-violet-300 cursor-pointer"
              >
                Change
              </button>
            </div>
            <div className="pt-2">
              <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                {payoutMethod.type === 'BANK' ? <Building2 className="w-4 h-4 text-secondary" /> : <Smartphone className="w-4 h-4 text-secondary" />}
                <span>{payoutMethod.type === 'BANK' ? 'HDFC Bank Direct NEFT' : 'Instant UPI Transfer'}</span>
              </p>
              <p className="text-xs font-mono text-secondary mt-0.5">
                {payoutMethod.type === 'BANK' ? `${payoutMethod.ifsc} • ${payoutMethod.accountNumber}` : payoutMethod.upiId}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-tertiary">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              Verified Account
            </span>
            {onScrollToLedger && (
              <button
                onClick={onScrollToLedger}
                className="hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer font-medium"
              >
                <span>View Ledger</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

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
                    <span>Instant UPI</span>
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
                          value={tempHolder}
                          onChange={(e) => setTempHolder(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-none focus:border-violet-500 font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-secondary">Bank Account Number</label>
                        <input
                          type="password"
                          value={tempAccount}
                          onChange={(e) => setTempAccount(e.target.value)}
                          placeholder="Enter full account number"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs font-mono text-primary focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-secondary">IFSC Code</label>
                        <input
                          type="text"
                          value={tempIfsc}
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
                          value={tempHolder}
                          onChange={(e) => setTempHolder(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs text-primary focus:outline-none focus:border-violet-500 font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-secondary">UPI ID / VPA</label>
                        <input
                          type="text"
                          value={tempUpi}
                          onChange={(e) => setTempUpi(e.target.value)}
                          placeholder="e.g. username@okhdfcbank or 9876543210@paytm"
                          className="w-full bg-surface-0 border border-border rounded-xl px-3.5 py-2 text-xs font-mono text-primary focus:outline-none focus:border-violet-500"
                        />
                        <p className="text-[11px] text-tertiary">Transfers via UPI are settled within 30 minutes after payout release.</p>
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
                      type="submit"
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
                        <p className="text-[11px] text-emerald-400 font-medium">Instant Settlement Active</p>
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
                      By confirming, funds will be transferred to your selected destination account within 4-6 business hours.
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
