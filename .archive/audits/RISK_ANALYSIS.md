# Risk Analysis

## High Risks
1. **Double Multiplication (F&O):** If the multiplier logic accidentally targets `NSE_FNO`, NIFTY trades could see quantities jump (e.g., 130 -> 3250), destroying PnL. The multiplier must strictly target `MCX_COMM` or specific symbols, acknowledging that Dhan *already* multiplies NSE F&O into units.
2. **Backwards Compatibility:** Users with manually corrected trades in TradeVault (where they used "Manual Override" to fix the PnL) might get their manual overrides wiped if a full resync is triggered. 
3. **Other Brokers:** If other brokers (e.g., AngelOne, Zerodha) return MCX in units instead of lots, we must ensure `getContractMultiplier` is broker-aware or applied at the adapter level, not the global database level.

## Mitigations
- Keep `getContractMultiplier` inside the Dhan adapter logic flow, rather than making it a global model transform, since different brokers serialize quantities differently.
- Thoroughly test NSE F&O vs MCX routing before deploying.
