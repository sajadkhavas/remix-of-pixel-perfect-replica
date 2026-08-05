# Component Visual Inventory

| Group | Component | Purpose | Variants / sizes | States | Responsive behavior | Content requirements | Accessibility | Owner | Dependencies |
|---|---|---|---|---|---|---|---|---|---|
| Navigation | AnnouncementBar | verified operational message | default/urgent | default/link/hidden | optional mobile | approved claim + expiry | dismiss/pause if rotating | F4 | Content |
| Navigation | GlobalHeader | primary navigation | desktop/mobile | default/scrolled/menu-open | 80→60px | labels/destinations | landmarks, focus | F4 | Router |
| Navigation | MegaMenu | deep discovery | collection/editorial | open/focus/active | accordion mobile | taxonomy | keyboard/Escape | F4 | Nav data |
| Navigation | MobileMenu | touch nav | drawer/drill | open/sub-open | full height | concise labels | trap/return focus | F4 | Dialog |
| Navigation | SearchTrigger/Overlay | find products/content | compact/full | open/loading/results/empty/error | full-screen mobile | query/recent/suggestions | combobox pattern | F4 | Search |
| Navigation | Breadcrumb | orientation | compact/wrap | current | wraps mobile | localized hierarchy | nav label | F4/F5 | Router |
| Navigation | MobileBottomBar | key destinations | 4–5 items | active/badge | mobile only | stable routes | labels + safe area | F4 | Store |
| Form | Button | actions | primary/secondary/ghost/destructive; sm/md/lg | all interaction states | full width optional | action verb | 44px, focus | F3B | Tokens |
| Form | IconButton | compact actions | sm/md | hover/focus/selected/disabled | 44px mobile | accessible name | tooltip not sole | F3B | Icon set |
| Form | TextField | query/data | default/search | focus/error/success/disabled | full width mobile | label/help/error | programmatic labels | F3B | Forms |
| Form | Select/Combobox | sort/facet | native/custom | open/selected/error | native mobile preferred | option labels | keyboard | F3B/F4 | Radix/native |
| Form | Checkbox/Radio | filters/options | default/card | checked/indeterminate/disabled | touch row | label/count | non-color state | F3B/F4 | Forms |
| Form | QuantityStepper | quantity | compact/regular | min/max/disabled | 44px controls | limits | clear labels/live update | F5/F6 | Cart |
| Feedback | Toast | transient feedback | success/error/info | enter/visible/exit | above bottom bar | concise + action | live region/timing | F3B | Sonner |
| Feedback | InlineAlert | persistent status | info/success/warn/error | default | full width | title/body/action | role semantics | F3B | Tokens |
| Feedback | Skeleton | preserve layout | text/card/gallery | loading | exact responsive ratio | no fake content | aria-busy | All | Data |
| Feedback | EmptyState | recovery | shop/cart/wishlist/search | empty | compact mobile | reason + next action | heading order | All | Content |
| Feedback | ErrorState | recovery | inline/page | retry/offline/not-found | compact | honest message/id | focus retry | Platform | Error handling |
| Product | ProductCard | scan and buy/save | grid/rail/compact | default/focus/sale/new/limited/oos/loading/error | reduced metadata mobile | real image/name/brand/price | full link + actions | F5 | Catalog/assets |
| Product | ProductMedia | accurate view | primary/detail/video | loading/error/zoom | touch gallery | alt intent | controls/zoom | F5 | Assets |
| Product | ProductGallery | multi-view evaluation | thumbnails/grid | selected/loading | swipe mobile | media sequence | keyboard/live label | F5 | Carousel |
| Product | PriceBlock | pricing clarity | regular/sale/range | loading/unavailable | wraps safely | currency/rules | semantic text | F5 | Pricing |
| Product | Availability | stock status | in/low/out/preorder | live | concise | real inventory | icon+text | F5 | Inventory |
| Product | VariantSelector | choose model/strap/color | swatch/text/card | selected/disabled/error | wrap/scroll | variant data | radio semantics | F5 | Catalog |
| Product | SpecTable | compare facts | compact/full | default | stacked mobile | verified units | table/dl semantics | F5 | Product data |
| Product | TrustEvidence | policy proof | compact/cards | available/unavailable | 2×2 mobile | linkable evidence | no decorative claim | F5 | Legal/content |
| Discovery | FilterSidebar | refine results | persistent | applied/disabled | desktop | facet/counts | fieldsets | F4 | URL state |
| Discovery | FilterDrawer | mobile filters | full/bottom | open/applied | mobile | same facets | focus trap | F4 | Dialog |
| Discovery | AppliedFilterChips | state visibility | removable | active/focus | horizontal wrap | labels | remove name | F4 | URL |
| Discovery | SortControl | order | select/menu | selected/open | sticky optional | sort labels | native semantics | F4 | URL |
| Discovery | ResultsSummary | status | count/query | loading/empty | concise | real count | live update | F4 | Search |
| Commerce | AddToCart | purchase action | card/PDP/sticky | loading/success/error/disabled | sticky mobile PDP | stock/price | no delay, status | F5 | Cart API |
| Commerce | CartLineItem | review item | full/compact | updating/error | stack mobile | image/name/qty/price | controls labels | F6 | Cart |
| Commerce | CartDrawer | quick review | desktop/mobile | loading/empty/error | full mobile | totals/policies | dialog semantics | F6 | Cart |
| Commerce | OrderSummary | totals | cart/checkout | recalculating/error | sticky desktop | transparent fees | live totals | F6 | Pricing |
| Commerce | PromoCode | discount | collapsed/expanded | valid/error/loading | full width | terms | status text | F6 | API |
| Commerce | CheckoutStepper | progress | 3–4 steps | current/complete/error | compact mobile | step labels | ordered semantics | F7 | Checkout |
| Commerce | WishlistAction | save state | icon/text | selected/loading/error | 44px | state label | pressed semantics | F5/F6 | Store |
| Commerce | CompareTray | selected products | collapsed/open | max/error | bottom mobile | product names | remove controls | F4/F6 | Compare |
| Content | EditorialCard | article discovery | featured/standard/compact | hover/focus/loading | 1 col mobile | image/category/title/date | full link | F8 | CMS/assets |
| Content | ArticleHero | story context | image/text | loaded | mobile crop | title/byline/date | heading hierarchy | F8 | CMS |
| Content | RichText | long-form reading | standard/wide media | links/quotes/tables | single column | semantic content | readable measure | F8 | CMS |
| Content | BrandCard | brand browse | text/image | focus/unavailable | 2 col mobile | approved brand data | text fallback | F4/F8 | Legal/assets |
| Trust | ReviewSummary | social proof | compact/full | no reviews/loading | stack mobile | verified reviews | rating text | F5 | Reviews |
| Trust | PolicyLink | explain terms | inline/card | focus | wrap | actual policy | descriptive link | F6/F8 | Legal |
| Overlay | Modal | focused task | sm/md/lg | open/loading/error | full mobile optional | title/close/action | dialog/focus trap | System | Radix |
| Overlay | Drawer | spatial task | start/end/bottom | open | device-specific | title/close | dialog semantics | System | Radix |
| Overlay | Lightbox | media inspect | image/video | loading/error | full-screen | alt/caption | controls/focus | F5 | Gallery |
| Layout | PageHeader | context | commerce/editorial/utility | default | compact mobile | title/sub/actions | heading | All | Content |
| Layout | SectionHeader | hierarchy | centered/split | default | stack mobile | eyebrow optional | heading order | All | Tokens |
| Layout | Container/Grid | alignment | compact/content/wide | n/a | fluid | n/a | DOM order | F3B | CSS |
| Layout | Divider/Surface | grouping | subtle/strong | n/a | simplified mobile | n/a | not sole semantic | F3B | Tokens |
