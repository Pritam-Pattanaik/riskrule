import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { cache } from '../lib/redis';

const router = Router();

/** Build a Prisma date range filter from query params `from` and `to` (ISO strings) */
function buildDateFilter(req: AuthRequest): { gte?: Date; lte?: Date } | undefined {
  const { from, to } = req.query as { from?: string; to?: string };
  const filter: { gte?: Date; lte?: Date } = {};
  if (from) filter.gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }
  return Object.keys(filter).length > 0 ? filter : undefined;
}

/** Helper to cache analytical calculations for 60 seconds */
async function getOrCompute<T>(key: string, ttlSec: number, computeFn: () => Promise<T>): Promise<T> {
  try {
    const cached = await cache.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}
  const result = await computeFn();
  try {
    await cache.set(key, JSON.stringify(result), ttlSec);
  } catch {}
  return result;
}

function getCacheKey(req: AuthRequest, name: string): string {
  const from = (req.query.from as string) || '';
  const to = (req.query.to as string) || '';
  return `analytics:${req.userId}:${name}:${from}:${to}`;
}

// ─── GET /api/analytics/mistakes ─────────────────────────────────────────────
router.get('/mistakes', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = getCacheKey(req, 'mistakes');
    const result = await getOrCompute(cacheKey, 60, async () => {
      const dateFilter = buildDateFilter(req);
      const trades = await prisma.trade.findMany({
        where: {
          userId: req.userId!,
          ...(dateFilter ? { date: dateFilter } : {}),
        },
        select: { mistakes: true, netPnl: true },
      });

      const mistakeCounts: Record<string, number> = {};
      const mistakePnl: Record<string, number> = {};

      for (const trade of trades) {
        const pnlVal = Number(trade.netPnl || 0);
        for (const mistake of trade.mistakes) {
          mistakeCounts[mistake] = (mistakeCounts[mistake] || 0) + 1;
          mistakePnl[mistake] = (mistakePnl[mistake] || 0) + pnlVal;
        }
      }

      return Object.keys(mistakeCounts)
        .map(mistake => ({ mistake, count: mistakeCounts[mistake], pnlImpact: mistakePnl[mistake] }))
        .sort((a, b) => b.count - a.count);
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch mistake analytics' });
  }
});

// ─── GET /api/analytics/session ──────────────────────────────────────────────
router.get('/session', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = getCacheKey(req, 'session');
    const result = await getOrCompute(cacheKey, 60, async () => {
      const dateFilter = buildDateFilter(req);
      const trades = await prisma.trade.findMany({
        where: {
          userId: req.userId!,
          ...(dateFilter ? { date: dateFilter } : {}),
        },
        select: { date: true, netPnl: true },
      });

      const byWeekday: Record<number, { count: number; pnl: number }> = {};
      const byHour: Record<number, { count: number; pnl: number }> = {};

      for (const t of trades) {
        const d = new Date(t.date);
        // IST = UTC + 5:30. Shift timestamp so getUTC* returns IST values.
        const istMs = d.getTime() + 330 * 60 * 1000;
        const istDate = new Date(istMs);
        const day = istDate.getUTCDay();
        const hour = istDate.getUTCHours();
        const pnlVal = Number(t.netPnl || 0);

        if (!byWeekday[day]) byWeekday[day] = { count: 0, pnl: 0 };
        byWeekday[day].count += 1;
        byWeekday[day].pnl += pnlVal;

        if (!byHour[hour]) byHour[hour] = { count: 0, pnl: 0 };
        byHour[hour].count += 1;
        byHour[hour].pnl += pnlVal;
      }

      return { byWeekday, byHour };
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch session analytics' });
  }
});

// ─── GET /api/analytics/risk ─────────────────────────────────────────────────
router.get('/risk', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = getCacheKey(req, 'risk');
    const result = await getOrCompute(cacheKey, 60, async () => {
      const userId = req.userId!;
      const dateFilter = buildDateFilter(req);
      const closedWhere = { userId, status: { in: ['WIN', 'LOSS', 'BREAKEVEN'] }, ...(dateFilter ? { date: dateFilter } : {}) };

      const [totalAgg, winAgg, lossAgg] = await Promise.all([
        prisma.trade.aggregate({ where: closedWhere, _count: { id: true } }),
        prisma.trade.aggregate({
          where: { userId, status: 'WIN', ...(dateFilter ? { date: dateFilter } : {}) },
          _count: { id: true }, _sum: { netPnl: true }, _avg: { netPnl: true },
        }),
        prisma.trade.aggregate({
          where: { userId, status: 'LOSS', ...(dateFilter ? { date: dateFilter } : {}) },
          _count: { id: true }, _sum: { netPnl: true }, _avg: { netPnl: true },
        }),
      ]);

      const totalTrades = totalAgg._count.id;
      const winCount = winAgg._count.id;
      const lossCount = lossAgg._count.id;
      const totalWin = winAgg._sum.netPnl ? Number(winAgg._sum.netPnl) : 0;
      const totalLoss = lossAgg._sum.netPnl ? Math.abs(Number(lossAgg._sum.netPnl)) : 0;
      const avgWin = winCount > 0 ? (winAgg._avg.netPnl ? Number(winAgg._avg.netPnl) : totalWin / winCount) : 0;
      const avgLoss = lossCount > 0 ? (lossAgg._avg.netPnl ? Math.abs(Number(lossAgg._avg.netPnl)) : totalLoss / lossCount) : 0;
      const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
      const lossRate = totalTrades > 0 ? (lossCount / totalTrades) * 100 : 0;
      const profitFactor = totalLoss > 0 ? totalWin / totalLoss : totalWin > 0 ? 999 : 0;
      const expectancy = ((winRate / 100) * avgWin) - ((lossRate / 100) * avgLoss);

      return { avgWin, avgLoss, winRate, profitFactor, expectancy, totalTrades };
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch risk analytics' });
  }
});

// ─── GET /api/analytics/instrument-breakdown ─────────────────────────────────
router.get('/instrument-breakdown', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = getCacheKey(req, 'instrument-breakdown');
    const result = await getOrCompute(cacheKey, 60, async () => {
      const userId = req.userId!;
      const dateFilter = buildDateFilter(req);
      const trades = await prisma.trade.findMany({
        where: { userId, ...(dateFilter ? { date: dateFilter } : {}) },
        select: { instrumentType: true, market: true, direction: true, netPnl: true, status: true },
      });

      const byInstrument: Record<string, { pnl: number; count: number; wins: number }> = {};
      const byMarket: Record<string, { pnl: number; count: number; wins: number }> = {};
      const byDirection: Record<string, { pnl: number; count: number; wins: number }> = {};

      for (const t of trades) {
        const pnl = Number(t.netPnl || 0);
        const isWin = t.status === 'WIN';

        const inst = t.instrumentType || 'Unknown';
        if (!byInstrument[inst]) byInstrument[inst] = { pnl: 0, count: 0, wins: 0 };
        byInstrument[inst].pnl += pnl;
        byInstrument[inst].count += 1;
        if (isWin) byInstrument[inst].wins += 1;

        const mkt = t.market || 'Unknown';
        if (!byMarket[mkt]) byMarket[mkt] = { pnl: 0, count: 0, wins: 0 };
        byMarket[mkt].pnl += pnl;
        byMarket[mkt].count += 1;
        if (isWin) byMarket[mkt].wins += 1;

        const dir = t.direction || 'Unknown';
        if (!byDirection[dir]) byDirection[dir] = { pnl: 0, count: 0, wins: 0 };
        byDirection[dir].pnl += pnl;
        byDirection[dir].count += 1;
        if (isWin) byDirection[dir].wins += 1;
      }

      const toArray = (map: typeof byInstrument) =>
        Object.entries(map).map(([name, v]) => ({
          name,
          pnl: v.pnl,
          count: v.count,
          winRate: v.count > 0 ? (v.wins / v.count) * 100 : 0,
        })).sort((a, b) => b.pnl - a.pnl);

      return {
        byInstrument: toArray(byInstrument),
        byMarket: toArray(byMarket),
        byDirection: toArray(byDirection),
      };
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch instrument breakdown' });
  }
});

// ─── GET /api/analytics/monthly-summary ──────────────────────────────────────
router.get('/monthly-summary', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = getCacheKey(req, 'monthly-summary');
    const result = await getOrCompute(cacheKey, 60, async () => {
      const userId = req.userId!;
      const dateFilter = buildDateFilter(req);
      const trades = await prisma.trade.findMany({
        where: {
          userId,
          status: { in: ['WIN', 'LOSS', 'BREAKEVEN'] },
          ...(dateFilter ? { date: dateFilter } : {}),
        },
        select: { date: true, netPnl: true, pnl: true, charges: true, status: true },
        orderBy: { date: 'asc' },
      });

      const monthMap: Record<string, { pnl: number; grossPnl: number; charges: number; count: number; wins: number }> = {};

      for (const t of trades) {
        const d = new Date(t.date);
        // IST month key
        const istMs = d.getTime() + 330 * 60 * 1000;
        const istDate = new Date(istMs);
        const key = `${istDate.getUTCFullYear()}-${String(istDate.getUTCMonth() + 1).padStart(2, '0')}`;
        if (!monthMap[key]) monthMap[key] = { pnl: 0, grossPnl: 0, charges: 0, count: 0, wins: 0 };
        const netPnl = Number(t.netPnl || 0);
        const grossPnl = Number(t.pnl || 0);
        const chg = Number(t.charges || 0);
        monthMap[key].pnl += netPnl;
        monthMap[key].grossPnl += grossPnl;
        monthMap[key].charges += chg;
        monthMap[key].count += 1;
        if (t.status === 'WIN') monthMap[key].wins += 1;
      }

      return Object.entries(monthMap)
        .map(([month, v]) => ({
          month,
          pnl: v.pnl,
          grossPnl: v.grossPnl,
          charges: v.charges,
          count: v.count,
          winRate: v.count > 0 ? (v.wins / v.count) * 100 : 0,
          profitFactor: 0,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch monthly summary' });
  }
});

// ─── GET /api/analytics/strategy-comparison ──────────────────────────────────
router.get('/strategy-comparison', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = getCacheKey(req, 'strategy-comparison');
    const result = await getOrCompute(cacheKey, 60, async () => {
      const userId = req.userId!;
      const dateFilter = buildDateFilter(req);
      const trades = await prisma.trade.findMany({
        where: {
          userId,
          status: { in: ['WIN', 'LOSS', 'BREAKEVEN'] },
          ...(dateFilter ? { date: dateFilter } : {}),
        },
        select: { strategyId: true, netPnl: true, status: true, strategy: { select: { name: true } } },
      });

      const stratMap: Record<string, { name: string; pnl: number; count: number; wins: number; losses: number; grossWin: number; grossLoss: number }> = {};

      for (const t of trades) {
        const key = t.strategyId || '__untagged__';
        const name = (t.strategy as any)?.name || 'Untagged';
        if (!stratMap[key]) stratMap[key] = { name, pnl: 0, count: 0, wins: 0, losses: 0, grossWin: 0, grossLoss: 0 };
        const pnl = Number(t.netPnl || 0);
        stratMap[key].pnl += pnl;
        stratMap[key].count += 1;
        if (t.status === 'WIN') { stratMap[key].wins += 1; stratMap[key].grossWin += pnl; }
        if (t.status === 'LOSS') { stratMap[key].losses += 1; stratMap[key].grossLoss += Math.abs(pnl); }
      }

      return Object.values(stratMap).map(v => ({
        name: v.name,
        pnl: v.pnl,
        count: v.count,
        winRate: v.count > 0 ? (v.wins / v.count) * 100 : 0,
        avgWin: v.wins > 0 ? v.grossWin / v.wins : 0,
        avgLoss: v.losses > 0 ? v.grossLoss / v.losses : 0,
        profitFactor: v.grossLoss > 0 ? v.grossWin / v.grossLoss : v.grossWin > 0 ? 999 : 0,
        expectancy: v.count > 0 ? v.pnl / v.count : 0,
      })).sort((a, b) => b.pnl - a.pnl);
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch strategy comparison' });
  }
});

// ─── GET /api/analytics/charges-summary ──────────────────────────────────────
router.get('/charges-summary', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = getCacheKey(req, 'charges-summary');
    const result = await getOrCompute(cacheKey, 60, async () => {
      const userId = req.userId!;
      const dateFilter = buildDateFilter(req);
      const agg = await prisma.trade.aggregate({
        where: {
          userId,
          status: { in: ['WIN', 'LOSS', 'BREAKEVEN'] },
          ...(dateFilter ? { date: dateFilter } : {}),
        },
        _sum: { charges: true, pnl: true, netPnl: true },
        _count: { id: true },
      });

      const totalCharges = Number(agg._sum.charges || 0);
      const totalGross = Number(agg._sum.pnl || 0);
      const totalNet = Number(agg._sum.netPnl || 0);
      const tradeCount = agg._count.id;

      return {
        totalCharges,
        totalGross,
        totalNet,
        tradeCount,
        avgChargesPerTrade: tradeCount > 0 ? totalCharges / tradeCount : 0,
        chargesAsPctOfGross: totalGross !== 0 ? (totalCharges / Math.abs(totalGross)) * 100 : 0,
      };
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch charges summary' });
  }
});

// ─── GET /api/analytics/discipline-correlation ───────────────────────────────
router.get('/discipline-correlation', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = getCacheKey(req, 'discipline-correlation');
    const result = await getOrCompute(cacheKey, 60, async () => {
      const userId = req.userId!;
      const dateFilter = buildDateFilter(req);
      const trades = await prisma.trade.findMany({
        where: {
          userId,
          disciplineScore: { not: null },
          status: { in: ['WIN', 'LOSS', 'BREAKEVEN'] },
          ...(dateFilter ? { date: dateFilter } : {}),
        },
        select: { disciplineScore: true, disciplineBreakdown: true, netPnl: true, status: true, date: true },
        orderBy: { date: 'asc' },
      });

      // Group by discipline score bucket (1-5)
      const byScore: Record<number, { pnl: number; count: number; wins: number }> = {};
      for (let s = 1; s <= 5; s++) byScore[s] = { pnl: 0, count: 0, wins: 0 };

      for (const t of trades) {
        const score = t.disciplineScore!;
        if (!byScore[score]) byScore[score] = { pnl: 0, count: 0, wins: 0 };
        byScore[score].pnl += Number(t.netPnl || 0);
        byScore[score].count += 1;
        if (t.status === 'WIN') byScore[score].wins += 1;
      }

      const scoreData = Object.entries(byScore).map(([score, v]) => ({
        score: Number(score),
        pnl: v.pnl,
        count: v.count,
        winRate: v.count > 0 ? (v.wins / v.count) * 100 : 0,
        avgPnl: v.count > 0 ? v.pnl / v.count : 0,
      }));

      // Aggregate discipline dimension data from disciplineBreakdown JSON
      const dimensionMap: Record<string, { total: number; count: number }> = {};
      for (const t of trades) {
        if (!t.disciplineBreakdown || typeof t.disciplineBreakdown !== 'object') continue;
        const breakdown = t.disciplineBreakdown as Record<string, number>;
        for (const [dim, val] of Object.entries(breakdown)) {
          if (!dimensionMap[dim]) dimensionMap[dim] = { total: 0, count: 0 };
          dimensionMap[dim].total += val;
          dimensionMap[dim].count += 1;
        }
      }

      const dimensionAvgs = Object.entries(dimensionMap).map(([dim, v]) => ({
        dimension: dim,
        avg: v.count > 0 ? v.total / v.count : 0,
      }));

      return { byScore: scoreData, dimensionAvgs, totalScored: trades.length };
    });

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch discipline correlation' });
  }
});

export default router;
