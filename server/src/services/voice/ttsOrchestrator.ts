import { synthesizeSpeech } from '../../lib/ai/SarvamVoiceService';
import { normalizeForTTS, NormalizeResult } from './textNormalizer';
import { buildCacheKey, getCachedAudio, setCachedAudio, isStaticPhrase } from './audioCache';
import { cache } from '../../lib/redis';
import { logger } from '../../lib/logger';

// ─── Configuration ────────────────────────────────────────────────────────────

const TTS_RATE_CAP_HOURLY = parseInt(process.env.TTS_RATE_CAP_HOURLY || '20', 10);
const TTS_RATE_WINDOW_SEC = 3600; // 1 hour

// Supported Sarvam language codes. Falls back to en-IN for unknown codes.
const SUPPORTED_LANGUAGES = new Set([
  'en-IN', 'hi-IN', 'od-IN', 'ta-IN', 'te-IN',
  'bn-IN', 'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN',
]);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OrchestrateOptions {
  text: string;
  userId: string;
  speaker?: string;
  languageCode?: string;
  pace?: number;
}

export interface OrchestrateResult {
  /** Original raw text — always returned regardless of TTS status */
  text: string;
  /** Normalized text that was sent to Sarvam (or would have been) */
  normalizedText: string;
  /** Full concatenated WAV audio as base64, or null if TTS failed/was skipped */
  audioBase64: string | null;
  /** Individual audio chunks (for progressive playback) */
  audioChunks: string[];
  /** True if audio was served from cache (Sarvam was NOT called) */
  isCached: boolean;
  /** True if Sarvam returned audio for a code-mixed sentence (flagged for review) */
  isCodeMixed: boolean;
  /** True if user has exceeded their hourly TTS rate cap — audio silently omitted */
  rateLimitExceeded: boolean;
  /** Language actually used (may differ from requested if fallback applied) */
  languageUsed: string;
}

// ─── Rate Cap Helpers ────────────────────────────────────────────────────────
// Mirrors the pattern from server/src/middleware/aiRateLimiter.ts

async function checkAndIncrementRateCap(userId: string): Promise<boolean> {
  const key = `tts:rate:${userId}`;
  try {
    const countStr = await cache.get(key);
    const count = countStr ? parseInt(countStr, 10) : 0;

    if (count >= TTS_RATE_CAP_HOURLY) {
      logger.warn(`[TTS Orchestrator] Hourly TTS rate cap (${TTS_RATE_CAP_HOURLY}) exceeded for user ${userId}`);
      return false; // Capped
    }

    // Increment — preserve remaining window TTL if key already exists
    if (count === 0) {
      await cache.setex(key, TTS_RATE_WINDOW_SEC, '1');
    } else {
      // Overwrite with same TTL — cache.set has a default 300s TTL so use setex explicitly
      await cache.setex(key, TTS_RATE_WINDOW_SEC, (count + 1).toString());
    }
    return true; // Under cap
  } catch (err: any) {
    // Fail open — don't block TTS if Redis is unavailable
    logger.warn(`[TTS Orchestrator] Rate cap check failed (fail-open): ${err?.message}`);
    return true;
  }
}

// ─── Language Resolution ─────────────────────────────────────────────────────

function resolveLanguage(requested?: string): { code: string; fellBack: boolean } {
  if (!requested || !SUPPORTED_LANGUAGES.has(requested)) {
    return { code: 'en-IN', fellBack: !!requested };
  }
  return { code: requested, fellBack: false };
}

// ─── Main Orchestrator ───────────────────────────────────────────────────────

/**
 * Central TTS pipeline for LUNAR AI narration.
 *
 * Text ALWAYS ships in the response — audio is additive.
 * Any failure (Sarvam timeout, rate cap, cache error) → audioBase64: null, no crash.
 *
 * Pipeline:
 *   1. Resolve + validate language (fallback to en-IN if unsupported)
 *   2. Normalize text (markdown strip, currency, tickers, numbers)
 *   3. Check hourly rate cap — if exceeded return text-only silently
 *   4. Check audio cache — if hit, return cached audio
 *   5. Call Sarvam synthesizeSpeech()
 *   6. Store result in cache
 *   7. Return full result
 */
export async function orchestrate(options: OrchestrateOptions): Promise<OrchestrateResult> {
  const {
    text,
    userId,
    speaker = 'kabir',
    pace = 1.0,
  } = options;

  // Base result — text always ships
  const base: Omit<OrchestrateResult, 'audioBase64' | 'audioChunks' | 'isCached' | 'rateLimitExceeded' | 'languageUsed' | 'normalizedText'> = {
    text,
    isCodeMixed: false,
  };

  // 1. Resolve language
  const { code: languageCode, fellBack } = resolveLanguage(options.languageCode);
  if (fellBack) {
    logger.info(`[TTS Orchestrator] Unsupported language "${options.languageCode}" — falling back to en-IN`);
  }

  // 2. Normalize text
  let normResult: NormalizeResult;
  try {
    normResult = normalizeForTTS(text, languageCode);
  } catch (normErr: any) {
    logger.error(`[TTS Orchestrator] Text normalization failed: ${normErr?.message}`);
    // Fall back to plain text with basic markdown strip
    normResult = { normalized: text.replace(/[#*_`]/g, '').trim(), isCodeMixed: false, codeMixedSegments: [] };
  }

  const { normalized, isCodeMixed } = normResult;

  if (!normalized || normalized.trim().length < 2) {
    return {
      ...base,
      normalizedText: normalized,
      audioBase64: null,
      audioChunks: [],
      isCached: false,
      rateLimitExceeded: false,
      languageUsed: languageCode,
      isCodeMixed,
    };
  }

  // 3. Check rate cap
  const underCap = await checkAndIncrementRateCap(userId);
  if (!underCap) {
    return {
      ...base,
      normalizedText: normalized,
      audioBase64: null,
      audioChunks: [],
      isCached: false,
      rateLimitExceeded: true,
      languageUsed: languageCode,
      isCodeMixed,
    };
  }

  // 4. Cache lookup
  const cacheKey = buildCacheKey(normalized, languageCode, speaker, pace);
  let cached;
  try {
    cached = await getCachedAudio(cacheKey);
  } catch { /* ignore — proceed to synthesis */ }

  if (cached) {
    logger.info(`[TTS Orchestrator] Cache HIT (key ...${cacheKey.slice(-8)}) for user ${userId}`);
    return {
      ...base,
      normalizedText: normalized,
      audioBase64: cached.audioBase64,
      audioChunks: cached.audioChunks,
      isCached: true,
      rateLimitExceeded: false,
      languageUsed: languageCode,
      isCodeMixed,
    };
  }

  // 5. Call Sarvam TTS (with retry on 429)
  logger.info(`[TTS Orchestrator] Cache MISS — synthesizing ${normalized.length} chars for user ${userId}`);

  let sarvamResult;
  let attempt = 0;
  const MAX_ATTEMPTS = 2;

  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    try {
      sarvamResult = await synthesizeSpeech({
        text: normalized,
        speaker,
        languageCode,
        pace: Math.max(0.5, Math.min(2.0, pace)),
      });
      break; // Success
    } catch (err: any) {
      const is429 = err?.message?.includes('429') || err?.message?.toLowerCase().includes('rate limit');
      if (is429 && attempt < MAX_ATTEMPTS) {
        const jitter = Math.random() * 1000 + 500; // 500–1500ms jitter
        logger.warn(`[TTS Orchestrator] Sarvam 429 — retrying in ${jitter.toFixed(0)}ms (attempt ${attempt}/${MAX_ATTEMPTS})`);
        await new Promise(r => setTimeout(r, jitter));
        continue;
      }
      // Final failure — log and return text-only
      logger.error(`[TTS Orchestrator] Sarvam TTS failed after ${attempt} attempt(s): ${err?.message}`);
      return {
        ...base,
        normalizedText: normalized,
        audioBase64: null,
        audioChunks: [],
        isCached: false,
        rateLimitExceeded: false,
        languageUsed: languageCode,
        isCodeMixed,
      };
    }
  }

  if (!sarvamResult) {
    return {
      ...base,
      normalizedText: normalized,
      audioBase64: null,
      audioChunks: [],
      isCached: false,
      rateLimitExceeded: false,
      languageUsed: languageCode,
      isCodeMixed,
    };
  }

  // 6. Store in cache (non-blocking — don't await to avoid delaying response)
  const isStatic = isStaticPhrase(normalized);
  setCachedAudio(
    cacheKey,
    { audioBase64: sarvamResult.audioBase64, audioChunks: sarvamResult.audioChunks, createdAt: Date.now() },
    isStatic,
  ).catch(cacheErr => {
    logger.warn(`[TTS Orchestrator] Cache write failed (non-fatal): ${cacheErr?.message}`);
  });

  // 7. Return result
  return {
    ...base,
    normalizedText: normalized,
    audioBase64: sarvamResult.audioBase64,
    audioChunks: sarvamResult.audioChunks,
    isCached: false,
    rateLimitExceeded: false,
    languageUsed: languageCode,
    isCodeMixed,
  };
}
