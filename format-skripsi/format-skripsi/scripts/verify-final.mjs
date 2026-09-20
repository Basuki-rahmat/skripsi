const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");

const root = "C:/laragon/www/skripsi/format-skripsi/format-skripsi";
const zip = path.join(root, "output", "template-skripsi-binus.docx");
const wk = path.join(os.tmpdir(), "skripsi-final-chk");
fs.rmSync(wk, { recursive: true, force: true });
fs.mkdirSync(wk, { recursive: true });
const ztmp = path.join(os.tmpdir(), "skripsi-final.zip");
fs.copyFileSync(zip, ztmp, 0);

cp.execSync(
  `powershell -NoProfile -Command "Expand-Archive -Path '${ztmp}' -DestinationPath '${wk}' -Force"`,
  { stdio: "ignore" }
);

const settings = fs.readFileSync(path.join(wk, "word", "settings.xml"), "utf8");
const document = fs.readFileSync(path.join(wk, "word", "document.xml"), "utf8");

console.log("SETTINGS (word/settings.xml)");
console.log("  evenAndOddHeaders true :", /evenAndOddHeaders w:val="true"/.test(settings));
console.log("  updateFields true      :", /updateFields w:val="true"/.test(settings));

console.log("DOCUMENT (word/document.xml)");
console.log("  sections (sectPr)      :", (document.match(/<w:sectPr[ >]/g) || []).length);
console.log("  titlePg                :", (document.match(/<w:titlePg\/>/g) || []).length);
console.log("  oddPage type           :", (document.match(/w:type w:val="oddPage"/g) || []).length);
console.log("  even pages used        :", /w:pgNumType/.test(document) ? "n/a" : "n/a");
const nT = document.match(/<w:pgNumType[^>]*\/>/g) || [];
console.log("  pgNumType total        :", nT.length);
const roman = nT.filter((x) => /fmt="lowerRoman"/.test(x));
const dec = nT.filter((x) => /fmt="decimal"/.test(x));
console.log("  lowerRoman             :", roman.length);
console.log("  decimal                :", dec.length);
console.log("  start=1               :", nT.filter((x) => /w:start="1"/.test(x)).length);
console.log("  manual page breaks     :", (document.match(/<w:br w:type="page"\/>/g) || []).length);
console.log("  headers (headerReference):", (document.match(/<w:headerReference/g) || []).length, "references");
const rels = fs.readFileSync(path.join(wk, "word", "_rels", "document.xml.rels"), "utf8");
console.log("  header parts           :", (rels.match(/\.xml"$/gm) || []).filter((x) => /header/.test(x)).length);
console.log("  header xml files exist :");
for (const f of fs.readdirSync(path.join(wk, "word"))) if (/^header\d*\.xml$/.test(f)) console.log("     -", f);
