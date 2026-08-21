import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface DisciplineEvaluationData {
  overallScore: number;
  confidence?: number;
  breakdown?: {
    planAdherence?: number;
    riskManagement?: number;
    emotionalControl?: number;
    executionQuality?: number;
  };
  strengths?: string[];
  mistakes?: string[];
  rulesViolated?: string[];
  actionableAdvice?: string;
}

interface DisciplineCardProps {
  data: DisciplineEvaluationData;
  className?: string;
}

export const DisciplineCard: React.FC<DisciplineCardProps> = ({ data, className }) => {
  const {
    overallScore = 3,
    confidence = 0.9,
    breakdown = {},
    strengths = [],
    mistakes = [],
    rulesViolated = [],
    actionableAdvice = '',
  } = data;

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 3.5) return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
    if (score >= 2.5) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Elite Discipline';
    if (score >= 3.5) return 'Solid Execution';
    if (score >= 2.5) return 'Inconsistent';
    return 'Severe Flaws Detected';
  };

  return (
    <div className={cn(
      "mt-4 rounded-xl border border-border/80 bg-surface-1/90 backdrop-blur-md p-4 shadow-lg text-sm",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <span className="font-semibold text-primary">Trade Discipline Evaluation</span>
        </div>
        <div className={cn("px-2.5 py-1 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5", getScoreColor(overallScore))}>
          <span>{overallScore}/5</span>
          <span className="text-[10px] opacity-80 uppercase">({getScoreLabel(overallScore)})</span>
        </div>
      </div>

      {/* Breakdown Grid */}
      {breakdown && Object.keys(breakdown).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {breakdown.planAdherence !== undefined && (
            <div className="bg-surface-0/60 rounded-lg p-2 border border-border/40 text-center">
              <div className="text-[10px] text-tertiary uppercase font-medium">Plan</div>
              <div className="font-mono font-bold text-primary text-xs mt-0.5">{breakdown.planAdherence}/5</div>
            </div>
          )}
          {breakdown.riskManagement !== undefined && (
            <div className="bg-surface-0/60 rounded-lg p-2 border border-border/40 text-center">
              <div className="text-[10px] text-tertiary uppercase font-medium">Risk</div>
              <div className="font-mono font-bold text-primary text-xs mt-0.5">{breakdown.riskManagement}/5</div>
            </div>
          )}
          {breakdown.emotionalControl !== undefined && (
            <div className="bg-surface-0/60 rounded-lg p-2 border border-border/40 text-center">
              <div className="text-[10px] text-tertiary uppercase font-medium">Emotion</div>
              <div className="font-mono font-bold text-primary text-xs mt-0.5">{breakdown.emotionalControl}/5</div>
            </div>
          )}
          {breakdown.executionQuality !== undefined && (
            <div className="bg-surface-0/60 rounded-lg p-2 border border-border/40 text-center">
              <div className="text-[10px] text-tertiary uppercase font-medium">Execution</div>
              <div className="font-mono font-bold text-primary text-xs mt-0.5">{breakdown.executionQuality}/5</div>
            </div>
          )}
        </div>
      )}

      {/* Strengths & Mistakes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {strengths.length > 0 && (
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
            </div>
            <ul className="text-xs text-secondary space-y-0.5 pl-1">
              {strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(mistakes.length > 0 || rulesViolated.length > 0) && (
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Identified Flaws
            </div>
            <ul className="text-xs text-secondary space-y-0.5 pl-1">
              {[...mistakes, ...rulesViolated].map((m, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actionable Advice */}
      {actionableAdvice && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-2.5 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-primary leading-relaxed">
            <span className="font-semibold text-accent">Coach Action Item: </span>
            {actionableAdvice}
          </div>
        </div>
      )}
    </div>
  );
};
