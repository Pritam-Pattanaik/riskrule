# Challenge Report: Milestone 1 - Global Design Tokens

## Challenge Summary

**Overall risk assessment**: CRITICAL

The global design tokens implementation contains critical syntax errors and configuration omissions that will prevent the application from rendering correct colors, shadows, and typography. The most severe issue is the syntactically invalid use of space-separated RGB variables within comma-separated `rgba()` color functions, which will cause modern browsers to discard color styles for major UI components (buttons, input states, scrollbars, profit/loss highlights, cards). Additionally, the required Geist typography is not loaded, and legacy shadow variables are missing.

---

## Challenges

### [Critical] Challenge 1: Syntactically Invalid CSS for Translucent Colors (Separator Mismatch)

- **Assumption challenged**: Space-separated RGB CSS variables (e.g., `99 102 241` for `--color-accent`) can be combined with a comma-separated alpha channel inside standard `rgba()` calls.
- **Attack scenario**:
  - In `tailwind.config.js`, several mappings are defined like:
    `dim: 'rgba(var(--color-accent), 0.15)'`
  - In `index.css`, several utility styles are defined like:
    `background: rgba(var(--color-profit), 0.1);`
    `background: rgba(var(--color-surface), 0.5);`
    `background: rgba(var(--color-border), 0.4);`
  - At runtime, the browser parses the values. For instance, `rgba(var(--color-accent), 0.15)` resolves to `rgba(99 102 241, 0.15)`.
  - Under CSS Color Module Level 4 specifications, mixing space-separated coordinates with a comma-separated alpha argument is illegal. The color function is syntactically invalid, and browsers discard the entire CSS rule.
- **Blast radius**:
  - **All translucent states and interactive elements will be broken/transparent**:
    - **Buttons & Badges**: `.badge-win`, `.badge-loss`, `.badge-breakeven`, `.badge-accent` backgrounds and borders.
    - **Interactive States**: `.filter-pill:hover`, `.input-base:focus` box-shadows.
    - **Borders & Dividers**: `tv-border.DEFAULT`, `tv-border.bright`, `tv-border.active`.
    - **Scrollbars**: Custom scrollbar thumb (`::-webkit-scrollbar-thumb`).
    - **Accent & Semantic Colors**: `accent.dim`, `profit.dim`, `profit.border`, `loss.dim`, `loss.border`, `gold.dim`, `gold.border`.
- **Mitigation**:
  - Rewrite all mixed separator color declarations to use the standard slash-separated format:
    - In `tailwind.config.js`:
      `dim: 'rgb(var(--color-accent) / 0.15)'`
      `dim: 'rgb(var(--color-profit) / 0.08)'`
      `border: 'rgb(var(--color-profit) / 0.25)'`
    - In `index.css`:
      `background: rgba(var(--color-surface) / 0.5);`
      `background: rgba(var(--color-border) / 0.4);`
      `background: rgba(var(--color-profit) / 0.1);`

---

### [High] Challenge 2: Complete Omission of Geist Font Loading and Body Font Mismatch

- **Assumption challenged**: The design system uses Geist Sans and Geist Mono, assuming they are loaded and applied as the default fonts.
- **Attack scenario**:
  - There is no `@import` statement loading Geist fonts in `index.css` (only `Outfit` and `JetBrains Mono` are imported).
  - There is no `<link>` tag loading them in `index.html`.
  - The `body` selector in `index.css` explicitly hardcodes `font-family: 'Outfit', sans-serif;` rather than referencing `var(--font-sans)`.
- **Blast radius**:
  - The browser will fail to render the specified Geist typography and fall back to system default fonts.
  - The entire app's body text will continue to render using the legacy `Outfit` font, ignoring the primary font specified in `redesign.md`.
- **Mitigation**:
  1. Add Geist Sans and Geist Mono font imports (e.g. from Google Fonts or local font files) to the top of `index.css`.
  2. Update the `body` font-family declaration in `index.css` to use `var(--font-sans)` instead of `'Outfit'`.

---

### [Medium] Challenge 3: Mapped Tailwind Shadow Variables Undefined in CSS

- **Assumption challenged**: Neumorphic and glowing shadow effects (`neu`, `neu-sm`, `neu-pressed`, `neu-hover`, `glow-profit`, `glow-loss`) will render properly using `var(--shadow-dark)` and `var(--shadow-light)`.
- **Attack scenario**:
  - The `tailwind.config.js` box-shadow mappings use CSS variables:
    `'neu': '2px 2px 5px var(--shadow-dark), ...'`
  - However, `--shadow-dark` and `--shadow-light` are not declared in `index.css` in either `:root` or `.light`.
- **Blast radius**:
  - The browser cannot resolve `var(--shadow-dark)` and `var(--shadow-light)`. As a result, the entire shadow rule fails, and all neumorphic and glowing card/panel states will render completely flat (no depth).
- **Mitigation**:
  - Declare `--shadow-dark` and `--shadow-light` variables in `index.css` for both `:root` (dark mode) and `.light` (light mode).
  - For example:
    - `:root`: `--shadow-dark: rgba(0, 0, 0, 0.4); --shadow-light: rgba(255, 255, 255, 0.05);`
    - `.light`: `--shadow-dark: rgba(0, 0, 0, 0.1); --shadow-light: rgba(255, 255, 255, 0.8);`

---

### [Medium] Challenge 4: Animation Keyframe and Class Name Collisions

- **Assumption challenged**: Animation configurations in Tailwind config and `index.css` component layers can coexist without conflicting or causing selector override issues.
- **Attack scenario**:
  - `@keyframes slideUp` and `@keyframes fadeIn` are defined in both `tailwind.config.js` (keyframes section) and `index.css`.
  - In `index.css`, a custom class `.animate-slide-up` is defined with a duration of `0.6s` and a custom cubic-bezier ease.
  - In `tailwind.config.js`, the `extend.animation` section registers `'slide-up': 'slideUp 200ms ease forwards'`.
- **Blast radius**:
  - Unpredictable and mismatched animation behaviors (200ms vs 600ms, ease vs cubic-bezier) on components applying slide-up animations.
  - Redundant styles declared in the compiled CSS payload.
- **Mitigation**:
  - Unify keyframes and animation declarations. Keep the configuration in `tailwind.config.js` and remove duplicate keyframes and animation classes from `index.css`.

---

### [Low] Challenge 5: Typographic Scale Discrepancies due to Root Font-Size Override

- **Assumption challenged**: Setting a root `html` font-size of `13px` maintains standard font-size scales mapped in rems (e.g. `text-xs = 12px`, `text-sm = 14px`).
- **Attack scenario**:
  - `index.css` sets `html { font-size: 13px; }` and maps typographic scales in rems (e.g. `--text-xs: 0.6875rem`).
  - At runtime, `0.6875rem` resolves to `0.6875 * 13px = 8.93px`.
- **Blast radius**:
  - Custom font sizes are excessively small and violate WCAG readability recommendations (minimum recommended size is 12px for body/captions).
  - Mismatches the target specification in `redesign.md` (which lists `text-xs` as `12px`).
- **Mitigation**:
  - Define custom font-size variables in `index.css` using explicit pixel values, or adjust the rem ratios to target the exact pixel values when the root is 13px (e.g., `--text-xs: 0.923rem` for ~12px).

---

## Stress Test Results

- **Color Separator Test** → Parse `tailwind.config.js` + `index.css` color values → Multiple mixed space/comma separators found → **FAIL**
- **Font Availability Test** → Search index.css/index.html for Geist font imports → Geist Sans & Geist Mono not loaded → **FAIL**
- **Variable Resolution Test** → Resolve `--shadow-dark` and `--shadow-light` → Variables completely missing from CSS root/light themes → **FAIL**
- **Animation Collision Test** → Search for duplicate keyframes/animations → Mismatches found for `slideUp` (200ms vs 600ms) → **FAIL**
- **Typographic Scale Audit** → Calculate font-sizes based on 13px root font-size → `text-xs` resolves to `8.93px` (below specification limit) → **FAIL**

---

## Unchallenged Areas

- **Vite/PostCSS Compiler Settings**: We could not run compilation due to terminal command execution permissions timing out. However, the static issues identified are guaranteed to cause runtime/rendering failures in all modern browsers.
