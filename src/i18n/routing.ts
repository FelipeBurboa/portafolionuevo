import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // Every route is locale-prefixed (/en, /es); `/` redirects to the default.
  // Explicit prefixes give clean canonical + hreflang URLs.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
