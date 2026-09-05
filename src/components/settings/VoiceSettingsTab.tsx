import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Sparkles, Play, Square, Check, RefreshCw,
  Sliders, Globe, Radio, Bell, Bot, Mic, ShieldAlert, Cpu, Zap, Moon, Activity
} from 'lucide-react';
import { useVoiceStore, VoiceInfo, TARGET_LANGUAGES } from '../../stores/voiceStore';
import { VoiceOrb } from '../ai/VoiceOrb';
import { cn } from '../../lib/cn';
import { notify } from '../../lib/notify';

export function VoiceSettingsTab() {
  const {
    voiceModeEnabled,
    setVoiceMode,
    autoSpeakLunarAI,
    setAutoSpeakLunarAI,
    autoPlayPolicy,
    setAutoPlayPolicy,
    autoSpeakNotifications,
    setAutoSpeakNotifications,
    selectedVoice,
    setSelectedVoice,
    availableVoices,
    loadVoices,
    pace,
    setPace,
    languageCode,
    setLanguageCode,
    isSpeaking,
    isProcessing,
    speak,
    stopSpeaking,
  } = useVoiceStore();

  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null);
  const [customTestText, setCustomTestText] = useState('RiskRule Voice AI is online. All trading risk parameters are within safe limits.');

  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  const filteredVoices = availableVoices.filter(v => {
    if (genderFilter === 'all') return true;
    return v.gender === genderFilter;
  });

  const getSamplePreviewText = (voiceName: string, lang: string) => {
    switch (lang) {
      case 'hi-IN':
        return `नमस्ते, मैं हूँ ${voiceName}। RiskRule में आपका स्वागत है।`;
      case 'od-IN':
        return `ନମସ୍କାର, ମୁଁ ${voiceName}। RiskRule କୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।`;
      case 'ta-IN':
        return `வணக்கம், நான் ${voiceName}. RiskRule உங்களை வரவேற்கிறது.`;
      case 'te-IN':
        return `నమస్కారం, నేను ${voiceName}. RiskRule కు స్వాగతం.`;
      case 'bn-IN':
        return `নমস্কার, আমি ${voiceName}। RiskRule এ আপনাকে স্বাগতম।`;
      case 'mr-IN':
        return `नमस्कार, मी ${voiceName} आहे. RiskRule मध्ये आपले स्वागत आहे.`;
      case 'gu-IN':
        return `નમસ્તે, હું ${voiceName} છું. RiskRule માં આપનું સ્વાગત છે.`;
      case 'kn-IN':
        return `ನಮಸ್ಕಾರ, ನಾನು ${voiceName}. RiskRule ಗೆ ಸುಸ್ವಾಗತ.`;
      case 'ml-IN':
        return `നമസ്കാരം, ഞാൻ ${voiceName}. RiskRule ലേക്ക് സ്വാഗതം.`;
      case 'pa-IN':
        return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ${voiceName} ਹਾਂ। RiskRule ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ।`;
      default:
        return `Hello, I am ${voiceName}. Your RiskRule AI voice assistant.`;
    }
  };

  const handlePreviewVoice = async (voice: VoiceInfo, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isSpeaking && testingVoiceId === voice.id) {
      stopSpeaking();
      setTestingVoiceId(null);
      return;
    }

    setTestingVoiceId(voice.id);
    setSelectedVoice(voice.id);

    try {
      const sampleText = getSamplePreviewText(voice.name, languageCode);
      await speak(sampleText);
    } catch (err: any) {
      notify.error(err.message || 'Voice test failed');
    } finally {
      setTestingVoiceId(null);
    }
  };

  const handleTestCustom = async () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    if (!customTestText.trim()) return;
    try {
      await speak(customTestText);
    } catch (err: any) {
      notify.error(err.message || 'Speech test failed');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ─── SECTION 1: MASTER VOICE ENGINE TOGGLE ─────────────────────── */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-surface-1/90 via-surface-0 to-surface-1/40 p-6 md:p-8 shadow-sm backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-iris/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 shrink-0",
              voiceModeEnabled
                ? "bg-accent/15 border-accent/40 text-accent shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                : "bg-surface-2 border-border text-tertiary"
            )}>
              {voiceModeEnabled ? <Volume2 size={28} className="animate-pulse" /> : <VolumeX size={28} />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-primary">Master Voice & Audio Engine</h2>
                {voiceModeEnabled && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent border border-accent/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-sm text-tertiary mt-1 max-w-xl">
                Global speech synthesizer powered by Sarvam AI. Enables JARVIS-like voice narration for Lunar AI coach and real-time market notifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            {voiceModeEnabled && <VoiceOrb className="mr-2" />}
            <button
              onClick={() => {
                const next = !voiceModeEnabled;
                setVoiceMode(next);
                if (!next) stopSpeaking();
                notify.success(next ? 'Voice AI Engine activated globally' : 'Voice AI Engine disabled');
              }}
              className={cn(
                "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                voiceModeEnabled ? "bg-accent" : "bg-surface-3"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  voiceModeEnabled ? "translate-x-6" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* ── Sub-Toggles ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/60">
          {/* LUNAR AI Narration Policy */}
          <div className={cn(
            "p-4 rounded-2xl border transition-all",
            voiceModeEnabled ? "bg-surface-0 border-accent/30" : "bg-surface-1/50 border-border opacity-70"
          )}>
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mt-0.5">
                <Bot size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-primary">LUNAR AI Narration</div>
                <div className="text-xs text-tertiary mt-0.5">Control when AI trading advice is spoken aloud.</div>
              </div>
            </div>

            <div className="space-y-2 pl-1">
              {(
                [
                  { value: 'never',  label: 'Off',         desc: 'Manual only — use the Speak button per message', Icon: Moon },
                  { value: 'auto',   label: 'Auto',        desc: 'Auto-speak when AI finishes generating',          Icon: Zap },
                  { value: 'always', label: 'Instant',     desc: 'Speak immediately as AI streams each chunk',      Icon: Activity },
                ] as const
              ).map(({ value, label, desc, Icon }) => (
                <button
                  key={value}
                  disabled={!voiceModeEnabled}
                  onClick={() => {
                    setAutoPlayPolicy(value);
                    notify.success(`Narration: ${label}`);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all",
                    autoPlayPolicy === value
                      ? "bg-accent/10 border-accent/40 text-primary"
                      : "bg-surface-1/30 border-border/50 text-tertiary hover:text-secondary hover:bg-surface-1",
                    !voiceModeEnabled && "cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    autoPlayPolicy === value ? "border-accent bg-accent" : "border-border"
                  )}>
                    {autoPlayPolicy === value && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <Icon size={14} className={autoPlayPolicy === value ? "text-accent" : "text-tertiary"} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold">{label}</span>
                    <span className="text-[10px] text-tertiary ml-2">{desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {autoPlayPolicy !== 'never' && (
              <p className="mt-2.5 text-[10px] text-tertiary/70 pl-1">
                💡 Code-mixed messages (e.g. Hindi with NIFTY tickers) are flagged for quality review.
              </p>
            )}
          </div>


          {/* Notifications Voice */}
          <div className={cn(
            "p-4 rounded-2xl border transition-all flex items-start justify-between gap-4",
            autoSpeakNotifications && voiceModeEnabled ? "bg-surface-0 border-accent/30" : "bg-surface-1/50 border-border opacity-70"
          )}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
                <Bell size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-primary">Voice-Read Notifications & Alerts</div>
                <div className="text-xs text-tertiary mt-0.5">Real-time alerts, risk limits, and broker syncs are spoken instantly.</div>
              </div>
            </div>
            <input
              type="checkbox"
              disabled={!voiceModeEnabled}
              checked={autoSpeakNotifications}
              onChange={(e) => {
                setAutoSpeakNotifications(e.target.checked);
                notify.success(e.target.checked ? 'Voice notifications enabled' : 'Voice notifications muted');
              }}
              className="mt-1 h-5 w-5 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: AUDIO ENGINE CONTROLS ──────────────────────────── */}
      <div className="rounded-3xl border border-border bg-surface-0 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Sliders size={18} className="text-iris" />
          <h3 className="font-display text-lg font-bold text-primary">Acoustic & Speech Controls</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Speed slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Speech Speed (Pace)</label>
              <span className="px-2.5 py-0.5 rounded-lg bg-surface-2 border border-border text-xs font-mono font-bold text-accent">
                {pace.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.75"
              step="0.05"
              value={pace}
              onChange={(e) => setPace(parseFloat(e.target.value))}
              className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex items-center gap-2 pt-1">
              {[0.8, 1.0, 1.15, 1.3].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPace(speed)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors",
                    Math.abs(pace - speed) < 0.03
                      ? "bg-accent/15 border-accent text-accent"
                      : "bg-surface-1 border-border text-tertiary hover:text-primary hover:bg-surface-2"
                  )}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Language / Accent selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Narration Language</label>
              <span className="text-[10px] text-tertiary font-mono">{TARGET_LANGUAGES.find(l => l.code === languageCode)?.script || 'Latin'} Script</span>
            </div>
            <div className="relative">
              <select
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                className="w-full bg-surface-1 border border-border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-primary focus:border-accent focus:outline-none appearance-none cursor-pointer pr-10"
              >
                {TARGET_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-surface-0 text-primary">
                    {lang.label} ({lang.nativeLabel}) — {lang.code}
                  </option>
                ))}
              </select>
              <Globe className="w-4 h-4 text-tertiary absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['en-IN', 'hi-IN', 'od-IN', 'ta-IN', 'te-IN'].map((code) => {
                const lang = TARGET_LANGUAGES.find(l => l.code === code);
                if (!lang) return null;
                const isSelected = languageCode === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLanguageCode(code)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                      isSelected
                        ? "bg-accent/15 border-accent text-accent font-semibold"
                        : "bg-surface-1 border-border text-tertiary hover:text-secondary hover:bg-surface-2"
                    )}
                  >
                    {lang.nativeLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: VOICE GALLERY & SELECTION ───────────────────────── */}
      <div className="rounded-3xl border border-border bg-surface-0 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <h3 className="font-display text-lg font-bold text-primary">Voice Persona Gallery</h3>
            </div>
            <p className="text-xs text-tertiary mt-0.5">
              Select your preferred voice persona. Changes apply instantly across the entire platform.
            </p>
          </div>

          {/* Gender Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-surface-1 border border-border rounded-xl self-start sm:self-auto">
            {(['all', 'male', 'female'] as const).map(g => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all",
                  genderFilter === g
                    ? "bg-surface-0 text-primary shadow-sm border border-border"
                    : "text-tertiary hover:text-secondary"
                )}
              >
                {g} ({availableVoices.filter(v => g === 'all' || v.gender === g).length})
              </button>
            ))}
          </div>
        </div>

        {/* Voice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredVoices.map(voice => {
            const isSelected = voice.id === selectedVoice;
            const isPreviewing = testingVoiceId === voice.id && isSpeaking;

            return (
              <div
                key={voice.id}
                onClick={() => {
                  setSelectedVoice(voice.id);
                  notify.success(`Selected voice persona: ${voice.name}`);
                }}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between gap-3",
                  isSelected
                    ? "bg-accent/5 border-accent/50 shadow-[0_0_16px_rgba(16,185,129,0.1)] ring-1 ring-accent/30"
                    : "bg-surface-1/40 border-border hover:bg-surface-1 hover:border-border/80"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border shrink-0 transition-colors",
                      isSelected
                        ? "bg-accent text-white border-accent shadow-sm"
                        : "bg-surface-2 text-secondary border-border group-hover:border-border/80"
                    )}>
                      {voice.name[0]}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-primary">{voice.name}</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border",
                          voice.gender === 'male'
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-pink-500/10 text-pink-400 border-pink-500/20"
                        )}>
                          {voice.gender}
                        </span>
                      </div>
                      <p className="text-xs text-tertiary mt-0.5 line-clamp-1">{voice.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                  <button
                    onClick={(e) => handlePreviewVoice(voice, e)}
                    disabled={isProcessing}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                      isPreviewing
                        ? "bg-accent text-white border-accent"
                        : "bg-surface-2 border-border text-secondary hover:text-primary hover:bg-surface-3"
                    )}
                  >
                    {isPreviewing ? <Square size={12} className="fill-current" /> : <Play size={12} className="fill-current" />}
                    <span>{isPreviewing ? 'Stop' : 'Listen'}</span>
                  </button>

                  <span className="text-[10px] font-mono text-tertiary">
                    {isSelected ? 'Active Default' : 'Click to Set'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 4: LIVE AUDIO TEST CONSOLE ────────────────────────── */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-surface-1/60 to-surface-0 p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Cpu size={18} className="text-accent" />
          <h3 className="font-display text-lg font-bold text-primary">Live Voice Synthesizer Tester</h3>
        </div>

        <p className="text-xs text-tertiary">
          Type any custom trading note, risk alert, or question below to hear how your selected voice persona sounds in real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <input
            type="text"
            value={customTestText}
            onChange={(e) => setCustomTestText(e.target.value)}
            placeholder="Type a test phrase..."
            className="flex-1 px-4 py-3 rounded-2xl bg-surface-0 border border-border text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-accent"
          />

          <button
            onClick={handleTestCustom}
            disabled={isProcessing || !customTestText.trim()}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shrink-0 transition-all shadow-sm",
              isSpeaking
                ? "bg-loss text-white hover:bg-loss/90 shadow-loss/20"
                : "bg-accent text-white hover:bg-accent/90 shadow-accent/20"
            )}
          >
            {isProcessing ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : isSpeaking ? (
              <Square size={16} className="fill-current" />
            ) : (
              <Play size={16} className="fill-current" />
            )}
            <span>{isProcessing ? 'Synthesizing...' : isSpeaking ? 'Stop Audio' : 'Speak Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
