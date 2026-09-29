import { Link, useRouter } from "@tanstack/react-router";
import {
  Crown,
  Heart,
  Search,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { useStore } from "@/lib/store-context";
import { MobileMenu } from "./MobileMenu";
import {
  getAnnouncementText,
  PRIMARY_NAV_ITEMS,
  shouldShowAccount,
  shouldShowWishlist,
} from "./navigation-model";
import { usePublicStoreSettings } from "./store-settings-context";

const HEADER_ICON_CLASS =
  "relative inline-flex size-10 items-center justify-center rounded-full text-[#D9D3C8] transition-all duration-300 hover:bg-white/[0.045] hover:text-[#D6B35E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70 sm:size-11";

const ANNOUNCEMENT_STORAGE_KEY = "kronos-announcement-v1-dismissed";

type AnnouncementRoute = "/shop" | "/brands" | "/blog";

type AnnouncementMessage = {
  readonly text: string;
  readonly to: AnnouncementRoute;
};

export function Navbar() {
  const settings = usePublicStoreSettings();
  const router = useRouter();
  const { cart, wishlist } = useStore();

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const configuredAnnouncement = getAnnouncementText(settings);
  const showWishlist = shouldShowWishlist(settings);
  const showAccount = shouldShowAccount(settings);
  const brandName = settings.brand.shortName ?? settings.brand.name;

  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementPaused, setAnnouncementPaused] = useState(false);

  const announcementMessages = useMemo<readonly AnnouncementMessage[]>(
    () => [
      ...(configuredAnnouncement
        ? [
            {
              text: configuredAnnouncement,
              to: "/shop" as const,
            },
          ]
        : []),
      {
        text: "کالکشن‌های KRONOS را بر اساس سبک و برند کشف کنید",
        to: "/shop",
      },
      {
        text: "برندهای شاخص ساعت را در یک نگاه مقایسه کنید",
        to: "/brands",
      },
      {
        text: "داستان‌ها و راهنمای انتخاب ساعت را در مجله KRONOS بخوانید",
        to: "/blog",
      },
    ],
    [configuredAnnouncement],
  );

  useEffect(() => {
    try {
      if (localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) === "1") {
        setAnnouncementVisible(false);
      }
    } catch {
      // Storage may be unavailable; keep the bar visible.
    }
  }, []);

  useEffect(() => {
    if (
      !announcementVisible ||
      announcementPaused ||
      announcementMessages.length <= 1 ||
      typeof window === "undefined"
    ) {
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const intervalId = window.setInterval(() => {
      setAnnouncementIndex(
        (current) => (current + 1) % announcementMessages.length,
      );
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [
    announcementMessages.length,
    announcementPaused,
    announcementVisible,
  ]);

  const dismissAnnouncement = () => {
    setAnnouncementVisible(false);

    try {
      localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, "1");
    } catch {
      // The dismissal then lasts only for the current session.
    }
  };

  const currentAnnouncement =
    announcementMessages[
      announcementIndex % Math.max(announcementMessages.length, 1)
    ];

  const submitSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const query = String(form.get("q") ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 120);

    await router.navigate({
      href: query ? `/shop?q=${encodeURIComponent(query)}` : "/shop",
      resetScroll: true,
      viewTransition: true,
    });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60]">
        {announcementVisible && currentAnnouncement ? (
          <aside
            dir="rtl"
            aria-label="اطلاعیه‌های KRONOS"
            onMouseEnter={() => setAnnouncementPaused(true)}
            onMouseLeave={() => setAnnouncementPaused(false)}
            onFocusCapture={() => setAnnouncementPaused(true)}
            onBlurCapture={() => setAnnouncementPaused(false)}
            className="
              relative flex h-9 items-center
              border-b border-[#F1D78B]/25
              bg-[linear-gradient(90deg,#AD8128_0%,#D8B75D_48%,#B98A2F_100%)]
              text-[#090A0C]
              shadow-[0_4px_14px_rgba(0,0,0,0.12)]
              sm:grid sm:h-8 sm:grid-cols-[auto_minmax(0,1fr)_auto]
            "
          >
            {/* Desktop label */}
            <span
              aria-hidden="true"
              className="hidden ps-3 text-[8px] font-bold tracking-[0.18em] sm:block"
              dir="ltr"
            >
              KRONOS / INFO
            </span>

            {/* Mobile decorative icon */}
            <span
              className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center sm:hidden"
              aria-hidden="true"
            >
              <Sparkles className="size-3.5 text-[#090A0C]/70" strokeWidth={1.8} />
            </span>

            <Link
              to={currentAnnouncement.to}
              className="
                flex h-full min-w-0 flex-1 items-center justify-center
                overflow-hidden pl-10 pr-9 text-center
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-inset focus-visible:ring-[#090A0C]/40
                sm:px-3
              "
            >
              <span
                aria-live="polite"
                className="
                  block max-w-[calc(100vw-5.25rem)] truncate
                  text-[9.5px] font-bold leading-none
                  sm:max-w-none sm:text-xs sm:font-semibold
                "
              >
                {currentAnnouncement.text}
              </span>

              <span
                className="ms-3 hidden shrink-0 items-center gap-1 sm:flex"
                aria-hidden="true"
              >
                {announcementMessages.map((message, index) => (
                  <span
                    key={`${message.to}-${message.text}`}
                    className={[
                      "h-1 w-3 rounded-full transition-colors",
                      index === announcementIndex
                        ? "bg-[#090A0C]"
                        : "bg-[#090A0C]/25",
                    ].join(" ")}
                  />
                ))}
              </span>
            </Link>

            <button
              type="button"
              aria-label="بستن نوار اطلاعیه"
              onClick={dismissAnnouncement}
              className="
                absolute left-1 top-1/2 grid size-7 -translate-y-1/2
                place-items-center rounded-full
                text-[#090A0C]/65 transition-colors
                hover:bg-black/[0.06] hover:text-[#090A0C]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#090A0C]/35
                sm:static sm:size-auto sm:h-8 sm:w-10 sm:translate-y-0 sm:rounded-none
              "
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </aside>
        ) : null}

        <nav
          aria-label="ناوبری اصلی"
          className="border-b border-white/[0.07] bg-[#08090B]/[0.94] shadow-[0_12px_35px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
        >
          {/* Mobile: actions left, logo exactly center, menu right */}
          <div className="relative mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between px-3 sm:px-4 lg:hidden">
            <div className="flex items-center gap-0.5">
              <Link
                to="/cart"
                aria-label="سبد خرید"
                className={HEADER_ICON_CLASS}
              >
                <ShoppingCart className="size-[18px]" aria-hidden="true" />

                {cartCount > 0 ? (
                  <span className="absolute -end-0.5 -top-0.5 flex size-[17px] items-center justify-center rounded-full border-2 border-[#08090B] bg-[#D6B35E] text-[8px] font-bold text-[#08090B]">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              {showWishlist ? (
                <Link
                  to="/wishlist"
                  aria-label="علاقه‌مندی‌ها"
                  className={HEADER_ICON_CLASS}
                >
                  <Heart className="size-[18px]" aria-hidden="true" />

                  {wishlist.length > 0 ? (
                    <span className="absolute -end-0.5 -top-0.5 flex size-[17px] items-center justify-center rounded-full border-2 border-[#08090B] bg-[#D6B35E] text-[8px] font-bold text-[#08090B]">
                      {wishlist.length}
                    </span>
                  ) : null}
                </Link>
              ) : null}
            </div>

            <Link
              to="/"
              aria-label={`${brandName}، صفحه اصلی`}
              className="absolute left-1/2 top-1/2 flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-lg px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70"
            >
              <Crown
                className="size-4 text-[#D6B35E]"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <span
                className="text-base font-semibold uppercase tracking-[0.12em] text-[#DCC078]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {brandName}
              </span>
            </Link>

            <div className="flex min-w-10 justify-end">
              <MobileMenu
                brandName={brandName}
                showWishlist={showWishlist}
                showAccount={showAccount}
              />
            </div>
          </div>

          {/* Desktop: logo RIGHT, navigation CENTER, search/cart LEFT */}
          <div
            dir="ltr"
            className="mx-auto hidden h-16 w-full max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:grid lg:px-8 xl:px-10"
          >
            <div className="flex items-center justify-self-start gap-1" dir="rtl">
              <form
                onSubmit={submitSearch}
                role="search"
                className="relative hidden w-[190px] xl:block 2xl:w-[230px]"
              >
                <label className="block">
                  <span className="sr-only">جستجوی ساعت</span>

                  <Search
                    className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[#77716A]"
                    aria-hidden="true"
                  />

                  <input
                    name="q"
                    type="search"
                    placeholder="جستجوی ساعت..."
                    className="h-9 w-full rounded-full border border-white/[0.07] bg-white/[0.025] pe-9 ps-3 text-xs text-[#EEE8DE] outline-none transition-colors placeholder:text-[#625D57] focus:border-[#C9A84C]/35 focus:bg-white/[0.04]"
                  />
                </label>
              </form>

              {showWishlist ? (
                <Link
                  to="/wishlist"
                  aria-label="علاقه‌مندی‌ها"
                  className={HEADER_ICON_CLASS}
                >
                  <Heart className="size-[18px]" aria-hidden="true" />

                  {wishlist.length > 0 ? (
                    <span className="absolute -end-0.5 -top-0.5 flex size-[17px] items-center justify-center rounded-full border-2 border-[#08090B] bg-[#D6B35E] text-[8px] font-bold text-[#08090B]">
                      {wishlist.length}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {showAccount ? (
                <Link
                  to="/auth"
                  aria-label="حساب کاربری"
                  className={HEADER_ICON_CLASS}
                >
                  <User className="size-[18px]" aria-hidden="true" />
                </Link>
              ) : null}

              <Link
                to="/cart"
                aria-label="سبد خرید"
                className={HEADER_ICON_CLASS}
              >
                <ShoppingCart className="size-[18px]" aria-hidden="true" />

                {cartCount > 0 ? (
                  <span className="absolute -end-0.5 -top-0.5 flex size-[17px] items-center justify-center rounded-full border-2 border-[#08090B] bg-[#D6B35E] text-[8px] font-bold text-[#08090B]">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </div>

            <div dir="rtl" className="flex items-center justify-center gap-0.5">
              {PRIMARY_NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative inline-flex min-h-10 items-center rounded-full px-3.5 text-[13px] text-[#B5AFA5] transition-all duration-300 hover:bg-white/[0.03] hover:text-[#F0EDE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70 xl:px-4"
                  activeProps={{
                    className:
                      "bg-[#C9A84C]/[0.08] text-[#DCC078]",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              to="/"
              aria-label={`${brandName}، صفحه اصلی`}
              className="group flex min-h-11 items-center justify-self-end gap-2 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/70"
              dir="rtl"
            >
              <Crown
                className="size-[18px] text-[#D6B35E]"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <span
                className="text-xl font-semibold uppercase tracking-[0.14em] text-[#DCC078] transition-colors group-hover:text-[#E8CF8A]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {brandName}
              </span>
            </Link>
          </div>
        </nav>
      </header>

      <div
        aria-hidden="true"
        className={
          announcementVisible
            ? "h-[6.25rem] sm:h-24"
            : "h-16"
        }
      />
    </>
  );
}
