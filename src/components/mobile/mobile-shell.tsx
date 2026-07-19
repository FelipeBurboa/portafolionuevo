"use client";

import { type KeyboardEvent, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import { useHydrated } from "@/lib/use-hydrated";
import { APP_IDS, type AppId } from "@/lib/window/model";
import { getApp } from "@/lib/window/registry";
import { useWindowStore } from "@/lib/window/store";
import { LocaleToggle } from "../locale-toggle";

gsap.registerPlugin(useGSAP);

const APP_COPY: Record<AppId, { name: string; desc: string }> = {
  projects: { name: "projects.name", desc: "projects.desc" },
  about: { name: "about.name", desc: "about.desc" },
  contact: { name: "contact.name", desc: "contact.desc" },
  terminal: { name: "terminal.name", desc: "terminal.desc" },
};

function MobileSheet({
  id,
  onDismiss,
}: {
  id: AppId;
  onDismiss: () => void;
}) {
  const sheetRef = useRef<HTMLElement>(null);
  const t = useTranslations("apps");
  const mobile = useTranslations("mobile");
  const app = getApp(id);
  const Body = app.Body;
  const copy = APP_COPY[id];
  const titleId = `mobile-sheet-title-${id}`;

  useGSAP(
    () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          sheet,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: "power3.out" },
        );
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(sheet, { yPercent: 0, autoAlpha: 1 });
      });
      requestAnimationFrame(() => sheet.querySelector<HTMLButtonElement>("button")?.focus());
      return () => media.revert();
    },
    { scope: sheetRef },
  );

  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(
      sheetRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    if (controls.length === 0) return;
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <section
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={trapFocus}
      className="absolute inset-0 z-20 flex min-h-0 flex-col bg-term-bg-window"
    >
      <header
        className="flex shrink-0 items-center gap-3 border-b border-term-border-dim bg-term-bg-raised px-4 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label={mobile("backToHome")}
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-term-border text-lg text-term-fg-bright active:bg-term-bg-titlebar focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green"
        >
          ←
        </button>
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.14em] text-term-green">{mobile("appOpen")}</p>
          <h2 id={titleId} className="truncate text-sm font-medium text-term-fg-bright">
            {t(copy.name)}
          </h2>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-[0.8125rem] leading-6">
        <Body />
      </div>
    </section>
  );
}

/**
 * Phone policy: one focused app is shown as a modal sheet. It consumes the
 * shared focused-app state, but deliberately ignores desktop geometry/z-order.
 */
export function MobileShell() {
  const launcherRefs = useRef<Partial<Record<AppId, HTMLButtonElement | null>>>({});
  const mounted = useHydrated();
  const focusedId = useWindowStore((s) => s.focusedId);
  const open = useWindowStore((s) => s.open);
  const dismissMobileSheet = useWindowStore((s) => s.dismissMobileSheet);
  const t = useTranslations("apps");
  const mobile = useTranslations("mobile");

  const openSheet = (id: AppId) => {
    open(id);
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`[data-mobile-sheet="${id}"]`)?.focus(),
    );
  };
  const dismissSheet = () => {
    const closedId = focusedId;
    dismissMobileSheet();
    if (closedId) {
      requestAnimationFrame(() => launcherRefs.current[closedId]?.focus());
    }
  };

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-term-bg text-term-fg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <header
        className="flex h-[calc(env(safe-area-inset-top)_+_3.5rem)] items-end justify-between border-b border-term-border-dim bg-term-bg-raised px-5 pb-3"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div>
          <p className="font-pixel text-2xl leading-none text-term-green">felipeOS</p>
          <p className="mt-1 text-[10px] tracking-[0.16em] text-term-fg-dim">{mobile("node")}</p>
        </div>
        <LocaleToggle compact={false} />
      </header>

      <main className="h-[calc(100dvh_-_env(safe-area-inset-top)_-_3.5rem_-_2rem_-_env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain px-5 py-7">
        <p className="max-w-[30ch] text-xs leading-5 text-term-fg-dim">
          {t("intro")}
        </p>
        <ul className="mt-7 grid grid-cols-2 gap-3">
          {APP_IDS.map((id) => {
            const app = getApp(id);
            const copy = APP_COPY[id];
            const isPriority = id === "projects";
            return (
              <li key={id} className={isPriority ? "col-span-2" : undefined}>
                <button
                  ref={(element) => {
                    launcherRefs.current[id] = element;
                  }}
                  type="button"
                  onClick={() => openSheet(id)}
                  className={`group flex h-36 w-full border border-term-border bg-term-bg-window p-4 text-left active:bg-term-bg-titlebar focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green ${
                    isPriority ? "items-center gap-4" : "flex-col justify-between"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex shrink-0 items-center justify-center border border-term-border bg-term-bg-titlebar text-term-green transition-colors group-active:border-term-green ${
                      isPriority ? "h-16 w-16 text-2xl" : "h-12 w-12 text-xl"
                    }`}
                  >
                    {app.glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-term-fg-bright">{t(copy.name)}</span>
                    <span className="mt-1 block text-[11px] leading-4 text-term-fg-dim">
                      {t(copy.desc)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className="absolute inset-x-0 bottom-0 flex h-8 items-center border-t border-term-border-dim bg-term-bg-raised px-5 text-[10px] text-term-fg-dim">
        <span>{mobile("location")}</span>
        <span className="ml-auto text-term-green">● {mobile("online")}</span>
      </footer>

      {mounted && focusedId && (
        <div data-mobile-sheet={focusedId} className="absolute inset-0 z-10">
          <MobileSheet id={focusedId} onDismiss={dismissSheet} />
        </div>
      )}
    </div>
  );
}
