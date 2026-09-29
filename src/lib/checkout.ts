import type { Cart } from "@/domain/commerce";
import {
  isPurchasableVariant,
  type Product,
  type ProductVariant,
} from "@/domain/product";
import type { Money } from "@/domain/shared";

export interface CheckoutCustomerInput {
  readonly recipientName: string;
  readonly phone: string;
  readonly email: string;
  readonly province: string;
  readonly city: string;
  readonly postalCode: string;
  readonly addressLine: string;
  readonly customerNote: string;
  readonly acceptedPurchaseTerms: boolean;
}

export interface CheckoutValidationErrors {
  readonly recipientName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly province?: string;
  readonly city?: string;
  readonly postalCode?: string;
  readonly addressLine?: string;
  readonly customerNote?: string;
  readonly acceptedPurchaseTerms?: string;
}

export type CheckoutCartIssueCode =
  | "missing-product"
  | "missing-variant"
  | "inactive-product"
  | "unavailable-variant"
  | "price-changed"
  | "quantity-invalid";

export interface CheckoutCartIssue {
  readonly lineId: string;
  readonly code: CheckoutCartIssueCode;
}

const PHONE_PATTERN = /^09\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_PATTERN = /^\d{10}$/;

const digitsOnly = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)),
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)),
    )
    .replace(/\D/g, "");

function normalizePhone(value: string): string {
  const digits = digitsOnly(value);

  if (digits.startsWith("0098")) {
    return `0${digits.slice(4)}`;
  }

  if (digits.startsWith("98")) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith("9")) {
    return `0${digits}`;
  }

  return digits;
}

export function normalizeCheckoutInput(
  input: CheckoutCustomerInput,
): CheckoutCustomerInput {
  return {
    recipientName: input.recipientName
      .trim()
      .replace(/\s+/g, " "),
    phone: normalizePhone(input.phone),
    email: input.email.trim().toLowerCase(),
    province: input.province
      .trim()
      .replace(/\s+/g, " "),
    city: input.city.trim().replace(/\s+/g, " "),
    postalCode: digitsOnly(input.postalCode),
    addressLine: input.addressLine
      .trim()
      .replace(/\s+/g, " "),
    customerNote: input.customerNote
      .trim()
      .replace(/\s+/g, " "),
    acceptedPurchaseTerms:
      input.acceptedPurchaseTerms,
  };
}

export function validateCheckoutInput(
  raw: CheckoutCustomerInput,
): CheckoutValidationErrors {
  const input = normalizeCheckoutInput(raw);
  const errors: Record<string, string> = {};

  if (
    input.recipientName.length < 3 ||
    input.recipientName.length > 120
  ) {
    errors.recipientName =
      "نام گیرنده را کامل وارد کنید.";
  }

  if (!PHONE_PATTERN.test(input.phone)) {
    errors.phone =
      "شماره موبایل معتبر وارد کنید.";
  }

  if (
    input.email &&
    (input.email.length > 254 ||
      !EMAIL_PATTERN.test(input.email))
  ) {
    errors.email = "ایمیل معتبر وارد کنید.";
  }

  if (
    input.province.length < 2 ||
    input.province.length > 100
  ) {
    errors.province = "استان را وارد کنید.";
  }

  if (
    input.city.length < 2 ||
    input.city.length > 100
  ) {
    errors.city = "شهر را وارد کنید.";
  }

  if (
    input.postalCode &&
    !POSTAL_PATTERN.test(input.postalCode)
  ) {
    errors.postalCode =
      "کد پستی باید ۱۰ رقم باشد.";
  }

  if (
    input.addressLine.length < 10 ||
    input.addressLine.length > 500
  ) {
    errors.addressLine =
      "نشانی کامل را وارد کنید.";
  }

  if (input.customerNote.length > 500) {
    errors.customerNote =
      "توضیحات سفارش نباید بیشتر از ۵۰۰ نویسه باشد.";
  }

  if (!input.acceptedPurchaseTerms) {
    errors.acceptedPurchaseTerms =
      "برای ادامه، شرایط خرید را تأیید کنید.";
  }

  return errors;
}

export function checkoutInputIsValid(
  errors: CheckoutValidationErrors,
): boolean {
  return Object.keys(errors).length === 0;
}

function sameMoney(a: Money, b: Money): boolean {
  return (
    a.amountMinor === b.amountMinor &&
    a.currency === b.currency &&
    a.fractionDigits === b.fractionDigits
  );
}

function quantityFitsVariant(
  quantity: number,
  variant: ProductVariant,
): boolean {
  const { inventory } = variant;
  const min = inventory.minOrderQuantity;
  const step = inventory.orderIncrement;

  if (
    !Number.isSafeInteger(quantity) ||
    !Number.isSafeInteger(min) ||
    !Number.isSafeInteger(step) ||
    quantity < min ||
    min < 1 ||
    step < 1
  ) {
    return false;
  }

  if ((quantity - min) % step !== 0) {
    return false;
  }

  if (
    inventory.maxOrderQuantity !== undefined &&
    quantity > inventory.maxOrderQuantity
  ) {
    return false;
  }

  if (
    inventory.tracking === "tracked" &&
    (inventory.status === "in-stock" ||
      inventory.status === "low-stock") &&
    inventory.availableQuantity !== undefined &&
    quantity > inventory.availableQuantity
  ) {
    return false;
  }

  return true;
}

export function validateCheckoutCart(
  cart: Cart,
  products: readonly Product[],
): readonly CheckoutCartIssue[] {
  const issues: CheckoutCartIssue[] = [];

  for (const line of cart.items) {
    const product = products.find(
      (item) => item.identity.id === line.productId,
    );

    if (!product) {
      issues.push({
        lineId: line.lineId,
        code: "missing-product",
      });
      continue;
    }

    const variant = product.variants.find(
      (item) => item.id === line.variantId,
    );

    if (
      !variant ||
      variant.productId !== product.identity.id
    ) {
      issues.push({
        lineId: line.lineId,
        code: "missing-variant",
      });
      continue;
    }

    if (product.status !== "active") {
      issues.push({
        lineId: line.lineId,
        code: "inactive-product",
      });
      continue;
    }

    if (!isPurchasableVariant(variant)) {
      issues.push({
        lineId: line.lineId,
        code: "unavailable-variant",
      });
      continue;
    }

    if (
      cart.currency !==
        variant.pricing.effectivePrice.currency ||
      !sameMoney(
        line.unitPriceSnapshot,
        variant.pricing.effectivePrice,
      )
    ) {
      issues.push({
        lineId: line.lineId,
        code: "price-changed",
      });
      continue;
    }

    if (
      !quantityFitsVariant(
        line.quantity,
        variant,
      )
    ) {
      issues.push({
        lineId: line.lineId,
        code: "quantity-invalid",
      });
    }
  }

  return issues;
}

export function checkoutCartIssueMessage(
  issue: CheckoutCartIssue,
): string {
  switch (issue.code) {
    case "missing-product":
      return "این محصول دیگر در فروشگاه در دسترس نیست.";
    case "missing-variant":
      return "مدل انتخاب‌شده دیگر در دسترس نیست.";
    case "inactive-product":
      return "این محصول برای خرید در دسترس نیست.";
    case "unavailable-variant":
      return "مدل انتخاب‌شده در حال حاضر قابل سفارش نیست.";
    case "price-changed":
      return "قیمت این محصول به‌روزرسانی شده است؛ آن را از سبد حذف و دوباره اضافه کنید.";
    case "quantity-invalid":
      return "تعداد انتخاب‌شده با شرایط فعلی محصول هماهنگ نیست.";
  }
}
