import { create } from 'zustand';
import { api } from '../lib/api';

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
  metrics: AffiliateMetricsData;
  status: AffiliateStatusData;
  referredUsers: ReferredUser[];
  earningsHistory: AffiliateEarningItem[];
  payouts: PayoutItem[];
  loading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
  updateCustomCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  upgradeToPro: () => Promise<{ success: boolean; rewardCredited?: boolean; message?: string }>;
  simulateReferral: (traderName?: string, upgradeToPro?: boolean) => Promise<{ success: boolean; message?: string }>;
  requestPayout: (amount: number, method: string) => Promise<{ success: boolean; message?: string }>;
}

export const useAffiliateStore = create<AffiliateState>((set, get) => ({
  referralCode: 'RISKRULE',
  referralLink: `${window.location.origin}/r/RISKRULE`,
  commissionPercent: 20,
  monthlyRewardPerPro: 400,
  fixedRewardAmount: 400,
  userPlan: 'FREE',
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
        referralLink: data.referralLink || `${window.location.origin}/r/${data.referralCode}`,
        commissionPercent: data.commissionPercent || 20,
        monthlyRewardPerPro: data.monthlyRewardPerPro || 400,
        fixedRewardAmount: data.monthlyRewardPerPro || data.fixedRewardAmount || 400,
        userPlan: data.userPlan || 'FREE',
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

  updateCustomCode: async (code: string) => {
    try {
      const data = await api.put<{ success: boolean; referralCode: string }>('/affiliate/custom-code', {
        customCode: code,
      });
      if (data.referralCode) {
        set({
          referralCode: data.referralCode,
          referralLink: `${window.location.origin}/r/${data.referralCode}`,
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

  requestPayout: async (amount: number, method: string) => {
    try {
      const data = await api.post<{ success: boolean; message: string }>('/affiliate/payout', {
        amount,
        method,
      });
      await get().fetchStats();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to request payout' };
    }
  },
}));
