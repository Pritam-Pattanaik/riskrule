# Post-Implementation Validation

Once the code changes are merged, follow these steps to validate in production:

1. **Trigger Full Sync for Affected User:**
   - Execute the `/sync` API for the affected user, or run `server/scripts/sync_trades.ts <userId> --full`.
2. **Query Database for CRUDEOILM:**
   ```sql
   SELECT quantity, pnl, charges, net_pnl 
   FROM trades 
   WHERE symbol LIKE '%CRUDEOILM%' AND user_id = '<userId>';
   ```
   - Verify `quantity` is 60 (not 6).
   - Verify `pnl` is 741.60 (not 74.16).
3. **Verify Dashboard Metrics:**
   - Check the Daily Summary Block for the specific date.
   - Verify the net PnL is positive.
4. **Monitor Error Logs:**
   - Ensure the AI Coach background jobs aren't crashing on the newly recalculated data structures.
5. **Check Other Users:**
   - Validate an NSE F&O trade for a different user to ensure NIFTY calculations haven't been incorrectly inflated.
