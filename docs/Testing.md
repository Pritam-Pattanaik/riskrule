# Testing

**RiskRule Platform — Quality Assurance Strategy & Test Verification Guide**
**Document ID:** TEST-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Test Pyramid](#2-test-pyramid)
3. [Failure Mode Analysis (FMEA)](#3-failure-mode-analysis-fmea)
4. [E2E Test Cases](#4-e2e-test-cases)
5. [Unit & Integration Tests](#5-unit--integration-tests)
6. [Calculation Verification Tests](#6-calculation-verification-tests)
7. [Running Tests](#7-running-tests)

---

## 1. Testing Philosophy

RiskRule enforces a **zero-regression, evidence-based testing pipeline** across all real-time and AI workloads. Financial applications demand mathematical precision — a single incorrect PnL calculation damages user trust irreparably.

**Core Testing Principles:**
- Every critical calculation has a corresponding unit test.
- All real-time subsystems (SSE, AI streaming) have dedicated concurrency tests.
- Production deployments are gated by the full test suite passing.

---

## 2. Test Pyramid

```
                  ┌────────────────────────┐
                  │    Playwright E2E      │  (Critical User Flows)
                  │ - Market Live Stream   │
                  │ - AI Chat & Stop Gen   │
                  ├────────────────────────┤
                  │   Integration Tests    │  (Route & Redis Layer)
                  │ - MarketDataService    │
                  │ - Provider Waterfall   │
                  ├────────────────────────┤
                  │     Unit Test Suite    │  (Pure Functions)
                  │ - Deduplication Logic  │
                  │ - Prompt Builder       │
                  │ - PnL Calculations     │
                  └────────────────────────┘
```

---

## 3. Failure Mode Analysis (FMEA)

| Failure Mode | Severity | Probability | Root Cause | Test Vector | Verification Criterion |
|---|---|---|---|---|---|
| **Yahoo 429 Surge** | Critical | High | Multiple components opening separate HTTP requests | Mount 5 tabs concurrently | All tabs share 1 cached backend fetch |
| **Stream Corruption** | Critical | High | `AbortController` module-level scope | Click Regenerate at t=500ms | Only 1 clean assistant bubble rendered |
| **Silent Stale Summary** | High | Medium | No TTL indicator in MarketAI cache | Disconnect Yahoo API mock | Amber banner indicates data age |
| **Breaking News Skip** | High | High | `useEffect` fetch on component mount — skipped on revisit | Navigate Markets → Journal → Markets | Fresh feed on mount |
| **Dead Filter UI** | High | Certain | Filter handler unconnected to mapped news list | Click "RBI" pill | Only RBI-tagged articles visible |
| **Triple SSE per Tab** | High | Certain | 3 hooks each opening SSE independently | Mount Markets page | Exactly 1 SSE `/api/market/stream` |
| **Export Null** | Medium | High | Export action reads `messages[index]` without null check | Export session item #3 | Markdown file contains full transcript |

---

## 4. E2E Test Cases

### TC-AI-01: Rapid Stream Interruption & Regeneration

```typescript
test('should cleanly abort previous stream when regenerate is clicked', async ({ page }) => {
  await page.goto('/app/ai-coach');
  await page.fill('[data-testid="ai-chat-input"]', 'Analyze my recent Bank Nifty trades');
  await page.click('[data-testid="ai-send-button"]');

  // Wait for first token stream to initiate
  await page.waitForSelector('[data-testid="ai-streaming-indicator"]');
  
  // Interrupt immediately with regenerate
  await page.click('[data-testid="ai-regenerate-button"]');

  // Verify only one assistant message in DOM
  const assistantBubbles = await page.$$('[data-testid="ai-message-assistant"]');
  expect(assistantBubbles.length).toBe(1);

  // Verify no duplicate messages in DB
  const dbMessages = await fetchConversationMessages(convId);
  expect(dbMessages.filter(m => m.role === 'assistant').length).toBe(1);
});
```

### TC-MKT-01: Network Offline & Stale Fallback

```typescript
test('should render stale cache gracefully during network blackout', async ({ page, context }) => {
  await page.goto('/app/markets');
  await page.waitForSelector('[data-testid="market-hero-card"]');

  // Simulate network offline
  await context.setOffline(true);

  // Assert offline resilience
  await expect(page.locator('[data-testid="market-status-indicator"]'))
    .toContainText('Offline (Cached Data)');
  await expect(page.locator('[data-testid="market-hero-card"]')).toBeVisible();

  // Restore network
  await context.setOffline(false);
  await expect(page.locator('[data-testid="market-status-indicator"]'))
    .toContainText('Live');
});
```

---

## 5. Unit & Integration Tests

### Deduplication Logic
```typescript
test('should deduplicate concurrent identical requests', async () => {
  const service = new MarketDataService();
  
  // Fire 5 concurrent requests for the same symbol
  const results = await Promise.all(
    Array.from({ length: 5 }, () => service.getQuote('NIFTY'))
  );
  
  // Verify only 1 upstream request was made
  expect(mockYahooFetch).toHaveBeenCalledTimes(1);
  expect(results.every(r => r.price === results[0].price)).toBe(true);
});
```

---

## 6. Calculation Verification Tests

These scenarios verify the PnL calculation fixes in `dhan.ts`.

### Scenario 1: MCX Commodity (Contract Multiplier)

| Input | Expected Value |
|---|---|
| Symbol | `CRUDEOILM 17 AUG 7500 PE` |
| Quantity (lots) | 6 |
| Buy Price | ₹295.79 |
| Sell Price | ₹308.15 |
| **Quantity in DB** | **60 units** (6 lots × 10 multiplier) |
| **Gross PnL** | **₹741.60** (12.36 × 60) |
| **Charges** | ~₹40 (₹20 per order leg) |
| **Net PnL** | ~₹701.60 |

### Scenario 2: NSE F&O (No Multiplier)

| Input | Expected Value |
|---|---|
| Symbol | `NIFTY 11 AUG 24600 PUT` |
| Quantity (units) | 130 |
| Buy Price | ₹94.68 |
| Sell Price | ₹103.65 |
| **Quantity in DB** | **130** (no multiplier for NSE F&O) |
| **Gross PnL** | **₹1,166.10** (8.97 × 130) |

### Scenario 3: Partial Fills (Brokerage Leak Test)

| Input | Expected |
|---|---|
| Order | 1 Buy order of 100 units |
| Executions | 10 partial fills of 10 units each |
| **Old (Buggy) Behavior** | Brokerage = ₹200 (₹20 × 10 fills) |
| **Expected (Correct)** | Brokerage = ₹20 (1 orderId = 1 charge) |

### Scenario 4: Partial Exits (Scale Out)

| Action | Expected |
|---|---|
| Buy 100 units @ ₹100 | Entry |
| Sell 50 units @ ₹110 | Partial exit 1 |
| Sell 50 units @ ₹120 | Partial exit 2 |
| **Gross PnL** | ₹1,500 ((₹10 × 50) + (₹20 × 50)) |
| **Charges** | ₹60 (3 orders × ₹20) |

---

## 7. Running Tests

```bash
# Root-level E2E tests
npm run test:e2e

# Server-side diagnostic scripts (development only)
cd server

# Validate AI Coach production endpoints
npx tsx scripts/validateAICoachProduction.ts

# Audit real AI responses
npx tsx scripts/auditRealAIResponses.ts

# Check database state
npx tsx scripts/check_db.ts

# Check trade counts
npx tsx scripts/check_counts.ts

# Test market data endpoints
npx tsx scripts/check_markets.ts
```

---

*See [Architecture.md](./Architecture.md) for system design context. See [API.md](./API.md) for API endpoint reference.*
