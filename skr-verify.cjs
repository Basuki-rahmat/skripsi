const { execSync } = require("node:child_process");
const fs = require("node:fs");
const docxPkg = "C:/laragon/www/skripsi/format-skripsi/node_modules";
const JSZIP = require(docxPkg + "/jszip");

console.log("1) regenerate (workdir format-skripsi)...");
const r = execSync("npm run generate", {
  cwd: "C:/laragon/www/skripsi/format-skripsi",
  encoding: "utf8",
});
console.log("   " + r.trim().split(/\r?\n/).filter(Boolean).pop());

const OUT = "C:/laragon/www/skripsi/format-skripsi/output/template-skripsi-binus.docx";
const data = fs.readFileSync(OUT);
const zip = await JSZIP.loadAsync(data誰);

const st = await zip.file("word/settings.xml").async("string");
const doc = await zip.file("word/document.xml").async("string");

console.log("\n2) settings.xml (read fresh from regenerated docx):");
console.log("   evenAndOddHeaders(true) :", /evenAndOddHeaders w:val="true"/.test(st));
console.log("   updateFields(true)      :", /updateFields w:val="true"/.test(st));
console.log("\n3) document.xml:");
console.log("   pgNumType lowerRoman    :", (doc.match(/fmt="lowerRoman"/g) || []).length);
console.log("   pgNumType decimal       :", (doc.match(/fmt="decimal"/g) || []).length);
console.log("   w:start=\"1\"            :", (doc.match(/w:start="1"/g) || []).length);
console.log("   titlePg                 :", (doc.match(/<w:titlePg\/>/g) || []).length);
console.log("   sectPr w:type oddPage   :", (doc.match(/<w:type w:val="oddPage"\/>/g) || []).length);
console.log("   headerRef even          :", (doc.match(/w:type w:val="even"/g) || []).length);
console.log("   headerRef default       :", (doc.match(/w:type w:val="default"/g) || []).length);
console.log("   manual PageBreak        :", (doc.match(/<w:br w:type="page"\/>/g) || []).length);
console.log("   size bytes              :", data.length);
