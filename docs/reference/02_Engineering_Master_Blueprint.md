# RiskRule â€” Flow Intelligence
# Engineering Master Blueprint (EMB)
# Version 1.0

> **Document Type:** Engineering Master Blueprint â€” Single Source of Truth
> **PRD Reference:** `01_Product_Requirement_Document.md`
> **Status:** Approved for Engineering Sprint
> **Date:** August 2026
> **Classification:** Internal â€” Engineering Confidential

---

## Critical Reading Note

This blueprint was derived from the PRD after complete line-by-line analysis. Where the PRD contains open questions, ambiguities, or research gaps, this document resolves them. Every resolved item is explicitly marked.

PRD gaps resolved: OQ-1, OQ-2, OQ-3, OQ-5, RG-001, RG-002, RG-003
PRD inconsistencies corrected: 4 architectural conflicts documented in Section 2.

---

# 1. Executive Summary

## 1.1 Engineering Philosophy

The PRD's five product laws map directly to engineering principles:

| Product Law | Engineering Principle |
|-------------|----------------------|
| Intelligence Over Data | Every API response carries computed insight, never raw numbers alone |
| Context Before Complexity | Progressive data loading â€” critical data first, deep analytics on demand |
| Opinionated by Default | Server-side defaults; client never assumes |
| Personal Before Generic | User context injected at service layer, not component level |
| Speed is a Feature | Performance budget enforced at CI/CD; no release ships above threshold |

> **Build the data infrastructure of a Bloomberg, the AI intelligence of a Perplexity, and the UX of a Linear â€” running for 100,000 concurrent Indian options traders on expiry day.**

## 1.2 Architecture Vision

Flow Intelligence is built on a layered event-driven architecture with three distinct planes:

```
PRESENTATION PLANE
  React 18 SPA â€” /app/flow â€” flowStore + useFlowSSE + useFlowAlerts
        â”‚
APPLICATION PLANE
  Node.js/Express â€” Flow Service Modules â€” AI Orchestration â€” Alert Engine
        â”‚
DATA PLANE
  Market Data Worker (Provider Adapter) â†’ Redis â†’ TimescaleDB â†’ PostgreSQL
```

## 1.3 System Goals

| Goal | Measurable Target | PRD Source |
|------|-------------------|------------|
| Data Freshness | OI data â‰¤ 30s stale | Â§15.3 |
| First Load | TTI < 1.5s cold, < 300ms warm | Â§15.1 |
| Concurrency | 10,000 simultaneous WS connections | Â§15.2 |
| Availability | 99.9% during 9:00â€“3:30 PM IST | Â§15.4 |
| AI Accuracy | 100% factual claims verifiable | Â§10.4 |
| Alert Latency | < 15s from trigger event | Â§11.2 F-010 |
| Scale Ceiling | 100,000+ users without redesign | EMB requirement |

## 1.4 Resolved PRD Open Questions

### OQ-1 â†’ Dedicated Route /app/flow

**Decision:** Flow Intelligence is a standalone route at `/app/flow`, not a tab within Markets.

**Rationale:** The PRD's layout template (Â§9.5) shows a full-screen workspace with command bar, tab strip, and 7-panel hierarchy â€” this cannot coexist with the Markets page layout. The session-adaptive interface (Â§8.3) requires ownership of the page lifecycle. The PRD's north star metric measures "opens Flow Intelligence" â€” implying a distinct navigable destination. RiskRule's sidebar already supports named routes (`/markets`, `/journal`) â€” adding `/flow` is architecturally consistent.

### OQ-2 â†’ V1 Supports 4 Symbols

**Decision:** V1.0 supports exactly 4 index symbols â€” Nifty 50, Bank Nifty, Fin Nifty, Nifty MidCap Select.

**Rationale:** These are the 4 most actively traded weekly F&O contracts in India. Data provider cost scales per symbol â€” 4 is the optimal entry point. The UI tab strip fits exactly 4 items at all screen sizes â‰¥ 375px. Persona 4 (Riya) explicitly lists these 4. Stock options deferred to V3.0 per PRD Â§19.1.

**Configuration:** Stored as an ordered enum in system configuration, not hardcoded in UI.

### OQ-3 â†’ Two-Tier AI Brief

**Decision:** Shared index-level brief (cached, every 15 min) + personalized position overlay (on-demand, per user).

**Rationale:** Fully user-specific briefs at 100,000 users/5 min = prohibitively expensive LLM cost. Fully generic brief loses the Personalization Gap differentiator. Two-tier: generate one index brief cached for all users, append a 2â€“3 sentence "Your Position Context" from a cheaper mini-call that reads the user's open positions.

**Cost model:** 4 index-level calls/hour (one per symbol). Personal overlay triggered only on page load when user has active OPTIONS positions.

### OQ-5 â†’ Bundled with RiskRule Premium

**Decision:** Flow Intelligence is included in RiskRule Premium â€” not separately gated.

**Rationale:** Core value (personalization via RiskRule history) only works for logged-in active users. Separate subscription creates friction. PRD business metric (Â§21.2) measures "premium conversion influenced by Flow" â€” meaning Flow is a conversion driver, not a separate revenue stream. Sensibull charges â‚¹2,999/mo standalone â€” bundling makes RiskRule Premium more compelling.

### RG-001 â†’ Dealer Gamma from OI Proxy

**Decision:** Greeks Dashboard uses OI-weighted aggregate gamma as a proxy for dealer gamma exposure. All gamma-related UI language reads "Market Gamma Exposure" â€” never "Dealer Gamma."

**Rationale:** Accurate dealer net gamma is not publicly available in India (PRD Â§22.1 RG-001). OI-weighted gamma provides directional context without making claims about institutional identity.

### RG-002 â†’ "Notable Flow" Not "Institutional Flow"

**Decision:** The flow events feed is labeled "Notable Flow" in the UI, with AI explanations phrased as "likely institutional activity" or "large position build" â€” never claiming to identify institutional vs retail definitively.

**Rationale:** NSE OI data does not distinguish participant categories (PRD Â§22.1 RG-002). All interpretations are inference-based.

### RG-003 â†’ TrueData as Primary Provider

**Decision:** TrueData subscription as the primary data provider. Abstracted behind interface for zero-effort switching.

**Rationale:** TrueData offers real-time tick data, NSE options data, and India VIX at competitive subscription pricing. Exact pricing to be confirmed during V0.5 procurement (PRD Â§22.1 RG-003 action item).

## 1.5 PRD Architecture Inconsistencies â€” Corrected

### Inconsistency 1: WebSocket vs SSE

**PRD says:** WebSocket server for all real-time data.
**Codebase has:** SSE via `initSSE()` in `marketQuoteStore.ts` already in production.

**Resolution: Dual Transport.** SSE for unidirectional market data pushes (OI, PCR, VIX, Greeks). WebSocket only for the Alert Engine's bidirectional subscription management. This preserves the existing SSE infrastructure while adding WS only where bidirectionality is required.

### Inconsistency 2: Microservices vs Monolith

**PRD implies:** Separate services for REST, WebSocket, AI, Worker.
**Codebase has:** Single monolithic Node.js/Express server.

**Resolution: Modular Monolith.** Each logical service is a self-contained module with clean interfaces. Extraction to microservices is the V2.0+ migration path â€” deferred until production traffic justifies infrastructure overhead.

### Inconsistency 3: TimescaleDB vs Plain PostgreSQL

**PRD says:** TimescaleDB for time-series data.
**Codebase has:** Plain PostgreSQL with Prisma.

**Resolution: Two-Phase Migration.** V0.5â€“V1.0: OI history in plain PostgreSQL with composite indexes. V1.1+: Enable TimescaleDB extension on existing PostgreSQL instance. TimescaleDB is an extension â€” not a service replacement. Migration is additive, zero downtime.

### Inconsistency 4: LLM Provider

**PRD says:** GPT-4o primary, Claude fallback.
**Codebase uses:** Anthropic Claude as existing AI Coach model.

**Resolution: Configurable via environment variable** (`FLOW_LLM_PRIMARY`, `FLOW_LLM_FALLBACK`). Model-agnostic provider interface. Default aligned with existing AI Coach model to consolidate LLM costs.

---

# 2. Product-to-Engineering Mapping

## 2.1 Feature Engineering Map â€” Priority 1 (MVP)

### F-001: Index Selector

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1 |
| Engineering | Client-side symbol context in `flowStore`. Server pre-warms all 4 symbols in Redis at 9:00 AM market open |
| Implementation | Symbol change dispatches context update â†’ re-subscription on SSE â†’ REST re-fetch. Optimistic UI shows cached data immediately while fresh data loads |
| Performance | All 4 symbols pre-loaded in Redis. Switch serves from cache < 50ms |
| Test | Automated: symbol switch measured by custom performance marks (< 200ms). Manual: rapid switching 10Ã— â€” verify no stale bleed |
| Acceptance | Switch < 200ms cached; skeleton < 50ms on cache miss; last symbol persisted across refresh |

### F-002: PCR Card

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1, Â§9.4 |
| Engineering | Server-side PCR calculation (OI-based and volume-based) via SSE push every 30s and REST on demand |
| Implementation | PCR Calculator runs after each tick batch. Output in Redis Hash `pcr:{symbol}:{expiry}`. SSE stream includes `pcr_update` event. Frontend updates PCR Card via Zustand slice â€” no full re-render |
| Formula | OI PCR = Î£PutOI / Î£CallOI. Volume PCR = Î£PutVol / Î£CallVol. Calculated per expiry and aggregate |
| Test | QA-A-002: Cross-validate with NSE official data. Automated: known OI dataset validates formula |
| Acceptance | OI PCR and Volume PCR displayed separately. Color at thresholds 0.8 / 1.2. Sparkline last 5 days. Update â‰¤ 30s |

### F-003: Max Pain Display

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1 |
| Engineering | Scheduled background calculation every 5 minutes. Result cached in Redis with 300s TTL |
| Implementation | Max Pain = strike K minimizing Î£[max(0, Kâ€“S) Ã— CallOI + max(0, Sâ€“K) Ã— PutOI] across all strikes. Background job updates `maxpain:{symbol}:{expiry}` in Redis. REST endpoint reads from cache |
| Data Dependency | Requires full option chain OI for the target expiry at calculation time |
| Test | QA-A-003: Calculate from recorded expiry dataset with known outcome. Verify match |
| Acceptance | Strike displayed with distance from current price. Update every 5 min. Proximity color indicator |

### F-004: IV Dashboard

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1 |
| Engineering | Current ATM IV from tick data. IV Percentile requires 252-day historical dataset backfilled before launch |
| Implementation | ATM IV = average of ATM CE and PE implied volatility at current tick. Percentile = count(days in 252 where IV < current) / 252. Historical dataset in TimescaleDB `iv_history` table |
| Dependency | IV backfill script must complete before V1.0 launch. Part of deployment checklist |
| Test | Manual verification of IV percentile against independently computed value |
| Acceptance | Current IV, IV percentile, 5-day trend. Status: COMPRESSED / NORMAL / ELEVATED / EXTREME |

### F-005: OI Heatmap

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1, Â§11.2, Â§9.4 |
| Engineering | Virtualized grid rendering of up to 80 strikes Ã— 2 option types. Partial cell updates via React transitions |
| Implementation | Canvas-based or SVG rendering for performance. Color scale normalized to visible window (not absolute OI). On SSE tick, only changed cells update via `useTransition` to avoid main thread block. ATM strike auto-centered on symbol change |
| Virtualization | Off-screen strikes rendered lazily. Window scrolls to ATM on symbol/expiry change |
| Test | QA-P-006: Render < 300ms via Chrome Performance API. QA-F-003: Hover values cross-validated against REST |
| Acceptance | Renders < 300ms. Partial update (no full re-render on OI tick). ATM always centered. Hover tooltip. Keyboard navigable |

### F-006: OI Change Table

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1 |
| Engineering | Sortable table with server-computed OI deltas (intraday and day-over-day) |
| Implementation | OI change = (current_OI â€“ session_open_OI). Session baseline snapshot at 9:15 AM IST stored in Redis. Day-over-day: compare to previous day's 3:30 PM snapshot from TimescaleDB. Both values included in SSE payload |
| Test | Automated: known OI at two timestamps â†’ verified delta |
| Acceptance | Three sort modes: by Strike, by Intraday Change, by Day Change. Emerald/red coloring. 30s refresh |

### F-007: AI Morning Brief

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1, Â§11.2, Â§10 |
| Engineering | Cron job at 8:30 AM IST. Two-tier brief (shared index + personal overlay) |
| Implementation | Cron: `30 3 * * 1-5` UTC. Context Assembler builds prompt. LLM call â†’ parse â†’ validate â†’ store in PostgreSQL + Redis. Personal overlay: triggered on page load if user has open OPTIONS trades. Mini-prompt < 500 tokens reads position + CoachMemory |
| Fallback | Previous brief with staleness indicator. If no brief exists: structured fallback with raw data |
| Test | QA-F-004: Appears within 3s. Fallback shown when LLM unavailable |
| Acceptance | By 8:30 AM. One headline, three observations, one action. Expand for full analysis. Manual refresh |

### F-008: Option Chain

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1, Â§9.4 |
| Engineering | Virtualized table. Greeks server-computed. REST for initial load, SSE for updates |
| Implementation | TanStack Virtual renders only visible rows. Greeks in DM Mono. ITM surface tint via CSS token. Expiry selector triggers new REST fetch + SSE re-subscription. Row flash animation on OI change > 5% via Framer Motion |
| Greeks | All computed server-side by Greeks Engine. Never computed client-side |
| Test | QA-P-002: Chain load < 500ms. QA-F-006: Sort reorders correctly |
| Acceptance | ATM Â± 5 default view. Sortable. Max pain marked. Highest OI marked. ITM tint. Expiry selector |

### F-009: VIX Card

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1 |
| Engineering | India VIX subscribed as separate instrument from provider. SSE push every 5s |
| Implementation | Market Data Worker subscribes to `INDIA VIX` instrument alongside option contracts. VIX published to Redis `vix:current` and SSE `vix_update` event |
| Test | Cross-validate with NSE official page during live market hours |
| Acceptance | Real-time VIX. 24h change. 5-day sparkline. Threshold color: <12 green, 12-20 neutral, 20-25 amber, >25 red |

### F-010: Smart Alerts

| Dimension | Specification |
|-----------|---------------|
| PRD Section | Â§11.1, Â§11.2, Â§12.6 |
| Engineering | WebSocket for bidirectional alert subscription. Server-side condition evaluation per tick. Delivery via WebSocket + optional push notification |
| Implementation | Alert configs in PostgreSQL `option_alerts`. Alert Engine loads active configs for ticker from Redis cache (warmed at start, invalidated on CRUD). Condition evaluation O(1) per alert per tick. On breach: write `alert_history` â†’ push WebSocket â†’ enqueue push notification. Cooldown via Redis TTL |
| Test | QA-F-005: Alert fires within 15s. QA-S-003: Circuit breaker state correct |
| Acceptance | Critical alerts persist. Warning auto-dismiss 8s. Alert history. One-tap action. Max 50 active alerts/user |

## 2.2 Feature Engineering Map â€” Priority 2 (V1.1)

| Feature | Engineering Approach | Key Technical Decisions |
|---------|---------------------|------------------------|
| F-011 Institutional/Notable Flow Feed | OI anomaly detector: flags OI changes > N lots (configurable) in single refresh cycle. Stored in Redis list, last 100 events per symbol | N = configurable threshold per symbol (Nifty default: 50,000 lots) |
| F-012 My Positions Overlay | Reads open OPTIONS trades from existing `trades` table. Maps strike + expiry to heatmap coordinate. Position marker as SVG overlay layer | Filter: `instrumentType = 'OPTIONS' AND status = 'open'` |
| F-013 IV Surface Chart | 3D surface via D3 contour projection on Canvas. Data: IV per (strike, expiry) matrix from REST | Rendered client-side from REST payload. No SSE â€” IV surface refreshed every 5 min via REST poll |
| F-014 Intraday OI Replay | TimescaleDB 1-min OI snapshots. Frontend animates via `requestAnimationFrame`. Speed controls: 1Ã—, 5Ã—, 10Ã— | Available post-market only. Data fetched in one REST call for entire session |
| F-015 Greeks Dashboard | Server aggregates: Î£Î” Ã— OI, Î£Î“ Ã— OI across all strikes. OI-weighted gamma proxy for dealer gamma. REST + Redis cache 1-min TTL | Clearly labeled "Market Gamma Exposure" â€” not "Dealer Gamma" (RG-001 resolution) |
| F-016 Multi-expiry PCR | PCR Calculator extended with expiry filter. REST endpoint adds `?expiry=weekly\|monthly\|all` parameter | Separate Redis keys per expiry: `pcr:{symbol}:{expiry_date}` |
| F-017 IV Skew Chart | Plot IV vs. Delta (normalized). D3 line chart. REST payload every 5 min | Delta normalization: |Delta| values 0.1 to 0.5 on x-axis |
| F-018 Post-Market Review | EOD summary job at 4:00 PM IST. Builds from TimescaleDB day data. Stored as `brief_type = 'CLOSING'`. Auto-triggers journal draft event | Journal integration: fires event to `journalStore` with structured context |

## 2.3 Feature Engineering Map â€” Priority 3 (V2.0)

| Feature | Engineering Approach |
|---------|---------------------|
| F-019 Multi-Symbol Grid | Layout manager component. 1Ã—1, 1Ã—2, 2Ã—2 grid. Each cell is an independent symbol context with its own SSE subscription slice |
| F-020 Position AI Coach | Extended AI context: full position history + win rate by strategy from `trades` table. On-demand, not scheduled. Streaming response |
| F-021 Scenario Modeler | Client-side Black-Scholes calculator (Delta, P&L at price X). Input: current Greeks + hypothetical price slider. Instant recalculation via `useMemo` |
| F-022 Historical Backtesting | TimescaleDB time-travel queries. Date range picker â†’ fetch historical OI snapshots â†’ replay mode. Server paginates large date ranges |
| F-023 Export & Reports | Server-side PDF via Puppeteer. Dedicated `/api/v1/flow/report` endpoint renders report template â†’ PDF â†’ streaming download |
| F-024 API Access | Dedicated API key model. Separate rate limit tier (header-based vs cookie-based auth). OpenAPI spec auto-generated from route definitions |

## 2.4 PRD Philosophy-to-Engineering Enforcement

| PRD Principle | Enforcement Mechanism |
|---------------|----------------------|
| Scan in 5 seconds | Performance budget: FCP < 800ms enforced in GitHub Actions CI |
| One truth per view | Server reconciles conflicting signals before sending to client. Never send ambiguous state |
| Earn the click | Drill-down data lazy-loaded only on user interaction â€” never pre-fetched speculatively |
| Silent confidence | Skeleton screens on every async panel. Empty states always include explanation + action |
| Contextual by default | User trade context injected at middleware level via `req.flowContext` object |
| No jargon gates | Every metric field in API response includes a `tooltip` field with plain-English explanation |

---

# 3. Complete System Blueprint

## 3.1 Full System Architecture

```
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘  CLIENT LAYER (Browser â€” React 18 + Vite)                       â•‘
â•‘                                                                  â•‘
â•‘  /app/flow                                                       â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â•‘
â•‘  â”‚  flowStore   â”‚  â”‚ useFlowSSE  â”‚  â”‚ useFlowAlerts (WS)  â”‚   â•‘
â•‘  â”‚  (Zustand)   â”‚  â”‚ (EventSrc)  â”‚  â”‚ (WebSocket)         â”‚   â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â•‘
â•‘         â”‚ REST (axios)               â”‚ SSE + WebSocket          â•‘
â•šâ•â•â•â•â•â•â•â•â•â•ªâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•ªâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          â”‚                           â”‚
â•”â•â•â•â•â•â•â•â•â•â–¼â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–¼â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘  NGINX REVERSE PROXY                                            â•‘
â•‘  SSL Termination Â· Rate Limiting Â· CORS Â· Static Assets        â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•¤â•â•
                                                               â”‚
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–¼â•â•—
â•‘  APPLICATION LAYER (Node.js / Express â€” Modular Monolith)      â•‘
â•‘                                                                 â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”â•‘
â•‘  â”‚  REST API   â”‚  â”‚  SSE Bridge  â”‚  â”‚  WebSocket Server      â”‚â•‘
â•‘  â”‚/api/v1/flow â”‚  â”‚  /sse/flow   â”‚  â”‚  /ws/flow              â”‚â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜â•‘
â•‘         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜              â•‘
â•‘                          â”‚                                      â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â•‘
â•‘  â”‚               FLOW SERVICE MODULES                        â”‚  â•‘
â•‘  â”‚                                                           â”‚  â•‘
â•‘  â”‚  FlowOverviewService  â”‚  OIService   â”‚  IVService        â”‚  â•‘
â•‘  â”‚  PCRService           â”‚  MaxPain     â”‚  AlertService     â”‚  â•‘
â•‘  â”‚  GreeksEngine         â”‚  FlowEvents  â”‚  PositionContext  â”‚  â•‘
â•‘  â”‚  FlowAIOrchestrator   â”‚              â”‚                   â”‚  â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â•‘
â•‘                          â”‚                                      â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â•‘
â•‘  â”‚          AUTH + TIER MIDDLEWARE                           â”‚  â•‘
â•‘  â”‚  JWT Validation Â· flowContext injection Â· Premium check  â”‚  â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•¤â•â•
                                                               â”‚
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–¼â•â•—
â•‘  CACHING / MESSAGING LAYER (Redis 7)                           â•‘
â•‘                                                                 â•‘
â•‘  Pub/Sub: ch:NIFTY Â· ch:BANKNIFTY Â· ch:FINNIFTY Â· ch:MIDCAP  â•‘
â•‘                                                                 â•‘
â•‘  Cache Keys:                                                    â•‘
â•‘  oi:{sym}:{exp}:{strike}:{type}  â†’ current OI state           â•‘
â•‘  pcr:{sym}:{exp}                 â†’ PCR (OI + vol based)       â•‘
â•‘  maxpain:{sym}:{exp}             â†’ max pain strike (5m TTL)   â•‘
â•‘  iv:{sym}:{exp}                  â†’ IV surface snapshot        â•‘
â•‘  baseline:oi:{sym}:{exp}:{date}  â†’ session open baseline      â•‘
â•‘  alert:state:{alertId}           â†’ cooldown flag (300s TTL)   â•‘
â•‘  alert:config:{userId}:{sym}     â†’ cached alert configs       â•‘
â•‘  ai:brief:{sym}:{type}           â†’ brief (1800s TTL)          â•‘
â•‘  session:{userId}                â†’ connection state           â•‘
â•‘  vix:current                     â†’ India VIX (5s TTL)         â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•¤â•â•
                                                               â”‚
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–¼â•â•—
â•‘  DATA INGESTION LAYER (MarketDataWorker)                        â•‘
â•‘                                                                 â•‘
â•‘  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â•‘
â•‘  â”‚  PROVIDER ADAPTER (Pluggable Interface)                    â”‚ â•‘
â•‘  â”‚  TrueDataAdapter  |  KiteConnectAdapter  |  MockAdapter   â”‚ â•‘
â•‘  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â•‘
â•‘                                                                 â•‘
â•‘  Per-tick pipeline:                                             â•‘
â•‘  Validate â†’ GreeksEngine â†’ Redis Update â†’ Pub/Sub              â•‘
â•‘           â†’ TimescaleDB (async) â†’ AlertEngine                  â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•¤â•â•
                                                               â”‚
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–¼â•â•—
â•‘  EXTERNAL INTEGRATIONS                                          â•‘
â•‘  TrueData (market data)  â”‚  OpenAI/Anthropic  â”‚  FCM (push)  â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•¤â•â•
                                                               â”‚
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–¼â•â•—
â•‘  PERSISTENCE LAYER                                              â•‘
â•‘  PostgreSQL (Prisma)          â”‚  TimescaleDB (extension)       â•‘
â•‘  User data Â· Alerts Â· Briefs  â”‚  OI history Â· IV Â· PCR ticks  â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
```

## 3.2 Data Flow: Live OI Tick

```
1. TrueData API â†’ pushes OptionTick (NIFTY 23000CE, OI: 1,234,567)
2. Provider Adapter â†’ validates tick schema via Zod
3. Greeks Engine â†’ Î”, Î“, Î˜, V from Black-Scholes in < 5ms
4. Redis HSET â†’ updates oi:NIFTY:2026-08-14:23000:CE
5. Redis PUBLISH â†’ channel ch:NIFTY (fan-out to SSE Bridge)
6. SSE Bridge â†’ streams OI_UPDATE to all subscribed clients
7. TimescaleDB â†’ async INSERT to oi_history (non-blocking)
8. Alert Engine â†’ evaluates all active NIFTY alert conditions
   â”œâ”€â”€ Breach: write alert_history + WebSocket push
   â””â”€â”€ No breach: continue
9. flowStore â†’ receives OI_UPDATE â†’ updates state slice
10. React â†’ re-renders only changed heatmap cell via useTransition
```

## 3.3 Data Flow: AI Morning Brief

```
1. Cron 8:30 AM IST (cron: 30 3 * * 1-5 UTC)
2. Context Assembler:
   a. Full OI snapshot from Redis (all 4 symbols)
   b. PCR, Max Pain, VIX from Redis
   c. Previous day OI from TimescaleDB
   d. Economic calendar events from existing markets data
3. Prompt Constructor â†’ template: MORNING_BRIEF (< 2,000 tokens)
4. LLM API call (configured provider)
5. Response Parser:
   a. Validates JSON structure (headline, observations[], action)
   b. Cross-validates all cited values against Redis (< 2% tolerance)
   c. Rejects if divergence detected â†’ fallback to previous brief
6. Store in PostgreSQL flow_ai_briefs + Redis ai:brief:{sym}:morning
7. Personal Overlay (on user page load if open OPTIONS positions):
   a. Reads open OPTIONS trades from PostgreSQL
   b. Fetches OI context for each position's strike
   c. Reads CoachMemory patterns
   d. Mini-prompt (< 500 tokens) â†’ append position context
```

## 3.4 Data Flow: Smart Alert

```
Per OI_TICK from Redis Pub/Sub:
1. Load user alert configs for symbol from Redis cache
   (populated from PostgreSQL on first miss, TTL: 300s)
2. For each active alert:
   a. Evaluate condition against current tick value
   b. Check cooldown: Redis alert:state:{alertId} exists?
   c. If condition met AND cooldown clear:
      i.   Insert alert_history (PostgreSQL)
      ii.  Set Redis alert:state:{alertId} = FIRED (TTL: 300s)
      iii. Push ALERT_FIRED via user's WebSocket connection
      iv.  Enqueue mobile push notification (V2.0)
      v.   Trigger AI mini-brief for alert explanation
```

## 3.5 Session-Adaptive State Machine

The application maintains a `MarketSession` state that drives UI behavior changes:

```
State Machine:

PRE_MARKET (6:00â€“9:14 AM IST)
  â†’ Triggers: Morning Brief pre-generation begins at 8:30 AM
  â†’ UI: Calm palette, preparation mode, brief is primary panel

MARKET_OPEN (9:15â€“9:44 AM IST)
  â†’ Triggers: Session OI baseline snapshot at 9:15 AM
  â†’ UI: Heightened visual intensity, OI change panel prominent

MID_SESSION (9:45 AMâ€“1:59 PM IST)
  â†’ Triggers: Alert monitoring mode
  â†’ UI: Monitoring mode â€” interface quiets down, alerts are primary

POWER_HOUR (2:00â€“3:29 PM IST)
  â†’ Triggers: Max pain tracker becomes primary
  â†’ UI: Max pain proximity indicator prominent, theta decay visible

CLOSING (3:30 PM IST)
  â†’ Triggers: EOD snapshot worker starts, AI closing brief generated
  â†’ UI: Replay mode activates, next-day preparation panel appears

POST_MARKET (3:30â€“5:00 PM IST)
  â†’ UI: Historical replay, journal integration, next-day levels

AFTER_HOURS (5:00 PM+ IST)
  â†’ UI: Historical analysis mode, no live data indicators
```

Session state computed server-side via `MarketHoursScheduler` and delivered to clients via SSE `session_update` event.

---

# 4. Complete Folder Structure

## 4.1 Frontend Modules

```
src/
â”œâ”€â”€ pages/
â”‚   â””â”€â”€ Flow.tsx                         [NEW] Main Flow Intelligence route

â”œâ”€â”€ components/flow/
â”‚   â”œâ”€â”€ command-bar/
â”‚   â”‚   â”œâ”€â”€ FlowCommandBar.tsx           Always-visible top bar
â”‚   â”‚   â”œâ”€â”€ IndexSelector.tsx            4-symbol tab switcher
â”‚   â”‚   â”œâ”€â”€ SessionIndicator.tsx         Market session badge
â”‚   â”‚   â””â”€â”€ AISummaryPill.tsx            One-sentence AI summary
â”‚   â”‚
â”‚   â”œâ”€â”€ morning-brief/
â”‚   â”‚   â”œâ”€â”€ MorningBrief.tsx             AI brief container
â”‚   â”‚   â”œâ”€â”€ BriefHeadline.tsx            Bold conclusion sentence
â”‚   â”‚   â”œâ”€â”€ BriefObservations.tsx        3-bullet observations
â”‚   â”‚   â”œâ”€â”€ BriefAction.tsx              Recommended action chip
â”‚   â”‚   â”œâ”€â”€ BriefExpanded.tsx            Full analysis drawer
â”‚   â”‚   â””â”€â”€ PersonalOverlay.tsx          User position context addendum
â”‚   â”‚
â”‚   â”œâ”€â”€ overview/
â”‚   â”‚   â”œâ”€â”€ OverviewPanel.tsx            Metrics card row container
â”‚   â”‚   â”œâ”€â”€ PCRCard.tsx                  PCR + gauge + sparkline
â”‚   â”‚   â”œâ”€â”€ MaxPainCard.tsx              Max pain + proximity
â”‚   â”‚   â”œâ”€â”€ IVCard.tsx                   IV + percentile + status
â”‚   â”‚   â””â”€â”€ VIXCard.tsx                  India VIX + thresholds
â”‚   â”‚
â”‚   â”œâ”€â”€ oi/
â”‚   â”‚   â”œâ”€â”€ OIPanel.tsx                  OI Intelligence container
â”‚   â”‚   â”œâ”€â”€ OIHeatmap.tsx                Canvas/SVG heatmap
â”‚   â”‚   â”œâ”€â”€ OIHeatmapCell.tsx            Individual strike cell
â”‚   â”‚   â”œâ”€â”€ OIHeatmapTooltip.tsx         Hover tooltip + AI insight
â”‚   â”‚   â”œâ”€â”€ OIChangeTable.tsx            Sortable OI delta table
â”‚   â”‚   â”œâ”€â”€ OIHistoryChart.tsx           Intraday OI evolution chart
â”‚   â”‚   â””â”€â”€ StrikeDetailDrawer.tsx       Full strike data drawer
â”‚   â”‚
â”‚   â”œâ”€â”€ flow-events/
â”‚   â”‚   â”œâ”€â”€ FlowEventsPanel.tsx          Notable flow feed container
â”‚   â”‚   â”œâ”€â”€ FlowEventCard.tsx            Individual event + AI note
â”‚   â”‚   â””â”€â”€ FlowEventFilters.tsx         Time range + size filters
â”‚   â”‚
â”‚   â”œâ”€â”€ option-chain/
â”‚   â”‚   â”œâ”€â”€ OptionChainPanel.tsx         Chain + expiry selector
â”‚   â”‚   â”œâ”€â”€ OptionChainTable.tsx         Virtualized CE/Strike/PE table
â”‚   â”‚   â”œâ”€â”€ OptionChainRow.tsx           Single strike row (memo)
â”‚   â”‚   â”œâ”€â”€ OptionChainFilters.tsx       ITM/OTM filter chips
â”‚   â”‚   â””â”€â”€ ExpirySelector.tsx           Expiry date dropdown
â”‚   â”‚
â”‚   â”œâ”€â”€ iv/                              [V1.1]
â”‚   â”‚   â”œâ”€â”€ IVPanel.tsx
â”‚   â”‚   â”œâ”€â”€ IVSurfaceChart.tsx           D3 3D surface
â”‚   â”‚   â”œâ”€â”€ IVSkewChart.tsx              IV smile chart
â”‚   â”‚   â””â”€â”€ IVTermStructure.tsx          Short vs long-dated IV
â”‚   â”‚
â”‚   â”œâ”€â”€ greeks/                          [V1.1]
â”‚   â”‚   â”œâ”€â”€ GreeksDashboard.tsx
â”‚   â”‚   â”œâ”€â”€ DeltaProfileChart.tsx
â”‚   â”‚   â””â”€â”€ GammaWallChart.tsx
â”‚   â”‚
â”‚   â”œâ”€â”€ positions/
â”‚   â”‚   â”œâ”€â”€ MyPositionsPanel.tsx         Personal positions overlay
â”‚   â”‚   â”œâ”€â”€ PositionCard.tsx             Position + P&L + AI note
â”‚   â”‚   â””â”€â”€ PositionHeatmapMarker.tsx    SVG overlay on heatmap
â”‚   â”‚
â”‚   â”œâ”€â”€ alerts/
â”‚   â”‚   â”œâ”€â”€ AlertsPanel.tsx              Alert management
â”‚   â”‚   â”œâ”€â”€ AlertCard.tsx                Alert config card
â”‚   â”‚   â”œâ”€â”€ AlertCreator.tsx             Alert creation form
â”‚   â”‚   â”œâ”€â”€ AlertToast.tsx               Toast notification
â”‚   â”‚   â””â”€â”€ AlertHistory.tsx             Alert log drawer
â”‚   â”‚
â”‚   â””â”€â”€ shared/
â”‚       â”œâ”€â”€ FlowSkeleton.tsx             Skeleton for all panels
â”‚       â”œâ”€â”€ FlowEmptyState.tsx           Empty state + action
â”‚       â”œâ”€â”€ FlowErrorState.tsx           Error state + retry
â”‚       â”œâ”€â”€ DataStalenessIndicator.tsx   Age of last data update
â”‚       â”œâ”€â”€ AIBadge.tsx                  Indigo AI content marker
â”‚       â”œâ”€â”€ ConfidenceIndicator.tsx      5-dot confidence display
â”‚       â””â”€â”€ MetricTooltip.tsx            Plain-English explanation

â”œâ”€â”€ stores/
â”‚   â””â”€â”€ flowStore.ts                     [NEW] Zustand store for Flow

â”œâ”€â”€ hooks/
â”‚   â”œâ”€â”€ useFlowSSE.ts                    [NEW] SSE subscription
â”‚   â”œâ”€â”€ useFlowAlerts.ts                 [NEW] WebSocket alerts
â”‚   â””â”€â”€ useFlowSession.ts               [NEW] Market session state

â”œâ”€â”€ types/
â”‚   â””â”€â”€ flow.types.ts                    [NEW] All Flow TypeScript types

â””â”€â”€ lib/
    â””â”€â”€ flow.api.ts                      [NEW] REST API client
```

## 4.2 Backend Modules

```
server/src/
â”œâ”€â”€ routes/
â”‚   â””â”€â”€ flow.routes.ts                   [NEW] /api/v1/flow/* router

â”œâ”€â”€ services/flow/
â”‚   â”œâ”€â”€ FlowOverviewService.ts           PCR + MaxPain + IV + AI
â”‚   â”œâ”€â”€ OIService.ts                     OI chain + heatmap + change
â”‚   â”œâ”€â”€ IVService.ts                     IV surface + skew + percentile
â”‚   â”œâ”€â”€ PCRService.ts                    PCR formulas
â”‚   â”œâ”€â”€ MaxPainService.ts                Max pain algorithm
â”‚   â”œâ”€â”€ InstitutionalFlowService.ts      Flow event detection
â”‚   â”œâ”€â”€ PositionContextService.ts        User position OI overlay
â”‚   â””â”€â”€ AlertService.ts                 Alert CRUD + state

â”œâ”€â”€ market/providers/
â”‚   â”œâ”€â”€ MarketDataProvider.interface.ts  [NEW] Provider contract
â”‚   â”œâ”€â”€ TrueDataProvider.ts             [NEW] TrueData adapter
â”‚   â”œâ”€â”€ KiteConnectProvider.ts          [NEW] Kite Connect adapter
â”‚   â””â”€â”€ MockProvider.ts                 [NEW] Testing mock
â”œâ”€â”€ market/
â”‚   â””â”€â”€ MarketDataWorker.ts             [NEW] Ingestion coordinator

â”œâ”€â”€ analytics/
â”‚   â”œâ”€â”€ GreeksEngine.ts                  Black-Scholes Greeks
â”‚   â”œâ”€â”€ OIAnalytics.ts                   OI change + buildup detect
â”‚   â”œâ”€â”€ PCRCalculator.ts                 PCR formulas
â”‚   â”œâ”€â”€ MaxPainCalculator.ts             Max pain algorithm
â”‚   â”œâ”€â”€ IVPercentileEngine.ts            252-day IV percentile
â”‚   â”œâ”€â”€ FlowEventDetector.ts             Unusual OI detector
â”‚   â””â”€â”€ MarketStructureAnalyzer.ts       Long/Short buildup classify

â”œâ”€â”€ ai/
â”‚   â”œâ”€â”€ FlowAIOrchestrator.ts            Master AI coordinator
â”‚   â”œâ”€â”€ ContextAssembler.ts              Builds LLM context payload
â”‚   â”œâ”€â”€ PromptTemplates.ts               All typed prompt templates
â”‚   â”œâ”€â”€ LLMProvider.interface.ts         Model-agnostic LLM contract
â”‚   â”œâ”€â”€ OpenAIProvider.ts                OpenAI adapter
â”‚   â”œâ”€â”€ AnthropicProvider.ts             Claude adapter
â”‚   â”œâ”€â”€ HallucinationChecker.ts          Post-response validation
â”‚   â”œâ”€â”€ ConfidenceScorer.ts              Signal strength assessment
â”‚   â””â”€â”€ BriefScheduler.ts               Cron job management

â”œâ”€â”€ streaming/
â”‚   â”œâ”€â”€ SSEBridge.ts                     Redis Pub/Sub â†’ SSE fan-out
â”‚   â”œâ”€â”€ WebSocketServer.ts               Alert subscription handler
â”‚   â””â”€â”€ ConnectionManager.ts            Active connections tracker

â”œâ”€â”€ alerts/
â”‚   â”œâ”€â”€ AlertEngine.ts                   Per-tick condition evaluator
â”‚   â”œâ”€â”€ AlertConditionEvaluator.ts       Type-specific condition logic
â”‚   â”œâ”€â”€ AlertDeliveryService.ts          WS + push notification
â”‚   â””â”€â”€ AlertConfigCache.ts             Redis-backed alert cache

â”œâ”€â”€ workers/
â”‚   â”œâ”€â”€ MarketHoursScheduler.ts          IST-aware session scheduler
â”‚   â”œâ”€â”€ AIBriefWorker.ts                 Scheduled brief generation
â”‚   â”œâ”€â”€ EODSnapshotWorker.ts             End-of-day OI baseline
â”‚   â”œâ”€â”€ DataBackfillWorker.ts            Historical data backfill
â”‚   â””â”€â”€ CleanupWorker.ts                Expired data cleanup

â”œâ”€â”€ db/timescale/
â”‚   â”œâ”€â”€ OIHistoryRepository.ts           TimescaleDB OI queries
â”‚   â”œâ”€â”€ IVHistoryRepository.ts           TimescaleDB IV queries
â”‚   â””â”€â”€ PCRHistoryRepository.ts          TimescaleDB PCR queries

â”œâ”€â”€ middleware/
â”‚   â””â”€â”€ flowAuth.middleware.ts           [NEW] Tier access check

â””â”€â”€ lib/
    â”œâ”€â”€ redis.ts                         [NEW/EXTEND] Redis singleton
    â””â”€â”€ timescale.ts                     [NEW] TimescaleDB pool
```

---

# 5. Technology Stack

## 5.1 Frontend

| Category | Technology | Version | Justification | Alternative |
|----------|-----------|---------|---------------|-------------|
| Framework | React | 18.x | Existing codebase. Concurrent mode for non-blocking OI updates | â€” |
| Build | Vite | 5.x | Existing. HMR < 50ms. Native ESM | â€” |
| Language | TypeScript | 5.x | Existing. Type safety critical for financial data â€” no implicit coercions | â€” |
| Styling | Tailwind CSS | 3.x | Existing. Utility-first for dense financial layouts | â€” |
| State | Zustand | 4.x | Existing. Selective subscriptions prevent over-rendering | Redux (rejected: boilerplate) |
| Routing | React Router | 6.x | Existing. `/app/flow` added as lazy route | â€” |
| Animation | Framer Motion | 11.x | Existing. Declarative, matches PRD micro-animation spec | GSAP (licensing cost) |
| Charts | Recharts | 2.x | Existing. Sparklines, OI change charts | â€” |
| IV Surface | D3.js | 7.x | NEW V1.1. Canvas-based 3D surface â€” Recharts insufficient | Three.js (overkill), Plotly (bundle size) |
| Virtual Scroll | TanStack Virtual | 3.x | NEW. Option chain: 200+ strikes. Better TS than react-window | react-window |
| SSE Client | EventSource | Browser | No library. Existing SSE pattern | â€” |
| WebSocket | WebSocket | Browser | Native. Custom reconnect hook for alerts channel | socket.io-client |
| HTTP | Axios | 1.x | Existing. Interceptors for JWT refresh | fetch (acceptable) |
| Forms | React Hook Form | 7.x | Existing. Alert creation form | â€” |
| Validation | Zod | 3.x | Existing. Type-safe API response parsing | â€” |
| Icons | Lucide React | Latest | Existing. Consistent icon language | â€” |
| Notifications | Sonner | Latest | Existing. Alert toasts via existing Toaster component | â€” |
| Date/Time | date-fns | 3.x | Existing. IST session detection | â€” |
| Testing | Vitest + RTL | Latest | Existing. Vite-native | â€” |

## 5.2 Backend

| Category | Technology | Version | Justification | Alternative |
|----------|-----------|---------|---------------|-------------|
| Runtime | Node.js | 20 LTS | Existing. Event-loop handles thousands of concurrent SSE connections | Go (V2 microservice consideration) |
| Framework | Express | 4.x | Existing. Middleware layering for auth, rate limiting | Fastify (V2 upgrade path) |
| Language | TypeScript | 5.x | Existing. Financial precision requires types | â€” |
| ORM | Prisma | 5.x | Existing. Schema-first migrations | Drizzle (V2 performance upgrade) |
| Database | PostgreSQL | 15.x | Existing. JSONB, UUID, TimescaleDB compatible | â€” |
| Time-Series | TimescaleDB | 2.x | Extension on existing PostgreSQL. 95% compression. No new service | InfluxDB (separate service), QuestDB |
| Cache/Pub-Sub | Redis | 7.x | PRD Â§12.1. Pub/Sub fan-out + Hash state + TTL alerting | Kafka (overkill for current scale) |
| Scheduler | node-cron | 3.x | IST-aware cron for market-hours jobs. Lightweight | BullMQ (appropriate at V2 scale) |
| Validation | Zod | 3.x | Existing. All tick payloads validated before processing | â€” |
| Math | mathjs | 11.x | NEW. Precise Black-Scholes. High precision decimals | JS Math (floating point precision issues) |
| LLM â€” OpenAI | openai | 4.x | NEW. Official SDK when FLOW_LLM_PRIMARY=openai | Vercel AI SDK (V2 abstraction) |
| LLM â€” Anthropic | @anthropic-ai/sdk | Latest | NEW. Official SDK when FLOW_LLM_PRIMARY=anthropic | â€” |
| Logging | pino | 8.x | NEW RECOMMENDATION. JSON structured. 5Ã— faster than Winston | Winston (existing â€” migrate for performance) |
| Monitoring | prom-client | 14.x | NEW. Exposes /metrics for Grafana | Datadog APM |
| Testing | Jest + Supertest | Existing | API integration tests | â€” |

## 5.3 Infrastructure

| Category | Technology | Justification |
|----------|-----------|---------------|
| Cloud | AWS ap-south-1 Mumbai | PRD Â§18.1. Same region as NSE â€” minimizes tick latency |
| Container | Docker | Dev-prod parity. docker-compose for local Redis + PostgreSQL |
| Orchestration | ECS Fargate (V0.5â€“V1.x) â†’ EKS (V2.0+) | Fargate removes cluster management in early phases |
| Reverse Proxy | NGINX | SSL termination. SSE long-connection support. Static assets |
| CDN | Cloudflare | PRD Â§18.6. DDoS protection. India PoPs for < 50ms asset delivery |
| Redis Managed | AWS ElastiCache | Single node V0.5, Cluster mode V1.0+ |
| CI/CD | GitHub Actions | Existing repo. Lint â†’ test â†’ Lighthouse â†’ deploy |
| Frontend Deploy | Vercel | Existing (vercel.json). Preview per PR |
| Backend Deploy | AWS ECS or Cloud Run | Containerized |
| Monitoring | Grafana + Prometheus | PRD Â§18.2. Self-hosted |
| Alerting | PagerDuty | On-call rotation for market-hours incidents |
| Logs | Grafana Loki / CloudWatch | Structured JSON logs |
| IaC | Terraform (V1.0+) | Reproducible environments |


---

# EMB Sections 6â€“10

---

# 6. Backend Engineering Blueprint

## 6.1 Module Architecture

The backend follows a strict layered architecture within the modular monolith:

```
Route Layer         â†’ Validates HTTP input, calls Service layer
Service Layer       â†’ Orchestrates business logic, calls Repositories and Analytics
Repository Layer    â†’ Database access (Prisma + TimescaleDB raw queries)
Analytics Layer     â†’ Pure computation, no I/O (Greeks, PCR, Max Pain)
Provider Layer      â†’ External data provider adapters (TrueData, Kite Connect)
Worker Layer        â†’ Background jobs, scheduled tasks
Streaming Layer     â†’ SSE bridge, WebSocket handler
AI Layer            â†’ LLM orchestration, prompt construction, response validation
```

**Rules:**
- Route layer never calls Repository or Analytics directly â€” only through Service
- Service layer never imports from Route layer
- Analytics layer has zero I/O â€” pure functions only, fully testable without database
- Provider adapters implement a common interface â€” business logic has no awareness of provider identity
- Workers run in the same process in V0.5, extracted to separate process in V2.0

## 6.2 Service Layer Design

### FlowOverviewService

**Responsibility:** Assembles the complete market overview payload for the `/api/v1/flow/overview` endpoint.

**Contract:** Accepts `symbol` + `expiry` parameters. Returns `{ pcr, maxPain, iv, vix, oiSummary, aiSummary, session }`.

**Dependencies:** PCRService, MaxPainService, IVService, FlowAIOrchestrator, Redis.

**Caching strategy:** Reads all sub-components from Redis (pre-computed by worker). If any cache miss, falls back to synchronous calculation with cache-aside write. Response TTL: 30 seconds at REST level (`Cache-Control: s-maxage=30`).

**Error handling:** If Redis is unavailable, compute from PostgreSQL (degraded mode). If PostgreSQL is unavailable, return last known good state with explicit staleness indicator in response.

---

### OIService

**Responsibility:** OI chain retrieval, OI change computation, OI heatmap data formatting.

**Contract:**
- `getOIChain(symbol, expiry)` â†’ full strike array with OI, OI change, IV, Greeks
- `getOIHeatmap(symbol, expiry)` â†’ formatted heatmap data (normalized 0â€“1 intensities)
- `getOIChange(symbol, expiry, strikePrice)` â†’ intraday and day-over-day delta for a specific strike

**Data source:** Redis HGET for current state. TimescaleDB for historical baseline.

**Session baseline:** Reads `baseline:oi:{symbol}:{expiry}:{date}` set at 9:15 AM by EODSnapshotWorker.

---

### IVService

**Responsibility:** IV surface construction, IV percentile calculation, IV skew computation.

**Contract:**
- `getATMIV(symbol, expiry)` â†’ current ATM IV (average CE + PE)
- `getIVPercentile(symbol)` â†’ IV percentile vs 252-day lookback
- `getIVSurface(symbol)` â†’ IV matrix [strikes Ã— expiries]
- `getIVSkew(symbol, expiry)` â†’ IV by delta (0.1 to 0.5)

**Data source:** Current IV from Redis. Historical IV percentile from TimescaleDB `iv_history`.

---

### AlertService

**Responsibility:** CRUD for user alert configurations. Alert activation/deactivation.

**Contract:**
- `createAlert(userId, alertConfig)` â†’ creates alert, writes to PostgreSQL, invalidates Redis cache
- `getAlerts(userId)` â†’ list of active alerts
- `deleteAlert(userId, alertId)` â†’ soft delete, invalidate cache
- `getAlertHistory(userId, limit)` â†’ paginated alert history

**Cache invalidation:** On any write, Redis key `alert:config:{userId}:{symbol}` is deleted. Next AlertEngine run repopulates from PostgreSQL.

---

## 6.3 Repository Layer Design

### OIHistoryRepository

**Responsibility:** All time-series OI data access against TimescaleDB.

**Key queries:**
- `getSessionOpen(symbol, expiry, date)` â†’ OI snapshot at market open (9:15 AM)
- `getDayClose(symbol, expiry, previousDate)` â†’ OI at previous day close (3:30 PM)
- `getIntradayTimeline(symbol, expiry, strike, type, date)` â†’ 1-min OI snapshots for replay
- `getHistoricalComparison(symbol, expiry, dateRange)` â†’ OI evolution across multiple days
- `insertSnapshot(tick)` â†’ async write of current OI state

**Performance:** All queries use composite index `(symbol, expiry_date, strike_price, option_type, time)`. TimescaleDB chunk interval: 1 day. Compression policy: compress chunks older than 7 days.

---

## 6.4 Provider Layer Design

The provider layer is the only point of contact with external market data APIs. All other services are provider-agnostic.

### MarketDataProvider Interface

**Required methods:**
- `connect()` â†’ establishes connection to provider API
- `subscribeToOptionChain(symbol, expiry)` â†’ starts receiving ticks
- `subscribeToVIX()` â†’ starts receiving VIX ticks
- `onTick(callback)` â†’ registers tick handler
- `onError(callback)` â†’ registers error handler
- `onDisconnect(callback)` â†’ registers disconnect handler
- `disconnect()` â†’ clean disconnection

**Required tick payload shape (normalized across providers):**
```
symbol: string
strikePrice: number
optionType: 'CE' | 'PE'
expiryDate: string (ISO date)
ltp: number
openInterest: number
volume: number
bid: number
ask: number
impliedVolatility: number | null
timestamp: string (ISO datetime)
```

### MarketDataWorker

**Responsibility:** Manages provider lifecycle. Routes ticks through the processing pipeline. Handles reconnection.

**Reconnection strategy:**
- Exponential backoff: 1s â†’ 2s â†’ 4s â†’ 8s â†’ 16s â†’ 30s (cap)
- After 3 consecutive failures: switch to backup provider
- After 10 consecutive failures: page on-call

**Tick processing pipeline (per tick):**
1. Schema validation (Zod) â€” reject malformed ticks
2. Greeks Engine calculation â€” compute Î”, Î“, Î˜, V, Ï
3. Redis HSET â€” update current state
4. Redis PUBLISH â€” fan-out to SSE subscribers
5. TimescaleDB INSERT â€” async, non-blocking, error-swallowed
6. Alert Engine check â€” evaluate conditions for this symbol

**Performance target:** Full pipeline < 10ms per tick. Greeks calculation < 5ms (PRD Â§12.4).

---

## 6.5 Analytics Engine Design

### GreeksEngine

**Algorithm:** Real-time Black-Scholes with Newton-Raphson IV extraction.

**Inputs per tick:** S (underlying price), K (strike price), T (time to expiry in years), r (risk-free rate), Ïƒ (IV from tick or Newton-Raphson solve).

**Processing:**
- T = (expiryDate - currentTime) / (365.25 Ã— 24 Ã— 60 Ã— 60 Ã— 1000) in years
- Risk-free rate r = India 91-day T-bill rate, read from configuration, updated daily
- If tick provides IV directly (most providers do): use as Ïƒ. If not, solve for Ïƒ using Newton-Raphson.

**Outputs:** Delta (Î”), Gamma (Î“), Theta (Î˜ per day in rupees), Vega (V per 1% IV change), Rho (Ï).

**Performance requirement:** < 5ms per strike (PRD Â§12.4, Â§15.1). Achieved via mathjs precision arithmetic and pre-computed cumulative normal distribution table.

---

### PCRCalculator

**Formula (OI-based):** PCR_OI = Î£PutOI / Î£CallOI for the target expiry.

**Formula (Volume-based):** PCR_Vol = Î£PutVolume / Î£CallVolume.

**Aggregation levels:**
1. Per-expiry PCR (weekly, monthly, all)
2. Aggregate PCR (all strikes, all expiries)
3. PCR change (current vs 30 min ago, current vs session open)

**Update frequency:** Recalculated after every tick batch (every 30 seconds during market hours).

**Output stored:** Redis Hash `pcr:{symbol}:{expiry}` with fields `pcrOI`, `pcrVol`, `callOITotal`, `putOITotal`, `updatedAt`.

---

### MaxPainCalculator

**Algorithm:** Iterative, O(n) where n = number of strikes.

**Formula:** For each candidate expiry price E, compute total pain = Î£[max(0, Eâ€“K) Ã— PutOI[K] + max(0, Kâ€“E) Ã— CallOI[K]] for all strikes K. Max Pain = E that minimizes total pain.

**Candidate prices:** All available strikes for the target expiry.

**Update frequency:** Every 5 minutes (PRD Â§11.1 F-003). Cached in Redis with 300s TTL.

**Performance requirement:** < 100ms for full calculation across all strikes (PRD Â§15.1).

---

### IVPercentileEngine

**Algorithm:** Rank current ATM IV against 252-day historical IV.

**Formula:** Percentile = count(days where historical_IV < current_IV) / 252 Ã— 100.

**Data dependency:** TimescaleDB `iv_history` table must contain â‰¥ 252 rows per symbol. Backfill script required before V1.0 launch.

**Status labels:**
- 0â€“25th percentile â†’ COMPRESSED (favorable for buyers)
- 25â€“60th â†’ NORMAL
- 60â€“85th â†’ ELEVATED (favorable for sellers)
- 85th+ â†’ EXTREME (caution for both)

---

### FlowEventDetector

**Algorithm:** Detects unusually large OI changes in a single tick refresh cycle.

**Threshold:** Configurable per symbol. Default: NIFTY = 50,000 lots per refresh cycle, BANKNIFTY = 20,000 lots.

**Event types:**
- `LARGE_CALL_BUILD` â€” CE OI increased > threshold in refresh window
- `LARGE_PUT_BUILD` â€” PE OI increased > threshold
- `LARGE_CALL_UNWIND` â€” CE OI decreased > threshold
- `LARGE_PUT_UNWIND` â€” PE OI decreased > threshold
- `STRADDLE_BUILD` â€” Both CE and PE OI increased at same strike > threshold

**Output:** Event stored in Redis list `flow:events:{symbol}` (capped at 100 items). Published to SSE `flow_event` channel.

---

### MarketStructureAnalyzer

**Classifies OI-price relationship into market structure patterns:**

| Pattern | Condition |
|---------|-----------|
| Long Buildup | Price Rising AND OI Rising at strike |
| Short Buildup | Price Falling AND OI Rising at strike |
| Long Unwinding | Price Falling AND OI Falling at strike |
| Short Covering | Price Rising AND OI Falling at strike |

**Inputs:** OI change (last 30 min) + underlying price change (last 30 min).
**Output:** Dominant pattern label for the index, used in AI context and UI label chips.

---

## 6.6 Alert Engine Design

### Condition Types

| Type | Condition Logic | Redis State Key |
|------|----------------|-----------------|
| `OI_CHANGE` | abs(tick.OI â€“ baseline.OI) / baseline.OI > threshold% | alert:state:{id} |
| `PCR_THRESHOLD` | pcr.pcrOI crosses threshold (above or below) | alert:state:{id} |
| `IV_SPIKE` | current_IV increases > threshold% in 30-min window | alert:state:{id} |
| `MAX_PAIN_PROXIMITY` | abs(index_price â€“ max_pain) / index_price < threshold% | alert:state:{id} |
| `GAMMA_WALL` | gamma exposure at strike > threshold (V1.1) | alert:state:{id} |

### Evaluation Strategy

**Loading:** On server start, all active alert configs loaded from PostgreSQL into Redis Cache with 300s TTL. Cache is the hot path â€” PostgreSQL is the source of truth.

**Per-tick:** For each incoming tick, the Alert Engine checks Redis for alert configs keyed by `symbol`. Each active config is evaluated in < 1ms. No database queries during evaluation.

**Delivery:** Alert fires to user's active WebSocket connection. If user has no active WebSocket, the alert is stored in `alert_history` with `was_read = false` and surfaced on next page load.

**Cooldown:** Redis key `alert:state:{alertId}` set to `FIRED` with 300s TTL. Engine skips evaluation if key exists. Prevents spam.

---

## 6.7 SSE Bridge Architecture

### Design

Redis Pub/Sub subscriber â†’ SSE client fan-out.

**Channels:** One channel per symbol (`ch:NIFTY`, `ch:BANKNIFTY`, `ch:FINNIFTY`, `ch:MIDCAPSEL`). One channel for session state (`ch:session`). One channel for AI brief updates (`ch:ai`).

**Client connections:** The SSE endpoint at `/sse/flow?symbols=NIFTY,BANKNIFTY` accepts multiple symbols. The server maintains one Redis subscriber per channel (not per client). Client count per channel is tracked in `ConnectionManager`.

**Backpressure:** If SSE client buffer > 100KB, the connection is gracefully closed and client reconnects. This prevents memory leaks from slow clients.

**Reconnection:** SSE has built-in `Last-Event-ID` support. Server sends `id:` field with each event. On reconnect, client sends `Last-Event-ID` header and server replays missed events from Redis list (last 60 seconds of events per channel).

---

## 6.8 WebSocket Server Architecture

### Design

Dedicated WebSocket endpoint at `/ws/flow`. Used exclusively for bidirectional alert subscription management.

**Message protocol:**
- Client â†’ Server: `{ type: "SUBSCRIBE_ALERTS", symbols: ["NIFTY"] }` (adds symbols to alert monitoring)
- Client â†’ Server: `{ type: "UNSUBSCRIBE_ALERTS", symbols: ["NIFTY"] }`
- Client â†’ Server: `{ type: "PING" }`
- Server â†’ Client: `{ type: "ALERT_FIRED", alertId, message, severity, action }`
- Server â†’ Client: `{ type: "PONG" }`

**Authentication:** On WebSocket upgrade, the `sec-websocket-protocol` header carries a short-lived WS token (issued by REST API). The WS token is validated at upgrade time â€” no JWT in every message.

**Connection management:** ConnectionManager stores `userId â†’ WebSocket` mapping. On disconnect, mapping is removed. On reconnect, mapping is updated.

---

## 6.9 Caching Strategy

| Data | Cache Layer | Key Pattern | TTL | Invalidation |
|------|------------|-------------|-----|--------------|
| Current OI state | Redis Hash | `oi:{sym}:{exp}:{strike}:{type}` | No TTL (overwritten per tick) | Cleared at market close |
| PCR | Redis Hash | `pcr:{sym}:{exp}` | No TTL | Overwritten per 30s calculation |
| Max Pain | Redis String | `maxpain:{sym}:{exp}` | 300s | Time-based |
| AI Brief (shared) | Redis String | `ai:brief:{sym}:{type}` | 1800s | Time-based + manual refresh |
| Alert configs | Redis Hash | `alert:config:{userId}:{sym}` | 300s | Invalidated on alert CRUD |
| Alert cooldown | Redis String | `alert:state:{alertId}` | 300s | Time-based |
| User session | Redis Hash | `session:{userId}` | 86400s | Login/logout |
| IV snapshot | Redis Hash | `iv:{sym}:{exp}` | 300s | Overwritten per 5-min IV calc |
| VIX | Redis String | `vix:current` | 5s | Overwritten per tick |

**Cache miss strategy:** Cache-aside. On miss, compute from TimescaleDB/PostgreSQL â†’ write to Redis â†’ return result. Log cache miss as metric.

**Redis memory management:** Set `maxmemory-policy = allkeys-lru` in Redis config. Financial state keys never evicted (use `PERSIST` command on critical keys).

---

## 6.10 Error Handling and Retry Strategy

### Provider Adapter Errors

| Error Type | Detection | Response |
|------------|-----------|----------|
| Connection lost | `onDisconnect` callback | Reconnect with exponential backoff |
| Tick data gap (> 5s silence) | Heartbeat timer per symbol | Log warning; if > 30s, attempt reconnect |
| Malformed tick | Zod validation failure | Log error, skip tick, increment metric counter |
| Rate limit | HTTP 429 from provider | Pause and retry after `Retry-After` header |
| Provider offline (> 60s) | 3 consecutive reconnect failures | Switch to backup provider; alert on-call |

### LLM API Errors

| Error Type | Response |
|------------|----------|
| API timeout (> 8s) | Return cached brief with staleness indicator |
| Rate limit | Queue request with 60s backoff |
| Content filter | Log, return neutral fallback message |
| Hallucination detected | Retry with more constrained prompt (1 retry) â†’ fallback to raw data |
| Primary provider down | Switch to fallback provider (env: FLOW_LLM_FALLBACK) |

### Database Errors

| Error Type | Response |
|------------|----------|
| TimescaleDB write failure | Log error, continue (non-blocking write). Data not lost â€” Redis has current state |
| PostgreSQL connection error | Circuit breaker: stop writes, serve from Redis cache, alert on-call |
| Redis connection error | Fall back to PostgreSQL direct queries (degraded performance mode) |

---

## 6.11 Rate Limiting

Applied at NGINX layer (global) and Express middleware (per-user).

| Endpoint | User Limit | Global Limit | Strategy |
|----------|-----------|--------------|----------|
| REST API (authenticated) | 600 req/min | 10,000 req/min | Sliding window, Redis-backed |
| SSE connection | 5 concurrent per user | 15,000 total | Connection count in Redis |
| WebSocket connection | 3 concurrent per user | 12,000 total | Connection count in Redis |
| AI brief manual refresh | 10 req/hour per user | â€” | Token bucket, Redis-backed |
| Alert creation | 50 total per user | â€” | Database count check |

---

## 6.12 Versioning

All Flow Intelligence APIs are versioned at `/api/v1/flow/*`. When breaking changes are introduced:
1. New version deployed at `/api/v2/flow/*`
2. V1 maintained for 90-day deprecation window
3. Deprecation warning header: `X-API-Deprecation: 2026-11-08`
4. Migration guide published in `docs/options-intelligence/api/`

---

# 7. Frontend Engineering Blueprint

## 7.1 Component Hierarchy

```
Flow.tsx (Route Shell)
â”œâ”€â”€ FlowCommandBar                    Always visible, z-index: 50
â”‚   â”œâ”€â”€ IndexSelector                 4-symbol tabs
â”‚   â”œâ”€â”€ LivePrice                     Index price + change
â”‚   â”œâ”€â”€ PCRPill                       Compact PCR display
â”‚   â”œâ”€â”€ VIXPill                       VIX compact display
â”‚   â”œâ”€â”€ SessionIndicator              Market session badge
â”‚   â””â”€â”€ AISummaryPill                 One-sentence AI state
â”‚
â”œâ”€â”€ FlowTabNav                        Secondary navigation
â”‚   â””â”€â”€ [Overview | OI | Flow | IV | Greeks | Mine | Alerts]
â”‚
â””â”€â”€ FlowPanelContainer (scroll)
    â”œâ”€â”€ MorningBrief                  Always first (collapsible)
    â”‚   â”œâ”€â”€ BriefHeadline
    â”‚   â”œâ”€â”€ BriefObservations
    â”‚   â”œâ”€â”€ BriefAction
    â”‚   â”œâ”€â”€ PersonalOverlay           (if user has open positions)
    â”‚   â””â”€â”€ BriefExpanded             (lazy loaded on expand click)
    â”‚
    â”œâ”€â”€ OverviewPanel                 Key metrics row
    â”‚   â”œâ”€â”€ PCRCard
    â”‚   â”œâ”€â”€ MaxPainCard
    â”‚   â”œâ”€â”€ IVCard
    â”‚   â””â”€â”€ VIXCard
    â”‚
    â”œâ”€â”€ OIPanel
    â”‚   â”œâ”€â”€ OIHeatmap                 Canvas render
    â”‚   â”‚   â””â”€â”€ PositionHeatmapMarker (overlay â€” if positions active)
    â”‚   â”œâ”€â”€ OIChangeTable             Virtualized
    â”‚   â””â”€â”€ OIHistoryChart
    â”‚
    â”œâ”€â”€ FlowEventsPanel
    â”‚   â”œâ”€â”€ FlowEventFilters
    â”‚   â””â”€â”€ FlowEventCard (Ã—N)
    â”‚
    â”œâ”€â”€ OptionChainPanel
    â”‚   â”œâ”€â”€ ExpirySelector
    â”‚   â”œâ”€â”€ OptionChainFilters
    â”‚   â””â”€â”€ OptionChainTable          TanStack Virtual
    â”‚
    â”œâ”€â”€ IVPanel                       [V1.1]
    â”œâ”€â”€ GreeksDashboard               [V1.1]
    â”œâ”€â”€ MyPositionsPanel
    â””â”€â”€ AlertsPanel
```

## 7.2 State Management â€” flowStore

**Zustand store design principles:**
- One store for all Flow Intelligence state â€” no prop drilling
- Atomic selectors to prevent over-rendering (components subscribe to slices, not full store)
- Server state (remote data) separated from UI state (tabs, drawers, filters)

**Store structure:**

```
flowStore {
  // Symbol context
  activeSymbol: FlowSymbol                  // 'NIFTY' | 'BANKNIFTY' | etc.
  activeExpiry: string                      // ISO date string
  setActiveSymbol(symbol): void
  setActiveExpiry(expiry): void

  // Market session
  session: MarketSession                    // PRE_MARKET | OPEN | etc.
  sessionUpdatedAt: number                  // timestamp

  // OI data
  oiChain: Map<string, OIStrike>            // keyed by "strike:type"
  oiHeatmapData: OIHeatmapData
  oiBaselineLoaded: boolean

  // Overview metrics
  pcr: PCRData | null
  maxPain: MaxPainData | null
  iv: IVData | null
  vix: VIXData | null

  // AI briefs
  morningBrief: AIBrief | null
  personalOverlay: PersonalOverlay | null
  briefLoading: boolean

  // Flow events
  flowEvents: FlowEvent[]

  // Alerts
  activeAlerts: UserAlert[]
  firedAlerts: FiredAlert[]                 // for toast queue

  // UI state
  activeTab: FlowTab
  expandedPanels: Set<string>
  strikeDrilldown: number | null            // null = closed

  // Streaming state
  sseConnected: boolean
  wsConnected: boolean
  lastUpdateTime: Record<string, number>    // per data type

  // Actions
  updateOIFromSSE(event: OIUpdateEvent): void
  updatePCRFromSSE(event: PCRUpdateEvent): void
  addFlowEvent(event: FlowEvent): void
  queueAlert(alert: FiredAlert): void
  setTab(tab: FlowTab): void
  togglePanel(panelId: string): void
}
```

**Selector pattern:**
- Components import specific selectors: `const pcr = useFlowStore(s => s.pcr)` â€” not the full store
- This ensures components re-render only when their specific data slice changes

## 7.3 Data Fetching Strategy

### Initial Page Load

1. `Flow.tsx` mounts â†’ dispatches `initFlow(symbol, expiry)` action
2. `initFlow` fires these REST calls in parallel:
   - `GET /api/v1/flow/overview?symbol&expiry` â†’ populates PCR, MaxPain, IV, VIX, AI summary
   - `GET /api/v1/flow/oi-chain?symbol&expiry` â†’ populates OI chain + heatmap
   - `GET /api/v1/flow/morning-brief?symbol` â†’ populates AI morning brief
   - `GET /api/v1/flow/my-positions?symbol` â†’ populates position overlay (authenticated)
   - `GET /api/v1/flow/alerts` â†’ populates alert configurations
3. All requests fire simultaneously. Each panel shows skeleton until its data resolves
4. After initial load, SSE subscription activated: `useFlowSSE` subscribes to active symbol channel
5. WebSocket connection established: `useFlowAlerts` connects and subscribes to alert channel

### SSE Subscription Strategy

`useFlowSSE` hook manages the EventSource lifecycle:

**Event types consumed:**
- `oi_update` â†’ update specific OI strike in `flowStore.oiChain`
- `pcr_update` â†’ update `flowStore.pcr`
- `vix_update` â†’ update `flowStore.vix`
- `flow_event` â†’ prepend to `flowStore.flowEvents` (cap at 100)
- `session_update` â†’ update `flowStore.session`
- `ai_update` â†’ update `flowStore.morningBrief`
- `alert_fired` â†’ routed through `useFlowAlerts` WS (not SSE)

**Reconnection logic:**
- EventSource auto-reconnects on connection drop (browser native behavior)
- On reconnect, server replays last 60 seconds of events via `Last-Event-ID`
- After 3 failed reconnects, show `DataStalenessIndicator` with "Reconnecting..." state

---

## 7.4 Rendering Optimization

### OI Heatmap

**Challenge:** Heatmap has up to 80 strikes Ã— 2 option types = 160 cells updating every 30 seconds. NaÃ¯ve re-render of all cells on every OI tick would cause jank.

**Solution:**
1. Heatmap data is stored as a `Map<string, number>` in `flowStore` (keyed by `"strike:type"`)
2. `OIHeatmap` component subscribes to the Map reference (Zustand tracks Map mutations)
3. Individual `OIHeatmapCell` components subscribe to their specific `"strike:type"` key only
4. React's `memo()` on `OIHeatmapCell` prevents re-render if the specific cell value has not changed
5. `useTransition` wraps OI state updates â€” low priority render, never blocks user interaction

**Alternative if DOM-based approach causes performance issues:** Switch to Canvas-based rendering in `OIHeatmap` where cells are drawn directly, bypassing React's reconciliation entirely. Canvas approach is the V1.1 fallback if React memo approach proves insufficient during load testing.

### Option Chain Table

**Challenge:** Full option chain may have 200+ strikes. DOM rendering all rows causes layout thrash.

**Solution:** TanStack Virtual with fixed row height (48px). Only visible rows mounted in DOM (typically 10â€“15 rows). Scroll-based rendering with 5-row overscan. Row data accessed via index from the sorted/filtered array in `flowStore`.

### Number Animations

**PRD requirement:** "Number counter" animation on data refresh (300ms, Â§8.6).

**Implementation:** Framer Motion's `useMotionValue` with spring configuration. Numbers animate from old value to new value. Spring parameters: `stiffness: 100, damping: 30` â€” smooth but fast.

**Condition:** Animation only triggers when value changes by > 0.5% (dead zone prevents animation on rounding noise).

---

## 7.5 Session-Adaptive UI

`useFlowSession` hook computes the current market session from IST time:

- Polls server `GET /api/v1/flow/session` on mount (authoritative)
- Subscribes to `session_update` SSE event for live transitions
- Exposes `session: MarketSession` to the store

**UI adapts based on session:**
- CSS custom property `--flow-session-accent` changes per session (blue â†’ amber â†’ orange â†’ green)
- Panel ordering in `FlowPanelContainer` reorders via CSS `order` property (no re-mounting)
- Command bar `SessionIndicator` badge pulses during `MARKET_OPEN` and `POWER_HOUR`

---

## 7.6 Loading States

Every data panel follows this state machine:

```
IDLE (not yet loaded)
  â†’ Show: FlowSkeleton (full panel height, animated shimmer)

LOADING (request in flight)
  â†’ Show: FlowSkeleton with spinner in header

LOADED (data present)
  â†’ Show: Panel with data
  â†’ If SSE update pending: DataStalenessIndicator (subtle, non-disruptive)

ERROR (request failed)
  â†’ Show: FlowErrorState (message + retry button + optional fallback data)

STALE (SSE disconnected, data > 2 min old)
  â†’ Show: Panel with data + amber DataStalenessIndicator
  â†’ If > 5 min stale: amber border on entire panel
```

---

## 7.7 Accessibility

**Keyboard Navigation:**
- `Tab` / `Shift+Tab` â€” navigate between interactive elements
- `ArrowUp` / `ArrowDown` â€” navigate option chain rows
- `ArrowLeft` / `ArrowRight` â€” navigate index selector tabs
- `Enter` / `Space` â€” expand panels, activate buttons
- `Escape` â€” close drawers and tooltips
- `?` key â€” show keyboard shortcuts modal

**ARIA:**
- All cards: `role="region"` with `aria-label`
- OI heatmap: `role="grid"` with `aria-label="OI Heatmap for {symbol}"`
- Live data: `aria-live="polite"` on PCR, VIX cards (announces changes to screen readers)
- Alerts: `aria-live="assertive"` on alert toast (critical announcements)
- Loading states: `aria-busy="true"` on skeleton containers

**Color Blind Safety:**
- All critical signals use icon + color + label (never color alone)
- Bullish: â†‘ icon + emerald + "Long Buildup" label
- Bearish: â†“ icon + red + "Short Buildup" label
- Warning: âš  icon + amber + text

**Motion:**
- All animations respect `prefers-reduced-motion`
- In reduced motion mode: transitions instant, number animations disabled, heatmap color updates instant

**Target:** WCAG 2.1 AA compliance. SUS score â‰¥ 80 per PRD Â§17.1.

---

# 8. UI / UX Design Specification

## 8.1 Design Philosophy

The PRD establishes one design question that every screen must answer first:

> **"What is the trader trying to accomplish right now?"**

The answer changes by session:
- 8:30 AM: "What's the market context before I trade?"
- 9:15 AM: "What's happening right now?"
- 10:00 AM: "Is anything unusual in my strikes?"
- 2:30 PM: "Where is max pain and is my position safe?"
- 3:45 PM: "What should I prepare for tomorrow?"

Every panel layout, information hierarchy, and interaction pattern is designed around these temporal use cases.

---

## 8.2 Information Architecture â€” The 7-Layer Model

```
Layer 0: Market State Bar (always visible â€” never scrolls away)
  Answer: "Is the market open? What is the overall state?"
  Content: Index price + change | PCR pill | VIX pill | Session badge | AI one-liner

Layer 1: Morning Brief (top of scroll area)
  Answer: "What do I need to know to start trading today?"
  Content: AI headline | 3 observations | 1 action | Personal position note

Layer 2: Key Numbers (overview cards)
  Answer: "What are the critical numbers right now?"
  Content: PCR card | Max Pain card | IV card | VIX card (4 cards in row)

Layer 3: OI Map (the visual anchor)
  Answer: "Where are the big OI walls? What's building or unwinding?"
  Content: OI Heatmap | OI Change Table | OI History sparkline

Layer 4: Flow Events (the narrative feed)
  Answer: "What unusual activity happened that I should know about?"
  Content: Timestamped flow events | Size indicator | AI note per event

Layer 5: Option Chain (the data reference)
  Answer: "What is the exact data for each strike?"
  Content: Full chain with CE | Strike | PE | Greeks | OI | Volume

Layer 6: Deep Analytics (expert mode â€” collapsed by default)
  Answer: "How do I analyze the structure at an advanced level?"
  Content: IV Surface | IV Skew | Greeks Dashboard

Layer 7: My Positions (personalized overlay)
  Answer: "How does today's market structure affect my open positions?"
  Content: Position cards with P&L | Heatmap markers | AI assessment per position
```

The user never needs to scroll through all 7 layers to make a decision. Each layer is collapsible. The default view shows Layers 0â€“4.

---

## 8.3 Visual Hierarchy Rules

**Rule 1: One number, one story.** Each card tells a single story. The headline number is largest. The context (trend, comparison) is secondary. The interpretation (AI label) is tertiary.

**Rule 2: Color has meaning, not decoration.** Six semantic colors only. Never used decoratively. Every use of color communicates a state change.

| Color Token | Semantic Meaning | Usage |
|------------|-----------------|-------|
| `--color-bullish: #10B981` | Positive, call activity, rising OI | Call OI cells, positive delta, rising PCR |
| `--color-bearish: #EF4444` | Negative, put activity, falling OI | Put OI cells, negative delta, alerts |
| `--color-warning: #F59E0B` | Elevated, unusual, attention required | IV spike, large OI build, stale data |
| `--color-ai: #6366F1` | AI-generated content | Left border on all AI cards, AI badge |
| `--color-neutral: #94A3B8` | Reference data, metadata | Labels, previous values, timestamps |
| `--color-text: #F1F5F9` | Primary text | All primary content text |

**Rule 3: Typography communicates data type.** Numbers and financial values always in DM Mono. Narrative text (AI, labels, headings) in Geist Sans. These two typefaces create immediate visual separation between "data" and "interpretation."

**Rule 4: Maximum 3 active colors per panel.** Panel borders enforce this â€” if a panel shows more than 3 semantic colors, it requires a design review.

---

## 8.4 Component Specifications

### Command Bar (Layer 0)

**Height:** 56px. Always visible. `position: sticky; top: 0; z-index: 50`.

**Left section:** Index Selector tabs â€” 4 pills with index name, current price, and change percentage.

**Center section:** Session indicator (badge: PRE-MARKET / OPEN / POWER HOUR / CLOSED). Market countdown timer during market hours (time to next session transition).

**Right section:** AI one-liner (collapsible on mobile). Notification bell (alert count badge).

**Behavior on scroll:** Background transitions from transparent (at top) to `Surface 1` with subtle blur (after 20px scroll) â€” identical to the "floating command bar" pattern in Linear.

---

### PCR Card

**Header:** "Put-Call Ratio" + freshness timestamp.

**Primary display:**
- Value: `1.24` in 32px DM Mono, colored by threshold
- Trend arrow: â†‘/â†“ with 24h delta

**Secondary display:**
- Semi-circular gauge, 140px wide, showing position on bearishâ€“neutralâ€“bullish spectrum
- Labels: "BEARISH EXTREME" â†’ "NEUTRAL" â†’ "BULLISH EXTREME"
- Plain English chip: "Put Heavy" / "Neutral" / "Call Heavy"

**Footer:** OI-PCR vs Volume-PCR toggle. Expiry selector dropdown.

**5-day sparkline:** 12px height, shows PCR trend over last 5 trading days.

---

### AI Insight Card (used in Morning Brief, per-event, per-position)

**Visual identity:** 3px left border in `--color-ai: #6366F1`. This is the signature of all AI-generated content.

**Structure:**
- Header: Small âš¡ icon + "Flow Intelligence" label + freshness ("Updated 2 min ago") + confidence dots (1â€“5)
- Body: **[ONE BOLD CONCLUSION SENTENCE]** â€” this is the most important element. Never hidden.
- Observations: 3 bullet points with supporting data (gray text, smaller)
- Action: One recommended action chip (e.g., "Watch 23,000 CE wall") in amber/indigo background
- Footer: "Expand" button + "Explain this" button + "Why?" audit trail link

**"Why?" button:** Opens a drawer showing the exact data points the AI used to generate this insight. Non-negotiable for trust (PRD Â§10.4 Rule 3).

---

### OI Heatmap

**Layout:** Two columns (CE left, PE right) with strike price column in center. 20â€“40 strikes visible at once. ATM strike always horizontally centered with a distinct visual marker (white hairline border).

**Color scale:** Not a simple two-color scale. Uses a 7-step scale:
- Heaviest Call OI â†’ `#991B1B` (deep red)
- High Call OI â†’ `#DC2626`
- Moderate Call OI â†’ `#FCA5A5`
- Neutral â†’ `#374151` (dark gray)
- Moderate Put OI â†’ `#6EE7B7`
- High Put OI â†’ `#059669`
- Heaviest Put OI â†’ `#064E3B` (deep green)

Color intensity represents relative OI within the visible window (not absolute). This means the highest OI strike always appears in the deepest color, regardless of absolute value.

**Interaction:**
- Hover: Tooltip appears with Strike, OI, OI Change (%), and a 1-sentence AI micro-note
- Click: Opens `StrikeDetailDrawer` with full strike analysis (OI history chart, IV history, Greeks, AI assessment)
- Position markers: If user has a position at a strike, a small circular badge overlays the heatmap cell

---

### Option Chain Table

**Column order (left to right):**
```
CE: [OI Bar] [OI] [Î”OI] [IV] [Delta] [LTP] | STRIKE | [LTP] [Delta] [IV] [Î”OI] [OI] [OI Bar] :PE
```

**OI Bar:** Relative width bar (max width = highest OI strike). Provides visual comparison at a glance.

**Max Pain strike:** Gold (#F59E0B) badge in strike column. "MAX PAIN" label on hover.

**ATM strike:** Visual separator â€” slightly thicker border, "ATM" label in strike column.

**ITM strikes (CE):** Strikes below ATM for calls â€” surface tint with `Bullish subtle: #064E3B10`.

**ITM strikes (PE):** Strikes above ATM for puts â€” surface tint with `Bearish subtle: #7F1D1D10`.

**Row flash animation:** When OI for a row changes > 5% in a single refresh, the row flashes gold for 500ms (Framer Motion `keyframes`).

---

### Alert Toast

**Position:** Top-right corner. Never bottom-right (reserved for app-level toasts via Sonner).

**Severity levels:**
- `CRITICAL` (circuit breaker, data outage): Persistent red card. Never auto-dismisses. Requires click to dismiss.
- `WARNING` (OI threshold, PCR extreme): Amber card. Auto-dismisses after 8 seconds.
- `INFO` (IV percentile, max pain proximity): Blue card. Auto-dismisses after 5 seconds.

**Content structure:**
- Icon (severity-matched) + Title (bold) + Description (1 sentence) + Action button + Dismiss button
- Action button example: "View OI Detail" â†’ navigates to heatmap and highlights the triggered strike

---

## 8.5 Motion Language

All animations derive from these principles:
1. Duration: 150ms (micro), 300ms (standard), 500ms (panel), 800ms (heatmap color). Never longer.
2. Easing: `ease-in-out` for most. `spring` (stiffness: 150, damping: 25) for numbers.
3. Purpose: Every animation communicates a state change. No decorative motion.

| Interaction | Animation | Duration | Easing |
|-------------|-----------|----------|--------|
| Number update | Spring count animation | 300ms | Spring |
| OI anomaly detected | Row highlight pulse | 500ms | Ease-in-out |
| Panel expand | Height transition + fade | 200ms | Ease-out |
| Skeleton â†’ data | Fade in | 150ms | Ease |
| Heatmap cell color change | Color transition | 800ms | Ease-in-out |
| Alert toast appear | Slide in from right | 250ms | Spring |
| Alert toast dismiss | Slide out right | 200ms | Ease-in |
| Strike detail drawer | Slide in from right | 300ms | Spring |
| Tab switch | Underline slide | 150ms | Ease |
| Index selector switch | Content cross-fade | 200ms | Ease |

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables all transitions. Data still updates; only the animation is removed.

---

## 8.6 Responsive Strategy

| Breakpoint | Layout Behavior |
|------------|-----------------|
| 375pxâ€“767px (Mobile) | Single column. Tab strip becomes bottom navigation. Command bar collapses to icon row. Heatmap simplified (20 strikes). Option chain condensed (5 columns). AI brief collapsed by default. |
| 768pxâ€“1023px (Tablet) | Two-column layout. Sidebar hidden (hamburger menu). Overview cards in 2Ã—2 grid. |
| 1024pxâ€“1439px (Laptop) | Standard layout. Sidebar visible (collapsed). All panels visible. |
| 1440px+ (Desktop) | Full layout. Sidebar expanded. Option to split screen (2-panel view). |

**Mobile-specific decisions (PRD RG-004 partially addressed):**
- Mobile layout is designed mobile-first but tested second (desktop is the primary use case for analysis)
- Mobile shows Morning Brief + Key Numbers + OI Heatmap (simplified) by default
- Deep analytics (IV Surface, Greeks) deferred to tap â†’ open in full-screen overlay on mobile

---

## 8.7 Empty States

Every empty state must follow: **What happened â†’ Why â†’ What to do next**

| State | Message |
|-------|---------|
| No active positions | "Your positions will appear here once you have open trades logged in RiskRule" |
| No alerts configured | "Set an OI threshold alert and we'll notify you when institutional activity moves near your strike" |
| Morning brief not yet ready | "The market brief will be available at 8:30 AM. Check back 45 minutes before open." |
| Market closed | "Flow Intelligence shows live data during market hours (9:15 AM â€“ 3:30 PM IST). Historical replay is available for post-market analysis." |

---

# 9. AI Architecture

## 9.1 AI System Overview

The AI system in Flow Intelligence operates on two principles from the PRD:

1. **Never behave like a textbook** â€” always speak in conclusions
2. **Never hallucinate market data** â€” every claim must be traceable to live data

The architecture enforces both principles through structure, not through hope.

---

## 9.2 LLM Provider Interface

All LLM calls go through a model-agnostic provider interface:

**Required methods:**
- `generate(prompt: string, options: LLMOptions)` â†’ `Promise<LLMResponse>`
- `generateStream(prompt: string, options: LLMOptions)` â†’ `AsyncIterable<string>`
- `getModelName()` â†’ `string`
- `getProvider()` â†’ `'openai' | 'anthropic' | 'other'`

**LLMOptions:**
- `maxTokens: number` â€” enforced budget
- `temperature: number` â€” 0.2 for factual market analysis, 0.6 for narrative
- `systemPrompt: string` â€” injected at provider level
- `responseFormat: 'json' | 'text'` â€” JSON preferred for parsed responses

**Provider switching:** Runtime-selectable via `FLOW_LLM_PRIMARY` environment variable. The `FlowAIOrchestrator` instantiates the provider factory once at startup. No code change required to switch providers.

---

## 9.3 Context Assembly Pipeline

The quality of the AI output is determined entirely by the quality of the context. The Context Assembler is the most critical component of the AI system.

### Market Data Context (assembled for every brief)

**Data included:**

| Field | Source | Tokens (estimate) |
|-------|--------|------------------|
| Current OI distribution (all strikes, ATMÂ±15) | Redis | ~400 |
| OI change in last 30 min | Redis + baseline | ~300 |
| OI change vs previous day | TimescaleDB | ~300 |
| PCR (OI and Volume, per expiry) | Redis | ~100 |
| Max Pain strike + proximity | Redis | ~50 |
| IV (current, percentile, 5-day trend) | Redis | ~100 |
| VIX (current, 24h change, 5-day avg) | Redis | ~80 |
| Market Structure pattern (long/short buildup) | MarketStructureAnalyzer | ~100 |
| Session context (time, days to expiry) | MarketHoursScheduler | ~50 |
| Top 3 notable flow events in last 2 hours | Redis | ~150 |

**Total market context budget:** ~1,630 tokens

### Personal Context (assembled for position overlay, on-demand)

| Field | Source | Tokens (estimate) |
|-------|--------|------------------|
| Open positions (symbol, strike, expiry, qty, avg price, current P&L) | PostgreSQL trades | ~200 |
| OI at each position's strike (call wall vs put wall) | Redis | ~100 |
| IV at each position's strike | Redis | ~50 |
| Historical win rate for current strategy type | PostgreSQL analytics | ~80 |
| Last 3 journal entries (summary only, no full text) | PostgreSQL journal | ~200 |
| Top 2 coach memory patterns for this user | PostgreSQL coach_memory | ~150 |
| Historical behavior this session type (expiry day, power hour) | PostgreSQL trades | ~100 |

**Personal context budget:** ~880 tokens

### Prompt Construction Rules

1. **Market data first, personal context second.** The market context is the ground truth. Personal context adds interpretation layer.
2. **Token budget enforced:** Market brief < 2,000 tokens total (including system prompt). Personal overlay < 500 additional tokens.
3. **Data freshness declared in prompt:** Every prompt includes `"As of: {timestamp}"` and `"Data age: {seconds} seconds"` to anchor the AI to the correct temporal context.
4. **Output format specified in prompt:** The prompt includes the exact JSON schema expected in the response. This prevents format hallucination.

---

## 9.4 Prompt Templates

### MORNING_BRIEF Template

```
System: You are a senior derivatives analyst at a leading institutional trading desk.
Your role is to provide a daily pre-market analysis brief.
Speak in conclusions, not definitions.
Every claim must reference the provided data.
Do not say "it seems" or "might" â€” say "indicates" and cite the data.
Output ONLY valid JSON matching the schema provided.
Never hallucinate data. If data is missing, acknowledge it explicitly.

Schema: { headline: string, observations: [string, string, string], action: string, confidence: 1|2|3|4|5 }
Constraints: headline < 20 words. observations < 30 words each. action < 15 words.

Market Data: {market_context_json}
```

### POSITION_OVERLAY Template

```
System: You are analyzing the risk context for a specific trader's open options positions.
The trader has the following positions: {positions}
Reference the provided market structure data to assess each position.
Address the trader directly and personally. No generic advice.
Be direct about risk. Do not soften warnings.

Data: {position_context_json}
Schema: { positions: [{ symbol, strike, assessment, risk_level: 'LOW'|'MEDIUM'|'HIGH', watch_level }], summary: string }
```

### ALERT_EXPLANATION Template

```
System: An alert was triggered for {user}. Explain concisely what happened and why it matters.
Alert: {alert_type} at {strike} {option_type}, threshold: {threshold}, actual value: {actual_value}
Market context: {mini_context}
Output: { explanation: string (< 40 words), implication: string (< 30 words), action: string (< 15 words) }
```

---

## 9.5 Hallucination Prevention

This is non-negotiable per PRD Â§10.4 Rule 1.

**Pre-generation:** The prompt explicitly lists all data values that the AI has access to. The AI cannot claim values it was not given.

**Post-generation validation (HallucinationChecker):**

1. Parse all numbers from the AI response (regex)
2. For each number found in the AI response, check if it appears in the source data payload (within 2% tolerance for IV/percentile values, 0% tolerance for OI/price values)
3. If any cited number does not match source data: **reject the response and retry** (max 1 retry)
4. If second response also fails: **return structured fallback** with raw data instead of AI narrative

**Confidence Scoring (ConfidenceScorer):**

Confidence (1â€“5) is computed from:
- Data freshness (age of OI data) â€” fresher = higher confidence
- Signal agreement (do PCR, OI structure, and IV tell the same story?) â€” agreement = higher confidence
- Market regime (high volatility = lower confidence in predictions)
- Data completeness (missing fields in context = lower confidence)

The confidence score is displayed in the UI and included in the API response. It is not generated by the LLM â€” it is computed deterministically by `ConfidenceScorer`.

---

## 9.6 AI Output Caching Strategy

| Brief Type | Cache Layer | TTL | Invalidation |
|------------|------------|-----|--------------|
| Index morning brief (shared) | Redis `ai:brief:{sym}:morning` | 1,800s (30 min) | Manual refresh by user (rate limited) OR new market-moving event |
| Personal position overlay | Redis `ai:personal:{userId}:{sym}` | 300s (5 min) | On new SSE tick changing position's OI by > 10% |
| Alert explanation | Redis `ai:alert:{alertId}` | 3,600s | Alert deactivation |
| EOD closing brief | PostgreSQL `flow_ai_briefs` | Persistent | Never (historical record) |

**Cost optimization:**
- Index brief generated once per symbol per 30 minutes. Shared across all users.
- Personal overlay is a short prompt (~500 tokens) with a lighter model tier (gpt-4o-mini or claude-haiku).
- Token usage tracked per generation and stored in `flow_ai_briefs.model_used` + tokens column for cost analysis.

---

## 9.7 AI Brief Generation Schedule

| Time (IST) | Job | Brief Type | Model |
|------------|-----|------------|-------|
| 8:30 AM | Pre-market brief generation | `MORNING` | Primary (GPT-4o / Claude Sonnet) |
| 9:15 AM | Market open refresh | `MORNING` (refresh) | Primary |
| 12:00 PM | Midday market summary | `MIDDAY` | Mini (cheaper) |
| 4:00 PM | End-of-day review | `CLOSING` | Primary |
| On demand | Personal position overlay | `POSITION` | Mini (cheaper) |
| On alert | Alert explanation | `ALERT` | Mini |

---

# 10. Analytics Engine

## 10.1 OI Analytics

### OI Change Calculator

**Purpose:** Computes OI change at the strike level for intraday and day-over-day comparisons.

**Inputs:**
- Current OI from Redis `oi:{sym}:{exp}:{strike}:{type}` â†’ `openInterest` field
- Session baseline from Redis `baseline:oi:{sym}:{exp}:{date}:{strike}:{type}`
- Previous day close from TimescaleDB `oi_history` â†’ last record before 15:30 IST of previous day

**Outputs:**
- `intradayChange` = currentOI â€“ sessionBaselineOI
- `intradayChangePct` = intradayChange / sessionBaselineOI Ã— 100
- `dayOverDayChange` = currentOI â€“ prevDayCloseOI
- `dayOverDayChangePct` = dayOverDayChange / prevDayCloseOI Ã— 100

**Frequency:** Computed on each tick, stored in Redis alongside OI value.

---

### OI Buildup Detection

**Purpose:** Identifies which strikes are seeing meaningful OI accumulation vs. unwinding.

**Algorithm:**
1. Compare OI at T (current) vs OI at T-30min (rolling window from TimescaleDB)
2. Classify each strike as: `BUILDING` (OI increasing), `UNWINDING` (OI decreasing), `STABLE` (< 1% change)
3. Flag strikes with absolute change > 10,000 lots (configurable) as `SIGNIFICANT`
4. Significant buildings at call strikes â†’ potential resistance building
5. Significant buildings at put strikes â†’ potential support building

**Output:** Array of `{ strike, type, classification, significance }` used by AI context and heatmap coloring logic.

---

## 10.2 PCR Calculator

**Inputs:**
- Full option chain from Redis: all strikes, all expiries, CE and PE OI and Volume
- Expiry filter parameter

**Processing:**
```
For OI-based PCR:
  totalCallOI = Î£(callOI for target expiry)
  totalPutOI = Î£(putOI for target expiry)
  pcrOI = totalPutOI / totalCallOI

For Volume-based PCR:
  totalCallVol = Î£(callVolume for target expiry)
  totalPutVol = Î£(putVolume for target expiry)
  pcrVol = totalPutVol / totalCallVol
```

**PCR Interpretation ranges (hardcoded, not AI-generated):**
- PCR > 1.5 â†’ "Bearish Extreme" (heavy put buying, often contrarian bullish)
- 1.2â€“1.5 â†’ "Put Heavy" (bearish bias)
- 0.9â€“1.2 â†’ "Neutral"
- 0.7â€“0.9 â†’ "Call Heavy" (bullish bias)
- PCR < 0.7 â†’ "Bullish Extreme" (heavy call buying, often contrarian bearish)

---

## 10.3 Max Pain Calculator

**Inputs:** Full option chain (all strikes, CE + PE OI) for target expiry.

**Algorithm:**
```
For each candidate expiry price E (every available strike):
  totalPain(E) = Î£[max(0, E â€“ K) Ã— PE_OI(K)] + Î£[max(0, K â€“ E) Ã— CE_OI(K)]
  (where K is each available strike)

maxPain = E that minimizes totalPain(E)
```

**Performance:** O(nÂ²) where n = number of strikes. For NIFTY with ~120 strikes, ~14,400 operations. Completes in < 10ms in Node.js. Runs every 5 minutes, not on every tick.

**Output:**
- `maxPainStrike` â€” the minimizing strike price
- `proximity` â€” distance from current index price
- `proximityPct` â€” percentage distance
- `magnetStrength` â€” a normalized score (0â€“1) indicating how strongly the market is "gravitating" toward max pain (derived from total pain differential between top 3 candidate strikes)

---

## 10.4 Greeks Engine (Black-Scholes)

**Purpose:** Real-time computation of option Greeks for every strike in the chain.

**Inputs per option contract:**
- `S` â€” current index price (from latest VIX tick or index price SSE)
- `K` â€” strike price (static)
- `T` â€” time to expiry in years = `(expiryDatetime - nowDatetime) / (365.25 Ã— 24 Ã— 3600 Ã— 1000)`
- `r` â€” risk-free rate (India 91-day T-bill, stored in config, updated daily at 9:00 AM)
- `Ïƒ` â€” implied volatility from tick (if provider supplies IV; otherwise solved via Newton-Raphson)

**Black-Scholes Greek formulas:**
```
d1 = [ln(S/K) + (r + ÏƒÂ²/2) Ã— T] / (Ïƒ Ã— âˆšT)
d2 = d1 â€“ Ïƒ Ã— âˆšT

For Call:
  Delta = N(d1)
  Gamma = N'(d1) / (S Ã— Ïƒ Ã— âˆšT)
  Theta = [-S Ã— N'(d1) Ã— Ïƒ / (2âˆšT) â€“ r Ã— K Ã— e^(-rT) Ã— N(d2)] / 365
  Vega  = S Ã— N'(d1) Ã— âˆšT / 100
  Rho   = K Ã— T Ã— e^(-rT) Ã— N(d2) / 100

For Put:
  Delta = N(d1) â€“ 1
  Gamma = (same as Call â€” symmetric)
  Theta = [-S Ã— N'(d1) Ã— Ïƒ / (2âˆšT) + r Ã— K Ã— e^(-rT) Ã— N(-d2)] / 365
  Vega  = (same as Call â€” symmetric)
  Rho   = -K Ã— T Ã— e^(-rT) Ã— N(-d2) / 100
```

Where `N()` = cumulative normal distribution, `N'()` = standard normal PDF.

**Performance:** Pre-computed CND table (1000-step precision) avoids `erf()` function calls per tick. Each Greek calculation completes in < 1ms. Full chain of 120 strikes in < 120ms (within 5ms target per strike with buffer for math overhead).

**Validation target:** Delta variance < 0.1%, IV variance < 0.5% vs reference implementation (PRD QA-A-004, QA-A-005).

---

## 10.5 IV Analytics Engine

### Current IV

**ATM IV:** Average of ATM Call IV and ATM Put IV. ATM strike = nearest strike to current index price.

**If provider supplies IV:** Use directly. Validate range (0.01 < IV < 5.0 â€” reject outliers).

**If provider does not supply IV:** Solve Newton-Raphson:
```
Given: observed_price, S, K, T, r, option_type
Find: Ïƒ such that BS_price(S, K, T, r, Ïƒ) = observed_price
Newton-Raphson: Ïƒ_new = Ïƒ_old â€“ (BS_price â€“ market_price) / Vega
Converge when |Ïƒ_new â€“ Ïƒ_old| < 0.0001 (4 decimal places)
Max iterations: 100 (convergence typically in < 10)
```

### IV Percentile

**Formula:** Percentile = count(iv_history where iv < current_iv) / total_records Ã— 100

**Lookback:** 252 trading days (1 calendar year).

**Data source:** TimescaleDB `iv_history` table, queried once per 5-minute IV calculation cycle.

**Edge case:** On first launch before 252 days of data: display "Insufficient history (X days)" instead of percentile. Honest about data limitation.

### IV Skew

**Purpose:** Shows whether OTM puts or OTM calls are more expensive (indicating tail-risk hedging direction).

**Calculation:** For each delta level (|Î”| = 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45):
- Find CE and PE with nearest |Î”| to target
- Plot their IVs on skew chart
- Skew = IV(OTM Put) â€“ IV(OTM Call) at same |Î”|

**Output:** Array of `{ delta, callIV, putIV, skew }` â€” consumed by `IVSkewChart` component.

---

## 10.6 Volume Analytics

**Purpose:** Identifies volume-based signals complementing OI analysis.

**Metrics computed:**
- Volume PCR (already in PCR Calculator)
- Volume at strike vs open interest (Volume/OI ratio â€” high ratio = fresh speculation, not rollover)
- Put volume concentration â€” what percentage of total put volume is at the 5 highest-volume strikes?
- Strike volume rank â€” relative ranking of each strike by volume within the session

**These metrics are included in the option chain API response and AI context but do not have dedicated UI panels in V1.0.** Volume analytics are surfaced via the option chain sortable column and AI brief context.

---

## 10.7 Smart Money / Notable Flow Detector

**Purpose:** Identifies OI changes large enough to suggest institutional (or sophisticated retail) positioning.

**Algorithm:**
```
For each OI refresh cycle (every 30 seconds):
  For each strike across all 4 symbols:
    delta = current_OI â€“ previous_cycle_OI

    if abs(delta) > THRESHOLD[symbol]:
      Create FlowEvent:
        type: LARGE_CALL_BUILD | LARGE_PUT_BUILD | LARGE_CALL_UNWIND | LARGE_PUT_UNWIND
        symbol: symbol
        strike: strike
        optionType: CE | PE
        oiChange: delta
        timestamp: now
        significance: 'MAJOR' if delta > 2Ã—THRESHOLD else 'NOTABLE'
```

**Thresholds (configurable in system config):**

| Symbol | NOTABLE Threshold | MAJOR Threshold |
|--------|------------------|-----------------|
| NIFTY | 30,000 lots | 80,000 lots |
| BANKNIFTY | 15,000 lots | 40,000 lots |
| FINNIFTY | 10,000 lots | 25,000 lots |
| MIDCAPSEL | 8,000 lots | 20,000 lots |

**Straddle detection:** If both CE and PE OI increase at the same strike in the same refresh cycle with each exceeding 0.5 Ã— threshold â†’ classify as `STRADDLE_BUILD`. Common before binary events.

**Storage:** Redis list `flow:events:{symbol}` (LPUSH, LTRIM to 100). PostgreSQL `institutional_flow_events` table for persistence and historical analysis.

**UI note:** All flow events labeled as "Notable Flow" â€” never "Institutional Flow" (RG-002 resolution).


---

# EMB Sections 11â€“14

---

# 11. Database Blueprint

## 11.1 Complete Entity Relationship Model

### New Tables (Flow Intelligence)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  EXISTING                         NEW                                       â”‚
â”‚                                                                             â”‚
â”‚  users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€> option_alerts â”€â”€â”€â”€â”€â”€> alert_history      â”‚
â”‚  (id UUID PK)                     (user_id FK)          (alert_id FK)      â”‚
â”‚                                                           (user_id FK)      â”‚
â”‚  trades â—„â”€â”€â”€â”€ (read only for     flow_ai_briefs                            â”‚
â”‚  open OPTIONS positions)          (symbol, type, ...)                       â”‚
â”‚                                                                             â”‚
â”‚  journal_entries â—„â”€ (read        users.flow_preferences JSONB              â”‚
â”‚  only for AI context)             (added via migration)                     â”‚
â”‚                                                                             â”‚
â”‚  coach_memory â—„â”€â”€â”€ (read only)   [TimescaleDB extension tables]            â”‚
â”‚                                   oi_history                                â”‚
â”‚                                   iv_history                                â”‚
â”‚                                   pcr_history                               â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 11.2 Table Specifications

### users (MODIFY â€” extend existing)

**Change:** Add `flow_preferences` JSONB column via migration.

**Structure of `flow_preferences`:**
```json
{
  "defaultSymbol": "NIFTY",
  "defaultExpiry": "weekly",
  "expandedPanels": ["morning-brief", "oi"],
  "alertSoundEnabled": true,
  "layout": "default",
  "heatmapColorScheme": "standard"
}
```

**Rationale:** JSONB is more flexible than individual columns for user preferences that will evolve rapidly. No schema migration required as new preference keys are added. Defaults applied in application code when key is absent.

---

### option_alerts (NEW)

**Purpose:** Stores user-configured alert conditions.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK, gen_random_uuid() | Primary key |
| user_id | UUID | FK â†’ users.id ON DELETE CASCADE | Owner |
| symbol | VARCHAR(20) | NOT NULL | NIFTY, BANKNIFTY, etc. |
| expiry_date | DATE | NULL | NULL = any expiry |
| alert_type | VARCHAR(30) | NOT NULL | OI_CHANGE, PCR_THRESHOLD, IV_SPIKE, MAX_PAIN_PROXIMITY, GAMMA_WALL |
| strike | INTEGER | NULL | NULL = index-level alert |
| option_type | CHAR(2) | NULL | CE, PE, NULL (both) |
| threshold | DECIMAL(12,4) | NOT NULL | Threshold value (percentage or absolute) |
| threshold_unit | VARCHAR(10) | NOT NULL | PERCENT or ABSOLUTE |
| direction | VARCHAR(10) | NOT NULL | ABOVE, BELOW, CROSS |
| notify_method | TEXT[] | NOT NULL DEFAULT '{websocket}' | websocket, push, email |
| is_active | BOOLEAN | NOT NULL DEFAULT true | Soft toggle |
| cooldown_seconds | INTEGER | NOT NULL DEFAULT 300 | Minimum seconds between fires |
| name | VARCHAR(100) | NULL | User-assigned label |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation time |
| last_triggered_at | TIMESTAMPTZ | NULL | When alert last fired |

**Indexes:**
- `idx_option_alerts_user_symbol` ON `(user_id, symbol)` WHERE `is_active = true` â€” used by Alert Engine
- `idx_option_alerts_user_active` ON `(user_id, is_active)` â€” used by CRUD endpoints

**Constraints:**
- CHECK: `alert_type IN ('OI_CHANGE', 'PCR_THRESHOLD', 'IV_SPIKE', 'MAX_PAIN_PROXIMITY', 'GAMMA_WALL')`
- CHECK: `direction IN ('ABOVE', 'BELOW', 'CROSS')`
- CHECK: `threshold > 0`

**Max per user:** Enforced at application level (max 50 active alerts per user).

---

### alert_history (NEW)

**Purpose:** Immutable log of every alert that fired. Used for Alert History UI and auditing.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | Primary key |
| alert_id | UUID | FK â†’ option_alerts.id ON DELETE SET NULL | Source alert |
| user_id | UUID | FK â†’ users.id ON DELETE CASCADE | Owner (denormalized for query performance) |
| symbol | VARCHAR(20) | NOT NULL | Symbol at trigger time |
| strike | INTEGER | NULL | Strike at trigger time |
| alert_type | VARCHAR(30) | NOT NULL | Copied from alert at trigger time |
| triggered_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | When alert fired |
| trigger_value | DECIMAL(12,4) | NOT NULL | Actual value that triggered the alert |
| threshold_value | DECIMAL(12,4) | NOT NULL | Threshold at time of trigger |
| ai_explanation | TEXT | NULL | AI-generated explanation of the event |
| was_read | BOOLEAN | NOT NULL DEFAULT false | UI read state |
| delivery_status | JSONB | NULL | `{ websocket: true, push: false }` |

**Indexes:**
- `idx_alert_history_user_time` ON `(user_id, triggered_at DESC)` â€” for Alert History panel
- `idx_alert_history_unread` ON `(user_id, was_read)` WHERE `was_read = false` â€” for unread badge

**Retention policy:** Records older than 90 days archived to cold storage (S3) and deleted from PostgreSQL.

---

### flow_ai_briefs (NEW)

**Purpose:** Cached AI-generated market briefs. Both shared index briefs and historical record.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK | Primary key |
| symbol | VARCHAR(20) | NOT NULL | NIFTY, BANKNIFTY, etc. |
| expiry_date | DATE | NULL | NULL = aggregate across expiries |
| brief_type | VARCHAR(20) | NOT NULL | MORNING, MIDDAY, CLOSING, POSITION, ALERT |
| headline | TEXT | NOT NULL | One-sentence conclusion |
| observations | JSONB | NOT NULL | Array of 3 observation strings |
| action | TEXT | NOT NULL | Recommended action string |
| confidence | SMALLINT | NOT NULL CHECK (1-5) | Confidence score |
| market_context | JSONB | NULL | Raw market data used for generation |
| model_used | VARCHAR(100) | NULL | LLM model identifier |
| tokens_used | INTEGER | NULL | Total tokens (prompt + completion) |
| generated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Generation timestamp |
| expires_at | TIMESTAMPTZ | NOT NULL | When this brief is considered stale |
| is_valid | BOOLEAN | NOT NULL DEFAULT true | False if failed hallucination check |

**Indexes:**
- `idx_flow_ai_briefs_symbol_type_time` ON `(symbol, brief_type, generated_at DESC)` â€” primary read pattern
- `idx_flow_ai_briefs_active` ON `(symbol, brief_type, expires_at)` WHERE `is_valid = true` â€” cache lookup

**Retention:** Permanent (historical record for AI quality analysis and future model training).

---

### oi_history (TimescaleDB Hypertable â€” NEW)

**Purpose:** Time-series OI snapshots for historical analysis, intraday replay, and AI context.

| Column | Type | Description |
|--------|------|-------------|
| time | TIMESTAMPTZ NOT NULL | Partition key (hypertable time column) |
| symbol | VARCHAR(20) NOT NULL | Index symbol |
| expiry_date | DATE NOT NULL | Option expiry date |
| strike_price | INTEGER NOT NULL | Strike price |
| option_type | CHAR(2) NOT NULL | CE or PE |
| open_interest | BIGINT NOT NULL | Open interest at this timestamp |
| oi_change | INTEGER | Change from previous snapshot |
| volume | BIGINT NOT NULL | Cumulative intraday volume |
| ltp | DECIMAL(10,2) NOT NULL | Last traded price |
| implied_volatility | DECIMAL(8,4) | Implied volatility (NULL if not available) |
| delta | DECIMAL(8,6) | Computed delta |
| gamma | DECIMAL(10,8) | Computed gamma |
| theta | DECIMAL(8,4) | Computed theta (per day, in Rs) |
| vega | DECIMAL(8,4) | Computed vega |

**Hypertable configuration:**
- Partition: by `time`, chunk interval = 1 day
- Space partition: by `symbol` (4 partitions) â€” improves multi-symbol query performance
- Compression: LZSS, compress chunks older than 7 days
- Retention: Keep decompressed data for 30 days, compressed for 1 year, archive to S3 after 1 year

**Indexes:**
- Primary index (TimescaleDB default): `(time DESC, symbol, expiry_date, strike_price, option_type)`
- Secondary: `(symbol, expiry_date, strike_price, option_type, time)` â€” for strike-level history queries
- Continuous aggregate: 1-minute OHLC aggregation of OI (pre-computed by TimescaleDB)

**Insert frequency:** Every 30 seconds per active strike during market hours. Approximately: 4 symbols Ã— 120 strikes Ã— 2 types Ã— 2 rows/min = 1,920 rows/minute = 32 rows/second. Well within TimescaleDB's insert capacity.

---

### iv_history (TimescaleDB Hypertable â€” NEW)

| Column | Type | Description |
|--------|------|-------------|
| time | TIMESTAMPTZ NOT NULL | Partition key |
| symbol | VARCHAR(20) NOT NULL | Index symbol |
| india_vix | DECIMAL(8,4) NOT NULL | India VIX at this timestamp |
| atm_iv | DECIMAL(8,4) | ATM implied volatility |
| iv_percentile | DECIMAL(5,2) | IV percentile at this time |

**Retention:** 2 years (required for 252-day percentile calculation with buffer).

---

### pcr_history (TimescaleDB Hypertable â€” NEW)

| Column | Type | Description |
|--------|------|-------------|
| time | TIMESTAMPTZ NOT NULL | Partition key |
| symbol | VARCHAR(20) NOT NULL | Index symbol |
| expiry_date | DATE NOT NULL | Expiry this PCR applies to |
| pcr_oi | DECIMAL(8,4) NOT NULL | OI-based PCR |
| pcr_volume | DECIMAL(8,4) NOT NULL | Volume-based PCR |
| call_oi_total | BIGINT | Total call OI |
| put_oi_total | BIGINT | Total put OI |

**Retention:** 1 year.

---

## 11.3 Database Migration Strategy

### Phase 1 (V0.5): PostgreSQL Only

Run Prisma migrations:
1. `20260808_add_flow_preferences` â€” ALTER users ADD COLUMN flow_preferences JSONB DEFAULT '{}'
2. `20260808_create_option_alerts` â€” CREATE TABLE option_alerts
3. `20260808_create_alert_history` â€” CREATE TABLE alert_history
4. `20260808_create_flow_ai_briefs` â€” CREATE TABLE flow_ai_briefs
5. Create `oi_history`, `iv_history`, `pcr_history` as regular PostgreSQL tables with composite indexes (no TimescaleDB extension yet)

### Phase 2 (V1.1): Enable TimescaleDB

1. Install TimescaleDB extension on existing RDS instance (requires PostgreSQL 15 compatibility)
2. Run `CREATE EXTENSION IF NOT EXISTS timescaledb;`
3. Convert existing tables to hypertables:
   - `SELECT create_hypertable('oi_history', 'time', if_not_exists => TRUE)`
   - Same for `iv_history`, `pcr_history`
4. Apply compression policy
5. Apply retention policy
6. No application code changes â€” TimescaleDB is transparent to Prisma queries (raw SQL queries in Repository layer bypass Prisma ORM for time-series operations)

### Rollback Strategy

Each Prisma migration is reversible. TimescaleDB extension can be dropped without data loss (tables revert to regular PostgreSQL). Rollback procedure documented in `docs/options-intelligence/runbooks/`.

---

## 11.4 Data Archival Policy

| Data Type | Hot (active) | Warm (compressed) | Cold (S3 archive) | Delete |
|-----------|-------------|-------------------|-------------------|--------|
| OI history | 30 days (PostgreSQL decompressed) | 1 year (TimescaleDB compressed) | 5 years (S3 Parquet) | After 5 years |
| IV history | 30 days | 2 years | 5 years | After 5 years |
| PCR history | 30 days | 1 year | 3 years | After 3 years |
| Alert history | 90 days | â€” | 1 year (S3) | After 1 year |
| AI briefs | Permanent (small table) | â€” | â€” | Never |
| User alert configs | Permanent (active records only) | â€” | â€” | On user deletion |

---

# 12. API Blueprint

## 12.1 REST API Specification

### Base Configuration

```
Base URL: /api/v1/flow
Authentication: Bearer JWT (header: Authorization: Bearer {token})
Content-Type: application/json
API Version: v1 (see versioning strategy)
```

### Standard Response Envelope

All responses follow this envelope:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "symbol": "NIFTY",
    "dataAge": 12,
    "updatedAt": "2026-08-08T09:45:23.000Z",
    "requestId": "req_abc123"
  },
  "error": null
}
```

Error response:
```json
{
  "success": false,
  "data": null,
  "meta": { "requestId": "req_abc123" },
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Retry after 60 seconds.",
    "retryAfter": 60
  }
}
```

---

### Market Data Endpoints

#### GET /api/v1/flow/overview

**Purpose:** Single endpoint to populate all command bar and card metrics. First call on page load.

**Query parameters:**
- `symbol` (required): NIFTY | BANKNIFTY | FINNIFTY | MIDCAPSEL
- `expiry` (optional): ISO date string. Defaults to nearest weekly expiry.

**Response `data` shape:**
```json
{
  "pcr": {
    "oiBased": 1.24,
    "volumeBased": 1.18,
    "change24h": 0.08,
    "interpretation": "Put Heavy",
    "sparkline": [1.10, 1.15, 1.12, 1.19, 1.24],
    "tooltip": "Put-Call Ratio measures total Put OI divided by total Call OI..."
  },
  "maxPain": {
    "strike": 22800,
    "proximity": 200,
    "proximityPct": 0.87,
    "magnetStrength": 0.72
  },
  "iv": {
    "atm": 16.8,
    "percentile": 68,
    "trend": "RISING",
    "status": "ELEVATED",
    "change5Day": 1.2
  },
  "vix": {
    "current": 14.2,
    "change24h": -0.3,
    "changePct": -2.1,
    "status": "NORMAL",
    "sparkline": [14.8, 14.5, 14.3, 14.4, 14.2]
  },
  "session": "POWER_HOUR",
  "sessionEndsAt": "2026-08-08T10:00:00.000Z",
  "aiSummary": "Market pinning near 22,800 max pain as theta decay accelerates."
}
```

**Cache:** `Cache-Control: s-maxage=30, stale-while-revalidate=60`

---

#### GET /api/v1/flow/oi-chain

**Purpose:** Full option chain with OI, Greeks, IV per strike.

**Query parameters:**
- `symbol` (required)
- `expiry` (required): ISO date
- `atmRange` (optional): Number of strikes each side of ATM. Default: 20.

**Response `data` shape:**
```json
{
  "strikes": [
    {
      "strike": 23000,
      "call": {
        "ltp": 145.00,
        "oi": 1234567,
        "oiChange": 45000,
        "oiChangePct": 3.78,
        "oiChangeDod": -12000,
        "volume": 234567,
        "iv": 17.2,
        "delta": 0.42,
        "gamma": 0.0012,
        "theta": -45.2,
        "vega": 32.1,
        "bid": 144.50,
        "ask": 145.50,
        "isMaxPain": false,
        "isHighestOI": true,
        "oiNormalized": 0.87
      },
      "put": { ... },
      "isATM": false,
      "isITMCall": false,
      "isITMPut": true
    }
  ],
  "atmStrike": 22900,
  "expiryDate": "2026-08-14",
  "lastUpdated": "2026-08-08T09:45:00.000Z"
}
```

**Cache:** `Cache-Control: no-store` (real-time data, served from Redis)

---

#### GET /api/v1/flow/oi-history

**Purpose:** Historical OI timeline for a specific strike (for intraday replay and chart).

**Query parameters:**
- `symbol` (required)
- `expiry` (required)
- `strike` (required): integer
- `optionType` (required): CE | PE
- `from` (required): ISO datetime
- `to` (required): ISO datetime
- `interval` (optional): 1m | 5m | 15m | 1d. Default: 1m.

**Response `data` shape:**
```json
{
  "timeline": [
    { "time": "2026-08-08T09:15:00.000Z", "oi": 1180000, "oiChange": null, "ltp": 162.00 },
    { "time": "2026-08-08T09:16:00.000Z", "oi": 1195000, "oiChange": 15000, "ltp": 158.50 }
  ],
  "meta": {
    "symbol": "NIFTY",
    "strike": 23000,
    "optionType": "CE",
    "expiryDate": "2026-08-14",
    "sessionOpen": 1180000,
    "sessionHigh": 1240000,
    "sessionLow": 1175000
  }
}
```

**Cache:** `Cache-Control: s-maxage=60` for intraday. `s-maxage=3600` for historical dates.

---

#### GET /api/v1/flow/iv-surface

**Purpose:** IV matrix across strikes and expiries for IV surface chart.

**Query parameters:**
- `symbol` (required)

**Response `data` shape:**
```json
{
  "surface": [
    { "strike": 22000, "expiryDate": "2026-08-14", "iv": 18.2, "expiryLabel": "Aug 14" },
    { "strike": 22000, "expiryDate": "2026-08-28", "iv": 17.8, "expiryLabel": "Aug 28" }
  ],
  "atmStrike": 22900,
  "availableExpiries": ["2026-08-14", "2026-08-28", "2026-09-25"]
}
```

**Cache:** `Cache-Control: s-maxage=300`

---

#### GET /api/v1/flow/flow-events

**Purpose:** Recent notable flow events (large OI changes).

**Query parameters:**
- `symbol` (required)
- `since` (optional): ISO datetime. Default: 2 hours ago.
- `minSignificance` (optional): NOTABLE | MAJOR. Default: NOTABLE.
- `limit` (optional): 1â€“100. Default: 20.

**Response `data` shape:**
```json
{
  "events": [
    {
      "id": "evt_abc123",
      "type": "LARGE_CALL_BUILD",
      "symbol": "NIFTY",
      "strike": 23500,
      "optionType": "CE",
      "oiChange": 82000,
      "significance": "MAJOR",
      "timestamp": "2026-08-08T08:23:00.000Z",
      "aiNote": "Aggressive call writing at 23,500 CE suggests strong resistance being built at this level.",
      "aiNoteConfidence": 4
    }
  ],
  "totalEvents": 12
}
```

---

### AI Endpoints

#### GET /api/v1/flow/morning-brief

**Purpose:** Returns the current AI morning brief for the symbol.

**Query parameters:**
- `symbol` (required)
- `includePersonal` (optional): boolean. Default: true. If true, appends personal position overlay.

**Response `data` shape:**
```json
{
  "brief": {
    "headline": "Market is exhibiting Put Long Buildup pattern â€” institutional positioning cautious.",
    "observations": [
      "OI at 23,000 CE increased 34% in last 2 hours â€” strong resistance wall forming.",
      "PCR at 1.24 (5-week high) â€” put buyers dominant but approaching contrarian territory.",
      "IV elevated at 68th percentile â€” buyers paying above-average premium."
    ],
    "action": "Watch 23,000 CE wall â€” breach would signal significant upside breakout.",
    "confidence": 4,
    "briefType": "MORNING",
    "generatedAt": "2026-08-08T03:00:00.000Z",
    "expiresAt": "2026-08-08T04:30:00.000Z",
    "isStale": false
  },
  "personalOverlay": {
    "positions": [
      {
        "symbol": "NIFTY",
        "strike": 23000,
        "optionType": "CE",
        "assessment": "Your position is directly at the resistance wall. OI building against your long.",
        "riskLevel": "HIGH",
        "watchLevel": 23000,
        "historicalNote": "You have held similar patterns 12 times. Win rate: 25%."
      }
    ],
    "summary": "Your open positions face elevated risk today. Consider reviewing position sizing."
  }
}
```

**Error handling:** If brief is not available, returns `{ brief: null, fallback: { pcr, maxPain, iv } }`.

---

### User Endpoints

#### GET /api/v1/flow/my-positions

**Purpose:** User's open OPTIONS positions with market context overlay.

**Response `data` shape:**
```json
{
  "positions": [
    {
      "tradeId": "trd_abc123",
      "symbol": "NIFTY",
      "strike": 23000,
      "optionType": "CE",
      "expiry": "2026-08-14",
      "quantity": 75,
      "avgPrice": 145.00,
      "currentLTP": 98.00,
      "unrealizedPnl": -3525,
      "unrealizedPnlPct": -32.4,
      "oiContext": {
        "currentOI": 1234567,
        "oiChange": 45000,
        "isCallWall": true,
        "isPutWall": false
      },
      "greeks": { "delta": 0.38, "theta": -42.1, "gamma": 0.0010 },
      "aiAlert": {
        "message": "OI buildup against your position. Resistance at your strike.",
        "severity": "WARNING"
      }
    }
  ]
}
```

---

#### CRUD /api/v1/flow/alerts

**GET** â€” List all alerts for authenticated user.
**POST** â€” Create new alert. Request body: `{ symbol, expiry, alertType, strike, optionType, threshold, thresholdUnit, direction, notifyMethod, name }`.
**PUT /:id** â€” Update alert.
**DELETE /:id** â€” Soft delete (set is_active = false).

**GET /api/v1/flow/alerts/history** â€” Paginated alert history.

---

### WebSocket Protocol

**Endpoint:** `/ws/flow?token={wsToken}`

**WS Token issuance:** `POST /api/v1/flow/ws-token` returns a 30-second single-use token for WebSocket authentication.

**Messages (Client â†’ Server):**
```json
{ "type": "SUBSCRIBE_ALERTS", "symbols": ["NIFTY", "BANKNIFTY"] }
{ "type": "UNSUBSCRIBE_ALERTS", "symbols": ["BANKNIFTY"] }
{ "type": "PING", "id": "ping_001" }
{ "type": "DISMISS_ALERT", "alertHistoryId": "ah_abc123" }
```

**Messages (Server â†’ Client):**
```json
{ "type": "ALERT_FIRED", "alertId": "al_abc", "alertHistoryId": "ah_123", "message": "...", "severity": "WARNING", "action": { "label": "View OI", "url": "/app/flow?tab=oi&strike=23000" }, "timestamp": "..." }
{ "type": "PONG", "id": "ping_001" }
{ "type": "CONNECTION_ESTABLISHED", "userId": "...", "subscribedSymbols": [] }
```

---

### SSE Event Stream

**Endpoint:** `/sse/flow?symbols=NIFTY,BANKNIFTY`

**Authentication:** Bearer token via query parameter `?token={accessToken}` (EventSource doesn't support custom headers in browsers).

**Event types:**
```
event: oi_update
data: {"symbol":"NIFTY","strike":23000,"optionType":"CE","oi":1234567,"oiChange":45000,"oiChangePct":3.78,"ltp":145.00,"delta":0.42,"gamma":0.0012,"theta":-45.2,"vega":32.1,"timestamp":"..."}

event: pcr_update
data: {"symbol":"NIFTY","expiryDate":"2026-08-14","pcrOI":1.24,"pcrVol":1.18,"updatedAt":"..."}

event: vix_update
data: {"current":14.2,"change24h":-0.3,"status":"NORMAL","timestamp":"..."}

event: flow_event
data: {"id":"evt_abc","type":"LARGE_CALL_BUILD","symbol":"NIFTY","strike":23500,"optionType":"CE","oiChange":82000,"significance":"MAJOR","timestamp":"...","aiNote":"..."}

event: session_update
data: {"session":"POWER_HOUR","nextSession":"CLOSING","transitionAt":"2026-08-08T10:00:00.000Z"}

event: ai_update
data: {"symbol":"NIFTY","briefType":"MORNING","headline":"...","confidence":4,"updatedAt":"..."}

event: heartbeat
data: {"timestamp":"..."}
```

**Heartbeat:** Sent every 30 seconds to keep connection alive through proxies.

**Last-Event-ID:** Each SSE event includes `id: {symbol}:{timestamp_ms}`. On reconnect, server replays events since `Last-Event-ID` from Redis list (60-second window).

---

## 12.2 API Response Caching

| Endpoint | CDN Cache | Client Cache | Edge Notes |
|----------|-----------|-------------|------------|
| `/overview` | 30s | `stale-while-revalidate: 60` | Cloudflare edge cache (per symbol) |
| `/oi-chain` | No cache | No cache | Real-time â€” always fresh from Redis |
| `/oi-history` (today) | 60s | 60s | TimescaleDB read â€” caches well |
| `/oi-history` (historical) | 3600s | 3600s | Immutable historical data |
| `/iv-surface` | 300s | 300s | Refreshed every 5 min |
| `/flow-events` | 30s | 30s | â€” |
| `/morning-brief` | 1800s | 1800s | Per symbol â€” not per user (shared) |
| `/my-positions` | No cache | No cache | User-specific, real-time |
| `/alerts` | No cache | No cache | User-specific |
| `/alerts/history` | No cache | 60s | Paginated |

---

## 12.3 Pagination Standard

For list endpoints (alert history, flow events):

**Request parameters:**
- `cursor` (optional): Opaque cursor token (base64 encoded sort key + id)
- `limit` (optional): 1â€“100. Default: 20.
- `direction` (optional): `next` | `prev`. Default: `next`.

**Response:**
```json
{
  "data": { "items": [...] },
  "pagination": {
    "hasNext": true,
    "hasPrev": false,
    "nextCursor": "eyJ0aW1lIjoi...",
    "totalCount": 47
  }
}
```

Cursor-based pagination is used (not offset-based) to avoid phantom reads in high-write tables.

---

## 12.4 Error Codes

| HTTP Status | Error Code | Meaning |
|-------------|-----------|---------|
| 400 | INVALID_PARAMS | Missing or malformed query parameters |
| 401 | UNAUTHORIZED | No token or expired token |
| 403 | PREMIUM_REQUIRED | Flow Intelligence requires premium tier |
| 404 | NOT_FOUND | Alert or brief not found |
| 422 | INVALID_SYMBOL | Symbol not in supported list |
| 422 | INVALID_EXPIRY | Expiry date not available |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |
| 503 | DATA_UNAVAILABLE | Market data provider offline |
| 503 | AI_UNAVAILABLE | AI service temporarily unavailable |

---

# 13. Security Blueprint

## 13.1 Authentication Architecture

### JWT Token Strategy

Flow Intelligence inherits the existing RiskRule JWT strategy:
- Access token TTL: 15 minutes (PRD Â§16.1)
- Refresh token TTL: 7 days
- Algorithm: RS256 (asymmetric) â€” not HS256. Private key for signing on server, public key for verification.

**Why RS256 over HS256:** RS256 allows token verification without exposing the signing key. If a microservice needs to verify tokens, it receives only the public key. This is critical as the modular monolith evolves toward microservices.

### WebSocket Authentication

The existing JWT cannot be sent in the WebSocket handshake header from browsers (EventSource / WebSocket API restrictions). Solution:
1. Client calls `POST /api/v1/flow/ws-token` with valid JWT in Authorization header
2. Server issues a short-lived (30 seconds, single-use) WebSocket token stored in Redis
3. Client connects to `/ws/flow?token={wsToken}`
4. Server validates WS token, retrieves `userId`, establishes connection
5. WS token deleted from Redis after first successful use (single-use enforcement)

### SSE Authentication

Client includes access token as query parameter: `/sse/flow?symbols=NIFTY&token={accessToken}`

**Security note:** Access tokens in query parameters appear in server access logs. Mitigations:
- Log sanitization: Strip `token` query param from all access logs
- Token TTL is 15 minutes â€” window is narrow
- HTTPS enforced (TLS encrypts query parameters in transit)

---

## 13.2 Authorization and Tier Enforcement

### `flowAuth.middleware.ts`

Applied to all `/api/v1/flow/*` routes. Checks:
1. JWT is present and valid
2. User exists in database (not deleted)
3. User's account tier includes Flow Intelligence access

**Tier check logic:** Reads `user.flow_preferences` for a `tier` flag, OR checks a `subscriptions` table if billing is added. In V1.0, controlled via a feature flag: `FLOW_ENABLED_TIERS=premium,admin`.

**`req.flowContext` injection:** Middleware attaches to the request object:
```
req.flowContext = {
  userId: string,
  tier: 'free' | 'premium' | 'admin',
  defaultSymbol: string,
  hasActivePositions: boolean    (fast check from Redis session)
}
```

This eliminates repetitive user lookups in every service function.

---

## 13.3 Data Provider Security

**API keys stored:** Environment variables only. Never in code, never in database, never in client-side bundle.

**Key rotation:** Every 90 days (PRD Â§16.4). Rotation procedure in runbook.

**Provider connections:** Server-side only. No proxying of raw data provider credentials to client.

**Backup provider key:** Separate credentials for backup provider, kept in secrets manager. Never the same key as primary.

---

## 13.4 AI Prompt Injection Prevention

The AI context assembler is a potential attack surface. If a user's journal entry or position notes contain adversarial content, it could manipulate the AI output.

**Mitigations:**
1. **Structural separation:** User-provided text (journal, notes) is always passed in the context as a labeled JSON field â€” never concatenated into the prompt instructions. The LLM receives a JSON object, not free-form text.
2. **Input sanitization:** All user text is stripped of prompt-format patterns (`Assistant:`, `Human:`, `<system>`) before being included in context.
3. **Output validation:** The hallucination checker validates that the AI output only references data from the market context payload â€” not from the user text fields. This limits the impact of any injected content.
4. **Output schema enforcement:** AI responses are parsed against a strict Zod schema. Any response not matching the schema is rejected â€” preventing arbitrary text injection via AI response.

---

## 13.5 Data Encryption

**At rest:**
- PostgreSQL: Encrypted at the database engine level (AWS RDS storage encryption, AES-256)
- Redis: AWS ElastiCache at-rest encryption enabled
- S3 (archived data): Server-side encryption (SSE-S3)

**In transit:**
- All communication: TLS 1.3 (minimum TLS 1.2)
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

**Sensitive fields:**
- `trades.entryPrice`, `trades.exitPrice`, `trades.pnl`: Encrypted at application level using AES-256 in the database, decrypted only for the owning user (PRD Â§16.2)
- AI context sent to LLM provider: Contains position data. User consent required (one-time prompt on first Flow Intelligence use). DPDP Act compliance (PRD Â§20.3).

---

## 13.6 Input Validation

All API endpoints validate input using Zod schemas:
- `symbol`: Must be in the enum `['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCAPSEL']`
- `expiry`: Must parse as a valid future date
- `strike`: Must be a positive integer
- `threshold`: Must be a positive number within a sensible range (0.001â€“10000)
- Alert type: Must be in the allowed enum

Validation failures return HTTP 400 with a structured error listing all failing fields.

---

## 13.7 Security Headers

Applied via NGINX configuration:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{nonce}'; connect-src 'self' wss://api.riskrule.in; img-src 'self' data:; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**CSP notes:**
- `wss://` must be explicitly listed for WebSocket connections
- No `unsafe-inline` or `unsafe-eval` in production
- Nonce-based script authorization for any inline scripts

---

## 13.8 CORS Configuration

CORS restricted to RiskRule domains (PRD Â§18.6):
```
Access-Control-Allow-Origin: https://app.riskrule.in, https://riskrule.in
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-Request-ID
Access-Control-Max-Age: 86400
```

---

## 13.9 Rate Limiting Implementation

**Strategy:** Sliding window rate limiter using Redis `INCR` + `EXPIRE`.

```
Key: ratelimit:{userId}:{minute_bucket}
Value: request count
TTL: 60 seconds

On each request:
1. INCR ratelimit:{userId}:{floor(timestamp/60000)}
2. EXPIRE ratelimit:{userId}:{...} 60
3. If count > limit: return 429 with Retry-After header
```

**Limits (per PRD Â§16.3):**
- REST API: 600 req/min per user
- AI brief manual refresh: 10 req/hour per user
- Alert creation: 50 active alerts max (database count)
- WebSocket subscriptions: 20 symbols max per connection

---

## 13.10 Threat Model

| Threat | Likelihood | Impact | Control |
|--------|-----------|--------|---------|
| API credential theft | Medium | Critical | Keys in env vars only. Key rotation. Zero client exposure |
| JWT token replay | Low | High | Short TTL (15 min). Refresh token rotation |
| WebSocket hijacking | Low | Medium | WS token single-use. Short TTL (30s) |
| Prompt injection via journal | Medium | Medium | Structural separation, input sanitization, output schema enforcement |
| DDoS on market hours | Medium | Critical | Cloudflare DDoS protection. Rate limiting. CDN edge caching |
| SQL injection | Low | Critical | Prisma parameterized queries only. Zod input validation |
| SSRF via provider URL | Low | High | Provider URLs hardcoded in env vars â€” not configurable by users |
| Data scraping via API | Medium | Medium | Rate limiting. Auth required. No unauthenticated endpoints |
| AI hallucination as financial advice | High | High | Hallucination checker. Schema enforcement. No "Buy/Sell" command language |

---

# 14. Performance Blueprint

## 14.1 Performance Budget â€” Frontend

| Metric | Budget | Measurement | Failure Action |
|--------|--------|-------------|---------------|
| First Contentful Paint | < 800ms | Lighthouse CI | Block PR merge |
| Time to Interactive | < 1,500ms | Lighthouse CI | Block PR merge |
| Largest Contentful Paint | < 1,200ms | Lighthouse CI | Block PR merge |
| Cumulative Layout Shift | < 0.05 | Lighthouse CI | Block PR merge |
| Total JS Bundle Size | < 400KB gzip | Vite bundle analyzer | Block PR merge |
| Flow Intelligence chunk | < 120KB gzip | Vite bundle analyzer | Engineering review |
| OI Chain Initial Load | < 500ms | Custom perf mark | Alert on-call |
| OI Heatmap Render | < 300ms | Chrome Performance API | Engineering review |

**Code splitting strategy:**
- Flow Intelligence is a lazy-loaded route chunk (`React.lazy(() => import('./pages/Flow'))`)
- D3.js (IV Surface) is dynamically imported only when IV panel is first expanded â€” not in initial chunk
- TanStack Virtual is included in the Flow chunk (required for option chain on load)

---

## 14.2 Performance Budget â€” Backend

| Metric | Budget | Measurement |
|--------|--------|-------------|
| API P50 response time | < 50ms | Prometheus histogram |
| API P95 response time | < 200ms | Prometheus histogram |
| API P99 response time | < 500ms | Prometheus histogram |
| Greeks calculation per strike | < 5ms | Server-side profiler |
| Max Pain calculation | < 100ms | Server-side timer |
| AI brief generation | < 3,000ms | Server-side timer |
| Alert delivery latency | < 15,000ms | End-to-end timestamp |
| WebSocket message delivery | < 100ms | Client-side timestamp diff |
| Redis cache hit rate | > 95% | Prometheus counter |
| TimescaleDB query P99 | < 200ms | Prometheus histogram |

---

## 14.3 Caching Performance Strategy

**Target: Serve 95%+ of requests from Redis cache during market hours.**

**Cache warming schedule:**
- 8:45 AM: Worker pre-computes and caches overview data for all 4 symbols
- 9:00 AM: Session baseline snapshots taken. Alert config cache populated.
- 9:15 AM: Market open â€” baseline OI snapshot. Full option chain cached.

**Cache miss handling:**
- On cache miss: compute synchronously, write to cache, respond
- Log cache miss as metric `flow.cache.miss.{dataType}`
- If miss rate > 5%: alert engineering team (indicates cache invalidation bug)

---

## 14.4 Database Performance

### PostgreSQL

**Connection pool:** Prisma connection pool size = `max(10, CPU_cores Ã— 2)`. For 4-vCPU server: max 10 connections.

**Query optimization rules:**
- All queries on `option_alerts` use the `(user_id, symbol)` index (most frequent pattern)
- `alert_history` queries always filter by `user_id` first (partition pruning on that index)
- Never use `SELECT *` â€” always specify column list

### TimescaleDB

**OI history queries:**
- Intraday replay: Use continuous aggregate (1-minute OHLC). Never query raw hypertable.
- Historical comparison: Use chunk exclusion (specify date range in WHERE clause to enable chunk skipping)

**Query patterns and expected performance:**
- Strike intraday timeline (1 day): < 50ms
- Strike week history: < 200ms
- IV percentile calculation (252 days): < 500ms (mitigated by daily pre-computation)

---

## 14.5 WebSocket/SSE Performance

**Concurrent connection capacity:**
- Target: 10,000+ concurrent WebSocket connections (PRD Â§15.2)
- Each connection is lightweight: event emitter + Redis subscription pointer
- Memory per connection: ~4KB (connection object + buffer). 10,000 connections = ~40MB

**Fan-out performance:**
- One Redis PUBLISH â†’ one SSE Bridge subscriber â†’ fan-out to N clients
- Fan-out is a simple loop over `Set<SSEResponse>`. O(N) per message.
- At 10,000 clients and 1 message/second: 10,000 write operations/second â€” within Node.js event loop capacity on 2 vCPUs

**Scaling:** If fan-out becomes a bottleneck, add a second SSE Bridge instance. Each instance subscribes to the same Redis channel â€” no coordination needed. NGINX load-balances clients across instances.

---

## 14.6 Frontend Rendering Performance

### Virtual Scrolling (Option Chain)

TanStack Virtual configuration:
- `estimateSize: () => 48` â€” fixed row height (48px)
- `overscan: 5` â€” render 5 rows outside visible area
- `paddingStart: 56` â€” account for sticky header

Expected performance: 200+ row option chain renders in < 16ms (single frame at 60fps).

### OI Heatmap Performance

**React approach (V1.0):** Memo-wrapped cells. `React.memo` + shallow comparison on `oiNormalized` value. Re-render only when value changes.

**Canvas fallback (V1.1 if needed):** Direct Canvas 2D API drawing. No React reconciliation. Cell updates via `drawRect()` â€” ~0.1ms per cell. Full 160-cell heatmap redraw: ~16ms (1 frame).

### Number Animation Performance

Framer Motion's `useSpring` uses `requestAnimationFrame` internally. At 60fps, 16ms per frame budget. Each animated number: < 0.1ms compute. Up to 100 animated numbers simultaneously: < 10ms â€” safe.

---

## 14.7 Memory Management

**Frontend:**
- Flow store is cleared on route unmount (SSE subscription closed, WebSocket closed)
- OI chain Map is bounded to `ATM Â± 30` strikes â€” never grows unbounded
- Flow events list bounded to last 100 items

**Backend:**
- SSE response objects removed from `ConnectionManager` on client disconnect (EventSource `close` event)
- Redis `flow:events:{symbol}` lists capped at 100 items (LTRIM after each LPUSH)
- Worker tick handlers do not accumulate tick history in memory â€” all history written to TimescaleDB

**Redis memory:**
- `maxmemory-policy: allkeys-lru` â€” least recently used items evicted under memory pressure
- Critical state keys (OI chain, PCR, Max Pain) use explicit `PERSIST` â€” never evicted
- Alert cooldown keys: 300s TTL. Self-cleaning.
- Session keys: 86400s TTL. Self-cleaning.


---

# EMB Sections 15â€“18

---

# 15. DevOps Blueprint

## 15.1 Environment Strategy

| Environment | Purpose | Data | Deployment | Redis | Database |
|-------------|---------|------|-----------|-------|----------|
| **Local** | Individual developer development | Mock provider (MockProvider.ts) | `npm run dev` + `docker-compose up` | Local Redis via Docker | Local PostgreSQL via Docker |
| **Staging** | Pre-release testing, integration, QA | Live market data (delayed 15 min) | GitHub Actions â†’ ECS staging | ElastiCache (small) | RDS staging |
| **Canary** | 5% of production traffic â€” new release validation | Live market data | GitHub Actions â†’ ECS canary | Same as production | Same as production (read replica) |
| **Production** | Full traffic | Live market data | GitHub Actions â†’ ECS production | ElastiCache cluster | RDS Multi-AZ |

---

## 15.2 Local Development Setup

### docker-compose.yml services (additions for Flow Intelligence)

```
Services defined:
  postgres:      PostgreSQL 15 with TimescaleDB extension pre-enabled
  redis:         Redis 7 (single node for local)
  flow-worker:   Market data worker with MockProvider (no real API key needed)

Developer setup steps:
  1. Clone repository
  2. Copy .env.example â†’ .env
  3. docker-compose up -d
  4. cd server && npx prisma migrate dev
  5. cd server && npx ts-node workers/DataBackfillWorker.ts --mode mock (generates 30 days of fake historical OI)
  6. npm run dev (starts both Vite frontend and Express backend)
```

**MockProvider behavior:**
- Generates realistic option chain ticks based on Brownian motion model
- Simulates OI buildup patterns at random strikes every few minutes
- Generates simulated alert triggers for testing
- Produces consistent IV values for Greeks calculation testing
- Supports time acceleration (10Ã— real-time for testing session transitions)

---

## 15.3 CI/CD Pipeline

### GitHub Actions Workflow: `flow-intelligence.yml`

```
Triggers: Push to main, PR to main

Jobs (in order):

  1. lint-and-type-check
     - ESLint on frontend and backend
     - TypeScript type check (tsc --noEmit)
     - Failure: Block PR merge

  2. unit-tests
     - Frontend: Vitest (component tests, hook tests)
     - Backend: Jest (service tests, analytics engine tests)
     - Coverage requirement: > 80% for new flow/* files
     - Failure: Block PR merge

  3. integration-tests
     - Backend Supertest integration tests against test database
     - Redis: Redis test instance (Docker service in action)
     - Failure: Block PR merge

  4. lighthouse-ci
     - Build production frontend bundle
     - Run Lighthouse against staging URL with test data
     - Assert: FCP < 800ms, TTI < 1500ms, LCP < 1200ms, CLS < 0.05
     - Assert: Bundle size delta < +20KB from baseline
     - Failure: Block PR merge

  5. security-scan
     - npm audit (high + critical severity)
     - Snyk SAST scan on new files
     - Failure: Block PR merge

  6. build-docker-images
     - Build backend Docker image
     - Push to ECR with commit SHA tag
     - Trigger: Only on main branch push

  7. deploy-staging
     - ECS rolling update on staging cluster
     - Smoke tests (canary check: /api/health, /api/v1/flow/overview)
     - Trigger: Only on main branch push

  8. deploy-canary (manual approval required)
     - ECS canary deployment (5% traffic weight)
     - Monitor error rate for 15 minutes
     - Auto-rollback if error rate > 1%

  9. deploy-production (manual approval required)
     - ECS blue/green deployment
     - Traffic shifts to green after health check passes
     - Old (blue) kept alive for 5 minutes for emergency rollback
```

---

## 15.4 Docker Configuration

### Backend Dockerfile

```
Multi-stage build:
  Stage 1 (builder): Node 20 alpine, install dependencies, compile TypeScript
  Stage 2 (runner): Node 20 alpine slim, copy dist/, node_modules/
  Non-root user: uid=1001 (security)
  Health check: GET /api/health every 30s
  Exposed port: 3001
```

### Frontend (Vercel)

- Vite build output uploaded to Vercel
- `vercel.json` configured for SPA routing (all paths â†’ index.html)
- Environment variables injected at build time via Vercel project settings
- Preview deployments: Automatic on every PR (unique URL per PR)

---

## 15.5 Infrastructure Scaling

### Schedule-Based Auto-Scaling (PRD Â§18.5)

ECS service auto-scaling rules:

| Time (IST) | Action | Reason |
|------------|--------|--------|
| 8:45 AM Monâ€“Fri | Scale UP: API 4 â†’ 6 replicas, WS 4 â†’ 8 replicas | Pre-market traffic surge |
| 9:00 AM | Scale UP: API 6 â†’ 8, WS 8 â†’ 16 | Market open imminent |
| 9:15 AM | Scale UP: Worker â†’ 2 replicas (hot standby ready) | Market open |
| 3:30 PM | Begin Scale DOWN: API 8 â†’ 4 | Market close |
| 4:30 PM | Scale DOWN: API 4 â†’ 2, WS 16 â†’ 4 | Post-market wind down |
| 5:00 PM | Minimum replicas | After-hours mode |

**Metric-based scaling:** If CPU > 70% on any service for 3 consecutive minutes â†’ add 2 replicas (up to max).

**Expiry day scaling:** On weekly F&O expiry (Thursday) and monthly expiry: Manual scaling to 2Ã— normal capacity started at 8:30 AM. Runbook: `Market_Expiry_Day_Operations.md`.

---

## 15.6 NGINX Configuration

Key configuration for Flow Intelligence:

**Long-lived SSE connections:**
```
SSE endpoint configuration:
  proxy_buffering: off
  proxy_cache: off
  proxy_read_timeout: 3600s (keep SSE alive for 1 hour)
  X-Accel-Buffering: no
```

**WebSocket upgrade:**
```
WebSocket endpoint:
  proxy_http_version: 1.1
  Upgrade: $http_upgrade
  Connection: "upgrade"
  proxy_read_timeout: 3600s
```

**Rate limiting at NGINX layer:**
```
limit_req_zone: $binary_remote_addr zone=flow_api:10m rate=100r/m
  (Global per-IP limit before Express per-user limit)
```

---

## 15.7 Monitoring and Observability

### Prometheus Metrics (exposed at `/metrics`)

**Market data metrics:**
- `flow_ticks_processed_total{symbol}` â€” Counter: OI ticks processed
- `flow_tick_processing_duration_seconds{symbol}` â€” Histogram: full pipeline duration per tick
- `flow_tick_errors_total{symbol, error_type}` â€” Counter: validation/processing errors

**API metrics:**
- `flow_api_requests_total{endpoint, method, status}` â€” Counter
- `flow_api_duration_seconds{endpoint}` â€” Histogram (P50, P95, P99)
- `flow_cache_hits_total{data_type}` / `flow_cache_misses_total{data_type}` â€” Cache hit rate

**AI metrics:**
- `flow_ai_generations_total{type, symbol, success}` â€” Counter
- `flow_ai_duration_seconds{type}` â€” Histogram: LLM generation time
- `flow_ai_tokens_used_total{type, model}` â€” Counter: cost tracking
- `flow_ai_hallucination_rejections_total` â€” Counter: failed validation

**Alert metrics:**
- `flow_alerts_fired_total{type, symbol}` â€” Counter
- `flow_alert_delivery_latency_seconds` â€” Histogram: time from trigger to client receipt

**WebSocket metrics:**
- `flow_ws_connections_active` â€” Gauge: current connections
- `flow_ws_messages_sent_total` â€” Counter

### Grafana Dashboards

**Dashboard 1 â€” Market Data Health:**
- OI tick rate per symbol (should be constant 2 ticks/min per symbol during market hours)
- Tick processing latency (should be < 10ms P99)
- Provider connection status (green/red)

**Dashboard 2 â€” API Performance:**
- Request rate per endpoint
- Response time distribution
- Error rate (alert if > 1%)

**Dashboard 3 â€” AI Operations:**
- Brief generation times per type
- Token usage over time (cost monitor)
- Hallucination rejection rate (alert if > 5%)

**Dashboard 4 â€” User Activity:**
- Active WebSocket connections over time
- Alert fires per hour
- Page load distribution

---

## 15.8 Alerting (PagerDuty)

| Alert | Condition | Severity | On-call Response |
|-------|-----------|---------|-----------------|
| API error rate | > 1% for 2 min | Critical | Immediate response |
| WS disconnection rate | > 10% in 1 min | Critical | Immediate |
| Data provider offline | > 30s gap in ticks | Critical | Immediate |
| Redis memory | > 80% | Warning | Response within 15 min |
| AI brief failures | > 20% for 5 min | Warning | Response within 30 min |
| API P99 | > 3s | Warning | Response within 30 min |

**Runbooks linked from each PagerDuty alert** â†’ `docs/options-intelligence/runbooks/`

---

## 15.9 Disaster Recovery

| Failure | Detection | Recovery | Max Downtime Target |
|---------|-----------|----------|-------------------|
| API server crash | ECS health check fails | Auto-restart (ECS restart policy) | < 30s |
| WebSocket server crash | Connection drop + health check | Auto-restart. Client auto-reconnects | < 10s client, < 30s server |
| Data provider outage | Tick gap > 30s | Switch to backup provider | < 60s |
| Redis failure | Connection error | Failover to replica (ElastiCache) | < 5s |
| LLM provider outage | API error rate | Serve cached brief with age indicator | < 0s (cached) |
| PostgreSQL failure | Connection error | RDS Multi-AZ automatic failover | < 30s |
| Full region outage | All health checks fail | Manual failover to ap-southeast-1 (DR region) â€” this is a DR event, not automated | < 4 hours |

---

# 16. QA Blueprint

## 16.1 Test Strategy Overview

**Testing philosophy:** Every PRD acceptance criterion maps to at least one automated test. Human QA tests what automation cannot â€” user experience, visual quality, and AI response quality.

**Test execution:**
- Unit tests: Run on every commit (< 2 minutes)
- Integration tests: Run on every PR (< 5 minutes)
- Performance tests: Run on staging before every production deploy
- Stress tests: Run weekly on staging, and before every major feature launch
- Trader acceptance tests: Run before every V-phase release

---

## 16.2 Functional QA Matrix

### Core Feature Tests (F-001 to F-010)

| Test ID | Feature | Test Scenario | Input | Expected Result | Priority |
|---------|---------|--------------|-------|----------------|---------|
| QA-F-001-a | Index Selector | Switch from NIFTY to BANKNIFTY | Click BANKNIFTY tab | All panels refresh with BANKNIFTY data within 200ms | P1 |
| QA-F-001-b | Index Selector | Symbol persistence | Select FINNIFTY â†’ refresh browser | FINNIFTY remains selected | P1 |
| QA-F-002-a | PCR Card | PCR crosses above 1.2 threshold | OI data produces PCR = 1.21 | Card background turns green | P1 |
| QA-F-002-b | PCR Card | Both PCR values display | Normal market data | OI-PCR and Volume-PCR shown separately | P1 |
| QA-F-003-a | Max Pain | Correct calculation | Known OI dataset | Max pain = verified expected value | P1 (accuracy) |
| QA-F-003-b | Max Pain | Proximity indicator | Market 200pts above max pain | Indicator shows "200pts above max pain" in amber | P1 |
| QA-F-004-a | AI Morning Brief | Brief available after 8:30 AM | Open Flow Intelligence at 9:00 AM | Brief displays with headline, 3 observations, action | P1 |
| QA-F-004-b | AI Morning Brief | LLM unavailable fallback | Simulate API outage | Fallback message with cached brief or raw data | P1 |
| QA-F-005-a | OI Heatmap | Render time | Load Flow Intelligence | Heatmap renders in < 300ms | P1 (performance) |
| QA-F-005-b | OI Heatmap | Hover tooltip | Hover over a cell | Tooltip shows: Strike, OI, OI Change, AI note | P1 |
| QA-F-005-c | OI Heatmap | ATM centering | Open page | ATM strike is always centered/visible without scrolling | P1 |
| QA-F-005-d | OI Heatmap | Position marker | User has open NIFTY 23000 CE | Position marker badge appears on that cell | P2 |
| QA-F-006-a | OI Change Table | Sort by intraday change | Click "OI Change" column header | Table reorders by absolute OI change (descending) | P1 |
| QA-F-006-b | OI Change Table | Color coding | Positive OI change row | Row background/text in emerald (#10B981) | P1 |
| QA-F-007-a | AI Brief | Expand | Click "Expand" on brief | Full analysis drawer opens with institutional detail | P1 |
| QA-F-007-b | AI Brief | "Why?" audit trail | Click "Why?" on observation | Data points used to generate observation displayed | P1 |
| QA-F-007-c | AI Brief | Personal overlay | User has open OPTIONS trades | Personal position context appended to brief | P1 |
| QA-F-008-a | Option Chain | Initial render | Open option chain | Renders in < 300ms, ATM centered, < 800ms total page | P1 |
| QA-F-008-b | Option Chain | Sort by OI | Click OI column header | Chain reorders correctly | P1 |
| QA-F-008-c | Option Chain | Max pain indicator | Max pain at 22800 | 22800 strike has gold "MAX PAIN" badge | P1 |
| QA-F-009-a | VIX Card | Threshold coloring | VIX = 26 | Card shown in red, status "EXTREME" | P1 |
| QA-F-010-a | Smart Alerts | Alert creation | Create OI threshold alert | Alert saved, appears in alerts list | P1 |
| QA-F-010-b | Smart Alerts | Alert delivery timing | Threshold breached | Alert delivered via WebSocket within 15 seconds | P1 (critical) |
| QA-F-010-c | Smart Alerts | Alert cooldown | Alert fires | Same alert does not re-fire for 300 seconds | P1 |
| QA-F-010-d | Smart Alerts | Max alerts | Create 51st alert | System rejects with "Maximum 50 alerts" message | P1 |

---

## 16.3 AI Quality QA

AI QA is a separate discipline from functional QA. AI output cannot be deterministically tested â€” it requires a qualitative review framework.

### AI Accuracy Tests

| Test ID | Test Case | Method | Target |
|---------|-----------|--------|--------|
| QA-AI-001 | All numbers in AI output match source data | HallucinationChecker + manual cross-check | 100% match |
| QA-AI-002 | AI output in correct JSON schema | Zod parse after generation | 0% parse failures |
| QA-AI-003 | Confidence score correlates with data quality | Compare confidence vs known market states | Correlation > 0.7 |
| QA-AI-004 | "Why?" audit trail links to correct data | Click "Why?" â†’ verify linked data point | 100% match |
| QA-AI-005 | Personal overlay references user's actual positions | Compare overlay vs actual open trades | 100% accuracy |
| QA-AI-006 | AI output does not use "Buy" or "Sell" command language | Text analysis for forbidden phrases | 0 occurrences |
| QA-AI-007 | AI output does not reference unavailable data | Cross-reference prompt context vs output | 0 occurrences |

### AI Quality Assessment (Human Review â€” Pre-Launch)

**Methodology:** 5 experienced options traders review 20 AI briefs generated on different days. Rate each on:
- Accuracy (1â€“5): Are the data claims correct?
- Usefulness (1â€“5): Does this help me trade?
- Clarity (1â€“5): Is it easy to understand immediately?
- Relevance (1â€“5): Is it relevant to today's market, not generic?

**Target:** Average score â‰¥ 4.0 across all dimensions.

---

## 16.4 Performance QA

| Test ID | Scenario | Tool | Target | Failure Condition |
|---------|---------|------|--------|------------------|
| QA-P-001 | Cold page load | Lighthouse CI | TTI < 1,500ms | > 2,000ms |
| QA-P-002 | OI chain initial load | Custom performance mark | < 500ms | > 800ms |
| QA-P-003 | OI heatmap render | Chrome Performance API | < 300ms | > 500ms |
| QA-P-004 | 1,000 concurrent WebSocket | k6 | All connected, no errors | > 1% connection failures |
| QA-P-005 | 5,000 concurrent (expiry day stress) | k6 | Response < 3s, < 1% errors | > 2% errors |
| QA-P-006 | Greeks calculation | Server-side timer | < 5ms per strike | > 20ms |
| QA-P-007 | Alert delivery latency | End-to-end timestamp | < 15,000ms | > 30,000ms |
| QA-P-008 | AI brief generation | Server-side timer | < 3,000ms | > 8,000ms |
| QA-P-009 | Bundle size delta | Vite bundle analyzer | < +20KB per PR | > +50KB |

### k6 Load Test Configuration (QA-P-004)

```
Load pattern:
  Ramp-up: 0 â†’ 1,000 connections over 2 minutes
  Steady state: 1,000 connections for 10 minutes
  Each virtual user:
    1. Authenticate (POST /login)
    2. Open WebSocket (/ws/flow?token=...)
    3. Subscribe to NIFTY alerts
    4. Hold connection for duration
    5. Simulate 1 alert trigger per minute

Acceptance criteria:
  ws_connecting_duration p(95) < 1,000ms
  ws_messages_received rate > 0 (at least 1 alert received)
  error_rate < 1%
  server CPU < 70% during steady state
```

---

## 16.5 Accuracy QA

**Critical requirement:** Zero tolerance for incorrect OI, PCR, or Max Pain values.

| Test ID | Item | Method | Target |
|---------|------|--------|--------|
| QA-A-001 | OI values | Cross-validate with NSE official option chain (delayed 3 min) at 5 random times per day | 100% match |
| QA-A-002 | PCR (OI-based) | Manual calculation from same OI dataset | 100% match |
| QA-A-003 | Max Pain | Reference implementation in separate language (Python) vs Node.js | 100% match |
| QA-A-004 | Delta | Black-Scholes reference (Python QuantLib) vs calculated | < 0.1% variance |
| QA-A-005 | Implied Volatility | Market-implied vs displayed | < 0.5% variance |
| QA-A-006 | PCR (Volume-based) | Manual calculation | 100% match |
| QA-A-007 | IV Percentile | Manual calculation from 252-day dataset | < 1% variance |

**Automated accuracy monitor:** A nightly job runs against the previous day's data, comparing stored values against official NSE EOD reports. Discrepancies > 0.1% generate a Slack alert to the engineering team.

---

## 16.6 Stress Testing

| Test ID | Scenario | Duration | Acceptance Criteria | Recovery Test |
|---------|---------|---------|--------------------|----|
| QA-S-001 | Expiry day peak load (2Ã— normal) | 1 hour | No crashes, P99 < 3s, < 1% errors | Reduce load â†’ verify recovery < 5 min |
| QA-S-002 | Primary data provider outage | 2 min of no ticks | Backup provider activates < 60s, user sees staleness indicator | Provider restored â†’ verify seamless transition |
| QA-S-003 | Circuit breaker event (market halt) | Simulate halt | UI shows "Market Halted" state, no stale data displayed | Market resumes â†’ verify data resumes |
| QA-S-004 | Redis failure | Kill Redis | Fallback to PostgreSQL, P99 < 1s increase | Redis restored â†’ verify cache repopulation |
| QA-S-005 | LLM provider outage | Kill LLM API | Cached brief served, age indicator shows | LLM restored â†’ verify new brief generated at next interval |
| QA-S-006 | WebSocket server crash | Kill WS process | Clients reconnect < 10s, alerts resume | N/A (auto-restart) |
| QA-S-007 | 100 alerts firing simultaneously | Trigger 100 alerts for 1 user at once | Only 1 alert fires per cooldown period (50 unique alerts max) | N/A |

---

## 16.7 Usability QA

Tests conducted with real traders (10 participants â€” mix of 2 per persona type from PRD Â§5).

| Test ID | Persona | Task | Success Metric | Expected Completion |
|---------|---------|------|----------------|-------------------|
| QA-U-001 | Arjun (Buyer) | Find today's key resistance level | Completed in â‰¤ 2 clicks, â‰¤ 10 seconds | 90%+ pass rate |
| QA-U-002 | Priya (Seller) | Determine if IV is favorable for selling | Completed in â‰¤ 3 clicks, â‰¤ 15 seconds | 90%+ pass rate |
| QA-U-003 | Neha (Beginner) | Understand what PCR means | Find explanation in â‰¤ 5 seconds | 80%+ pass rate |
| QA-U-004 | Riya (Analyst) | Get full daily market brief | Full brief reviewed in â‰¤ 2 minutes | 90%+ pass rate |
| QA-U-005 | All | Create an OI change alert | Complete in â‰¤ 3 steps | 95%+ pass rate |
| QA-U-006 | All | Identify which strikes have highest put OI | Find answer in â‰¤ 10 seconds | 85%+ pass rate |
| QA-U-007 | Vikram (Swing) | Compare OI structure across two expiries | Complete task in â‰¤ 30 seconds | 80%+ pass rate |

**Protocol:** Think-aloud session with screen recording. Usability researcher takes notes on confusion points. Results feed into UX iteration before launch.

---

## 16.8 Accessibility QA

| Test ID | Test | Tool | Target |
|---------|------|------|--------|
| QA-ACC-001 | WCAG 2.1 AA compliance scan | axe-core (automated) | 0 critical violations |
| QA-ACC-002 | Color contrast all text | Chrome DevTools / Figma | Minimum 4.5:1 body, 3:1 large |
| QA-ACC-003 | Screen reader navigation | NVDA + Chrome | All data accessible |
| QA-ACC-004 | Keyboard-only navigation | Manual | All interactive elements reachable |
| QA-ACC-005 | Reduced motion mode | Chrome DevTools | All animations disabled in reduced motion |
| QA-ACC-006 | Color-blind mode | Sim Daltonism | No information lost without color |

---

## 16.9 Cognitive Load Testing (PRD Â§17.1)

**Methodology:** Eye-tracking session with 10 traders. 5-second exposure to the screen before asking:
1. Is the market bullish or bearish right now?
2. What is the key level to watch?
3. Is there anything unusual?

**Target:** 80%+ of participants answer all 3 correctly after 5-second exposure to default layout.

**SUS Score target:** â‰¥ 80 (PRD Â§17.1).

---

## 16.10 Cross-Browser QA

| Browser | Version | Priority | Test Scope |
|---------|---------|---------|------------|
| Chrome | Latest | P1 | Full test suite |
| Safari | Latest | P1 | Full test suite (WebKit differences: SSE reconnection, Canvas rendering) |
| Firefox | Latest | P1 | Full test suite |
| Edge | Latest | P2 | Smoke tests |
| Chrome Mobile | Latest | P1 | Mobile layout tests |
| Safari iOS | Latest | P1 | Mobile layout tests |

**Known cross-browser considerations:**
- EventSource (SSE): All modern browsers support it natively. Verify reconnection behavior in Safari.
- WebSocket: Universal support. No polyfill needed.
- Canvas 2D API: Universal support. Test heatmap rendering across browsers.
- CSS `@container` queries: Verify fallback in Firefox < 110.

---

# 17. Production Roadmap

## 17.1 Phase Gate Principle

> **No phase begins until the previous phase passes its verification criteria.**

Each phase has a "Go/No-Go" checkpoint reviewed by Engineering Lead + Product Lead. If verification fails, the phase is extended â€” not skipped.

---

## 17.2 Phase 0: Foundation Setup (Week 1â€“2)

**Objective:** Set up infrastructure, development environment, and data pipeline before writing any feature code.

**Deliverables:**
- [ ] Redis instance running (local Docker + staging ElastiCache)
- [ ] TimescaleDB extension enabled (or fallback PostgreSQL tables created)
- [ ] Database migrations for `option_alerts`, `alert_history`, `flow_ai_briefs`, `oi_history`, `iv_history`, `pcr_history` deployed to staging
- [ ] MockProvider delivering realistic option chain ticks in local environment
- [ ] TrueData API credentials obtained and tested
- [ ] `MarketDataProvider` interface defined and code-reviewed
- [ ] `GreeksEngine` implemented and unit tests passing (100% formula accuracy)
- [ ] LLM provider factory implemented (OpenAI + Anthropic adapters)
- [ ] Flow route stub at `/app/flow` (shows placeholder)
- [ ] SSE endpoint stub at `/sse/flow` (sends heartbeat only)
- [ ] WebSocket server stub at `/ws/flow` (accepts connections only)
- [ ] CI/CD pipeline extended with flow-intelligence steps
- [ ] GitHub Actions Lighthouse CI baseline established

**Engineering tasks:**
- Backend: Provider interface + Mock provider + TrueData adapter
- Backend: GreeksEngine (Black-Scholes implementation + tests)
- Backend: Database migrations
- Backend: Redis client singleton + connection test
- Frontend: Route stub + flowStore skeleton
- DevOps: docker-compose additions + CI/CD pipeline

**Acceptance criteria:**
- MockProvider ticks flow through: Provider â†’ Redis â†’ SSE endpoint (verified in browser)
- All database migrations run cleanly in staging
- Greeks calculation for 5 test cases matches Python QuantLib reference within 0.1%
- LLM providers both respond to a test prompt without error

**Rollback:** No production impact (staging only in this phase).

---

## 17.3 V0.5: Data Foundation (Week 3â€“6)

**Objective:** Live market data flowing, all analytics computed, basic UI displaying real data.

**Feature deliverables:**
- [ ] TrueData provider live (NIFTY, BANKNIFTY, FINNIFTY, MidCap Select + India VIX)
- [ ] Full option chain stored in Redis on each tick
- [ ] PCR calculated and served via REST
- [ ] Max Pain calculated every 5 minutes
- [ ] IV percentile engine (with 30-day lookback initially â€” 252-day after backfill)
- [ ] OI heatmap displayed with live data
- [ ] Option chain table with basic Greeks
- [ ] PCR card, Max Pain card, IV card, VIX card â€” all live
- [ ] Mobile-responsive layout
- [ ] OI threshold alert creation and delivery (WebSocket)
- [ ] Session indicator (market session badge)

**Backend tasks:**
- MarketDataWorker live (TrueData connection)
- PCRService, MaxPainService, IVService complete
- OIService complete (chain + heatmap + change)
- Alert Engine basic (OI_CHANGE alert type)
- SSE Bridge live (fan-out from Redis Pub/Sub)
- `flow.routes.ts` with `/overview`, `/oi-chain` endpoints

**Frontend tasks:**
- FlowCommandBar (all 4 index tabs, live price, session badge)
- OverviewPanel (PCR, MaxPain, IV, VIX cards â€” all live)
- OIPanel (heatmap + change table â€” live data)
- OptionChainPanel (basic, non-virtualized initially)
- AlertsPanel (alert creation + alert toast)
- flowStore (OI updates, PCR updates, VIX updates)
- useFlowSSE hook (SSE subscription + reconnection)
- useFlowAlerts hook (WebSocket for alerts)

**QA tasks:**
- QA-A-001, QA-A-002, QA-A-003 (accuracy verification against NSE)
- QA-F-001 through QA-F-010 (functional tests â€” all P1 tests)
- QA-P-001, QA-P-002, QA-P-003 (performance tests on staging)
- QA-S-002 (data provider outage test)

**Verification criteria:**
- All P1 functional tests passing
- All accuracy tests passing (100% OI match with NSE)
- Page load TTI < 1,500ms in staging
- Alert delivery < 15s in staging

**Rollback plan:** Feature flag `FLOW_ENABLED=false` hides the `/app/flow` route. Market data worker stops processing. No data loss.

**Risk:** TrueData API quota or rate limiting. Mitigation: KiteConnect as fallback provider, already implemented.

---

## 17.4 V1.0: Launch (Week 7â€“12)

**Objective:** Full AI integration, personalized experience, production-ready.

**Feature deliverables:**
- [ ] AI Morning Brief (GPT-4o/Claude powered, 8:30 AM generation)
- [ ] Personal Position Overlay (AI analysis of user's open positions)
- [ ] Personalized AI alerts (alert explanation with market context)
- [ ] Notable Flow Feed (institutional flow event detection)
- [ ] My Positions panel (position overlay on heatmap + P&L)
- [ ] Smart alert system (all 5 alert types)
- [ ] Post-Market Review mode (EOD brief + next-day preparation)
- [ ] Option chain: Full virtualization (TanStack Virtual)
- [ ] OI history chart (intraday OI evolution â€” Recharts)
- [ ] Session-adaptive UI (layout and palette shifts by market session)
- [ ] IV Dashboard (percentile + trend + status label)
- [ ] Keyboard navigation (Tab, Arrow, Escape shortcuts)
- [ ] IV backfill: 252 days of historical IV data imported

**Backend tasks:**
- FlowAIOrchestrator complete
- ContextAssembler (market + personal context)
- PromptTemplates (MORNING_BRIEF, POSITION_OVERLAY, ALERT_EXPLANATION)
- HallucinationChecker
- ConfidenceScorer
- BriefScheduler (cron jobs)
- InstitutionalFlowService (flow event detection)
- PositionContextService (reads user's open trades)
- Alert Engine: All 5 alert types
- EODSnapshotWorker
- MarketHoursScheduler
- Alert delivery via WebSocket (all types)
- DataBackfillWorker (IV 252-day backfill)
- All production environment variables configured

**Frontend tasks:**
- MorningBrief (full AI brief panel + PersonalOverlay)
- FlowEventsPanel (notable flow feed)
- MyPositionsPanel (position cards + heatmap markers)
- OptionChainTable (TanStack Virtual)
- OIHistoryChart (Recharts line chart)
- Session-adaptive styling (CSS custom properties per session)
- AlertToast (all severity levels)
- AlertHistory drawer
- FlowSkeleton (all panels)
- FlowErrorState / FlowEmptyState
- Performance audit (bundle size within budget)
- Accessibility audit (QA-ACC-001 to QA-ACC-006)

**QA tasks:**
- AI quality review (20 briefs, 5 trader reviewers, target â‰¥ 4.0/5.0)
- Usability testing (QA-U-001 through QA-U-007) with 10 real traders
- Cognitive load test (5-second rule, 10 participants)
- Full stress test battery (QA-S-001 through QA-S-007)
- WCAG 2.1 AA compliance scan (axe-core)
- Cross-browser test (Chrome, Safari, Firefox, Mobile)

**Verification criteria:**
- All P1 + P2 functional tests passing
- AI quality score â‰¥ 4.0/5.0 from trader review panel
- SUS score â‰¥ 80 from usability test
- P99 API response < 500ms in production
- 0 WCAG 2.1 AA critical violations
- Hallucination rate: 0% (all facts verified)
- Alert delivery: < 15s in production under load

**Rollback plan:** Feature flag per-user â†’ roll back to subset of users if issues detected. AI brief can be disabled independently while other features remain live.

**Risk:** LLM hallucination in production. Mitigation: HallucinationChecker + extensive pre-launch prompt testing + human review of first 100 briefs.

---

## 17.5 V1.1: Enhancement (Week 13â€“20)

**Objective:** Advanced analytics and power user features.

**Feature deliverables:**
- [ ] IV Surface Chart (D3 3D visualization)
- [ ] IV Skew Chart (smile/smirk visualization)
- [ ] IV Term Structure (short vs long-dated IV)
- [ ] Intraday OI Replay (animated replay of OI throughout the day)
- [ ] Greeks Dashboard (market delta + gamma wall + vega risk)
- [ ] Multi-expiry PCR breakdown (weekly vs monthly)
- [ ] Historical OI comparison (current vs previous expiry)
- [ ] TimescaleDB extension enabled and hypertables converted

**QA additions:**
- F-013 through F-018 functional tests
- Performance tests for D3 rendering (< 500ms)

**Verification criteria:**
- IV Surface renders in < 500ms for 5 expiries Ã— 100 strikes
- Intraday replay playback smooth at 60fps for all speed settings
- TimescaleDB conversion with zero data loss

---

## 17.6 V2.0: Professional (Week 21â€“36)

**Feature deliverables:**
- [ ] Multi-Symbol Grid (2Ã—2 index view)
- [ ] Position AI Coach (personalized risk assessment with full history)
- [ ] Scenario Modeler (interactive payoff simulation)
- [ ] Historical Backtesting (OI pattern replay)
- [ ] Export & Reports (PDF/CSV)
- [ ] API Access (programmatic access with API keys)
- [ ] Keyboard shortcuts (command palette)

**Architecture evolution:**
- Market Data Worker extracted to separate process (no longer in-process)
- Redis Sentinel upgraded to Redis Cluster mode
- AI Service extracted to separate process with queue-based processing

---

## 17.7 V3.0: Platform (Month 10â€“12)

**Feature deliverables:**
- [ ] Stock options support (top 50 optionable stocks)
- [ ] BankNifty weekly + monthly context separation
- [ ] Advanced gamma exposure dashboard
- [ ] Community signals (curated flow commentary)
- [ ] Mobile native push alerts (FCM integration)
- [ ] AI model fine-tuning on Indian market data

---

# 18. Production Launch Checklist

## 18.1 Infrastructure Checklist

- [ ] AWS ap-south-1 region confirmed for all services
- [ ] RDS PostgreSQL Multi-AZ enabled
- [ ] ElastiCache Redis cluster mode enabled (or single node with sentinel for V1.0)
- [ ] ECS minimum replica counts set per service
- [ ] Auto-scaling rules configured (market-hours schedule + CPU-based)
- [ ] NGINX configured with SSE long-timeout + WebSocket upgrade + rate limiting
- [ ] Cloudflare DDoS protection enabled
- [ ] Cloudflare edge cache rules configured per endpoint
- [ ] Docker images in ECR for all services
- [ ] Terraform state stored in S3 with locking via DynamoDB
- [ ] Backup provider (KiteConnect) credentials configured and tested
- [ ] AWS Secrets Manager storing all API keys (TrueData, OpenAI/Anthropic, PagerDuty)
- [ ] PagerDuty on-call schedule configured for market hours (9:00â€“3:30 PM IST)
- [ ] Grafana dashboards deployed and connected to Prometheus
- [ ] All Grafana alert rules configured with PagerDuty integration

## 18.2 Security Checklist

- [ ] HTTPS enforced on all endpoints (HSTS enabled)
- [ ] All security headers configured (CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy)
- [ ] CORS restricted to riskrule.in and app.riskrule.in
- [ ] JWT RS256 keys rotated from any test keys used in development
- [ ] JWT refresh token rotation implemented
- [ ] API keys in environment variables only â€” no keys in codebase or database
- [ ] TrueData API key not in any log files (log sanitization implemented)
- [ ] Rate limiting operational at both NGINX and Express levels
- [ ] SQL injection prevention verified (all queries use Prisma parameterized or typed raw queries)
- [ ] Input validation (Zod) on all API endpoints
- [ ] WebSocket single-use token mechanism tested
- [ ] SSE token not appearing in server logs (log sanitization)
- [ ] User data encrypted at rest (RDS encryption + ElastiCache encryption enabled)
- [ ] Prompt injection prevention implemented and tested
- [ ] Penetration test completed by external security firm
- [ ] DPDP Act consent flow implemented for AI analysis of personal data
- [ ] SEBI AI framing legal review completed (PRD Â§22.1 RG-005 â€” mandatory before launch)
- [ ] No "Buy" or "Sell" command language in any AI output (automated text scan)
- [ ] `npm audit` clean (no high/critical vulnerabilities)

## 18.3 Performance Checklist

- [ ] Lighthouse FCP < 800ms on production (measured from Mumbai CDN node)
- [ ] Lighthouse TTI < 1,500ms on production
- [ ] CLS < 0.05 (no layout shift)
- [ ] Flow Intelligence JS chunk < 120KB gzip
- [ ] Total bundle size < 400KB gzip
- [ ] OI chain loads in < 500ms (measured in production with real TrueData)
- [ ] OI heatmap renders in < 300ms (measured with Chrome Performance API)
- [ ] Greeks calculation P99 < 5ms (measured in production)
- [ ] Max Pain calculation < 100ms (measured in production)
- [ ] AI brief generation < 3,000ms (measured in staging with full context)
- [ ] Alert delivery < 15s end-to-end (measured in staging with 100 concurrent users)
- [ ] Redis cache hit rate > 95% measured over 1-hour market session test
- [ ] k6 load test: 1,000 concurrent connections with < 1% error rate

## 18.4 Accuracy Checklist

- [ ] OI values match NSE official data (QA-A-001) â€” manual verification on 3 live trading days
- [ ] PCR calculation verified against manual calculation (QA-A-002)
- [ ] Max Pain calculation verified against reference implementation (QA-A-003)
- [ ] Delta variance < 0.1% vs QuantLib reference (QA-A-004)
- [ ] IV variance < 0.5% vs market-implied (QA-A-005)
- [ ] IV percentile verified against manual 252-day dataset calculation (QA-A-007)
- [ ] IV backfill data: 252 trading days loaded for all 4 symbols
- [ ] Session baseline snapshot mechanism verified at market open
- [ ] Previous day OI baseline verified (EODSnapshotWorker tested live)

## 18.5 AI Checklist

- [ ] Hallucination checker tested with adversarial prompts
- [ ] All 6 prompt templates reviewed by financial domain expert
- [ ] SEBI legal review of AI output framing completed
- [ ] AI brief quality review: 20 briefs rated â‰¥ 4.0/5.0 by 5 trader reviewers
- [ ] "Why?" audit trail tested for all AI insight types
- [ ] Personal overlay tested with test user with open positions
- [ ] AI staleness indicator shown when brief > 30 min old
- [ ] AI fallback (cached brief) tested with LLM outage simulation
- [ ] LLM provider switching tested (PRIMARY â†’ FALLBACK)
- [ ] Token usage tracking verified in `flow_ai_briefs` table
- [ ] AI brief generation cost estimate calculated and within budget

## 18.6 Monitoring Checklist

- [ ] All Prometheus metrics reporting correctly
- [ ] Grafana dashboards rendering real data (not test data)
- [ ] All PagerDuty alert rules tested with synthetic failures
- [ ] On-call engineers have Grafana and PagerDuty access
- [ ] Runbooks written for all 6 common failure scenarios
- [ ] Data provider failover runbook tested in staging
- [ ] Log aggregation working (Loki or CloudWatch receiving structured JSON logs)
- [ ] `requestId` present in all logs and API responses (traceability)
- [ ] Error rate alert: tested and triggers PagerDuty correctly
- [ ] Data staleness alert: triggers when provider offline > 30s

## 18.7 Data & Database Checklist

- [ ] All database migrations applied to production PostgreSQL
- [ ] `flow_preferences` column added to users table
- [ ] `option_alerts`, `alert_history`, `flow_ai_briefs` tables created
- [ ] `oi_history`, `iv_history`, `pcr_history` tables created with correct indexes
- [ ] TimescaleDB extension operational (V1.0 or fallback PostgreSQL confirmed)
- [ ] Compression policy applied to oi_history (chunks > 7 days compressed)
- [ ] Retention policy configured (1-year hot data, S3 archive after)
- [ ] Database connection pool size configured correctly for production
- [ ] No N+1 query patterns in production routes (verified via query logging)
- [ ] Alert history index verified (user_id, triggered_at DESC)

## 18.8 Accessibility Checklist

- [ ] axe-core scan: 0 critical WCAG 2.1 AA violations
- [ ] Keyboard navigation: All interactive elements reachable
- [ ] Screen reader tested with NVDA + Chrome for all data panels
- [ ] Color-blind mode tested (no information lost without color)
- [ ] Reduced motion mode tested (all animations disabled)
- [ ] All interactive elements have unique IDs and ARIA labels
- [ ] `aria-live="polite"` on PCR and VIX cards
- [ ] `aria-live="assertive"` on alert toasts
- [ ] Focus trap correct on all drawers and modals
- [ ] Skip to main content link present

## 18.9 UX Checklist

- [ ] SUS score â‰¥ 80 (10-participant usability test)
- [ ] 5-second rule test: 80%+ identify market state, key level, and unusual activity
- [ ] Morning brief available by 8:30 AM IST (tested on actual market day)
- [ ] Session transitions working correctly (session badge + UI shift)
- [ ] Empty states present and informative for all panels
- [ ] Error states present with retry buttons for all panels
- [ ] DataStalenessIndicator shown correctly when data is delayed
- [ ] All metric tooltips (plain-English explanations) present for every metric

## 18.10 Documentation Checklist

- [ ] `01_Product_Requirement_Document.md` finalized and version-tagged
- [ ] `02_Engineering_Master_Blueprint.md` finalized and version-tagged
- [ ] `REST_API_Reference.md` generated from OpenAPI spec
- [ ] `WebSocket_Protocol.md` written
- [ ] All 3 runbooks written and reviewed: Provider Failover, Alert Engine Ops, AI Quality Monitoring
- [ ] Local dev setup documented (README updated)
- [ ] Environment variables documented (.env.example updated)
- [ ] Database migration rollback procedures documented
- [ ] On-call guide written for market-hours incident response

## 18.11 Compliance Checklist

- [ ] SEBI legal review of AI framing completed and documented
- [ ] DPDP Act compliance: User consent flow for AI analysis of personal data
- [ ] TrueData data licensing confirmed (exchange-licensed real-time data)
- [ ] Terms of Service updated to mention Flow Intelligence AI analysis features
- [ ] Privacy Policy updated to mention market data processing and AI analysis
- [ ] Data retention policy documented and implemented in code

## 18.12 Launch Readiness Gate

**Final sign-off required from:**
- [ ] Engineering Lead
- [ ] Head of Product
- [ ] Legal Counsel (AI framing + SEBI compliance)
- [ ] QA Director
- [ ] SRE / DevOps Lead

**Launch decision:** Go / No-Go call at 7:00 AM IST on launch day. If any Critical item in this checklist is not checked, launch is postponed to next trading week.

---

*End of Engineering Master Blueprint v1.0*

*This document, combined with `01_Product_Requirement_Document.md`, forms the complete specification for building Flow Intelligence.*

*"The market. Decoded."*

