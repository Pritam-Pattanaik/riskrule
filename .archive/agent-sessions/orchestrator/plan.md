# TradeVault Frontend Redesign Implementation Plan

This document outlines the detailed roadmap for the frontend redesign of the TradeVault SaaS application, mapping chandan/ specification documents to 15 sequential milestones.

## Architecture & Code Layout
- **Vite React SPA Frontend**: Built using React 18, Vite 6, TypeScript, Tailwind CSS 3.
- **Backend (Express.js)**: Exists in `server/`. **STRICTLY IMMUTABLE** — do not modify any files inside `server/`.
- **Existing styling**: CSS variables in `src/index.css` + Tailwind utilities. Must replace all glassmorphism effects, heavy shadows, and arbitrary transforms with the clean, structured design tokens.
- **Font Replacement**: Replace Outfit + JetBrains Mono with self-hosted Geist Sans + Geist Mono.
- **Zustand stores** (`src/stores/`), API client (`src/lib/api.ts`), and types (`src/types/index.ts`) are **STRICTLY IMMUTABLE** — only consume their data.

---

## Milestones

| Milestone | Name | Objective | Target Files | Dependencies | Status |
|-----------|------|-----------|--------------|--------------|--------|
| **M1** | Global Design Tokens | Define all custom CSS variables in `index.css` & extend Tailwind theme. | `src/index.css`, `tailwind.config.js` | None | PLANNED |
| **M2** | Typography | Install Geist Sans/Mono, update base font sizes to 16px, enforce mono financial displays. | `src/index.css`, components with financial values | M1 | PLANNED |
| **M3** | Layout System | Structure sidebar (256px), header (56px), responsive drawer layout. | Sidebar, Header, layout wrappers | M1 | PLANNED |
| **M4** | Shared Components | Refactor Buttons, Inputs, Cards, Modals, Badges, Tables, Skeletons. Unify modals. | Components under `src/components/ui/` | M1, M2, M3 | PLANNED |
| **M5** | Landing & Marketing | Redesign public Home, About, Pricing pages. | Marketing pages, `MarketingLayout.tsx` | M4 | PLANNED |
| **M6** | Dashboard | Redesign KPI StatCard row, charts (PnL, Strategy, Discipline), recent trades. | `src/pages/Dashboard.tsx` & widgets | M4 | PLANNED |
| **M7** | Trading Module | Redesign Trades table, filter bar, detail/form modals, empty states. | `src/pages/Trades.tsx` & related components | M4, M6 | PLANNED |
| **M8** | Journal | Redesign Notion-like borderless journal editor & calendar sidebar. | `src/pages/Journal.tsx` | M4 | PLANNED |
| **M9** | AI Coach | Redesign chat bubbles, input bar, typing indicator, inline data cards, suggested prompts. | `src/pages/AICoach.tsx` | M4 | PLANNED |
| **M10** | Settings & Profile | Redesign settings vertical tabs/forms, strategies grid with sparklines. | `src/pages/Settings.tsx`, `src/pages/Strategies.tsx` | M4 | PLANNED |
| **M11** | Admin Pages | Redesign admin dashboard and other admin views (overview, logs, users, etc.). | `src/pages/admin/` & admin components | M4, M6 | PLANNED |
| **M12** | Motion System | Apply transition tokens, modals enter/exit, page fades, chart animations, reduced motion. | `src/index.css`, various components | M4 | PLANNED |
| **M13** | Accessibility Audit | Audit keyboard navigation, visible focus rings, ARIA roles, touch targets, WCAG AA contrast. | All components & pages | M1-M12 | PLANNED |
| **M14** | Responsive QA | Viewport layout testing (375px to 2560px), scrollbar fixing. | Layouts, pages | M1-M12 | PLANNED |
| **M15** | Final Premium Polish | Pixel-nudging, custom scrollbars, final sweeps of colors/radii/icons. | Project-wide | M1-M14 | PLANNED |

---

## Detailed Milestone Execution

### Milestone 1 — Global Design Tokens
- **Objective**: Establish the CSS custom property foundation that all subsequent phases depend on.
- **Details**: Define `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--z-*`, `--font-*`, `--text-*`, `--duration-*`, `--ease-*` CSS properties in `:root` and `.light` blocks inside `index.css`. Extend Tailwind config with these variables. Preserve old `--glass-*` variables temporarily as aliases to prevent style breaks.
- **Verification**: Check properties in browser DevTools. Toggle light mode to ensure overrides apply.

### Milestone 2 — Typography
- **Objective**: Replace Outfit with Geist Sans and JetBrains Mono with Geist Mono across the entire app.
- **Details**: Add self-hosted font-face declarations for Geist Sans/Mono. Set HTML font-size to 16px. Ensure tabular numbers are active on all numeric/financial columns.
- **Verification**: Verify no unstyled text, and verify tabular-nums in Trades and Dashboard tables.

### Milestone 3 — Layout System
- **Objective**: Implement global sidebar (256px) and header (56px) structure.
- **Details**: Implement Sidebar and Header sticky positioning, collapsible layout below 1024px, and mobile drawer.
- **Verification**: Drag screen width to test breakpoints and verify sidebar hides behind drawer on mobile.

### Milestone 4 — Shared Components
- **Objective**: Refactor UI library (Buttons, Inputs, Cards, Modals, Badges, Tables, Skeletons).
- **Details**: Standardize inputs, buttons (4 variants, 3 sizes), cards (1px flat border, no glass, no shadow), tables (sticky header, instant hover). Unify modal implementations. Remove all `--glass-*` variables.
- **Verification**: Verify states (hover/focus/active/disabled) and test esc-to-close on modals.

### Milestone 5 — Landing & Marketing Pages
- **Objective**: Update unauthenticated pages (Home, About, Pricing) to premium visual spec.
- **Details**: Typography updates, pricing card grid, highlight recommended tier with 2px accent border.
- **Verification**: Ensure margins, typography size, and mobile responsiveness.

### Milestone 6 — Dashboard
- **Objective**: Redesign the main dashboard.
- **Details**: KPI cards, PnL Curve, Recent Trades, Calendar Heatmap, Discipline Pie, Strategy Bar. Muted colors, minimal gridlines.
- **Verification**: Verify responsive dashboard layout, no chart visual anomalies.

### Milestone 7 — Trading Module
- **Objective**: Redesign the Trades page.
- **Details**: Dense trades table, filter bar, trade modals, empty states. Tabular numbers enforced.
- **Verification**: Ensure no layout regression, modal fields validation works correctly.

### Milestone 8 — Journal
- **Objective**: Redesign the journal editor page.
- **Details**: Borderless rich-text editor, Notion-like canvas, calendar sidebar.
- **Verification**: Validate saving and editing notes continues to function, layout feels clean and spacious.

### Milestone 9 — AI Coach
- **Objective**: Redesign the chat experience.
- **Details**: Conversation layout, chat bubbles, suggested prompt buttons, typing indicator, inline tables/data cards.
- **Verification**: Test scroll behavior, message alignment, loading state.

### Milestone 10 — Settings & Profile
- **Objective**: Redesign Settings tabs/forms and Strategies grid.
- **Details**: Two-column layout on desktop, horizontal scrollable tabs on mobile. Strategies with sparklines.
- **Verification**: Forms edit/save updates correctly, layout looks aligned.

### Milestone 11 — Admin Pages
- **Objective**: Refactor all 8 Admin views.
- **Details**: Dense layouts, system KPIs, users lists, broker syncing status, audit logs.
- **Verification**: Ensure data density, responsive adjustments, role-change functionality behaves correctly.

### Milestone 12 — Motion System
- **Objective**: Integrate animations (modals, dropdowns, transitions, page fades).
- **Details**: Transitions use the cubic-bezier tokens. Respect prefers-reduced-motion.
- **Verification**: Verify visual fluidness of transitions and check instant transitions when prefers-reduced-motion is active.

### Milestone 13 — Accessibility Audit
- **Objective**: Complete WCAG AA validation.
- **Details**: Keyboard focus indicators, screen reader labeling, semantic HTML structure.
- **Verification**: Run Lighthouse Accessibility audit (aim for >=98). Tab through application.

### Milestone 14 — Responsive QA
- **Objective**: Viewport and scrolling checks.
- **Details**: Check all pages at widths from 375px to 2560px.
- **Verification**: Ensure no horizontal scrollbars on body, layouts wrap correctly.

### Milestone 15 — Final Premium Polish
- **Objective**: Close remaining polish gaps.
- **Details**: mathematical alignment, custom thin scrollbars, selection colors, asset sweeps.
- **Verification**: Audit codebase for hardcoded CSS variables, verify complete visual consistency.
