import https from 'https';
import { logger } from '../logger';

// ─── Sarvam AI Voice Configuration ───────────────────────────────────────────

const MAX_TTS_CHARS = 2500; // Sarvam Bulbul v3 actual limit per docs

export interface SarvamVoice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
}

// All verified available Bulbul v3 voices from Sarvam AI
export const SARVAM_VOICES: SarvamVoice[] = [
  // Deep / Commanding Male (JARVIS-like)
  { id: 'kabir',    name: 'Kabir',    gender: 'male',   description: 'Deep, resonant — JARVIS-like' },
  { id: 'ashutosh', name: 'Ashutosh', gender: 'male',   description: 'Commanding, authoritative' },
  { id: 'aditya',   name: 'Aditya',   gender: 'male',   description: 'Warm, conversational' },
  { id: 'shubh',    name: 'Shubh',    gender: 'male',   description: 'Natural, clear tone (Default)' },
  { id: 'advait',   name: 'Advait',   gender: 'male',   description: 'Smooth, balanced' },
  { id: 'rahul',    name: 'Rahul',    gender: 'male',   description: 'Calm, measured' },
  { id: 'rohan',    name: 'Rohan',    gender: 'male',   description: 'Energetic, upbeat' },
  { id: 'amit',     name: 'Amit',     gender: 'male',   description: 'Crisp, articulate' },
  { id: 'dev',      name: 'Dev',      gender: 'male',   description: 'Soft, thoughtful' },
  { id: 'varun',    name: 'Varun',    gender: 'male',   description: 'Confident, clear' },
  { id: 'ratan',    name: 'Ratan',    gender: 'male',   description: 'Distinguished, mature' },
  { id: 'anand',    name: 'Anand',    gender: 'male',   description: 'Friendly, engaging' },
  { id: 'tarun',    name: 'Tarun',    gender: 'male',   description: 'Sharp, modern' },
  { id: 'gokul',    name: 'Gokul',    gender: 'male',   description: 'South Indian accent' },

  // Female Voices
  { id: 'priya',    name: 'Priya',    gender: 'female', description: 'Confident, polished' },
  { id: 'neha',     name: 'Neha',     gender: 'female', description: 'Bright, expressive' },
  { id: 'ritu',     name: 'Ritu',     gender: 'female', description: 'Warm, welcoming' },
  { id: 'pooja',    name: 'Pooja',    gender: 'female', description: 'Calm, soothing' },
  { id: 'simran',   name: 'Simran',   gender: 'female', description: 'Energetic, cheerful' },
  { id: 'kavya',    name: 'Kavya',    gender: 'female', description: 'Soft, gentle' },
  { id: 'ishita',   name: 'Ishita',   gender: 'female', description: 'Sharp, professional' },
  { id: 'shreya',   name: 'Shreya',   gender: 'female', description: 'Elegant, composed' },
  { id: 'roopa',    name: 'Roopa',    gender: 'female', description: 'Clear, articulate' },
  { id: 'niharika', name: 'Niharika', gender: 'female', description: 'Polished, executive' },
  { id: 'tanya',    name: 'Tanya',    gender: 'female', description: 'Friendly, modern' },
  { id: 'shruti',   name: 'Shruti',   gender: 'female', description: 'Expressive, dynamic' },
  { id: 'suhani',   name: 'Suhani',   gender: 'female', description: 'Gentle, melodious' },
  { id: 'kavitha',  name: 'Kavitha',  gender: 'female', description: 'South Indian accent' },
];

// ─── Text Preprocessing ─────────────────────────────────────────────────────

/**
 * Strips markdown formatting for natural TTS output.
 * Converts structured text into spoken-word friendly plain text.
 * Exported so textNormalizer.ts can import and supersede it progressively.
 */
export function stripMarkdownForSpeech(text: string): string {
  return text
    // Remove HTML comments (discipline tags, etc.)
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove headers (## → keep text)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    .replace(/_{1,3}(.*?)_{1,3}/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove links — keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove bullet markers
    .replace(/^[\s]*[-*+•]\s+/gm, '')
    // Remove numbered list markers
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove table formatting
    .replace(/\|/g, ',')
    .replace(/^[-:| ]+$/gm, '')
    // Collapse multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Replace ₹ symbol with "rupees" for speech
    .replace(/₹\s*/g, 'rupees ')
    .trim();
}

/**
 * Splits text into chunks ≤ MAX_TTS_CHARS, breaking at sentence boundaries.
 */
function splitTextForTTS(text: string): string[] {
  if (text.length <= MAX_TTS_CHARS) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_TTS_CHARS) {
      chunks.push(remaining);
      break;
    }

    const slice = remaining.substring(0, MAX_TTS_CHARS);
    let breakPoint = -1;

    for (const delim of ['. ', '! ', '? ', '।\n', '.\n', '\n\n', '\n', ', ']) {
      const idx = slice.lastIndexOf(delim);
      if (idx > MAX_TTS_CHARS * 0.3) {
        breakPoint = idx + delim.length;
        break;
      }
    }

    if (breakPoint === -1) {
      breakPoint = slice.lastIndexOf(' ');
      if (breakPoint === -1) breakPoint = MAX_TTS_CHARS;
    }

    chunks.push(remaining.substring(0, breakPoint).trim());
    remaining = remaining.substring(breakPoint).trim();
  }

  return chunks;
}

// ─── Helper for HTTPS requests with TLS resilience ──────────────────────────

function makeHttpsPost(urlStr: string, headers: Record<string, string>, bodyBuffer: Buffer | string): Promise<{ statusCode: number; statusMessage: string; body: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = typeof bodyBuffer === 'string' ? Buffer.from(bodyBuffer, 'utf8') : bodyBuffer;

    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      rejectUnauthorized: false, // Prevents Windows root CA / self-signed proxy issues
      headers: {
        ...headers,
        'Content-Length': postData.length,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 500,
          statusMessage: res.statusMessage || '',
          body: data,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// ─── Sarvam TTS ──────────────────────────────────────────────────────────────

export interface TTSOptions {
  text: string;
  speaker?: string;
  languageCode?: string;
  pace?: number;
  /**
   * When true, skips the internal stripMarkdownForSpeech() call.
   * Set this when text has already been normalized by ttsOrchestrator
   * (which uses the richer textNormalizer.ts pipeline) to avoid
   * double-processing that corrupts language-specific output like
   * Hindi currency labels (रुपये) being re-written back to "rupees".
   */
  skipPreprocess?: boolean;
}

export interface TTSResult {
  audioBase64: string;     // Full concatenated audio
  audioChunks: string[];   // Individual chunk audios
  requestIds: string[];
}

/**
 * Converts text to speech via Sarvam AI Bulbul v3.
 * Handles long texts by chunking at sentence boundaries.
 */
export async function synthesizeSpeech(options: TTSOptions): Promise<TTSResult> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY is not configured');
  }

  // When called via ttsOrchestrator, text is already normalized by the richer
  // textNormalizer.ts pipeline. Skip re-processing to avoid corrupting language-
  // specific labels (e.g. Hindi रुपये getting rewritten to "rupees").
  const cleanText = options.skipPreprocess
    ? options.text.trim()
    : stripMarkdownForSpeech(options.text);

  if (!cleanText || cleanText.length < 2) {
    throw new Error('Text too short for synthesis');
  }

  const chunks = splitTextForTTS(cleanText);
  const validSpeakerIds = SARVAM_VOICES.map(v => v.id);
  const speaker = (options.speaker && validSpeakerIds.includes(options.speaker)) ? options.speaker : 'kabir';
  const languageCode = options.languageCode || 'en-IN';
  const pace = options.pace ? Math.max(0.5, Math.min(2.0, options.pace)) : 1.0;

  logger.info(`[Voice TTS] Synthesizing ${cleanText.length} chars in ${chunks.length} chunk(s) — lang=${languageCode} speaker="${speaker}" preprocess=${!options.skipPreprocess}`);

  const audioChunks: string[] = [];
  const requestIds: string[] = [];

  for (const chunk of chunks) {
    const payload = JSON.stringify({
      text: chunk,
      language_code: languageCode,
      speaker: speaker,
      model: 'bulbul:v3',
      pace: pace,
    });

    const response = await makeHttpsPost(
      'https://api.sarvam.ai/text-to-speech',
      {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      payload
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      logger.error(`[Voice TTS] Sarvam API error ${response.statusCode}: ${response.body}`);
      let parsedErr = 'TTS synthesis failed';
      try {
        const errObj = JSON.parse(response.body);
        if (errObj.error?.message) parsedErr = errObj.error.message;
      } catch {}
      throw new Error(`TTS synthesis failed: ${parsedErr}`);
    }

    const data = JSON.parse(response.body);

    if (data.audios && data.audios.length > 0) {
      audioChunks.push(data.audios[0]);
    }
    if (data.request_id) {
      requestIds.push(data.request_id);
    }
  }

  return {
    audioBase64: audioChunks.join(''),
    audioChunks,
    requestIds,
  };
}

// ─── Sarvam STT ──────────────────────────────────────────────────────────────

export interface STTOptions {
  audioBuffer: Buffer;
  filename?: string;
  languageCode?: string;
}

export interface STTResult {
  transcript: string;
  languageCode?: string;
  requestId?: string;
}

/**
 * Transcribes audio to text via Sarvam AI Saaras v3.
 * Accepts WebM, WAV, MP3, OGG, etc.
 */
export async function transcribeSpeech(options: STTOptions): Promise<STTResult> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY is not configured');
  }

  const filename = options.filename || 'recording.webm';
  const ext = filename.split('.').pop()?.toLowerCase() || 'webm';
  const mimeMap: Record<string, string> = {
    webm: 'audio/webm',
    wav: 'audio/wav',
    mp3: 'audio/mpeg',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
  };
  const mimeType = mimeMap[ext] || 'audio/webm';

  const boundary = '----SarvamFormBoundary' + Math.random().toString(36).substring(2);
  let formHeader = `--${boundary}\r\n`;
  formHeader += `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`;
  formHeader += `Content-Type: ${mimeType}\r\n\r\n`;

  let formFooter = `\r\n--${boundary}\r\n`;
  formFooter += `Content-Disposition: form-data; name="model"\r\n\r\n`;
  formFooter += `saaras:v3\r\n`;
  formFooter += `--${boundary}--\r\n`;

  const payload = Buffer.concat([
    Buffer.from(formHeader, 'utf8'),
    options.audioBuffer,
    Buffer.from(formFooter, 'utf8')
  ]);

  logger.info(`[Voice STT] Transcribing ${(options.audioBuffer.length / 1024).toFixed(1)}KB ${ext} audio`);

  const response = await makeHttpsPost(
    'https://api.sarvam.ai/speech-to-text',
    {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'api-subscription-key': apiKey,
    },
    payload
  );

  if (response.statusCode < 200 || response.statusCode >= 300) {
    logger.error(`[Voice STT] Sarvam API error ${response.statusCode}: ${response.body}`);
    let parsedErr = 'Speech-to-text transcription failed';
    try {
      const errObj = JSON.parse(response.body);
      if (errObj.error?.message) parsedErr = errObj.error.message;
    } catch {}
    throw new Error(parsedErr);
  }

  const data = JSON.parse(response.body);

  return {
    transcript: data.transcript || '',
    languageCode: data.language_code,
    requestId: data.request_id,
  };
}

// ─── Voice List Helper ───────────────────────────────────────────────────────

export function getAvailableVoices(): SarvamVoice[] {
  return SARVAM_VOICES;
}

export function getVoiceById(id: string): SarvamVoice | undefined {
  return SARVAM_VOICES.find(v => v.id === id);
}
