/**
 * Unit tests for the TTS text normalizer.
 * Standalone — no Sarvam API, no DB, no Redis required.
 * Run: npx tsx server/tests/test_text_normalizer.ts
 */
import { normalizeForTTS, stripMarkdownForSpeech } from '../src/services/voice/textNormalizer';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string, detail?: string) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}${detail ? `\n       Got: ${detail}` : ''}`);
    failed++;
  } else {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  }
}

function assertEqual(actual: string, expected: string, message: string) {
  const ok = actual.trim() === expected.trim();
  assert(ok, message, ok ? undefined : `"${actual}" expected "${expected}"`);
}

function assertContains(actual: string, substring: string, message: string) {
  const ok = actual.toLowerCase().includes(substring.toLowerCase());
  assert(ok, message, ok ? undefined : `"${actual}" should contain "${substring}"`);
}

// ─── Markdown Stripping ──────────────────────────────────────────────────────
console.log('\n📝 Markdown Stripping');

assertEqual(
  stripMarkdownForSpeech('**Your NIFTY position** lost ₹1,500'),
  'Your NIFTY position lost ₹1,500',
  'Bold markers removed',
);

assertEqual(
  stripMarkdownForSpeech('## Risk Alert\n\nYour drawdown exceeded 2%.'),
  'Risk Alert. Your drawdown exceeded 2%.',
  'Header and newlines normalized',
);

assertEqual(
  stripMarkdownForSpeech('<!--DISCIPLINE_JSON-->{"score":4}<!--/DISCIPLINE_JSON-->Good trade!'),
  'Good trade!',
  'DISCIPLINE_JSON HTML comment stripped',
);

assertEqual(
  stripMarkdownForSpeech('- NIFTY support at 24,000\n- Resistance at 24,500'),
  'NIFTY support at 24,000. Resistance at 24,500.',
  'Bullet list markers removed',
);

// ─── Currency Expansion ───────────────────────────────────────────────────────
console.log('\n💰 Currency Expansion');

assertContains(
  normalizeForTTS('₹1,500 profit on BANKNIFTY').normalized,
  '1500 rupees',
  '₹ symbol expanded to rupees (commas removed)',
);

assertContains(
  normalizeForTTS('-₹450 loss on SL').normalized,
  'minus 450 rupees',
  'Negative ₹ expanded correctly',
);

assertContains(
  normalizeForTTS('$45 premium collected').normalized,
  '45 dollars',
  '$ symbol expanded to dollars',
);

assertContains(
  normalizeForTTS('€100 hedge cost').normalized,
  '100 euros',
  '€ expanded to euros',
);

// ─── Percentage Expansion ─────────────────────────────────────────────────────
console.log('\n📊 Percentage Expansion');

assertContains(
  normalizeForTTS('NIFTY gained 2.3% today').normalized,
  'two point three percent',
  '2.3% → two point three percent',
);

assertContains(
  normalizeForTTS('down -1.5% from open').normalized,
  'minus one point five percent',
  '-1.5% → minus one point five percent',
);

assertContains(
  normalizeForTTS('win rate is 65%').normalized,
  'sixty five percent',
  '65% → sixty five percent',
);

// ─── Known Ticker Expansion ───────────────────────────────────────────────────
console.log('\n📈 Known Ticker Expansion');

assertContains(
  normalizeForTTS('NIFTY50 hit all-time high').normalized,
  'Nifty fifty',
  'NIFTY50 → Nifty fifty',
);

assertContains(
  normalizeForTTS('BANKNIFTY PE expired worthless').normalized,
  'Bank Nifty',
  'BANKNIFTY → Bank Nifty',
);

assertContains(
  normalizeForTTS('your RSI crossed 70').normalized,
  'R S I',
  'RSI → R S I',
);

assertContains(
  normalizeForTTS('MACD crossover confirmed').normalized,
  'M A C D',
  'MACD → M A C D',
);

assertContains(
  normalizeForTTS('VWAP breakout at 24,200').normalized,
  'V-wap',
  'VWAP → V-wap',
);

assertContains(
  normalizeForTTS('SL hit at ₹24,000').normalized,
  'Stop Loss',
  'SL → Stop Loss',
);

assertContains(
  normalizeForTTS('F&O expiry today').normalized,
  'Futures and Options',
  'F&O → Futures and Options',
);

assertContains(
  normalizeForTTS('Your P&L is +₹3,200').normalized,
  'P and L',
  'P&L → P and L',
);

assertContains(
  normalizeForTTS('OI buildup at 24,500').normalized,
  'Open Interest',
  'OI → Open Interest',
);

// ─── Unknown Ticker → Letter-by-Letter ───────────────────────────────────────
console.log('\n🔡 Unknown Tickers → Letter-by-Letter');

assertContains(
  normalizeForTTS('Unknown ticker XYZABC spiked today').normalized,
  'X Y Z A B C',
  'Unknown all-caps ticker spelled letter-by-letter',
);

assertContains(
  normalizeForTTS('ABCDE formed a breakout pattern').normalized,
  'A B C D E',
  '5-letter unknown ticker spelled letter-by-letter',
);

// ─── Code-Mix Detection ───────────────────────────────────────────────────────
console.log('\n🌐 Code-Mix Detection');

const hindiMixed = normalizeForTTS('आज NIFTY ₹100 ऊपर गया', 'hi-IN');
assert(hindiMixed.isCodeMixed === true, 'Hindi text with NIFTY ticker flagged as code-mixed');
assert(hindiMixed.codeMixedSegments.length > 0, 'Code-mixed segments array is non-empty');

const pureEnglish = normalizeForTTS('NIFTY gained 2.3% today', 'en-IN');
assert(pureEnglish.isCodeMixed === false, 'Pure English text not flagged as code-mixed');

// ─── Complex Mixed Inputs ─────────────────────────────────────────────────────
console.log('\n🔀 Complex Real-World LUNAR AI Outputs');

const complex1 = normalizeForTTS(
  '**Risk Alert**: Your BANKNIFTY PE position lost ₹2,300 (-3.2%). RSI is at 28 — oversold territory. Consider reviewing your SL levels.',
).normalized;
assertContains(complex1, 'Bank Nifty', 'Complex 1: BANKNIFTY expanded');
assertContains(complex1, 'rupees', 'Complex 1: ₹ expanded');
assertContains(complex1, 'percent', 'Complex 1: % expanded');
assertContains(complex1, 'R S I', 'Complex 1: RSI expanded');
assertContains(complex1, 'Stop Loss', 'Complex 1: SL expanded');

const complex2 = normalizeForTTS(
  '## Performance Summary\n\n- Win Rate: 62%\n- P&L: +₹15,000\n- VWAP conformance: 85%\n- EMA trend: Bullish',
).normalized;
assertContains(complex2, 'P and L', 'Complex 2: P&L expanded');
assertContains(complex2, 'rupees', 'Complex 2: ₹ expanded');
assertContains(complex2, 'V-wap', 'Complex 2: VWAP expanded');
assertContains(complex2, 'E M A', 'Complex 2: EMA expanded');

// ─── Edge Cases ───────────────────────────────────────────────────────────────
console.log('\n⚠️  Edge Cases');

assert(normalizeForTTS('').normalized === '', 'Empty string returns empty');
assert(normalizeForTTS('   ').normalized === '', 'Whitespace-only returns empty');

const shortText = normalizeForTTS('Hi!').normalized;
assert(shortText.length > 0, 'Short valid text normalized without crash');

// ─── Results ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
if (failed === 0) {
  console.log(`🎉 ALL ${passed} TEXT NORMALIZER TESTS PASSED!`);
} else {
  console.log(`❌ ${failed} test(s) FAILED, ${passed} passed.`);
  process.exit(1);
}
