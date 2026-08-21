import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../stores/notificationStore';

/**
 * Synthesizes high-fidelity, crystal-clear notification audio using the Web Audio API.
 * Provides rich, pleasant, and prominent audio chimes for all alert priorities.
 */
export function useNotificationSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasUserGestureRef = useRef(false);

  const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!hasUserGestureRef.current) return null; // Don't create before user gesture

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    // Prime the AudioContext on user interaction to satisfy browser autoplay policies
    const handleUserGesture = () => {
      hasUserGestureRef.current = true;
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    };

    window.addEventListener('click', handleUserGesture, { passive: true });
    window.addEventListener('keydown', handleUserGesture, { passive: true });
    window.addEventListener('pointerdown', handleUserGesture, { passive: true });

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
      window.removeEventListener('pointerdown', handleUserGesture);
    };
  }, []);

  const playSound = (type: 'Critical' | 'Warning' | 'Success' | 'Information') => {
    const { soundEnabled, soundVolume } = useNotificationStore.getState();
    if (!soundEnabled || soundVolume <= 0) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Scale volume directly from user setting: 100% -> 0.85 gain (clean, prominent, no clipping)
    const masterGain = ctx.createGain();
    const effectiveVolume = Math.min(1.0, Math.max(0.05, soundVolume * 0.85));
    masterGain.gain.setValueAtTime(effectiveVolume, now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'Information': {
        // Crisp two-tone marimba chime (D5 -> A5)
        const notes = [
          { freq: 587.33, start: 0.0, duration: 0.18 },
          { freq: 880.00, start: 0.08, duration: 0.28 },
        ];

        notes.forEach(({ freq, start, duration }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + start);

          // Natural bell envelope
          gain.gain.setValueAtTime(0.0001, now + start);
          gain.gain.exponentialRampToValueAtTime(0.7, now + start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + start);
          osc.stop(now + start + duration);
        });
        break;
      }

      case 'Success': {
        // Bright 3-note ascending major triad (C5 -> E5 -> G5 -> C6)
        const notes = [
          { freq: 523.25, start: 0.0, duration: 0.14 },
          { freq: 659.25, start: 0.07, duration: 0.14 },
          { freq: 783.99, start: 0.14, duration: 0.16 },
          { freq: 1046.50, start: 0.21, duration: 0.40 },
        ];

        notes.forEach(({ freq, start, duration }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + start);

          gain.gain.setValueAtTime(0.0001, now + start);
          gain.gain.linearRampToValueAtTime(0.8, now + start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + start);
          osc.stop(now + start + duration);
        });
        break;
      }

      case 'Warning': {
        // Two-pulse assertive warning chime (A4 -> C#5, double tap)
        const pulses = [0.0, 0.16];
        pulses.forEach((pulseStart) => {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(440, now + pulseStart);
          osc2.frequency.setValueAtTime(554.37, now + pulseStart);

          gain.gain.setValueAtTime(0.0001, now + pulseStart);
          gain.gain.linearRampToValueAtTime(0.85, now + pulseStart + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + pulseStart + 0.14);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(masterGain);

          osc1.start(now + pulseStart);
          osc2.start(now + pulseStart);
          osc1.stop(now + pulseStart + 0.14);
          osc2.stop(now + pulseStart + 0.14);
        });
        break;
      }

      case 'Critical': {
        // Authoritative resonant alarm chime (Dual harmonic chord with rich sustain)
        const frequencies = [440, 523.25, 659.25, 880];
        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          // Staccato attack with sustained decay
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.9 / frequencies.length, now + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.95);
        });
        break;
      }
    }
  };

  return { playSound };
}
