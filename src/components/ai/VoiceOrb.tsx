import React from 'react';
import { cn } from '../../lib/cn';
import { useVoiceStore } from '../../stores/voiceStore';

/**
 * VoiceOrb — JARVIS-style animated voice state indicator.
 * Shows different pulse/wave animations based on voice state:
 *   idle → subtle glow
 *   listening → pulsating mic ring
 *   processing → spinning dots
 *   speaking → wave animation
 */
export function VoiceOrb({ className }: { className?: string }) {
  const { isListening, isSpeaking, isProcessing } = useVoiceStore();

  const state = isListening ? 'listening' : isProcessing ? 'processing' : isSpeaking ? 'speaking' : 'idle';

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer ring — pulsates when listening */}
      {state === 'listening' && (
        <>
          <div className="absolute w-10 h-10 rounded-full bg-red-500/20 animate-ping" />
          <div className="absolute w-8 h-8 rounded-full bg-red-500/30 animate-pulse" />
        </>
      )}

      {/* Speaking waves */}
      {state === 'speaking' && (
        <div className="absolute flex items-center gap-[2px]">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-[3px] bg-accent rounded-full"
              style={{
                animation: `voiceWave 0.8s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                height: '12px',
              }}
            />
          ))}
        </div>
      )}

      {/* Processing spinner */}
      {state === 'processing' && (
        <div className="absolute w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      )}

      {/* Core dot */}
      <div className={cn(
        'w-3 h-3 rounded-full transition-colors duration-300 z-10',
        state === 'listening' && 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]',
        state === 'speaking' && 'bg-accent shadow-[0_0_12px_rgba(16,185,129,0.6)]',
        state === 'processing' && 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]',
        state === 'idle' && 'bg-tertiary/40',
      )} />

      {/* Inject keyframes */}
      <style>{`
        @keyframes voiceWave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
}
