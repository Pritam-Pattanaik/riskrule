import { IOptionsDataProvider, OptionTick } from './IOptionsDataProvider';
import { SpotService } from '../services/SpotService';
import { logger } from '../../lib/logger';
import { prisma } from '../../db';

const DHAN_BASE_URL = 'https://api.dhan.co/v2';

const DHAN_SCRIP_IDS: Record<string, number> = {
  NIFTY: 13,
  BANKNIFTY: 25,
  FINNIFTY: 27,
};

export class DhanOptionsProvider implements IOptionsDataProvider {
  private isConnected = false;
  private subscribedSymbols = new Set<string>();
  private pollInterval: NodeJS.Timeout | null = null;
  private callback: ((tick: OptionTick) => void) | null = null;
  private clientId: string | null = null;
  private accessToken: string | null = null;
  private isUnauthorized = false;
  private lastError: string | null = null;

  constructor(clientId?: string, accessToken?: string) {
    this.clientId = clientId || process.env.DHAN_CLIENT_ID || null;
    this.accessToken = accessToken || process.env.DHAN_ACCESS_TOKEN || null;
  }

  async connect(): Promise<void> {
    await this.reloadCredentials();
    this.isConnected = true;
    logger.info(`[DhanOptionsProvider] Initialized (has broker credentials: ${Boolean(this.accessToken)})`);
  }

  async reloadCredentials(): Promise<boolean> {
    try {
      const envClient = process.env.DHAN_CLIENT_ID;
      const envToken = process.env.DHAN_ACCESS_TOKEN;

      if (envClient && envToken) {
        this.clientId = envClient;
        this.accessToken = envToken;
        this.isUnauthorized = false;
        this.lastError = null;
        return true;
      }

      const broker = await prisma.brokerConnection.findFirst({
        where: {
          broker: { in: ['dhan', 'DHAN', 'Dhan'] as any },
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      let token = broker?.accessToken || broker?.apiKey;
      let clientId = broker?.clientId;

      if (!token && broker?.metadata) {
        try {
          const meta = typeof broker.metadata === 'string' ? JSON.parse(broker.metadata) : broker.metadata;
          token = meta.accessToken || meta.token || meta.apiKey;
          if (!clientId) clientId = meta.clientId;
        } catch {}
      }

      if (clientId && token) {
        this.clientId = clientId;
        this.accessToken = token;
        this.isUnauthorized = false;
        this.lastError = null;
        return true;
      }

      this.lastError = 'No Dhan connection found in database or environment.';
      return false;
    } catch (err: any) {
      this.lastError = err.message || 'Failed to query broker database';
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    logger.info('[DhanOptionsProvider] Disconnected');
  }

  async subscribe(symbols: string[]): Promise<void> {
    symbols.forEach(s => this.subscribedSymbols.add(s));
    logger.info(`[DhanOptionsProvider] Subscribed to ${symbols.join(', ')}`);
    if (!this.pollInterval && this.callback) {
      this.startPolling();
    }
  }

  async unsubscribe(symbols: string[]): Promise<void> {
    symbols.forEach(s => this.subscribedSymbols.delete(s));
    if (this.subscribedSymbols.size === 0 && this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  onTick(callback: (tick: OptionTick) => void): void {
    this.callback = callback;
    if (this.subscribedSymbols.size > 0 && !this.pollInterval) {
      this.startPolling();
    }
  }

  public hasValidCredentials(): boolean {
    return Boolean(this.clientId && this.accessToken && !this.isUnauthorized);
  }

  public getBrokerStatus(): 'connected' | 'expired' | 'missing' {
    if (this.isUnauthorized) return 'expired';
    if (!this.clientId || !this.accessToken) return 'missing';
    return 'connected';
  }

  public getLastError(): string | null {
    return this.lastError;
  }

  private expiryCache = new Map<number, { expiry: string; fetchedAt: number }>();

  private async getDhanExpiry(scripId: number, fallbackExpiry: string): Promise<string> {
    const cached = this.expiryCache.get(scripId);
    if (cached && Date.now() - cached.fetchedAt < 300_000) { // 5-minute cache
      return cached.expiry;
    }

    try {
      const res = await fetch(`${DHAN_BASE_URL}/optionchain/expirylist`, {
        method: 'POST',
        headers: {
          'access-token': this.accessToken!,
          'client-id': this.clientId!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UnderlyingScrip: scripId,
          UnderlyingSeg: 'IDX_I',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.data) && json.data.length > 0) {
          const nearest = json.data[0];
          this.expiryCache.set(scripId, { expiry: nearest, fetchedAt: Date.now() });
          return nearest;
        }
      }
    } catch (_e) {}

    return fallbackExpiry;
  }

  public async pollNow(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    if (!this.hasValidCredentials()) {
      const reloaded = await this.reloadCredentials();
      if (!reloaded) return;
    }

    const symbolsArray = Array.from(this.subscribedSymbols);
    for (let i = 0; i < symbolsArray.length; i++) {
      const symbol = symbolsArray[i];
      const scripId = DHAN_SCRIP_IDS[symbol];
      if (!scripId) continue;

      // Spacing between requests to prevent hitting Dhan 429 rate limit
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const fallbackExpiry = SpotService.getNearestExpiry(symbol);
      const expiry = await this.getDhanExpiry(scripId, fallbackExpiry);

      try {
        const res = await fetch(`${DHAN_BASE_URL}/optionchain`, {
          method: 'POST',
          headers: {
            'access-token': this.accessToken!,
            'client-id': this.clientId!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UnderlyingScrip: scripId,
            UnderlyingSeg: 'IDX_I',
            Expiry: expiry,
          }),
        });

        if (res.status === 401) {
          const errText = await res.text().catch(() => '');
          this.isUnauthorized = true;
          if (errText.includes('806') || errText.toLowerCase().includes('data api')) {
            this.lastError = 'Dhan Data APIs not enabled on this account. Enable Data APIs on web.dhan.co (My Profile → DhanHQ API → Consent for Data APIs) or generate a new token.';
          } else {
            this.lastError = 'Dhan SuperAPI session token has expired. Daily re-authentication is required in Settings.';
          }
          logger.warn(`[DhanOptionsProvider] ${this.lastError}`);
          continue;
        }

        if (res.status === 429) {
          logger.warn(`[DhanOptionsProvider] Rate limit reached for ${symbol} (HTTP 429) — backing off`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          this.lastError = `Dhan API error HTTP ${res.status}: ${errText}`;
          logger.warn(`[DhanOptionsProvider] Option chain request failed for ${symbol}: HTTP ${res.status} - ${errText}`);
          continue;
        }

        const json = await res.json();
        const ocData = json?.data?.oc || json?.data;
        if (!ocData || typeof ocData !== 'object' || Array.isArray(ocData)) continue;

        const now = Date.now();
        this.isUnauthorized = false;
        this.lastError = null;

        for (const strikeStr of Object.keys(ocData)) {
          const strikeObj = ocData[strikeStr];
          if (!strikeObj || typeof strikeObj !== 'object') continue;
          const strikePrice = parseFloat(strikeStr);
          if (isNaN(strikePrice) || strikePrice <= 0) continue;

          // CE tick
          if (strikeObj.ce && this.callback) {
            const ce = strikeObj.ce;
            const tick: OptionTick = {
              symbol,
              expiryDate: expiry,
              strikePrice,
              optionType: 'CE',
              ltp: Number(ce.last_price || ce.ltp || 0),
              openInterest: Number(ce.oi || ce.open_interest || 0),
              volume: Number(ce.volume || 0),
              timestamp: now,
              impliedVolatility: ce.implied_volatility ? Number(ce.implied_volatility) : undefined,
            };
            this.callback(tick);
          }

          // PE tick
          if (strikeObj.pe && this.callback) {
            const pe = strikeObj.pe;
            const tick: OptionTick = {
              symbol,
              expiryDate: expiry,
              strikePrice,
              optionType: 'PE',
              ltp: Number(pe.last_price || pe.ltp || 0),
              openInterest: Number(pe.oi || pe.open_interest || 0),
              volume: Number(pe.volume || 0),
              timestamp: now,
              impliedVolatility: pe.implied_volatility ? Number(pe.implied_volatility) : undefined,
            };
            this.callback(tick);
          }
        }
      } catch (err: any) {
        this.lastError = err.message || 'Failed to communicate with Dhan API';
        logger.warn(`[DhanOptionsProvider] Error polling option chain for ${symbol}: ${err.message}`);
      }
    }
  }

  private startPolling(): void {
    const poll = async () => {
      await this.pollNow();
    };

    // Initial fetch + periodic interval (8s interval for smooth data flow without rate limits)
    poll().catch(() => {});
    this.pollInterval = setInterval(poll, 8000);
  }
}
