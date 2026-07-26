import type { CollectionEntry } from "astro:content";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Frontmatter dates parse as UTC midnight; format them in UTC to avoid drift. */
export function formatEventDate(date: Date, endDate?: Date): string {
  const m = MONTHS[date.getUTCMonth()];
  const d = date.getUTCDate();
  const y = date.getUTCFullYear();
  if (endDate) {
    const em = MONTHS[endDate.getUTCMonth()];
    const ed = endDate.getUTCDate();
    const ey = endDate.getUTCFullYear();
    if (ey === y && endDate.getUTCMonth() === date.getUTCMonth()) return `${m} ${d}–${ed}, ${y}`;
    if (ey === y) return `${m} ${d} – ${em} ${ed}, ${y}`;
    return `${m} ${d}, ${y} – ${em} ${ed}, ${ey}`;
  }
  return `${m} ${d}, ${y}`;
}

/**
 * An event stays upcoming until its (end) date has fully passed in Houston.
 * Dates are UTC midnight, so the boundary is end-of-day + 6h (America/Chicago
 * is UTC-5/6) — an evening build during the event won't archive it early.
 */
export function isUpcoming(event: CollectionEntry<"events">): boolean {
  const last = event.data.endDate ?? event.data.date;
  const cutoff = Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate() + 1, 6);
  return Date.now() < cutoff;
}

export const byDateAsc = (a: CollectionEntry<"events">, b: CollectionEntry<"events">) =>
  a.data.date.getTime() - b.data.date.getTime();

export const byDateDesc = (a: CollectionEntry<"events">, b: CollectionEntry<"events">) =>
  b.data.date.getTime() - a.data.date.getTime();

export const REFDES_PREFIX: Record<string, string> = {
  workshop: "WS",
  hackathon: "HK",
  social: "SC",
  other: "EV",
};

/** Reference designators number per class (WS1, WS2… HK1), like a real board. */
export function refdesCounter(): (type: string) => string {
  const counts: Record<string, number> = {};
  return (type) => `${REFDES_PREFIX[type] ?? "EV"}${(counts[type] = (counts[type] ?? 0) + 1)}`;
}
