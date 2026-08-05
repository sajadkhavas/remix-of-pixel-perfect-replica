# KRONOS Planned Redirect Map

No redirects are implemented in F2. This document is the execution contract for the route migration phase.

## Preconditions

- Redirects run before route rendering.
- Destination URLs must be canonical, indexable where applicable, and return 200.
- Preserve only approved parameters (`page` on clean pagination); drop tracking/default/invalid parameters.
- Every redirect must be tested for loops and chains.
- Unknown URLs must not be broadly redirected to the home page or shop.

## Current-to-final architecture redirects

| Priority | Source pattern | Destination | Status | Resolution requirement | Notes |
|---:|---|---|---:|---|---|
| 1 | `/product/$numericId` | `/product/$productSlug` | 301 | explicit immutable legacy ID → current slug lookup | Current prototype uses numeric IDs. Missing map entry returns 404; never guess from a display name. |
| 2 | `/blog` | `/magazine` | 301 | direct | Preserve only valid `page`; remove other legacy params. |
| 3 | `/blog/$articleSlug` if later discovered in history | `/magazine/$articleSlug` | 301 | article slug history table | Current baseline has no article route, but reserve migration rule. Unknown article 404. |
| 4 | `/auth` | authentication entry selected by the account/security phase | temporary 302 until final sign-in URL is approved | supervisor/security decision | Do not permanently redirect until authentication IA exists. A safe return path may be carried in an allowlisted parameter. |
| 5 | `/shop/$category` for `luxury`, `classic`, `sport`, `smart` | same clean route | none | route implementation migration only | Existing paths already match final canonical paths. Ensure no redirect is introduced unnecessarily. |
| 6 | `/shop?category=men` | `/shop/men` | 301 | exact normalized single-value match only | Do not redirect when additional filters materially change the result set; those remain noindex query URLs. |
| 7 | `/shop?category=women` | `/shop/women` | 301 | exact normalized single-value match only | Same rule. |
| 8 | `/shop?style=luxury` | `/shop/luxury` | 301 | exact match without conflicting category | Remove default sort/view. |
| 9 | `/shop?style=classic` | `/shop/classic` | 301 | exact match without conflicting category | Remove default sort/view. |
| 10 | `/shop?style=sport` | `/shop/sport` | 301 | exact match without conflicting category | Remove default sort/view. |
| 11 | `/shop?style=smart` | `/shop/smart` | 301 | exact match without conflicting category | Remove default sort/view. |
| 12 | `/shop?movement=automatic` | `/shop/automatic` | 301 | exact single movement, no other material facets | Additional facets remain query state on the clean landing. |
| 13 | `/shop?movement=mechanical` | `/shop/mechanical` | 301 | exact single movement, no other material facets | Same rule. |
| 14 | `/shop?movement=quartz` | `/shop/quartz` | 301 | exact single movement, no other material facets | Same rule. |
| 15 | legacy brand query `/shop?brand=$brandSlug` | `/brands/$brandSlug` | 301 only when intent and content are equivalent | valid brand lookup and no other material facets | Otherwise retain a noindex filtered shop URL. |

## Generic normalization redirects

| Source | Destination | Status | Guard |
|---|---|---:|---|
| mixed-case public path | lowercase equivalent | 301 | only when path lookup is unambiguous |
| non-root trailing slash | slashless equivalent | 301 | preserve normalized approved params |
| duplicate hyphens or redundant percent encoding | normalized path | 301 | ensure slug remains valid |
| `?page=1` | same path without page | 301 or server replace | only on clean listing pages |
| URL containing tracking parameters | clean equivalent | normally no redirect required; canonical clean | edge redirect optional only when analytics attribution is preserved separately |
| old known product/brand/article slug | current slug | 301 | historical slug table, one hop |

## Product lifecycle destinations

| Source product state | Response policy |
|---|---|
| slug changed, same product | 301 old slug to current slug |
| product merged into genuinely equivalent product | 301 to equivalent product and record migration reason |
| discontinued but page remains useful | no redirect; 200 self-canonical with status and alternatives |
| permanently deleted with no equivalent | 410 when operationally intentional, otherwise 404 |
| invalid numeric legacy ID or unknown slug | 404; never redirect to `/shop` |

## Redirect data contract for later implementation

```ts
interface RedirectRule {
  readonly source: string;
  readonly destination: string;
  readonly status: 301 | 302 | 307 | 308;
  readonly reason: "slug-change" | "route-migration" | "normalization" | "equivalent-replacement";
  readonly createdAt: string;
  readonly expiresAt?: string;
}
```

Dynamic numeric-product migration additionally requires a repository lookup returning the current canonical slug. Redirect rules must not import UI fixture labels.

## Test cases

- every legacy numeric product ID maps to one active or retained product slug;
- unknown numeric ID returns 404;
- `/blog` resolves in one hop to `/magazine`;
- slash/case normalization does not chain with slug migration;
- clean landing redirects do not erase meaningful additional facets;
- destination never redirects again;
- query encoding and Persian input do not create alternate canonical forms;
- private/order URLs are never exposed through public redirect lookup.
