import { useCallback, useRef, useState } from 'react';
import { usePaymentStore } from '../stores/paymentStore';
import { useAuthStore } from '../stores/authStore';

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

/** Dynamically load Razorpay checkout script */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface UseRazorpayCheckoutOptions {
  onSuccess?: (plan: string) => void;
  onFailure?: (error: string) => void;
}

export function useRazorpayCheckout(options: UseRazorpayCheckoutOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const razorpayInstanceRef = useRef<any>(null);
  const { createOrder, verifyPayment } = usePaymentStore();
  const user = useAuthStore((s) => s.user);

  const openCheckout = useCallback(
    async (planType: 'PRO' | 'ELITE', billingCycle: 'monthly' | 'annual') => {
      setIsLoading(true);

      try {
        // 1. Load Razorpay script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          options.onFailure?.('Failed to load Razorpay. Please check your internet connection.');
          setIsLoading(false);
          return;
        }

        // 2. Create order on backend
        const orderResult = await createOrder(planType, billingCycle);
        if (!orderResult.success || !orderResult.orderId) {
          options.onFailure?.(orderResult.error || 'Failed to create payment order');
          setIsLoading(false);
          return;
        }

        // 3. Configure Razorpay checkout options
        const rzpOptions = {
          key: orderResult.keyId,
          amount: orderResult.amount,
          currency: orderResult.currency || 'INR',
          name: 'RiskRule',
          description: `${planType} Plan — ${billingCycle === 'annual' ? 'Annual' : 'Monthly'} Billing`,
          order_id: orderResult.orderId,
          prefill: {
            name: orderResult.prefill?.name || user?.fullName || '',
            email: orderResult.prefill?.email || user?.email || '',
          },
          theme: {
            color: '#6366f1', // iris color matching your UI
            backdrop_color: 'rgba(0, 0, 0, 0.7)',
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
              options.onFailure?.('Payment cancelled');
            },
            confirm_close: true,
            escape: true,
            animation: true,
          },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            // 4. Verify payment on backend
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setIsLoading(false);

            if (verifyResult.success) {
              options.onSuccess?.(verifyResult.plan || planType);
            } else {
              options.onFailure?.(verifyResult.error || 'Payment verification failed');
            }
          },
        };

        // 5. Open Razorpay modal
        const rzp = new window.Razorpay(rzpOptions);
        razorpayInstanceRef.current = rzp;

        rzp.on('payment.failed', (response: any) => {
          setIsLoading(false);
          const errorDesc =
            response?.error?.description || 'Payment failed. Please try again.';
          options.onFailure?.(errorDesc);
        });

        rzp.open();
      } catch (err: any) {
        setIsLoading(false);
        options.onFailure?.(err.message || 'An unexpected error occurred');
      }
    },
    [createOrder, verifyPayment, user, options]
  );

  return { openCheckout, isLoading };
}
