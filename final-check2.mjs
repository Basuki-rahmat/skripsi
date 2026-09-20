import { readFileSync, copyFileSync, mkdirSync, rmSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";

const GENERATOR = "C:/laragon/www/skripsi/format-skripsi";
const DOCX = join(GENERATOR, "output", "template-skripsi-binus.docx");
console.log("1) regenerate...");
const gen = execSync("npm run generate", { cwd: GENERATOR, encoding: "utf8" }).trim().split("\n").pop();
console.log(gen);

let s = "", d = "";
try {
  const JSZip = (await import(join(GENERATOR, "node_modules", "jszip", "lib", "index.js"))).default;
  const zip = await JSZip.loadAsync(readFileSync(DOCX));
  s = await zip.file("word/settings.xml").async("string");
  d = await zip.file("word/document.xml").async("string");
} catch (e) {
  console.log("jszip fail:", e.message);
  const w = join(tmpdir(), "chk-docx");
  rmSync(w, { recursive: true, force: true });
  mkdirSync(w, { recursive: true });
  const z = join(w, "f.docx");
  copyFileSync(DOCX, z);
  const zp = z.replace(/\\/g, "/");
  const dest = join(w, "x").replace(/\\/g, "/");
  mkdirSync(join(w, "x"), { recursive: true });
  execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${zp}' -DestinationPath '${dest}' -Force"`);
  s = readFileSync(join(w, "x", "word", "settings.xml"), "utf8");
  d = readFileSync(join(w, "x", "word", "document.xml"), "utf8");
}

console.log("\n2) settings.xml:");
console.log("   evenAndOddHeaders(true):", /evenAndOddHeaders w:val="true"/.test(s));
console.log("   updateFields(true)     :", /updateFields w:val="true"/.test(s));
console.log("\n3) document.xml:");
console.log("   lowerRoman :", (d.match(/fmt="lowerRoman"/g) || []).length);
console.log("   decimal    :", (d.match(/fmt="decimal"/g) || []).length);
console.log("   titlePg    :", (d.match(/<w:titlePg\/>/g) || []).length);
console.log("   oddPage    :", (d.match(/<w:type w:val="oddPage"\/>/g) || []).length);
console.log("   even hdr   :", (d.match(/w:type w:val="even"/g) || []).length);
console.log("   default hdr:", (d.match(/w:type w:val="default"/g) || []).length);
console.log("   manual br  :", (d.match(/<w:br w:type="page"\/>/g) || []).length);
console.log("   start=1    :", (d.match(/w:start="1"/g) || []).length);
