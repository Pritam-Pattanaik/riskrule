# Future Roadmap

**RiskRule Platform — Product & Engineering Roadmap**
**Document ID:** ROAD-001
**Version:** 2.0
**Status:** Active | Last Updated: 2026-08-16

---

## Roadmap Philosophy

Prioritization is based on:
1. **User Impact** — How many active traders benefit?
2. **Revenue Potential** — Does it enable monetization?
3. **Technical Feasibility** — Can it be built without major architectural changes?
4. **Risk** — What is the probability of failure?

---

## Phase 1 — V2 Stabilization (Current Priority)

> Target: Q3 2026

| Task | Status | Description |
|---|---|---|
| Frontend-Backend Wiring | 🚧 In Progress | Wire all Zustand store mock calls to real Express API endpoints |
| Discipline Engine Migration | 🚧 In Progress | Move behavioral scoring from frontend to backend worker |
| Security Hardening | 📋 Planned | Fix SEC-01 through SEC-04 identified in Security Audit |
| E2E Test Suite | 📋 Planned | Playwright tests for all critical user flows |
| Market Data Stabilization | ✅ Done | Yahoo waterfall + Redis caching + SSE broadcaster |
| PnL Calculation Fixes | ✅ Done | MCX multiplier + per-order brokerage |

---

## Phase 2 — Intelligence Upgrade (Q4 2026)

### AI Enhancements
- **NVIDIA Nemotron Provider** — Advanced reasoning for trade review and portfolio analysis modes
- **Proactive Coach Alerts** — Push notifications when approaching daily loss limit
- **Behavioral Pattern Evolution** — Coach Memory learns and updates patterns weekly
- **AI Feedback Loop** — ThumbsUp/Down ratings improve prompt quality over time

### Market Data Enhancements
- **Option Chain Live Feed** — Real-time PCR, Max Pain, and IV surface from NSE API
- **Economic Calendar Live** — RBI, US Fed, earnings calendar with AI impact scoring
- **Global Indices Expansion** — S&P 500, Nasdaq, SGX Nifty, Nikkei, DAX

---

## Phase 3 — Platform Expansion (Q1 2027)

### Broker Integrations
- **Zerodha (Kite Connect)** — India's largest retail broker
- **Interactive Brokers** — US & Global equity trading
- **Alpaca** — Commission-free US markets
- **5paisa / HDFC Securities** — Additional Indian brokers

### Real-Time Data
- **WebSocket Migration** — Replace SSE polling with persistent WebSocket connections
- **Polygon.io Integration** — US market real-time options data
- **SEBI/NSE Direct Feed** — Official market data license for index derivatives

---

## Phase 4 — Monetization (Q2 2027)

### SaaS Model
- **Stripe Integration** — Subscription billing (Free / Pro / Institutional tiers)
- **Usage Metering** — AI Coach queries metered per plan tier
- **Team/Firm Accounts** — Prop trading firm multi-user management

### Premium Features
- **White-label Reports** — PDF trade performance reports for CA/chartered accounts
- **Tax Reporting** — ITR-compatible capital gains statements
- **API Access** — Programmatic trade import/export for power users

---

## Phase 5 — Intelligence Platform (Q3–Q4 2027)

### Advanced AI
- **Institutional AI Coach** — Trade analysis to the depth of a quantitative trading psychologist
- **Multi-language Support** — Hindi, Telugu, Tamil market commentary
- **Voice Analysis Mode** — Analyze recorded pre-market audio plans
- **Live Rule Enforcement** — Lock broker access via API when daily loss limit is hit

### Platform Scale
- **Multi-instance Deployment** — Redis Pub/Sub SSE broadcasting for 10,000+ concurrent users
- **Global CDN** — Edge caching for international traders
- **Mobile Apps** — React Native iOS + Android companion apps

---

## Architectural Non-Negotiables

The following components are system invariants and **must never be replaced or dismantled**:

1. **Provider Waterfall** — Yahoo → MoneyControl → Investing.com with `dedup()` in-flight coalescing.
2. **Stale-Resilient Cache** — Last-known-good fallback on Redis/network disconnects.
3. **SSE Broadcaster** — `MarketWorker` single emitter — all components share one connection.
4. **Data Isolation** — `userId` filter on all Prisma queries without exception.
5. **Regulatory Guardrails** — SEBI educational disclaimers on all AI market analyses.

---

## Completed Milestones

| Milestone | Date | Notes |
|---|---|---|
| V1 Prototype | 2026-06 | In-memory mock backend |
| Prisma Schema V2 | 2026-07 | 16+ models, AI News Engine tables |
| AI News Engine | 2026-07 | RSS ingestion + LLM triage/scoring |
| Dhan Broker Integration | 2026-07 | With PnL calculation fix |
| AngelOne Integration | 2026-08 | Initial connection |
| Admin RBAC | 2026-08 | Full role-based admin system |
| Market Data Waterfall | 2026-08 | Yahoo + Redis + SSE |
| Repository Cleanup V2 | 2026-08 | Production docs structure |

---

*See [Changelog.md](./Changelog.md) for detailed release history.*
