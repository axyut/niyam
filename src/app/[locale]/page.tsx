"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; // Use the locale-aware Link
import { Button } from "@/components/ui/button";
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
        <Button>Click me</Button>
        <Button variant="outline" size="sm">
          Read More
        </Button>
        <div className="mt-4 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">aaaa</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border rounded-lg p-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Special Card
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            This card uses hardcoded colors with the dark: prefix.
          </p>
        </div>
      </div>
    </div>
  );
}
