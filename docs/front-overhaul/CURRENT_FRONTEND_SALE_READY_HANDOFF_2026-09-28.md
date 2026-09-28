# KRONOS — Frontend Sale-Ready Handoff

**Date:** 2026-09-28  
**Repository:** `sajadkhavas/remix-of-pixel-perfect-replica`  
**GitHub baseline branch at handoff start:** `integration/front-200`  
**Baseline SHA before this documentation update:** `5254e5bd9c36a02f3a72d73c1acb36d1a2d0e16c`

> IMPORTANT: The user's active frontend work was edited locally in VS Code on branch `fix/frontend-sale-ready-20260925`. That local branch was not found on GitHub when this handoff was written. Therefore, **the user's current local files are the source of truth for the visual/frontend state**. Do not overwrite the local work with older GitHub component versions. Use this document as the continuity record, then inspect the user's current files before changing code.

## Current product strategy

The current goal is to finish a **complete sale-ready frontend first**, so the project can be shown to prospective customers even while the real backend is empty.

For now:

- Real customer/business data is not required.
- Product/catalog/demo content may remain fixture/mock data.
- Backend-dependent flows should still receive complete frontend design, responsive states, loading/empty/error states and realistic UX.
- Later, after a customer is found, replace fixture/mock data with real customer data and connect Backend/Admin/Auth/OTP/Payment/SMS/Orders/Inventory/Reviews/Newsletter/Contact/SEO dynamic sources.
- UI architecture should be kept replaceable at the data-source boundary: `fixture/mock -> API/backend`, not rebuilt from scratch later.

## Explicit user approval

On 2026-09-28 the user explicitly approved the **Home page visual design as complete**:

> "خب صفحه اصلی کامل تاییده"

Treat the Home page as visually locked unless the user requests a specific change.

## Home page — accepted visual state

The accepted Home is a dark cinematic luxury-watch storefront with KRONOS gold accents and RTL Persian layout.

### Hero

Primary file:

- `src/components/sections/HeroSection.tsx`

Accepted direction:

- Cinematic dark/gold luxury look.
- Large foreground luxury watch.
- Dedicated optimized background image:
  - `src/assets/hero-kronos-bg.webp`
- Persian copy on the right in desktop RTL composition.
- Mobile composition was separately tuned and approved.
- Text contrast is protected with dark overlays, ivory/gold typography and text shadows.
- CTA pair:
  - collection/shop CTA
  - featured products anchor
- Hero stats remain demo values for presentation.
- Moving luxury ticker sits between Hero and the next section.

Do not replace this Hero with an older split layout.

### Header / Navbar

Primary file:

- `src/components/layout/Navbar.tsx`

Accepted structural direction:

Desktop:
- KRONOS logo on the right.
- Main navigation centered.
- Search / wishlist / account / cart controls on the left.

Mobile:
- Logo centered.
- Controls distributed left/right around the centered logo.
- Existing mobile menu remains the navigation drawer.

Latest addition:
- Rotating announcement/news bar above the header, inspired by the LBB `AnnouncementBar`.
- Gold branded styling.
- Rotates messages automatically.
- Pauses on hover/focus.
- Can be dismissed and remembers dismissal in `localStorage`.
- Mobile version was refined to avoid cramped text and controls.

Latest prepared local replacement was named:
- `Navbar-mobile-announcement-fixed.tsx` -> should live at `src/components/layout/Navbar.tsx`.

### LBB announcement reference

The LBB implementation reviewed for the pattern is:

- repo: `sajadkhavas/lbb`
- file: `src/components/lbb/AnnouncementBar.tsx`

Key behavior copied conceptually:
- multiple rotating messages
- close button
- pause during interaction
- dismissal persistence
- fixed position above navbar

Do not copy LBB styling literally; KRONOS uses gold/dark brand styling.

### Categories / collections

Primary file:

- `src/components/sections/CategoriesSection.tsx`

Accepted image mapping:

- Luxury -> `audemars-piguet-royal-oak-blue-dial-kronos.webp`
- Sport -> `tag-heuer-carrera-chronograph-sport-watch-kronos.webp`
- Classic -> `cartier-tank-gold-classic-watch-kronos.webp`
- Smart -> `apple-watch-black-gold-smartwatch-kronos.webp`

The Smart image was initially rendered with `object-contain`/padding and looked smaller than the other cards. Final correction is **full-bleed**:

- `object-cover object-center`
- no inner padding

Latest prepared local replacement was named:
- `CategoriesSection-smart-image-fixed.tsx` -> should live at `src/components/sections/CategoriesSection.tsx`.

### Generated/optimized visual assets

The user placed the generated assets into `src/assets/`.

Expected filenames:

- `hero-kronos-bg.webp`
- `omega-speedmaster-luxury-watch-kronos.webp`
- `patek-philippe-nautilus-blue-dial-kronos.webp`
- `audemars-piguet-royal-oak-blue-dial-kronos.webp`
- `cartier-tank-gold-classic-watch-kronos.webp`
- `tag-heuer-carrera-chronograph-sport-watch-kronos.webp`
- `apple-watch-black-gold-smartwatch-kronos.webp`
- `kronos-newsletter-omega-speedmaster.webp` if the newsletter-specific copy was retained locally.

These images were optimized for web use; several were specifically kept below 500 KB.

### Product cards / featured products

Primary files:

- `src/components/ui/ProductCard.tsx`
- `src/components/commerce/responsive-product-image.tsx`
- `src/components/sections/FeaturedProducts.tsx`

Important prior fix:

The old responsive product image component hid the image behind an opacity state until `onLoad`, which caused products to appear missing. It was changed so images are visible without JS load-state gating.

Product cards were redesigned for:
- consistent equal heights
- fixed title/spec/price slots
- premium dark/gold styling
- reliable product image rendering
- first products can use eager/high-priority loading
- wishlist overlay
- add-to-cart CTA

Do not restore the old `opacity-0 until onLoad` behavior.

### Why KRONOS / services

Primary file:

- `src/components/sections/ServicesSection.tsx`

Accepted direction:
- modern luxury trust/service presentation
- mobile responsiveness was part of the Home approval
- user specifically requested a compact one-row feel on mobile earlier

Use the local current file as source of truth.

### Editorial / OUR STORY

Primary file:

- `src/components/sections/EditorialSection.tsx`

Current accepted concept:
- Patek Philippe blue-dial visual
- image on the right on desktop
- text/story opposite it
- premium editorial styling

The section was also made future-ready:
- with exactly one editorial item, preserve the large luxury single-story design
- with multiple items:
  - desktop -> one large Featured story + smaller side stories
  - mobile/tablet -> featured story + horizontally swipeable secondary stories

Important historical runtime note:
An earlier version imported `{ Parallax }` from `react-parallax`, which produced SSR/Vite error because the installed package is CommonJS:

`Named export 'Parallax' not found`

Do **not** reintroduce that named import. The later future-ready Editorial implementation no longer needs react-parallax.

### Newsletter / STAY UPDATED

Primary file:

- `src/components/sections/NewsletterSection.tsx`

Accepted design direction:
- elegant compact luxury banner
- Omega visual on the right
- one finely bordered center title block
- three separate left-side blocks for email / subscribe / privacy reassurance
- mobile stacks cleanly
- image should visually dissolve into the section rather than look like a generic product card

Image:
- `kronos-newsletter-omega-speedmaster.webp` or the locally retained Omega asset

The current form can remain frontend/demo behavior until the backend/newsletter service is connected.

### Testimonials

Primary file:

- `src/components/sections/TestimonialsSection.tsx`

Latest requested/implemented behavior:
- desktop/tablet: card grid
- mobile: **one horizontal row with touch swipe**
- snap scrolling
- hidden scrollbar for the carousel
- user can move cards with a finger

Testimonials are demo presentation content until real customer data exists.

### Footer

Primary file:

- `src/components/layout/Footer.tsx`

Accepted desktop column order:
1. دسترسی سریع
2. خدمات مشتریان
3. راه‌های ارتباطی
4. Brand / KRONOS

Mobile:
- collapsible accordion structure
- same information hierarchy
- enough bottom padding to clear the floating mobile navigation

### Floating global controls

Primary files:

- `src/components/layout/FloatingActions.tsx`
- `src/routes/__root.tsx`

Latest global controls:
- KRONOS gold branded browser scrollbar for supported desktop/mobile browsers
- back-to-top floating button on the **right**
- WhatsApp floating button on the **left**
- controls avoid the floating mobile bottom nav

Important:
The WhatsApp button is intentionally **data-driven** and should only render when an actual WhatsApp social link exists in store settings. Current development fixture previously had no social links, so no fake phone number was invented.

### Mobile bottom navigation

Primary file:

- `src/components/layout/MobileTabBar.tsx`

Previously redesigned as:
- floating above bottom edge
- rounded on all sides
- compact premium dock
- intended to remain clear of Footer/FloatingActions

Use the user's current local version, not an older GitHub copy.

## Current Home route

Primary route:

- `src/routes/index.tsx`

The Home composition evolved during the local work. Inspect the local file before changing order. At minimum it includes the approved Home sections described above.

Do not infer the final local section order from the older GitHub branch.

## Current verification status

Known successful local check:

```powershell
bun run typecheck
```

This passed on 2026-09-27 before the final small Home refinements.

Known local dev server:

```text
VITE v8.0.16
Local: http://localhost:8080/
```

A final post-polish production verification has **not yet been recorded** after the newest Navbar/Categories/global-control edits.

Before declaring the whole frontend production-ready, run:

```powershell
bun run typecheck
bun run lint
bun run build
```

Then do mobile + desktop browser QA.

## Do not treat GitHub component contents as the newest UI

At this handoff moment, GitHub `integration/front-200` still contains older component versions relative to the user's local VS Code work.

Critical rule for the next chat:

1. Ask/read the user's current local file when they paste it.
2. Treat pasted/local code as source of truth.
3. Use GitHub for project rules, architecture, history and missing files — not to overwrite newer local visual work.
4. Do not regenerate `src/routeTree.gen.ts` manually.

## Frontend-first scope from this point

The user explicitly decided to finish the **entire final frontend before the real backend/customer data**.

The next priority is the main commerce journey:

- `/shop`
- `/shop/$category`
- `/product/$id`
- `/cart`
- `/wishlist`

After those, continue remaining customer-facing frontend routes, including as relevant:

- brands
- blog/journal
- about
- services
- FAQ
- contact
- auth/account UI
- checkout UI
- orders/account states
- empty/loading/error states
- mobile and desktop consistency

Backend-dependent functionality should be visually complete using fixture/mock data, but should not falsely claim a real backend integration exists.

## Deployment strategy

Do not let the empty backend block frontend completion.

Target workflow:

1. Finish all sale-ready frontend screens locally.
2. Typecheck/lint/build.
3. Desktop/mobile QA.
4. Deploy a demo frontend for prospective customers.
5. After a real customer is acquired:
   - replace demo/customer-independent content
   - enter real product/business information
   - connect backend/admin
   - connect auth/OTP
   - payment
   - SMS
   - orders/inventory
   - reviews
   - newsletter/contact
   - dynamic SEO/configuration
6. Run final production acceptance for customer delivery.

## Working style requested by user

- Work fast and practically.
- For files the user pastes from VS Code, return a **full replacement file**, not small patch fragments.
- Usually work in batches of about 5 files.
- Fix desktop and mobile together.
- Keep the dark/gold refined luxury design language.
- Preserve useful motion and visual richness rather than deleting animation wholesale.
- Do not repeatedly make the user run large diagnostic commands.
- Use `bun run typecheck` at sensible batch boundaries and full build at stable milestones.
- When local code is supplied, do not detour into GitHub to replace it with stale versions.

## Immediate next-chat objective

Start from the approved Home checkpoint and build the remaining frontend sale journey.

First batch target:

```text
src/routes/shop.tsx
src/routes/shop.$category.tsx
src/routes/product.$id.tsx
src/routes/cart.tsx
src/routes/wishlist.tsx
```

However, these route files can be thin wrappers around shared components. Read the current local versions/imported components before redesigning. Preserve shared discovery/catalog architecture where it already exists rather than duplicating filter/grid logic.
