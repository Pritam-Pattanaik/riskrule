import { create } from 'zustand';
import { api } from '../lib/api';

/** Canonical app origin — uses VITE_APP_URL if set, otherwise falls back to current browser origin */
const getAppOrigin = () =>
  (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '');

export interface ReferredUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  joinedAt: string;
}

export interface AffiliateEarningItem {
  id: string;
  amount: number;
  currency: string;
  planType: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface PayoutItem {
  id: string;
  date: string;
  amount: number;
  currency: string;
  referralsCount: number;
  method: string;
  status: 'Paid' | 'Processing' | 'Scheduled';
  invoiceId: string;
}

export interface AffiliateMetricsData {
  clicks: number;
  signups: number;
  conversions: number;
  totalEarnings: number;
  availableBalance: number;
  clicksGrowth: number;
  signupsGrowth: number;
  conversionsGrowth: number;
  earningsGrowth: number;
}

export interface BankDetails {
  type: 'BANK' | 'UPI';
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  upiId: string;
  updatedAt?: string;
}

export interface AffiliateStatusData {
  active: boolean;
  memberSince: string;
  referralTier: string;
  nextPayoutDate: string;
  activeReferrals: number;
  tierTarget: number;
}

interface AffiliateState {
  referralCode: string;
  referralLink: string;
  commissionPercent: number;
  monthlyRewardPerPro: number;
  fixedRewardAmount: number;
  userPlan: string;
  bankDetails: BankDetails;
  metrics: AffiliateMetricsData;
  status: AffiliateStatusData;
  referredUsers: ReferredUser[];
  earningsHistory: AffiliateEarningItem[];
  payouts: PayoutItem[];
  loading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
  updateCustomCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  saveBankDetails: (details: BankDetails) => Promise<{ success: boolean; error?: string }>;
  upgradeToPro: () => Promise<{ success: boolean; rewardCredited?: boolean; message?: string }>;
  simulateReferral: (traderName?: string, upgradeToPro?: boolean) => Promise<{ success: boolean; message?: string }>;
  requestPayout: (amount: number, method: string, bankDetails?: BankDetails) => Promise<{ success: boolean; message?: string }>;
}

export const useAffiliateStore = create<AffiliateState>((set, get) => ({
  referralCode: 'RISKRULE',
  referralLink: `${getAppOrigin()}/r/RISKRULE`,
  commissionPercent: 20,
  monthlyRewardPerPro: 400,
  fixedRewardAmount: 400,
  userPlan: 'FREE',
  bankDetails: {
    type: 'BANK',
    accountHolder: 'Registered Partner',
    accountNumber: '50100492814092',
    ifsc: 'HDFC0001842',
    bankName: 'HDFC Bank',
    upiId: 'trader@okhdfcbank',
  },
  metrics: {
    clicks: 0,
    signups: 0,
    conversions: 0,
    totalEarnings: 0,
    availableBalance: 0,
    clicksGrowth: 15,
    signupsGrowth: 28,
    conversionsGrowth: 19,
    earningsGrowth: 32,
  },
  status: {
    active: true,
    memberSince: 'Today',
    referralTier: 'Standard (20% Recurring Commission)',
    nextPayoutDate: '15th Next Month',
    activeReferrals: 0,
    tierTarget: 50,
  },
  referredUsers: [],
  earningsHistory: [],
  payouts: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<any>('/affiliate/stats');
      set({
        referralCode: data.referralCode || 'RISKRULE',
        referralLink: `${getAppOrigin()}/r/${data.referralCode || 'RISKRULE'}`,
        commissionPercent: data.commissionPercent || 20,
        monthlyRewardPerPro: data.monthlyRewardPerPro || 400,
        fixedRewardAmount: data.monthlyRewardPerPro || data.fixedRewardAmount || 400,
        userPlan: data.userPlan || 'FREE',
        bankDetails: data.bankDetails || get().bankDetails,
        metrics: data.metrics || get().metrics,
        status: data.status || get().status,
        referredUsers: data.referredUsers || [],
        earningsHistory: data.earningsHistory || [],
        payouts: data.payouts || [],
        loading: false,
      });
    } catch (err: any) {
      console.warn('Failed to load affiliate stats from server:', err);
      set({ loading: false, error: err.message || 'Failed to load stats' });
    }
  },

  saveBankDetails: async (details: BankDetails) => {
    try {
      const data = await api.put<{ success: boolean; bankDetails: BankDetails }>('/affiliate/bank-details', details);
      if (data.success && data.bankDetails) {
        set({ bankDetails: data.bankDetails });
        return { success: true };
      }
      return { success: false, error: 'Failed to update bank coordinates' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update bank coordinates' };
    }
  },

  updateCustomCode: async (code: string) => {
    try {
      const data = await api.put<{ success: boolean; referralCode: string }>('/affiliate/custom-code', {
        customCode: code,
      });
      if (data.referralCode) {
        set({
          referralCode: data.referralCode,
          referralLink: `${getAppOrigin()}/r/${data.referralCode}`,
        });
        return { success: true };
      }
      return { success: false, error: 'Failed to update code' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update code' };
    }
  },

  upgradeToPro: async () => {
    try {
      const data = await api.post<{ success: boolean; plan: string; rewardCredited: boolean; message: string }>(
        '/affiliate/upgrade-to-pro',
        {}
      );
      set({ userPlan: 'PRO' });
      await get().fetchStats();
      return { success: true, rewardCredited: data.rewardCredited, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to upgrade to Pro' };
    }
  },

  simulateReferral: async (traderName = 'Aditya Patel', upgradeToPro = true) => {
    try {
      const data = await api.post<{ success: boolean; message: string }>('/affiliate/simulate-referral', {
        traderName,
        upgradeToPro,
      });
      await get().fetchStats();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to simulate referral' };
    }
  },

  requestPayout: async (amount: number, method: string, bankDetails?: BankDetails) => {
    try {
      const data = await api.post<{ success: boolean; message: string }>('/affiliate/payout', {
        amount,
        method,
        bankDetails: bankDetails || get().bankDetails,
      });
      await get().fetchStats();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to request payout' };
    }
  },
}));
