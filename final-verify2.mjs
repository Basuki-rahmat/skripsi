import { spawnSync, execSync } from "node:child_process";
import { readFileSync, copyFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = "C:/laragon/www/skripsi";
const GEN_DIR = join(ROOT, "format-skripsi");
const OUT = join(GEN_DIR, "output", "template-skripsi-binus.docx");

const step = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", cwd: GEN_DIR, shell: true });
  if (r.status !== 0) throw new Error((r.stderr || r.stdout || "fail").slice(0, 600));
  return r.stdout || "";
};

console.log("1) regenerate...");
console.log(step("npm", ["run", "generate"]).trim());

const w = join(tmpdir(), "skr-v11");
rmSync(w, { recursive: true, force: true });
mkdirSync(w, { recursive: true });
const zip = join(w, "f.zip");
copyFileSync(OUT, zip);
const dest = join(w, "x");
mkdirSync(dest, { recursive: true });
execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${zip}' -DestinationPath '${dest}' -Force"`, { encoding: "utf8" });

const s = readFileSync(join(dest, "word", "settings.xml"), "utf8");
const d = readFileSync(join(dest, "word", "document.xml"), "utf8");

console.log("2) settings.xml:");
console.log("   evenAndOddHeaders(true):", /evenAndOddHeaders w:val="true"/.test(s));
console.log("   updateFields(true)     :", /updateFields w:val="true"/.test(s));
console.log("3) document.xml:");
console.log("   fmt=lowerRoman         :", (d.match(/fmt="lowerRoman"/g) || []).length);
console.log("   fmt=decimal            :", (d.match(/fmt="decimal"/g) || []).length);
console.log("   titlePg                :", (d.match(/<w:titlePg\/>/g) || []).length);
console.log("   sectType oddPage       :", (d.match(/w:val="oddPage"/g) || []).length);
console.log("   header even type       :", (d.match(/w:type w:val="even"/g) || []).length);
console.log("   header default type    :", (d.match(/w:type w:val="default"/g) || []).length);
console.log("   manual PageBreak       :", (d.match(/<w:br w:type="page"\/>/g) || []).length);
console.log("   pgNumType count        :", (d.match(/<w:pgNumType/g) || []).length);
