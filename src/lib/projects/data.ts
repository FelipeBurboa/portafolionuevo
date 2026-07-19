import englishProjects from "../../../content/portfolio-demo/en";
import spanishProjects from "../../../content/portfolio-demo/es";
import type { Project } from "./types";

export type ProjectLocale = "en" | "es";

const projectsByLocale: Record<ProjectLocale, readonly Project[]> = {
  en: englishProjects,
  es: spanishProjects,
};

export const projectSlugs = englishProjects.map((project) => project.slug);

export function getProjects(locale: string): readonly Project[] {
  return projectsByLocale[locale === "es" ? "es" : "en"];
}

export function getProject(locale: string, slug: string): Project | undefined {
  return getProjects(locale).find((project) => project.slug === slug);
}
