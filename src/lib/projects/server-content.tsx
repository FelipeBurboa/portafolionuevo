import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProject, getProjects } from "./data";

export async function ProjectsRouteContent({ locale }: { locale: string }) {
  const projects = getProjects(locale);
  const t = await getTranslations({ locale, namespace: "projectsUi" });
  return (
    <article>
      <p>{t("sampleNotice")}</p>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <a href={`/${locale}/projects/${project.slug}`}>{project.title}</a>
            <p>{project.summary}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}

export async function ProjectRouteContent({ locale, slug }: { locale: string; slug: string }) {
  const project = getProject(locale, slug);
  if (!project) notFound();
  const t = await getTranslations({ locale, namespace: "projectsUi" });
  return (
    <article>
      <p>{project.eyebrow}</p>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>
      <h2>{t("role")}</h2>
      <p>{project.role}</p>
      <h2>{t("stack")}</h2>
      <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2>{t("designNotes")}</h2>
      <ul>{project.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
      <p>{project.imageCaption}</p>
    </article>
  );
}
