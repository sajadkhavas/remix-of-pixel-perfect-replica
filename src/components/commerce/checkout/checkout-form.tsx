import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  ChevronLeft,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  checkoutInputIsValid,
  normalizeCheckoutInput,
  validateCheckoutInput,
  type CheckoutCustomerInput,
  type CheckoutValidationErrors,
} from "@/lib/checkout";

const EMPTY_FORM: CheckoutCustomerInput = {
  recipientName: "",
  phone: "",
  email: "",
  province: "",
  city: "",
  postalCode: "",
  addressLine: "",
  customerNote: "",
  acceptedPurchaseTerms: false,
};

function Field({
  label,
  name,
  value,
  error,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  placeholder,
  maxLength,
  onChange,
}: {
  readonly label: string;
  readonly name: keyof CheckoutCustomerInput;
  readonly value: string;
  readonly error?: string;
  readonly type?: string;
  readonly required?: boolean;
  readonly autoComplete?: string;
  readonly inputMode?:
    | "text"
    | "email"
    | "tel"
    | "numeric";
  readonly placeholder?: string;
  readonly maxLength?: number;
  readonly onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  const id = `checkout-${String(name)}`;
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className="grid gap-2">
      <span className="text-xs font-medium text-[#AAA39A]">
        {label}
        {required ? (
          <span
            className="me-1 text-[#C9A84C]"
            aria-hidden="true"
          >
            *
          </span>
        ) : null}
      </span>

      <input
        id={id}
        name={String(name)}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : undefined
        }
        className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#090B0D] px-4 text-sm text-[#F0EDE8] outline-none transition-colors placeholder:text-[#5F5A54] focus:border-[#C9A84C]/45 focus-visible:ring-2 focus-visible:ring-[#C9A84C]/25 aria-[invalid=true]:border-red-400/50"
      />

      {error ? (
        <span
          id={errorId}
          className="text-[11px] text-red-300"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function CheckoutForm({
  onReview,
}: {
  readonly onReview: (
    input: CheckoutCustomerInput,
  ) => void;
}) {
  const [form, setForm] =
    useState<CheckoutCustomerInput>(EMPTY_FORM);
  const [errors, setErrors] =
    useState<CheckoutValidationErrors>({});
  const errorSummaryRef =
    useRef<HTMLDivElement>(null);

  const onTextChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.currentTarget;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const submit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const nextErrors =
      validateCheckoutInput(form);

    setErrors(nextErrors);

    if (!checkoutInputIsValid(nextErrors)) {
      window.requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    onReview(normalizeCheckoutInput(form));
  };

  const errorCount =
    Object.keys(errors).length;

  return (
    <form
      onSubmit={submit}
      className="rounded-[1.5rem] border border-white/[0.07] bg-[#0D0F11] p-5 sm:p-6"
      noValidate
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.07] text-[#D7BD77]">
          <span className="text-[11px] font-bold">
            ۱
          </span>
        </span>

        <div>
          <h2 className="text-lg font-semibold text-[#F0EDE8]">
            اطلاعات تحویل
          </h2>
          <p className="mt-1 text-xs text-[#77716A]">
            مشخصات گیرنده و نشانی سفارش را وارد
            کنید.
          </p>
        </div>
      </div>

      {errorCount > 0 ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-red-300"
              aria-hidden="true"
            />
            <p className="text-xs leading-6 text-red-200">
              لطفاً{" "}
              {errorCount.toLocaleString("fa-IR")} مورد
              مشخص‌شده را بررسی کنید.
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="نام و نام خانوادگی گیرنده"
          name="recipientName"
          value={form.recipientName}
          error={errors.recipientName}
          required
          autoComplete="name"
          maxLength={120}
          onChange={onTextChange}
        />

        <Field
          label="شماره موبایل"
          name="phone"
          value={form.phone}
          error={errors.phone}
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="09xxxxxxxxx"
          maxLength={16}
          onChange={onTextChange}
        />

        <Field
          label="ایمیل"
          name="email"
          value={form.email}
          error={errors.email}
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          onChange={onTextChange}
        />

        <Field
          label="استان"
          name="province"
          value={form.province}
          error={errors.province}
          required
          autoComplete="address-level1"
          maxLength={100}
          onChange={onTextChange}
        />

        <Field
          label="شهر"
          name="city"
          value={form.city}
          error={errors.city}
          required
          autoComplete="address-level2"
          maxLength={100}
          onChange={onTextChange}
        />

        <Field
          label="کد پستی"
          name="postalCode"
          value={form.postalCode}
          error={errors.postalCode}
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={10}
          onChange={onTextChange}
        />
      </div>

      <label
        htmlFor="checkout-addressLine"
        className="mt-4 grid gap-2"
      >
        <span className="text-xs font-medium text-[#AAA39A]">
          نشانی کامل
          <span
            className="me-1 text-[#C9A84C]"
            aria-hidden="true"
          >
            *
          </span>
        </span>

        <textarea
          id="checkout-addressLine"
          name="addressLine"
          value={form.addressLine}
          onChange={(event) => {
            const value = event.currentTarget.value;

            setForm((current) => ({
              ...current,
              addressLine: value,
            }));
            setErrors((current) => ({
              ...current,
              addressLine: undefined,
            }));
          }}
          rows={4}
          required
          maxLength={500}
          autoComplete="street-address"
          aria-invalid={Boolean(
            errors.addressLine,
          )}
          aria-describedby={
            errors.addressLine
              ? "checkout-addressLine-error"
              : undefined
          }
          className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#090B0D] px-4 py-3 text-sm leading-7 text-[#F0EDE8] outline-none transition-colors placeholder:text-[#5F5A54] focus:border-[#C9A84C]/45 focus-visible:ring-2 focus-visible:ring-[#C9A84C]/25 aria-[invalid=true]:border-red-400/50"
        />

        {errors.addressLine ? (
          <span
            id="checkout-addressLine-error"
            className="text-[11px] text-red-300"
          >
            {errors.addressLine}
          </span>
        ) : null}
      </label>

      <label
        htmlFor="checkout-customerNote"
        className="mt-4 grid gap-2"
      >
        <span className="text-xs font-medium text-[#AAA39A]">
          توضیحات سفارش
        </span>

        <textarea
          id="checkout-customerNote"
          name="customerNote"
          value={form.customerNote}
          onChange={(event) => {
            const value = event.currentTarget.value;

            setForm((current) => ({
              ...current,
              customerNote: value,
            }));
            setErrors((current) => ({
              ...current,
              customerNote: undefined,
            }));
          }}
          rows={3}
          maxLength={500}
          aria-invalid={Boolean(
            errors.customerNote,
          )}
          aria-describedby={
            errors.customerNote
              ? "checkout-customerNote-error"
              : undefined
          }
          placeholder="در صورت نیاز توضیحی برای سفارش بنویسید."
          className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#090B0D] px-4 py-3 text-sm leading-7 text-[#F0EDE8] outline-none transition-colors placeholder:text-[#5F5A54] focus:border-[#C9A84C]/45 focus-visible:ring-2 focus-visible:ring-[#C9A84C]/25 aria-[invalid=true]:border-red-400/50"
        />

        {errors.customerNote ? (
          <span
            id="checkout-customerNote-error"
            className="text-[11px] text-red-300"
          >
            {errors.customerNote}
          </span>
        ) : null}
      </label>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
        <input
          type="checkbox"
          checked={form.acceptedPurchaseTerms}
          onChange={(event) => {
            const checked =
              event.currentTarget.checked;

            setForm((current) => ({
              ...current,
              acceptedPurchaseTerms: checked,
            }));
            setErrors((current) => ({
              ...current,
              acceptedPurchaseTerms: undefined,
            }));
          }}
          aria-invalid={Boolean(
            errors.acceptedPurchaseTerms,
          )}
          aria-describedby={
            errors.acceptedPurchaseTerms
              ? "checkout-terms-error"
              : undefined
          }
          className="mt-0.5 size-4 accent-[#C9A84C]"
        />

        <span className="text-xs leading-6 text-[#9A938A]">
          <span>
            شرایط خرید را مطالعه کرده‌ام و می‌پذیرم.{" "}
          </span>
          <Link
            to="/purchase-terms"
            className="font-semibold text-[#D3B96F] hover:text-[#E0C67D]"
          >
            مشاهده شرایط خرید
          </Link>
        </span>
      </label>

      {errors.acceptedPurchaseTerms ? (
        <p
          id="checkout-terms-error"
          className="mt-2 text-[11px] text-red-300"
        >
          {errors.acceptedPurchaseTerms}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-5 text-sm font-semibold text-[#090A0C] transition-colors hover:bg-[#DFC36E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
      >
        <Check className="size-4" aria-hidden="true" />
        بررسی سفارش
        <ChevronLeft
          className="size-4"
          aria-hidden="true"
        />
      </button>
    </form>
  );
}
