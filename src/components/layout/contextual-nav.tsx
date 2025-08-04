"use client";

import { useAuthStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { MessageSquare, Link as LinkIcon, Bot, Info } from "lucide-react";

type ContextualTab = "discuss" | "references" | "ai" | "info";

export function ContextualNav() {
  const { activeArticle } = useAuthStore();
  const params = useParams<{ slug: string }>();
  const pathname = usePathname();

  const pathSegments = pathname.split("/");
  const currentTab = pathSegments[pathSegments.length - 1] as ContextualTab;

  const activeTab = ["discuss", "references", "ai", "info"].includes(currentTab)
    ? currentTab
    : "discuss";

  const tabs: { id: ContextualTab; label: string; icon: React.ElementType }[] =
    [
      { id: "discuss", label: "Discuss", icon: MessageSquare },
      { id: "references", label: "References", icon: LinkIcon },
      { id: "ai", label: "Ask AI", icon: Bot },
      { id: "info", label: "Info", icon: Info },
    ];

  return (
    <div
      className={`flex items-center gap-2 p-1 bg-secondary rounded-lg transition-opacity ${
        activeArticle ? "opacity-100" : "opacity-40 pointer-events-none"
      }`}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/article/${params.slug}/${tab.id}`}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
            activeTab === tab.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
