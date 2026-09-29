import {
  Link,
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";



import {



  Check,



  ChevronLeft,



  Heart,



  Minus,



  Plus,



  SearchX,



  ShoppingBag,



  Star,



  X,



  ZoomIn,



  type LucideIcon,



} from "lucide-react";



import { useEffect, useMemo, useRef, useState } from "react";







import { DiscoveryProductCard } from "@/components/discovery/discovery-product-card";



import {



  isPurchasableVariant,



  type ProductSpecification,



  type ProductVariant,



} from "@/domain/product";



import type { Money } from "@/domain/shared";



import { discoveryFilterLabel } from "@/lib/discovery";



import { getProductDetailData } from "@/lib/product-detail.functions";



import { useStore } from "@/lib/store-context";







export const Route = createFileRoute("/shop/$category/$product")({



  loader: async ({ params }) => {
    const data = await getProductDetailData({
      id: params.product,
    });

    if (
      !data ||
      !data.category ||
      data.category.slug !== params.category
    ) {
      throw notFound();
    }

    if (params.product !== data.product.identity.slug) {
      throw redirect({
        to: "/shop/$category/$product",
        params: {
          category: data.category.slug,
          product: data.product.identity.slug,
        },
        replace: true,
      });
    }

    return data;
  },


  head: ({ loaderData }) => ({



    meta: loaderData



      ? [



          {



            title:



              loaderData.product.seo.title ??



              `${loaderData.product.content.name.default} | KRONOS`,



          },



          {



            name: "description",



            content:



              loaderData.product.seo.description ??



              loaderData.product.content.shortDescription.default,



          },



          {



            name: "robots",



            content: loaderData.product.seo.robots ?? "index,follow",



          },



          {



            property: "og:title",



            content:



              loaderData.product.seo.title ??



              loaderData.product.content.name.default,



          },



          {



            property: "og:description",



            content:



              loaderData.product.seo.description ??



              loaderData.product.content.shortDescription.default,



          },



        ]



      : [



          { title: "محصول | KRONOS" },



          { name: "robots", content: "noindex,follow" },



        ],



    links:

      loaderData?.category && loaderData?.product

        ? [

            {

              rel: "canonical",

              href: `/shop/${loaderData.category.slug}/${loaderData.product.identity.slug}`,

            },

          ]

        : [],



  }),







  pendingComponent: ProductDetailPending,



  notFoundComponent: ProductNotFound,



  component: ProductDetailPage,



});







function formatMoney(money: Money): string {



  const amount = money.amountMinor / 10 ** money.fractionDigits;







  try {



    return new Intl.NumberFormat("fa-IR", {



      style: "currency",



      currency: money.currency,



      minimumFractionDigits: money.fractionDigits,



      maximumFractionDigits: money.fractionDigits,



    }).format(amount);



  } catch {



    return amount.toLocaleString("fa-IR");



  }



}







function discountPercent(variant: ProductVariant) {



  const { listPrice, salePrice } = variant.pricing;







  if (!salePrice || listPrice.amountMinor <= 0 || salePrice.amountMinor >= listPrice.amountMinor) {



    return null;



  }







  return Math.round(



    ((listPrice.amountMinor - salePrice.amountMinor) / listPrice.amountMinor) * 100,



  );



}







function inventoryLabel(variant: ProductVariant) {



  switch (variant.inventory.status) {



    case "in-stock":

      return "موجود";



    case "not-tracked":

      return "موجود";



    case "low-stock":
      return "موجودی محدود";

    case "preorder":



      return "پیش‌خرید";



    case "backorder":



      return variant.inventory.backorderable ? "قابل سفارش" : "ناموجود";



    case "out-of-stock":



      return variant.inventory.backorderable ? "قابل سفارش" : "ناموجود";



  }



}







function inventoryDotClass(variant: ProductVariant) {



  switch (variant.inventory.status) {



    case "in-stock":

      return "bg-[#79A985]";



    case "not-tracked":

      return "bg-[#79A985]";



    case "low-stock":

      return "bg-[#D0A44D]";



    case "preorder":

      return "bg-[#D0A44D]";



    case "backorder":

      return "bg-[#D0A44D]";



    case "out-of-stock":



      return "bg-[#77716A]";



  }



}







function getQuantityLimits(variant: ProductVariant) {
  const min = Math.max(
    1,
    Math.trunc(variant.inventory.minOrderQuantity),
  );
  const step = Math.max(
    1,
    Math.trunc(variant.inventory.orderIncrement),
  );

  const limits: number[] = [];

  if (variant.inventory.maxOrderQuantity !== undefined) {
    limits.push(
      Math.max(
        0,
        Math.trunc(variant.inventory.maxOrderQuantity),
      ),
    );
  }

  if (
    variant.inventory.tracking === "tracked" &&
    (variant.inventory.status === "in-stock" ||
      variant.inventory.status === "low-stock") &&
    variant.inventory.availableQuantity !== undefined
  ) {
    limits.push(
      Math.max(
        0,
        Math.trunc(variant.inventory.availableQuantity),
      ),
    );
  }

  return {
    min,
    step,
    max: limits.length > 0 ? Math.min(...limits) : undefined,
  } as const;
}



function specValue(specification: ProductSpecification) {



  const { value } = specification;







  if (value.type === "text") return discoveryFilterLabel(value.value);







  if (value.type === "number") {



    return `${value.value.toLocaleString("fa-IR")}${value.unit ? ` ${value.unit}` : ""}`;



  }







  if (value.type === "boolean") return value.value ? "بله" : "خیر";







  return value.values.map((item) => discoveryFilterLabel(item)).join("، ");



}







function InfoLinkCard({



  icon: Icon,



  title,



  description,



  to,



}: {



  readonly icon: LucideIcon;



  readonly title: string;



  readonly description: string;



  readonly to: "/shipping-returns" | "/warranty" | "/authenticity";



}) {



  return (



    <Link



      to={to}



      className="group flex gap-3 rounded-[1.25rem] border border-white/[0.07] bg-[#0D0F11] p-4 transition-colors hover:border-[#C9A84C]/25"



    >



      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/[0.05] text-[#D4BA72]">



        <Icon className="size-4" aria-hidden="true" />



      </span>



      <div>



        <h3 className="text-xs font-semibold text-[#E8E1D8] transition-colors group-hover:text-[#DCC27C]">



          {title}



        </h3>



        <p className="mt-1 text-[11px] leading-6 text-[#858078]">{description}</p>



      </div>



    </Link>



  );



}







function ProductDetailPage() {



  const data = Route.useLoaderData();



  const { product, brand, category } = data;



  const { addToCart, isWishlisted, toggleWishlist } = useStore();







  const [variantId, setVariantId] = useState(product.defaultVariantId);



  const [quantity, setQuantity] = useState(1);



  const [activeImageId, setActiveImageId] = useState(product.media.primaryMediaId);



  const [lightboxOpen, setLightboxOpen] = useState(false);

  const zoomTriggerRef = useRef<HTMLButtonElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);







  const images = useMemo(



    () => product.media.assets.filter((asset) => asset.type === "image"),



    [product.media.assets],



  );







  const selectedVariant =
    product.variants.find(
      (variant) => variant.id === variantId,
    ) ?? product.variants[0];

  const activeImage =
    images.find((image) => image.id === activeImageId) ??
    images.find(
      (image) => image.id === product.media.primaryMediaId,
    ) ??
    images[0];

  const quantityLimits = selectedVariant
    ? getQuantityLimits(selectedVariant)
    : { min: 1, step: 1, max: undefined };

  const minQty = quantityLimits.min;
  const step = quantityLimits.step;
  const maxQty = quantityLimits.max;

  const purchasable = Boolean(
    selectedVariant &&
      product.status === "active" &&
      isPurchasableVariant(selectedVariant) &&
      (maxQty === undefined || maxQty >= minQty),
  );

  const canIncrease =
    maxQty === undefined || quantity + step <= maxQty;



  useEffect(() => {
    setQuantity(minQty);

    if (!selectedVariant) return;

    const variantImage = images.find((image) =>
      selectedVariant.mediaIds.includes(image.id),
    );

    if (variantImage) {
      setActiveImageId(variantImage.id);
    }
  }, [images, minQty, selectedVariant, variantId]);



  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const previousOverflow =
      document.documentElement.style.overflow;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusFrame = window.requestAnimationFrame(() => {
      lightboxCloseRef.current?.focus({
        preventScroll: true,
      });
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow =
        previousOverflow;
      previousActiveElement?.focus({
        preventScroll: true,
      });
    };
  }, [lightboxOpen]);



  const groupedSpecs = useMemo(() => {



    const groups = new Map<ProductSpecification["group"], ProductSpecification[]>();







    [...product.specificationValues]



      .sort((a, b) => a.sortOrder - b.sortOrder)



      .forEach((specification) => {



        const current = groups.get(specification.group) ?? [];



        groups.set(specification.group, [...current, specification]);



      });







    return [...groups.entries()];



  }, [product.specificationValues]);







  const groupLabels: Record<ProductSpecification["group"], string> = {



    movement: "موتور",



    case: "قاب",



    dial: "صفحه",



    strap: "بند",



    dimensions: "ابعاد",



    features: "ویژگی‌ها",



    compatibility: "سازگاری",



    other: "سایر مشخصات",



  };







  const wishlisted = isWishlisted(product.identity.id);



  const salePercent = selectedVariant
    ? discountPercent(selectedVariant)
    : null;

  const reviewSummary =
    product.reviewSummary &&
    product.trustEvidenceRefs.length > 0
      ? product.reviewSummary
      : undefined;







  const addSelectedToCart = () => {



    if (!selectedVariant || !purchasable) return;







    addToCart({



      productId: product.identity.id,



      variantId: selectedVariant.id,



      productSlug: product.identity.slug,



      name: product.content.name.default,



      variantLabel:



        selectedVariant.optionValues.map((option) => option.label.default).join(" / ") || undefined,



      sku: selectedVariant.sku,



      imageUrl: activeImage?.url,



      unitPrice: selectedVariant.pricing.effectivePrice,



      quantity,



      minQuantity: selectedVariant.inventory.minOrderQuantity,



      maxQuantity: selectedVariant.inventory.maxOrderQuantity,



      increment: selectedVariant.inventory.orderIncrement,



      availableQuantity: selectedVariant.inventory.availableQuantity,



    });



  };







  return (



    <main className="bg-[#08090B] text-[#F0EDE8]" dir="rtl">



      <section className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-12 pt-7 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 lg:pt-10">



        <div



          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.07),transparent_70%)]"



          aria-hidden="true"



        />







        <div className="relative mx-auto w-full max-w-[1500px]">



          <nav



            aria-label="مسیر صفحه"



            className="mb-6 flex min-w-0 items-center gap-2 overflow-x-auto pb-1 text-[10px] text-[#746F68] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mb-8 sm:text-xs"



          >



            <Link to="/" className="shrink-0 transition-colors hover:text-[#C9A84C]">



              خانه



            </Link>



            <ChevronLeft className="size-3 shrink-0" aria-hidden="true" />



            <Link to="/shop" className="shrink-0 transition-colors hover:text-[#C9A84C]">



              فروشگاه



            </Link>







            {category ? (



              <>



                <ChevronLeft className="size-3 shrink-0" aria-hidden="true" />



                <Link



                  to="/shop/$category"



                  params={{ category: category.slug }}



                  className="shrink-0 transition-colors hover:text-[#C9A84C]"



                >



                  {category.title}



                </Link>



              </>



            ) : null}







            <ChevronLeft className="size-3 shrink-0" aria-hidden="true" />



            <span className="truncate text-[#A59E94]">{product.content.name.default}</span>



          </nav>







          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-12 xl:gap-16">



            <div className="order-2 lg:order-1">



              <div className="flex items-center gap-3">



                <span className="h-px w-7 bg-[#C9A84C]" aria-hidden="true" />



                <span



                  className="text-[9px] font-semibold tracking-[0.28em] text-[#C9A84C]"



                  dir="ltr"



                >



                  {brand?.name ?? "KRONOS"}



                </span>



              </div>







              <h1



                className="mt-4 text-3xl font-semibold leading-[1.35] text-[#F3EFE8] sm:text-4xl lg:text-5xl"



                style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}



              >



                {product.content.name.default}



              </h1>







              <p className="mt-4 max-w-xl text-sm leading-8 text-[#A29B91] sm:text-base sm:leading-9">



                {product.content.shortDescription.default}



              </p>







              {reviewSummary ? (



                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#8E887F]">



                  <span className="inline-flex items-center gap-1.5 text-[#D8BF78]">



                    <Star className="size-4 fill-[#C9A84C] text-[#C9A84C]" aria-hidden="true" />



                    <strong className="font-semibold tabular-nums">



                      {reviewSummary.ratingValue.toLocaleString("fa-IR")}



                    </strong>



                  </span>



                  <span className="size-1 rounded-full bg-white/[0.18]" />



                  <span>



                    {reviewSummary.reviewCount.toLocaleString("fa-IR")} نظر



                  </span>



                </div>



              ) : null}







              {selectedVariant ? (



                <div className="mt-7 rounded-[1.35rem] border border-white/[0.07] bg-[#0D0F11] p-4 sm:p-5">



                  <div className="flex flex-wrap items-start justify-between gap-4">



                    <div>



                      <span className="text-[10px] text-[#77716A]">قیمت</span>



                      <div className="mt-1 flex flex-wrap items-baseline gap-2">



                        <strong className="text-xl font-bold tabular-nums text-[#D8BC6E] sm:text-2xl">



                          {formatMoney(selectedVariant.pricing.effectivePrice)}



                        </strong>







                        {selectedVariant.pricing.salePrice ? (



                          <span className="text-xs tabular-nums text-[#77716A] line-through">



                            {formatMoney(selectedVariant.pricing.listPrice)}



                          </span>



                        ) : null}







                        {salePercent ? (



                          <span className="rounded-full bg-[#C9A84C]/[0.10] px-2.5 py-1 text-[10px] font-bold text-[#D9C076]">



                            {salePercent.toLocaleString("fa-IR")}٪ تخفیف



                          </span>



                        ) : null}



                      </div>



                    </div>







                    <div className="flex items-center gap-2">



                      <span



                        className={`size-2 rounded-full ${inventoryDotClass(selectedVariant)}`}



                        aria-hidden="true"



                      />



                      <span className="text-xs text-[#AAA39A]">



                        {inventoryLabel(selectedVariant)}



                      </span>



                    </div>



                  </div>







                  {product.variants.length > 1 ? (



                    <fieldset className="mt-6 border-t border-white/[0.06] pt-5">



                      <legend className="mb-3 text-xs font-semibold text-[#E7E1D8]">



                        انتخاب مدل



                      </legend>







                      <div className="flex flex-wrap gap-2">



                        {product.variants.map((variant) => {



                          const optionLabel =



                            variant.optionValues



                              .map((option) => option.label.default)



                              .join(" / ") || variant.sku;



                          const selected = variant.id === selectedVariant.id;







                          return (



                            <button



                              key={variant.id}



                              type="button"



                              onClick={() => setVariantId(variant.id)}



                              className={`min-h-10 rounded-xl border px-3 text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70 ${



                                selected



                                  ? "border-[#C9A84C]/45 bg-[#C9A84C]/[0.09] text-[#E1CB8A]"



                                  : "border-white/[0.08] bg-white/[0.018] text-[#979087] hover:border-white/[0.14] hover:text-[#DDD6CC]"



                              }`}



                            >



                              {optionLabel}



                            </button>



                          );



                        })}



                      </div>



                    </fieldset>



                  ) : null}







                  <div className="mt-6 grid gap-3 border-t border-white/[0.06] pt-5 sm:grid-cols-[auto_minmax(0,1fr)]">



                    <div className="flex min-h-12 items-center rounded-xl border border-white/[0.08] bg-[#090B0D]">



                      <button



                        type="button"



                        aria-label="کاهش تعداد"



                        disabled={quantity <= minQty}



                        onClick={() =>



                          setQuantity((current) => Math.max(minQty, current - step))



                        }



                        className="inline-flex size-11 items-center justify-center text-[#8F887F] transition-colors hover:text-[#DCC27C] disabled:cursor-not-allowed disabled:opacity-30"



                      >



                        <Minus className="size-4" aria-hidden="true" />



                      </button>







                      <span className="min-w-10 text-center text-sm font-semibold tabular-nums text-[#F0EDE8]">



                        {quantity.toLocaleString("fa-IR")}



                      </span>







                      <button



                        type="button"



                        aria-label="افزایش تعداد"



                        disabled={!canIncrease}



                        onClick={() =>



                          setQuantity((current) =>
                            maxQty === undefined
                              ? current + step
                              : Math.min(maxQty, current + step),
                          )



                        }



                        className="inline-flex size-11 items-center justify-center text-[#8F887F] transition-colors hover:text-[#DCC27C] disabled:cursor-not-allowed disabled:opacity-30"



                      >



                        <Plus className="size-4" aria-hidden="true" />



                      </button>



                    </div>







                    <button



                      type="button"



                      disabled={!purchasable}



                      onClick={addSelectedToCart}



                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-5 text-sm font-semibold text-[#090A0C] transition-all hover:bg-[#DFC36E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] disabled:cursor-not-allowed disabled:bg-[#242424] disabled:text-[#77716A]"



                    >



                      <ShoppingBag className="size-4" aria-hidden="true" />



                      {purchasable ? "افزودن به سبد خرید" : "ناموجود"}



                    </button>



                  </div>







                  <button



                    type="button"



                    aria-pressed={wishlisted}



                    onClick={() =>



                      toggleWishlist(product.identity.id, selectedVariant.id)



                    }



                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.018] text-xs font-semibold text-[#AAA39A] transition-all hover:border-[#C9A84C]/25 hover:bg-[#C9A84C]/[0.045] hover:text-[#D8C17E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70"



                  >



                    <Heart



                      className={`size-4 ${



                        wishlisted ? "fill-[#C9A84C] text-[#C9A84C]" : ""



                      }`}



                      aria-hidden="true"



                    />



                    {wishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}



                  </button>



                </div>



              ) : null}







              {product.content.highlights.length > 0 ? (



                <ul className="mt-6 grid gap-2 sm:grid-cols-2">



                  {product.content.highlights.map((highlight) => (



                    <li



                      key={highlight.default}



                      className="flex min-h-11 items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 text-xs text-[#A59E94]"



                    >



                      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/[0.09] text-[#D6BE78]">



                        <Check className="size-3" aria-hidden="true" />



                      </span>



                      {highlight.default}



                    </li>



                  ))}



                </ul>



              ) : null}



            </div>







            <div className="order-1 lg:order-2 lg:sticky lg:top-28">



              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11]">



                {activeImage ? (



                  <button
                    ref={zoomTriggerRef}
                    type="button"
                    onClick={() => setLightboxOpen(true)}



                    className="group relative block aspect-[4/5] w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C9A84C]"



                    aria-label="بزرگ‌نمایی تصویر محصول"



                  >



                    <img



                      src={activeImage.url}



                      alt={activeImage.alt}



                      width={activeImage.dimensions.width}



                      height={activeImage.dimensions.height}



                      loading="eager"



                      decoding="async"



                      fetchPriority="high"



                      className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"



                    />







                    <span className="absolute bottom-4 end-4 inline-flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#08090B]/80 text-[#BDB5AA] backdrop-blur-xl transition-colors group-hover:border-[#C9A84C]/30 group-hover:text-[#DCC27C]">



                      <ZoomIn className="size-4" aria-hidden="true" />



                    </span>



                  </button>



                ) : (



                  <div className="flex aspect-[4/5] items-center justify-center p-8 text-sm text-[#77716A]">



                    تصویر محصول در دسترس نیست



                  </div>



                )}



              </div>







              {images.length > 1 ? (



                <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">



                  {images.map((image) => {



                    const selected = image.id === activeImage?.id;







                    return (



                      <button



                        key={image.id}



                        type="button"



                        onClick={() => setActiveImageId(image.id)}



                        className={`aspect-square w-20 shrink-0 snap-start overflow-hidden rounded-xl border bg-[#0D0F11] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] ${



                          selected



                            ? "border-[#C9A84C]/50"



                            : "border-white/[0.07] hover:border-white/[0.15]"



                        }`}



                        aria-label={`نمایش ${image.alt}`}



                      >



                        <img



                          src={image.url}



                          alt=""



                          width={image.dimensions.width}



                          height={image.dimensions.height}



                          loading="lazy"



                          decoding="async"



                          className="size-full object-cover"



                        />



                      </button>



                    );



                  })}



                </div>



              ) : null}



            </div>



          </div>



        </div>



      </section>







      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">



        <div className="mx-auto grid w-full max-w-[1500px] gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-10">



          <div className="grid gap-8">



            <section



              className="rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-5 sm:p-7"



              aria-labelledby="product-description-title"



            >



              <span



                className="text-[8px] font-semibold tracking-[0.3em] text-[#C9A84C]"



                dir="ltr"



              >



                PRODUCT STORY



              </span>



              <h2



                id="product-description-title"



                className="mt-2 text-2xl font-semibold text-[#F0EDE8]"



              >



                درباره این مدل



              </h2>



              <p className="mt-4 text-sm leading-8 text-[#A39C92] sm:text-base sm:leading-9">



                {product.content.description.default}



              </p>



            </section>







            <section



              className="rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-5 sm:p-7"



              aria-labelledby="product-specs-title"



            >



              <span



                className="text-[8px] font-semibold tracking-[0.3em] text-[#C9A84C]"



                dir="ltr"



              >



                SPECIFICATIONS



              </span>



              <h2 id="product-specs-title" className="mt-2 text-2xl font-semibold text-[#F0EDE8]">



                مشخصات فنی



              </h2>







              <div className="mt-6 grid gap-6">



                {groupedSpecs.map(([group, specs]) => (



                  <div key={group}>



                    <h3 className="mb-3 text-xs font-semibold text-[#D9C17C]">



                      {groupLabels[group]}



                    </h3>







                    <dl className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-[#090B0D] px-4">



                      {specs.map((specification) => (



                        <div



                          key={specification.key}



                          className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-3 text-xs sm:text-sm"



                        >



                          <dt className="text-[#807A72]">{specification.label.default}</dt>



                          <dd className="text-[#D8D1C7]">{specValue(specification)}</dd>



                        </div>



                      ))}



                    </dl>



                  </div>



                ))}



              </div>



            </section>



          </div>







          <aside className="grid content-start gap-3">
            {product.shipping.shippable ||
            product.returns.policyPagePath ? (
              <InfoLinkCard
                icon={ShoppingBag}
                title="ارسال و بازگشت کالا"
                description="جزئیات روش‌های ارسال و شرایط بازگشت را پیش از خرید بررسی کنید."
                to="/shipping-returns"
              />
            ) : null}

            {product.trustEvidenceRefs.length > 0 ? (
              <InfoLinkCard
                icon={Check}
                title="راهنمای اصالت"
                description="اطلاعات ثبت‌شده برای بررسی اصالت این محصول را مطالعه کنید."
                to="/authenticity"
              />
            ) : null}

            {product.warranty.type !== "none" ? (
              <InfoLinkCard
                icon={Star}
                title="شرایط ضمانت"
                description="نوع و شرایط ضمانت این محصول را پیش از خرید بررسی کنید."
                to="/warranty"
              />
            ) : null}
          </aside>



        </div>



      </section>







      {data.relatedCards.length > 0 ? (



        <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">



          <div className="mx-auto w-full max-w-[1500px]">



            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">



              <div>



                <span



                  className="text-[8px] font-semibold tracking-[0.3em] text-[#C9A84C]"



                  dir="ltr"



                >



                  RELATED



                </span>



                <h2 className="mt-2 text-2xl font-semibold text-[#F0EDE8] sm:text-3xl">



                  مدل‌های مرتبط



                </h2>



              </div>







              <Link



                to="/shop"



                className="hidden min-h-10 items-center gap-2 text-xs font-semibold text-[#CDB46F] transition-colors hover:text-[#E5CF8B] sm:inline-flex"



              >



                مشاهده فروشگاه



                <ChevronLeft className="size-4" aria-hidden="true" />



              </Link>



            </div>







            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-4">



              {data.relatedCards.map((model) => (



                <div



                  key={model.id}



                  className="w-[72vw] max-w-[290px] shrink-0 snap-start sm:w-auto sm:max-w-none"



                >



                  <DiscoveryProductCard model={model} />



                </div>



              ))}



            </div>



          </div>



        </section>



      ) : null}







      {lightboxOpen && activeImage ? (



        <div
          className="fixed inset-0 z-[110] grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLightboxOpen(false);
            }
          }}



          aria-modal="true"



          aria-label="نمایش بزرگ تصویر محصول"



        >



          <button
            ref={lightboxCloseRef}
            type="button"
            onClick={() => setLightboxOpen(false)}



            className="absolute end-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"



            aria-label="بستن تصویر"



          >



            <X className="size-5" aria-hidden="true" />



          </button>







          <img



            src={activeImage.url}



            alt={activeImage.alt}



            width={activeImage.dimensions.width}



            height={activeImage.dimensions.height}



            className="max-h-[88dvh] max-w-[92vw] object-contain"



          />



        </div>



      ) : null}



    </main>



  );



}







function ProductNotFound() {



  return (



    <section



      className="relative overflow-hidden bg-[#08090B] px-4 py-24 sm:px-6 sm:py-32"



      dir="rtl"



    >



      <div className="relative mx-auto max-w-lg rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] px-6 py-10 text-center sm:px-10 sm:py-12">



        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.06]">



          <SearchX className="size-6 text-[#C9A84C]" aria-hidden="true" />



        </div>



        <h1 className="mt-5 text-2xl font-semibold text-[#F0EDE8] sm:text-3xl">



          محصول پیدا نشد



        </h1>



        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#979188]">



          این محصول در کاتالوگ موجود نیست یا نشانی آن تغییر کرده است.



        </p>



        <Link



          to="/shop"



          className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-6 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"



        >



          بازگشت به فروشگاه



          <ChevronLeft className="size-4" aria-hidden="true" />



        </Link>



      </div>



    </section>



  );



}







function ProductDetailPending() {



  return (



    <section



      className="bg-[#08090B] px-4 py-10 sm:px-6 lg:px-8"



      dir="rtl"



      aria-label="در حال بارگذاری محصول"



    >



      <div className="mx-auto grid w-full max-w-[1500px] gap-8 lg:grid-cols-2 lg:gap-12">



        <div className="order-2 grid content-start gap-4 lg:order-1">



          <div className="h-3 w-32 animate-pulse rounded-full bg-white/[0.05] motion-reduce:animate-none" />



          <div className="h-12 w-4/5 animate-pulse rounded-xl bg-white/[0.06] motion-reduce:animate-none" />



          <div className="h-20 w-full animate-pulse rounded-xl bg-white/[0.04] motion-reduce:animate-none" />



          <div className="mt-3 h-56 w-full animate-pulse rounded-[1.35rem] bg-white/[0.045] motion-reduce:animate-none" />



        </div>







        <div className="order-1 aspect-[4/5] animate-pulse rounded-[1.5rem] bg-white/[0.045] motion-reduce:animate-none lg:order-2" />



      </div>



    </section>



  );



}
