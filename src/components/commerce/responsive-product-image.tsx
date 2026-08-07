import { useState } from "react";

import type { ProductCardImageModel } from "./product-card-model";

export function ResponsiveProductImage({
  image,
  eager = false,
}: {
  image: ProductCardImageModel | undefined;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  if (!image) {
    return (
      <div
        className="flex size-full items-center justify-center bg-background-elevated px-6 text-center text-xs text-text-muted"
        role="img"
        aria-label="تصویر محصول در دسترس نیست"
      >
        تصویر در دسترس نیست
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-hidden bg-background-elevated">
      {!loaded ? <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" /> : null}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`size-full object-contain p-6 transition-opacity duration-300 motion-reduce:transition-none sm:p-8 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
