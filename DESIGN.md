---
name: CSA — Computer Science Association
description: The club as a beautifully routed circuit board — blue soldermask, white silkscreen, gold pads.
colors:
  soldermask-deep: "#070c29"
  soldermask: "#0d1541"
  copper-pour: "#16204f"
  mask-purple: "#3e376e"
  signal-blue: "#2001ed"
  signal-bright: "#6d7dff"
  enig-gold: "#edb100"
  jumper-yellow: "#edea00"
  tin: "#6e6e61"
  silkscreen: "#f2f4ff"
  silkscreen-dim: "rgba(242, 244, 255, 0.66)"
  silkscreen-faint: "rgba(242, 244, 255, 0.55)"
  silkscreen-hair: "rgba(242, 244, 255, 0.16)"
typography:
  display:
    fontFamily: "Saira Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "0.025em"
  headline:
    fontFamily: "Saira Condensed, Arial Narrow, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.025em"
  title:
    fontFamily: "Saira Condensed, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.025em"
  body:
    fontFamily: "B612, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "B612 Mono, Courier New, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  pad: "2px"
components:
  button-primary:
    backgroundColor: "{colors.enig-gold}"
    textColor: "{colors.soldermask-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.pad}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "#ffc61a"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.silkscreen}"
    typography: "{typography.label}"
    rounded: "{rounded.pad}"
    padding: "14px 28px"
  card:
    backgroundColor: "rgba(13, 21, 65, 0.45)"
    rounded: "{rounded.pad}"
    padding: "24px"
---

# Design System: CSA — Computer Science Association

## Overview

**Creative North Star: "The Silkscreen"**

The site is a printed circuit board, not a website wearing circuit clip-art. Every
surface behaves like board material: the page ground is deep blue soldermask, all
text is silkscreen legend printed on it, interactive targets are gold-plated
pads, and attention is routed — literally — along copper traces with 45° bends,
vias, and test points. The CSA logo is already drawn in circuit traces; the site
is the board that logo was always part of.

The register is engineering documentation, not sci-fi: reference designators,
dimension callouts, pin-1 dots, a title block. Wit comes from using the board's
own grammar truthfully (the Join page is `J1` — J is the real designator class
for connectors). It stays legible and warm to a non-CS freshman: the board
grammar decorates and organizes, plain language persuades.

**Key Characteristics:**
- One material world: soldermask ground, silkscreen foreground, gold interaction.
- Traces are structural — they route the eye between real elements, never confetti.
- Engineering wit over hacker cliché: no glow, no glitch, no matrix rain.
- Dark-only, dense with quiet detail, generous with space.

## Colors

Brand palette (binding) mapped onto board materials; deep grounds derived from
the brand blue's hue.

### Primary
- **Signal Blue** (`signal-blue`): the "powered" color — the energized hero
  trace, large marks. Too dark for small text on the ground.
- **Signal Bright** (`signal-bright`): text-scale powered — links, active nav,
  the social event chip.

### Secondary
- **ENIG Gold** (`enig-gold`): gold-plated pads — primary CTA fill, pin-1 hover
  dots, event dates, hackathon chip, section designators. The most valuable
  surface on a board; spent on what matters most.
- **Jumper Yellow** (`jumper-yellow`): focus outlines, text selection, the PWR
  LED. A few marks per page at most.

### Neutral
- **Soldermask Deep** (`soldermask-deep`): page ground; also text-on-gold.
- **Soldermask** (`soldermask`): raised surfaces (join band).
- **Copper Pour** (`copper-pour`): hover fill for pinout rows.
- **Mask Purple** (`mask-purple`): reserved for special elevated surfaces.
- **Silkscreen / Dim / Faint / Hair**: text at three levels plus 1px hairlines —
  blue-tinted white, never gray.
- **Tin** (`tin`): reserved metallic detail; never text on blue (3.7:1).

### Named Rules
**The Gold Standard Rule.** ENIG Gold belongs to the highest-value action on the
page — normally exactly one Join pad per viewport region. If gold is everywhere,
nothing is plated.
**The Routed Attention Rule.** A trace exists only if it connects two real things
(U1→J1). Traces bend at 45°, end in pads or vias, and never cross text.

## Typography

**Display Font:** Saira Condensed 600/700 (self-hosted via Fontsource)
**Body Font:** B612 400/700 — the Airbus cockpit typeface
**Label/Mono Font:** B612 Mono 400/700

**Character:** cockpit-instrument clarity with drafting-table structure. Display
is always uppercase with `tracking-wide` (0.025em); labels are always uppercase
mono with 0.08em tracking (the `.legend` class).

### Hierarchy
- **Display** (700, clamp(2.75rem, 7vw, 5.5rem), 0.95): page hero only.
- **Headline** (700, text-3xl/4xl, 1.05): section titles via SectionHeader.
- **Title** (600, text-xl–2xl): card titles.
- **Body** (400, 1rem, 1.6): prose, capped at 52–65ch by context.
- **Label** (mono 400, 0.75rem, +0.08em, uppercase): designators, meta, nav,
  buttons, chips.

### Named Rules
**The Legend Rule.** Mono is for what a real board would print: designators,
values, dates, pinouts, controls. Prose is never mono.

## Layout

At ≥1024px the viewport carries a fixed 1px board outline inset 12px with
fiducial crosshairs in the corners; content lives on the board. Containers are
`max-w-6xl` with px-5/sm:px-8. Sections separated by 1px hairlines and py-16 to
py-24 (sm) rhythm; more space above headings than below. The ground carries a
24px layout grid at 2.5% white (`.grid-ground`) — justified: a board layout grid
is a real measurement surface. Section headers = gold designator eyebrow +
condensed uppercase headline + hairline rule ending in a via ring. Page
designators: U1 home, Y1 events, U2 about, J2 team, U3 resources, J1 join,
TP404 not-found. Card grids use `repeat(auto-fill, minmax(290px, 1fr))`.

## Elevation & Depth

Flat by default — a board is flat. Depth is tonal (deep → soldermask → pour)
plus hairline borders. Exactly one shadow in the system: the primary pad on
hover (`0 8px 20px -6px rgba(237,177,0,0.45)` with a -2px translate), read as
the pad physically lifting.

## Shapes

Sharp. 0–2px corners (pads get 2px). Circles belong to the drill file: vias
(`.via`, 8px ring), test points, pin-1 dots, fiducials, the J1 pad. Hairlines
are 1px. Dashed borders mark DNP (unpopulated) slots — awaiting real photos.
No pills, no large radii, no blobs.

## Components

### Buttons
- **Shape:** 2px radius pads.
- **Primary `.btn-pad`:** ENIG gold fill, Soldermask Deep text, mono 700
  0.8125rem uppercase, 14px 28px padding. Hover: #ffc61a, -2px lift, warm
  offset shadow. Active: settles back flat.
- **Secondary `.btn-silk`:** transparent, 1px silkscreen-faint border. Hover:
  border to full silkscreen + 6% white fill.

### Cards `.card-ic`
- IC-outline: 1px hairline border, soldermask 45% fill, pin-1 dot top-left
  (::before). Hover: border brightens, pin-1 dot turns gold. Event cards carry
  a mono refdes (WS1, HK1…) + bordered type chip (hackathon = gold, social =
  signal-bright, workshop = faint).

### Chips
- Bordered mono labels (`.legend` + border px-2 py-0.5), color by meaning;
  `pending` chip marks unlinked resources.

### Navigation
- Sticky header, hairline bottom border, 90% ground + backdrop blur. Links are
  `.legend` silkscreen-dim → silkscreen on hover; active page gets
  signal-bright + a 6px node dot + `aria-current`. Join is a compact primary
  pad. Mobile: logo + Join row, nav wraps beneath.

### Signature: the routed board
- BoardScene.astro — the hero's authored SVG (U1 → J1 powered net, passives,
  ground stitching). The powered net carries `.trace-pulse`, the site's one
  authored motion (5s loop, pathLength 620); `.led` breathes at 3.2s. Both
  disabled under `prefers-reduced-motion` (pulse renders as a static powered
  segment). Footer is an engineering title block with a J3 pinout of socials;
  the join band ends in `.edge-fingers`, a card-edge connector strip.

## Do's and Don'ts

### Do:
- **Do** route attention with traces that connect real elements, and keep the
  hero pulse as the site's only authored motion moment.
- **Do** use designators, dimension callouts, and pinout tables where a real
  drawing would.
- **Do** keep persuasion copy in plain, warm English; the board speaks in the
  margins.
- **Do** hold WCAG AA: silkscreen tints on any mask surface, Soldermask Deep on
  gold; focus is always the jumper-yellow 2px outline.

### Don't:
- **Don't** use neon glow, glassmorphism, gradient blobs, glitch effects, matrix
  rain, or scanlines — this is an engineering artifact, not a hacker movie.
- **Don't** bend a trace at 90°, cross text with a trace, or scatter traces as
  texture.
- **Don't** print body prose in mono or set Tin (#6e6e61) as text on blue.
- **Don't** use emoji in UI chrome; icons are drawn as board glyphs (vias, pads,
  traces) in the silkscreen grammar.
