# Global Design Tokens Proposal — Milestone 1

This document outlines the precise, step-by-step strategy for defining all design tokens as CSS custom properties and mapping them to the Tailwind configuration.

## 1. Executive Summary
The primary objective of Milestone 1 is to establish the global design token architecture by defining all variables as CSS custom properties inside `src/index.css` and mapping them cleanly into `tailwind.config.js`. Since the system uses dark mode by default, the main definitions reside under the `:root` pseudo-selector, with light-mode overrides defined within the `.light` class selector. 

For maximum resilience, all colors are specified as space-separated RGB value triplets. This allows Tailwind to dynamically inject alpha channels via `<alpha-value>` support. Legacy variables and Tailwind properties are preserved as aliases or mapped directly to the new token names to guarantee zero visual or compilation breakdown during migration.

---

## 2. CSS Custom Properties Structure (`src/index.css`)

### 2.1 Font Declarations & Load Rules
To transition the font face from `Outfit` and `JetBrains Mono` to `Geist Sans` and `Geist Mono`, the `@import` statement loading Google Fonts will be replaced with local or CDN-sourced `@font-face` declarations. We leverage `font-display: swap` to prevent FOUT (Flash of Unstyled Text).

```css
/* src/index.css */

/* --- Geist Sans Font-face Declarations --- */
@font-face {
  font-family: 'Geist Sans';
  src: url('/fonts/Geist-Regular.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Sans';
  src: url('/fonts/Geist-Medium.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Sans';
  src: url('/fonts/Geist-SemiBold.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/Geist-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* --- Geist Mono Font-face Declarations --- */
@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/GeistMono-Regular.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono/GeistMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/GeistMono-Medium.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono/GeistMono-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/GeistMono-SemiBold.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono/GeistMono-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

### 2.2 Global Token Declarations
The primary design tokens are declared below. `:root` corresponds to the default Dark Mode, and `.light` defines the Light Mode overrides.

```css
@layer base {
  :root {
    /* --- Fonts --- */
    --font-sans: 'Geist Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'Geist Mono', 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

    /* --- Typography Weights --- */
    --font-regular: 400;
    --font-medium: 500;
    --font-semibold: 600;

    /* --- Typography Scale (16px base) --- */
    --text-xs: 0.6875rem;   /* 11px */
    --text-sm: 0.8125rem;   /* 13px */
    --text-base: 0.9375rem; /* 15px */
    --text-lg: 1.0625rem;   /* 17px */
    --text-xl: 1.25rem;     /* 20px */
    --text-2xl: 1.5rem;     /* 24px */
    --text-3xl: 1.875rem;   /* 30px */
    --text-4xl: 2.25rem;    /* 36px */
    --text-5xl: 3rem;       /* 48px */

    /* --- Colors (RGB Space-Separated Triplets) --- */
    /* Surfaces */
    --color-canvas: 9 9 11;             /* #09090B */
    --color-surface: 22 22 26;          /* #16161A */
    --color-surface-hover: 32 32 36;    /* #202024 */
    --color-surface-elevated: 38 38 42;  /* #26262A */
    --color-surface-inset: 14 14 17;     /* #0E0E11 */

    /* Text */
    --color-text-primary: 237 237 237;   /* #EDEDED */
    --color-text-secondary: 161 161 170; /* #A1A1AA */
    --color-text-tertiary: 113 113 122;  /* #71717A */
    --color-text-disabled: 63 63 70;     /* #3F3F46 */
    --color-text-inverse: 9 9 11;        /* #09090B */

    /* Semantics & Accents */
    --color-accent: 99 102 241;          /* #6366F1 */
    --color-accent-hover: 129 140 248;   /* #818CF8 */
    --color-success: 16 185 129;         /* #10B981 */
    --color-danger: 239 68 68;           /* #EF4444 */
    --color-warning: 245 158 11;         /* #F59E0B */
    --color-info: 59 130 246;            /* #3B82F6 */

    /* Borders */
    --color-border: 39 39 42;            /* #27272A */
    --color-border-hover: 55 55 60;      /* #37373C */
    --color-border-focus: var(--color-accent);

    /* --- Pre-baked Opacity/Complex Colors --- */
    --color-accent-subtle: rgba(var(--color-accent), 0.1);
    --color-success-subtle: rgba(var(--color-success), 0.1);
    --color-danger-subtle: rgba(var(--color-danger), 0.1);
    --color-warning-subtle: rgba(var(--color-warning), 0.1);
    --color-divider: rgba(39, 39, 42, 0.5);

    /* --- Radius --- */
    --radius-none: 0px;
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-xl: 12px;
    --radius-full: 9999px;

    /* --- Shadows --- */
    --shadow-none: none;
    --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 16px -4px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 32px -8px rgba(0, 0, 0, 0.5);

    /* --- Spacing System (4px base) --- */
    --space-0: 0px;
    --space-0-5: 2px;
    --space-1: 4px;
    --space-1-5: 6px;
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

    /* --- Z-Indices --- */
    --z-base: 0;
    --z-above: 10;
    --z-sidebar: 30;
    --z-header: 40;
    --z-dropdown: 50;
    --z-modal-backdrop: 60;
    --z-modal: 70;
    --z-toast: 100;

    /* --- Opacity --- */
    --opacity-0: 0;
    --opacity-5: 0.05;
    --opacity-10: 0.1;
    --opacity-20: 0.2;
    --opacity-50: 0.5;
    --opacity-100: 1;

    /* --- Motion System --- */
    --duration-instant: 0ms;
    --duration-fast: 100ms;
    --duration-normal: 150ms;
    --duration-slow: 250ms;
    --duration-x-slow: 500ms;
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

    /* --- Deprecated Glassmorphism Aliases (Phase 1 Compatibility) --- */
    --glass-bg: rgba(var(--color-surface), 0.6);
    --glass-bg-hover: rgba(var(--color-surface-hover), 0.7);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-shadow: rgba(0, 0, 0, 0.25);
    --glass-shadow-hover: rgba(0, 0, 0, 0.4);
  }

  .light {
    /* --- Colors (Light Theme Overrides) --- */
    /* Surfaces */
    --color-canvas: 250 250 250;         /* #FAFAFA */
    --color-surface: 255 255 255;        /* #FFFFFF */
    --color-surface-hover: 244 244 245;  /* #F4F4F5 */
    --color-surface-elevated: 255 255 255; /* #FFFFFF */
    --color-surface-inset: 245 245 246;   /* #F5F5F6 */

    /* Text */
    --color-text-primary: 23 23 23;      /* #171717 */
    --color-text-secondary: 115 115 115; /* #737373 */
    --color-text-tertiary: 163 163 163;  /* #A3A3A3 */
    --color-text-disabled: 200 200 200;  /* #C8C8C8 */
    --color-text-inverse: 250 250 250;   /* #FAFAFA */

    /* Semantics & Accents */
    --color-accent: 79 70 229;           /* #4F46E5 */
    --color-accent-hover: 99 102 241;    /* #6366F1 */
    --color-success: 5 150 105;          /* #059669 */
    --color-danger: 220 38 38;           /* #DC2626 */
    --color-warning: 217 119 6;          /* #D97706 */
    --color-info: 37 99 235;             /* #2563EB */

    /* Borders */
    --color-border: 229 229 229;         /* #E5E5E5 */
    --color-border-hover: 210 210 210;   /* #D2D2D2 */

    /* --- Pre-baked Opacity/Complex Colors --- */
    --color-accent-subtle: rgba(var(--color-accent), 0.08);
    --color-success-subtle: rgba(var(--color-success), 0.08);
    --color-danger-subtle: rgba(var(--color-danger), 0.08);
    --color-warning-subtle: rgba(var(--color-warning), 0.08);
    --color-divider: rgba(229, 229, 229, 0.5);

    /* --- Shadows --- */
    --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 16px -4px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 32px -8px rgba(0, 0, 0, 0.12);

    /* --- Deprecated Glassmorphism Aliases (Light Overrides) --- */
    --glass-bg: rgba(var(--color-surface), 0.85);
    --glass-bg-hover: rgba(var(--color-surface), 1);
    --glass-border: rgba(0, 0, 0, 0.06);
    --glass-shadow: rgba(0, 0, 0, 0.04);
    --glass-shadow-hover: rgba(0, 0, 0, 0.08);
  }
}
```

### 2.3 HTML Base Adjustments
To normalize the rem scale in accordance with standard browser base settings (16px), the base HTML configuration will be modified, and default variables will be assigned to the body:

```css
@layer base {
  html {
    font-size: 16px; /* Normalize rem scale to 16px base, from previous 13px */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-sans);
    color: rgb(var(--color-text-primary));
    background-color: rgb(var(--color-canvas));
    /* Remove radial background glow coordinates as per Phase 15 polish & design philosophy */
    background-image: none;
    min-height: 100vh;
    overflow-x: hidden;
  }
}
```

---

## 3. Tailwind Configuration Mapping (`tailwind.config.js`)

To enable seamless support for all utility classes, we map the CSS custom properties inside `tailwind.config.js`. 
To ensure that existing code does not break, the old colors (`base`, `accent-light`, `profit`, `loss`, `gold`, `tv-border`) and sizes (`tv-*`) are maintained as legacy aliases that point to the new variables.

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
        // --- Surface Hierarchy ---
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--color-surface-hover) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        'surface-inset': 'rgb(var(--color-surface-inset) / <alpha-value>)',
        
        // --- Accent & Semantics ---
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
        'accent-subtle': 'var(--color-accent-subtle)', // Pre-baked opacity
        
        success: 'rgb(var(--color-success) / <alpha-value>)',
        'success-subtle': 'var(--color-success-subtle)',
        
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        'danger-subtle': 'var(--color-danger-subtle)',
        
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        'warning-subtle': 'var(--color-warning-subtle)',

        info: 'rgb(var(--color-info) / <alpha-value>)',

        // --- Borders ---
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'border-hover': 'rgb(var(--color-border-hover) / <alpha-value>)',
        'border-focus': 'rgb(var(--color-border-focus) / <alpha-value>)',
        divider: 'var(--color-divider)',

        // --- Legacy/Alias Colors (Compatibility Layer) ---
        base: 'rgb(var(--color-canvas) / <alpha-value>)',
        'accent-light': 'rgb(var(--color-accent-hover) / <alpha-value>)',
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
        // --- Text Tokens ---
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        'text-disabled': 'rgb(var(--color-text-disabled) / <alpha-value>)',
        'text-inverse': 'rgb(var(--color-text-inverse) / <alpha-value>)',

        // --- Legacy Text Aliases ---
        primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        muted: 'rgb(var(--color-text-tertiary) / <alpha-value>)', // Maps muted -> tertiary
        inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        
        // --- Legacy Alias ---
        ui: ['var(--font-sans)'],
      },
      fontSize: {
        // --- Typography scale tokens ---
        xs: ['var(--text-xs)', { lineHeight: '1' }],
        sm: ['var(--text-sm)', { lineHeight: '1.5' }],
        base: ['var(--text-base)', { lineHeight: '1.5' }],
        lg: ['var(--text-lg)', { lineHeight: '1.3' }],
        xl: ['var(--text-xl)', { lineHeight: '1.2' }],
        '2xl': ['var(--text-2xl)', { lineHeight: '1.2' }],
        '3xl': ['var(--text-3xl)', { lineHeight: '1.2' }],
        '4xl': ['var(--text-4xl)', { lineHeight: '1.2' }],
        '5xl': ['var(--text-5xl)', { lineHeight: '1.2' }],

        // --- Legacy FontSize Aliases ---
        'tv-xs': ['var(--text-xs)', { letterSpacing: '0.05em' }],
        'tv-sm': ['var(--text-sm)', { lineHeight: '1.5' }],
        'tv-base': ['var(--text-sm)', { lineHeight: '1.5' }],
        'tv-md': ['var(--text-base)', { lineHeight: '1.4' }],
        'tv-lg': ['var(--text-lg)', { lineHeight: '1.3' }],
        'tv-xl': ['var(--text-xl)', { lineHeight: '1.2' }],
        'tv-2xl': ['var(--text-2xl)', { lineHeight: '1.2' }],
      },
      borderRadius: {
        // --- Radius Tokens ---
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',

        // --- Legacy Radius Aliases ---
        'tv-sm': 'var(--radius-sm)',
        'tv-md': 'var(--radius-md)',
        'tv-lg': 'var(--radius-lg)',
        'tv-xl': 'var(--radius-md)',
        'tv-2xl': 'var(--radius-xl)',
        'tv-3xl': 'var(--radius-xl)',
      },
      boxShadow: {
        // --- Shadow Tokens ---
        none: 'var(--shadow-none)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: {
        // --- Spacing scale tokens ---
        '0': 'var(--space-0)',
        '0.5': 'var(--space-0-5)',
        '1': 'var(--space-1)',
        '1.5': 'var(--space-1-5)',
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
    },
  },
  plugins: [],
}
```

---

## 4. Step-by-Step Strategy & Implementation Plan

### Step 4.1: Download or Provision Geist Font Files
1. Create a public folder for fonts: `public/fonts/` (if it does not exist).
2. Download or copy `woff2` files for `Geist Sans` and `Geist Mono` (Regular, Medium, SemiBold weights) and place them in the folder.
3. As a fallback, ensure that CDN URLs are linked in the CSS `@font-face` definitions (using JS delivr packages like `geist` package).

### Step 4.2: Update `<head>` in `index.html`
1. Inject the preload tags for Geist Sans (Regular and Medium) inside `<head>` to minimize layout shifts on initial paint:
   ```html
   <link rel="preload" href="/fonts/Geist-Regular.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="preload" href="/fonts/Geist-Medium.woff2" as="font" type="font/woff2" crossorigin>
   ```

### Step 4.3: Refactor `src/index.css`
1. Open `src/index.css`.
2. Replace lines 1-1 ("Outfit" google font import) with the new `@font-face` declarations.
3. Under the `:root` selector, remove outdated variables and introduce the standardized custom property block, including the deprecated glassmorphism variables mapped as aliases.
4. Under the `.light` selector, configure overrides for colors and shadows.
5. In the `html` block, shift `font-size` from `13px` to `16px`.
6. In the `body` block, update `font-family` to `var(--font-sans)` and set `background-color` to `rgb(var(--color-canvas))`. Clear the custom radial background glows.

### Step 4.4: Refactor `tailwind.config.js`
1. Inject the mapped custom properties under the `theme.extend` key.
2. Carefully retain the legacy aliases pointing to their new property equivalents. This guarantees that current tailwind classes (e.g. `bg-base`, `text-muted`, `rounded-tv-xl`) continue working without errors.

### Step 4.5: Validate and Perform Verification Checks
1. Compile the app via `npm run build` or `npm run dev` to verify compilation.
2. Confirm variables appear in browser DevTools.
3. Verify light/dark theme switching updates all layout colors instantly.

---

## 5. Risks & Mitigation Plan

1. **Global Size Increase (13px -> 16px font-size)**
   - *Risk*: Modifying the base font-size from `13px` to `16px` will automatically scale up all rem-based sizes. This could make buttons, paddings, and components look larger and disrupt layout integrity prior to Phase 2/3/4 implementation.
   - *Mitigation*: This scaling is planned and intentional. During Phase 1, temporary adjustments can be made if needed, but since we are keeping legacy font-size aliases (`tv-sm`, `tv-base`, etc.) mapped to custom sizes, it maintains alignment. Phase 2 and 4 will fully refactor these components to fit the new design structure.
   
2. **Glassmorphism Breakdowns**
   - *Risk*: Deleting the `--glass-*` variables immediately will break styles on existing cards, tables, and badge elements because Phase 4 is when those elements are refactored.
   - *Mitigation*: We preserve the `--glass-*` custom properties as aliases of `--color-surface` and other relevant color tokens inside `index.css`. They will be safely removed only in Phase 4 when no source files reference them.

3. **FOUT (Flash of Unstyled Text)**
   - *Risk*: A visual swap flash from the default stack to Geist Sans on slow connections.
   - *Mitigation*: We leverage HTML preload links and `font-display: swap` to ensure fonts load instantly or swap cleanly.
