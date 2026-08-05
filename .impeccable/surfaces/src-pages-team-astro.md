---
version: 1
slug: "src-pages-team-astro"
primary_target: "src/pages/team.astro"
related_targets: ["src/content/team.yaml"]
---

## Mode

Read. The visitor is establishing who runs CSA and whether the club is credible.
Comprehension and trust outrank expression; the officers are the content, the
board grammar organizes them.

## Concept

Each officer is an IC on the board. The card is the package outline (`.card-ic`
with its pin-1 dot), `PIN n` is the officer's position in the board order, and
external profile links are the connector pins printed along the package's
bottom edge.

## Decisions

- **Profile links are full-bleed connector rows at the card foot**, not inline
  text links and not a boxed button in the card body. They reuse the exact
  grammar of the footer's `J3 · Connect` pinout (hairline separators, mono
  legend, `hover:bg-pour`, trailing `↗`), so socials read identically on every
  surface of the site.
- **Left slot is a `.via`**, the ring that terminates a routed line, not
  `PIN n`: the card already spends `PIN n` on the officer's index, and a second
  pin number in the same card would collide. The via aligns exactly with the
  `PIN n` text column above it.
- **No gold on these rows.** The Gold Standard Rule reserves ENIG gold for the
  highest-value action per viewport region; 11 gold profile pads would strip
  the Join pad of its plating. The card's single gold accent stays the pin-1
  dot on hover.
- **No brand marks.** The footer's social pinout carries no logos, only words.
  Adding 11 LinkedIn glyphs here would be the only foreign brand repetition in
  the world. The mono word `LINKEDIN` names it unambiguously at legend size.
- **Card is `flex flex-col`** with a `grow p-6` body, so grid stretch aligns
  every card's connector rows across a row regardless of link count.

## Measured

- Connector row 47.2px tall (above the 44px touch floor) at both desktop and
  350px phone card width.
- Via left edge aligns to the `PIN n` column exactly (same computed x).
- `aria-label="<Name> on LinkedIn"` disambiguates 11 identical link texts.
- Row text is `silk-dim` (0.66) on card ground, above the system's own
  `silk-faint` AA floor.

## Open

Officer LinkedIn URLs are not yet supplied; every entry in team.yaml carries a
commented `linkedin:` line. Cards without a URL simply end after the role, so
the foot rows appear per officer as URLs land.
