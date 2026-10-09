// Maps the foundation's shell roles to a fish `.theme` file.
// One pure function: tokens -> file content.
//
// fish's own colour surface is the fish_color_* and fish_pager_color_*
// variables: syntax highlighting and the completion pager. The sixteen
// ANSI colours belong to the terminal emulator, not to this port.
// File format: `man fish_config`, section THEME FILES.

import { resolveTarget } from "@sepps-workshop/design-system/tools/build-tokens";

// The file name without extension: what `fish_config theme choose` takes.
export const THEME_ID = "sepps-workshop";
const HOMEPAGE = "https://github.com/sepps-workshop/sepps-workshop-fish";

// Foundation style name -> fish colour flag.
const FLAG = { italic: "italics", underline: "underline", bold: "bold" };

// fish writes a colour as six digits, without the number sign.
const bare = (colour) => colour.slice(1);

// One role -> the value of its fish variables, e.g. "9eadc7 --italics".
// An overlay is a background. fish cannot blend, so it takes the value
// the foundation flattened over the terminal background.
function roleValue(tokens, role) {
  const parts = [];
  if (role.color) {
    const [group, name] = role.color.split(".");
    parts.push(
      group === "overlay"
        ? `--background=${bare(tokens.overlay[name].hex_terminal)}`
        : bare(resolveTarget(tokens, role.color)),
    );
  }
  for (const style of role.style ?? []) parts.push(`--${FLAG[style]}`);
  return parts.join(" ");
}

// [variable, value] for every fish variable a shell role lists.
export function themeVars(tokens) {
  return Object.values(tokens.shell_roles).flatMap((role) =>
    (role.fish ?? []).map((name) => [name, roleValue(tokens, role)]),
  );
}

export function buildTheme(tokens) {
  return (
    [
      `# name: '${tokens.meta.name}'`,
      `# url: '${HOMEPAGE}'`,
      `# preferred_background: ${bare(tokens.surface.bg_terminal)}`,
      "",
      ...themeVars(tokens).map(([name, value]) => `${name} ${value}`),
    ].join("\n") + "\n"
  );
}
