import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Invalid app path (e.g. /en/nope). Rendered inside the locale layout, so it
// keeps the terminal chrome. Must not mutate any workspace state (there is
// none yet; the T3 store will treat 404 as a no-op on the workspace).
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-term-bg text-term-fg">
      <p className="font-pixel text-4xl text-term-amber">404</p>
      <p className="text-sm text-term-fg-dim">{t("message")}</p>
      <Link href="/" className="text-sm text-term-green hover:text-glow">
        {t("home")}
      </Link>
    </div>
  );
}
