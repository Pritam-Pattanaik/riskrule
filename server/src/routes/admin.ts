import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, requireRoles, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/admin/users
router.get('/users', authenticate, requireRoles(['SUB_ADMIN', 'ADMIN', 'SUPER_ADMIN']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await prisma.$queryRaw<any[]>`
      SELECT
        u.id,
        u.email,
        u.full_name as "fullName",
        u.phone_number as "phoneNumber",
        u.role,
        u.created_at as "createdAt",
        COUNT(t.id)::int as "totalTrades",
        COALESCE(SUM(t.net_pnl), 0)::float as "netPnl"
      FROM users u
      LEFT JOIN trades t ON t.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    res.json(result);
  } catch (err: any) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetUserId = req.params.id as string;
    const { role } = req.body;

    if (!['USER', 'SUB_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    // Prevent promoting users to SUPER_ADMIN through the admin panel.
    // SUPER_ADMIN accounts should only be created via the seed-admin script.
    if (role === 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Cannot promote to SUPER_ADMIN via the admin panel. Use the seed-admin script instead.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const oldRole = existingUser.role;

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role, updatedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'CHANGE_ROLE',
        targetType: 'user',
        targetId: targetUserId,
        details: JSON.stringify({ oldRole, newRole: role, email: updated.email }),
      }
    });

    res.json({
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      role: updated.role
    });
  } catch (err: any) {
    console.error('Update user role error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats
router.get('/stats', authenticate, requireRoles(['SUPER_ADMIN']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [userCount, tradeStats, brokerStats, aiCount] = await Promise.all([
      prisma.user.count(),
      prisma.$queryRaw<any[]>`SELECT COUNT(*)::int as total, COALESCE(SUM(net_pnl), 0)::float as "totalPnl", COUNT(CASE WHEN status = 'WIN' THEN 1 END)::int as wins FROM trades`,
      prisma.brokerConnection.count({ where: { isActive: true } }),
      prisma.aiInsight.count()
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentUsers = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });
    const prevUsers = await prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } });

    const recentTrades = await prisma.trade.count({ where: { createdAt: { gte: thirtyDaysAgo } } });
    const prevTrades = await prisma.trade.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } });

    const stats = tradeStats[0] || { total: 0, totalPnl: 0, wins: 0 };
    const winRate = stats.total > 0 ? ((stats.wins / stats.total) * 100) : 0;

    let userGrowth = 0;
    if (prevUsers > 0) {
      userGrowth = Math.round(((recentUsers - prevUsers) / prevUsers) * 100);
    } else if (recentUsers > 0) {
      userGrowth = 100;
    }

    let tradeGrowth = 0;
    if (prevTrades > 0) {
      tradeGrowth = Math.round(((recentTrades - prevTrades) / prevTrades) * 100);
    } else if (recentTrades > 0) {
      tradeGrowth = 100;
    }

    res.json({
      totalUsers: userCount,
      totalTrades: stats.total,
      totalPnl: stats.totalPnl,
      winRate: Math.round(winRate * 100) / 100,
      activeBrokers: brokerStats,
      aiInsights: aiCount,
      userGrowth,
      tradeGrowth,
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats/charts
router.get('/stats/charts', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const period = (req.query.period as string) || 'daily';
    let userSignups: any[];
    let tradeVolume: any[];

    if (period === 'weekly') {
      userSignups = await prisma.$queryRaw<any[]>`
        SELECT date_trunc('week', created_at)::date as date, COUNT(*)::int as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
        GROUP BY date_trunc('week', created_at)
        ORDER BY date ASC
      `;
      tradeVolume = await prisma.$queryRaw<any[]>`
        SELECT date_trunc('week', created_at)::date as date, COUNT(*)::int as count, COALESCE(SUM(net_pnl), 0)::float as pnl
        FROM trades
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
        GROUP BY date_trunc('week', created_at)
        ORDER BY date ASC
      `;
    } else if (period === 'monthly') {
      userSignups = await prisma.$queryRaw<any[]>`
        SELECT date_trunc('month', created_at)::date as date, COUNT(*)::int as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY date_trunc('month', created_at)
        ORDER BY date ASC
      `;
      tradeVolume = await prisma.$queryRaw<any[]>`
        SELECT date_trunc('month', created_at)::date as date, COUNT(*)::int as count, COALESCE(SUM(net_pnl), 0)::float as pnl
        FROM trades
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY date_trunc('month', created_at)
        ORDER BY date ASC
      `;
    } else {
      userSignups = await prisma.$queryRaw<any[]>`
        SELECT DATE(created_at) as date, COUNT(*)::int as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
      tradeVolume = await prisma.$queryRaw<any[]>`
        SELECT DATE(created_at) as date, COUNT(*)::int as count, COALESCE(SUM(net_pnl), 0)::float as pnl
        FROM trades
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
    }

    res.json({ userSignups, tradeVolume });
  } catch (err: any) {
    console.error('Admin charts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats/activity
router.get('/stats/activity', authenticate, requireRoles(['SUPER_ADMIN']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activity = await prisma.$queryRaw<any[]>`
      (
        SELECT 'signup' as type, full_name as description, created_at as timestamp, id as "userId"
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 'trade' as type, symbol || ' ' || status as description, created_at as timestamp, user_id as "userId"
        FROM trades
        ORDER BY created_at DESC
        LIMIT 5
      )
      ORDER BY timestamp DESC
      LIMIT 10
    `;

    const userIds = [...new Set(activity.map(a => a.userId).filter(Boolean))];
    const users = userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, fullName: true, email: true },
        })
      : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const enriched = activity.map(a => ({
      ...a,
      userName: userMap.get(a.userId)?.fullName || userMap.get(a.userId)?.email || null,
    }));

    res.json({ activity: enriched });
  } catch (err: any) {
    console.error('Admin activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/users/list
router.get('/users/list', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = req.query.search as string || '';
    const roleFilter = req.query.role as string || '';
    const sort = (req.query.sort as string) || 'created_at';
    const order = ((req.query.order as string) || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const offset = (page - 1) * limit;

    const allowedSorts: Record<string, string> = {
      created_at: 'u.created_at',
      createdAt: 'u.created_at',
      email: 'u.email',
      fullName: 'u.full_name',
      full_name: 'u.full_name',
      role: 'u.role',
      totalTrades: '"totalTrades"',
      netPnl: '"netPnl"',
    };
    const sortColumn = allowedSorts[sort] || 'u.created_at';

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (u.full_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    if (roleFilter) {
      whereClause += ` AND u.role = $${paramIndex}`;
      params.push(roleFilter);
      paramIndex++;
    }

    const countResult = await prisma.$queryRawUnsafe<any[]>(
      `SELECT COUNT(DISTINCT u.id)::int as total FROM users u ${whereClause}`,
      ...params
    );
    const total = countResult[0]?.total || 0;

    const users = await prisma.$queryRawUnsafe<any[]>(
      `SELECT
        u.id, u.email, u.full_name as "fullName", u.phone_number as "phoneNumber", u.role, u.created_at as "createdAt",
        COUNT(t.id)::int as "totalTrades",
        COALESCE(SUM(t.net_pnl), 0)::float as "netPnl"
      FROM users u
      LEFT JOIN trades t ON t.user_id = u.id
      ${whereClause}
      GROUP BY u.id
      ORDER BY ${sortColumn} ${order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    res.json({ users, total, page, limit });
  } catch (err: any) {
    console.error('Admin users list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/users/:id/detail
router.get('/users/:id/detail', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      include: {
        trades: { orderBy: { date: 'desc' }, take: 50 },
        strategies: true,
        journalEntries: { orderBy: { date: 'desc' }, take: 20 },
        // H-1 fix: Only select non-sensitive broker fields (exclude apiKey, apiSecret, accessToken, refreshToken, metadata)
        brokerConnections: {
          select: {
            id: true, broker: true, clientId: true,
            isActive: true, lastSyncedAt: true, createdAt: true,
          }
        },
        aiInsights: { orderBy: { createdAt: 'desc' }, take: 20 },
        coachMemories: true,
        referredUsers: {
          select: {
            id: true,
            fullName: true,
            email: true,
            plan: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        referrer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            referralCode: true,
          },
        },
        affiliateEarnings: { orderBy: { createdAt: 'desc' }, take: 50 },
        affiliatePayouts: { orderBy: { createdAt: 'desc' }, take: 50 },
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // H-1 fix: Strip password hash and tokenVersion from response
    const { password: _pwd, tokenVersion: _tv, ...safeUser } = user;
    res.json(safeUser);
  } catch (err: any) {
    console.error('Admin user detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.params.id === req.userId) {
      res.status(400).json({ error: 'Cannot delete yourself' });
      return;
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id as string } });
    if (!target) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    if (target.role === 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Cannot delete a Super Admin' });
      return;
    }

    await prisma.auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'DELETE_USER',
        targetType: 'user',
        targetId: req.params.id as string,
        details: JSON.stringify({ email: target.email, fullName: target.fullName }),
      }
    });

    await prisma.user.delete({ where: { id: req.params.id as string } });

    res.json({ success: true });
  } catch (err: any) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/trades/by-user - Groups trades on the basis of user
router.get('/trades/by-user', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10)); // users per page
    const skip = (page - 1) * limit;

    const where: any = {};
    const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (req.query.userId && req.query.userId !== 'ALL' && isValidUuid(req.query.userId as string)) {
      where.userId = req.query.userId as string;
    }
    if (req.query.market && req.query.market !== 'ALL') where.market = req.query.market as string;
    if (req.query.instrumentType && req.query.instrumentType !== 'ALL') where.instrumentType = req.query.instrumentType as string;
    if (req.query.status && req.query.status !== 'ALL') where.status = req.query.status as string;

    if (req.query.startDate || req.query.endDate) {
      where.date = {};
      if (req.query.startDate) where.date.gte = new Date(req.query.startDate as string);
      if (req.query.endDate) where.date.lte = new Date(req.query.endDate as string);
    }

    if (req.query.minPnl || req.query.maxPnl) {
      where.netPnl = {};
      if (req.query.minPnl) where.netPnl.gte = parseFloat(req.query.minPnl as string);
      if (req.query.maxPnl) where.netPnl.lte = parseFloat(req.query.maxPnl as string);
    }

    if (req.query.search) {
      const searchStr = (req.query.search as string).trim();
      if (searchStr) {
        where.OR = [
          { symbol: { contains: searchStr, mode: 'insensitive' } },
          { user: { fullName: { contains: searchStr, mode: 'insensitive' } } },
          { user: { email: { contains: searchStr, mode: 'insensitive' } } },
        ];
      }
    }

    // 1. Group trades by userId to identify traders matching the criteria
    const userGroupsAgg = await prisma.trade.groupBy({
      by: ['userId'],
      where,
      _count: { id: true },
      _sum: { netPnl: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const totalUsers = userGroupsAgg.length;
    const paginatedGroups = userGroupsAgg.slice(skip, skip + limit);
    const targetUserIds = paginatedGroups.map(g => g.userId);

    // 2. Fetch User profiles for these target users
    const users = targetUserIds.length > 0 ? await prisma.user.findMany({
      where: { id: { in: targetUserIds } },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    }) : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    // 3. Fetch recent trades for these target users
    const trades = targetUserIds.length > 0 ? await prisma.trade.findMany({
      where: {
        ...where,
        userId: { in: targetUserIds },
      },
      include: {
        user: { select: { id: true, email: true, fullName: true, role: true } },
      },
      orderBy: { date: 'desc' },
      take: 200,
    }) : [];

    // Map trades to userId
    const tradesByUser: Record<string, typeof trades> = {};
    for (const t of trades) {
      if (!tradesByUser[t.userId]) tradesByUser[t.userId] = [];
      tradesByUser[t.userId].push(t);
    }

    const userGroups = paginatedGroups.map(g => {
      const u = userMap.get(g.userId);
      const userTrades = tradesByUser[g.userId] || [];
      const winCount = userTrades.filter(t => t.status === 'WIN' || Number(t.netPnl ?? t.pnl ?? 0) > 0).length;
      const lossCount = userTrades.filter(t => t.status === 'LOSS' || Number(t.netPnl ?? t.pnl ?? 0) < 0).length;
      const totalCount = g._count.id;
      const winRate = (winCount + lossCount) > 0 ? Math.round((winCount / (winCount + lossCount)) * 1000) / 10 : 0;

      return {
        user: {
          id: g.userId,
          email: u?.email || 'Unknown',
          fullName: u?.fullName || 'Anonymous Trader',
          role: u?.role || 'USER',
          createdAt: u?.createdAt,
        },
        stats: {
          totalTrades: totalCount,
          winCount,
          lossCount,
          winRate,
          totalPnl: Number(g._sum.netPnl || 0),
          lastTradeDate: userTrades[0]?.date || null,
        },
        trades: userTrades,
      };
    });

    // Overall platform statistics with the active filters
    const aggResult = await prisma.trade.aggregate({
      where,
      _count: { id: true },
      _sum: { netPnl: true },
      _avg: { netPnl: true },
    });
    const totalFilteredTrades = aggResult._count.id || 0;
    const winCount = await prisma.trade.count({ where: { ...where, status: 'WIN' } });
    const winRate = totalFilteredTrades > 0 ? Math.round((winCount / totalFilteredTrades) * 10000) / 100 : 0;

    res.json({
      userGroups,
      totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      stats: {
        totalUsers,
        totalTrades: totalFilteredTrades,
        winRate,
        avgPnl: aggResult._avg.netPnl ? Number(aggResult._avg.netPnl) : 0,
        totalPnl: aggResult._sum.netPnl ? Number(aggResult._sum.netPnl) : 0,
      },
    });
  } catch (err: any) {
    console.error('Admin trades by user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/trades
router.get('/trades', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (req.query.userId && req.query.userId !== 'ALL' && isValidUuid(req.query.userId as string)) {
      where.userId = req.query.userId as string;
    }
    if (req.query.market && req.query.market !== 'ALL') where.market = req.query.market as string;
    if (req.query.instrumentType && req.query.instrumentType !== 'ALL') where.instrumentType = req.query.instrumentType as string;
    if (req.query.symbol) where.symbol = { contains: req.query.symbol as string, mode: 'insensitive' };
    if (req.query.status && req.query.status !== 'ALL') where.status = req.query.status as string;

    if (req.query.startDate || req.query.endDate) {
      where.date = {};
      if (req.query.startDate) where.date.gte = new Date(req.query.startDate as string);
      if (req.query.endDate) where.date.lte = new Date(req.query.endDate as string);
    }

    if (req.query.minPnl || req.query.maxPnl) {
      where.netPnl = {};
      if (req.query.minPnl) where.netPnl.gte = parseFloat(req.query.minPnl as string);
      if (req.query.maxPnl) where.netPnl.lte = parseFloat(req.query.maxPnl as string);
    }

    if (req.query.search) {
      const searchStr = (req.query.search as string).trim();
      if (searchStr) {
        where.OR = [
          { symbol: { contains: searchStr, mode: 'insensitive' } },
          { user: { fullName: { contains: searchStr, mode: 'insensitive' } } },
          { user: { email: { contains: searchStr, mode: 'insensitive' } } },
        ];
      }
    }

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        include: { user: { select: { id: true, email: true, fullName: true, role: true } } },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.trade.count({ where }),
    ]);

    const aggResult = await prisma.trade.aggregate({
      where,
      _count: { id: true },
      _sum: { netPnl: true },
      _avg: { netPnl: true },
    });
    const winCount = await prisma.trade.count({ where: { ...where, status: 'WIN' } });
    const totalFiltered = aggResult._count.id || 0;
    const winRate = totalFiltered > 0 ? Math.round((winCount / totalFiltered) * 10000) / 100 : 0;

    res.json({
      trades,
      total,
      page,
      limit,
      stats: {
        totalTrades: totalFiltered,
        winRate,
        avgPnl: aggResult._avg.netPnl ? Number(aggResult._avg.netPnl) : 0,
        totalPnl: aggResult._sum.netPnl ? Number(aggResult._sum.netPnl) : 0,
      },
    });
  } catch (err: any) {
    console.error('Admin trades error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/brokers
router.get('/brokers', authenticate, requireRoles(['SUPER_ADMIN']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const connections = await prisma.brokerConnection.findMany({
      include: { user: { select: { email: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      total: connections.length,
      active: connections.filter(c => c.isActive).length,
      inactive: connections.filter(c => !c.isActive).length,
    };

    res.json({ connections, stats });
  } catch (err: any) {
    console.error('Admin brokers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/ai-insights
router.get('/ai-insights', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.type) where.type = req.query.type as string;
    if (req.query.userId) where.userId = req.query.userId as string;

    const [insights, total] = await Promise.all([
      prisma.aiInsight.findMany({
        where,
        include: { user: { select: { email: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aiInsight.count({ where }),
    ]);

    const typeBreakdown = await prisma.aiInsight.groupBy({
      by: ['type'],
      _count: { id: true },
    });
    const byType: Record<string, number> = {};
    typeBreakdown.forEach(t => {
      byType[t.type || 'unknown'] = t._count.id;
    });

    res.json({
      insights,
      total,
      page,
      limit,
      stats: {
        totalInsights: total,
        byType,
      },
    });
  } catch (err: any) {
    console.error('Admin AI insights error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.action) where.action = req.query.action as string;

    if (req.query.startDate || req.query.endDate) {
      where.timestamp = {};
      if (req.query.startDate) where.timestamp.gte = new Date(req.query.startDate as string);
      if (req.query.endDate) where.timestamp.lte = new Date(req.query.endDate as string);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { admin: { select: { email: true, fullName: true } } },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({ logs, total, page, limit });
  } catch (err: any) {
    console.error('Admin audit logs error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/settings
router.get('/settings', authenticate, requireRoles(['SUPER_ADMIN']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = await prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
    res.json({ settings });
  } catch (err: any) {
    console.error('Admin get settings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/settings
router.patch('/settings', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      res.status(400).json({ error: 'Key and value are required' });
      return;
    }

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'UPDATE_SETTING',
        targetType: 'setting',
        targetId: key,
        details: JSON.stringify({ key, value }),
      }
    });

    res.json(setting);
  } catch (err: any) {
    console.error('Admin update setting error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/strategies
router.get('/strategies', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const search = (req.query.search as string || '').trim();
    const type = (req.query.type as string || 'ALL').toUpperCase();
    const market = req.query.market as string || '';
    const isActiveParam = req.query.isActive as string || '';
    const userId = req.query.userId as string || '';
    const sort = (req.query.sort as string) || 'createdAt';
    const order = ((req.query.order as string) || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

    const where: any = {};
    if (userId) where.userId = userId;
    if (isActiveParam === 'true') where.isActive = true;
    if (isActiveParam === 'false') where.isActive = false;
    if (type === 'DEFAULT') where.isDefault = true;
    if (type === 'CUSTOM') where.isDefault = false;
    if (market && market !== 'ALL') {
      where.market = { has: market };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { rules: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: any = {};
    if (sort === 'name') orderBy.name = order;
    else if (sort === 'createdAt' || sort === 'created_at') orderBy.createdAt = order;
    else orderBy.createdAt = order;

    const [strategies, total, totalStrategies, defaultStrategies, customStrategies, activeStrategies, totalTradesAgg] = await Promise.all([
      prisma.strategy.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, fullName: true }
          },
          trades: {
            select: { id: true, netPnl: true, status: true }
          }
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.strategy.count({ where }),
      prisma.strategy.count(),
      prisma.strategy.count({ where: { isDefault: true } }),
      prisma.strategy.count({ where: { isDefault: false } }),
      prisma.strategy.count({ where: { isActive: true } }),
      prisma.trade.aggregate({
        where: { strategyId: { not: null } },
        _count: { id: true },
        _sum: { netPnl: true },
      })
    ]);

    const formattedStrategies = strategies.map(s => {
      const tradesCount = s.trades.length;
      const totalPnl = s.trades.reduce((sum, t) => sum + (Number(t.netPnl) || 0), 0);
      const winCount = s.trades.filter(t => t.status === 'WIN').length;
      const winRate = tradesCount > 0 ? Math.round((winCount / tradesCount) * 10000) / 100 : 0;
      const avgPnl = tradesCount > 0 ? totalPnl / tradesCount : 0;

      const { trades, ...rest } = s;
      return {
        ...rest,
        tradesCount,
        totalPnl,
        winRate,
        avgPnl,
      };
    });

    res.json({
      strategies: formattedStrategies,
      total,
      page,
      limit,
      stats: {
        totalStrategies,
        defaultStrategies,
        customStrategies,
        activeStrategies,
        inactiveStrategies: totalStrategies - activeStrategies,
        totalTradesTagged: totalTradesAgg._count.id || 0,
        totalPnl: totalTradesAgg._sum.netPnl ? Number(totalTradesAgg._sum.netPnl) : 0,
      }
    });
  } catch (err: any) {
    console.error('Admin strategies error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/strategies/default (Admin creates system-wide default strategy)
router.post('/strategies/default', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, rules, market, timeframe, isActive } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Strategy name is required' });
      return;
    }
    const strategy = await prisma.strategy.create({
      data: {
        userId: req.userId!,
        name,
        description: description || null,
        rules: rules || null,
        market: market || [],
        timeframe: timeframe || null,
        isDefault: true,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        user: { select: { id: true, email: true, fullName: true } }
      }
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'CREATE_DEFAULT_STRATEGY',
        targetType: 'strategy',
        targetId: strategy.id,
        details: JSON.stringify({ name: strategy.name, market: strategy.market, timeframe: strategy.timeframe }),
      }
    });

    res.status(201).json({
      ...strategy,
      tradesCount: 0,
      totalPnl: 0,
      winRate: 0,
      avgPnl: 0,
    });
  } catch (err: any) {
    console.error('Admin create default strategy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/strategies/:id
router.get('/strategies/:id', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const strategy = await prisma.strategy.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, fullName: true, role: true } },
        trades: {
          orderBy: { date: 'desc' },
          take: 50,
          select: {
            id: true,
            symbol: true,
            market: true,
            direction: true,
            entryPrice: true,
            exitPrice: true,
            netPnl: true,
            status: true,
            date: true,
          }
        }
      }
    });

    if (!strategy) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }

    const tradesCount = strategy.trades.length;
    const totalPnl = strategy.trades.reduce((sum, t) => sum + (Number(t.netPnl) || 0), 0);
    const winCount = strategy.trades.filter(t => t.status === 'WIN').length;
    const winRate = tradesCount > 0 ? Math.round((winCount / tradesCount) * 10000) / 100 : 0;
    const avgPnl = tradesCount > 0 ? totalPnl / tradesCount : 0;

    res.json({
      ...strategy,
      tradesCount,
      totalPnl,
      winRate,
      avgPnl,
    });
  } catch (err: any) {
    console.error('Admin strategy detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/strategies/:id
router.patch('/strategies/:id', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, rules, market, timeframe, isActive, isDefault } = req.body;

    const existing = await prisma.strategy.findUnique({
      where: { id },
      include: { user: { select: { email: true } } }
    });
    if (!existing) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }

    const updated = await prisma.strategy.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(rules !== undefined ? { rules } : {}),
        ...(market !== undefined ? { market } : {}),
        ...(timeframe !== undefined ? { timeframe } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(isDefault !== undefined ? { isDefault } : {}),
      },
      include: {
        user: { select: { id: true, email: true, fullName: true } }
      }
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'UPDATE_STRATEGY',
        targetType: 'strategy',
        targetId: id,
        details: JSON.stringify({
          strategyName: updated.name,
          ownerEmail: existing.user.email,
          changes: { name, description, rules, market, timeframe, isActive, isDefault }
        }),
      }
    });

    res.json(updated);
  } catch (err: any) {
    console.error('Admin update strategy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/strategies/:id
router.delete('/strategies/:id', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.strategy.findUnique({
      where: { id },
      include: { user: { select: { email: true } } }
    });
    if (!existing) {
      res.status(404).json({ error: 'Strategy not found' });
      return;
    }

    // Unlink trades tagged with this strategy
    await prisma.trade.updateMany({
      where: { strategyId: id },
      data: { strategyId: null },
    });

    await prisma.strategy.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'DELETE_STRATEGY',
        targetType: 'strategy',
        targetId: id,
        details: JSON.stringify({
          strategyName: existing.name,
          ownerEmail: existing.user.email,
        }),
      }
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error('Admin delete strategy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// SUPER ADMIN: AFFILIATE & REFERRALS MANAGEMENT
// ==========================================

// GET /api/admin/affiliates/stats
router.get('/affiliates/stats', authenticate, requireRoles(['SUPER_ADMIN']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. Total affiliates (users with referral code or non-zero affiliate clicks or referred someone)
    const totalAffiliates = await (prisma as any).user.count({
      where: {
        OR: [
          { referralCode: { not: null } },
          { affiliateClicks: { gt: 0 } },
          { referredUsers: { some: {} } },
        ]
      }
    });

    // 2. Total clicks across all affiliates
    const clicksAgg = await (prisma as any).user.aggregate({
      _sum: { affiliateClicks: true }
    });
    const totalClicks = clicksAgg._sum.affiliateClicks || 0;

    // 3. Total referred signups
    const totalSignups = await (prisma as any).user.count({
      where: { referredById: { not: null } }
    });

    // 4. Total conversions to PRO plan
    const totalConversions = await (prisma as any).user.count({
      where: { referredById: { not: null }, plan: 'PRO' }
    });

    const conversionRate = totalSignups > 0 ? Math.round((totalConversions / totalSignups) * 1000) / 10 : 0;

    // 5. Total commissions credited
    let totalCommissions = 0;
    try {
      const earnAgg = await (prisma as any).affiliateEarning.aggregate({
        _sum: { amount: true }
      });
      totalCommissions = earnAgg._sum.amount || 0;
    } catch {
      totalCommissions = totalConversions * 400;
    }
    if (totalCommissions === 0 && totalConversions > 0) {
      totalCommissions = totalConversions * 400;
    }

    // 6. Payout metrics
    let paidPayouts = 0;
    let pendingPayouts = 0;
    try {
      const paidAgg = await (prisma as any).affiliatePayout.aggregate({
        where: { status: 'Paid' },
        _sum: { amount: true }
      });
      paidPayouts = paidAgg._sum.amount || 0;

      const pendingAgg = await (prisma as any).affiliatePayout.aggregate({
        where: { status: { in: ['Processing', 'Pending'] } },
        _sum: { amount: true }
      });
      pendingPayouts = pendingAgg._sum.amount || 0;
    } catch (e) {
      // ignore
    }

    res.json({
      totalAffiliates,
      totalClicks,
      totalSignups,
      totalConversions,
      conversionRate,
      totalCommissions,
      paidPayouts,
      pendingPayouts,
      commissionPercent: 20,
      monthlyRewardPerPro: 400,
    });
  } catch (err: any) {
    console.error('Admin affiliates stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/affiliates/list
router.get('/affiliates/list', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const search = ((req.query.search as string) || '').trim();

    const where: any = {
      OR: [
        { referralCode: { not: null } },
        { affiliateClicks: { gt: 0 } },
        { referredUsers: { some: {} } },
      ]
    };

    if (search) {
      where.AND = [
        {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { referralCode: { contains: search, mode: 'insensitive' } },
          ]
        }
      ];
    }

    const [affiliates, total] = await Promise.all([
      (prisma as any).user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          plan: true,
          referralCode: true,
          affiliateClicks: true,
          flowPreferences: true,
          createdAt: true,
          referredUsers: {
            select: {
              id: true,
              fullName: true,
              email: true,
              plan: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          affiliateEarnings: {
            select: { amount: true, status: true },
          },
          affiliatePayouts: {
            select: { id: true, amount: true, status: true, invoiceId: true, payoutMethod: true, createdAt: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      (prisma as any).user.count({ where }),
    ]);

    const formattedAffiliates = affiliates.map((u: any) => {
      const signupsCount = u.referredUsers?.length || 0;
      const conversionsCount = u.referredUsers?.filter((r: any) => r.plan === 'PRO').length || 0;
      const conversionRate = signupsCount > 0 ? Math.round((conversionsCount / signupsCount) * 1000) / 10 : 0;

      const totalEarningsReal = u.affiliateEarnings?.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) || 0;
      const totalEarnings = totalEarningsReal > 0 ? totalEarningsReal : conversionsCount * 400;

      const totalPaid = u.affiliatePayouts
        ?.filter((p: any) => p.status === 'Paid')
        ?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

      const pendingPayouts = u.affiliatePayouts?.filter((p: any) => p.status === 'Processing' || p.status === 'Pending').length || 0;
      const availableBalance = Math.max(0, totalEarnings - totalPaid);

      const bankDetails = (u.flowPreferences as any)?.bankDetails || null;

      return {
        id: u.id,
        email: u.email,
        fullName: u.fullName || 'Anonymous Trader',
        role: u.role,
        plan: u.plan,
        referralCode: u.referralCode || 'NOT_SET',
        clicks: u.affiliateClicks || 0,
        signupsCount,
        conversionsCount,
        conversionRate,
        totalEarnings,
        totalPaid,
        availableBalance,
        pendingPayouts,
        bankDetails,
        createdAt: u.createdAt,
        recentReferrals: (u.referredUsers || []).slice(0, 5),
      };
    });

    res.json({
      affiliates: formattedAffiliates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error('Admin affiliates list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/affiliates/payouts
router.get('/affiliates/payouts', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const status = (req.query.status as string) || 'ALL';

    const where: any = {};
    if (status !== 'ALL') {
      where.status = status;
    }

    const [payouts, total] = await Promise.all([
      (prisma as any).affiliatePayout.findMany({
        where,
        include: {
          affiliate: {
            select: { id: true, fullName: true, email: true, referralCode: true, flowPreferences: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      (prisma as any).affiliatePayout.count({ where }),
    ]);

    const formattedPayouts = payouts.map((p: any) => {
      const bankDetails = (p.affiliate?.flowPreferences as any)?.bankDetails || null;
      return {
        ...p,
        bankDetails,
      };
    });

    res.json({ payouts: formattedPayouts, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err: any) {
    console.error('Admin affiliate payouts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/affiliates/payouts/:id/status
router.patch('/affiliates/payouts/:id/status', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['Paid', 'Processing', 'Rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const existing = await (prisma as any).affiliatePayout.findUnique({
      where: { id },
      include: { affiliate: { select: { id: true, email: true, fullName: true } } }
    });

    if (!existing) {
      res.status(404).json({ error: 'Payout not found' });
      return;
    }

    const updated = await (prisma as any).affiliatePayout.update({
      where: { id },
      data: { status },
    });

    // Notify user in real-time
    try {
      await (prisma as any).notification.create({
        data: {
          userId: existing.affiliateId,
          type: 'AFFILIATE_PAYOUT_UPDATE',
          title: status === 'Paid' ? 'Payout Sent Successfully! 💸' : `Payout Update: ${status}`,
          message: status === 'Paid'
            ? `Your payout request of ₹${existing.amount} (${existing.invoiceId}) has been processed and paid.`
            : `Your payout request of ₹${existing.amount} has been updated to: ${status}. ${notes ? `Note: ${notes}` : ''}`,
          isRead: false,
        }
      });
    } catch (nErr) {
      console.warn('Failed to send payout notification:', nErr);
    }

    // Audit log
    await (prisma as any).auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'UPDATE_AFFILIATE_PAYOUT',
        targetType: 'affiliate_payout',
        targetId: id,
        details: JSON.stringify({
          invoiceId: existing.invoiceId,
          affiliateEmail: existing.affiliate?.email,
          previousStatus: existing.status,
          newStatus: status,
          amount: existing.amount,
          notes,
        }),
      }
    });

    res.json({ success: true, payout: updated });
  } catch (err: any) {
    console.error('Update affiliate payout status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/affiliates/direct-payout
router.post('/affiliates/direct-payout', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { affiliateId, amount, method = 'Direct Bank Transfer', notes } = req.body;

    if (!affiliateId || !amount || amount <= 0) {
      res.status(400).json({ error: 'Valid affiliateId and amount are required' });
      return;
    }

    const affiliate = await (prisma as any).user.findUnique({
      where: { id: affiliateId },
      select: { id: true, fullName: true, email: true, referralCode: true },
    });

    if (!affiliate) {
      res.status(404).json({ error: 'Affiliate not found' });
      return;
    }

    const invoiceId = `INV-ADM-${affiliate.referralCode || 'RR'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payout = await (prisma as any).affiliatePayout.create({
      data: {
        affiliateId,
        amount: parseFloat(amount),
        currency: 'INR',
        referralsCount: 1,
        payoutMethod: method,
        status: 'Paid',
        invoiceId,
      }
    });

    try {
      await (prisma as any).notification.create({
        data: {
          userId: affiliateId,
          type: 'AFFILIATE_PAYOUT_RECEIVED',
          title: 'Payout Processed by Admin! 💸',
          message: `A direct payout of ₹${amount} has been issued to you by the platform administrator (${invoiceId}).`,
          isRead: false,
        }
      });
    } catch (nErr) {
      console.warn('Failed to send notification:', nErr);
    }

    await (prisma as any).auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'DIRECT_AFFILIATE_PAYOUT',
        targetType: 'affiliate_payout',
        targetId: payout.id,
        details: JSON.stringify({
          affiliateEmail: affiliate.email,
          amount,
          method,
          invoiceId,
          notes,
        }),
      }
    });

    res.json({ success: true, payout });
  } catch (err: any) {
    console.error('Direct affiliate payout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/affiliates/referrals
router.get('/affiliates/referrals', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [referredUsers, total] = await Promise.all([
      (prisma as any).user.findMany({
        where: { referredById: { not: null } },
        select: {
          id: true,
          fullName: true,
          email: true,
          plan: true,
          createdAt: true,
          referrer: {
            select: { id: true, fullName: true, email: true, referralCode: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      (prisma as any).user.count({ where: { referredById: { not: null } } }),
    ]);

    res.json({
      referrals: referredUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error('Admin affiliate referrals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
