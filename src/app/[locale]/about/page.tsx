import { appMetadata } from "@/lib/app-routes";
import { AboutRouteContent } from "@/lib/profile/server-content";
import { setRequestLocale } from "next-intl/server";

export const generateMetadata = appMetadata("about");

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutRouteContent locale={locale} />;
}
