/**
 * Client-Side Phone Number Validation & Formatting Utility
 */

export function normalizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11 && /^[0-9]+$/.test(cleaned)) {
    // Strip domestic single leading 0 (e.g. 09876543210 -> 9876543210)
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const normalized = normalizePhoneNumber(phone);
  
  // Format check: optional +, then 10 to 15 digits (E.164 recommendation)
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  if (!phoneRegex.test(normalized)) {
    return false;
  }

  // Ensure not all identical digits
  const digitsOnly = normalized.replace(/\+/g, '');
  const allSameDigit = digitsOnly.split('').every(d => d === digitsOnly[0]);
  if (allSameDigit) {
    return false;
  }

  return true;
}

export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return 'Phone number is required.';
  }
  if (!isValidPhoneNumber(phone)) {
    return 'Please enter a valid 10-15 digit phone number (e.g. +91 9876543210 or 9876543210).';
  }
  return null;
}
