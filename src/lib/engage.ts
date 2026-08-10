/**
 * Eagle Engage (Anthology Engage) is the source of truth for events.
 *
 * Officers create events at https://eagleengage.hccs.edu/organization/csa and
 * this module pulls them in at build time. Nobody edits event content in this
 * repo; the only local knob is `src/content/events.overrides.yaml`, for the few
 * things Engage has no field for (a hackathon's own website, mainly).
 *
 * The daily rebuild in .github/workflows keeps the site in step with Engage
 * even when nothing is committed.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/** CSA's organization id in Engage. Found via the discovery organization search. */
export const ORGANIZATION_ID = 415695;

const HOST = "https://eagleengage.hccs.edu";
const IMAGE_CDN = "https://se-images.campuslabs.com/clink/images";

/**
 * Last good API response, committed to the repo. Engage being down, slow, or
 * behind a network block must not take the site's deploy with it: the loader
 * falls back to this file and the build carries on with slightly stale events.
 */
const SNAPSHOT_PATH = new URL("../data/engage-events.json", import.meta.url);

/** Events run in Houston. Engage returns UTC; every displayed date is local. */
const TIME_ZONE = "America/Chicago";

/** Shape of one event in the Engage discovery search response (fields we use). */
export interface EngageEvent {
  id: string;
  name: string;
  description: string;
  location: string | null;
  startsOn: string;
  endsOn: string;
  imagePath: string | null;
  theme: string | null;
  categoryNames: string[];
  status: string;
  visibility: string;
}

/** One event as the site renders it, after cleanup and recurrence collapsing. */
export interface NormalizedEvent {
  slug: string;
  engageId: string;
  title: string;
  /** UTC midnight of the Houston calendar date, matching the rest of the site. */
  date: Date;
  /** Only set when the event genuinely spans more than one Houston day. */
  endDate?: Date;
  time?: string;
  location?: string;
  type: "workshop" | "hackathon" | "social" | "other";
  summary: string;
  coverUrl: string;
  coverAlt: string;
  sourceUrl: string;
  /** e.g. "Weekly, every Friday". Present only on collapsed recurring series. */
  recurrence?: string;
  /** How many dates the series has in the feed. 1 for one-off events. */
  occurrences: number;
}

// --- fetching ---------------------------------------------------------------

/**
 * All approved, public CSA events Engage knows about, past and future.
 * `endsAfter` is the API's only way to ask for history, so it is set to a date
 * before the club started publishing to Engage.
 */
function searchUrl(): string {
  const params = new URLSearchParams({
    endsAfter: "2000-01-01T00:00:00+00:00",
    orderByField: "endsOn",
    orderByDirection: "ascending",
    status: "Approved",
    take: "500",
    organizationIds: String(ORGANIZATION_ID),
  });
  return `${HOST}/api/discovery/event/search?${params}`;
}

function readSnapshot(): EngageEvent[] {
  return JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8")) as EngageEvent[];
}

function writeSnapshot(events: EngageEvent[]): void {
  const next = `${JSON.stringify(events, null, 2)}\n`;
  try {
    if (readFileSync(SNAPSHOT_PATH, "utf8") === next) return;
  } catch {
    mkdirSync(dirname(SNAPSHOT_PATH.pathname), { recursive: true });
  }
  writeFileSync(SNAPSHOT_PATH, next);
}

/**
 * Live events from Engage, falling back to the committed snapshot on any
 * failure. Returns the reason so the loader can log which path it took.
 */
export async function fetchEngageEvents(): Promise<{
  events: EngageEvent[];
  source: "api" | "snapshot";
  error?: string;
}> {
  try {
    const response = await fetch(searchUrl(), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

    const body = (await response.json()) as { value?: EngageEvent[] };
    if (!Array.isArray(body.value)) throw new Error("response had no `value` array");
    // An empty feed is far more likely to be an API hiccup than a club that
    // deleted every event, so treat it as a failure and keep the snapshot.
    if (body.value.length === 0) throw new Error("response contained zero events");

    writeSnapshot(body.value);
    return { events: body.value, source: "api" };
  } catch (cause) {
    const error = cause instanceof Error ? cause.message : String(cause);
    return { events: readSnapshot(), source: "snapshot", error };
  }
}

// --- text cleanup -----------------------------------------------------------

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  zwj: "",
  zwnj: "",
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

/**
 * Engage descriptions are pasted from Docs and chat: emoji headers, inline
 * styles, `data-*` noise from AI editors. DESIGN.md rules out emoji in UI
 * chrome and em dashes in copy, so both are stripped rather than rendered.
 */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|div|h[1-6]|li|ul|ol|tr)>/gi, "\n")
      // A space, not nothing: "<strong>About:</strong>Text" must not glue.
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[\p{Extended_Pictographic}️‍]/gu, "")
    // No em dashes in copy (DESIGN.md), and no stray space before punctuation
    // once the surrounding markup is gone.
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/[ \t ]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

/**
 * A card-sized blurb: the first real sentences of the description, skipping
 * lines that only restate the title or repeat the date/time/location already
 * shown in the card's meta row.
 */
export function summarize(html: string, title: string, limit = 220): string {
  const normalizedTitle = normalizeTitle(title);
  const lines = htmlToText(html)
    .split("\n")
    .filter((line) => {
      if (line.length < 25) return false;
      if (normalizeTitle(line) === normalizedTitle) return false;
      return !/^(date|time|location|when|where|cost|price|rsvp)\b\s*:/i.test(line);
    })
    // Nearly every description opens with a scene-setting label ("About the
    // workshop:") that is filler next to a card already headed by the title.
    .map((line) => line.replace(/^(about|details|overview|description)\b[^:]{0,24}:\s*/i, ""))
    .filter(Boolean);

  const prose = lines.join(" ");
  if (prose.length <= limit) return prose;

  // Prefer cutting at a sentence end, then at a word, so the card never shows
  // half a word before the ellipsis.
  const window = prose.slice(0, limit + 60);
  const sentenceEnd = window.search(/[.!?](?=\s|$)(?![^.]*\d\.)/);
  if (sentenceEnd >= 90) return window.slice(0, sentenceEnd + 1);

  const clipped = prose.slice(0, limit);
  return `${clipped.slice(0, clipped.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
}

// --- classification ---------------------------------------------------------

/**
 * Engage's `theme` is too coarse to be useful (53 of 60 events are
 * "ThoughtfulLearning"), so the name carries most of the signal and the
 * category tags break ties. Order matters: the first match wins.
 */
export function classify(event: EngageEvent): NormalizedEvent["type"] {
  const name = event.name.toLowerCase();
  const categories = new Set(event.categoryNames ?? []);

  if (/\bhack(athon|hcc)\b|\bhackathon\b/.test(name)) return "hackathon";
  if (/\bsymposium\b|\bexpo\b|\bconference\b|\bcareer fair\b/.test(name)) return "other";
  if (/kick ?off|wrap[- ]?up|social|mixer|party|game night|networking/.test(name)) return "social";
  if (/workshop|meetup|meeting|coding club|\b101\b|fundamentals|intro|basics|prep|hands[- ]on|setup/.test(name)) {
    return "workshop";
  }
  if (categories.has("Workshop")) return "workshop";
  if (categories.has("Social")) return "social";
  if (event.theme === "Social") return "social";
  return "other";
}

// --- dates ------------------------------------------------------------------

const dateParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeParts = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

const weekdayParts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "long" });

/**
 * The Houston calendar date an instant falls on, as UTC midnight. The rest of
 * the site formats dates with getUTC* (see src/utils.ts), so encoding the local
 * date this way keeps one convention end to end.
 */
function houstonDate(iso: string): Date {
  const [year, month, day] = dateParts.format(new Date(iso)).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** "2:00 PM to 4:00 PM", or just the start when the end adds nothing. */
function houstonTimeRange(startIso: string, endIso: string): string {
  const start = timeParts.format(new Date(startIso));
  const end = timeParts.format(new Date(endIso));
  return start === end ? start : `${start} to ${end}`;
}

// --- recurrence -------------------------------------------------------------

/** Title reduced to a comparison key: "Coding Club Weekly Meetup!" -> "coding club weekly meetup". */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\p{Extended_Pictographic}️‍]/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Grouping key for recurrence. Officers have renamed the standing meetup
 * between "meeting" and "meetup" across semesters; it is one series, so the
 * two words are folded together here.
 */
function seriesKey(title: string): string {
  return normalizeTitle(title).replace(/\bmeetings?\b/g, "meetup");
}

/** A title repeated on this many dates is treated as a standing series. */
const SERIES_THRESHOLD = 3;

/**
 * Describes a series' cadence from the gaps between its dates, e.g.
 * "Weekly, every Friday". Returns undefined when the dates are too irregular
 * to make a claim the site would have to keep true.
 */
function describeCadence(instances: EngageEvent[]): string | undefined {
  if (instances.length < SERIES_THRESHOLD) return undefined;

  const days = instances.map((event) => houstonDate(event.startsOn).getTime() / 86_400_000);
  const gaps = days.slice(1).map((day, i) => day - days[i]);
  // Semester breaks leave big holes, so ask what the usual gap is rather than
  // requiring every gap to match.
  const weekly = gaps.filter((gap) => gap === 7).length;
  if (weekly < gaps.length / 2) return undefined;

  const weekdays = new Set(instances.map((event) => weekdayParts.format(new Date(event.startsOn))));
  return weekdays.size === 1 ? `Weekly, every ${[...weekdays][0]}` : "Weekly";
}

// --- assembly ---------------------------------------------------------------

function slugify(title: string): string {
  return normalizeTitle(title).replace(/\s+/g, "-").slice(0, 60) || "event";
}

function toNormalized(event: EngageEvent, series: EngageEvent[]): NormalizedEvent {
  const date = houstonDate(event.startsOn);
  const endDate = houstonDate(event.endsOn);
  const recurrence = describeCadence(series);

  return {
    slug: slugify(event.name),
    engageId: event.id,
    title: decodeEntities(event.name).replace(/\s+/g, " ").trim(),
    date,
    endDate: endDate.getTime() > date.getTime() ? endDate : undefined,
    time: houstonTimeRange(event.startsOn, event.endsOn),
    location: event.location?.trim() || undefined,
    type: classify(event),
    summary: summarize(event.description ?? "", event.name),
    coverUrl: `${IMAGE_CDN}/${event.imagePath}`,
    coverAlt: `Promotional graphic for ${event.name}`,
    sourceUrl: `${HOST}/event/${event.id}`,
    recurrence,
    occurrences: series.length,
  };
}

/**
 * Turns the raw feed into the list the site renders.
 *
 * Recurring series (the weekly Coding Club meetup, 33 dates and counting)
 * collapse to a single card: the next date if the series is still running,
 * otherwise the last one it held. Without this the archive would be almost
 * entirely one repeated card.
 */
export function normalizeEvents(raw: EngageEvent[], now = Date.now()): NormalizedEvent[] {
  const published = raw.filter(
    (event) => event.status === "Approved" && event.visibility === "Public" && event.imagePath,
  );

  // Same event, submitted twice (it happens when officers book two rooms for
  // one session). Keep the first copy.
  const distinct = new Map<string, EngageEvent>();
  for (const event of published) {
    const key = `${seriesKey(event.name)}@${event.startsOn}`;
    if (!distinct.has(key)) distinct.set(key, event);
  }

  const series = new Map<string, EngageEvent[]>();
  for (const event of distinct.values()) {
    const key = seriesKey(event.name);
    series.set(key, [...(series.get(key) ?? []), event]);
  }

  const events: NormalizedEvent[] = [];
  for (const instances of series.values()) {
    instances.sort((a, b) => Date.parse(a.startsOn) - Date.parse(b.startsOn));

    if (instances.length < SERIES_THRESHOLD) {
      // Not a series: a couple of same-named events are still separate cards.
      for (const instance of instances) events.push(toNormalized(instance, [instance]));
      continue;
    }

    const next = instances.find((instance) => Date.parse(instance.endsOn) >= now);
    events.push(toNormalized(next ?? instances[instances.length - 1], instances));
  }

  // Stable output regardless of Map iteration order, so builds are reproducible.
  events.sort((a, b) => a.date.getTime() - b.date.getTime() || a.engageId.localeCompare(b.engageId));

  // Slugs are the collection ids, so they have to be unique even when two
  // distinct events normalize to the same title.
  const seen = new Set<string>();
  for (const event of events) {
    if (!seen.has(event.slug)) {
      seen.add(event.slug);
      continue;
    }
    event.slug = `${event.slug}-${event.date.toISOString().slice(0, 10)}`;
    while (seen.has(event.slug)) event.slug = `${event.slug}-${event.engageId}`;
    seen.add(event.slug);
  }

  return events;
}
