import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type BrowserDefect = {
  route: string;
  project: string;
  rule: string;
  selector: string;
  impact: string;
  owner: string;
  reason: string;
  removalCondition: string;
  expiry: string;
};

type DefectBaseline = {
  schemaVersion: number;
  baselineSha: string;
  defects: BrowserDefect[];
};

export function defectKey(defect: Pick<BrowserDefect, "route" | "project" | "rule" | "selector">) {
  return [defect.route, defect.project, defect.rule, defect.selector].join("::");
}

export function stableSelector(value: unknown) {
  const text = Array.isArray(value) ? value.join(" > ") : String(value ?? "document");
  return text.replace(/\s+/g, " ").slice(0, 500);
}

export function excerptHash(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function ownerForRoute(route: string) {
  if (route === "/" || route.startsWith("/services") || route.startsWith("/blog")) return "F8";
  if (route.startsWith("/shop")) return "F4";
  if (route.startsWith("/product")) return "F5";
  if (route.startsWith("/cart") || route.startsWith("/wishlist")) return "F6";
  if (route.startsWith("/auth")) return "F7";
  return "F9";
}

export function compareOrUpdateDefects(
  relativeFile: string,
  current: BrowserDefect[],
  route: string,
  project: string,
) {
  const filename = path.resolve(process.cwd(), relativeFile);
  const baseline = JSON.parse(readFileSync(filename, "utf8")) as DefectBaseline;
  const normalized = current
    .map((item) => ({ ...item, route, project }))
    .sort((a, b) => defectKey(a).localeCompare(defectKey(b)));

  if (process.env.UPDATE_QUALITY_BASELINES === "1") {
    const retained = baseline.defects.filter(
      (item) => !(item.route === route && item.project === project),
    );
    baseline.defects = [...retained, ...normalized].sort((a, b) =>
      defectKey(a).localeCompare(defectKey(b)),
    );
    writeFileSync(filename, `${JSON.stringify(baseline, null, 2)}\n`);
    return { newDefects: [], resolvedDefects: [] };
  }

  const allowed = new Map(baseline.defects.map((item) => [defectKey(item), item]));
  const now = new Map(normalized.map((item) => [defectKey(item), item]));
  const newDefects = normalized.filter((item) => !allowed.has(defectKey(item)));
  const resolvedDefects = baseline.defects.filter(
    (item) => item.route === route && item.project === project && !now.has(defectKey(item)),
  );
  return { newDefects, resolvedDefects };
}
