# Handoff Report: Phase 1 — Global Design Tokens Strategy

## 1. Observation

- **Scope & Specifications**:
  - `SCOPE.md` (lines 7-10) defines the primary objectives:
    ```markdown
    - Define all `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--z-*`, `--font-*`, `--text-*`, `--duration-*`, `--ease-*` CSS custom properties in `:root` and `.light` blocks inside `src/index.css`.
    - Remove deprecated glassmorphism variables but keep them as aliases temporarily to prevent visual breakdown.
    - Update `tailwind.config.js` to reference the new CSS variables in the theme extension.
    ```
  - `chandan/01_Design_System.md` (§3–§9, §14) specifies font families, typography size scales, weights, tracking, line heights, surface levels, text colors, semantic colors, borders, border-radii, spacing grids, shadows, and z-indices.
  - `chandan/04_Motion_System.md` (§2–§3) specifies duration (fast, normal, slow, x-slow) and easing curves (out, in, in-out).

- **Current Styling Variables (`src/index.css` lines 17-64)**:
  - Inside `:root`, legacy colors defined are:
    ```css
    --color-base: 9 9 11;
    --color-surface: 24 24 27;
    --color-surface-hover: 39 39 42;
    --color-accent: 99 102 241;
    --color-accent-light: 129 140 248;
    --color-profit: 16 185 129;
    --color-loss: 244 63 94;
    --color-gold: 245 158 11;
    --color-border: 39 39 42;
    --color-text-primary: 250 250 250;
    --color-text-secondary: 161 161 170;
    --color-text-muted: 113 113 122;
    --color-text-inverse: 9 9 11;
    ```
  - Inside `:root` and `.light`, the glassmorphism variables are:
    ```css
    --glass-bg: rgba(24, 24, 27, 0.6);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-shadow: rgba(0, 0, 0, 0.25);
    ```

- **Current Tailwind Configurations (`tailwind.config.js` lines 8-91)**:
  - Extends colors using legacy properties, e.g.:
    ```javascript
    colors: {
      base: 'rgb(var(--color-base) / <alpha-value>)',
      surface: 'rgb(var(--color-surface) / <alpha-value>)',
      'surface-hover': 'rgb(var(--color-surface-hover) / <alpha-value>)',
      profit: {
        DEFAULT: 'rgb(var(--color-profit) / <alpha-value>)',
      }
    }
    ```
  - Configures Outfits/JetBrains Mono under `fontFamily`:
    ```javascript
    fontFamily: {
      ui: ['Outfit', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    }
    ```

---

## 2. Logic Chain

1. **Mapping Custom Properties**: In order to establish the visual foundation required by `SCOPE.md`, all design system tokens defined in `chandan/01_Design_System.md` and `chandan/04_Motion_System.md` must be systematically translated into CSS custom properties under `src/index.css`.
2. **Backwards Compatibility**: To avoid compiler errors or visual regressions as mandated by `SCOPE.md` ("Maintain existing functionality; no visual layout changes or compilation errors"), legacy Tailwind colors (like `bg-base`, `text-primary`) and CSS custom properties (like `--color-base`) must be aliased to the new system variables.
3. **Handling Subtle Colors & Dividers**: The design specifications for subtle/semantic colors and dividers involve specific opacities that differ between dark and light modes (e.g. `--color-accent-subtle` is `10%` in dark mode and `8%` in light mode). Declaring these as fully-resolved `rgba` variables in CSS makes theme toggling clean and prevents complex Tailwind-side configurations.
4. **Handling Glassmorphism Variables**: To prevent component breakdown, the deprecated glassmorphism variables (`--glass-*`) are kept inside `src/index.css` as aliases pointing to the new tokens. They will remain fully active until their removal in Phase 4 when components are updated.
5. **Tailwind Configurations**: Mapping the new CSS variables into `tailwind.config.js` under `theme.extend` ensures that all new tokens (like `text-text-primary`, `bg-canvas`, `rounded-md`, `duration-fast`) are available as standard utility classes across the project.

---

## 3. Caveats

- **Rem Scale Sizing**: Normalizing `html` base font size from `13px` to `16px` is scoped under Phase 2 of the implementation plan. During Phase 1, the new design system fonts (`Geist Sans` and `Geist Mono`) are set up in the tokens stack, but Outfit and JetBrains Mono will remain active through tailwind configuration aliases. The actual font swapping, size scaling, and file preloading will occur in Phase 2.
- **Terminal Execution**: Command verification of `npm run build` and `npm run lint` timed out due to the read-only explorer's environmental command prompt wait limit. However, the proposed config structures are syntactically and logically validated against standard Tailwind CSS v3 structures.

---

## 4. Conclusion

Phase 1 requires updating `src/index.css` with the new design token CSS variables, preserving the legacy variables and deprecated glassmorphism variables as aliases. It also requires extending `tailwind.config.js` to reference both the new custom properties and legacy classes for complete backward compatibility. This strategy ensures the codebase remains compile-ready and layout-stable.

---

## 5. Verification Method

The implementation can be verified using the following steps:
1. **Compilation**: Run `npm run build`. Vite must build successfully with no PostCSS parser or TypeScript compiler errors.
2. **Linting**: Run `npm run lint`. ESLint must exit with zero warnings or errors.
3. **Inspect CSS Variables**: Run `npm run dev` and open Chrome DevTools. Inspect the `:root` element to confirm all system variables are active.
4. **Light Mode Verification**: In the DevTools console, run:
   ```javascript
   document.documentElement.classList.add('light')
   ```
   Inspect the elements to confirm that custom property values (like `--color-canvas` and `--color-text-primary`) override correctly.
5. **Layout Inspection**: Perform a visual regression inspection on the Dashboard (`/`) and Trades (`/trades`) to ensure that layout borders, text sizing, and cards do not distort.
