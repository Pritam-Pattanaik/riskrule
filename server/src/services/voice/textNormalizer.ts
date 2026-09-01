import { logger } from '../../lib/logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NormalizeResult {
  normalized: string;
  isCodeMixed: boolean;
  codeMixedSegments: string[];
}

// ─── Ticker / Finance Term Override Dictionary ───────────────────────────────
// Extend this map freely — unknown all-caps tickers fall back to letter-by-letter.

const TICKER_OVERRIDES: Record<string, string> = {
  // Market indices
  NIFTY50:    'Nifty fifty',
  NIFTY:      'Nifty',
  BANKNIFTY:  'Bank Nifty',
  FINNIFTY:   'Fin Nifty',
  MIDCPNIFTY: 'Mid Cap Nifty',
  SENSEX:     'Sensex',

  // Blue-chip stocks (known pronunciations)
  RELIANCE:   'Reliance',
  HDFCBANK:   'HDFC Bank',
  HDFC:       'HDFC',
  ICICIBANK:  'ICICI Bank',
  TATAMOTORS: 'Tata Motors',
  TATASTEEL:  'Tata Steel',
  TCS:        'T C S',
  INFY:       'Infosys',
  WIPRO:      'Wipro',
  LT:         'L and T',
  BAJAJ:      'Bajaj',
  MARUTI:     'Maruti',
  SUNPHARMA:  'Sun Pharma',
  ITC:        'I T C',
  SBIN:       'S B I',
  ONGC:       'O N G C',
  NTPC:       'N T P C',

  // Trading / options terminology
  'F&O':  'Futures and Options',
  FO:     'Futures and Options',
  'P&L':  'P and L',
  PNL:    'P and L',
  PNLPCT: 'P and L percent',
  PE:     'P E',
  CE:     'C E',
  ATM:    'At the Money',
  ITM:    'In the Money',
  OTM:    'Out of the Money',
  SL:     'Stop Loss',
  TP:     'Target Price',
  TSL:    'Trailing Stop Loss',
  RR:     'Risk Reward',

  // Indicators / technical terms
  EMA:  'E M A',
  SMA:  'S M A',
  RSI:  'R S I',
  MACD: 'M A C D',
  VWAP: 'V-wap',
  ADX:  'A D X',
  ATR:  'A T R',
  BB:   'Bollinger Bands',

  // Market data terms
  OI:   'Open Interest',
  PCR:  'P C R',
  VIX:  'Vix',
  IV:   'Implied Volatility',

  // Regulatory / exchange
  SEBI: 'Sebi',
  NSE:  'N S E',
  BSE:  'B S E',
  MCX:  'M C X',
  NCDEX: 'N C D E X',

  // Common abbreviations
  LTP:  'Last Traded Price',
  MIS:  'M I S',
  CNC:  'C N C',
  NRML: 'Normal',
  BO:   'Bracket Order',
  CO:   'Cover Order',
  GTT:  'Good Till Trigger',
};

// ─── Non-Latin (Indic) Script Detection ─────────────────────────────────────
// Unicode ranges for Devanagari, Bengali, Telugu, Tamil, Kannada, Malayalam, Odia, Gujarati, Gurmukhi

const NON_LATIN_RANGES = [
  /[\u0900-\u097F]/,  // Devanagari (Hindi, Marathi)
  /[\u0980-\u09FF]/,  // Bengali
  /[\u0C00-\u0C7F]/,  // Telugu
  /[\u0B80-\u0BFF]/,  // Tamil
  /[\u0C80-\u0CFF]/,  // Kannada
  /[\u0D00-\u0D7F]/,  // Malayalam
  /[\u0B00-\u0B7F]/,  // Odia
  /[\u0A80-\u0AFF]/,  // Gujarati
  /[\u0A00-\u0A7F]/,  // Gurmukhi (Punjabi)
];

function containsNonLatin(text: string): boolean {
  return NON_LATIN_RANGES.some(r => r.test(text));
}

// ─── English Number → Words ───────────────────────────────────────────────────

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'];

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty',
  'sixty', 'seventy', 'eighty', 'ninety'];

function integerToWords(n: number): string {
  if (n === 0) return 'zero';
  if (n < 0) return 'minus ' + integerToWords(-n);

  const parts: string[] = [];

  // Indian number system: crore → lakh → thousand → hundred
  if (n >= 10_000_000) {
    parts.push(integerToWords(Math.floor(n / 10_000_000)) + ' crore');
    n %= 10_000_000;
  }
  if (n >= 100_000) {
    parts.push(integerToWords(Math.floor(n / 100_000)) + ' lakh');
    n %= 100_000;
  }
  if (n >= 1_000) {
    parts.push(integerToWords(Math.floor(n / 1_000)) + ' thousand');
    n %= 1_000;
  }
  if (n >= 100) {
    parts.push(ONES[Math.floor(n / 100)] + ' hundred');
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) {
      parts.push(ONES[n]);
    } else {
      const ten = TENS[Math.floor(n / 10)];
      const one = ONES[n % 10];
      parts.push(one ? `${ten} ${one}` : ten);
    }
  }

  return parts.join(' ');
}

function numberToWords(numStr: string): string {
  const isNegative = numStr.startsWith('-');
  const clean = numStr.replace(/^-/, '').replace(/,/g, '');

  if (clean.includes('.')) {
    const [intPart, decPart] = clean.split('.');
    const intWords = integerToWords(parseInt(intPart, 10));
    // Speak decimal digits individually for financial precision
    const decWords = decPart.split('').map(d => ONES[parseInt(d, 10)] || 'zero').join(' ');
    return (isNegative ? 'minus ' : '') + `${intWords} point ${decWords}`;
  }

  const n = parseInt(clean, 10);
  if (isNaN(n)) return numStr;
  return (isNegative ? 'minus ' : '') + integerToWords(n);
}

// ─── Currency Expansion ───────────────────────────────────────────────────────

interface CurrencyRule {
  pattern: RegExp;
  langLabel: (langCode: string) => string;
}

const CURRENCY_RULES: CurrencyRule[] = [
  {
    // ₹1,500 / ₹ 1500.50 / -₹450
    pattern: /(-?)₹\s*([\d,]+(?:\.\d+)?)/g,
    langLabel: (lang) => lang.startsWith('hi') ? 'रुपये' : 'rupees',
  },
  {
    // $45.50 / $1,000
    pattern: /\$\s*([\d,]+(?:\.\d+)?)/g,
    langLabel: () => 'dollars',
  },
  {
    // €100
    pattern: /€\s*([\d,]+(?:\.\d+)?)/g,
    langLabel: () => 'euros',
  },
  {
    // £200
    pattern: /£\s*([\d,]+(?:\.\d+)?)/g,
    langLabel: () => 'pounds',
  },
];

function expandCurrencies(text: string, langCode: string): string {
  let result = text;

  // ₹ with optional negative sign
  result = result.replace(/(-?)₹\s*([\d,]+(?:\.\d+)?)/g, (_, sign, num) => {
    const label = langCode.startsWith('hi') ? 'रुपये' : 'rupees';
    const prefix = sign === '-' ? 'minus ' : '';
    return `${prefix}${num.replace(/,/g, '')} ${label}`;
  });

  result = result.replace(/\$\s*([\d,]+(?:\.\d+)?)/g, (_, num) => `${num.replace(/,/g, '')} dollars`);
  result = result.replace(/€\s*([\d,]+(?:\.\d+)?)/g, (_, num) => `${num.replace(/,/g, '')} euros`);
  result = result.replace(/£\s*([\d,]+(?:\.\d+)?)/g, (_, num) => `${num.replace(/,/g, '')} pounds`);

  return result;
}

// ─── Percentage Expansion ────────────────────────────────────────────────────

/**
 * Expands percentage notation.
 * For English (en-IN): "2.3%" → "two point three percent"
 * For Indic languages (hi-IN, etc.): "2.3%" → "2.3 प्रतिशत" / keep numerals since Bulbul v3 reads them natively.
 * For all other supported languages: pass numeric value through, append localized suffix.
 */
function expandPercentages(text: string, langCode: string = 'en-IN'): string {
  const isEnglish = langCode.startsWith('en');
  if (isEnglish) {
    // English: convert to full words for natural reading
    return text.replace(/(-?[\d,]+(?:\.\d+)?)%/g, (_, num) => {
      return numberToWords(num) + ' percent';
    });
  }
  // Indic languages: Bulbul v3 reads digits natively; just remove the % symbol
  // with a language-aware spoken suffix so punctuation doesn't trip up TTS.
  return text.replace(/(-?[\d,]+(?:\.\d+)?)%/g, (_, num) => {
    const clean = num.replace(/,/g, '');
    return `${clean}%`; // Leave as-is — Sarvam handles this correctly for non-English
  });
}

// ─── Ordinal Expansion ───────────────────────────────────────────────────────

const ORDINALS: Record<string, string> = {
  '1st': 'first', '2nd': 'second', '3rd': 'third', '4th': 'fourth',
  '5th': 'fifth', '6th': 'sixth', '7th': 'seventh', '8th': 'eighth',
  '9th': 'ninth', '10th': 'tenth',
};

function expandOrdinals(text: string): string {
  return text.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (match) => {
    return ORDINALS[match.toLowerCase()] || match;
  });
}

// ─── Ticker / Finance Term Expansion ─────────────────────────────────────────

/**
 * Spells an unknown all-caps ticker letter-by-letter.
 * "XYZABC" → "X Y Z A B C"
 */
function spellLetterByLetter(word: string): string {
  return word.split('').join(' ');
}

function expandTickers(text: string): string {
  // Sort keys by length descending to match longest first (BANKNIFTY before NIFTY)
  const sortedKeys = Object.keys(TICKER_OVERRIDES).sort((a, b) => b.length - a.length);

  let result = text;

  for (const key of sortedKeys) {
    // Word-boundary match, case-insensitive
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');
    result = result.replace(re, TICKER_OVERRIDES[key]);
  }

  // Unknown all-caps tokens: 2–10 capital letters not already expanded
  // Only match words that are still all-caps after ticker expansion
  result = result.replace(/\b([A-Z]{2,10})\b/g, (match) => {
    // Skip if it's a known word or abbreviation we already handled
    return spellLetterByLetter(match);
  });

  return result;
}

// ─── Markdown Stripping ───────────────────────────────────────────────────────
// Absorbs and extends the existing stripMarkdownForSpeech() in SarvamVoiceService.ts

export function stripMarkdownForSpeech(text: string): string {
  if (!text) return '';

  const cleaned = text
    // Remove DISCIPLINE_JSON blocks including contents
    .replace(/<!--\s*DISCIPLINE_JSON\s*-->[\s\S]*?<!--\s*\/DISCIPLINE_JSON\s*-->/gi, '')
    // Remove any remaining HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    .replace(/_{1,3}(.*?)_{1,3}/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove links — keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove bullet markers
    .replace(/^[\s]*[-*+•]\s+/gm, '')
    // Remove numbered list markers
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove table formatting
    .replace(/\|/g, ', ')
    .replace(/^[-:| ]+$/gm, '');

  const lines = cleaned.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return (lines[0] || '').replace(/\s{2,}/g, ' ').trim();
  }

  return lines
    .map(line => /[.!?:,;]$/.test(line) ? line : line + '.')
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─── Code-Mix Detection ───────────────────────────────────────────────────────

/**
 * Detects English financial tokens (tickers, numbers, currency) embedded in
 * non-Latin (Indic) script sentences. Flags for manual TTS quality review.
 */
function detectCodeMix(text: string): { isCodeMixed: boolean; segments: string[] } {
  if (!containsNonLatin(text)) {
    return { isCodeMixed: false, segments: [] };
  }

  // Look for English words / uppercase tickers within non-Latin text
  const englishInIndic = text.match(/\b[A-Za-z][A-Za-z0-9&]*\b/g) || [];
  const financialTerms = englishInIndic.filter(w =>
    w.length >= 2 &&
    // Exclude common English particles that are typically fine in code-mixed speech
    !['a', 'I', 'is', 'in', 'on', 'to', 'or', 'for', 'the', 'and', 'at', 'by', 'of'].includes(w)
  );

  if (financialTerms.length > 0) {
    logger.warn(`[TextNormalizer] Code-mixed sentence detected. Financial tokens in non-Latin text: [${financialTerms.join(', ')}]. Sarvam TTS quality on this pattern is unverified — flag for manual review.`);
    return { isCodeMixed: true, segments: financialTerms };
  }

  return { isCodeMixed: false, segments: [] };
}

// ─── Main Normalizer ─────────────────────────────────────────────────────────

/**
 * Normalizes text for Sarvam AI Bulbul v3 TTS.
 *
 * Pipeline:
 *   1. Strip markdown / HTML comments
 *   2. Expand currency symbols (language-aware labels)
 *   3. Expand percentages (language-aware — English gets word-form, Indic keeps numerals)
 *   4. Expand ordinals (1st, 2nd, etc.) — English only
 *   5. Expand known tickers + letter-spell unknown all-caps — English only
 *   6. Detect code-mixing in Indic-script text
 *
 * @param text       Raw LUNAR AI message text (may contain markdown)
 * @param langCode   BCP-47 language code, e.g. 'en-IN', 'hi-IN', 'od-IN'
 */
export function normalizeForTTS(text: string, langCode: string = 'en-IN'): NormalizeResult {
  if (!text || text.trim().length === 0) {
    return { normalized: '', isCodeMixed: false, codeMixedSegments: [] };
  }

  // Check if original source text contains native Indic script (e.g. Devanagari)
  // before we perform any currency substitutions that might inject Indic characters.
  const hasNativeIndicScript = containsNonLatin(text);

  // Step 1: Strip markdown/HTML (language-agnostic — safe for all scripts)
  let normalized = stripMarkdownForSpeech(text);

  // Step 2: Expand ordinals and tickers FIRST on Latin-script content
  // LUNAR AI outputs Latin-script text in all language modes. Running this
  // before currency expansion ensures tickers like BANKNIFTY or RSI are properly
  // expanded without being blocked by localized currency words (e.g. रुपये).
  if (!hasNativeIndicScript) {
    normalized = expandOrdinals(normalized);
    normalized = expandTickers(normalized);
  }

  // Step 3: Expand currency symbols (language-aware labels e.g. ₹ → rupees / रुपये)
  normalized = expandCurrencies(normalized, langCode);

  // Step 4: Expand percentages — language-aware
  // English: "2.3%" → "two point three percent"
  // Indic languages: leave numerals as digits, Sarvam Bulbul v3 reads them natively
  normalized = expandPercentages(normalized, langCode);

  // Step 5: Detect code-mixing for flagging (only if input was native Indic script)
  const { isCodeMixed, segments } = hasNativeIndicScript
    ? detectCodeMix(normalized)
    : { isCodeMixed: false, segments: [] };

  // Final cleanup
  normalized = normalized.replace(/\s{2,}/g, ' ').trim();

  return {
    normalized,
    isCodeMixed,
    codeMixedSegments: segments,
  };
}
