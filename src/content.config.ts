import { defineCollection, z } from "astro:content";
import type { Loader } from "astro/loaders";
import { file } from "astro/loaders";
import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";

import { fetchEngageEvents, normalizeEvents, type NormalizedEvent } from "./lib/engage";

/**
 * Events come from Eagle Engage, not from files in this repo. See
 * src/lib/engage.ts for the why and the fetching details; officers add and
 * edit events at https://eagleengage.hccs.edu/organization/csa.
 */
const eventSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(["workshop", "hackathon", "social", "other"]).default("other"),
  /** Card blurb, distilled from the Engage description. */
  summary: z.string(),
  /** Set on a collapsed recurring series, e.g. "Weekly, every Friday". */
  recurrence: z.string().optional(),
  occurrences: z.number().default(1),
  registrationUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  /** Engage CDN graphic. Remote, so it is rendered as a plain <img>. */
  coverUrl: z.string().url(),
  coverAlt: z.string(),
  /** The event's page on Eagle Engage, for RSVP and full details. */
  sourceUrl: z.string().url(),
  recap: z.string().optional(),
});

/** The fields events.overrides.yaml is allowed to set. */
const overrideSchema = eventSchema
  .pick({ type: true, summary: true, registrationUrl: true, websiteUrl: true, recap: true })
  .partial();

const OVERRIDES_PATH = new URL("./content/events.overrides.yaml", import.meta.url);

function readOverrides(): Map<string, z.infer<typeof overrideSchema>> {
  const raw = parseYaml(readFileSync(OVERRIDES_PATH, "utf8")) ?? {};
  return new Map(
    Object.entries(raw as Record<string, unknown>).map(([slug, value]) => [
      slug,
      overrideSchema.parse(value ?? {}),
    ]),
  );
}

/**
 * Pulls the Engage feed, applies local overrides, and stores each event under
 * its slug. Runs on `astro dev` start and on every `astro build`, so the daily
 * scheduled rebuild is what keeps the live site in step with Engage.
 */
function engageEvents(): Loader {
  return {
    name: "eagle-engage",
    load: async ({ store, parseData, logger }) => {
      const { events: raw, source, error } = await fetchEngageEvents();
      if (source === "snapshot") {
        logger.warn(`Eagle Engage unreachable (${error}); using the committed snapshot.`);
      }

      const events = normalizeEvents(raw);
      const overrides = readOverrides();

      const slugs = new Set(events.map((event) => event.slug));
      for (const slug of overrides.keys()) {
        if (!slugs.has(slug)) {
          throw new Error(
            `events.overrides.yaml has an entry for "${slug}", which no longer matches an event ` +
              `on Eagle Engage. Rename it to one of: ${[...slugs].sort().join(", ")}`,
          );
        }
      }

      store.clear();
      for (const event of events) {
        const { slug, engageId, ...fields } = event satisfies NormalizedEvent;
        const data = await parseData({
          id: slug,
          data: { ...fields, ...overrides.get(slug) },
        });
        store.set({ id: slug, data, digest: `${engageId}:${JSON.stringify(data)}` });
      }

      logger.info(`Loaded ${events.length} events from Eagle Engage (${source}).`);
    },
  };
}

const events = defineCollection({ loader: engageEvents(), schema: eventSchema });

/** Officer board: src/content/team.yaml */
const team = defineCollection({
  loader: file("src/content/team.yaml"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      order: z.number().default(99),
    }),
});

/** Workshop slides archive: src/content/resources.yaml */
const resources = defineCollection({
  loader: file("src/content/resources.yaml"),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    kind: z.enum(["slides", "repo", "recording", "link"]).default("link"),
    topic: z.string(),
    semester: z.string(),
    /** true = listed but link not wired yet; renders without a hyperlink */
    pending: z.boolean().default(false),
  }),
});

export const collections = { events, team, resources };
