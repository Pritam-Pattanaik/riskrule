import React, { useEffect } from 'react';
import { ChevronDown, Volume2 } from 'lucide-react';
import { useVoiceStore, DEFAULT_SARVAM_VOICES } from '../../stores/voiceStore';
import { cn } from '../../lib/cn';

/**
 * VoiceSettings — Voice picker dropdown for selecting Sarvam AI speaker.
 * Groups voices by gender and shows description for each.
 */
export function VoiceSettings() {
  const {
    selectedVoice,
    setSelectedVoice,
    availableVoices,
    voicesLoaded,
    loadVoices,
    pace,
    setPace,
  } = useVoiceStore();

  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Load voices on first render
  useEffect(() => {
    if (!voicesLoaded) loadVoices();
  }, [voicesLoaded, loadVoices]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Hardcoded fallback if API hasn't loaded
  const voices = availableVoices.length > 0 ? availableVoices : DEFAULT_SARVAM_VOICES;

  const maleVoices = voices.filter(v => v.gender === 'male');
  const femaleVoices = voices.filter(v => v.gender === 'female');
  const selected = voices.find(v => v.id === selectedVoice) || voices[0];

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-all",
          "bg-surface-1/80 border-border text-tertiary hover:text-primary hover:bg-surface-1"
        )}
        title="Voice settings"
      >
        <Volume2 className="w-3 h-3" />
        <span className="hidden lg:inline">{selected?.name || 'Voice'}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-surface-0 border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Speed control */}
          <div className="px-3 py-2.5 border-b border-border/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Speed</span>
              <span className="text-[10px] font-mono text-accent">{pace.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={pace}
              onChange={(e) => setPace(parseFloat(e.target.value))}
              className="w-full h-1 bg-surface-2 rounded-full appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Male voices */}
          <div className="px-3 py-2 border-b border-border/50">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Male Voices</span>
          </div>
          <div className="max-h-36 overflow-y-auto p-1">
            {maleVoices.map(v => (
              <button
                key={v.id}
                onClick={() => { setSelectedVoice(v.id); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors",
                  v.id === selectedVoice
                    ? "bg-accent/10 text-primary"
                    : "hover:bg-surface-1 text-secondary"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                  v.id === selectedVoice ? "bg-accent text-white" : "bg-surface-2 text-tertiary"
                )}>
                  {v.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold">{v.name}</div>
                  <div className="text-[10px] text-tertiary truncate">{v.description}</div>
                </div>
                {v.id === selectedVoice && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Female voices */}
          <div className="px-3 py-2 border-b border-border/50 border-t border-border/50">
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Female Voices</span>
          </div>
          <div className="max-h-36 overflow-y-auto p-1">
            {femaleVoices.map(v => (
              <button
                key={v.id}
                onClick={() => { setSelectedVoice(v.id); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors",
                  v.id === selectedVoice
                    ? "bg-accent/10 text-primary"
                    : "hover:bg-surface-1 text-secondary"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                  v.id === selectedVoice ? "bg-accent text-white" : "bg-surface-2 text-tertiary"
                )}>
                  {v.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold">{v.name}</div>
                  <div className="text-[10px] text-tertiary truncate">{v.description}</div>
                </div>
                {v.id === selectedVoice && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
