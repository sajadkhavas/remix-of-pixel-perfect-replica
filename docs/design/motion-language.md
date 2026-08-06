# Motion Language

## Motion tiers

- **Tier 0 — Essential feedback:** focus، pressed، loading، add/remove، validation.
- **Tier 1 — Spatial transition:** drawer، modal، menu، gallery، filter.
- **Tier 2 — Editorial enhancement:** section reveal، subtle parallax، campaign.
- **Tier 3 — Experimental:** WebGL/tilt/particles؛ در commerce پیش‌فرض ممنوع و نیازمند approval/performance budget.

## استانداردها

| Motion          | Purpose            | Trigger             |                  Duration | Easing                      | Distance/Scale                              | Devices                        | Reduced motion                | Risk   | Owner    |
| --------------- | ------------------ | ------------------- | ------------------------: | --------------------------- | ------------------------------------------- | ------------------------------ | ----------------------------- | ------ | -------- |
| Page entry      | continuity         | navigation          |                 160–240ms | standard decel              | opacity; y≤8                                | all                            | instant + focus heading       | low    | Platform |
| Section reveal  | hierarchy          | enter viewport once |                 320–520ms | emphasized decel            | y 12–24, no blur                            | desktop/tablet; limited mobile | content visible static        | medium | F4/F8    |
| Card hover      | affordance         | hover/focus         |                 140–220ms | standard                    | image scale ≤1.025 OR border, not both      | fine pointer                   | focus state static            | low    | F5       |
| Button feedback | confirmation       | press               |                  80–140ms | sharp                       | scale .98 optional                          | all                            | color/icon feedback           | low    | System   |
| Menu            | spatial relation   | open/close          |                 180–260ms | decel/accel                 | y 8 or clip                                 | desktop                        | instant opacity               | low    | F4       |
| Drawer          | origin/destination | open/close          |                 220–320ms | emphasized                  | inline translation                          | all                            | instant with backdrop         | medium | F4/F6    |
| Modal           | attention          | open/close          |                 180–260ms | standard                    | scale .98→1 + opacity                       | all                            | opacity only/instant          | low    | System   |
| Search overlay  | task switch        | action              |                 180–260ms | standard                    | opacity + y 8                               | all                            | instant + focus input         | low    | F4       |
| Gallery         | media change       | swipe/click         |                 180–300ms | standard                    | translate/opacity                           | all                            | direct swap + selected state  | medium | F5       |
| Filter apply    | system status      | apply               |                 160–240ms | standard                    | results opacity only                        | all                            | live text + instant           | low    | F4       |
| Add to cart     | relationship       | action              |                 220–420ms | emphasized                  | button state/icon; no flying image required | all                            | text/icon confirmation        | medium | F5/F6    |
| Wishlist        | selected state     | action              |                 120–220ms | standard                    | icon fill + label                           | all                            | state text                    | low    | F5       |
| Toast           | feedback           | event               | 180–240ms in; 140–180 out | standard                    | y 8                                         | all                            | instant; enough timeout       | low    | System   |
| Loading         | progress           | async               |                contextual | linear only for determinate | no bright shimmer                           | all                            | static skeleton/progress text | medium | All      |
| Scroll-linked   | narrative relation | scroll              |      direct/smoothed≤80ms | none                        | max 3% translate                            | desktop only                   | static frame                  | high   | F4/F8    |
| Parallax        | depth              | scroll              |                    direct | none                        | max 12px                                    | desktop fine pointer           | none                          | high   | F8       |
| Marquee         | optional discovery | autoplay/user       |                ≥24s cycle | linear                      | horizontal rail                             | desktop/tablet                 | static/wrapped list           | high   | F4       |

## قواعد engine

- Framer Motion: component state/overlay/page micro transitions.
- GSAP: فقط یک editorial sequence پیچیده با scope و cleanup.
- CSS: hover/focus/pressed و simple keyframes.
- Swiper/Embla: gallery/rail؛ motion settings هماهنگ با system.
- Lenis: default توصیه نمی‌شود؛ native scroll اولویت.
- GSAP و Framer روی یک `transform` هم‌زمان ممنوع.
- VanillaTilt در ProductCard و service grid ممنوع.
- particle canvas در commerce ممنوع.

## Accessibility

- `prefers-reduced-motion: reduce` composition مستقل: همه content در final state، autoplay off، scroll-linked off.
- pause/stop برای حرکت بیش از 5 ثانیه یا تکرارشونده.
- hover-only ممنوع؛ focus/touch equivalent.
- toastهای حیاتی auto-dismiss کوتاه ندارند.
- motion نباید focus را جابه‌جا یا reading order را تغییر دهد.

## Performance budgets

- هیچ blur متحرک بزرگ روی mobile.
- هم‌زمان بیش از 3 element composited متحرک در viewport commerce ممنوع.
- layout properties مثل width/height برای animation اجتناب؛ transform/opacity با احتیاط.
- continuous animation در background default ممنوع.
- input response نباید منتظر animation بماند.
