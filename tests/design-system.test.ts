import { describe, expect, test } from "bun:test";

import {
  cssVariableForToken,
  designTokenGroups,
  semanticColorTokens,
} from "../src/lib/ui/tokens";
import {
  isolateBidi,
  isBidiIsolated,
  joinBidiSegments,
  resolveLogicalSide,
} from "../src/lib/ui/bidi";

describe("design token registry", () => {
  test("contains unique semantic color roles", () => {
    expect(new Set(semanticColorTokens).size).toBe(semanticColorTokens.length);
  });

  test("covers required shared token groups", () => {
    expect(designTokenGroups.color).toContain("focus-ring");
    expect(designTokenGroups.color).toContain("skeleton-highlight");
    expect(designTokenGroups.typography).toContain("type-body-size");
    expect(designTokenGroups.motion).toContain("duration-normal");
    expect(designTokenGroups.layout).toContain("touch-target-min");
  });

  test("maps token names to CSS custom properties", () => {
    expect(cssVariableForToken("background-canvas")).toBe("--background-canvas");
    expect(cssVariableForToken("duration-fast")).toBe("--duration-fast");
  });
});

describe("bidi utilities", () => {
  test("resolves logical sides for both interface directions", () => {
    expect(resolveLogicalSide("start", "rtl")).toBe("right");
    expect(resolveLogicalSide("end", "rtl")).toBe("left");
    expect(resolveLogicalSide("start", "ltr")).toBe("left");
    expect(resolveLogicalSide("end", "ltr")).toBe("right");
  });

  test("isolates dynamic technical fragments", () => {
    const isolated = isolateBidi("T137.407.11.041.00");

    expect(isBidiIsolated(isolated)).toBe(true);
    expect(isolated).toContain("T137.407.11.041.00");
  });

  test("joins mixed segments without leaking direction", () => {
    const output = joinBidiSegments(["T137", 407, "11.041.00"], "-");

    expect(output.split("-")).toHaveLength(3);
    expect(output.split("-").every(isBidiIsolated)).toBe(true);
  });
});
