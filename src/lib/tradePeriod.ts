import type { Trade } from '../types';

export const periods = {
  week: 'This week',
  month: 'This month',
  last_month: 'Last month',
  all: 'All time',
} as const;

export type TradePeriod = keyof typeof periods | 'today';

export function tradeDate(trade: Pick<Trade, 'date' | 'isCarryForward' | 'exitTime'>) {
  return trade.isCarryForward && trade.exitTime ? trade.exitTime : trade.date;
}

export function periodBounds(period: TradePeriod, now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const today = new Date(year, month, day);
  const tomorrow = new Date(year, month, day + 1);
  switch (period) {
    case 'today': return [today, tomorrow];
    case 'week': return [new Date(year, month, day - (today.getDay() + 6) % 7), tomorrow];
    case 'month': return [new Date(year, month, 1), tomorrow];
    case 'last_month': return [new Date(year, month - 1, 1), new Date(year, month, 1)];
    case 'all': return null;
  }
}

export function inPeriod(date: string, bounds: Date[] | null) {
  if (!bounds) return true;
  const timestamp = new Date(date).getTime();
  return timestamp >= bounds[0].getTime() && timestamp < bounds[1].getTime();
}
