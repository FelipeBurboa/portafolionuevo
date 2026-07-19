import { appMetadata } from "@/lib/app-routes";
import { ProjectsRouteContent } from "@/lib/projects/server-content";
import { setRequestLocale } from "next-intl/server";

export const generateMetadata = appMetadata("projects");

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return await ProjectsRouteContent({ locale });
}
