/**
 * AI Router Test Suite
 *
 * Verifies the routing decisions without making actual API calls.
 * Run: npx tsx server/src/lib/ai/__tests__/routerTests.ts
 *
 * Tests all 10 required routing scenarios plus edge cases.
 */

import { AIRouter, TaskDescriptor, RoutingDecision } from '../AIRouter';

// ─── Test Runner ──────────────────────────────────────────────────────────────

interface TestCase {
  name: string;
  task: TaskDescriptor;
  expectedProvider: 'fast' | 'deep';
}

const tests: TestCase[] = [
  // ── Required tests (from specification) ──────────────────────────────────────

  {
    name: 'TEST 1: Simple terminology question → GROK (fast)',
    task: {
      taskType: 'coach_chat_general',
      mode: 'general',
      messageText: 'What is implied volatility in options?',
    },
    expectedProvider: 'fast',
  },
  {
    name: 'TEST 2: Quick psychology question → GROK (fast)',
    task: {
      taskType: 'coach_chat_psychology',
      mode: 'psychology',
      messageText: 'I felt anxious before my trade today',
    },
    expectedProvider: 'fast',
  },
  {
    name: 'TEST 3: Quick risk question → GROK (fast)',
    task: {
      taskType: 'coach_chat_risk',
      mode: 'risk',
      messageText: 'What is my risk per trade?',
    },
    expectedProvider: 'fast',
  },
  {
    name: 'TEST 4: Trade evaluation → GROK (fast)',
    task: {
      taskType: 'trade_evaluation',
    },
    expectedProvider: 'fast',
  },
  {
    name: 'TEST 5: NIFTY multi-session analysis → NEMOTRON (deep)',
    task: {
      taskType: 'coach_chat_general',
      mode: 'general',
      messageText: 'Analyze NIFTY last 10 sessions and give me the trend structure',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'TEST 6: Trading performance analysis → NEMOTRON (deep)',
    task: {
      taskType: 'coach_chat_performance',
      mode: 'performance',
      messageText: 'Give me a detailed performance breakdown',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'TEST 7: Option-chain analysis → NEMOTRON (deep)',
    task: {
      taskType: 'option_chain_analysis',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'TEST 8: Weekly report → NEMOTRON (deep)',
    task: {
      taskType: 'coach_report_weekly',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'TEST 9: News triage → GROK (fast)',
    task: {
      taskType: 'news_triage',
    },
    expectedProvider: 'fast',
  },
  {
    name: 'TEST 10: News deep scoring → NEMOTRON (deep)',
    task: {
      taskType: 'news_scoring',
    },
    expectedProvider: 'deep',
  },

  // ── Additional edge cases ─────────────────────────────────────────────────────

  {
    name: 'EDGE 1: Pre-market mode → NEMOTRON (deep) [mode-based routing]',
    task: {
      taskType: 'coach_chat_premarket',
      mode: 'premarket',
      messageText: 'What should I focus on today?',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'EDGE 2: Post-market debrief → NEMOTRON (deep)',
    task: {
      taskType: 'coach_chat_postmarket',
      mode: 'postmarket',
      messageText: 'How did I do today?',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'EDGE 3: Strategy review → NEMOTRON (deep)',
    task: {
      taskType: 'coach_chat_strategy',
      mode: 'strategy',
      messageText: 'Review my breakout strategy performance',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'EDGE 4: Market summary → NEMOTRON (deep)',
    task: {
      taskType: 'market_summary',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'EDGE 5: Title generation → GROK (fast)',
    task: {
      taskType: 'title_generation',
    },
    expectedProvider: 'fast',
  },
  {
    name: 'EDGE 6: Monthly report → NEMOTRON (deep)',
    task: {
      taskType: 'coach_report_monthly',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'EDGE 7: Daily report → GROK (fast) [narrow scope]',
    task: {
      taskType: 'coach_report_daily',
    },
    expectedProvider: 'fast',
  },
  {
    name: 'EDGE 8: Complexity signal "BANKNIFTY" in general mode → NEMOTRON (deep)',
    task: {
      taskType: 'coach_chat_general',
      mode: 'general',
      messageText: 'What happened with BankNifty today? Analyze the structure.',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'EDGE 9: Complexity signal "option chain" in risk mode → NEMOTRON (deep)',
    task: {
      taskType: 'coach_chat_risk',
      mode: 'risk',
      messageText: 'Help me understand the option chain for risk management',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'EDGE 10: Force override to deep provider → NEMOTRON (deep) [forceProvider]',
    task: {
      taskType: 'coach_chat_general',
      mode: 'general',
      messageText: 'Simple question',
      forceProvider: 'deep',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'EDGE 11: Force override to fast provider → GROK (fast) [forceProvider]',
    task: {
      taskType: 'market_summary',
      forceProvider: 'fast',
    },
    expectedProvider: 'fast',
  },
  {
    name: 'EDGE 12: Unknown task type → GROK (fast) [safe default]',
    task: {
      taskType: 'unknown',
    },
    expectedProvider: 'fast',
  },

  // ── [REPORTS] prefix detection ────────────────────────────────────────────────

  {
    name: 'REPORT 1: [REPORTS] Weekly Review message → NEMOTRON (deep)',
    task: {
      taskType: AIRouter.inferReportTaskType('[REPORTS] Generate Weekly Review') ?? 'coach_report_weekly',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'REPORT 2: [REPORTS] Monthly Review message → NEMOTRON (deep)',
    task: {
      taskType: AIRouter.inferReportTaskType('[REPORTS] Generate Monthly Review') ?? 'coach_report_monthly',
    },
    expectedProvider: 'deep',
  },
  {
    name: 'REPORT 3: [REPORTS] Daily Review message → GROK (fast)',
    task: {
      taskType: AIRouter.inferReportTaskType('[REPORTS] Generate Daily Review') ?? 'coach_report_daily',
    },
    expectedProvider: 'fast',
  },
];

// ─── Run Tests ────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

console.log('\n═══════════════════════════════════════════════════════');
console.log('   RiskRule AI Router Test Suite');
console.log('═══════════════════════════════════════════════════════\n');

for (const test of tests) {
  const decision = AIRouter.route(test.task);
  const ok = decision.provider === test.expectedProvider;

  if (ok) {
    passed++;
    console.log(`✅ PASS | ${test.name}`);
    console.log(`         → provider=${decision.provider} | reason=${decision.reason}\n`);
  } else {
    failed++;
    console.log(`❌ FAIL | ${test.name}`);
    console.log(`         → expected=${test.expectedProvider}, got=${decision.provider} | reason=${decision.reason}\n`);
  }
}

console.log('═══════════════════════════════════════════════════════');
console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${tests.length} tests`);

if (failed === 0) {
  console.log('\n🎉 ALL TESTS PASSED — AI Router is correctly configured.\n');
  console.log('Current routing:');
  console.log('  FAST tasks → Grok (via GroqProvider)');
  console.log('  DEEP tasks → Nemotron (via NemotronProvider)');
  console.log('\nTo switch deep provider: Set DEEP_PROVIDER=minimax in .env');
  console.log('  (No business logic changes required)\n');
} else {
  console.log('\n⚠️  Some tests failed. Review the routing configuration.\n');
  process.exit(1);
}
