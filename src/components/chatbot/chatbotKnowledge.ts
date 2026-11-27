/**
 * RiskRule Chatbot — Visitor knowledge base, page-aware quick replies,
 * and weighted + typo-tolerant intent matching.
 */

export interface KnowledgeEntry {
  id: string;
  /** High-signal terms/phrases unique to this intent (weight +4). */
  coreKeywords: string[];
  /** Supporting terms (weight +2). */
  keywords: string[];
  /** Multi-word phrases that strongly indicate this intent (weight +6). */
  phrases?: string[];
  question: string;
  answer: string;
  followUps?: string[];
  /** Optional category used for smart related suggestions. */
  showInSuggestions?: boolean;
}

/* ── Page-aware quick-reply chips ───────────────────────────────── */
export const quickReplies = [
  'What is RiskRule?',
  'Show me pricing',
  'Which brokers are supported?',
  'Tell me about Lunar AI',
  'How do I get started?',
];

export function getQuickRepliesForPath(pathname: string): string[] {
  if (pathname.startsWith('/pricing')) {
    return [
      'Compare Starter vs PRO',
      'What do I get for free?',
      'How do I pay & cancel?',
      'Which brokers are supported?',
    ];
  }
  if (pathname.startsWith('/ai-coach')) {
    return [
      'What commands does Lunar AI have?',
      'Does it support Hindi voice?',
      'How is it different from a trading bot?',
      'Show me pricing',
    ];
  }
  if (pathname.startsWith('/prop-traders')) {
    return [
      'How does loss limit tracking work?',
      'Which rules can I set?',
      'Does RiskRule place orders?',
      'Compare Starter vs PRO',
    ];
  }
  if (pathname.startsWith('/features') || pathname.startsWith('/workspace')) {
    return [
      'Which brokers are supported?',
      'What is Flow option chain?',
      'Tell me about Lunar AI',
      'Can I use it without a broker?',
    ];
  }
  return quickReplies;
}

/* ── Knowledge entries ──────────────────────────────────────────── */
export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'greeting',
    coreKeywords: ['hi', 'hello', 'hey', 'hii', 'helo', 'namaste', 'hola', 'yo'],
    keywords: ['morning', 'afternoon', 'evening', 'greetings'],
    phrases: ['good morning', 'good afternoon', 'good evening', 'how are you'],
    question: 'Hi there!',
    answer:
      'Hey! 👋 Welcome to **RiskRule**.\n\n' +
      'I can answer questions about our trade journal, **Lunar AI** coach, **Dhan / Angel One / Delta Exchange** imports, option-chain **Flow**, or **Starter / PRO / ELITE** plans.\n\n' +
      'What are you exploring today?',
    followUps: ['What is RiskRule?', 'Show me pricing', 'Which brokers are supported?', 'Tell me about Lunar AI'],
    showInSuggestions: false,
  },
  {
    id: 'thanks',
    coreKeywords: ['thanks', 'thank', 'thx', 'ty', 'bye', 'goodbye', 'awesome', 'great', 'helpful', 'cool', 'nice'],
    keywords: ['appreciate', 'cheers', 'perfect', 'ok', 'okay'],
    phrases: ['thank you', 'got it', 'makes sense'],
    question: 'Thanks!',
    answer:
      "You're very welcome! 😊 Whenever you're ready to see your trading patterns clearly, you can start free in under a minute.\n\n" +
      '→ [Create your free account](/signup)',
    followUps: ['How do I get started?', 'Show me pricing'],
    showInSuggestions: false,
  },
  {
    id: 'what-is',
    coreKeywords: ['overview', 'introduction', 'riskrule'],
    keywords: ['platform', 'product', 'website', 'workspace', 'bridge', 'understand'],
    phrases: ['what is riskrule', 'about riskrule', 'tell me about riskrule', 'what does riskrule do', 'how does riskrule work'],
    question: 'What is RiskRule?',
    answer:
      '**RiskRule** is a trading journal, rule-checker, and market intelligence workspace built around the Indian market day.\n\n' +
      '- 📊 **Trade Journal & Analytics** — net P&L after charges, win rate, R:R expectancy, and setup attribution\n' +
      '- 🛡️ **Rules & Discipline** — track daily loss limits, max trades/day, and spot revenge trades\n' +
      '- 🤖 **Lunar AI Coach** — behavioral review built from your own trades (never makes up P&L)\n' +
      '- ⚡ **Flow & Markets** — Nifty/Bank Nifty/Fin Nifty option-chain Flow, live quotes, sector heatmap, and triaged news\n\n' +
      '*Your broker records your trades. RiskRule helps you understand them.*',
    followUps: ['Show me pricing', 'Which brokers are supported?', 'Tell me about Lunar AI'],
    showInSuggestions: true,
  },
  {
    id: 'pricing',
    coreKeywords: ['price', 'pricing', 'cost', 'plans', 'plan', 'starter', 'pro', 'elite', 'rupee', 'inr', 'fee', 'fees'],
    keywords: ['subscription', 'pay', 'money', 'affordable', 'expensive', 'monthly', 'yearly', 'annual', 'discount'],
    phrases: ['how much', 'show me pricing', 'plan cost', 'yearly discount'],
    question: 'Show me pricing',
    answer:
      'RiskRule has three transparent plans (yearly billing saves **20%**):\n\n' +
      '| Plan | Yearly | Monthly | Best for |\n' +
      '|---|---|---|---|\n' +
      '| **Starter** | ₹0/mo | ₹0/mo | Developing traders (1 broker, R:R, 30-day ledger) |\n' +
      '| **PRO** | ₹1,199/mo | ₹1,499/mo | Active & funded traders (Lunar AI, unlimited brokers, daily loss alerts) |\n' +
      '| **ELITE** | ₹3,199/mo | ₹3,999/mo | Multi-account desks (copy ledgers, custom voice personas, API) |\n\n' +
      'Payments are handled via **Razorpay**, and you can cancel anytime with zero termination fees.\n\n' +
      '→ [Compare all plans](/pricing)',
    followUps: ['Compare Starter vs PRO', 'What do I get for free?', 'How do I pay & cancel?'],
    showInSuggestions: true,
  },
  {
    id: 'plan-compare',
    coreKeywords: ['compare', 'comparison', 'difference', 'upgrade', 'tier', 'tiers'],
    keywords: ['starter', 'pro', 'elite', 'better', 'choose', 'recommend', 'which'],
    phrases: ['starter vs pro', 'pro vs elite', 'compare plans', 'which plan'],
    question: 'Compare Starter vs PRO',
    answer:
      'Here is the quick breakdown:\n\n' +
      '- **Starter (₹0):** 1 broker connection, 30-day ledger, setup attribution tags, and R:R expectancy.\n' +
      '- **PRO (₹1,199/mo yearly):** Adds **unlimited brokers**, **Lunar AI coach + Hindi voice playback**, live **daily loss limit tracking**, volatility alerts, CSV exports, and webhook sync.\n' +
      '- **ELITE (₹3,199/mo yearly):** Adds **multi-account copy ledgers**, custom voice co-pilot personas, strategy webhooks/API access, a dedicated desk architect, and priority support.\n\n' +
      'Most active traders start on **Starter** and upgrade to **PRO** once they want AI reviews and rule-breach tracking.\n\n' +
      '→ [See side-by-side comparison](/pricing)',
    followUps: ['What do I get for free?', 'How do I get started?'],
    showInSuggestions: true,
  },
  {
    id: 'brokers',
    coreKeywords: ['broker', 'brokers', 'dhan', 'angel', 'angelone', 'delta', 'import', 'sync'],
    keywords: ['connect', 'integration', 'supported', 'fills', 'webhook', 'webhooks', 'auto'],
    phrases: ['which brokers', 'angel one', 'delta exchange', 'supported brokers', 'connect broker'],
    question: 'Which brokers are supported?',
    answer:
      'RiskRule natively imports trades from:\n\n' +
      '- **Dhan**\n' +
      '- **Angel One**\n' +
      '- **Delta Exchange**\n\n' +
      'You can also **log trades manually** if you trade with another broker. Starter includes **1 broker connection**, while PRO and ELITE include **unlimited connections** plus webhook sync.',
    followUps: ['What about Zerodha or Upstox?', 'Does RiskRule place orders?', 'Can I use it without a broker?'],
    showInSuggestions: true,
  },
  {
    id: 'other-brokers',
    coreKeywords: ['zerodha', 'kite', 'upstox', 'groww', 'fyers', 'alice', 'shoonya', 'binance', 'metatrader', 'mt4', 'mt5', 'icici', 'kotak'],
    keywords: ['other', 'missing', 'supported', 'csv', 'upload'],
    phrases: ['other brokers', 'my broker', 'alice blue'],
    question: 'What about Zerodha or Upstox?',
    answer:
      'Direct API sync currently supports **Dhan**, **Angel One**, and **Delta Exchange**.\n\n' +
      'If you trade on **Zerodha, Upstox, Fyers, Groww**, or any other broker, you can still use the full journal and analytics by entering trades manually — all P&L, strategy stats, and rule checks work identically.',
    followUps: ['Can I use it without a broker?', 'Which brokers are supported?'],
    showInSuggestions: false,
  },
  {
    id: 'order-safety',
    coreKeywords: ['orders', 'order', 'execute', 'execution', 'readonly', 'permission', 'permissions'],
    keywords: ['place', 'modify', 'cancel', 'safe', 'control', 'access', 'broker'],
    phrases: ['place orders', 'read only', 'read-only', 'modify orders', 'change orders', 'execute trades'],
    question: 'Does RiskRule place orders?',
    answer:
      '**No — never.** RiskRule is strictly **read-only**.\n\n' +
      'It imports your fills to review your P&L and discipline, and **never** places, modifies, or cancels an order at your broker.',
    followUps: ['Is my data secure?', 'Which brokers are supported?'],
    showInSuggestions: true,
  },
  {
    id: 'ai-coach',
    coreKeywords: ['lunar', 'coach', 'ai', 'psychology', 'psych', 'behavioral', 'habits'],
    keywords: ['artificial', 'intelligence', 'pattern', 'patterns', 'review', 'debrief', 'mistakes', 'sizing'],
    phrases: ['ai coach', 'lunar ai', 'trading coach'],
    question: 'Tell me about Lunar AI',
    answer:
      '**Lunar AI** is your personal trading review coach built on top of your own journal and rules:\n\n' +
      '- 📏 Flags sudden size jumps (like sizing up `2×` after a stop-out)\n' +
      '- ⏰ Identifies hours and sessions that consistently leak capital\n' +
      '- 🛑 Spots revenge-trading streaks after consecutive losses\n' +
      '- 🧮 **Zero hallucinated math:** RiskRule computes your P&L, win rate, and drawdown first — Lunar AI only explains verified numbers\n\n' +
      '→ [Explore Lunar AI](/ai-coach)',
    followUps: ['What commands does Lunar AI have?', 'Does it support Hindi voice?', 'How is it different from a trading bot?'],
    showInSuggestions: true,
  },
  {
    id: 'ai-commands',
    coreKeywords: ['command', 'commands', 'slash', 'debrief', 'premarket'],
    keywords: ['plan', 'risk', 'psych', 'perf', 'rules', 'prompt', 'ask'],
    phrases: ['slash commands', 'what commands', 'lunar ai commands'],
    question: 'What commands does Lunar AI have?',
    answer:
      'Inside Lunar AI, you can ask freely or type `/` for structured review modes:\n\n' +
      '- `/plan` — Pre-market bias, key levels, risk limits, and setups\n' +
      '- `/debrief` — Post-market adherence check, best trade & worst decision\n' +
      '- `/risk` — Position sizing & stop-loss leak audit\n' +
      '- `/psych` — Emotional patterns in entries and exits\n' +
      '- `/perf` — Expectancy, profit factor, win rate, top setups\n' +
      '- `/rules` — Which of your rules you break most often\n\n' +
      '→ [See Lunar AI examples](/ai-coach)',
    followUps: ['Does it support Hindi voice?', 'Show me pricing'],
    showInSuggestions: false,
  },
  {
    id: 'voice-hindi',
    coreKeywords: ['voice', 'hindi', 'audio', 'speak', 'aloud', 'tts', 'persona', 'personas'],
    keywords: ['listen', 'language', 'sound', 'playback', 'copilot'],
    phrases: ['hindi voice', 'read aloud', 'voice playback', 'voice co-pilot'],
    question: 'Does it support Hindi voice?',
    answer:
      'Yes! **Voice playback** (including **Hindi voices**) lets Lunar AI read its trade reviews aloud while you browse your trades.\n\n' +
      '- **PRO:** Voice playback for coach responses\n' +
      '- **ELITE:** Voice co-pilot with custom personas\n\n' +
      '→ [See plans with voice](/pricing)',
    followUps: ['Tell me about Lunar AI', 'Compare Starter vs PRO'],
    showInSuggestions: false,
  },
  {
    id: 'trading-bot-diff',
    coreKeywords: ['bot', 'algo', 'algorithm', 'signals', 'signal', 'tips', 'calls', 'adviser', 'advisor', 'sebi'],
    keywords: ['difference', 'different', 'automated', 'auto', 'recommend', 'guarantee'],
    phrases: ['trading bot', 'buy or sell', 'stock tips', 'trade calls', 'investment advice'],
    question: 'How is it different from a trading bot?',
    answer:
      'RiskRule and Lunar AI are **not** a trading bot and **never** give buy/sell calls or stock tips.\n\n' +
      '| | Trading Bot | Lunar AI |\n' +
      '|---|---|---|\n' +
      '| Places trades or calls | ✅ Yes | ❌ No |\n' +
      '| Reviews your history | ❌ No | ✅ Yes |\n' +
      '| Catches rule breaches | ❌ No | ✅ Yes |\n\n' +
      'RiskRule is an educational journaling & self-review tool that helps you fix your own execution habits.',
    followUps: ['Tell me about Lunar AI', 'Does RiskRule place orders?'],
    showInSuggestions: false,
  },
  {
    id: 'flow-options',
    coreKeywords: ['flow', 'option', 'options', 'chain', 'oi', 'pcr', 'iv', 'nifty', 'banknifty', 'finnifty'],
    keywords: ['pain', 'implied', 'volatility', 'calls', 'puts', 'futures', 'fno'],
    phrases: ['option chain', 'max pain', 'open interest', 'put call ratio', 'bank nifty', 'fin nifty'],
    question: 'What is Flow option chain?',
    answer:
      '**Flow** gives you live option-chain context for **Nifty, Bank Nifty, and Fin Nifty**:\n\n' +
      '- Open Interest (OI) buildup across strikes\n' +
      '- Put-Call Ratio (PCR)\n' +
      '- Max Pain & Implied Volatility (IV)\n\n' +
      'So you know what positioning looked like at the moment you took a trade.\n\n' +
      '→ [Explore the workspace](/workspace)',
    followUps: ['What features does RiskRule have?', 'Show me pricing'],
    showInSuggestions: true,
  },
  {
    id: 'markets-news',
    coreKeywords: ['news', 'market', 'markets', 'heatmap', 'calendar', 'economic', 'events'],
    keywords: ['quotes', 'live', 'sector', 'sectors', 'breadth', 'watchlist', 'volatility', 'rss'],
    phrases: ['economic calendar', 'sector heatmap', 'market news', 'live quotes'],
    question: 'What market & news tools are included?',
    answer:
      'RiskRule keeps market context right next to your journal:\n\n' +
      '- 🌍 **Markets Hub** — live index quotes, sector heatmaps, market breadth, and watchlists\n' +
      '- 📰 **Triaged News** — market headlines scored for likely sector impact\n' +
      '- 📅 **Economic Calendar & Volatility Alerts** (PRO+) — stay aware before major macro events\n\n' +
      '→ [See all features](/features)',
    followUps: ['What is Flow option chain?', 'Show me pricing'],
    showInSuggestions: false,
  },
  {
    id: 'rules-limits',
    coreKeywords: ['loss', 'limit', 'limits', 'rule', 'rules', 'rulebook', 'drawdown', 'breach', 'revenge', 'overtrading'],
    keywords: ['daily', 'risk', 'window', 'hours', 'maximum', 'instrument', 'instruments'],
    phrases: ['daily loss', 'loss limit', 'which rules', 'trading rules', 'max loss'],
    question: 'How does loss limit tracking work?',
    answer:
      'Write your personal rulebook in RiskRule once:\n\n' +
      '- **Daily loss limit** & **max loss per trade**\n' +
      '- **Maximum trades per day**\n' +
      '- **Allowed trading window** (e.g., `09:15` to `14:30`) & **allowed instruments**\n' +
      '- Plus custom rules in your own words\n\n' +
      'RiskRule flags the exact trade that crossed a limit and shows what every extra trade after it cost you.\n\n' +
      '→ [See rulebook demo](/prop-traders)',
    followUps: ['Is RiskRule good for prop/funded traders?', 'Show me pricing'],
    showInSuggestions: true,
  },
  {
    id: 'prop-traders',
    coreKeywords: ['prop', 'funded', 'evaluation', 'firm', 'challenge', 'ftmo', 'copy'],
    keywords: ['account', 'accounts', 'multi', 'desk', 'consistency', 'pass'],
    phrases: ['prop trader', 'funded account', 'prop firm', 'multi account'],
    question: 'Is RiskRule good for prop/funded traders?',
    answer:
      'Yes! Funded accounts usually end on **one undisciplined day**.\n\n' +
      '- Put your firm’s daily loss, per-trade, and trade-count limits into RiskRule\n' +
      '- Spot rule breaches across every synced session\n' +
      '- **ELITE** adds **multi-account copy ledgers** for multi-account desks\n\n' +
      '*(Your firm’s own dashboard always remains the official source of truth for its rules.)*\n\n' +
      '→ [RiskRule for funded traders](/prop-traders)',
    followUps: ['Which rules can I set?', 'Compare Starter vs PRO'],
    showInSuggestions: true,
  },
  {
    id: 'manual-journal',
    coreKeywords: ['manual', 'manually', 'hand', 'journal', 'journaling', 'notes', 'mood', 'reflection', 'tags'],
    keywords: ['without', 'type', 'enter', 'log', 'charges', 'fees', 'checklist', 'bias', 'levels'],
    phrases: ['without a broker', 'add trades manually', 'by hand', 'daily journal'],
    question: 'Can I use it without a broker?',
    answer:
      'Yes! You can log trades by hand anytime and still get full analytics.\n\n' +
      'Track entry/exit prices, charges, net P&L (F&O lots handled), strategy setups, checklists, mistakes, key levels, mood, and daily reflections.\n\n' +
      '→ [Explore the workspace](/workspace)',
    followUps: ['Which brokers are supported?', 'How do I get started?'],
    showInSuggestions: true,
  },
  {
    id: 'free-plan',
    coreKeywords: ['free', 'trial', 'nocard'],
    keywords: ['starter', 'forever', 'cost', 'credit', 'card'],
    phrases: ['for free', 'free plan', 'credit card', 'no cost'],
    question: 'What do I get for free?',
    answer:
      'The **Starter** plan is **₹0/month** with no credit card and no time limit:\n\n' +
      '- 1 broker connection + manual trade entry\n' +
      '- R:R expectancy calculations\n' +
      '- 30-day performance ledger\n' +
      '- Setup attribution tags\n\n' +
      '→ [Start free now](/signup)',
    followUps: ['Compare Starter vs PRO', 'How do I get started?'],
    showInSuggestions: true,
  },
  {
    id: 'billing-cancel',
    coreKeywords: ['cancel', 'cancellation', 'refund', 'razorpay', 'billing', 'upi', 'card', 'payment'],
    keywords: ['stop', 'terminate', 'unsubscribe', 'downgrade', 'export', 'csv'],
    phrases: ['how do i pay', 'cancel subscription', 'pay and cancel', 'pay & cancel'],
    question: 'How do I pay & cancel?',
    answer:
      'Payments are processed securely through **Razorpay**.\n\n' +
      '- Cancel in **one click** from your billing settings — **zero termination fees**\n' +
      '- You keep read access to your exported ledgers and journals\n' +
      '- Your account automatically moves to the free **Starter** tier\n\n' +
      '→ [View pricing details](/pricing)',
    followUps: ['What do I get for free?', 'Show me pricing'],
    showInSuggestions: false,
  },
  {
    id: 'security',
    coreKeywords: ['security', 'secure', 'privacy', 'private', 'safe', 'data', 'sell', 'share'],
    keywords: ['protect', 'protection', 'trust', 'terms', 'policy', 'account', 'own'],
    phrases: ['is my data safe', 'is my data secure', 'privacy policy'],
    question: 'Is my data secure?',
    answer:
      'Yes — your journal stays yours:\n\n' +
      '- 🔒 Your trades, notes, and Lunar AI conversations are private to your account\n' +
      '- 🛡️ Broker connections are **read-only** (RiskRule never places or alters orders)\n' +
      '- 🚫 We earn strictly from subscriptions — we never sell trading data or earn from order flow\n\n' +
      'Read our [Privacy Policy](/privacy) and [Terms](/terms).',
    followUps: ['Does RiskRule place orders?', 'How do I get started?'],
    showInSuggestions: false,
  },
  {
    id: 'features',
    coreKeywords: ['features', 'feature', 'capabilities', 'tools', 'dashboard', 'analytics', 'calculator'],
    keywords: ['track', 'expectancy', 'winrate', 'heatmap', 'streaks', 'goals', 'csv'],
    phrases: ['all features', 'what features', 'what can i track'],
    question: 'What features does RiskRule have?',
    answer:
      'RiskRule puts **6 rooms** in one synced workspace:\n\n' +
      '1. **Dashboard** — net P&L, win rate, discipline, green/red calendar\n' +
      '2. **Trades & Analytics** — net P&L after charges, setup expectancy, hourly leaks\n' +
      '3. **Daily Journal** — bias, levels, watchlist, reflection, mood\n' +
      '4. **Rules & Goals** — daily loss limit, max trades/day, habit streaks\n' +
      '5. **Markets, News & Flow** — live quotes, triaged news, Nifty/Bank Nifty option-chain Flow\n' +
      '6. **Lunar AI** — behavioral review coach\n\n' +
      '→ [Explore every feature](/features)',
    followUps: ['Show me pricing', 'Tell me about Lunar AI', 'What is Flow option chain?'],
    showInSuggestions: true,
  },
  {
    id: 'get-started',
    coreKeywords: ['start', 'signup', 'register', 'join', 'onboard', 'login', 'signin'],
    keywords: ['started', 'begin', 'create', 'account', 'try', 'demo', 'how'],
    phrases: ['get started', 'sign up', 'log in', 'sign in', 'create account'],
    question: 'How do I get started?',
    answer:
      'You can be set up in under 2 minutes:\n\n' +
      '1. **[Create a free account](/signup)** — no credit card required\n' +
      '2. **Connect Dhan, Angel One, or Delta Exchange** (or log trades manually)\n' +
      '3. **Set your trading rules** (daily loss limit, max trades/day, window)\n' +
      '4. **Review your sessions** in Analytics & **Lunar AI**\n\n' +
      '→ [Start free now](/signup)',
    followUps: ['Which brokers are supported?', 'Show me pricing'],
    showInSuggestions: true,
  },
  {
    id: 'referrals',
    coreKeywords: ['referral', 'referrals', 'affiliate', 'commission', 'refer', 'earn'],
    keywords: ['link', 'share', 'payout', 'partner'],
    phrases: ['affiliate program', 'refer a friend', 'earn commission'],
    question: 'Do you have a referral program?',
    answer:
      'Yes! RiskRule has a built-in **Referral / Affiliate program**.\n\n' +
      'Share your referral link from inside your account and track signups, upgrades, and commissions.\n\n' +
      '→ [Create an account to get your link](/signup)',
    followUps: ['Show me pricing', 'How do I get started?'],
    showInSuggestions: false,
  },
];

/* ── Smart weighted + typo-tolerant matcher ─────────────────────── */

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'could', 'do',
  'does', 'for', 'from', 'get', 'have', 'how', 'i', 'if', 'in', 'into', 'is',
  'it', 'its', 'me', 'my', 'of', 'on', 'or', 'our', 'please', 'should', 'so',
  'some', 'tell', 'that', 'the', 'their', 'there', 'these', 'they', 'this',
  'to', 'us', 'want', 'was', 'we', 'what', 'when', 'where', 'which', 'who',
  'why', 'will', 'with', 'would', 'you', 'your', 'riskrule',
]);

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Bounded Levenshtein distance for lightweight typo tolerance. */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 99;
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[b.length];
}

function tokenMatchesKeyword(token: string, keyword: string): number {
  if (token === keyword) return 1;
  // Safe prefix match only for longer roots (prevents "hi" matching "which" or "in" matching "pricing")
  if (token.length >= 4 && keyword.length >= 4) {
    if (keyword.startsWith(token) || token.startsWith(keyword)) return 0.75;
  }
  // Typo tolerance: 1 edit for >=4 chars, 2 edits for >=7 chars
  const maxDist = token.length >= 7 && keyword.length >= 7 ? 2 : token.length >= 4 && keyword.length >= 4 ? 1 : 0;
  if (maxDist > 0 && editDistance(token, keyword) <= maxDist) {
    return 0.7;
  }
  return 0;
}

export interface MatchResult {
  entry: KnowledgeEntry | null;
  confidence: number;
  relatedQuestions: string[];
}

export function matchKnowledge(query: string): MatchResult {
  const normalized = normalizeText(query);
  const tokens = normalized.split(' ').filter(Boolean);
  const meaningfulTokens = tokens.filter((t) => !STOP_WORDS.has(t));
  const searchTokens = meaningfulTokens.length > 0 ? meaningfulTokens : tokens;

  const scored: { entry: KnowledgeEntry; score: number }[] = [];

  for (const entry of knowledgeBase) {
    // 1. Exact question click/match
    if (normalizeText(entry.question) === normalized) {
      return {
        entry,
        confidence: 100,
        relatedQuestions: entry.followUps || quickReplies.slice(0, 3),
      };
    }

    let score = 0;

    // 2. Multi-word phrase matches (+6 each)
    if (entry.phrases) {
      for (const phrase of entry.phrases) {
        if (normalized.includes(phrase)) {
          score += 6;
        }
      }
    }

    // 3. Weighted word matches (best match per user token)
    for (const token of searchTokens) {
      let tokenBest = 0;
      for (const kw of entry.coreKeywords) {
        const m = tokenMatchesKeyword(token, kw);
        if (m > 0) tokenBest = Math.max(tokenBest, 4 * m);
      }
      for (const kw of entry.keywords) {
        const m = tokenMatchesKeyword(token, kw);
        if (m > 0) tokenBest = Math.max(tokenBest, 2 * m);
      }
      score += tokenBest;
    }

    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  const top = scored[0];
  const suggestions = scored
    .filter((s) => s.entry.showInSuggestions !== false)
    .slice(0, 3)
    .map((s) => s.entry.question);

  if (!top) {
    return {
      entry: null,
      confidence: 0,
      relatedQuestions: quickReplies.slice(0, 4),
    };
  }

  return {
    entry: top.entry,
    confidence: top.score,
    relatedQuestions:
      top.entry.followUps ||
      (suggestions.length > 0 ? suggestions : quickReplies.slice(0, 3)),
  };
}

export function buildFallbackAnswer(query: string, relatedQuestions: string[]): string {
  const shortQuery = query.trim().slice(0, 60);
  const topicBullets = relatedQuestions.map((q) => `- **${q}**`).join('\n');

  return (
    `I didn't find an exact match for *"${shortQuery}"*, but you can tap one of these related topics or check the full FAQ:\n\n` +
    `${topicBullets}\n\n` +
    `→ [Browse the full FAQ](/faq) or [Start free](/signup)`
  );
}
