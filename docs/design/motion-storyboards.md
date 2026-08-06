# Motion Storyboards

## Homepage Hero

1. **Initial:** تصویر LCP و headline/CTA در final layout؛ no hidden critical content.
2. **Trigger:** page ready؛ یک reveal کوتاه.
3. **Transition:** text opacity + y12، media opacity؛ 420ms.
4. **Final:** کاملاً ثابت؛ slider فقط با control کاربر یا autoplay قابل توقف.
5. **Fallback:** static first campaign.
6. **Reduced motion:** هیچ reveal/float/typewriter؛ still frame.
7. **Mobile:** تصویر 4:5 ثابت، یک CTA؛ no parallax.

## Category Entry

- Initial: heading، result count و first cards visible.
- Trigger: navigation/category change.
- Transition: heading opacity 180ms؛ grid بدون stagger طولانی.
- Final: filter/sort ready.
- Fallback/reduced: instant render.
- Mobile: selected category scrolls into view بدون forced smooth motion.

## Featured Products

- Initial: card skeleton با نسبت نهایی.
- Trigger: data/image ready.
- Transition: crossfade تصویر 160ms؛ no tilt.
- Final: stable grid.
- Fallback: text/product action حتی اگر image fail.
- Reduced: direct replacement.
- Mobile: first cards high priority؛ rail indicator واضح.

## Brand Rail/Marquee

- Initial: static wrapped list.
- Trigger: فقط user scroll/controls؛ autoplay optional.
- Transition: native horizontal scroll/snap.
- Final: selected/visible brands.
- Fallback/reduced: grid دو/سه ستونه؛ no animation.
- Mobile: swipe و buttons accessible.

## Editorial Section

- Initial: image and text present.
- Trigger: 30% visible.
- Transition: one text block reveal 400ms؛ image static.
- Final: no continuous movement.
- Fallback/reduced/mobile: fully static; alternate crop.

## Search Overlay

- Initial: trigger focus.
- Trigger: click/keyboard shortcut.
- Transition: backdrop 180ms، panel y8→0 220ms.
- Final: focus input، background inert.
- Close: Escape/button؛ focus returns trigger.
- Reduced: instant open.
- Mobile: full-screen; keyboard-aware viewport.

## Mega Menu

- Initial: closed; trigger exposes `aria-expanded=false`.
- Trigger: click/Enter/Space؛ hover may preview but not sole method.
- Transition: opacity/y8 180–220ms.
- Final: first meaningful link focusable.
- Fallback/reduced: instant disclosure.
- Mobile: accordion/drill-down، no desktop mega animation.

## Product Gallery

- Initial: primary image eager + thumbnail selected.
- Trigger: thumbnail, arrow, swipe.
- Transition: slide/fade 220ms؛ same container dimensions.
- Final: selected state and live label updated.
- Fallback/reduced: instant image swap.
- Mobile: swipe + thumbnail/counter; pinch not sole zoom.

## Add to Cart

- Initial: enabled CTA with price/availability clear.
- Trigger: activation.
- Transition: immediate pressed state؛ loading label؛ success icon/text within 300ms after response.
- Final: cart count update + optional drawer; no flying product required.
- Error: CTA restored + inline/toast recovery.
- Reduced: state text only.
- Mobile: haptic platform optional; sticky bar remains stable.

## Cart Drawer

- Initial: hidden/inert.
- Trigger: successful add or cart control.
- Transition: backdrop + inline-end slide 260ms.
- Final: focus close/title، item visible، CTA.
- Fallback/reduced: instant open.
- Mobile: full/near-full width; no swipe-only dismissal.
