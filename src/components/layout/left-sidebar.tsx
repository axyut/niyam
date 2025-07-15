"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Home,
  FileText,
  Landmark,
  MessageSquare,
  BarChart2,
  Bookmark,
  History,
  User,
  Settings,
  PanelLeftClose,
  LogOut,
  LogIn,
  PanelRightClose,
} from "lucide-react";
import { useUIStore, useAuthStore } from "@/lib/store";
import { Link, usePathname } from "@/i18n/navigation";
import { Playfair_Display } from "next/font/google";
import { ThemeToggle } from "../ui/theme-toggle";
import { LanguageSwitcher } from "../ui/language-switcher";
import { apiClient } from "@/lib/api";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

const navItems = [
  { href: "/", icon: Home, labelKey: "feed" },
  { href: "/laws", icon: FileText, labelKey: "laws" },
  { href: "/policy", icon: Landmark, labelKey: "policy" },
  { href: "/discussions", icon: MessageSquare, labelKey: "discussions" },
  { href: "/analytics", icon: BarChart2, labelKey: "analytics" },
  { href: "/bookmarks", icon: Bookmark, labelKey: "bookmarks" },
  { href: "/history", icon: History, labelKey: "history" },
];

// Reusable Controls Component for the open sidebar
const SidebarControls = () => {
  const { toggleSidebar } = useUIStore();
  const { openSettingsModal } = useAuthStore();
  return (
    <div className="flex justify-around items-center bg-secondary p-1 rounded-md">
      <ThemeToggle />
      <LanguageSwitcher />
      <button
        onClick={() => openSettingsModal("settings")}
        className="p-2 rounded-md hover:bg-background"
      >
        <Settings size={18} />
      </button>
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-background"
      >
        <PanelLeftClose size={18} />
      </button>
    </div>
  );
};

export function LeftSidebar() {
  const t = useTranslations("LeftSidebar");
  const { isSidebarOpen, toggleSidebar, controlsPosition } = useUIStore();
  const { user, token, setUser, logout, openSettingsModal, openLogoutConfirm } =
    useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          setUser(await apiClient.getMe(token));
        } catch (error) {
          console.error("Session invalid, logging out.");
          logout();
        }
      }
    };
    fetchUser();
  }, [token, user, setUser, logout]);

  // --- OPEN STATE ---
  if (isSidebarOpen) {
    return (
      <aside className="hidden md:flex flex-col bg-card border-r w-64 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center h-16 border-b px-4 shrink-0">
          <button
            onClick={() => openSettingsModal("niyam")}
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="Niyam Logo"
              width={32}
              height={32}
              className="rounded-md dark:bg-secondary-foreground"
            />
            <h1 className={`${playfair.className} text-2xl font-bold`}>
              {t("title")}
            </h1>
          </button>
        </div>

        {/* Top Controls (Conditional) */}
        {controlsPosition === "top" && (
          <div className="p-4 border-b">
            <SidebarControls />
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-grow px-2 py-4 overflow-y-auto">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.labelKey}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 my-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="ml-4">{t(item.labelKey as string)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Profile & Bottom Controls (Conditional) */}
        <div className="p-4 mt-auto border-t shrink-0 space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => openSettingsModal("profile")}
              className="flex items-center gap-3 flex-grow hover:bg-accent p-2 rounded-md -ml-2"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-secondary-foreground font-bold">
                {user ? user.username.charAt(0).toUpperCase() : <User />}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {user ? user.firstName || user.username : "Guest"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user ? user.email : "Click to log in"}
                </p>
              </div>
            </button>
            {user ? (
              <button
                onClick={openLogoutConfirm}
                className="p-2 rounded-full hover:bg-destructive/20 text-destructive"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button
                onClick={() => openSettingsModal("profile")}
                className="p-2 rounded-full hover:bg-accent"
              >
                <LogIn size={18} />
              </button>
            )}
          </div>
          {controlsPosition === "bottom" && <SidebarControls />}
        </div>
      </aside>
    );
  }

  // --- CLOSED STATE ---
  return (
    <aside className="hidden md:flex flex-col bg-card border-r w-20 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-center h-16 border-b shrink-0">
        <Image
          src="/logo.png"
          alt="Niyam Logo"
          width={32}
          height={32}
          className="rounded-md dark:bg-secondary-foreground"
        />
      </div>

      {/* Conditional Top Re-open Button */}
      {controlsPosition === "top" && (
        <div className="p-2">
          <button
            onClick={toggleSidebar}
            className="w-full flex justify-center p-2 rounded-md hover:bg-accent"
          >
            <PanelRightClose size={20} />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-grow px-2 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.labelKey}>
              <Link
                href={item.href}
                className={`flex justify-center p-3 my-1 rounded-md ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with Profile and Conditional Bottom Re-open Button */}
      <div className="p-4 mt-auto border-t space-y-2 shrink-0">
        <button
          onClick={() => openSettingsModal("profile")}
          className="w-full flex justify-center p-2 rounded-md hover:bg-accent"
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground">
            {user ? user.username.charAt(0).toUpperCase() : <User size={16} />}
          </div>
        </button>
        {controlsPosition === "bottom" && (
          <button
            onClick={toggleSidebar}
            className="w-full flex justify-center p-2 rounded-md hover:bg-accent"
          >
            <PanelRightClose size={20} />
          </button>
        )}
      </div>
    </aside>
  );
}
