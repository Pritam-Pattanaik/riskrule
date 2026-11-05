import { prisma } from '../db';
import { logger } from '../lib/logger';
import { creditAffiliateReward } from '../routes/affiliate';

/**
 * Billing service: the ONLY place allowed to grant a paid plan.
 *
 * Invariants (enforced by tests/security/no-free-plan.test.ts):
 *  1. A paid plan is only ever written here, after a payment row has been atomically claimed.
 *  2. The plan and user come from OUR stored order, never from client / webhook payload data.
 *  3. Calling this twice (verify + webhook race, webhook replay) activates exactly once.
 */

export interface SettleParams {
  /** Our internal payments.id (resolved from a signature-verified order). */
  paymentId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  source: 'verify' | 'webhook';
}

export interface SettleResult {
  /** true only for the single call that actually activated the plan. */
  activated: boolean;
  planType?: string;
  userId?: string;
}

function computePeriodEnd(start: Date, billingCycle: string): Date {
  const end = new Date(start);
  if (billingCycle === 'annual') {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

export async function settleCapturedPayment(params: SettleParams): Promise<SettleResult> {
  const db = prisma as any;

  const settled = await db.$transaction(async (tx: any) => {
    // Atomic claim: only one concurrent caller can flip the row to 'captured'.
    const claim = await tx.payment.updateMany({
      where: { id: params.paymentId, status: { not: 'captured' } },
      data: {
        status: 'captured',
        razorpayPaymentId: params.razorpayPaymentId,
        ...(params.razorpaySignature ? { razorpaySignature: params.razorpaySignature } : {}),
      },
    });
    if (claim.count !== 1) return null;

    const payment = await tx.payment.findUnique({ where: { id: params.paymentId } });

    await tx.user.update({
      where: { id: payment.userId },
      data: { plan: payment.planType },
    });

    const now = new Date();
    const periodEnd = computePeriodEnd(now, payment.billingCycle);
    const subscriptionRef = payment.razorpayOrderId || `payment_${payment.id}`;

    await tx.subscription.upsert({
      where: { razorpaySubscriptionId: subscriptionRef },
      create: {
        userId: payment.userId,
        razorpaySubscriptionId: subscriptionRef, // Using order ID as reference
        razorpayPlanId: `${payment.planType}_${payment.billingCycle}`,
        planType: payment.planType,
        billingCycle: payment.billingCycle,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      update: {
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });

    return payment;
  });

  if (!settled) {
    logger.info(`[Billing] Payment ${params.paymentId} already settled — skipping (source=${params.source})`);
    return { activated: false };
  }

  // Post-commit side effects. These are idempotent / non-critical and must never undo the activation.
  await creditAffiliateReward(settled.userId, settled.planType);

  try {
    await db.notification.create({
      data: {
        userId: settled.userId,
        title: `Welcome to RiskRule ${settled.planType}! 🚀`,
        description: `Your ${settled.planType} plan is now active. Enjoy unlimited access to all ${settled.planType} features.`,
        category: 'Trading',
        priority: 'Success',
        isRead: false,
      },
    });
  } catch (notifErr) {
    logger.warn('[Billing] Failed to create upgrade notification:', notifErr);
  }

  logger.info(
    `[Billing] Activated: user=${settled.userId}, plan=${settled.planType}, payment=${params.razorpayPaymentId}, source=${params.source}`,
  );
  return { activated: true, planType: settled.planType, userId: settled.userId };
}
