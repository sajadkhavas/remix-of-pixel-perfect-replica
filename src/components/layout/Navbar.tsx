import { ShoppingCart, Menu, User, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { CATEGORIES } from "@/lib/catalog";
import { useStore } from "@/lib/store-context";
import { IconButton } from "@/components/ui/icon-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getAnnouncementText,
  PRIMARY_NAV_ITEMS,
  shouldShowAccount,
  shouldShowWishlist,
} from "./navigation-model";
import { usePublicStoreSettings } from "./store-settings-context";

export function Navbar() {
  const settings = usePublicStoreSettings();
  const { cart, wishlist } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const announcement = getAnnouncementText(settings);
  const showWishlist = shouldShowWishlist(settings);
  const showAccount = shouldShowAccount(settings);
  const brandName = settings.brand.shortName ?? settings.brand.name;

  return (
    <>
      {announcement ? (
        <div className="border-b border-border-subtle bg-background-canvas px-4 py-2 text-center text-xs text-text-secondary">
          {announcement}
        </div>
      ) : null}

      <nav
        aria-label="ناوبری اصلی"
        className="sticky top-0 z-[var(--z-sticky)] border-b border-border-subtle bg-background-canvas/90 px-4 py-3 backdrop-blur-[var(--blur-overlay)] sm:px-6 lg:px-8"
      >
        <div className="container mx-auto flex items-center justify-between gap-4" dir="rtl">
          <Link
            to="/"
            className="flex min-h-11 shrink-0 flex-col justify-center rounded-sm px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            aria-label={`${brandName}، صفحه اصلی`}
          >
            <span className="text-lg font-black uppercase tracking-[0.15em] text-accent-primary sm:text-xl">
              {brandName}
            </span>
            {settings.brand.localizedName ? (
              <span className="hidden text-[10px] text-text-muted sm:block">
                {settings.brand.localizedName}
              </span>
            ) : null}
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                activeProps={{ className: "text-accent-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {showWishlist ? (
              <Link
                to="/wishlist"
                aria-label="علاقه‌مندی‌ها"
                className="relative inline-flex size-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Heart className="size-5" aria-hidden="true" />
                {wishlist.length > 0 ? (
                  <span className="absolute end-0 top-0 flex size-4 items-center justify-center rounded-full bg-accent-primary text-[9px] font-bold text-background-canvas">
                    {wishlist.length}
                  </span>
                ) : null}
              </Link>
            ) : null}

            {showAccount ? (
              <Link
                to="/auth"
                aria-label="حساب کاربری"
                className="hidden size-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring sm:inline-flex"
              >
                <User className="size-5" aria-hidden="true" />
              </Link>
            ) : null}

            <Link
              to="/cart"
              aria-label="سبد خرید"
              className="relative inline-flex size-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <ShoppingCart className="size-5" aria-hidden="true" />
              {cartCount > 0 ? (
                <span className="absolute end-0 top-0 flex size-4 items-center justify-center rounded-full bg-accent-primary text-[9px] font-bold text-background-canvas">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <IconButton label="باز کردن منو" variant="ghost" size="icon" className="lg:hidden">
                  <Menu aria-hidden="true" />
                </IconButton>
              </SheetTrigger>
              <SheetContent side="end" className="gap-6 overflow-y-auto" dir="rtl">
                <SheetHeader>
                  <SheetTitle>{brandName}</SheetTitle>
                  <SheetDescription>دسترسی به بخش‌های اصلی فروشگاه</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col">
                  {PRIMARY_NAV_ITEMS.map((item) => (
                    <SheetClose asChild key={item.to}>
                      <Link
                        to={item.to}
                        className="flex min-h-11 items-center border-b border-border-subtle px-2 py-3 text-base font-semibold text-text-primary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-text-muted">دسته‌بندی‌ها</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((category) => (
                      <SheetClose asChild key={category.slug}>
                        <Link
                          to="/shop/$category"
                          params={{ category: category.slug }}
                          className="flex min-h-11 items-center rounded-md border border-border-subtle px-3 py-2 text-sm text-text-secondary transition-colors hover:border-border-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                        >
                          {category.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  {showWishlist ? (
                    <SheetClose asChild>
                      <Link
                        to="/wishlist"
                        className="flex min-h-11 items-center gap-2 rounded-md px-2 text-text-secondary hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      >
                        <Heart className="size-5" aria-hidden="true" />
                        علاقه‌مندی‌ها
                      </Link>
                    </SheetClose>
                  ) : null}
                  {showAccount ? (
                    <SheetClose asChild>
                      <Link
                        to="/auth"
                        className="flex min-h-11 items-center gap-2 rounded-md px-2 text-text-secondary hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      >
                        <User className="size-5" aria-hidden="true" />
                        حساب کاربری
                      </Link>
                    </SheetClose>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}
