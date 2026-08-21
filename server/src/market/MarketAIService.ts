/**
 * MarketAIService — AI-Powered Market Summary via Groq
 *
 * Workflow:
 * 1. Collect live MarketQuotes from MarketDataService
 * 2. Collect recent NewsArticles from YahooNewsService
 * 3. Build structured context string
 * 4. Call Groq openai/gpt-oss-120b
 * 5. Stream response to client via SSE
 *
 * Compliance: All responses include SEBI educational disclaimer.
 * Groq NEVER fetches market data directly — all context is pre-built here.
 */

import Groq from 'groq-sdk';
import { marketDataService } from './MarketDataService';
import { yahooNewsService } from './YahooNewsService';
import { logger } from '../lib/logger';
import { EDUCATIONAL_DISCLAIMER } from '../news-engine/config';
import { MarketQuote, NewsArticle, MarketSentiment } from './types';
import type { Response } from 'express';
import { cache } from '../lib/redis';

let groqInstance: Groq | null = null;
function getGroq(): Groq {
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqInstance;
}
const MODEL = 'openai/gpt-oss-120b';

// ─── Context Builder ─────────────────────────────────────────────────────────

function buildMarketContext(quotes: MarketQuote[], news: NewsArticle[]): string {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Build index summary
  const indexLines = quotes
    .filter(q => ['nifty', 'sensex', 'banknifty', 'finnifty', 'vix'].includes(q.id))
    .map(q => {
      const sign = q.changePercent >= 0 ? '+' : '';
      return `- ${q.name}: ${q.price.toLocaleString('en-IN')} (${sign}${q.changePercent.toFixed(2)}%)  [${q.status}]`;
    }).join('\n');

  // Commodities and currencies
  const assetLines = quotes
    .filter(q => ['gold', 'silver', 'crude', 'usdinr'].includes(q.id))
    .map(q => {
      const sign = q.changePercent >= 0 ? '+' : '';
      return `- ${q.name}: ${q.price.toFixed(2)} (${sign}${q.changePercent.toFixed(2)}%)`;
    }).join('\n');

  // Top movers
  const sorted = [...quotes].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  const topGainer = sorted.find(q => q.changePercent > 0);
  const topLoser = sorted.find(q => q.changePercent < 0);

  // Recent news headlines (top 8)
  const newsLines = news
    .slice(0, 8)
    .map((n, i) => `${i + 1}. [${n.category?.toUpperCase() ?? 'NEWS'}] ${n.headline} — ${n.source}`)
    .join('\n');

  return `
=== MARKET DATA SNAPSHOT ===
Time (IST): ${now}

INDICES:
${indexLines || 'No index data available'}

COMMODITIES & CURRENCIES:
${assetLines || 'No commodity data available'}

MOVERS:
- Strongest: ${topGainer ? `${topGainer.name} (${topGainer.changePercent > 0 ? '+' : ''}${topGainer.changePercent.toFixed(2)}%)` : 'N/A'}
- Weakest: ${topLoser ? `${topLoser.name} (${topLoser.changePercent.toFixed(2)}%)` : 'N/A'}

=== LATEST NEWS HEADLINES ===
${newsLines || 'No news available at this time'}
===========================
`.trim();
}

const SYSTEM_PROMPT = `You are TradeVault Market Intelligence, an AI that generates concise, educational market summaries.

Your ONLY job is to analyze the provided market data and news context and produce a structured summary.

CRITICAL RULES:
1. ONLY use the data provided in the context block. NEVER hallucinate prices, percentages, or events.
2. Do NOT provide stock picks, buy/sell recommendations, or price targets.
3. Do NOT mention "Groq", "LLaMA", "AI model", or your underlying technology.
4. Do NOT use generic phrases like "it is important to note" or "it goes without saying".
5. Be concise, precise, and data-driven. Every statement must be backed by the provided data.
6. This is for EDUCATIONAL purposes only.

OUTPUT FORMAT (strict JSON — no markdown, no code fences):
{
  "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED",
  "highlights": ["string", "string", "string"],
  "risks": ["string", "string"],
  "eventsToWatch": ["string", "string"],
  "educationalInsight": "string (1-2 sentences)"
}

Respond ONLY with the JSON object. No other text.`;

// ─── MarketAIService ─────────────────────────────────────────────────────────

export interface MarketSummaryData {
  sentiment: MarketSentiment;
  highlights: string[];
  risks: string[];
  eventsToWatch: string[];
  educationalInsight: string;
  disclaimer: string;
  generatedAt: number;
  isStale?: boolean;         // true when served from stale cache
  staleAgeMinutes?: number;  // how old the stale data is
}

export class MarketAIService {
  private staleCache: MarketSummaryData | null = null;
  private staleTimestamp: number = 0;
  private readonly STALE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes (was 30m)

  private timer: NodeJS.Timeout | null = null;
  private isGenerating = false;                    // Prevents concurrent AI summary runs
  private lastGeneratedAt = 0;                     // Tracks last generation time for debounce
  private readonly MIN_GENERATION_INTERVAL_MS = 2 * 60_000; // Min 2 min between generations

  public startBackgroundWorker() {
    if (this.timer) return;

    // Delay first generation by 30s to avoid startup Yahoo burst (C3 fix):
    // MarketWorker fast-boot and first fetchData() happen at t=0 and t=5s.
    // Waiting 30s ensures quotes are cached in Redis before AI context is built.
    setTimeout(() => {
      this.generateSummaryJSON();
    }, 30_000);

    // Regenerate every 5 minutes
    this.timer = setInterval(() => {
      this.generateSummaryJSON();
    }, 5 * 60_000);
    logger.info('[MarketAI] Background worker started — first generation in 30s, then every 5m');
  }

  public getStaleSummary(): MarketSummaryData | null {
    if (this.staleCache && (Date.now() - this.staleTimestamp < this.STALE_MAX_AGE_MS)) {
      // Annotate with staleness metadata before returning
      return {
        ...this.staleCache,
        isStale: true,
        staleAgeMinutes: Math.round((Date.now() - this.staleTimestamp) / 60_000),
      };
    }
    return null;
  }

  async generateSummaryJSON(): Promise<MarketSummaryData | null> {
    if (!process.env.GROQ_API_KEY) {
      logger.warn('[MarketAI] GROQ_API_KEY not set — AI summary unavailable');
      return null;
    }

    // Prevent concurrent generations (isGenerating guard)
    // Also respect debounce interval (H7 fix)
    if (this.isGenerating || (Date.now() - this.lastGeneratedAt < this.MIN_GENERATION_INTERVAL_MS)) {
      logger.debug('[MarketAI] Generation already in progress or debouncing — skipping');
      return null;
    }

    this.isGenerating = true;

    const [quotes, news] = await Promise.all([
      marketDataService.getQuotes(),
      yahooNewsService.getMarketNews(10),
    ]);

    if (quotes.length === 0) {
      logger.warn('[MarketAI] No market data available for AI summary');
      this.isGenerating = false;
      return null;
    }

    const context = buildMarketContext(quotes, news);
    const maxRetries = 3;
    let attempt = 0;
    let delay = 1000;

    while (attempt < maxRetries) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 12000); // 12s timeout

      try {
        const completion = await getGroq().chat.completions.create({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Analyze this market data and generate the summary JSON:\n\n${context}` },
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        }, {
          signal: abortController.signal
        } as any);
        clearTimeout(timeoutId);

        const raw = completion.choices[0]?.message?.content;
        if (!raw) throw new Error('Empty Groq response');

        const parsed = JSON.parse(raw);

        const summaryData: MarketSummaryData = {
          sentiment: parsed.sentiment ?? 'NEUTRAL',
          highlights: Array.isArray(parsed.highlights) ? parsed.highlights.slice(0, 4) : [],
          risks: Array.isArray(parsed.risks) ? parsed.risks.slice(0, 3) : [],
          eventsToWatch: Array.isArray(parsed.eventsToWatch) ? parsed.eventsToWatch.slice(0, 3) : [],
          educationalInsight: parsed.educationalInsight ?? '',
          disclaimer: EDUCATIONAL_DISCLAIMER,
          generatedAt: Date.now(),
        };

        this.staleCache = summaryData;
        this.staleTimestamp = Date.now();
        this.lastGeneratedAt = Date.now();
        
        // Save to Redis
        try {
          await cache.setex('market:ai-summary:v2', 900, JSON.stringify(summaryData));
        } catch (err) {
          logger.warn(`[MarketAI] Failed to save summary to Redis: ${err}`);
        }
        
        this.isGenerating = false;
        return summaryData;

      } catch (err: any) {
        clearTimeout(timeoutId);
        attempt++;
        logger.warn(`[MarketAI] Groq API attempt ${attempt} failed: ${err.message}`);
        if (attempt >= maxRetries) {
          logger.error(`[MarketAI] Groq API failed after ${maxRetries} attempts`);
          this.isGenerating = false;
          return null;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff (1s, 2s, 4s)
      }
    }
    
    this.isGenerating = false;
    return null;
  }

  async streamSummary(res: Response): Promise<void> {
    if (!process.env.GROQ_API_KEY) {
      res.write(`data: ${JSON.stringify({ error: 'AI service unavailable — GROQ_API_KEY not configured' })}\n\n`);
      res.end();
      return;
    }

    const [quotes, news] = await Promise.all([
      marketDataService.getQuotes(),
      yahooNewsService.getMarketNews(10),
    ]);

    const context = buildMarketContext(quotes, news);

    try {
      res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

      const stream = await getGroq().chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this market data and generate the summary JSON:\n\n${context}` },
        ],
        temperature: 0.3,
        max_tokens: 1500,
        stream: true,
        response_format: { type: 'json_object' },
      });

      let accumulated = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        accumulated += delta;
        res.write(`data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`);
      }

      // Try to parse accumulated and send complete
      try {
        const parsed = JSON.parse(accumulated);
        const summary = {
          sentiment: parsed.sentiment ?? 'NEUTRAL',
          highlights: Array.isArray(parsed.highlights) ? parsed.highlights.slice(0, 4) : [],
          risks: Array.isArray(parsed.risks) ? parsed.risks.slice(0, 3) : [],
          eventsToWatch: Array.isArray(parsed.eventsToWatch) ? parsed.eventsToWatch.slice(0, 3) : [],
          educationalInsight: parsed.educationalInsight ?? '',
          disclaimer: EDUCATIONAL_DISCLAIMER,
          generatedAt: Date.now(),
        };
        res.write(`data: ${JSON.stringify({ type: 'complete', summary })}\n\n`);
      } catch {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to parse AI response' })}\n\n`);
      }

    } catch (err: any) {
      logger.error(`[MarketAI] Stream error: ${err.message}`);
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'AI service temporarily unavailable' })}\n\n`);
    }

    res.end();
  }
}

export const marketAIService = new MarketAIService();
