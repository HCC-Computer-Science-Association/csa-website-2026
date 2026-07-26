# Maintaining the CSA website

Written for officers. No web experience needed for the common tasks.

## Add an event (the most common job)

1. Copy any file in `src/content/events/` (e.g. `python-basics.md`).
2. Rename it, e.g. `intro-to-sql.md` (lowercase, hyphens).
3. Edit the frontmatter (the block between `---`):

```yaml
---
title: "Intro to SQL"
date: 2026-09-14            # YYYY-MM-DD (start date)
endDate: 2026-09-15         # optional — only for multi-day events
time: "6:00 PM"             # optional
location: "Main Campus, Room 101"  # optional
type: workshop              # workshop | hackathon | social | other
registrationUrl: "https://..."  # optional — idloom / Webex Events link
websiteUrl: "https://..."   # optional — a dedicated event site (hackathons)
recap: "One line shown after the event happened."  # optional
---

One or two sentences describing the event. This shows on the card
while the event is upcoming.
```

4. Commit to `main` (or open a PR). The site deploys itself.

Events automatically move from **Upcoming** to **Past** by date — a scheduled
weekly rebuild (Mondays) handles this even with no commits. After an event, add
a `recap:` line and optionally a cover photo:

```yaml
cover: ../../assets/photos/intro-to-sql.jpg
coverAlt: "Students working through SQL exercises"
```

## Add photos

- **Homepage strip:** drop images into `src/assets/photos/` — first four
  (alphabetical) appear automatically.
- **Event covers:** same folder, referenced from the event's `cover:` field.

## Update the officer board

Edit `src/content/team.yaml` — name, role, order. Headshots go in
`src/assets/team/`, referenced as `photo: ../assets/team/yourname.jpg`.

## Update resources

Edit `src/content/resources.yaml`. While a link isn't ready, keep
`pending: true` — the row shows without a hyperlink. Flip it to `false`
when the URL is real.

## Site-wide settings

`src/config.ts` holds the Discord invite, socials, contact email, tagline,
and the stats bar numbers. **The Discord URL is still a TODO placeholder —
set it before launch.** The CI deploy intentionally fails while any TODO
remains in that file (see `placeholderGuard` in `astro.config.mjs`); for a
deliberate preview deploy set `ALLOW_PLACEHOLDERS=1` in the workflow.

## Run the site locally (optional)

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # production build into dist/
```

## Design rules

The look is a committed system ("The Silkscreen" — the site as a circuit
board). Before changing styles, read `DESIGN.md`. Short version: deep blue
ground, white silkscreen text, gold = the join action only, no glow effects.
