"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useUIStore, useAuthStore } from "@/lib/store";
import { navItems, UserRole } from "@/config/nav";
import { OpenSidebarContent } from "./open-sidebar-content";
import { ClosedSidebarContent } from "./closed-sidebar-content";

export function LeftSidebar() {
  const t = useTranslations("LeftSidebar");
  const { isSidebarOpen } = useUIStore();
  // The user object is now reliably rehydrated from localStorage
  const { user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Role-based filtering logic
  const hasRequiredRole = (requiredRoles: UserRole[] | undefined) => {
    if (!requiredRoles) return true;
    if (!isClient || !user) return false;
    return requiredRoles.includes(user.role as UserRole);
  };

  const visibleNavItems = navItems.filter((item) =>
    hasRequiredRole(item.roles)
  );

  return (
    <aside
      className={`hidden md:flex flex-col bg-card border-r transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {isSidebarOpen ? (
        <OpenSidebarContent
          user={user}
          isClient={isClient}
          visibleNavItems={visibleNavItems}
          t={t}
        />
      ) : (
        <ClosedSidebarContent
          user={user}
          isClient={isClient}
          visibleNavItems={visibleNavItems}
        />
      )}
    </aside>
  );
}
