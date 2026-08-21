# System Architecture Audit & Dependency Map
**TradeVault Platform — Version 2.0 Engineering Architecture**  
**Document ID:** ARCH-2026-001  
**Category:** Architecture & System Topology  
**Date Created:** 2026-08-03  
**Status:** Approved  
**Author:** Principal Software Architect & AI Systems Engineer  
**Target Quality Score:** 9.5+/10

---

## 1. System Topology Overview

TradeVault is an institutional-grade trading journal and live market intelligence platform tailored for Indian financial markets (NSE/BSE).

### 1.1 High-Level Architecture Diagram

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

## 2. Target Architecture V2 Principles

- **Single Shared Context:** All market visual components consume data from a unified `MarketDataProvider`.
- **Unified Batching:** Sector and benchmark quotes share a single synchronized fetch pipeline.
- **Per-Session State Encapsulation:** Abort signals and streaming tokens are mapped strictly to unique conversation IDs.
- **Deep Market Integration:** Real-time benchmark quotes, sector breadths, and top news headlines are injected into every AI conversation turn.
