import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { spawnSync } from "node:child_process";

const file = "docs/front-overhaul/PHASE_REGISTRY.md";
const result = spawnSync(
  process.execPath,
  ["node_modules/prettier/bin/prettier.cjs", "--write", file],
  { stdio: "inherit" },
);
if (result.status !== 0) process.exit(result.status ?? 1);

const canonical = readFileSync(file);
console.log("F6_REGISTRY_GZIP_BASE64_BEGIN");
console.log(gzipSync(canonical, { level: 9 }).toString("base64"));
console.log("F6_REGISTRY_GZIP_BASE64_END");
