import { createFileRoute } from "@tanstack/react-router";

import {
  DiscoveryCatalog,
  DiscoveryCatalogPending,
} from "@/components/discovery/discovery-catalog";
import { parseDiscoverySearch, type RawSearch } from "@/domain/search";
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

export const Route = createFileRoute("/shop")({
  validateSearch: validateDiscoverySearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => loadDiscovery(deps),
  head: ({ loaderData }) => ({
    meta: [
      { title: "فروشگاه ساعت — KRONOS" },
      {
        name: "description",
        content: "مرور و مقایسه ساعت‌ها بر اساس دسته‌بندی، برند، قیمت و وضعیت دسترس‌پذیری.",
      },
      { name: "robots", content: loaderData?.seo.robots ?? "noindex,follow" },
      { property: "og:title", content: "فروشگاه ساعت — KRONOS" },
    ],
  }),
  pendingComponent: DiscoveryCatalogPending,
  component: ShopPage,
});

function ShopPage() {
  const state = Route.useSearch();
  const data = Route.useLoaderData();

  return <DiscoveryCatalog pathname="/shop" state={state} data={data} />;
}
