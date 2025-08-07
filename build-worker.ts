#!/usr/bin/env bun
import { build } from "bun";
import path from "path";
import { existsSync } from "fs";
import { rm, mkdir } from "fs/promises";

console.log("\n🔧 Building Cloudflare Worker...\n");

const outdir = path.join(process.cwd(), "dist");

// Clean existing worker build
const workerDistPath = path.join(outdir, "worker");
if (existsSync(workerDistPath)) {
  console.log(`🗑️  Cleaning previous worker build at ${workerDistPath}`);
  await rm(workerDistPath, { recursive: true, force: true });
}

await mkdir(workerDistPath, { recursive: true });

const start = performance.now();

// Build the worker
const result = await build({
  entrypoints: ["src/worker.tsx"],
  outdir: workerDistPath,
  target: "browser",
  format: "esm",
  minify: true,
  sourcemap: "linked",
  external: ["cloudflare:workers"],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

const end = performance.now();
const buildTime = (end - start).toFixed(2);

if (result.success) {
  console.log(`✅ Worker built successfully in ${buildTime}ms`);
  console.log(`📦 Output: ${path.join(workerDistPath, "worker.js")}\n`);
} else {
  console.error("❌ Worker build failed");
  process.exit(1);
}