# Financial Calculation Audit

## 1. Realized PnL
- **Current Formula:** `(ExitPrice - EntryPrice) * Quantity * DirectionMultiplier`
- **Audit Finding:** **FAIL**. Missing `ContractMultiplier`. MCX quantities are returned in lots.
- **Correction:** Must be `(ExitPrice - EntryPrice) * (Quantity * ContractMultiplier) * DirectionMultiplier`.

## 2. Unrealized PnL
- **Current Formula:** N/A in DB (Open trades have 0 exit price).
- **Audit Finding:** Handled correctly as `status: OPEN`. Frontend usually calculates LTP. 

## 3. Net PnL
- **Current Formula:** `Realized PnL - Charges`
- **Audit Finding:** **FAIL**. Inherits errors from Realized PnL and Charges. 

## 4. Gross PnL
- **Audit Finding:** Alias for Realized PnL. **FAIL**.

## 5. Charges (Brokerage + Taxes)
- **Current Formula:** `Sum(Sebi + STT + Brokerage + ServiceTax + ExchangeTx + StampDuty)`
- **Fallback Brokerage Injection:** `If brokerage == 0, inject 20`.
- **Audit Finding:** **FAIL**. Fallback is injected per execution loop. Must be injected per distinct `orderId`.

## 6. Average Buy / Sell (Scale In / Out)
- **Current Formula:** `(OldPrice * OldQty + NewPrice * NewQty) / NewTotalQty`
- **Audit Finding:** **PASS**. Mathematically sound for FIFO execution averaging.

## 7. Partial Exit / Multiple Executions
- **Current Formula:** Slices `closeQty` from `currentQty`.
- **Audit Finding:** **PASS**. FIFO queue logic is functionally correct, but relies on flawed Charges calculation per slice.

## 8. Manual Recalculation (Dhan Screenshot vs TradeVault)

**CRUDEOILM 17 AUG 7500 PE**
- **Raw Values:** Buy 295.79, Sell 308.15, Qty 6 (Lots).
- **Brokerage:** Assume 2 orders (1 entry, 1 exit) = ₹40.
- **Expected Value (Dhan):**
  - Gross PnL = (308.15 - 295.79) * (6 * 10) = 12.36 * 60 = 741.60.
  - Net PnL = ~741.60 - Charges = ~741.50 (Dhan PnL often excludes brokerage on the position screen, showing Gross).
- **TradeVault Value:**
  - Gross PnL = (308.15 - 295.79) * 6 = 74.16.
  - Charges = ~220 (Assuming multiple partial fills triggering ₹20 each).
  - Net PnL = 74.16 - 220 = -145.84.
- **Difference:** Massive sign inversion and 10x magnitude error.
