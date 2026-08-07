import { describe, expect, test } from "bun:test";

import { DEVELOPMENT_STORE_SETTINGS_FIXTURE } from "../../src/data/fixtures/store-settings";
import { buildTrustPageHead } from "../../src/content/trust/seo";

describe("F11 trust and legal content policy", () => {
  test("publishes trust and legal pages as noindex until approval", () => {
    const head = buildTrustPageHead({
      pathname: "/privacy",
      title: "حریم خصوصی",
      description: "وضعیت سند حریم خصوصی قابل انتشار کرونوس.",
    });

    expect(head.meta).toContainEqual({ name: "robots", content: "noindex,follow" });
    expect(head.links).toContainEqual({
      rel: "canonical",
      href: "http://localhost:3000/privacy",
    });
  });

  test("development configuration has no public commercial promises", () => {
    const settings = DEVELOPMENT_STORE_SETTINGS_FIXTURE;
    expect(settings.contact.phones).toHaveLength(0);
    expect(settings.contact.emails).toHaveLength(0);
    expect(settings.payment.methods).toHaveLength(0);
    expect(settings.shipping.enabled).toBe(false);
    expect(settings.returns.enabled).toBe(false);
    expect(settings.warranty.enabled).toBe(false);
    expect(settings.authenticity.enabled).toBe(false);
  });
});
