const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");

const work = path.join(os.tmpdir(), "skripsi-verify-clean");
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

const zip = path.join(process.cwd(), "output", "template-skripsi-binus.docx");
const ps = [
  "-NoProfile",
  "-Command",
  "Expand-Archive -Path '" + zip + "' -DestinationPath '" + work + "' -Force",
];
cp.execSync("powershell " + ps.map((x) => (x.includes(" ") ? '"' + x + '"' : x)).join(" "));

const st = fs.readFileSync(path.join(work, "word", "settings.xml"), "utf8");
console.log("settings.xml");
console.log("  evenAndOddHeaders val=true:", /evenAndOddHeaders w:val="true"/.test(st));
console.log("  evenAndOddHeaders present :", /evenAndOddHeaders/.test(st));
console.log("  updateFields val=true     :", /updateFields w:val="true"/.test(st));

const doc = fs.readFileSync(path.join(work, "word", "document.xml"), "utf8");
console.log("document.xml");
console.log("  sections                  :", (doc.match(/<w:sectPr[ >]/g) || []).length);
console.log("  pgNumType                 :", (doc.match(/<w:pgNumType/g) || []).length);
console.log("  lowerRoman                :", (doc.match(/w:fmt="lowerRoman"/g) || []).length);
console.log("  decimal                   :", (doc.match(/w:fmt="decimal"/g) || []).length);
console.log("  w:start=1                 :", (doc.match(/w:start="1"/g) || []).length);
console.log("  titlePg                   :", (doc.match(/<w:titlePg\/>/g) || []).length);
console.log("  oddPage                   :", (doc.match(/w:type w:val="oddPage"/g) || []).length);
console.log("  manual PageBreak          :", (doc.match(/<w:br w:type="page"\/>/g) || []).length);

const hdr = fs.readFileSync(path.join(work, "word", "_rels", "document.xml.rels"), "utf8");
console.log("rels                       :", (hdr.match(/<Relationship /g) || []).length);

console.log("DONE clean");
