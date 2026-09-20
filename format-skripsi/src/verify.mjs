const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const zip = path.join("output", "template-skripsi-binus.docx");

const tmp = os.tmpdir();
const w = path.join(tmp, "docxverify-FINAL");


// ============================================================
// 1. Bersihkan temporary folder
// ============================================================

fs.rmSync(w, {
  recursive: true,
  force: true,
});

fs.mkdirSync(w, {
  recursive: true,
});


// ============================================================
// 2. Pastikan DOCX tersedia
// ============================================================

if (!fs.existsSync(zip)) {
  throw new Error(`File tidak ditemukan: ${zip}`);
}


// ============================================================
// 3. Copy DOCX sebagai ZIP
// ============================================================

const z = path.join(tmp, "verifyFINAL.zip");

fs.copyFileSync(zip, z);


// ============================================================
// 4. Extract DOCX menggunakan PowerShell
// ============================================================

const q = `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${z}' -DestinationPath '${w}' -Force"`;

execSync(q, {
  stdio: "pipe",
});


// ============================================================
// 5. Baca settings.xml
// ============================================================

const settingsPath = path.join(w, "word", "settings.xml");

if (!fs.existsSync(settingsPath)) {
  throw new Error(`settings.xml tidak ditemukan: ${settingsPath}`);
}

const set = fs.readFileSync(settingsPath, "utf8");

console.log("");
console.log("========================================");
console.log("SETTINGS");
console.log("========================================");

console.log(
  "  evenAndOddHeaders true :",
  /<w:evenAndOddHeaders\b[^>]*w:val="true"[^>]*\/?>/.test(set)
);

console.log(
  "  updateFields true      :",
  /<w:updateFields\b[^>]*w:val="true"[^>]*\/?>/.test(set)
);

console.log(
  "  evenAndOddHeaders false:",
  /<w:evenAndOddHeaders\b[^>]*w:val="false"[^>]*\/?>/.test(set)
);


// ============================================================
// 6. Baca document.xml
// ============================================================

const documentPath = path.join(w, "word", "document.xml");

if (!fs.existsSync(documentPath)) {
  throw new Error(`document.xml tidak ditemukan: ${documentPath}`);
}

const d = fs.readFileSync(documentPath, "utf8");

console.log("");
console.log("========================================");
console.log("DOCUMENT");
console.log("========================================");


// ============================================================
// 7. Section
// ============================================================

console.log(
  "  sections (sectPr)     :",
  (d.match(/<w:sectPr(?:\s|>)/g) || []).length
);


// ============================================================
// 8. Format nomor halaman
// ============================================================

console.log(
  "  lowerRoman            :",
  (d.match(/w:fmt="lowerRoman"/g) || []).length
);

console.log(
  "  decimal               :",
  (d.match(/w:fmt="decimal"/g) || []).length
);


// ============================================================
// 9. Semua pgNumType
// ============================================================

const starts =
  d.match(/<w:pgNumType\b[^>]*\/?>/g) || [];

console.log(
  "  pgNumType total       :",
  starts.length
);

console.log(
  "  pgNumType sample      :"
);

for (const s of starts.slice(0, 25)) {
  console.log("   ", s.replace(/"/g, "'"));
}


// ============================================================
// 10. Pemeriksaan tambahan
// ============================================================

console.log("");
console.log("========================================");
console.log("PEMERIKSAAN TAMBAHAN");
console.log("========================================");

console.log(
  "  titlePg               :",
  (d.match(/<w:titlePg\s*\/?>/g) || []).length
);

console.log(
  "  oddPage sections      :",
  (d.match(/w:type="oddPage"/g) || []).length
);

console.log(
  "  headerReference       :",
  (d.match(/<w:headerReference\b/g) || []).length
);

console.log(
  "  even header           :",
  (d.match(/w:type="even"/g) || []).length
);

console.log(
  "  manual page breaks    :",
  (d.match(/<w:br\b[^>]*w:type="page"[^>]*\/?>/g) || []).length
);

console.log("");
console.log("========================================");
console.log("VERIFY SELESAI");
console.log("========================================");