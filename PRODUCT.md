# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: prospective members — Houston City College students (all majors, many
non-CS and total beginners) who don't know the club yet. They arrive from a flyer
QR code, Instagram, or word of mouth, deciding in under a minute whether CSA is
worth their time. Secondary: current members (~700) who return for upcoming
events and the workshop-slides archive.

## Product Purpose

The public face of the Computer Science Association (CSA), the student-run CS
club at Houston City College. Success = a visitor understands what CSA is,
believes it's active and credible, and joins the Discord (membership *is* the
Discord). Secondary success = members find the next event and past workshop
materials.

## Positioning

The largest, most active tech community at HCC: 700+ members, 100+ workshops
hosted, and hackHCC — the college's flagship student hackathon. Run entirely by
students, free, beginner-friendly, open to every major.

## Operating Context

- Events are announced on the site and Instagram; registration runs through
  third-party apps (idloom, Webex Events) via redirect links.
- Flagship events (hackathons) get separately built dedicated websites; the main
  site only links out to them.
- Officers maintain the site by editing markdown/YAML in a GitHub repo
  (content collections); no CMS.
- Launch deadline: before the Fall 2026 semester kickoff (late August 2026) —
  peak recruiting window.

## Capabilities and Constraints

- Static Astro 5 site, Tailwind CSS v4, TypeScript, zero client JS by default.
- Hosted on GitHub Pages, custom domain https://hcc-csa.org.
- Six pages: Home, Events, About, Team, Resources, Join.
- Events: cards only (no detail pages); auto-split upcoming/past by date at
  build time; past cards carry cover photo + one-line recap.
- Undecided/pending from officers: permanent Discord invite URL, Instagram and
  LinkedIn URLs, contact email, officer names/headshots, event photos, workshop
  slide links, exact kickoff details, hackHCC site URL.

## Brand Commitments

- Name: CSA — Computer Science Association at Houston City College.
- Logo: angular CSA wordmark with circuit-board traces (src/assets/:
  csa-white-logo.png primary on dark, csa-blue-logo.png, logo-black.png).
- Palette (binding, from CSA-colors.png): #2001ED electric blue (primary),
  #EDEA00 yellow, #EDB100 amber, #3E376E dark navy-purple, #6E6E61 olive gray.
- User-pinned aesthetic: dark, technical, terminal/hacker/"programs" vibe —
  professional, explicitly not generic AI-generated-looking.
- Dark-only theme (no light mode).

## Evidence on Hand

- Real stats (truthful, confirmed): 700+ members, 100+ workshops, hackHCC
  flagship hackathon (first edition ran ~May 2026).
- Real past events exist to backfill (workshops, hackHCC, kickoffs); seed
  markdown in src/content/events/ with TODO-marked dates.
- Event photos and officer headshots exist but are not yet provided — build
  with clearly labeled placeholder slots; never fabricate photos of real people
  or events.
- Do not invent: sponsor names, testimonials, meeting rooms/times, exact
  membership counts beyond "700+".

## Product Principles

1. Every page funnels to the Discord — joining must never be more than one
   click away.
2. Credibility through evidence, not adjectives: real numbers, real events, real
   photos over marketing copy.
3. Beginner-welcoming: a non-CS freshman must never feel the club is only for
   experts, even under a hacker aesthetic.
4. Officer-maintainable: adding an event = copying a markdown file; nothing on
   the site should require a designer to update.
5. The site is the club's proof of craft — it must look like something CSA
   members built well, not a template.

## Accessibility & Inclusion

Standard web accessibility (WCAG AA contrast on dark ground, keyboard
navigation, reduced-motion respect). Audience includes non-technical students —
terminal styling must never obscure meaning for them.
