import { appMetadata } from "@/lib/app-routes";
import { ContactRouteContent } from "@/lib/profile/server-content";
import { setRequestLocale } from "next-intl/server";

export const generateMetadata = appMetadata("contact");

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactRouteContent locale={locale} />;
}
