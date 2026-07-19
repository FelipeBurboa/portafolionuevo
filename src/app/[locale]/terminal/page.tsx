import { appMetadata, AppRouteContent } from "@/lib/app-routes";

export const generateMetadata = appMetadata("terminal");

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <AppRouteContent appId="terminal" params={params} />;
}
