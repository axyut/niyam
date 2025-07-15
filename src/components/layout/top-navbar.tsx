"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Search, Bell } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export function TopNavbar() {
  const t = useTranslations("TopNavbar");
  const { openSettingsModal } = useAuthStore();

  return (
    <header className="flex items-center h-16 bg-card border-b px-4 md:px-6 gap-4">
      {/* New Notifications Button on the far left */}
      <button
        onClick={() => openSettingsModal("notifications")}
        className="p-2 rounded-full hover:bg-accent relative"
      >
        <Bell size={20} />
        {/* Optional: Add a dot for unread notifications */}
        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-primary ring-2 ring-card"></span>
      </button>

      {/* Search bar remains central */}
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

      {/* This empty div helps balance the flex layout so the search bar stays centered */}
      <div className="w-8 h-8"></div>
    </header>
  );
}
