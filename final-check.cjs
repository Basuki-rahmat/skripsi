const { execSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const JSZip = require("C:/laragon/www/skripsi/format-skripsi/node_modules/jszip");

const GEN = "C:/laragon/www/skripsi/format-skripsi";
const OUT = GEN + "/output/template-skripsi-binus.docx";

(async () => {
  console.log("1) regenerate ...");
  const raw = execSync("npm run generate", { cwd: GEN, encoding: "utf8" }).trim();
  console.log("   " + raw.split(/\r?\n/).pop().trim());

  const data = readFileSync(OUT);
  const zip = await JSZip.loadAsync(data);
  const st = await zip.file("word/settings.xml").async("string");
  const doc = await zip.file("word/document.xml").async("string");

  console.log("2) settings.xml:");
  console.log("   evenAndOddHeaders(true) :", /evenAndOddHeaders w:val="true"/.test(st));
  console.log("   updateFields(true)      :", /updateFields w:val="true"/.test(st));

  console.log("3) document.xml:");
  console.log("   pgNumType lowerRoman    :", (doc.match(/fmt="lowerRoman"/g) || []).length);
  console.log("   pgNumType decimal       :", (doc.match(/fmt="decimal"/g) || []).length);
  console.log("   w:start=\"1\"            :", (doc.match(/w:start="1"/g) || []).length);
  console.log("   titlePg                 :", (doc.match(/<w:titlePg\/>/g) || []).length);
  console.log("   sectPr oddPage type     :", (doc.match(/<w:type w:val="oddPage"\/>/g) || []).length);
  console.log("   headerRef even type     :", (doc.match(/w:type w:val="even"/g) || []).length);
  console.log("   headerRef default type  :", (doc.match(/w:type w:val="default"/g) || []).length);
  console.log("   manual page-break br    :", (doc.match(/<w:br w:type="page"\/>/g) || []).length);
  console.log("4) file: " + OUT + " (" + data.length + " bytes)");
})();
