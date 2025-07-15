"use client";

import { Home, FileText, MessageSquare, MoreHorizontal } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/laws", icon: FileText, label: "Laws" },
  { href: "/discussions", icon: MessageSquare, label: "Discuss" },
  // A "More" button can be used to open a modal with other links/settings
  { href: "/more", icon: MoreHorizontal, label: "More" },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    // This component is a flex container, visible only on screens smaller than md
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
