import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { DiscoveryProductCard } from "@/components/discovery/discovery-product-card";
import { EmptyState } from "@/components/system/feedback";
import type { DiscoverySearchState } from "@/domain/search";
import {
  activeDiscoveryFilterCount,
  AVAILABILITY_OPTIONS,
  DEFAULT_DISCOVERY_SORT,
  DISCOVERY_SORT_OPTIONS,
  discoveryFilterLabel,
  discoveryHiddenEntries,
  discoveryHref,
  patchDiscoveryState,
  toggleDiscoveryValue,
  type DiscoveryLoadResult,
} from "@/lib/discovery";
import { cn } from "@/lib/utils";

interface DiscoveryCatalogProps {
  readonly pathname: string;
  readonly state: DiscoverySearchState;
  readonly data: DiscoveryLoadResult;
  readonly lockedCategorySlug?: string;
}

function HiddenDiscoveryFields({
  state,
  omitted,
  stripCategory,
}: {
  readonly state: DiscoverySearchState;
  readonly omitted: readonly string[];
  readonly stripCategory: boolean;
}) {
  return discoveryHiddenEntries(state, omitted, { stripCategory }).map(([name, value]) => (
    <input key={`${name}:${value}`} type="hidden" name={name} value={value} />
  ));
}

function FilterLink({
  href,
  selected,
  children,
  count,
}: {
  readonly href: string;
  readonly selected: boolean;
  readonly children: ReactNode;
  readonly count?: number;
}) {
  return (
    <a
      href={href}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex min-h-11 items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        selected
          ? "border-accent-primary bg-accent-muted text-text-primary"
          : "border-border-subtle bg-background-surface text-text-secondary hover:border-border-default hover:text-text-primary",
      )}
    >
      <span>{children}</span>
      {count !== undefined ? (
        <span className="tabular-nums text-xs text-text-muted">
          {count.toLocaleString("fa-IR")}
        </span>
      ) : null}
    </a>
  );
}

function FilterGroup({
  title,
  values,
  selected,
  hrefFor,
}: {
  readonly title: string;
  readonly values: readonly string[];
  readonly selected: readonly string[];
  readonly hrefFor: (value: string) => string;
}) {
  if (values.length === 0) return null;

  return (
    <fieldset className="grid gap-2 border-t border-border-subtle pt-5">
      <legend className="mb-2 text-sm font-semibold text-text-primary">{title}</legend>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        {values.map((value) => (
          <FilterLink key={value} href={hrefFor(value)} selected={selected.includes(value)}>
            {discoveryFilterLabel(value)}
          </FilterLink>
        ))}
      </div>
    </fieldset>
  );
}

function DiscoveryFilters({ pathname, state, data, lockedCategorySlug }: DiscoveryCatalogProps) {
  const stripCategory = Boolean(lockedCategorySlug);
  const href = (next: DiscoverySearchState, targetPathname = pathname) =>
    discoveryHref(targetPathname, next, { stripCategory });
  const resetState = patchDiscoveryState(state, {
    q: undefined,
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
  const brandFacet = data.facets.find((facet) => facet.filterKey === "brand");
  const groups = [
    ["کاربری", data.options.audience, state.audience, "audience"],
    ["استایل", data.options.style, state.style, "style"],
    ["نوع موتور", data.options.movement, state.movement, "movement"],
    ["جنس قاب", data.options.caseMaterial, state.caseMaterial, "caseMaterial"],
    ["رنگ صفحه", data.options.dialColor, state.dialColor, "dialColor"],
    ["مقاومت در برابر آب", data.options.waterResistance, state.waterResistance, "waterResistance"],
  ] as const;

  return (
    <div className="grid gap-5" dir="rtl">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text-primary">فیلتر محصولات</h2>
        {activeDiscoveryFilterCount(state) > 0 ? (
          <a
            href={href(resetState)}
            className="min-h-11 rounded-md px-2 py-3 text-xs font-semibold text-accent-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            پاک کردن فیلترها
          </a>
        ) : null}
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-semibold text-text-primary">دسته‌بندی</legend>
        <FilterLink
          href={discoveryHref("/shop", patchDiscoveryState(state, { category: undefined }), {
            stripCategory: true,
          })}
          selected={!lockedCategorySlug && !state.category}
        >
          همه دسته‌ها
        </FilterLink>
        {data.categories.map((category) => (
          <FilterLink
            key={category.id}
            href={discoveryHref(
              `/shop/${category.slug}`,
              patchDiscoveryState(state, { category: undefined }),
              { stripCategory: true },
            )}
            selected={lockedCategorySlug === category.slug || state.category === category.slug}
          >
            {category.title.default}
          </FilterLink>
        ))}
      </fieldset>

      {brandFacet?.buckets.length ? (
        <fieldset className="grid gap-2 border-t border-border-subtle pt-5">
          <legend className="mb-2 text-sm font-semibold text-text-primary">برند</legend>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {brandFacet.buckets.map((bucket) => (
              <FilterLink
                key={bucket.valueKey}
                href={href(
                  patchDiscoveryState(state, {
                    brand: toggleDiscoveryValue(state.brand, bucket.valueKey),
                  }),
                )}
                selected={state.brand.includes(bucket.valueKey)}
                count={bucket.count}
              >
                {discoveryFilterLabel(bucket.valueKey)}
              </FilterLink>
            ))}
          </div>
        </fieldset>
      ) : null}

      {groups.map(([title, values, selected, key]) => (
        <FilterGroup
          key={key}
          title={title}
          values={values}
          selected={selected}
          hrefFor={(value) =>
            href(
              patchDiscoveryState(state, {
                [key]: toggleDiscoveryValue(selected, value),
              }),
            )
          }
        />
      ))}

      <fieldset className="grid gap-2 border-t border-border-subtle pt-5">
        <legend className="mb-2 text-sm font-semibold text-text-primary">وضعیت موجودی</legend>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {AVAILABILITY_OPTIONS.map((option) => {
            const availability = toggleDiscoveryValue(
              state.availability,
              option.value,
            ) as DiscoverySearchState["availability"];
            return (
              <FilterLink
                key={option.value}
                href={href(patchDiscoveryState(state, { availability }))}
                selected={state.availability.includes(option.value)}
              >
                {option.label}
              </FilterLink>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="grid gap-3 border-t border-border-subtle pt-5">
        <legend className="mb-1 text-sm font-semibold text-text-primary">بازه قیمت</legend>
        <form action={pathname} method="get" className="grid gap-3">
          <HiddenDiscoveryFields
            state={state}
            omitted={["priceMin", "priceMax", "page"]}
            stripCategory={stripCategory}
          />
          <label className="grid gap-1 text-xs text-text-secondary">
            حداقل قیمت
            <input
              name="priceMin"
              type="number"
              inputMode="numeric"
              min="0"
              defaultValue={state.priceMin}
              className="min-h-11 rounded-md border border-border-default bg-background-surface px-3 text-sm text-text-primary outline-none focus:border-accent-primary focus:ring-2 focus:ring-focus-ring"
            />
          </label>
          <label className="grid gap-1 text-xs text-text-secondary">
            حداکثر قیمت
            <input
              name="priceMax"
              type="number"
              inputMode="numeric"
              min="0"
              defaultValue={state.priceMax}
              className="min-h-11 rounded-md border border-border-default bg-background-surface px-3 text-sm text-text-primary outline-none focus:border-accent-primary focus:ring-2 focus:ring-focus-ring"
            />
          </label>
          <button
            type="submit"
            className="min-h-11 rounded-md border border-border-default bg-background-elevated px-4 text-sm font-semibold text-text-primary hover:border-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            اعمال بازه قیمت
          </button>
        </form>
      </fieldset>

      <fieldset className="grid gap-2 border-t border-border-subtle pt-5">
        <legend className="mb-2 text-sm font-semibold text-text-primary">پیشنهادهای قیمتی</legend>
        <FilterLink
          href={href(patchDiscoveryState(state, { discount: !state.discount }))}
          selected={state.discount}
        >
          فقط محصولات دارای تخفیف معتبر
        </FilterLink>
      </fieldset>
    </div>
  );
}

export function DiscoveryCatalog(props: DiscoveryCatalogProps) {
  const { pathname, state, data, lockedCategorySlug } = props;
  const stripCategory = Boolean(lockedCategorySlug);
  const activeCount = activeDiscoveryFilterCount(state);
  const viewHref = (view: DiscoverySearchState["view"]) =>
    discoveryHref(pathname, patchDiscoveryState(state, { view }), { stripCategory });

  return (
    <section
      className="section-commerce bg-background-canvas"
      dir="rtl"
      aria-labelledby="catalog-title"
    >
      <div className="container-commerce grid gap-8">
        <div className="grid gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-accent-primary">CATALOG</p>
            <h1
              id="catalog-title"
              className="mt-3 text-3xl font-semibold text-text-primary sm:text-4xl"
            >
              {lockedCategorySlug
                ? (data.categories.find((category) => category.slug === lockedCategorySlug)?.title
                    .default ?? "دسته‌بندی")
                : "فروشگاه ساعت"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
              جستجو و مقایسه بر اساس دسته‌بندی، برند، مشخصات، قیمت و وضعیت دسترس‌پذیری.
            </p>
          </div>

          <form
            action={pathname}
            method="get"
            role="search"
            className="flex flex-col gap-2 sm:flex-row"
          >
            <HiddenDiscoveryFields
              state={state}
              omitted={["q", "page"]}
              stripCategory={stripCategory}
            />
            <label className="relative flex-1">
              <span className="sr-only">جستجو در کاتالوگ</span>
              <Search
                className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                name="q"
                type="search"
                defaultValue={state.q}
                placeholder="نام محصول یا برند"
                className="min-h-11 w-full rounded-md border border-border-default bg-background-surface pe-10 ps-4 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent-primary focus:ring-2 focus:ring-focus-ring"
              />
            </label>
            <button
              type="submit"
              className="min-h-11 rounded-md bg-accent-primary px-5 text-sm font-semibold text-background-canvas hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              جستجو
            </button>
          </form>
        </div>

        <div className="grid gap-3 border-y border-border-subtle py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <details className="lg:hidden">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md border border-border-default bg-background-surface px-3 text-sm font-semibold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  فیلترها
                  {activeCount > 0 ? (
                    <span className="rounded-full bg-accent-muted px-2 py-0.5 text-xs text-accent-primary">
                      {activeCount.toLocaleString("fa-IR")}
                    </span>
                  ) : null}
                </summary>
                <div className="mt-3 max-h-[70vh] overflow-y-auto rounded-lg border border-border-subtle bg-background-surface p-4 shadow-elevated">
                  <DiscoveryFilters {...props} />
                </div>
              </details>

              <p className="text-sm text-text-secondary" aria-live="polite">
                {data.totalItems.toLocaleString("fa-IR")} نتیجه
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <form action={pathname} method="get" className="flex items-center gap-2">
                <HiddenDiscoveryFields
                  state={state}
                  omitted={["sort", "page"]}
                  stripCategory={stripCategory}
                />
                <label className="sr-only" htmlFor="catalog-sort">
                  مرتب‌سازی
                </label>
                <select
                  id="catalog-sort"
                  name="sort"
                  defaultValue={state.sort}
                  className="min-h-11 rounded-md border border-border-default bg-background-surface px-3 text-sm text-text-primary outline-none focus:border-accent-primary focus:ring-2 focus:ring-focus-ring"
                >
                  {DISCOVERY_SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="min-h-11 rounded-md border border-border-default px-3 text-xs font-semibold text-text-primary hover:border-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  اعمال
                </button>
              </form>

              <div
                className="flex rounded-md border border-border-default bg-background-surface p-1"
                aria-label="نوع نمایش"
              >
                {(["grid", "list"] as const).map((view) => {
                  const Icon = view === "grid" ? Grid2X2 : List;
                  const selected = state.view === view;
                  return (
                    <a
                      key={view}
                      href={viewHref(view)}
                      aria-label={view === "grid" ? "نمایش شبکه‌ای" : "نمایش فهرستی"}
                      aria-current={selected ? "true" : undefined}
                      className={cn(
                        "inline-flex size-11 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                        selected ? "bg-background-elevated text-accent-primary" : "text-text-muted",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="hidden self-start rounded-lg border border-border-subtle bg-background-surface p-4 lg:block">
            <DiscoveryFilters {...props} />
          </aside>

          <div className="min-w-0">
            {data.cards.length === 0 ? (
              <EmptyState
                title="محصولی با این فیلترها پیدا نشد"
                description="فیلترها را تغییر دهید یا جستجو را پاک کنید."
                action={
                  <a
                    href={lockedCategorySlug ? `/shop/${lockedCategorySlug}` : "/shop"}
                    className="inline-flex min-h-11 items-center rounded-md bg-accent-primary px-4 text-sm font-semibold text-background-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    پاک کردن فیلترها
                  </a>
                }
              />
            ) : (
              <div
                className={cn(
                  state.view === "grid"
                    ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
                    : "grid gap-3",
                )}
              >
                {data.cards.map((model) => (
                  <DiscoveryProductCard key={model.id} model={model} view={state.view} />
                ))}
              </div>
            )}

            {data.totalPages > 1 ? (
              <nav
                className="mt-8 flex items-center justify-between gap-3 border-t border-border-subtle pt-5"
                aria-label="صفحه‌بندی کاتالوگ"
              >
                {data.page > 1 ? (
                  <a
                    href={discoveryHref(
                      pathname,
                      patchDiscoveryState(state, { page: data.page - 1 }, { keepPage: true }),
                      { stripCategory },
                    )}
                    className="inline-flex min-h-11 items-center rounded-md border border-border-default px-4 text-sm font-semibold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    صفحه قبل
                  </a>
                ) : (
                  <span />
                )}
                <span className="text-xs tabular-nums text-text-secondary">
                  صفحه {data.page.toLocaleString("fa-IR")} از{" "}
                  {data.totalPages.toLocaleString("fa-IR")}
                </span>
                {data.page < data.totalPages ? (
                  <a
                    href={discoveryHref(
                      pathname,
                      patchDiscoveryState(state, { page: data.page + 1 }, { keepPage: true }),
                      { stripCategory },
                    )}
                    className="inline-flex min-h-11 items-center rounded-md border border-border-default px-4 text-sm font-semibold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    صفحه بعد
                  </a>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DiscoveryCatalogPending() {
  return (
    <section
      className="section-commerce bg-background-canvas"
      dir="rtl"
      aria-label="در حال بارگذاری کاتالوگ"
    >
      <div className="container-commerce grid gap-6">
        <div className="h-10 w-52 animate-pulse rounded-md bg-skeleton-base motion-reduce:animate-none" />
        <div className="h-11 w-full animate-pulse rounded-md bg-skeleton-base motion-reduce:animate-none" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[3/4] animate-pulse rounded-lg bg-skeleton-base motion-reduce:animate-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
