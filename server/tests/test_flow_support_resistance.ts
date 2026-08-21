import { SignalEngine } from '../src/flow/services/SignalEngine';
import { OptionTick } from '../src/flow/providers/IOptionsDataProvider';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${message}`);
}

console.log('🧪 Running Flow Support & Resistance Verification Test...\n');

// 1. Test empty chain (should return empty strikes and undefined support/resistance, NO synthetic fake strikes)
const emptyIntelligence = SignalEngine.compute({
  symbol: 'NIFTY',
  expiry: '2026-08-27',
  dte: 6,
  chain: [],
  spotPrice: 24237.25,
  spotChange: 5.4,
  spotChangePct: 0.02,
  isSpotLive: true,
  vix: 13.5,
  isVixLive: true,
  dataQuality: 'live',
  lastUpdated: Date.now(),
});

assert(emptyIntelligence.supportStrike === undefined, 'Empty chain should have undefined supportStrike');
assert(emptyIntelligence.resistanceStrike === undefined, 'Empty chain should have undefined resistanceStrike');
assert(emptyIntelligence.meaningfulStrikes.length === 0, 'Empty chain should return 0 meaningful strikes (no fake 24050/24450)');
assert(emptyIntelligence.pcrIsValid === false, 'Empty chain PCR should be marked invalid');

// 2. Test Real-World Option Chain with known OI peaks
// Suppose NIFTY spot is 24,250
// Call OI peaks at 24,500 (Call Wall / Resistance = 1,500,000 contracts from call sellers)
// Put OI peaks at 24,000 (Put Wall / Support = 1,800,000 contracts from put sellers)
const mockTicks: OptionTick[] = [
  // 24000
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24000, optionType: 'CE', ltp: 320, openInterest: 200000, volume: 50000, timestamp: Date.now() },
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24000, optionType: 'PE', ltp: 25,  openInterest: 1800000, volume: 300000, timestamp: Date.now() }, // Max Put OI

  // 24100
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24100, optionType: 'CE', ltp: 230, openInterest: 400000, volume: 80000, timestamp: Date.now() },
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24100, optionType: 'PE', ltp: 45,  openInterest: 900000, volume: 150000, timestamp: Date.now() },

  // 24200 (Near ATM)
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24200, optionType: 'CE', ltp: 150, openInterest: 700000, volume: 200000, timestamp: Date.now() },
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24200, optionType: 'PE', ltp: 80,  openInterest: 650000, volume: 180000, timestamp: Date.now() },

  // 24300 (Near ATM)
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24300, optionType: 'CE', ltp: 85,  openInterest: 850000, volume: 250000, timestamp: Date.now() },
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24300, optionType: 'PE', ltp: 140, openInterest: 300000, volume: 90000, timestamp: Date.now() },

  // 24400
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24400, optionType: 'CE', ltp: 40,  openInterest: 1100000, volume: 400000, timestamp: Date.now() },
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24400, optionType: 'PE', ltp: 220, openInterest: 150000, volume: 40000, timestamp: Date.now() },

  // 24500 (Call Wall / Resistance)
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24500, optionType: 'CE', ltp: 18,  openInterest: 1500000, volume: 600000, timestamp: Date.now() }, // Max Call OI
  { symbol: 'NIFTY', expiryDate: '2026-08-27', strikePrice: 24500, optionType: 'PE', ltp: 310, openInterest: 50000, volume: 10000, timestamp: Date.now() },
];

const liveIntelligence = SignalEngine.compute({
  symbol: 'NIFTY',
  expiry: '2026-08-27',
  dte: 6,
  chain: mockTicks,
  spotPrice: 24244.9,
  spotChange: 12.5,
  spotChangePct: 0.05,
  isSpotLive: true,
  vix: 13.2,
  isVixLive: true,
  dataQuality: 'live',
  lastUpdated: Date.now(),
});

assert(liveIntelligence.supportStrike === 24000, `Support should be 24000 (Max Put OI = 1.8M), got ${liveIntelligence.supportStrike}`);
assert(liveIntelligence.maxPutOI === 1800000, `Max Put OI should be 1800000, got ${liveIntelligence.maxPutOI}`);
assert(liveIntelligence.resistanceStrike === 24500, `Resistance should be 24500 (Max Call OI = 1.5M), got ${liveIntelligence.resistanceStrike}`);
assert(liveIntelligence.maxCallOI === 1500000, `Max Call OI should be 1500000, got ${liveIntelligence.maxCallOI}`);
assert(liveIntelligence.pcrIsValid === true, 'PCR should be marked valid with live chain');
assert(liveIntelligence.pcrOI > 0, `PCR should be positive, got ${liveIntelligence.pcrOI}`);

console.log('\n🎉 ALL FLOW SUPPORT & RESISTANCE INTEGRITY TESTS PASSED!');
