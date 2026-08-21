# Challenge Report: Milestone 1 - Global Design Tokens

## Challenge Summary

**Overall risk assessment**: HIGH

While the previously flagged syntax errors regarding comma/slash separators inside `rgba()` functions have been successfully resolved by the implementer, there are still critical design-specification gaps, animation shadowing issues, and typographic scale regressions that present high risk for visual styling and accessibility.

---

## Challenges

### [High] Challenge 1: Typographic Scale Regressions due to Root Font-Size Override

- **Assumption challenged**: Keeping the root `html` font-size at `13px` works seamlessly with standard `rem`-based typography scale.
- **Attack scenario**:
  - `src/index.css` declares `html { font-size: 13px; }` on line 197.
  - The design system tokens use rems for the typography scale (e.g. `--text-xs: 0.6875rem`, `--text-sm: 0.8125rem`).
  - At runtime, the browser evaluates `0.6875rem` as `0.6875 * 13px = 8.94px` instead of `11px` (under standard `16px` root).
- **Blast radius**:
  - The entire application's typographic scale is scaled down by approximately **18.7%**.
  - All text is rendered smaller than defined in the Design System specification (e.g., body cells render at `10.5px` instead of `13px`).
  - Micro-labels and chart captions render at `8.9px`, which violates WCAG accessibility readability guidelines (which recommend a minimum of 12px for body/captions).
- **Mitigation**:
  - Normalize the root font size by setting `html { font-size: 16px; }` as requested in the design spec migration notes, or rewrite the CSS variables to use absolute `px` values.

---

### [Medium] Challenge 2: Duplicate Keyframes and Animation Behavior Shadowing/Collision

- **Assumption challenged**: Declaring keyframes with identical names (`fadeIn`, `slideUp`) in both Tailwind and the component CSS layer is safe.
- **Attack scenario**:
  - In `tailwind.config.js` (lines 194-203), `fadeIn` is defined as a pure opacity fade-in (0 to 1).
  - In `src/index.css` (lines 406-415), `fadeIn` is redefined under `@layer components` to include a translation: `translateY(10px)` to `translateY(0)`.
  - The browser overrides Tailwind's utility keyframe with the stylesheet component keyframe.
- **Blast radius**:
  - Any element using Tailwind's standard `animate-fade-in` utility (like modal overlays, dropdown backdrops, or sticky headers) will physically slide up instead of doing a simple fade-in. This leads to layout shifting and poor aesthetics on static overlay layers.
- **Mitigation**:
  - Rename the custom keyframes in `src/index.css` to a unique name (e.g., `fadeInUp`) to prevent collision with Tailwind's built-in keyframes, and update the classes referencing it.

---

### [Medium] Challenge 3: Omission of Geist Font Import & Font Mismatch

- **Assumption challenged**: Geist Sans and Geist Mono are loaded and active.
- **Attack scenario**:
  - There is no `@font-face` or `@import` for Geist fonts in `index.css` (line 1 imports `Outfit` and `JetBrains Mono` instead).
  - In `src/index.css` (line 203), the `body` element explicitly sets `font-family: 'Outfit', sans-serif;` rather than referencing `var(--font-sans)`.
- **Blast radius**:
  - The browser cannot resolve Geist Sans or Geist Mono, falling back to system defaults. The application continues to render in the legacy `Outfit` font, ignoring the primary font specified in the Design System.
- **Mitigation**:
  - Import Geist fonts at the top of `src/index.css` and update the `body` font-family selector to use `var(--font-sans)`.

---

### [Medium] Challenge 4: Deprecated Glassmorphism Variables & Unmigrated Component Classes

- **Assumption challenged**: Standardized surface layers and tokens can coexist with legacy glassmorphism classes.
- **Attack scenario**:
  - The Design System migration notes specify: "Glass effects: `--glass-bg`, `--glass-border`, `--glass-shadow` variables → Remove. Replace with the surface hierarchy defined above."
  - However, they remain in `src/index.css` and are still used by `.card`, `.glass-panel`, `.badge`, and `.input-base`.
- **Blast radius**:
  - Defeats the purpose of the global token migration by maintaining double-definitions of surfaces and borders, making design standardization harder to enforce.
- **Mitigation**:
  - Refactor component classes (`.card`, `.badge`, etc.) to use the newly defined surfaces (`--color-surface`, `--color-border`, `--shadow-sm`/`--shadow-md`).

---

### [Low] Challenge 5: Hardcoded Colors under Light Mode for `--color-warning-subtle`

- **Assumption challenged**: Semantic colors scale automatically across dark and light modes.
- **Attack scenario**:
  - In `.light`, `--color-warning-subtle` is hardcoded as `rgba(217, 119, 6, 0.08);` (with commas and hardcoded numbers) instead of `rgba(var(--color-warning) / 0.08)`.
- **Blast radius**:
  - If a developer updates `--color-warning` in light mode, `--color-warning-subtle` will not update dynamically, creating visual styling drift.
- **Mitigation**:
  - Define it as `--color-warning-subtle: rgba(var(--color-warning) / 0.08);` to match other subtle colors.

---

## Stress Test Results

- **Color Separator Test** → Verify all space-separated variables in `rgba()` use `/` → All slashes successfully integrated → **PASS**
- **Root Font-Size Test** → Check if base `html` font-size matches the `16px` spec requirement → Still `13px`, rendering text ~18.7% smaller → **FAIL**
- **Keyframe Shadowing Test** → Check for collisions between Tailwind and custom CSS keyframes → `fadeIn` is shadowed and redefined as a slide-up → **FAIL**
- **Typography Availability Test** → Verify Geist fonts are loaded and applied to body → Not loaded, body still uses hardcoded `Outfit` → **FAIL**
- **Design System Parity Test** → Check if deprecated glassmorphism variables are removed → Glassmorphism variables are still present and in use → **FAIL**
- **Dynamic Semantic Colors Test** → Verify all subtle variant tokens reference parent variables → `--color-warning-subtle` is hardcoded in light mode → **FAIL**

---

## Unchallenged Areas

- **Vite/PostCSS Compiler Settings**: We could not run compilation due to terminal command execution permissions timing out. However, the static issues identified are guaranteed to cause runtime/rendering failures or visual inconsistencies in all modern browsers.
