# F14A Bundle and Performance Baseline

The executable gate measures emitted production files after `bun run build`. It does not infer Lighthouse scores or Core Web Vitals.

| Metric               |     Current |  Hard limit |             Future target |
| -------------------- | ----------: | ----------: | ------------------------: |
| Client JS total      |   827,737 B |   850,000 B |                 650,000 B |
| Largest client chunk |   576,551 B |   590,000 B |                 350,000 B |
| CSS total            |    97,878 B |   105,000 B |                  85,000 B |
| Server JS            |   179,076 B |   190,000 B |                 160,000 B |
| Images               | 1,680,909 B | 1,720,000 B |                 950,000 B |
| Fonts emitted        |         0 B |   100,000 B |                  80,000 B |
| Client JS chunks     |          29 |          31 |                        35 |
| Images emitted       |          11 |          11 | 20 responsive derivatives |
| Largest image        |   673,220 B |   690,000 B |                 250,000 B |

The hard gate passes the measured prototype with a narrow margin; it is not presented as the performance goal. One entry chunk remains above Vite's 500 kB warning threshold and three PNG assets dominate image bytes.

No field data, RUM, Lighthouse run, or Core Web Vitals measurement exists. F14B owns production-like Lighthouse and lab/field correlation.
