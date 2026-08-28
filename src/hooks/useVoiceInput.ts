import { useCallback, useRef } from 'react';
import { useVoiceStore } from '../stores/voiceStore';
import { getCsrfToken } from '../lib/api';

/**
 * useVoiceInput — Mic recording + Sarvam AI transcription.
 *
 * Flow:
 *   1. User clicks mic → startRecording()
 *   2. MediaRecorder captures audio chunks (WebM/opus)
 *   3. User clicks stop OR silence detected → stopRecording()
 *   4. Audio blob sent to POST /api/voice/transcribe
 *   5. Returns transcribed text
 */
export function useVoiceInput(onTranscript: (text: string) => void) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const {
    isListening,
    setListening,
    setProcessing,
    setInterimTranscript,
    setError,
  } = useVoiceStore();

  const cleanup = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, []);

  // Silence detection using AnalyserNode
  const startSilenceDetection = useCallback((stream: MediaStream) => {
    try {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      let silenceStart: number | null = null;
      const SILENCE_THRESHOLD = 15;  // RMS level below which = silence
      const SILENCE_DURATION = 2000; // 2s of silence → auto-stop

      const check = () => {
        if (!analyserRef.current) return;
        analyser.getByteTimeDomainData(buffer);

        // Calculate RMS
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          const val = (buffer[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / buffer.length) * 100;

        if (rms < SILENCE_THRESHOLD) {
          if (!silenceStart) silenceStart = Date.now();
          else if (Date.now() - silenceStart > SILENCE_DURATION) {
            // Silence detected — auto-stop
            stopRecording();
            return;
          }
        } else {
          silenceStart = null;
        }

        animFrameRef.current = requestAnimationFrame(check);
      };

      animFrameRef.current = requestAnimationFrame(check);
    } catch {
      // Silence detection not critical — skip
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setInterimTranscript('');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Prefer WebM/opus, fallback to whatever browser supports
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setListening(false);
        setProcessing(true);
        setInterimTranscript('Transcribing...');

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

          // Convert blob to base64
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );

          const token = localStorage.getItem('token') || '';
          const csrf = await getCsrfToken();

          const response = await fetch('/api/voice/transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(csrf ? { 'CSRF-Token': csrf } : {}),
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
            body: JSON.stringify({
              audio: base64,
              filename: mimeType.includes('webm') ? 'recording.webm' : 'recording.mp4',
            }),
          });

          if (!response.ok) {
            const err = await response.json().catch(() => ({ error: 'Transcription failed' }));
            throw new Error(err.error || 'Transcription failed');
          }

          const data = await response.json();
          const transcript = data.transcript?.trim();

          if (transcript) {
            setInterimTranscript('');
            onTranscript(transcript);
          } else {
            setInterimTranscript('');
            setError('Could not understand the audio. Please try again.');
          }
        } catch (err: any) {
          setError(err.message || 'Transcription failed');
          setInterimTranscript('');
        } finally {
          setProcessing(false);
          cleanup();
        }
      };

      recorder.onerror = () => {
        setError('Recording failed');
        setListening(false);
        cleanup();
      };

      // Start recording with 250ms chunks
      recorder.start(250);
      setListening(true);

      // Start silence detection
      startSilenceDetection(stream);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please allow microphone access.');
      } else {
        setError(err.message || 'Failed to start recording');
      }
      cleanup();
    }
  }, [onTranscript, cleanup, startSilenceDetection, setError, setInterimTranscript, setListening, setProcessing]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isListening, startRecording, stopRecording]);

  return {
    startRecording,
    stopRecording,
    toggleRecording,
    isListening,
  };
}
