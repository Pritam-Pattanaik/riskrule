import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { inPeriod, periodBounds, tradeDate } from '../src/lib/tradePeriod';

test('week runs from Monday through the selected local day, including Sunday', () => {
  const sunday = new Date(2026, 10, 22, 12);
  const week = periodBounds('week', sunday);
  assert.ok(inPeriod(new Date(2026, 10, 16).toISOString(), week));
  assert.ok(inPeriod(new Date(2026, 10, 22, 23, 59, 59, 999).toISOString(), week));
  assert.equal(inPeriod(new Date(2026, 10, 23).toISOString(), week), false);
  assert.equal(inPeriod(new Date(2026, 10, 15).toISOString(), week), false);
});

test('last month crosses the year boundary and includes its final millisecond', () => {
  const bounds = periodBounds('last_month', new Date(2026, 0, 3));
  assert.ok(inPeriod(new Date(2025, 11, 31, 23, 59, 59, 999).toISOString(), bounds));
  assert.equal(inPeriod(new Date(2026, 0, 1).toISOString(), bounds), false);
});

test('a carry-forward close belongs to its exit period and an open trade to its entry period', () => {
  const date = new Date(2026, 9, 31).toISOString();
  const exitTime = new Date(2026, 10, 2).toISOString();
  const bounds = periodBounds('month', new Date(2026, 10, 10));
  assert.ok(inPeriod(tradeDate({ date, exitTime, isCarryForward: true }), bounds));
  assert.equal(inPeriod(tradeDate({ date, exitTime: null, isCarryForward: true }), bounds), false);
});
