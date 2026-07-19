"use client";

import { Fragment } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * OS menu-bar language switch. Uses next-intl's locale-aware router so the
 * current path is preserved across the locale change. Once the window store
 * (T3) lands above the [locale] segment, switching will also preserve open
 * windows; for now it swaps the desktop's language in place.
 */
export function LocaleToggle({ compact = true }: { compact?: boolean }) {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <span aria-label="Language" className="flex items-center text-term-fg-dim">
      {routing.locales.map((locale, i) => (
        <Fragment key={locale}>
          {i > 0 && <span aria-hidden className={compact ? undefined : "px-1"}> | </span>}
          <button
            type="button"
            aria-current={locale === active ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale })}
            className={
              locale === active
                ? compact
                  ? "text-term-fg-bright"
                  : "flex h-11 min-w-11 items-center justify-center text-term-fg-bright focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green"
                : compact
                  ? "text-term-fg-dim hover:text-term-green"
                  : "flex h-11 min-w-11 items-center justify-center text-term-fg-dim active:text-term-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-term-green"
            }
          >
            {locale.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </span>
  );
}
