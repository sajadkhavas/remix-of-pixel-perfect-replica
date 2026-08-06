import { readFile } from "node:fs/promises";
import {
  createSeoValidationReport,
  detectDuplicateCanonicals,
  validateSitemapCollection,
  validateStructuredData,
  type SeoValidationIssue,
  type SitemapCollection,
} from "../../src/seo";

interface SeoValidationManifest {
  readonly structuredData?: readonly unknown[];
  readonly canonicalEntries?: readonly Readonly<{ pathname: string; canonical: string }>[];
  readonly sitemaps?: readonly SitemapCollection[];
  readonly noindexUrls?: readonly string[];
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function malformedManifest(message: string): never {
  throw new Error(`Invalid SEO validation manifest: ${message}`);
}

function parseManifest(input: unknown): SeoValidationManifest {
  if (!isRecord(input)) malformedManifest("root must be an object");

  const structuredData = input.structuredData;
  if (structuredData !== undefined && !Array.isArray(structuredData)) {
    malformedManifest("structuredData must be an array");
  }

  const canonicalEntries = input.canonicalEntries;
  if (canonicalEntries !== undefined && !Array.isArray(canonicalEntries)) {
    malformedManifest("canonicalEntries must be an array");
  }
  if (
    Array.isArray(canonicalEntries) &&
    !canonicalEntries.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.pathname === "string" &&
        typeof entry.canonical === "string",
    )
  ) {
    malformedManifest("canonicalEntries require pathname and canonical strings");
  }

  const sitemaps = input.sitemaps;
  if (sitemaps !== undefined && !Array.isArray(sitemaps)) {
    malformedManifest("sitemaps must be an array");
  }
  if (
    Array.isArray(sitemaps) &&
    !sitemaps.every(
      (entry) => isRecord(entry) && typeof entry.group === "string" && Array.isArray(entry.entries),
    )
  ) {
    malformedManifest("sitemaps require group and entries");
  }

  const noindexUrls = input.noindexUrls;
  if (
    noindexUrls !== undefined &&
    (!Array.isArray(noindexUrls) || !noindexUrls.every((entry) => typeof entry === "string"))
  ) {
    malformedManifest("noindexUrls must be an array of strings");
  }

  return {
    structuredData: structuredData as readonly unknown[] | undefined,
    canonicalEntries: canonicalEntries as
      | readonly Readonly<{ pathname: string; canonical: string }>[]
      | undefined,
    sitemaps: sitemaps as readonly SitemapCollection[] | undefined,
    noindexUrls: noindexUrls as readonly string[] | undefined,
  };
}

export function validateSeoManifest(input: unknown) {
  const manifest = parseManifest(input);
  const groups: Array<readonly SeoValidationIssue[]> = [];

  for (const schema of manifest.structuredData ?? []) {
    groups.push(validateStructuredData(schema));
  }
  if (manifest.canonicalEntries) {
    groups.push(detectDuplicateCanonicals(manifest.canonicalEntries));
  }
  const noindexUrls = new Set(manifest.noindexUrls ?? []);
  for (const sitemap of manifest.sitemaps ?? []) {
    groups.push(validateSitemapCollection(sitemap, noindexUrls));
  }
  return createSeoValidationReport(groups);
}

async function main(): Promise<void> {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    throw new Error("Usage: bun scripts/seo/validate-infrastructure.ts <manifest.json>");
  }
  const raw = await readFile(manifestPath, "utf8");
  const report = validateSeoManifest(JSON.parse(raw) as unknown);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.valid) process.exitCode = 1;
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown SEO validation failure";
    process.stderr.write(`${JSON.stringify({ valid: false, fatal: message })}\n`);
    process.exitCode = 1;
  });
}
