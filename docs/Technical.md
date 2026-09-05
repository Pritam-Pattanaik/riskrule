# Technical

**RiskRule Platform — Complete Technical Reference**
**Document ID:** TECH-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [Project Vision & Philosophy](#1-project-vision--philosophy)
2. [Development Status](#2-development-status)
3. [Complete Folder Structure](#3-complete-folder-structure)
4. [Frontend Technical Reference](#4-frontend-technical-reference)
5. [Backend Technical Reference](#5-backend-technical-reference)
6. [Database Technical Reference](#6-database-technical-reference)
7. [Performance Engineering](#7-performance-engineering)
8. [Known Limitations & Technical Debt](#8-known-limitations--technical-debt)

---

## 1. Project Vision & Philosophy

### Vision
To become the ultimate operating system for independent traders, empowering them with data-driven insights to reduce emotional trading and improve win rates consistently over time.

### Mission
To bridge the gap between simplistic spreadsheet-based trade journals and prohibitively expensive institutional terminals (Bloomberg). RiskRule provides a unified platform to log trades, analyze performance, understand macroeconomic conditions, and receive unbiased, data-driven AI coaching.

### Problem Statement
Retail traders consistently underperform due to psychological pitfalls: lack of discipline, poor position sizing, and emotional "revenge trading." Existing journals merely record PnL. They fail to provide contextual market analysis, correlate market breadth with trade success, or offer proactive, personalized coaching.

### Target Users
- Intermediate to advanced retail stock, options, and futures traders.
- Day traders, swing traders, and active investors.
- Traders who approach trading as a professional business.

### Design Philosophy
**Premium, High-Density, Low-Noise.** Drawing inspiration from Vercel, Linear, and Stripe — not from chaotic legacy retail trading platforms.

### Engineering Philosophy
**Strict Types, Modular, and Future-Proof.** TypeScript eliminates runtime ambiguity. Strict separation of concerns allows frontend development via mock services before wiring to real API. Financial applications have zero tolerance for data corruption.

---

## 2. Development Status

**Current Version:** v2.0-alpha (Transition Phase)
**Phase:** Backend API, Database Replacement & AI Pipeline Integration.

The project transitioned from V1 (in-memory mock backend + LocalStorage) to V2 powered by a real Node.js/Express backend, PostgreSQL (Neon), and Prisma.

### Completion Status

#### ✅ Completed (~65%)
- Complete frontend design system, responsive layouts, premium aesthetic
- Zustand state management architecture (all stores)
- Prisma database schema (finalized + migrated)
- AI News Engine (RSS ingestion, triage, scoring, circuit breakers)
- Backend JWT authentication
- Broker sync (Dhan + AngelOne with PnL calculation fixes)
- Admin RBAC system
- News Engine pipeline with SEBI compliance

#### 🚧 In Progress (~15%)
- Frontend-to-backend wiring (replacing mock calls with real API)
- Discipline Engine migration to backend worker
- Flow visualization component

#### 📋 Pending (~20%)
- Live broker OAuth integrations (Zerodha, Alpaca)
- Real-time WebSocket data connections
- Stripe subscription/billing integration
- Full Lunar AI integration on frontend chat

---

## 3. Complete Folder Structure

```
journal/                           # Application root
├── .archive/                      # Historical archived material
│   ├── agent-sessions/           # Past AI orchestration sessions
│   ├── audits/                    # Bug investigation reports (fixed)
│   ├── data/                      # Raw JSON data dumps
│   └── academic/                  # SIP academic documentation
├── docs/                          # Production documentation
│   ├── 00_INDEX.md               # Master documentation index
│   ├── Architecture.md           # System architecture
│   ├── Frontend.md               # Frontend spec & design system
│   ├── Backend.md                # Backend architecture
│   ├── Database.md               # Database schema
│   ├── API.md                    # API reference
│   ├── AI.md                     # AI architecture
│   ├── TradingEngine.md          # Market data & broker engine
│   ├── Security.md               # Security guide
│   ├── Deployment.md             # Deployment & env setup
│   ├── Testing.md                # Testing strategy
│   ├── Technical.md              # This document
│   ├── Contributing.md           # Contributor guide
│   ├── Changelog.md              # Version history
│   ├── FutureRoadmap.md          # Roadmap
│   ├── PRD.md                    # Product Requirements
│   └── Blueprint.md              # Engineering master blueprint
├── public/                        # Static assets (favicons, manifest)
├── scripts/                       # Frontend build utilities
├── server/                        # Backend Express application
│   ├── prisma/
│   │   └── schema.prisma         # Database schema definition
│   ├── scripts/                   # Operational & diagnostic scripts
│   ├── src/
│   │   ├── db/                   # Prisma client singleton
│   │   ├── flow/                 # Flow SSE routes
│   │   ├── lib/
│   │   │   ├── ai/              # AI providers, prompt builder
│   │   │   ├── brokers/         # Dhan, AngelOne adapters
│   │   │   └── discipline/      # Discipline evaluation
│   │   ├── market/              # MarketDataService, MarketWorker
│   │   ├── middleware/          # Auth, rate limit, sanitizer
│   │   ├── news-engine/         # News ingestion pipeline
│   │   ├── routes/              # Express API route handlers
│   │   └── services/            # Background services
│   └── tests/                    # Server-side tests
├── src/                           # Frontend React application
│   ├── App.tsx                   # Root component + routing
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global design system
│   ├── assets/                   # Images, SVGs
│   ├── components/               # Reusable UI components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # API clients, utilities
│   ├── pages/                    # Route-level page views
│   ├── stores/                   # Zustand state stores
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Helper functions
│   └── workers/                  # Web workers (expectancy)
├── tests/                         # Frontend E2E tests
├── README.md                      # Developer README
├── index.html                     # Vite entry HTML
├── package.json                   # Root dependencies & scripts
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # Frontend TS config
├── tsconfig.node.json             # Node/server TS config
├── eslint.config.js               # ESLint configuration
├── postcss.config.js              # PostCSS configuration
└── vercel.json                    # Vercel deployment config
```

---

## 4. Frontend Technical Reference

### Custom Hooks
| Hook | File | Purpose |
|---|---|---|
| `useAutoSync` | `useAutoSync.ts` | Periodic data sync trigger |
| `useFlowSSE` | `useFlowSSE.ts` | SSE connection for flow data |
| `useLiveMarketData` | `useLiveMarketData.ts` | Unified market quote hook |
| `useMarketData` | `useMarketData.ts` | Market data fetching logic |
| `useMarketStatus` | `useMarketStatus.ts` | Market open/closed status |
| `useNotificationSound` | `useNotificationSound.ts` | Notification audio |
| `useUrlState` | `useUrlState.ts` | URL-based state persistence |

### Key Libraries
| File | Purpose |
|---|---|
| `lib/api.ts` | Base HTTP client, request/response handling |
| `lib/aiStreamClient.ts` | Streaming AI response client (SSE) |
| `lib/analytics.ts` | Client-side analytics helpers |
| `lib/cn.ts` | `clsx` + `tailwind-merge` utility |
| `lib/dateUtils.ts` | Date formatting and calculation |
| `lib/disciplineUtils.ts` | Discipline score helpers |
| `lib/expectancyClient.ts` | Expectancy calculation client |
| `lib/prefetch.ts` | Data prefetching on hover |
| `lib/notify.ts` | Sonner toast notifications |
| `lib/osUtils.ts` | OS detection (Mac/Win keyboard shortcuts) |
| `lib/brokers/brokerRegistry.ts` | Broker connection management |

---

## 5. Backend Technical Reference

### Server Entry Point (`server/src/index.ts`)
- Initializes Express app
- Mounts all route handlers
- Starts `MarketWorker` background polling
- Starts `NewsEngine` ingestion scheduler
- Handles graceful shutdown

### AI Lib (`server/src/lib/ai/`)
| File | Purpose |
|---|---|
| `AIProvider.ts` | Base provider interface |
| `ChatPromptRegistry.ts` | All 12 mode system prompts |
| `ContextService.ts` | Context assembly |
| `StreamController.ts` | SSE streaming controller |
| `TradeContextSerializer.ts` | Compress trades into <2500 tokens |
| `analytics.ts` | Server-side analytics functions |
| `disciplineSchema.ts` | Zod schema for discipline scoring |
| `disciplineScorer.ts` | Heuristic-based discipline evaluation |
| `promptBuilder.ts` | Builds `MasterAIContext` |
| `provider.ts` | Groq/Anthropic provider implementations |
| `providerFactory.ts` | Selects provider by service type |

### Seed & Migration Scripts
| File | Purpose |
|---|---|
| `src/seed.ts` | Full sample data seed |
| `src/seed-admin.ts` | Admin user creation |
| `src/seed-trader.ts` | Demo trader account |
| `src/migrate-coach-memory.ts` | CoachMemory schema migration |

---

## 6. Database Technical Reference

### Prisma Schema Location
`server/prisma/schema.prisma` — 25 KB, ~50 models.

### Primary Models
| Model | Purpose |
|---|---|
| `User` | User account, role, preferences |
| `Trade` | Executed trade records |
| `JournalEntry` | Daily pre/post market journal |
| `Strategy` | User-defined trading strategies |
| `Goal` | Performance goals & milestones |
| `BrokerConnection` | Encrypted broker API credentials |
| `AiConversation` | AI chat session metadata |
| `AiMessage` | Individual chat messages |
| `CoachMemory` | Persistent behavioral patterns |
| `NewsItem` | Ingested news articles |
| `NewsImpact` | AI-scored news sector impact |
| `NewsAuditLog` | Immutable AI prompt/response log |
| `Note` | Quick notes |
| `Reflection` | Post-market reflections |
| `TradingRule` | User-defined risk rules |
| `Notification` | Push notification records |

---

## 7. Performance Engineering

### Target SLAs
| Metric | Target |
|---|---|
| Market Data TTFR (cold) | < 1.5s |
| Redis Cache Hit | < 15ms |
| AI Streaming TTFB | < 450ms (Groq Llama-3.3) |
| DB Query p95 | < 25ms |
| Client Frame Rate | 60fps constant |

### Optimized Pagination Pattern
```typescript
// Cursor-based pagination for message history
export async function getConversationMessages(conversationId: string, cursor?: string) {
  return prisma.aiMessage.findMany({
    where: { conversationId },
    take: 50,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}
```

### Request Waterfall Comparison
```
BEFORE (Serial Burst — 30+ requests, 6+ seconds):
[Mount] ──► GET /quotes  ──► Yahoo Batch 1 (2.4s)
        ──► GET /sectors ──► Yahoo Batch 2 (2.8s)
        ──► GET /chart   ──► Yahoo Chart   (1.2s)

AFTER (Unified Coalescing — 1 request, <0.8s):
[Mount] ──► GET /all-quotes ──► Redis Hit / Single Yahoo Batch (0.8s)
        ──► Staggered Chart (Delayed 30s)
```

---

## 8. Known Limitations & Technical Debt

| Limitation | Impact | Priority |
|---|---|---|
| Single Groq API key | Rate-limited to ~30 RPM; fails under concurrent load | P1 |
| Yahoo Finance dependency | 429 rate limits during market open | P1 |
| No persistent WebSocket | SSE reconnection adds latency on network blips | P2 |
| localStorage JWT fallback | XSS vulnerability in `aiStreamClient.ts` | P2 |
| `console.log` PII leakage | GDPR/DPDP risk in production logs | P2 |
| No E2E test automation | Manual verification only | P2 |
| Single-process SSE | Caps concurrent users at ~50-100 | P3 |
| No Redis in development | Falls back to in-memory; memory leak risk | P3 |

---

*See [Architecture.md](./Architecture.md) for system topology. See [Deployment.md](./Deployment.md) for environment setup.*
