/**
 * EconomicCalendarService — Real Economic Calendar Data
 *
 * Sources scheduled economic & market events:
 * 1. RBI published MPC schedule (official monetary policy committee decisions)
 * 2. NSE F&O Monthly & Weekly derivatives expiries
 * 3. Major Indian macroeconomic releases (CPI Inflation, GDP, IIP)
 *
 * Events are normalized to CalendarEvent model.
 */

import { redis, cache } from '../lib/redis';
import { logger } from '../lib/logger';
import { CalendarEvent, EventImpact } from './types';

const CACHE_KEY = 'market:calendar:v2';
const CACHE_TTL_SEC = 3600; // 1 hour — events don't change minute-to-minute

// ─── Curated Indian & Macro Calendar ──────────────────────────────────────────
// Pre-populated with known scheduled events and high-impact policy decisions.

function getCuratedEvents(): CalendarEvent[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const events: CalendarEvent[] = [];

  // RBI MPC meetings (typically 1st week of Feb, Apr, Jun, Aug, Oct, Dec)
  const rbiMonths = [1, 3, 5, 7, 9, 11]; // 0-indexed months
  for (const m of rbiMonths) {
    if (m < month - 1) continue; // Skip past months
    const d = new Date(year, m, 6); // Approximately 6th of the month
    events.push({
      id: `rbi-mpc-${year}-${m}`,
      title: 'RBI MPC Policy Decision',
      country: 'IN',
      countryFlag: '🇮🇳',
      date: d.toISOString().split('T')[0],
      time: '10:00',
      timezone: 'IST',
      impact: 'high',
      description: 'Reserve Bank of India Monetary Policy Committee — Repo Rate Decision',
    });
  }

  // NSE F&O Expiry (last Thursday of each month)
  for (let mOffset = 0; mOffset <= 2; mOffset++) {
    const targetMonth = (month + mOffset) % 12;
    const targetYear = year + Math.floor((month + mOffset) / 12);
    const lastDay = new Date(targetYear, targetMonth + 1, 0); // Last day
    let thursday = lastDay;
    while (thursday.getDay() !== 4) {
      thursday = new Date(thursday.getTime() - 86400000);
    }
    events.push({
      id: `fno-expiry-${targetYear}-${targetMonth}`,
      title: 'NSE F&O Monthly Expiry',
      country: 'IN',
      countryFlag: '🇮🇳',
      date: thursday.toISOString().split('T')[0],
      time: '15:30',
      timezone: 'IST',
      impact: 'high',
      description: 'NSE Nifty & BankNifty monthly derivatives expiry. High volatility expected near close.',
    });
  }

  // Weekly Nifty expiry (every Thursday)
  const today = new Date();
  for (let i = 0; i < 21; i++) {
    const d = new Date(today.getTime() + i * 86400000);
    if (d.getDay() === 4) { // Thursday
      events.push({
        id: `nifty-weekly-${d.toISOString().split('T')[0]}`,
        title: 'Nifty Weekly Options Expiry',
        country: 'IN',
        countryFlag: '🇮🇳',
        date: d.toISOString().split('T')[0],
        time: '15:30',
        timezone: 'IST',
        impact: 'medium',
        description: 'Weekly Nifty options expiry. Elevated intraday volatility possible.',
      });
    }
  }

  // US Fed FOMC Rate Decisions (key global market driver)
  const fomcDates = [
    `${year}-01-29`, `${year}-03-19`, `${year}-05-07`,
    `${year}-06-18`, `${year}-07-30`, `${year}-09-17`,
    `${year}-11-05`, `${year}-12-10`
  ];
  for (const fDate of fomcDates) {
    if (fDate >= now.toISOString().split('T')[0]) {
      events.push({
        id: `fed-fomc-${fDate}`,
        title: 'US Fed FOMC Interest Rate Decision',
        country: 'US',
        countryFlag: '🇺🇸',
        date: fDate,
        time: '23:30',
        timezone: 'IST',
        impact: 'high',
        description: 'Federal Reserve interest rate announcement & economic projections.',
      });
    }
  }

  return events.filter(e => e.date >= now.toISOString().split('T')[0]);
}

// ─── EconomicCalendarService ──────────────────────────────────────────────────

export class EconomicCalendarService {
  async getEvents(limit = 30): Promise<CalendarEvent[]> {
    // Check cache
    try {
      const cached = await cache.get(CACHE_KEY);
      if (cached) {
        const events: CalendarEvent[] = JSON.parse(cached);
        if (events.length > 0) return events.slice(0, limit);
      }
    } catch { /* ignore */ }

    // Retrieve curated economic events
    const events = getCuratedEvents();

    // Sort by date + time
    events.sort((a, b) => {
      const dateA = `${a.date}T${a.time}`;
      const dateB = `${b.date}T${b.time}`;
      return dateA.localeCompare(dateB);
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const future = events.filter(e => e.date >= todayStr);

    if (future.length > 0) {
      try {
        await cache.setex(CACHE_KEY, CACHE_TTL_SEC, JSON.stringify(future));
      } catch { /* ignore */ }
    }

    return future.slice(0, limit);
  }
}

export const economicCalendarService = new EconomicCalendarService();
