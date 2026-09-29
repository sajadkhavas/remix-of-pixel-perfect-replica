import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

import { CATALOG_BRANDS } from "@/data/fixtures/brands";

function BrandItem({
  brand,
}: {
  readonly brand: (typeof CATALOG_BRANDS)[number];
}) {
  return (
    <Link
      to="/shop"
      search={{ brand: [brand.slug] }}
      resetScroll
      viewTransition
      preload="intent"
      className="flex shrink-0 items-center justify-center px-8 py-4 sm:px-12"
      aria-label={`مشاهده محصولات ${brand.name}`}
    >
      <motion.span
        whileHover={{ scale: 1.05 }}
        className="text-sm font-semibold tracking-[0.22em] text-[#BEB7AB]/60 transition-colors hover:text-[#D7BD77] sm:text-base sm:tracking-[0.28em]"
        style={{ fontFamily: "Playfair Display, serif" }}
        dir="ltr"
      >
        {brand.name.toUpperCase()}
      </motion.span>
    </Link>
  );
}

export function BrandsMarquee() {
  const brands = CATALOG_BRANDS.filter((brand) => brand.featured);

  if (brands.length === 0) return null;

  const repeated = [...brands, ...brands, ...brands, ...brands];

  return (
    <section
      className="overflow-hidden border-y border-white/[0.06] bg-[#08090B] py-5 sm:py-6"
      aria-label="برندهای منتخب"
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#08090B] to-transparent sm:w-32"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#08090B] to-transparent sm:w-32"
          aria-hidden="true"
        />

        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-25%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {repeated.map((brand, index) => (
            <BrandItem key={`${brand.id}-${index}`} brand={brand} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
