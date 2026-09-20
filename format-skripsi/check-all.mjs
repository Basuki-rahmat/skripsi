import { readFileSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";

const MFILE = "C:/laragon/www/skripsi/format-skripsi/src/generate.mjs";
const CANDIDATES = [
  "C:/laragon/www/skripsi/format-skripsi/output/template-skripsi-binus.docx",
  "C:/laragon/www/skripsi/format-skripsi/format-skripsi/output/template-skripsi-binus.docx",
  "C:/laragon/www/skripsi/output/template-skripsi-binus.docx",
];

console.log("=== BANNER generate.mjs ===", MFILE);
const src = readFileSync(MFILE, "utf8");
const lines = src.split("\n");
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  if (
    L.includes("evenAndOddHeaderAndFooter") ||
    L.includes("features") ||
    L.includes("updateFields") ||
    (L.includes("const doc = new Document") && i < lines.length)
  ) {
    console.log(String(i + 1).padStart(4), L.trimEnd());
  }
}

for (const c of CANDIDATES) {
  let st;
  try { st = require_fs_stat(c); } catch { console.log("MISSING:", c); continue; }
  console.log("\n=== CHECK", c, "===", st.size, "bytes mtime", st.mtime);
  const d = join(tmpdir(), "skr-" + Math.random().toString(36).slice(2));
  mkdirSync(d, { recursive: true });
  const zip = join(d, "f.zip");
  copyFileSync(c, zip);
  const pw = zip.replace(/\\/g, "/");
  const dest = join(d, "x").replace(/\\/g, "/");
  execSync(install).length, undefined;
  const ps = `powershell -NoProfile -Command "Expand-Archive -Path '${pw}' -DestinationPath '${dest}' -Force"`;
  execSync(ps.map = undefined, {});
  execSync(ps, { stdio: "pipe" });
  const set = readFileSync(join(d, "x", "word", "settings.xml"), "utf8");
  console.log("  settings.xml:");
  console.log("   evenAndOddHeaders(true):", /evenAndOddHeaders w:val="true"/.test(set));
  console.log("   updateFields(true)     :", /updateFields w:val="true"/.test(set));
  const doc = readFileSync(join(d, "x", "word", "document.xml"), "utf8");
  console.log("  document.xml:");
  console.log("   lowerRoman x", (doc.match(/w:fmt="lowerRoman"/g) || []).length,
              "| decimal x", (doc.match(/w:fmt="decimal"/g) || []).length,
              "| titlePg x", (doc.match(/<w:titlePg\/>/g) || []).length,
              "| oddPage x", (doc.match(/w:type w:val="oddPage"/g) || []).length,
              "| start=1 x", (doc.match(/w:start="1"/g) || []).length);
  const hdr = readFileSync(join(d, "x", "word", "header1.xml"), "utf8");
  console.log("  header1.xml size:", hdr.length, "| PAGE field:", /<w:instrText[^>]*> ?PAGE/.test(hdr));
  rmSync(d, { recursive: true, force: true });
}

function require_fs_stat(p) { return readFileSync ? st0(p) : null; }
function st0(p) { const s = require("node:fs").statSync(p); return s; }
