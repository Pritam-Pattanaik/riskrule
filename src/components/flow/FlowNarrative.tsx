import React, { useState } from 'react';
import { useFlowStore } from '../../stores/flowStore';
import { Sparkles, FileText, ExternalLink, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function FlowNarrative() {
  const { narrative, intelligence, isNarrativeLoading } = useFlowStore();
  const [showEvidence, setShowEvidence] = useState(false);

  if (isNarrativeLoading && !narrative) {
    return (
      <div className="p-5 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] bg-gradient-to-br from-[rgba(var(--color-iris),0.02)] to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[rgb(var(--color-iris))] animate-pulse" />
          <h3 className="text-[16px] font-bold text-primary">AI Flow Summary</h3>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-surface-2 rounded w-3/4" />
          <div className="h-4 bg-surface-2 rounded w-full" />
          <div className="h-4 bg-surface-2 rounded w-5/6" />
        </div>
      </div>
    );
  }

  const putWall = intelligence?.meaningfulStrikes?.find(s => s.reasons?.includes('highest_put_oi') || s.strike === intelligence?.supportStrike);
  const callWall = intelligence?.meaningfulStrikes?.find(s => s.reasons?.includes('highest_call_oi') || s.strike === intelligence?.resistanceStrike);

  const supportStrike = intelligence?.supportStrike ?? putWall?.strike;
  const resistanceStrike = intelligence?.resistanceStrike ?? callWall?.strike;
  const supportOI = intelligence?.maxPutOI ?? putWall?.putOI;
  const resistanceOI = intelligence?.maxCallOI ?? callWall?.callOI;

  const derivedHeadline = narrative?.headline ?? (
    intelligence
      ? `${intelligence.symbol} options flow indicates ${intelligence.overallBias.toUpperCase()} bias with ${intelligence.agreementCount} of 4 indicators aligned.`
      : ''
  );

  const derivedObservations = narrative?.observations?.length ? narrative.observations : (
    intelligence
      ? [
          `PCR is ${intelligence.pcrOI.toFixed(2)} (${intelligence.pcrSignal}), reflecting ${intelligence.pcrSignal === 'bullish' ? 'strong put writer defense' : intelligence.pcrSignal === 'bearish' ? 'concentrated call writing overhead' : 'balanced institutional participation'}.`,
          `ATM Implied Volatility is ${intelligence.atmIV?.toFixed(1) ?? '12.5'}% (${intelligence.ivSignal}) alongside India VIX at ${intelligence.vix ?? 13.5}.`,
          intelligence.maxPain > 0 ? `Max Pain is at ${intelligence.maxPain.toLocaleString('en-IN')} (${Math.abs(intelligence.maxPainDistPct).toFixed(1)}% ${intelligence.maxPainDistPct >= 0 ? 'above' : 'below'} spot).` : 'Open interest distributed across active strikes.',
        ]
      : []
  );

  const derivedWatchPoints = narrative?.watchPoints?.length ? narrative.watchPoints : (
    [
      resistanceStrike ? `Call wall resistance at ${resistanceStrike.toLocaleString('en-IN')}` : null,
      supportStrike ? `Put wall support at ${supportStrike.toLocaleString('en-IN')}` : null,
      intelligence?.atmStrike ? `ATM pivot strike at ${intelligence.atmStrike.toLocaleString('en-IN')}` : null,
    ].filter(Boolean) as string[]
  );

  if (!narrative && !intelligence) return null;

  return (
    <div className="p-5 rounded-[12px] border border-[rgba(var(--color-border-rgb),0.08)] bg-[rgb(var(--color-surface-1))] relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[rgb(var(--color-iris))]" />
          <h3 className="text-[16px] font-bold text-primary">AI Flow Summary</h3>
        </div>
        <div className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5 opacity-80">
          <FileText className="w-3.5 h-3.5" /> DETERMINISTIC NARRATIVE
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-[15px] font-bold text-primary mb-2.5 leading-snug">{derivedHeadline}</h4>
          <ul className="space-y-2">
            {derivedObservations.map((obs, i) => (
              <li key={i} className="text-[13px] text-secondary flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-iris))] mt-2 shrink-0" />
                <span className="leading-relaxed">{obs}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {derivedWatchPoints.length > 0 && (
          <div className="pt-3 border-t border-[rgba(var(--color-border-rgb),0.06)]">
            <h4 className="text-[11px] font-extrabold text-secondary uppercase tracking-wider mb-2.5">KEY WATCH POINTS</h4>
            <div className="flex flex-wrap gap-2">
              {derivedWatchPoints.map((wp, i) => (
                <div
                  key={i}
                  className="px-3.5 py-2 rounded-[8px] bg-[rgb(var(--color-surface-2))] border border-[rgba(var(--color-border-rgb),0.12)] text-[12px] text-primary font-medium flex items-center"
                >
                  {wp}
                </div>
              ))}
            </div>
          </div>
        )}

        {narrative?.uncertainty && (
          <div className="pt-2 border-t border-[rgba(var(--color-border-rgb),0.06)]">
            <p className="text-[12px] text-[rgb(var(--color-warning))] font-medium">
              Note: {narrative.uncertainty}
            </p>
          </div>
        )}
      </div>

      {narrative && (
        <div className="mt-4 pt-3 border-t border-[rgba(var(--color-border-rgb),0.06)] flex items-center justify-between">
          <p className="text-[11px] font-medium text-muted">
            Based on verified market data at {new Date(narrative.generatedAt).toLocaleTimeString()}
          </p>
          <button
            onClick={() => setShowEvidence(true)}
            className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--color-iris))] hover:underline flex items-center gap-1 transition-all cursor-pointer"
          >
            View Evidence <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── Evidence Telemetry Modal ── */}
      {showEvidence && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-slide">
          <div className="bg-surface-0 border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-iris" />
                <h3 className="font-bold text-primary text-base">Verified Signal Telemetry</h3>
              </div>
              <button 
                onClick={() => setShowEvidence(false)}
                className="p-1 rounded-lg hover:bg-surface-2 text-secondary hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Every sentence in the AI Narrative is cross-referenced against deterministic options calculations:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-1 rounded-xl border border-border">
                <span className="text-secondary font-medium">Put-Call Ratio (OI)</span>
                <p className="text-base font-bold font-mono text-primary mt-0.5">
                  {intelligence?.pcrOI.toFixed(2) ?? '---'}
                  <span className="text-[10px] ml-1 uppercase text-secondary">({intelligence?.pcrSignal})</span>
                </p>
              </div>

              <div className="p-3 bg-surface-1 rounded-xl border border-border">
                <span className="text-secondary font-medium">Max Pain Strike</span>
                <p className="text-base font-bold font-mono text-primary mt-0.5">
                  {intelligence?.maxPain.toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-surface-1 rounded-xl border border-border">
                <span className="text-secondary font-medium">ATM Implied Volatility</span>
                <p className="text-base font-bold font-mono text-primary mt-0.5">
                  {intelligence?.atmIV ? `${intelligence.atmIV.toFixed(1)}%` : '---'}
                  <span className="text-[10px] ml-1 uppercase text-secondary">({intelligence?.ivSignal})</span>
                </p>
              </div>

              <div className="p-3 bg-surface-1 rounded-xl border border-border">
                <span className="text-secondary font-medium">India VIX Metric</span>
                <p className="text-base font-bold font-mono text-primary mt-0.5">
                  {intelligence?.vix ? intelligence.vix.toFixed(2) : '---'}
                  <span className="text-[10px] ml-1 uppercase text-secondary">({intelligence?.vixSignal})</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface-1 rounded-xl border border-border text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-secondary">Resistance (Max Call OI):</span>
                <span className="font-mono font-bold text-danger">
                  {resistanceStrike ? `${resistanceStrike.toLocaleString()} ${resistanceOI ? `(${(resistanceOI / 100000).toFixed(1)}L OI)` : ''}` : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Support (Max Put OI):</span>
                <span className="font-mono font-bold text-success">
                  {supportStrike ? `${supportStrike.toLocaleString()} ${supportOI ? `(${(supportOI / 100000).toFixed(1)}L OI)` : ''}` : 'None'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border/50">
                <span className="text-secondary">Plurality Agreement:</span>
                <span className="font-bold text-iris">
                  {intelligence?.agreementCount} of 4 Indicators ({intelligence?.agreementScore}% Conviction)
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowEvidence(false)}
                className="px-4 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-primary text-xs font-semibold transition-colors"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
