import Razorpay from 'razorpay';
import { logger } from './logger';
import { config } from '../config/env';
import { verifyWebhookSignatureWith, verifyPaymentSignatureWith } from './razorpaySignature';

// ─── Razorpay SDK Instance ──────────────────────────────────────────────────────
const { keyId: RAZORPAY_KEY_ID, keySecret: RAZORPAY_KEY_SECRET, webhookSecret: RAZORPAY_WEBHOOK_SECRET } = config.razorpay;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  logger.warn('[Razorpay] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET — payment features will be unavailable');
}
if (!RAZORPAY_WEBHOOK_SECRET) {
  logger.warn('[Razorpay] RAZORPAY_WEBHOOK_SECRET not set — webhooks will be REJECTED until it is configured');
}

export function isRazorpayConfigured(): boolean {
  return Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
}

let client: Razorpay | null = null;

/** Lazily creates the SDK client so a missing key can never crash the whole API at boot. */
export function getRazorpay(): Razorpay {
  if (!isRazorpayConfigured()) {
    throw new Error('Razorpay is not configured');
  }
  if (!client) {
    client = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
  }
  return client;
}

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

// ─── Webhook Signature Verification (fails closed; needs the RAW body) ─────────
export function verifyWebhookSignature(rawBody: Buffer | string, signature: string): boolean {
  return verifyWebhookSignatureWith(RAZORPAY_WEBHOOK_SECRET, rawBody, signature);
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
  return verifyPaymentSignatureWith(RAZORPAY_KEY_SECRET, params);
}

export { RAZORPAY_KEY_ID, RAZORPAY_WEBHOOK_SECRET };
