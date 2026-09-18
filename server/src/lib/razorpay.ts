import Razorpay from 'razorpay';
import crypto from 'crypto';
import { logger } from './logger';

// ─── Razorpay SDK Instance ──────────────────────────────────────────────────────
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  logger.warn('[Razorpay] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET — payment features will be unavailable');
}

export const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ─── Plan Pricing (in paise — ₹1 = 100 paise) ─────────────────────────────────
export const PLAN_CONFIG = {
  PRO: {
    monthly: { amount: 149900, label: 'PRO Monthly', period: 'monthly' },   // ₹1,499
    annual:  { amount: 119900, label: 'PRO Annual',  period: 'yearly' },     // ₹1,199/mo × 12 = ₹14,388
  },
  ELITE: {
    monthly: { amount: 399900, label: 'ELITE Monthly', period: 'monthly' }, // ₹3,999
    annual:  { amount: 319900, label: 'ELITE Annual',  period: 'yearly' },   // ₹3,199/mo × 12 = ₹38,388
  },
} as const;

export type PlanType = 'PRO' | 'ELITE';
export type BillingCycle = 'monthly' | 'annual';

export function getPlanConfig(planType: PlanType, billingCycle: BillingCycle) {
  return PLAN_CONFIG[planType]?.[billingCycle] || null;
}

// ─── Webhook Signature Verification ─────────────────────────────────────────────
export function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    logger.warn('[Razorpay] RAZORPAY_WEBHOOK_SECRET not set — skipping webhook verification');
    return false;
  }
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

// ─── Payment Signature Verification ─────────────────────────────────────────────
// Razorpay sends: razorpay_payment_id|razorpay_subscription_id (for subscriptions)
// or: razorpay_order_id|razorpay_payment_id (for orders)
export function verifyPaymentSignature(params: {
  razorpay_payment_id: string;
  razorpay_subscription_id?: string;
  razorpay_order_id?: string;
  razorpay_signature: string;
}): boolean {
  let payload: string;
  if (params.razorpay_subscription_id) {
    payload = `${params.razorpay_payment_id}|${params.razorpay_subscription_id}`;
  } else if (params.razorpay_order_id) {
    payload = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  } else {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(params.razorpay_signature, 'hex')
    );
  } catch {
    return false;
  }
}

export { RAZORPAY_KEY_ID, RAZORPAY_WEBHOOK_SECRET };
