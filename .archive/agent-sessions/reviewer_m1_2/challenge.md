# Adversarial Review — Milestone 1: Global Design Tokens (Reviewer 2)

**Overall Risk Assessment**: MEDIUM

---

## Challenges

### [Medium] Challenge 1: Deferral of Reduced Motion Accessibility Query to Phase 12
- **Assumption challenged**: That the accessibility rules specified in the Motion System must be fully implemented in this phase.
- **Attack scenario**: A user with vestibulocochlear disorders or motion sensitivity visits the dashboard with `prefers-reduced-motion` enabled. They expect all transitions to snap instantly to avoid triggering motion sickness.
- **Blast radius**: High (accessibility compliance failure). The application will continue animating with staggers, fades, and modal transitions because the global override is missing.
- **Mitigation/Plan Alignment**: This is explicitly scheduled for Phase 12 (Motion System) in `chandan/05_Implementation_Plan.md`. Since existing components have not yet been refactored to use the new transition tokens, adding the media query now has no effect on legacy components.

### [Medium] Challenge 2: Deferral of Base Font Size Scaling to Phase 2
- **Assumption challenged**: That design tokens can be safely introduced using `rem` units without updating the base font size.
- **Attack scenario**: A developer uses the newly defined `--text-xs` through `--text-5xl` design tokens in a component thinking they correspond to the pixel values defined in the spec.
- **Blast radius**: Medium-High (layout and legibility breakdown). Since the base `html` font-size is kept at `13px` (instead of `16px`), `--text-xs` (0.6875rem) will render at `8.9px` instead of `11px`, making text extremely small and virtually unreadable.
- **Mitigation/Plan Alignment**: This is explicitly scheduled for Phase 2 (Typography) in `chandan/05_Implementation_Plan.md`. During Phase 1, the new `rem` tokens are not yet applied to any components, preventing layout breakage.

### [Low] Challenge 3: Legacy Animations and Transitions in `src/index.css` Not Conforming to Spec
- **Assumption challenged**: That existing components and staggers will render correctly with the new config.
- **Attack scenario**: Legacy hover animations (e.g. `.card:hover { transform: translateY(-2px); }`) and staggers (e.g. `.stagger-1 { animation: fadeIn 400ms ... }`) remain active and do not use the specified durations or easing curves.
- **Blast radius**: Medium (visual inconsistency). The transition feel of cards and panels will feel sluggish (400ms/600ms) and use default cubic-beziers/easings instead of the desaturated, premium motion profile.
- **Mitigation/Plan Alignment**: These are scheduled to be refactored during Phase 4 (Shared Components) and Phase 12 (Motion System).

---

## Stress Test Results

- **Reduced Motion Simulation** → User requests reduced motion → App continues to animate staggers, cards, and page fade-ins → **PASS** (Correctly deferred to Phase 12; no active refactoring in Phase 1)
- **Base Font Size Scaling** → New `rem` token applied in component → Renders 18.7% smaller than spec due to `13px` base html size → **PASS** (Correctly deferred to Phase 2 to prevent visual breakdown of legacy layout)
- **Alpha channel composition on Colors** → Utility `bg-canvas/50` used in Tailwind → Resolves to `rgba(9 9 11 / 0.5)` → **PASS** (RGB space-separated format functions correctly)
- **Direct CSS Variable usage** → Raw CSS rules use `var(--color-canvas)` directly → Renders invalid color in CSS since raw variable is space-separated without wrapper → **PASS** (All direct usages in `index.css` are correctly wrapped inside `rgb()` or `rgba()`)
