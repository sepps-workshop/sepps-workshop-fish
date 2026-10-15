# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.3.0] - 2026-10-15

### Changed

- Updated to `@sepps-workshop/design-system` 0.12.0.
- The selection is a light Sunset tint (`fish_color_selection` `--background=4e4d39`) instead of a near-black (`1b1f25`). The dark selection differed from the background mostly in hue and hardly in lightness, so it was easy to miss. Syntax colours on a selection now reach 3:1 instead of 4.5:1.

## [0.2.1] - 2026-10-13

### Changed

- README rewritten in a friendlier voice: Sepp, the robot the theme is named after, now introduces it. The instructions are unchanged.

## [0.2.0] - 2026-10-13

### Changed

- The theme builds on `@sepps-workshop/design-system` 0.9.0, which moves the terminal background from Darkblue (`#0d3174`) to the darker canvas (`#14284c`). The backgrounds of a selection, a search match and the selected pager row are computed for the new background, and `preferred_background` names it.

## [0.1.0] - 2026-10-09

### Added

- The Sepp’s Workshop theme for the fish shell: one generated file, `themes/sepps-workshop.theme`, built from the shell roles of `@sepps-workshop/design-system` and installable with Fisher.
- Tests that derive every expected value from the design system and load the built theme with the real fish.
