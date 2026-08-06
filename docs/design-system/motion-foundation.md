# Motion Foundation

## Purpose

Shared motion explains relationship, hierarchy, and state. It does not compete with watch photography or turn routine commerce into a continuous animation surface.

F3B defines only the common contract. Hero choreography, product gallery behavior, mega menu movement, and cart drawer composition remain with their owning phases.

## Duration

- `duration-instant` (80ms): press feedback.
- `duration-fast` (140ms): exit and small state change.
- `duration-normal` (220ms): dialog, sheet, tooltip, popover, and ordinary entry.
- `duration-slow` (360ms): limited editorial reveal.

A shared control should not exceed the slow duration. Autoplay timing is feature-owned and must expose a pause strategy.

## Easing

- `ease-standard`: ordinary property transition.
- `ease-enter`: decelerating entry that settles without bounce.
- `ease-exit`: faster accelerating exit.

Spring and bounce are not the default KRONOS language.

## Patterns

### Fade

Use when a surface appears in place and spatial relationship is already clear.

```tsx
<div className="ds-motion-fade-in" />
```

### Scale

Use a restrained 0.98-to-1 scale for dialogs or elevated surfaces. Do not combine it with a large translation.

```tsx
<div className="ds-motion-scale-in" />
```

### Logical slide

Sheets use logical start and end rather than hardcoded left and right.

- `.ds-sheet-start` enters from inline start.
- `.ds-sheet-end` enters from inline end.
- CSS direction variables swap travel direction under `dir="rtl"`.

Physical `left` and `right` variants remain as temporary compatibility options for content whose side is truly physical.

### Overlay

Overlay opacity communicates modality. Backdrop blur is optional and must not be required for contrast. Mobile feature owners may remove blur for performance while retaining the semantic overlay color.

## Enter and exit rules

1. Entry may be slightly longer than exit.
2. Content reaches a stable final position.
3. Focus is moved by the primitive, not by animation callbacks.
4. Interaction does not wait for decorative movement.
5. State changes do not animate unrelated siblings.
6. One viewport should not contain competing continuous focal points.

## Reduced motion

The stylesheet applies a global reduced-motion contract:

- animation and transition duration collapse to 0.01ms;
- animation iteration count becomes one;
- smooth scrolling is disabled;
- skeleton shimmer becomes a static surface;
- elements marked `data-autoplay="true"` are paused.

`usePrefersReducedMotion()` is available when component logic must choose between different render behavior. Its server snapshot returns `true`, providing a conservative static SSR result before client preference is known.

```tsx
const reduceMotion = usePrefersReducedMotion();

return reduceMotion ? <StaticMedia /> : <MotionEnabledMedia />;
```

Do not hide content in the reduced-motion branch. The final information hierarchy and controls must remain equivalent.

## Library ownership

- CSS transitions and `tw-animate-css` are preferred for primitive state changes.
- Framer Motion may own component choreography in a feature.
- GSAP may own editorial timelines in a feature.
- The same element must never be controlled by both GSAP and Framer Motion.
- Lenis controls scroll behavior only; it does not become a component animation system.

## Allowed shared motion

- button color and border response;
- focus and selected-state transition;
- tooltip and popover fade;
- dialog fade plus restrained scale;
- sheet logical slide;
- progress inline-size change;
- skeleton loading feedback when motion is allowed.

## Not implemented in F3B

- final Hero timeline;
- product image zoom or gallery swipe;
- mega menu choreography;
- cart drawer content sequencing;
- route transitions;
- scroll-triggered editorial chapters;
- carousel autoplay.

## Verification

Each animated primitive is checked for:

1. keyboard operation before animation completes;
2. final content equivalence under reduced motion;
3. cleanup on unmount;
4. no layout shift caused by entry state;
5. no dual-library ownership;
6. no infinite decorative motion on commerce surfaces;
7. correct logical direction in RTL and LTR.
