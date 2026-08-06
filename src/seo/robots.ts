import type { SeoEnvironment } from "../data/contracts/seo";
import { absoluteUrl, resolveSiteOrigin } from "./site-url";

export interface RobotsPolicyInput {
  readonly environment: SeoEnvironment;
  readonly siteUrl?: string;
  readonly sitemapPathname?: string;
}

export interface RobotsPolicy {
  readonly indexableEnvironment: boolean;
  readonly lines: readonly string[];
  readonly text: string;
  readonly sitemapUrl?: string;
  readonly reason: string;
}

export function buildRobotsPolicy(input: RobotsPolicyInput): RobotsPolicy {
  if (input.environment !== "production") {
    const lines = ["User-agent: *", "Disallow: /"];
    return {
      indexableEnvironment: false,
      lines,
      text: `${lines.join("\n")}\n`,
      reason: `${input.environment}-blocked-by-default`,
    };
  }

  const origin = resolveSiteOrigin(input);
  const sitemapUrl = absoluteUrl(origin, input.sitemapPathname ?? "/sitemap.xml");
  const lines = ["User-agent: *", "Allow: /", `Sitemap: ${sitemapUrl}`];
  return {
    indexableEnvironment: true,
    lines,
    text: `${lines.join("\n")}\n`,
    sitemapUrl,
    reason: "production-with-explicit-site-url",
  };
}
