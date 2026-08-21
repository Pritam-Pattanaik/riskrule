/**
 * Angel One SmartAPI — Backend Integration
 *
 * Auth Flow (Fully Automated):
 *  1. Connect:  clientCode + apiKey + mpin + totpSecret (Base32)
 *               → generates TOTP from secret → calls loginByPassword
 *               → stores jwtToken + mpin + totpSecret in DB
 *
 *  2. Sync:     uses stored jwtToken for all API calls
 *
 *  3. Auto-Reauth (daily token refresh):
 *               → JWT expires at ~06:00 IST every day
 *               → server detects TOKEN_EXPIRED, auto-generates fresh TOTP
 *               → re-calls loginByPassword with stored mpin + fresh TOTP
 *               → updates jwtToken in DB silently — no user action needed
 *
 * Trade Book API Response Fields (confirmed from Angel One SmartAPI):
 *  - fillid        : unique fill ID
 *  - filltime      : "2026-08-18 09:48:00"
 *  - fillprice     : execution price (string)
 *  - fillsize      : quantity filled (string)
 *  - tradingsymbol : "RELIANCE-EQ", "NIFTY18AUG24CE22000"
 *  - exchange      : "NSE", "BSE", "NFO", "MCX"
 *  - transactiontype: "BUY" | "SELL"
 *  - producttype   : "DELIVERY" | "INTRADAY" | "CARRYFORWARD" | "MARGIN"
 *  - instrumenttype: "" (equity) | "OPTIDX" | "OPTSTK" | "FUTSTK" | "FUTIDX" | "FUTCUR"
 *  - strikeprice   : strike for options
 *  - optiontype    : "CE" | "PE" | ""
 *  - expirydate    : "30 Aug 2024"
 *  - uniqueorderid : order uuid
 *  - orderid       : order ID
 *
 * NOTE: The API also has `tradeprice` and `quantity` as aliases in some versions.
 *       We read BOTH and pick whichever is non-zero.
 */

import { TOTP } from 'totp-generator';

const ANGELONE_API_BASE = 'https://apiconnect.angelbroking.com/rest';

// ─── Shared request headers ───────────────────────────────────────────────────
function buildHeaders(apiKey: string, jwtToken?: string): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-UserType': 'USER',
    'X-SourceID': 'WEB',
    'X-ClientLocalIP': '127.0.0.1',
    'X-ClientPublicIP': '127.0.0.1',
    'X-MACAddress': '00:00:00:00:00:00',
    'X-PrivateKey': apiKey,
  };
  if (jwtToken) h['Authorization'] = `Bearer ${jwtToken}`;
  return h;
}

// ─── Angel One API error codes → friendly messages ────────────────────────────
const ANGEL_ERRORS: Record<string, string> = {
  'AB1050': 'Invalid TOTP Secret — the code generated from your secret is wrong. Re-copy the Base32 TOTP Secret from smartapi.angelbroking.com → Enable TOTP.',
  'AB2011': 'Incorrect MPIN. Verify the numeric PIN you use to log into Angel One.',
  'AB1005': 'Invalid Client Code. Check your Angel One login ID (e.g., A123456).',
  'AB1006': 'Invalid SmartAPI App Key. Regenerate it from smartapi.angelbroking.com → My Apps.',
  'AB1004': 'Account is blocked or suspended. Contact Angel One support.',
  'AB8050': 'Session already active on Angel One. Wait 30 seconds and retry.',
};

function mapError(code: string, fallback: string): string {
  return ANGEL_ERRORS[code] || fallback;
}

// ─── Generate TOTP from Base32 secret ────────────────────────────────────────
async function generateTOTP(totpSecret: string): Promise<string> {
  const clean = totpSecret.replace(/\s/g, '').toUpperCase();

  if (clean.length < 16) {
    throw new Error(
      'TOTP Secret is too short. Re-copy the Base32 key from smartapi.angelbroking.com → Enable TOTP.'
    );
  }
  if (!/^[A-Z2-7]+=*$/.test(clean)) {
    throw new Error(
      'TOTP Secret contains invalid characters. It must be a Base32 string (only A-Z and 2-7). ' +
      'Do NOT enter a 6-digit OTP — enter the setup secret key.'
    );
  }

  try {
    const { otp } = await TOTP.generate(clean);
    return otp;
  } catch (err: any) {
    throw new Error(`Failed to generate TOTP: ${err.message}. Ensure the Base32 TOTP Secret is copied exactly.`);
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
/**
 * Authenticate with Angel One SmartAPI.
 * Auto-generates a 6-digit TOTP from the stored Base32 secret.
 */
export async function loginAngelOne(
  clientCode: string,
  mpin: string,
  totpSecret: string,
  apiKey: string
): Promise<{ jwtToken: string; refreshToken: string; feedToken: string }> {
  if (!clientCode?.trim()) throw new Error('Client Code is required.');
  if (!apiKey?.trim())     throw new Error('SmartAPI App Key is required.');
  if (!mpin?.trim() || !/^\d{4,8}$/.test(mpin.trim())) {
    throw new Error('MPIN must be a 4–8 digit numeric PIN.');
  }
  if (!totpSecret?.trim()) {
    throw new Error('TOTP Secret is required. Find it on smartapi.angelbroking.com → Enable TOTP.');
  }

  const totp = await generateTOTP(totpSecret);

  let response: Response;
  try {
    response = await fetch(
      `${ANGELONE_API_BASE}/auth/angelbroking/user/v1/loginByPassword`,
      {
        method: 'POST',
        headers: buildHeaders(apiKey),
        body: JSON.stringify({
          clientcode: clientCode.trim(),
          password: mpin.trim(),
          totp,
        }),
      }
    );
  } catch (netErr: any) {
    throw new Error(`Network error reaching Angel One: ${netErr.message}`);
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Angel One returned a non-JSON response (HTTP ${response.status}).`);
  }

  if (data.status === true && data.data?.jwtToken) {
    console.log(`[AngelOne] Login OK for ${clientCode}`);
    return {
      jwtToken:     data.data.jwtToken as string,
      refreshToken: data.data.refreshToken as string,
      feedToken:    data.data.feedToken as string,
    };
  }

  const code = data.errorcode || '';
  const msg  = data.message || 'Login failed';
  console.error(`[AngelOne] Login failed [${code}] for ${clientCode}: ${msg}`);
  throw new Error(mapError(code, msg));
}

// ─── TRADE BOOK SYNC ──────────────────────────────────────────────────────────
/**
 * Fetch today's executed trades from Angel One Trade Book.
 *
 * IMPORTANT — Angel One TradeBook field names (confirmed):
 *   fillsize      = quantity executed per fill
 *   fillprice     = price per fill
 *   filltime      = "HH:MM:SS" or "YYYY-MM-DD HH:MM:SS"
 *   tradingsymbol = instrument symbol
 *   transactiontype = "BUY" | "SELL"
 *   producttype   = "DELIVERY" | "INTRADAY" | "CARRYFORWARD"
 *   instrumenttype = "" | "OPTIDX" | "OPTSTK" | "FUTSTK" | "FUTIDX"
 *
 * NOTE: Some versions also expose `quantity` / `tradeprice` as aliases —
 *       we read both and pick the non-zero value for safety.
 *
 * DB field mapping (Prisma Trade model):
 *   instrumentType  → mapped from instrumenttype
 *   direction       → "LONG" | "SHORT"  (NOT "side")
 *   entryPrice      → Decimal?
 *   quantity        → Decimal?
 */
export async function syncAngelOneTrades(
  clientCode: string,
  jwtToken: string,
  apiKey: string,
  userId: string,
  _existingOpenTrades: any[] = [],
  lastSyncedAt: Date | null = null
) {
  // ── 1. Fetch Trade Book ────────────────────────────────────────────────────
  let response: Response;
  try {
    response = await fetch(
      `${ANGELONE_API_BASE}/secure/angelbroking/order/v1/getTradeBook`,
      { method: 'GET', headers: buildHeaders(apiKey, jwtToken) }
    );
  } catch (netErr: any) {
    throw new Error(`Network error fetching Angel One trades: ${netErr.message}`);
  }

  if (response.status === 401) throw new Error('TOKEN_EXPIRED');

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error('Angel One Trade Book returned an unreadable response.');
  }

  // Token expired / invalid checks
  if (!data.status) {
    const msg = data.message || '';
    if (
      msg.toLowerCase().includes('invalid token') ||
      msg.toLowerCase().includes('unauthorized') ||
      data.errorcode === 'AG8001' ||
      data.errorcode === 'AB1011'
    ) {
      throw new Error('TOKEN_EXPIRED');
    }
    throw new Error(mapError(data.errorcode || '', msg || 'Failed to fetch Angel One Trade Book.'));
  }

  // data.data can be null when no trades exist today
  const rawFills: any[] = Array.isArray(data.data) ? data.data : [];
  console.log(`[AngelOne] Trade Book: ${rawFills.length} raw fills for ${clientCode}`);

  // Log the first fill's raw fields so we can debug field names in production
  if (rawFills.length > 0) {
    console.log('[AngelOne] Sample fill keys:', Object.keys(rawFills[0]).join(', '));
    console.log('[AngelOne] Sample fill data:', JSON.stringify(rawFills[0]));
  }

  // ── 2. Parse fills → group by symbol+date ────────────────────────────────
  // Always use today's date — Trade Book only returns current session trades
  const today = new Date().toISOString().split('T')[0];

  // Map: "SYMBOL:DATE" → aggregated trade
  const tradeMap = new Map<string, any>();

  for (const raw of rawFills) {
    const symbol: string = (raw.tradingsymbol || raw.symbolname || '').trim();
    if (!symbol) continue;

    // ── Read quantity (Angel One uses fillsize; some versions use quantity) ──
    const qty = parseFloat(
      raw.fillsize   ||   // primary field name
      raw.quantity   ||   // alias in some API versions
      raw.fillqty    ||   // another possible alias
      '0'
    );

    // ── Read price (Angel One uses fillprice; some versions use tradeprice) ──
    const price = parseFloat(
      raw.fillprice  ||   // primary field name
      raw.tradeprice ||   // alias in some API versions
      '0'
    );

    if (qty <= 0 || price <= 0) {
      console.warn(`[AngelOne] Skipping fill — zero qty/price for ${symbol}:`, { qty, price, raw });
      continue;
    }

    const txType    = (raw.transactiontype || '').toUpperCase();
    const side      = txType === 'SELL' ? 'SELL' : 'BUY';
    const instrType = (raw.instrumenttype || '').toUpperCase();
    const prodType  = (raw.producttype || 'INTRADAY').toUpperCase();
    const exchange  = (raw.exchange || 'NSE').toUpperCase();

    const isOptions = ['OPTIDX', 'OPTSTK'].includes(instrType);
    const isFutures = ['FUTSTK', 'FUTIDX', 'FUTCUR', 'FUTCOM'].includes(instrType);

    // Market: NFO for F&O, MCX for commodities, else use exchange
    const market = isFutures && exchange === 'MCX' ? 'MCX'
                 : (isOptions || isFutures) ? 'NFO'
                 : exchange;

    const key = `${symbol}:${today}`;

    if (!tradeMap.has(key)) {
      tradeMap.set(key, {
        userId,
        broker:         'angelone',
        source:         'broker_sync',
        date:           new Date(`${today}T09:15:00.000Z`),
        symbol,
        market,
        instrumentType: instrType || 'EQ',   // ← correct DB field name
        direction:      'LONG',              // ← correct DB field name (not 'side')
        entryPrice:     null,
        exitPrice:      null,
        quantity:       null,
        pnl:            null,
        charges:        null,
        netPnl:         null,
        status:         'OPEN',
        isCarryForward: prodType === 'CARRYFORWARD',
        tags:           [],
        mistakes:       [],
        _buys:          [] as { qty: number; price: number }[],
        _sells:         [] as { qty: number; price: number }[],
        _prodType:      prodType,
        _isOptions:     isOptions,
        _isFutures:     isFutures,
      });
    }

    const entry = tradeMap.get(key)!;
    if (side === 'BUY') entry._buys.push({ qty, price });
    else                entry._sells.push({ qty, price });
  }

  // ── 3. Aggregate buys/sells into trade records ────────────────────────────
  const tradesToInsert: any[] = [];

  for (const [key, t] of tradeMap) {
    const totalBuy  = t._buys.reduce((s: number, b: any)  => s + b.qty, 0);
    const totalSell = t._sells.reduce((s: number, b: any) => s + b.qty, 0);

    if (totalBuy === 0 && totalSell === 0) continue;

    const avgBuy  = totalBuy  > 0
      ? t._buys.reduce((s: number,  b: any) => s + b.price * b.qty, 0) / totalBuy
      : 0;
    const avgSell = totalSell > 0
      ? t._sells.reduce((s: number, b: any) => s + b.price * b.qty, 0) / totalSell
      : 0;

    // Determine direction
    const isLong    = totalBuy >= totalSell;
    t.direction     = isLong ? 'LONG' : 'SHORT';
    t.entryPrice    = isLong ? avgBuy  : avgSell;
    t.quantity      = isLong ? totalBuy : totalSell;

    // If both sides have fills → closed trade
    if (totalBuy > 0 && totalSell > 0) {
      t.exitPrice   = isLong ? avgSell : avgBuy;
      const minQty  = Math.min(totalBuy, totalSell);
      const gross   = isLong
        ? (avgSell - avgBuy) * minQty
        : (avgBuy - avgSell) * minQty;
      t.pnl = parseFloat(gross.toFixed(2));

      // Approximate Angel One charges
      const turnover = (avgBuy * totalBuy) + (avgSell * totalSell);
      let charges = 0;
      if (t._isOptions) {
        // Options: ₹20/order flat + STT on sell side only
        charges = 40 + (avgSell * totalSell) * 0.0005;
      } else if (t._isFutures) {
        // Futures: 0.02% brokerage both sides
        charges = turnover * 0.0002;
      } else if (t._prodType === 'DELIVERY') {
        // Delivery equity: 0.05% brokerage + 0.1% STT
        charges = turnover * 0.0015;
      } else {
        // Intraday: 0.025% both sides
        charges = turnover * 0.00025;
      }
      t.charges = parseFloat(charges.toFixed(2));
      t.netPnl  = parseFloat((t.pnl - t.charges).toFixed(2));
      t.status  = t.netPnl > 0 ? 'WIN' : t.netPnl < 0 ? 'LOSS' : 'BREAKEVEN';
    }

    // Determine instrument type for DB
    if (t._isOptions)      t.instrumentType = t.symbol?.includes('CE') ? 'CE' : t.symbol?.includes('PE') ? 'PE' : t.instrumentType;
    else if (t._isFutures) t.instrumentType = 'FUT';
    else                   t.instrumentType = 'EQ';

    t.brokerOrderKey = `angelone:${t.symbol}:${today}`;

    // Strip internal helper fields before inserting
    const { _buys, _sells, _prodType, _isOptions, _isFutures, ...clean } = t;
    tradesToInsert.push(clean);

    console.log(`[AngelOne] Parsed trade: ${key} | dir=${clean.direction} | qty=${clean.quantity} | entry=${clean.entryPrice} | status=${clean.status}`);
  }

  console.log(`[AngelOne] Total trades to insert: ${tradesToInsert.length}`);

  return {
    tradesToInsert,
    tradesToUpdate: [],
    latestTradeTime: tradesToInsert.length > 0 ? new Date() : null,
  };
}

// ─── PROFILE CHECK (verify JWT is still valid) ────────────────────────────────
export async function getAngelOneProfile(jwtToken: string, apiKey: string) {
  try {
    const res = await fetch(
      `${ANGELONE_API_BASE}/secure/angelbroking/user/v1/getProfile`,
      { method: 'GET', headers: buildHeaders(apiKey, jwtToken) }
    );
    if (res.status === 401) return null;
    const data = await res.json();
    if (data.status && data.data) return { name: data.data.name || '', email: data.data.email || '' };
    return null;
  } catch { return null; }
}
