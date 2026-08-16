# Maintaining the CSA website

Written for officers. No web experience needed for the common tasks.

## Add an event

**Nothing to do here.** Events come from Eagle Engage:

> https://eagleengage.hccs.edu/organization/csa

Create the event there as usual. The site pulls the title, date, time,
location, description, and cover graphic straight from Engage and shows it
within a day. Fix a typo on Engage and the site follows; no commit needed.

Two things follow from that:

- **Engage is the source of truth.** Don't try to correct an event by editing
  this repo, the next rebuild would overwrite it.
- **Upload a cover graphic on Engage.** Events without one are skipped, since
  the cards are built around the image. Design it **wide, at 5:3** (e.g.
  1500x900). Engage center-crops whatever you give it to that shape when it
  stores the file, so a portrait flyer arrives here with its top and bottom
  already cut off and the site cannot recover them.

Events move from **Upcoming** to **Past** on their own, and a daily scheduled
rebuild means that happens even when nobody pushes anything.

### Recurring events

A title that repeats on three or more dates (the weekly Coding Club meetup) is
collapsed into **one** card showing the next date plus its cadence, so the page
isn't 30 copies of the same card. Keep the name consistent on Engage and this
happens by itself.

### The few things Engage can't hold

`src/content/events.overrides.yaml` adds the fields Engage has no box for, most
importantly a big event's own website. Key each block by the event's slug (its
title, lowercased and hyphenated):

```yaml
hackhcc-coderunners:
  websiteUrl: "https://hackhcc.com"
  recap: "One line shown on the card after the event has happened."
```

If a slug stops matching an event on Engage, the build fails and lists the
valid slugs, so a rename can't silently drop a link.

### When Engage is down

The last good response is committed to `src/data/engage-events.json`. If the
API is unreachable at build time, the site builds from that snapshot instead of
failing. It refreshes automatically on the next successful build; commit it
when it changes.

## Add photos

- **Homepage strip:** drop images into `src/assets/photos/`; the first four
  (alphabetical) appear automatically.
- **Event covers:** uploaded to Eagle Engage with the event, not stored here.

## Update the officer board

Edit `src/content/team.yaml`: name, role, order. Headshots go in
`src/assets/team/`, referenced as `photo: ../assets/team/yourname.jpg`.

## Update resources

Edit `src/content/resources.yaml`. While a link isn't ready, keep
`pending: true`; the row shows without a hyperlink. Flip it to `false`
when the URL is real.

## Site-wide settings

`src/config.ts` holds the Discord invite, socials, contact email, tagline,
and the stats bar numbers. **The Discord URL is still a TODO placeholder:
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

The look is a committed system called "The Silkscreen" (the site as a circuit
board). Before changing styles, read `DESIGN.md`. Short version: deep blue
ground, white silkscreen text, gold means the join action only, no glow
effects, and no em dashes in copy.
