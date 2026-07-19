"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useHydrated } from "@/lib/use-hydrated";
import { useWindowStore } from "@/lib/window/store";
import { APP_IDS } from "@/lib/window/model";
import { getApp } from "@/lib/window/registry";
import { WindowFrame } from "./window-frame";
import { LocaleToggle } from "../locale-toggle";

/**
 * The persistent OS shell. Lives in the [locale] layout so it survives client
 * URL changes (opening a window is a History API push, NOT a route nav — the
 * shell must not remount). `children` is the route's server-rendered content,
 * kept in the DOM (crawlable) but visually behind the OS chrome for now; T6
 * renders it inside the focused window.
 */
export function DesktopShell() {
  const desktopRef = useRef<HTMLElement>(null);
  const launcherRefs = useRef<Partial<Record<(typeof APP_IDS)[number], HTMLButtonElement | null>>>({});
  const entrySequence = useRef(0);
  const [enteringWindow, setEnteringWindow] = useState<{ id: (typeof APP_IDS)[number]; token: number } | null>(null);
  const t = useTranslations("desktop");

  // Gate the interactive window layer behind hydration so server HTML (no
  // windows) matches the first client render, avoiding a hydration mismatch.
  const mounted = useHydrated();

  const stack = useWindowStore((s) => s.stack);
  const focusedId = useWindowStore((s) => s.focusedId);
  const open = useWindowStore((s) => s.open);
  const focus = useWindowStore((s) => s.focus);
  const close = useWindowStore((s) => s.close);
  const restore = useWindowStore((s) => s.restore);
  const windows = useWindowStore((s) => s.windows);

  const markForEntrance = (id: (typeof APP_IDS)[number]) => {
    const token = ++entrySequence.current;
    setEnteringWindow({ id, token });
    window.setTimeout(() => {
      setEnteringWindow((current) => (current?.token === token ? null : current));
    }, 360);
  };
  const openFromLauncher = (id: (typeof APP_IDS)[number]) => {
    if (!windows[id] || windows[id]?.minimized) markForEntrance(id);
    open(id);
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`[data-window-id="${id}"]`)?.focus(),
    );
  };
  const closeAndReturnFocus = (id: (typeof APP_IDS)[number]) => {
    close(id);
    // The always-present desktop icon is a stable fallback even when the
    // action originated from the taskbar button that disappears on close.
    requestAnimationFrame(() => launcherRefs.current[id]?.focus());
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-term-bg text-term-fg">
      {/* Menu bar */}
      <header className="flex h-7 items-center justify-between border-b border-term-border-dim bg-term-bg-raised px-3 text-[11px]">
        <span className="text-term-fg-bright">
          felipe@burboa:<span className="text-term-green">~</span>${" "}
        </span>
        <nav aria-label="System" className="flex items-center gap-3">
          <LocaleToggle />
          <span className="text-term-fg-dim">felipeOS v1.0</span>
        </nav>
      </header>

      {/* Desktop */}
      <main ref={desktopRef} className="relative h-[calc(100dvh-3.75rem)]">
        {/* Desktop icons — launch windows */}
        <ul className="flex w-[74px] flex-col gap-6 p-5">
          {APP_IDS.map((id) => {
            const app = getApp(id);
            return (
              <li key={id}>
                <button
                  ref={(element) => {
                    launcherRefs.current[id] = element;
                  }}
                  type="button"
                  onClick={() => openFromLauncher(id)}
                  className="w-full text-center text-[10px] text-term-fg transition-transform duration-150 hover:-translate-y-0.5 hover:text-term-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green motion-reduce:transform-none"
                >
                  <span
                    aria-hidden
                    className="mx-auto mb-1.5 flex h-10 w-10 items-center justify-center border border-term-border bg-term-bg-window text-base text-term-green"
                  >
                    {app.glyph}
                  </span>
                  {app.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Window layer */}
        {mounted &&
          stack
            .filter((id) => !windows[id]?.minimized)
            .map((id, i) => (
            <WindowFrame
              key={id}
              id={id}
              z={i}
              focused={id === focusedId}
              boundsRef={desktopRef}
              onRequestClose={closeAndReturnFocus}
              entryToken={enteringWindow?.id === id ? enteringWindow.token : null}
            />
            ))}
      </main>

      {/* Taskbar */}
      <footer className="absolute inset-x-0 bottom-0 flex h-[34px] items-center gap-2 border-t border-term-border-dim bg-term-bg-raised px-2.5 text-[11px]">
        <span className="border border-term-border bg-term-bg-titlebar px-2.5 py-[3px] text-term-fg-bright">
          ›_ {t("start")}
        </span>
        {mounted &&
          stack.map((id) => {
            const app = getApp(id);
            const isMin = windows[id]?.minimized;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  if (isMin) {
                    markForEntrance(id);
                    restore(id);
                  } else {
                    focus(id);
                  }
                }}
                aria-current={id === focusedId ? "true" : undefined}
                aria-pressed={id === focusedId}
                className={`flex items-center gap-1 border px-2 py-[3px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green ${
                  id === focusedId
                    ? "border-term-green text-term-fg-bright"
                    : "border-term-border text-term-fg-dim hover:text-term-green"
                } ${isMin ? "opacity-60" : ""}`}
              >
                <span aria-hidden className="text-term-green">{app.glyph}</span>
                {app.label}
              </button>
            );
          })}
        <span className="ml-auto text-term-fg-dim">▮ {t("ready")}</span>
      </footer>
    </div>
  );
}
