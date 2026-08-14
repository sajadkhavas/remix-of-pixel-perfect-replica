import { createFileRoute } from "@tanstack/react-router";

import {
  DiscoveryCatalog,
  DiscoveryCatalogPending,
} from "@/components/discovery/discovery-catalog";
import { completeDiscoveryState, validatePublicDiscoverySearch } from "@/lib/discovery";
import { decodeDiscoveryRequest, getDiscoveryData } from "@/lib/discovery.functions";

export const Route = createFileRoute("/shop")({
  validateSearch: validatePublicDiscoverySearch,
  loaderDeps: ({ search }) => completeDiscoveryState(search),
  loader: async ({ deps }) => (await getDiscoveryData({ state: deps })).data,
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "invalid-json" }, { status: 400 });
        }

        const input = decodeDiscoveryRequest(payload);
        if (!input) return Response.json({ error: "invalid-discovery-request" }, { status: 400 });

        const { loadDiscoveryServer } = await import("@/lib/discovery.server");
        return Response.json(await loadDiscoveryServer(input));
      },
    },
  },
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
