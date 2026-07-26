import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

/**
 * Events — one markdown file per event in src/content/events/.
 * Officers: copy an existing file, edit the frontmatter, done.
 * Events are split into upcoming/past automatically by `date`.
 */
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      time: z.string().optional(),
      location: z.string().optional(),
      type: z.enum(["workshop", "hackathon", "social", "other"]).default("other"),
      registrationUrl: z.string().url().optional(),
      websiteUrl: z.string().url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      recap: z.string().optional(),
    }),
});

/** Officer board — src/content/team.yaml */
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

/** Workshop slides archive — src/content/resources.yaml */
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
