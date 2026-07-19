import type { Profile } from "../../src/lib/profile/types";

const profile: Profile = {
  notice: "SAMPLE PROFILE — replace this file with Felipe's real biography and résumé link.",
  bio: [
    "I turn ambiguous product problems into clear interfaces and useful systems.",
    "This is intentionally fictional placeholder copy. Replace it with a concise account of your real practice, the kinds of teams you enjoy, and the outcomes you care about.",
  ],
  timeline: [
    { period: "2024 — now", title: "Independent product work", detail: "Sample line — replace with a real role and outcome." },
    { period: "2021 — 2024", title: "Product designer / engineer", detail: "Sample line — replace with a real team, scope, and contribution." },
  ],
  skills: ["Product strategy", "Interface systems", "Prototyping", "React", "TypeScript"],
  resumeHref: null,
};

export default profile;
