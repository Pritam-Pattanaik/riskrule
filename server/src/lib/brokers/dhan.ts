import { assignDisciplineScores } from '../discipline/disciplineEngine';
import { getContractMultiplier } from './multipliers';


/**
 * Maps Dhan exchangeSegment values to RiskRule market categories.
 * Must match the frontend Trade type: 'NSE' | 'BSE' | 'F&O' | 'MCX' | 'Crypto'
 */
function mapExchangeSegmentToMarket(segment: string): string {
  const segmentMap: Record<string, string> = {
    'NSE_EQ': 'NSE',
    'BSE_EQ': 'BSE',
    'NSE_FNO': 'F&O',
    'BSE_FNO': 'F&O',
    'MCX_COMM': 'MCX',
    'NSE_CURRENCY': 'F&O',
    'BSE_CURRENCY': 'F&O',
    'IDX_I': 'NSE',
  };
  return segmentMap[segment] || segment || 'NSE';
}

/**
 * Maps Dhan instrument field + exchangeSegment to RiskRule instrumentType.
 * Must match the frontend Trade type: 'EQ' | 'CE' | 'PE' | 'FUT' | 'CRYPTO'
 */
function mapInstrumentType(
  instrument: string | null | undefined,
  exchangeSegment: string,
  drvOptionType: string | null | undefined,
  symbol?: string | null
): string {
  if (drvOptionType && drvOptionType !== 'NA') {
    const opt = drvOptionType.toUpperCase();
    if (opt === 'CALL') return 'CE';
    if (opt === 'PUT') return 'PE';
  }
  if (symbol) {
    const s = symbol.toUpperCase();
    if (s.endsWith('-CE') || s.endsWith(' CE') || s.includes(' CALL') || s.endsWith('CE')) return 'CE';
    if (s.endsWith('-PE') || s.endsWith(' PE') || s.includes(' PUT') || s.endsWith('PE')) return 'PE';
    if (s.endsWith('-FUT') || s.endsWith(' FUT') || s.includes(' FUTURES')) return 'FUT';
  }
  if (instrument) {
    const lower = instrument.toLowerCase();
    if (lower === 'equity') return 'EQ';
    if (lower === 'derivatives') return 'FUT';
  }
  if (exchangeSegment?.includes('EQ')) return 'EQ';
  if (exchangeSegment?.includes('FNO')) return 'FUT';
  if (exchangeSegment?.includes('CURRENCY')) return 'FUT';
  if (exchangeSegment?.includes('COMM')) return 'FUT';
  return 'EQ';
}

/**
 * Resolve the best available timestamp from a raw Dhan trade object.
 * Priority: exchangeTime > createTime > updateTime
 */
function getBestTime(rawTrade: any): string | null {
  const candidates = [rawTrade.exchangeTime, rawTrade.createTime, rawTrade.updateTime];
  for (const candidate of candidates) {
    if (candidate && String(candidate).toUpperCase() !== 'NA' && String(candidate).trim() !== '') {
      return String(candidate);
    }
  }
  return null;
}

/**
 * Parses a Dhan time string into a valid Date object in IST timezone (+05:30).
 */
function parseDhanTime(timeStr: string | null | undefined): Date {
  if (!timeStr) return new Date(0);
  let isoStr = String(timeStr).trim();
  if (isoStr.includes(' ') && !isoStr.includes('T')) {
    isoStr = isoStr.replace(' ', 'T');
  }
  if (!isoStr.includes('+') && !isoStr.includes('Z')) {
    isoStr += '+05:30';
  }
  const d = new Date(isoStr);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

/**
 * Extracts the trading date (YYYY-MM-DD in IST/Asia:Kolkata) from a resolved time string.
 */
function extractTradeDate(bestTimeStr: string | null): string {
  if (!bestTimeStr) return '1970-01-01';
  const parsed = parseDhanTime(bestTimeStr);
  if (parsed.getTime() === 0) return '1970-01-01';

  const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-CA', options).format(parsed);
}

/**
 * Formats raw symbols from intraday/historical APIs into clean, readable trading symbols.
 */
function formatCleanSymbol(rawSymbol: string): string {
  if (!rawSymbol) return 'UNKNOWN';
  if (rawSymbol.includes(' ') && (rawSymbol.includes('CALL') || rawSymbol.includes('PUT') || rawSymbol.includes('CE') || rawSymbol.includes('PE'))) {
    return rawSymbol;
  }
  const fnoMatch = rawSymbol.match(/^([A-Z]+)-([A-Za-z0-9]+)-(\d+)-(CE|PE)$/i);
  if (fnoMatch) {
    const [, underlying, , strike, optType] = fnoMatch;
    return `${underlying} ${strike} ${optType.toUpperCase()}`;
  }
  const mcxMatch = rawSymbol.match(/^([A-Z]+)-(\d{1,2})([A-Za-z]+)(\d{4})-(\d+)-(CE|PE)$/i);
  if (mcxMatch) {
    const [, underlying, day, month, , strike, optType] = mcxMatch;
    return `${underlying} ${day} ${month.toUpperCase()} ${strike} ${optType.toUpperCase()}`;
  }
  return rawSymbol.replace(/-/g, ' ');
}



export async function syncDhanTrades(
  clientId: string,
  accessToken: string,
  userId: string,
  _existingOpenTrades: any[] = [],
  lastSyncedAt: Date | null = null,
  personalRules?: any | null
) {
  const formatDate = (d: Date) => {
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('en-CA', options).format(d);
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'access-token': accessToken,
            'client-id': clientId,
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.status === 429) {
          console.warn(`[Dhan Sync] Rate limited (429), retrying attempt ${attempt}/${maxRetries} after ${attempt * 1000}ms...`);
          await delay(attempt * 1000);
          continue;
        }

        return response;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('TOKEN_EXPIRED: Dhan API timed out — your Access Token has likely expired.');
        }
        if (attempt === maxRetries) throw err;
        await delay(attempt * 1000);
      }
    }
    throw new Error('Dhan API rate limit breached. Please try again in a few moments.');
  }

  try {
    let rawExecutionsList: any[] = [];

    // ── 1. Fetch Historical Settled Trades ───────────────────────────────────
    const overallToDate = new Date();
    let overallFromDate: Date;

    if (lastSyncedAt) {
      overallFromDate = new Date(lastSyncedAt);
      overallFromDate.setDate(overallFromDate.getDate() - 7);
      console.log(`[Dhan Sync] Incremental mode (7-day buffer): ${formatDate(overallFromDate)} → ${formatDate(overallToDate)}`);
    } else {
      // First-time full backfill: 90 days
      overallFromDate = new Date();
      overallFromDate.setDate(overallFromDate.getDate() - 90);
      console.log(`[Dhan Sync] Full backfill: ${formatDate(overallFromDate)} → ${formatDate(overallToDate)}`);
    }

    let currentChunkStart = new Date(overallFromDate);

    while (currentChunkStart < overallToDate) {
      let currentChunkEnd = new Date(currentChunkStart);
      currentChunkEnd.setDate(currentChunkEnd.getDate() + 30);
      if (currentChunkEnd > overallToDate) {
        currentChunkEnd = overallToDate;
      }

      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const url = `https://api.dhan.co/v2/trades/${formatDate(currentChunkStart)}/${formatDate(currentChunkEnd)}/${page}`;
        
        await delay(350); // Throttling delay to prevent Dhan rate limits
        const response = await fetchWithRetry(url);

        // 401 / 403 = expired or invalid token
        if (response.status === 401 || response.status === 403) {
          throw new Error('TOKEN_EXPIRED: Dhan Access Token is invalid or expired. Please paste a new token in Settings → Connected Brokers.');
        }

        if (!response.ok) {
          const errText = await response.text();
          let cleanError = `Dhan API error (${response.status})`;
          try {
            const errJson = JSON.parse(errText);
            if (errJson.errorMessage) {
              cleanError = `DhanHQ: ${errJson.errorMessage}`;
            }
          } catch(e) {}
          throw new Error(cleanError);
        }

        const data = await response.json();
        const tradesList = Array.isArray(data) ? data : (data.data || []);

        if (!Array.isArray(tradesList) || tradesList.length === 0) {
          hasMore = false;
        } else {
          for (const item of tradesList) {
            item._isHistorical = true;
          }
          rawExecutionsList = rawExecutionsList.concat(tradesList);
          page++;
        }
      }

      currentChunkStart = new Date(currentChunkEnd);
      currentChunkStart.setDate(currentChunkStart.getDate() + 1);
    }

    // ── 2. Fetch Today's Live Intraday Trades ────────────────────────────────
    try {
      await delay(350);
      const todayUrl = 'https://api.dhan.co/v2/trades';
      const todayResp = await fetchWithRetry(todayUrl);
      if (todayResp.ok) {
        const todayData = await todayResp.json();
        const todayList = Array.isArray(todayData) ? todayData : (todayData.data || []);
        if (Array.isArray(todayList) && todayList.length > 0) {
          console.log(`[Dhan Sync] Fetched ${todayList.length} intraday executions from /v2/trades`);
          for (const item of todayList) {
            item._isIntraday = true;
          }
          rawExecutionsList = rawExecutionsList.concat(todayList);
        }
      }
    } catch (todayErr: any) {
      console.warn('[Dhan Sync] Intraday endpoint fetch non-fatal notice:', todayErr.message);
    }

    // ── 3. High-Precision Deduplication ─────────────────────────────────────
    // Deduplicate without ever dropping genuine partial fills across historical and intraday feeds!
    const uniqueExecutions = new Map<string, any>();
    for (const t of rawExecutionsList) {
      const timeMs = parseDhanTime(getBestTime(t)).getTime();
      const priceKey = parseFloat(t.tradedPrice || 0).toFixed(4);
      const orderIdKey = t.orderId || t.exchangeOrderId || '';
      const segmentKey = t.exchangeSegment || '';
      const txTypeKey = (t.transactionType || '').toUpperCase();
      const qtyKey = parseInt(t.tradedQuantity || 0, 10);
      const key = `${segmentKey}|${orderIdKey}|${txTypeKey}|${qtyKey}|${priceKey}|${timeMs}`;

      if (!uniqueExecutions.has(key)) {
        t._brokerOrderKey = key;
        uniqueExecutions.set(key, t);
      } else {
        // Prefer record with richer taxes/charges (historical records have official statutory tax breakdown)
        const existing = uniqueExecutions.get(key);
        const existingHasCharges = parseFloat(existing.sebiTax || 0) + parseFloat(existing.stt || 0) > 0;
        const incomingHasCharges = parseFloat(t.sebiTax || 0) + parseFloat(t.stt || 0) > 0;
        if (!existingHasCharges && incomingHasCharges) {
          t._brokerOrderKey = key;
          uniqueExecutions.set(key, t);
        }
      }
    }

    let allTrades = Array.from(uniqueExecutions.values());

    // Sort chronologically by resolved timestamp
    allTrades.sort((a, b) => {
      const tA = parseDhanTime(getBestTime(a)).getTime();
      const tB = parseDhanTime(getBestTime(b)).getTime();
      return tA - tB;
    });

    console.log(`[Dhan Sync] Total unique executions after dedup: ${allTrades.length}`);

    let latestTradeTime: Date | null = null;
    if (allTrades.length > 0) {
      const lastRaw = allTrades[allTrades.length - 1];
      latestTradeTime = parseDhanTime(getBestTime(lastRaw));
    }

    // ── 4. Group Executions by Trading Date (IST) ───────────────────────────
    const executionsByDate = new Map<string, any[]>();
    for (const rawTrade of allTrades) {
      const tradeDate = extractTradeDate(getBestTime(rawTrade));
      if (tradeDate === '1970-01-01') continue;
      if (!executionsByDate.has(tradeDate)) executionsByDate.set(tradeDate, []);
      executionsByDate.get(tradeDate)!.push(rawTrade);
    }

    // Sort executions inside each day
    for (const dayExecutions of executionsByDate.values()) {
      dayExecutions.sort((a, b) =>
        parseDhanTime(getBestTime(a)).getTime() - parseDhanTime(getBestTime(b)).getTime()
      );
    }

    const sortedDates = Array.from(executionsByDate.keys()).sort();
    const tradesToInsert: any[] = [];
    let carryForwardPositions: Record<string, any> = {};
    const billedOrders = new Set<string>();

    // ── 5. Position Pairing Engine ───────────────────────────────────────────
    for (const tradeDate of sortedDates) {
      const dayExecutions = executionsByDate.get(tradeDate)!;
      const openPositions: Record<string, any> = { ...carryForwardPositions };

      for (const rawTrade of dayExecutions) {
        const rawSym =
          rawTrade.customSymbol ||
          rawTrade.tradingSymbol ||
          `SID:${rawTrade.securityId || 'UNKNOWN'}`;
        const symbol = formatCleanSymbol(rawSym);
        const txType = (rawTrade.transactionType || '').toUpperCase();
        const tradePrice = parseFloat(rawTrade.tradedPrice || 0);
        const exchangeSegment = rawTrade.exchangeSegment || '';
        const execTime = parseDhanTime(getBestTime(rawTrade));

        // Traded quantity in Dhan API v2 is already in actual contract units (barrels, shares, etc.).
        let tradeQty = parseInt(rawTrade.tradedQuantity || 0, 10);

        let parsedBrokerage = parseFloat(rawTrade.brokerageCharges || 0);
        if (
          parsedBrokerage === 0 &&
          (exchangeSegment.includes('FNO') ||
            exchangeSegment.includes('COMM') ||
            exchangeSegment.includes('CURRENCY'))
        ) {
          const orderId = rawTrade.orderId || '';
          if (orderId && !billedOrders.has(orderId)) {
            parsedBrokerage = 20;
            billedOrders.add(orderId);
          }
        }

        const tradeCharges =
          parseFloat(rawTrade.sebiTax || 0) +
          parseFloat(rawTrade.stt || 0) +
          parsedBrokerage +
          parseFloat(rawTrade.serviceTax || 0) +
          parseFloat(rawTrade.exchangeTransactionCharges || 0) +
          parseFloat(rawTrade.stampDuty || 0);

        // ── Direction-aware position lookup ──────────────────────────────────
        // Key by `symbol|direction` so that a re-entry after a close on the same
        // symbol is treated as a NEW position rather than averaged into the prior trade.
        const incomingDir  = txType === 'BUY' ? 'LONG' : 'SHORT';
        const oppositeDir  = incomingDir === 'LONG' ? 'SHORT' : 'LONG';
        const samePosKey   = `${symbol}|${incomingDir}`;
        const oppPosKey    = `${symbol}|${oppositeDir}`;

        // Prefer opposite-direction position (closing/reversing) over same-direction (scaling-in).
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
          currentPosKey = samePosKey; // new position will be stored here
        }

        if (!pos) {
          // ── Open a brand-new position ──────────────────────────────────────
          // Use a stable position-level key so that incremental re-syncs always
          // produce the same key and the DB upsert fires correctly.
          const stableKey = `${tradeDate}|${symbol}|${incomingDir}|${rawTrade.orderId || ''}`;
          pos = {
            userId,
            broker: 'dhan',
            brokerTradeId: rawTrade.orderId || null,
            brokerOrderKey: stableKey,
            date: execTime,
            exitTime: null,
            symbol,
            market: mapExchangeSegmentToMarket(exchangeSegment),
            instrumentType: mapInstrumentType(
              rawTrade.instrument,
              exchangeSegment,
              rawTrade.drvOptionType,
              symbol
            ),
            direction: incomingDir,
            entryPrice: tradePrice,
            quantity: tradeQty,
            currentQty: tradeQty,
            exitPrice: 0,
            exitQty: 0,
            realizedPnl: 0,
            charges: tradeCharges,
            status: 'OPEN',
            disciplineScore: null,
          };
          openPositions[currentPosKey] = pos;
        } else {
          pos.charges += tradeCharges;
          const isSameDirection =
            (pos.direction === 'LONG' && txType === 'BUY') ||
            (pos.direction === 'SHORT' && txType === 'SELL');

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
                // Reversal: remaining qty opens a new position in the incoming direction
                const revPosKey    = `${symbol}|${incomingDir}`;
                const revStableKey = `${tradeDate}|${symbol}|${incomingDir}|${rawTrade.orderId || ''}_rev`;
                openPositions[revPosKey] = {
                  userId,
                  broker: 'dhan',
                  brokerTradeId: rawTrade.orderId || null,
                  brokerOrderKey: revStableKey,
                  date: execTime,
                  exitTime: null,
                  symbol,
                  market: mapExchangeSegmentToMarket(exchangeSegment),
                  instrumentType: mapInstrumentType(
                    rawTrade.instrument,
                    exchangeSegment,
                    rawTrade.drvOptionType,
                    symbol
                  ),
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

    console.log(`[Dhan Sync] Built ${tradesToInsert.length} position records`);

    // ── Discipline Scoring Pass ────────────────────────────────────────────
    assignDisciplineScores(tradesToInsert);

    const mapToSchema = (p: any) => {
      const entryDate = p.date instanceof Date ? p.date : new Date(p.date);
      const exitTimeDate: Date | null = p.exitTime instanceof Date
        ? p.exitTime
        : (p.exitTime ? new Date(p.exitTime) : null);

      const entryDateStr = extractTradeDate(entryDate.toISOString());
      const exitDateStr = exitTimeDate ? extractTradeDate(exitTimeDate.toISOString()) : null;
      const isCarryForward = !!exitDateStr && entryDateStr !== exitDateStr;
      // OPEN positions have no realized P&L yet — store null instead of computing
      // charges-only values that would show as phantom losses on the dashboard.
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
    console.error('Failed to sync Dhan trades:', err);
    throw err;
  }
}

