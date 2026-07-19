import type { ComponentType } from "react";
import type { AppId } from "./model";
import { ProjectsWindow } from "@/components/projects/projects-window";
import { AboutWindow } from "@/components/profile/about-window";
import { ContactWindow } from "@/components/profile/contact-window";
import { TerminalWindow } from "@/components/terminal/terminal-window";

/**
 * App registry — maps an appId to its window content and desktop metadata.
 * Content is client-capable and fed by serializable data. For T3 the bodies
 * are stubs; real apps (Projects, About, Contact, Terminal) replace them in
 * later tickets without touching the window manager.
 */
export type AppDef = {
  id: AppId;
  /** Window title-bar text + accessible name. */
  title: string;
  /** Desktop icon glyph (ASCII/pixel, drawn not imported). */
  glyph: string;
  /** Desktop icon + taskbar label. */
  label: string;
  Body: ComponentType;
};

function Stub({ name }: { name: string }) {
  return (
    <div className="text-xs leading-relaxed text-term-fg-dim">
      <p className="text-term-green">$ {name} --stub</p>
      <p className="mt-2">
        Placeholder window. Real content arrives in a later ticket. Drag, focus,
        minimize and close all work; this is here to prove the window manager.
      </p>
    </div>
  );
}

const REGISTRY: Record<AppId, AppDef> = {
  projects: {
    id: "projects",
    title: "projects/ — file browser",
    glyph: "▣",
    label: "projects/",
    Body: ProjectsWindow,
  },
  about: {
    id: "about",
    title: "about.md",
    glyph: "☺",
    label: "about.md",
    Body: AboutWindow,
  },
  contact: {
    id: "contact",
    title: "contact — compose",
    glyph: "✉",
    label: "contact",
    Body: ContactWindow,
  },
  terminal: {
    id: "terminal",
    title: "terminal",
    glyph: "›_",
    label: "terminal",
    Body: TerminalWindow,
  },
};

export function getApp(id: AppId): AppDef {
  return REGISTRY[id];
}
