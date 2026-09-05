/**
 * BrokerAdapterRegistry — Central dispatch hub for all broker sync operations.
 *
 * This registry wraps existing broker-specific sync functions behind the
 * IBrokerAdapter interface. The sync route uses ONLY this registry to
 * dispatch — it never contains hardcoded if/else broker checks.
 *
 * ─── Adding a new broker ────────────────────────────────────────────────────
 * 1. Create your adapter logic in ./yourbroker.ts
 * 2. Register it below with `registry.register(new YourBrokerAdapter())`
 * 3. Add the broker definition to the client-side BROKER_REGISTRY (brokerRegistry.ts)
 * That is ALL that is required. No other files need editing.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { IBrokerAdapter, BrokerSyncInput, BrokerSyncResult } from './IBrokerAdapter';

// ── Dhan Adapter ──────────────────────────────────────────────────────────────
class DhanAdapter implements IBrokerAdapter {
  readonly providerId = 'dhan';

  async sync(input: BrokerSyncInput): Promise<BrokerSyncResult> {
    const { syncDhanTrades } = await import('./dhan');
    const { conn, userId, forceFullSync, personalRules } = input;

    if (!conn.apiKey) throw new Error('API Key missing for Dhan');

    const lastSyncedAt = (!forceFullSync && conn.lastSyncedAt) ? new Date(conn.lastSyncedAt) : null;
    try {
      const result = await syncDhanTrades(
        conn.clientId || '',
        conn.apiKey,
        userId,
        [],
        lastSyncedAt,
        personalRules,
      );
      return result;
    } catch (err: any) {
      if (err.message?.includes('TOKEN_EXPIRED')) {
        return {
          tradesToInsert: [],
          tradesToUpdate: [],
          latestTradeTime: null,
          fetchedDates: [],
          needsReauth: true,
        };
      }
      throw err;
    }
  }
}

// ── Angel One Adapter ─────────────────────────────────────────────────────────
class AngelOneAdapter implements IBrokerAdapter {
  readonly providerId = 'angelone';

  async sync(input: BrokerSyncInput): Promise<BrokerSyncResult> {
    const { loginAngelOne, syncAngelOneTrades } = await import('./angelone');
    const { conn, userId, forceFullSync } = input;

    if (!conn.apiKey) throw new Error('API Key missing for Angel One');

    let meta: Record<string, string> = {};
    try { meta = conn.metadata ? JSON.parse(conn.metadata) : {}; } catch { /* ignore */ }
    const { mpin, totpSecret } = meta;

    const doSync = async (token: string): Promise<BrokerSyncResult> => {
      const lastSyncedAt = (!forceFullSync && conn.lastSyncedAt) ? new Date(conn.lastSyncedAt) : null;
      return syncAngelOneTrades(conn.clientId || '', token, conn.apiKey!, userId, [], lastSyncedAt);
    };

    const autoRelogin = async (): Promise<{ jwt: string; refreshToken: string }> => {
      if (!mpin || !totpSecret) {
        throw new Error(
          'MPIN or TOTP Secret missing. Please reconnect Angel One and enter your MPIN and TOTP Secret.'
        );
      }
      const tokens = await loginAngelOne(conn.clientId || '', mpin, totpSecret, conn.apiKey!);
      return { jwt: tokens.jwtToken, refreshToken: tokens.refreshToken };
    };

    let jwt = conn.accessToken;
    let updatedTokens: BrokerSyncResult['updatedTokens'] | undefined;

    if (!jwt) {
      const freshTokens = await autoRelogin();
      jwt = freshTokens.jwt;
      updatedTokens = freshTokens;
    }

    try {
      const result = await doSync(jwt!);
      return { ...result, updatedTokens };
    } catch (syncErr: any) {
      if (syncErr.message === 'TOKEN_EXPIRED') {
        console.log(`[AngelOne] Token expired for ${conn.clientId} — auto-refreshing...`);
        const freshTokens = await autoRelogin();
        const result = await doSync(freshTokens.jwt);
        return { ...result, updatedTokens: freshTokens };
      }
      throw syncErr;
    }
  }
}

// ── Delta Exchange Adapter ────────────────────────────────────────────────────
class DeltaExchangeAdapter implements IBrokerAdapter {
  readonly providerId = 'delta_exchange';

  async sync(input: BrokerSyncInput): Promise<BrokerSyncResult> {
    const { syncDeltaExchangeTrades } = await import('./delta_exchange');
    const { conn, forceFullSync } = input;

    if (!conn.apiKey)    throw new Error('API Key missing for Delta Exchange');
    if (!conn.apiSecret) throw new Error('API Secret missing for Delta Exchange');

    const lastSyncedAt = (!forceFullSync && conn.lastSyncedAt) ? new Date(conn.lastSyncedAt) : null;
    try {
      const result = await syncDeltaExchangeTrades(
        conn.apiKey,
        conn.apiSecret,
        input.userId,
        'https://api.delta.exchange',
        lastSyncedAt,
      );
      return result;
    } catch (err: any) {
      if (err.message?.includes('TOKEN_EXPIRED')) {
        return {
          tradesToInsert: [],
          tradesToUpdate: [],
          latestTradeTime: null,
          fetchedDates: [],
          needsReauth: true,
        };
      }
      throw err;
    }
  }
}

// ── Registry ──────────────────────────────────────────────────────────────────

class BrokerAdapterRegistry {
  private readonly adapters = new Map<string, IBrokerAdapter>();

  register(adapter: IBrokerAdapter): this {
    this.adapters.set(adapter.providerId, adapter);
    return this;
  }

  /**
   * Returns the adapter for a given providerId, or null if not registered.
   * The caller is responsible for returning a 400 error for unregistered brokers.
   */
  getAdapter(providerId: string): IBrokerAdapter | null {
    return this.adapters.get(providerId) ?? null;
  }

  /** Returns all registered providerIds (useful for debugging / health checks) */
  getSupportedProviders(): string[] {
    return Array.from(this.adapters.keys());
  }
}

/**
 * Singleton registry — import this in your route handlers.
 * Example usage:
 *
 *   const adapter = brokerAdapterRegistry.getAdapter(broker);
 *   if (!adapter) return res.status(400).json({ error: `Sync not implemented for ${broker}` });
 *   const result = await adapter.sync({ conn, userId, forceFullSync, personalRules });
 */
export const brokerAdapterRegistry = new BrokerAdapterRegistry()
  .register(new DhanAdapter())
  .register(new AngelOneAdapter())
  .register(new DeltaExchangeAdapter());
