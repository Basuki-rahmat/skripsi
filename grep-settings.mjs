import { readFileSync } from "node:fs";
const p = "C:/laragon/www/skripsi/format-skripsi/node_modules/docx/dist/index.mjs";
const t = readFileSync(p, "utf8");
let i = t.indexOf("this.settings = new Settings({");
let seg = t.slice(i, i + 420);
console.log(seg.replace(/\t/g, "  ").replace(/  \*/g, "  ") + "\n...");
