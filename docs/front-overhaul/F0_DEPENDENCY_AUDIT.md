# F0 Dependency Audit

## Scope and method

This audit evaluates the dependency manifest, frozen Bun installation, source imports visible in the baseline, Vite build output, and the current frontend architecture. F0 removes a package only when its absence can be established with high confidence and the lockfile can remain reproducible. Broad UI-library cleanup is intentionally deferred where later phases still own the importing components.

## Package manager and reproducibility

- Real package manager: Bun
- Lockfile: `bun.lock`
- Verified install command: `bun install --frozen-lockfile`
- F0 toolchain declaration: `bun@1.2.22`, Node.js `>=22.12.0 <23`
- Frozen install result: successful

## Confirmed production dependency groups

### Core runtime and routing

- `react`, `react-dom`
- `@tanstack/react-start`
- `@tanstack/react-router`
- `@tanstack/react-query`

These packages form the active application, router, SSR, and query runtime.

### Build and styling runtime

- `@tailwindcss/vite`, `tailwindcss`, `tw-animate-css`
- `vite-tsconfig-paths`
- `@fontsource-variable/vazirmatn`
- `@fontsource/playfair-display`
- `@fontsource/dm-mono`

The fonts and Tailwind stack are active. `vite-tsconfig-paths` is currently loaded by the build path, although Vite 8 recommends migration to its native path-resolution option.

### Motion and presentation

- `gsap`
- `@studio-freight/lenis`
- `framer-motion`
- `swiper`
- `typewriter-effect`
- `lucide-react`

These are used by current page and section implementations. The number of animation systems is architecturally significant and should be controlled by ownership conventions in later phases.

### Form, validation, and UI primitives

- `react-hook-form`
- `@hookform/resolvers`
- `zod`
- Radix UI packages
- `class-variance-authority`, `clsx`, `tailwind-merge`
- `cmdk`, `input-otp`, `sonner`, `vaul`

These support the generated/shared UI layer. F0 does not remove individual primitives because a package may be imported through a component that is not rendered by the current homepage but remains part of the intended application surface.

## Development dependencies

### Correctly development-only

- `typescript`
- `typescript-eslint`
- `eslint`
- `@eslint/js`
- `eslint-config-prettier`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `prettier`
- React and Node type packages
- `@vitejs/plugin-react`
- `vite`
- `nitro`
- `@lovable.dev/vite-tanstack-config`

### Dev dependency no longer required by the active ESLint configuration

- `eslint-plugin-prettier`

F0 separated formatting from linting, so this plugin is no longer imported by `eslint.config.js`. It remains in the lockfile in this phase to avoid an isolated lockfile rewrite through a different Bun release path during concurrent work. It is a high-confidence removal candidate for the next dependency-normalization commit, provided `bun remove --dev eslint-plugin-prettier` is run with Bun 1.2.22 and all quality gates are repeated.

## Overlapping capability groups

### Carousel and slider libraries

- `swiper`
- `embla-carousel-react`

Both provide carousel behavior. Swiper is confirmed in the Hero. Embla is commonly present through generated carousel primitives. Later phases should standardize which library owns product galleries, editorial carousels, and the homepage to avoid duplicate runtime cost and inconsistent accessibility behavior.

### Animation and interaction libraries

- `gsap`
- `framer-motion`
- `react-parallax`
- `vanilla-tilt`
- `@studio-freight/lenis`

These packages do not perform identical jobs, but their responsibilities overlap enough to create duplicate animation loops, lifecycle cleanup risk, and larger bundles. F0 establishes safe lifecycle handling in the audited Hero and verifies the existing single Lenis root initialization. A later architecture decision should define which tool is permitted for route transitions, scroll-linked effects, component micro-interactions, and pointer tilt.

### Particles

- `@tsparticles/engine`
- `@tsparticles/react`
- `@tsparticles/slim`

This three-package set is expected for a modular tsParticles integration, but it is relatively expensive for decorative behavior. Keep only when the owning visual phase confirms a visible, accessible, and performance-budgeted use case.

### Data visualization

- `recharts`

Recharts can add meaningful bundle weight. No removal is made because UI primitives or future account/dashboard surfaces may own it. The phase that owns data visualization should confirm an actual route-level requirement before it remains in the production dependency set.

## Version alignment risks

### TanStack patch-line drift

- `@tanstack/react-router`: 1.168 line
- `@tanstack/react-start`: 1.167 line
- `@tanstack/router-plugin`: 1.167 line

The current combination passes TypeScript and production client/SSR builds. Nevertheless, these packages should be upgraded and locked as a tested group because generated route types and Start/plugin behavior are tightly coupled.

### React 19 compatibility

The frozen dependency graph resolves React and React DOM on the same 19.2 patch line, and the application builds successfully. Any future package removal or upgrade must retain matching React/React DOM versions and repeat SSR/hydration verification.

### Vite path resolution

Vite 8 emits a migration recommendation for `vite-tsconfig-paths`. A safe cleanup path is:

1. Confirm the Lovable Vite wrapper forwards `resolve.tsconfigPaths` correctly.
2. Enable the native option.
3. Remove the plugin from runtime dependencies.
4. Repeat route generation, TypeScript, client build, and SSR build.

This change is not required to restore the current production foundation and is therefore deferred.

## Potentially heavy production packages

The production build reports a client entry chunk over 500 kB. Likely contributors include the aggregate animation, carousel, particle, charting, UI, and route dependencies. The warning should be addressed with route/section code splitting and import-level analysis rather than by arbitrarily raising the warning threshold.

Candidates for focused bundle analysis:

- `framer-motion`
- `gsap`
- `swiper`
- `@tsparticles/*`
- `recharts`
- broad Radix primitive inventory

## Dependencies in the wrong section

No package was moved between `dependencies` and `devDependencies` in F0 because the current build-time/runtime boundary is valid for the confirmed packages. Build tooling and type/lint tooling are already development dependencies. Browser-imported libraries remain production dependencies.

## Removed in F0

None.

No dependency was removed merely because a repository-wide code search did not immediately expose a direct import. Generated UI components, lazy routes, and future phase ownership make that insufficient evidence for safe deletion.

## Added in F0

None.

The Smoke test uses Bun's built-in test runner, avoiding a new test framework dependency.

## Recommended follow-up decisions

1. Remove `eslint-plugin-prettier` with Bun 1.2.22 and update the lockfile after integration sequencing is agreed.
2. Align the TanStack Start, Router, and router-plugin patch lines in one verified change.
3. Choose a primary carousel implementation for product and editorial experiences.
4. Define animation ownership among GSAP, Framer Motion, Lenis, parallax, and tilt utilities.
5. Confirm visible requirements for tsParticles and Recharts before production launch.
6. Evaluate Vite native tsconfig path resolution and remove `vite-tsconfig-paths` only after wrapper compatibility is proven.
7. Add bundle analysis and route-level code splitting in the performance phase instead of suppressing the 500 kB warning.
