import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { synthesizeSpeech, transcribeSpeech, getAvailableVoices, getVoiceById } from '../lib/ai/SarvamVoiceService';
import { orchestrate } from '../services/voice/ttsOrchestrator';
import { logger } from '../lib/logger';

const router = Router();

// ─── GET /api/voice/voices — List available voices ───────────────────────────
router.get('/voices', authenticate, (_req: any, res) => {
  try {
    const voices = getAvailableVoices();
    res.json({ voices });
  } catch (error) {
    logger.error('[Voice] Failed to list voices', { error });
    res.status(500).json({ error: 'Failed to list voices' });
  }
});

// ─── POST /api/voice/synthesize — General TTS (now routes through orchestrator) ──
//
// This endpoint is used by the client voiceAudioPlayer for all voice output,
// including manual "Speak" button clicks. Now goes through:
//   textNormalizer → audioCache → sarvamClient (with rate cap + retry)
//
// Text always ships in the response. Audio is additive.
router.post('/synthesize', authenticate, async (req: any, res) => {
  try {
    const { text, speaker, languageCode, pace } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 2) {
      return res.status(400).json({ error: 'Text is required (min 2 characters)' });
    }

    // Validate or fallback speaker
    let validSpeaker = speaker;
    if (!validSpeaker || !getVoiceById(validSpeaker)) {
      validSpeaker = 'kabir';
    }

    const result = await orchestrate({
      text: text.trim(),
      userId: req.userId,
      speaker: validSpeaker,
      languageCode,
      pace: pace ? parseFloat(pace) : undefined,
    });

    // Text always returns. Audio fields are null if TTS failed or was rate-capped.
    res.json({
      audio: result.audioBase64,
      chunks: result.audioChunks,
      isCached: result.isCached,
      isCodeMixed: result.isCodeMixed,
      rateLimitExceeded: result.rateLimitExceeded,
      languageUsed: result.languageUsed,
      normalizedText: result.normalizedText,
    });
  } catch (error: any) {
    // Catch-all: log but never let audio failure break the response
    logger.error('[Voice TTS] Unhandled synthesis error', { error: error.message });
    res.json({ audio: null, chunks: [], isCached: false, rateLimitExceeded: false, error: 'tts_failed' });
  }
});

// ─── POST /api/voice/synthesize-lunar — LUNAR AI dedicated TTS endpoint ──────
//
// Called specifically for LUNAR AI coach messages. Identical pipeline to
// /synthesize but carries an explicit isLunarMessage flag for future priority
// routing and analytics tagging.
//
// Returns the same response shape as /synthesize.
router.post('/synthesize-lunar', authenticate, async (req: any, res) => {
  try {
    const { text, speaker, languageCode, pace } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 2) {
      return res.status(400).json({ error: 'Text is required (min 2 characters)' });
    }

    let validSpeaker = speaker;
    if (!validSpeaker || !getVoiceById(validSpeaker)) {
      validSpeaker = 'kabir';
    }

    logger.info(`[Voice LUNAR] Narrating LUNAR AI message (${text.trim().length} chars) for user ${req.userId}`);

    const result = await orchestrate({
      text: text.trim(),
      userId: req.userId,
      speaker: validSpeaker,
      languageCode,
      pace: pace ? parseFloat(pace) : undefined,
    });

    res.json({
      audio: result.audioBase64,
      chunks: result.audioChunks,
      isCached: result.isCached,
      isCodeMixed: result.isCodeMixed,
      rateLimitExceeded: result.rateLimitExceeded,
      languageUsed: result.languageUsed,
      normalizedText: result.normalizedText,
    });
  } catch (error: any) {
    logger.error('[Voice LUNAR] TTS error', { error: error.message });
    // Text always ships — never let audio failure block message delivery
    res.json({ audio: null, chunks: [], isCached: false, rateLimitExceeded: false, error: 'tts_failed' });
  }
});

// ─── GET /api/voice/settings — Voice preferences stub ─────────────────────────
// Future-proofing endpoint for server-side preference storage.
// Currently the client localStorage is the source of truth.
router.get('/settings', authenticate, (_req: any, res) => {
  res.json({ message: 'Client-side preferences active. Server-side persistence coming soon.' });
});

// ─── POST /api/voice/transcribe — Speech-to-Text (unchanged, out of scope) ───
router.post('/transcribe', authenticate, async (req: any, res) => {
  try {
    let audioBuffer: Buffer;
    let filename = 'recording.webm';

    if (req.body?.audio && typeof req.body.audio === 'string') {
      audioBuffer = Buffer.from(req.body.audio, 'base64');
      filename = req.body.filename || filename;
    } else if (Buffer.isBuffer(req.body)) {
      audioBuffer = req.body;
    } else {
      return res.status(400).json({ error: 'Audio data is required. Send base64-encoded audio in { audio, filename } format.' });
    }

    if (audioBuffer.length < 100) {
      return res.status(400).json({ error: 'Audio file too small' });
    }

    if (audioBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Audio file too large (max 10MB)' });
    }

    const result = await transcribeSpeech({
      audioBuffer,
      filename,
      languageCode: req.body?.languageCode,
    });

    res.json({
      transcript: result.transcript,
      languageCode: result.languageCode,
      requestId: result.requestId,
    });
  } catch (error: any) {
    logger.error('[Voice STT] Transcription error', { error: error.message });
    res.status(500).json({ error: error.message || 'Speech-to-text transcription failed' });
  }
});

export default router;
