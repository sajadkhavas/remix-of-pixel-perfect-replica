import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "آیا اصالت ساعت‌ها تضمین شده است؟", a: "بله، تمام ساعت‌های ما دارای کارت گارانتی رسمی، جعبه اورجینال و سریال قابل استعلام از سایت برند هستند." },
  { q: "زمان ارسال چقدر است؟", a: "ارسال در تهران ۱ روز کاری و در شهرستان‌ها ۱ تا ۳ روز کاری انجام می‌شود." },
  { q: "آیا امکان بازگشت کالا وجود دارد؟", a: "بله، تا ۷ روز پس از تحویل در صورت سالم بودن کالا و جعبه، امکان بازگشت وجود دارد." },
  { q: "خرید اقساطی چگونه است؟", a: "برای خرید اقساطی با شماره پشتیبانی تماس بگیرید. گزینه‌های ۳، ۶ و ۱۲ ماهه موجود است." },
  { q: "ساعت هوشمند گارانتی دارد؟", a: "بله، گارانتی رسمی شرکتی به همراه هر ساعت هوشمند ارائه می‌شود." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "سوالات متداول — KRONOS" }] }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <PageHero eyebrow="پشتیبانی" title="سوالات متداول" sub="هر سوالی دارید؟ احتمالاً پاسخش اینجاست." />
      <section className="py-10 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto max-w-2xl space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-[#1E1E1E] bg-[#0c0c0c]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-right gap-3"
              >
                <span className="text-[#F0EDE8] font-medium text-sm sm:text-base">{f.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#C9A84C] shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-[#A8A8A8] leading-loose border-t border-[#1A1A1A] pt-3">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
