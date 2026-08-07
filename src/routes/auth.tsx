import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "ورود / ثبت‌نام — KRONOS" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <>
      <PageHero
        eyebrow="حساب کاربری"
        title={mode === "login" ? "ورود به کرونوس" : "ساخت حساب کاربری"}
      />
      <section className="py-12 px-5" dir="rtl">
        <div className="container mx-auto max-w-md">
          <div className="border border-[#1E1E1E] bg-[#0c0c0c] p-6">
            <div className="flex border border-[#1E1E1E] mb-6">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 text-xs tracking-wider uppercase transition-colors ${
                    mode === m
                      ? "bg-[#C9A84C] text-[#080808]"
                      : "text-[#8A8A8A] hover:text-[#F0EDE8]"
                  }`}
                >
                  {m === "login" ? "ورود" : "ثبت‌نام"}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(mode === "login" ? "خوش آمدید ✓ (دمو)" : "حساب شما ساخته شد ✓ (دمو)");
              }}
              className="space-y-4"
            >
              {mode === "register" && <Input label="نام و نام خانوادگی" />}
              <Input label="ایمیل" type="email" />
              <Input label="رمز عبور" type="password" />
              <button
                type="submit"
                className="w-full py-3 bg-[#C9A84C] text-[#080808] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#E8C96C]"
              >
                {mode === "login" ? "ورود" : "ثبت‌نام"}
              </button>
            </form>
            <p className="text-[10px] text-[#4A4A4A] text-center mt-4 tracking-wider">
              این نسخه دمو است؛ ورود واقعی با فعال‌سازی Lovable Cloud قابل افزودن است.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-xs text-[#8A8A8A] tracking-wider mb-1.5 block">{label}</label>
      <input
        type={type}
        required
        className="w-full bg-[#080808] border border-[#1E1E1E] focus:border-[#C9A84C55] outline-none px-3 py-2.5 text-sm text-[#F0EDE8]"
      />
    </div>
  );
}
