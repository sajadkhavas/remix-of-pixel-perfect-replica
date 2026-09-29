import { Link } from "@tanstack/react-router";
import {
  Check,
  Crown,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Watch,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { DiscoveryProductCard } from "@/components/discovery/discovery-product-card";
import { EmptyState } from "@/components/system/feedback";
import type { DiscoverySearchState } from "@/domain/search";
import {
  activeDiscoveryFilterCount,
  AVAILABILITY_OPTIONS,
  DEFAULT_DISCOVERY_SORT,
  DISCOVERY_SORT_OPTIONS,
  discoveryFilterLabel,
  patchDiscoveryState,
  toggleDiscoveryValue,
  type DiscoveryLoadResult,
} from "@/lib/discovery";
import { cn } from "@/lib/utils";

type DiscoveryStateChange = (
  next: DiscoverySearchState,
) => void | Promise<void>;

interface DiscoveryCatalogProps {
  readonly pathname: string;
  readonly state: DiscoverySearchState;
  readonly data: DiscoveryLoadResult;
  readonly lockedCategorySlug?: string;
  readonly hideHeader?: boolean;
  readonly onStateChange: DiscoveryStateChange;
}

interface ActiveChip {
  readonly key: string;
  readonly label: string;
  readonly nextState: DiscoverySearchState;
}

function FilterButton({
  selected,
  children,
  count,
  onSelect,
}: {
  readonly selected: boolean;
  readonly children: ReactNode;
  readonly count?: number;
  readonly onSelect: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => void onSelect()}
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70",
        selected
          ? "border-[#C9A84C]/55 bg-[#C9A84C]/[0.13] text-[#F5F0E7] shadow-[inset_0_0_0_1px_rgba(201,168,76,0.08)]"
          : "border-white/[0.07] bg-white/[0.018] text-[#AAA49A] hover:border-white/[0.14] hover:bg-white/[0.035] hover:text-[#EEE8DE]",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
            selected
              ? "border-[#C9A84C] bg-[#C9A84C] text-[#08090B]"
              : "border-white/[0.16] bg-transparent text-transparent",
          )}
          aria-hidden="true"
        >
          <Check className="size-2.5" strokeWidth={3} />
        </span>

        <span className="min-w-0 truncate">{children}</span>
      </span>

      {count !== undefined ? (
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] tabular-nums",
            selected
              ? "bg-[#C9A84C]/15 text-[#E5CE8C]"
              : "bg-white/[0.035] text-[#77716A]",
          )}
        >
          {count.toLocaleString("fa-IR")}
        </span>
      ) : null}
    </button>
  );
}

function FilterGroup({
  title,
  values,
  selected,
  nextFor,
  onStateChange,
  onNavigate,
}: {
  readonly title: string;
  readonly values: readonly string[];
  readonly selected: readonly string[];
  readonly nextFor: (value: string) => DiscoverySearchState;
  readonly onStateChange: DiscoveryStateChange;
  readonly onNavigate?: () => void;
}) {
  if (values.length === 0) return null;

  return (
    <fieldset className="grid gap-2 border-t border-white/[0.07] pt-5">
      <legend className="mb-2 text-xs font-semibold text-[#E9E4DC]">
        {title}
      </legend>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        {values.map((value) => (
          <FilterButton
            key={value}
            selected={selected.includes(value)}
            onSelect={async () => {
              onNavigate?.();
              await onStateChange(nextFor(value));
            }}
          >
            {discoveryFilterLabel(value)}
          </FilterButton>
        ))}
      </div>
    </fieldset>
  );
}

function categoryIcon(slug: string) {
  if (slug.includes("luxury")) return Crown;
  if (slug.includes("smart")) return Sparkles;
  if (slug.includes("sport")) return Timer;
  return Watch;
}

const FILTER_KEY_MAP = {
  brand: "brand",
  audience: "audience",
  style: "style",
  movement: "movement",
  caseSize: "case-diameter",
  caseMaterial: "case-material",
  strapMaterial: "strap-material",
  dialColor: "dial-color",
  waterResistance: "water-resistance",
  availability: "availability",
  price: "price",
  discount: "discount",
} as const;

type CatalogFilterKey = keyof typeof FILTER_KEY_MAP;

function categoryAllowsFilter(
  data: DiscoveryLoadResult,
  lockedCategorySlug: string | undefined,
  key: CatalogFilterKey,
): boolean {
  if (!lockedCategorySlug) return true;

  const category = data.categories.find(
    (item) => item.slug === lockedCategorySlug,
  );

  if (!category) return false;

  return category.allowedFilterKeys.includes(
    FILTER_KEY_MAP[key],
  );
}

function CategoryNavigation({
  data,
  lockedCategorySlug,
}: {
  readonly data: DiscoveryLoadResult;
  readonly lockedCategorySlug?: string;
}) {
  return (
    <nav
      aria-label="دسته‌بندی‌های فروشگاه"
      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <Link
        to="/shop"
        search={{}}
        resetScroll
        viewTransition
        activeOptions={{ exact: true, includeSearch: false }}
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors",
          !lockedCategorySlug
            ? "border-[#C9A84C]/55 bg-[#C9A84C]/[0.13] text-[#E7CF88]"
            : "border-white/[0.08] bg-[#0D0F11] text-[#9B958C] hover:border-[#C9A84C]/25 hover:text-[#D9C17C]",
        )}
      >
        <Grid2X2 className="size-3.5" aria-hidden="true" />
        همه ساعت‌ها
      </Link>

      {data.categories.map((category) => {
        const Icon = categoryIcon(category.slug);
        const active = lockedCategorySlug === category.slug;

        return (
          <Link
            key={category.id}
            to="/shop/$category"
            params={{ category: category.slug }}
            search={{}}
            resetScroll
            viewTransition
            activeOptions={{
              exact: true,
              includeSearch: false,
            }}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors",
              active
                ? "border-[#C9A84C]/55 bg-[#C9A84C]/[0.13] text-[#E7CF88]"
                : "border-white/[0.08] bg-[#0D0F11] text-[#9B958C] hover:border-[#C9A84C]/25 hover:text-[#D9C17C]",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {category.title.default}
          </Link>
        );
      })}
    </nav>
  );
}
function DiscoveryFilters({
  state,
  data,
  lockedCategorySlug,
  onStateChange,
  onNavigate,
}: DiscoveryCatalogProps & {
  readonly onNavigate?: () => void;
}) {

  const resetState = patchDiscoveryState(state, {
    q: undefined,
    category: [],
    brand: [],
    audience: [],
    style: [],
    movement: [],
    priceMin: undefined,
    priceMax: undefined,
    caseSize: [],
    caseMaterial: [],
    strapMaterial: [],
    dialColor: [],
    waterResistance: [],
    availability: [],
    discount: false,
    sort: DEFAULT_DISCOVERY_SORT,
    view: state.view,
  });

  const brandFacet = data.facets.find(
    (facet) => facet.filterKey === "brand",
  );

  const groups = [
    ["کاربری", data.options.audience, state.audience, "audience"],
    ["استایل", data.options.style, state.style, "style"],
    ["نوع موتور", data.options.movement, state.movement, "movement"],
    ["جنس قاب", data.options.caseMaterial, state.caseMaterial, "caseMaterial"],
    ["جنس بند", data.options.strapMaterial, state.strapMaterial, "strapMaterial"],
    ["رنگ صفحه", data.options.dialColor, state.dialColor, "dialColor"],
    [
      "مقاومت در برابر آب",
      data.options.waterResistance,
      state.waterResistance,
      "waterResistance",
    ],
  ] as const;

  async function submitPriceRange(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const minRaw = String(form.get("priceMin") ?? "").trim();
    const maxRaw = String(form.get("priceMax") ?? "").trim();

    const parsedMin = minRaw === "" ? undefined : Number(minRaw);
    const parsedMax = maxRaw === "" ? undefined : Number(maxRaw);

    let priceMin =
      parsedMin !== undefined && Number.isFinite(parsedMin)
        ? Math.max(0, Math.trunc(parsedMin))
        : undefined;

    let priceMax =
      parsedMax !== undefined && Number.isFinite(parsedMax)
        ? Math.max(0, Math.trunc(parsedMax))
        : undefined;

    if (
      priceMin !== undefined &&
      priceMax !== undefined &&
      priceMin > priceMax
    ) {
      [priceMin, priceMax] = [priceMax, priceMin];
    }

    const next = patchDiscoveryState(state, {
      priceMin,
      priceMax,
    });

    onNavigate?.();
    await onStateChange(next);
  }

  return (
    <div className="grid gap-5" dir="rtl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className="text-[8px] font-semibold tracking-[0.28em] text-[#C9A84C]"
            dir="ltr"
          >
            FILTERS
          </p>
          <h2 className="mt-1 text-base font-semibold text-[#F0EDE8]">
            فیلتر محصولات
          </h2>
        </div>

        {activeDiscoveryFilterCount(state) > 0 ? (
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              void onStateChange(resetState);
            }}
            className="inline-flex min-h-10 items-center rounded-lg px-2 text-[10px] font-semibold text-[#CDB46F] transition-colors hover:text-[#E5CF8B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70"
          >
            پاک کردن همه
          </button>
        ) : null}
      </div>

      {!lockedCategorySlug ? (
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-xs font-semibold text-[#E9E4DC]">
            دسته‌بندی
          </legend>

          <FilterButton
            selected={state.category.length === 0}
            onSelect={async () => {
              onNavigate?.();
              await onStateChange(
                patchDiscoveryState(state, {
                  category: [],
                }),
              );
            }}
          >
            همه دسته‌ها
          </FilterButton>

          {data.categories.map((category) => (
            <FilterButton
              key={category.id}
              selected={state.category.includes(category.slug)}
              onSelect={async () => {
                onNavigate?.();
                await onStateChange(
                  patchDiscoveryState(state, {
                    category: toggleDiscoveryValue(
                      state.category,
                      category.slug,
                    ),
                  }),
                );
              }}
            >
              {category.title.default}
            </FilterButton>
          ))}
        </fieldset>
      ) : null}

      {categoryAllowsFilter(
        data,
        lockedCategorySlug,
        "brand",
      ) && brandFacet?.buckets.length ? (
        <fieldset className="grid gap-2 border-t border-white/[0.07] pt-5">
          <legend className="mb-2 text-xs font-semibold text-[#E9E4DC]">
            برند
          </legend>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {brandFacet.buckets.map((bucket) => (
              <FilterButton
                key={bucket.valueKey}
                selected={state.brand.includes(bucket.valueKey)}
                count={bucket.count}
                onSelect={async () => {
                  onNavigate?.();
                  await onStateChange(
                    patchDiscoveryState(state, {
                      brand: toggleDiscoveryValue(
                        state.brand,
                        bucket.valueKey,
                      ),
                    }),
                  );
                }}
              >
                {discoveryFilterLabel(bucket.valueKey)}
              </FilterButton>
            ))}
          </div>
        </fieldset>
      ) : null}

      {groups
        .filter(([, , , key]) =>
          categoryAllowsFilter(
            data,
            lockedCategorySlug,
            key,
          ),
        )
        .map(([title, values, selected, key]) => (
          <FilterGroup
            key={key}
            title={title}
            values={values}
            selected={selected}
            onNavigate={onNavigate}
            onStateChange={onStateChange}
            nextFor={(value) =>
              patchDiscoveryState(state, {
                [key]: toggleDiscoveryValue(
                  selected,
                  value,
                ),
              })
            }
          />
        ))}

      {categoryAllowsFilter(
        data,
        lockedCategorySlug,
        "caseSize",
      ) && data.options.caseSize.length > 0 ? (
        <fieldset className="grid gap-2 border-t border-white/[0.07] pt-5">
          <legend className="mb-2 text-xs font-semibold text-[#E9E4DC]">
            اندازه قاب
          </legend>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {data.options.caseSize.map((value) => {
              const selected = state.caseSize.includes(value);
              const nextCaseSize = selected
                ? state.caseSize.filter((item) => item !== value)
                : [...state.caseSize, value].sort((a, b) => a - b);

              return (
                <FilterButton
                  key={value}
                  selected={selected}
                  onSelect={async () => {
                    onNavigate?.();
                    await onStateChange(
                      patchDiscoveryState(state, {
                        caseSize: nextCaseSize,
                      }),
                    );
                  }}
                >
                  {`${value.toLocaleString("fa-IR")} میلی‌متر`}
                </FilterButton>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {categoryAllowsFilter(
        data,
        lockedCategorySlug,
        "availability",
      ) ? (
        <fieldset className="grid gap-2 border-t border-white/[0.07] pt-5">
        <legend className="mb-2 text-xs font-semibold text-[#E9E4DC]">
          وضعیت موجودی
        </legend>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {AVAILABILITY_OPTIONS.map((option) => {
            const availability = toggleDiscoveryValue(
              state.availability,
              option.value,
            ) as DiscoverySearchState["availability"];

            return (
              <FilterButton
                key={option.value}
                selected={state.availability.includes(option.value)}
                onSelect={async () => {
                  onNavigate?.();
                  await onStateChange(
                    patchDiscoveryState(state, {
                      availability,
                    }),
                  );
                }}
              >
                {option.label}
              </FilterButton>
            );
          })}
        </div>
        </fieldset>
      ) : null}

      {categoryAllowsFilter(
        data,
        lockedCategorySlug,
        "price",
      ) ? (
        <fieldset className="grid gap-3 border-t border-white/[0.07] pt-5">
        <legend className="mb-1 text-xs font-semibold text-[#E9E4DC]">
          بازه قیمت
        </legend>

        <form
          key={`${state.priceMin ?? ""}-${state.priceMax ?? ""}`}
          onSubmit={submitPriceRange}
          className="grid gap-3"
        >
          <label className="grid gap-1.5 text-[10px] text-[#8F887F]">
            حداقل قیمت
            <input
              name="priceMin"
              type="number"
              inputMode="numeric"
              min="0"
              defaultValue={state.priceMin}
              className="min-h-11 rounded-xl border border-white/[0.08] bg-[#0B0D0F] px-3 text-sm text-[#F0EDE8] outline-none transition-colors placeholder:text-[#5D5954] focus:border-[#C9A84C]/45 focus:ring-2 focus:ring-[#C9A84C]/10"
            />
          </label>

          <label className="grid gap-1.5 text-[10px] text-[#8F887F]">
            حداکثر قیمت
            <input
              name="priceMax"
              type="number"
              inputMode="numeric"
              min="0"
              defaultValue={state.priceMax}
              className="min-h-11 rounded-xl border border-white/[0.08] bg-[#0B0D0F] px-3 text-sm text-[#F0EDE8] outline-none transition-colors placeholder:text-[#5D5954] focus:border-[#C9A84C]/45 focus:ring-2 focus:ring-[#C9A84C]/10"
            />
          </label>

          <button
            type="submit"
            className="min-h-11 rounded-xl border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] px-4 text-xs font-semibold text-[#D8C17E] transition-all hover:border-[#C9A84C]/45 hover:bg-[#C9A84C]/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70"
          >
            اعمال بازه قیمت
          </button>
        </form>
        </fieldset>
      ) : null}

      {categoryAllowsFilter(
        data,
        lockedCategorySlug,
        "discount",
      ) ? (
        <fieldset className="grid gap-2 border-t border-white/[0.07] pt-5">
        <legend className="mb-2 text-xs font-semibold text-[#E9E4DC]">
          تخفیف
        </legend>

        <FilterButton
          selected={state.discount}
          onSelect={async () => {
            onNavigate?.();
            await onStateChange(
              patchDiscoveryState(state, {
                discount: !state.discount,
              }),
            );
          }}
        >
          فقط محصولات دارای تخفیف
        </FilterButton>
        </fieldset>
      ) : null}
    </div>
  );
}

function ActiveFilters({
  state,
  lockedCategorySlug,
  onStateChange,
}: Pick<
  DiscoveryCatalogProps,
  "state" | "lockedCategorySlug" | "onStateChange"
>) {
  const chips: ActiveChip[] = [];

  const addList = (
    key: string,
    values: readonly string[],
    remove: (value: string) => DiscoverySearchState,
  ) => {
    values.forEach((value) => {
      chips.push({
        key: `${key}:${value}`,
        label: discoveryFilterLabel(value),
        nextState: remove(value),
      });
    });
  };

  if (state.q) {
    chips.push({
      key: `q:${state.q}`,
      label: `جستجو: ${state.q}`,
      nextState: patchDiscoveryState(state, {
        q: undefined,
      }),
    });
  }

  if (!lockedCategorySlug) {
    addList("category", state.category, (value) =>
      patchDiscoveryState(state, {
        category: toggleDiscoveryValue(
          state.category,
          value,
        ),
      }),
    );
  }

  addList("brand", state.brand, (value) =>
    patchDiscoveryState(state, {
      brand: toggleDiscoveryValue(
        state.brand,
        value,
      ),
    }),
  );

  addList("audience", state.audience, (value) =>
    patchDiscoveryState(state, {
      audience: toggleDiscoveryValue(
        state.audience,
        value,
      ),
    }),
  );

  addList("style", state.style, (value) =>
    patchDiscoveryState(state, {
      style: toggleDiscoveryValue(
        state.style,
        value,
      ),
    }),
  );

  addList("movement", state.movement, (value) =>
    patchDiscoveryState(state, {
      movement: toggleDiscoveryValue(
        state.movement,
        value,
      ),
    }),
  );

  addList("caseMaterial", state.caseMaterial, (value) =>
    patchDiscoveryState(state, {
      caseMaterial: toggleDiscoveryValue(
        state.caseMaterial,
        value,
      ),
    }),
  );

  addList("strapMaterial", state.strapMaterial, (value) =>
    patchDiscoveryState(state, {
      strapMaterial: toggleDiscoveryValue(
        state.strapMaterial,
        value,
      ),
    }),
  );

  addList("dialColor", state.dialColor, (value) =>
    patchDiscoveryState(state, {
      dialColor: toggleDiscoveryValue(
        state.dialColor,
        value,
      ),
    }),
  );

  addList(
    "waterResistance",
    state.waterResistance,
    (value) =>
      patchDiscoveryState(state, {
        waterResistance: toggleDiscoveryValue(
          state.waterResistance,
          value,
        ),
      }),
  );

  state.availability.forEach((value) => {
    chips.push({
      key: `availability:${value}`,
      label:
        AVAILABILITY_OPTIONS.find(
          (option) => option.value === value,
        )?.label ??
        discoveryFilterLabel(value),
      nextState: patchDiscoveryState(state, {
        availability: toggleDiscoveryValue(
          state.availability,
          value,
        ) as DiscoverySearchState["availability"],
      }),
    });
  });

  state.caseSize.forEach((value) => {
    chips.push({
      key: `caseSize:${value}`,
      label: `${value.toLocaleString("fa-IR")} میلی‌متر`,
      nextState: patchDiscoveryState(state, {
        caseSize: state.caseSize.filter(
          (item) => item !== value,
        ),
      }),
    });
  });

  if (
    state.priceMin !== undefined ||
    state.priceMax !== undefined
  ) {
    const min =
      state.priceMin !== undefined
        ? state.priceMin.toLocaleString("fa-IR")
        : "—";

    const max =
      state.priceMax !== undefined
        ? state.priceMax.toLocaleString("fa-IR")
        : "—";

    chips.push({
      key: "price",
      label: `قیمت: ${min} تا ${max}`,
      nextState: patchDiscoveryState(state, {
        priceMin: undefined,
        priceMax: undefined,
      }),
    });
  }

  if (state.discount) {
    chips.push({
      key: "discount",
      label: "دارای تخفیف",
      nextState: patchDiscoveryState(state, {
        discount: false,
      }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="فیلترهای فعال"
    >
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() =>
            void onStateChange(chip.nextState)
          }
          className="inline-flex min-h-9 shrink-0 snap-start items-center gap-2 rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/[0.08] px-3 text-[10px] text-[#D6C17F] transition-colors hover:border-[#C9A84C]/45 hover:bg-[#C9A84C]/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70"
        >
          <span>{chip.label}</span>
          <X className="size-3" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
export function DiscoveryCatalog(
  props: DiscoveryCatalogProps,
) {
  const {
    state,
    data,
    lockedCategorySlug,
    hideHeader = false,
    onStateChange,
  } = props;

  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!filtersOpen || typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filtersOpen]);

  const activeCount = activeDiscoveryFilterCount(state);

  const currentCategory = lockedCategorySlug
    ? data.categories.find(
        (category) => category.slug === lockedCategorySlug,
      )
    : undefined;


  async function submitSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const query = String(form.get("q") ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 120);

    await onStateChange(
      patchDiscoveryState(state, {
        q: query || undefined,
      }),
    );
  }

  async function changeSort(
    sort: DiscoverySearchState["sort"],
  ) {
    await onStateChange(
      patchDiscoveryState(state, { sort }),
    );
  }

  return (
    <section
      className="relative overflow-hidden bg-[#08090B] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
      dir="rtl"
      aria-labelledby="catalog-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.065),transparent_68%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-[1500px] gap-7 lg:gap-8">
        {!hideHeader ? (
          <header className="grid gap-5 border-b border-white/[0.07] pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <span
                    className="h-px w-7 bg-[#C9A84C]"
                    aria-hidden="true"
                  />
                  <span
                    className="text-[9px] font-semibold tracking-[0.34em] text-[#C9A84C]"
                    dir="ltr"
                  >
                    {lockedCategorySlug ? "COLLECTION" : "KRONOS CATALOG"}
                  </span>
                </div>

                <h1
                  id="catalog-title"
                  className="mt-3 text-3xl font-semibold leading-tight text-[#F2EEE6] sm:text-4xl lg:text-5xl"
                  style={{
                    fontFamily:
                      "Playfair Display, Vazirmatn Variable, serif",
                  }}
                >
                  {currentCategory?.title.default ?? "فروشگاه ساعت"}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#979188] sm:text-base sm:leading-8">
                  {currentCategory
                    ? currentCategory.intro?.default ??
                      "محصولات این دسته را مرور و مقایسه کنید."
                    : "مجموعه KRONOS را بر اساس دسته‌بندی، برند، مشخصات، قیمت و وضعیت موجودی جستجو و مقایسه کنید."}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#8A847C]">
                <span className="size-1.5 rounded-full bg-[#C9A84C]" />
                <strong className="font-semibold tabular-nums text-[#D9D1C5]">
                  {data.totalItems.toLocaleString("fa-IR")}
                </strong>
                <span>محصول</span>
              </div>
            </div>
          </header>
        ) : null}

        <CategoryNavigation
          data={data}
          lockedCategorySlug={lockedCategorySlug}
        />

        <form
          onSubmit={submitSearch}
          role="search"
          className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
        >
          <label className="relative block">
            <span className="sr-only">جستجو در کاتالوگ</span>
            <Search
              className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-[#756F67]"
              aria-hidden="true"
            />
            <input
              key={state.q ?? ""}
              name="q"
              type="search"
              defaultValue={state.q ?? ""}
              placeholder="جستجو بر اساس نام، مدل، برند یا کد..."
              className="min-h-12 w-full rounded-xl border border-white/[0.08] bg-[#0D0F11] pe-11 ps-4 text-sm text-[#EEE8DE] outline-none placeholder:text-[#655F58] focus:border-[#C9A84C]/40 focus:ring-2 focus:ring-[#C9A84C]/10"
            />
          </label>

          <button
            type="submit"
            className="min-h-12 rounded-xl bg-[#C9A84C] px-6 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
          >
            جستجو
          </button>
        </form>

        <div className="grid gap-4 rounded-[1.15rem] border border-white/[0.07] bg-[#0C0E10] p-3 sm:flex sm:items-center sm:justify-between sm:p-4">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.08] px-3 text-xs font-semibold text-[#CBC4B9] transition-colors hover:border-[#C9A84C]/30 hover:text-[#E1C77E] lg:hidden"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              فیلترها
              {activeCount > 0 ? (
                <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[9px] font-bold text-[#090A0C]">
                  {activeCount.toLocaleString("fa-IR")}
                </span>
              ) : null}
            </button>

            <p className="text-xs text-[#8D877F]" aria-live="polite">
              نمایش{" "}
              <strong className="font-semibold text-[#D9D2C8]">
                {data.cards.length.toLocaleString("fa-IR")}
              </strong>{" "}
              مورد از {data.totalItems.toLocaleString("fa-IR")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="catalog-sort">
              مرتب‌سازی
            </label>

            <select
              id="catalog-sort"
              value={state.sort}
              onChange={(event) =>
                void changeSort(
                  event.currentTarget.value as DiscoverySearchState["sort"],
                )
              }
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#0D0F11] px-3 text-xs text-[#D7D0C6] outline-none transition-colors focus:border-[#C9A84C]/40 focus:ring-2 focus:ring-[#C9A84C]/10 sm:min-w-[160px]"
            >
              {DISCOVERY_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div
              className="flex shrink-0 rounded-xl border border-white/[0.08] bg-[#0D0F11] p-1"
              aria-label="نوع نمایش"
            >
              {(["grid", "list"] as const).map((view) => {
                const Icon = view === "grid" ? Grid2X2 : List;
                const selected = state.view === view;

                return (
                  <button
                    key={view}
                    type="button"
                    aria-pressed={selected}
                    aria-label={
                      view === "grid"
                        ? "نمایش شبکه‌ای"
                        : "نمایش فهرستی"
                    }
                    onClick={() =>
                      void onStateChange(
                        patchDiscoveryState(state, { view }),
                      )
                    }
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70 sm:size-10",
                      selected
                        ? "bg-[#C9A84C]/[0.14] text-[#E2C87E]"
                        : "text-[#6F6962] hover:text-[#B9B1A6]",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <ActiveFilters
          state={state}
          lockedCategorySlug={lockedCategorySlug}
          onStateChange={onStateChange}
        />

        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[18.5rem_minmax(0,1fr)]">
          <aside className="hidden self-start rounded-[1.25rem] border border-white/[0.07] bg-[#0C0E10] p-4 lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]">
            <DiscoveryFilters {...props} />
          </aside>

          <div className="min-w-0">
            {data.cards.length === 0 ? (
              <div className="rounded-[1.5rem] border border-white/[0.07] bg-[#0C0E10] p-3 sm:p-5">
                <EmptyState
                  title="محصولی با این فیلترها پیدا نشد"
                  description="فیلترها را تغییر دهید یا همه فیلترها را پاک کنید."
                  action={
                    <button
                      type="button"
                      onClick={() =>
                        void onStateChange(
                          patchDiscoveryState(state, {
                            q: undefined,
                            category: lockedCategorySlug
                              ? state.category
                              : [],
                            brand: [],
                            audience: [],
                            style: [],
                            movement: [],
                            priceMin: undefined,
                            priceMax: undefined,
                            caseSize: [],
                            caseMaterial: [],
                            strapMaterial: [],
                            dialColor: [],
                            waterResistance: [],
                            availability: [],
                            discount: false,
                            sort: DEFAULT_DISCOVERY_SORT,
                          }),
                        )
                      }
                      className="inline-flex min-h-11 items-center rounded-xl bg-[#C9A84C] px-5 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
                    >
                      پاک کردن فیلترها
                    </button>
                  }
                />
              </div>
            ) : (
              <div
                className={cn(
                  state.view === "grid"
                    ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 2xl:grid-cols-4"
                    : "grid gap-3 sm:gap-4",
                )}
              >
                {data.cards.map((model, index) => (
                  <DiscoveryProductCard
                    key={model.id}
                    model={model}
                    view={state.view}
                    imagePriority={index < 3}
                  />
                ))}
              </div>
            )}

            {data.totalPages > 1 ? (
              <nav
                className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#0C0E10] p-3 sm:p-4"
                aria-label="صفحه‌بندی کاتالوگ"
              >
                {data.page > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      void onStateChange(
                        patchDiscoveryState(
                          state,
                          { page: data.page - 1 },
                          { keepPage: true },
                        ),
                      )
                    }
                    className="inline-flex min-h-10 items-center rounded-xl border border-white/[0.08] px-3 text-[10px] font-semibold text-[#B9B1A6] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C] sm:min-h-11 sm:px-4 sm:text-xs"
                  >
                    صفحه قبل
                  </button>
                ) : (
                  <span className="w-20 sm:w-24" />
                )}

                <span className="text-center text-[10px] tabular-nums text-[#817B73] sm:text-xs">
                  صفحه{" "}
                  <strong className="font-semibold text-[#D8D1C7]">
                    {data.page.toLocaleString("fa-IR")}
                  </strong>{" "}
                  از {data.totalPages.toLocaleString("fa-IR")}
                </span>

                {data.page < data.totalPages ? (
                  <button
                    type="button"
                    onClick={() =>
                      void onStateChange(
                        patchDiscoveryState(
                          state,
                          { page: data.page + 1 },
                          { keepPage: true },
                        ),
                      )
                    }
                    className="inline-flex min-h-10 items-center rounded-xl border border-white/[0.08] px-3 text-[10px] font-semibold text-[#B9B1A6] transition-colors hover:border-[#C9A84C]/30 hover:text-[#DCC27C] sm:min-h-11 sm:px-4 sm:text-xs"
                  >
                    صفحه بعد
                  </button>
                ) : (
                  <span className="w-20 sm:w-24" />
                )}
              </nav>
            ) : null}
          </div>
        </div>
      </div>

      {filtersOpen ? (
        <div
          className="fixed inset-0 z-[90] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="فیلتر محصولات"
        >
          <button
            type="button"
            aria-label="بستن فیلترها"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-hidden rounded-t-[1.75rem] border-t border-white/[0.09] bg-[#0A0C0E] shadow-[0_-30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div>
                <span
                  className="text-[8px] font-semibold tracking-[0.28em] text-[#C9A84C]"
                  dir="ltr"
                >
                  FILTERS
                </span>
                <h2 className="mt-1 text-base font-semibold text-[#F0EDE8]">
                  فیلتر محصولات
                </h2>
              </div>

              <button
                type="button"
                aria-label="بستن"
                onClick={() => setFiltersOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/[0.08] text-[#A59E94]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[calc(88dvh-4.5rem)] overflow-y-auto overscroll-contain px-4 py-5">
              <DiscoveryFilters
                {...props}
                onNavigate={() => setFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function DiscoveryCatalogPending() {
  return (
    <section
      className="bg-[#08090B] px-4 py-10 sm:px-6 lg:px-8"
      dir="rtl"
      aria-label="در حال بارگذاری فروشگاه"
    >
      <div className="mx-auto grid w-full max-w-[1500px] gap-6">
        <div className="h-28 animate-pulse rounded-2xl bg-white/[0.04] motion-reduce:animate-none" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="h-11 w-28 shrink-0 animate-pulse rounded-full bg-white/[0.04] motion-reduce:animate-none"
            />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-2xl bg-white/[0.04] motion-reduce:animate-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
