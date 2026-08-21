# Implementation Plan

## Goal Description
Fix the critical PnL and charge calculation bugs in the Dhan broker adapter (`dhan.ts`) to ensure 100% accurate financial tracking matching the broker's ledger.

## Proposed Changes

### Component 1: Contract Multiplier Engine
#### [NEW] `server/src/lib/brokers/utils/multipliers.ts`
- Create a deterministic dictionary of Indian market contract multipliers (MCX & NSE).
- Expose a `getContractMultiplier(symbol, exchangeSegment)` function.
  - If `MCX_COMM`, match symbol prefixes (e.g., `CRUDEOILM` -> 10, `GOLDM` -> 10).
  - If `NSE_FNO` or `BSE_FNO`, return 1 (Dhan returns units for FNO).
  - Default to 1.

### Component 2: Dhan Adapter (`dhan.ts`)
#### [MODIFY] `server/src/lib/brokers/dhan.ts`
1. **Apply Contract Multiplier:**
   - Call `getContractMultiplier` on the raw trade.
   - During `openPositions` aggregation, multiply `tradeQty` by the multiplier, OR explicitly multiply `pnl` by the multiplier at realization.
   - Storing `quantity` as total units (lots * multiplier) is safer and normalizes data across all brokers. So `tradeQty = tradeQty * getContractMultiplier(...)`.
2. **Order-Based Charge Injection:**
   - Maintain a `Set<string> billedOrders` in the aggregator loop.
   - When injecting the ₹20 fallback brokerage, check `if (!billedOrders.has(rawTrade.orderId))`.
   - If missing, inject ₹20 and add `orderId` to the set. If present, inject ₹0. This prevents charging ₹20 for every partial fill execution.

## User Review Required
> [!IMPORTANT]
> The database historically stored MCX quantities in lots. By normalizing this to total units, past MCX trades will need a backfill recalculation, or they will remain corrupted. I will add a script to backfill/recalculate existing trades later.

## Verification Plan
### Automated Tests
- Build mock Dhan F&O trades (130 units NIFTY) and ensure PnL matches expectations.
- Build mock MCX trades (6 lots CRUDEOILM) and ensure PnL = (Exit - Entry) * 60.
- Build partial fill scenario (1 order, 6 executions) and verify brokerage = 20.
