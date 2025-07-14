"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { LanguageSwitcher } from "../ui/language-switcher";

export function TopNavbar() {
  const t = useTranslations("TopNavbar");

  return (
    <header className="flex items-center justify-between h-16 bg-card border-b px-4 md:px-6">
      <div className="flex-1">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            className="w-full bg-background border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <ThemeToggle />
        {/* Simple User Icon for now. This can be expanded into a dropdown menu. */}
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-secondary-foreground font-bold">
          JD
        </div>
      </div>
    </header>
  );
}
