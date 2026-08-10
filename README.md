# CSA Website

The website of **Computer Science Association** at Houston City College, live
at [hcc-csa.org](https://hcc-csa.org).

Static site built with [Astro 5](https://astro.build) + Tailwind CSS v4.
Content (events, team, resources) lives in markdown/YAML collections that any
officer can edit; see [CONTRIBUTING.md](CONTRIBUTING.md).

## Quick start

```bash
pnpm install
pnpm dev        # dev server at http://localhost:4321
pnpm build      # static build into dist/
pnpm preview    # serve the build locally
```

## How it's organized

```
src/
  config.ts            site name, Discord invite, socials, stats
  lib/engage.ts        pulls events from Eagle Engage at build time
  data/engage-events.json  last good Engage response (offline fallback)
  content/events.overrides.yaml  per-event extras Engage has no field for
  content/team.yaml    officer board
  content/resources.yaml  workshop slides archive
  components/          board-grammar UI (cards, pads, traces, title block)
  pages/               index, events, about, team, resources, join, 404
  assets/              brand logos, event photos, headshots
```

Deploys to GitHub Pages on every push to `main` via
`.github/workflows/deploy.yml`, plus a daily scheduled rebuild so events
rotate from Upcoming to Past on their own.

Design system: see [DESIGN.md](DESIGN.md) ("The Silkscreen"). Product context:
[PRODUCT.md](PRODUCT.md). Launch checklist: [PLAN.md](PLAN.md).
