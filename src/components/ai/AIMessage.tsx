import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Brain, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown,
  ChevronDown, ChevronUp, Zap, Maximize2, Minimize2
} from 'lucide-react';
import { DisciplineCard } from './DisciplineCard';
import { MessageTimestamp } from './MessageTimestamp';
import { cn } from '../../lib/cn';
import { api } from '../../lib/api';

// Approximate word count for truncation threshold
const EXPAND_THRESHOLD = 120;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface Props {
  messageId?: string;
  content: string;
  disciplineData?: any;
  detectedMode?: string;
  createdAt?: string;
  isLatest?: boolean;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onMakeShorter?: () => void;
  onExplainMore?: () => void;
}

const MODE_BADGE: Record<string, { label: string; color: string }> = {
  psychology:  { label: 'Psychology',   color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  risk:        { label: 'Risk',          color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  strategy:    { label: 'Strategy',     color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  performance: { label: 'Performance',  color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  premarket:   { label: 'Pre-Market',   color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  postmarket:  { label: 'Post-Market',  color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  journal:     { label: 'Journal',      color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
  general:     { label: 'General',      color: 'text-accent bg-accent/10 border-accent/20' },
};

export function AIMessage({
  messageId,
  content,
  disciplineData,
  detectedMode,
  createdAt,
  isLatest,
  isStreaming,
  onRegenerate,
  onMakeShorter,
  onExplainMore,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [expanded, setExpanded] = useState(false);

  const wordCount = countWords(content);
  const isLong = wordCount > EXPAND_THRESHOLD;
  const shouldTruncate = isLong && !expanded && !isStreaming;

  const displayContent = shouldTruncate
    ? content.split(/\s+/).slice(0, EXPAND_THRESHOLD).join(' ') + '…'
    : content;

  const modeBadge = detectedMode ? MODE_BADGE[detectedMode] : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = async (type: 'up' | 'down') => {
    if (feedback === type) return;
    setFeedback(type);
    try { await api.post('/ai/feedback', { messageId, feedback: type }); } catch { /* non-critical */ }
  };

  return (
    <div className="group flex flex-col items-start w-full">
      {/* Header row */}
      <div className="flex items-center gap-2 mb-2 ml-0.5">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/25 flex items-center justify-center shrink-0">
          <Brain className={cn("w-3.5 h-3.5 text-accent", isStreaming && "animate-pulse")} />
        </div>
        <span className="text-[11px] font-semibold text-tertiary">AI Coach</span>
        {modeBadge && !isStreaming && (
          <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border", modeBadge.color)}>
            {modeBadge.label}
          </span>
        )}
        {createdAt && !isStreaming && <MessageTimestamp timestamp={createdAt} className="ml-0.5" />}
      </div>

      {/* Message card */}
      <div className={cn(
        "w-full rounded-xl border transition-all duration-200",
        isStreaming
          ? "bg-surface-0 border-accent/30 border-l-2 shadow-[0_0_20px_rgba(16,185,129,0.06)]"
          : "bg-surface-0 border-border shadow-sm hover:shadow-md hover:border-border/80"
      )}>
        {/* Markdown content */}
        <div className="px-4 md:px-5 pt-4 pb-3">
          <div className={cn(
            "prose prose-sm max-w-none dark:prose-invert text-[13.5px] leading-[1.75]",
            "[&>p]:text-secondary [&>p]:mt-0 [&>p+p]:mt-3 [&>p]:leading-[1.75]",
            "[&>ul]:mt-2 [&>ul]:space-y-1.5 [&>ul]:pl-0",
            "[&>ul>li]:text-secondary [&>ul>li]:leading-relaxed [&>ul>li]:list-none [&>ul>li]:pl-0",
            "[&>ul>li]:before:content-['•'] [&>ul>li]:before:text-accent [&>ul>li]:before:font-bold [&>ul>li]:before:mr-2",
            "[&_strong]:text-primary [&_strong]:font-semibold",
            "[&>h1]:text-primary [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-2",
            "[&>h2]:text-primary [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1.5",
            "[&>h3]:text-secondary [&>h3]:text-xs [&>h3]:font-semibold [&>h3]:uppercase [&>h3]:tracking-wider [&>h3]:mb-1",
            "[&>blockquote]:border-l-2 [&>blockquote]:border-accent/50 [&>blockquote]:pl-3 [&>blockquote]:text-secondary [&>blockquote]:not-italic",
            "[&>code]:bg-surface-2 [&>code]:text-accent [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-[12px] [&>code]:font-mono",
            "[&>pre]:bg-surface-2 [&>pre]:rounded-lg [&>pre]:p-3 [&>pre]:overflow-x-auto",
            "[&>table]:text-xs [&>table]:w-full",
            "[&>table>thead>tr>th]:text-tertiary [&>table>thead>tr>th]:font-semibold [&>table>thead>tr>th]:pb-1 [&>table>thead>tr>th]:border-b [&>table>thead>tr>th]:border-border [&>table>thead>tr>th]:text-left",
            "[&>table>tbody>tr>td]:py-1.5 [&>table>tbody>tr>td]:border-b [&>table>tbody>tr>td]:border-border/50 [&>table>tbody>tr>td]:text-secondary",
            "[&>hr]:border-border/50 [&>hr]:my-3"
          )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayContent}
            </ReactMarkdown>
          </div>

          {/* Expand/Collapse toggle */}
          {isLong && !isStreaming && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="w-3 h-3" />Show less</>
              ) : (
                <><ChevronDown className="w-3 h-3" />{wordCount - EXPAND_THRESHOLD}+ more words — Show full response</>
              )}
            </button>
          )}
        </div>

        {/* Discipline card if applicable */}
        {disciplineData && <div className="px-4 md:px-5 pb-3"><DisciplineCard data={disciplineData} /></div>}

        {/* Action bar */}
        {!isStreaming && (
          <div className={cn(
            "flex flex-wrap items-center gap-1 px-3 py-2 border-t border-border/50 bg-surface-1/30 rounded-b-xl",
            "transition-opacity duration-200",
            isLatest ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            {/* Left: Content actions */}
            <div className="flex items-center gap-0.5 flex-1 min-w-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-tertiary hover:text-primary hover:bg-surface-2 transition-colors shrink-0"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {onMakeShorter && (
                <button
                  onClick={onMakeShorter}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-tertiary hover:text-amber-400 hover:bg-amber-400/5 transition-colors shrink-0"
                  title="Get a shorter version"
                >
                  <Minimize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Shorter</span>
                </button>
              )}

              {onExplainMore && (
                <button
                  onClick={onExplainMore}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-tertiary hover:text-blue-400 hover:bg-blue-400/5 transition-colors shrink-0"
                  title="Get a detailed explanation"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Explain more</span>
                </button>
              )}

              {isLatest && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-tertiary hover:text-accent hover:bg-accent/5 transition-colors shrink-0"
                  title="Regenerate response"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">Retry</span>
                </button>
              )}
            </div>

            {/* Right: Feedback */}
            <div className="flex items-center gap-0.5 shrink-0 border-l border-border/50 pl-1 ml-1">
              <button
                onClick={() => handleFeedback('up')}
                className={cn("p-1.5 rounded-md transition-colors", feedback === 'up' ? "text-success bg-success/10" : "text-tertiary hover:text-success hover:bg-success/5")}
                title="Helpful"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                className={cn("p-1.5 rounded-md transition-colors", feedback === 'down' ? "text-loss bg-loss/10" : "text-tertiary hover:text-loss hover:bg-loss/5")}
                title="Not helpful"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
