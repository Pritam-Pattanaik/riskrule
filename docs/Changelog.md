# Changelog

All notable changes to TradeVault are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased] — v2.1 (In Progress)

### Planned
- NVIDIA Nemotron provider for advanced trade review mode
- Proactive AI Coach push alerts (daily loss limit approaching)
- Playwright E2E automated test suite
- Stripe subscription & billing integration
- WebSocket real-time data connections (replacing SSE polling)
- Full Lunar AI frontend-backend wire-up

---

## [2.0.0-alpha] — 2026-08-16

### Architecture (Breaking Changes from V1)
- **Migrated** from in-memory mock backend to real Node.js/Express + PostgreSQL (Neon Serverless)
- **Replaced** LocalStorage data layer with Prisma ORM + PostgreSQL persistence
- **Implemented** Prisma schema with 16+ models including AI News Engine tables
- **Added** JWT-based authentication with bcrypt password hashing
- **Implemented** RBAC with `USER`, `SUB_ADMIN`, `ADMIN`, `SUPER_ADMIN` roles

### AI System
- **Implemented** AI News Engine — RSS ingestion, Claude Haiku triage, Claude Sonnet scoring
- **Added** `NewsAuditLog` — immutable AI prompt/response log for SEBI compliance
- **Implemented** AI Coach V2 with 12 trading modes (General, Pre-Market, Post-Market, etc.)
- **Added** `CoachMemory` — persistent behavioral pattern tracking
- **Implemented** multi-provider fallback (Groq → Anthropic → Groq fallback)
- **Fixed** `AbortController` scope bug causing stream interleaving on regenerate

### Market Data
- **Implemented** `MarketDataService` with Yahoo Finance → MoneyControl → Investing.com waterfall
- **Added** Redis caching with in-memory stale fallback
- **Added** in-flight request deduplication (`dedup()` function)
- **Implemented** SSE broadcaster (`MarketWorker`) for real-time quote push
- **Added** token bucket rate limiter for Yahoo Finance API

### Broker Integration
- **Fixed** critical MCX PnL calculation bug — CRUDEOILM was 10x underreported
  - Root cause: Dhan returns MCX quantities in lots; multiplier (×10, ×100) was missing
- **Fixed** brokerage inflation bug — ₹20 was charged per execution instead of per order
  - Root cause: Fallback brokerage logic did not track `orderId` for partial fills
- **Implemented** FIFO position aggregation — raw executions consolidated into positions
- **Added** `getContractMultiplier()` function for MCX instrument lot → unit conversion
- **Implemented** AngelOne broker integration

### Admin System
- **Implemented** full admin dashboard with user management
- **Added** `SystemHealth` page with real-time subsystem status
- **Implemented** admin-only API routes with RBAC enforcement

### Repository
- **Reorganized** documentation into canonical `docs/` structure
- **Archived** historical bug investigation reports to `.archive/audits/`
- **Archived** AI agent session files to `.archive/agent-sessions/`
- **Created** production documentation index (`docs/00_INDEX.md`)

---

## [1.0.0] — 2026-06-01 (V1 Prototype)

### Initial Release
- Frontend design system: React 18 + Vite + Tailwind CSS + Framer Motion
- Zustand state management (all stores)
- In-memory mock backend with LocalStorage persistence
- Trade journal with manual entry
- Analytics dashboard (win rate, drawdown, PnL charts)
- AI Coach chat interface (mocked responses)
- Market Intelligence Hub (static/simulated data)
- Premium dark-mode UI inspired by Linear and Vercel

---

*For roadmap, see [FutureRoadmap.md](./FutureRoadmap.md)*
