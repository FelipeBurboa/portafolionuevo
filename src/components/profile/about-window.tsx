"use client";

import { useLocale } from "next-intl";
import { getProfile } from "@/lib/profile/data";

export function AboutWindow() {
  const locale = useLocale();
  const profile = getProfile(locale);
  return (
    <article className="text-xs leading-6">
      <p className="border border-term-amber/60 bg-term-bg-titlebar px-3 py-2 text-[10px] leading-4 text-term-amber">{profile.notice}</p>
      <header className="mt-5 border-b border-term-border-dim pb-4">
        <p className="text-[10px] tracking-[0.14em] text-term-green"># ABOUT</p>
        {profile.bio.map((paragraph) => <p key={paragraph} className="mt-3 max-w-[65ch] text-term-fg">{paragraph}</p>)}
      </header>
      <section className="mt-5">
        <h2 className="text-[10px] tracking-[0.14em] text-term-green">EXPERIENCE.LOG</h2>
        <ol className="mt-3 space-y-3 border-l border-term-border pl-4">
          {profile.timeline.map((item) => (
            <li key={item.period}>
              <p className="text-[10px] text-term-amber">{item.period}</p>
              <h3 className="text-term-fg-bright">{item.title}</h3>
              <p className="text-term-fg-dim">{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-5 border-t border-term-border-dim pt-4">
        <h2 className="text-[10px] tracking-[0.14em] text-term-green">TOOLKIT</h2>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {profile.skills.map((skill) => <li key={skill} className="border border-term-border px-2 py-0.5 text-[10px] text-term-fg">{skill}</li>)}
        </ul>
        {profile.resumeHref ? (
          <a href={profile.resumeHref} download className="mt-5 inline-block border border-term-green px-3 py-1.5 text-[11px] text-term-green hover:bg-term-green hover:text-term-bg">↓ CV.pdf</a>
        ) : (
          <span className="mt-5 inline-block border border-term-border px-3 py-1.5 text-[11px] text-term-fg-dim">CV.pdf — add file</span>
        )}
      </section>
    </article>
  );
}
