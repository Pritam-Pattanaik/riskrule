/**
 * Dhan HQ API returns `tradedQuantity` in actual contract units (barrels, shares, etc.),
 * NOT in lot numbers. Multiplying by lot sizes causes double-multiplication (e.g. 10x for CRUDEOILM,
 * 100x for CRUDEOIL), which was the root cause of inflated P&L numbers.
 */
export function getContractMultiplier(_symbol: string, _exchangeSegment: string): number {
  return 1;
}

