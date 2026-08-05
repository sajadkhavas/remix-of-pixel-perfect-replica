# KRONOS Watch Taxonomy Contract

## Global rules

- Internal keys and values are stable lowercase ASCII kebab-case identifiers.
- Persian and English labels are localized presentation data and never used as IDs.
- Unknown upstream values follow the behavior in the table; they must not be silently coerced to the nearest known value.
- Multi-value filters serialize as sorted comma-separated keys.
- Numeric dimensions are stored as numbers with an explicit unit, not label strings.
- A taxonomy being filterable does not automatically make every filter combination indexable.
- Clean indexable landing pages require supervisor-approved routes, useful unique content, sufficient inventory, and durable search demand.
- Product specifications may preserve an unmapped raw value for admin review while excluding it from customer filters.

## Taxonomy dimensions

| Internal key | Persian label | English label | Slug/value rule | Data type | Cardinality | Filterable | Sortable | Indexable landing | Structured-data relevance | Priority | Allowed values / range | Unknown behavior |
|---|---|---|---|---|---|---:|---:|---:|---|---:|---|---|
| `audience` | مخاطب | Audience / Gender | kebab-case key | enum | multiple | yes | no | yes, curated | indirect | 10 | `men`, `women`, `unisex`, `kids` | store unmapped; hide from filter |
| `style` | سبک | Style | kebab-case key | enum | multiple | yes | no | yes, curated | indirect | 20 | `luxury`, `classic`, `sport`, `dress`, `casual`, `field`, `diver`, `pilot`, `racing`, `minimal`, `smart` | store unmapped; hide from filter |
| `movement` | نوع موتور | Movement | kebab-case key | enum | single | yes | no | yes, curated | indirect/product property | 30 | `automatic`, `mechanical`, `quartz`, `solar-quartz`, `kinetic`, `digital`, `digital-smart`, `hybrid-smart`, `spring-drive`, `tourbillon`, `other` | map to `other` and preserve raw value |
| `brand` | برند | Brand | canonical brand slug | entity reference | single | yes | optional alphabetical | yes, `/brands/$brandSlug` | direct (`brand`) | 5 | repository-owned brand IDs/slugs | reject unresolved reference |
| `collection` | کالکشن | Collection | canonical collection slug | entity reference | multiple | yes | no | only approved collection routes | indirect | 35 | repository-owned collection IDs/slugs | store unresolved for review; hide |
| `case-material` | جنس قاب | Case material | kebab-case key | enum | multiple | yes | no | normally no | indirect/product property | 40 | `stainless-steel`, `titanium`, `ceramic`, `carbon`, `resin`, `aluminium`, `bronze`, `brass`, `platinum`, `gold-18k-yellow`, `gold-18k-rose`, `gold-18k-white`, `two-tone`, `recycled-material`, `other` | map to `other`; preserve raw |
| `case-color` | رنگ قاب | Case color | kebab-case color key | enum | multiple | yes | no | no | indirect | 45 | `silver`, `black`, `gold`, `rose-gold`, `white`, `blue`, `green`, `grey`, `brown`, `red`, `multicolor`, `transparent`, `other` | map to `other`; preserve raw |
| `case-diameter` | قطر قاب | Case diameter | numeric millimetres | number/range | single | yes | yes | no | indirect | 50 | `10–70 mm`; merchandising buckets: `<34`, `34–37`, `38–40`, `41–43`, `44–46`, `>46` | reject invalid number; hide if absent |
| `case-thickness` | ضخامت قاب | Case thickness | numeric millimetres | number/range | single | optional | yes | no | indirect | 55 | `1–40 mm`; optional buckets configured by catalog | reject invalid number; hide if absent |
| `glass-type` | جنس شیشه | Crystal / Glass type | kebab-case key | enum | single | yes | no | no | indirect | 60 | `sapphire`, `mineral`, `hardlex`, `acrylic`, `hesalite`, `gorilla-glass`, `other` | map to `other`; preserve raw |
| `strap-material` | جنس بند | Strap material | kebab-case key | enum | multiple | yes | no | no | indirect | 65 | `leather`, `stainless-steel`, `titanium`, `ceramic`, `rubber`, `silicone`, `resin`, `nylon`, `fabric`, `canvas`, `gold`, `mixed`, `other` | map to `other`; preserve raw |
| `strap-color` | رنگ بند | Strap color | kebab-case color key | enum | multiple | yes | no | no | indirect | 70 | `black`, `brown`, `tan`, `silver`, `gold`, `rose-gold`, `blue`, `green`, `red`, `white`, `grey`, `orange`, `pink`, `purple`, `multicolor`, `other` | map to `other`; preserve raw |
| `dial-color` | رنگ صفحه | Dial color | kebab-case color key | enum | multiple | yes | no | no | indirect (`color`) | 75 | `black`, `white`, `silver`, `blue`, `green`, `red`, `brown`, `champagne`, `gold`, `rose-gold`, `grey`, `cream`, `skeleton`, `mother-of-pearl`, `multicolor`, `other` | map to `other`; preserve raw |
| `water-resistance` | مقاومت در برابر آب | Water resistance | normalized metres plus semantic key | number + enum bucket | single | yes | yes | no | indirect | 80 | numeric `0–2000 m`; buckets `none`, `30m`, `50m`, `100m`, `200m`, `300m-plus` | reject invalid number; do not infer from copy |
| `display-type` | نوع نمایشگر | Display type | kebab-case key | enum | single | yes | no | no | indirect | 85 | `analog`, `digital`, `analog-digital`, `amoled`, `oled`, `lcd`, `e-ink`, `other` | map to `other`; preserve raw |
| `features` | قابلیت‌ها | Features / Complications | kebab-case key | enum | multiple | yes | no | no | indirect | 90 | `date`, `day-date`, `chronograph`, `gmt`, `world-time`, `moon-phase`, `power-reserve`, `alarm`, `timer`, `stopwatch`, `tachymeter`, `compass`, `altimeter`, `barometer`, `gps`, `heart-rate`, `blood-oxygen`, `nfc`, `cellular`, `bluetooth`, `wifi`, `solar-charging`, `luminous`, `skeleton`, `tourbillon`, `perpetual-calendar`, `other` | retain unmapped; hide until reviewed |
| `usage` | کاربرد | Usage | kebab-case key | enum | multiple | yes | no | only curated guides/landings | indirect | 95 | `daily`, `formal`, `business`, `diving`, `running`, `fitness`, `outdoor`, `travel`, `aviation`, `motorsport`, `fashion`, `collecting`, `gift` | retain unmapped; hide |
| `price-range` | بازه قیمت | Price range | computed amount-minor ranges per currency | computed range | single computed | yes | yes via price | no query landing by default | direct offer price | 15 | store-settings-owned dynamic buckets; never persisted as product truth | recompute; reject mixed currency |
| `availability` | وضعیت موجودی | Availability | inventory status key | enum | single per variant; aggregate per product | yes | optional | no | direct (`Offer.availability`) | 12 | `in-stock`, `low-stock`, `out-of-stock`, `backorder`, `preorder`, `not-tracked` | reject unknown operational state |
| `discount-status` | وضعیت تخفیف | Discount status | computed boolean/status | computed enum | single | yes | yes by percent | no | direct price comparison | 18 | `not-discounted`, `discounted`, `scheduled`, `expired` | recompute from valid pricing; never trust label |
| `release-newness` | تازگی عرضه | Release / Newness | ISO date plus computed bucket | date/computed enum | single | yes | yes | possible curated “new” page only | indirect | 22 | valid `releasedAt`/`publishedAt`; buckets configured, e.g. `last-30-days`, `last-90-days`, `older` | omit newest semantics when date invalid |
| `limited-edition` | نسخه محدود | Limited edition | explicit evidence-backed boolean + optional edition size | boolean/object | single | yes | no | possible curated page | indirect | 25 | `true`, `false`; optional positive `editionSize` and edition number | default unknown, not false; do not claim without evidence |
| `brand-origin` | کشور مبدأ برند | Brand origin | ISO 3166-1 alpha-2 country code | enum/reference | single | optional | no | no | indirect (`countryOfOrigin` only when semantically correct) | 100 | valid country codes; origin meaning documented as brand origin, not manufacturing country | reject invalid code; preserve source for review |
| `manufacturing-origin` | کشور ساخت | Manufacturing origin | ISO 3166-1 alpha-2 country code | enum/reference | optional single/multiple | optional | no | no | potentially direct | 105 | valid country codes with evidence and per-variant support | omit without evidence; never infer from brand |
| `warranty-type` | نوع گارانتی | Warranty type | kebab-case key | enum | single | optional | no | no | indirect | 110 | `manufacturer`, `seller`, `international`, `none` plus duration months/provider | reject unknown; no implied warranty |
| `smartwatch-compatibility` | سازگاری ساعت هوشمند | Smartwatch compatibility | platform key | enum | multiple | yes for smart category | no | no | indirect | 115 | `ios`, `android`, `harmonyos`, `windows`, `standalone`, version constraints stored separately | retain unmapped platform; hide |
| `connectivity` | اتصال | Connectivity | protocol key | enum | multiple | yes for smart category | no | no | indirect | 120 | `bluetooth`, `wifi`, `lte`, `5g`, `nfc`, `gps`, `usb`, `other` | map to `other`; preserve raw |
| `battery-life` | عمر باتری | Battery life | numeric hours plus mode | number/object | multiple by mode | yes for smart category | yes | no | indirect | 125 | positive hours; modes `typical`, `battery-saver`, `gps`, `always-on` | reject invalid; preserve mode-specific source |

## Product-versus-variant ownership

| Taxonomy | Default owner | Variant override allowed? |
|---|---|---:|
| brand, collection, primary movement family, usage | product | no, except separately modeled unusual product groups |
| case material/color, diameter, strap material/color, dial color, display type | variant | yes |
| price, availability, discount | variant | required |
| audience, style, features | product, with aggregate from variants where needed | controlled |
| smartwatch compatibility/connectivity/battery | product specification or variant when hardware differs | yes |

## Indexable clean landing routes

The initial approved taxonomy landings are route-owned, not query-owned:

- audience: `/shop/men`, `/shop/women`;
- style: `/shop/luxury`, `/shop/classic`, `/shop/sport`, `/shop/smart`;
- movement: `/shop/automatic`, `/shop/mechanical`, `/shop/quartz`;
- brands: `/brands/$brandSlug`.

All other taxonomy filters remain query parameters and are normally `noindex,follow`. A later SEO/content review may approve additional clean routes rather than making arbitrary facet URLs indexable.

## Mapping and governance

1. Product ingestion validates technical values against this contract.
2. Unknown values are logged for taxonomy review.
3. New keys require an ADR or supervisor-approved contract change.
4. Aliases may map supplier terms to one canonical key without changing public URLs.
5. Removing a key requires migration and redirect analysis for any clean landing page.
6. Labels may change without changing keys.
7. Counts and available values are repository projections from currently visible variants.
