// Loads the built theme with the real fish, in a throwaway config
// directory, so the user's own themes and variables cannot mask a problem.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import tokens from "@sepps-workshop/design-system";
import { themeVars, THEME_ID } from "./theme-template.mjs";

const config = mkdtempSync(join(tmpdir(), "sepps-workshop-fish-"));
const themes = join(config, "fish", "themes");
mkdirSync(themes, { recursive: true });
copyFileSync(
  fileURLToPath(new URL(`../themes/${THEME_ID}.theme`, import.meta.url)),
  join(themes, `${THEME_ID}.theme`),
);
// A previous theme that sets a variable Sepp’s Workshop leaves alone.
writeFileSync(join(themes, "previous.theme"), "fish_color_cancel --reverse\n");

function fish(script, ...args) {
  const run = spawnSync("fish", ["-c", script, ...args], {
    encoding: "utf8",
    env: { ...process.env, XDG_CONFIG_HOME: config },
  });
  assert.equal(run.error, undefined, "fish must be installed to run this test");
  return run;
}

const DUMP = `
fish_config theme choose previous
fish_config theme choose ${THEME_ID}
or exit 1
for name in (set --names | string match -r '^fish_(?:pager_)?color_.*')
    echo $name="$$name"
end`;

test("fish applies the theme without complaint and with the built values", () => {
  const run = fish(DUMP);
  assert.equal(run.stderr, "");
  assert.equal(run.status, 0);
  // fish 4.3+ tags each value with the theme it came from.
  const actual = Object.fromEntries(
    run.stdout
      .trim()
      .split("\n")
      .map((line) => line.replace(` --theme=${THEME_ID}`, ""))
      // A value such as --background=1a212d holds a second "=".
      .map((line) => [
        line.slice(0, line.indexOf("=")),
        line.slice(line.indexOf("=") + 1),
      ]),
  );
  for (const [name, value] of themeVars(tokens)) {
    assert.equal(actual[name], value, name);
  }
});

test("a variable the theme does not set loses the previous theme's value", () => {
  const run = fish(DUMP);
  assert.doesNotMatch(run.stdout, /^fish_color_cancel=.*reverse/m);
});

test("set_color accepts every value", () => {
  const run = fish(
    `fish_config theme choose ${THEME_ID}
     for name in $argv
         set_color $$name >/dev/null
         or echo "rejected: $name"
     end`,
    ...themeVars(tokens).map(([name]) => name),
  );
  assert.equal(run.stderr, "");
  assert.equal(run.stdout, "");
});
