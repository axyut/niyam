"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; // Use the locale-aware Link

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold mb-4">{t("welcome")}</h1>
      <p className="max-w-xl text-muted-foreground">{t("description")}</p>

      {/* Example of using the locale-aware Link */}
      <div className="mt-8">
        <Link href="/laws" className="text-primary hover:underline">
          Go to Laws page (example link)
        </Link>
      </div>
    </div>
  );
}
