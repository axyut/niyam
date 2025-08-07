import {
  Home,
  Scale,
  Users,
  Book,
  Briefcase,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { components } from "@/lib/api-types";

// Define a type for user roles for clarity
export type UserRole = components["schemas"]["UserOutputBody"]["role"];

// Define the structure for a navigation item
export interface NavItem {
  href: string;
  icon: React.ElementType;
  labelKey: string;
  // An optional array of roles that can see this link
  roles?: UserRole[];
}

// The single source of truth for all navigation items
export const navItems: NavItem[] = [
  {
    href: "/",
    icon: Home,
    labelKey: "Feed",
  },
  {
    href: "/docs",
    icon: Scale,
    labelKey: "Documents",
  },
  {
    href: "/profiles",
    icon: Users,
    labelKey: "Profiles",
  },
  {
    href: "/mydocs",
    icon: Book,
    labelKey: "My Documents",
  },
  // --- Role-specific items ---
  {
    href: "/professional",
    icon: Briefcase,
    labelKey: "Professional",
    roles: ["professional", "admin", "superadmin"], // Only these roles can see this
  },
  {
    href: "/admin",
    icon: Shield,
    labelKey: "Admin",
    roles: ["admin", "superadmin"], // Only admins and superadmins can see this
  },
  {
    href: "/superadmin",
    icon: ShieldAlert,
    labelKey: "Super Admin",
    roles: ["superadmin"], // Only superadmins can see this
  },
];
