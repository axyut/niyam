"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { Menu } from "lucide-react";

export function TopNavbar() {
  const t = useTranslations("TopNavbar");
  const { toggleSidebar } = useUIStore();

  return (
    <header className="flex items-center justify-between h-16 bg-card border-b px-4 md:px-6">
      {/* Hamburger menu for mobile to toggle the (hidden) sidebar if needed in future */}
      <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2">
        <Menu />
      </button>

      {/* Search bar remains */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            className="w-full bg-secondary border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* A spacer to keep the search bar centered */}
      <div className="md:hidden w-8"></div>
    </header>
  );
}
