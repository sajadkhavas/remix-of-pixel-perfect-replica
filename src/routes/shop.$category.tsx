import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import {
  DiscoveryCatalog,
  DiscoveryCatalogPending,
} from "@/components/discovery/discovery-catalog";
import { FIXTURE_CATEGORIES } from "@/data/fixtures/categories";
import {
  getDiscoverySeoDecision,
  parseDiscoverySearch,
  type RawSearch,
} from "@/domain/search";
import {
  DEFAULT_DISCOVERY_SORT,
  DISCOVERY_SORT_OPTIONS,
  loadDiscovery,
} from "@/lib/discovery";

function validateDiscoverySearch(rawSearch: RawSearch) {
  const state = parseDiscoverySearch(rawSearch, DEFAULT_DISCOVERY_SORT);
  return DISCOVERY_SORT_OPTIONS.some((option) => option.value === state.sort)
    ? state
    : { ...state, sort: DEFAULT_DISCOVERY_SORT };
}

export const Route = createFileRoute("/shop/$category")({
  validateSearch: validateDiscoverySearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const category = FIXTURE_CATEGORIES.find(
      (item) => item.depth === 1 && item.slug === params.category,
    );
    if (!category) throw notFound();

    const data = await loadDiscovery({ ...deps, category: category.slug });
    return {
      ...data,
      category,
      seo: getDiscoverySeoDecision(deps, DEFAULT_DISCOVERY_SORT),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.title.default} — KRONOS` },
          {
            name: "description",
            content: `مرور محصولات دسته ${loaderData.category.title.default} با فیلترهای کاتالوگ.`,
          },
          { name: "robots", content: loaderData.seo.robots },
        ]
      : [
          { title: "دسته‌بندی — KRONOS" },
          { name: "robots", content: "noindex,follow" },
        ],
  }),
  pendingComponent: DiscoveryCatalogPending,
  notFoundComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryNotFound() {
  return (
    <section className="section-commerce bg-background-canvas" dir="rtl">
      <div className="container-content text-center">
        <h1 className="text-2xl font-semibold text-text-primary">دسته‌بندی پیدا نشد</h1>
        <p className="mt-3 text-sm text-text-secondary">
          این آدرس با taxonomy فعلی کاتالوگ مطابقت ندارد.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent-primary px-5 text-sm font-semibold text-background-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </section>
  );
}

function CategoryPage() {
  const search = Route.useSearch();
  const data = Route.useLoaderData();
  const state = { ...search, category: data.category.slug };

  return (
    <DiscoveryCatalog
      pathname={`/shop/${data.category.slug}`}
      state={state}
      data={data}
      lockedCategorySlug={data.category.slug}
    />
  );
}
