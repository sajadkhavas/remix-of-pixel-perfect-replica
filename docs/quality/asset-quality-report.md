# F14A Asset Quality Gate

**Current exact debt:** 83 violations across 11 raster manifest entries.

The gate consumes `public/assets/manifest.json` and verifies repository bytes rather than trusting filenames. It checks schema, stable ID, path, byte size, dimensions, source, license, production approval, identity, duplicate content hash, incompatible multi-role/identity use, responsive variants, mobile crop, alt metadata, format, and oversized raster threshold.

Temporary development assets may remain only as exact baseline violations. Normal CI blocks new violations. Release mode does not accept development debt: every release asset must be approved and have verified source/license/identity plus required derivatives.

At Gate 1, none of the 11 assets is production-approved or license/source verified. Repeated product identity usage and three heavy PNG hero/category files remain release-blocking.
