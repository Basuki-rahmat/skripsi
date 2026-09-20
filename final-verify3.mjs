import {
  readFileSync, copyFileSync, mkdirSync, rmSync, existsSync, statSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";

const ROOT = "C:/laragon/www/skripsi";
const GEN = join(ROOT, "format-skripsi");
const OUT = join(GEN, "output", "template-skripsi-binus.docx");

const run = (cmd, args = [], opts = {}) =>
  execSync(cmd, { cwd: GEN, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });

console.log("1) regenerate docx...");
const genOut = run(process.env.ComSpec, ["/c", "npm", "run", "generate"]);
const last = genOut.trim().split(/\r?\n/).filter(Boolean).pop();
console.log("   " + last誰);
console.log("   size:", statSync(OUT).size, "mtime:", statSync(OUT).mtime.toISOString());

const w = join(tmpdir(), "skr-v12");
rmSync(w, { recursive: true, force: true });
mkdirSync(w, { recursive: true });
const zloc = join(w, "f.zip");
copyFileSync(OUT, zloc);
const dest = join(w, "x");
mkdirSync(dest, { recursive: true });
const pw = zloc.replace(/\\/g, "/");
const pd = dest.replace(/\\/g, "/");
run("powershell", ["-NoProfile", "-Command",
  `Expand-Archive -Path '${pw}' -DestinationPath '${pd}' -Force`]);

const set = readFileSync(join(dest, "word", "settings.xml"), "utf8");
const doc = readFileSync(join(dest, "word", "document.xml"), "utf8");

console.log("\n2) settings.xml:");
console.log("   evenAndOddHeaders(true)  :", /evenAndOddHeaders w:val="true"/.test(set));
console.log("   updateFields(true)       :", /updateFields w:val="true"/.test(set));
console.log("\n3) document.xml:");
console.log("   pgNumType lowerRoman     :", (doc.match(/fmt="lowerRoman"/g) || []).length);
console.log("   pgNumType decimal        :", (doc.match(/fmt="decimal"/g) || []).length);
console.log("   titlePg                  :", (doc.match(/<w:titlePg\/>/g) || []).length);
console.log("   sectProps oddPage type   :", (doc.match(/w:type /g) || []).length, "(all sectPr types == oddPage?)");
console.log("   sectPr w:type oddPage    :", (doc.match(/<w:type w:val="oddPage"\/>/g) || []).length);
console.log("   headerReference even     :", (doc.match(/w:type w:val="even"/g) || []).length);
console.log("   headerReference default  :", (doc.match(/w:type w:val="default"/g) || []).length);
console.log("   titlePg + oddPage (Deklarasi & Pengesahan) :",
  /<w:titlePg\/>/.test(doc) && /<w:type w:val="oddPage"\/>/.test(doc));
console.log("   manual PageBreak         :", (doc.match(/<w:br w:type="page"\/>/g) || []).length);
console.log("   pgNumType start=1        :", (doc.match(/w:start="1"/g) || []).lengthnnn);
