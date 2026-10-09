# sepps-workshop-fish

fish shell port of the [Sepp’s Workshop design system](https://github.com/sepps-workshop/sepps-workshop-design-system). Node.js + ESM. Reads tokens from `@sepps-workshop/design-system`; emits one theme file to `themes/`. One theme, no variants.

## Key Config Files

| File                                       | Purpose                                                                                 |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `.claude/learnings.md`                     | One-line corrections from past sessions; appended to, never rewritten                   |
| `.claude/settings.json`                    | Permissions, secret-file guard, PostToolUse Prettier hook, env defaults                 |
| `.claude/skills/release/SKILL.md`          | `/release` skill: version bump → CHANGELOG → tag → push → GitHub release                |
| `.claude/skills/sepps-workshop/SKILL.md`   | Port-side skill: how to read foundation tokens; copied from the foundation's `handoff/` |
| `.claudeignore`                            | Paths Claude Code should skip when indexing (`node_modules/`, `themes/`)                |
| `.githooks/pre-commit`                     | Runs sync-config-table.sh and gitleaks on every commit                                  |
| `.github/workflows/claude-code-review.yml` | Auto-reviews PRs with Claude on open/synchronize                                        |
| `.github/workflows/claude.yml`             | Responds to `@claude` mentions in issues, PRs, and review comments                      |
| `.gitignore`                               | Git ignore patterns                                                                     |
| `.prettierignore`                          | Paths Prettier must skip: generated `themes/` and `images/`                             |
| `build.mjs`                                | Reads foundation tokens, emits the theme file to `themes/` and copies the README images |
| `package.json`                             | npm scripts (`build`, `test`, `format`) and the design-system devDependency             |
| `scripts/sync-config-table.sh`             | Keeps this table in sync with the filesystem (called by pre-commit)                     |

## Commands

- `npm install` — fetch deps (foundation tokens, prettier)
- `npm run build` — read tokens, emit `themes/sepps-workshop.theme` and `images/`
- `npm test` — template tests, then an integration test that loads the theme with the real fish
- `npm run format` — run Prettier on the project

After cloning, run `git config core.hooksPath .githooks` to enable the pre-commit hook.

## Structure

- `build.mjs` — top-level build script
- `src/theme-template.mjs` — pure `buildTheme(tokens)`: walks `tokens.shell_roles`, writes one fish variable per line
- `src/theme-template.test.mjs` — unit tests; expected values come from the tokens
- `src/fish.test.mjs` — runs fish against the built theme in a temporary `XDG_CONFIG_HOME`
- `themes/` — **generated**, committed (Fisher installs it straight from the repository)
- `images/` — **generated**: copied by the build from the foundation's `assets/`

## References

`.claude/skills/sepps-workshop/SKILL.md` **Read when:** adding or changing any colour mapping. It maps port needs to foundation tokens.

`node_modules/@sepps-workshop/design-system/README.md` **Read when:** you need to know what a role means or why a value is what it is.

`docs/superpowers/specs/2026-10-09-fish-port-design.md` **Read when:** you need the reasoning behind a mapping or the install story.

## Conventions

- **No colour in this repository.** No hex value and no alpha arithmetic in `src/` or `build.mjs`. A test fails on either.
- **The foundation decides which variables exist.** The template writes the fish variables that `shell_roles` lists and no others. A variable with no role is not set; list it in the README.
- **Overlays are backgrounds, flattened for the terminal.** A role whose colour is `overlay.<name>` becomes `--background=` with `overlay.<name>.hex_terminal`, and no foreground.
- **Foundation gaps go upstream.** A value the port needs and cannot find is fixed in `sepps-workshop-design-system`, not approximated here.
- **Resolve role names with `resolveTarget`.** It throws on an unknown name; do not add a fallback.
- **Fisher installs what it finds.** Of the directories Fisher copies (`functions/`, `conf.d/`, `completions/`, `themes/`), only `themes/` may exist. Activation is the user's one line in `config.fish`.
- **Scope.** fish colours syntax and the pager. The ANSI palette belongs to the terminal port, the prompt to the Starship port.
- **Determinism.** Same tokens in, byte-identical theme out. `npm test` fails if `themes/` or `images/` is stale.
- **Writing.** The product name is written "Sepp’s Workshop" with a typographic apostrophe, the company "sepp.med gmbh". Docs are English, exact where technical, no emoji.

## Don't

- Don't hand-edit `themes/*.theme` or `images/`; run `npm run build`.
- Don't add a second theme, a variant, or `[dark]`/`[light]` sections.
- Don't add `conf.d/`, `functions/` or `completions/`.
- Don't commit secrets. Don't use `--force`.

## Learnings

When the user corrects a mistake or points out a recurring issue, append a one-line summary to `.claude/learnings.md`. Don't modify CLAUDE.md directly.

## Compact Instructions

When compacting, preserve: list of modified files, current test status, open TODOs, and key decisions made.
