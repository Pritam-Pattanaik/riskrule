import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { syncDhanTrades } from '../lib/brokers/dhan';
import { lockService } from '../services/lockService';
import { createNotification } from '../services/notificationService';
import { flowDataWorker } from '../flow/workers/FlowDataWorker';

import { flowDataWorker } from '../flow/workers/FlowDataWorker';

const router = Router();

// ─── GET /api/brokers ─────────────────────────────────────────────────────────
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const brokers = await prisma.brokerConnection.findMany({
      where: { userId: req.userId! },
      select: {
        id: true,
        broker: true,
        clientId: true,
        isActive: true,
        lastSyncedAt: true,
        createdAt: true,
        // Never expose secrets to the client
        accessToken: false,
        refreshToken: false,
        apiKey: false,
        apiSecret: false,
        metadata: false,
      },
    });
    res.json(brokers);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch brokers' });
  }
});

// ─── POST /api/brokers ────────────────────────────────────────────────────────
// For Angel One:
//   - Accepts: broker, apiKey, clientId, mpin, totpSecret (Base32)
//   - Immediately authenticates: auto-generates TOTP from secret → loginByPassword
//   - Stores: apiKey, clientId, accessToken, refreshToken, metadata {mpin, totpSecret}
//   - Daily re-auth is FULLY AUTOMATIC — no user action needed
//
// For other brokers: standard flow (apiKey + optional metadata)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { broker, apiKey, apiSecret, clientId, mpin, totpSecret, metadata } = req.body;

    if (!broker || !apiKey) {
      return res.status(400).json({ error: 'Broker and API Key are required' });
    }

    let accessToken: string | undefined;
    let refreshToken: string | undefined;
    let resolvedMetadata: string | undefined;

    // ── Angel One: Auto-auth on connect ───────────────────────────────────
    if (broker === 'angelone') {
      if (!clientId)    return res.status(400).json({ error: 'Client Code is required for Angel One.' });
      if (!mpin)        return res.status(400).json({ error: 'MPIN is required for Angel One.' });
      if (!totpSecret)  return res.status(400).json({ error: 'TOTP Secret (Base32) is required for Angel One.' });

      try {
        const { loginAngelOne } = await import('../lib/brokers/angelone');
        // loginAngelOne auto-generates TOTP from the Base32 secret internally
        const tokens = await loginAngelOne(clientId, mpin, totpSecret, apiKey);
        accessToken  = tokens.jwtToken;
        refreshToken = tokens.refreshToken;
        console.log(`[AngelOne] Connected successfully for ${clientId}`);
      } catch (authErr: any) {
        console.error(`[AngelOne] Connection failed: ${authErr.message}`);
        return res.status(400).json({ error: authErr.message });
      }

      // Persist mpin + totpSecret for automatic daily re-auth
      resolvedMetadata = JSON.stringify({ mpin, totpSecret });
    } else {
      resolvedMetadata = metadata || null;
    }

    // ── Upsert broker connection ───────────────────────────────────────────
    const existing = await prisma.brokerConnection.findFirst({
      where: { userId: req.userId!, broker },
    });

    const dbData = {
      apiKey,
      apiSecret:    apiSecret || null,
      clientId:     clientId  || null,
      metadata:     resolvedMetadata || null,
      accessToken:  accessToken  || null,
      refreshToken: refreshToken || null,
      isActive:     true,
    };

    if (broker === 'dhan') {
      flowDataWorker.reloadCredentials().catch(() => {});
    }

    if (existing) {
      const updated = await prisma.brokerConnection.update({
        where: { id: existing.id },
        data: dbData,
        select: { id: true, broker: true, clientId: true, isActive: true, lastSyncedAt: true, createdAt: true },
      });
      if (broker === 'dhan') {
        flowDataWorker.reloadProvider().catch(err => console.error('[Brokers] Flow provider reload error:', err));
      }
      return res.json(updated);
    } else {
      const inserted = await prisma.brokerConnection.create({
        data: { userId: req.userId!, broker, ...dbData },
        select: { id: true, broker: true, clientId: true, isActive: true, lastSyncedAt: true, createdAt: true },
      });
      if (broker === 'dhan') {
        flowDataWorker.reloadProvider().catch(err => console.error('[Brokers] Flow provider reload error:', err));
      }
      return res.status(201).json(inserted);
    }
  } catch (err: any) {
    console.error('[Brokers] Save error:', err);
    res.status(500).json({ error: 'Failed to save broker configuration' });
  }
});

// ─── DELETE /api/brokers/:broker ──────────────────────────────────────────────
// :broker is the broker NAME ('angelone', 'dhan', etc.), never the UUID
router.delete('/:broker', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const broker = String(req.params.broker);
    await prisma.brokerConnection.deleteMany({
      where: { userId: req.userId!, broker },
    });
    if (broker === 'dhan') {
<<<<<<< HEAD
      flowDataWorker.reloadProvider().catch(err => console.error('[Brokers] Flow provider reload error:', err));
=======
      flowDataWorker.reloadCredentials().catch(() => {});
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete broker configuration' });
  }
});

// ─── PATCH /api/brokers/:broker/token ────────────────────────────────────────
// For non-Angel-One brokers: manual token update
router.patch('/:broker/token', authenticate, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const broker = String(req.params.broker);
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'New token (apiKey) is required' });

    const conn = await prisma.brokerConnection.findFirst({
      where: { userId: req.userId!, broker },
    });
    if (!conn) return res.status(404).json({ error: 'Broker connection not found' });

    await prisma.brokerConnection.update({
      where: { id: conn.id },
      data: { apiKey, isActive: true },
    });
    if (broker === 'dhan') {
<<<<<<< HEAD
      flowDataWorker.reloadProvider().catch(err => console.error('[Brokers] Flow provider reload error:', err));
=======
      flowDataWorker.reloadCredentials().catch(() => {});
>>>>>>> 3a06e49288679003fd072f501c82c1dcf963db46
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update token' });
  }
});

import { ContextService } from '../lib/ai/ContextService';
import { CoachMemoryWriter } from '../services/CoachMemoryWriter';

// ─── POST /api/brokers/sync/:broker ──────────────────────────────────────────
// :broker is always the broker NAME, e.g. 'angelone' or 'dhan'
router.post('/sync/:broker', authenticate, async (req: AuthRequest, res: Response): Promise<any> => {
  const broker  = String(req.params.broker);
  const lockKey = `${req.userId!}:${broker}`;

  const acquired = await lockService.acquireSyncLock(lockKey);
  if (!acquired) {
    return res.json({ success: true, count: 0, alreadySyncing: true });
  }

  try {
    const forceFullSync = req.query.full === 'true';

    const conn = await prisma.brokerConnection.findFirst({
      where: { userId: req.userId!, broker },
    });
    if (!conn) return res.status(404).json({ error: 'Broker connection not found' });

    const { apiKey, clientId } = conn;
    if (!apiKey) return res.status(400).json({ error: 'API Key missing for broker' });

    let tradesToInsert: any[] = [];
    let tradesToUpdate: any[] = [];
    let newLastSyncedAt: Date | null = null;
    let fetchedDates: string[] = [];

    // ── DHAN ──────────────────────────────────────────────────────────────
    if (broker === 'dhan') {
      const userRules = await prisma.tradingRule.findUnique({ where: { userId: req.userId! } });
      const personalRules = userRules ? {
        windowStart: userRules.windowStart, windowEnd: userRules.windowEnd,
        maxTradesPerDay: userRules.maxTradesPerDay,
        maxDailyLoss: userRules.maxDailyLoss ? parseFloat(String(userRules.maxDailyLoss)) : null,
        maxLossPerTrade: userRules.maxLossPerTrade ? parseFloat(String(userRules.maxLossPerTrade)) : null,
        allowedInstruments: userRules.allowedInstruments,
        allowedMarkets: userRules.allowedMarkets,
      } : null;

      const lastSyncedAt = (!forceFullSync && conn.lastSyncedAt) ? new Date(conn.lastSyncedAt) : null;
      let result;
      try {
        result = await syncDhanTrades(clientId || '', apiKey, req.userId!, [], lastSyncedAt, personalRules);
      } catch (err: any) {
        if (err.message?.includes('TOKEN_EXPIRED')) {
          return res.status(401).json({ error: 'Dhan token expired. Update your access token in Settings.' });
        }
        throw err;
      }

      tradesToInsert = result.tradesToInsert;
      tradesToUpdate = result.tradesToUpdate;
      newLastSyncedAt = result.latestTradeTime;
      fetchedDates = result.fetchedDates ?? [];

    // ── ANGEL ONE ─────────────────────────────────────────────────────────
    } else if (broker === 'angelone') {

      let meta: Record<string, string> = {};
      try { meta = conn.metadata ? JSON.parse(conn.metadata) : {}; } catch { /* ignore */ }

      const { mpin, totpSecret } = meta;

      const doSync = async (token: string) => {
        const { syncAngelOneTrades } = await import('../lib/brokers/angelone');
        const lastSyncedAt = (!forceFullSync && conn.lastSyncedAt) ? new Date(conn.lastSyncedAt) : null;
        return syncAngelOneTrades(clientId || '', token, apiKey, req.userId!, [], lastSyncedAt);
      };

      const autoRelogin = async (): Promise<string> => {
        if (!mpin || !totpSecret) {
          throw new Error(
            'MPIN or TOTP Secret missing from stored credentials. ' +
            'Please reconnect Angel One and enter your MPIN and TOTP Secret.'
          );
        }
        const { loginAngelOne } = await import('../lib/brokers/angelone');
        const tokens = await loginAngelOne(clientId || '', mpin, totpSecret, apiKey);
        await prisma.brokerConnection.update({
          where: { id: conn.id },
          data: { accessToken: tokens.jwtToken, refreshToken: tokens.refreshToken, isActive: true },
        });
        console.log(`[AngelOne] Auto-relogin OK for ${clientId}`);
        return tokens.jwtToken;
      };

      let jwt = conn.accessToken;

      if (!jwt) {
        try {
          jwt = await autoRelogin();
        } catch (loginErr: any) {
          console.error('[AngelOne] Initial login failed:', loginErr.message);
          return res.status(400).json({ error: loginErr.message });
        }
      }

      try {
        const result = await doSync(jwt!);
        tradesToInsert  = result.tradesToInsert;
        tradesToUpdate  = result.tradesToUpdate;
        newLastSyncedAt = result.latestTradeTime;
      } catch (syncErr: any) {
        if (syncErr.message === 'TOKEN_EXPIRED') {
          console.log(`[AngelOne] Token expired for ${clientId} — auto-refreshing...`);
          try {
            const freshJwt = await autoRelogin();
            const result = await doSync(freshJwt);
            tradesToInsert  = result.tradesToInsert;
            tradesToUpdate  = result.tradesToUpdate;
            newLastSyncedAt = result.latestTradeTime;
          } catch (reloginErr: any) {
            console.error('[AngelOne] Auto-relogin failed:', reloginErr.message);
            await createNotification({
              userId: req.userId!,
              title:  'Angel One Re-auth Failed',
              description: `Could not auto-refresh your session: ${reloginErr.message}. Please reconnect Angel One.`,
              category: 'Trading',
              priority: 'Critical',
              actionLabel: 'Reconnect',
              actionUrl:   '/app/settings',
            });
            return res.status(400).json({ error: reloginErr.message });
          }
        } else {
          throw syncErr;
        }
      }

    // ── DELTA EXCHANGE ───────────────────────────────────────────────────
    } else if (broker === 'delta_exchange') {
      const { syncDeltaExchangeTrades } = await import('../lib/brokers/delta_exchange');
      const apiSecret = conn.apiSecret;
      if (!apiSecret) {
        return res.status(400).json({ error: 'API Secret missing for Delta Exchange' });
      }
      const lastSyncedAt = (!forceFullSync && conn.lastSyncedAt) ? new Date(conn.lastSyncedAt) : null;
      let result;
      try {
        result = await syncDeltaExchangeTrades(apiKey, apiSecret, req.userId!, 'https://api.delta.exchange', lastSyncedAt);
      } catch (err: any) {
        if (err.message?.includes('TOKEN_EXPIRED')) {
          return res.status(401).json({ error: 'Delta Exchange API credentials invalid or expired.' });
        }
        throw err;
      }
      tradesToInsert  = result.tradesToInsert;
      tradesToUpdate  = result.tradesToUpdate;
      newLastSyncedAt = result.latestTradeTime;
      fetchedDates    = result.fetchedDates ?? [];

    } else {
      return res.status(400).json({ error: `Sync not yet implemented for ${broker}` });
    }

    // ── Atomic Persist Inside Transaction ─────────────────────────────────
    // Deletes and inserts occur in the SAME transaction.
    // If anything fails, changes roll back completely with ZERO data loss.
    const lastSyncedAt = (!forceFullSync && conn.lastSyncedAt) ? new Date(conn.lastSyncedAt) : null;

    await prisma.$transaction(async (tx) => {
      // 1. Delete prior synced trades for fetched dates (or all if full sync)
      if (broker === 'dhan') {
        if (fetchedDates.length > 0) {
          // Date-scoped delete: only remove trades on the days we just fetched.
          // Safe for both incremental and full syncs — no risk of wiping unrelated history.
          for (const dateStr of fetchedDates) {
            await tx.$executeRaw`
              DELETE FROM trades
              WHERE user_id = ${req.userId!}::uuid
                AND broker = 'dhan'
                AND source = 'broker_sync'
                AND (date AT TIME ZONE 'Asia/Kolkata')::date = ${dateStr}::date
            `;
          }
        } else if (forceFullSync) {
          // Full sync explicitly requested but Dhan returned zero trades — safe to wipe.
          await tx.trade.deleteMany({
            where: { userId: req.userId!, broker: 'dhan', source: 'broker_sync' },
          });
        }
        // else: incremental sync with no new dates (e.g. weekend / API no-data)
        //       → skip delete entirely to prevent catastrophic data loss
      } else if (broker === 'angelone') {
        const todayStr = new Date().toISOString().split('T')[0];
        await tx.$executeRaw`
          DELETE FROM trades
          WHERE user_id = ${req.userId!}::uuid
            AND broker = 'angelone'
            AND source = 'broker_sync'
            AND (date AT TIME ZONE 'Asia/Kolkata')::date = ${todayStr}::date
        `;
      } else if (broker === 'delta_exchange') {
        if (fetchedDates.length > 0) {
          for (const dateStr of fetchedDates) {
            await tx.$executeRaw`
              DELETE FROM trades
              WHERE user_id = ${req.userId!}::uuid
                AND broker = 'delta_exchange'
                AND source = 'broker_sync'
                AND (date AT TIME ZONE 'Asia/Kolkata')::date = ${dateStr}::date
            `;
          }
        } else if (forceFullSync) {
          await tx.trade.deleteMany({
            where: { userId: req.userId!, broker: 'delta_exchange', source: 'broker_sync' },
          });
        }
      }

      // 2. Batch insert/upsert new trades
      if (tradesToInsert.length > 0) {
        const batchSize = 25;
        for (let i = 0; i < tradesToInsert.length; i += batchSize) {
          const batch = tradesToInsert.slice(i, i + batchSize);
          await Promise.all(batch.map(t => {
            const { dbId, _ruleViolations, brokerOrderKey, ...rest } = t;
            const data = { ...rest, disciplineScore: rest.disciplineScore ?? null };

            if (brokerOrderKey) {
              // Pre-serialize JSON fields: Prisma $executeRaw passes JS arrays as
              // PostgreSQL array literals {a,b} which ::jsonb rejects (22P02).
              // JSON.stringify → plain string → ::jsonb cast works correctly.
              const reasonsJson  = data.disciplineReasons  != null ? JSON.stringify(data.disciplineReasons)  : null;
              const signalsJson  = data.disciplineSignals  != null ? JSON.stringify(data.disciplineSignals)  : null;

              return tx.$executeRaw`
                INSERT INTO trades (
                  id, user_id, broker, broker_trade_id, broker_order_key,
                  date, exit_time, is_carry_forward, symbol, market, instrument_type,
                  direction, entry_price, exit_price, quantity, pnl, charges, net_pnl,
                  status, source, created_at, updated_at,
                  discipline_score, discipline_raw_score, confidence,
                  trading_style, is_manual_override, discipline_version,
                  discipline_reasons, discipline_signals, computed_at, manual_score,
                  tags, mistakes
                ) VALUES (
                  gen_random_uuid(), ${data.userId}::uuid, ${data.broker},
                  ${data.brokerTradeId ?? null}, ${brokerOrderKey},
                  ${data.date}, ${data.exitTime ?? null}, ${data.isCarryForward ?? false},
                  ${data.symbol}, ${data.market}, ${data.instrumentType},
                  ${data.direction ?? null},
                  ${data.entryPrice ?? null}::numeric, ${data.exitPrice ?? null}::numeric,
                  ${data.quantity ?? null}::numeric, ${data.pnl ?? null}::numeric,
                  ${data.charges ?? null}::numeric, ${data.netPnl ?? null}::numeric,
                  ${data.status ?? 'OPEN'}, ${data.source ?? 'broker_sync'}, NOW(), NOW(),
                  ${data.disciplineScore ?? null}, ${data.disciplineRawScore ?? null},
                  ${data.confidence ?? null}, ${data.tradingStyle ?? null},
                  ${data.isManualOverride ?? false}, ${data.disciplineVersion ?? 1},
                  ${reasonsJson}::jsonb,
                  ${signalsJson}::jsonb,
                  ${data.computedAt ?? null}, ${data.manualScore ?? null},
                  ARRAY[]::text[], ARRAY[]::text[]
                )
                ON CONFLICT (user_id, broker, broker_order_key) WHERE broker_order_key IS NOT NULL
                DO UPDATE SET
                  exit_price          = EXCLUDED.exit_price,
                  exit_time           = EXCLUDED.exit_time,
                  is_carry_forward    = EXCLUDED.is_carry_forward,
                  quantity            = EXCLUDED.quantity,
                  pnl                 = EXCLUDED.pnl,
                  charges             = EXCLUDED.charges,
                  net_pnl             = EXCLUDED.net_pnl,
                  status              = EXCLUDED.status,
                  discipline_score    = EXCLUDED.discipline_score,
                  discipline_reasons  = EXCLUDED.discipline_reasons,
                  discipline_signals  = EXCLUDED.discipline_signals,
                  computed_at         = EXCLUDED.computed_at,
                  updated_at          = NOW()
              `;
            } else {
              return tx.trade.create({ data: data as any });
            }
          }));
        }
      }

      // 3. Update partially-closed positions
      for (const t of tradesToUpdate) {
        if (!t.dbId) continue;
        const { dbId, ...rest } = t;
        await tx.trade.update({
          where: { id: dbId },
          data: {
            exitPrice: rest.exitPrice,
            quantity: rest.quantity,
            pnl: rest.pnl,
            charges: rest.charges,
            netPnl: rest.netPnl,
            status: rest.status,
            updatedAt: new Date()
          },
        });
      }
    }, { maxWait: 15000, timeout: 60000 });

    // ── Invalidate Caches & Update Coach Memory ────────────────────────────
    ContextService.invalidateUserCache(req.userId!).catch(() => {});
    CoachMemoryWriter.sync(req.userId!).catch(() => {});

    // Rule violation notifications
    for (const t of tradesToInsert) {
      if (t._ruleViolations?.length > 0) {
        for (const v of t._ruleViolations) {
          await createNotification({
            userId: req.userId!, title: 'Risk Limit Exceeded',
            description: `${t.symbol}: ${v}`, category: 'Risk', priority: 'Critical',
            actionLabel: 'Review Rules', actionUrl: '/app/settings',
          });
        }
      }
    }

    await prisma.brokerConnection.update({
      where: { id: conn.id },
      data: { lastSyncedAt: new Date(), isActive: true },
    });

    const total = tradesToInsert.length + tradesToUpdate.length;
    await createNotification({
      userId: req.userId!,
      title:  'Trade Sync Completed',
      description: `Synced ${total} trade${total !== 1 ? 's' : ''} from ${broker.toUpperCase()}.`,
      category: 'Trading', priority: 'Success',
      actionLabel: 'View Trades', actionUrl: '/app/journal',
    });

    res.json({ success: true, count: total });
  } catch (err: any) {
    console.error('[Sync] Unhandled error:', err);
    await createNotification({
      userId: req.userId!,
      title:  'Trade Sync Failed',
      description: `Failed to sync from ${broker.toUpperCase()}: ${err.message}`,
      category: 'Trading', priority: 'Critical', actionLabel: 'Retry Sync',
    });
    res.status(500).json({ error: err.message || 'Failed to sync trades' });
  } finally {
    await lockService.releaseSyncLock(lockKey);
  }
});

export default router;
