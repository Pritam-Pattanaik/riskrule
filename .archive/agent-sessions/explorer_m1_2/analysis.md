# Proposal: Global Design Token Implementation Strategy
**Explorer 2 - Milestone 1**

---

## 1. Executive Summary
This document proposes a precise, step-by-step strategy for defining all design tokens from the Design System and Motion System specifications as CSS custom properties in `src/index.css` and mapping them into `tailwind.config.js`. 

The strategy ensures **zero visual breakage** and **zero compilation errors** during the initial token setup (Phase 1) by establishing backward-compatibility aliases in CSS, mapping existing Tailwind config keys to the new variables, and temporarily retaining deprecated glassmorphism variables.

---

## 2. CSS Custom Property Design (`src/index.css`)

### 2.1 Color Token Formatting Rules
- **Base Colors as Triplets**: Standard colors (surfaces, border, text, primary semantic hues) are declared as raw, space-separated RGB numbers (e.g., `99 102 241`). This allows Tailwind to apply arbitrary opacity modifiers using the `rgb(var(--color-token) / <alpha-value>)` format.
- **Subtle Semantic Colors with Bundled Opacities**: Semantic subtle colors (such as `--color-accent-subtle`, `--color-success-subtle`, etc.) change their opacity between dark mode (10%) and light mode (8%). Since this opacity is contextual, they are defined directly in CSS as resolved `rgba(...)` expressions. Tailwind maps these directly as static colors, avoiding complex logic in Javascript.
- **Divider Color**: Converted directly to `rgba(var(--color-border), 0.5)` to scale with light/dark border modifications.

### 2.2 Glassmorphism & Legacy Variables Handling
- **Glassmorphism Deprecation**: Glassmorphism elements (`--glass-bg`, `--glass-border`, `--glass-shadow`, `--glass-bg-hover`, `--glass-shadow-hover`) are scheduled for complete deletion in Phase 4 (Shared Components).
- **Temporary Aliases**: To prevent styling breakdown of existing cards, panels, and badges in Phase 1-3, these variables are preserved and internally aliased to the new surface, border, and shadow tokens.
- **Backward-compatibility Aliases**: Legacy CSS custom properties (`--color-base`, `--color-accent-light`, `--color-profit`, `--color-loss`, `--color-gold`, `--color-text-muted`) are retained in CSS as aliases pointing to the new tokens.

### 2.3 Proposed CSS Token Definitions

Here is the exact CSS token structure to be added under `@layer base` in `src/index.css`:

```css
@layer base {
  :root {
    /* ── Font Stack ── */
    --font-sans: 'Geist Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'Geist Mono', 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

    /* ── Typography Scale ── */
    --text-xs: 0.6875rem;     /* 11px */
    --text-sm: 0.8125rem;     /* 13px */
    --text-base: 0.9375rem;   /* 15px */
    --text-lg: 1.0625rem;     /* 17px */
    --text-xl: 1.25rem;       /* 20px */
    --text-2xl: 1.5rem;       /* 24px */
    --text-3xl: 1.875rem;     /* 30px */
    --text-4xl: 2.25rem;      /* 36px */
    --text-5xl: 3rem;         /* 48px */

    /* ── Font Weights ── */
    --font-regular: 400;
    --font-medium: 500;
    --font-semibold: 600;

    /* ── Surface Colors (Dark Mode Default) ── */
    --color-canvas: 9 9 11;             /* #09090B */
    --color-surface: 22 22 26;          /* #16161A */
    --color-surface-hover: 32 32 36;    /* #202024 */
    --color-surface-elevated: 38 38 42; /* #26262A */
    --color-surface-inset: 14 14 17;     /* #0E0E11 */

    /* ── Text Colors (Dark Mode Default) ── */
    --color-text-primary: 237 237 237;  /* #EDEDED */
    --color-text-secondary: 161 161 170;/* #A1A1AA */
    --color-text-tertiary: 113 113 122; /* #71717A */
    --color-text-disabled: 63 63 70;    /* #3F3F46 */
    --color-text-inverse: 9 9 11;       /* #09090B */

    /* ── Accent & Semantic Colors (Dark Mode Default) ── */
    --color-accent: 99 102 241;         /* #6366F1 */
    --color-accent-hover: 129 140 248;   /* #818CF8 */
    --color-accent-subtle: rgba(var(--color-accent), 0.10);
    --color-success: 16 185 129;        /* #10B981 */
    --color-success-subtle: rgba(var(--color-success), 0.10);
    --color-danger: 239 68 68;          /* #EF4444 */
    --color-danger-subtle: rgba(var(--color-danger), 0.10);
    --color-warning: 245 158 11;        /* #F59E0B */
    --color-warning-subtle: rgba(var(--color-warning), 0.10);
    --color-info: 59 130 246;           /* #3B82F6 */

    /* ── Border & Divider Colors (Dark Mode Default) ── */
    --color-border: 39 39 42;           /* #27272A */
    --color-border-hover: 55 55 60;     /* #37373C */
    --color-border-focus: var(--color-accent);
    --color-divider: rgba(var(--color-border), 0.50);

    /* ── Border Radius Tokens ── */
    --radius-none: 0px;
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-xl: 12px;
    --radius-full: 9999px;

    /* ── Elevation Shadows (Dark Mode Default) ── */
    --shadow-none: none;
    --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 16px -4px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 32px -8px rgba(0, 0, 0, 0.5);

    /* ── Spacing System (4px Base Grid) ── */
    --space-0: 0px;
    --space-0.5: 2px;
    --space-1: 4px;
    --space-1.5: 6px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;
    --space-16: 64px;
    --space-20: 80px;
    --space-24: 96px;

    /* ── Z-Index Scale ── */
    --z-base: 0;
    --z-above: 10;
    --z-sidebar: 30;
    --z-header: 40;
    --z-dropdown: 50;
    --z-modal-backdrop: 60;
    --z-modal: 70;
    --z-toast: 100;

    /* ── Motion System (Timing & Easing) ── */
    --duration-instant: 0ms;
    --duration-fast: 100ms;
    --duration-normal: 150ms;
    --duration-slow: 250ms;
    --duration-x-slow: 500ms;

    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

    /* ── Deprecated Glassmorphism Aliases (Dark Mode Default) ── */
    --glass-bg: rgba(var(--color-surface), 0.6);
    --glass-bg-hover: rgba(var(--color-surface-hover), 0.7);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-shadow: rgba(0, 0, 0, 0.25);
    --glass-shadow-hover: rgba(0, 0, 0, 0.4);

    /* ── Backward Compatibility Core Aliases ── */
    --color-base: var(--color-canvas);
    --color-accent-light: var(--color-accent-hover);
    --color-profit: var(--color-success);
    --color-loss: var(--color-danger);
    --color-gold: var(--color-warning);
    --color-text-muted: var(--color-text-tertiary);
  }

  /* ── Light Mode Overrides ── */
  .light {
    /* ── Surface Colors (Light Mode) ── */
    --color-canvas: 250 250 250;          /* #FAFAFA */
    --color-surface: 255 255 255;       /* #FFFFFF */
    --color-surface-hover: 244 244 245;  /* #F4F4F5 */
    --color-surface-elevated: 255 255 255;/* #FFFFFF */
    --color-surface-inset: 245 245 246;   /* #F5F5F6 */

    /* ── Text Colors (Light Mode) ── */
    --color-text-primary: 23 23 23;      /* #171717 */
    --color-text-secondary: 115 115 115; /* #737373 */
    --color-text-tertiary: 163 163 163;  /* #A3A3A3 */
    --color-text-disabled: 200 200 200;  /* #C8C8C8 */
    --color-text-inverse: 250 250 250;   /* #FAFAFA */

    /* ── Accent & Semantic Colors (Light Mode) ── */
    --color-accent: 79 70 229;          /* #4F46E5 */
    --color-accent-hover: 99 102 241;    /* #6366F1 */
    --color-accent-subtle: rgba(var(--color-accent), 0.08);
    --color-success: 5 150 105;         /* #059669 */
    --color-success-subtle: rgba(var(--color-success), 0.08);
    --color-danger: 220 38 38;          /* #DC2626 */
    --color-danger-subtle: rgba(var(--color-danger), 0.08);
    --color-warning: 217 119 6;         /* #D97706 */
    --color-warning-subtle: rgba(var(--color-warning), 0.08);
    --color-info: 37 99 235;            /* #2563EB */

    /* ── Border & Divider Colors (Light Mode) ── */
    --color-border: 229 229 229;        /* #E5E5E5 */
    --color-border-hover: 210 210 210;  /* #D2D2D2 */

    /* ── Elevation Shadows (Light Mode) ── */
    --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 16px -4px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 32px -8px rgba(0, 0, 0, 0.12);

    /* ── Deprecated Glassmorphism Aliases (Light Mode) ── */
    --glass-bg: rgba(var(--color-surface), 0.85);
    --glass-bg-hover: rgba(var(--color-surface-hover), 1);
    --glass-border: rgba(0, 0, 0, 0.06);
    --glass-shadow: rgba(0, 0, 0, 0.04);
    --glass-shadow-hover: rgba(0, 0, 0, 0.08);
  }

  /* ── Reduced Motion Media Query ── */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

---

## 3. Tailwind Mapping Strategy (`tailwind.config.js`)

To expose the new tokens to Tailwind classes (e.g. `bg-canvas`, `text-tertiary`, `rounded-md`, `duration-fast`, `ease-out`) while preserving existing configuration keys to prevent compilation breakage, the Tailwind configuration theme must be updated.

### 3.1 Key Details of the Tailwind Extension
1. **Color Expansion**: Standard colors map to CSS triplets supporting opacity overlays. Custom properties containing resolved opacity (e.g. `var(--color-accent-subtle)`) are referenced directly.
2. **Typography Sizing**: Replaces defaults with `--text-*` scale, matching precise line-heights and negative letter-spacing requirements defined in §3.4 of the Design System specification.
3. **Spacing normalization**: Overriding spacing keys `0` through `24` routes standard padding, margin, width, height, and gap classes directly through our custom spacing scale, eliminating accidental out-of-spec dimensions.
4. **Transition Utilities**: Addition of `transitionDuration` and `transitionTimingFunction` to enable CSS transition utilities configured with motion tokens (e.g. `duration-fast ease-out`).

### 3.2 Proposed Tailwind Configuration

Here is the exact structure for `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Backwards Compatibility Aliases (Retained to prevent breakage) ── */
        base: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--color-surface-hover) / <alpha-value>)',
        overlay: 'rgba(0, 0, 0, 0.7)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          light: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          dim: 'var(--color-accent-subtle)',
        },
        profit: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          dim: 'var(--color-success-subtle)',
          border: 'rgba(var(--color-success), 0.25)',
        },
        loss: {
          DEFAULT: 'rgb(var(--color-danger) / <alpha-value>)',
          dim: 'var(--color-danger-subtle)',
          border: 'rgba(var(--color-danger), 0.25)',
        },
        gold: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          dim: 'var(--color-warning-subtle)',
          border: 'rgba(var(--color-warning), 0.25)',
        },
        'tv-border': {
          DEFAULT: 'rgba(var(--color-border), 0.12)',
          bright: 'rgba(var(--color-border), 0.3)',
          active: 'rgba(var(--color-border), 0.5)',
        },

        /* ── New System Tokens ── */
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        'surface-inset': 'rgb(var(--color-surface-inset) / <alpha-value>)',
        
        // Semantic Colors
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          subtle: 'var(--color-success-subtle)',
        },
        danger: {
          DEFAULT: 'rgb(var(--color-danger) / <alpha-value>)',
          subtle: 'var(--color-danger-subtle)',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          subtle: 'var(--color-warning-subtle)',
        },
        info: 'rgb(var(--color-info) / <alpha-value>)',
        
        // Structured Borders & Dividers
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          hover: 'rgb(var(--color-border-hover) / <alpha-value>)',
          focus: 'rgb(var(--color-border-focus) / <alpha-value>)',
        },
        divider: 'var(--color-divider)',
      },
      textColor: {
        /* ── Backwards Compatibility Aliases ── */
        primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',

        /* ── New System Tokens ── */
        tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
      },
      fontFamily: {
        /* ── Maps legacy utility to new tokens ── */
        ui: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        
        /* ── New Standardised Tokens ── */
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      fontSize: {
        /* ── Legacy font sizes retained for safety ── */
        'tv-xs': ['10px', { letterSpacing: '0.1em' }],
        'tv-sm': ['12px', { lineHeight: '1.5' }],
        'tv-base': ['13px', { lineHeight: '1.5' }],
        'tv-md': ['15px', { lineHeight: '1.4' }],
        'tv-lg': ['18px', { lineHeight: '1.3' }],
        'tv-xl': ['22px', { lineHeight: '1.2' }],
        'tv-2xl': ['28px', { lineHeight: '1.2' }],

        /* ── New System Tokens (Sizing + Tracking + Line Heights) ── */
        'xs': ['var(--text-xs)', { letterSpacing: '0.05em', lineHeight: '1' }], // Tracking for micro labels
        'sm': ['var(--text-sm)', { lineHeight: '1.5' }],
        'base': ['var(--text-base)', { lineHeight: '1.5' }],
        'lg': ['var(--text-lg)', { letterSpacing: '-0.01em', lineHeight: '1.3' }],
        'xl': ['var(--text-xl)', { letterSpacing: '-0.01em', lineHeight: '1.2' }],
        '2xl': ['var(--text-2xl)', { letterSpacing: '-0.02em', lineHeight: '1.2' }],
        '3xl': ['var(--text-3xl)', { letterSpacing: '-0.02em', lineHeight: '1.2' }],
        '4xl': ['var(--text-4xl)', { letterSpacing: '-0.02em', lineHeight: '1.2' }],
        '5xl': ['var(--text-5xl)', { letterSpacing: '-0.02em', lineHeight: '1.2' }],
      },
      fontWeight: {
        regular: 'var(--font-regular)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
      },
      borderRadius: {
        /* ── Legacy border radii retained for safety ── */
        'tv-sm': '4px',
        'tv-md': '6px',
        'tv-lg': '8px',
        'tv-xl': '10px',
        'tv-2xl': '12px',
        'tv-3xl': '16px',

        /* ── New System Tokens ── */
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      spacing: {
        /* ── New System Spacing Tokens (Overrides default Tailwind scale keys) ── */
        '0': 'var(--space-0)',
        '0.5': 'var(--space-0.5)',
        '1': 'var(--space-1)',
        '1.5': 'var(--space-1.5)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
      },
      zIndex: {
        /* ── New System Z-Index Tokens ── */
        base: 'var(--z-base)',
        above: 'var(--z-above)',
        sidebar: 'var(--z-sidebar)',
        header: 'var(--z-header)',
        dropdown: 'var(--z-dropdown)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
      boxShadow: {
        /* ── Legacy shadows retained for safety ── */
        'neu': '2px 2px 5px var(--shadow-dark), 6px 6px 15px var(--shadow-dark), -2px -2px 5px var(--shadow-light), -6px -6px 15px var(--shadow-light)',
        'neu-sm': '1px 1px 3px var(--shadow-dark), 3px 3px 6px var(--shadow-dark), -1px -1px 3px var(--shadow-light), -3px -3px 6px var(--shadow-light)',
        'neu-pressed': 'inset 2px 2px 5px var(--shadow-dark), inset -2px -2px 5px var(--shadow-light)',
        'neu-hover': '4px 4px 10px var(--shadow-dark), 10px 10px 25px var(--shadow-dark), -4px -4px 10px var(--shadow-light), -10px -10px 25px var(--shadow-light)',
        'glow-profit': '0 0 25px rgba(var(--color-profit), 0.15), 2px 2px 5px var(--shadow-dark), 6px 6px 15px var(--shadow-dark), -2px -2px 5px var(--shadow-light), -6px -6px 15px var(--shadow-light)',
        'glow-loss': '0 0 25px rgba(var(--color-loss), 0.15), 2px 2px 5px var(--shadow-dark), 6px 6px 15px var(--shadow-dark), -2px -2px 5px var(--shadow-light), -6px -6px 15px var(--shadow-light)',

        /* ── New System Tokens ── */
        none: 'var(--shadow-none)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionDuration: {
        /* ── New Motion Duration Tokens ── */
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        'x-slow': 'var(--duration-x-slow)',
      },
      transitionTimingFunction: {
        /* ── New Motion Easing Tokens ── */
        out: 'var(--ease-out)',
        in: 'var(--ease-in)',
        'in-out': 'var(--ease-in-out)',
      },
      animation: {
        /* ── Retained for legacy components ── */
        'fade-in': 'fadeIn 300ms ease forwards',
        'slide-up': 'slideUp 200ms ease forwards',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        /* ── Retained for legacy components ── */
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## 4. Precise Step-by-Step Implementation Strategy

An implementer should execute Phase 1 according to these instructions:

### Step 1: CSS variables definition
1. Open `src/index.css`.
2. Locate the existing `:root` and `.light` selectors inside `@layer base`.
3. Keep the `@import` google fonts directive at the top.
4. Replace the contents of `:root` and `.light` with the code in Section 2.3. Ensure all `--glass-*` variables are defined in terms of the new variables as aliases, and the old `--color-*` variables are similarly aliased to their new equivalents.
5. Add the `@media (prefers-reduced-motion: reduce)` block inside `@layer base`.

### Step 2: Tailwind configuration updates
1. Open `tailwind.config.js`.
2. Update the `theme.extend` object according to Section 3.2.
3. Keep existing classes working by mapping old theme configurations (`ui` font, `base` background, text colors) to the new CSS variables.
4. Add all new key-value definitions under colors, textColors, fontFamily, fontSize, fontWeight, borderRadius, spacing, zIndex, boxShadow, transitionDuration, and transitionTimingFunction.

### Step 3: Local build validation
1. Run the local build script to ensure there are no compilation errors:
   ```bash
   npm run build
   ```
2. Verify that there are no warnings or errors from PostCSS or Tailwind CSS compilation.

---

## 5. Verification and QA plan

### 5.1 Verification Commands
The following scripts should be run to verify integration safety:
```bash
# Verify compilation and typescript integrity
npm run build

# Run end-to-end tests to detect visual layout/functional issues
npm run test:e2e
```

### 5.2 Browser Runtime Checks
1. **DOM Styles Check**:
   - Run the application (`npm run dev`) and inspect the `<html>` or `<body>` element in Google Chrome / Firefox DevTools.
   - Verify that all tokens (`--color-*`, `--space-*`, `--radius-*`, etc.) are declared in the styles panel for `:root`.
2. **Light Mode Toggling**:
   - Manually add the class `light` to the `<html>` element in the DOM inspector.
   - Verify that color properties override correctly (e.g. `--color-canvas` shifts from `9 9 11` to `250 250 250`).
3. **No Layout Regression**:
   - Navigate to the Dashboard and Trades pages.
   - Verify that existing card containers, badges, and input inputs retain their current appearance. (Aliased glassmorphism styles and color names will have preserved all current styling rules exactly).
4. **Reduced Motion Verification**:
   - Turn on "Reduce Motion" in your OS Settings (Windows Ease of Access > Display > Show animations).
   - In DevTools, verify that elements with transitions have their animation and transition durations overridden to `0.01ms` under media queries.
