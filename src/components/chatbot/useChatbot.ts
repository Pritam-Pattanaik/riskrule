import { useState, useCallback, useRef, useEffect } from 'react';
import { BASE_URL, getCsrfToken, clearCsrfToken } from '../../lib/api';
import {
  matchKnowledge,
  buildFallbackAnswer,
  getQuickRepliesForPath,
  quickReplies,
} from './chatbotKnowledge';

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp: Date;
  followUps?: string[];
  source?: 'guide' | 'ai';
}

const STORAGE_KEY = 'riskrule-chatbot-messages-v2';
const MAX_STORED = 50;

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function createGreeting(pathname: string): ChatMessage {
  return {
    id: 'greeting',
    role: 'bot',
    text: "Hey! 👋 I'm the **RiskRule Guide**. Ask me anything about our trade journal, **Lunar AI**, broker sync, or pricing.",
    timestamp: new Date(),
    followUps: getQuickRepliesForPath(pathname),
    source: 'guide',
  };
}

function loadMessages(pathname: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createGreeting(pathname)];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [createGreeting(pathname)];
    return (parsed as ChatMessage[]).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [createGreeting(pathname)];
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
  } catch { /* quota exceeded — ignore */ }
}

function normalizeChip(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function filterFollowUps(chips: string[] | undefined, userQuery: string): string[] {
  const userNorm = normalizeChip(userQuery);
  const list = chips && chips.length > 0 ? chips : quickReplies.slice(0, 3);
  return list.filter((c) => normalizeChip(c) !== userNorm).slice(0, 4);
}

function countMeaningfulWords(text: string): number {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2).length;
}

async function fetchPublicAIReply(
  message: string,
  history: ChatMessage[],
  pathname: string,
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const payload = {
    message,
    page: pathname,
    history: history
      .filter((m) => m.id !== 'greeting')
      .slice(-6)
      .map((m) => ({
        role: m.role === 'bot' ? ('assistant' as const) : ('user' as const),
        text: m.text.slice(0, 480),
      })),
  };

  try {
    let csrf = await getCsrfToken();
    let res = await fetch(`${BASE_URL}/public-chat`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(csrf ? { 'csrf-token': csrf } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (res.status === 403) {
      clearCsrfToken();
      csrf = await getCsrfToken();
      res = await fetch(`${BASE_URL}/public-chat`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrf ? { 'csrf-token': csrf } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    }

    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.reply === 'string' && data.reply.trim() ? data.reply.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function useChatbot(pathname = '/') {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages(pathname));
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Keep fresh greeting chips synced to the page the visitor is viewing
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'greeting') {
        return [{ ...prev[0], followUps: getQuickRepliesForPath(pathname) }];
      }
      return prev;
    });
  }, [pathname]);

  // Persist messages
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setHasUnread(false);
      return !prev;
    });
  }, []);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isTyping) return;

      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        text,
        timestamp: new Date(),
      };

      const prevHistory = messagesRef.current;
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      const match = matchKnowledge(text);
      const wordCount = countMeaningfulWords(text);
      const isDirectIntent =
        match.entry !== null &&
        (match.confidence >= 100 || (match.confidence >= 2.8 && wordCount <= 6));

      if (isDirectIntent && match.entry) {
        const delay = 180 + Math.random() * 180;
        typingTimeout.current = setTimeout(() => {
          const botMsg: ChatMessage = {
            id: uid(),
            role: 'bot',
            text: match.entry!.answer,
            timestamp: new Date(),
            followUps: filterFollowUps(match.relatedQuestions, text),
            source: 'guide',
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
          if (!document.hasFocus()) setHasUnread(true);
        }, delay);
        return;
      }

      // Low-confidence or complex multi-part question: try live AI endpoint first
      const aiReply = await fetchPublicAIReply(text, prevHistory, pathname);

      let answerText: string;
      let source: 'guide' | 'ai' = 'guide';

      if (aiReply) {
        answerText = aiReply;
        source = 'ai';
      } else if (match.entry && match.confidence >= 2) {
        answerText = match.entry.answer;
      } else {
        answerText = buildFallbackAnswer(text, match.relatedQuestions);
      }

      const botMsg: ChatMessage = {
        id: uid(),
        role: 'bot',
        text: answerText,
        timestamp: new Date(),
        followUps: filterFollowUps(
          source === 'ai' ? getQuickRepliesForPath(pathname) : match.relatedQuestions,
          text,
        ),
        source,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (!document.hasFocus()) setHasUnread(true);
    },
    [isTyping, pathname],
  );

  const clearHistory = useCallback(() => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    setIsTyping(false);
    setMessages([createGreeting(pathname)]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

  return {
    isOpen,
    toggleOpen,
    messages,
    isTyping,
    sendMessage,
    clearHistory,
    hasUnread,
  };
}
