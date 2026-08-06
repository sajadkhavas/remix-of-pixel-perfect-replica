# F14A Manual QA Protocol

## Purpose

This protocol is the human release complement to automated format, lint, type, unit, contract, scanner, browser, accessibility, asset, and performance gates. A release candidate is not approved until the matrix is executed against the exact candidate SHA and signed by named reviewers.

## Test record

Record for every session:

- candidate SHA and environment URL;
- tester name, date, browser/version, operating system, device, viewport, DPR, input mode, network profile, and language;
- route and state tested;
- result: pass, fail, blocked, or not applicable;
- issue link, screenshot/video/trace, severity, owner phase, and retest result.

## Mandatory viewports

Test all primary journeys at:

- 320 × 568;
- 360 × 800;
- 375 × 812;
- 390 × 844;
- 430 × 932;
- 768 × 1024;
- 1024 × 768;
- 1280 × 800;
- 1440 × 900;
- 1920 × 1080.

At minimum, homepage, navigation/search, shop/filter, product, cart, checkout/account when implemented, one content page, one legal page, empty/error/loading states, and 404 must be covered at every breakpoint family.

## Browser and device matrix

- current stable Chrome desktop;
- current stable Firefox desktop;
- current stable Safari or Playwright WebKit approximation, with final Safari hardware confirmation;
- Edge-compatible Chromium;
- Android Chrome profile on a real or representative device;
- iOS Safari profile on a real or representative device.

Record any browser-specific fallback. Do not mark WebKit automation as full Safari hardware approval.

## Input modes

### Mouse and trackpad

- hover never hides required information;
- cursor and affordance match behavior;
- drawers, modals, menus, sliders, gallery, filters, and cart actions remain predictable;
- scroll is not trapped and horizontal overflow is intentional.

### Keyboard only

- start at the address bar and complete each primary journey without a pointer;
- verify logical Tab/Shift+Tab order, visible focus, Enter/Space activation, Escape dismissal, arrow-key behavior where applicable, focus restoration, no keyboard trap, and skip/recovery navigation;
- test mobile-menu trigger and close behavior at narrow viewport;
- confirm disabled controls do not receive misleading focus or action.

### Touch

- no action depends on hover;
- targets are comfortably tappable and separated;
- swipe, pinch/zoom, carousel, drawer, gallery, quantity, filters, and sticky controls do not conflict with page scrolling;
- safe areas are respected at notched devices and the mobile bottom bar does not cover content.

## Assistive technology checklist

Use at least one desktop screen reader and one mobile screen reader where release scope permits:

- NVDA or JAWS with Chrome/Firefox on Windows;
- VoiceOver with Safari on macOS/iOS;
- TalkBack with Chrome on Android.

Verify document title, language, landmarks, headings, navigation names, link/button names, form instructions/errors, status announcements, modal naming/focus, product image alternatives, price/stock reading order, table semantics, toast announcements, and recovery paths.

## Display and preference modes

### 200% zoom

- no clipped text, lost controls, two-dimensional scrolling for ordinary content, or overlap;
- reflow remains usable at 320 CSS pixels where applicable;
- sticky UI does not consume an unreasonable portion of the viewport.

### Reduced motion

- enable OS/browser reduced motion before loading;
- confirm autoplay, marquee, parallax, GSAP/scroll-linked motion, long transitions, and skeleton motion use the approved static/short alternative;
- required content is never hidden until an animation completes;
- focus location remains stable after state changes.

### Forced colors and high contrast

- verify text, icons, focus, borders, selected/disabled state, form controls, and error/success status remain distinguishable;
- decorative backgrounds must not be the sole carrier of meaning.

## Network and resilience

Test with fast, slow 4G, slow 3G where practical, offline after first navigation, and request failure simulation:

- loading structure reserves layout space and avoids destructive CLS;
- images have useful fallback behavior;
- retries and recovery links are understandable;
- offline and server errors do not expose stack traces or blank screens;
- repeated submit/add-to-cart actions are idempotent or visibly guarded.

## Content stress cases

- empty search, category, cart, wishlist, account, and editorial lists;
- loading and skeleton state;
- recoverable and terminal error state;
- out-of-stock, low-stock, sale, new, limited, disabled, success, and offline states;
- long Persian headings and descriptions;
- mixed Persian/Latin punctuation and bidi behavior;
- long Latin brand/model names without spaces;
- very large prices and quantities;
- missing optional image, review, specification, or campaign content;
- translated labels at 30–50% greater length.

## Visual acceptance

For every page, execute `docs/design/visual-acceptance-checklist.md` and verify hierarchy, typography, spacing, alignment, RTL, contrast, crop, image quality, CTA prominence, loading/empty/error states, focus, reduced motion, safe area, and CLS/performance risk.

## Journey checklist

1. Open homepage and navigate header/mobile navigation.
2. Search and reach results or empty state.
3. Browse shop/category; apply, clear, refresh, deep-link, back, and forward filters.
4. Open product; inspect gallery/specifications; change purchasable choices when implemented.
5. Add to wishlist and cart; change quantity; remove; recover empty state.
6. Complete checkout when implemented, including validation and failure recovery.
7. Sign in/account/order/address journeys when implemented.
8. Read magazine/article/static/legal pages.
9. Open an unknown URL and recover from 404.
10. Repeat critical journeys with keyboard, touch, reduced motion, zoom, slow network, and one screen reader.

## Sign-off

Release QA requires:

- QA owner signature;
- accessibility reviewer signature;
- design/visual reviewer signature;
- performance/CI owner confirmation;
- product/content owner confirmation for claims, prices, stock, and legal copy;
- zero unresolved release-blocking issue.

A blocked or not-tested mandatory cell prevents release. Exceptions require supervisor approval with exact scope, reason, owner, expiry, and rollback plan.
