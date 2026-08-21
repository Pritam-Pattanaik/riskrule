# Corrections: Milestone 1 — Global Design Tokens Redesign

## 1. CSS Syntax Errors (Mixed Separators)
Any space-separated RGB custom property used inside `rgba()` must use the slash separator `/` instead of a comma.
For example, inside `:root` in `src/index.css`:
```css
--glass-bg: rgba(var(--color-surface) / 0.6);
--glass-bg-hover: rgba(var(--color-surface-hover) / 0.7);
```
Inside `.light` in `src/index.css`:
```css
--glass-bg: rgba(var(--color-surface) / 0.85);
--glass-bg-hover: rgba(var(--color-surface) / 1);
```

## 2. Refactor Subtle/Divider Colors to use RGB Triplets
To ensure maximum consistency and avoid hardcoded values, rewrite the subtle semantic and divider colors to use `rgba(var(--token) / opacity)`:
Inside `:root` (dark):
```css
--color-accent-subtle: rgba(var(--color-accent) / 0.1);
--color-success-subtle: rgba(var(--color-success) / 0.1);
--color-danger-subtle: rgba(var(--color-danger) / 0.1);
--color-warning-subtle: rgba(var(--color-warning) / 0.1);
--color-divider: rgba(var(--color-border) / 0.5);
```
Inside `.light` (light):
```css
--color-accent-subtle: rgba(var(--color-accent) / 0.08);
--color-success-subtle: rgba(var(--color-success) / 0.08);
--color-danger-subtle: rgba(var(--color-danger) / 0.08);
--color-warning-subtle: rgba(var(--color-warning) / 0.08);
--color-divider: rgba(var(--color-border) / 0.5);
```

## 3. Define Neumorphic Shadow Variables
Define `--shadow-dark` and `--shadow-light` variables inside `src/index.css` to prevent flat rendering of neomorphic shadows.
Inside `:root` (dark):
```css
--shadow-dark: rgba(0, 0, 0, 0.3);
--shadow-light: rgba(255, 255, 255, 0.03);
```
Inside `.light` (light):
```css
--shadow-dark: rgba(0, 0, 0, 0.08);
--shadow-light: rgba(255, 255, 255, 0.9);
```

## 4. Animation and Keyframe Migrations in `tailwind.config.js` and `src/index.css`
Update animations in `tailwind.config.js` to use CSS variables for duration and easing:
```javascript
      animation: {
        'fade-in': 'fadeIn var(--duration-slow) var(--ease-out) forwards',
        'slide-up': 'slideUp var(--duration-slow) var(--ease-out) forwards',
        'spin-slow': 'spin 1s linear infinite',
      },
```
Update keyframes in `tailwind.config.js` (and any related index.css keyframes) to conform to the specifications:
- `slideUp` must translate from `translateY(10px)` (instead of `scale` or `translateY(20px)` or `translateY(8px)`).
Let's make sure the keyframes are:
```javascript
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
```
In `src/index.css`, locate the legacy `.card:hover` rules and other elements that have been marked for migration.
Specifically, in `src/index.css`:
- Remove `transform: translateY(-2px);` from `.card:hover` to use background-color shift only.
- Locate `slideUp` or animation classes like `.animate-slide-up` and make sure they use the new variables.

## 5. Build and Verify
Ensure you run `npm run build` and `npm run lint` and verify success.
