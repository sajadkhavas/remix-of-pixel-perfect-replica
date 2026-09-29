import {
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";

import {
  decodeProductDetailRequest,
  getProductDetailData,
} from "@/lib/product-detail.functions";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const data = await getProductDetailData({ id: params.id });

    if (!data || !data.category) throw notFound();

    throw redirect({
      to: "/shop/$category/$product",
      params: {
        category: data.category.slug,
        product: data.product.identity.slug,
      },
      replace: true,
    });
  },

  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;

        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "invalid-json" }, { status: 400 });
        }

        const input = decodeProductDetailRequest(payload);

        if (!input) {
          return Response.json(
            { error: "invalid-product-request" },
            { status: 400 },
          );
        }

        const { loadProductDetailServer } = await import(
          "@/lib/product-detail.server"
        );
        const data = await loadProductDetailServer(input);

        return data
          ? Response.json(data)
          : Response.json({ error: "product-not-found" }, { status: 404 });
      },
    },
  },

  head: () => ({
    meta: [
      { title: "محصول | KRONOS" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),

  component: LegacyProductRedirect,
});

function LegacyProductRedirect() {
  return null;
}
