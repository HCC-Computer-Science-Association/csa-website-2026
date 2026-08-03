/**
 * Site-wide settings. Everything an officer might need to change
 * without touching components lives here.
 */
export const SITE = {
  name: "CSA",
  fullName: "Computer Science Association",
  college: "Houston City College",
  url: "https://hcc-csa.org",
  tagline: "Houston City College's student-run computer science community.",
  description:
    "Computer Science Association at Houston City College: workshops, hackathons, and a 700+ member community of students who build together.",
} as const;

// TODO(officers): replace with the permanent invite link
export const DISCORD_URL = "https://discord.gg/TODO";

export const SOCIALS = {
  discord: DISCORD_URL,
  // TODO(officers): confirm handles/URLs
  instagram: "https://www.instagram.com/TODO",
  linkedin: "https://www.linkedin.com/company/TODO",
  email: "contact@hcc-csa.org", // TODO(officers): confirm club email
} as const;

export const STATS = [
  { value: "700+", label: "members" },
  { value: "100+", label: "workshops hosted" },
  { value: "HackHCC", label: "our flagship hackathon" },
] as const;
