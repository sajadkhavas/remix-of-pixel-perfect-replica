# F14A Asset Quality Gate

The gate consumes `public/assets/manifest.json` created by F3A and verifies repository bytes rather than trusting filenames.

## Checks

- schema and stable ID;
- repository path existence;
- byte-size and image-dimension agreement;
- source and license status;
- production approval;
- product/brand identity;
- duplicate binary hash;
- incompatible multi-identity or multi-role use;
- responsive variants and mobile crop;
- alt metadata;
- legacy heavy formats;
- oversized raster threshold;
- stricter release mode.

## Baseline policy

Temporary development assets may remain only as exact violations in `quality/asset-violation-baseline.json`. Normal CI blocks new violations. `bun run quality:assets:release` does not accept development debt: every release asset must be approved with source/license/identity and derivatives.

At Gate 1 all 11 raster assets are development-only, none has verified source/license, and repeated product identity usage remains release-blocking.
