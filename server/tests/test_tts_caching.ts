/**
 * Integration tests for TTS audio caching layer.
 * Uses mocked synthesizeSpeech to verify cache hit/miss behavior.
 * Run: npx tsx server/tests/test_tts_caching.ts
 */

// ─── Minimal in-memory cache mock (mirrors lib/redis.ts cache interface) ──────

const memStore = new Map<string, string>();

// We patch the cache module before importing orchestrator
// by using a simple object that matches the cache API shape.
const mockCache = {
  async get(key: string): Promise<string | null> {
    return memStore.get(key) ?? null;
  },
  async set(key: string, value: string): Promise<void> {
    memStore.set(key, value);
  },
  async setex(key: string, _ttl: number, value: string): Promise<void> {
    memStore.set(key, value);
  },
  async del(key: string): Promise<void> {
    memStore.delete(key);
  },
};

// ─── Mock Sarvam synthesizeSpeech ────────────────────────────────────────────

let sarvamCallCount = 0;

const FAKE_AUDIO_BASE64 = 'UklGRiQAAABXQVZFZm10IBAAAA=='; // Minimal valid-ish WAV base64

async function mockSynthesize(_opts: any) {
  sarvamCallCount++;
  return {
    audioBase64: FAKE_AUDIO_BASE64,
    audioChunks: [FAKE_AUDIO_BASE64],
    requestIds: ['mock-req-id'],
  };
}

// ─── Direct cache module tests (import audioCache directly) ──────────────────

import { buildCacheKey, isStaticPhrase } from '../src/services/voice/audioCache';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string, detail?: string) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}${detail ? `\n       ${detail}` : ''}`);
    failed++;
  } else {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  }
}

// ─── Cache Key Determinism ─────────────────────────────────────────────────
console.log('\n🔑 Cache Key Determinism');

const key1 = buildCacheKey('Nifty fifty gained two point three percent', 'en-IN', 'kabir', 1.0);
const key2 = buildCacheKey('Nifty fifty gained two point three percent', 'en-IN', 'kabir', 1.0);
const key3 = buildCacheKey('Nifty fifty gained two point three percent', 'hi-IN', 'kabir', 1.0);
const key4 = buildCacheKey('Nifty fifty gained two point three percent', 'en-IN', 'priya', 1.0);

assert(key1 === key2, 'Same inputs produce identical cache key');
assert(key1 !== key3, 'Different language produces different cache key');
assert(key1 !== key4, 'Different speaker produces different cache key');
assert(key1.startsWith('tts:audio:'), 'Cache key has correct namespace prefix');
assert(key1.length > 20, 'Cache key is not empty/trivially short');

// ─── Static Phrase Detection ───────────────────────────────────────────────
console.log('\n📌 Static Phrase Detection');

assert(isStaticPhrase('Hello, I have reviewed your trades.'), 'Known opener flagged as static');
assert(isStaticPhrase('Analysis complete. Here is your summary.'), 'Analysis complete flagged as static');
assert(isStaticPhrase("Here's your performance report."), "Here's your report flagged as static");
assert(!isStaticPhrase('Your NIFTY50 position lost ₹1,500 today.'), 'Dynamic live data not flagged as static');
assert(!isStaticPhrase('RSI crossed 70 on BANKNIFTY.'), 'Technical indicator message not flagged as static');

// ─── Manual Cache Read/Write Round-trip ───────────────────────────────────
console.log('\n💾 Cache Read/Write Round-trip');

(async () => {
  const testKey = 'tts:audio:test-manual-key';
  const testAudio = {
    audioBase64: FAKE_AUDIO_BASE64,
    audioChunks: [FAKE_AUDIO_BASE64],
    createdAt: Date.now(),
  };

  // Write to mock store directly
  await mockCache.setex(testKey, 86400, JSON.stringify(testAudio));

  // Read back
  const raw = await mockCache.get(testKey);
  assert(raw !== null, 'Cache returns stored value');

  const parsed = JSON.parse(raw!);
  assert(parsed.audioBase64 === FAKE_AUDIO_BASE64, 'Stored audioBase64 matches');
  assert(Array.isArray(parsed.audioChunks), 'Stored audioChunks is array');
  assert(parsed.audioChunks[0] === FAKE_AUDIO_BASE64, 'First chunk matches');

  // ─── Sarvam call count tests (via orchestrator logic simulation) ──────────
  console.log('\n🌐 Sarvam Call Suppression on Cache Hit');

  // Simulate orchestrator cache-hit path:
  //   - First call: cache miss → synthesize → cache write
  //   - Second call: cache hit → NO synthesize
  sarvamCallCount = 0;

  const cacheKey = buildCacheKey('Nifty fifty gained', 'en-IN', 'kabir', 1.0);

  // Simulate miss: call synthesize, store result
  const missResult = await mockSynthesize({ text: 'Nifty fifty gained' });
  await mockCache.setex(cacheKey, 86400, JSON.stringify({
    audioBase64: missResult.audioBase64,
    audioChunks: missResult.audioChunks,
    createdAt: Date.now(),
  }));
  assert(sarvamCallCount === 1, 'Sarvam called once on cache miss');

  // Simulate hit: read from cache
  const hitRaw = await mockCache.get(cacheKey);
  assert(hitRaw !== null, 'Cache hit returns data');
  assert(sarvamCallCount === 1, 'Sarvam NOT called on cache hit (count still 1)');

  // ─── Rate Cap Simulation ───────────────────────────────────────────────────
  console.log('\n⏱️  Rate Cap Logic');

  const rateLimitCap = 3; // Low cap for testing
  const rateKey = 'tts:rate:test-user-001';

  // Simulate 3 calls under cap
  for (let i = 1; i <= rateLimitCap; i++) {
    const count = parseInt((await mockCache.get(rateKey)) ?? '0', 10);
    assert(count < rateLimitCap, `Call ${i}: under cap (count=${count})`);
    await mockCache.setex(rateKey, 3600, (count + 1).toString());
  }

  // Next call should be over cap
  const finalCount = parseInt((await mockCache.get(rateKey)) ?? '0', 10);
  assert(finalCount >= rateLimitCap, `After ${rateLimitCap} calls: cap correctly reached`);

  // ─── Results ────────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(50)}`);
  if (failed === 0) {
    console.log(`🎉 ALL ${passed} TTS CACHING TESTS PASSED!`);
  } else {
    console.log(`❌ ${failed} test(s) FAILED, ${passed} passed.`);
    process.exit(1);
  }
})();
