import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tokens from "@sepps-workshop/design-system";
import { resolveTarget } from "@sepps-workshop/design-system/tools/build-tokens";
import { buildTheme, themeVars, THEME_ID } from "./theme-template.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const content = buildTheme(tokens);
const lines = content.split("\n");
const vars = Object.fromEntries(themeVars(tokens));

test("every fish variable a shell role lists is in the theme", () => {
  const listed = Object.values(tokens.shell_roles).flatMap((r) => r.fish ?? []);
  assert.ok(listed.length > 20, "the foundation lists fish variables");
  assert.deepEqual(Object.keys(vars).sort(), [...listed].sort());
  assert.equal(new Set(listed).size, listed.length, "no variable twice");
});

test("a text role is its resolved colour without the number sign", () => {
  const bare = (target) => resolveTarget(tokens, target).slice(1);
  assert.equal(vars.fish_color_command, bare(tokens.shell_roles.command.color));
  assert.equal(vars.fish_color_normal, bare("fg"));
  assert.equal(vars.fish_color_param, bare("fg"));
  assert.equal(vars.fish_color_error, bare("semantic.danger"));
});

test("an overlay role is a background flattened over the terminal", () => {
  for (const [key, overlay] of [
    ["fish_color_selection", "selection"],
    ["fish_color_search_match", "find_match"],
    ["fish_pager_color_selected_background", "selected_item"],
  ]) {
    assert.equal(
      vars[key],
      `--background=${tokens.overlay[overlay].hex_terminal.slice(1)}`,
    );
  }
});

test("styles become fish flags", () => {
  assert.equal(vars.fish_color_valid_path, "--underline");
  assert.match(vars.fish_color_comment, /^[0-9a-f]{6} --italics$/);
});

test("the file holds the header and the role variables, nothing else", () => {
  assert.equal(lines[0], `# name: '${tokens.meta.name}'`);
  assert.equal(
    lines[2],
    `# preferred_background: ${tokens.surface.bg_terminal.slice(1)}`,
  );
  const body = lines.filter((l) => l && !l.startsWith("#"));
  assert.deepEqual(
    body,
    themeVars(tokens).map(([k, v]) => `${k} ${v}`),
  );
  for (const line of body) {
    assert.ok(!line.includes("#"), `number sign in: ${line}`);
    assert.match(line, /^fish_(pager_)?color_\w+ \S/, `empty value: ${line}`);
  }
  assert.ok(content.endsWith("\n") && !content.endsWith("\n\n"));
});

test("the sources contain no colour value", () => {
  for (const file of ["src/theme-template.mjs", "build.mjs"]) {
    assert.doesNotMatch(
      read(file).toString("utf8"),
      /#[0-9a-f]{3,8}\b|\balphaOver\b/i,
      `${file} must take every colour from the tokens`,
    );
  }
});

test("the committed theme and images are what the build produces", () => {
  assert.equal(
    read(`themes/${THEME_ID}.theme`).toString("utf8"),
    content,
    "themes/ is stale: run `npm run build`",
  );
  for (const image of ["sepps-workshop-header.jpg", "sepp-recruiting.png"]) {
    const source = readFileSync(
      fileURLToPath(
        import.meta.resolve(`@sepps-workshop/design-system/assets/${image}`),
      ),
    );
    assert.ok(read(`images/${image}`).equals(source), `${image} is stale`);
  }
});
