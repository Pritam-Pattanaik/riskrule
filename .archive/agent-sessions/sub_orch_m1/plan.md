# Plan: Milestone 1 — Global Design Tokens Redesign

## Synthesis of Explorer Findings

All three Explorers agree on the implementation details for establishing the CSS custom property foundations and configuring Tailwind to support these tokens with backwards-compatibility.

### CSS Custom Properties (`src/index.css`)
We will replace the variables in `:root` and `.light` with the complete tokens list from the specs:
- **Fonts**: Define `--font-sans` (using Geist Sans Stack) and `--font-mono` (Geist Mono Stack).
- **Typography Scale**: Define `--text-xs` (0.6875rem/11px) through `--text-5xl` (3rem/48px).
- **Font Weights**: Define `--font-regular` (400), `--font-medium` (500), `--font-semibold` (600).
- **Surfaces**: Canvas, Surface, Surface Hover, Surface Elevated, Surface Inset defined as RGB triplets.
- **Text**: Primary, Secondary, Tertiary, Disabled, Inverse defined as RGB triplets.
- **Accent & Semantic**: Accent, Accent Hover as triplets. Subtle accent/semantic colors pre-resolved as `rgba` to support theme-specific opacities (10% in dark, 8% in light).
- **Borders & Dividers**: Border, Border Hover, Border Focus, and Divider (rgba with 50% opacity).
- **Radius**: md, lg, xl, full, etc.
- **Shadows**: none, sm, md, lg.
- **Spacing**: space-0 through space-24.
- **Z-Index**: base through toast.
- **Opacity**: 0 through 100.
- **Motion System**: durations and easing curves.
- **Deprecated Glassmorphism Aliases**: Keep `--glass-*` variables pointing to new surface/border variables with appropriate opacities.
- **Legacy CSS Variable Compatibility**: Keep variables like `--color-base` pointing to new variables so compiled styles do not break.

### Tailwind Theme Extensions (`tailwind.config.js`)
We will configure `extend` in `tailwind.config.js` to reference the new custom properties:
- Map both the new tokens (e.g. `canvas`, `surface-elevated`, `accent-subtle`) and the legacy names (e.g. `base`, `profit`, `gold`) to the respective CSS variables.
- Configure fonts, text sizes, rounded edges, shadows, spacing, and z-indices.
- Retain Outfit and JetBrains Mono under font-ui/font-mono aliases temporarily to prevent visual breakdown before font assets are loaded/swapped in Phase 2.

## Implementation Steps for Worker
1. Edit `src/index.css` under the `@layer base` block to inject the new tokens list (dark and light modes) and legacy/glass compatibility aliases.
2. Edit `tailwind.config.js` to extend theme configuration using CSS custom properties for all tokens (colors, fonts, sizes, padding, z-index, animations, transitions).
3. Test locally using compilation (`npm run build`) and linting check (`npm run lint`). Ensure zero errors.
