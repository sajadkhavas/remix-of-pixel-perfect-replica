import {
  ChevronLeft,
  Heart,
  Menu,
  User,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { CATALOG_CATEGORIES } from "@/data/fixtures/categories";
import { PRIMARY_NAV_ITEMS } from "./navigation-model";

interface MobileMenuProps {
  readonly brandName: string;
  readonly showWishlist: boolean;
  readonly showAccount: boolean;
}

export function MobileMenu({
  brandName,
  showWishlist,
  showAccount,
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const categories = CATALOG_CATEGORIES.filter((category) => category.depth === 1);

  const openMenu = () => {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) return;

    dialog.showModal();
    setOpen(true);

    window.requestAnimationFrame(() => {
      dialog
        .querySelector<HTMLElement>("[data-mobile-menu-first]")
        ?.focus();
    });
  };

  const closeMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    dialog.close();
  };

  const handleClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="باز کردن منو"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-navigation-dialog"
        onClick={openMenu}
        className="inline-flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-text-secondary transition-all duration-300 hover:border-accent-primary/40 hover:bg-accent-muted hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring sm:size-11 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation-dialog"
        aria-labelledby="mobile-navigation-title"
        onClose={handleClose}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        className="fixed inset-y-0 right-0 m-0 ml-auto h-dvh w-[min(25rem,92vw)] max-w-none overflow-hidden rounded-l-[2rem] border-0 border-l border-white/[0.08] bg-[#0A0B0D] p-0 text-text-primary shadow-[-24px_0_80px_rgba(0,0,0,0.5)] backdrop:bg-black/75 lg:hidden"
        dir="rtl"
      >
        <div className="relative flex h-full min-h-0 flex-col">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-accent-primary/[0.08] blur-3xl"
            aria-hidden="true"
          />

          <header className="relative flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.07] px-5 pb-5 pt-6">
            <div>
              <span
                className="text-[9px] font-semibold tracking-[0.3em] text-accent-primary"
                dir="ltr"
              >
                KRONOS MENU
              </span>

              <h2
                id="mobile-navigation-title"
                className="mt-2 text-xl font-black uppercase tracking-[0.14em] text-text-primary"
              >
                {brandName}
              </h2>

              <p className="mt-1 text-xs leading-6 text-text-muted">
                مسیر موردنظر خود را انتخاب کنید
              </p>
            </div>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="بستن منو"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-text-secondary transition-all duration-300 hover:border-accent-primary/40 hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <X className="size-[18px]" aria-hidden="true" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <nav aria-label="منوی موبایل">
              <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015]">
                {PRIMARY_NAV_ITEMS.map((item, index) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-mobile-menu-first={index === 0 ? "true" : undefined}
                    onClick={closeMenu}
                    className="group flex min-h-14 items-center gap-3 border-b border-white/[0.06] px-4 text-sm font-medium text-text-primary transition-colors last:border-b-0 hover:bg-white/[0.035] hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
                    activeProps={{
                      className: "bg-accent-muted text-accent-primary",
                    }}
                  >
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/[0.07] text-[9px] text-text-muted transition-colors group-hover:border-accent-primary/30 group-hover:text-accent-primary"
                      dir="ltr"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex-1">{item.label}</span>

                    <ChevronLeft
                      className="size-4 text-text-muted transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-accent-primary"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </nav>

            <section aria-labelledby="mobile-categories-title" className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <h3
                  id="mobile-categories-title"
                  className="text-xs font-semibold text-text-secondary"
                >
                  دسته‌بندی‌ها
                </h3>

                <span
                  className="text-[8px] tracking-[0.24em] text-text-muted"
                  dir="ltr"
                >
                  COLLECTIONS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to="/shop/$category"
                    params={{ category: category.slug }}
                    onClick={closeMenu}
                    className="group relative min-h-[80px] overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-primary/25 hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <div
                      className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/55 to-transparent"
                      aria-hidden="true"
                    />

                    <span className="block text-sm font-medium text-text-primary transition-colors group-hover:text-accent-primary">
                      {category.title.default}
                    </span>

                    <span className="mt-1 line-clamp-2 block text-[10px] leading-5 text-text-muted">
                      {category.intro?.default}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {(showWishlist || showAccount) ? (
            <div className="shrink-0 border-t border-white/[0.07] bg-[#0C0D0F] p-4">
              <div className="grid grid-cols-2 gap-2">
                {showWishlist ? (
                  <Link
                    to="/wishlist"
                    onClick={closeMenu}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] text-xs text-text-secondary transition-all hover:border-accent-primary/30 hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <Heart className="size-4" aria-hidden="true" />
                    علاقه‌مندی‌ها
                  </Link>
                ) : null}

                {showAccount ? (
                  <Link
                    to="/auth"
                    onClick={closeMenu}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] text-xs text-text-secondary transition-all hover:border-accent-primary/30 hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <User className="size-4" aria-hidden="true" />
                    حساب کاربری
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
