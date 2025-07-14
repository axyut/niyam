"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = (nextLocale: string) => {
    // The pathname will be like /en/some-page or /np/some-page
    // We want to replace the locale part
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);

    // Use window.location.assign to force a full page reload.
    // This is necessary to re-initialize the i18n provider with new messages.
    window.location.assign(newPath);
  };

  return (
    <div className="flex items-center space-x-1 border rounded-md p-1">
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 text-sm rounded-md ${
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("np")}
        className={`px-2 py-1 text-sm rounded-md ${
          locale === "np"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent"
        }`}
      >
        NP
      </button>
    </div>
  );
}
