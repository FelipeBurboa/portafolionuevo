"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useWindowStore } from "@/lib/window/store";

/**
 * Ambient system readout — a quiet `conky`-style panel in the bottom-right of the
 * idle desktop. Observational only (no interaction): the greeting orients a
 * first-timer, and the readout reflects real system state — a live session uptime
 * and the true count of open windows. Sits behind the window layer (z-0).
 *
 * The greeting stays in the accessibility tree (real orientation); the stat rows
 * are ambient texture and hidden from assistive tech. The `▮` status blink is
 * added in T3.
 */
function formatUptime(totalSeconds: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function SystemWidget() {
  const t = useTranslations("desktop");
  const locale = useLocale();

  // Live open-window count (excludes minimized), straight from the window store.
  const stack = useWindowStore((s) => s.stack);
  const windows = useWindowStore((s) => s.windows);
  const openCount = stack.filter((id) => !windows[id]?.minimized).length;

  // Session uptime — seconds since mount. Starts at 0 so server HTML and first
  // client render agree; the interval only advances it afterward.
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const id = window.setInterval(
      () => setSeconds(Math.floor((Date.now() - started) / 1000)),
      1000,
    );
    return () => window.clearInterval(id);
  }, []);

  const processes =
    openCount === 0
      ? t("procIdle", { count: 0 })
      : t("procOpen", { count: openCount });

  return (
    <aside className="pointer-events-none absolute bottom-4 right-4 z-0 w-[232px] border border-term-border bg-term-bg-raised px-3 py-2.5 text-[11px] leading-relaxed">
      <p className="border-b border-term-border-dim pb-2 text-term-fg-bright">
        {t("greeting")}
      </p>
      <dl aria-hidden className="mt-2 space-y-0.5 text-term-fg-dim">
        <div className="flex justify-between gap-3">
          <dt>{t("uptime")}</dt>
          <dd className="tabular-nums text-term-fg">{formatUptime(seconds)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{t("processes")}</dt>
          <dd className="text-term-fg">{processes}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{t("locale")}</dt>
          <dd className="text-term-fg">{locale}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{t("status")}</dt>
          <dd className="text-term-amber">
            <span aria-hidden className="status-blink">▮</span>{" "}
            {t("ready")}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
