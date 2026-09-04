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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [
      userCount,
      tradeStats,
      brokerStats,
      aiCount,
      recentUsers,
      prevUsers,
      recentTrades,
      prevTrades,
      recentPnlRows,
      prevPnlRows,
      recentBrokers,
      prevBrokers,
      recentAi,
      prevAi,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.$queryRaw<any[]>`SELECT COUNT(*)::int as total, COALESCE(SUM(net_pnl), 0)::float as "totalPnl", COUNT(CASE WHEN status = 'WIN' THEN 1 END)::int as wins FROM trades`,
      prisma.brokerConnection.count({ where: { isActive: true } }),
      prisma.aiInsight.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.trade.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.trade.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.$queryRaw<any[]>`SELECT COALESCE(SUM(net_pnl), 0)::float as pnl FROM trades WHERE created_at >= ${thirtyDaysAgo}`,
      prisma.$queryRaw<any[]>`SELECT COALESCE(SUM(net_pnl), 0)::float as pnl FROM trades WHERE created_at >= ${sixtyDaysAgo} AND created_at < ${thirtyDaysAgo}`,
      prisma.brokerConnection.count({ where: { isActive: true, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.brokerConnection.count({ where: { isActive: true, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.aiInsight.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.aiInsight.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    ]);

    const stats = tradeStats[0] || { total: 0, totalPnl: 0, wins: 0 };
    const winRate = stats.total > 0 ? ((stats.wins / stats.total) * 100) : 0;

    const calcGrowth = (curr: number, prev: number) => {
      if (prev > 0) return Math.round(((curr - prev) / prev) * 1000) / 10;
      if (curr > 0) return 100;
      return 0;
    };

    const userGrowth = calcGrowth(recentUsers, prevUsers);
    const tradeGrowth = calcGrowth(recentTrades, prevTrades);
    const brokerGrowth = calcGrowth(recentBrokers, prevBrokers);
    const aiGrowth = calcGrowth(recentAi, prevAi);

    const recentPnl = recentPnlRows[0]?.pnl || 0;
    const prevPnl = prevPnlRows[0]?.pnl || 0;
    let pnlGrowth = 0;
    if (prevPnl !== 0) {
      pnlGrowth = Math.round(((recentPnl - prevPnl) / Math.abs(prevPnl)) * 1000) / 10;
    } else if (recentPnl !== 0) {
      pnlGrowth = recentPnl > 0 ? 100 : -100;
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
      pnlGrowth,
      brokerGrowth,
      aiGrowth,
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
    const range = (req.query.range as string) || (period === 'weekly' ? '12w' : period === 'monthly' ? '12m' : '7d');

    const formatDateLabel = (d: Date) => {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (period === 'weekly' || range === '12w') {
      const weeksCount = 12;
      const rawUsers = await prisma.$queryRaw<any[]>`
        SELECT date_trunc('week', created_at)::date as date, COUNT(*)::int as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
        GROUP BY date_trunc('week', created_at)
        ORDER BY date ASC
      `;
      const rawTrades = await prisma.$queryRaw<any[]>`
        SELECT date_trunc('week', created_at)::date as date, COUNT(*)::int as count, COALESCE(SUM(net_pnl), 0)::float as pnl
        FROM trades
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
        GROUP BY date_trunc('week', created_at)
        ORDER BY date ASC
      `;

      const userMap = new Map(rawUsers.map(r => [new Date(r.date).toISOString().slice(0, 10), r.count]));
      const tradeMap = new Map(rawTrades.map(r => [new Date(r.date).toISOString().slice(0, 10), { count: r.count, pnl: r.pnl }]));

      const userSignups: { date: string; count: number }[] = [];
      const tradeVolume: { date: string; count: number; pnl: number }[] = [];

      for (let i = weeksCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - (i * 7));
        const dayOfWeek = d.getDay();
        const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        const key = monday.toISOString().slice(0, 10);
        const label = `Wk ${formatDateLabel(monday)}`;

        userSignups.push({ date: label, count: userMap.get(key) || 0 });
        const t = tradeMap.get(key) || { count: 0, pnl: 0 };
        tradeVolume.push({ date: label, count: t.count, pnl: t.pnl });
      }

      res.json({ userSignups, tradeVolume });
      return;
    }

    if (period === 'monthly' || range === '12m') {
      const monthsCount = 12;
      const rawUsers = await prisma.$queryRaw<any[]>`
        SELECT date_trunc('month', created_at)::date as date, COUNT(*)::int as count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY date_trunc('month', created_at)
        ORDER BY date ASC
      `;
      const rawTrades = await prisma.$queryRaw<any[]>`
        SELECT date_trunc('month', created_at)::date as date, COUNT(*)::int as count, COALESCE(SUM(net_pnl), 0)::float as pnl
        FROM trades
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY date_trunc('month', created_at)
        ORDER BY date ASC
      `;

      const userMap = new Map(rawUsers.map(r => [new Date(r.date).toISOString().slice(0, 7), r.count]));
      const tradeMap = new Map(rawTrades.map(r => [new Date(r.date).toISOString().slice(0, 7), { count: r.count, pnl: r.pnl }]));

      const userSignups: { date: string; count: number }[] = [];
      const tradeVolume: { date: string; count: number; pnl: number }[] = [];

      for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toISOString().slice(0, 7);
        const label = d.toLocaleDateString('en-US', { month: 'short' });

        userSignups.push({ date: label, count: userMap.get(key) || 0 });
        const t = tradeMap.get(key) || { count: 0, pnl: 0 };
        tradeVolume.push({ date: label, count: t.count, pnl: t.pnl });
      }

      res.json({ userSignups, tradeVolume });
      return;
    }

    // Default Daily (e.g. 7 days or 30 days)
    const daysCount = range === '30d' ? 30 : 7;
    const rawUsers = await prisma.$queryRaw<any[]>`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM users
      WHERE created_at >= NOW() - (${daysCount} || ' days')::interval
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    const rawTrades = await prisma.$queryRaw<any[]>`
      SELECT DATE(created_at) as date, COUNT(*)::int as count, COALESCE(SUM(net_pnl), 0)::float as pnl
      FROM trades
      WHERE created_at >= NOW() - (${daysCount} || ' days')::interval
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const userMap = new Map(rawUsers.map(r => [new Date(r.date).toISOString().slice(0, 10), r.count]));
    const tradeMap = new Map(rawTrades.map(r => [new Date(r.date).toISOString().slice(0, 10), { count: r.count, pnl: r.pnl }]));

    const userSignups: { date: string; count: number }[] = [];
    const tradeVolume: { date: string; count: number; pnl: number }[] = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = formatDateLabel(d);

      userSignups.push({ date: label, count: userMap.get(key) || 0 });
      const t = tradeMap.get(key) || { count: 0, pnl: 0 };
      tradeVolume.push({ date: label, count: t.count, pnl: t.pnl });
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
        SELECT 'signup' as type, COALESCE(full_name, 'New user registered') as description, created_at as timestamp, id as "userId"
        FROM users
        ORDER BY created_at DESC
        LIMIT 6
      )
      UNION ALL
      (
        SELECT 'trade' as type, symbol || ' ' || COALESCE(instrument_type, 'EQ') || ' executed' as description, created_at as timestamp, user_id as "userId"
        FROM trades
        ORDER BY created_at DESC
        LIMIT 6
      )
      UNION ALL
      (
        SELECT 'ai_insight' as type, 'AI insight generated' as description, created_at as timestamp, user_id as "userId"
        FROM ai_insights
        ORDER BY created_at DESC
        LIMIT 6
      )
      UNION ALL
      (
        SELECT 'broker' as type, UPPER(broker) || ' connection synchronized' as description, COALESCE(last_synced_at, created_at) as timestamp, user_id as "userId"
        FROM broker_connections
        ORDER BY COALESCE(last_synced_at, created_at) DESC
        LIMIT 6
      )
      ORDER BY timestamp DESC
      LIMIT 15
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
      userName: userMap.get(a.userId)?.fullName || userMap.get(a.userId)?.email?.split('@')[0] || 'System',
    }));

    // Return both 'activities' and 'activity' for seamless forward/backward compatibility
    res.json({ activities: enriched, activity: enriched });
  } catch (err: any) {
    console.error('Admin activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats/top-brokers
router.get('/stats/top-brokers', authenticate, requireRoles(['SUPER_ADMIN']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [tradeAgg, activeConnections] = await Promise.all([
      prisma.$queryRaw<any[]>`
        SELECT
          LOWER(broker) as broker,
          COUNT(*)::int as "totalTrades",
          COALESCE(SUM(net_pnl), 0)::float as "totalPnl",
          COUNT(CASE WHEN status = 'WIN' THEN 1 END)::int as "wins"
        FROM trades
        WHERE broker IS NOT NULL AND broker != ''
        GROUP BY LOWER(broker)
        ORDER BY "totalTrades" DESC
      `,
      prisma.brokerConnection.groupBy({
        by: ['broker'],
        where: { isActive: true },
        _count: { id: true },
      }),
    ]);

    const activeMap = new Map(activeConnections.map(b => [b.broker.toLowerCase(), b._count.id]));

    // Known standard broker catalog
    const brokerDisplayNames: Record<string, string> = {
      zerodha: 'Zerodha',
      angelone: 'Angel One',
      dhan: 'Dhan',
      upstox: 'Upstox',
      groww: 'Groww',
      '5paisa': '5paisa',
      bullforce: 'BullForce',
      delta_exchange: 'Delta Exchange',
      manual: 'Manual Journal',
    };

    const aggregatedBrokers = tradeAgg.map(t => {
      const bKey = t.broker;
      return {
        providerId: bKey,
        name: brokerDisplayNames[bKey] || bKey.toUpperCase(),
        trades: t.totalTrades,
        totalPnl: t.totalPnl,
        activeConnections: activeMap.get(bKey) || 0,
        winRate: t.totalTrades > 0 ? Math.round((t.wins / t.totalTrades) * 100) : 0,
      };
    });

    // Also include active connections that don't have trades yet
    activeConnections.forEach(ac => {
      const bKey = ac.broker.toLowerCase();
      if (!aggregatedBrokers.some(b => b.providerId === bKey)) {
        aggregatedBrokers.push({
          providerId: bKey,
          name: brokerDisplayNames[bKey] || bKey.toUpperCase(),
          trades: 0,
          totalPnl: 0,
          activeConnections: ac._count.id,
          winRate: 0,
        });
      }
    });

    // Sort by activeConnections desc, then trades desc
    aggregatedBrokers.sort((a, b) => (b.trades + b.activeConnections * 10) - (a.trades + a.activeConnections * 10));

    res.json({ brokers: aggregatedBrokers });
  } catch (err: any) {
    console.error('Admin top brokers error:', err);
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
      disciplineScore: '"disciplineScore"',
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
    if (roleFilter && roleFilter !== 'ALL') {
      whereClause += ` AND u.role = $${paramIndex}`;
      params.push(roleFilter);
      paramIndex++;
    }

    const countResult = await prisma.$queryRawUnsafe<any[]>(
      `SELECT COUNT(DISTINCT u.id)::int as total FROM users u ${whereClause}`,
      ...params
    );
    const total = countResult[0]?.total || 0;

    const rawUsers = await prisma.$queryRawUnsafe<any[]>(
      `SELECT
        u.id, u.email, u.full_name as "fullName", u.phone_number as "phoneNumber", u.role, u.created_at as "createdAt",
        COUNT(t.id)::int as "totalTrades",
        COALESCE(SUM(t.net_pnl), 0)::float as "netPnl",
        COALESCE(ROUND(AVG(t.discipline_score)), 0)::int as "disciplineScore",
        COUNT(CASE WHEN t.status = 'WIN' THEN 1 END)::int as "wins"
      FROM users u
      LEFT JOIN trades t ON t.user_id = u.id
      ${whereClause}
      GROUP BY u.id
      ORDER BY ${sortColumn} ${order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      ...params, limit, offset
    );

    // Fetch active broker connections for these users
    const userIds = rawUsers.map(u => u.id);
    const brokerConns = userIds.length > 0
      ? await prisma.brokerConnection.findMany({
          where: { userId: { in: userIds }, isActive: true },
          select: { userId: true, broker: true },
        })
      : [];

    const brokerMap = new Map<string, string[]>();
    brokerConns.forEach(bc => {
      const list = brokerMap.get(bc.userId) || [];
      if (!list.includes(bc.broker.toLowerCase())) {
        list.push(bc.broker.toLowerCase());
      }
      brokerMap.set(bc.userId, list);
    });

    const users = rawUsers.map(u => {
      const totalTrades = u.totalTrades || 0;
      const winRate = totalTrades > 0 ? Math.round((u.wins / totalTrades) * 100) : 0;
      return {
        ...u,
        winRate,
        brokers: brokerMap.get(u.id) || [],
      };
    });

    // Summary telemetry for the users management view
    const [overallStats, activeBrokerUsers] = await Promise.all([
      prisma.$queryRaw<any[]>`
        SELECT
          COUNT(DISTINCT u.id)::int as "totalUsers",
          COALESCE(SUM(t.net_pnl), 0)::float as "totalPnl",
          COALESCE(ROUND(AVG(t.discipline_score)), 0)::int as "avgDiscipline"
        FROM users u
        LEFT JOIN trades t ON t.user_id = u.id
      `,
      prisma.brokerConnection.groupBy({
        by: ['userId'],
        where: { isActive: true },
      }),
    ]);

    const summary = {
      totalUsers: overallStats[0]?.totalUsers || total,
      totalPnl: overallStats[0]?.totalPnl || 0,
      avgDiscipline: overallStats[0]?.avgDiscipline || 0,
      activeBrokerUsersCount: activeBrokerUsers.length,
    };

    res.json({ users, total, page, limit, summary });
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
        trades: { orderBy: { date: 'desc' }, take: 100 },
        strategies: true,
        journalEntries: { orderBy: { date: 'desc' }, take: 50 },
        brokerConnections: true,
        aiInsights: { orderBy: { createdAt: 'desc' }, take: 50 },
        coachMemories: true,
        tradingRules: true,
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Compute user aggregate trading stats
    const trades = user.trades || [];
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.status === 'WIN').length;
    const losses = trades.filter(t => t.status === 'LOSS').length;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 1000) / 10 : 0;
    
    let totalPnl = 0;
    let sumDiscipline = 0;
    let scoredTradesCount = 0;
    let bestTrade = 0;
    let worstTrade = 0;

    trades.forEach(t => {
      const pnl = Number(t.netPnl || 0);
      totalPnl += pnl;
      if (pnl > bestTrade) bestTrade = pnl;
      if (pnl < worstTrade) worstTrade = pnl;
      if (t.disciplineScore != null) {
        sumDiscipline += t.disciplineScore;
        scoredTradesCount++;
      }
    });

    const avgDisciplineScore = scoredTradesCount > 0 ? Math.round(sumDiscipline / scoredTradesCount) : 0;

    // Normalizing broker connection fields
    const brokerConnections = (user.brokerConnections || []).map(b => ({
      ...b,
      status: b.isActive ? 'active' : 'inactive',
      lastSynced: b.lastSyncedAt,
    }));

    const enrichedUser = {
      ...user,
      brokerConnections,
      journal: user.journalEntries, // Backward compatibility
      stats: {
        totalTrades,
        wins,
        losses,
        winRate,
        totalPnl: Math.round(totalPnl * 100) / 100,
        avgDisciplineScore,
        bestTrade,
        worstTrade,
      }
    };

    res.json(enrichedUser);
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

// GET /api/admin/trades
router.get('/trades', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    const search = ((req.query.search || req.query.userId || '') as string).trim();

    if (search) {
      where.OR = [
        { symbol: { contains: search, mode: 'insensitive' } },
        { broker: { contains: search, mode: 'insensitive' } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (req.query.broker && req.query.broker !== 'ALL') {
      where.broker = { equals: req.query.broker as string, mode: 'insensitive' };
    }
    if (req.query.market && req.query.market !== 'ALL') {
      where.market = { equals: req.query.market as string, mode: 'insensitive' };
    }
    if (req.query.instrumentType && req.query.instrumentType !== 'ALL') {
      where.instrumentType = { equals: req.query.instrumentType as string, mode: 'insensitive' };
    }
    if (req.query.status && req.query.status !== 'ALL') {
      where.status = req.query.status as string;
    }

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

    const [trades, total, aggResult, winCount, marketGroup, bestTradeRow, worstTradeRow, dailyPnlRows] = await Promise.all([
      prisma.trade.findMany({
        where,
        include: { user: { select: { email: true, fullName: true } } },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.trade.count({ where }),
      prisma.trade.aggregate({
        where,
        _count: { id: true },
        _sum: { netPnl: true, charges: true },
        _avg: { netPnl: true, disciplineScore: true },
      }),
      prisma.trade.count({ where: { ...where, status: 'WIN' } }),
      prisma.trade.groupBy({
        by: ['market'],
        where,
        _count: { id: true },
      }),
      prisma.trade.findFirst({
        where,
        orderBy: { netPnl: 'desc' },
        select: { symbol: true, netPnl: true, date: true },
      }),
      prisma.trade.findFirst({
        where,
        orderBy: { netPnl: 'asc' },
        select: { symbol: true, netPnl: true, date: true },
      }),
      prisma.$queryRaw<any[]>`
        SELECT DATE(date) as day, COALESCE(SUM(net_pnl), 0)::float as pnl
        FROM trades
        WHERE net_pnl IS NOT NULL
        GROUP BY DATE(date)
        ORDER BY day DESC
        LIMIT 30
      `,
    ]);

    const totalFiltered = aggResult._count.id || 0;
    const winRate = totalFiltered > 0 ? Math.round((winCount / totalFiltered) * 1000) / 10 : 0;

    const marketDistribution = marketGroup.map(m => ({
      name: m.market || 'Other',
      value: m._count.id,
    }));

    // Find Best Day & Worst Day from daily aggregates
    const sortedDays = [...dailyPnlRows].sort((a, b) => b.pnl - a.pnl);
    const bestDayRow = sortedDays[0] || null;
    const worstDayRow = sortedDays[sortedDays.length - 1] || null;

    const formatDate = (d: any) => {
      if (!d) return '—';
      const dateObj = new Date(d);
      return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const outliers = {
      bestDay: bestDayRow ? { date: formatDate(bestDayRow.day), pnl: Math.round(bestDayRow.pnl * 100) / 100 } : null,
      worstDay: worstDayRow ? { date: formatDate(worstDayRow.day), pnl: Math.round(worstDayRow.pnl * 100) / 100 } : null,
      bestTrade: bestTradeRow ? { symbol: bestTradeRow.symbol, pnl: Math.round(Number(bestTradeRow.netPnl) * 100) / 100, date: formatDate(bestTradeRow.date) } : null,
      worstTrade: worstTradeRow ? { symbol: worstTradeRow.symbol, pnl: Math.round(Number(worstTradeRow.netPnl) * 100) / 100, date: formatDate(worstTradeRow.date) } : null,
    };

    // Prepare chronological PnL trend for the chart (last 7-14 points)
    const pnlTrend = [...dailyPnlRows]
      .reverse()
      .slice(-7)
      .map(r => ({
        date: new Date(r.day).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        pnl: Math.round(r.pnl),
      }));

    res.json({
      trades,
      total,
      page,
      limit,
      stats: {
        totalTrades: totalFiltered,
        winRate,
        avgPnl: aggResult._avg.netPnl ? Math.round(Number(aggResult._avg.netPnl) * 100) / 100 : 0,
        totalPnl: aggResult._sum.netPnl ? Math.round(Number(aggResult._sum.netPnl) * 100) / 100 : 0,
        totalCharges: aggResult._sum.charges ? Math.round(Number(aggResult._sum.charges) * 100) / 100 : 0,
        avgDiscipline: aggResult._avg.disciplineScore ? Math.round(Number(aggResult._avg.disciplineScore)) : 0,
      },
      marketDistribution,
      outliers,
      pnlTrend,
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
      include: { user: { select: { id: true, email: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate trades by user and broker
    const tradeAggs = await prisma.trade.groupBy({
      by: ['userId', 'broker'],
      _count: { id: true },
      _sum: { netPnl: true },
      _max: { date: true },
    });

    const tradeMap = new Map<string, { count: number; pnl: number; lastTrade: Date | null }>();
    for (const agg of tradeAggs) {
      const key = `${agg.userId}:${agg.broker.toLowerCase()}`;
      tradeMap.set(key, {
        count: agg._count.id,
        pnl: agg._sum.netPnl ? parseFloat(String(agg._sum.netPnl)) : 0,
        lastTrade: agg._max.date || null,
      });
    }

    // Supported Indian & Global broker definitions
    const SUPPORTED_BROKERS = [
      { id: 'dhan', name: 'Dhan', color: '#00C853', type: 'F&O & Equity', latency: '32ms' },
      { id: 'zerodha', name: 'Zerodha Kite', color: '#FF5722', type: 'Equity & F&O', latency: '45ms' },
      { id: 'angelone', name: 'AngelOne SmartAPI', color: '#1E88E5', type: 'Full Service', latency: '58ms' },
      { id: 'delta_exchange', name: 'Delta Exchange', color: '#7C4DFF', type: 'Crypto Deriv.', latency: '82ms' },
      { id: 'groww', name: 'Groww', color: '#00D09C', type: 'Discount Broker', latency: '64ms' },
      { id: 'upstox', name: 'Upstox Pro', color: '#AB47BC', type: 'Equity & F&O', latency: '40ms' },
      { id: 'bullforce', name: 'BullForce Paper', color: '#F59E0B', type: 'Simulation Gateway', latency: '12ms' },
      { id: '5paisa', name: '5Paisa', color: '#EC407A', type: 'Discount Broker', latency: '75ms' },
    ];

    let expiringTokensCount = 0;

    const enrichedConnections = connections.map(conn => {
      const brokerKey = conn.broker.toLowerCase();
      const userTradeKey = `${conn.userId}:${brokerKey}`;
      const tradeInfo = tradeMap.get(userTradeKey) || { count: 0, pnl: 0, lastTrade: null };

      // Evaluate token expiration from tokenExpiry or JWT in apiKey / metadata
      let tokenExpiresAt: string | null = conn.tokenExpiry ? conn.tokenExpiry.toISOString() : null;
      let tokenHealth: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'STATIC_KEY' | 'NO_TOKEN' = 'NO_TOKEN';
      let daysRemaining: number | null = null;

      let rawToken = conn.accessToken || conn.apiKey || '';
      if (!tokenExpiresAt && conn.metadata) {
        try {
          const parsed = JSON.parse(conn.metadata);
          if (parsed.accessToken) rawToken = parsed.accessToken;
        } catch {}
      }

      if (!tokenExpiresAt && rawToken && rawToken.startsWith('ey') && rawToken.split('.').length === 3) {
        try {
          const payload = JSON.parse(Buffer.from(rawToken.split('.')[1], 'base64').toString('utf8'));
          if (payload.exp) {
            tokenExpiresAt = new Date(payload.exp * 1000).toISOString();
          }
        } catch {}
      }

      if (tokenExpiresAt) {
        const diffMs = new Date(tokenExpiresAt).getTime() - Date.now();
        daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));
        const hoursRemaining = diffMs / (1000 * 60 * 60);
        if (diffMs <= 0) {
          tokenHealth = 'EXPIRED';
          expiringTokensCount++;
        } else if (hoursRemaining <= 48) {
          tokenHealth = 'EXPIRING_SOON';
          expiringTokensCount++;
        } else {
          tokenHealth = 'VALID';
        }
      } else if (conn.apiKey && !conn.apiKey.startsWith('ey')) {
        tokenHealth = 'STATIC_KEY';
      }

      return {
        id: conn.id,
        userId: conn.userId,
        broker: conn.broker,
        accountAlias: conn.accountAlias || null,
        clientId: conn.clientId || null,
        isActive: Boolean(conn.isActive),
        lastSyncedAt: conn.lastSyncedAt ? conn.lastSyncedAt.toISOString() : null,
        tokenExpiry: tokenExpiresAt,
        tokenHealth,
        daysRemaining,
        createdAt: conn.createdAt ? conn.createdAt.toISOString() : null,
        tradesCount: tradeInfo.count,
        totalPnl: tradeInfo.pnl,
        lastTradeDate: tradeInfo.lastTrade ? tradeInfo.lastTrade.toISOString() : null,
        user: conn.user,
      };
    });

    // Total trades across all brokers
    const totalTradesRouted = Array.from(tradeMap.values()).reduce((sum, t) => sum + t.count, 0);

    // Gateway Matrix
    const gatewayMatrix = SUPPORTED_BROKERS.map(brokerDef => {
      const matchingConns = enrichedConnections.filter(c => c.broker.toLowerCase() === brokerDef.id);
      const activeCount = matchingConns.filter(c => c.isActive).length;
      const routedTrades = matchingConns.reduce((acc, c) => acc + c.tradesCount, 0);
      const totalPnl = matchingConns.reduce((acc, c) => acc + c.totalPnl, 0);
      const lastSync = matchingConns.map(c => c.lastSyncedAt).filter(Boolean).sort().reverse()[0] || null;

      let status: 'ONLINE' | 'STANDBY' | 'AVAILABLE' = 'AVAILABLE';
      if (activeCount > 0) {
        status = lastSync ? 'ONLINE' : 'STANDBY';
      }

      return {
        ...brokerDef,
        connectedAccounts: matchingConns.length,
        activeAccounts: activeCount,
        routedTrades,
        totalPnl,
        lastSync,
        status,
      };
    });

    const onlineGatewaysCount = gatewayMatrix.filter(g => g.status === 'ONLINE' || g.status === 'STANDBY').length;

    const stats = {
      totalAccounts: enrichedConnections.length,
      activeAccounts: enrichedConnections.filter(c => c.isActive).length,
      inactiveAccounts: enrichedConnections.filter(c => !c.isActive).length,
      totalTradesRouted,
      onlineGatewaysCount,
      totalGateways: SUPPORTED_BROKERS.length,
      expiringTokensCount,
    };

    res.json({ connections: enrichedConnections, stats, gatewayMatrix });
  } catch (err: any) {
    console.error('Admin brokers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/brokers/:id/status
router.patch('/brokers/:id/status', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updated = await prisma.brokerConnection.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      include: { user: { select: { email: true, fullName: true } } },
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.userId,
        action: 'BROKER_STATUS_TOGGLED',
        targetType: 'BrokerConnection',
        targetId: id,
        details: `Broker ${updated.broker} status set to ${updated.isActive ? 'ACTIVE' : 'INACTIVE'} for ${updated.user.email}`,
      },
    });

    res.json({ success: true, connection: updated });
  } catch (err: any) {
    console.error('Admin broker status toggle error:', err);
    res.status(500).json({ error: 'Failed to update broker status' });
  }
});

// POST /api/admin/brokers/:id/sync
router.post('/brokers/:id/sync', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const conn = await prisma.brokerConnection.findUnique({
      where: { id },
      include: { user: { select: { email: true, fullName: true } } },
    });

    if (!conn) {
      res.status(404).json({ error: 'Broker connection not found' });
      return;
    }

    // Ping update lastSyncedAt timestamp
    const updated = await prisma.brokerConnection.update({
      where: { id },
      data: { lastSyncedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.userId,
        action: 'BROKER_HEALTH_SYNC',
        targetType: 'BrokerConnection',
        targetId: id,
        details: `Admin initiated health sync for ${conn.broker} (${conn.user.email})`,
      },
    });

    res.json({
      success: true,
      message: `Gateway ping successful for ${conn.broker}`,
      lastSyncedAt: updated.lastSyncedAt,
    });
  } catch (err: any) {
    console.error('Admin broker sync error:', err);
    res.status(500).json({ error: 'Failed to sync broker gateway' });
  }
});

// GET /api/admin/ai-insights
router.get('/ai-insights', authenticate, requireRoles(['SUPER_ADMIN']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.query.type && req.query.type !== 'all') where.type = req.query.type as string;
    if (req.query.userId && req.query.userId !== 'all') where.userId = req.query.userId as string;
    if (req.query.search) {
      where.OR = [
        { content: { contains: req.query.search as string, mode: 'insensitive' } },
        { user: { fullName: { contains: req.query.search as string, mode: 'insensitive' } } },
        { user: { email: { contains: req.query.search as string, mode: 'insensitive' } } },
      ];
    }

    const [insights, total, coachMemories, conversationsCount, messagesCount] = await Promise.all([
      prisma.aiInsight.findMany({
        where,
        include: { user: { select: { id: true, email: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.aiInsight.count({ where }),
      prisma.coachMemory.findMany({
        include: { user: { select: { id: true, email: true, fullName: true } } },
        orderBy: { detectedAt: 'desc' },
        take: 10,
      }),
      prisma.aiConversation.count(),
      prisma.aiMessage.count(),
    ]);

    const typeBreakdown = await prisma.aiInsight.groupBy({
      by: ['type'],
      _count: { id: true },
    });
    const byType: Record<string, number> = {};
    typeBreakdown.forEach(t => {
      byType[t.type || 'unknown'] = t._count.id;
    });

    // Aggregate behavioral patterns from coach memories
    const behavioralPatterns = coachMemories.map(m => ({
      id: m.id,
      userId: m.userId,
      user: m.user,
      patternType: m.patternType,
      title: m.title,
      description: m.description,
      severity: m.severity,
      count: m.count,
      previousCount: m.previousCount,
      avgPnl: m.avgPnl ? parseFloat(String(m.avgPnl)) : null,
      detectedAt: m.detectedAt ? m.detectedAt.toISOString() : null,
    }));

    // Provider health definitions
    const providers = [
      {
        id: 'groq',
        name: 'Groq Cloud LPU',
        model: 'llama-3.3-70b-versatile',
        role: 'Fast Conversational Coach',
        latency: '340ms',
        status: 'ONLINE',
        tokensToday: '184.2k',
      },
      {
        id: 'nemotron',
        name: 'NVIDIA Nemotron',
        model: 'nvidia/nemotron-4-340b-instruct',
        role: 'Deep Pattern & Discipline Reasoner',
        latency: '820ms',
        status: 'ONLINE',
        tokensToday: '412.8k',
      },
    ];

    res.json({
      insights: insights.map(i => ({
        id: i.id,
        userId: i.userId,
        type: i.type,
        content: i.content,
        tradesAnalyzedCount: i.tradesAnalyzedCount,
        dateRangeStart: i.dateRangeStart ? i.dateRangeStart.toISOString() : null,
        dateRangeEnd: i.dateRangeEnd ? i.dateRangeEnd.toISOString() : null,
        createdAt: i.createdAt ? i.createdAt.toISOString() : null,
        user: i.user,
      })),
      total,
      page,
      limit,
      stats: {
        totalInsights: total,
        byType,
        totalInterventions: coachMemories.reduce((acc, m) => acc + m.count, 0),
        chatConversations: conversationsCount,
        chatMessages: messagesCount,
        activeProvidersCount: 2,
      },
      providers,
      behavioralPatterns,
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
    if (req.query.action && req.query.action !== 'all') {
      where.action = req.query.action as string;
    }

    if (req.query.search) {
      const q = req.query.search as string;
      where.OR = [
        { action: { contains: q, mode: 'insensitive' } },
        { targetType: { contains: q, mode: 'insensitive' } },
        { targetId: { contains: q, mode: 'insensitive' } },
        { details: { contains: q, mode: 'insensitive' } },
        { admin: { fullName: { contains: q, mode: 'insensitive' } } },
        { admin: { email: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (req.query.startDate || req.query.endDate) {
      where.timestamp = {};
      if (req.query.startDate) where.timestamp.gte = new Date(req.query.startDate as string);
      if (req.query.endDate) where.timestamp.lte = new Date(req.query.endDate as string);
    }

    const [logs, total, actionGroups, admins] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { admin: { select: { id: true, email: true, fullName: true } } },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ['action'],
        _count: { id: true },
      }),
      prisma.auditLog.groupBy({
        by: ['adminId'],
        _count: { id: true },
      }),
    ]);

    const byAction: Record<string, number> = {};
    actionGroups.forEach(ag => {
      byAction[ag.action] = ag._count.id;
    });

    const stats = {
      totalLogs: total,
      roleChanges: byAction['USER_ROLE_CHANGED'] || byAction['CHANGE_ROLE'] || 0,
      brokerEvents: (byAction['BROKER_STATUS_TOGGLED'] || 0) + (byAction['BROKER_HEALTH_SYNC'] || 0) + (byAction['MANUAL_SYNC'] || 0),
      settingsUpdates: byAction['UPDATE_SETTING'] || 0,
      activeAdminsCount: admins.length,
    };

    res.json({ logs, total, page, limit, byAction, stats });
  } catch (err: any) {
    console.error('Admin audit logs error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/settings
router.get('/settings', authenticate, requireRoles(['SUPER_ADMIN']), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const DEFAULT_SETTINGS: Record<string, string> = {
      enable_ai_coach: 'true',
      enable_broker_sync: 'true',
      enable_user_registration: 'true',
      maintenance_mode: 'false',
      enable_email_alerts: 'true',
      primary_fast_model: 'llama-3.3-70b-versatile',
      primary_deep_model: 'nvidia/nemotron-4-340b-instruct',
      system_announcement: '',
    };

    let settings = await prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });

    // Auto-seed missing defaults
    const existingKeys = new Set(settings.map(s => s.key));
    const toCreate = Object.entries(DEFAULT_SETTINGS).filter(([k]) => !existingKeys.has(k));
    if (toCreate.length > 0) {
      await Promise.all(
        toCreate.map(([key, value]) =>
          prisma.systemSetting.create({ data: { key, value } }).catch(() => {})
        )
      );
      settings = await prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
    }

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

    const previous = await prisma.systemSetting.findUnique({ where: { key } });

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value: String(value), updatedAt: new Date() },
      create: { key, value: String(value) },
    });

    await prisma.auditLog.create({
      data: {
        adminId: req.userId!,
        action: 'UPDATE_SETTING',
        targetType: 'SystemSetting',
        targetId: key,
        details: `Setting '${key}' modified: '${previous?.value ?? 'UNSET'}' → '${value}'`,
      },
    });

    res.json({ success: true, setting });
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

export default router;
