import {
  createFileRoute,
  Link,
  notFound,
} from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, SearchX } from "lucide-react";

import {
  DiscoveryCatalog,
  DiscoveryCatalogPending,
} from "@/components/discovery/discovery-catalog";
import type { Category } from "@/domain/catalog";
import { getDiscoverySeoDecision } from "@/domain/search";
import {
  completeDiscoveryState,
  DEFAULT_DISCOVERY_SORT,
  validatePublicDiscoverySearch,
} from "@/lib/discovery";
import { getDiscoveryData } from "@/lib/discovery.functions";

export const Route = createFileRoute("/shop/$category/")({
  validateSearch: validatePublicDiscoverySearch,

  loaderDeps: ({ search }) => completeDiscoveryState(search),

  loader: async ({ params, deps }) => {
    const result = await getDiscoveryData({
      state: deps,
      categorySlug: params.category,
    });

    if (!result.category) throw notFound();

    return {
      ...result.data,
      category: result.category,
      seo: getDiscoverySeoDecision(deps, DEFAULT_DISCOVERY_SORT),
    };
  },

  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.category.seo.title },
          {
            name: "description",
            content:
              loaderData.category.seo.description ??
              loaderData.category.intro?.default ??
              `مشاهده ${loaderData.category.title.default} در KRONOS.`,
          },
          {
            name: "robots",
            content: loaderData.seo.robots,
          },
          {
            property: "og:title",
            content: loaderData.category.seo.title,
          },
          {
            property: "og:description",
            content:
              loaderData.category.seo.description ??
              loaderData.category.intro?.default ??
              "",
          },
        ]
      : [
          { title: "دسته‌بندی | KRONOS" },
          { name: "robots", content: "noindex,follow" },
        ],
    links: loaderData?.category.seo.canonicalPath
      ? [{ rel: "canonical", href: loaderData.category.seo.canonicalPath }]
      : [],
  }),

  pendingComponent: DiscoveryCatalogPending,
  notFoundComponent: CategoryNotFound,
  component: CategoryIndexPage,
});

function CategoryHero({ category }: { readonly category: Category }) {
  const hero = category.heroMedia;

  return (
    <section
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#08090B]"
      dir="rtl"
      aria-labelledby="category-page-title"
    >
      <div className="relative mx-auto min-h-[330px] w-full max-w-[1600px] sm:min-h-[400px] lg:min-h-[470px]">
        {hero ? (
          <img
            src={hero.url}
            alt={hero.alt}
            width={hero.dimensions.width}
            height={hero.dimensions.height}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover object-center opacity-55"
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,11,0.18)_0%,rgba(8,9,11,0.82)_58%,#08090B_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,#08090B_0%,transparent_52%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[330px] items-end px-4 pb-9 pt-8 sm:min-h-[400px] sm:px-6 sm:pb-12 lg:min-h-[470px] lg:px-8 lg:pb-14">
          <div className="mx-auto w-full max-w-[1500px]">
            <nav
              aria-label="مسیر صفحه"
              className="mb-5 flex items-center gap-2 overflow-x-auto text-[10px] text-[#8B857D] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:text-xs"
            >
              <Link
                to="/"
                className="shrink-0 transition-colors hover:text-[#D8BE76]"
              >
                خانه
              </Link>
              <ChevronLeft className="size-3 shrink-0" aria-hidden="true" />
              <Link
                to="/shop"
                className="shrink-0 transition-colors hover:text-[#D8BE76]"
              >
                فروشگاه
              </Link>
              <ChevronLeft className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate text-[#C6BFB5]">
                {category.title.default}
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#C9A84C]" aria-hidden="true" />
                <span
                  className="text-[9px] font-semibold tracking-[0.34em] text-[#C9A84C]"
                  dir="ltr"
                >
                  KRONOS COLLECTION
                </span>
              </div>

              <h1
                id="category-page-title"
                className="mt-4 text-4xl font-semibold leading-tight text-[#F4EFE7] sm:text-5xl lg:text-6xl"
                style={{
                  fontFamily: "Playfair Display, Vazirmatn Variable, serif",
                }}
              >
                {category.title.default}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-[#B1AAA1] sm:text-base">
                {category.intro?.default ??
                  "محصولات این دسته را مرور، فیلتر و مقایسه کنید."}
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.10] bg-black/20 px-4 text-xs font-semibold text-[#D8D1C7] backdrop-blur-md transition-colors hover:border-[#C9A84C]/35 hover:text-[#DCC27C]"
              >
                همه ساعت‌ها
                <ArrowLeft className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryNotFound() {
  return (
    <section
      className="relative overflow-hidden bg-[#08090B] px-4 py-20 sm:px-6 sm:py-28"
      dir="rtl"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A84C]/[0.05] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-lg rounded-[1.5rem] border border-white/[0.07] bg-white/[0.02] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.06]">
          <SearchX className="size-6 text-[#C9A84C]" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-[#F0EDE8] sm:text-3xl">
          دسته‌بندی پیدا نشد
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#979188]">
          این نشانی در میان دسته‌بندی‌های فروشگاه وجود ندارد.
        </p>

        <Link
          to="/shop"
          className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-6 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
        >
          بازگشت به فروشگاه
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function CategoryIndexPage() {
  const search = Route.useSearch();
  const state = completeDiscoveryState(search);
  const data = Route.useLoaderData();
  const navigate = Route.useNavigate();

  const updateState = (next: typeof state) =>
    navigate({
      search: () =>
        validatePublicDiscoverySearch({
          ...next,
          category: [],
        }),
      resetScroll: false,
      viewTransition: true,
    });

  return (
    <>
      <CategoryHero category={data.category} />

      <DiscoveryCatalog
        pathname={`/shop/${data.category.slug}`}
        state={state}
        data={data}
        lockedCategorySlug={data.category.slug}
        hideHeader
        onStateChange={updateState}
      />
    </>
  );
}
