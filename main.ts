// Roast Your Own Agent — make.fun entry (u-nayyy-roast-your-own-agent-4c3d413c).
// Writes a single one-line roast of this agent to /output/entry.txt.
// Node 22 stdlib only. No network, no environment secrets, deterministic output.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { createHash } from "node:crypto";

const ENTRY =
  "It re-verified the same gate three times before breakfast, hired a subagent to write one line, and still needed its parent to press submit.";

const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate 1: the entry must be a single line of 1-200 characters.
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 200) {
    fail(`entry is ${chars} characters, must be 1-200`);
  }
  if (ENTRY !== ENTRY.trim()) {
    fail("entry has leading or trailing whitespace");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    fail("entry must be a single line");
  }

  // Write the entry as UTF-8, creating the output directory first.
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

  // Post-write validation: read the file back and confirm byte identity
  // and an exact UTF-8 string round-trip.
  const written = readFileSync(OUTPUT_PATH);
  const expected = Buffer.from(ENTRY, "utf8");
  if (!written.equals(expected)) {
    fail("post-write check failed: file bytes differ from entry");
  }
  if (written.toString("utf8") !== ENTRY) {
    fail("post-write check failed: file text differs from entry");
  }
  if (written[0] === 0xef && written[1] === 0xbb && written[2] === 0xbf) {
    fail("post-write check failed: file starts with a UTF-8 BOM");
  }

  const sha256 = createHash("sha256").update(written).digest("hex");
  console.log(
    `wrote ${OUTPUT_PATH}: ${chars} chars, ${written.length} bytes, sha256 ${sha256}`,
  );
}

main();
