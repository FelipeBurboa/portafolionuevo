import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { APP_IDS } from "@/lib/window/model";

// Root desktop route. Server-renders crawlable content (the OS name + links to
// each app route) that the DesktopShell keeps in the DOM behind the chrome.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("apps");

  return (
    <section>
      <h1>FelipeOS — Felipe Burboa</h1>
      <p>{t("intro")}</p>
      <ul>
        {APP_IDS.map((id) => (
          <li key={id}>
            <Link href={`/${id}`}>{t(`${id}.name`)}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
