import type { ProductCardViewModel } from "@/components/commerce/product-card-model";
import { ProductCardView } from "@/components/ui/ProductCard";

export function DiscoveryProductCard({
  model,
  view = "grid",
  imagePriority = false,
}: {
  readonly model: ProductCardViewModel;
  readonly view?: "grid" | "list";
  readonly imagePriority?: boolean;
}) {
  return (
    <ProductCardView
      model={model}
      view={view}
      imagePriority={imagePriority}
      wishlistEnabled
    />
  );
}
