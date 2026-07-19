import type { Metadata } from "next";
import { IBM_Plex_Mono, VT323 } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { OsShell } from "@/components/os-shell";
import "../globals.css";

// Primary mono — window chrome + body. Latin subset covers Spanish
// diacritics (á é í ó ú ñ) and ¿ ¡ (U+00A1 / U+00BF, both < U+00FF).
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display / terminal accent — boot log, terminal prompt, large phosphor headers.
const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Static rendering: prerender one route per locale. (Under Cache Components,
// `dynamicParams` route config is disallowed; the known locales below still
// prerender to static HTML — the route shows ◐, and /en /es are static.)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Distribute the locale so next-intl renders statically instead of
  // opting the route into dynamic rendering. Required in EVERY layout/page.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`dark ${plexMono.variable} ${vt323.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <NextIntlClientProvider>
          <OsShell>{children}</OsShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
