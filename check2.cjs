const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const JSZip = require(
  "C:/laragon/www/skripsi/format-skripsi/node_modules/jszip"
);

const GEN = "C:/laragon/www/skripsi/format-skripsi";
const OUT = path.join(
  GEN,
  "output",
  "template-skripsi-binus.docx"
);

console.log("1) regenerate ...");

childProcess.execSync("npm run generate", {
  cwd: GEN,
  stdio: "inherit"
});

if (!fs.existsSync(OUT)) {
  throw new Error(
    "File DOCX tidak ditemukan: " + OUT
  );
}

const buf = fs.readFileSync(OUT);

console.log("");
console.log("DOCX:");
console.log("  file  :", OUT);
console.log("  bytes :", buf.length);

async function verify() {
  const zip = await JSZip.loadAsync(buf);

  const settingsFile = zip.file("word/settings.xml");
  const documentFile = zip.file("word/document.xml");

  if (!settingsFile) {
    throw new Error(
      "word/settings.xml tidak ditemukan."
    );
  }

  if (!documentFile) {
    throw new Error(
      "word/document.xml tidak ditemukan."
    );
  }

  const settingsXml =
    await settingsFile.async("string");

  const documentXml =
    await documentFile.async("string");

  console.log("");
  console.log("==============================");
  console.log("2) settings.xml");
  console.log("==============================");

  console.log(
    "evenAndOddHeaders true :",
    /<w:evenAndOddHeaders\b[^>]*w:val="true"[^>]*\/?>/.test(
      settingsXml
    )
  );

  console.log(
    "updateFields true      :",
    /<w:updateFields\b[^>]*w:val="true"[^>]*\/?>/.test(
      settingsXml
    )
  );

  console.log(
    "evenAndOddHeaders false:",
    /<w:evenAndOddHeaders\b[^>]*w:val="false"[^>]*\/?>/.test(
      settingsXml
    )
  );

  console.log("");
  console.log("==============================");
  console.log("3) document.xml");
  console.log("==============================");

  console.log(
    "lowerRoman            :",
    (documentXml.match(
      /w:fmt="lowerRoman"/g
    ) || []).length
  );

  console.log(
    "decimal               :",
    (documentXml.match(
      /w:fmt="decimal"/g
    ) || []).length
  );

  console.log(
    'w:start="1"           :',
    (documentXml.match(
      /w:start="1"/g
    ) || []).length
  );

  console.log(
    "titlePg               :",
    (documentXml.match(
      /<w:titlePg\s*\/?>/g
    ) || []).length
  );

  console.log(
    "oddPage section       :",
    (documentXml.match(
      /<w:type\s+w:val="oddPage"\s*\/?>/g
    ) || []).length
  );

  console.log(
    "even header            :",
    (documentXml.match(
      /w:type="even"/g
    ) || []).length
  );

  console.log(
    "default header         :",
    (documentXml.match(
      /w:type="default"/g
    ) || []).length
  );

  console.log(
    "manual page break      :",
    (documentXml.match(
      /<w:br\b[^>]*w:type="page"[^>]*\/?>/g
    ) || []).length
  );

  console.log(
    "sections (sectPr)      :",
    (documentXml.match(
      /<w:sectPr(?:\s|>)/g
    ) || []).length
  );

  console.log("");
  console.log("==============================");
  console.log("VERIFY SELESAI");
  console.log("==============================");
}

verify().catch(function (error) {
  console.error("");
  console.error("VERIFY ERROR:");
  console.error(error);
  process.exit(1);
});