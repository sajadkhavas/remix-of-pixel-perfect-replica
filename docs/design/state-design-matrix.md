# State Design Matrix

## Interaction primitives

| Component  | Default                | Hover          | Focus-visible      | Active/Selected                    | Disabled            | Loading                  | Error/Success                 | Reduced motion    |
| ---------- | ---------------------- | -------------- | ------------------ | ---------------------------------- | ------------------- | ------------------------ | ----------------------------- | ----------------- |
| Button     | clear label/role       | tone shift     | 2px focus + offset | pressed/value state                | readable + blocked  | label + spinner/progress | inline/toast                  | no scale required |
| IconButton | icon + accessible name | surface        | focus ring         | filled/pressed + text where needed | muted but legible   | busy                     | error feedback                | no bounce         |
| Link       | distinguishable        | underline/tone | strong outline     | current page non-color marker      | n/a                 | n/a                      | broken destination avoided    | no slide          |
| Input      | label + boundary       | boundary       | focus ring         | value                              | readable            | skeleton only if async   | message + icon / confirmation | instant           |
| Chip       | text/border            | surface        | ring               | check/remove marker                | muted               | n/a                      | n/a                           | instant           |
| Card link  | stable media/text      | one subtle cue | whole-card focus   | selection marker                   | unavailable overlay | exact skeleton           | image fallback                | no tilt           |

## Commerce/product states

| State         | ProductCard                                          | PDP                                     | Cart/Wishlist          | Required communication           |
| ------------- | ---------------------------------------------------- | --------------------------------------- | ---------------------- | -------------------------------- |
| default       | image/name/price                                     | gallery + buy box                       | item row               | no decorative urgency            |
| hover         | image OR border cue                                  | controls reveal only if also persistent | row action tone        | no unique capability             |
| focus-visible | whole card outline; inner controls separate          | gallery/CTA clear                       | row controls           | not gold-only                    |
| selected      | compare/wishlist marker                              | variant check/radio                     | saved/selected         | icon + text/shape                |
| loading       | fixed ratio skeleton                                 | gallery/buy skeleton                    | row/totals busy        | `aria-busy`; structure preserved |
| image error   | neutral placeholder + product name                   | fallback media + retry                  | thumbnail fallback     | never blank                      |
| empty         | n/a                                                  | n/a                                     | reason + recovery      | useful next step                 |
| error         | action remains/retry                                 | purchase error near CTA                 | update retry           | plain-language cause             |
| success       | add/save confirmation                                | cart status                             | undo where destructive | live region                      |
| offline       | browse cached if possible                            | purchase unavailable explanation        | pending/blocked        | offline label                    |
| out-of-stock  | muted image، explicit label، CTA disabled/notify     | alternatives/notify                     | availability changed   | text + icon، no red-only         |
| low-stock     | factual count only                                   | count + timing caveat                   | update                 | no fake pulse/urgency            |
| sale          | current price primary، old secondary، discount label | terms visible                           | totals accurate        | sale color distinct from error   |
| new           | small factual badge                                  | optional                                | n/a                    | time window defined              |
| limited       | approved badge + evidence                            | edition/reference details               | n/a                    | no claim without source          |

## Page states required

| Page                 | Loading                         | Empty                   | Error                     | Offline              | Success                   |
| -------------------- | ------------------------------- | ----------------------- | ------------------------- | -------------------- | ------------------------- |
| Home                 | section skeleton/reserved media | campaign fallback       | critical content fallback | cached shell         | n/a                       |
| Shop/Category/Search | controls + grid skeleton        | query/facet explanation | retry + preserve filters  | cached results label | applied filters announced |
| Product              | gallery/buy skeleton            | not applicable          | media/API split recovery  | disable purchase     | added/saved               |
| Cart                 | line/totals skeleton            | guided empty            | per-line + summary retry  | checkout blocked     | quantity/remove undo      |
| Wishlist             | grid skeleton                   | discover products       | retry                     | cached saved list    | moved to cart             |
| Compare              | table skeleton                  | add products            | retry                     | cached comparison    | selection updated         |
| Checkout             | step skeleton                   | n/a                     | field/payment recovery    | block submission     | order confirmation        |
| Account              | module skeleton                 | onboarding              | auth/data recovery        | cached profile label | saved settings            |
| Magazine/Article     | media/text skeleton             | category empty          | retry                     | cached article       | n/a                       |
| Contact              | form ready                      | n/a                     | field/server error        | alternative contact  | receipt/SLA               |
| FAQ/Legal            | text skeleton minimal           | no results              | retry                     | cached content       | n/a                       |
| 404                  | n/a                             | recovery content        | n/a                       | n/a                  | destination chosen        |

## ممنوع

- disabled فقط با opacity بسیار کم.
- error فقط با قرمز.
- loading که layout را جابه‌جا کند.
- success فقط با animation.
- low-stock pulse بی‌پایان.
- skeleton طلایی پرنور.
