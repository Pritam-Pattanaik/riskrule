import { Router } from 'express';
import { prisma } from '../db';
import { authenticate } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/aiRateLimit';
import { sanitizeChatInput } from '../middleware/inputSanitizer';
import { ContextService } from '../lib/ai/ContextService';
import { ChatPromptRegistry } from '../lib/ai/ChatPromptRegistry';
import { StreamController } from '../lib/ai/StreamController';
import { getAIProvider } from '../lib/ai/providerFactory';
import { generateGroqJSON } from '../lib/ai/provider';
import { validateDisciplineEvaluation } from '../lib/ai/disciplineSchema';
import { createNotification } from '../services/notificationService';
import { logger } from '../lib/logger';
import Groq from 'groq-sdk';

const router = Router();

// Get coach memory
router.get('/coach-memory', authenticate, async (req: any, res) => {
  try {
    const memories = await prisma.coachMemory.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coach memory' });
  }
});

// Get all conversations for a user (only those with at least 1 message)
router.get('/conversations', authenticate, async (req: any, res) => {
  try {
    const conversations = await prisma.aiConversation.findMany({
      where: {
        userId: req.userId,
        messages: { some: {} }  // Only return conversations with at least 1 message
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Bulk delete all empty conversations (no messages)
router.delete('/conversations/empty', authenticate, async (req: any, res) => {
  try {
    const result = await prisma.aiConversation.deleteMany({
      where: {
        userId: req.userId,
        messages: { none: {} }
      }
    });
    res.json({ deleted: result.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete empty conversations' });
  }
});

// Clear all conversations for a user
router.delete('/conversations/all', authenticate, async (req: any, res) => {
  try {
    const result = await prisma.aiConversation.deleteMany({
      where: { userId: req.userId }
    });
    res.json({ deleted: result.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear conversations' });
  }
});

// Create a new conversation
router.post('/conversations', authenticate, async (req: any, res) => {
  try {
    const { title } = req.body;
    const conversation = await prisma.aiConversation.create({
      data: {
        userId: req.userId,
        title: title || 'New Conversation'
      }
    });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', authenticate, async (req: any, res) => {
  try {
    const messages = await prisma.aiMessage.findMany({
      where: {
        conversationId: req.params.id,
        conversation: { userId: req.userId } // Security check
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Delete a conversation
router.delete('/conversations/:id', authenticate, async (req: any, res) => {
  try {
    await prisma.aiConversation.delete({
      where: {
        id: req.params.id,
        userId: req.userId // Ensure user owns it
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// Rename a conversation
router.put('/conversations/:id', authenticate, async (req: any, res) => {
  try {
    const { title } = req.body;
    const conv = await prisma.aiConversation.update({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      data: { title }
    });
    res.json(conv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to rename conversation' });
  }
});

// Pin/Unpin conversation
router.patch('/conversations/:id/pin', authenticate, async (req: any, res) => {
  try {
    const { isPinned } = req.body;
    const conv = await prisma.aiConversation.update({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      data: { isPinned }
    });
    res.json(conv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to pin conversation' });
  }
});

// Duplicate conversation
router.post('/conversations/:id/duplicate', authenticate, async (req: any, res) => {
  try {
    const original = await prisma.aiConversation.findUnique({
      where: { id: req.params.id, userId: req.userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    if (!original) return res.status(404).json({ error: 'Conversation not found' });

    const duplicated = await prisma.aiConversation.create({
      data: {
        userId: req.userId,
        title: `${original.title} (Copy)`,
        messages: {
          create: original.messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      },
      include: { messages: true }
    });

    res.json(duplicated);
  } catch (error) {
    logger.error('Failed to duplicate conversation:', error);
    res.status(500).json({ error: 'Failed to duplicate conversation' });
  }
});

// Auto-generate a smart title for the conversation using Groq LLM
router.patch('/conversations/:id/generate-title', authenticate, async (req: any, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await prisma.aiConversation.findUnique({
      where: { id: conversationId, userId: req.userId },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 2 } }
    });

    if (!conversation || conversation.messages.length === 0) {
      return res.status(404).json({ error: 'Conversation or messages not found' });
    }

    const firstMsg = conversation.messages[0].content;
    // Strip [MODE:xxx] and any bracket tags from the start of the message
    const cleanMsg = firstMsg.replace(/^\[MODE:[\w]+\]\s*/i, '').replace(/^\[.*?\]\s*/, '').trim();
    const firstAiMsg = conversation.messages[1]?.content ?? '';
    // Clean AI response — strip DISCIPLINE tags from title context
    const cleanAiMsg = firstAiMsg.replace(/<!--DISCIPLINE_JSON[\s\S]*?-->/gi, '').replace(/<!--\/DISCIPLINE_JSON-->/gi, '').substring(0, 200);

    let generatedTitle = cleanMsg.substring(0, 60);

    // Fast LLM title generation
    if (process.env.GROQ_API_KEY) {
      try {
        const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const titleCompletion = await groqClient.chat.completions.create({
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'system',
              content: 'Generate a concise 3-6 word title for this trading conversation. Be specific — use trading symbols, strategies, or concepts. Return ONLY the title, nothing else. No quotes, no punctuation at the end.'
            },
            {
              role: 'user',
              content: `User message: ${cleanMsg.substring(0, 300)}\nAI response: ${cleanAiMsg}`
            }
          ],
          temperature: 0.3,
          max_tokens: 20,
        });
        const llmTitle = titleCompletion.choices[0]?.message?.content?.trim();
        if (llmTitle && llmTitle.length > 3 && llmTitle.length < 80) {
          generatedTitle = llmTitle;
        }
      } catch (titleErr) {
        logger.warn('[AI] Title generation LLM call failed, using fallback');
      }
    }

    const updated = await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { title: generatedTitle || 'New Conversation' }
    });

    res.json(updated);
  } catch (error) {
    logger.error('[AI] Failed to generate title', { error });
    res.status(500).json({ error: 'Failed to generate title' });
  }
});

// Toggle Archive conversation
router.patch('/conversations/:id/archive', authenticate, async (req: any, res) => {
  try {
    const { isArchived } = req.body;
    const conv = await prisma.aiConversation.update({
      where: { id: req.params.id, userId: req.userId },
      data: { isArchived }
    });
    res.json(conv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive conversation' });
  }
});

// ─── Zero-latency intent detection (no extra LLM call) ───────────────────────
function detectIntent(message: string, explicitMode?: string): string {
  if (explicitMode && explicitMode !== 'general' && explicitMode !== 'auto') {
    return explicitMode.toLowerCase();
  }
  const m = message.toLowerCase();
  if (/fear|fomo|emotion|angry|frustrat|anxious|hesitat|greed|euphoria|mental|mindset|psychology|stress|panic|impuls|revenge|overtrading/.test(m)) return 'psychology';
  if (/risk|stop.?loss|position.?siz|drawdown|max.?loss|capital|protect|ruin|over.?leverag/.test(m)) return 'risk';
  if (/strategy|setup|entry|exit|backtest|playbook|pattern|signal|indicator|system/.test(m)) return 'strategy';
  if (/journal|reflect|yesterday|debrief|session|post.?market|end.?of.?day|today.*how|how.*today|review.*session/.test(m)) return 'postmarket';
  if (/morning|pre.?market|plan.*today|today.*plan|bias|watchlist|levels|before.*open|market.?open|prep/.test(m)) return 'premarket';
  if (/performance|win.?rate|expectanc|profit.?factor|statistic|streak|metric|p&l|pnl|return/.test(m)) return 'performance';
  return 'general';
}

// ─── POST /api/ai/chat (Streaming Edge Architecture) ──────────────────────────
router.post('/chat', authenticate, aiRateLimiter, sanitizeChatInput, async (req: any, res) => {
  const { conversationId, message, isRegeneration } = req.body;


  if (!conversationId || !message) {
    return res.status(400).json({ error: 'conversationId and message are required' });
  }

  try {
    const conversation = await prisma.aiConversation.findUnique({
      where: { id: conversationId, userId: req.userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Parse Mode — strip any legacy bracket tags, then auto-detect intent
    let actualMessage = message;
    let explicitMode = req.body.mode;
    if (message.startsWith('[MODE:')) {
      const endBracket = message.indexOf(']');
      if (endBracket !== -1) {
        if (!explicitMode) explicitMode = message.substring(6, endBracket).toLowerCase();
        actualMessage = message.substring(endBracket + 1).trim();
      }
    }

    // Auto intent detection — zero latency, no extra LLM call
    const mode = detectIntent(actualMessage, explicitMode);

    // Save clean user message only if not a regeneration
    if (!isRegeneration) {
      await prisma.aiMessage.create({
        data: {
          conversationId,
          role: 'user',
          content: actualMessage
        }
      });
    }

    // 1. Parallel Multi-Dimensional Context Assembly
    const masterContext = await ContextService.assembleMasterContext(req.userId, mode);

    // 2. Build System Prompt v4 (Adaptive Response Intelligence)
    const systemPrompt = ChatPromptRegistry.buildSystemPrompt(masterContext);

    // 3. Assemble Conversation History (Max 6 messages for token budget)
    const history = conversation.messages
      .slice(-6)
      .map(m => ({ 
        role: m.role as 'user' | 'assistant', 
        content: m.content.replace(/^\[MODE:.*?\]\s*/i, '') 
      }));

    const messagesPayload = [
      { role: 'system' as const, content: systemPrompt },
      ...history,
      { role: 'user' as const, content: actualMessage }
    ];

    // 4. Initialize StreamController
    const streamController = new StreamController(res);
    const abortController = new AbortController();

    let isAborted = false;
    req.on('close', () => {
      isAborted = true;
      abortController.abort();
    });

    try {
      const provider = getAIProvider();
      await provider.streamChat(
        messagesPayload,
        (chunk: string) => {
          streamController.handleChunk(chunk);
        },
        abortController.signal
      );

      // Finalize SSE Stream — include detected mode in metadata
      const result = streamController.finish({
        promptVersion: ChatPromptRegistry.PROMPT_VERSION,
        conversationId,
        detectedMode: mode,
      });

      // 5. Persist assistant response to DB
      if (result.fullText && !isAborted) {
        await prisma.aiMessage.create({
          data: {
            conversationId,
            role: 'assistant',
            content: result.fullText
          }
        });

        await prisma.aiConversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });
      }
    } catch (streamError: any) {
      if (streamError.name === 'AbortError' || isAborted) {
        logger.info('[AI Chat] Client disconnected stream');
      } else {
        logger.error('[AI Chat] Streaming LLM execution error:', streamError);
        streamController.sendError(streamError.message || 'LLM execution failure');
      }
    }
  } catch (error: any) {
    logger.error('[AI Chat] Chat endpoint handler exception', { error });
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Failed to process chat request' });
    }
  }
});

// ─── POST /api/ai/evaluate-trade ────────────────────────────────────────────
router.post('/evaluate-trade', authenticate, async (req: any, res) => {
  try {
    const { symbol, date, direction, entryPrice, exitPrice, netPnl, quantity, strategyName, mindset, decisionNotes, setupDescription, learnings, mistakes } = req.body;

    const prompt = `You are an elite trading discipline evaluator. Analyze this trade and return a structured discipline evaluation.

TRADE DATA:
Symbol: ${symbol}
Date: ${date}
Direction: ${direction}
Entry: ${entryPrice} | Exit: ${exitPrice}
Net P&L: ₹${netPnl}
Quantity: ${quantity}
Strategy: ${strategyName || 'None'}
Mindset: ${mindset || 'Not logged'}
Decision Notes: ${decisionNotes || 'None'}
Setup: ${setupDescription || 'None'}
Learnings: ${learnings || 'None'}
Mistakes: ${Array.isArray(mistakes) ? mistakes.join(', ') : 'None'}

SCALE:
5/5 Elite — Perfect execution, no emotional mistakes, risk respected, plan followed.
4/5 Excellent — Minor execution mistakes only.
3/5 Good — Acceptable execution, some emotional leakage.
2/5 Poor — Repeated mistakes, weak discipline.
1/5 Critical — Major behavioral failures, immediate review required.

Return JSON matching this schema exactly:
{
  "confidence": 0.92,
  "reasons": ["Entry followed plan", "Risk respected"],
  "mistakes": ["Exited before target"],
  "strengths": ["No revenge trading", "Position sizing respected"],
  "breakdown": {
    "entryPlan": true,
    "riskManagement": true,
    "exitExecution": false,
    "emotionControl": true,
    "ruleCompliance": true
  }
}`;

    const aiData = await generateGroqJSON([{ role: 'user', content: prompt }]);
    const validated = validateDisciplineEvaluation(aiData);

    if (!validated) {
      await createNotification({
        userId: req.userId,
        title: 'AI Analysis Failed',
        description: 'The AI returned an invalid response for trade evaluation.',
        category: 'AI',
        priority: 'Warning',
      });
      return res.status(422).json({ error: 'AI returned invalid discipline evaluation' });
    }

    await createNotification({
      userId: req.userId,
      title: 'AI Analysis Completed',
      description: `Discipline score computed for trade ${symbol}`,
      category: 'AI',
      priority: 'Success',
      actionLabel: 'View Details',
      actionUrl: '/app/journal'
    });

    res.json({
      confidence: validated.confidence,
      reason: validated.reasons.join('. '),
      reasons: validated.reasons,
      mistakes: validated.mistakes,
      strengths: validated.strengths,
      breakdown: validated.breakdown,
    });
  } catch (error) {
    logger.error('[AI] Evaluate trade error', { error });
    res.status(500).json({ error: 'Failed to evaluate trade discipline' });
  }
});

// ─── POST /api/ai/feedback ────────────────────────────────────────────────────
router.post('/feedback', authenticate, async (req: any, res) => {
  const { messageId, feedback } = req.body;
  if (!feedback || !['up', 'down'].includes(feedback)) {
    return res.status(400).json({ error: 'Invalid feedback value. Must be "up" or "down".' });
  }
  logger.info('[AI Feedback]', { userId: req.userId, messageId, feedback });
  res.json({ success: true, recorded: feedback });
});

export default router;
