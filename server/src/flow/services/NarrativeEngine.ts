/**
 * NarrativeEngine — Explainable AI Narrator (replaces FlowAIEngine)
 *
 * The AI is a NARRATOR, not an analyst.
 * - Pre-computed signals from SignalEngine feed the LLM (not raw chain data)
 * - The LLM translates verified signals into plain English
 * - Every statement must be cited with its source signal
 * - AI never assigns confidence — confidence comes from SignalEngine.agreementScore
 * - AI never runs when dataQuality is 'mock' or 'stale'
 * - Token budget: < 400 tokens in, < 250 tokens out
 *
 * Anti-hallucination enforcement:
 * - System prompt forbids inventing numbers
 * - System prompt requires [source] citations
 * - System prompt forbids directional trade recommendations
 * - LLM response is validated against schema before return
 */

import Groq from 'groq-sdk';
import { logger } from '../../lib/logger';
import { redis } from '../../lib/redis';
import { FlowIntelligence } from './SignalEngine';

const MODEL = 'openai/gpt-oss-120b';

// ── Narrative output schema ───────────────────────────────────────────────────

export interface FlowNarrativeData {
  headline:      string;            // 1 sentence, present tense
  observations:  string[];          // Max 3 observations, each < 35 words
  watchPoints:   string[];          // Max 3 actionable watch levels
  changedToday:  string[];          // Max 2 notable changes from previous
  uncertainty:   string | null;     // What is uncertain and why, or null
  generatedAt:   number;            // Unix ms
  dataAge:       number;            // Seconds since last tick update
  agreementScore: number;           // From SignalEngine (not LLM)
}

// ── Narrative Cache Key ───────────────────────────────────────────────────────
const NARRATIVE_TTL_SEC = 300; // 5 minutes

function narrativeCacheKey(symbol: string, bias: string, agreementScore: number): string {
  // Cache key includes bias and agreement band (every 10%) so different market states = different narrative
  const band = Math.floor(agreementScore / 10) * 10;
  return `flow:narrative:${symbol}:${bias}:${band}`;
}

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a financial narrator for a trading education platform.
Your job is to explain pre-computed options market signals in plain, friendly English.
You are talking to retail traders who may be beginners.

STRICT RULES — violating any rule makes your response invalid:
1. ONLY reference numbers present in the provided FlowSummary JSON. Never invent or estimate numbers.
2. Every factual claim must include a [source] citation in square brackets, e.g., [PCR: 1.43] or [VIX: 15.5].
3. If agreementScore is below 60, you MUST state signals are mixed and avoid directional conclusions.
4. Never use the words: buy, sell, enter, exit, long, short, recommend, predict.
5. Never invent signals not in FlowSummary.
6. Use simple language. When you use a technical term, explain it in plain English immediately after.
7. Keep the entire response under 250 words total.
8. Response must be valid JSON matching this exact schema:
{
  "headline": "string — one sentence, present tense",
  "observations": ["string", "string", "string"], // max 3
  "watchPoints": ["string", "string", "string"],  // max 3, describe levels to watch
  "changedToday": ["string", "string"],            // max 2 notable changes
  "uncertainty": "string or null"                  // what is uncertain, or null if confident
}`;

// ── NarrativeEngine ───────────────────────────────────────────────────────────

export class NarrativeEngine {

  static async generateNarrative(intelligence: FlowIntelligence): Promise<FlowNarrativeData | null> {
    // ── Stale data gate ─────────────────────────────────────────────────────
    if (intelligence.dataAge > 300) {
      return {
        headline:      'Market data is refreshing...',
        observations:  [],
        watchPoints:   [],
        changedToday:  [],
        uncertainty:   `Data is ${Math.round(intelligence.dataAge / 60)} minutes old. Waiting for fresh update.`,
        generatedAt:   Date.now(),
        dataAge:       intelligence.dataAge,
        agreementScore: intelligence.agreementScore,
      };
    }

    // ── Groq API check ──────────────────────────────────────────────────────
    if (!process.env.GROQ_API_KEY) {
      logger.warn('[NarrativeEngine] GROQ_API_KEY not set — returning structured signal summary');
      return this.buildFallbackNarrative(intelligence);
    }

    const cacheKey = narrativeCacheKey(
      intelligence.symbol,
      intelligence.overallBias,
      intelligence.agreementScore
    );

    // ── Redis cache check ───────────────────────────────────────────────────
    try {
      if (redis.status === 'ready' || redis.status === 'connect') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          return {
            ...parsed,
            dataAge:       intelligence.dataAge,
            agreementScore: intelligence.agreementScore,
          };
        }
      }
    } catch (_e) { /* proceed to generate */ }

    // ── Build minimal FlowSummary for LLM (< 400 tokens) ───────────────────
    const callWall = intelligence.meaningfulStrikes.find(s => s.reasons?.includes('highest_call_oi') || s.strike === intelligence.resistanceStrike);
    const putWall  = intelligence.meaningfulStrikes.find(s => s.reasons?.includes('highest_put_oi') || s.strike === intelligence.supportStrike);

    const callStrike = intelligence.resistanceStrike ?? callWall?.strike;
    const callOI = intelligence.maxCallOI ?? callWall?.callOI;
    const putStrike = intelligence.supportStrike ?? putWall?.strike;
    const putOI = intelligence.maxPutOI ?? putWall?.putOI;

    const flowSummary = {
      symbol:        intelligence.symbol,
      dte:           intelligence.dte,
      spotPrice:     intelligence.spotPrice,
      spotChangePct: intelligence.spotChangePct,
      pcrOI:         intelligence.pcrIsValid ? intelligence.pcrOI : null,
      pcrSignal:     intelligence.pcrIsValid ? intelligence.pcrSignal : 'unknown',
      maxPain:       intelligence.maxPain > 0 ? intelligence.maxPain : null,
      maxPainSignal: intelligence.maxPainSignal,
      maxPainDistPct: intelligence.maxPainDistPct,
      atmIV:         intelligence.ivIsValid ? intelligence.atmIV : null,
      ivSignal:      intelligence.ivIsValid ? intelligence.ivSignal : 'unknown',
      vix:           intelligence.isVixLive ? intelligence.vix : null,
      vixSignal:     intelligence.vixSignal,
      agreementScore: intelligence.agreementScore,
      overallBias:   intelligence.overallBias,
      callWall:      callStrike ? { strike: callStrike, oi: callOI ?? 0 } : null,
      putWall:       putStrike  ? { strike: putStrike,  oi: putOI ?? 0 } : null,
    };

    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const completion = await groq.chat.completions.create({
        model:    MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: JSON.stringify(flowSummary) },
        ],
        temperature:     0.1,
        max_tokens:      400,
        response_format: { type: 'json_object' },
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) throw new Error('Empty LLM response');

      const parsed = JSON.parse(raw);

      // ── Validate schema ───────────────────────────────────────────────────
      if (!parsed.headline || typeof parsed.headline !== 'string') {
        throw new Error('Invalid LLM response schema — missing headline');
      }

      const result: FlowNarrativeData = {
        headline:      String(parsed.headline).slice(0, 200),
        observations:  (Array.isArray(parsed.observations) ? parsed.observations : [])
                         .slice(0, 3).map((s: any) => String(s).slice(0, 200)),
        watchPoints:   (Array.isArray(parsed.watchPoints)  ? parsed.watchPoints  : [])
                         .slice(0, 3).map((s: any) => String(s).slice(0, 200)),
        changedToday:  (Array.isArray(parsed.changedToday)  ? parsed.changedToday  : [])
                         .slice(0, 2).map((s: any) => String(s).slice(0, 200)),
        uncertainty:   parsed.uncertainty ? String(parsed.uncertainty).slice(0, 200) : null,
        generatedAt:   Date.now(),
        dataAge:       intelligence.dataAge,
        agreementScore: intelligence.agreementScore,
      };

      // ── Cache to Redis ────────────────────────────────────────────────────
      try {
        if (redis.status === 'ready' || redis.status === 'connect') {
          await redis.setex(cacheKey, NARRATIVE_TTL_SEC, JSON.stringify(result));
        }
      } catch (_e) { /* non-fatal */ }

      return result;

    } catch (error: any) {
      logger.error(`[NarrativeEngine] LLM call failed: ${error.message}`);
      // Always return something — fall back to structured narrative
      return this.buildFallbackNarrative(intelligence);
    }
  }

  /**
   * Builds a deterministic, safe narrative when LLM is unavailable.
   * Uses only verified signals — no hallucination risk.
   */
  private static buildFallbackNarrative(intelligence: FlowIntelligence): FlowNarrativeData {
    const observations: string[] = [];
    const watchPoints:  string[] = [];

    if (intelligence.pcrIsValid) {
      const direction = intelligence.pcrSignal === 'bullish'
        ? 'more put protection than call activity'
        : intelligence.pcrSignal === 'bearish'
          ? 'more call activity than put protection'
          : 'balanced call and put activity';
      observations.push(
        `The options market shows ${direction} [PCR: ${intelligence.pcrOI.toFixed(2)}].`
      );
    }

    if (intelligence.maxPain > 0) {
      const distWord = intelligence.maxPainDistPct > 0 ? 'above' : 'below';
      observations.push(
        `The expiry gravity zone is at ${intelligence.maxPain.toLocaleString('en-IN')}, ` +
        `${Math.abs(intelligence.maxPainDistPct).toFixed(1)}% ${distWord} current levels [Max Pain].`
      );
    }

    if (intelligence.ivIsValid) {
      const costWord = intelligence.ivSignal === 'elevated' ? 'expensive'
                     : intelligence.ivSignal === 'compressed' ? 'inexpensive'
                     : 'fairly priced';
      observations.push(
        `Option premiums are currently ${costWord} [ATM IV: ${intelligence.atmIV.toFixed(1)}%].`
      );
    }

    if (intelligence.maxPain > 0 && intelligence.spotPrice > 0) {
      watchPoints.push(
        `Watch ${intelligence.maxPain.toLocaleString('en-IN')} as the expiry gravity zone with ` +
        `${intelligence.dte} day${intelligence.dte !== 1 ? 's' : ''} to expiry [Max Pain].`
      );
    }

    const callStrike = intelligence.resistanceStrike ?? intelligence.meaningfulStrikes.find(s => s.reasons?.includes('highest_call_oi'))?.strike;
    const putStrike  = intelligence.supportStrike ?? intelligence.meaningfulStrikes.find(s => s.reasons?.includes('highest_put_oi'))?.strike;
    if (callStrike) {
      watchPoints.push(
        `The call wall (resistance) at ${callStrike.toLocaleString('en-IN')} represents concentrated call seller activity [Call OI].`
      );
    }
    if (putStrike) {
      watchPoints.push(
        `The put wall (support) at ${putStrike.toLocaleString('en-IN')} represents concentrated put seller defense [Put OI].`
      );
    }

    const headline = intelligence.agreementScore >= 60
      ? `${intelligence.symbol} options signal ${intelligence.overallBias} bias with ${intelligence.agreementCount} of 4 indicators in agreement.`
      : `${intelligence.symbol} options signals are mixed — no clear directional consensus yet.`;

    return {
      headline,
      observations,
      watchPoints,
      changedToday:  [],
      uncertainty:   intelligence.agreementScore < 60
        ? `Only ${intelligence.agreementCount} of 4 signals agree — treat this analysis as low confidence.`
        : null,
      generatedAt:   Date.now(),
      dataAge:       intelligence.dataAge,
      agreementScore: intelligence.agreementScore,
    };
  }
}
