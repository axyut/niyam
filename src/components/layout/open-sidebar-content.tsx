"use client";

import React from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useUIStore, useAuthStore, ApiUser, ApiAdmin } from "@/lib/store";
import { NavItem } from "@/config/nav";
import { Playfair_Display } from "next/font/google";
import {
  User,
  Settings,
  PanelLeftClose,
  LogOut,
  LogIn,
  Bell,
} from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { LanguageSwitcher } from "../ui/language-switcher";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

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

interface OpenSidebarContentProps {
  user: (ApiUser | ApiAdmin) | null;
  isClient: boolean;
  visibleNavItems: NavItem[];
  t: (key: string) => string;
}

export function OpenSidebarContent({
  user,
  isClient,
  visibleNavItems,
  t,
}: OpenSidebarContentProps) {
  const { controlsPosition } = useUIStore();
  const { openSettingsModal, openLogoutConfirm } = useAuthStore();
  const pathname = usePathname();

  const displayName = user
    ? "username" in user
      ? user.firstName || user.username
      : user.firstName || user.adminname
    : "Guest";
  const initial = user ? displayName.charAt(0).toUpperCase() : null;

  return (
    <>
      <div className="flex items-center justify-between h-16 border-b px-4 shrink-0">
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
        {/* Notification button moved here */}
        <button
          onClick={() => openSettingsModal("notifications")}
          className="p-2 rounded-full hover:bg-accent relative"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-primary ring-2 ring-card"></span>
        </button>
      </div>

      {controlsPosition === "top" && (
        <div className="p-4 border-b">
          <SidebarControls />
        </div>
      )}

      <nav className="flex-grow px-2 py-4 overflow-y-auto">
        <ul>
          {visibleNavItems.map((item) => (
            <li key={item.labelKey}>
              <Link
                href={item.href}
                className={`flex items-center p-3 my-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-4">{item.labelKey}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t shrink-0 space-y-3">
        {isClient && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => openSettingsModal("account")}
              className="flex items-center gap-3 flex-grow hover:bg-accent p-2 rounded-md -ml-2"
            >
              <div className="relative h-10 w-10">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="User profile"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full rounded-full bg-secondary text-secondary-foreground font-bold">
                    {initial || <User />}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{displayName}</p>
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
                onClick={() => openSettingsModal("account")}
                className="p-2 rounded-full hover:bg-accent"
              >
                <LogIn size={18} />
              </button>
            )}
          </div>
        )}
        {controlsPosition === "bottom" && <SidebarControls />}
      </div>
    </>
  );
}
