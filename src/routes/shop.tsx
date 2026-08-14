import { createFileRoute } from "@tanstack/react-router";

import {
  DiscoveryCatalog,
  DiscoveryCatalogPending,
} from "@/components/discovery/discovery-catalog";
import { getDiscoveryData } from "@/lib/discovery.functions";
import { completeDiscoveryState, validatePublicDiscoverySearch } from "@/lib/discovery";

export const Route = createFileRoute("/shop")({
  validateSearch: validatePublicDiscoverySearch,
  loaderDeps: ({ search }) => completeDiscoveryState(search),
  loader: async ({ deps }) => (await getDiscoveryData({ data: { state: deps } })).data,
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
  const state = completeDiscoveryState(Route.useSearch());
  const data = Route.useLoaderData();

  return <DiscoveryCatalog pathname="/shop" state={state} data={data} />;
}
