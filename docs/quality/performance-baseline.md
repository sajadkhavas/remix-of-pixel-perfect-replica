# F14A Bundle and Performance Baseline

## Measured Gate 1 build

The baseline comes from successful GitHub Actions run `31072592630`, not an estimate from source code.

| Metric | Baseline | Hard limit | Future target |
| --- | ---: | ---: | ---: |
| Client JavaScript total | 827,600 B | 850,000 B | 650,000 B |
| Largest client chunk | 576,550 B | 590,000 B | 350,000 B |
| CSS total | 97,860 B | 105,000 B | 85,000 B |
| Server JavaScript | 178,910 B | 190,000 B | 160,000 B |
| Images | 1,680,860 B | 1,720,000 B | 950,000 B |
| Fonts emitted | 0 B | 100,000 B | 80,000 B |
| Client JS chunks | 29 | 31 | 35 |
| Images emitted | 11 | 11 | 20 responsive derivatives |
| Largest image | 673,220 B | 690,000 B | 250,000 B |

The hard gate leaves only a small margin over the measured prototype. Targets are tracked separately so that a permissive hard limit is not presented as a performance goal.

## Known risks

- One entry chunk is already above Vite's 500 kB warning threshold.
- Three PNG assets dominate image weight.
- Current image count is low because the same unverified files are reused across products and roles; a correct responsive media set may increase file count while reducing bytes delivered per viewport.
- No field data, RUM, Lighthouse run, or Core Web Vitals measurement exists.
- F14B owns production-like Lighthouse and lab/field correlation.

## Gate

`bun run build && bun run quality:performance` measures emitted files, writes `quality/performance-current.json`, and fails any hard-limit regression.
