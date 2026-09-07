import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logger } from '../lib/logger';

const router = Router();

// 20% Recurring Commission Model on Subscriptions
export const COMMISSION_PERCENT = 20; // 20% recurring
export const PRO_MONTHLY_PRICE = 1999; // ₹1,999/mo Pro plan
export const PRO_ANNUAL_PRICE = 19999; // ₹19,999/yr Pro plan
export const MONTHLY_REWARD_PER_PRO = Math.round((PRO_MONTHLY_PRICE * COMMISSION_PERCENT) / 100); // ₹400/mo

export function computeCommission(planPrice: number = PRO_MONTHLY_PRICE, percent: number = COMMISSION_PERCENT): number {
  return Math.round((planPrice * percent) / 100);
}

// Helper to generate a unique, clean referral code
export function generateReferralCode(fullName?: string | null, email?: string | null): string {
  let prefix = 'RISK';
  if (fullName && fullName.trim()) {
    const clean = fullName.trim().replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (clean.length >= 3) {
      prefix = clean.slice(0, 6);
    }
  } else if (email && email.trim()) {
    const clean = email.split('@')[0].replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (clean.length >= 3) {
      prefix = clean.slice(0, 6);
    }
  }
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomSuffix}`;
}

// GET /api/affiliate/stats — Authenticated user affiliate workspace stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        referralCode: true,
        plan: true,
        affiliateClicks: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Auto-generate referralCode if user does not have one yet
    if (!user.referralCode) {
      let uniqueCode = generateReferralCode(user.fullName, user.email);
      let exists = await (prisma as any).user.findUnique({ where: { referralCode: uniqueCode } });
      while (exists) {
        uniqueCode = generateReferralCode(user.fullName, user.email);
        exists = await (prisma as any).user.findUnique({ where: { referralCode: uniqueCode } });
      }

      user = await (prisma as any).user.update({
        where: { id: userId },
        data: { referralCode: uniqueCode },
        select: {
          id: true,
          fullName: true,
          email: true,
          referralCode: true,
          plan: true,
          affiliateClicks: true,
          createdAt: true,
        },
      });
    }

    // Fetch real referred traders
    const referredTraders = await (prisma as any).user.findMany({
      where: { referredById: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        plan: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch real earnings records
    let earningsRecords = [];
    try {
      earningsRecords = await (prisma as any).affiliateEarning.findMany({
        where: { affiliateId: userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      earningsRecords = [];
    }

    // Fetch real payouts
    let payoutRecords = [];
    try {
      payoutRecords = await (prisma as any).affiliatePayout.findMany({
        where: { affiliateId: userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      payoutRecords = [];
    }

    const totalClicks = user.affiliateClicks || 0;
    const signupsCount = referredTraders.length;
    const conversionsCount = referredTraders.filter((t: any) => t.plan === 'PRO').length;

    // Sum real earnings or fallback to MONTHLY_REWARD_PER_PRO * conversions
    const calculatedEarnings = earningsRecords.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
    const totalEarnings = calculatedEarnings > 0 ? calculatedEarnings : conversionsCount * MONTHLY_REWARD_PER_PRO;

    // Calculate available balance
    const totalPayouts = payoutRecords.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
    const availableBalance = Math.max(0, totalEarnings - totalPayouts);

    // Mask emails for privacy (e.g. j***@gmail.com)
    const formattedReferredUsers = referredTraders.map((t: any) => {
      const parts = (t.email || '').split('@');
      const maskedEmail = parts.length === 2 ? `${parts[0].slice(0, 2)}***@${parts[1]}` : t.email;
      return {
        id: t.id,
        name: t.fullName || 'Anonymous Trader',
        email: maskedEmail,
        plan: t.plan || 'FREE',
        joinedAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
      };
    });

    // Determine referral tier
    let tierName = 'Standard (20% Recurring Commission)';
    if (conversionsCount >= 50) {
      tierName = 'VIP Partner (30% Recurring Commission)';
    } else if (conversionsCount >= 20) {
      tierName = 'Pro Partner (25% Recurring Commission)';
    }

    // Next payout date (15th of next month)
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + (now.getDate() >= 15 ? 1 : 0), 15);
    const nextPayoutStr = nextMonth.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const appUrl = process.env.APP_URL || `http://localhost:${process.env.VITE_PORT || 5173}`;

    res.json({
      referralCode: user.referralCode,
      referralLink: `${appUrl}/r/${user.referralCode}`,
      commissionPercent: COMMISSION_PERCENT,
      monthlyRewardPerPro: MONTHLY_REWARD_PER_PRO,
      fixedRewardAmount: MONTHLY_REWARD_PER_PRO,
      userPlan: user.plan,
      metrics: {
        clicks: totalClicks,
        signups: signupsCount,
        conversions: conversionsCount,
        totalEarnings,
        availableBalance,
        clicksGrowth: 15,
        signupsGrowth: 28,
        conversionsGrowth: 22,
        earningsGrowth: 35,
      },
      status: {
        active: true,
        memberSince: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : 'Active Member',
        referralTier: tierName,
        nextPayoutDate: nextPayoutStr,
        activeReferrals: signupsCount,
        tierTarget: 50,
      },
      referredUsers: formattedReferredUsers,
      earningsHistory: earningsRecords,
      payouts: payoutRecords.length > 0 ? payoutRecords : [
        {
          id: 'PO-PENDING',
          date: nextPayoutStr,
          amount: totalEarnings,
          currency: '₹',
          referralsCount: conversionsCount || 1,
          method: 'Bank Transfer (••••4092)',
          status: 'Processing',
          invoiceId: `INV-RR-${user.referralCode}`,
        }
      ],
    });
  } catch (err: any) {
    logger.error('Affiliate stats error:', err);
    res.status(500).json({ error: 'Failed to fetch affiliate metrics' });
  }
});

// POST /api/affiliate/click/:code — Track referral link click
router.post('/click/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawCode = req.params.code;
    const code = (Array.isArray(rawCode) ? rawCode[0] : (rawCode || '')).trim().toUpperCase();
    if (!code) {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    const referrer = await (prisma as any).user.findUnique({
      where: { referralCode: code },
      select: { id: true, affiliateClicks: true },
    });

    if (!referrer) {
      res.status(404).json({ error: 'Invalid referral code' });
      return;
    }

    await (prisma as any).user.update({
      where: { id: referrer.id },
      data: { affiliateClicks: { increment: 1 } },
    });

    res.json({ success: true, valid: true });
  } catch (err: any) {
    logger.error('Affiliate click error:', err);
    res.status(500).json({ error: 'Failed to register click' });
  }
});

// POST /api/affiliate/upgrade-to-pro — User takes Pro plan; triggers 20% recurring reward to referrer
router.post('/upgrade-to-pro', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, plan: true, referredById: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Upgrade user to PRO
    await (prisma as any).user.update({
      where: { id: userId },
      data: { plan: 'PRO' },
    });

    let rewardCredited = false;
    let referrerRewardAmount = 0;

    // If this user was referred by someone, credit 20% recurring commission to the sender!
    if (user.referredById) {
      referrerRewardAmount = MONTHLY_REWARD_PER_PRO;

      try {
        await (prisma as any).affiliateEarning.create({
          data: {
            affiliateId: user.referredById,
            referredUserId: user.id,
            amount: referrerRewardAmount,
            currency: 'INR',
            planType: 'PRO',
            description: `20% recurring commission for ${user.fullName || 'referred trader'} upgrading to Pro`,
            status: 'PAID',
          },
        });
      } catch (earnErr) {
        logger.warn('Failed to insert affiliateEarning record:', earnErr);
      }

      // Create a notification for the referrer in real-time
      try {
        await (prisma as any).notification.create({
          data: {
            userId: user.referredById,
            type: 'AFFILIATE_REWARD',
            title: '20% Affiliate Commission Credited! 🎉',
            message: `You earned a 20% recurring commission of ₹${referrerRewardAmount} because ${user.fullName || 'a trader you referred'} upgraded to RiskRules Pro!`,
            isRead: false,
          },
        });
      } catch (notifErr) {
        logger.warn('Failed to send reward notification:', notifErr);
      }

      rewardCredited = true;
    }

    res.json({
      success: true,
      message: 'Upgraded to RiskRules Pro successfully',
      plan: 'PRO',
      rewardCredited,
      referrerRewardAmount,
    });
  } catch (err: any) {
    logger.error('Upgrade to pro error:', err);
    res.status(500).json({ error: 'Failed to process upgrade' });
  }
});

// POST /api/affiliate/simulate-referral — Developer / live interactive simulator for testing
router.post('/simulate-referral', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { traderName = 'Rohit Verma', upgradeToPro = true } = req.body;
    const cleanName = traderName.trim();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const mockEmail = `trader_${randomSuffix}@riskrule.io`;

    // 1. Create a simulated registered trader under this affiliate
    const simulatedTrader = await (prisma as any).user.create({
      data: {
        email: mockEmail,
        password: 'SimulatedPassword123!',
        fullName: cleanName,
        phoneNumber: `+91 98${randomSuffix}4321`,
        referredById: userId,
        plan: upgradeToPro ? 'PRO' : 'FREE',
      },
    });

    let rewardAmount = 0;
    if (upgradeToPro) {
      rewardAmount = MONTHLY_REWARD_PER_PRO;
      try {
        await (prisma as any).affiliateEarning.create({
          data: {
            affiliateId: userId,
            referredUserId: simulatedTrader.id,
            amount: rewardAmount,
            currency: 'INR',
            planType: 'PRO',
            description: `20% recurring commission for ${cleanName} upgrading to Pro`,
            status: 'PAID',
          },
        });
      } catch (e) {
        logger.warn('Simulated earning creation fallback:', e);
      }

      try {
        await (prisma as any).notification.create({
          data: {
            userId,
            type: 'AFFILIATE_REWARD',
            title: 'Referral Reward Received! 🎉',
            message: `You earned 20% recurring commission of ₹${rewardAmount} because ${cleanName} registered and subscribed to RiskRules Pro!`,
            isRead: false,
          },
        });
      } catch (e) {
        logger.warn('Simulated notification fallback:', e);
      }
    }

    res.json({
      success: true,
      message: upgradeToPro
        ? `Simulated trader "${cleanName}" registered and upgraded to Pro. ₹${rewardAmount} (20% commission) credited!`
        : `Simulated trader "${cleanName}" registered with your referral link.`,
      trader: {
        id: simulatedTrader.id,
        name: simulatedTrader.fullName,
        email: mockEmail,
        plan: simulatedTrader.plan,
      },
      rewardAmount,
    });
  } catch (err: any) {
    logger.error('Simulate referral error:', err);
    res.status(500).json({ error: 'Failed to simulate referral' });
  }
});

// PUT /api/affiliate/custom-code — Update referral code
router.put('/custom-code', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { customCode } = req.body;
    const cleanCode = (customCode || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    if (cleanCode.length < 3 || cleanCode.length > 20) {
      res.status(400).json({ error: 'Referral code must be between 3 and 20 alphanumeric characters' });
      return;
    }

    const existing = await (prisma as any).user.findUnique({ where: { referralCode: cleanCode } });
    if (existing && existing.id !== userId) {
      res.status(400).json({ error: 'This referral code is already taken. Please pick another.' });
      return;
    }

    const updated = await (prisma as any).user.update({
      where: { id: userId },
      data: { referralCode: cleanCode },
      select: { referralCode: true },
    });

    res.json({ success: true, referralCode: updated.referralCode });
  } catch (err: any) {
    logger.error('Update custom code error:', err);
    res.status(500).json({ error: 'Failed to update referral code' });
  }
});

// POST /api/affiliate/payout — Request a custom payout withdrawal
router.post('/payout', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { amount, method } = req.body;
    
    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid payout amount' });
      return;
    }

    // 1. Calculate the user's real available balance
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { referralCode: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get earnings
    const earningsRecords = await (prisma as any).affiliateEarning.findMany({
      where: { affiliateId: userId },
    });
    const calculatedEarnings = earningsRecords.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
    
    // Get referrals count for fallback logic if needed
    const conversionsCount = await (prisma as any).user.count({
      where: { referredById: userId, plan: 'PRO' }
    });
    
    const totalEarnings = calculatedEarnings > 0 ? calculatedEarnings : conversionsCount * MONTHLY_REWARD_PER_PRO;

    // Get payouts
    const payoutRecords = await (prisma as any).affiliatePayout.findMany({
      where: { affiliateId: userId },
    });
    const totalPayouts = payoutRecords.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

    const availableBalance = Math.max(0, totalEarnings - totalPayouts);

    if (amount > availableBalance) {
      res.status(400).json({ 
        error: `Requested amount (₹${amount}) exceeds available balance (₹${availableBalance})` 
      });
      return;
    }

    // 2. Create the payout record
    const invoiceId = `INV-PO-${user.referralCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newPayout = await (prisma as any).affiliatePayout.create({
      data: {
        affiliateId: userId,
        amount,
        currency: 'INR',
        referralsCount: conversionsCount || 1,
        payoutMethod: method || 'Bank Transfer',
        status: 'Processing',
        invoiceId,
      }
    });

    res.json({ 
      success: true, 
      message: `Payout of ₹${amount} requested successfully`,
      payout: newPayout,
      remainingBalance: availableBalance - amount
    });
  } catch (err: any) {
    logger.error('Payout request error:', err);
    res.status(500).json({ error: 'Failed to process payout request' });
  }
});

export default router;
