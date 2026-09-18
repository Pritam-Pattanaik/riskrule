import { create } from 'zustand';
import { api } from '../lib/api';

export interface SubscriptionInfo {
  id: string;
  planType: string;
  billingCycle: string;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  planType: string;
  billingCycle: string;
  status: string;
  createdAt: string;
}

interface PaymentState {
  currentPlan: string;
  subscription: SubscriptionInfo | null;
  payments: PaymentRecord[];
  loading: boolean;
  error: string | null;

  fetchStatus: () => Promise<void>;
  createOrder: (planType: string, billingCycle: string) => Promise<{
    success: boolean;
    orderId?: string;
    amount?: number;
    currency?: string;
    keyId?: string;
    prefill?: { name: string; email: string };
    error?: string;
  }>;
  verifyPayment: (params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<{ success: boolean; plan?: string; error?: string }>;
  cancelSubscription: () => Promise<{ success: boolean; error?: string }>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  currentPlan: 'FREE',
  subscription: null,
  payments: [],
  loading: false,
  error: null,

  fetchStatus: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<{
        plan: string;
        subscription: SubscriptionInfo | null;
        payments: PaymentRecord[];
      }>('/payment/status');
      set({
        currentPlan: data.plan,
        subscription: data.subscription,
        payments: data.payments,
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Failed to fetch payment status' });
    }
  },

  createOrder: async (planType: string, billingCycle: string) => {
    set({ loading: true, error: null });
    try {
      const data = await api.post<{
        success: boolean;
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        prefill: { name: string; email: string };
      }>('/payment/create-order', { planType, billingCycle });
      set({ loading: false });
      return {
        success: true,
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        keyId: data.keyId,
        prefill: data.prefill,
      };
    } catch (err: any) {
      set({ loading: false, error: err.message });
      return { success: false, error: err.message || 'Failed to create order' };
    }
  },

  verifyPayment: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await api.post<{ success: boolean; plan: string; message: string }>(
        '/payment/verify',
        params
      );
      set({ currentPlan: data.plan, loading: false });
      // Refresh full status
      await get().fetchStatus();
      return { success: true, plan: data.plan };
    } catch (err: any) {
      set({ loading: false, error: err.message });
      return { success: false, error: err.message || 'Payment verification failed' };
    }
  },

  cancelSubscription: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.post<{ success: boolean; plan: string; message: string }>(
        '/payment/cancel',
        {}
      );
      set({ currentPlan: data.plan, loading: false });
      await get().fetchStatus();
      return { success: true };
    } catch (err: any) {
      set({ loading: false, error: err.message });
      return { success: false, error: err.message || 'Failed to cancel subscription' };
    }
  },
}));
