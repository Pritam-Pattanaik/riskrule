import { useState, useEffect } from 'react';

export function useMarketStatus() {
  const [status, setStatus] = useState(getMarketStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getMarketStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return status;
}

function getMarketStatus() {
  const now = new Date();
  
  // Use Intl.DateTimeFormat to reliably get IST time regardless of local timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  // Example output: "Sat, 23:06" (note that it may be "24:xx" depending on node version, so parse carefully)
  const parts = formatter.formatToParts(now);
  let weekday = '';
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === 'weekday') weekday = part.value;
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
  }
  
  // Handle hour 24 format issue just in case
  if (hour === 24) hour = 0;

  const isWeekend = weekday === 'Sat' || weekday === 'Sun';
  const time = hour + minute / 60;
  
  // Market hours: 9:15 (9.25) to 15:30 (15.5) IST
  const isWithinHours = time >= 9.25 && time < 15.5;

  const isMarketOpen = !isWeekend && isWithinHours;
  const label = isMarketOpen ? 'Live' : (isWeekend ? 'Market Closed' : 'After Hours');

  return { isMarketOpen, label };
}
