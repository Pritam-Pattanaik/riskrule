/**
 * IBrokerAdapter — Canonical broker integration contract.
 *
 * Every broker adapter (Dhan, Angel One, Delta Exchange, etc.) must
 * implement this interface. The sync and connect routes use this contract
 * to dispatch work dynamically — they never contain broker-specific
 * if/else chains. Adding a new broker requires ONLY:
 *   1. Creating a new adapter file that implements this interface.
 *   2. Registering it in BROKER_ADAPTER_REGISTRY below.
 *   3. Adding its definition to BROKER_REGISTRY (client-side).
 */

export interface BrokerSyncInput {
  conn: {
    id: string;
    broker: string;
    clientId: string | null;
    apiKey: string | null;
    apiSecret: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    metadata: string | null;
    lastSyncedAt: Date | null;
  };
  userId: string;
  forceFullSync: boolean;
  /** Optional trading rule constraints for discipline scoring */
  personalRules?: {
    windowStart?: string | null;
    windowEnd?: string | null;
    maxTradesPerDay?: number | null;
    maxDailyLoss?: number | null;
    maxLossPerTrade?: number | null;
    allowedInstruments?: string[] | null;
    allowedMarkets?: string[] | null;
  } | null;
}

export interface BrokerSyncResult {
  tradesToInsert: any[];
  tradesToUpdate: any[];
  latestTradeTime: Date | null;
  fetchedDates?: string[];
  /** Set to true if the broker requires the user to provide a new token */
  needsReauth?: boolean;
  /** Updated token to persist if the adapter silently refreshed credentials */
  updatedTokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface IBrokerAdapter {
  /** The providerId this adapter handles (must match BROKER_REGISTRY entry) */
  readonly providerId: string;

  /**
   * Syncs trades from the broker into the RiskRules trade format.
   * Must be idempotent — the caller manages the DB transaction.
   */
  sync(input: BrokerSyncInput): Promise<BrokerSyncResult>;
}
