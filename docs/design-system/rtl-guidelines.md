# RTL and Mixed Typography Guidelines

## Principle

KRONOS is Persian-first. RTL controls reading order, hierarchy, and logical placement. It does not require mirroring every image, watch crown, logo, timeline, or technical diagram.

Use `start` and `end` for intent. Use `left` and `right` only when a physical direction is part of the content itself.

## Shared helpers

- `.bidi-isolate` isolates an LTR technical fragment inside Persian text.
- `.rtl-ellipsis` truncates without changing the parent reading direction.
- `resolveLogicalSide()` converts a semantic side only when an external API requires a physical value.
- `isolateBidi()` wraps dynamic references, SKUs, email addresses, and mixed numbers with Unicode isolation.
- `joinBidiSegments()` safely joins multiple technical fragments.

## Persian title with a Latin brand

Keep the Persian sentence RTL. Isolate the brand fragment instead of changing the direction of the entire heading.

```tsx
<h1>
  ساعت مردانه <bdi lang="en">Tissot</bdi>
</h1>
```

Do not add global letter spacing to Persian headings. Latin brand styling may use the brand font only inside an explicit `lang="en"` fragment.

## Reference number, SKU, and technical values

Reference and SKU values are content, not layout controls.

```tsx
<code dir="ltr" data-reference>
  T137.407.11.041.00
</code>
```

- Use DM Mono or the technical role.
- Use tabular lining numerals.
- Keep the value copyable.
- Do not reverse groups manually.
- Do not insert visual punctuation that changes the stored value.

## Price and currency

Render the amount and currency as isolated siblings while preserving the Persian sentence order.

```tsx
<span data-price>
  <bdi dir="ltr">۱۲٬۵۰۰٬۰۰۰</bdi> <span>تومان</span>
</span>
```

A price component belongs to its commerce phase; F3B only defines the typography and isolation behavior.

## Discount percentage

Keep the number and percent sign together in an isolated fragment. The accompanying explanation remains Persian.

```tsx
<span>
  <bdi dir="ltr">۲۰٪</bdi> تخفیف
</span>
```

The existence of a visual discount state does not authorize an unverified commercial claim.

## Breadcrumb

- The ordered list follows document direction.
- The separator rotates in RTL.
- The current page uses `aria-current="page"` and is not presented as a disabled link.
- Long items may use `.rtl-ellipsis`, but the complete label should remain accessible.

## Phone and email inputs

Use field semantics from the surrounding Persian form and LTR direction on the control value.

```tsx
<Field>
  <FieldLabel>ایمیل</FieldLabel>
  <FieldControl>
    <Input type="email" dir="ltr" inputMode="email" autoComplete="email" />
  </FieldControl>
</Field>
```

```tsx
<Input type="tel" dir="ltr" inputMode="tel" autoComplete="tel" />
```

Placeholder text is not a replacement for a label.

## Error messages

Error text remains in the language of the form. Technical fragments inside it are isolated.

- State is conveyed by text, `aria-invalid`, and a visible boundary, not red alone.
- The error is associated through `aria-describedby`.
- Assertive announcements are reserved for blocking errors.

## Persian and Latin digits

- Preserve the product data contract as the source of truth.
- Use Persian digits for Persian-facing prose when content rules require them.
- Keep reference numbers, model codes, SKUs, email, phone, and machine identifiers LTR.
- Do not convert technical values merely for visual consistency.

## Ellipsis

Apply truncation to the smallest text container, not the entire interactive control.

```tsx
<span className="rtl-ellipsis">عنوان طولانی</span>
```

For essential data, provide an accessible full value through surrounding context rather than relying only on a tooltip.

## Directional icons

Mirror icons that express interface direction:

- chevrons for previous/next;
- back and forward arrows;
- collapse and expansion indicators tied to inline flow;
- drawer entry from logical start or end.

Do not mirror:

- check marks;
- search, heart, cart, account, or close icons;
- watch photography;
- brand marks;
- physical diagrams whose orientation is meaningful.

## Padding and inset

Preferred utilities and properties:

- `ps-*` and `pe-*` rather than `pl-*` and `pr-*`;
- `ms-*` and `me-*` rather than `ml-*` and `mr-*`;
- `start-*` and `end-*` rather than `left-*` and `right-*`;
- `padding-inline`, `margin-inline`, `inset-inline`, and `border-inline` in CSS.

Geometric centering may remain physical when it does not encode reading direction.

## Verification matrix

Every migrated feature verifies:

1. Persian title plus Latin brand.
2. Reference number and SKU copy behavior.
3. Price and currency ordering.
4. Discount percentage ordering.
5. Breadcrumb separator direction.
6. Phone and email input direction.
7. Error association and announcement.
8. Persian and Latin digits in one line.
9. Ellipsis at 320px without hidden essential actions.
10. Directional icon behavior in both `dir="rtl"` and `dir="ltr"` containers.
