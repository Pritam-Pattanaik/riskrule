# Challenge Report — Milestone 1: Global Design Tokens

## Challenge Summary

**Overall risk assessment**: MEDIUM

Static analysis of the global design tokens implementation (`src/index.css` and `tailwind.config.js`) has revealed multiple design token violations, theme adaptation defects, and utility redundancies. While the core variables map correctly, the system breaks token integrity under theme switching (dark/light mode) due to hardcoded values.

---

## Challenges

### [Medium] Challenge 1: Hardcoded Color Values in Radial Gradient Backgrounds
- **Assumption challenged**: Background glow radial-gradients dynamically adapt to themed accent and success colors.
- **Attack scenario**: When a developer changes the theme or mode (dark to light), or overrides the branding color tokens, the background glow gradients do not update dynamically because they hardcode dark mode colors (`rgba(99, 102, 241, ...)` and `rgba(16, 185, 129, ...)`).
- **Blast radius**: Visual mismatch in light mode, where the background glow uses dark mode's Indigo-500 instead of light mode's Indigo-600, leading to poor contrast and theme pollution.
- **Mitigation**: Update `src/index.css` body backgrounds to reference variables dynamically:
  - Dark mode: `rgba(var(--color-accent) / 0.06)` and `rgba(var(--color-success) / 0.04)`
  - Light mode: `rgba(var(--color-accent) / 0.03)` and `rgba(var(--color-success) / 0.02)`

### [Medium] Challenge 2: Hardcoded Input Background in Light Mode
- **Assumption challenged**: The input background is governed by design tokens.
- **Attack scenario**: In `src/index.css`, `.light .input-base` hardcodes its background to `rgba(255, 255, 255, 0.8)` and focus state background to `rgba(255, 255, 255, 1)` instead of referencing `rgba(var(--color-surface) / 0.8)` or `rgb(var(--color-surface))`.
- **Blast radius**: If the surface color is adjusted in the future to a non-pure-white shade, inputs will remain hardcoded to white, breaking visual alignment.
- **Mitigation**: Update `.light .input-base` to use themed variables:
  `background: rgba(var(--color-surface) / 0.8);`
  and focus state:
  `background: rgb(var(--color-surface));`

### [Low-Medium] Challenge 3: Hardcoded Gradient End-Points
- **Assumption challenged**: Profit and loss text gradients dynamically adjust contrast depending on theme colors.
- **Attack scenario**: In `.text-gradient-profit` and `.text-gradient-loss`, the end color is hardcoded to `#34d399` (Emerald 400) and `#fb7185` (Rose 400).
- **Blast radius**: In light mode, the start color is Emerald 600/Rose 600, but the gradient will fade to Emerald 400/Rose 400. This results in less cohesive gradients and potentially poor text readability.
- **Mitigation**: Introduce dynamic tokens for gradient endpoints or define gradient utility colors inside `tailwind.config.js` to ensure consistency.

### [Low] Challenge 4: Inconsistent Syntax for Subtle Color in Light Mode
- **Assumption challenged**: Subtle semantic tokens are mapped consistently using variable references.
- **Attack scenario**: `--color-warning-subtle` in light mode is defined as `rgba(217, 119, 6, 0.08)` (hardcoded coordinates), whereas success and danger subtle tokens are mapped using variables: `rgba(var(--color-success) / 0.08)`.
- **Blast radius**: Visual consistency is maintained (as the coordinates match `--color-warning`), but maintainability is reduced if `--color-warning` changes.
- **Mitigation**: Define `--color-warning-subtle` in light mode as `rgba(var(--color-warning) / 0.08);`.

---

## Stress Test Results

- **Dynamic Theme Glow Test** → Changing `--color-accent` token in light mode should update the body background gradient → **FAIL** (Radial glow retains hardcoded dark-mode coordinates `rgba(99, 102, 241, ...)`).
- **Surface Color Adaptability Test** → Modifying `--color-surface` in light mode should update input-base background → **FAIL** (Input background remains hardcoded to `255,255,255`).
- **Build Compilation Check** → Run build commands statically → **N/A** (Command execution timed out due to lack of active user approval, but static parsing confirms valid Tailwind & PostCSS structures).

---

## Unchallenged Areas

- **Tailwind class generation in HTML/JS components** — Reason: Component file usage was only scanned, not fully stress-tested in context, as the focus is solely on the global CSS file and configuration.
