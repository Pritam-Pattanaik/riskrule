# Architecture

**RiskRules Platform — Canonical System Architecture Reference**
**Document ID:** ARCH-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [High-Level Overview](#1-high-level-overview)
2. [System Topology](#2-system-topology)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Architecture](#5-database-architecture)
6. [AI Pipeline Architecture](#6-ai-pipeline-architecture)
7. [Market Data Architecture](#7-market-data-architecture)
8. [Real-Time Communication (SSE)](#8-real-time-communication-sse)
9. [Key Architectural Patterns](#9-key-architectural-patterns)
10. [Target V2 Architecture Principles](#10-target-v2-architecture-principles)
11. [Engineering Quality Scorecard](#11-engineering-quality-scorecard)

---

## 1. High-Level Overview

RiskRules is an institutional-grade trading journal and live market intelligence platform tailored for Indian financial markets (NSE/BSE/MCX). It combines:

- **Trade Journal** — Automated sync from Dhan and AngelOne brokers, manual entry, and rich annotations.
- **Analytics Engine** — Win rate, drawdown, strategy performance, and discipline scoring.
- **AI Coach (Lunar AI)** — Multi-mode behavioral analysis using LLMs with strict SEBI compliance.
- **News Intelligence Engine** — RSS ingestion, LLM triage, and relevance scoring.
- **Market Data Hub** — Real-time quotes, charts, sector heatmaps, and economic calendar.

---

## 2. System Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite)                       │
│                                                                         │
│   ┌─────────────────────┐   ┌──────────────────────┐   ┌────────────┐   │
│   │    /app/markets     │   │    /app/ai-coach     │   │ /app/journal│  │
│   │ (Market Overview,   │   │ (Trading Mentor V2,  │   │ (Trades,   │   │
│   │  Chart, Breadth,    │   │  Context Sync,       │   │  Analytics,│   │
│   │  Sectors, News)     │   │  Discipline Review)  │   │  P&L)      │   │
│   └──────────┬──────────┘   └──────────┬───────────┘   └─────┬──────┘   │
│              │ (Context Hook)          │ (Stream Client)     │ (REST)   │
└──────────────┼─────────────────────────┼─────────────────────┼──────────┘
               │                         │                     │
               ▼                         ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Express + TS)                        │
│                                                                         │
│   ┌─────────────────────┐   ┌──────────────────────┐   ┌────────────┐   │
│   │   Market Router     │   │      AI Router       │   │  Auth &    │   │
│   │   (/api/market/*)   │   │    (/api/ai/*)       │   │  Journal   │   │
│   └──────────┬──────────┘   └──────────┬───────────┘   └─────┬──────┘   │
│              │                         │                     │          │
│   ┌──────────▼──────────┐   ┌──────────▼───────────┐         │          │
│   │  MarketDataService  │   │  PromptBuilder &     │         │          │
│   │  (Waterfall + Dedup)│   │  ProviderFactory     │         │          │
│   └──────────┬──────────┘   └──────────┬───────────┘         │          │
│              │                         │                     │          │
│   ┌──────────▼──────────┐   ┌──────────▼───────────┐   ┌─────▼──────┐   │
│   │    MarketWorker     │   │  News Engine Workers │   │ Prisma ORM │   │
│   │ (SSE Broadcaster)   │   │ (Triage & Scoring)   │   │ (Postgres) │   │
│   └─────────────────────┘   └──────────────────────┘   └────────────┘   │
└──────────────┬─────────────────────────┬─────────────────────┬──────────┘
               │                         │                     │
               ▼                         ▼                     ▼
┌───────────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│   REDIS CACHE LAYER       │ │  EXTERNAL AI LLMS  │ │  MARKET PROVIDERS  │
│ - market:quotes:v2        │ │ - Groq (Llama-3.3) │ │ - Yahoo Finance    │
│ - market:sectors:v2       │ │ - Anthropic/Claude │ │ - MoneyControl     │
│ - market:ai-summary:v2    │ │ - Future: Nemotron │ │ - Investing.com    │
│ - In-Memory Stale Fallback│ │                    │ │ - News RSS Feeds   │
└───────────────────────────┘ └────────────────────┘ └────────────────────┘
```

---

## 3. Frontend Architecture

### Technology Stack
| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 12 |
| State Management | Zustand 5 |
| Routing | React Router v6 |
| Charts | Recharts + Lightweight Charts |
| HTTP Client | Fetch API + TanStack React Query |
| Component Library | Custom design system (Radix UI primitives) |

### Design System
- **Typography:** `Bricolage Grotesque` (Display), `Geist Sans` (UI), `DM Mono` (Numbers/Data)
- **Color Tokens:** CSS variables mapping to semantic Tailwind classes (`bg-surface-0`, `text-primary`, `border-border`)
- **Responsive Strategy:** Mobile-first, flex/grid, 320px–1920px fidelity

### Zustand Stores
| Store | Responsibility |
|---|---|
| `authStore` | JWT session, user profile |
| `tradeStore` | Trade records, CRUD, sync state |
| `insightStore` | AI conversations, messages, streaming |
| `newsStore` | News feed from engine |
| `marketQuoteStore` | Live market quotes |
| `flowStore` | Flow/SSE connection state |
| `uiStore` | Theme, sidebar, command palette |
| `goalStore` | Milestone tracking |
| `journalStore` | Daily journal entries |
| `brokerStore` | Broker connections management |
| `notificationStore` | Toast/notification system |
| `analyticsStore` | Dashboard analytics cache |
| `strategyStore` | Strategy management |

---

## 4. Backend Architecture

### Technology Stack
| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Framework | Express 5 |
| Language | TypeScript 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon Serverless) |
| Cache | Redis (in-memory stale-fallback) |
| Auth | Custom JWT (bcrypt) |
| Deployment | Vercel (`@vercel/node`) |
| Logging | Winston structured logger |

### Route Structure
```
/api/auth/*          — Registration, login, session management
/api/trades/*        — Trade CRUD, broker sync
/api/ai/*            — AI chat, conversations, insights
/api/market/*        — Live quotes, charts, sectors, AI summary
/api/news-engine/*   — News feed, triage results
/api/analytics/*     — Aggregated performance metrics
/api/brokers/*       — Broker connection management
/api/journal/*       — Journal entries CRUD
/api/goals/*         — Goal tracking
/api/admin/*         — RBAC-protected admin endpoints
/health              — Load balancer health probe
```

### Middleware Stack
- `auth.ts` — JWT verification on all protected routes
- `inputSanitizer.ts` — Zod schema validation
- `aiRateLimit.ts` — Per-user rate limiting on LLM endpoints

---

## 5. Database Architecture

The database uses PostgreSQL (Neon Serverless) accessed via Prisma ORM.

### Core Entity Map
```
User
 ├── Trades (broker-synced or manual)
 ├── JournalEntries (pre/post market)
 ├── Strategies
 ├── Goals
 ├── BrokerConnections
 ├── AiConversations → AiMessages
 ├── CoachMemory (persistent behavioral patterns)
 ├── Notes
 ├── Reflections
 └── TradingRules

NewsItem
 ├── NewsImpact (AI-scored relevance)
 └── NewsAuditLog (immutable LLM prompt/response log)
```

### Key Design Patterns
- **Multi-Tenancy:** All Prisma queries enforce `userId` filter — no cross-user data access possible.
- **Immutable Audit Log:** `NewsAuditLog` records exact prompt + AI response for regulatory compliance.
- **Soft Position Aggregation:** Raw broker executions are aggregated into FIFO positions before DB write.

---

## 6. AI Pipeline Architecture

```
AI COACH PAGE (src/pages/AICoach.tsx)
 │
 ├── AICoachSidebar (Conversation List)
 │    └── useInsightStore
 │
 └── AIChatWorkspace
      └── useInsightStore.sendMessage(prompt)
           ├── Optimistic UI Update
           └── streamAIInference() → POST /api/ai/chat
                │
                ├── Route Handler (server/src/routes/ai.ts)
                │    ├── Prisma: Trade History (take: 100)
                │    ├── Prisma: Journal Entries (take: 30)
                │    ├── Prisma: Active CoachMemory
                │    ├── Live Market Snapshot (marketWorker.getCache())
                │    └── promptBuilder.buildConversationContext()
                │
                ├── Provider Layer (providerFactory.ts)
                │    └── GroqProvider.streamChat()
                │
                └── SSE Token Response → Client onToken Callback
                     └── Stream Complete → Prisma save message
```

### AI Model Strategy
| Service | Primary | Fallback | Provider |
|---|---|---|---|
| News Triage | `claude-haiku-4-5` | N/A | Anthropic |
| News Scoring | `claude-sonnet-4-5` | `llama-3.1-8b` | Anthropic / Groq |
| Narrative Engine | `llama-3.3-70b-versatile` | `llama-3.1-8b` | Groq |
| Chat AI | `llama-3.3-70b-versatile` | `llama-3.1-8b-instant` | Groq |

### SEBI Compliance
All AI output operates in `EDUCATIONAL_MODE`. Directional buy/sell recommendations are stripped by the Compliance Filter. Mandatory disclaimers are appended to all market analyses.

---

## 7. Market Data Architecture

### Provider Waterfall
```
1. Redis Cache (TTL 60s) → HIT → Return immediately
2. Yahoo Finance v8 API  → Parallel batch fetch
3. MoneyControl          → Fallback on Yahoo 429
4. Investing.com         → Final fallback
5. In-Memory Stale       → Last known good data (never fails)
```

### Market Data Component Flow
```
MARKETS PAGE (Markets.tsx)
 │
 ├── MarketOverviewHero → useLiveMarketData() → GET /api/market/quotes
 │                                            → SSE /api/market/stream
 │
 ├── InteractiveMarketChart → GET /api/market/chart/:symbol
 │
 ├── LiveAISummary → GET /api/market/ai-summary (Redis TTL 300s)
 │
 ├── MarketBreadth → useLiveMarketData() [shared hook]
 │
 ├── LiveSectorHeatmap → GET /api/market/sectors (Redis TTL 120s)
 │
 └── BreakingNewsTimeline → GET /api/news-engine/feed (Zustand)
```

---

## 8. Real-Time Communication (SSE)

### Design Invariants (Must Never Be Changed)
1. **Provider Waterfall:** `MarketDataService` orchestrating Yahoo → MoneyControl → Investing.com with in-flight deduplication (`dedup()`).
2. **In-Memory Stale Resilience:** Seamless fallback to last-known-good cache on Redis/network disconnects.
3. **SSE Broadcaster:** `MarketWorker` event emitter — single emitter, all components share one connection.
4. **Data Isolation:** Enforced `userId` filtering across all Prisma queries.
5. **Regulatory Guardrails:** Mandatory SEBI educational disclaimers on all market analyses.

### Horizontal Scaling (Target)
For multi-instance deployment behind a load balancer:
1. **Leader Worker** executes `MarketWorker` polling.
2. **Publishes** to Redis channel `market:quotes:stream`.
3. **All Node.js instances** subscribe and broadcast to their SSE clients.

---

## 9. Key Architectural Patterns

| Pattern | Description |
|---|---|
| **Sync Locking** | In-memory lock during broker sync prevents duplicate syncs per user per broker |
| **FIFO Position Aggregation** | Raw broker executions → consolidated positions before DB write |
| **Unidirectional Data Flow** | Zustand stores → Components; Actions → Store mutations → Re-renders |
| **Provider Factory** | `providerFactory.ts` selects AI provider based on config/availability |
| **Optimistic UI** | Chat messages appended to UI before server acknowledgment |
| **Per-Session Abort Signals** | `AbortController` scoped strictly to conversation ID — prevents stream interleaving |

---

## 10. Target V2 Architecture Principles

1. **Single Shared Context:** All market visual components consume a unified `MarketDataProvider`.
2. **Unified Batching:** Sector and benchmark quotes share a single synchronized fetch pipeline.
3. **Per-Session State Encapsulation:** Abort signals mapped strictly to unique conversation IDs.
4. **Deep Market Integration:** Real-time quotes, sector breadths, and top headlines injected into every AI turn.
5. **Zero Silent Failures:** All providers implement circuit breakers with explicit stale/offline indicators.

---

## 11. Engineering Quality Scorecard

| Dimension | Pre-Audit | Post-V2 Target |
|---|---|---|
| System Architecture | 5.0/10 | 9.3/10 |
| Market Data Reliability | 3.5/10 | 9.5/10 |
| AI Coach Quality | 4.0/10 | 9.2/10 |
| Security Posture | 5.5/10 | 9.4/10 |
| Performance & Scalability | 4.0/10 | 9.1/10 |
| Code Quality | 6.5/10 | 9.0/10 |
| **Overall** | **5.3/10** | **9.3/10** |

---

*See [Technical.md](./Technical.md) for implementation details, [AI.md](./AI.md) for the complete AI system specification, and [TradingEngine.md](./TradingEngine.md) for the market data provider specification.*
