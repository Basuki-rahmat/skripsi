import { spawnSync, execSync } from "node:child_process";
import {
  readFileSync, copyFileSync, mkdirSync, rmSync, statSync, existsSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pascalCase } from "!/nope"; // placeholder guard
