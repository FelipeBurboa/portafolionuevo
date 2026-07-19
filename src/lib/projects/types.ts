export type ProjectLink = { label: string; href: string | null };

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  role: string;
  stack: string[];
  year: string;
  outcomes: string[];
  imageCaption: string;
  links: ProjectLink[];
};
