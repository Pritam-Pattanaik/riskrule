# Data Flow Investigation Report

## Tracing the Lifecycle of CRUDEOILM 17 AUG 7500 PE

### 1. Broker API
- **What enters:** User places an order for 6 lots of CRUDEOILM on Dhan.
- **What leaves:** Dhan executes the order and records the fill in their ledger.

### 2. Raw API Response
- **What enters:** HTTP GET to `https://api.dhan.co/v2/trades`.
- **What leaves:** JSON array of executions. 
  - `tradedQuantity: 6` (Lots, not units!)
  - `tradedPrice: 295.79`
  - `brokerageCharges: 0` (Settled end of day).

### 3. Broker Adapter (`dhan.ts`)
- **What enters:** Raw JSON executions.
- **What is modified:** ₹20 fallback brokerage is injected per execution.
- **What goes wrong:** If the 6 lots filled in 3 partial fills, ₹60 brokerage is assumed for Buy, and ₹60 for Sell. 

### 4. Normalization Layer
- **What enters:** Iteration over raw trades to build `openPositions`.
- **Could quantity become wrong:** YES. 6 lots is passed directly as `quantity: 6` without converting to units (`6 * 10 = 60 units`).

### 5. PnL Calculator (Inline in Adapter)
- **What is calculated:** `realizedPnl = (308.15 - 295.79) * 6 = 74.16`
- **Could precision be lost:** Yes, PnL is 10x smaller than reality because of the missing multiplier.
- **Net PnL calculation:** `Net PnL = 74.16 - (Charges) = 74.16 - ~220 = -145.84`.
- **Could sign inversion happen:** YES! High artificial charges subtracted from a shrunken profit causes a profitable trade to appear as a net loss.

### 6. Database (Prisma)
- **What enters:** `netPnl: -145.84`, `status: LOSS`.
- **What is saved:** Corrupted trade record.

### 7. Trade Sync Worker
- **Role:** Commits the batch of parsed trades. The corrupted data is now the Source of Truth.

### 8. Trade Model
- **Impact:** The Prisma model serves this row to all upstream services exactly as-is.

### 9. Journal Service
- **Impact:** Associates the loss with the user's daily journal entry. Marks the day as "Red" (Loss day).

### 10. Analytics Engine
- **Impact:** Calculates Win Rate (drops), Average RR (drops), Expectancy (drops).

### 11. AI Context Builder
- **Impact:** Feeds prompt to LLM: "The user lost ₹145.85 on CRUDEOILM."

### 12. Frontend API
- **Impact:** Serializes the corrupted JSON to the client.

### 13. React Store
- **Impact:** Caches the bad data in the UI state.

### 14. UI
- **What is shown:** User sees -₹145.85. User loses trust in the platform.
