import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Sparkles,
  Users,
  User,
  ExternalLink,
  Search,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Wallet,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  CreditCard,
  Building2,
  Smartphone,
  Send,
  HelpCircle,
  Layers,
  Percent,
  CheckCheck,
  AlertTriangle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import AnimatedNumber from '../../components/admin/AnimatedNumber';
import { SkeletonCard, SkeletonTable } from '../../components/admin/SkeletonLoader';
import { cn } from '../../lib/cn';
import { EmptyState } from '../../components/ui/EmptyState';

interface AffiliateStats {
  totalAffiliates: number;
  totalClicks: number;
  totalSignups: number;
  totalConversions: number;
  conversionRate: number;
  totalCommissions: number;
  paidPayouts: number;
  pendingPayouts: number;
  commissionPercent: number;
  monthlyRewardPerPro: number;
}

interface ReferredTrader {
  id: string;
  fullName: string | null;
  email: string;
  plan: string;
  createdAt: string;
}

export interface BankDetails {
  type: 'BANK' | 'UPI';
  accountHolder?: string;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  upiId?: string;
}

interface AffiliatePartner {
  id: string;
  email: string;
  fullName: string;
  role: string;
  plan: string;
  referralCode: string;
  clicks: number;
  signupsCount: number;
  conversionsCount: number;
  conversionRate: number;
  totalEarnings: number;
  totalPaid: number;
  availableBalance: number;
  pendingPayouts: number;
  createdAt: string;
  recentReferrals: ReferredTrader[];
  bankDetails?: BankDetails | null;
}

interface PayoutRecord {
  id: string;
  affiliateId: string;
  amount: number;
  currency: string;
  referralsCount: number;
  payoutMethod: string;
  status: 'Processing' | 'Paid' | 'Rejected' | 'Pending';
  invoiceId: string;
  createdAt: string;
  bankDetails?: BankDetails | null;
  affiliate?: {
    id: string;
    fullName: string | null;
    email: string;
    referralCode: string | null;
  };
}

interface LiveReferralItem {
  id: string;
  fullName: string | null;
  email: string;
  plan: string;
  createdAt: string;
  referrer: {
    id: string;
    fullName: string | null;
    email: string;
    referralCode: string | null;
  } | null;
}

const inputCls =
  'bg-canvas border border-border text-primary rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-muted';

// Bank / UPI Coordinates Component
function BankCoordinatesBlock({
  details,
  fallbackMethod,
  onCopy,
  copiedField,
}: {
  details?: BankDetails | null;
  fallbackMethod?: string;
  onCopy: (text: string, label: string) => void;
  copiedField: string | null;
}) {
  if (!details && (!fallbackMethod || fallbackMethod === 'Bank Transfer')) {
    return (
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <div>
          <div className="font-semibold text-amber-300">No Bank Coordinates Registered</div>
          <div className="text-[11px] text-amber-300/80 mt-0.5">
            This affiliate partner has not saved their bank or UPI account in their affiliate portal yet.
          </div>
        </div>
      </div>
    );
  }

  if (!details && fallbackMethod) {
    return (
      <div className="p-3.5 rounded-xl bg-surface-1 border border-border/80 space-y-2">
        <div className="text-xs font-semibold text-primary flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-iris" />
            <span>Saved Payout Coordinates</span>
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-surface-2 font-mono text-xs text-primary flex items-center justify-between">
          <span className="break-all">{fallbackMethod}</span>
          <button
            type="button"
            onClick={() => onCopy(fallbackMethod, 'Payout Details')}
            className="p-1 text-secondary hover:text-primary transition-colors ml-2 shrink-0"
            title="Copy Details"
          >
            {copiedField === fallbackMethod ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  }

  const isUpi = details?.type === 'UPI';

  return (
    <div className="p-3.5 rounded-xl bg-surface-1/90 border border-border/80 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
          {isUpi ? (
            <Smartphone className="w-4 h-4 text-iris" />
          ) : (
            <Building2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{isUpi ? 'Registered UPI Coordinates' : 'Registered Bank Coordinates'}</span>
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {isUpi ? 'Instant UPI Mode' : 'Direct IMPS / NEFT'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Beneficiary Name */}
        <div className="p-2.5 rounded-lg bg-surface-2/70 border border-border/60 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-tertiary">Beneficiary Name</div>
            <div className="font-semibold text-primary text-xs">
              {details?.accountHolder || 'Not specified'}
            </div>
          </div>
          {details?.accountHolder && (
            <button
              type="button"
              onClick={() => onCopy(details.accountHolder!, 'Beneficiary Name')}
              className="p-1 text-secondary hover:text-primary transition-colors"
              title="Copy Beneficiary Name"
            >
              {copiedField === details.accountHolder ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* UPI Mode */}
        {isUpi ? (
          <div className="p-2.5 rounded-lg bg-surface-2/70 border border-border/60 flex items-center justify-between sm:col-span-2">
            <div>
              <div className="text-[10px] text-tertiary">UPI ID / Virtual Payment Address</div>
              <div className="font-mono font-bold text-iris text-sm">
                {details?.upiId || 'Not provided'}
              </div>
            </div>
            {details?.upiId && (
              <button
                type="button"
                onClick={() => onCopy(details.upiId!, 'UPI ID')}
                className="px-2.5 py-1 rounded-lg bg-iris/10 text-iris hover:bg-iris/20 text-xs font-medium flex items-center gap-1.5 transition-colors border border-iris/20"
                title="Copy UPI ID"
              >
                {copiedField === details.upiId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy UPI</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Bank Name */}
            <div className="p-2.5 rounded-lg bg-surface-2/70 border border-border/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-tertiary">Bank Name</div>
                <div className="font-semibold text-primary text-xs">
                  {details?.bankName || 'Not specified'}
                </div>
              </div>
              {details?.bankName && (
                <button
                  type="button"
                  onClick={() => onCopy(details.bankName!, 'Bank Name')}
                  className="p-1 text-secondary hover:text-primary transition-colors"
                  title="Copy Bank Name"
                >
                  {copiedField === details.bankName ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Account Number */}
            <div className="p-2.5 rounded-lg bg-surface-2/70 border border-border/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-tertiary">Account Number</div>
                <div className="font-mono font-bold text-primary text-sm tracking-wide">
                  {details?.accountNumber || 'Not specified'}
                </div>
              </div>
              {details?.accountNumber && (
                <button
                  type="button"
                  onClick={() => onCopy(details.accountNumber!, 'Account Number')}
                  className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium flex items-center gap-1 transition-colors border border-emerald-500/20"
                  title="Copy Account Number"
                >
                  {copiedField === details.accountNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy A/C</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* IFSC Code */}
            <div className="p-2.5 rounded-lg bg-surface-2/70 border border-border/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-tertiary">IFSC Code</div>
                <div className="font-mono font-bold text-iris text-sm tracking-wider">
                  {details?.ifsc || 'Not specified'}
                </div>
              </div>
              {details?.ifsc && (
                <button
                  type="button"
                  onClick={() => onCopy(details.ifsc!, 'IFSC Code')}
                  className="px-2 py-1 rounded bg-iris/10 text-iris hover:bg-iris/20 text-xs font-medium flex items-center gap-1 transition-colors border border-iris/20"
                  title="Copy IFSC"
                >
                  {copiedField === details.ifsc ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy IFSC</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}

        {/* If Bank mode but also has UPI ID */}
        {!isUpi && details?.upiId && (
          <div className="p-2.5 rounded-lg bg-surface-2/70 border border-border/60 flex items-center justify-between sm:col-span-2">
            <div>
              <div className="text-[10px] text-tertiary">Alternative UPI VPA</div>
              <div className="font-mono text-xs text-primary">{details.upiId}</div>
            </div>
            <button
              type="button"
              onClick={() => onCopy(details.upiId!, 'UPI ID')}
              className="p-1 text-secondary hover:text-primary transition-colors"
              title="Copy UPI"
            >
              {copiedField === details.upiId ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAffiliates() {
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'partners' | 'payouts' | 'referrals' | 'settings'>('partners');

  // Stats
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Partners state
  const [partners, setPartners] = useState<AffiliatePartner[]>([]);
  const [totalPartners, setTotalPartners] = useState(0);
  const [partnerPage, setPartnerPage] = useState(1);
  const [partnerTotalPages, setPartnerTotalPages] = useState(1);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [expandedPartnerIds, setExpandedPartnerIds] = useState<Set<string>>(new Set());

  // Payouts state
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [payoutPage, setPayoutPage] = useState(1);
  const [payoutTotalPages, setPayoutTotalPages] = useState(1);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('ALL');
  const [loadingPayouts, setLoadingPayouts] = useState(true);
  const [updatingPayoutId, setUpdatingPayoutId] = useState<string | null>(null);

  // Live referrals state
  const [referrals, setReferrals] = useState<LiveReferralItem[]>([]);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralPage, setReferralPage] = useState(1);
  const [referralTotalPages, setReferralTotalPages] = useState(1);
  const [loadingReferrals, setLoadingReferrals] = useState(true);

  // Direct Payout Modal
  const [directPayoutModal, setDirectPayoutModal] = useState<{
    isOpen: boolean;
    partner: AffiliatePartner | null;
    amount: number;
    method: string;
    notes: string;
  }>({
    isOpen: false,
    partner: null,
    amount: 0,
    method: 'Bank Transfer (IMPS/NEFT)',
    notes: '',
  });
  const [processingDirectPayout, setProcessingDirectPayout] = useState(false);

  // Copy helper state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Approve Payout Modal state
  const [approvePayoutModal, setApprovePayoutModal] = useState<{
    isOpen: boolean;
    payout: PayoutRecord | null;
    reference: string;
  }>({
    isOpen: false,
    payout: null,
    reference: '',
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(partnerSearch);
      setPartnerPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [partnerSearch]);

  // Fetch KPI Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await api.get<AffiliateStats>('/admin/affiliates/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch affiliate stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Partners List
  const fetchPartners = useCallback(async () => {
    try {
      setLoadingPartners(true);
      const params = new URLSearchParams({
        page: partnerPage.toString(),
        limit: '10',
      });
      if (debouncedSearch) params.set('search', debouncedSearch);

      const data = await api.get<{
        affiliates: AffiliatePartner[];
        total: number;
        totalPages: number;
      }>(`/admin/affiliates/list?${params}`);

      setPartners(data.affiliates || []);
      setTotalPartners(data.total || 0);
      setPartnerTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setLoadingPartners(false);
    }
  }, [partnerPage, debouncedSearch]);

  // Fetch Payout Requests
  const fetchPayouts = useCallback(async () => {
    try {
      setLoadingPayouts(true);
      const params = new URLSearchParams({
        page: payoutPage.toString(),
        limit: '15',
        status: payoutStatusFilter,
      });

      const data = await api.get<{
        payouts: PayoutRecord[];
        total: number;
        totalPages: number;
      }>(`/admin/affiliates/payouts?${params}`);

      setPayouts(data.payouts || []);
      setTotalPayouts(data.total || 0);
      setPayoutTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch payouts:', err);
    } finally {
      setLoadingPayouts(false);
    }
  }, [payoutPage, payoutStatusFilter]);

  // Fetch Live Referrals
  const fetchReferrals = useCallback(async () => {
    try {
      setLoadingReferrals(true);
      const params = new URLSearchParams({
        page: referralPage.toString(),
        limit: '15',
      });

      const data = await api.get<{
        referrals: LiveReferralItem[];
        total: number;
        totalPages: number;
      }>(`/admin/affiliates/referrals?${params}`);

      setReferrals(data.referrals || []);
      setTotalReferrals(data.total || 0);
      setReferralTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoadingReferrals(false);
    }
  }, [referralPage]);

  // Initial Load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Load active tab data
  useEffect(() => {
    if (activeTab === 'partners') {
      fetchPartners();
    } else if (activeTab === 'payouts') {
      fetchPayouts();
    } else if (activeTab === 'referrals') {
      fetchReferrals();
    }
  }, [activeTab, fetchPartners, fetchPayouts, fetchReferrals]);

  // Toggle partner accordion
  const togglePartnerExpand = (id: string) => {
    setExpandedPartnerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Copy code helper
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Copy text helper
  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(text);
    toast.success(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Update Payout Status (Approve or Reject)
  const handleUpdatePayoutStatus = async (id: string, newStatus: 'Paid' | 'Rejected', notes?: string) => {
    try {
      setUpdatingPayoutId(id);
      await api.patch(`/admin/affiliates/payouts/${id}/status`, {
        status: newStatus,
        notes: notes || `Updated to ${newStatus} by Super Admin`,
      });

      toast.success(
        newStatus === 'Paid'
          ? 'Payout approved and marked as Paid! Notification dispatched.'
          : 'Payout request rejected.',
      );
      fetchPayouts();
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update payout status');
    } finally {
      setUpdatingPayoutId(null);
    }
  };

  // Direct Payout Submit
  const handleDirectPayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPayoutModal.partner || directPayoutModal.amount <= 0) return;

    try {
      setProcessingDirectPayout(true);
      await api.post('/admin/affiliates/direct-payout', {
        affiliateId: directPayoutModal.partner.id,
        amount: directPayoutModal.amount,
        method: directPayoutModal.method,
        notes: directPayoutModal.notes,
      });

      toast.success(`Successfully issued payout of ₹${directPayoutModal.amount} to ${directPayoutModal.partner.fullName}`);
      setDirectPayoutModal({ isOpen: false, partner: null, amount: 0, method: 'Bank Transfer (IMPS/NEFT)', notes: '' });
      fetchPartners();
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record direct payout');
    } finally {
      setProcessingDirectPayout(false);
    }
  };

  const statCards = [
    {
      label: 'Affiliate Partners',
      value: stats?.totalAffiliates || 0,
      prefix: '',
      suffix: '',
      decimals: 0,
      colorClass: 'text-iris',
      icon: Users,
    },
    {
      label: 'Referral Clicks',
      value: stats?.totalClicks || 0,
      prefix: '',
      suffix: '',
      decimals: 0,
      colorClass: 'text-sky-400',
      icon: Share2,
    },
    {
      label: 'Referred Signups',
      value: stats?.totalSignups || 0,
      prefix: '',
      suffix: '',
      decimals: 0,
      colorClass: 'text-iris',
      icon: Users,
    },
    {
      label: 'Pro Conversions',
      value: stats?.totalConversions || 0,
      prefix: '',
      suffix: stats?.conversionRate ? ` (${stats.conversionRate}%)` : '',
      decimals: 0,
      colorClass: 'text-emerald-400',
      icon: Sparkles,
    },
    {
      label: 'Commissions Credited',
      value: stats?.totalCommissions || 0,
      prefix: '₹',
      suffix: '',
      decimals: 0,
      colorClass: 'text-emerald-400',
      icon: DollarSign,
    },
    {
      label: 'Pending Payouts',
      value: stats?.pendingPayouts || 0,
      prefix: '₹',
      suffix: '',
      decimals: 0,
      colorClass: (stats?.pendingPayouts || 0) > 0 ? 'text-amber-400' : 'text-secondary',
      icon: Wallet,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-iris/20 to-amber-500/20 border border-iris/30 flex items-center justify-center text-iris shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <span>Super Admin Affiliate Program</span>
          </h1>
          <p className="text-secondary text-sm mt-1">
            Platform-wide partner tracking, referral commission analytics, and payout disbursement management
          </p>
        </div>

        {/* Global Refresh & Simulator shortcut */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchStats();
              if (activeTab === 'partners') fetchPartners();
              if (activeTab === 'payouts') fetchPayouts();
              if (activeTab === 'referrals') fetchReferrals();
              toast.success('Affiliate metrics refreshed');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      {loadingStats && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="card p-4 hover:border-border-hover transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-secondary text-[11px] font-medium uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div className="w-6 h-6 rounded-md bg-surface-1 flex items-center justify-center">
                    <Icon className={cn('w-3.5 h-3.5', card.colorClass)} />
                  </div>
                </div>
                <div className={cn('text-xl font-bold tracking-tight', card.colorClass)}>
                  <AnimatedNumber
                    value={card.value}
                    prefix={card.prefix}
                    suffix={card.suffix}
                    decimals={card.decimals}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-border gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('partners')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
            activeTab === 'partners'
              ? 'border-iris text-iris font-semibold'
              : 'border-transparent text-secondary hover:text-primary',
          )}
        >
          <Users className="w-4 h-4" />
          <span>Affiliate Partners Directory</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-2 text-tertiary">
            {totalPartners}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
            activeTab === 'payouts'
              ? 'border-iris text-iris font-semibold'
              : 'border-transparent text-secondary hover:text-primary',
          )}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payout Requests</span>
          {stats?.pendingPayouts ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold animate-pulse">
              Action Required
            </span>
          ) : null}
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
            activeTab === 'referrals'
              ? 'border-iris text-iris font-semibold'
              : 'border-transparent text-secondary hover:text-primary',
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Live Referrals Stream</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-2 text-tertiary">
            {totalReferrals}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
            activeTab === 'settings'
              ? 'border-iris text-iris font-semibold'
              : 'border-transparent text-secondary hover:text-primary',
          )}
        >
          <Percent className="w-4 h-4" />
          <span>Commission Model (20% Recurring)</span>
        </button>
      </div>

      {/* TAB 1: PARTNERS DIRECTORY */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          {/* Search Toolbar */}
          <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search partner by name, email, or referral code…"
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                className={cn(inputCls, 'w-full pl-9')}
              />
              {partnerSearch && (
                <button
                  onClick={() => setPartnerSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-xs text-secondary">
              Showing {partners.length} of {totalPartners} partners
            </div>
          </div>

          {/* Partners Table */}
          {loadingPartners ? (
            <SkeletonTable rows={8} cols={7} />
          ) : partners.length === 0 ? (
            <div className="card p-8 text-center">
              <EmptyState
                icon={Users}
                title="No affiliate partners found"
                description="No users matched your search criteria or have activated referral codes yet."
              />
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-1 text-tertiary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Partner</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Referral Code</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-center">Clicks</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-center">Signups</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-center">Pro Conversions</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Total Earned</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Unpaid Balance</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {partners.map((partner) => {
                      const isExpanded = expandedPartnerIds.has(partner.id);
                      return (
                        <React.Fragment key={partner.id}>
                          <tr className="hover:bg-surface-1/40 transition-colors group">
                            {/* Partner Profile */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-iris/20 to-purple-500/20 border border-iris/30 flex items-center justify-center font-bold text-xs text-iris shrink-0">
                                  {(partner.fullName || partner.email).slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-primary text-xs flex items-center gap-1.5">
                                    <span>{partner.fullName}</span>
                                    {partner.plan === 'PRO' && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                                        PRO
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-tertiary font-mono">{partner.email}</div>
                                  {partner.bankDetails ? (
                                    <div className="flex items-center gap-1 mt-1">
                                      {partner.bankDetails.type === 'UPI' ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-iris/10 text-iris text-[10px] font-mono font-medium border border-iris/20">
                                          <Smartphone className="w-2.5 h-2.5" />
                                          <span>{partner.bankDetails.upiId}</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium border border-emerald-500/20">
                                          <Building2 className="w-2.5 h-2.5" />
                                          <span>{partner.bankDetails.bankName || 'Bank'} (•••{partner.bankDetails.accountNumber?.slice(-4) || '****'})</span>
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-[10px] text-tertiary/60 mt-0.5">No bank details added</div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Referral Code */}
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleCopy(partner.referralCode)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-2 hover:bg-surface-2/80 font-mono text-xs font-semibold text-iris transition-colors group/btn"
                                title="Click to copy referral code"
                              >
                                <span>{partner.referralCode}</span>
                                {copiedCode === partner.referralCode ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-tertiary group-hover/btn:text-iris" />
                                )}
                              </button>
                            </td>

                            {/* Clicks */}
                            <td className="px-4 py-3 text-center text-secondary font-mono text-xs">
                              {partner.clicks.toLocaleString()}
                            </td>

                            {/* Signups */}
                            <td className="px-4 py-3 text-center font-semibold text-primary text-xs font-mono">
                              {partner.signupsCount}
                            </td>

                            {/* Pro Conversions */}
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                                {partner.conversionsCount}
                                <span className="text-[10px] text-tertiary ml-1 font-normal">
                                  ({partner.conversionRate}%)
                                </span>
                              </span>
                            </td>

                            {/* Total Earned */}
                            <td className="px-4 py-3 text-right font-bold text-xs text-primary font-mono">
                              ₹{partner.totalEarnings.toLocaleString()}
                            </td>

                            {/* Available Balance */}
                            <td className="px-4 py-3 text-right">
                              <span
                                className={cn(
                                  'font-bold text-xs font-mono',
                                  partner.availableBalance > 0 ? 'text-emerald-400' : 'text-secondary',
                                )}
                              >
                                ₹{partner.availableBalance.toLocaleString()}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                {/* Expand Partner Details */}
                                <button
                                  onClick={() => togglePartnerExpand(partner.id)}
                                  className="p-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 text-secondary hover:text-primary transition-colors"
                                  title="View bank details and referred users"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-iris" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Direct Payout */}
                                <button
                                  onClick={() =>
                                    setDirectPayoutModal({
                                      isOpen: true,
                                      partner,
                                      amount: partner.availableBalance > 0 ? partner.availableBalance : 400,
                                      method: partner.bankDetails?.type === 'UPI' ? 'UPI / Virtual Payment Address' : 'Bank Transfer (IMPS/NEFT)',
                                      notes: '',
                                    })
                                  }
                                  className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/20 transition-colors flex items-center gap-1"
                                  title="Issue direct payout"
                                >
                                  <DollarSign className="w-3 h-3" />
                                  <span>Pay</span>
                                </button>

                                {/* User Details Profile */}
                                <button
                                  onClick={() => navigate(`/app/admin/users/${partner.id}`)}
                                  className="p-1.5 rounded-lg bg-surface-1 hover:bg-surface-2 text-secondary hover:text-primary transition-colors"
                                  title="Inspect full user profile"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Partner Details & Referred Traders Sub-Table */}
                          {isExpanded && (
                            <tr className="bg-canvas/60">
                              <td colSpan={8} className="p-4 border-t border-b border-border/60">
                                <div className="space-y-4">
                                  {/* Section 1: Partner Bank Coordinates */}
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-semibold text-primary flex items-center gap-2">
                                        <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Payout & Bank Coordinates for {partner.fullName}</span>
                                      </span>
                                      <button
                                        onClick={() =>
                                          setDirectPayoutModal({
                                            isOpen: true,
                                            partner,
                                            amount: partner.availableBalance > 0 ? partner.availableBalance : 400,
                                            method: partner.bankDetails?.type === 'UPI' ? 'UPI / Virtual Payment Address' : 'Bank Transfer (IMPS/NEFT)',
                                            notes: '',
                                          })
                                        }
                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors flex items-center gap-1"
                                      >
                                        <DollarSign className="w-3.5 h-3.5" />
                                        <span>Pay Partner</span>
                                      </button>
                                    </div>
                                    <BankCoordinatesBlock
                                      details={partner.bankDetails}
                                      onCopy={copyText}
                                      copiedField={copiedField}
                                    />
                                  </div>

                                  {/* Section 2: Referred Traders */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold text-primary flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-iris" />
                                        <span>Traders referred by {partner.fullName}</span>
                                      </span>
                                      <span className="text-[11px] text-tertiary">
                                        {partner.recentReferrals.length} recent signups
                                      </span>
                                    </div>

                                    {partner.recentReferrals.length === 0 ? (
                                      <div className="p-3 bg-surface-1/40 rounded-lg text-xs text-secondary text-center">
                                        No referred signups recorded yet for this partner.
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {partner.recentReferrals.map((ref) => (
                                          <div
                                            key={ref.id}
                                            className="p-2.5 rounded-lg bg-surface-1/60 border border-border/80 flex items-center justify-between"
                                          >
                                            <div>
                                              <div className="font-semibold text-xs text-primary">
                                                {ref.fullName || 'Anonymous Trader'}
                                              </div>
                                              <div className="text-[10px] text-tertiary font-mono">{ref.email}</div>
                                              <div className="text-[10px] text-tertiary mt-0.5">
                                                Joined: {new Date(ref.createdAt).toLocaleDateString()}
                                              </div>
                                            </div>
                                            <span
                                              className={cn(
                                                'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase',
                                                ref.plan === 'PRO'
                                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                  : 'bg-surface-2 text-tertiary',
                                              )}
                                            >
                                              {ref.plan}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {partnerTotalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <span className="text-secondary text-sm">
                    Page {partnerPage} of {partnerTotalPages} ({totalPartners} total partners)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPartnerPage((p) => Math.max(1, p - 1))}
                      disabled={partnerPage === 1}
                      className="p-2 rounded-lg bg-canvas border border-border text-secondary hover:bg-surface-1 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-primary text-sm font-medium px-2">
                      {partnerPage} / {partnerTotalPages}
                    </span>
                    <button
                      onClick={() => setPartnerPage((p) => Math.min(partnerTotalPages, p + 1))}
                      disabled={partnerPage === partnerTotalPages}
                      className="p-2 rounded-lg bg-canvas border border-border text-secondary hover:bg-surface-1 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYOUT REQUESTS & PROCESSING */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-tertiary" />
              <select
                value={payoutStatusFilter}
                onChange={(e) => {
                  setPayoutStatusFilter(e.target.value);
                  setPayoutPage(1);
                }}
                className={inputCls}
              >
                <option value="ALL">All Statuses</option>
                <option value="Processing">Processing / Pending Approval</option>
                <option value="Paid">Paid Out</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="text-xs text-secondary">
              Total Payout Requests: {totalPayouts}
            </div>
          </div>

          {loadingPayouts ? (
            <SkeletonTable rows={6} cols={6} />
          ) : payouts.length === 0 ? (
            <div className="card p-8 text-center">
              <EmptyState
                icon={CreditCard}
                title="No payout requests found"
                description="There are currently no withdrawal requests matching the selected filter."
              />
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-1 text-tertiary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Invoice ID</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Affiliate Partner</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Date Requested</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Payment / Bank Coordinates</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Amount</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-center">Status</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payouts.map((p) => {
                      const isPending = p.status === 'Processing' || p.status === 'Pending';
                      return (
                        <tr key={p.id} className="hover:bg-surface-1/40 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                            {p.invoiceId}
                          </td>

                          <td className="px-4 py-3">
                            <div className="font-medium text-xs text-primary">
                              {p.affiliate?.fullName || 'Trader Partner'}
                            </div>
                            <div className="text-[11px] text-tertiary font-mono">{p.affiliate?.email}</div>
                          </td>

                          <td className="px-4 py-3 text-secondary text-xs">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>

                          <td className="px-4 py-3 text-secondary text-xs">
                            {p.bankDetails ? (
                              p.bankDetails.type === 'UPI' ? (
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-iris">
                                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                                    <span>UPI: {p.bankDetails.upiId}</span>
                                    {p.bankDetails.upiId && (
                                      <button
                                        type="button"
                                        onClick={() => copyText(p.bankDetails!.upiId!, 'UPI ID')}
                                        className="p-0.5 text-tertiary hover:text-primary transition-colors"
                                        title="Copy UPI ID"
                                      >
                                        {copiedField === p.bankDetails.upiId ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-tertiary">{p.bankDetails.accountHolder}</div>
                                </div>
                              ) : (
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                                    <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>{p.bankDetails.bankName || 'Bank Transfer'}</span>
                                    {p.bankDetails.accountHolder && (
                                      <span className="text-tertiary font-normal">({p.bankDetails.accountHolder})</span>
                                    )}
                                  </div>
                                  <div className="text-[11px] font-mono text-secondary flex items-center gap-1.5 flex-wrap">
                                    <span className="text-primary font-semibold">A/C: {p.bankDetails.accountNumber}</span>
                                    {p.bankDetails.accountNumber && (
                                      <button
                                        type="button"
                                        onClick={() => copyText(p.bankDetails!.accountNumber!, 'A/C Number')}
                                        className="p-0.5 text-tertiary hover:text-primary transition-colors"
                                        title="Copy Account Number"
                                      >
                                        {copiedField === p.bankDetails.accountNumber ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    )}
                                    <span className="text-tertiary">•</span>
                                    <span className="text-iris font-semibold">IFSC: {p.bankDetails.ifsc}</span>
                                    {p.bankDetails.ifsc && (
                                      <button
                                        type="button"
                                        onClick={() => copyText(p.bankDetails!.ifsc!, 'IFSC Code')}
                                        className="p-0.5 text-tertiary hover:text-primary transition-colors"
                                        title="Copy IFSC Code"
                                      >
                                        {copiedField === p.bankDetails.ifsc ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )
                            ) : (
                              <div className="flex items-center gap-1.5 font-mono text-xs text-secondary">
                                <span className="break-all">{p.payoutMethod || 'Bank Transfer'}</span>
                                {p.payoutMethod && (
                                  <button
                                    type="button"
                                    onClick={() => copyText(p.payoutMethod, 'Payment Details')}
                                    className="p-0.5 text-tertiary hover:text-primary transition-colors shrink-0"
                                    title="Copy Details"
                                  >
                                    {copiedField === p.payoutMethod ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 text-right font-bold text-sm font-mono text-emerald-400">
                            ₹{p.amount.toLocaleString()}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full text-xs font-semibold',
                                p.status === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : isPending
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
                              )}
                            >
                              {p.status}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            {isPending ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    setApprovePayoutModal({
                                      isOpen: true,
                                      payout: p,
                                      reference: '',
                                    })
                                  }
                                  disabled={updatingPayoutId === p.id}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors flex items-center gap-1"
                                  title="Inspect bank coordinates and approve payment"
                                >
                                  <CreditCard className="w-3 h-3" />
                                  <span>Pay & Approve</span>
                                </button>
                                <button
                                  onClick={() => handleUpdatePayoutStatus(p.id, 'Rejected')}
                                  disabled={updatingPayoutId === p.id}
                                  className="px-2 py-1 rounded-lg bg-surface-1 hover:bg-rose-500/10 text-secondary hover:text-rose-400 text-xs font-medium transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-tertiary font-mono">Completed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {payoutTotalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <span className="text-secondary text-sm">
                    Page {payoutPage} of {payoutTotalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPayoutPage((p) => Math.max(1, p - 1))}
                      disabled={payoutPage === 1}
                      className="p-2 rounded-lg bg-canvas border border-border text-secondary hover:bg-surface-1 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-primary text-sm font-medium px-2">
                      {payoutPage} / {payoutTotalPages}
                    </span>
                    <button
                      onClick={() => setPayoutPage((p) => Math.min(payoutTotalPages, p + 1))}
                      disabled={payoutPage === payoutTotalPages}
                      className="p-2 rounded-lg bg-canvas border border-border text-secondary hover:bg-surface-1 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LIVE REFERRALS STREAM */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-iris" />
              <span>Real-Time Platform Referral Events</span>
            </span>
            <span className="text-xs text-tertiary">
              {totalReferrals} total referred signups
            </span>
          </div>

          {loadingReferrals ? (
            <SkeletonTable rows={8} cols={5} />
          ) : referrals.length === 0 ? (
            <div className="card p-8 text-center">
              <EmptyState
                icon={Layers}
                title="No referred signups yet"
                description="When new traders register using an affiliate partner link, they will appear in this live stream."
              />
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-1 text-tertiary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Signup Date</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Referred Trader</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Attributed Referrer</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider">Referral Code</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-center">Current Plan</th>
                      <th className="px-4 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Commission Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {referrals.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-1/40 transition-colors">
                        <td className="px-4 py-3 text-secondary text-xs whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-xs text-primary">
                            {item.fullName || 'Anonymous Trader'}
                          </div>
                          <div className="text-[11px] text-tertiary font-mono">{item.email}</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-xs text-iris">
                            {item.referrer?.fullName || 'Partner Trader'}
                          </div>
                          <div className="text-[11px] text-tertiary font-mono">{item.referrer?.email}</div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-2 text-primary font-semibold">
                            {item.referrer?.referralCode || '—'}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                              item.plan === 'PRO'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-surface-2 text-tertiary',
                            )}
                          >
                            {item.plan}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          {item.plan === 'PRO' ? (
                            <span className="text-xs font-bold text-emerald-400 font-mono">
                              +₹400/mo (20% Recurring)
                            </span>
                          ) : (
                            <span className="text-xs text-tertiary font-mono">Free Tier (No Commission Yet)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {referralTotalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <span className="text-secondary text-sm">
                    Page {referralPage} of {referralTotalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReferralPage((p) => Math.max(1, p - 1))}
                      disabled={referralPage === 1}
                      className="p-2 rounded-lg bg-canvas border border-border text-secondary hover:bg-surface-1 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-primary text-sm font-medium px-2">
                      {referralPage} / {referralTotalPages}
                    </span>
                    <button
                      onClick={() => setReferralPage((p) => Math.min(referralTotalPages, p + 1))}
                      disabled={referralPage === referralTotalPages}
                      className="p-2 rounded-lg bg-canvas border border-border text-secondary hover:bg-surface-1 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COMMISSION MODEL SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 space-y-4">
            <h3 className="text-primary font-bold text-base flex items-center gap-2">
              <Percent className="w-5 h-5 text-iris" />
              <span>Program Commission Parameters</span>
            </h3>
            <p className="text-secondary text-xs">
              RiskRule utilizes a 20% recurring revenue share model on all Pro subscriptions.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-surface-1 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-primary">Recurring Commission Rate</div>
                  <div className="text-[11px] text-tertiary">Percentage of monthly subscription price</div>
                </div>
                <div className="text-lg font-bold text-emerald-400 font-mono">20%</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-1 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-primary">Pro Monthly Subscription</div>
                  <div className="text-[11px] text-tertiary">Baseline retail trader monthly plan</div>
                </div>
                <div className="text-lg font-bold text-primary font-mono">₹1,999 / mo</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-1 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-primary">Partner Reward per Conversion</div>
                  <div className="text-[11px] text-tertiary">Calculated: ₹1,999 × 20% (rounded)</div>
                </div>
                <div className="text-lg font-bold text-iris font-mono">₹400 / mo</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-1 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-primary">Payout Frequency</div>
                  <div className="text-[11px] text-tertiary">Monthly payout settlement schedule</div>
                </div>
                <div className="text-sm font-semibold text-secondary">15th of Every Month</div>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-primary font-bold text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Affiliate Attribution Architecture</span>
            </h3>
            <p className="text-secondary text-xs">
              How trader referrals are tracked, linked, and verified in the database.
            </p>

            <div className="space-y-2 text-xs text-secondary">
              <div className="p-3 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary">1. Referral Cookie / Code Binding:</span>
                <p className="mt-1 text-tertiary">
                  When a prospective trader visits <code className="text-iris">/r/:code</code>, the frontend automatically registers the referral code in session storage and redirects to registration.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary">2. Database Relationship:</span>
                <p className="mt-1 text-tertiary">
                  Upon signup, the user record stores <code className="text-iris">referredById</code> pointing directly to the affiliate partner in PostgreSQL.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-1 border border-border">
                <span className="font-semibold text-primary">3. Commission Generation:</span>
                <p className="mt-1 text-tertiary">
                  When a referred trader upgrades to Pro (<code className="text-iris">plan = &apos;PRO&apos;</code>), ₹400 is automatically credited to the referrer&apos;s available balance and a notification is dispatched.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT PAYOUT MODAL */}
      {directPayoutModal.isOpen && directPayoutModal.partner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-0 border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>Issue Direct Payout</span>
              </h3>
              <button
                onClick={() => setDirectPayoutModal({ ...directPayoutModal, isOpen: false })}
                className="text-tertiary hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-surface-1 border border-border text-xs space-y-1">
              <div className="text-secondary">Recipient Partner:</div>
              <div className="font-semibold text-primary text-sm">
                {directPayoutModal.partner.fullName} ({directPayoutModal.partner.email})
              </div>
              <div className="text-tertiary flex items-center gap-2">
                <span>Code: <code className="text-iris">{directPayoutModal.partner.referralCode}</code></span>
                <span>•</span>
                <span>Unpaid Balance: <strong className="text-emerald-400">₹{directPayoutModal.partner.availableBalance.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Recipient Bank / UPI Coordinates */}
            <div>
              <div className="text-xs font-semibold text-secondary mb-1.5 flex items-center gap-1.5">
                <span>Partner Bank / Settlement Coordinates:</span>
              </div>
              <BankCoordinatesBlock
                details={directPayoutModal.partner.bankDetails}
                onCopy={copyText}
                copiedField={copiedField}
              />
            </div>

            <form onSubmit={handleDirectPayoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Payout Amount (INR ₹)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={directPayoutModal.amount}
                  onChange={(e) =>
                    setDirectPayoutModal({ ...directPayoutModal, amount: parseFloat(e.target.value) || 0 })
                  }
                  className={cn(inputCls, 'w-full font-mono text-base font-bold text-emerald-400')}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Payment Method / Mode
                </label>
                <select
                  value={directPayoutModal.method}
                  onChange={(e) => setDirectPayoutModal({ ...directPayoutModal, method: e.target.value })}
                  className={cn(inputCls, 'w-full')}
                >
                  <option value="Bank Transfer (IMPS/NEFT)">Bank Transfer (IMPS/NEFT)</option>
                  <option value="UPI / Virtual Payment Address">UPI / Virtual Payment Address</option>
                  <option value="Direct Wire / RTGS">Direct Wire / RTGS</option>
                  <option value="Manual / Offline Cash Settlement">Manual / Offline Cash Settlement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Reference Note / Transaction UTR (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR #99882211 or Bank Ref"
                  value={directPayoutModal.notes}
                  onChange={(e) => setDirectPayoutModal({ ...directPayoutModal, notes: e.target.value })}
                  className={cn(inputCls, 'w-full font-mono')}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDirectPayoutModal({ ...directPayoutModal, isOpen: false })}
                  className="px-4 py-2 rounded-xl bg-surface-1 border border-border text-xs font-medium text-secondary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingDirectPayout || directPayoutModal.amount <= 0}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {processingDirectPayout ? 'Recording...' : `Record Payout of ₹${directPayoutModal.amount.toLocaleString()}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPROVE & PAY CONFIRMATION MODAL */}
      {approvePayoutModal.isOpen && approvePayoutModal.payout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-0 border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Process & Approve Payout</span>
              </h3>
              <button
                onClick={() => setApprovePayoutModal({ isOpen: false, payout: null, reference: '' })}
                className="text-tertiary hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-1 border border-border text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Affiliate Partner:</span>
                <span className="font-mono text-tertiary font-medium">{approvePayoutModal.payout.invoiceId}</span>
              </div>
              <div className="font-semibold text-primary text-sm">
                {approvePayoutModal.payout.affiliate?.fullName || 'Trader Partner'} ({approvePayoutModal.payout.affiliate?.email})
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-secondary">Payout Withdrawal Amount:</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  ₹{approvePayoutModal.payout.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Recipient Bank / UPI Coordinates */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-secondary">
                Partner Bank / Settlement Coordinates:
              </div>
              <BankCoordinatesBlock
                details={approvePayoutModal.payout.bankDetails}
                fallbackMethod={approvePayoutModal.payout.payoutMethod}
                onCopy={copyText}
                copiedField={copiedField}
              />
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Bank UTR / Transaction Reference (Recommended)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR 402918491201 or IMPS Ref"
                  value={approvePayoutModal.reference}
                  onChange={(e) =>
                    setApprovePayoutModal({ ...approvePayoutModal, reference: e.target.value })
                  }
                  className={cn(inputCls, 'w-full font-mono')}
                />
                <p className="text-[11px] text-tertiary mt-1">
                  This transaction reference will be saved with the invoice and notified to the affiliate partner.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovePayoutModal({ isOpen: false, payout: null, reference: '' })}
                  className="px-4 py-2 rounded-xl bg-surface-1 border border-border text-xs font-medium text-secondary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const payout = approvePayoutModal.payout;
                    if (!payout) return;
                    handleUpdatePayoutStatus(
                      payout.id,
                      'Paid',
                      approvePayoutModal.reference ? `Bank/UPI Transfer Ref: ${approvePayoutModal.reference}` : undefined
                    );
                    setApprovePayoutModal({ isOpen: false, payout: null, reference: '' });
                  }}
                  disabled={updatingPayoutId === approvePayoutModal.payout.id}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {updatingPayoutId === approvePayoutModal.payout.id
                      ? 'Confirming...'
                      : `Confirm Payment of ₹${approvePayoutModal.payout.amount.toLocaleString()}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
