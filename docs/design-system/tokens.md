# KRONOS Design Tokens

## Contract

The production API is semantic. Components consume a role such as `background-surface`, `text-secondary`, or `status-error`; they do not request a material color such as “gold-1”. Raw values remain implementation details in `src/styles.css`.

Prototype aliases such as `gold`, `night`, and `card-dark` remain temporarily available to avoid breaking routes outside F3B ownership. New shared components must not use those aliases. F4–F11 remove them from owned features during migration.

## Color

### Surfaces

| Token | Role |
| --- | --- |
| `background-canvas` | Default application canvas. |
| `background-surface` | Calm commerce sections and cards. |
| `background-elevated` | Popovers, dialogs, drawers, and raised controls. |
| `background-inverse` | Porcelain editorial chapter or inverse surface. |
| `background-overlay` | Modal and drawer backdrop. |

### Text

| Token | Role |
| --- | --- |
| `text-primary` | Product names, prices, headings, and essential body copy. |
| `text-secondary` | Supporting body copy and specifications. |
| `text-muted` | Non-essential metadata; never stock, price, or legal text. |
| `text-inverse` | Text on inverse light surfaces. |
| `text-disabled` | Legible unavailable-control text. |

### Borders

- `border-subtle`: ordinary separation.
- `border-default`: control boundary.
- `border-strong`: selected or emphasized boundary.

Focus does not reuse a border or brass token. `focus-ring` is a separate blue signal with a canvas offset.

### Accent

- `accent-primary`: restrained brass punctuation and selected emphasis.
- `accent-hover`: interactive tone change.
- `accent-active`: pressed state.
- `accent-muted`: quiet selected surface.

Normal prices and ordinary primary text do not automatically use accent color.

### Status

| Token | Meaning | Required companion |
| --- | --- | --- |
| `status-success` | Completed or available. | Text and/or icon. |
| `status-warning` | Attention or inventory-backed warning. | Explicit message. |
| `status-error` | Validation or operation failure. | Cause and recovery. |
| `status-info` | Neutral operational information. | Descriptive text. |

### System and product states

- `selection`, `skeleton-base`, and `skeleton-highlight` are system roles.
- `product-sale`, `product-new`, `product-limited`, and `product-out-of-stock` are display roles only. They do not authorize a badge or claim. Data and evidence rules remain owned by the product domain and content registry.

## Typography

### Families

| Role | Family |
| --- | --- |
| Persian display, heading, and body | Vazirmatn Variable with system sans fallback. |
| Latin UI | Inter/system sans. |
| Brand wordmark or limited collection name | Playfair Display. |
| Reference, SKU, caliber, and technical serial | DM Mono. |

Playfair Display is not the default Persian heading font. DM Mono is not the default price font.

### Responsive scale

- `type-display-size`: `clamp(2.5rem, 2rem + 3vw, 5.5rem)`.
- `type-heading-1-size`: responsive 32–64px equivalent.
- `type-heading-2-size`: responsive 26–48px equivalent.
- `type-heading-3-size`: responsive 20–32px equivalent.
- `type-body-large-size`: responsive 16–18px equivalent.
- `type-body-size`: responsive 15–16px equivalent.
- `type-label-size`: 14px.
- `type-caption-size` and `type-overline-size`: 12px minimum.

Persian body uses a relaxed line height. Latin tracking is only applied inside an explicit English context. Technical and numeric groups use tabular lining numerals and bidi isolation.

### Utility roles

- `.type-display`
- `.type-heading-1`
- `.type-heading-2`
- `.type-heading-3`
- `.type-body-large`
- `.type-label`
- `.type-caption`
- `.type-overline`

## Spacing and layout

The conceptual base is 4px, with product-facing rhythm centered on 8, 12, 16, 24, 32, 48, 64, 80, 96, 128, and 144px.

### Containers

| Token | Maximum | Use |
| --- | ---: | --- |
| `container-compact` | 720px | FAQ, legal, auth, focused forms. |
| `container-content` | 960px | Article and narrative content. |
| `container-commerce` | 1280px | Shop, cart, account, ordinary commerce. |
| `container-wide` | 1440px | Home and media-led product layouts. |
| `content-measure` | 608px | Readable Persian paragraph measure. |

`.ds-container` supplies fluid logical gutters. Width modifiers constrain the maximum without changing reading order.

### Section and grid

- `section-space-commerce` scales from 40px to 96px.
- `section-space-editorial` scales from 56px to 144px.
- `gutter-page` scales from 16px to 72px.
- `grid-gap` scales from 12px to 24px.

### Controls and safe areas

- Small and default control height: 44px.
- Large control height: 48px.
- Minimum touch target: 44×44px.
- `.safe-area-top`, `.safe-area-bottom`, and `.safe-area-inline` use environment insets.
- Sticky offsets exist for desktop and mobile shell coordination; feature owners may not invent conflicting global offsets.

## Shape, depth, and layers

### Radius

- `radius-small`: 4px.
- `radius-control`: 6px.
- `radius-surface`: 8px.
- `radius-dialog`: 12px.
- `radius-round`: fully rounded controls.

The previous global zero radius is removed. Editorial precision uses restrained geometry rather than either sharp-everywhere or pill-everywhere styling.

### Border and shadow

- Hairline: 1px.
- Emphasis: 2px.
- `shadow-surface`: ordinary raised region.
- `shadow-elevated`: dialog and drawer depth.
- `shadow-focus`: focus offset plus ring.
- `blur-overlay`: optional 10px backdrop blur; mobile owners may omit it.

### Z-index

| Token | Value | Scope |
| --- | ---: | --- |
| `z-base` | 0 | Document flow. |
| `z-raised` | 10 | Raised local surface. |
| `z-sticky` | 30 | Sticky controls and shell. |
| `z-overlay` | 50 | Dialog and drawer. |
| `z-toast` | 70 | Toast above overlays when appropriate. |

Arbitrary `z-[9999]` values are prohibited unless an integration decision changes this contract.

## Motion

| Token | Value | Use |
| --- | ---: | --- |
| `duration-instant` | 80ms | Press feedback. |
| `duration-fast` | 140ms | Exit and small state change. |
| `duration-normal` | 220ms | Dialog, drawer, popover, and ordinary entry. |
| `duration-slow` | 360ms | Limited editorial reveal. |
| `ease-standard` | Standard state transition. |
| `ease-enter` | Decelerating entry. |
| `ease-exit` | Accelerating exit. |
| `motion-distance-small` | 8px | Small spatial relationship. |
| `motion-distance-medium` | 16px | Maximum shared UI travel. |
| `motion-scale-pressed` | 0.98 | Optional press feedback. |

Shared motion classes are limited to fade, scale, and logical start/end sheet transitions. Reduced-motion turns content into its final static composition and pauses autoplay-marked elements.

## Opacity and icons

- Disabled opacity: 0.56, supported by disabled semantics and text.
- Muted opacity: 0.72; essential information must not rely on it.
- Icon sizes: 16px, 20px, and 24px.

## Consumption examples

```tsx
<div className="border-border-subtle bg-background-surface text-text-primary" />
<p className="text-text-secondary" />
<button className="focus-visible:ring-focus-ring" />
```

```css
.custom-surface {
  background: var(--background-surface);
  border: 1px solid var(--border-subtle);
  transition: border-color var(--duration-fast) var(--ease-standard);
}
```

## Prohibited patterns

- New raw hex colors inside shared components.
- Brand accent as focus, error, warning, or ordinary price color.
- Status conveyed only by color.
- A new global spacing, radius, shadow, or z-index scale inside a feature.
- Continuous decorative animation on commerce surfaces.
- Physical left/right spacing when a logical property expresses the intent.
