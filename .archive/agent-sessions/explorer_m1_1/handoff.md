# Handoff Report — Explorer 1 (Milestone 1: Global Design Tokens)

## 1. Observation
- **HTML Base Font Size and Font Families**:
  - In `src/index.css` (line 67): `html { font-size: 13px; }`.
  - In `src/index.css` (line 73): `body { font-family: 'Outfit', sans-serif; }`.
  - In `src/index.css` (line 115): `.font-number { font-family: 'JetBrains Mono', monospace; }`.
  - The design specification `chandan/01_Design_System.md` §3.1 requires transitioning to `'Geist Sans'` and `'Geist Mono'`, and §3.2 (line 64) notes: "The base `html` font-size is set to `16px` (browser default). All rem values are relative to this. The existing codebase uses `font-size: 13px` on `html` — this MUST be changed to `16px` to normalize the rem scale."
- **Glassmorphism Variables**:
  - In `src/index.css` (lines 35-39), deprecated variables like `--glass-bg`, `--glass-border`, and `--glass-shadow` are defined.
  - In `src/index.css` (line 129-138), the `.card` class relies heavily on `var(--glass-bg)`, `var(--glass-border)`, and `var(--glass-shadow)`.
  - The implementation plan `chandan/05_Implementation_Plan.md` (line 29) states: "Removing old `--glass-*` variables before updating components that reference them will break styles. Mitigation: Keep old variables as aliases initially, remove in Phase 4."
- **Tailwind Extension Mappings**:
  - In `tailwind.config.js` (lines 10-40), the configuration extends theme colors using `--color-base`, `--color-surface`, `--color-accent`, etc. with the `<alpha-value>` placeholder.
  - In `tailwind.config.js` (lines 47-50), custom font families map `ui` to `Outfit` and `mono` to `JetBrains Mono`.

---

## 2. Logic Chain
1. **Base HTML font-size conversion**: If base font size increases from 13px to 16px, any existing component styled with `rem` values will scale up by approximately 23%. This is a known risk. To mitigate this without breaking the UI during incremental phases, the Tailwind configuration fontSize key must retain legacy aliases (such as `tv-sm`, `tv-base`) but map them to customized pixel dimensions or normalized values during the transition.
2. **Glassmorphism alias preservation**: Since the `.card`, `.badge`, and other UI classes directly reference `--glass-bg` and other variables in `src/index.css`, deleting these variables in Phase 1 will cause severe styling failures. Keeping them as aliases (pointing to new custom properties or holding static values) resolves this risk until they are refactored out in Phase 4.
3. **RGB Triplets and dynamic alpha**: Defining color tokens as `R G B` space-separated triplets (e.g. `9 9 11`) inside `:root` enables Tailwind's opacity modifier syntax (e.g. `bg-accent/50`) to work correctly via the `'rgb(var(--token) / <alpha-value>)'` theme configuration. Static/complex colors (like `var(--color-accent-subtle)`) that contain pre-baked opacity (e.g., `rgba(var(--color-accent), 0.1)`) must be mapped in Tailwind as static string values without the `<alpha-value>` wrapper.

---

## 3. Caveats
- **Offline font loading**: As the environment operates in CODE_ONLY mode without external network access, referencing CDN woff2 files in `@font-face` might fail to render if internet connectivity is missing on the client machine. The local font files must be placed directly in `/public/fonts/` as the primary source.
- **Visual side-effects of 16px base size**: We assume that component layouts will temporarily look larger. The implementer must expect this change and proceed knowing it is aligned with the overall plan.

---

## 4. Conclusion
To establish the global design tokens without breaking existing styling:
1. Define all design tokens as custom properties in `:root` (dark mode default) and override them in `.light` in `src/index.css`.
2. Map these custom properties into `tailwind.config.js` while maintaining compatibility aliases for colors (`base`, `profit`, etc.), text colors (`primary`, `secondary`, `muted`), fonts (`ui`), sizes (`tv-*`), and radii (`tv-*`).
3. Retain deprecated `--glass-*` variables inside CSS as aliases.
4. ReplaceOutfit/JetBrains Mono with Geist Sans/Geist Mono via `@font-face` declarations.

The strategy has been finalized and written in detail to:
`c:\Users\HP\OneDrive\Desktop\trade\journal\.agents\explorer_m1_1\analysis.md`

---

## 5. Verification Method
After implementation, verify using:
1. **Compilation Check**: Run `npm run build` or `npm run dev` to ensure no syntax errors in `tailwind.config.js` or `src/index.css`.
2. **DevTools Variable Validation**: Open browser developer console, inspect the `:root` and `.light` nodes, and verify all tokens (such as `--color-canvas`, `--space-4`) are loaded and change when toggling themes.
3. **Contrast and Rendering Check**: Ensure card surfaces, buttons, and text elements render without visual degradation.
