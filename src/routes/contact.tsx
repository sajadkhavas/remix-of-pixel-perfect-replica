import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تماس با ما — KRONOS" },
      { name: "description", content: "راه‌های ارتباطی و فرم تماس با کرونوس." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  return (
    <>
      <PageHero eyebrow="تماس" title="با ما در ارتباط باشید" sub="کارشناسان ما در ۷ روز هفته آماده پاسخگویی به سوالات شما هستند." />
      <section className="py-12 px-5 sm:px-8" dir="rtl">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { Icon: Phone, k: "تلفن", v: "۰۲۱-۰۰۰۰۰۰۰۰" },
              { Icon: Mail, k: "ایمیل", v: "hello@kronos.shop" },
              { Icon: MapPin, k: "آدرس", v: "تهران، خیابان ولیعصر، پلاک ۱۲۳" },
            ].map(({ Icon, k, v }) => (
              <div key={k} className="border border-[#1E1E1E] p-5 flex items-start gap-4 bg-[#0c0c0c]">
                <div className="p-3 bg-[#C9A84C15] border border-[#C9A84C33]">
                  <Icon className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-xs text-[#8A8A8A] tracking-wider mb-1">{k}</div>
                  <div className="text-[#F0EDE8]">{v}</div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name || !form.email || !form.message) return toast.error("همه فیلدها را پر کنید");
              toast.success("پیام شما ارسال شد ✓");
              setForm({ name: "", email: "", message: "" });
            }}
            className="border border-[#1E1E1E] p-6 bg-[#0c0c0c] space-y-4"
          >
            <Field label="نام شما" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="ایمیل" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <div>
              <label className="text-xs text-[#8A8A8A] tracking-wider mb-1.5 block">پیام</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full bg-[#080808] border border-[#1E1E1E] focus:border-[#C9A84C55] outline-none px-3 py-2.5 text-sm text-[#F0EDE8]"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-[#C9A84C] text-[#080808] font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#E8C96C] transition-colors">
              <Send className="w-4 h-4" /> ارسال پیام
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs text-[#8A8A8A] tracking-wider mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#080808] border border-[#1E1E1E] focus:border-[#C9A84C55] outline-none px-3 py-2.5 text-sm text-[#F0EDE8]"
      />
    </div>
  );
}
