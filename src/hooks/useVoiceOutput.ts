import { useCallback } from 'react';
import { useVoiceStore } from '../stores/voiceStore';

/**
 * useVoiceOutput — Sarvam AI Text-to-Speech playback hook.
 * Connects to the central VoiceAudioPlayer and VoiceStore.
 */
export function useVoiceOutput() {
  const {
    isSpeaking,
    isProcessing,
    voiceModeEnabled,
    autoSpeakLunarAI,
    autoPlayPolicy,
    speak,
    stopSpeaking,
  } = useVoiceStore();

  const speakIfEnabled = useCallback((text: string) => {
    if (voiceModeEnabled && autoPlayPolicy !== 'never' && text && text.trim().length > 2) {
      speak(text);
    }
  }, [voiceModeEnabled, autoPlayPolicy, speak]);

  return {
    speak,
    speakIfEnabled,
    stop: stopSpeaking,
    isSpeaking,
    isProcessing,
  };
}
