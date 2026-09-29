import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole, UserRound } from "lucide-react";

import { PageHero } from "@/components/layout/PageHero";
import { usePublicStoreSettings } from "@/components/layout/store-settings-context";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "حساب کاربری | KRONOS" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const settings = usePublicStoreSettings();
  const authAvailable =
    settings.features.auth &&
    settings.environment.capabilities.auth === "configured";

  return (
    <>
      <PageHero
        eyebrow="ACCOUNT"
        title="حساب کاربری"
        sub="ورود به حساب برای دسترسی به اطلاعات شخصی و سفارش‌ها."
      />

      <section
        className="bg-[#08090B] px-4 py-12 sm:px-6 sm:py-16"
        dir="rtl"
      >
        <div className="mx-auto max-w-md">
          {authAvailable ? (
            <form
              className="rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-5 sm:p-6"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/[0.05] text-[#D6BE78]">
                <UserRound className="size-5" aria-hidden="true" />
              </div>

              <label className="mt-6 block">
                <span className="mb-2 block text-xs font-medium text-[#A39C92]">
                  شماره موبایل یا ایمیل
                </span>
                <input
                  name="identifier"
                  autoComplete="username"
                  required
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#090B0D] px-4 text-sm text-[#F0EDE8] outline-none transition-colors placeholder:text-[#5F5A54] focus:border-[#C9A84C]/45"
                />
              </label>

              <button
                type="submit"
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-4 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
              >
                ادامه
                <ArrowLeft className="size-4" aria-hidden="true" />
              </button>
            </form>
          ) : (
            <div className="rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-6 text-center sm:p-8">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#C9A84C]/15 bg-[#C9A84C]/[0.05] text-[#D6BE78]">
                <LockKeyhole className="size-6" aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-[#F0EDE8]">
                ورود به حساب در حال حاضر فعال نیست
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#8F887F]">
                برای مرور محصولات، علاقه‌مندی‌ها و سبد خرید نیازی به ورود ندارید.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C9A84C] px-5 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E]"
              >
                مشاهده فروشگاه
                <ArrowLeft className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
