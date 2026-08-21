/**
 * Market Hours Utility
 *
 * Checks if the Indian market (NSE/BSE) is currently open.
 * Regular trading session: Monday - Friday, 09:00 - 15:30 IST.
 * Buffer period: 08:45 - 15:45 IST.
 */

export function isIndianMarketOpen(includeBuffer = true): boolean {
  // Allow overriding in dev/test via environment variable
  if (process.env.FORCE_MARKET_WORKERS === 'true') {
    return true;
  }

  const now = new Date();
  // IST is UTC + 5:30 (330 minutes)
  const istTimeMs = now.getTime() + 330 * 60 * 1000;
  const istDate = new Date(istTimeMs);

  const dayOfWeek = istDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false; // Weekend
  }

  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const startMinutes = includeBuffer ? 8 * 60 + 45 : 9 * 60; // 08:45 or 09:00
  const endMinutes = includeBuffer ? 15 * 60 + 45 : 15 * 60 + 30; // 15:45 or 15:30

  return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
}
