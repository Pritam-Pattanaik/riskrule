import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logger } from '../lib/logger';
import {
  razorpay,
  RAZORPAY_KEY_ID,
  getPlanConfig,
  verifyPaymentSignature,
  verifyWebhookSignature,
  PlanType,
  BillingCycle,
} from '../lib/razorpay';
import { creditAffiliateReward } from './affiliate';

const router = Router();

// ─── POST /api/payment/create-order ──────────────────────────────────────────
// Creates a Razorpay Order for a one-time plan payment.
// Uses Orders API (simpler than Subscriptions for getting started).
router.post('/create-order', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

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
    const order = await razorpay.orders.create({
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

    // Check idempotency — if already captured, don't process again
    if (payment.status === 'captured') {
      res.json({ success: true, message: 'Payment already verified', plan: payment.planType });
      return;
    }

    // Update payment record
    await (prisma as any).payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'captured',
      },
    });

    // Upgrade user plan
    await (prisma as any).user.update({
      where: { id: userId },
      data: { plan: payment.planType },
    });

    // Create a subscription record for tracking
    const now = new Date();
    const periodEnd = new Date(now);
    if (payment.billingCycle === 'annual') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    await (prisma as any).subscription.create({
      data: {
        userId,
        razorpaySubscriptionId: razorpay_order_id, // Using order ID as reference
        razorpayPlanId: `${payment.planType}_${payment.billingCycle}`,
        planType: payment.planType,
        billingCycle: payment.billingCycle,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });

    // Credit affiliate reward if user was referred
    await creditAffiliateReward(userId, payment.planType);

    // Create a success notification
    try {
      await (prisma as any).notification.create({
        data: {
          userId,
          title: `Welcome to RiskRule ${payment.planType}! 🚀`,
          description: `Your ${payment.planType} plan is now active. Enjoy unlimited access to all ${payment.planType} features.`,
          category: 'Trading',
          priority: 'Success',
          isRead: false,
        },
      });
    } catch (notifErr) {
      logger.warn('[Payment] Failed to create upgrade notification:', notifErr);
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
// No CSRF, no auth — secured via webhook signature verification.
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = JSON.stringify(req.body);

    // Verify webhook signature (skip in test mode if no secret set)
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      if (!signature || !verifyWebhookSignature(rawBody, signature)) {
        logger.warn('[Webhook] Invalid webhook signature');
        res.status(400).json({ error: 'Invalid webhook signature' });
        return;
      }
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
        const notes = paymentEntity.notes || {};
        const userId = notes.userId;
        const planType = notes.planType;

        if (!userId || !planType) {
          logger.warn('[Webhook] payment.captured missing userId or planType in notes');
          break;
        }

        // Check idempotency
        const existing = await (prisma as any).payment.findUnique({
          where: { razorpayPaymentId },
        });
        if (existing && existing.status === 'captured') {
          logger.info(`[Webhook] Payment ${razorpayPaymentId} already processed — skipping`);
          break;
        }

        // Update payment record if exists, or create new
        if (existing) {
          await (prisma as any).payment.update({
            where: { id: existing.id },
            data: { status: 'captured', razorpayPaymentId },
          });
        } else {
          await (prisma as any).payment.create({
            data: {
              userId,
              razorpayPaymentId,
              razorpayOrderId,
              amount: paymentEntity.amount,
              currency: paymentEntity.currency || 'INR',
              planType,
              billingCycle: notes.billingCycle || 'monthly',
              status: 'captured',
            },
          });
        }

        // Upgrade user plan
        await (prisma as any).user.update({
          where: { id: userId },
          data: { plan: planType },
        });

        // Credit affiliate
        await creditAffiliateReward(userId, planType);

        logger.info(`[Webhook] Plan upgraded via webhook: user=${userId}, plan=${planType}`);
        break;
      }

      case 'payment.failed': {
        const paymentEntity = payload?.payment?.entity;
        if (!paymentEntity) break;

        const notes = paymentEntity.notes || {};
        const userId = notes.userId;

        if (userId) {
          // Update payment record status
          await (prisma as any).payment.updateMany({
            where: { razorpayOrderId: paymentEntity.order_id, userId },
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
    // Still respond 200 to prevent Razorpay from retrying
    res.status(200).json({ status: 'error' });
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
