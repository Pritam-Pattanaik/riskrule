/**
 * Phone Number Validation & Normalization Utility
 */

/**
 * Normalizes a phone number by stripping whitespace, hyphens, parentheses, and dots.
 * Strips leading 0 when an 11-digit national number is entered (e.g. 09876543210 -> 9876543210).
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  // Remove spaces, tabs, dashes, parentheses, dots
  let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');
  // If starts with 00 (international prefix), replace with +
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11 && /^[0-9]+$/.test(cleaned)) {
    // Strip domestic single leading 0 (e.g. 09876543210 -> 9876543210)
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Validates whether a phone number meets international and national mobile phone standards.
 * Standard rules:
 * - 10 to 15 digits
 * - Optional '+' prefix for country code
 * - Valid numeric sequence without invalid repeated characters or alphabetics
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const normalized = normalizePhoneNumber(phone);
  
  // Format check: optional +, then 10 to 15 digits (E.164 recommendation)
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  if (!phoneRegex.test(normalized)) {
    return false;
  }

  // Ensure not all identical digits (e.g. +0000000000 or 1111111111)
  const digitsOnly = normalized.replace(/\+/g, '');
  const allSameDigit = digitsOnly.split('').every(d => d === digitsOnly[0]);
  if (allSameDigit) {
    return false;
  }

  return true;
}

/**
 * Validates phone input and returns an error message if invalid, or null if valid.
 */
export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return 'Phone number is required.';
  }
  if (!isValidPhoneNumber(phone)) {
    return 'Please enter a valid 10-15 digit phone number (optionally with country code, e.g. +91 9876543210).';
  }
  return null;
}
