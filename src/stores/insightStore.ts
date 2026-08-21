import { create } from 'zustand';
import { api } from '../lib/api';
import { AiConversation, AiMessage } from '../types';
import { streamAIInference } from '../lib/aiStreamClient';

export interface CoachMemory {
  id: string;
  userId: string;
  patternType: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'improving' | 'positive';
  count: number;
  previousCount: number;
  avgPnl: string | null;
  detectedAt: string;
  updatedAt: string;
}

interface InsightState {
  conversations: AiConversation[];
  activeConversationId: string | null;
  messages: AiMessage[];
  streamingMessage: string;
  isTyping: boolean;
  coachMemory: CoachMemory[];
  currentMode: string;
  loading: boolean;
  error: string | null;

  setMode: (mode: string) => void;
  fetchConversations: () => Promise<void>;
  purgeEmptyConversations: () => Promise<void>;
  createConversation: (title?: string) => Promise<string>;
  generateConversationTitle: (id: string) => Promise<void>;
  setActiveConversation: (id: string | null) => Promise<void>;
  sendMessage: (content: string, modeOverride?: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  clearAllConversations: () => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;
  pinConversation: (id: string, isPinned: boolean) => Promise<void>;
  archiveConversation: (id: string, isArchived: boolean) => Promise<void>;
  fetchCoachMemory: () => Promise<void>;
  stopGeneration: () => void;
  regenerateResponse: () => Promise<void>;
  duplicateConversation: (id: string) => Promise<void>;
  exportConversation: (id: string) => Promise<void>;
}

// Per-conversation abort controllers
const abortControllers = new Map<string, AbortController>();
let coachMemoryInterval: ReturnType<typeof setInterval> | null = null;

export const useInsightStore = create<InsightState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  streamingMessage: '',
  isTyping: false,
  coachMemory: [],
  currentMode: 'general',
  loading: false,
  error: null,

  setMode: (mode: string) => set({ currentMode: mode }),

  fetchConversations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<AiConversation[]>('/ai/conversations');
      // Extra client-side safety: filter out any conversation without messages count
      const withMessages = (response || []).filter(c => {
        const count = (c as any)._count?.messages;
        return count === undefined || count > 0;
      });
      set({ conversations: withMessages, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch conversations', loading: false });
    }
  },

  // Silent background cleanup of empty conversation orphans in the DB
  purgeEmptyConversations: async () => {
    try {
      await api.delete('/ai/conversations/empty');
    } catch {
      // Non-critical — silent
    }
  },

  // Lazy: only creates DB record when called from sendMessage, not from UI click
  createConversation: async (title?: string) => {
    set({ loading: false, error: null });
    try {
      const response = await api.post<AiConversation>('/ai/conversations', { title: title || 'New Chat' });
      set(state => ({
        conversations: [response, ...state.conversations],
        activeConversationId: response.id,
        messages: [],
      }));
      try { localStorage.setItem('lastActiveConversationId', response.id); } catch { /* non-critical */ }
      return response.id;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create conversation' });
      throw error;
    }
  },

  setActiveConversation: async (id: string | null) => {
    set({
      activeConversationId: id,
      messages: [],
      streamingMessage: '',
      isTyping: false,
      error: null
    });

    try {
      if (id) localStorage.setItem('lastActiveConversationId', id);
      else localStorage.removeItem('lastActiveConversationId');
    } catch { /* non-critical */ }

    if (!id) return;

    set({ loading: true });
    try {
      const response = await api.get<AiMessage[]>(`/ai/conversations/${id}/messages`);
      const sanitized = (response || []).map(m => ({
        ...m,
        content: m.content ? m.content.replace(/^\[MODE:[\w]+\]\s*/i, '') : ''
      }));
      set({ messages: sanitized, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch messages', loading: false });
    }
  },

  deleteConversation: async (id: string) => {
    try {
      await api.delete(`/ai/conversations/${id}`);
      const ctrl = abortControllers.get(id);
      if (ctrl) { ctrl.abort(); abortControllers.delete(id); }

      set(state => {
        const nextConvs = state.conversations.filter(c => c.id !== id);
        const isActive = state.activeConversationId === id;
        const newActiveId = isActive ? (nextConvs[0]?.id ?? null) : state.activeConversationId;
        if (isActive) {
          try { localStorage.removeItem('lastActiveConversationId'); } catch { /* non-critical */ }
        }
        return {
          conversations: nextConvs,
          activeConversationId: newActiveId,
          messages: isActive ? [] : state.messages,
        };
      });

      // If we switched to a new active, load its messages
      const newActive = get().activeConversationId;
      if (newActive && newActive !== id) {
        get().setActiveConversation(newActive);
      }
    } catch { /* Non-critical */ }
  },

  clearAllConversations: async () => {
    // Abort all active streams
    for (const [, ctrl] of abortControllers) ctrl.abort();
    abortControllers.clear();

    try {
      await api.delete('/ai/conversations/all');
      set({
        conversations: [],
        activeConversationId: null,
        messages: [],
        streamingMessage: '',
        isTyping: false,
      });
      try { localStorage.removeItem('lastActiveConversationId'); } catch { /* non-critical */ }
    } catch (error: any) {
      set({ error: error.message || 'Failed to clear conversations' });
    }
  },

  renameConversation: async (id: string, title: string) => {
    try {
      const updated = await api.put<AiConversation>(`/ai/conversations/${id}`, { title });
      set(state => ({
        conversations: state.conversations.map(c => c.id === id ? { ...c, title: updated.title } : c)
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to rename conversation' });
    }
  },

  pinConversation: async (id: string, isPinned: boolean) => {
    try {
      const updated = await api.patch<AiConversation>(`/ai/conversations/${id}/pin`, { isPinned });
      set(state => ({
        conversations: state.conversations.map(c => c.id === id ? { ...c, isPinned: updated.isPinned } : c)
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to pin conversation' });
    }
  },

  archiveConversation: async (id: string, isArchived: boolean) => {
    try {
      await api.patch(`/ai/conversations/${id}/archive`, { isArchived });
      set(state => ({
        conversations: state.conversations.map(c => c.id === id ? { ...c, isArchived } : c)
      }));
    } catch (error: any) {
      set({ error: 'Failed to archive conversation' });
    }
  },

  duplicateConversation: async (id: string) => {
    try {
      const duplicated = await api.post<AiConversation>(`/ai/conversations/${id}/duplicate`, {});
      set(state => ({ conversations: [duplicated, ...state.conversations] }));
      await get().setActiveConversation(duplicated.id);
    } catch (error: any) {
      set({ error: 'Failed to duplicate conversation' });
    }
  },

  exportConversation: async (id: string) => {
    const state = get();
    const conv = state.conversations.find(c => c.id === id);
    if (!conv) return;

    let exportMessages: AiMessage[] = [];
    if (state.activeConversationId === id) {
      exportMessages = state.messages;
    } else {
      try {
        exportMessages = await api.get<AiMessage[]>(`/ai/conversations/${id}/messages`);
      } catch {
        import('../lib/notify').then(m => m.notify.error('Failed to fetch conversation for export'));
        return;
      }
    }

    let exportText = `# ${conv.title}\n\n`;
    exportMessages.forEach(m => {
      exportText += `### ${m.role === 'user' ? 'You' : 'Risk Officer'}\n${m.content}\n\n`;
    });

    const blob = new Blob([exportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conv.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // ─── LAZY CREATION: DB conversation is created here, not on New Chat click ─
  sendMessage: async (content: string, modeOverride?: string) => {
    let { activeConversationId } = get();
    const { currentMode } = get();
    const isFirstMessage = get().messages.length === 0;

    // Clean any legacy mode tags from the text
    let cleanContent = content.trim();
    let modeToUse = modeOverride || currentMode || 'general';
    if (cleanContent.startsWith('[MODE:')) {
      const endBracket = cleanContent.indexOf(']');
      if (endBracket !== -1) {
        if (!modeOverride) modeToUse = cleanContent.substring(6, endBracket).toLowerCase();
        cleanContent = cleanContent.substring(endBracket + 1).trim();
      }
    }

    // LAZY CREATION: Create the DB conversation only when first message is sent
    if (!activeConversationId) {
      try {
        const preview = cleanContent.substring(0, 40);
        activeConversationId = await get().createConversation(preview);
      } catch {
        return;
      }
    }

    const conversationId = activeConversationId;

    // Cancel existing stream
    const existingCtrl = abortControllers.get(conversationId);
    if (existingCtrl) {
      existingCtrl.abort();
      abortControllers.delete(conversationId);
    }

    // Optimistically add clean user message (zero tag leaks)
    const tempUserMsg: AiMessage = {
      role: 'user',
      content: cleanContent,
      id: crypto.randomUUID(),
    } as AiMessage;

    set(state => ({
      messages: [...state.messages, tempUserMsg],
      isTyping: true,
      streamingMessage: '',
      error: null
    }));

    const controller = new AbortController();
    abortControllers.set(conversationId, controller);

    let capturedDiscipline: any = null;
    let serverMessageId: string | undefined = undefined;

    try {
      await streamAIInference({
        endpoint: '/api/ai/chat',
        payload: { conversationId, message: cleanContent, mode: modeToUse },
        signal: controller.signal,
        onToken: (_token, accumulated) => {
          set({ streamingMessage: accumulated });
        },
        onDiscipline: (data) => {
          capturedDiscipline = data;
        },
        onComplete: (_fullText, metadata) => {
          if (metadata?.messageId) serverMessageId = metadata.messageId;
        },
      });

      set(state => ({
        messages: [
          ...state.messages,
          {
            role: 'assistant',
            content: state.streamingMessage,
            id: serverMessageId || crypto.randomUUID(),
            disciplineEvaluation: capturedDiscipline,
            createdAt: new Date().toISOString(),
          } as AiMessage
        ],
        streamingMessage: '',
        isTyping: false,
      }));

    } catch (error: any) {
      if (error.name === 'AbortError') {
        set(state => {
          const streamText = state.streamingMessage.trim();
          return {
            messages: streamText.length > 0
              ? [...state.messages, {
                  role: 'assistant',
                  content: streamText,
                  id: crypto.randomUUID(),
                  disciplineEvaluation: capturedDiscipline,
                  createdAt: new Date().toISOString(),
                } as AiMessage]
              : state.messages,
            streamingMessage: '',
            isTyping: false,
          };
        });
      } else {
        set({ error: error.message || 'Chat request failed', isTyping: false });
        import('../lib/notify').then(m => m.notify.error(error.message || 'Failed to generate response'));
      }
    } finally {
      abortControllers.delete(conversationId);
      if (isFirstMessage && conversationId) {
        get().generateConversationTitle(conversationId);
      }
    }
  },

  generateConversationTitle: async (id: string) => {
    try {
      const response = await api.patch<AiConversation>(`/ai/conversations/${id}/generate-title`, {});
      set(state => ({
        conversations: state.conversations.map(c =>
          c.id === id ? { ...c, title: response.title } : c
        )
      }));
    } catch {
      // Non-critical
    }
  },

  stopGeneration: () => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;
    const ctrl = abortControllers.get(activeConversationId);
    if (ctrl) {
      ctrl.abort();
      abortControllers.delete(activeConversationId);
    }
  },

  regenerateResponse: async () => {
    const { messages, activeConversationId, currentMode } = get();
    if (!activeConversationId || messages.length < 2) return;

    const existingCtrl = abortControllers.get(activeConversationId);
    if (existingCtrl) {
      existingCtrl.abort();
      abortControllers.delete(activeConversationId);
    }

    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') { lastUserMessageIndex = i; break; }
    }
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex].content;
    set({ messages: messages.slice(0, lastUserMessageIndex + 1), isTyping: true, streamingMessage: '', error: null });

    const controller = new AbortController();
    abortControllers.set(activeConversationId, controller);

    let capturedDiscipline: any = null;
    let serverMessageId: string | undefined = undefined;

    try {
      await streamAIInference({
        endpoint: '/api/ai/chat',
        payload: {
          conversationId: activeConversationId,
          message: lastUserMessage,
          mode: currentMode,
          isRegeneration: true,
        },
        signal: controller.signal,
        onToken: (_token, accumulated) => set({ streamingMessage: accumulated }),
        onDiscipline: (data) => { capturedDiscipline = data; },
        onComplete: (_fullText, metadata) => { if (metadata?.messageId) serverMessageId = metadata.messageId; },
      });

      set(state => ({
        messages: [
          ...state.messages,
          {
            role: 'assistant',
            content: state.streamingMessage,
            id: serverMessageId || crypto.randomUUID(),
            disciplineEvaluation: capturedDiscipline,
            createdAt: new Date().toISOString(),
          } as AiMessage
        ],
        streamingMessage: '',
        isTyping: false,
      }));
    } catch (error: any) {
      if (error.name === 'AbortError') {
        set(state => {
          const content = state.streamingMessage.trim();
          return {
            messages: content.length > 0
              ? [...state.messages, {
                  role: 'assistant',
                  content,
                  id: crypto.randomUUID(),
                  disciplineEvaluation: capturedDiscipline,
                  createdAt: new Date().toISOString(),
                } as AiMessage]
              : state.messages,
            streamingMessage: '',
            isTyping: false,
          };
        });
      } else {
        set({ error: error.message || 'Regeneration failed', isTyping: false });
      }
    } finally {
      abortControllers.delete(activeConversationId);
    }
  },

  fetchCoachMemory: async () => {
    try {
      const response = await api.get<CoachMemory[]>('/ai/coach-memory');
      set({ coachMemory: response || [] });
    } catch { /* Non-blocking */ }
  },
}));

export function startCoachMemoryPolling() {
  if (coachMemoryInterval) return;
  const { fetchCoachMemory } = useInsightStore.getState();
  fetchCoachMemory();
  coachMemoryInterval = setInterval(fetchCoachMemory, 5 * 60_000);
}

export function stopCoachMemoryPolling() {
  if (coachMemoryInterval) {
    clearInterval(coachMemoryInterval);
    coachMemoryInterval = null;
  }
}
