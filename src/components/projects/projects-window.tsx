"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { getProject, getProjects, projectSlugs } from "@/lib/projects/data";
import type { Project } from "@/lib/projects/types";

function SampleNotice() {
  const t = useTranslations("projectsUi");
  return (
    <p className="mb-5 border border-term-amber/60 bg-term-bg-titlebar px-3 py-2 text-[10px] leading-4 text-term-amber">
      {t("sampleNotice")}
    </p>
  );
}

function ProjectList({ locale }: { locale: string }) {
  const t = useTranslations("projectsUi");
  return (
    <div className="text-xs leading-6">
      <SampleNotice />
      <p className="mb-2 text-term-fg-dim">{t("indexLabel")}</p>
      <ul className="border-y border-term-border-dim">
        {getProjects(locale).map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group block border-b border-term-border-dim px-3 py-3 last:border-b-0 hover:bg-term-bg-titlebar focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green"
            >
              <span className="text-term-green">drwxr-xr-x</span>{" "}
              <span className="text-term-fg-bright group-hover:text-term-green">{project.title}/</span>
              <span className="ml-2 text-[10px] text-term-fg-dim">{project.year}</span>
              <span className="mt-1 block text-[11px] leading-5 text-term-fg-dim">{project.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations("projectsUi");
  return (
    <article className="text-xs leading-6">
      <Link
        href="/projects"
        className="text-[11px] text-term-green hover:text-term-green-bright focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green"
      >
        ← cd ../
      </Link>
      <SampleNotice />
      <p className="text-[10px] tracking-[0.12em] text-term-amber">{project.eyebrow}</p>
      <h2 className="mt-1 font-pixel text-3xl text-term-fg-bright">{project.title}</h2>
      <p className="mt-3 max-w-[62ch] text-term-fg">{project.summary}</p>

      <div className="mt-5 border border-term-border bg-term-bg-titlebar p-4">
        <p className="text-[10px] tracking-[0.12em] text-term-green">{t("screenshot")}</p>
        <pre aria-hidden className="mt-3 overflow-hidden text-[10px] leading-4 text-term-fg-dim">{`╭────────── queue ──────────╮
│  01  inspect  · priority   │
│  02  decide   · owner      │
│  03  resolve  · audit      │
╰───────────────────────────╯`}</pre>
        <p className="mt-3 text-[11px] leading-5 text-term-fg-dim">{project.imageCaption}</p>
      </div>

      <dl className="mt-5 grid gap-3 border-y border-term-border-dim py-4 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] tracking-[0.12em] text-term-fg-dim">{t("role")}</dt>
          <dd className="mt-1 text-term-fg-bright">{project.role}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.12em] text-term-fg-dim">{t("stack")}</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <span key={item} className="border border-term-border px-1.5 py-0.5 text-[10px] text-term-green">
                {item}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <h3 className="mt-5 text-[10px] tracking-[0.12em] text-term-green">{t("designNotes")}</h3>
      <ul className="mt-2 space-y-2 text-term-fg-dim">
        {project.outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-2"><span className="text-term-green">›</span><span>{outcome}</span></li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.links.map((link) =>
          link.href ? (
            <a key={link.label} href={link.href} className="border border-term-green px-2 py-1 text-[11px] text-term-green hover:bg-term-green hover:text-term-bg">
              {link.label} ↗
            </a>
          ) : (
            <span key={link.label} className="border border-term-border px-2 py-1 text-[11px] text-term-fg-dim">
              {link.label} — {t("addUrl")}
            </span>
          ),
        )}
      </div>
    </article>
  );
}

/** Client registry body — route pathname chooses list or detail without storing it in Zustand. */
export function ProjectsWindow() {
  const locale = useLocale();
  const pathname = usePathname();
  const slug = projectSlugs.find((candidate) => pathname.split("/").at(-1) === candidate);
  const project = slug ? getProject(locale, slug) : undefined;

  return project ? <ProjectDetail project={project} /> : <ProjectList locale={locale} />;
}
