"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";

export function GlobalSearch() {
  const t = useTranslations("TopNavbar");
  const searchContext = "Feed"; // This can be made dynamic later

  return (
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={20}
      />
      {/* Context Tag */}
      {searchContext && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded">
          <span>{searchContext}</span>
          <button className="hover:text-foreground">
            <X size={14} />
          </button>
        </div>
      )}
      <input
        type="text"
        placeholder={t("search_placeholder")}
        // Add padding to the right to make space for the context tag
        className="w-full bg-secondary border rounded-lg py-2 pl-10 pr-24 focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
