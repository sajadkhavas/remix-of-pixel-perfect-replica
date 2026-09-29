import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { getConfirmedSocialLinks } from "./navigation-model";
import { usePublicStoreSettings } from "./store-settings-context";

const GLOBAL_SCROLLBAR_CSS = `
  html {
    scrollbar-width: thin;
    scrollbar-color: #C9A84C #090A0C;
  }

  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }

  html::-webkit-scrollbar-track,
  body::-webkit-scrollbar-track {
    background: #090A0C;
  }

  html::-webkit-scrollbar-thumb,
  body::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #E0C16B, #B98D36);
    border: 2px solid #090A0C;
    border-radius: 999px;
  }

  html::-webkit-scrollbar-thumb:hover,
  body::-webkit-scrollbar-thumb:hover {
    background: #E8C96C;
  }

  @media (max-width: 767px) {
    html::-webkit-scrollbar,
    body::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }

    html::-webkit-scrollbar-thumb,
    body::-webkit-scrollbar-thumb {
      border-width: 1px;
    }
  }
`;

export function FloatingActions() {
  const settings = usePublicStoreSettings();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const socialLinks = getConfirmedSocialLinks(settings);
  const whatsapp = socialLinks.find((link) => link.platform === "whatsapp");

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const update = () => {
      setShowScrollTop(window.scrollY > 480);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollToTop = () => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <style>{GLOBAL_SCROLLBAR_CSS}</style>

      {/* WhatsApp — left */}
      {whatsapp ? (
        <a
          href={whatsapp.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="ارتباط با KRONOS در واتساپ"
          title="واتساپ"
          className="fixed left-4 z-[54] inline-flex size-12 items-center justify-center rounded-full border border-white/15 bg-[#25D366] text-white shadow-[0_14px_34px_rgba(0,0,0,0.34)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] max-lg:bottom-[calc(env(safe-area-inset-bottom,0px)+6.25rem)] lg:bottom-6"
        >
          <span className="relative inline-flex size-6 items-center justify-center">
            <MessageCircle
              className="absolute size-6"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <Phone
              className="relative size-3"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>
        </a>
      ) : null}

      {/* Back to top — right */}
      <button
        type="button"
        aria-label="بازگشت به بالای صفحه"
        title="بالای صفحه"
        onClick={scrollToTop}
        className={[
          "fixed right-4 z-[54] inline-flex size-12 items-center justify-center rounded-full border border-[#C9A84C]/35 bg-[#0B0C0E]/90 text-[#D9B85E] shadow-[0_14px_34px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C] hover:text-[#090A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] max-lg:bottom-[calc(env(safe-area-inset-bottom,0px)+6.25rem)] lg:bottom-6",
          showScrollTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        ].join(" ")}
      >
        <ArrowUp className="size-5" strokeWidth={1.7} aria-hidden="true" />
      </button>
    </>
  );
}
