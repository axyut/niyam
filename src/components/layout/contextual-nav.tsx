"use client";

import { useAuthStore, AuthState } from "@/lib/store";
import { MessageSquare, Link, Bot, Info } from "lucide-react";

export function ContextualNav() {
  const { activeArticle, activeContextualTab, setActiveContextualTab } =
    useAuthStore();

  const tabs: {
    id: AuthState["activeContextualTab"];
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "discuss", label: "Discuss", icon: MessageSquare },
    { id: "references", label: "References", icon: Link },
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
        <button
          key={tab.id}
          onClick={() => setActiveContextualTab(tab.id)}
          disabled={!activeArticle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
            activeContextualTab === tab.id && activeArticle
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
