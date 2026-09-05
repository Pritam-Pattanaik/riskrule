import crypto from 'crypto';
import { assignDisciplineScores } from '../discipline/disciplineEngine';

/**
 * Generate Delta Exchange HMAC-SHA256 Signature
 * Signature message format: METHOD + TIMESTAMP + PATH + QUERY_STRING + BODY
 */
export function generateDeltaSignature(
  method: string,
  timestamp: string,
  path: string,
  queryString: string,
  payloadStr: string,
  secret: string
): string {
  const cleanMethod = method.toUpperCase();
  const cleanQuery = queryString ? (queryString.startsWith('?') ? queryString : `?${queryString}`) : '';
  const message = cleanMethod + timestamp + path + cleanQuery + (payloadStr || '');
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

/**
 * Maps Delta Exchange symbol to RiskRule market categories.
 * Options & Futures -> 'F&O' or 'Crypto'
 */
export function mapDeltaSymbolToMarket(symbol: string): string {
  if (!symbol) return 'Crypto';
  const upper = symbol.toUpperCase();
  if (upper.endsWith('-C') || upper.endsWith('-P') || upper.includes('-PERP') || upper.includes('-FUT')) {
    return 'F&O';
  }
  return 'Crypto';
}

/**
 * Maps Delta Exchange product/symbol to RiskRule instrumentType: 'EQ' | 'CE' | 'PE' | 'FUT' | 'CRYPTO'
 */
export function mapDeltaInstrumentType(symbol: string): string {
  if (!symbol) return 'CRYPTO';
  const upper = symbol.toUpperCase();
  if (upper.endsWith('-C') || upper.endsWith('-CE') || upper.includes('CALL')) return 'CE';
  if (upper.endsWith('-P') || upper.endsWith('-PE') || upper.includes('PUT')) return 'PE';
  if (upper.includes('-PERP') || upper.includes('-FUT') || upper.endsWith('FUT')) return 'FUT';
  return 'CRYPTO';
}

/**
 * Resolve the best available timestamp from a raw Delta fill.
 */
function parseDeltaTime(timeStr: string | number | null | undefined): Date {
  if (!timeStr) return new Date(0);
  if (typeof timeStr === 'number') {
    // Microseconds vs milliseconds vs seconds check
    if (timeStr > 1e14) return new Date(Math.floor(timeStr / 1000)); // microseconds
    if (timeStr > 1e11) return new Date(timeStr); // milliseconds
    return new Date(timeStr * 1000); // seconds
  }
  const isoStr = String(timeStr).trim();
  const d = new Date(isoStr);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

/**
 * Extracts trading date (YYYY-MM-DD in IST/Asia:Kolkata) from Date
 */
function extractTradeDate(dateObj: Date): string {
  if (!dateObj || dateObj.getTime() === 0) return '1970-01-01';
  const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-CA', options).format(dateObj);
}

/**
 * Format raw Delta Exchange symbol for clean display
 */
export function formatDeltaSymbol(rawSymbol: string): string {
  if (!rawSymbol) return 'UNKNOWN';
  return rawSymbol.toUpperCase().replace(/_/g, '-');
}

export async function syncDeltaExchangeTrades(
  apiKey: string,
  apiSecret: string,
  userId: string,
  baseUrl: string = 'https://api.delta.exchange',
  lastSyncedAt: Date | null = null,
  _personalRules?: any | null
) {
  const formatDateStr = (d: Date) => {
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('en-CA', options).format(d);
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  async function fetchWithAuth(path: string, queryParams: Record<string, string> = {}) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const queryEntries = Object.entries(queryParams);
    const queryString = queryEntries.length > 0
      ? '?' + queryEntries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
      : '';
    const rawQueryString = queryEntries.length > 0
      ? queryEntries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
      : '';

    const signature = generateDeltaSignature('GET', timestamp, path, rawQueryString, '', apiSecret);
    const fullUrl = `${baseUrl}${path}${queryString}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': apiKey,
          'signature': signature,
          'timestamp': timestamp,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        throw new Error('TOKEN_EXPIRED: Delta Exchange API Key or Secret is invalid.');
      }

      if (!response.ok) {
        const errText = await response.text();
        let cleanError = `Delta Exchange API error (${response.status})`;
        try {
          const errJson = JSON.parse(errText);
          if (errJson.error?.message || errJson.message) {
            cleanError = `Delta Exchange: ${errJson.error?.message || errJson.message}`;
          }
        } catch {}
        throw new Error(cleanError);
      }

      return await response.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Delta Exchange API request timed out.');
      }
      throw err;
    }
  }

  try {
    let rawFillsList: any[] = [];
    const queryParams: Record<string, string> = { page_size: '100' };

    if (lastSyncedAt) {
      const fromDate = new Date(lastSyncedAt);
      fromDate.setDate(fromDate.getDate() - 7);
      queryParams['start_time'] = (Math.floor(fromDate.getTime() * 1000)).toString(); // microseconds
      console.log(`[Delta Sync] Incremental mode (7-day buffer): ${formatDateStr(fromDate)} → ${formatDateStr(new Date())}`);
    } else {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 90);
      queryParams['start_time'] = (Math.floor(fromDate.getTime() * 1000)).toString(); // microseconds
      console.log(`[Delta Sync] Full backfill (90 days): ${formatDateStr(fromDate)} → ${formatDateStr(new Date())}`);
    }

    let hasMore = true;
    let afterCursor: string | null = null;
    let attempts = 0;

    while (hasMore && attempts < 20) {
      attempts++;
      const currentParams = { ...queryParams };
      if (afterCursor) {
        currentParams['after'] = afterCursor;
      }

      const responseData = await fetchWithAuth('/v2/fills', currentParams);
      const fills = Array.isArray(responseData)
        ? responseData
        : (responseData.result || responseData.data || []);

      if (!Array.isArray(fills) || fills.length === 0) {
        hasMore = false;
      } else {
        rawFillsList = rawFillsList.concat(fills);
        if (responseData.meta?.after) {
          afterCursor = responseData.meta.after;
        } else if (fills.length >= 100) {
          const lastFill = fills[fills.length - 1];
          afterCursor = lastFill.id?.toString();
        } else {
          hasMore = false;
        }
      }
      await delay(200);
    }

    console.log(`[Delta Sync] Total raw fills fetched: ${rawFillsList.length}`);

    // ── Deduplicate Fills ───────────────────────────────────────────────────
    const uniqueFills = new Map<string, any>();
    for (const f of rawFillsList) {
      const fillId = f.id || f.fill_id || f.exchange_trade_id || '';
      const symbol = f.symbol || '';
      const price = parseFloat(f.price || 0).toFixed(6);
      const qty = parseFloat(f.size || f.qty || 0).toFixed(6);
      const side = (f.side || '').toUpperCase();
      const timeMs = parseDeltaTime(f.created_at || f.timestamp).getTime();

      const key = `${symbol}|${fillId}|${side}|${qty}|${price}|${timeMs}`;
      if (!uniqueFills.has(key)) {
        f._brokerOrderKey = key;
        uniqueFills.set(key, f);
      }
    }

    const allFills = Array.from(uniqueFills.values());
    allFills.sort((a, b) => {
      const tA = parseDeltaTime(a.created_at || a.timestamp).getTime();
      const tB = parseDeltaTime(b.created_at || b.timestamp).getTime();
      return tA - tB;
    });

    let latestTradeTime: Date | null = null;
    if (allFills.length > 0) {
      latestTradeTime = parseDeltaTime(allFills[allFills.length - 1].created_at || allFills[allFills.length - 1].timestamp);
    }

    // ── Group Executions by IST Date ─────────────────────────────────────────
    const executionsByDate = new Map<string, any[]>();
    for (const fill of allFills) {
      const execTime = parseDeltaTime(fill.created_at || fill.timestamp);
      const tradeDate = extractTradeDate(execTime);
      if (tradeDate === '1970-01-01') continue;
      if (!executionsByDate.has(tradeDate)) executionsByDate.set(tradeDate, []);
      executionsByDate.get(tradeDate)!.push(fill);
    }

    const sortedDates = Array.from(executionsByDate.keys()).sort();
    const tradesToInsert: any[] = [];
    let carryForwardPositions: Record<string, any> = {};

    // ── Position Pairing Engine (FIFO) ────────────────────────────────────────
    for (const tradeDate of sortedDates) {
      const dayExecutions = executionsByDate.get(tradeDate)!;
      const openPositions: Record<string, any> = { ...carryForwardPositions };

      for (const fill of dayExecutions) {
        const rawSym = fill.symbol || 'UNKNOWN';
        const symbol = formatDeltaSymbol(rawSym);
        const side = (fill.side || '').toUpperCase(); // BUY or SELL
        const tradePrice = parseFloat(fill.price || 0);
        const tradeQty = Math.abs(parseFloat(fill.size || fill.qty || 0));
        const tradeFee = Math.abs(parseFloat(fill.fee || fill.commission || 0));
        const execTime = parseDeltaTime(fill.created_at || fill.timestamp);

        const incomingDir = side === 'BUY' ? 'LONG' : 'SHORT';
        const oppositeDir = incomingDir === 'LONG' ? 'SHORT' : 'LONG';
        const samePosKey  = `${symbol}|${incomingDir}`;
        const oppPosKey   = `${symbol}|${oppositeDir}`;

        let currentPosKey: string;
        let pos: any;

        if (openPositions[oppPosKey]) {
          pos = openPositions[oppPosKey];
          currentPosKey = oppPosKey;
        } else if (openPositions[samePosKey]) {
          pos = openPositions[samePosKey];
          currentPosKey = samePosKey;
        } else {
          pos = undefined;
          currentPosKey = samePosKey;
        }

        if (!pos) {
          const stableKey = `delta|${tradeDate}|${symbol}|${incomingDir}|${fill.order_id || fill.id || ''}`;
          pos = {
            userId,
            broker: 'delta_exchange',
            brokerTradeId: (fill.order_id || fill.id || '').toString(),
            brokerOrderKey: stableKey,
            date: execTime,
            exitTime: null,
            symbol,
            market: mapDeltaSymbolToMarket(rawSym),
            instrumentType: mapDeltaInstrumentType(rawSym),
            direction: incomingDir,
            entryPrice: tradePrice,
            quantity: tradeQty,
            currentQty: tradeQty,
            exitPrice: 0,
            exitQty: 0,
            realizedPnl: 0,
            charges: tradeFee,
            status: 'OPEN',
            disciplineScore: null,
          };
          openPositions[currentPosKey] = pos;
        } else {
          pos.charges += tradeFee;
          const isSameDirection = (pos.direction === 'LONG' && side === 'BUY') || (pos.direction === 'SHORT' && side === 'SELL');

          if (isSameDirection) {
            // Scale In: weighted-average entry price
            const newTotalQty = pos.currentQty + tradeQty;
            pos.entryPrice = (pos.entryPrice * pos.currentQty + tradePrice * tradeQty) / newTotalQty;
            pos.quantity += tradeQty;
            pos.currentQty = newTotalQty;
          } else {
            // Scale Out / Close
            const closeQty = Math.min(pos.currentQty, tradeQty);
            const totalExitValue = pos.exitPrice * pos.exitQty + tradePrice * closeQty;
            pos.exitQty += closeQty;
            pos.exitPrice = totalExitValue / pos.exitQty;

            const pnlMultiplier = pos.direction === 'LONG' ? 1 : -1;
            pos.realizedPnl += (tradePrice - pos.entryPrice) * closeQty * pnlMultiplier;
            pos.currentQty -= closeQty;
            pos.exitTime = execTime;

            const remainingQty = tradeQty - closeQty;

            if (pos.currentQty === 0) {
              const net = pos.realizedPnl - pos.charges;
              pos.status = net > 0 ? 'WIN' : net < 0 ? 'LOSS' : 'BREAKEVEN';
              tradesToInsert.push(pos);
              delete openPositions[currentPosKey];

              if (remainingQty > 0) {
                const revPosKey = `${symbol}|${incomingDir}`;
                const revStableKey = `delta|${tradeDate}|${symbol}|${incomingDir}|${fill.order_id || fill.id || ''}_rev`;
                openPositions[revPosKey] = {
                  userId,
                  broker: 'delta_exchange',
                  brokerTradeId: (fill.order_id || fill.id || '').toString(),
                  brokerOrderKey: revStableKey,
                  date: execTime,
                  exitTime: null,
                  symbol,
                  market: mapDeltaSymbolToMarket(rawSym),
                  instrumentType: mapDeltaInstrumentType(rawSym),
                  direction: incomingDir,
                  entryPrice: tradePrice,
                  quantity: remainingQty,
                  currentQty: remainingQty,
                  exitPrice: 0,
                  exitQty: 0,
                  realizedPnl: 0,
                  charges: 0,
                  status: 'OPEN',
                  disciplineScore: null,
                };
              }
            }
          }
        }
      }

      carryForwardPositions = {};
      for (const posKey in openPositions) {
        const pos = openPositions[posKey];
        const hasMoreDays = sortedDates.some(d => d > tradeDate);
        if (hasMoreDays) {
          carryForwardPositions[posKey] = pos;
        } else {
          tradesToInsert.push(pos);
        }
      }
    }

    for (const symbol in carryForwardPositions) {
      tradesToInsert.push(carryForwardPositions[symbol]);
    }

    console.log(`[Delta Sync] Built ${tradesToInsert.length} position records`);

    // Assign discipline scores
    assignDisciplineScores(tradesToInsert);

    const mapToSchema = (p: any) => {
      const entryDate = p.date instanceof Date ? p.date : new Date(p.date);
      const exitTimeDate: Date | null = p.exitTime instanceof Date
        ? p.exitTime
        : (p.exitTime ? new Date(p.exitTime) : null);

      const entryDateStr = extractTradeDate(entryDate);
      const exitDateStr = exitTimeDate ? extractTradeDate(exitTimeDate) : null;
      const isCarryForward = !!exitDateStr && entryDateStr !== exitDateStr;
      const isOpen = p.status === 'OPEN';

      return {
        userId: p.userId,
        broker: p.broker,
        brokerTradeId: p.brokerTradeId,
        brokerOrderKey: p.brokerOrderKey || null,
        date: p.date,
        exitTime: exitTimeDate,
        isCarryForward,
        symbol: p.symbol,
        market: p.market,
        instrumentType: p.instrumentType,
        direction: p.direction,
        entryPrice: p.entryPrice.toString(),
        exitPrice: p.exitPrice > 0 ? p.exitPrice.toString() : null,
        quantity: p.quantity.toString(),
        pnl:     !isOpen ? p.realizedPnl.toFixed(4) : null,
        charges: !isOpen ? p.charges.toFixed(4)     : null,
        netPnl:  !isOpen ? (p.realizedPnl - p.charges).toFixed(4) : null,
        status: p.status,
        disciplineScore: p.disciplineScore ?? null,
        disciplineRawScore: p.disciplineRawScore ?? null,
        confidence: p.confidence ?? null,
        tradingStyle: p.tradingStyle ?? null,
        disciplineSignals: p.disciplineSignals ?? null,
        disciplineReasons: p.disciplineReasons ?? null,
        disciplineVersion: p.disciplineVersion ?? 1,
        isManualOverride: p.isManualOverride ?? false,
        manualScore: p.manualScore ?? null,
        computedAt: p.computedAt ?? null,
        source: 'broker_sync',
        ...(p.dbId ? { dbId: p.dbId } : {}),
      };
    };

    return {
      tradesToInsert: tradesToInsert.map(mapToSchema),
      tradesToUpdate: [] as any[],
      latestTradeTime,
      fetchedDates: sortedDates,
    };
  } catch (err: any) {
    console.error('Failed to sync Delta Exchange trades:', err);
    throw err;
  }
}
