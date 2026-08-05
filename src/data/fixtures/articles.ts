import type { ContentSummary } from "../contracts";

export const FIXTURE_CONTENT: readonly ContentSummary[] = [
  {
    id: "article_fixture_heritage",
    slug: "how-watch-movements-differ",
    type: "article",
    title: "تفاوت موتورهای ساعت",
    excerpt: "مقاله کاملاً خیالی برای آزمون repository محتوایی.",
    publishedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "guide_fixture_case_size",
    slug: "choose-watch-case-size",
    type: "guide",
    title: "راهنمای انتخاب قطر قاب",
    excerpt: "راهنمای fixture برای مسیر /guides.",
    publishedAt: "2026-06-10T00:00:00Z",
  },
] as const;
