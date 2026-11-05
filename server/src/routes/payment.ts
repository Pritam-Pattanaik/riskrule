import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logger } from '../lib/logger';
import {
  getRazorpay,
  isRazorpayConfigured,
  RAZORPAY_KEY_ID,
  getPlanConfig,
  verifyPaymentSignature,
  verifyWebhookSignature,
  PlanType,
  BillingCycle,
} from '../lib/razorpay';
import { settleCapturedPayment } from '../services/billing';
import { config } from '../config/env';

const router = Router();

// ─── POST /api/payment/create-order ──────────────────────────────────────────
// Creates a Razorpay Order for a one-time plan payment.
// Uses Orders API (simpler than Subscriptions for getting started).
router.post('/create-order', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    if (!isRazorpayConfigured()) {
      logger.error('[Payment] create-order called but Razorpay is not configured');
      res.status(503).json({ error: 'Payments are temporarily unavailable' });
      return;
    }

    const { planType, billingCycle } = req.body as { planType?: string; billingCycle?: string };

    if (!planType || !['PRO', 'ELITE'].includes(planType)) {
      res.status(400).json({ error: 'Invalid planType. Must be PRO or ELITE.' });
      return;
    }
    if (!billingCycle || !['monthly', 'annual'].includes(billingCycle)) {
      res.status(400).json({ error: 'Invalid billingCycle. Must be monthly or annual.' });
      return;
    }

    const config = getPlanConfig(planType as PlanType, billingCycle as BillingCycle);
    if (!config) {
      res.status(400).json({ error: 'Invalid plan configuration' });
      return;
    }

    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, plan: true, razorpayCustomerId: true },
    });

    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    // Prevent double-upgrade
    if (user.plan === planType) {
      res.status(400).json({ error: `You are already on the ${planType} plan.` });
      return;
    }

    // Create a Razorpay Order
    const order = await getRazorpay().orders.create({
      amount: config.amount,
      currency: 'INR',
      receipt: `rr_${userId.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        planType,
        billingCycle,
        userEmail: user.email,
      },
    });

    // Record the payment intent in our DB
    await (prisma as any).payment.create({
      data: {
        userId,
        razorpayOrderId: order.id,
        amount: config.amount,
        currency: 'INR',
        planType,
        billingCycle,
        status: 'created',
      },
    });

    logger.info(`[Payment] Order created: ${order.id} for user ${userId}, plan ${planType} ${billingCycle}`);

    res.json({
      success: true,
      orderId: order.id,
      amount: config.amount,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      planType,
      billingCycle,
      prefill: {
        name: user.fullName || '',
        email: user.email,
      },
    });
  } catch (err: any) {
    logger.error('[Payment] Create order error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// ─── POST /api/payment/verify ────────────────────────────────────────────────
// Client-side callback after Razorpay checkout succeeds.
// Verifies signature and activates the user's plan.
router.post('/verify', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: 'Missing payment verification parameters' });
      return;
    }

    // Verify signature
    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      logger.warn(`[Payment] Invalid signature for order ${razorpay_order_id}, user ${userId}`);
      res.status(400).json({ error: 'Payment verification failed — invalid signature' });
      return;
    }

    // Find the payment record we created during order creation
    const payment = await (prisma as any).payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id, userId },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment record not found' });
      return;
    }

    // Atomic: claims this payment exactly once, then activates plan + subscription + commission.
    // Safe against verify/webhook races and replays.
    const result = await settleCapturedPayment({
      paymentId: payment.id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      source: 'verify',
    });

    if (!result.activated) {
      res.json({ success: true, message: 'Payment already verified', plan: payment.planType });
      return;
    }

    logger.info(`[Payment] Verified & activated: user=${userId}, plan=${payment.planType}, payment=${razorpay_payment_id}`);

    res.json({
      success: true,
      message: `Successfully upgraded to ${payment.planType}!`,
      plan: payment.planType,
    });
  } catch (err: any) {
    logger.error('[Payment] Verify error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// ─── POST /api/payment/webhook ───────────────────────────────────────────────
// Razorpay webhook handler — source of truth for payment events.
// No CSRF, no auth — secured ONLY via webhook signature verification (fails closed).
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    // Fail CLOSED: without a configured secret we cannot authenticate Razorpay, so we refuse.
    if (!config.razorpay.webhookSecret) {
      logger.error('[Webhook] RAZORPAY_WEBHOOK_SECRET is not configured — rejecting webhook');
      res.status(503).json({ error: 'Webhook not configured' });
      return;
    }

    // Razorpay signs the RAW bytes; index.ts captures them in req.rawBody for this route.
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = (req as any).rawBody as Buffer | undefined;
    if (typeof signature !== 'string' || !rawBody || !verifyWebhookSignature(rawBody, signature)) {
      logger.warn('[Webhook] Invalid or missing webhook signature');
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    logger.info(`[Webhook] Received event: ${event}`);

    switch (event) {
      case 'payment.captured': {
        const paymentEntity = payload?.payment?.entity;
        if (!paymentEntity) break;

        const razorpayPaymentId = paymentEntity.id;
        const razorpayOrderId = paymentEntity.order_id;
        if (!razorpayPaymentId || !razorpayOrderId) {
          logger.warn('[Webhook] payment.captured missing payment id or order id');
          break;
        }

        // Never trust payload "notes": resolve user + plan from OUR order record.
        const payment = await (prisma as any).payment.findFirst({ where: { razorpayOrderId } });
        if (!payment) {
          logger.warn(`[Webhook] payment.captured for unknown order ${razorpayOrderId} — ignoring`);
          break;
        }

        // The captured amount/currency must match what we asked Razorpay to charge.
        if (paymentEntity.amount !== payment.amount || (paymentEntity.currency || 'INR') !== payment.currency) {
          logger.error(
            `[Webhook] AMOUNT MISMATCH order=${razorpayOrderId}: expected ${payment.amount} ${payment.currency}, got ${paymentEntity.amount} ${paymentEntity.currency}`,
          );
          break;
        }

        const result = await settleCapturedPayment({
          paymentId: payment.id,
          razorpayPaymentId,
          source: 'webhook',
        });
        logger.info(
          result.activated
            ? `[Webhook] Plan activated via webhook: user=${payment.userId}, plan=${payment.planType}`
            : `[Webhook] Payment ${razorpayPaymentId} already processed — skipping`,
        );
        break;
      }

      case 'payment.failed': {
        const paymentEntity = payload?.payment?.entity;
        if (!paymentEntity) break;

        // Resolve the user from OUR order record, never from payload "notes".
        const failedPayment = paymentEntity.order_id
          ? await (prisma as any).payment.findFirst({ where: { razorpayOrderId: paymentEntity.order_id } })
          : null;
        const userId: string | undefined = failedPayment?.userId;

        // A late "failed" attempt must never overwrite an already captured payment.
        if (userId && failedPayment.status !== 'captured') {
          await (prisma as any).payment.updateMany({
            where: { id: failedPayment.id, status: { not: 'captured' } },
            data: { status: 'failed' },
          });

          // Notify user
          try {
            await (prisma as any).notification.create({
              data: {
                userId,
                title: 'Payment Failed ❌',
                description: 'Your payment could not be processed. Please try again or use a different payment method.',
                category: 'Trading',
                priority: 'Warning',
                isRead: false,
              },
            });
          } catch (notifErr) {
            logger.warn('[Webhook] Failed to send payment failure notification:', notifErr);
          }
        }

        logger.warn(`[Webhook] Payment failed: order=${paymentEntity.order_id}`);
        break;
      }

      case 'order.paid': {
        // Order fully paid — can use as secondary confirmation
        logger.info(`[Webhook] Order paid: ${payload?.order?.entity?.id}`);
        break;
      }

      default:
        logger.info(`[Webhook] Unhandled event: ${event}`);
    }

    // Always respond 200 to Razorpay
    res.status(200).json({ status: 'ok' });
  } catch (err: any) {
    logger.error('[Webhook] Error processing webhook:', err);
    // Non-2xx makes Razorpay retry; settleCapturedPayment is idempotent so retries are safe.
    res.status(500).json({ status: 'error' });
  }
});

// ─── GET /api/payment/status ─────────────────────────────────────────────────
// Get current subscription/payment status for the logged-in user.
router.get('/status', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    const activeSubscription = await (prisma as any).subscription.findFirst({
      where: { userId, status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    const recentPayments = await (prisma as any).payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        amount: true,
        currency: true,
        planType: true,
        billingCycle: true,
        status: true,
        createdAt: true,
      },
    });

    res.json({
      plan: user?.plan || 'FREE',
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        planType: activeSubscription.planType,
        billingCycle: activeSubscription.billingCycle,
        status: activeSubscription.status,
        currentPeriodStart: activeSubscription.currentPeriodStart,
        currentPeriodEnd: activeSubscription.currentPeriodEnd,
        cancelledAt: activeSubscription.cancelledAt,
      } : null,
      payments: recentPayments.map((p: any) => ({
        ...p,
        amount: p.amount / 100, // Convert paise to rupees for display
      })),
    });
  } catch (err: any) {
    logger.error('[Payment] Status fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// ─── POST /api/payment/cancel ────────────────────────────────────────────────
// Cancel active subscription (sets plan back to FREE at period end).
router.post('/cancel', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const activeSubscription = await (prisma as any).subscription.findFirst({
      where: { userId, status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeSubscription) {
      res.status(404).json({ error: 'No active subscription found' });
      return;
    }

    // Cancel the subscription
    await (prisma as any).subscription.update({
      where: { id: activeSubscription.id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
    });

    // Downgrade user plan immediately (or keep until period end — your choice)
    // For now, downgrade immediately
    await (prisma as any).user.update({
      where: { id: userId },
      data: { plan: 'FREE' },
    });

    // Send notification
    try {
      await (prisma as any).notification.create({
        data: {
          userId,
          title: 'Subscription Cancelled',
          description: 'Your subscription has been cancelled. You have been moved to the Free plan.',
          category: 'Trading',
          priority: 'Information',
          isRead: false,
        },
      });
    } catch (notifErr) {
      logger.warn('[Payment] Failed to send cancellation notification:', notifErr);
    }

    logger.info(`[Payment] Subscription cancelled: user=${userId}`);

    res.json({ success: true, message: 'Subscription cancelled successfully', plan: 'FREE' });
  } catch (err: any) {
    logger.error('[Payment] Cancel error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export default router;
