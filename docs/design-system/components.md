# Shared Component Contract

## General rules

- Shared components use semantic tokens only.
- `className` may extend layout but must not remove keyboard semantics, labels, focus, or minimum targets.
- Status is never communicated by color alone.
- Commercial assertions and product-specific badges remain outside F3B.
- Radix primitives retain responsibility for focus trap, Escape handling, and return focus.
- Tooltip text supplements a visible or programmatic label; it never becomes the only name of an important control.

## Button

### Purpose

Primary, secondary, destructive, outline, ghost, and link-like actions.

### Props

`variant`, `size`, `width`, `loading`, `loadingText`, `disabled`, `asChild`, and native button props.

### Variants and states

- Variants: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`.
- Sizes: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`.
- States: hover, focus-visible, active, disabled, loading, and busy.

### Accessibility and RTL

- Native controls use a minimum 44px target.
- Loading disables repeated activation and sets `aria-busy`.
- Focus uses the independent focus-ring token.
- Icon placement follows DOM order; use `ms-*` and `me-*` for extra spacing.

### Do

```tsx
<Button type="submit" loading={isSaving} loadingText="در حال ثبت">
  ثبت تغییرات
</Button>
```

### Do not

- Do not remove focus classes.
- Do not use `loading` as a substitute for a final success or error message.
- Do not render an unlabeled icon through Button; use IconButton.

## IconButton

### Purpose

An icon-only action with a type-level accessible-name requirement.

### Props

All compatible Button props plus required `label` and icon children.

### Accessibility

`label` is applied to `aria-label` and included as visually hidden text. Decorative SVG content is hidden from the accessibility tree.

```tsx
<IconButton label="افزودن به علاقه‌مندی‌ها" variant="ghost">
  <Heart />
</IconButton>
```

Do not pass an empty label. Tooltip may repeat or expand the label but cannot replace it.

## LinkButton

### Purpose

Navigation visually aligned with Button without pretending an anchor is a button.

### Props and states

Anchor props plus Button variants, sizes, width, and `disabled`.

### Accessibility

A disabled LinkButton removes `href`, leaves the tab order, and exposes `aria-disabled`. Use Button when the action does not navigate.

```tsx
<LinkButton href="/shop" variant="outline">
  مشاهده فروشگاه
</LinkButton>
```

## Input and Textarea

### Purpose

Text entry inside an associated Field or FormItem.

### States

Default, hover, focus-visible, invalid, disabled, and read-only. Textarea remains vertically resizable.

### Accessibility

- Always associate a visible label.
- Use `aria-invalid` for errors.
- Link description and error text through FieldControl or FormControl.
- Email, phone, SKU, and technical values may use `dir="ltr"` without changing the form direction.

```tsx
<Field invalid={Boolean(error)} required>
  <FieldLabel>ایمیل</FieldLabel>
  <FieldControl>
    <Input type="email" dir="ltr" autoComplete="email" />
  </FieldControl>
  <FieldDescription>برای پیگیری سفارش استفاده می‌شود.</FieldDescription>
  <FieldError>{error}</FieldError>
</Field>
```

Placeholder text is not a label.

## Field

### Purpose

Framework-independent label, description, and error association.

### Components

`Field`, `FieldLabel`, `FieldControl`, `FieldDescription`, and `FieldError`.

### Props and states

Field accepts `invalid`, `disabled`, `readOnly`, and `required`. Native behavior still belongs on the child control; FieldControl supplies associated ARIA state and IDs.

### Accessibility

- Generated IDs connect all parts.
- Required state has a visible marker and `aria-required`.
- Error renders only when invalid and announces with `role="alert"`.
- Disabled and read-only must remain visually distinct.

Do not nest Field inside another Field. Existing React Hook Form screens may continue using FormItem until their owning phase migrates them.

## Checkbox, RadioGroup, Switch, Select, Tabs, and Accordion

### Purpose

Existing Radix-backed selection and disclosure primitives.

### Shared requirements

- Pair checkbox, radio, and switch controls with visible labels.
- Make the complete labeled row at least 44px high when the visual control itself is compact.
- Do not use disabled styling to represent read-only information.
- Selected state includes shape, boundary, icon, or text in addition to color.
- Select value and technical options preserve bidi isolation.
- Tabs use arrow-key behavior provided by Radix and remain scrollable on narrow screens.
- Accordion triggers remain real buttons and retain visible focus.

Feature phases may refine semantic styling but must not replace these primitives with hand-written keyboard behavior.

## Dialog and AlertDialog

### Purpose

Modal decisions and focused tasks.

### Behavior

Radix provides focus trap, Escape close, outside-interaction behavior, and return focus. DialogContent supplies semantic surface, overlay, logical close position, and a 44px labeled close control.

### Accessibility

- Include DialogTitle.
- Include DialogDescription when the purpose is not obvious from the title.
- Initial focus goes to the safest meaningful control.
- Destructive confirmation uses AlertDialog, not ordinary Dialog.
- Do not close on a failed submit without presenting the error.

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">نمایش جزئیات</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>جزئیات</DialogTitle>
      <DialogDescription>اطلاعات تکمیلی این بخش.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Sheet and Drawer

### Purpose

Responsive secondary surfaces. Use Sheet for shell-level or feature panels and the existing Drawer primitive where bottom-sheet behavior is explicitly required.

### Sides

Preferred sides are `start`, `end`, `top`, and `bottom`. Physical `left` and `right` remain compatibility options only.

### Accessibility and motion

Sheet inherits Dialog focus behavior, uses a labeled close control, respects safe-area bottom spacing, and uses logical motion. Reduced-motion produces the final static surface immediately.

Do not implement final cart choreography or navigation composition in F3B.

## Popover and Tooltip

### Purpose

Popover contains interactive supplemental content. Tooltip contains brief non-interactive clarification.

### Accessibility

- Popover content must be keyboard reachable and dismissible.
- Tooltip must not contain required actions.
- Tooltip must not be the only accessible name.
- Touch users need an equivalent visible or focus-triggered path.

## Badge

### Purpose

Small shared status or category metadata.

### Variants

`default`, `secondary`, `outline`, `info`, `success`, `warning`, `error`, and compatibility `destructive`.

### Restrictions

Badge is not ProductBadge. Sale, new, limited, and out-of-stock claims must come from verified domain data and are implemented by the owning product phase.

## Separator

Use only for visual grouping. Keep decorative separators hidden from assistive technology unless they communicate a structural boundary not represented by headings.

## Skeleton

### Purpose

Layout-preserving loading placeholder.

### Behavior

Uses neutral skeleton roles. It shimmers only when motion is allowed and becomes static under reduced motion.

### Accessibility

Skeleton itself is hidden from the accessibility tree. The containing region owns `aria-busy` and an accessible loading message.

```tsx
<section aria-busy="true" aria-label="در حال بارگذاری">
  <Skeleton className="h-6 w-48" />
</section>
```

Do not use skeleton dimensions unrelated to final content.

## Spinner

### Purpose

Compact indeterminate progress indicator.

When adjacent text already announces loading, keep Spinner decorative. When used alone, provide `label`.

```tsx
<Spinner label="در حال بارگذاری" />
```

## Progress

### Purpose

Determinate progress from 0 to 100.

Progress uses logical inline size rather than directional translation, so RTL does not reverse completion. The indicator transition is removed under reduced motion.

Use a visible label when the value is meaningful. Do not use Progress for an unknown duration; use Spinner or a status message.

## Toast integration

Use the existing Sonner integration for short, non-blocking confirmation. A toast is not the only location for a blocking error, legal message, or information needed to complete a task.

- Success toast: completed operation.
- Error toast: concise failure plus an on-page recovery path.
- Do not announce every background update.
- Avoid stacking repeated identical messages.

## StatusMessage

### Purpose

Persistent inline feedback with title, description, optional icon, and optional action.

### Tones

`info`, `success`, `warning`, and `error`. Error is assertive; other tones are polite by default.

```tsx
<StatusMessage
  tone="error"
  title="ثبت تغییرات انجام نشد"
  description="اتصال را بررسی کنید و دوباره تلاش کنید."
  action={<Button variant="outline">تلاش دوباره</Button>}
/>
```

## EmptyState and ErrorState

### Purpose

EmptyState explains a valid zero-result condition. ErrorState explains a failed operation and exposes recovery.

### Props

Required title, optional description, action, icon, and compact mode. ErrorState also accepts a diagnostic `errorId` that is not shown as marketing copy.

### Rules

- Empty is not error.
- Describe what is empty and what action is available.
- Do not invent product or inventory explanations.
- Preserve the action at 320px.

## SectionHeading

### Purpose

Consistent section eyebrow, title, description, and action layout.

### Props

`as`, `eyebrow`, `title`, `description`, `actions`, and `align`.

### RTL

Text alignment is logical. Actions wrap without changing reading order. Latin overline tracking is applied only within explicit English language context.

## Breadcrumb

### Purpose

Hierarchical navigation with current-page semantics.

### Accessibility and RTL

- Default label is Persian and may be overridden.
- Current page uses `aria-current="page"`.
- Separator rotates in RTL.
- Links retain visible focus.
- Ellipsis is decorative and includes hidden explanatory text.

## Pagination

Use the existing Pagination primitive with real links for navigable pages. Button sizing now supplies a minimum target. Current page uses `aria-current="page"`. Previous and next icons follow interface direction.

URL-driven discovery state remains owned by F4 and the catalog contracts.

## VisuallyHidden

Use for necessary programmatic text that has no visual equivalent. Do not hide essential instructions that sighted keyboard or cognitive users also need.

## SkipLink

Place once near the root shell and point it to the main-content ID. It becomes visible on focus and uses logical start positioning.

```tsx
<SkipLink targetId="main-content" />
<main id="main-content">...</main>
```

The shell owner integrates it; F3B does not change `__root.tsx`.
