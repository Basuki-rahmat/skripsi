import { execSync } from "node:child_process";
import {
  readFileSync,
  copyFileSync,
  rmSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = "C:/laragon/www/skripsi/format-skripsi";
const ZIP = join(ROOT, "output", "template-skripsi-binus.docx");

const W = join(tmpdir(), "docx-skr-final");


// ============================================================
// 1. Persiapan folder temporary
// ============================================================

rmSync(W, {
  recursive: true,
  force: true,
});

mkdirSync(W, {
  recursive: true,
});


// ============================================================
// 2. Pastikan file DOCX tersedia
// ============================================================

if (!existsSync(ZIP)) {
  throw new Error(`File DOCX tidak ditemukan:\n${ZIP}`);
}

console.log("DOCX ditemukan:");
console.log(`  ${ZIP}`);


// ============================================================
// 3. Salin DOCX ke temporary sebagai ZIP
// ============================================================

const zloc = join(W, "src.zip");

copyFileSync(ZIP, zloc);

console.log("\nFile disalin ke:");
console.log(`  ${zloc}`);


// ============================================================
// 4. Extract DOCX
// ============================================================

const target = join(W, "x");

mkdirSync(target, {
  recursive: true,
});


// PowerShell menggunakan path Windows biasa
const psZip = zloc.replace(/\//g, "\\");
const psTarget = target.replace(/\//g, "\\");

const command = [
  "powershell",
  "-NoProfile",
  "-Command",
  `"Expand-Archive -LiteralPath '${psZip}' -DestinationPath '${psTarget}' -Force"`,
].join(" ");

console.log("\nExtracting DOCX...");

execSync(command, {
  stdio: "inherit",
});


// ============================================================
// 5. Pastikan XML hasil extract tersedia
// ============================================================

const settingsPath = join(target, "word", "settings.xml");
const documentPath = join(target, "word", "document.xml");

if (!existsSync(settingsPath)) {
  throw new Error(`settings.xml tidak ditemukan:\n${settingsPath}`);
}

if (!existsSync(documentPath)) {
  throw new Error(`document.xml tidak ditemukan:\n${documentPath}`);
}


// ============================================================
// 6. Baca settings.xml
// ============================================================

const set = readFileSync(settingsPath, "utf8");

console.log("\n========================================");
console.log("settings.xml");
console.log("========================================");

console.log(
  "evenAndOddHeaders(true) :",
  /<w:evenAndOddHeaders(?:\s+w:val="true")?\s*\/?>/.test(set)
);

console.log(
  "updateFields(true)      :",
  /<w:updateFields(?:\s+w:val="true")?\s*\/?>/.test(set)
);


// ============================================================
// 7. Baca document.xml
// ============================================================

const doc = readFileSync(documentPath, "utf8");

console.log("\n========================================");
console.log("document.xml");
console.log("========================================");


// ------------------------------------------------------------
// Jumlah section
// ------------------------------------------------------------

console.log(
  "sections (sectPr)        :",
  (doc.match(/<w:sectPr(?:\s|>)/g) || []).length
);


// ------------------------------------------------------------
// Page numbering
// ------------------------------------------------------------

console.log(
  "pgNumType total          :",
  (doc.match(/<w:pgNumType\b/g) || []).length
);

console.log(
  "fmt=lowerRoman           :",
  (doc.match(/fmt="lowerRoman"/g) || []).length
);

console.log(
  "fmt=decimal              :",
  (doc.match(/fmt="decimal"/g) || []).length
);

console.log(
  "w:start=1                :",
  (doc.match(/w:start="1"/g) || []).length
);


// ------------------------------------------------------------
// Title page
// ------------------------------------------------------------

console.log(
  "titlePg                  :",
  (doc.match(/<w:titlePg\s*\/?>/g) || []).length
);


// ------------------------------------------------------------
// Section type
// ------------------------------------------------------------

console.log(
  "oddPage section header   :",
  (doc.match(/w:type="oddPage"/g) || []).length
);


// ------------------------------------------------------------
// Header references
// ------------------------------------------------------------

console.log(
  "headerReference refs     :",
  (doc.match(/<w:headerReference\b/g) || []).length
);

console.log(
  "even header type present :",
  (doc.match(/w:type="even"/g) || []).length
);


// ------------------------------------------------------------
// Manual page breaks
// ------------------------------------------------------------

console.log(
  "manual PageBreak         :",
  (doc.match(/<w:br\b[^>]*w:type="page"[^>]*\/?>/g) || []).length
);


// ============================================================
// 8. Ringkasan
// ============================================================

console.log("\n========================================");
console.log("PEMERIKSAAN SELESAI");
console.log("========================================");

console.log(`Temporary directory : ${W}`);
console.log(`Document XML        : ${documentPath}`);
console.log(`Settings XML        : ${settingsPath}`);