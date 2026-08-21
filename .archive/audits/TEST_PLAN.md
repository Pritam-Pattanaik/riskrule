# Test Plan

## Scenario 1: The Dhan Screenshot (MCX)
- **Input:** 6 Lots of CRUDEOILM 17 AUG 7500 PE. Buy 295.79. Sell 308.15. 
- **Expected Qty in DB:** 60.
- **Expected Gross PnL:** ₹741.60.
- **Expected Charges:** ~₹40 (if ₹20 injected per leg).
- **Expected Net PnL:** ~₹701.60.

## Scenario 2: The Dhan Screenshot (NSE F&O)
- **Input:** 130 units NIFTY 11 AUG 24600 PUT. Buy 94.68, Sell 103.65.
- **Expected Qty in DB:** 130.
- **Expected Gross PnL:** ₹1,166.10.

## Scenario 3: Partial Fills (Brokerage Leak Test)
- **Input:** 1 Buy order of 100 units filled in 10 executions of 10 units each.
- **Old Behavior:** Brokerage = ₹200.
- **Expected Behavior:** Brokerage = ₹20 (tracked by `orderId`).

## Scenario 4: Partial Exits (Scale Out)
- **Input:** Buy 100 at 100. Sell 50 at 110. Sell 50 at 120.
- **Expected Gross PnL:** (10 * 50) + (20 * 50) = 500 + 1000 = ₹1500.
- **Expected Charges:** ₹20 (Buy order) + ₹20 (Sell order 1) + ₹20 (Sell order 2) = ₹60.

## Execution
- Create a Mocha/Jest or raw Node test script `test_calculations.ts` simulating these raw JSON inputs being fed into `syncDhanTrades()`. Assert the output `tradesToInsert` array matches the expected values.
