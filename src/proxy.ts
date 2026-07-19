import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed `middleware.ts` → `proxy.ts`. next-intl's middleware
// factory is still exported from `next-intl/middleware`; here it handles
// locale detection and the `/` → `/en` redirect (localePrefix: "always").
export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, Next internals, and files with an
  // extension (favicon, fonts, images, …).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
