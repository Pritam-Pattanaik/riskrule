import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useVoiceStore } from '../../stores/voiceStore';
import { cn } from '../../lib/cn';

interface AudioPlayButtonProps {
  /** The message text to narrate. Normalization happens server-side. */
  text: string;
  /** Unique message ID for per-message speaking state tracking. */
  messageId: string;
  /** Whether the message is currently being streamed — disables the button. */
  isStreaming?: boolean;
  /**
   * If true, automatically triggers playback on mount.
   * Caller is responsible for honoring AUTO_PLAY_POLICY before setting this.
   */
  autoPlay?: boolean;
  /** Whether THIS specific message is currently speaking (tracked by parent). */
  isSpeaking?: boolean;
  /** Called when play is requested. Parent updates speakingMessageId. */
  onPlay?: (messageId: string, text: string) => void;
  /** Called when stop is requested. */
  onStop?: () => void;
  className?: string;
}

/**
 * AudioPlayButton — Narration control for LUNAR AI messages.
 *
 * Renders inline inside the AIMessage action bar as a dedicated component.
 * Delegates all audio synthesis to the existing voiceAudioPlayer pipeline
 * (POST /api/voice/synthesize via voiceStore.speak).
 *
 * Visual states:
 *   idle      → Volume2 icon, "Speak" label
 *   streaming → disabled, muted
 *   loading   → Loader2 spinner, "Synthesizing..."
 *   playing   → VolumeX icon, "Stop" label (accent color)
 */
export function AudioPlayButton({
  text,
  messageId,
  isStreaming = false,
  autoPlay = false,
  isSpeaking = false,
  onPlay,
  onStop,
  className,
}: AudioPlayButtonProps) {
  const { voiceModeEnabled, isProcessing } = useVoiceStore();
  const autoPlayFiredRef = useRef(false);

  // Auto-play on mount (only fires once, only if voice mode is enabled)
  useEffect(() => {
    if (autoPlay && !autoPlayFiredRef.current && voiceModeEnabled && !isStreaming && text?.trim().length > 2) {
      autoPlayFiredRef.current = true;
      onPlay?.(messageId, text);
    }
  }, [autoPlay, voiceModeEnabled, isStreaming, text, messageId, onPlay]);

  const handleClick = () => {
    if (isStreaming) return;
    if (isSpeaking) {
      onStop?.();
    } else {
      onPlay?.(messageId, text);
    }
  };

  // Don't render if voice mode is off — keeps the action bar uncluttered
  if (!voiceModeEnabled) return null;

  const isLoading = isProcessing && !isSpeaking;
  const isDisabled = isStreaming || isLoading;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0',
        isSpeaking
          ? 'text-accent bg-accent/10 hover:bg-accent/20'
          : isLoading
            ? 'text-amber-400 bg-amber-400/5 cursor-wait'
            : 'text-tertiary hover:text-accent hover:bg-accent/5',
        isDisabled && !isSpeaking && 'opacity-50 cursor-not-allowed',
        className,
      )}
      title={
        isStreaming
          ? 'Generating response...'
          : isSpeaking
            ? 'Stop narration'
            : isLoading
              ? 'Synthesizing audio...'
              : 'Read aloud'
      }
      aria-label={isSpeaking ? 'Stop narration' : 'Read message aloud'}
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isSpeaking ? (
        <VolumeX className="w-3 h-3" />
      ) : (
        <Volume2 className="w-3 h-3" />
      )}
      <span className="hidden sm:inline">
        {isLoading ? 'Synthesizing...' : isSpeaking ? 'Stop' : 'Speak'}
      </span>
    </button>
  );
}
