import React, { useEffect, useRef } from 'react';
import { Activity, Brain, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { useInsightStore } from '../../stores/insightStore';
import { useTradeStore } from '../../stores/tradeStore';
import { useJournalStore } from '../../stores/journalStore';
import { useVoiceStore } from '../../stores/voiceStore';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { useVoiceOutput } from '../../hooks/useVoiceOutput';
import { cn } from '../../lib/cn';
import { AIMessage } from './AIMessage';
import UserMessageBubble from './UserMessageBubble';
import SmartInput from './SmartInput';
import { VoiceOrb } from './VoiceOrb';
import { VoiceSettings } from './VoiceSettings';

interface Props {
  conversationId: string;
  showInsights?: boolean;
  onToggleInsights?: () => void;
}

// Strip DISCIPLINE_JSON and legacy mode tags from content
function parseMessageContent(raw: string): { content: string; disciplineData: any | null } {
  let disciplineData: any = null;
  let content = raw || '';

  // Extract discipline JSON if present
  if (content.includes('<!--DISCIPLINE_JSON-->')) {
    try {
      const match = content.match(/<!--DISCIPLINE_JSON-->([\s\S]*?)<!--\/DISCIPLINE_JSON-->/);
      if (match?.[1]) disciplineData = JSON.parse(match[1].trim());
    } catch { /* ignore malformed */ }
    content = content
      .replace(/<!--DISCIPLINE_JSON-->[\s\S]*?<!--\/DISCIPLINE_JSON-->/g, '')
      .replace(/<!--DISCIPLINE_JSON-->[\s\S]*/g, ''); // catch unclosed tags
  }

  // Strip any remaining internal markers
  content = content
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\[MODE:[\w]+\]\s*/im, '')
    .trim();

  return { content, disciplineData };
}

// Animated streaming dots
function StreamingDots() {
  return (
    <div className="flex items-center gap-2 mb-2 ml-0.5">
      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/25 flex items-center justify-center shrink-0">
        <Brain className="w-3.5 h-3.5 text-accent animate-pulse" />
      </div>
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-0 border border-border shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
      </div>
    </div>
  );
}

export default function AIChatWorkspace({ conversationId, showInsights, onToggleInsights }: Props) {
  const {
    messages,
    streamingMessage,
    isTyping,
    loading,
    conversations,
    sendMessage,
    stopGeneration,
    regenerateResponse,
  } = useInsightStore();

  const { trades } = useTradeStore();
  const { entries } = useJournalStore();
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Voice Integration ─────────────────────────────────────────────
  const { voiceModeEnabled, toggleVoiceMode, isSpeaking } = useVoiceStore();
  const { speak, speakIfEnabled, stop: stopSpeaking } = useVoiceOutput();
  const [speakingMessageId, setSpeakingMessageId] = React.useState<string | null>(null);
  const wasTypingRef = useRef(isTyping);
  const lastSpokenMsgIdRef = useRef<string | null>(null);

  // Reset speakingMessageId when not speaking
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingMessageId(null);
    }
  }, [isSpeaking]);

  // Voice input: transcription → send to chat
  const { toggleRecording, isListening } = useVoiceInput((transcript) => {
    if (transcript.trim()) {
      sendMessage(transcript);
    }
  });

  // Auto-speak completed AI response when generation finishes and voice mode is ON
  useEffect(() => {
    const justFinishedTyping = wasTypingRef.current && !isTyping;
    wasTypingRef.current = isTyping;

    if (justFinishedTyping && voiceModeEnabled && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const msgId = (lastMsg as any)?.id || `msg-${messages.length}`;
      if (lastMsg?.role === 'assistant' && lastSpokenMsgIdRef.current !== msgId) {
        lastSpokenMsgIdRef.current = msgId;
        const { content } = parseMessageContent(lastMsg.content);
        if (content && content.trim().length > 2) {
          setSpeakingMessageId(msgId);
          speakIfEnabled(content);
        }
      }
    }
  }, [isTyping, voiceModeEnabled, messages, speakIfEnabled]);

  // Handle speak button click on individual messages
  const handleSpeak = (messageId: string, text: string) => {
    if (isSpeaking && speakingMessageId === messageId) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(messageId);
      speak(text);
    }
  };

  // Auto-scroll on new content
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const activeConv = conversations.find(c => c.id === conversationId);

  const handleMakeShorter = () => {
    sendMessage('Summarize your last response in 2 clear sentences. Keep only the most important finding and one action item.');
  };

  const handleExplainMore = () => {
    sendMessage('Now give me the full detailed analysis — include all supporting data, context, and step-by-step explanation.');
  };

  return (
    <div className="flex flex-col h-full bg-canvas">

      {/* ── Header ── */}
      <div className="shrink-0 h-12 border-b border-border bg-surface-0/90 backdrop-blur-sm flex items-center px-4 gap-3 z-10">
        {/* Conversation title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-semibold text-secondary truncate">
            {activeConv?.title
              ?.replace(/^\[MODE:[\w]+\]\s*/i, '')
              ?.replace(/^\[[\w]+\]\s*/, '')
              || 'AI Performance Coach'}
          </h2>
        </div>

        {/* Voice + Context controls */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Live context badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-1/80 border border-border text-[10px] font-mono text-tertiary">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
            {trades?.length || 0}T · {entries?.length || 0}J
          </div>

          {/* Voice mode toggle */}
          <button
            onClick={() => {
              toggleVoiceMode();
              if (isSpeaking) stopSpeaking();
            }}
            title={voiceModeEnabled ? 'Voice mode ON — auto-speak responses' : 'Voice mode OFF'}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-all",
              voiceModeEnabled
                ? "bg-accent/10 border-accent/30 text-accent shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                : "bg-surface-1/80 border-border text-tertiary hover:text-primary hover:bg-surface-1"
            )}
          >
            {voiceModeEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            <span className="hidden lg:inline">{voiceModeEnabled ? 'Voice ON' : 'Voice'}</span>
            {voiceModeEnabled && <VoiceOrb className="ml-0.5" />}
          </button>

          {/* Voice settings (voice picker) — only show when voice mode is on */}
          {voiceModeEnabled && <VoiceSettings />}

          {onToggleInsights && (
            <button
              onClick={onToggleInsights}
              title={showInsights ? 'Hide insights panel' : 'Show insights panel'}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-all",
                showInsights
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-surface-1/80 border-border text-tertiary hover:text-primary hover:bg-surface-1"
              )}
            >
              <Activity className="w-3 h-3" />
              <span className="hidden lg:inline">Insights</span>
            </button>
          )}
        </div>

        {/* Mobile voice toggle */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={() => {
              toggleVoiceMode();
              if (isSpeaking) stopSpeaking();
            }}
            className={cn(
              "p-1.5 rounded-lg border transition-all",
              voiceModeEnabled
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-surface-1/80 border-border text-tertiary"
            )}
            title={voiceModeEnabled ? 'Voice ON' : 'Voice OFF'}
          >
            {voiceModeEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-tertiary text-xs">
              <RefreshCw className="w-4 h-4 animate-spin opacity-50" />
              <span>Loading conversation…</span>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-4">
            {messages.map((msg, i) => {
              const isLastMessage = i === messages.length - 1;

              if (msg.role === 'user') {
                const cleanContent = (msg.content || '')
                  .replace(/^\[MODE:[\w]+\]\s*/i, '')
                  .replace(/^\[[\w]+\]\s*/i, '')
                  .trim();
                return (
                  <div key={(msg as any).id ?? i} className="flex justify-end">
                    <div className="max-w-[85%]">
                      <UserMessageBubble content={cleanContent} />
                    </div>
                  </div>
                );
              }

              // Assistant message
              const { content, disciplineData } = parseMessageContent(msg.content);
              const msgId = (msg as any).id ?? String(i);
              return (
                <AIMessage
                  key={msgId}
                  messageId={msgId}
                  content={content}
                  disciplineData={disciplineData || (msg as any).disciplineEvaluation}
                  detectedMode={(msg as any).detectedMode}
                  createdAt={(msg as any).createdAt}
                  isLatest={isLastMessage && !isTyping}
                  isStreaming={false}
                  onRegenerate={isLastMessage ? regenerateResponse : undefined}
                  onMakeShorter={isLastMessage ? handleMakeShorter : undefined}
                  onExplainMore={isLastMessage ? handleExplainMore : undefined}
                  onSpeak={() => handleSpeak(msgId, content)}
                  isSpeaking={isSpeaking && speakingMessageId === msgId}
                />
              );
            })}

            {/* ── Streaming state ── */}
            {isTyping && (
              <div className="animate-in fade-in duration-300">
                {streamingMessage ? (
                  // Active streaming — show partial response
                  <AIMessage
                    content={parseMessageContent(streamingMessage).content}
                    isStreaming={true}
                  />
                ) : (
                  // Waiting for first token
                  <StreamingDots />
                )}
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* ── Input Area ── */}
      <div className="shrink-0 px-4 pb-4 pt-3 bg-gradient-to-t from-canvas via-canvas/98 to-transparent">
        <div className="max-w-2xl mx-auto">
          <SmartInput
            onSubmit={(text) => sendMessage(text)}
            onStop={stopGeneration}
            isTyping={isTyping}
            hasMessages={messages.length > 0}
            disabled={loading && messages.length === 0}
            onMicToggle={toggleRecording}
            isListening={isListening}
          />
        </div>
      </div>
    </div>
  );
}
