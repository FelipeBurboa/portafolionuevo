// Build-time guard for the editorial-content convention.
//
// UI labels live in `messages/{en,es}.json` (next-intl catalogs). Editorial
// content (project write-ups, About) lives under `content/<slug>/` as one
// file per locale: `en.mdx` / `es.mdx` (or `.ts`). Every slug MUST have every
// locale — a missing variant fails the build instead of shipping a half-
// translated page. See `content/README.md`.

import { readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const LOCALES = ["en", "es"];
const CONTENT_DIR = join(process.cwd(), "content");

if (!existsSync(CONTENT_DIR)) {
  console.log("[check-content] no content/ directory — nothing to check");
  process.exit(0);
}

const errors = [];
for (const slug of readdirSync(CONTENT_DIR)) {
  const dir = join(CONTENT_DIR, slug);
  if (!statSync(dir).isDirectory()) continue; // skip README.md etc.
  for (const locale of LOCALES) {
    const hasVariant =
      existsSync(join(dir, `${locale}.mdx`)) ||
      existsSync(join(dir, `${locale}.ts`));
    if (!hasVariant) {
      errors.push(
        `content/${slug}: missing "${locale}" variant (${locale}.mdx or ${locale}.ts)`,
      );
    }
  }
}

if (errors.length) {
  console.error(
    "[check-content] missing locale variants:\n" +
      errors.map((e) => "  - " + e).join("\n"),
  );
  process.exit(1);
}

console.log(`[check-content] every content slug has ${LOCALES.join(" + ")} ✓`);
