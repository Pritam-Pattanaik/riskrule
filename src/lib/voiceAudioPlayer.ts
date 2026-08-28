import { getCsrfToken } from '../lib/api';

/**
 * Bulletproof Dual-Engine Voice Audio Player for Sarvam AI Text-to-Speech.
 *
 * Engine 1: Web Audio API (AudioContext) with explicit resume & slice protection.
 *           Instant, gapless, zero DOM overhead, completely immune to HTML5 Audio element errors.
 * Engine 2: HTML5 Audio with Data URL fallback.
 *           Used automatically if AudioContext is unsupported or in restricted environments.
 */
class VoiceAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private queue: string[] = [];
  private isPlaying = false;
  private activeAbortController: AbortController | null = null;
  private userInteracted = false;

  constructor() {
    // Prime audio context on any user interaction to unlock browser autoplay
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.userInteracted = true;
        this.unlockContext();
      };
      window.addEventListener('click', unlockAudio, { passive: true, once: true });
      window.addEventListener('keydown', unlockAudio, { passive: true, once: true });
      window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
    }
  }

  private unlockContext(): void {
    try {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {}
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Decodes a base64 WAV chunk and plays it seamlessly.
   */
  public async playBase64Chunk(base64: string): Promise<void> {
    if (!base64 || base64.trim().length === 0) return;

    // Decode base64 to binary buffer
    const binaryStr = atob(base64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;

    // ─── Primary Engine: Web Audio API ──────────────────────────────
    const ctx = this.getAudioContext();
    if (ctx) {
      try {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // Use slice(0) to pass a fresh copy of ArrayBuffer (avoids detachment)
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));

        return await new Promise<void>((resolve) => {
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          this.currentSource = source;

          source.onended = () => {
            if (this.currentSource === source) {
              this.currentSource = null;
            }
            resolve();
          };

          source.start(0);
        });
      } catch (webAudioErr) {
        console.warn('[VoicePlayer] Web Audio playback failed, falling back to HTML5 Audio:', webAudioErr);
      }
    }

    // ─── Secondary Engine: HTML5 Audio with Data URL Fallback ────────
    return await new Promise<void>((resolve) => {
      try {
        const audio = new Audio(`data:audio/wav;base64,${base64}`);
        this.currentAudio = audio;

        const onFinish = () => {
          audio.onended = null;
          audio.onerror = null;
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          resolve();
        };

        audio.onended = onFinish;
        audio.onerror = (e) => {
          console.warn('[VoicePlayer] HTML5 audio fallback warning:', e);
          onFinish();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[VoicePlayer] HTML5 audio play blocked:', err);
            onFinish();
          });
        }
      } catch (err) {
        console.warn('[VoicePlayer] HTML5 audio creation error:', err);
        resolve();
      }
    });
  }

  /**
   * Synthesizes and speaks text using Sarvam AI.
   */
  public async speakText(options: {
    text: string;
    speaker?: string;
    languageCode?: string;
    pace?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }): Promise<void> {
    const { text, speaker = 'pooja', languageCode = 'en-IN', pace = 1.0, onStart, onEnd, onError } = options;
    if (!text || text.trim().length < 2) return;

    this.stop(); // Stop any previous speech cleanly

    const abortController = new AbortController();
    this.activeAbortController = abortController;

    try {
      onStart?.();

      // IMPORTANT: Prime/resume the AudioContext IMMEDIATELY while we are still
      // in the synchronous scope of the user's click event. If we wait for the
      // API fetch to complete first, the browser will discard the user gesture
      // and block playback with Autoplay Policy restrictions!
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const { api } = await import('./api');

      const data = await api.post<{ audio?: string; chunks?: string[] }>('/voice/synthesize', {
        text: text.trim(),
        speaker,
        languageCode,
        pace,
      });

      const chunks: string[] = data.chunks && data.chunks.length > 0 ? data.chunks : (data.audio ? [data.audio] : []);

      if (chunks.length === 0) {
        throw new Error('No audio data received from server');
      }

      this.queue = [...chunks];
      this.isPlaying = true;

      while (this.queue.length > 0) {
        if (abortController.signal.aborted) break;
        const chunk = this.queue.shift()!;
        try {
          await this.playBase64Chunk(chunk);
        } catch (playErr) {
          console.warn('[VoicePlayer] Chunk play error:', playErr);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[VoicePlayer] Synthesis failed:', err);
        onError?.(err);
      }
    } finally {
      this.isPlaying = false;
      this.activeAbortController = null;
      onEnd?.();
    }
  }

  public stop(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
    this.queue = [];

    // Stop Web Audio node
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {}
      this.currentSource = null;
    }

    // Stop HTML5 Audio element without firing error handlers
    if (this.currentAudio) {
      try {
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }

    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const voiceAudioPlayer = new VoiceAudioPlayer();
