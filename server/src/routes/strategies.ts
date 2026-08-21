import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/strategies
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const strategies = await prisma.strategy.findMany({
      where: {
        OR: [
          { userId: req.userId! },
          { isDefault: true, isActive: true }
        ]
      },
      include: {
        trades: {
          where: { userId: req.userId! },
          select: { netPnl: true, status: true }
        }
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    const formatted = strategies.map(s => {
      const tradesCount = s.trades.length;
      const totalPnl = s.trades.reduce((sum, t) => sum + (Number(t.netPnl) || 0), 0);
      const winCount = s.trades.filter(t => t.status === 'WIN').length;
      const winRate = tradesCount > 0 ? Math.round((winCount / tradesCount) * 10000) / 100 : 0;
      const avgPnl = tradesCount > 0 ? totalPnl / tradesCount : 0;

      const { trades, ...rest } = s;
      return {
        ...rest,
        tradesCount,
        tradeCount: tradesCount,
        totalPnl,
        winRate,
        avgPnl,
      };
    });

    res.json(formatted);
  } catch (err: any) {
    console.error('Get strategies error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/strategies (User creates custom strategy)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, rules, market, timeframe } = req.body;
    const strategy = await prisma.strategy.create({
      data: {
        userId: req.userId!,
        name,
        description: description || null,
        rules: rules || null,
        market: market || [],
        timeframe: timeframe || null,
        isDefault: false,
        isActive: true,
      },
    });
    res.status(201).json({
      ...strategy,
      tradesCount: 0,
      tradeCount: 0,
      totalPnl: 0,
      winRate: 0,
      avgPnl: 0,
    });
  } catch (err: any) {
    console.error('Create strategy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/strategies/:id (User updates their custom strategy)
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, rules, market, timeframe, isActive } = req.body;

    const existing = await prisma.strategy.findFirst({
      where: { id, userId: req.userId!, isDefault: false },
    });
    if (!existing) { res.status(404).json({ error: 'Custom strategy not found or cannot be modified' }); return; }

    const updated = await prisma.strategy.update({
      where: { id },
      data: { name, description, rules, market, timeframe, isActive },
    });
    res.json(updated);
  } catch (err: any) {
    console.error('Update strategy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/strategies/:id (User deletes their custom strategy)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.strategy.findFirst({
      where: { id, userId: req.userId!, isDefault: false },
    });
    if (!existing) { res.status(404).json({ error: 'Custom strategy not found or cannot be deleted' }); return; }

    await prisma.trade.updateMany({
      where: { strategyId: id, userId: req.userId! },
      data: { strategyId: null },
    });

    await prisma.strategy.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete strategy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
