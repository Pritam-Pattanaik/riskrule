# Frontend

**RiskRule Platform — Frontend Architecture, Design System & UI/UX Specification**
**Document ID:** FE-001
**Version:** 2.0
**Status:** Active

---

## Table of Contents

1. [Frontend Philosophy](#1-frontend-philosophy)
2. [Technology Stack](#2-technology-stack)
3. [Design System](#3-design-system)
4. [Component Architecture](#4-component-architecture)
5. [State Management](#5-state-management)
6. [Routing Structure](#6-routing-structure)
7. [UI/UX Specification](#7-uiux-specification)
8. [Keyboard Shortcuts & Accessibility](#8-keyboard-shortcuts--accessibility)
9. [Animation Standards](#9-animation-standards)
10. [Performance Standards](#10-performance-standards)

---

## 1. Frontend Philosophy

**Premium, High-Density, Low-Noise.**

RiskRule is designed for professional traders who demand speed, visual clarity, and zero distractions. The interface draws inspiration from **Linear, Bloomberg Terminal, and Claude**.

- **Dark-mode optimized** — Calm, typography-driven aesthetic reduces decision fatigue.
- **Keyboard-First** — Every critical action accessible within 2 clicks or a shortcut.
- **Information Density** — Charts, PnL, and news visible simultaneously without scrolling.
- **Zero Friction** — Friction in journaling leads to skipped entries and data corruption.

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 18.x |
| Build Tool | Vite | 6.x |
| Language | TypeScript | 5.6 |
| Styling | Tailwind CSS | 3.x |
| Animations | Framer Motion | 12.x |
| State Management | Zustand | 5.x |
| Routing | React Router | v6 |
| Charts | Recharts + Lightweight Charts | 2.x / 4.x |
| Data Fetching | TanStack React Query | 5.x |
| Icons | Lucide React | 0.468+ |
| UI Primitives | Radix UI | Various |
| Markdown Rendering | react-markdown + remark-gfm | 10.x / 4.x |
| Notifications | Sonner | 2.x |
| Command Palette | cmdk | 1.x |

---

## 3. Design System

### Typography

| Token | Font | Usage |
|---|---|---|
| `font-display` | Bricolage Grotesque | Headings, hero text |
| `font-sans` | Geist Sans | Body text, UI labels |
| `font-mono` | DM Mono | Numbers, data, metrics, code |

### Color Tokens (CSS Variables)
```css
/* Surface layers */
--color-surface-0: #0a0a0f;      /* Page background */
--color-surface-1: #111118;      /* Card background */
--color-surface-2: #1a1a24;      /* Elevated card */
--color-surface-3: #22222f;      /* Hover state */

/* Semantic colors */
--color-primary: #6366f1;        /* Brand accent (indigo) */
--color-success: #22c55e;        /* Profit / Win */
--color-danger: #ef4444;         /* Loss / Error */
--color-warning: #f59e0b;        /* Caution / Pending */

/* Text */
--color-text-primary: #f1f5f9;
--color-text-secondary: #94a3b8;
--color-text-muted: #64748b;
```

### Responsive Strategy
- Mobile-first approach using Tailwind flex/grid.
- Perfect layout fidelity from 320px to 1920px.
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.

---

## 4. Component Architecture

```
src/components/
├── ai/                  # AI Coach workspace components
│   ├── AIChatWorkspace.tsx
│   ├── AICoachSidebar.tsx
│   ├── AIInsightsPanel.tsx
│   ├── AIMessage.tsx
│   ├── DisciplineCard.tsx
│   ├── EmptyWorkspace.tsx
│   ├── MessageTimestamp.tsx
│   ├── SmartInput.tsx
│   └── UserMessageBubble.tsx
├── dashboard/           # Dashboard widgets
├── flow/                # Flow / SSE visualization
├── journal/             # Journal form components
├── layout/              # Sidebar, Topbar, AppLayout
├── markets/             # Market intelligence center
│   ├── BreakingNewsTimeline.tsx
│   ├── DigestPanel.tsx
│   ├── EnhancedEconomicCalendar.tsx
│   ├── InteractiveMarketChart.tsx
│   ├── LiveAISummary.tsx
│   ├── LiveSectorHeatmap.tsx
│   ├── LiveWatchlist.tsx
│   ├── MarketBreadth.tsx
│   ├── MarketIntelligenceCenter.tsx
│   ├── MarketOverviewHero.tsx
│   └── NewsEngineFeed.tsx
├── notifications/       # Toast & notification system
├── settings/            # Settings panel components
├── trade/               # Trade table, forms, drawers
├── ui/                  # Generic design system atoms
│   ├── AsyncStateBoundary.tsx
│   ├── AuroraBackground.tsx
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── CommandPalette.tsx
│   ├── DisciplineRater.tsx
│   ├── EmptyState.tsx
│   ├── ErrorBoundary.tsx
│   ├── Input.tsx
│   ├── Logo.tsx
│   ├── MagneticButton.tsx
│   ├── Modal.tsx
│   ├── Motion.tsx
│   ├── PageLoadingFallback.tsx
│   ├── Skeleton.tsx
│   ├── SkeletonLoader.tsx
│   ├── Table.tsx
│   └── Tooltip.tsx
├── admin/               # Admin dashboard components
└── marketing/           # Marketing / landing pages
```

---

## 5. State Management

Zustand is used for global state with atomic stores. Each store owns a clear domain:

```typescript
// Example store pattern
interface TradeStore {
  trades: Trade[];
  isLoading: boolean;
  fetchTrades: () => Promise<void>;
  addTrade: (trade: NewTrade) => Promise<void>;
}
```

### Store Inventory
| Store | File | Domain |
|---|---|---|
| `authStore` | `authStore.ts` | JWT session, user profile |
| `tradeStore` | `tradeStore.ts` | Trade records, sync |
| `insightStore` | `insightStore.ts` | AI conversations, streaming |
| `newsStore` | `newsStore.ts` | News feed, engine data |
| `marketQuoteStore` | `marketQuoteStore.ts` | Live market quotes |
| `flowStore` | `flowStore.ts` | Flow / SSE state |
| `uiStore` | `uiStore.ts` | Theme, sidebar, command palette |
| `goalStore` | `goalStore.ts` | Goals & milestones |
| `journalStore` | `journalStore.ts` | Daily journal entries |
| `brokerStore` | `brokerStore.ts` | Broker connections |
| `notificationStore` | `notificationStore.ts` | Notifications |
| `analyticsStore` | `analyticsStore.ts` | Dashboard metrics cache |
| `strategyStore` | `strategyStore.ts` | Trading strategies |
| `noteStore` | `noteStore.ts` | Quick notes |
| `reflectionStore` | `reflectionStore.ts` | Post-market reflections |
| `tradingRulesStore` | `tradingRulesStore.ts` | Risk rule enforcement |

---

## 6. Routing Structure

```typescript
// src/App.tsx routing (React Router v6)
/                    → Redirects to /login or /app/dashboard
/login               → Authentication page
/app/dashboard       → Main dashboard (protected)
/app/trades          → Trade history & management
/app/journal         → Daily journal entries
/app/markets         → Market intelligence hub
/app/analytics       → Performance analytics
/app/ai-coach        → AI Coach workspace
/app/goals           → Goal tracking
/app/knowledge       → Knowledge vault
/app/strategies      → Trading strategies
/app/flow            → Flow visualization
/app/settings        → User settings
/app/system-health   → System monitoring
/admin               → Admin dashboard (role-protected)
```

---

## 7. UI/UX Specification

### AI Coach V2 Workspace Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Mode: General | Pre-Market | Post-Market | Trade | Journal | ...]    │
├────────────────────────────────────────────────────────────────────────┤
│ 🟢 Context Synced: 87 Trades • 30 Journals • Live Market: NIFTY 24,850 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [User Query Bubble] ─────────────────────────────────────────────►   │
│                                                                        │
│   ◄───────────────────── [AI Mentor Bubble with Structured Data]       │
│   [👍 Helpful] [👎] [📋 Copy] [🔄 Regenerate]                          │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────┐       │
│ │ Ask AI Coach... (Cmd + Enter to send)                [Stop]  │ [→]  │
│ └──────────────────────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────────────────────┘
```

### Known UI Defects (V2 Targets)

| Component | Defect | Impact | Fix |
|---|---|---|---|
| News Filter Pills | Dead UI — no filtering applied | High | Instant client-side filtering with count badges |
| Delete Session | Native `confirm()` modal | High | Custom glassmorphic `ConfirmModal` with 5s undo |
| Session Rename | Modal dialog popup | Medium | Inline click-to-edit input |
| Session Restore | Blank empty state on refresh | High | Auto-restore `lastActiveConversationId` |
| Context Synced | Static text | Medium | Real-time indicator: `87 Trades • 30 Journals • Live` |
| Feedback Buttons | No `onClick` handlers | Medium | Visual feedback + backend persistence |
| Interactive Cards | `<div onClick>` without ARIA | Medium | `role="button"`, `tabIndex={0}`, `Enter` key |

---

## 8. Keyboard Shortcuts & Accessibility

| Shortcut | Action | Scope |
|---|---|---|
| `Cmd/Ctrl + N` | Create New AI Coach Session | Global |
| `Cmd/Ctrl + K` | Open Command Palette | Global |
| `Cmd/Ctrl + Enter` | Submit Chat Message | AI Workspace |
| `Escape` | Abort Generation / Close Modals | AI Workspace |
| `Arrow Up/Down` | Navigate Sidebar Sessions | AI Sidebar |
| `Enter` | Select Focused Conversation | AI Sidebar |

### Accessibility Standards
- All interactive `<div>` elements must have `role="button"` and `tabIndex={0}`.
- `Enter` key must trigger the same action as `onClick`.
- Minimum contrast ratio: 4.5:1 for text on backgrounds.
- All form fields must have associated `<label>` elements.

---

## 9. Animation Standards

All animations use **Framer Motion**. Adhere to these standards:

| Animation | Duration | Easing | When |
|---|---|---|---|
| Page transitions | 300ms | `easeOut` | Route changes |
| Modal open/close | 200ms | `easeInOut` | Modal state change |
| Streaming tokens | 150ms fade-in | `linear` | AI response tokens |
| Hover states | 100ms | `easeOut` | All interactive elements |
| Mode pill indicator | 200ms slide | `spring(stiffness: 400)` | Mode selection |
| Session item actions | 100ms fade | `easeOut` | Sidebar hover |

**Rule:** Never use `transition` without specifying `duration`. Never animate layout properties that trigger reflow (`width`, `height`); prefer `transform` and `opacity`.

---

## 10. Performance Standards

| Metric | Target |
|---|---|
| Time to First Render (cold) | < 1.5s |
| Time to Interactive | < 2.5s |
| Render Frame Rate | Constant 60fps |
| Skeleton flash duration | < 150ms |
| Zustand re-render scope | Atomic — never trigger full tree re-render |

### Performance Patterns
- **Memoization:** Expensive PnL calculations wrapped in `useMemo`.
- **Optimistic UI:** Chat messages appended before server acknowledgment.
- **Store Initialization:** If store holds `> 0` items on mount, set `loading: false` immediately.
- **Large Lists:** Virtualize trade history lists > 100 items.
- **Code Splitting:** Pages are lazy-loaded via `React.lazy()`.

---

*See [Architecture.md](./Architecture.md) for the system topology. See [AI.md](./AI.md) for the AI Coach specification.*
