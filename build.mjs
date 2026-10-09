// Reads foundation tokens from @sepps-workshop/design-system, emits the
// fish theme file and copies the README images from the foundation.

import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tokens from "@sepps-workshop/design-system";

import { buildTheme, THEME_ID } from "./src/theme-template.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const THEME = join(ROOT, "themes", `${THEME_ID}.theme`);
const IMAGES = join(ROOT, "images");

mkdirSync(dirname(THEME), { recursive: true });
writeFileSync(THEME, buildTheme(tokens), "utf8");

// The images are the foundation's; copying them here keeps them from drifting.
mkdirSync(IMAGES, { recursive: true });
for (const image of ["sepps-workshop-header.jpg", "sepp-recruiting.png"]) {
  copyFileSync(
    fileURLToPath(
      import.meta.resolve(`@sepps-workshop/design-system/assets/${image}`),
    ),
    join(IMAGES, image),
  );
}

console.log(`Built themes/${THEME_ID}.theme and images/`);
