# TradingEngine

**RiskRule Platform — Market Data Provider Architecture, Broker Integrations & Trading Engine**
**Document ID:** TE-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [Trading Engine Overview](#1-trading-engine-overview)
2. [Market Data Provider Waterfall](#2-market-data-provider-waterfall)
3. [Tracked Instruments & Symbols](#3-tracked-instruments--symbols)
4. [Caching Architecture](#4-caching-architecture)
5. [Rate Limiting & Circuit Breaker](#5-rate-limiting--circuit-breaker)
6. [Broker Integration — Dhan](#6-broker-integration--dhan)
7. [Broker Integration — AngelOne](#7-broker-integration--angelone)
8. [Position Aggregation Engine (FIFO)](#8-position-aggregation-engine-fifo)
9. [PnL Calculation Specification](#9-pnl-calculation-specification)
10. [Discipline Engine](#10-discipline-engine)

---

## 1. Trading Engine Overview

The Trading Engine encompasses three subsystems:

1. **Market Data Service** — Pulls live quotes, charts, sectors, and economic calendar data from multi-provider waterfall.
2. **Broker Sync Engine** — Connects to Dhan and AngelOne APIs, aggregates raw executions into FIFO positions, and stores them in PostgreSQL.
3. **Discipline Engine** — Evaluates each closed trade against the user's defined risk rules and computes a behavioral score.

---

## 2. Market Data Provider Waterfall

All data requests flow through the singleton `MarketDataService`. Frontend and routes never interact with raw providers directly.

```
                  ┌───────────────────────┐
                  │   Incoming Request    │
                  │ (getQuotes/getSectors)│
                  └───────────┬───────────┘
                              │
                    [Check Redis Cache]
                     ├── HIT  ──► Return Cached JSON
                     └── MISS ──► Proceed to Waterfall
                              │
                  ┌───────────▼───────────┐
                  │ 1. YahooFinanceProvider│  Primary (v8 Chart API)
                  └───────────┬───────────┘
                     ├── SUCCESS ──► Update Redis + Stale Cache ──► Return
                     └── FAILURE ──► Increment Fail Count (Backoff)
                              │
                  ┌───────────▼───────────┐
                  │ 2. MoneyControlProvider│  Secondary Fallback
                  └───────────┬───────────┘
                     ├── SUCCESS ──► Update Redis + Stale Cache ──► Return
                     └── FAILURE ──► Switch Active Provider
                              │
                  ┌───────────▼───────────┐
                  │ 3. InvestingComProvider│  Tertiary Fallback
                  └───────────┬───────────┘
                     ├── SUCCESS ──► Update Redis + Stale Cache ──► Return
                     └── FAILURE ──► Proceed to Fallback Layer
                              │
                  ┌───────────▼───────────┐
                  │ 4. Stale In-Memory    │  Resilience Layer
                  │    - Last-Known-Good  │
                  │    - Max Age: 5 Mins  │
                  └───────────────────────┘
```

### Architectural Invariant
> **This waterfall MUST never be dismantled or replaced.** It is the core reliability guarantee of the platform.

---

## 3. Tracked Instruments & Symbols

### Core Benchmark Indices

| Symbol ID | Display Name | Yahoo Ticker | Exchange | Market Hours |
|---|---|---|---|---|
| `nifty` | NIFTY 50 | `^NSEI` | NSE | 09:15–15:30 IST |
| `sensex` | SENSEX | `^BSESN` | BSE | 09:15–15:30 IST |
| `banknifty` | BANK NIFTY | `^NSEBANK` | NSE | 09:15–15:30 IST |
| `finnifty` | NIFTY FIN SERVICE | `NIFTY_FIN_SERVICE.NS` | NSE | 09:15–15:30 IST |
| `midcap` | NIFTY MIDCAP 100 | `NIFTY_MIDCAP_100.NS` | NSE | 09:15–15:30 IST |
| `vix` | INDIA VIX | `^INDIAVIX` | NSE | 09:15–15:30 IST |

### Global, Commodities & Currencies

| Symbol ID | Display Name | Yahoo Ticker | Asset Class |
|---|---|---|---|
| `gold` | Gold (MCX/Spot) | `GC=F` | Commodity |
| `silver` | Silver | `SI=F` | Commodity |
| `crude` | Crude Oil WTI | `CL=F` | Commodity |
| `usdinr` | USD/INR | `INR=X` | Forex |

### Sectoral Symbols

| Sector ID | Sector Name | Yahoo Ticker |
|---|---|---|
| `sector-it` | NIFTY IT | `^CNXIT` |
| `sector-auto` | NIFTY Auto | `^CNXAUTO` |
| `sector-pharma` | NIFTY Pharma | `^CNXPHARMA` |
| `sector-fmcg` | NIFTY FMCG | `^CNXFMCG` |
| `sector-metal` | NIFTY Metal | `^CNXMETAL` |
| `sector-realty` | NIFTY Realty | `^CNXREALTY` |
| `sector-energy` | NIFTY Energy | `^CNXENERGY` |
| `sector-infra` | NIFTY Infra | `^CNXINFRA` |

---

## 4. Caching Architecture

### Redis Cache Key Taxonomy

| Data | Redis Key | TTL | Notes |
|---|---|---|---|
| All Quotes | `market:all-quotes:v2` | 60s | Unified batch |
| Benchmark Quotes | `market:quotes:v2` | 60s | Synchronized |
| Sectors | `market:sectors:v2` | 60s | Synchronized |
| Intraday Chart (1D) | `market:chart:v2:{symbol}:5m:1d` | 300s | Auto-expire |
| Historical (1W/1M) | `market:chart:v2:{symbol}:1d:{range}` | 3600s | Daily expire |
| AI Summary | `market:ai-summary:v2` | 300s | Per session |

### In-Flight Request Deduplication

```typescript
const inFlight = new Map<string, Promise<any>>();

function dedup<T>(key: string, factory: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;

  const promise = factory().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}
```

This prevents concurrent component mounts from issuing multiple identical upstream requests.

---

## 5. Rate Limiting & Circuit Breaker

### Token Bucket (Yahoo Finance)
- **Capacity:** 10 tokens
- **Refill Rate:** 1 token / 2 seconds (max 30 requests/minute)
- **Burst:** Up to 10 simultaneous requests on cache miss

### Exponential Backoff Recovery
When a provider encounters ≥ 3 consecutive failures:

```
Failure 3 → 5 minute backoff
Failure 4 → 10 minute backoff
Failure 5 → 20 minute backoff
Failure 6+ → 60 minute maximum cap
Reset    → On first success, failure count resets to 0
```

Formula: `delay = min(300,000 × 2^(N-3), 3,600,000)` ms

---

## 6. Broker Integration — Dhan

### API Connection
- **Endpoint:** `https://api.dhan.co/v2/trades`
- **Auth:** API key per user, stored encrypted in `BrokerConnection` table
- **File:** `server/src/lib/brokers/dhan.ts`

### Key Implementation Notes

#### MCX Contract Multipliers
Dhan returns MCX commodity quantities in **lots**, not units:

```typescript
// server/src/lib/brokers/multipliers.ts
function getContractMultiplier(symbol: string, exchangeSegment: string): number {
  if (exchangeSegment === 'MCX_COMM') {
    if (symbol.startsWith('CRUDEOILM')) return 10;
    if (symbol.startsWith('CRUDEOIL'))  return 100;
    if (symbol.startsWith('GOLDM'))     return 10;
    if (symbol.startsWith('GOLD'))      return 100;
    if (symbol.startsWith('SILVERMIC')) return 1;
    if (symbol.startsWith('SILVER'))    return 30;
    return 10; // default MCX
  }
  return 1; // NSE F&O returns units directly
}
```

#### Per-Order Brokerage (Not Per-Execution)
```typescript
// Correct: track by orderId to prevent brokerage inflation
const billedOrders = new Set<string>();

if (parsedBrokerage === 0 && !billedOrders.has(rawTrade.orderId)) {
  parsedBrokerage = 20; // ₹20 per distinct order only
  billedOrders.add(rawTrade.orderId);
}
```

### PnL Calculation (Correct Formula)
```
Gross PnL = (ExitPrice - EntryPrice) × (Quantity × ContractMultiplier) × DirectionMultiplier
Net PnL   = Gross PnL - (Charges.brokerage + Charges.stt + Charges.sebi + ...)
```

---

## 7. Broker Integration — AngelOne

- **File:** `server/src/lib/brokers/angelone.ts`
- **Auth:** TOTP-based session tokens, refreshed periodically
- **Multipliers:** AngelOne returns NSE F&O in units (multiplier = 1 for most instruments)

---

## 8. Position Aggregation Engine (FIFO)

Raw broker executions (partial fills, multiple orders) are aggregated into consolidated positions before database insertion:

```
Algorithm:
1. Seed aggregator with existing OPEN positions from DB
2. Sort all raw executions chronologically by exchangeTime
3. For each raw execution:
   ├── If symbol is FLAT → Open new position (record entry price, qty, direction)
   ├── If same direction → Scale IN (VWAP average entry recalculated)
   ├── If opposite direction → Scale OUT (calculate realized PnL for closed portion)
   └── If quantity reaches 0 → Mark WIN / LOSS / BREAKEVEN
4. Output:
   ├── tradesToInsert → New positions not in DB
   └── tradesToUpdate → Existing OPEN positions with new exit/PnL
```

### Scale-In Average Price Formula
```
NewAveragePrice = (OldPrice × OldQty + NewPrice × NewQty) / (OldQty + NewQty)
```

---

## 9. PnL Calculation Specification

| Calculation | Formula | Status |
|---|---|---|
| Realized PnL (NSE) | `(Exit - Entry) × Units × Direction` | ✅ Correct |
| Realized PnL (MCX) | `(Exit - Entry) × (Lots × Multiplier) × Direction` | ✅ Fixed |
| Net PnL | `Gross PnL - Charges` | ✅ Fixed |
| Charges | `Sum(Sebi + STT + Brokerage + ServiceTax + ExchangeTx + StampDuty)` | ✅ Fixed |
| Brokerage Fallback | `₹20 per distinct orderId` | ✅ Fixed |
| Scale-in Average | `VWAP calculation` | ✅ Correct |

---

## 10. Discipline Engine

The Discipline Engine evaluates each closed trade against the user's defined `TradingRules`:

### Evaluated Rules
| Rule | Violation Example |
|---|---|
| Max daily loss | Net loss > ₹X in one day |
| Max trades per day | > N trades executed |
| No trading on red days | Opened trade after hitting daily loss |
| Stop-loss adherence | Held past defined stop-loss level |
| Max position size | Position size > X% of capital |
| No revenge trading | Trade opened within 5min of large loss |

### Discipline Score Calculation
```typescript
// server/src/lib/ai/disciplineScorer.ts
interface DisciplineScore {
  score: number;       // 0-100
  rulesFollowed: number;
  rulesViolated: RuleViolation[];
  tradeGrade: 'A' | 'B' | 'C' | 'D' | 'F';
}
```

Scores are saved to `CoachMemory` for persistent behavioral tracking across sessions.

---

*See [AI.md](./AI.md) for the AI analysis pipeline. See [Architecture.md](./Architecture.md) for the system topology.*
