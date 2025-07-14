"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LawsPage() {
  const t = useTranslations("LawsPage");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="mb-4">
        This is where the list of laws and legal documents will be displayed.
      </p>
      <Link href="/" className="text-primary hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
}
