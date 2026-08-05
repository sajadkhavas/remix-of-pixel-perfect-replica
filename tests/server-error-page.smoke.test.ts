import { describe, expect, test } from "bun:test";
import { renderErrorPage } from "../src/lib/error-page";

describe("server error page smoke test", () => {
  test("renders a complete recovery document without template placeholders", () => {
    const html = renderErrorPage();

    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('<meta name="viewport"');
    expect(html).toContain("Try again");
    expect(html).toContain('href="/"');
    expect(html).toContain("</html>");
    expect(html).not.toMatch(/\{\{[^}]+\}\}|undefined|null/);
  });
});
