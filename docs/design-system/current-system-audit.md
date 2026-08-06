# Current Design System Audit

## Scope and governing direction

This audit covers `src/styles.css`, reusable primitives under `src/components/ui`, and the shared UI foundation available at baseline `b0d8e9ba1d0156d18ccb68258a9a650490931d89`.

The governing visual direction is **Editorial Precision with Cinematic Chapters**. Commerce surfaces must remain calm, factual, fast, and comparison-oriented. Cinematic treatments are limited to selected editorial chapters. Brass is punctuation rather than the dominant interface color. Focus, status, and accessibility signals remain independent from brand accent.

`src/components/ui/ProductCard.tsx`, routes, navigation, commerce components, and final page compositions are intentionally excluded.

## System inventory

- Tailwind CSS 4 is integrated through `@import "tailwindcss" source(none)` and `@source "../src"`.
- `tw-animate-css` supplies state animation utilities.
- The repository already contains Radix-backed Accordion, AlertDialog, Checkbox, Dialog, Popover, RadioGroup, Select, Switch, Tabs, Tooltip, and related primitives.
- CVA is already used for Button, Badge, Alert, Sheet, Toggle, and related variants.
- Vazirmatn, Playfair Display, and DM Mono packages already exist; no font dependency is required in F3B.
- Sonner is already present for toast integration.
- There is no browser DOM test harness in this phase. Pure utility and type-level behavior can be covered with Bun tests.

## Findings

| Location | Problem | Severity | Fix in this phase | Deferred owner |
| --- | --- | --- | --- | --- |
| `src/styles.css` | Consumer-facing colors use material names such as `gold`, `night`, and `card-dark` instead of semantic roles. | High | Add complete semantic tokens while retaining temporary compatibility aliases. | F4–F11 migrate page usage. |
| `src/styles.css` | Shadcn-compatible roles such as card, popover, secondary, accent, destructive, input, and ring are incomplete. | High | Define the complete role mapping. | None. |
| `src/styles.css` | `@font-face` has no family or source and is invalid. | High | Remove it; existing Fontsource packages remain the source of font faces. | F14A validates font loading in browser. |
| `src/styles.css` | `skeleton-shimmer` keyframe is declared twice. | Medium | Consolidate to one low-contrast definition. | None. |
| `src/styles.css` | `skeleton-shimmer` utility is declared twice with conflicting gradients and timings. | High | Consolidate to one semantic skeleton utility. | None. |
| `src/styles.css` | Gold shimmer, badge pulse, floating watch, grain, marquee, and rotating second-hand can run indefinitely without a shared stop strategy. | High | Add reduced-motion and explicit animation-control foundations; keep only compatibility names required by current pages. | Feature owners remove decorative continuous motion during migration. |
| `src/styles.css` | Canvas, text, scrollbar, skeleton, glow, and status colors are hardcoded across utilities. | High | Route shared utilities through semantic tokens. | Page-specific hardcoded values remain with page owners. |
| `src/styles.css` | No visible global `:focus-visible` contract exists. | Critical | Add a high-contrast focus ring with offset independent from brass. | F14A browser verification. |
| `src/styles.css` | No `forced-colors` adaptation exists. | High | Add system-color focus, border, and status fallbacks. | F14A high-contrast browser verification. |
| `src/styles.css` | No selection styling exists. | Low | Add semantic selection background and text. | None. |
| `src/styles.css` | No safe-area, shared container, section-spacing, bidi isolation, or logical truncation utilities exist. | High | Add a small documented utility set. | Feature phases consume utilities. |
| `src/styles.css` | Custom scrollbar is WebKit-only, physically sized, and lacks standard `scrollbar-color`. | Medium | Keep a restrained scrollbar with standard fallback and forced-color reset. | F14A visual/browser verification. |
| `src/styles.css` | Base typography lacks responsive scale roles, readable Persian line height, and mixed-script helpers. | High | Add responsive typography and script-role tokens. | Content phases apply semantic roles. |
| `src/styles.css` | Spacing, widths, control heights, radii, shadows, z-index, opacity, and motion values have no centralized architecture. | High | Add shared semantic scales. | Feature phases stop inventing local values. |
| `src/components/ui/button.tsx` | Default and large controls are 36px and 40px; icon control is 36px. | High | Normalize primary controls to a minimum 44px touch target. | None. |
| `src/components/ui/button.tsx` | Button has no loading contract and can submit repeatedly. | High | Add `loading`, busy semantics, visible spinner, and duplicate-activation protection. | Async feature owners provide final messages. |
| `src/components/ui/button.tsx` | Focus relies on a one-pixel ring and an incomplete token. | High | Adopt the shared focus-visible contract. | None. |
| `src/components/ui/input.tsx` | Input is 36px and lacks explicit invalid, read-only, and disabled state differentiation. | High | Normalize height and state selectors. | None. |
| `src/components/ui/textarea.tsx` | Minimum height is 60px and invalid/read-only states are not designed. | Medium | Normalize sizing and state selectors. | None. |
| `src/components/ui/form.tsx` | React Hook Form association is generally correct, but messages are small and state styling depends on incomplete tokens. | Medium | Preserve API; rely on semantic token completion and add a framework-independent Field primitive. | Existing forms migrate gradually. |
| `src/components/ui/dialog.tsx` | Focus trap, Escape, and return focus are correctly delegated to Radix. Close placement uses physical `right`, label is English, target is below 44px, and animation lacks a system fallback. | High | Normalize close control, logical inset, Persian accessible name, and reduced-motion classes. | F14A interaction verification. |
| `src/components/ui/sheet.tsx` | Sides are physical left/right, default assumes right, close control is physical, and open duration is 500ms. | High | Add logical start/end sides, shorter motion, accessible close, and reduced-motion fallback. | F4/F6 choose contextual side. |
| `src/components/ui/breadcrumb.tsx` | Separator points right in both directions, links lack an explicit focus style, labels are English, and displayName contains a typo. | High | Make separator direction-aware, localize defaults, and improve focus. | F4/F5 provide route data. |
| `src/components/ui/alert.tsx` | Only default/destructive states exist; icon layout uses physical left padding; every message is an assertive alert. | High | Add info, success, warning, and error roles with logical layout and configurable live semantics. | Feature owners choose urgency. |
| `src/components/ui/skeleton.tsx` | Skeleton uses brand-primary pulse and has no semantic or reduced-motion foundation. | High | Use skeleton role tokens and static reduced-motion behavior. | Feature owners match final layout dimensions. |
| `src/components/ui/badge.tsx` | Existing variants do not cover shared neutral/status states consistently. | Medium | Add non-commercial status variants only. | Product badges remain F8-owned. |
| `src/components/ui/*` | Several primitive files mix component exports with constants, producing existing Fast Refresh warnings. | Medium | Do not broaden refactors solely to silence warnings; document migration boundaries. | F14A / integration owner. |
| `src/components/ui/*` | Generic EmptyState, ErrorState, StatusMessage, SectionHeading, Spinner, IconButton, LinkButton, SkipLink, and VisuallyHidden are missing. | High | Add reusable non-commercial components. | Feature owners supply factual content. |
| `src/components/ui/*` | Tooltip exists but can be mistakenly used as the only accessible name. | Medium | Document that labels remain mandatory; IconButton requires a label at type level. | F4–F11 migration. |
| `src/components/ui/ProductCard.tsx` | Commercial card has its own visuals and state behavior. | Out of scope | No change. | F8. |
| Routes and page sections | Hardcoded colors, spacing, physical direction, and bespoke states remain in prototype pages. | High | Do not change in F3B; compatibility aliases prevent immediate breakage. | Owning F4–F11 phases. |

## Accessibility baseline assessment

### Already delegated correctly

- Radix Dialog and AlertDialog provide focus trapping, Escape handling, and return focus.
- Radix Checkbox, RadioGroup, Select, Switch, Tabs, and Accordion provide core keyboard semantics.
- React Hook Form controls already associate labels, descriptions, and errors through generated IDs.

### Missing shared guarantees

- A consistent focus-visible ring on every surface.
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