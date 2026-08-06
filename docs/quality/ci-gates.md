# F14A Frontend CI Gates

## Blocking workflow

`.github/workflows/frontend-quality.yml` runs on pull requests and pushes to `main`, `integration/**`, and `phase/**`. It needs no external secret and uses read-only repository permissions.

### Static quality job

1. frozen Bun install;
2. format check against the PR base or `integration/front-200` merge base;
3. exact lint-warning governance;
4. TypeScript typecheck;
5. Bun unit tests;
6. Bun contract tests;
7. forbidden production-copy scanner;
8. link-integrity scanner;
9. asset validation;
10. quality-summary freshness;
11. production build;
12. emitted bundle/performance budget.

### Browser quality matrix

- route smoke and hydration/console safety;
- accessibility and controlled axe fixtures;
- reduced-motion regression;
- keyboard and focus behavior.

All projects use Chromium in automated CI, Persian locale, fixed timezone, deterministic port, retries in CI, trace on first retry, screenshot on failure, and video retained on failure. Firefox, WebKit/Safari approximation, Edge-compatible Chromium, Android, and iOS profiles remain mandatory in manual QA.

## Failure behavior

- No quality step uses `continue-on-error`.
- No scanner uses wildcard allowlists or broad ignores.
- No test command is followed by `|| true`.
- The aggregate `quality-gate` job fails unless both static and browser jobs succeed.
- On browser failure, Playwright report, trace, screenshots, and retained failure video are uploaded for seven days.
- Concurrency cancels superseded runs on the same ref while preserving the newest result.

## Dependency and cache policy

- Bun version is pinned to 1.2.22 and installation uses `--frozen-lockfile`.
- Browser dependencies are dev-only.
- Bun and Playwright caches are keyed by `bun.lock`.
- Browser tests do not call an external service, payment provider, analytics service, or secret-backed API.
