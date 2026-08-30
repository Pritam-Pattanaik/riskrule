/**
 * AIRouter — Intelligent Task-to-Provider Router
 *
 * This is the single decision layer for ALL AI calls in RiskRule.
 * Business logic must NEVER hardcode "use groq" or "use nemotron".
 * Instead it calls AIRouter.route(task) which returns the provider key.
 *
 * Current providers:
 *   FAST  → Grok     (conversational, low-latency)
 *   DEEP  → Nemotron (complex reasoning, long-form analysis)
 *
 * Future migration path (no business logic change required):
 *   Change DEEP_PROVIDER env var: nemotron → minimax
 *   Add MiniMaxProvider class implementing AIProvider interface
 *   Done — all deep tasks automatically use MiniMax
 */

import { logger } from '../logger';

// ─── Task Types ───────────────────────────────────────────────────────────────

/**
 * Every AI call in RiskRule must have a TaskType.
 * Add new task types here as new features are built — never route by guessing.
 */
export type TaskType =
  // ── Fast Tasks (Grok) ──────────────────────────────────────────────────────
  | 'coach_chat_general'        // General Q&A, greetings, explanations
  | 'coach_chat_psychology'     // Emotional support, quick mindset check
  | 'coach_chat_risk'           // Quick risk questions in-trade
  | 'coach_report_daily'        // Daily review (narrow scope)
  | 'trade_evaluation'          // Single-trade discipline JSON
  | 'title_generation'          // Conversation title (20 tokens)
  | 'news_triage'               // Classify article relevance (high volume)
  | 'dashboard_insights'        // Quick dashboard widget summaries

  // ── Deep Tasks (Nemotron → future MiniMax) ─────────────────────────────────
  | 'coach_chat_premarket'      // Morning session briefing
  | 'coach_chat_postmarket'     // End-of-day debrief
  | 'coach_chat_performance'    // Multi-metric P&L deep analysis
  | 'coach_chat_strategy'       // Multi-session setup analysis
  | 'coach_report_weekly'       // Weekly structured report
  | 'coach_report_monthly'      // Monthly comprehensive report
  | 'market_summary'            // AI-generated market overview
  | 'news_scoring'              // Sector-level impact analysis
  | 'news_digest'               // Multi-item digest generation
  | 'nifty_analysis'            // Deep NIFTY multi-session analysis
  | 'banknifty_analysis'        // Deep BANKNIFTY analysis
  | 'option_chain_analysis'     // OI/PCR/max-pain interpretation
  | 'sector_analysis'           // Sector rotation narratives
  | 'institutional_analysis'    // FII/DII interpretation
  | 'psychology_deep'           // Multi-session behavioral pattern reports

  // ── Generic fallback ───────────────────────────────────────────────────────
  | 'unknown';                  // Falls through to fast provider (safe default)

// ─── Provider Keys ───────────────────────────────────────────────────────────

export type ProviderKey = 'fast' | 'deep';

// ─── Routing Decision ─────────────────────────────────────────────────────────

export interface RoutingDecision {
  provider: ProviderKey;
  reason: string;
  taskType: TaskType;
}

// ─── Task Descriptor ─────────────────────────────────────────────────────────

export interface TaskDescriptor {
  taskType: TaskType;
  /** Optional: chat mode (psychology, risk, premarket, etc.) for coach_chat tasks */
  mode?: string;
  /** Optional: message text used for complexity-signal detection */
  messageText?: string;
  /** Optional: force a specific provider (for admin/testing only) */
  forceProvider?: ProviderKey;
}

// ─── Complexity Keywords → triggers deep provider even in fast-mode chats ─────

const DEEP_KEYWORDS: readonly string[] = [
  'complete analysis', 'full analysis', 'detailed report', 'deep dive',
  'nifty', 'banknifty', 'bank nifty', 'finnifty', 'fin nifty',
  'option chain', 'open interest', 'oi analysis', 'oi interpretation',
  'pcr', 'put call ratio', 'max pain',
  'weekly report', 'monthly report', 'weekly analysis', 'monthly analysis',
  'last 10 sessions', 'last 5 sessions', 'multi session', 'multi-session',
  'institutional', 'fii', 'dii', 'sector analysis', 'sector rotation',
  'market structure', 'pre-market analysis', 'post-market analysis',
  'performance report', 'strategy review', 'drawdown analysis',
  'expectancy', 'profit factor analysis', 'behavioral report',
];

// ─── Mode → Task Type Mapping ─────────────────────────────────────────────────

const MODE_TASK_MAP: Record<string, TaskType> = {
  psychology:  'coach_chat_psychology',
  risk:        'coach_chat_risk',
  premarket:   'coach_chat_premarket',
  postmarket:  'coach_chat_postmarket',
  performance: 'coach_chat_performance',
  strategy:    'coach_chat_strategy',
  general:     'coach_chat_general',
  journal:     'coach_chat_general',
};

// ─── Static Routing Table ─────────────────────────────────────────────────────

const FAST_TASKS = new Set<TaskType>([
  'coach_chat_general',
  'coach_chat_psychology',
  'coach_chat_risk',
  'coach_report_daily',
  'trade_evaluation',
  'title_generation',
  'news_triage',
  'dashboard_insights',
  'unknown',
]);

const DEEP_TASKS = new Set<TaskType>([
  'coach_chat_premarket',
  'coach_chat_postmarket',
  'coach_chat_performance',
  'coach_chat_strategy',
  'coach_report_weekly',
  'coach_report_monthly',
  'market_summary',
  'news_scoring',
  'news_digest',
  'nifty_analysis',
  'banknifty_analysis',
  'option_chain_analysis',
  'sector_analysis',
  'institutional_analysis',
  'psychology_deep',
]);

// ─── AIRouter ─────────────────────────────────────────────────────────────────

export class AIRouter {
  /**
   * Main routing function. Call this from every AI entry point.
   *
   * @example
   * const decision = AIRouter.route({ taskType: 'coach_chat_premarket', mode: 'premarket' });
   * // decision.provider === 'deep'
   */
  static route(task: TaskDescriptor): RoutingDecision {
    // Layer 1: Explicit override (admin/testing only)
    if (task.forceProvider) {
      return {
        provider: task.forceProvider,
        reason: 'explicit_override',
        taskType: task.taskType,
      };
    }

    // Layer 2: Resolve actual task type for coach_chat with a mode
    const resolvedTask = this.resolveCoachChatMode(task);

    // Layer 3: Complexity signal detection — runs BEFORE static table for chat tasks.
    // A deep keyword in ANY chat message escalates to the deep provider,
    // regardless of which fast mode was detected.
    if (task.messageText && this.isCoachChatTask(resolvedTask)) {
      const lowerMsg = task.messageText.toLowerCase();
      const matchedKeyword = DEEP_KEYWORDS.find(kw => lowerMsg.includes(kw));
      if (matchedKeyword) {
        return {
          provider: 'deep',
          reason: `complexity_signal:${matchedKeyword}`,
          taskType: resolvedTask,
        };
      }
    }

    // Layer 4: Static routing table lookup
    if (FAST_TASKS.has(resolvedTask)) {
      return { provider: 'fast', reason: `static_table:${resolvedTask}`, taskType: resolvedTask };
    }

    if (DEEP_TASKS.has(resolvedTask)) {
      return { provider: 'deep', reason: `static_table:${resolvedTask}`, taskType: resolvedTask };
    }

    // Layer 5: Safe default — fast provider
    return { provider: 'fast', reason: 'safe_default', taskType: resolvedTask };
  }

  /**
   * Resolves a generic 'coach_chat_*' task type from the detected mode string.
   * Maps 'premarket' → 'coach_chat_premarket', etc.
   */
  private static resolveCoachChatMode(task: TaskDescriptor): TaskType {
    if (!task.mode) return task.taskType;

    const mapped = MODE_TASK_MAP[task.mode.toLowerCase()];
    if (mapped) return mapped;

    // Unknown mode falls back to the original task type
    return task.taskType;
  }

  /**
   * Returns true for any coach_chat_* task where complexity signals should be checked.
   * This prevents deep keywords from affecting non-chat tasks like title_generation.
   */
  private static isCoachChatTask(taskType: TaskType): boolean {
    return taskType.startsWith('coach_chat_');
  }

  /**
   * Infer TaskType from the [REPORTS] prefix used in promptBuilder.ts
   * so report routing works transparently.
   */
  static inferReportTaskType(message: string): TaskType | null {
    if (!message.includes('[REPORTS]')) return null;
    if (message.includes('Weekly Review')) return 'coach_report_weekly';
    if (message.includes('Monthly Review')) return 'coach_report_monthly';
    if (message.includes('Daily Review')) return 'coach_report_daily';
    return 'coach_report_daily'; // default report = fast
  }

  /**
   * Convenience logger — call this after routing to emit structured routing log.
   */
  static logDecision(decision: RoutingDecision, extras?: { latencyMs?: number; success?: boolean }) {
    logger.info(
      `[AIRouter] task=${decision.taskType} → provider=${decision.provider} | reason=${decision.reason}` +
      (extras?.latencyMs !== undefined ? ` | latency=${extras.latencyMs}ms` : '') +
      (extras?.success !== undefined ? ` | success=${extras.success}` : '')
    );
  }
}
