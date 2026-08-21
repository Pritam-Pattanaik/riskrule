# Analysis: Global Design Tokens Strategy

## 1. Executive Summary

This report defines the precise strategy for implementing **Phase 1: Global Design Tokens** of the frontend redesign. The core objective is to establish a robust, modern foundation of CSS custom properties (in both default dark `:root` and light `.light` modes) inside `src/index.css`, and map them comprehensively into `tailwind.config.js`. 

To prevent visual regression or compilation failure during the transition:
1. **Deprecated Glassmorphism Variables** (`--glass-bg`, etc.) are maintained temporarily as aliases in CSS, mapping to the new design tokens. They will be completely purged in Phase 4.
2. **Legacy Variables** (like `--color-base`, `--color-accent-light`) are aliased to the new design token variables in both CSS and Tailwind configurations so that existing codebase uses do not break.
3. **Color Space normalisation**: Colors are defined as space-separated `R G B` triplets to support Tailwind's `<alpha-value>` opacity modifier. Subtle/semantic colors and dividers, which require specific opacity shifts between dark and light modes, are defined as resolved `rgba(...)` values in CSS for maximum robustness.

---

## 2. Current State Analysis

The current codebase uses a mix of variables and hardcoded configurations:
- **`src/index.css`**: Currently defines a small set of base variables under `:root` (dark default) and `.light` using space-separated RGB triplets, along with specific glassmorphism variables. Base font size is hardcoded on `html` as `13px`. It contains several utility classes like `.card`, `.badge`, and `.input-base` which rely heavily on the glassmorphism variables, box shadows, and translateY hover transforms.
- **`tailwind.config.js`**: Extends the theme colors with specific legacy variables (`base`, `surface`, `accent`, `profit`, `loss`, `gold`, `tv-border`). It defines custom text colors (`primary`, `secondary`, `muted`, `inverse`), font families (`ui` mapped to Outfit, `mono` mapped to JetBrains Mono), custom font-sizes (`tv-xs` through `tv-2xl`), and specific box-shadows.

---

## 3. Proposed CSS Custom Properties System (`src/index.css`)

All design tokens from `01_Design_System.md` and `04_Motion_System.md` will be defined inside `src/index.css` under the `@layer base` directive.

### 3.1 Architecture Highlights
- **RGB Triplets**: Tokens like `--color-canvas` and `--color-accent` are declared as space-separated RGB values (e.g. `9 9 11`). In Tailwind, these are used as `rgb(var(--color-canvas) / <alpha-value>)`.
- **Pre-Resolved Opacity Colors**: Tokens that require explicit opacity adjustments between themes (e.g. `--color-accent-subtle` is `10%` in dark mode, but `8%` in light mode) are defined as resolved `rgba(...)` strings in CSS. This shifts the theme-specific opacity logic into CSS rather than hardcoding it in Tailwind.
- **Transition Aliases**: Deprecated glassmorphism tokens are defined to point to the new color tokens with appropriate opacities.
- **Legacy Fallbacks**: Legacy CSS variables are kept inside `:root` and `.light` as aliases pointing directly to the new variables to prevent stylesheet compile errors.

### 3.2 Complete Code Proposal for `src/index.css`

```css
@layer base {
  :root {
    /* ── 1. Font Families ── */
    --font-sans: 'Geist Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'Geist Mono', 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

    /* ── 2. Typography Scale (Normalized to 16px Base) ── */
    --text-xs: 0.6875rem;   /* 11px */
    --text-sm: 0.8125rem;   /* 13px */
    --text-base: 0.9375rem; /* 15px */
    --text-lg: 1.0625rem;   /* 17px */
    --text-xl: 1.25rem;     /* 20px */
    --text-2xl: 1.5rem;     /* 24px */
    --text-3xl: 1.875rem;   /* 30px */
    --text-4xl: 2.25rem;    /* 36px */
    --text-5xl: 3rem;       /* 48px */

    /* ── 3. Font Weights ── */
    --font-regular: 400;
    --font-medium: 500;
    --font-semibold: 600;

    /* ── 4. Color Architecture: Surfaces (RGB Triplets) ── */
    --color-canvas: 9 9 11;             /* #09090B */
    --color-surface: 22 22 26;          /* #16161A */
    --color-surface-hover: 32 32 36;    /* #202024 */
    --color-surface-elevated: 38 38 42;  /* #26262A */
    --color-surface-inset: 14 14 17;     /* #0E0E11 */

    /* ── 5. Color Architecture: Text (RGB Triplets) ── */
    --color-text-primary: 237 237 237;   /* #EDEDED */
    --color-text-secondary: 161 161 170; /* #A1A1AA */
    --color-text-tertiary: 113 113 122;  /* #71717A */
    --color-text-disabled: 63 63 70;     /* #3F3F46 */
    --color-text-inverse: 9 9 11;        /* #09090B */

    /* ── 6. Color Architecture: Accent & Semantic ── */
    --color-accent: 99 102 241;         /* #6366F1 */
    --color-accent-hover: 129 140 248;   /* #818CF8 */
    --color-accent-subtle: rgba(99, 102, 241, 0.1); /* 10% dark opacity */
    
    --color-success: 16 185 129;        /* #10B981 */
    --color-success-subtle: rgba(16, 185, 129, 0.1);
    
    --color-danger: 239 68 68;          /* #EF4444 */
    --color-danger-subtle: rgba(239, 68, 68, 0.1);
    
    --color-warning: 245 158 11;        /* #F59E0B */
    --color-warning-subtle: rgba(245, 158, 11, 0.1);
    
    --color-info: 59 130 246;           /* #3B82F6 */

    /* ── 7. Color Architecture: Borders & Dividers ── */
    --color-border: 39 39 42;           /* #27272A */
    --color-border-hover: 55 55 60;     /* #37373C */
    --color-border-focus: 99 102 241;   /* Same as --color-accent */
    --color-divider: rgba(39, 39, 42, 0.5); /* 50% opacity */

    /* ── 8. Border & Radius System ── */
    --radius-none: 0px;
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-xl: 12px;
    --radius-full: 9999px;

    /* ── 9. Shadow & Elevation System (Dark Mode) ── */
    --shadow-none: none;
    --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 16px -4px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 32px -8px rgba(0, 0, 0, 0.5);

    /* ── 10. Spacing Scale ── */
    --space-0: 0rem;
    --space-0.5: 0.125rem; /* 2px */
    --space-1: 0.25rem;    /* 4px */
    --space-1.5: 0.375rem; /* 6px */
    --space-2: 0.5rem;     /* 8px */
    --space-3: 0.75rem;    /* 12px */
    --space-4: 1rem;       /* 16px */
    --space-5: 1.25rem;    /* 20px */
    --space-6: 1.5rem;     /* 24px */
    --space-8: 2rem;       /* 32px */
    --space-10: 2.5rem;    /* 40px */
    --space-12: 3rem;      /* 48px */
    --space-16: 4rem;      /* 64px */
    --space-20: 5rem;      /* 80px */
    --space-24: 6rem;      /* 96px */

    /* ── 11. Z-Index Scale ── */
    --z-base: 0;
    --z-above: 10;
    --z-sidebar: 30;
    --z-header: 40;
    --z-dropdown: 50;
    --z-modal-backdrop: 60;
    --z-modal: 70;
    --z-toast: 100;

    /* ── 12. Opacity Scale ── */
    --opacity-0: 0;
    --opacity-5: 0.05;
    --opacity-10: 0.1;
    --opacity-20: 0.2;
    --opacity-50: 0.5;
    --opacity-100: 1;

    /* ── 13. Motion System Durations ── */
    --duration-instant: 0ms;
    --duration-fast: 100ms;
    --duration-normal: 150ms;
    --duration-slow: 250ms;
    --duration-x-slow: 500ms;

    /* ── 14. Motion System Easing Curves ── */
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

    /* ── DEPRECATED GLASSMORPHISM ALIASES (Temporary compatibility) ── */
    --glass-bg: rgba(22, 22, 26, 0.6);
    --glass-bg-hover: rgba(32, 32, 36, 0.7);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-shadow: rgba(0, 0, 0, 0.25);
    --glass-shadow-hover: rgba(0, 0, 0, 0.4);

    /* ── LEGACY VARIABLES MAPPED AS ALIASES ── */
    --color-base: var(--color-canvas);
    --color-accent-light: var(--color-accent-hover);
    --color-profit: var(--color-success);
    --color-loss: var(--color-danger);
    --color-gold: var(--color-warning);
    --color-text-muted: var(--color-text-tertiary);
  }

  .light {
    /* ── 4. Color Architecture: Surfaces (Light Mode) ── */
    --color-canvas: 250 250 250;        /* #FAFAFA */
    --color-surface: 255 255 255;       /* #FFFFFF */
    --color-surface-hover: 244 244 245;   /* #F4F4F5 */
    --color-surface-elevated: 255 255 255; /* #FFFFFF */
    --color-surface-inset: 245 245 246;    /* #F5F5F6 */

    /* ── 5. Color Architecture: Text (Light Mode) ── */
    --color-text-primary: 23 23 23;      /* #171717 */
    --color-text-secondary: 115 115 115; /* #737373 */
    --color-text-tertiary: 163 163 163;  /* #A3A3A3 */
    --color-text-disabled: 200 200 200;  /* #C8C8C8 */
    --color-text-inverse: 250 250 250;   /* #FAFAFA */

    /* ── 6. Color Architecture: Accent & Semantic (Light Mode) ── */
    --color-accent: 79 70 229;           /* #4F46E5 */
    --color-accent-hover: 99 102 241;     /* #6366F1 */
    --color-accent-subtle: rgba(79, 70, 229, 0.08); /* 8% light opacity */
    
    --color-success: 5 150 105;          /* #059669 */
    --color-success-subtle: rgba(5, 150, 105, 0.08);
    
    --color-danger: 220 38 38;           /* #DC2626 */
    --color-danger-subtle: rgba(220, 38, 38, 0.08);
    
    --color-warning: 217 119 6;          /* #D97706 */
    --color-warning-subtle: rgba(217, 119, 6, 0.08);
    
    --color-info: 37 99 235;             /* #2563EB */

    /* ── 7. Color Architecture: Borders & Dividers (Light Mode) ── */
    --color-border: 229 229 229;         /* #E5E5E5 */
    --color-border-hover: 210 210 210;    /* #D2D2D2 */
    --color-border-focus: 79 70 229;     /* Same as --color-accent */
    --color-divider: rgba(229, 229, 229, 0.5); /* 50% opacity */

    /* ── 9. Shadow & Elevation System (Light Mode) ── */
    --shadow-none: none;
    --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 16px -4px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 32px -8px rgba(0, 0, 0, 0.12);

    /* ── DEPRECATED GLASSMORPHISM ALIASES (Light Mode compatibility) ── */
    --glass-bg: rgba(255, 255, 255, 0.85);
    --glass-bg-hover: rgba(255, 255, 255, 1);
    --glass-border: rgba(0, 0, 0, 0.06);
    --glass-shadow: rgba(0, 0, 0, 0.04);
    --glass-shadow-hover: rgba(0, 0, 0, 0.08);
  }
}
```

---

## 4. Proposed Tailwind Theme Mapping (`tailwind.config.js`)

`tailwind.config.js` must be expanded to reference the new variables. We map them cleanly into `theme.extend` so that all original tailwind utility combinations still work, while injecting new semantic design tokens.

### 4.1 Tailwind Config Mapping Code

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
        // ── 1. New Design Tokens ──
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          hover: 'rgb(var(--color-surface-hover) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
          inset: 'rgb(var(--color-surface-inset) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          subtle: 'var(--color-accent-subtle)', // Fully resolved resolved in CSS
        },
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
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          hover: 'rgb(var(--color-border-hover) / <alpha-value>)',
          focus: 'rgb(var(--color-border-focus) / <alpha-value>)',
        },
        divider: 'var(--color-divider)',

        // ── 2. Legacy Backward Compatibility Aliases ──
        base: 'rgb(var(--color-canvas) / <alpha-value>)',
        'surface-hover': 'rgb(var(--color-surface-hover) / <alpha-value>)',
        accent-light: 'rgb(var(--color-accent-hover) / <alpha-value>)',
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
      },
      textColor: {
        // ── 1. New Design Tokens ──
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
          disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
          inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
        },
        // ── 2. Legacy Backward Compatibility Aliases ──
        primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        muted: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
      },
      fontFamily: {
        // ── 1. New Design Tokens ──
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        // ── 2. Legacy Aliases ──
        ui: ['var(--font-sans)', 'sans-serif'],
      },
      fontSize: {
        // ── 1. New Design Tokens ──
        xs: ['var(--text-xs)', { lineHeight: '1.5' }],
        sm: ['var(--text-sm)', { lineHeight: '1.5' }],
        base: ['var(--text-base)', { lineHeight: '1.5' }],
        lg: ['var(--text-lg)', { lineHeight: '1.3' }],
        xl: ['var(--text-xl)', { lineHeight: '1.2' }],
        '2xl': ['var(--text-2xl)', { lineHeight: '1.2' }],
        '3xl': ['var(--text-3xl)', { lineHeight: '1.2' }],
        '4xl': ['var(--text-4xl)', { lineHeight: '1.2' }],
        '5xl': ['var(--text-5xl)', { lineHeight: '1.2' }],

        // ── 2. Legacy Aliases ──
        'tv-xs': ['var(--text-xs)', { letterSpacing: '0.1em' }],
        'tv-sm': ['var(--text-sm)', { lineHeight: '1.5' }],
        'tv-base': ['var(--text-sm)', { lineHeight: '1.5' }],
        'tv-md': ['var(--text-base)', { lineHeight: '1.4' }],
        'tv-lg': ['var(--text-lg)', { lineHeight: '1.3' }],
        'tv-xl': ['var(--text-2xl)', { lineHeight: '1.2' }],
        'tv-2xl': ['var(--text-3xl)', { lineHeight: '1.2' }],
      },
      borderRadius: {
        // ── 1. New Design Tokens ──
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',

        // ── 2. Legacy Aliases ──
        'tv-sm': 'var(--radius-sm)',
        'tv-md': 'var(--radius-md)',
        'tv-lg': 'var(--radius-lg)',
        'tv-xl': 'var(--radius-md)', /* 10px mappings */
        'tv-2xl': 'var(--radius-xl)', /* 12px mappings */
        'tv-3xl': 'var(--radius-xl)', /* 16px mappings */
      },
      boxShadow: {
        // ── 1. New Design Tokens ──
        none: 'var(--shadow-none)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',

        // ── 2. Legacy Aliases (Preserved for compatibility) ──
        'neu': '2px 2px 5px var(--shadow-dark, rgba(0,0,0,0.3)), 6px 6px 15px var(--shadow-dark, rgba(0,0,0,0.3)), -2px -2px 5px var(--shadow-light, rgba(255,255,255,0.03)), -6px -6px 15px var(--shadow-light, rgba(255,255,255,0.03))',
        'neu-sm': '1px 1px 3px var(--shadow-dark, rgba(0,0,0,0.3)), 3px 3px 6px var(--shadow-dark, rgba(0,0,0,0.3)), -1px -1px 3px var(--shadow-light, rgba(255,255,255,0.03)), -3px -3px 6px var(--shadow-light, rgba(255,255,255,0.03))',
        'neu-pressed': 'inset 2px 2px 5px var(--shadow-dark, rgba(0,0,0,0.3)), inset -2px -2px 5px var(--shadow-light, rgba(255,255,255,0.03))',
        'neu-hover': '4px 4px 10px var(--shadow-dark, rgba(0,0,0,0.3)), 10px 10px 25px var(--shadow-dark, rgba(0,0,0,0.3)), -4px -4px 10px var(--shadow-light, rgba(255,255,255,0.03)), -10px -10px 25px var(--shadow-light, rgba(255,255,255,0.03))',
        'glow-profit': '0 0 25px rgba(var(--color-profit), 0.15), 2px 2px 5px var(--shadow-dark, rgba(0,0,0,0.3)), 6px 6px 15px var(--shadow-dark, rgba(0,0,0,0.3)), -2px -2px 5px var(--shadow-light, rgba(255,255,255,0.03)), -6px -6px 15px var(--shadow-light, rgba(255,255,255,0.03))',
        'glow-loss': '0 0 25px rgba(var(--color-loss), 0.15), 2px 2px 5px var(--shadow-dark, rgba(0,0,0,0.3)), 6px 6px 15px var(--shadow-dark, rgba(0,0,0,0.3)), -2px -2px 5px var(--shadow-light, rgba(255,255,255,0.03)), -6px -6px 15px var(--shadow-light, rgba(255,255,255,0.03))',
      },
      spacing: {
        '0': 'var(--space-0)',
        '0.5': 'var(--space-0\\.5)',
        '1': 'var(--space-1)',
        '1.5': 'var(--space-1\\.5)',
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
        base: 'var(--z-base)',
        above: 'var(--z-above)',
        sidebar: 'var(--z-sidebar)',
        header: 'var(--z-header)',
        dropdown: 'var(--z-dropdown)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
      opacity: {
        '5': 'var(--opacity-5)',
        '10': 'var(--opacity-10)',
        '20': 'var(--opacity-20)',
        '50': 'var(--opacity-50)',
      },
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        'x-slow': 'var(--duration-x-slow)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        in: 'var(--ease-in)',
        'in-out': 'var(--ease-in-out)',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-slow) var(--ease-out) forwards',
        'slide-up': 'slideUp var(--duration-slow) var(--ease-out) forwards',
        'spin-slow': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
```

---

## 5. Step-by-Step Implementation Plan

### Step 1: Pre-implementation Checks & Branch Setup
- Create a clean git branch `feature/m1-design-tokens`.
- Execute `npm run lint` and `npm run build` to confirm there are no existing errors on main.

### Step 2: Inject Design Token CSS variables into `src/index.css`
- Open `src/index.css`.
- Locate `@layer base { :root { ... } }` and replace the existing variables with the comprehensive list defined in Section 3.2.
- Define light mode overrides in `.light { ... }` block inside `@layer base`.
- Add legacy CSS variable compatibility aliases to `:root` and `.light` blocks so that classes like `bg-profit` using `rgb(var(--color-profit))` do not fail.
- Define the deprecated glassmorphism variables (`--glass-*`) in both blocks as aliases pointing to the new tokens.

### Step 3: Update `tailwind.config.js`
- Open `tailwind.config.js`.
- Replace the `theme.extend` section with the configuration code proposed in Section 4.1.
- Make sure to review that all elements (colors, fontFamily, zIndex, transitionDuration, etc.) are properly mapped under `extend` so we preserve standard Tailwind defaults while providing custom tokens.

### Step 4: Local Build & Compilation Verification
- Run `npm run build` to confirm that Vite compilation, PostCSS, and TypeScript compile with no errors.
- Run `npm run lint` to verify that Tailwind CSS configurations do not raise static warnings.

### Step 5: Browser Verification & Theme Toggle QA
- Run `npm run dev` to launch the local application.
- Open Chrome/Firefox DevTools:
  - Inspect `:root` and check if all new custom properties exist with their exact values.
  - In the console, execute `document.documentElement.classList.add('light')` and verify that the canvas background, text colors, and borders switch to their light mode equivalents.
  - Perform visual walkthroughs of the Dashboard and Trades views to ensure zero layout Shifts, zero broken borders, and that card glassmorphism remains intact (supported by the glassmorphism aliases).

---

## 6. Verification and Rollback Protocols

### Verification Commands
1. **Compilation**: `npm run build`
   *Expected outcome*: Success exit code, static asset compilation complete.
2. **Linting**: `npm run lint`
   *Expected outcome*: No warnings/errors raised by ESLint.
3. **E2E/Integration**: `npm run test:e2e` (if E2E is set up)
   *Expected outcome*: All tests pass.

### Rollback Commands
If layout regressions or CSS compilation issues arise:
1. Revert CSS and Tailwind config changes:
   ```bash
   git checkout src/index.css tailwind.config.js
   ```
2. Clear Vite cache and restart:
   ```bash
   npm run dev -- --force
   ```
