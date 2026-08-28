import crypto from 'crypto';
import { cache } from '../../lib/redis';
import { logger } from '../../lib/logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CachedAudio {
  audioBase64: string;
  audioChunks: string[];
  createdAt: number;
}

// ─── Static Phrase Detection ──────────────────────────────────────────────────
// These boilerplate openers/closers repeat across many sessions and should be
// cached indefinitely (no TTL) to maximize cache efficiency.

const STATIC_PHRASE_PATTERNS: RegExp[] = [
  /^(hello|hi|greetings|welcome|good (morning|evening|afternoon))/i,
  /^(analysis complete|analysis done|here['’]?(s| is)? (your |the )?(recent |daily |trade |performance )*(analysis|summary|report|breakdown|review))/i,
  /^(i['’]?(ve| have)? (reviewed|analyzed|looked at) your (trades|journal|performance|account|data))/i,
  /^(based on your (trading|recent) (history|data|performance|trades))/i,
  /^(your (risk|discipline|performance) (score|rating|summary|profile))/i,
  /^(as your (ai |trading )?coach|let me (analyze|review|assess))/i,
];

const DYNAMIC_AUDIO_TTL_SEC = 24 * 60 * 60; // 24 hours for live data messages

// ─── Cache Key Builder ───────────────────────────────────────────────────────

/**
 * Produces a stable, deterministic SHA-256 cache key for a TTS request.
 * Key encodes all parameters that affect audio output.
 */
export function buildCacheKey(
  normalizedText: string,
  languageCode: string,
  speaker: string,
  pace: number,
): string {
  const raw = `${normalizedText}|${languageCode}|${speaker}|${pace.toFixed(2)}`;
  return 'tts:audio:' + crypto.createHash('sha256').update(raw, 'utf8').digest('hex');
}

// ─── Static Phrase Detection ──────────────────────────────────────────────────

export function isStaticPhrase(text: string): boolean {
  const trimmed = text.trim();
  return STATIC_PHRASE_PATTERNS.some(p => p.test(trimmed));
}

// ─── Cache Read ───────────────────────────────────────────────────────────────

/**
 * Attempts to retrieve a pre-synthesized audio entry from the cache.
 * Returns null on miss or deserialization error.
 */
export async function getCachedAudio(cacheKey: string): Promise<CachedAudio | null> {
  try {
    const raw = await cache.get(cacheKey);
    if (!raw) return null;
    const parsed: CachedAudio = JSON.parse(raw);
    if (!parsed.audioBase64 || !Array.isArray(parsed.audioChunks)) return null;
    return parsed;
  } catch (err: any) {
    logger.warn(`[AudioCache] Cache read error for key ${cacheKey.slice(-8)}: ${err?.message}`);
    return null;
  }
}

// ─── Cache Write ─────────────────────────────────────────────────────────────

/**
 * Stores synthesized audio in the cache.
 * - Static boilerplate phrases: no TTL (permanent until Redis eviction).
 * - Dynamic messages (live numeric data): 24-hour TTL.
 */
export async function setCachedAudio(
  cacheKey: string,
  audio: CachedAudio,
  isStatic: boolean = false,
): Promise<void> {
  try {
    const serialized = JSON.stringify(audio);

    // Guard against caching excessively large payloads (> 4MB base64)
    if (serialized.length > 4 * 1024 * 1024) {
      logger.warn(`[AudioCache] Skipping cache write — payload too large (${(serialized.length / 1024).toFixed(0)} KB)`);
      return;
    }

    if (isStatic) {
      // No TTL — permanent for static boilerplate
      // Using set() with a very long TTL (30 days) since the cache API requires a TTL
      await cache.setex(cacheKey, 30 * 24 * 60 * 60, serialized);
      logger.debug(`[AudioCache] Static phrase cached permanently (key ...${cacheKey.slice(-8)})`);
    } else {
      await cache.setex(cacheKey, DYNAMIC_AUDIO_TTL_SEC, serialized);
      logger.debug(`[AudioCache] Dynamic audio cached 24h (key ...${cacheKey.slice(-8)})`);
    }
  } catch (err: any) {
    // Cache write failure is non-fatal — TTS already synthesized, just won't be cached
    logger.warn(`[AudioCache] Cache write failed: ${err?.message}`);
  }
}
