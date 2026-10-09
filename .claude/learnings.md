# Learnings

- 2026-10-09: fish cannot blend and paints on the terminal background, so overlay backgrounds come from `overlay.<name>.hex_terminal`, not `.hex` (which is flattened over the editor canvas).
- 2026-10-09: Fisher installs only `functions/`, `conf.d/`, `completions/` and `themes/`. Shipping only `themes/` means `fisher install` puts the theme file in place and runs nothing.
- 2026-10-09: The picker identifier of a fish theme is the file name without `.theme`, not the `# name:` comment. fish 4.3+ appends `--theme=<id>` to each variable a theme sets and empties the variables a previous theme set, so a variable this theme leaves out is drawn plain, not with fish's default.
- 2026-10-09: In fish, `echo $name=$$name` expands as a cartesian product when the variable is a list; quote it as `"$$name"`.
