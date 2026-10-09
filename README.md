<p align="center">
  <img src="./images/sepps-workshop-header.jpg" width="100%" alt="Sepp, the blue robot, assembling code blocks with a wrench in his workshop" />
</p>

# Sepp’s Workshop for fish

<p>
  <img src="https://img.shields.io/badge/WCAG-AA-3aaa35" alt="WCAG AA" />
  <img src="https://img.shields.io/badge/license-MIT-b2b2b2" alt="MIT license" />
</p>

One dark colour theme for the [fish shell](https://fishshell.com/), built on sepp.med Darkblue with Sunset yellow as the accent. It colours what you type and the completion pager. There are no variants and nothing to configure: this is the one theme.

The colours come from the [Sepp’s Workshop design system](https://github.com/sepps-workshop/sepps-workshop-design-system), whose build refuses to ship a text colour that fails WCAG AA on its background. That includes the text on a selection and on the selected row of the pager.

## Install

With [Fisher](https://github.com/jorgebucaran/fisher):

```fish
fisher install sepps-workshop/sepps-workshop-fish
```

Fisher copies the theme into `~/.config/fish/themes/`. Nothing else is installed: no functions, no startup snippet.

Without Fisher, download the one file:

```fish
mkdir -p ~/.config/fish/themes
curl -fsSL https://raw.githubusercontent.com/sepps-workshop/sepps-workshop-fish/main/themes/sepps-workshop.theme -o ~/.config/fish/themes/sepps-workshop.theme
```

Or clone the repository and copy the file:

```fish
git clone https://github.com/sepps-workshop/sepps-workshop-fish
mkdir -p ~/.config/fish/themes
cp sepps-workshop-fish/themes/sepps-workshop.theme ~/.config/fish/themes/
```

Then switch it on by adding one line to `~/.config/fish/config.fish`:

```fish
fish_config theme choose sepps-workshop
```

`fish_config theme choose` applies to the running session only, so this line is what makes the theme stick. To look before you commit, run `fish_config theme show sepps-workshop`.

The theme is tested with fish 4.9. Theme files need fish 3.4 or later.

## Recommended companions

- **Terminal colours**: a fish theme colours the command line, not the terminal. This one expects a Darkblue terminal background (`#0d3174` in the design system) and looks best with the sixteen Sepp’s Workshop ANSI colours, which belong to the terminal port. Every colour is chosen and checked for that background. On another dark background selections and the selected pager row will look off, and on a light one the text is hard to read.
- **Font**: themes cannot ship fonts. The design system recommends [JetBrains Mono](https://www.jetbrains.com/lp/mono/), or [JetBrainsMono Nerd Font](https://www.nerdfonts.com/font-downloads) if your prompt shows icons.
- **Prompt**: the theme does not touch your prompt. It sets the colours fish's own prompts use for the directory, the user and the host; a [Starship](https://starship.rs) prompt brings its own.

## How it is built

The theme file is generated. The design system says what colour a command, an option or an autosuggestion is, and lists the fish variables each of those roles feeds. This repository turns that list into a theme file. It contains no colour value of its own, and a test fails if one appears.

A few things follow from the palette and are deliberate:

- Commands are cyan-blue, not the accent: the cursor is already yellow, and a typed command is a call.
- Comments and autosuggestions share a colour. Comments are italic, which tells them apart.
- A selection darkens the background and keeps the syntax colours on top of it.
- Red is a signal only: errors, a failed status, the root user's directory.
- fish cannot blend colours, so the backgrounds of selections and of the selected pager row are computed for the Darkblue terminal background.

### Not set by the theme

The design system has no role for these variables, so the theme leaves them out on purpose:

- `fish_color_cancel`, `fish_color_history_current`, `fish_color_match`
- `fish_pager_color_background`
- `fish_pager_color_secondary_background`, `fish_pager_color_secondary_completion`, `fish_pager_color_secondary_description`, `fish_pager_color_secondary_prefix`

From fish 3.5 on, choosing a theme clears these, so they do not keep what a previous theme put there; on fish 3.4 they may. Cleared, the secondary pager colours fall back to the primary ones and the rest are drawn plain. If you want one of them styled, set it yourself after the `fish_config theme choose` line.

## Contributing

You need Node.js 20 or later, and fish for the tests.

```bash
npm install
npm run build   # regenerates themes/ and images/ from @sepps-workshop/design-system
npm test
```

The file under `themes/` is generated; edit `src/theme-template.mjs` and rebuild. To try a local build, copy `themes/sepps-workshop.theme` into `~/.config/fish/themes/` and run `fish_config theme choose sepps-workshop`.

If a colour looks wrong, or two things are hard to tell apart, the cause is almost always in the design system and not in this port. Please open the issue [there](https://github.com/sepps-workshop/sepps-workshop-design-system/issues). A mapping mistake (the right colour on the wrong variable) belongs here.

## License

MIT. See [LICENSE](./LICENSE).

## Want to join Sepp’s Workshop?

<img align="right" width="150" src="./images/sepp-recruiting.png" alt="Sepp, the blue robot, holding a sign that reads Be you – with us!" />

sepp.med builds and tests software for places where a bug is more than an inconvenience: medical devices, cars, aircraft. We have been doing it since 1980, as a family-run company in the Nuremberg metropolitan region. If you would rather get the contrast ratio right than argue about it, you might like it here.

Browse the [open positions](https://www.seppmed.com/career/open-positions/), or send a [speculative application](https://www.seppmed.com/career/speculative-application/) if none of them fits yet. Be you – with us.
