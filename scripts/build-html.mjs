/* =========================================================
   Estnak Tours and Travel — tiny static page assembler
   Injects the shared header/footer partials into src/pages/*.html
   and writes the finished pages to the project root.
   Run with: npm run build:html
   ========================================================= */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const header = readFileSync(resolve(root, "partials/header.html"), "utf8").trimEnd();
const footer = readFileSync(resolve(root, "partials/footer.html"), "utf8").trimEnd();

const pagesDir = resolve(root, "src/pages");
const pages = readdirSync(pagesDir).filter((file) => file.endsWith(".html"));

if (!pages.length) {
  console.error("No pages found in src/pages.");
  process.exit(1);
}

let built = 0;

for (const file of pages) {
  let html = readFileSync(resolve(pagesDir, file), "utf8");
  const active = html.match(/<!--@header\s+([a-z-]+)\s*-->/i)?.[1] || "";

  html = html.replace(/<!--@header\s+[a-z-]+\s*-->/i, () => {
    if (!active) return header;
    return header.replaceAll(
      `data-nav-link="${active}"`,
      `data-nav-link="${active}" aria-current="page"`
    );
  });

  html = html.replace(/<!--@footer-->/i, () => footer);

  if (/<!--@(header|footer)/i.test(html)) {
    console.warn(`! ${file} still contains unresolved partial markers`);
  }

  writeFileSync(resolve(root, file), html, "utf8");
  built += 1;
  console.log(`  built ${file}`);
}

mkdirSync(resolve(root, "assets/css"), { recursive: true });
console.log(`\nDone — ${built} page${built === 1 ? "" : "s"} assembled.`);
