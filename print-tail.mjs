import { readFileSync } from "node:fs";
const p = "C:/laragon/www/skripsi/format-skripsi/src/generate.mjs";
const t = readFileSync(p, "utf8");
const lines = t.split(/\r?\n/);
for (let n = 570; n <= 579; n++) {
  console.log(String(n).padStart(4), lines[n - 1]);
}
