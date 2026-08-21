# Scope: Milestone 1 — Global Design Tokens

## Objective
Establish the CSS custom property foundation that all subsequent phases depend on.

## Scope Details
- Define all `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--z-*`, `--font-*`, `--text-*`, `--duration-*`, `--ease-*` CSS custom properties in `:root` and `.light` blocks inside `src/index.css`.
- Use the design tokens defined in `chandan/01_Design_System.md` and `chandan/04_Motion_System.md`.
- Remove deprecated glassmorphism variables (`--glass-bg`, `--glass-border`, `--glass-shadow`, `--glass-bg-hover`, `--glass-shadow-hover`) but keep them as aliases temporarily to prevent visual breakdown of existing components before they are refactored in Phase 4.
- Update `tailwind.config.js` to reference the new CSS variables in the theme extension.
- Maintain existing functionality; no visual layout changes or compilation errors.

## Interface Contracts
None. This milestone sets up global design tokens.

## Code Layout
- `src/index.css` (primary changes)
- `tailwind.config.js` (theme extension)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Global Design Tokens | Define CSS custom properties and update Tailwind config | None | IN_PROGRESS |
