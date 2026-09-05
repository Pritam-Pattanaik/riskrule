# AI

**RiskRule Platform — AI Architecture, Models, Prompt Engineering & Compliance**
**Document ID:** AI-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [AI Philosophy](#1-ai-philosophy)
2. [Complete AI Architecture](#2-complete-ai-architecture)
3. [AI Models & Provider Strategy](#3-ai-models--provider-strategy)
4. [AI Coach V2 Trading Modes](#4-ai-coach-v2-trading-modes)
5. [Context Window & Token Budgeting](#5-context-window--token-budgeting)
6. [Prompt Engineering & LLM Design](#6-prompt-engineering--llm-design)
7. [News Intelligence Engine](#7-news-intelligence-engine)
8. [Option Chain & Market Flow Narrative](#8-option-chain--market-flow-narrative)
9. [AI Safety & Excluded Features](#9-ai-safety--excluded-features)
10. [SEBI Compliance Framework](#10-sebi-compliance-framework)
11. [Future AI Roadmap](#11-future-ai-roadmap)

---

## 1. AI Philosophy

**Co-Pilot, Not Autopilot.**

RiskRule AI (branded as **Lunar AI** / **AI Coach**) is designed to:
- **Analyze** trade patterns and behavioral data.
- **Filter** noise from financial news with relevance scoring.
- **Coach** on psychological pitfalls: revenge trading, FOMO, over-leveraging.
- **Never** execute trades or offer specific financial advice.

Why AI is required:
1. **News Triage:** AI instantly filters regulatory/macro news for directional sector impact.
2. **Behavioral Coaching:** AI identifies execution leaks from raw trade history patterns.
3. **Narrative Generation:** Translates complex Option Greeks and Open Interest flow into plain-English.

---

## 2. Complete AI Architecture

The AI system operates through specialized pipelines rather than a monolithic chatbot:

```
graph TD
    A[Client Request/Trigger] --> B{Router}
    B -->|News Ingestion| C[Triage Worker]
    B -->|Trade Sync| D[Discipline Scorer]
    B -->|Flow Tick| E[Narrative Engine]
    B -->|User Chat| F[Chat Context Service]

    C --> G[Anthropic Claude Haiku]
    C --> H[Scoring Worker / Claude Sonnet]

    D --> I[Heuristics Engine]

    E --> J[Groq Llama-3.3-70b]

    F --> K[Context Builder]
    K --> L[Groq Provider]

    H --> M[Compliance Filter]
    M --> N[DB / Redis Cache]
```

### Provider Interface
```typescript
interface IProvider {
  streamChat(messages: Message[], onToken: (chunk: string) => void, signal: AbortSignal): Promise<void>;
  generateText(messages: Message[]): Promise<string>;
  generateJSON<T>(messages: Message[], schema: ZodSchema): Promise<T>;
}
```

---

## 3. AI Models & Provider Strategy

The system uses a multi-provider fallback strategy to balance intelligence, speed, and cost:

| Service | Primary Model | Fallback | Provider | Context |
|---|---|---|---|---|
| **News Triage** | `claude-haiku-4-5` | N/A | Anthropic | Fast classification |
| **News Scoring** | `claude-sonnet-4-5` | `llama-3.1-8b` | Anthropic / Groq | Deep sector impact reasoning |
| **Narrative Engine** | `llama-3.3-70b-versatile` | `llama-3.1-8b` | Groq | Ultra-low latency for market ticks |
| **Chat AI** | `llama-3.3-70b-versatile` | `llama-3.1-8b-instant` | Groq | High-context journaling chat |
| **Trade Review** | Nemotron-Llama-3.1 *(planned)* | `llama-3.3-70b` | NVIDIA | Advanced reasoning |

### Provider Selection Logic
```typescript
// server/src/lib/ai/providerFactory.ts
export function getProvider(service: 'chat' | 'news' | 'score' | 'market'): IProvider {
  switch (service) {
    case 'chat':    return new GroqProvider(process.env.GROQ_API_KEY_CHAT);
    case 'news':    return new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
    case 'score':   return new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
    case 'market':  return new GroqProvider(process.env.GROQ_API_KEY_MARKET);
  }
}
```

---

## 4. AI Coach V2 Trading Modes

The AI Coach dynamically adjusts system prompts based on 12 trading modes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI COACH V2 MODE SELECTOR                       │
│  [General] [Pre-Market] [Post-Market] [Trade Review] [Journal Coach]   │
│  [Discipline] [Weekly Review] [Monthly] [Portfolio] [Psychology] [Risk]│
└────────────────────────────────────────────────────────────────────────┘
```

| Mode | System Prompt Focus | Context Injected | Output |
|---|---|---|---|
| **General Mentor** | Broad trading Q&A | 50 Trades + 30 Journals + Live Market | Conversational |
| **Pre-Market** | Global cues, gap expectations, key levels | Overnight indices + Calendar + VIX | 5-Point morning plan |
| **Post-Market Review** | Debrief, execution vs plan, net P&L | Today's trades + Today's journal | P&L Summary + Action Item |
| **Trade Analysis** | Deep-dive single trade | Trade + Historical symbol P&L | Entry/Risk/Exit/Discipline Score |
| **Journal Coach** | Emotional bias, FOMO detection | 30 Journals + CoachMemory | Emotional breakdown |
| **Discipline Coach** | Rule compliance, stop-loss adherence | Discipline history + CoachMemory | Strengths/Broken Rules |
| **Weekly Review** | Week performance, strategy win rates | 7-Day trades + journals | Trajectory + Top 3 Improvements |
| **Monthly Review** | Long-term strategy effectiveness | 30-Day trades + matrix | Asset Performance |
| **Portfolio Review** | Instrument concentration risk | All trades by symbol + sectors | Allocation + Rebalance |
| **Psychology Coach** | Cognitive reframing, loss psychology | Psychological tags + drawdowns | Empathetic framework |
| **Risk Management** | Position sizing, drawdown limits | P&L variance + max drawdown | Risk Metric Audit |
| **Educational** | Strategy definitions, SEBI rules | Minimal (general knowledge) | Definition + Indian context |

---

## 5. Context Window & Token Budgeting

Target: **< 8,000 tokens** per request (< 6% of Groq's 131k window) to guarantee sub-500ms TTFB:

| Context Block | Max Tokens | Format |
|---|---|---|
| System Identity & Rules | 400 | Immutable, strict |
| Trader Profile & Stats | 300 | Pre-computed Win Rate, Avg P&L, Sharpe |
| Trade History (Last 50) | 2,500 | `[2026-08-01] NIFTY CE \| LONG \| E:425 X:510 \| +₹8,500` |
| Journal Logs (Last 30) | 1,200 | `[2026-08-01] Mood:Calm \| Bias:BULLISH \| Note:Followed plan` |
| Coach Memory Patterns | 600 | Top 5 behavioral patterns with severity |
| Live Market & News Tape | 300 | NIFTY/Sensex/VIX + 5 headlines |
| Conversation History | 2,500 | Last 15 message turns (FIFO) |
| **Total Budget** | **~7,800** | **~6% of context** |

---

## 6. Prompt Engineering & LLM Design

### Context Hydration Pipeline
The system builds dynamic context before passing to LLMs:

```
MasterAIContext Construction
 ├── userProfile   → goals, risk rules, account stats
 ├── marketContext → session phase (pre/post market), NIFTY/VIX
 ├── tradeContext  → verified P&L, recent 50 trades (compressed)
 └── memoryContext → past warnings, behavioral patterns (top 5)
```

### Narrative Engine Context (Market Flow)
```
NarrativeEngine Context (<400 tokens)
 ├── Pre-computed PCR (Put-Call Ratio)
 ├── Max Pain strike
 ├── ATM IV (At-The-Money Implied Volatility)
 ├── Call/Put open interest walls
 └── Session bias (bullish/bearish/neutral)
```

### Response Format Enforcement
```typescript
// Strict JSON output via Groq's json_object mode
const response = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  response_format: { type: 'json_object' },
  messages: [systemPrompt, ...conversationHistory]
});
```

### Compliance Filter
Before any AI response is delivered to the client:
1. Scan for directional buy/sell recommendations.
2. Strip or replace with educational alternatives.
3. Append SEBI disclaimer.
4. Log to `NewsAuditLog` (immutable).

---

## 7. News Intelligence Engine

### Pipeline Overview
```
RSS Feed Sources
 │
 ├── Moneycontrol, Economic Times, Business Standard, NSE Announcements
 │
 ▼
Triage Worker (Claude Haiku)
 ├── Relevance scoring (0-10)
 ├── Category tagging (RBI, FII, Earnings, Global, Technical)
 └── Discard irrelevant articles (score < 4)
 │
 ▼
Scoring Worker (Claude Sonnet / Groq Fallback)
 ├── Sector impact analysis (bullish/bearish/neutral per sector)
 ├── Market direction bias assessment
 └── Confidence level rating
 │
 ▼
NewsAuditLog (Immutable)
 ├── Exact prompt sent
 ├── Raw LLM response
 └── Filtered output stored
 │
 ▼
NewsEngineFeed.tsx (Client)
 └── Filtered, categorized, scored news displayed
```

### Circuit Breaker & Fallback
- Primary: Anthropic Claude Sonnet
- If Anthropic 429/503 → Auto-switch to Groq `llama-3.3-70b`
- If Groq fails → Skip scoring, store with `confidence: null`
- Never crash the pipeline; always save what's available.

---

## 8. Option Chain & Market Flow Narrative

### Open Interest Signal Processing
```
Raw OI Data (NSE Option Chain API)
 │
 ├── PCR Calculation: sum(put_oi) / sum(call_oi)
 ├── Max Pain: strike with min aggregate loss for writers
 ├── IV Surface: ATM IV, 1-week IV, VIX correlation
 └── Call/Put walls: top 3 strikes by OI concentration
 │
 ▼
NarrativeEngine (Groq Llama-3.3-70b)
 ├── Input: Compressed JSON summary (<400 tokens)
 ├── Output: Plain-English narrative for traders
 └── SEBI Educational Mode only
```

### Interpretation Table
| PCR Value | Market Bias | Interpretation |
|---|---|---|
| > 1.3 | Bullish | Excess put buying = overhedging; potential short squeeze |
| 0.9 – 1.2 | Neutral | Balanced; await directional catalyst |
| < 0.7 | Bearish | Excess call buying = overconfidence; potential correction |

---

## 9. AI Safety & Excluded Features

The following are strictly excluded to maintain focus and safety:

| Feature | Reason Excluded |
|---|---|
| Voice Input / TTS | Distracting in active trading; keyboard-first |
| Chart Image OCR | Hallucination-prone; verified OHLCV data available |
| Social Chat Sharing | Trading journals contain confidential financial data |
| Custom Persona Prompting | Increases prompt injection risk |
| Automated Trade Signals | Violates SEBI advisory regulations |
| Real-time position modifications | Out of scope; UI-only coaching |

---

## 10. SEBI Compliance Framework

All AI outputs automatically append:

> *"This analysis is for educational purposes only and does not constitute financial advice or investment recommendations under SEBI regulations. RiskRule AI analyzes historical execution data to assist with process discipline. All market investments are subject to market risks."*

Rules enforced by the Compliance Filter:
- No `BUY`, `SELL`, `SHORT`, `LONG` as action commands.
- No price targets stated as guaranteed outcomes.
- No guaranteed return claims.
- Sector analysis allowed; ticker-specific predictions prohibited.

---

## 11. Future AI Roadmap

| Feature | Timeline | Description |
|---|---|---|
| NVIDIA Nemotron Provider | Q4 2026 | Advanced reasoning for trade review & portfolio analysis |
| Proactive Coach Alerts | Q4 2026 | Push notification if daily loss limit approaching |
| Behavioral Pattern Evolution | Q1 2027 | Coach memory learns and updates patterns weekly |
| Multi-language Support | Q2 2027 | Hindi/Telugu market commentary |
| Voice Analysis Mode | Q3 2027 | Analyze recorded pre-market audio plans |

---

*See [TradingEngine.md](./TradingEngine.md) for market data provider details. See [Architecture.md](./Architecture.md) for system topology.*
