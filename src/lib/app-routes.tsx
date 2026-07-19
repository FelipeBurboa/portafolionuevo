import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppId } from "@/lib/window/model";

// Each app is a real route (/[locale]/<segment>) so it is shareable and
// crawlable. The route renders semantic SEO content; the DesktopShell overlays
// the OS chrome and, from T6, moves this content into the focused window.

const SEGMENT: Record<AppId, string> = {
  projects: "projects",
  about: "about",
  contact: "contact",
  terminal: "terminal",
};

/** Factory for a route's `generateMetadata`. Terminal is noindex. */
export function appMetadata(appId: AppId) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "apps" });
    const seg = SEGMENT[appId];
    return {
      title: `${t(`${appId}.name`)} — FelipeOS`,
      description: t(`${appId}.desc`),
      alternates: {
        canonical: `/${locale}/${seg}`,
        languages: { en: `/en/${seg}`, es: `/es/${seg}` },
      },
      ...(appId === "terminal" ? { robots: { index: false, follow: true } } : {}),
    };
  };
}

/** Shared server-rendered SEO body for an app route. */
export async function AppRouteContent({
  appId,
  params,
}: {
  appId: AppId;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("apps");
  return (
    <article>
      <h1>{t(`${appId}.name`)}</h1>
      <p>{t(`${appId}.desc`)}</p>
      <Link href="/">{t("home")}</Link>
    </article>
  );
}
