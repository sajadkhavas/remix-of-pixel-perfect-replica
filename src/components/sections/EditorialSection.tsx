import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import patekPhilippeNautilus from "@/assets/patek-philippe-nautilus-blue-dial-kronos.webp";

type EditorialItem = {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly alt: string;
  readonly href: string;
  readonly cta: string;
};

/**
 * فعلاً فقط یک آیتم داریم.
 *
 * بعداً وقتی Backend/Blog واقعی وصل شد، کافی است آیتم‌های بیشتری
 * با همین ساختار وارد این آرایه شوند؛ Layout خودش به حالت چندمقاله‌ای
 * تبدیل می‌شود و نیاز به بازطراحی دوباره این سکشن نیست.
 */
const EDITORIAL_ITEMS: readonly EditorialItem[] = [
  {
    id: "craftsmanship",
    eyebrow: "OUR STORY",
    title: "هنر در گذر زمان",
    description:
      "KRONOS فقط یک فروشگاه نیست؛ ما به ساعت به‌عنوان ترکیبی از هنر، مهندسی و داستانی ماندگار نگاه می‌کنیم.",
    image: patekPhilippeNautilus,
    alt: "ساعت لوکس با صفحه آبی در بخش داستان KRONOS",
    href: "/about",
    cta: "داستان KRONOS",
  },

  /**
   * نمونه برای آینده:
   *
   * {
   *   id: "journal-02",
   *   eyebrow: "JOURNAL",
   *   title: "عنوان مقاله دوم",
   *   description: "توضیح کوتاه مقاله دوم.",
   *   image: anotherImage,
   *   alt: "توضیح تصویر",
   *   href: "/blog/example",
   *   cta: "خواندن مقاله",
   * },
   */
];

export function EditorialSection() {
  if (EDITORIAL_ITEMS.length === 1) {
    return <SingleEditorial item={EDITORIAL_ITEMS[0]} />;
  }

  return <EditorialCollection items={EDITORIAL_ITEMS} />;
}

function SingleEditorial({ item }: { item: EditorialItem }) {
  return (
    <section
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#08090B] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      dir="rtl"
      aria-labelledby={`editorial-title-${item.id}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(23,66,98,0.12),transparent_28%),radial-gradient(circle_at_64%_54%,rgba(201,168,76,0.07),transparent_38%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 max-w-xl lg:order-1"
        >
          <EditorialHeading item={item} />

          <Link
            to={item.href}
            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#D4B15B] px-5 text-xs font-semibold text-[#0A0B0D] transition-colors hover:bg-[#E2C674] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4B15B]"
          >
            {item.cta}
            <ArrowLeft
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 lg:order-2"
        >
          <div
            className="absolute -inset-8 rounded-[3rem] bg-[#173F60]/[0.09] blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto aspect-[4/5] max-h-[620px] w-full max-w-[540px] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0E1012] shadow-[0_35px_80px_rgba(0,0,0,0.38)] lg:mr-auto">
            <img
              src={item.image}
              alt={item.alt}
              width={1122}
              height={1402}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-700 hover:scale-[1.025]"
            />

            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(8,9,11,0.38)_100%)]"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/45 to-transparent"
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EditorialCollection({
  items,
}: {
  items: readonly EditorialItem[];
}) {
  const [featured, ...secondary] = items;

  return (
    <section
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#08090B] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      dir="rtl"
      aria-labelledby="editorial-collection-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(23,66,98,0.10),transparent_30%),radial-gradient(circle_at_32%_70%,rgba(201,168,76,0.06),transparent_34%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#C9A84C]" aria-hidden="true" />
              <span
                className="text-[8px] font-semibold tracking-[0.34em] text-[#C9A84C] sm:text-[10px]"
                dir="ltr"
              >
                JOURNAL & STORIES
              </span>
            </div>

            <h2
              id="editorial-collection-title"
              className="mt-3 text-2xl font-semibold text-[#F2EEE6] sm:text-4xl"
              style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
            >
              داستان‌ها و مجله KRONOS
            </h2>
          </div>

          <Link
            to="/blog"
            className="group hidden min-h-10 items-center gap-2 text-xs font-medium text-[#D4B96F] transition-colors hover:text-[#E5CB83] sm:inline-flex"
          >
            مشاهده همه
            <ArrowLeft
              className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Desktop: Featured large + smaller stories */}
        <div className="hidden gap-4 lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
          <FeaturedEditorialCard item={featured} />

          <div className="grid content-start gap-4">
            {secondary.slice(0, 3).map((item) => (
              <SecondaryEditorialCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Mobile / tablet:
            first story featured, remaining stories are swipeable */}
        <div className="lg:hidden">
          <FeaturedEditorialCard item={featured} compact />

          {secondary.length > 0 ? (
            <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {secondary.map((item) => (
                <div
                  key={item.id}
                  className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-[44vw]"
                >
                  <SecondaryEditorialCard item={item} />
                </div>
              ))}
            </div>
          ) : null}

          <Link
            to="/blog"
            className="group mt-4 inline-flex min-h-10 items-center gap-2 text-xs font-medium text-[#D4B96F] transition-colors hover:text-[#E5CB83]"
          >
            مشاهده همه مقالات
            <ArrowLeft
              className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedEditorialCard({
  item,
  compact = false,
}: {
  item: EditorialItem;
  compact?: boolean;
}) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0D0F11]",
        compact ? "min-h-[520px]" : "min-h-[620px]",
      ].join(" ")}
    >
      <img
        src={item.image}
        alt={item.alt}
        width={1122}
        height={1402}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
      />

      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.06)_10%,rgba(8,9,11,0.34)_48%,rgba(8,9,11,0.96)_100%)]"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-9">
        <EditorialHeading item={item} compact />

        <Link
          to={item.href}
          className="group/link mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#D4B15B] px-5 text-xs font-semibold text-[#0A0B0D] transition-colors hover:bg-[#E2C674]"
        >
          {item.cta}
          <ArrowLeft
            className="size-4 transition-transform duration-300 group-hover/link:-translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

function SecondaryEditorialCard({
  item,
}: {
  item: EditorialItem;
}) {
  return (
    <article className="group grid min-h-[170px] grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0F11] sm:grid-cols-[138px_minmax(0,1fr)]">
      <Link
        to={item.href}
        className="relative block overflow-hidden"
        aria-label={item.title}
      >
        <img
          src={item.image}
          alt={item.alt}
          width={1122}
          height={1402}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
        />
        <div
          className="absolute inset-0 bg-black/[0.08]"
          aria-hidden="true"
        />
      </Link>

      <div className="flex min-w-0 flex-col justify-center p-4 sm:p-5">
        <span
          className="text-[8px] font-semibold tracking-[0.28em] text-[#C9A84C]"
          dir="ltr"
        >
          {item.eyebrow}
        </span>

        <Link
          to={item.href}
          className="mt-2 line-clamp-2 text-base font-semibold leading-7 text-[#EFE9DF] transition-colors hover:text-[#E3C77D]"
        >
          {item.title}
        </Link>

        <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#8F887F]">
          {item.description}
        </p>

        <Link
          to={item.href}
          className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium text-[#D1B361]"
        >
          {item.cta}
          <ArrowLeft className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function EditorialHeading({
  item,
  compact = false,
}: {
  item: EditorialItem;
  compact?: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="h-px w-7 bg-[#C9A84C]" aria-hidden="true" />
        <span
          className="text-[8px] font-semibold tracking-[0.34em] text-[#C9A84C] sm:text-[10px]"
          dir="ltr"
        >
          {item.eyebrow}
        </span>
      </div>

      <h3
        className={[
          "mt-4 font-semibold leading-[1.35] text-[#F2EEE6]",
          compact ? "text-3xl sm:text-4xl" : "text-3xl sm:text-4xl lg:text-5xl",
        ].join(" ")}
        style={{ fontFamily: "Playfair Display, Vazirmatn Variable, serif" }}
      >
        {item.title}
      </h3>

      <p className="mt-4 max-w-xl text-sm leading-8 text-[#C9C0B1] sm:text-base sm:leading-9">
        {item.description}
      </p>
    </>
  );
}
