import { z } from "zod";

export const STORE_SETTING_ENVIRONMENTS = ["development", "staging", "production"] as const;

export const CLAIM_STATUSES = [
  "confirmed",
  "requires-client-confirmation",
  "hidden-until-configured",
  "prohibited",
] as const;

export const SUPPORTED_STORE_CURRENCIES = ["IRR", "USD", "EUR", "AED", "GBP"] as const;

export const PAYMENT_PROVIDER_ALLOWLIST = [
  "zarinpal",
  "idpay",
  "nextpay",
  "saman",
  "mellat",
  "parsian",
  "pasargad",
  "shaparak",
  "cash-on-delivery",
  "bank-transfer",
] as const;

export const ENAMAD_PROVIDER_ALLOWLIST = ["enamad"] as const;

export const trimString = (minimum = 1, maximum = 240) =>
  z.string().trim().min(minimum).max(maximum);

export const isoDateTimeSchema = z.string().datetime({ offset: true });
export const localeSchema = z.string().regex(/^[a-z]{2,3}(?:-[A-Z]{2})?$/, "Invalid locale code");
export const countryCodeSchema = z.string().regex(/^[A-Z]{2}$/, "Country code must be ISO alpha-2");
export const relativePathSchema = z
  .string()
  .trim()
  .regex(/^\/(?!\/)[^\s]*$/, "Expected a root-relative public path");
export const hostnameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/,
    "Expected a hostname without protocol or path",
  );

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export const httpUrlSchema = z.string().url().refine(isHttpUrl, "Only HTTP(S) URLs are allowed");
export const httpsUrlSchema = z.string().url().refine(isHttpsUrl, "Only HTTPS URLs are allowed");
export const publicAssetSourceSchema = z
  .string()
  .trim()
  .refine((value) => /^\/(?!\/)[^\s]*$/.test(value) || isHttpsUrl(value), {
    message: "Asset source must be a root-relative path or HTTPS URL",
  });

export const PublicAssetReferenceSchema = z
  .object({
    src: publicAssetSourceSchema,
    alt: trimString(1, 180),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  })
  .strict();
