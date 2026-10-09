# Sepp’s Workshop for fish: design

Date: 2026-10-09. Status: awaiting review.

## Goal

One fish theme, `sepps-workshop`, generated from `@sepps-workshop/design-system`, installable with one Fisher command and activated with one line in `config.fish`. The port decides which token feeds which fish variable and nothing about colour.

Blueprints: `vivid-life-fish` for the fish mechanics (theme file format, Fisher layout, install wording), `sepps-workshop-vs-code` for everything else (rules, tests, scaffolding, README voice).

## Decisions taken with the user

1. The foundation is fixed first: overlays get a value flattened over the terminal background (see "Foundation change"). The port ships only after that release.
2. Activation is explicit: the user adds `fish_config theme choose sepps-workshop` to `config.fish`. The repository ships no `conf.d/`, `functions/` or `completions/`, so Fisher installs the theme file and nothing that runs.
3. Scaffolding matches the VS Code port: MIT licence, Claude Code config and skills, pre-commit hook, Prettier, changelog, and the two Claude workflows.

## Foundation change (`sepps-workshop-design-system`, 0.7.0)

### Problem

The build gives each overlay a `hex`, the recipe composited over `surface.bg` (`#14284c`). fish cannot blend, and a standalone terminal sits on `surface.bg_terminal` (`#0d3174`). With `hex`, the selected pager row is `#3e423e`, a grey-olive patch on Darkblue. Composited over the terminal it is `#384a5f`. The VS Code port never meets this: its terminal sits on `surface.bg`, and VS Code blends `hexa` itself.

### Change

- `resolveTokens` adds `hex_terminal` to every overlay: the recipe composited over `surface.bg_terminal`. `hex` and `hexa` keep their meaning.
- Gate 2 gains the shell pairs, all at 4.5:1 on `hex_terminal`. For every `shell_roles` entry whose colour is an overlay: code text on a code overlay, `fg` and `fg_muted` on a label overlay. In addition, the colours of the three `pager_selected_*` text roles on the `pager_selected` overlay. Current values pass: the lowest are `number` at 4.84:1 on `find_match`, and `fg_muted` at 5.01:1 and `accent` at 5.24:1 on `selected_item`.
- `resolveTarget` is unchanged. A shell port reads `tokens.overlay[name].hex_terminal` for overlay targets.
- Docs: the overlay paragraph, the gate list and "For ports" in `README.md`, the handoff skill's overlay row (it also drops the outdated "until it is on npm" sentence), and a changelog entry. Unit tests for the new field and the new gate.
- Not changed: `colors.css` and the previews. No consumer needs the value there.

Additive, so a minor bump. The release itself (tag, push, npm publish through CI) is the user's step with the foundation's `/release` skill.

## The port

### Output

`themes/sepps-workshop.theme`, generated and committed. A flat theme file without `[dark]` or `[light]` sections, because there is one theme:

```
# name: 'Sepp’s Workshop'
# url: 'https://github.com/sepps-workshop/sepps-workshop-fish'
# preferred_background: <surface.bg_terminal without #>

fish_color_normal <hex>
…
```

The name comes from `tokens.meta.name`. The picker identifier is the file name, `sepps-workshop`.

### Mapping

`src/theme-template.mjs` exports a pure `buildTheme(tokens)` that returns the file content. It walks `tokens.shell_roles` in order and, for each role that lists fish variables, writes one line per variable:

- a colour target that starts with `overlay.` becomes `--background=<overlay.hex_terminal>`, with no foreground. Syntax colours stay visible on a selection, and the foundation gates them there;
- any other target is resolved with `resolveTarget` and written without `#`;
- each style becomes a flag (`italic`, `underline`). A role with a style and no colour, `valid_path`, is the flag alone.

Roles without a `fish` key (`number`, `variable`, `type`, `member`, `emphasis`) are skipped. `prompt_roles` lists no fish variables and is not read; the prompt belongs to the Starship port. `resolveTarget` throws on an unknown name, and the port adds no fallback.

### Left at fish defaults

fish variables with no role in the foundation are not written, and `fish_config theme choose` clears what a previous theme set there: `fish_color_cancel`, `fish_color_history_current`, `fish_color_match`, `fish_pager_color_background` and the four `fish_pager_color_secondary_*` variables. The README lists them. The ANSI palette is the terminal emulator's and belongs to the Windows Terminal port.

### Build

`build.mjs` writes the theme file and copies the README images (`sepps-workshop-header.jpg`, `sepp-recruiting.png`) from the foundation's `assets/` into `images/`, so they cannot drift. Same tokens in, byte-identical output.

### Tests (`node --test`)

1. Every fish variable a shell role lists is in the theme, with the value derived from the tokens (colour, flags, or `--background=` plus `hex_terminal`).
2. Nothing else is in the theme: every line is a comment, blank, or a variable a role lists.
3. No `#` in any value, and no `#` literal in `src/` or `build.mjs` outside comments.
4. `preferred_background` equals `surface.bg_terminal`.
5. The committed `themes/sepps-workshop.theme` and `images/` equal a fresh build.
6. Integration with the real fish: with `XDG_CONFIG_HOME` pointing at a temporary directory that holds only this theme, `fish_config theme choose sepps-workshop` prints no error, every variable has the expected value, and `set_color` accepts each one.

Test 6 needs fish on the machine that runs the tests. There is no CI test workflow for now, as in the VS Code port.

### Install (README)

```fish
fisher install sepps-workshop/sepps-workshop-fish
```

Fisher copies `themes/` into `~/.config/fish/themes/`. Without Fisher: download the one file into that directory (a `curl` one-liner on the raw file, and the `git clone` plus `cp` variant). Then one line in `config.fish`:

```fish
fish_config theme choose sepps-workshop
```

The README says that this line is what makes the choice persist, and that `fish_config theme show sepps-workshop` previews it. Requires fish 3.4 or later; tested on 4.9.

### README

English, no emoji, exact where technical, relaxed elsewhere. Sections: header image, what it is, install, recommended companions (a terminal on `surface.bg_terminal` with the Sepp’s Workshop ANSI colours, JetBrainsMono Nerd Font, the Starship port), how it is built, left at fish defaults, contributing (colour problems go to the foundation, mapping mistakes here), licence, and "Want to join Sepp’s Workshop?" as in the VS Code port. A screenshot needs a running terminal; the README gets one when the user adds `images/screenshot.png`.

### Scaffolding

Copied from the VS Code port and adapted in names and paths only: `.claude/settings.json` (without the vsce permissions, with `fish` ones), `.githooks/pre-commit`, `scripts/sync-config-table.sh`, `.gitignore`, `.prettierignore`, `.claudeignore`, `claude.yml` and `claude-code-review.yml`, `LICENSE` (MIT, sepp.med gmbh). The handoff skill is copied from the foundation to `.claude/skills/sepps-workshop/SKILL.md`. The release skill follows the `vivid-life-fish` one: version bump, changelog, tag, push, GitHub release, no registry.

`CLAUDE.md` and `CHANGELOG.md` are written for this port. `package.json` is private, MIT, version `0.1.0`, with `@sepps-workshop/design-system` `^0.7.0` and Prettier as the only dev dependencies.

## Order of work

1. Foundation: implement and test `hex_terminal`, commit locally.
2. Port: build everything against the local foundation checkout.
3. The user releases foundation 0.7.0.
4. Port: install `^0.7.0` from npm, regenerate the lockfile, rerun build and tests, commit.

## Out of scope

- Pushing, tagging and releasing either repository.
- Changing the user's own dotfiles to use the theme.
- A screenshot.
- A `conf.d` auto-activation snippet, a CI test workflow, npm publication of the port.

## After this ships

Ask whether the theme used the foundation correctly and log corrections to `.claude/learnings.md`, as the skill requires.
