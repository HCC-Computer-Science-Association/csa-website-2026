# CSA Website · Plan

Static site for **Computer Science Association (CSA)** at Houston City College (HCC).
Built with Astro. Live at **https://hcc-csa.org/** before the Fall 2026 kickoff (late August 2026).

## Goals & audience

1. **Primary: prospective members.** HCC students who don't know the club. The site answers
   "what is CSA, is it alive, how do I join" in under 30 seconds.
2. **Secondary: current members.** The events hub plus workshop-slides archive keeps them coming back.

Joining the club means joining the Discord. Every page funnels there.

## Sitemap

| Page | Path | Purpose |
|---|---|---|
| Home | `/` | Pitch + funnel to Discord |
| Events | `/events` | Upcoming + auto-archived past events |
| About | `/about` | Mission + story |
| Team | `/team` | Officer board: photos, names, roles |
| Resources | `/resources` | Workshop slides archive |
| Join | `/join` | Why join, then one big Discord button |

## Homepage (section order)

1. **Hero**: CSA wordmark, tagline that explains the club in one line,
   primary CTA **"Join the Discord"**, secondary link "See events".
2. **About teaser**: two or three sentences (who we are, what we do, who it's for)
   with a "More about us" link to the About page.
3. **Upcoming events**: next 2 or 3 event cards, link to `/events`.
4. **Photo strip**: real event photos (placeholder slots until photos are provided).
5. **Stats bar**: real numbers. **700+ members · 100+ workshops · hackHCC (flagship hackathon)**.
   (Phrase the single hackathon as the flagship event rather than "1 hackathon".)
6. **Final join CTA**: repeat the Discord invite.

## Events model

- **Astro content collection**: one markdown file per event, officers add events by adding a file.
- **Cards only, no detail pages.** Big events (hackathons) get their own separately built websites;
  the card links out to them.
- Upcoming vs Past is **split automatically by date at build time**. Past events auto-archive and
  can show a cover photo plus a one-line recap on the card.
- Registration is external (**idloom / Webex Events**) via an optional `registrationUrl`.

Frontmatter schema (zod-validated):

```yaml
title: string
date: date            # start
endDate: date?        # multi-day events
time: string?         # display time, e.g. "6:00 PM"
location: string?
type: workshop | hackathon | social | other
registrationUrl: url?   # idloom / Webex Events redirect
websiteUrl: url?        # custom event site (hackathons)
cover: image?           # shown on past-event cards / promo
recap: string?          # one-liner shown after the event
```

Launch content: backfill 4 to 8 real past events (workshops, hackHCC, kickoff) plus the Fall 2026
kickoff as upcoming.

## Page notes

- **Join**: what membership gets you (workshops, hackathon, community, networking), ending in a
  single unmissable Discord invite button. Socials secondary.
- **Team**: grid of officers with headshot, name, role. Placeholder slots until photos arrive.
- **Resources**: workshop slides archive with links to slides/repos from past workshops, grouped by
  semester. Starts partial and grows over time.
- **About**: mission + story (founded, grown to 700+ members, ran hackHCC). No meeting-info
  section (scheduling lives in Events/Discord).

## Brand & design direction

- **Aesthetic: dark, technical, terminal/hacker vibe.** Dark-only theme (no light toggle).
  Must look professional and hand-crafted, explicitly *not* generic AI output.
- **Logo**: circuit-trace CSA wordmark. Files in `src/assets/`:
  `csa-white-logo.png` (dark backgrounds, primary), `csa-blue-logo.png`,
  `logo-black.png` (light contexts), `CSA-colors.png` (palette reference).
- **Palette** (from CSA-colors.png):
  - `#2001ED` electric blue (primary accent)
  - `#EDEA00` yellow / `#EDB100` amber (secondary accents, use sparingly)
  - `#3E376E` dark navy-purple (surface tint)
  - `#6E6E61` olive gray (muted details)
- Committed visual world: **"The Silkscreen"** (the site as a circuit board). See DESIGN.md.
- Copy style: no em dashes anywhere; club name written without a leading "the".

## Tech stack

- **Astro 5** (static output, zero client JS by default), **TypeScript**.
- **Tailwind CSS v4** with brand colors/type/spacing as theme tokens.
- Content collections for events, team, and resources (data-driven, officer-editable).
- Sitemap, OG tags, and favicon derived from the logo; site URL `https://hcc-csa.org`.

## Hosting & operations

- **GitHub Pages** via GitHub Actions deploy on push, plus a daily scheduled rebuild;
  custom domain `hcc-csa.org` (CNAME).
- **Maintainers: officers.** `CONTRIBUTING.md` explains how to add an event
  (copy a markdown file, edit frontmatter, push / open PR).
- Old project at `~/Documents/csa/csa-website` is abandoned. Fresh start, nothing carried over.

## Content checklist (user provides before/at launch)

- [ ] Discord invite URL (permanent), in `src/config.ts` (CI deploys fail while it's a TODO)
- [ ] Instagram handle, LinkedIn page URL, contact email, in `src/config.ts`
- [ ] Officer list: names, roles, headshots, in `src/content/team.yaml`
- [ ] Event photos for the homepage strip, in `src/assets/photos/`
- [ ] Past-event list to backfill (titles, dates, one-liners), in `src/content/events/`
- [ ] Fall 2026 kickoff details (date, time, room, registration link), in `src/content/events/fall-2026-kickoff.md`
- [ ] hackHCC site URL (`websiteUrl` in `src/content/events/hackhcc-2026.md`)
- [ ] Founding year / origin story (`src/pages/about.astro`)
- [ ] Workshop slides links for Resources, in `src/content/resources.yaml`
- [ ] Exact tagline / mission wording sign-off
