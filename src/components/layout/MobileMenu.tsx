import { Heart, Menu, User, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { CATEGORIES } from "@/lib/catalog";
import { PRIMARY_NAV_ITEMS } from "./navigation-model";

interface MobileMenuProps {
  readonly brandName: string;
  readonly showWishlist: boolean;
  readonly showAccount: boolean;
}

export function MobileMenu({ brandName, showWishlist, showAccount }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    setOpen(true);
    window.requestAnimationFrame(() => {
      dialog.querySelector<HTMLElement>("[data-mobile-menu-first]")?.focus();
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
        className="inline-flex size-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"
        aria-label="باز کردن منو"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-navigation-dialog"
        onClick={openMenu}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation-dialog"
        aria-labelledby="mobile-navigation-title"
        onClose={handleClose}
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        className="fixed inset-y-0 end-0 m-0 ms-auto h-dvh w-[min(24rem,88vw)] max-w-none border-s border-border-subtle bg-background-canvas p-0 text-text-primary shadow-2xl backdrop:bg-black/70 lg:hidden"
        dir="rtl"
      >
        <div className="flex min-h-full flex-col gap-6 overflow-y-auto p-5">
          <header className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <h2 id="mobile-navigation-title" className="text-lg font-semibold text-text-primary">
                {brandName}
              </h2>
              <p className="mt-1 text-xs text-text-muted">دسترسی به بخش‌های اصلی فروشگاه</p>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="بستن منو"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>

          <nav aria-label="منوی موبایل" className="flex flex-col">
            {PRIMARY_NAV_ITEMS.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                data-mobile-menu-first={index === 0 ? "true" : undefined}
                onClick={closeMenu}
                className="flex min-h-11 items-center border-b border-border-subtle px-2 py-3 text-base font-semibold text-text-primary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <section aria-labelledby="mobile-categories-title">
            <h3 id="mobile-categories-title" className="mb-2 text-xs font-semibold text-text-muted">
              دسته‌بندی‌ها
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  to="/shop/$category"
                  params={{ category: category.slug }}
                  onClick={closeMenu}
                  className="flex min-h-11 items-center rounded-md border border-border-subtle px-3 py-2 text-sm text-text-secondary transition-colors hover:border-border-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-auto flex flex-col gap-2 border-t border-border-subtle pt-4">
            {showWishlist ? (
              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="flex min-h-11 items-center gap-2 rounded-md px-2 text-text-secondary hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Heart className="size-5" aria-hidden="true" />
                علاقه‌مندی‌ها
              </Link>
            ) : null}
            {showAccount ? (
              <Link
                to="/auth"
                onClick={closeMenu}
                className="flex min-h-11 items-center gap-2 rounded-md px-2 text-text-secondary hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <User className="size-5" aria-hidden="true" />
                حساب کاربری
              </Link>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
