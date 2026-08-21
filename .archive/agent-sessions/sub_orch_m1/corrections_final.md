# Corrections: Milestone 1 — Global Design Tokens Redesign (Final Polish)

## 1. Eliminate Keyframe Collision
In `src/index.css`, rename `@keyframes fadeIn` to `@keyframes pageFadeIn` (which includes the translate effect), and update `.page-enter` and the `.stagger-*` classes to reference `pageFadeIn` instead of `fadeIn`. This prevents overriding Tailwind's built-in opacity-only `fadeIn` animation.
```css
  /* Page animation */
  .page-enter {
    animation: pageFadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .stagger-1 { animation: pageFadeIn 400ms ease forwards; animation-delay: 50ms; opacity: 0; }
  .stagger-2 { animation: pageFadeIn 400ms ease forwards; animation-delay: 100ms; opacity: 0; }
  .stagger-3 { animation: pageFadeIn 400ms ease forwards; animation-delay: 150ms; opacity: 0; }
  .stagger-4 { animation: pageFadeIn 400ms ease forwards; animation-delay: 200ms; opacity: 0; }
  .stagger-5 { animation: pageFadeIn 400ms ease forwards; animation-delay: 250ms; opacity: 0; }

  @keyframes pageFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
```

## 2. Dynamic Theme Variables in Body Background
In `src/index.css`, change the hardcoded colors in `body` and `.light body` radial-gradients to use `var(--color-accent)` and `var(--color-success)` variables:
```css
  body {
    font-family: 'Outfit', sans-serif;
    color: rgb(var(--color-text-primary));
    min-height: 100vh;
    overflow-x: hidden;
    background-color: rgb(var(--color-base));
    /* Premium subtle radial glows instead of harsh moving gradients */
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(var(--color-accent) / 0.06) 0%, transparent 40%),
      radial-gradient(circle at 85% 30%, rgba(var(--color-success) / 0.04) 0%, transparent 40%);
    background-attachment: fixed;
  }

  .light body {
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(var(--color-accent) / 0.03) 0%, transparent 40%),
      radial-gradient(circle at 85% 30%, rgba(var(--color-success) / 0.02) 0%, transparent 40%);
  }
```

## 3. Dynamic input base background in light mode
In `src/index.css` line 378, change the hardcoded background color for `.light .input-base` from `rgba(255, 255, 255, 0.8)` to use the surface variable:
```css
  .light .input-base {
    background: rgba(var(--color-surface) / 0.8);
  }
```

## 4. Redefine text gradient utility classes to use solid tokens
Redefine `.text-gradient-profit`, `.text-gradient-loss`, and `.text-gradient-accent` in `src/index.css` to render solid colors as requested in the design specs:
```css
  /* Gradient text utilities redefined as solid colors */
  .text-gradient-profit {
    color: rgb(var(--color-success));
  }

  .text-gradient-loss {
    color: rgb(var(--color-danger));
  }

  .text-gradient-accent {
    color: rgb(var(--color-accent-hover));
  }
```

## 5. Verify build and lint
Run `npm run build` and `npm run lint` and verify clean execution.
