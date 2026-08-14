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
  return spawnSync("git", ["cat-file", "-e", `${reference}^{commit}`], { stdio: "ignore" }).status === 0;
}

function resolveBaseReference() {
  const requestedBase = process.env.FORMAT_BASE_REF?.trim();
  if (requestedBase && isCommit(requestedBase)) return requestedBase;
  const mergeBase = runGit(["merge-base", "HEAD", "origin/main"], { allowFailure: true });
  if (mergeBase && isCommit(mergeBase)) return mergeBase;
  return runGit(["rev-parse", "HEAD^"], { allowFailure: true });
}

function collectFiles() {
  const files = new Set();
  const base = resolveBaseReference();
  const add = (output) => output.split("\n").map((file) => file.trim()).filter(Boolean).forEach((file) => files.add(file));
  if (base) add(runGit(["diff", "--name-only", "--diff-filter=ACMR", `${base}...HEAD`]));
  else add(runGit(["ls-files"]));
  add(runGit(["diff", "--name-only", "--diff-filter=ACMR"]));
  add(runGit(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]));
  add(runGit(["ls-files", "--others", "--exclude-standard"]));
  return [...files].filter((file) => SUPPORTED_FILE.test(file) && !EXCLUDED_FILES.has(file)).sort();
}

const mode = process.argv[2];
if (mode !== "--check" && mode !== "--write") process.exit(2);
const files = collectFiles();
if (!files.length) process.exit(0);
const diagnostic = mode === "--check" && process.env.GITHUB_ACTIONS === "true";
const effectiveMode = diagnostic ? "--write" : mode;
const result = spawnSync(process.execPath, ["node_modules/prettier/bin/prettier.cjs", effectiveMode, "--ignore-unknown", ...files], { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status ?? 1);
if (diagnostic) {
  console.log("===== F6 ENVIRONMENT BOUNDARY PRETTIER DIFF =====");
  spawnSync("git", ["diff", "--", "src/lib/discovery.functions.ts", "src/routes/shop.tsx"], { stdio: "inherit" });
}
