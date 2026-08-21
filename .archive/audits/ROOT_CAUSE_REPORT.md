# Root Cause Report: Critical PnL Calculation Failure

## 1. Executive Summary
A critical P0 bug in the TradeVault calculation pipeline is causing profitable trades to be recorded as losses. The issue stems from two fundamental flaws in the `dhan.ts` broker adapter: missing contract multipliers for MCX instruments and incorrect per-execution (instead of per-order) charge assumptions.

## 2. The Exact Bug Location
- **File:** `server/src/lib/brokers/dhan.ts`
- **Function:** `syncDhanTrades` -> `openPositions` aggregation loop.
- **Lines (Approx 426-434):** 
  ```typescript
  // Realized P&L
  const pnlMultiplier = pos.direction === 'LONG' ? 1 : -1;
  pos.realizedPnl +=
    (tradePrice - pos.entryPrice) * closeQty * pnlMultiplier;
  ```
- **Lines (Approx 359-376):**
  ```typescript
  let parsedBrokerage = parseFloat(rawTrade.brokerageCharges || 0);
  if (parsedBrokerage === 0 && (exchangeSegment.includes('FNO') || ...)) {
    parsedBrokerage = 20; // Injected PER EXECUTION instead of PER ORDER
  }
  ```

## 3. Why the Bug Exists
1. **The Multiplier Omission:** Dhan API returns `tradedQuantity` in **Total Units** for NSE F&O (e.g., 130 units), but returns it in **Lots** for MCX commodities (e.g., 6 lots). The formula `(Exit - Entry) * Qty` works for NSE because Qty is units. For MCX, it calculates PnL per lot, entirely missing the contract multiplier (e.g., x10 for CRUDEOILM, x100 for CRUDEOIL).
2. **The Charge Inflation:** When Dhan returns `0` for brokerage (since it settles end-of-day), TradeVault injects a ₹20 fallback fee. However, it applies this fee to *every raw execution*. A single 6-lot order partially filled across 5 executions will incur a ₹100 charge instead of ₹20.

## 4. How it Propagates
1. **Gross PnL Shrinkage:** The MCX profit is physically divided by the missing multiplier (e.g., 1/10th of actual).
2. **Net PnL Inversion:** The inflated brokerage charges are subtracted from this shrunken profit, instantly dragging a winning trade into a net loss.
3. **Data Corruption:** This incorrect Net PnL is saved to the PostgreSQL database.
4. **Analytics Poisoning:** The AI Coach, Discipline Score, Strategy Analyzer, and Dashboard all read the corrupted database values. 

## 5. Why Nobody Noticed
Most retail traders trade NSE F&O (NIFTY/BANKNIFTY), where the API returns total units (multiplier = 1). The bug primarily surfaces on MCX (Commodities) and multi-fill orders, which have lower volume but are critical for institutional/pro traders.

## 6. Production Impact
- **Severe:** Destroys user trust. A journaling app's primary directive is mathematical accuracy. 
- **Cascading Failure:** The AI Coach will scold users for "losing trades" that were actually highly profitable, directly harming trader psychology.
