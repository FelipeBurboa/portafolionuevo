import type { Project } from "../../src/lib/projects/types";

/** SAMPLE ONLY — replace this record with a real, showable case study. */
const project: Project = {
  slug: "signalgrid",
  title: "Signalgrid",
  eyebrow: "SAMPLE CASE STUDY · REPLACE ME",
  summary:
    "A fictional operations workspace that turns scattered field reports into a calm, searchable decision queue.",
  role: "Product design + frontend direction",
  stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
  year: "2025",
  outcomes: [
    "Designed a triage flow around urgency instead of source system.",
    "Made the active queue readable at a glance without hiding the audit trail.",
    "Created reusable table, filter, and detail-panel patterns for a complex internal tool.",
  ],
  imageCaption: "Replace this panel with a real project screenshot or annotated flow.",
  links: [
    { label: "Live demo", href: null },
    { label: "Repository", href: null },
  ],
};

export default [project] as const;
