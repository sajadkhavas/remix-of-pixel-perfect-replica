import Lenis from "@studio-freight/lenis";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Navbar } from "@/components/layout/Navbar";
import { StoreSettingsProvider } from "@/components/layout/store-settings-provider";
import { PUBLIC_STORE_SETTINGS } from "@/components/layout/store-settings-runtime";
import { SkipLink } from "@/components/system/accessibility";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { gsap } from "@/lib/gsap";
import { reportAppError } from "@/lib/error-reporting";
import { StoreProvider } from "@/lib/store-context";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-4" dir="rtl">
      <div className="max-w-md text-center">
        <p className="text-6xl font-black text-accent-primary" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-text-primary">طµظپط­ظ‡ ظ¾غŒط¯ط§ ظ†ط´ط¯</h1>
        <p className="mt-2 text-sm leading-7 text-text-secondary">
          ط§غŒظ† ظ†ط´ط§ظ†غŒ ط¯ط± ط¯ط³طھط±ط³ ظ†غŒط³طھ. ط§ط² طµظپط­ظ‡ ط§طµظ„غŒ غŒط§ ظپط±ظˆط´ع¯ط§ظ‡ ظ…ط³غŒط± ط¯غŒع¯ط±غŒ ط±ط§ ط§ط¯ط§ظ…ظ‡ ط¯ظ‡غŒط¯.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent-primary px-5 text-sm font-semibold text-background-canvas hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            طµظپط­ظ‡ ط§طµظ„غŒ
          </Link>
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border-default px-5 text-sm font-semibold text-text-primary hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            ظپط±ظˆط´ع¯ط§ظ‡
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-text-primary">طµظپط­ظ‡ ط¨ط§ط±ع¯ط°ط§ط±غŒ ظ†ط´ط¯</h1>
        <p className="mt-2 text-sm leading-7 text-text-secondary">
          ط§ظ…ع©ط§ظ† ظ†ظ…ط§غŒط´ ط§غŒظ† طµظپط­ظ‡ ظپط±ط§ظ‡ظ… ظ†ط´ط¯. ط¯ظˆط¨ط§ط±ظ‡ طھظ„ط§ط´ ع©ظ†غŒط¯ غŒط§ ط¨ظ‡ طµظپط­ظ‡ ط§طµظ„غŒ ط¨ط±ع¯ط±ط¯غŒط¯.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            طھظ„ط§ط´ ط¯ظˆط¨ط§ط±ظ‡
          </Button>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border-default px-5 text-sm font-semibold text-text-primary hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            طµظپط­ظ‡ ط§طµظ„غŒ
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    title: PUBLIC_STORE_SETTINGS.seo.defaultTitle,
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      {
        name: "description",
        content: PUBLIC_STORE_SETTINGS.seo.defaultDescription,
      },
      { name: "robots", content: PUBLIC_STORE_SETTINGS.seo.robots },
      { property: "og:site_name", content: PUBLIC_STORE_SETTINGS.brand.name },
      {
        property: "og:description",
        content: PUBLIC_STORE_SETTINGS.seo.defaultDescription,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#08090B" },
      { name: "color-scheme", content: "dark" },
      { name: "application-name", content: "KRONOS" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: "KRONOS" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
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
      <body className="bg-background-canvas text-text-primary">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    const stopSmoothScroll = () => {
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      tickerCallback = null;
      lenis?.destroy();
      lenis = null;
    };

    const startSmoothScroll = () => {
      if (reducedMotion.matches || lenis) return;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      tickerCallback = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerCallback);
    };

    const syncPreference = () => {
      if (reducedMotion.matches) stopSmoothScroll();
      else startSmoothScroll();
    };

    syncPreference();
    reducedMotion.addEventListener("change", syncPreference);

    return () => {
      reducedMotion.removeEventListener("change", syncPreference);
      stopSmoothScroll();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreSettingsProvider>
        <StoreProvider>
          <SkipLink />

          <div
            className="flex min-h-screen flex-col overflow-x-hidden bg-background-canvas"
            dir="rtl"
          >
            <Navbar />

            <main id="main-content" className="flex-1" tabIndex={-1}>
              <Outlet />
            </main>

            <Footer />
            <MobileTabBar />
          </div>

          <FloatingActions />
          <Toaster />
        </StoreProvider>
      </StoreSettingsProvider>
    </QueryClientProvider>
  );
}

