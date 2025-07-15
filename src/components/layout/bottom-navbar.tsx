"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuthStore } from "@/lib/store";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  ChevronUp,
  User,
  MoreHorizontal,
  Settings,
  Bell,
} from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { LanguageSwitcher } from "../ui/language-switcher";
import { navItems, UserRole } from "@/config/nav";

// --- Sub-component for the main navigation pop-up ---
const MobileNavMenu = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const hasRequiredRole = (requiredRoles: UserRole[] | undefined) => {
    if (!requiredRoles) return true;
    if (!user) return false;
    return requiredRoles.includes(user.role as UserRole);
  };

  const visibleNavItems = navItems.filter((item) =>
    hasRequiredRole(item.roles)
  );

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm bg-card border rounded-lg shadow-2xl p-2 animate-fade-in-up">
      <ul className="space-y-1">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.labelKey}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 p-3 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.labelKey}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// --- Sub-component for the "More" pop-up ---
const MoreMenu = () => {
  const { openSettingsModal } = useAuthStore();
  return (
    <div className="absolute bottom-24 right-4 w-56 bg-card border rounded-lg shadow-2xl p-2 animate-fade-in-up">
      <div className="flex justify-between items-center p-2">
        <span className="text-sm font-medium">Theme</span>
        <ThemeToggle />
      </div>
      <div className="flex justify-between items-center p-2">
        <span className="text-sm font-medium">Language</span>
        <LanguageSwitcher />
      </div>
      <button
        onClick={() => openSettingsModal("notifications")}
        className="flex justify-between items-center w-full p-2 hover:bg-accent rounded-md text-sm font-medium"
      >
        <span>Notifications</span>
        <Bell className="h-4 w-4" />
      </button>
      <button
        onClick={() => openSettingsModal("settings")}
        className="flex justify-between items-center w-full p-2 hover:bg-accent rounded-md text-sm font-medium"
      >
        <span>Settings</span>
        <Settings className="h-4 w-4" />
      </button>
    </div>
  );
};

export function BottomNavbar() {
  const { user, openSettingsModal } = useAuthStore();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavToggle = () => {
    setIsMoreOpen(false);
    setIsNavOpen(!isNavOpen);
  };
  const handleMoreToggle = () => {
    setIsNavOpen(false);
    setIsMoreOpen(!isMoreOpen);
  };

  return (
    <nav ref={menuRef} className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      {isNavOpen && <MobileNavMenu onClose={() => setIsNavOpen(false)} />}
      {isMoreOpen && <MoreMenu />}
      <div className="bg-card/70 backdrop-blur-lg border-t h-20 grid grid-cols-5 items-center">
        <button
          onClick={() => openSettingsModal("niyam")}
          className="flex justify-center items-center h-full"
        >
          <Image
            src="/logo.png"
            alt="Niyam Logo"
            width={28}
            height={28}
            className="rounded-md"
          />
        </button>
        <Link href="/" className="flex justify-center items-center h-full">
          <Home className="h-7 w-7 text-foreground" />
        </Link>
        <div className="relative flex justify-center items-center h-full">
          <button
            onClick={handleNavToggle}
            className="absolute bottom-5 bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-4 border-card"
          >
            <ChevronUp
              className={`h-8 w-8 transition-transform ${
                isNavOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <button
          onClick={handleMoreToggle}
          className="flex justify-center items-center h-full"
        >
          <MoreHorizontal className="h-7 w-7 text-foreground" />
        </button>
        <button
          onClick={() => openSettingsModal("account")}
          className="flex justify-center items-center h-full"
        >
          <div className="relative h-8 w-8">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="User profile"
                layout="fill"
                className="rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full rounded-full bg-secondary text-secondary-foreground">
                <User size={18} />
              </div>
            )}
          </div>
        </button>
      </div>
    </nav>
  );
}
