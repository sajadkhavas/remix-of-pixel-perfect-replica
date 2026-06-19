import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/lib/store-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { gsap } from "@/lib/gsap";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1
          className="text-7xl font-black text-[#C9A84C]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          404
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-[#F0EDE8]">صفحه پیدا نشد</h2>
        <p className="mt-2 text-sm text-[#8A8A8A]">
          آدرسی که دنبالش هستید وجود ندارد یا منتقل شده.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-[#C9A84C] px-6 py-3 text-sm font-bold tracking-wider uppercase text-[#080808] hover:bg-[#E8C96C] transition-colors"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-[#F0EDE8]">صفحه بارگذاری نشد</h1>
        <p className="mt-2 text-sm text-[#8A8A8A]">مشکلی پیش آمد. لطفاً دوباره تلاش کنید.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-[#C9A84C] px-4 py-2 text-sm font-bold text-[#080808] hover:bg-[#E8C96C]"
          >
            تلاش مجدد
          </button>
          <a
            href="/"
            className="border border-[#2A2A2A] px-4 py-2 text-sm text-[#F0EDE8] hover:border-[#C9A84C]"
          >
            خانه
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#080808" },
      { title: "کرونوس — فروشگاه ساعت لوکس | KRONOS" },
      { name: "description", content: "مرجع تخصصی ساعت‌های لوکس، اسپرت و هوشمند با ضمانت اصالت." },
      { name: "author", content: "KRONOS" },
      { property: "og:title", content: "کرونوس — فروشگاه ساعت لوکس" },
      { property: "og:description", content: "ساعت‌های اورجینال با ضمانت اصالت و ارسال امن." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, smoothWheel: true });
    const callback = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(callback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(callback);
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <div
          className="bg-[#080808] min-h-screen overflow-x-hidden flex flex-col"
          dir="rtl"
          lang="fa"
        >
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <MobileTabBar />
        </div>
        <Toaster />
      </StoreProvider>
    </QueryClientProvider>
  );
}
