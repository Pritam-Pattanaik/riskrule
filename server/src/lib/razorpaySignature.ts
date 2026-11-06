import crypto from 'crypto';

/**
 * Pure HMAC helpers (no SDK, no config import) so they are trivially unit-testable.
 * Every function FAILS CLOSED: an empty secret, malformed hex or a length mismatch returns false.
 */

function safeHexEqual(expectedHex: string, providedHex: string): boolean {
  try {
    const expected = Buffer.from(expectedHex, 'hex');
    const provided = Buffer.from(providedHex, 'hex');
    if (expected.length === 0 || expected.length !== provided.length) return false;
    return crypto.timingSafeEqual(expected, provided);
  } catch {
    return false;
  }
}

/** Razorpay signs the RAW request body with the webhook secret (HMAC-SHA256, hex). */
export function verifyWebhookSignatureWith(secret: string, rawBody: Buffer | string, signature: string): boolean {
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeHexEqual(expected, signature);
}

/** Checkout callback signature: HMAC-SHA256(order_id|payment_id) keyed with the API key secret. */
export function verifyPaymentSignatureWith(
  keySecret: string,
  params: {
    razorpay_payment_id: string;
    razorpay_subscription_id?: string;
    razorpay_order_id?: string;
    razorpay_signature: string;
  },
): boolean {
  // An empty HMAC key is forgeable by anyone, so refuse outright.
  if (!keySecret || !params.razorpay_signature) return false;

  let payload: string;
  if (params.razorpay_subscription_id) {
    payload = `${params.razorpay_payment_id}|${params.razorpay_subscription_id}`;
  } else if (params.razorpay_order_id) {
    payload = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  } else {
    return false;
  }

  const expected = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');
  return safeHexEqual(expected, params.razorpay_signature);
}
