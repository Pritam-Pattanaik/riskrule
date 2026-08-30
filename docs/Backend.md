# Backend

**RiskRules Platform — Backend Architecture, API Design & Server Reference**
**Document ID:** BE-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [Backend Overview](#1-backend-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Route Architecture](#4-route-architecture)
5. [Middleware Stack](#5-middleware-stack)
6. [Background Services](#6-background-services)
7. [News Engine Pipeline](#7-news-engine-pipeline)
8. [Operational Scripts](#8-operational-scripts)

---

## 1. Backend Overview

The RiskRules backend is a **Node.js + Express 5** API server providing:
- **REST API** for all CRUD operations (trades, journal, strategies, goals)
- **SSE Streams** for real-time market data push
- **AI Streaming** for AI Coach response tokens
- **Background Workers** for market polling and news ingestion
- **Admin System** with full RBAC

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | v18+ |
| Framework | Express | 5.x |
| Language | TypeScript | 5.x |
| ORM | Prisma | 6.x |
| Database | PostgreSQL (Neon Serverless) | — |
| Cache | Redis (ioredis) | — |
| Auth | JWT (jsonwebtoken + bcrypt) | — |
| AI — Groq | Groq SDK | latest |
| AI — Anthropic | `@anthropic-ai/sdk` | latest |
| Logging | Winston | — |
| Validation | Zod | — |
| Deployment | Vercel (@vercel/node) | — |

---

## 3. Project Structure

```
server/
├── prisma/
│   └── schema.prisma          # Full database schema (25 KB)
├── scripts/                   # Operational & diagnostic scripts (26 files)
├── src/
│   ├── index.ts               # Express app entry — mounts all routes + workers
│   ├── db/
│   │   └── index.ts           # Prisma client singleton
│   ├── flow/                  # Flow SSE route handlers
│   ├── lib/
│   │   ├── ai/                # AI providers, prompt builder, discipline scorer
│   │   │   ├── assemblers/    # Context assembly helpers
│   │   │   └── providers/     # Groq, Anthropic provider implementations
│   │   ├── brokers/           # Dhan and AngelOne API adapters
│   │   │   ├── dhan.ts        # Dhan sync + FIFO position aggregator
│   │   │   ├── angelone.ts    # AngelOne sync adapter
│   │   │   └── multipliers.ts # MCX contract lot-to-unit multipliers
│   │   ├── discipline/        # Discipline evaluation logic
│   │   ├── logger.ts          # Winston structured logger
│   │   └── redis.ts           # Redis client + in-memory fallback
│   ├── market/
│   │   ├── MarketDataService.ts   # Provider waterfall orchestration
│   │   ├── MarketWorker.ts        # SSE broadcaster (60s polling)
│   │   ├── MarketAIService.ts     # AI summary generation
│   │   ├── YahooNewsService.ts    # Yahoo Finance news fetcher
│   │   ├── EconomicCalendarService.ts
│   │   ├── types.ts               # Market data types
│   │   └── providers/             # Yahoo, MoneyControl, Investing.com
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   ├── inputSanitizer.ts  # Zod validation wrapper
│   │   └── aiRateLimit.ts     # Per-user AI rate limiting
│   ├── news-engine/
│   │   ├── config.ts          # RSS feed sources + scheduling config
│   │   ├── index.ts           # Engine orchestrator
│   │   ├── ai/                # Triage + scoring workers
│   │   ├── delivery/          # News delivery to clients
│   │   ├── ingestion/         # RSS fetch and parse
│   │   ├── processing/        # Dedup, filter, store
│   │   └── queue/             # Processing queue management
│   ├── routes/                # Express route handlers (18 files)
│   └── services/              # Background service workers
│       ├── CoachMemoryWriter.ts
│       ├── MarketWorker.ts
│       ├── lockService.ts     # Sync lock (prevents duplicate broker syncs)
│       └── notificationService.ts
├── tests/                     # Server-side test files
├── .env                       # Environment variables (git-ignored)
├── package.json               # Server dependencies
└── tsconfig.json              # TypeScript configuration
```

---

## 4. Route Architecture

### Route Files
| File | Prefix | Responsibility |
|---|---|---|
| `auth.ts` | `/api/auth` | Login, register, refresh |
| `trades.ts` | `/api/trades` | Trade CRUD |
| `brokers.ts` | `/api/brokers` | Broker connection, sync |
| `ai.ts` | `/api/ai` | Chat, conversations, insights |
| `marketV2.ts` | `/api/market` | Quotes, chart, sectors, AI summary |
| `news-engine.ts` | `/api/news-engine` | News feed, triage |
| `analytics.ts` | `/api/analytics` | Performance aggregations |
| `journal.ts` | `/api/journal` | Journal entry CRUD |
| `goals.ts` | `/api/goals` | Goal tracking |
| `strategies.ts` | `/api/strategies` | Strategy management |
| `notes.ts` | `/api/notes` | Quick notes |
| `reflections.ts` | `/api/reflections` | Post-market reflections |
| `tradingRules.ts` | `/api/trading-rules` | Risk rule management |
| `notifications.ts` | `/api/notifications` | Push notifications |
| `search.ts` | `/api/search` | Cross-entity search |
| `admin.ts` | `/api/admin` | Admin-only operations |
| `flow.routes.ts` | `/api/flow` | Flow SSE stream |

---

## 5. Middleware Stack

### Global Middleware (applied to all requests)
```typescript
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(requestLogger);  // Winston HTTP logging
```

### Protected Route Middleware
```typescript
// Applied to all /api/* routes except /api/auth/*
router.use(authenticate);  // Verifies JWT, sets req.userId
```

### Route-Specific Middleware
```typescript
// AI Chat — rate limited
router.post('/chat', aiRateLimiter, chatHandler);

// Input validation
router.post('/trades', validateBody(tradeSchema), createTrade);
```

---

## 6. Background Services

### MarketWorker
- Runs on a **60-second polling interval**.
- Calls `MarketDataService.getQuotes()` to fetch all tracked symbols.
- Emits `quotes` events to an EventEmitter.
- All active SSE clients receive the update via their `/api/market/stream` connection.
- Maintains an in-memory `lastCache` for instant response to new SSE connections.

### News Engine Scheduler
- Runs on a configurable cron schedule (default: every 15 minutes).
- Fetches RSS feeds from configured sources.
- Deduplicates against existing `NewsItem` records.
- Queues new articles for LLM triage and scoring.
- Saves results with full audit log.

### CoachMemoryWriter
- Triggered after trade sync and journal saves.
- Reads recent behavioral patterns from trade + journal data.
- Upserts `CoachMemory` records with pattern type, severity, and evidence.

---

## 7. News Engine Pipeline

```
RSS Ingestion (newsEngine/ingestion/)
 ├── Fetch configured RSS feeds (Moneycontrol, ET, Business Standard, NSE)
 ├── Parse article metadata (title, description, link, pubDate)
 └── Dedup against DB by article URL hash
 │
Processing Queue (newsEngine/queue/)
 ├── Batched article queue (max 10 concurrent)
 └── Priority: Breaking news > Market hours articles > Others
 │
AI Triage Worker (newsEngine/ai/triage)
 ├── Provider: Anthropic Claude Haiku
 ├── Task: Classify relevance (0-10 score), assign category
 └── Filter: Discard score < 4 (not market-relevant)
 │
AI Scoring Worker (newsEngine/ai/scoring)
 ├── Provider: Anthropic Claude Sonnet (fallback: Groq Llama-3.3)
 ├── Task: Sector impact analysis (bullish/bearish/neutral)
 └── Output: Impact scores per sector + confidence rating
 │
NewsAuditLog (Immutable)
 └── Records exact prompt + raw response + filtered output
 │
Delivery (newsEngine/delivery/)
 └── Expose via GET /api/news-engine/feed → NewsEngineFeed.tsx
```

---

## 8. Operational Scripts

All scripts are in `server/scripts/`. Run with `npx tsx scripts/<file>.ts`.

### Diagnostic Scripts
| Script | Purpose |
|---|---|
| `check_db.ts` | Verify database connectivity |
| `check_counts.ts` | Show table record counts |
| `check_markets.ts` | Test market data endpoints |
| `check_statuses.ts` | Show trade status distribution |
| `check-msgs.ts` | Check AI message counts |
| `list_users.ts` | List all user accounts |
| `inspect_trades.ts` | Inspect trade records |

### Seeding Scripts
| Script | Purpose |
|---|---|
| `seed_trades.ts` | Seed sample trade data |
| `create_test.ts` | Create test user with trades |
| `create_test_user.ts` | Create minimal test user |
| `setup_users.ts` | Setup demo user accounts |

### Cleanup Scripts
| Script | Purpose |
|---|---|
| `clear_trades.ts` | Remove all synced trades |
| `clear_duplicates.ts` | Remove duplicate trade records |
| `clear_manual.ts` | Remove manual trade entries |
| `clearScores.ts` | Reset discipline scores |
| `cleanup.js` | General cleanup utility |

### Validation Scripts
| Script | Purpose |
|---|---|
| `validateAICoachProduction.ts` | Full AI Coach production validation |
| `auditRealAIResponses.ts` | Audit AI response quality |
| `backfill.ts` | Backfill historical data |
| `test-ai.ts` | Quick AI endpoint test |
| `test-login.js` | Auth endpoint test |
| `test-admin.js` | Admin endpoint test |

---

*See [Architecture.md](./Architecture.md) for system topology. See [Deployment.md](./Deployment.md) for environment configuration.*
