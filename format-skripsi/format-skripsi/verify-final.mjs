import { execSync } from "node:child_process";
import { readFileSync, copyFileSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const here = process.cwd();
const zip = join(here, "output", "template-skripsi-binus.docx");
const work = join(tmpdir(), "skripsi-verify-now");
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });
const zpath = join(work, "f.zip");
copyFileSync(zip, zpath);

const ps = `powershell -NoProfile -Command "Expand-Archive -Path '${zpath}' -DestinationPath '${join(work, "x")}' -Force"`;
execSync(ps, { stdio: "pipe" });

const st = readFileSync(join(work, "x", "word", "settings.xml"), "utf8");
console.log("[settings.xml]");
console.log("  evenAndOddHeaderAndFooters:", /evenAndOddHeaderAndFooters w:val="true"/.test(st));
console.log("  evenAndOddHeaderAndFooter :", /evenAndOddHeaderAndFooter ? w:val="true"/.test(st));
console.log("  updateFields              :", /updateFields w:val="true"/.test(st));

const d = readFileSync(join(work, "x", "word", "document.xml"), "utf8");
console.log("[document.xml]");
console.log("  sectPr sections           :", (d.match(/<w:sectPr[ >]/g) || []).length);
console.log("  pgNumType total           :", (d.match(/<w:pgNumType/g) || []).length);
console.log("  fmt=lowerRoman            :", (d.match(/w:fmt="lowerRoman"/g) || []).length);
console.log("  fmt=decimal               :", (d.match(/w:fmt="decimal"/g) || []).length);
console.log("  start=1                   :", (d.match(/w:start="1"/g) || []).length);
console.log("  even headerRef type       :", (d.match(/w:type="even"/g) || []).length);
console.log("  default headerRef type    :", (d.match(/w:type="default"/g) || []).length);
console.log("  titlePg                   :", (d.match(/<w:titlePg\/>/g) || []).length);
console.log("  oddPage type              :", (d.match(/w:type w:val="oddPage"/g) || []).length);
console.log("  manual PageBreak          :", (d.match(/<w:br w:type="page"\/>/g) || []).length);
