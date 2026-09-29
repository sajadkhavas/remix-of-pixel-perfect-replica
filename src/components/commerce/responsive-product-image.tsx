import type { ProductCardImageModel } from "./product-card-model";

export function ResponsiveProductImage({
  image,
  eager = false,
}: {
  readonly image: ProductCardImageModel | undefined;
  readonly eager?: boolean;
}) {
  if (!image) {
    return (
      <div
        className="flex size-full items-center justify-center bg-[#0B0D0F] px-4 text-center text-xs text-[#77716A]"
        role="img"
        aria-label="تصویر محصول در دسترس نیست"
      >
        تصویر در دسترس نیست
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-hidden bg-[#0B0D0F]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(201,168,76,0.07),transparent_60%)]"
        aria-hidden="true"
      />

      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
        className="relative z-10 size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
      />
    </div>
  );
}
