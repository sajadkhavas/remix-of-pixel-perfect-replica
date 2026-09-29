import { createServerFn } from "@tanstack/react-start";

import type { ProductCardViewModel } from "@/components/commerce/product-card-model";
import type { Product } from "@/domain/product";

export interface ProductDetailBrand {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
}

export interface ProductDetailCategory {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
}

export interface ProductDetailData {
  readonly product: Product;
  readonly brand: ProductDetailBrand | null;
  readonly category: ProductDetailCategory | null;
  readonly relatedCards: readonly ProductCardViewModel[];
}

export interface ProductDetailRequest {
  readonly id: string;
}

function validProductRouteId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[A-Za-z0-9_-]{1,160}$/.test(value)
  );
}

export function decodeProductDetailRequest(
  input: unknown,
): ProductDetailRequest | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const id = (input as Record<string, unknown>).id;

  return validProductRouteId(id) ? { id } : null;
}

const loadProductDetail = createServerFn({
  method: "POST",
})
  .inputValidator((input: ProductDetailRequest) => {
    const decoded = decodeProductDetailRequest(input);

    if (!decoded) {
      throw new Error("درخواست محصول معتبر نیست.");
    }

    return decoded;
  })
  .handler(async ({ data }) => {
    const { loadProductDetailServer } = await import(
      "@/lib/product-detail.server"
    );

    return loadProductDetailServer(data);
  });

export async function getProductDetailData(
  input: ProductDetailRequest,
): Promise<ProductDetailData | null> {
  return loadProductDetail({
    data: input,
  });
}
