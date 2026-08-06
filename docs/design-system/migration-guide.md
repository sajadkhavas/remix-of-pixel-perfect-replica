# Design System Migration Guide

## Migration policy

F3B is additive. Existing routes are not mass-rewritten in this phase. Feature owners migrate only the files they own and keep each change reviewable.

Every migration follows this order:

1. Replace raw shared values with semantic tokens.
2. Replace duplicate controls with existing shared primitives.
3. Add complete default, hover, focus-visible, active, disabled, loading, empty, error, and success behavior as relevant.
4. Verify RTL and mixed technical text.
5. Verify 320px touch and layout behavior.
6. Verify forced colors and reduced motion.
7. Run the complete quality gate.

Do not preserve a visual prototype bug by weakening accessibility in the shared component.

## Compatibility aliases

The following aliases remain temporarily available in `src/styles.css`:

- `gold`, `gold-light`, and `gold-dark`;
- `night`, `card-dark`, `border-dark`, and `charcoal`;
- `offwhite`, `mute`, and `cream`.

They exist only to prevent immediate route breakage. New work uses semantic roles. The integration owner removes an alias only after repository search confirms no consumer remains.

## F4: Discovery and catalog

Migrate:

- filter and sort controls to Button, IconButton, Select, Checkbox, RadioGroup, Sheet, and Field;
- result metadata to semantic text roles;
- loading grids to layout-matched Skeletons;
- zero results to EmptyState;
- request failures to ErrorState or StatusMessage;
- category trails to Breadcrumb;
- URL-based page navigation to Pagination.

Verify:

- mobile filters open from logical end unless product requirements specify start;
- filter state is not communicated by brass alone;
- technical query fragments remain isolated;
- browser back, forward, refresh, and deep links preserve state;
- no Design System component owns catalog URL policy.

Do not create ProductBadge or modify ProductCard in F4 through F3B files.

## F5: Product detail

Migrate:

- option controls to Button, RadioGroup, Select, and StatusMessage;
- unavailable variants to explicit disabled plus out-of-stock text;
- size or technical help to Dialog, Sheet, Popover, or Accordion according to content length;
- async purchase state to loading-safe Button;
- reference, SKU, and specification values to technical typography and bidi isolation;
- related section headers to SectionHeading.

Verify:

- gallery and zoom controls use labeled IconButton;
- image motion has a reduced-motion equivalent;
- price and currency order remains correct;
- product claims come from the domain contract.

Product Gallery, Price, ProductBadge, and commercial card behavior remain feature-owned.

## F6: Cart and purchase side surfaces

Migrate:

- cart panel shell to Sheet with logical side;
- quantity actions to labeled controls with 44px targets;
- mutation progress to loading Button, Spinner, or StatusMessage;
- empty cart to EmptyState;
- failed updates to persistent ErrorState or StatusMessage.

Verify:

- focus returns to the cart trigger;
- Escape works;
- failed mutations do not silently close the panel;
- mobile safe-area bottom is respected;
- final cart sequencing is not duplicated in shared primitives.

## F7: Authentication and account entry

Migrate:

- fields to Field or the existing React Hook Form wrappers;
- email and phone inputs to LTR value direction inside RTL forms;
- submit controls to loading-safe Button;
- form-level errors to StatusMessage;
- focused auth tasks to Dialog only when the route architecture requires it.

Verify:

- every control has a visible label;
- descriptions and errors are associated;
- disabled and read-only are not confused;
- OTP and password behaviors keep native autocomplete and input-mode semantics.

## F8: Product cards and merchandising

F8 owns `src/components/ui/ProductCard.tsx` and all product-specific display components.

Consume from F3B:

- tokens for surface, text, border, focus, skeleton, motion, and status;
- Button or IconButton for actions;
- Skeleton for card loading;
- VisuallyHidden for necessary action names.

Do not copy generic Button, Badge, Skeleton, or focus styles into ProductCard. Product status roles require verified data and must not be inferred from decorative copy.

## F9: Content, editorial, and trust surfaces

Migrate:

- section framing to SectionHeading and shared containers;
- long content to compact/content widths and readable body measure;
- disclosures to Accordion;
- factual notices to StatusMessage;
- navigation trails to Breadcrumb.

Verify:

- cinematic spacing is limited to editorial chapters;
- ordinary information remains calm and scannable;
- Latin display font is used only for intentional brand moments;
- unverified guarantees are not introduced through component examples.

## F10: Checkout and transaction forms

Migrate:

- all controls to Field-associated primitives;
- section feedback to StatusMessage;
- blocking failure to ErrorState with recovery;
- determinate steps to Progress with a visible label;
- final submission to loading-safe Button;
- destructive confirmation to AlertDialog.

Verify:

- focus moves to the first invalid summary or field according to checkout design;
- errors remain visible after toast dismissal;
- disabled submit is accompanied by an explanation when the reason is not obvious;
- price, currency, address, phone, and email direction are correct;
- no checkout business logic enters shared UI components.

## F11: Shell, navigation, and responsive integration

Migrate:

- icon-only shell actions to IconButton;
- mobile panels to Sheet with logical placement;
- skip navigation to SkipLink;
- shell notices to StatusMessage when persistent;
- shared spacing to safe-area and sticky-offset tokens.

Verify:

- one main-content target exists;
- keyboard order follows visual and reading order;
- route and mega-menu focus behavior is tested in browser;
- mobile navigation is intentionally composed rather than a scaled desktop copy;
- Navbar, Footer, and MobileTabBar remain owned by F11, not F3B.

## Component replacement map

Use these replacements during feature work:

- bespoke action class → Button;
- icon-only clickable div → IconButton;
- anchor styled as action → LinkButton;
- manually associated label/error → Field;
- raw overlay and focus code → Dialog or Sheet;
- generic colored notice → StatusMessage;
- empty collection markup → EmptyState;
- failed collection markup → ErrorState;
- local spinner SVG → Spinner;
- brand-colored placeholder → Skeleton;
- raw section title stack → SectionHeading;
- hand-written breadcrumb separators → Breadcrumb;
- hidden text utility duplication → VisuallyHidden;
- custom main-content jump → SkipLink.

## State checklist per migrated component

Confirm only relevant states, but do not omit one silently:

- default;
- hover;
- focus-visible;
- active;
- selected;
- disabled;
- read-only;
- loading;
- error;
- success;
- warning;
- empty;
- forced colors;
- reduced motion.

State differences include text, icon, shape, boundary, or semantic attributes. Color alone is insufficient.

## RTL checklist

- Replace physical padding, margin, and inset with logical equivalents.
- Isolate brand, reference, SKU, email, phone, price, and technical fragments.
- Verify chevrons and previous/next arrows.
- Do not mirror neutral icons, photography, or brand marks.
- Test component-level `dir="ltr"` islands inside the Persian page.
- Test truncation at 320px.

## Motion checklist

- Use shared duration and easing tokens.
- Prefer CSS state transitions for primitives.
- Assign one animation owner per element.
- Provide equivalent static content under reduced motion.
- Pause autoplay and continuous decorative motion.
- Do not delay keyboard interaction for animation.

## Temporary exceptions

An owning phase may request an exception when:

- a Radix primitive cannot represent a confirmed interaction requirement;
- a commercial component requires a domain-specific API;
- a browser test exposes a concrete accessibility conflict;
- a visual requirement cannot be expressed with existing tokens without breaking the governing direction.

The request documents location, requirement, alternatives, accessibility effect, RTL effect, bundle effect, and intended owner. It does not directly edit F3B files without coordination.

## Completion evidence

A migrated feature reports:

- changed files;
- removed local duplicates;
- tokens and primitives consumed;
- keyboard and focus verification;
- RTL and 320px verification;
- reduced-motion and forced-color verification;
- quality commands and results;
- remaining dependency requests for F14A browser harness.
