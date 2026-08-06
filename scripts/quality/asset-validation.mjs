import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { enforceBaseline, isCli, lineColumn, shortHash } from "./common.mjs";

export const ASSET_MAX_BYTES = 300_000;
export function isOversizedAsset(bytes, limit = ASSET_MAX_BYTES) {
  return bytes > limit;
}

function jpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (
      [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
        marker,
      )
    ) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

export function imageDimensions(buffer, format) {
  if (format === "png" && buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if ((format === "jpeg" || format === "jpg") && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return jpegDimensions(buffer);
  }
  return null;
}

function violation(manifestText, asset, rule, detail) {
  const needle = `"id": "${asset.id}"`;
  const index = Math.max(0, manifestText.indexOf(needle));
  return {
    file: "public/assets/manifest.json",
    ...lineColumn(manifestText, index),
    rule,
    assetId: asset.id ?? "missing-id",
    assetPath: asset.path ?? null,
    detail,
    excerptHash: shortHash(`${asset.id ?? "missing"}:${asset.path ?? "missing"}:${rule}:${detail}`),
    owner: asset.owner ?? "F3A/F5",
    reason: detail,
    removalCondition: "Supply verified asset metadata and approved responsive production derivatives.",
    expiry: "2026-10-01",
  };
}

export function validateManifest(manifest, options = {}) {
  const manifestText = options.manifestText ?? JSON.stringify(manifest, null, 2);
  const root = options.root ?? process.cwd();
  const release = Boolean(options.release);
  const violations = [];
  const hashes = new Map();

  if (manifest.schemaVersion !== 1) {
    violations.push(
      violation(
        manifestText,
        { id: "manifest", owner: "F3A" },
        "invalid-schema-version",
        "Asset manifest schemaVersion must equal 1.",
      ),
    );
  }
  if (!Array.isArray(manifest.assets)) {
    return [
      violation(
        manifestText,
        { id: "manifest", owner: "F3A" },
        "assets-not-array",
        "Asset manifest assets must be an array.",
      ),
    ];
  }

  for (const asset of manifest.assets) {
    if (!asset.id) violations.push(violation(manifestText, asset, "missing-id", "Asset requires a stable ID."));
    if (!asset.path) {
      violations.push(violation(manifestText, asset, "missing-path", "Asset requires a repository path."));
      continue;
    }
    if (!asset.source) violations.push(violation(manifestText, asset, "missing-source", "Asset source is not recorded."));
    if (!asset.licenseStatus || asset.licenseStatus === "unverified") {
      violations.push(violation(manifestText, asset, "unverified-license", "Asset license is unverified."));
    }
    if (!asset.identity) violations.push(violation(manifestText, asset, "missing-identity", "Asset has no verified product/brand identity."));
    if (!asset.alt) violations.push(violation(manifestText, asset, "missing-alt-metadata", "Asset has no approved alt metadata."));
    if (!Array.isArray(asset.responsiveVariants) || asset.responsiveVariants.length === 0) {
      violations.push(violation(manifestText, asset, "missing-responsive-variants", "Asset has no responsive derivative list."));
    }
    if (/hero|category/i.test(asset.usage ?? "") && !asset.mobileCrop) {
      violations.push(violation(manifestText, asset, "missing-mobile-crop", "Hero/category use requires a dedicated mobile crop."));
    }
    if (asset.format === "png" && /hero|category/i.test(asset.usage ?? "")) {
      violations.push(violation(manifestText, asset, "legacy-heavy-format", "Hero/category raster remains PNG rather than approved AVIF/WebP."));
    }
    if ((asset.usage ?? "").includes("+") || (asset.usage ?? "").includes(";")) {
      violations.push(violation(manifestText, asset, "multi-identity-or-role-usage", "One file is assigned to multiple product identities or incompatible roles."));
    }
    if (asset.productionApproved !== true) {
      violations.push(violation(manifestText, asset, "not-production-approved", "Asset remains development-only."));
    }
    if (release && asset.productionApproved !== true) {
      violations.push(violation(manifestText, asset, "release-blocked-asset", "Release mode forbids an unapproved asset."));
    }

    const absolute = path.resolve(root, asset.path);
    if (!existsSync(absolute)) {
      violations.push(violation(manifestText, asset, "missing-file", "Manifest path does not exist."));
      continue;
    }
    const buffer = readFileSync(absolute);
    const bytes = statSync(absolute).size;
    if (asset.bytes !== bytes) {
      violations.push(violation(manifestText, asset, "byte-size-mismatch", `Manifest bytes=${asset.bytes}; actual=${bytes}.`));
    }
    if (isOversizedAsset(bytes)) {
      violations.push(violation(manifestText, asset, "oversized-raster", `Asset is ${bytes} bytes; optimization review required.`));
    }
    const dimensions = imageDimensions(buffer, asset.format);
    if (!dimensions) {
      violations.push(violation(manifestText, asset, "unreadable-dimensions", "Image dimensions could not be verified from the file header."));
    } else if (dimensions.width !== asset.width || dimensions.height !== asset.height) {
      violations.push(violation(manifestText, asset, "dimension-mismatch", `Manifest=${asset.width}x${asset.height}; actual=${dimensions.width}x${dimensions.height}.`));
    }
    const hash = createHash("sha256").update(buffer).digest("hex");
    if (hashes.has(hash)) {
      violations.push(violation(manifestText, asset, "duplicate-content-hash", `Binary duplicates ${hashes.get(hash)}.`));
    } else {
      hashes.set(hash, asset.path);
    }
  }
  return violations;
}

if (isCli(import.meta.url)) {
  const manifestText = readFileSync(path.resolve("public/assets/manifest.json"), "utf8");
  const current = validateManifest(JSON.parse(manifestText), {
    manifestText,
    root: process.cwd(),
    release: process.argv.includes("--release"),
  });
  enforceBaseline({
    current,
    baselinePath: "quality/asset-violation-baseline.json",
    property: "violations",
    write: process.argv.includes("--write-baseline"),
    label: process.argv.includes("--release") ? "Release asset validation" : "Asset validation",
  });
}
