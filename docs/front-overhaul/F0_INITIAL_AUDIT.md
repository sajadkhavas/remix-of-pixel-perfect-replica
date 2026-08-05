# F0 Initial Production Foundation Audit

## Audit scope

- Repository: `sajadkhavas/remix-of-pixel-perfect-replica`
- Required baseline: `main@0ddb98cfd640a59ea2cc7687ee35478f9cf4f09c`
- Working branch: `phase/f0-production-foundation`
- Audit date: 2026-08-05
- Audit runner: Ubuntu 24.04 GitHub-hosted runner
- Toolchain used for reproducible checks: Node.js 22.16.0 and Bun 1.2.22

The branch was created directly from the required baseline. No previous `codex/*` branch was continued, and no merge was performed.

## Package installation and toolchain

### Findings

- `bun.lock` and `bunfig.toml` identify Bun as the repository's real package manager.
- The baseline did not declare `packageManager` or supported runtime versions in `package.json`.
- `bun install --frozen-lockfile` succeeded and installed 550 packages.
- The lockfile resolves several packages to newer patch releases than the minimum ranges in `package.json`; this is expected lockfile behavior and is reproducible with the frozen install.
- The baseline quality scripts were incomplete: no typecheck, format check, test, test-run, lint-fix, or aggregate quality command existed.

### Baseline result

- Frozen dependency install: **PASS**
- Package-manager identification: **Bun**
- Required runtime selected for CI: **Node.js 22.16.0 / Bun 1.2.22**

## Build, parser, imports, and TypeScript

### Blocking findings

1. `src/components/sections/HeroSection.tsx` referenced React hooks without importing them.
2. The Hero referenced `gsap` without importing the project's SSR-aware GSAP module.
3. The Hero used `activeIdx` and its setter without defining the state.
4. The Hero declared state that was not connected to stable rendering behavior.
5. The heading ref used for animation was not attached to the animated DOM subtree.
6. The Hero animation had no scoped GSAP cleanup.
7. The typewriter could initialize differently during server render and first client render.
8. Autoplay and continuously repeating effects did not honor reduced-motion preference.
9. `src/components/sections/CategoriesSection.tsx` contained an unclosed JSX element. This was a direct parser blocker affecting lint, typecheck, and production build.
10. The category heading animation had no scoped GSAP cleanup.

The `CategoriesSection.tsx` correction was the only edit outside the ordinary F0 ownership list. It was necessary because the syntax error prevented the requested build and TypeScript gates from running. No category design, copy, route contract, or product data was changed.

### Baseline result

- TypeScript: **FAIL** due to JSX parse failure
- Production build: **FAIL** due to JSX parse failure
- Import integrity: **FAIL** in Hero due to missing hooks and GSAP imports

### Result after build fixes

- TypeScript: **PASS**
- Client production bundle: **PASS**
- SSR production bundle: **PASS**
- Hero GSAP lifecycle: scoped through `gsap.context()` with `context.revert()` cleanup
- Hero hydration: client-only typewriter activation occurs after mount
- Reduced motion: disables autoplay and continuous decorative motion at the component level
- Timers/listeners: no unmanaged interval, timeout, or event listener remains in the Hero

## SSR, hydration, and browser-only behavior

### Findings

- The shared `src/lib/gsap.ts` module registers browser plugins only when `window` exists, which is suitable for SSR imports.
- `src/routes/__root.tsx` creates Lenis inside `useEffect`, attaches one GSAP ticker callback, removes that callback during cleanup, and destroys Lenis. No duplicate root initialization was found in the audited baseline.
- `src/server.ts` wraps the TanStack request handler and returns a fallback error document on an unhandled server exception.
- The baseline did not contain automated coverage for the server fallback document.
- The Hero's original typewriter initialization presented a probable hydration-stability risk because it relied immediately on browser behavior.

### Corrections

- Hero animation and typewriter behavior are now guarded for mount state and reduced motion.
- A Bun smoke test now validates that the server fallback is a complete recovery document and does not emit unresolved template placeholders.

## Route tree and routing configuration

- `src/routeTree.gen.ts` is a generated file and is excluded from lint and formatting gates.
- It was not edited manually.
- The generated route tree was accepted by TypeScript and both production build targets after the parser blockers were repaired.
- No commercial route architecture was changed in F0.

## ESLint and formatting

### Baseline ESLint findings

- ESLint executed Prettier through `eslint-plugin-prettier`, mixing code-quality diagnostics with repository-wide formatting debt.
- `@typescript-eslint/no-unused-vars` was disabled.
- The initial lint reported 120 findings: 112 errors, overwhelmingly formatting-related, and 8 warnings.
- Generated output exclusions were incomplete for a production quality gate.

### Baseline formatting findings

- A repository-wide Prettier check reported legacy formatting debt in 22 files.
- Most of those files are owned by later UI or feature phases and were explicitly outside F0 scope.
- Reformatting all of them in F0 would create broad, conflict-prone diffs across concurrently owned files.

### Corrections

- ESLint and Prettier responsibilities are separated.
- TypeScript unused variables are reported with limited underscore conventions instead of being disabled.
- Explicit `any` is an error.
- React hook rules remain active.
- The generated route tree and build outputs have narrow exclusions.
- Console usage is warned in application TypeScript while infrastructure/test files have a documented exception.
- Formatting is enforced for files changed relative to the integration comparison base, including staged, unstaged, and untracked local files. This stops new formatting debt without rewriting unrelated baseline files.

### Current lint status

- Errors: **0**
- Warnings: **8**
- The warnings are pre-existing Fast Refresh/export-shape notices plus one stale narrow ESLint directive in files outside F0 ownership. They remain visible and are not hidden by a blanket disable.

## Testing

### Baseline

- No test files were discovered.
- The test gate failed because the project had no test suite.

### Correction

- Added `tests/server-error-page.smoke.test.ts`.
- The test exercises an actual production recovery path rather than an always-true assertion.
- Current result: **1 test passed, 0 failed, 6 expectations**.

## Vite, React, and TanStack compatibility observations

- React 19.2, Vite 8, TanStack Start, TanStack Router, and the Lovable TanStack Vite wrapper complete both client and SSR builds after the source blockers are fixed.
- TanStack package patch versions are not aligned: Router is on the 1.168 line while Start and the router plugin are on the 1.167 line. This is not currently a build blocker, but aligned upgrades should be evaluated together rather than independently.
- Vite 8 reports that `vite-tsconfig-paths` can be replaced with native `resolve.tsconfigPaths`. This was not changed in F0 because the current wrapper configuration builds successfully and a migration should be verified against generated routing and Lovable configuration behavior.
- The build reports a client entry chunk above 500 kB after minification. This is a performance warning, not a build failure, and should be addressed by feature-level code splitting after page ownership stabilizes.
- Outside Lovable's hosted context, its Nitro deploy plugin is intentionally skipped. The standard Vite client and SSR bundles still build successfully.

## CI and diagnostics observations

- The temporary baseline workflow demonstrated that GitHub-hosted execution is reproducible with frozen Bun installation.
- Repository artifact storage quota was exhausted, so uploading the diagnostic text artifact failed even when the useful job log had already been produced.
- The final workflow therefore keeps failure details in normal step logs and writes a GitHub job summary instead of depending on artifact storage.
- No quality-gate step uses `continue-on-error`.

## Initial console errors and warnings identifiable without browser redesign work

- Definite compile-time errors: missing Hero imports/state and unclosed category JSX.
- Definite build warnings: Vite native tsconfig-path migration suggestion and an oversized client chunk.
- Definite lint warnings: eight legacy warnings described above.
- No new runtime console statement was introduced to hide an error.
- Full browser console and hydration verification remains appropriate for the later browser/E2E phase; F0 establishes compile, SSR build, lint, test, and CI gates first.

## Final foundation status

The production foundation now has deterministic installation, meaningful linting, changed-file formatting enforcement, TypeScript validation, a real smoke test, production client/SSR builds, and a pull-request/push CI quality gate. Visual identity and commercial routes were not redesigned.
