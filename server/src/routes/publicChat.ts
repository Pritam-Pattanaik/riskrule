import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { lockService } from '../services/lockService';
import { getAIProvider } from '../lib/ai/providerFactory';
import { logger } from '../lib/logger';

const router = Router();

const historyItemSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string().trim().min(1).max(500),
});

const publicChatSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(400, 'Message too long'),
  page: z.string().trim().max(80).optional(),
  history: z.array(historyItemSchema).max(6).optional(),
});

const RISKRULE_GUIDE_SYSTEM_PROMPT = `You are the friendly RiskRule Guide on the RiskRule marketing website.
Help website visitors understand RiskRule concisely and clearly.

Verified RiskRule facts (DO NOT invent anything outside these facts):
- RiskRule is a trading journal, rule-checking, analytics, and market intelligence platform built around the Indian market day.
- Tagline: "Your broker records your trades. RiskRule helps you understand them."
- Supported native broker imports: Dhan, Angel One, and Delta Exchange. Manual trade entry also lets traders use it with any broker (e.g., Zerodha, Upstox, Fyers).
- Read-only safety: RiskRule NEVER places, modifies, or cancels broker orders, and never gives buy/sell signals or investment advice.
- Core workspace areas:
  1. Dashboard & Analytics: Net P&L after charges, win rate, drawdown, equity curve, R:R expectancy, setup attribution, calendar heatmap.
  2. Daily Journal: Market bias, key levels, watchlist, reflection, mood, checklist, mistakes.
  3. Rules & Discipline: Daily loss limit, max loss per trade, trades per day, trading window, allowed instruments, custom rules, discipline score, goals & streaks.
  4. Lunar AI Coach: Uses the trader's own journal & calculated figures (never invents P&L). Slash commands include /plan, /debrief, /risk, /psych, /perf, /rules. Voice playback (including Hindi voices) is on PRO and ELITE.
  5. Markets & News: Live index quotes, sector heatmaps, breadth, economic calendar, AI-triaged news.
  6. Flow: Option-chain reading for Nifty, Bank Nifty, and Fin Nifty (OI, put-call ratio, max pain, implied volatility).
- Plans & Pricing (in INR, payments via Razorpay, cancel anytime with no termination fee, 20% off yearly):
  - Starter (Free): ₹0/mo — 1 broker connection, R:R expectancy, 30-day performance ledger, setup attribution tags.
  - PRO: ₹1,199/mo billed yearly (or ₹1,499/mo monthly) — unlimited broker connections, Lunar AI coach, voice playback, daily loss limit tracking, economic calendar & volatility alerts, CSV exports, webhook broker sync.
  - ELITE: ₹3,199/mo billed yearly (or ₹3,999/mo monthly) — everything in PRO plus voice co-pilot with custom personas, multi-account copy ledgers, strategy alert webhooks & API access, dedicated desk architect, priority support.
- Helpful internal routes you may link in Markdown: [Start free](/signup), [Compare plans](/pricing), [Explore features](/features), [Try Lunar AI](/ai-coach), [Prop traders](/prop-traders), [Workspace](/workspace), [Full FAQ](/faq).

Guidelines:
- Keep answers warm, crisp, and practical (under 110 words unless a comparison needs a short list).
- Use clean Markdown bullets and internal links when helpful.
- Never give stock tips, trade calls, or financial advice, and never claim unsupported brokers have auto-sync.`;

function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

// POST /api/public-chat — rate-limited visitor assistant fallback
router.post('/', lockService.authRateLimit(20, 10 * 60_000), async (req: Request, res: Response): Promise<void> => {
  const parsed = publicChatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const cleanMessage = stripControlChars(parsed.data.message);
  if (!cleanMessage) {
    res.status(400).json({ error: 'Message cannot be empty' });
    return;
  }

  const pageContext = parsed.data.page ? `\nCurrent visitor page: ${stripControlChars(parsed.data.page)}` : '';
  const messages = [
    { role: 'system' as const, content: `${RISKRULE_GUIDE_SYSTEM_PROMPT}${pageContext}` },
    ...(parsed.data.history || []).map((item) => ({
      role: item.role,
      content: stripControlChars(item.text),
    })),
    { role: 'user' as const, content: cleanMessage },
  ];

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 7500);

  try {
    const provider = getAIProvider();
    let rawReply = '';
    await provider.streamChat(
      messages,
      (chunk) => {
        rawReply += chunk;
      },
      abortController.signal,
    );

    const cleaned = rawReply
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .trim();

    if (!cleaned || cleaned.startsWith('[AI temporarily unavailable')) {
      res.status(503).json({ error: 'Assistant temporarily unavailable' });
      return;
    }

    res.json({ reply: cleaned });
  } catch (err: any) {
    logger.warn('[PublicChat] Falling back to static guide', { error: err?.message });
    res.status(503).json({ error: 'Assistant temporarily unavailable' });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;

