import { spawnSync } from "node:child_process";

const SUPPORTED_FILE = /\.(?:[cm]?[jt]sx?|jsonc?|mdx?|ya?ml|css|scss|html)$/i;
const EXCLUDED_FILES = new Set(["bun.lock", "src/routeTree.gen.ts"]);

function runGit(args, { allowFailure = false } = {}) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", allowFailure ? "ignore" : "inherit"],
  });
  if (result.status !== 0) {
    if (allowFailure) return "";
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
}

function isCommit(reference) {
  if (!reference) return false;
  const result = spawnSync("git", ["cat-file", "-e", `${reference}^{commit}`], { stdio: "ignore" });
  return result.status === 0;
}

function resolveBaseReference() {
  const requestedBase = process.env.FORMAT_BASE_REF?.trim();
  if (requestedBase && isCommit(requestedBase)) return requestedBase;
  const mainMergeBase = runGit(["merge-base", "HEAD", "origin/main"], { allowFailure: true });
  if (mainMergeBase && isCommit(mainMergeBase)) return mainMergeBase;
  const parent = runGit(["rev-parse", "HEAD^"], { allowFailure: true });
  return parent && isCommit(parent) ? parent : "";
}

function collectFiles() {
  const files = new Set();
  const baseReference = resolveBaseReference();
  const addOutput = (output) => {
    for (const file of output.split("\n")) {
      const normalized = file.trim();
      if (normalized) files.add(normalized);
    }
  };
  if (baseReference) addOutput(runGit(["diff", "--name-only", "--diff-filter=ACMR", `${baseReference}...HEAD`]));
  else addOutput(runGit(["ls-files"]));
  addOutput(runGit(["diff", "--name-only", "--diff-filter=ACMR"]));
  addOutput(runGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]));
  addOutput(runGit(["ls-files", "--others", "--exclude-standard"]));
  return [...files]
    .filter((file) => SUPPORTED_FILE.test(file))
    .filter((file) => !EXCLUDED_FILES.has(file))
    .sort();
}

const requestedMode = process.argv[2];
if (requestedMode !== "--check" && requestedMode !== "--write") {
  console.error("Usage: node scripts/format-changed.mjs --check|--write");
  process.exit(2);
}

const files = collectFiles();
if (files.length === 0) {
  console.log("No changed files require Prettier validation.");
  process.exit(0);
}

const diagnosticCheck = requestedMode === "--check" && process.env.GITHUB_ACTIONS === "true";
const effectiveMode = diagnosticCheck ? "--write" : requestedMode;
console.log(`Running Prettier ${effectiveMode} for ${files.length} changed file(s).`);
for (const file of files) console.log(`- ${file}`);

const prettierResult = spawnSync(
  process.execPath,
  ["node_modules/prettier/bin/prettier.cjs", effectiveMode, "--ignore-unknown", ...files],
  { stdio: "inherit" },
);
if (prettierResult.status !== 0) process.exit(prettierResult.status ?? 1);
if (diagnosticCheck) {
  console.log("===== F6 PRETTIER CANONICAL DIFF =====");
  spawnSync("git", ["diff", "--", ...files], { stdio: "inherit" });
}
process.exit(0);
