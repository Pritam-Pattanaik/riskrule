import { create } from 'zustand';
import { voiceAudioPlayer } from '../lib/voiceAudioPlayer';

export interface VoiceInfo {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
}

// All verified available Bulbul v3 voices from Sarvam AI
export const DEFAULT_SARVAM_VOICES: VoiceInfo[] = [
  // Deep / Commanding Male (JARVIS-like)
  { id: 'kabir',    name: 'Kabir',    gender: 'male',   description: 'Deep, resonant — JARVIS-like (Recommended)' },
  { id: 'ashutosh', name: 'Ashutosh', gender: 'male',   description: 'Commanding, authoritative' },
  { id: 'aditya',   name: 'Aditya',   gender: 'male',   description: 'Warm, conversational' },
  { id: 'shubh',    name: 'Shubh',    gender: 'male',   description: 'Natural, clear tone' },
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

// ─── Supported Narration Languages ───────────────────────────────────────────
export interface TargetLanguage {
  code: string;
  label: string;
  nativeLabel: string;
  script: string;
}

export const TARGET_LANGUAGES: TargetLanguage[] = [
  { code: 'en-IN', label: 'Indian English',  nativeLabel: 'English',    script: 'Latin' },
  { code: 'hi-IN', label: 'Hindi',           nativeLabel: 'हिन्दी',      script: 'Devanagari' },
  { code: 'od-IN', label: 'Odia',            nativeLabel: 'ଓଡ଼ିଆ',       script: 'Odia' },
  { code: 'ta-IN', label: 'Tamil',           nativeLabel: 'தமிழ்',       script: 'Tamil' },
  { code: 'te-IN', label: 'Telugu',          nativeLabel: 'తెలుగు',      script: 'Telugu' },
  { code: 'bn-IN', label: 'Bengali',         nativeLabel: 'বাংলা',       script: 'Bengali' },
  { code: 'mr-IN', label: 'Marathi',         nativeLabel: 'मराठी',       script: 'Devanagari' },
  { code: 'gu-IN', label: 'Gujarati',        nativeLabel: 'ગુજરાતી',     script: 'Gujarati' },
  { code: 'kn-IN', label: 'Kannada',         nativeLabel: 'ಕನ್ನಡ',       script: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam',       nativeLabel: 'മലയാളം',     script: 'Malayalam' },
  { code: 'pa-IN', label: 'Punjabi',         nativeLabel: 'ਪੰਜਾਬੀ',     script: 'Gurmukhi' },
];

interface VoiceState {
  // ─── Mode & Global Toggles ──────────────────────────────────────────
  voiceModeEnabled: boolean;           // Master toggle: enable Voice AI engine
  autoSpeakLunarAI: boolean;           // Legacy compat: derived from autoPlayPolicy
  autoSpeakNotifications: boolean;     // Auto-speak real-time trading notifications & alerts
  /**
   * Auto-play policy for LUNAR AI narration:
   * - 'never'  → manual-only: user must click Speak button
   * - 'auto'   → auto-speak when the AI message is fully complete (stream finishes)
   * - 'always' → auto-speak immediately (even during streaming, as each chunk completes)
   */
  autoPlayPolicy: 'never' | 'auto' | 'always';
  isListening: boolean;                // Mic is actively recording
  isSpeaking: boolean;                 // Audio is currently playing
  isProcessing: boolean;               // Transcription/synthesis in progress

  // ─── Voice Selection ───────────────────────────────────────────────
  selectedVoice: string;               // Sarvam speaker ID
  availableVoices: VoiceInfo[];
  voicesLoaded: boolean;

  // ─── Settings ──────────────────────────────────────────────────────
  pace: number;                        // Speech speed (0.5 - 2.0)
  languageCode: string;                // BCP-47 ('en-IN', 'hi-IN')

  // ─── Interim State ─────────────────────────────────────────────────
  interimTranscript: string;           // Live transcript while recording
  error: string | null;

  // ─── Actions ───────────────────────────────────────────────────────
  toggleVoiceMode: () => void;
  setVoiceMode: (enabled: boolean) => void;
  setAutoSpeakLunarAI: (enabled: boolean) => void;
  setAutoPlayPolicy: (policy: 'never' | 'auto' | 'always') => void;
  setAutoSpeakNotifications: (enabled: boolean) => void;
  setListening: (listening: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setSelectedVoice: (voiceId: string) => void;
  setPace: (pace: number) => void;
  setLanguageCode: (code: string) => void;
  setInterimTranscript: (text: string) => void;
  setError: (error: string | null) => void;
  setAvailableVoices: (voices: VoiceInfo[]) => void;
  loadVoices: () => Promise<void>;

  // ─── Audio Output Helpers ──────────────────────────────────────────
  speak: (text: string) => Promise<void>;
  speakNotification: (title: string, description?: string) => Promise<void>;
  stopSpeaking: () => void;
}

// Persist voice preferences in localStorage
function loadPreferences() {
  try {
    // Migrate: if autoPlayPolicy not set, derive from legacy autoSpeakLunarAI
    const rawPolicy = localStorage.getItem('tv_voice_auto_play_policy');
    const legacyAutoSpeak = localStorage.getItem('tv_voice_speak_ai') !== 'false'; // default true
    const autoPlayPolicy = (rawPolicy as 'never' | 'auto' | 'always') ||
      (legacyAutoSpeak ? 'auto' : 'never');

    return {
      voiceModeEnabled: localStorage.getItem('tv_voice_enabled') === 'true',
      autoSpeakLunarAI: autoPlayPolicy !== 'never',  // backward compat
      autoPlayPolicy,
      autoSpeakNotifications: localStorage.getItem('tv_voice_speak_notifs') !== 'false', // default true
      selectedVoice: localStorage.getItem('tv_voice_speaker') || 'kabir',
      pace: parseFloat(localStorage.getItem('tv_voice_pace') || '1.0'),
      languageCode: localStorage.getItem('tv_voice_lang') || 'en-IN',
    };
  } catch {
    return {
      voiceModeEnabled: false,
      autoSpeakLunarAI: true,
      autoPlayPolicy: 'auto' as const,
      autoSpeakNotifications: true,
      selectedVoice: 'kabir',
      pace: 1.0,
      languageCode: 'en-IN',
    };
  }
}

const prefs = loadPreferences();

export const useVoiceStore = create<VoiceState>((set, get) => ({
  voiceModeEnabled: prefs.voiceModeEnabled,
  autoSpeakLunarAI: prefs.autoSpeakLunarAI,
  autoPlayPolicy: prefs.autoPlayPolicy,
  autoSpeakNotifications: prefs.autoSpeakNotifications,
  isListening: false,
  isSpeaking: false,
  isProcessing: false,
  selectedVoice: prefs.selectedVoice,
  availableVoices: DEFAULT_SARVAM_VOICES,
  voicesLoaded: false,
  pace: prefs.pace,
  languageCode: prefs.languageCode,
  interimTranscript: '',
  error: null,

  toggleVoiceMode: () => {
    const next = !get().voiceModeEnabled;
    set({ voiceModeEnabled: next, error: null });
    try { localStorage.setItem('tv_voice_enabled', String(next)); } catch { /* */ }
  },

  setVoiceMode: (enabled) => {
    set({ voiceModeEnabled: enabled, error: null });
    try { localStorage.setItem('tv_voice_enabled', String(enabled)); } catch { /* */ }
  },

  setAutoSpeakLunarAI: (enabled) => {
    // Legacy setter — also updates autoPlayPolicy for consistency
    const policy = enabled ? 'auto' : 'never';
    set({ autoSpeakLunarAI: enabled, autoPlayPolicy: policy });
    try {
      localStorage.setItem('tv_voice_speak_ai', String(enabled));
      localStorage.setItem('tv_voice_auto_play_policy', policy);
    } catch { /* */ }
  },

  setAutoPlayPolicy: (policy) => {
    set({ autoPlayPolicy: policy, autoSpeakLunarAI: policy !== 'never' });
    try {
      localStorage.setItem('tv_voice_auto_play_policy', policy);
      localStorage.setItem('tv_voice_speak_ai', String(policy !== 'never'));
    } catch { /* */ }
  },

  setAutoSpeakNotifications: (enabled) => {
    set({ autoSpeakNotifications: enabled });
    try { localStorage.setItem('tv_voice_speak_notifs', String(enabled)); } catch { /* */ }
  },

  setListening: (listening) => set({ isListening: listening }),
  setSpeaking: (speaking) => set({ isSpeaking: speaking }),
  setProcessing: (processing) => set({ isProcessing: processing }),

  setSelectedVoice: (voiceId) => {
    set({ selectedVoice: voiceId });
    try { localStorage.setItem('tv_voice_speaker', voiceId); } catch { /* */ }
  },

  setPace: (pace) => {
    const clamped = Math.max(0.5, Math.min(2.0, pace));
    set({ pace: clamped });
    try { localStorage.setItem('tv_voice_pace', String(clamped)); } catch { /* */ }
  },

  setLanguageCode: (code) => {
    set({ languageCode: code });
    try { localStorage.setItem('tv_voice_lang', code); } catch { /* */ }
  },

  setInterimTranscript: (text) => set({ interimTranscript: text }),
  setError: (error) => set({ error }),
  setAvailableVoices: (voices) => set({ availableVoices: voices, voicesLoaded: true }),

  loadVoices: async () => {
    if (get().voicesLoaded) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/voice/voices', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.voices) && data.voices.length > 0) {
          set({ availableVoices: data.voices, voicesLoaded: true });
          return;
        }
      }
    } catch {
      // Fallback
    }
    set({ availableVoices: DEFAULT_SARVAM_VOICES, voicesLoaded: true });
  },

  speak: async (text: string) => {
    if (!text || text.trim().length < 2) return;
    const { selectedVoice, languageCode, pace } = get();

    set({ isProcessing: true, error: null });

    await voiceAudioPlayer.speakText({
      text,
      speaker: selectedVoice,
      languageCode,
      pace,
      onStart: () => {
        set({ isProcessing: false, isSpeaking: true });
      },
      onEnd: () => {
        set({ isSpeaking: false, isProcessing: false });
      },
      onError: (err) => {
        set({ error: err.message || 'Voice playback failed', isSpeaking: false, isProcessing: false });
      },
    });
  },

  speakNotification: async (title: string, description?: string) => {
    const { voiceModeEnabled, autoSpeakNotifications } = get();
    if (!voiceModeEnabled || !autoSpeakNotifications) return;

    const fullSpeech = description ? `${title}. ${description}` : title;
    await get().speak(fullSpeech);
  },

  stopSpeaking: () => {
    voiceAudioPlayer.stop();
    set({ isSpeaking: false, isProcessing: false });
  },
}));
