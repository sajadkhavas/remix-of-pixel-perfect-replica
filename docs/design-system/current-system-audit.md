# Current Design System Audit

## Scope and governing direction

This audit covers `src/styles.css`, reusable primitives under `src/components/ui`, and the shared UI foundation available at baseline `b0d8e9ba1d0156d18ccb68258a9a650490931d89`.

The governing direction is **Editorial Precision with Cinematic Chapters**. Commerce surfaces remain calm, factual, fast, and comparison-oriented. Cinematic treatments are limited to selected editorial chapters. Brass is punctuation rather than the dominant interface color. Focus, status, and accessibility signals remain independent from brand accent.

`src/components/ui/ProductCard.tsx`, routes, navigation, commerce components, and final page compositions are intentionally excluded.

## System inventory

- Tailwind CSS 4 is integrated through `@import "tailwindcss" source(none)` and `@source "../src"`.
- `tw-animate-css` supplies state animation utilities.
- Radix-backed Accordion, AlertDialog, Checkbox, Dialog, Popover, RadioGroup, Select, Switch, Tabs, Tooltip, and related primitives already exist.
- CVA is already used for reusable variants.
- Vazirmatn, Playfair Display, and DM Mono packages already exist; no font dependency is required in F3B.
- Sonner is already present for toast integration.
- There is no browser DOM test harness in this phase. Bun can cover pure utilities and token contracts.

## Findings

### Semantic color architecture

- **Location:** `src/styles.css`
- **Problem:** Consumer-facing colors use material names such as `gold`, `night`, and `card-dark` instead of semantic roles. Shadcn-compatible roles are incomplete.
- **Severity:** High.
- **Fix in this phase:** Add the complete semantic role mapping and retain temporary compatibility aliases.
- **Deferred owner:** F4–F11 migrate page usage and the integration owner removes aliases after repository-wide verification.

### Invalid font declaration

- **Location:** `src/styles.css`
- **Problem:** An empty `@font-face` has no family or source.
- **Severity:** High.
- **Fix in this phase:** Remove it and continue using the existing Fontsource packages.
- **Deferred owner:** F14A validates font loading in browser.

### Duplicate skeleton definitions

- **Location:** `src/styles.css`
- **Problem:** `skeleton-shimmer` keyframes and utilities are declared more than once with conflicting gradients and timings.
- **Severity:** High.
- **Fix in this phase:** Consolidate them into one neutral semantic skeleton treatment.
- **Deferred owner:** Feature owners match Skeleton dimensions to final layouts.

### Continuous decorative motion

- **Location:** `src/styles.css`
- **Problem:** Shimmer, pulse, floating watch, grain, marquee, and second-hand animations can run indefinitely without a shared stop strategy.
- **Severity:** High.
- **Fix in this phase:** Add reduced-motion and explicit animation-control foundations while preserving compatibility names required by existing pages.
- **Deferred owner:** Feature owners remove unnecessary continuous motion during migration.

### Missing focus and high-contrast contract

- **Location:** `src/styles.css` and shared controls.
- **Problem:** There is no consistent global focus-visible contract and no `forced-colors` adaptation.
- **Severity:** Critical.
- **Fix in this phase:** Add a high-contrast focus ring independent from brass, plus system-color fallbacks.
- **Deferred owner:** F14A performs browser and high-contrast verification.

### Missing selection and safe-area foundations

- **Location:** `src/styles.css`.
- **Problem:** Selection styling, safe-area utilities, shared containers, section spacing, bidi isolation, and logical truncation are absent.
- **Severity:** High.
- **Fix in this phase:** Add a small documented utility set based on semantic tokens and logical properties.
- **Deferred owner:** Feature phases consume these utilities.

### Scrollbar implementation

- **Location:** `src/styles.css`.
- **Problem:** The custom scrollbar is WebKit-only and has no forced-color reset.
- **Severity:** Medium.
- **Fix in this phase:** Add standard `scrollbar-color`, preserve a restrained WebKit fallback, and reset under forced colors.
- **Deferred owner:** F14A verifies browser behavior.

### Typography architecture

- **Location:** `src/styles.css`.
- **Problem:** Base typography has no responsive role scale, mixed-script helpers, or formal Persian and technical roles.
- **Severity:** High.
- **Fix in this phase:** Add responsive typography, script-role families, tabular numeral behavior, and bidi helpers.
- **Deferred owner:** Content and feature phases apply the semantic roles.

### Layout, shape, depth, and motion scales

- **Location:** `src/styles.css`.
- **Problem:** Spacing, widths, control heights, radii, shadows, z-index, opacity, icon size, and motion values are not centralized.
- **Severity:** High.
- **Fix in this phase:** Add shared semantic scales and documented boundaries.
- **Deferred owner:** Feature phases stop inventing local scales.

### Button sizing and loading

- **Location:** `src/components/ui/button.tsx`.
- **Problem:** Existing controls are 36–40px, have no loading contract, and can submit repeatedly.
- **Severity:** High.
- **Fix in this phase:** Normalize primary controls to at least 44px and add busy semantics, a visible spinner, and duplicate-activation protection.
- **Deferred owner:** Async feature owners supply final status messages.

### Input and Textarea states

- **Location:** `src/components/ui/input.tsx` and `src/components/ui/textarea.tsx`.
- **Problem:** Controls are undersized and invalid, read-only, and disabled states are not visually distinct.
- **Severity:** High.
- **Fix in this phase:** Normalize sizing and state selectors while preserving native semantics.
- **Deferred owner:** None.

### Field association

- **Location:** `src/components/ui/form.tsx` and missing framework-independent field primitives.
- **Problem:** React Hook Form association is generally correct, but there is no reusable field contract outside that framework.
- **Severity:** Medium.
- **Fix in this phase:** Preserve the existing Form API and add Field, FieldLabel, FieldControl, FieldDescription, and FieldError.
- **Deferred owner:** Existing forms migrate gradually.

### Dialog and Sheet presentation

- **Location:** `src/components/ui/dialog.tsx` and `src/components/ui/sheet.tsx`.
- **Problem:** Radix correctly owns focus trap, Escape, and return focus, but close controls are undersized, placement is physical, and motion lacks a shared fallback.
- **Severity:** High.
- **Fix in this phase:** Add logical placement, labeled 44px close controls, restrained motion, safe areas, and logical start/end sheet sides.
- **Deferred owner:** F14A verifies interactions and F4/F6 choose contextual sheet placement.

### Breadcrumb direction

- **Location:** `src/components/ui/breadcrumb.tsx`.
- **Problem:** The separator points right in both directions, links lack the shared focus treatment, and labels are English defaults.
- **Severity:** High.
- **Fix in this phase:** Make separators direction-aware, localize defaults, preserve current-page semantics, and improve focus.
- **Deferred owner:** F4/F5 provide route data.

### Feedback states

- **Location:** `src/components/ui/alert.tsx`, `src/components/ui/badge.tsx`, and missing system feedback components.
- **Problem:** Shared feedback does not consistently cover info, success, warning, error, empty, and recoverable failure states.
- **Severity:** High.
- **Fix in this phase:** Add semantic variants, StatusMessage, EmptyState, ErrorState, Spinner, and SectionHeading.
- **Deferred owner:** Feature owners provide factual messages and actions.

### Product-specific UI

- **Location:** `src/components/ui/ProductCard.tsx` and product routes.
- **Problem:** Commercial visuals and status behavior need later normalization.
- **Severity:** Out of scope.
- **Fix in this phase:** None.
- **Deferred owner:** F8 and the relevant commerce phases.

### Prototype page debt

- **Location:** routes and page sections.
- **Problem:** Prototype pages still contain hardcoded colors, physical direction, local spacing, and bespoke states.
- **Severity:** High.
- **Fix in this phase:** Do not edit them; compatibility aliases prevent immediate breakage.
- **Deferred owner:** F4–F11 according to file ownership.

## Accessibility baseline assessment

### Already delegated correctly

- Radix Dialog and AlertDialog provide focus trapping, Escape handling, and return focus.
- Radix Checkbox, RadioGroup, Select, Switch, Tabs, and Accordion provide core keyboard semantics.
- React Hook Form controls already associate labels, descriptions, and errors through generated IDs.

### Missing shared guarantees addressed by F3B

- A consistent focus-visible ring.
- Minimum 44px targets for primary controls.
- A type-level accessible-name requirement for icon-only buttons.
- Reduced-motion fallback for CSS and Radix animation classes.
- Forced-color behavior.
- Logical start/end positioning and direction-aware indicators.
- State communication beyond color.
- Framework-independent Field association.

## Breaking-change strategy

F3B uses an additive migration strategy:

1. Existing prototype aliases remain available temporarily.
2. New semantic roles become the required API for shared components.
3. Shared primitives gain compatible optional props rather than removing existing props.
4. Routes and commercial components are not rewritten in this phase.
5. Physical page-level classes are migrated by their owners from F4 through F11.

This avoids a visual collapse while establishing a production contract for new work.
