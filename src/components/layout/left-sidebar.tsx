"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Home,
  FileText,
  Landmark,
  MessageSquare,
  BarChart2,
  Bookmark,
  History,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useUIStore } from "@/lib/store";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/", icon: Home, labelKey: "feed" },
  { href: "/laws", icon: FileText, labelKey: "laws" },
  { href: "/policy", icon: Landmark, labelKey: "policy" },
  { href: "/discussions", icon: MessageSquare, labelKey: "discussions" },
  { href: "/analytics", icon: BarChart2, labelKey: "analytics" },
  { href: "/bookmarks", icon: Bookmark, labelKey: "bookmarks" },
  { href: "/history", icon: History, labelKey: "history" },
];

export function LeftSidebar() {
  const t = useTranslations("LeftSidebar");
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col bg-card border-r transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between h-16 border-b px-4">
        {isSidebarOpen && <h1 className="text-2xl font-bold">{t("title")}</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-accent"
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      </div>
      <nav className="flex-grow px-2 py-4">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname.endsWith(item.href);
            return (
              <li key={item.labelKey}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 my-1 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  } ${isSidebarOpen ? "" : "justify-center"}`}
                >
                  <item.icon className="h-5 w-5" />
                  {isSidebarOpen && (
                    <span className="ml-4">{t(item.labelKey as any)}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
