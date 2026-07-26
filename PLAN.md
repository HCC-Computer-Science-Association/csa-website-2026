# CSA Website — Plan

Static site for the **Computer Science Association (CSA)** at Houston City College (HCC).
Built with Astro. Live at **https://hcc-csa.org/** before the Fall 2026 kickoff (late August 2026).

## Goals & audience

1. **Primary: prospective members** — HCC students who don't know the club. The site answers
   "what is CSA, is it alive, how do I join" in under 30 seconds.
2. **Secondary: current members** — events hub + workshop-slides archive keeps them coming back.

Joining the club = joining the Discord. Every page funnels there.

## Sitemap

| Page | Path | Purpose |
|---|---|---|
| Home | `/` | Pitch + funnel to Discord |
| Events | `/events` | Upcoming + auto-archived past events |
| About | `/about` | Mission + story |
| Team | `/team` | Officer board: photos, names, roles |
| Resources | `/resources` | Workshop slides archive |
| Join | `/join` | Why join → one big Discord button |

## Homepage (section order)

1. **Hero** — CSA logo/wordmark, tagline that explains the club in one line,
   primary CTA **"Join the Discord"**, secondary link "See upcoming events".
2. **About teaser** — 2–3 sentences (who we are, what we do, who it's for) + link to `/about`.
3. **Upcoming events** — next 2–3 event cards, link to `/events`.
4. **Photo strip** — row of real event photos (placeholder slots until photos are provided).
5. **Stats bar** — real numbers: **700+ members · 100+ workshops · hackHCC (flagship hackathon)**.
   (Phrase the single hackathon as the flagship event rather than "1 hackathon".)
6. **Final join CTA** — repeat the Discord invite.

## Events model

- **Astro content collection** — one markdown file per event, officers add events by adding a file.
- **Cards only, no detail pages.** Big events (hackathons) get their own separately-built websites;
  the card links out to them.
- Upcoming vs Past is **split automatically by date at build time**. Past events auto-archive and
  can show a cover photo + one-line recap on the card.
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

Launch content: backfill 4–8 real past events (workshops, hackHCC, kick-off) + Fall 2026 kickoff
as upcoming.

## Page notes

- **Join**: what membership gets you (workshops, hackathon, community, networking) → single
  unmissable Discord invite button. Socials secondary.
- **Team**: grid of officers — headshot, name, role. Placeholder avatars until photos arrive.
- **Resources**: workshop slides archive — links to slides/repos from past workshops, grouped by
  topic or semester. Start partial; grows over time.
- **About**: mission + story (founded → grown to 700+ members → ran hackHCC). No meeting-info
  section (scheduling lives in Events/Discord).

## Brand & design direction

- **Aesthetic: dark, technical, terminal/hacker vibe.** Dark-only theme (no light toggle).
  Must look professional and hand-crafted — explicitly *not* generic AI-slop.
- **Logo**: circuit-trace CSA wordmark. Files in `assets/brand/`:
  `csa-white-logo.png` (dark backgrounds — primary), `csa-blue-logo.png`,
  `logo-black.png` (light contexts), `CSA-colors.png` (palette reference).
- **Palette** (from CSA-colors.png):
  - `#2001ED` electric blue (primary accent)
  - `#EDEA00` yellow / `#EDB100` amber (secondary accents — use sparingly)
  - `#3E376E` dark navy-purple (surface tint)
  - `#6E6E61` olive gray (muted text/borders)
- Design pass: **impeccable** skill (installed at `.claude/skills/impeccable/`), run by the user.

## Tech stack

- **Astro 5** (static output, zero client JS by default), **TypeScript**.
- **Tailwind CSS v4** — brand colors/type/spacing as theme tokens.
- Content collections for events, team, and resources (data-driven, officer-editable).
- Sitemap + OG tags + favicon derived from the logo; site URL `https://hcc-csa.org`.

## Hosting & operations

- **GitHub Pages** via GitHub Actions deploy on push; custom domain `hcc-csa.org` (CNAME).
- **Maintainers: officers.** Write a short `CONTRIBUTING.md`: how to add an event
  (copy a markdown file, edit frontmatter, push / open PR).
- Old project at `~/Documents/csa/csa-website` is abandoned — fresh start, nothing carried over.

## Content checklist (user provides before/at launch)

- [ ] Discord invite URL (permanent) — `src/config.ts` (CI deploys fail while it's a TODO)
- [ ] Instagram handle, LinkedIn page URL, contact email — `src/config.ts`
- [ ] Officer list: names, roles, headshots — `src/content/team.yaml`
- [ ] Event photos for the homepage strip — `src/assets/photos/`
- [ ] Past-event list to backfill (titles, dates, one-liners) — `src/content/events/`
- [ ] Fall 2026 kickoff details (date, time, room, registration link) — `src/content/events/fall-2026-kickoff.md`
- [ ] hackHCC site URL — `websiteUrl` in `src/content/events/hackhcc-2026.md`
- [ ] Founding year / origin story — `src/pages/about.astro`
- [ ] Workshop slides links for Resources — `src/content/resources.yaml`
- [ ] Exact tagline / mission wording sign-off
