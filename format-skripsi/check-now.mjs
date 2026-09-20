import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const ROOT = "C:/laragon/www/skripsi";
const GEN = join(ROOT, "format-skripsi");
const OUT = join(GEN, "output", "template-skripsi-binus.docx");

const run = (cmd, args) =>
  new Promise((res) => {
    const c = spawn(cmd, args, { cwd: GEN, encoding: "utf8" });
    let out = "";
    c.stdout.on("data", (d) => (out += d));
    c.stderr.on("data", (d) => (out += d));
    c.on("close", (code) => res({ code, out }));
  });

const { code, out } = await run("npm", ["run", "generate"]);
console.log("npm exit:", code);
console.log("tail:", out.trim().split(/\n/).pop());

const buf = readFileSync(OUT);
const jszipPath = requireResolve("jszip");
const { default: JSZip } = await import(jszipPath);
const zip = await JSZip.loadAsync(buf);
const settings = await zip.file("word/settings.xml").async("string");
const document = await zip.file("word/document.xml").async("string");

const rep = (label, re) => console.log(label.padEnd(28), (document.match(re) || []).length);
console.log("\n-- document.xml --");
rep("lowerRoman", /fmt="lowerRoman"/g);
rep("decimal", /fmt="decimal"/g);
rep("titlePg", /<w:titlePg\/>/g);
rep("oddPage sect", /<w:type w:val="oddPage"\/>/g);
rep("even hdr ref", /w:type w:val="even"/g);
rep("default hdr ref", /w:type w:val="default"/g);
rep("manual pagebr", /<w:br w:type="page"\/>/g);
console.log("\n-- settings.xml --");
console.log("evenAndOddHeaders(true):", /evenAndOddHeaders w:val="true"/.test(settings));
console.log("updateFields(true)     :", /updateFields w:val="true"/.test(settings));
