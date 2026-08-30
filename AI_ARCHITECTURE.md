# RiskRule AI Architecture

## Overview

RiskRule uses a dual-model AI architecture with intelligent routing. Every AI call goes through a central router that selects the most suitable provider based on the nature of the task.

```
                    AI ROUTER
                        |
             +----------+----------+
             |                     |
             v                     v
        FAST TASKS             DEEP TASKS
             |                     |
             v                     v
           GROK                NEMOTRON
                                  |
                                  |
                         FUTURE REPLACEMENT
                                  |
                                  v
                               MINIMAX
```

---

## Why Grok for Fast Tasks?

Grok (via Groq SDK) is optimized for **low-latency, conversational AI**:
- Sub-2 second responses for chat
- Excellent at pattern-matching, terminology, quick analysis
- Streaming support for perceived performance
- Used where user is waiting and speed > depth

**Grok handles:**
- General coaching chat (psychology, risk, quick Q&A)
- Trade discipline evaluation (structured JSON)
- Conversation title generation
- News article triage/classification
- Dashboard AI widgets
- Daily review reports

---

## Why Nemotron for Deep Tasks?

Nemotron (NVIDIA) is optimized for **complex multi-variable reasoning**:
- Extended thinking for complex problems
- Better at synthesizing multiple data sources
- Superior for long-form structured output
- Latency tolerance acceptable (results cached or user is reading)

**Nemotron handles:**
- Pre-market briefings (multi-source synthesis)
- Post-market debrief analysis
- Performance deep analysis
- Strategy reviews
- Weekly and monthly reports
- Market AI summaries
- News impact/sector scoring
- NIFTY/BANKNIFTY analysis
- Option chain interpretation
- Institutional insights

---

## Provider Abstraction

All AI calls go through the `AIProvider` interface:

```typescript
interface AIProvider {
  streamChat(messages, onChunk, signal?): Promise<void>
  generateText(messages): Promise<string>
  generateJSON(messages): Promise<any>
}
```

Current implementations:
- `GroqProvider` — fast tasks
- `NemotronProvider` — deep tasks
- `MiniMaxProvider` — stub only (future)

---

## Routing Logic

The `AIRouter` classifies tasks in 4 layers:

1. **Explicit Override** — `forceProvider: 'fast' | 'deep'` (admin/testing)
2. **Complexity Signals** — Deep keywords in ANY chat message escalate to Nemotron (e.g., "NIFTY", "option chain", "weekly analysis")
3. **Static Table** — Task type mapped directly to provider
4. **Safe Default** — Falls back to fast (Grok)

---

## Environment Configuration

```bash
# Current configuration (in .env)
FAST_PROVIDER=groq        # Grok via Groq SDK
DEEP_PROVIDER=nemotron    # NVIDIA Nemotron

# API Keys
GROQ_API_KEY=...
NEMOTRON_API_KEY=...

# Future (not required now)
# MINIMAX_API_KEY=...
```

---

## How to Switch Deep Provider (Future)

When ready to migrate from Nemotron → MiniMax:

**Step 1:** Obtain MiniMax API key

**Step 2:** Implement `MiniMaxProvider` (stub already exists at `server/src/lib/ai/providers/MiniMaxProvider.ts`)

**Step 3:** Update `.env`:
```bash
DEEP_PROVIDER=minimax
MINIMAX_API_KEY=your-key-here
```

**That's it.** No business logic, routes, prompts, or frontend changes required.

---

## Financial Data Principle

The AI never performs calculations. The backend calculates:
- P&L, win rate, profit factor, expectancy
- Discipline scores, risk metrics, drawdowns
- Position sizing, stop-loss distances

Then sends pre-computed structured data to the AI, which only **interprets, reasons, and explains**.

---

## Testing

Run the AI router tests (no API calls, pure logic):

```bash
cd server
npx tsx src/lib/ai/__tests__/routerTests.ts
```

Expected output: **25/25 tests pass**

---

## Files Reference

| File | Role |
|------|------|
| `server/src/lib/ai/AIRouter.ts` | Central routing logic |
| `server/src/lib/ai/AIProvider.ts` | Provider interface |
| `server/src/lib/ai/providerFactory.ts` | Provider instantiation |
| `server/src/lib/ai/providers/GroqProvider.ts` | Fast provider |
| `server/src/lib/ai/providers/NemotronProvider.ts` | Deep provider (current) |
| `server/src/lib/ai/providers/MiniMaxProvider.ts` | Future provider (stub) |
| `server/src/lib/ai/__tests__/routerTests.ts` | Router test suite |
