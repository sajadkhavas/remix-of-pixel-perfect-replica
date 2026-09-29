import { createFileRoute } from "@tanstack/react-router";

import {
  DiscoveryCatalog,
  DiscoveryCatalogPending,
} from "@/components/discovery/discovery-catalog";
import {
  completeDiscoveryState,
  validatePublicDiscoverySearch,
} from "@/lib/discovery";
import { getDiscoveryData } from "@/lib/discovery.functions";

export const Route = createFileRoute("/shop/")({
  validateSearch: validatePublicDiscoverySearch,

  loaderDeps: ({ search }) => completeDiscoveryState(search),

  loader: async ({ deps }) => (await getDiscoveryData({ state: deps })).data,

  head: ({ loaderData }) => ({
    meta: [
      { title: "فروشگاه ساعت | KRONOS" },
      {
        name: "description",
        content:
          "مجموعه ساعت‌های KRONOS را بر اساس دسته‌بندی، برند، قیمت و مشخصات فنی مرور کنید.",
      },
      {
        name: "robots",
        content: loaderData?.seo.robots ?? "noindex,follow",
      },
      {
        property: "og:title",
        content: "فروشگاه ساعت | KRONOS",
      },
      {
        property: "og:description",
        content: "کالکشن ساعت‌های KRONOS را کشف کنید.",
      },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),

  pendingComponent: DiscoveryCatalogPending,
  component: ShopIndexPage,
});

function ShopIndexPage() {
  const search = Route.useSearch();
  const state = completeDiscoveryState(search);
  const data = Route.useLoaderData();
  const navigate = Route.useNavigate();

  const updateState = (next: typeof state) =>
    navigate({
      search: () =>
        validatePublicDiscoverySearch({
          ...next,
        }),
      resetScroll: false,
      viewTransition: true,
    });

  return (
    <DiscoveryCatalog
      pathname="/shop"
      state={state}
      data={data}
      onStateChange={updateState}
    />
  );
}
