import {
  generateDeltaSignature,
  mapDeltaSymbolToMarket,
  mapDeltaInstrumentType,
  formatDeltaSymbol,
  syncDeltaExchangeTrades,
} from '../src/lib/brokers/delta_exchange';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

async function runDeltaTests() {
  console.log('====================================================');
  console.log('⚡ DELTA EXCHANGE FORENSIC RECONCILIATION TEST SUITE');
  console.log('====================================================\n');

  // ── Test 1: HMAC-SHA256 Signature Verification ────────────────────────────
  console.log('[Test 1] Verifying HMAC-SHA256 Signature Generation...');
  const testSecret = 'test_secret_key_12345';
  const timestamp = '1700000000';
  const method = 'GET';
  const path = '/v2/fills';
  const queryString = 'page_size=100';

  const sig1 = generateDeltaSignature(method, timestamp, path, queryString, '', testSecret);
  const sig2 = generateDeltaSignature('get', timestamp, path, `?${queryString}`, '', testSecret);

  assert(sig1.length === 64, 'Signature must be a 64-character hexadecimal string');
  assert(sig1 === sig2, 'Signature generation must be case-insensitive for HTTP method and normalize leading ?');
  console.log('  ✅ HMAC-SHA256 signature calculation validated.\n');

  // ── Test 2: Symbol & Instrument Mapping ───────────────────────────────────
  console.log('[Test 2] Verifying Symbol & Instrument Type Mapping...');
  assert(mapDeltaSymbolToMarket('BTCUSD') === 'Crypto', 'BTCUSD market should be Crypto');
  assert(mapDeltaInstrumentType('BTCUSD') === 'CRYPTO', 'BTCUSD instrumentType should be CRYPTO');

  assert(mapDeltaSymbolToMarket('ETH-PERP') === 'F&O', 'ETH-PERP market should be F&O');
  assert(mapDeltaInstrumentType('ETH-PERP') === 'FUT', 'ETH-PERP instrumentType should be FUT');

  assert(mapDeltaSymbolToMarket('BTC-29MAR24-70000-C') === 'F&O', 'Option market should be F&O');
  assert(mapDeltaInstrumentType('BTC-29MAR24-70000-C') === 'CE', 'Call Option instrumentType should be CE');
  assert(mapDeltaInstrumentType('BTC-29MAR24-65000-P') === 'PE', 'Put Option instrumentType should be PE');

  assert(formatDeltaSymbol('btc_usd') === 'BTC-USD', 'Symbol formatting should replace underscores with hyphens');
  console.log('  ✅ Symbol and instrument classification validated.\n');

  // ── Test 3: Simulated Fill Ingestion & Position Reconciliation ─────────────
  console.log('[Test 3] Verifying Position Pairing & P&L Math...');

  // Mock global fetch for Delta API
  const mockFills = [
    {
      id: 'fill_001',
      order_id: 'ord_101',
      symbol: 'BTCUSD',
      price: '60000.00',
      size: '0.50',
      side: 'buy',
      fee: '15.00',
      created_at: '2026-08-10T10:00:00.000Z',
    },
    {
      id: 'fill_002',
      order_id: 'ord_102',
      symbol: 'BTCUSD',
      price: '64000.00',
      size: '0.50',
      side: 'sell',
      fee: '16.00',
      created_at: '2026-08-10T14:30:00.000Z',
    },
  ];

  const originalFetch = global.fetch;
  (global as any).fetch = async (url: string) => {
    if (url.includes('/v2/fills')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, result: mockFills }),
      } as any;
    }
    return { ok: false, status: 404, json: async () => ({}) } as any;
  };

  try {
    const result = await syncDeltaExchangeTrades(
      'mock_api_key',
      'mock_api_secret',
      '00000000-0000-0000-0000-000000000000',
      'https://api.delta.exchange'
    );

    assert(result.tradesToInsert.length === 1, 'Expected 1 closed position record');
    const trade = result.tradesToInsert[0];

    assert(trade.symbol === 'BTCUSD', 'Trade symbol should be BTCUSD');
    assert(trade.direction === 'LONG', 'Trade direction should be LONG');
    assert(parseFloat(trade.entryPrice) === 60000, 'Entry price should be 60000');
    assert(parseFloat(trade.exitPrice) === 64000, 'Exit price should be 64000');
    assert(parseFloat(trade.quantity) === 0.5, 'Quantity should be 0.5');

    const expectedPnl = (64000 - 60000) * 0.5; // 2000 USD
    const expectedCharges = 15.0 + 16.0; // 31 USD
    const expectedNetPnl = expectedPnl - expectedCharges; // 1969 USD

    assert(Math.abs(parseFloat(trade.pnl) - expectedPnl) < 0.01, `Gross PnL should be ${expectedPnl}`);
    assert(Math.abs(parseFloat(trade.charges) - expectedCharges) < 0.01, `Charges should be ${expectedCharges}`);
    assert(Math.abs(parseFloat(trade.netPnl) - expectedNetPnl) < 0.01, `Net PnL should be ${expectedNetPnl}`);
    assert(trade.status === 'WIN', 'Trade status should be WIN');

    console.log(`  ✅ Gross P&L: $${trade.pnl} | Charges: $${trade.charges} | Net P&L: $${trade.netPnl}`);
    console.log('  ✅ Position pairing engine reconciliation matched 100%.\n');
  } finally {
    global.fetch = originalFetch;
  }

  console.log('====================================================');
  console.log('🎉 ALL DELTA EXCHANGE RECONCILIATION SUITES PASSED');
  console.log('====================================================\n');
}

runDeltaTests().catch((err) => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
