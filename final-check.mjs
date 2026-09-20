import { spawnSync, execSync } from "node:child_process";
import {
  readFileSync, copyFileSync, mkdirSync, rmSync, statSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const GEN = "C:/laragon/www/skripsi/format-skripsi";
const OUTDOC = join(GEN, "output", "template-skripsi-binus.docx");
const OUTNAMES = [
  OUTDOC,
  "C:/laragon/www/skripsi/format-skripsi/format-skripsi/output/template-skripsi-binus.docx",
];

console.log("=== 1) regenerate ===");
const r = spawnSync(process.env.ComSpec, ["/c", "npm run generate"], {
  cwd: GEN, encoding: "utf8",
});
console.log("exit:", r.status);
console.log((r.stdout || "").trim().split("\n").filter(Boolean).pop());

function exists(p) { try { return statSync(p).isFile(); } catch { return false; } }

const wins = OUTNAMES.filter(exists).map((p) => {
  const w = join(tmpdir(), "skr-x");
  rmSync(w, { recursive: true, force: true });
  mkdirSync(w, { recursive: true });
  const z = join(w, "f.zip");
  copyFileSync(p, z);
  execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${z.replace(/\\/g, "/")}' -DestinationPath '${join(w, "x").replace(/\\/g, "/")}' -Force"`, { encoding: "utf8" });
  return { p, w };
});

for (const { p, w } of wins) {
  console.log("\n==== DOCX:", p.replace("C:/laragon/www/skripsi", "~"), "====");
  const settings = readFileSync(join(w, "x", "word", "settings.xml"), "utf8");
  const doc = readFileSync(join(w, "x", "word", "document.xml"), "utf8");
  console.log("settings.xml:");
  console.log("  evenAndOddHeaders true  :", /evenAndOddHeaders w:val="true"/.test(settings));
  console.log("  updateFields true       :", /updateFields w:val="true"/.test(settings));
  console.log("document.xml:");
  console.log("  fmt lowerRoman          :", (doc.match(/fmt="lowerRoman"/g) || []).length);
  console.log("  fmt decimal             :", (doc.match(/fmt="decimal"/g) || []).length);
  console.log("  w:start=\"1\"            :", (doc.match(/w:start="1"/g) || []).length);
  console.log("  titlePg                 :", (doc.match(/<w:titlePg\/>/g) || []).length);
  console.log("  sectPr oddPage type     :", (doc.match(/<w:type w:val="oddPage"\/>/g) || []).length);
  console.log("  headerRef even          :", (doc.match(/<w:type w:val="even"\/>/g) || []).length);
  console.log("  headerRef default       :", (doc.match(/<w:type w:val="default"\/>/g) || []).length);
  console.log("  manual page br          :", (doc.match(/<w:br w:type="page"\/>/g) || []).length);
}
