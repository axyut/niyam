"use client";

import React from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useUIStore, useAuthStore, SessionUser } from "@/lib/store";
import { NavItem } from "@/config/nav";
import { User, PanelRightClose } from "lucide-react";

interface ClosedSidebarContentProps {
  user: SessionUser | null;
  isClient: boolean;
  visibleNavItems: NavItem[];
}

export function ClosedSidebarContent({
  user,
  isClient,
  visibleNavItems,
}: ClosedSidebarContentProps) {
  const { toggleSidebar, controlsPosition } = useUIStore();
  const { openSettingsModal } = useAuthStore();
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center justify-center h-16 border-b shrink-0">
        <button onClick={() => openSettingsModal("niyam")}>
          <Image
            src="/logo.png"
            alt="Niyam Logo"
            width={32}
            height={32}
            className="rounded-md dark:bg-secondary-foreground"
          />
        </button>
      </div>

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

      <nav className="flex-grow px-2 py-4">
        <ul>
          {visibleNavItems.map((item) => (
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

      <div className="p-4 mt-auto border-t space-y-2 shrink-0">
        {isClient && (
          <button
            onClick={() => openSettingsModal("account")}
            className="w-full flex justify-center p-2 rounded-md hover:bg-accent"
          >
            <div className="relative h-8 w-8">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="User profile"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full rounded-full bg-secondary text-secondary-foreground">
                  <User size={16} />
                </div>
              )}
            </div>
          </button>
        )}
        {controlsPosition === "bottom" && (
          <button
            onClick={toggleSidebar}
            className="w-full flex justify-center p-2 rounded-md hover:bg-accent"
          >
            <PanelRightClose size={20} />
          </button>
        )}
      </div>
    </>
  );
}
