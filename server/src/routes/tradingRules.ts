import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/trading-rules
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const rules = await prisma.tradingRule.findUnique({
      where: { userId: req.userId! },
    });
    res.json(rules || null);
  } catch (err: any) {
    console.error('Trading rules error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/trading-rules
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      windowStart, windowEnd,
      maxTradesPerDay, maxDailyLoss, maxLossPerTrade,
      allowedInstruments, allowedMarkets,
      description, customRules,
    } = req.body;

    const payload: any = {
      windowStart: windowStart || null,
      windowEnd: windowEnd || null,
      maxTradesPerDay: maxTradesPerDay || null,
      maxDailyLoss: maxDailyLoss ? String(maxDailyLoss) : null,
      maxLossPerTrade: maxLossPerTrade ? String(maxLossPerTrade) : null,
      allowedInstruments: allowedInstruments?.length ? allowedInstruments : [],
      allowedMarkets: allowedMarkets?.length ? allowedMarkets : [],
      description: description || null,
      customRules: Array.isArray(customRules) ? customRules : [],
      updatedAt: new Date(),
    };

    const result = await prisma.tradingRule.upsert({
      where: { userId: req.userId! },
      update: payload,
      create: { userId: req.userId!, ...payload },
    });

    res.json(result);
  } catch (err: any) {
    console.error('Trading rules error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
