import { createFileRoute } from "@tanstack/react-router";

import { ContentPage } from "@/components/content/PolicyPage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildTrustPageHead } from "@/content/trust/seo";

const FAQS = [
  {
    q: "اطلاعات فنی هر ساعت از کجا می‌آید؟",
    a: "مشخصات نمایش‌داده‌شده باید از داده ثبت‌شده همان محصول و منبع قابل بررسی آن تهیه شود. اگر یک مشخصه ثبت نشده باشد، فروشگاه نباید آن را حدس بزند.",
  },
  {
    q: "آیا موجودی و قیمت همیشه ثابت است؟",
    a: "خیر. موجودی و قیمت می‌توانند تغییر کنند و باید از وضعیت ثبت‌شده همان مدل یا واریانت خوانده شوند. صفحه محصول مرجع وضعیت فعلی قابل نمایش است.",
  },
  {
    q: "شرایط ارسال و مرجوعی چیست؟",
    a: "جزئیات ارسال یا مرجوعی فقط وقتی نمایش داده می‌شود که سیاست مربوط در تنظیمات عمومی فروشگاه ثبت و برای انتشار تأیید شده باشد. از صفحه «ارسال و مرجوعی» وضعیت فعلی را بررسی کنید.",
  },
  {
    q: "گارانتی و اصالت چگونه اعلام می‌شود؟",
    a: "هیچ تضمین، مدت گارانتی یا رابطه رسمی با برند بدون شواهد تأییدشده به‌عنوان واقعیت نمایش داده نمی‌شود. صفحات گارانتی و اصالت تنها اطلاعات تأییدشده را منتشر می‌کنند.",
  },
  {
    q: "چه روش‌های پرداختی قابل استفاده‌اند؟",
    a: "فقط روش‌هایی که در تنظیمات عمومی فعال شده‌اند در صفحه روش‌های پرداخت نمایش داده می‌شوند. نام درگاه یا روش پرداخت غیرفعال نباید به کاربر نشان داده شود.",
  },
  {
    q: "چطور چند مدل را مقایسه کنم؟",
    a: "اگر قابلیت مقایسه در فروشگاه فعال باشد، می‌توانید مدل‌ها را بر اساس مشخصات ثبت‌شده کنار هم ببینید. نبود یک مشخصه به معنی نامشخص بودن آن داده است، نه برتری یا ضعف محصول.",
  },
] as const;

export const Route = createFileRoute("/faq")({
  head: () =>
    buildTrustPageHead({
      pathname: "/faq",
      title: "پرسش‌های متداول",
      description: "پاسخ‌های عمومی درباره اطلاعات محصول، موجودی و سیاست‌های قابل انتشار فروشگاه.",
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <ContentPage
      eyebrow="پشتیبانی"
      title="پرسش‌های متداول"
      intro="پاسخ‌های این صفحه عمداً از وعده‌های زمانی، گارانتی، مرجوعی یا پرداخت تأییدنشده خودداری می‌کنند."
    >
      <Accordion type="single" collapsible className="rounded-lg border border-border-subtle px-5">
        {FAQS.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`}>
            <AccordionTrigger className="min-h-11 text-right text-text-primary hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="leading-8 text-text-secondary">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ContentPage>
  );
}
