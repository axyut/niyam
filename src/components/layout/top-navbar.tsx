"use client";

import React from "react";
import { useSearchStore } from "@/lib/search-store";
import { usePathname } from "@/i18n/navigation";
import { Search, BookText } from "lucide-react";
import { ContextualNav } from "./contextual-nav";
import { Button } from "../ui/button";

function SearchTrigger() {
  const { open } = useSearchStore();
  const pathname = usePathname();

  // Determine the search context based on the current page
  const getContext = () => {
    if (pathname.startsWith("/profiles")) return "professionals";
    if (pathname.startsWith("/laws")) return "documents";
    // Default to 'articles' for the homepage/feed
    return "articles";
  };

  return (
    <button
      onClick={() => open(getContext())}
      className="relative w-full max-w-md text-left"
    >
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={20}
      />
      <div className="w-full bg-secondary border rounded-lg py-2 pl-10 pr-4 text-muted-foreground">
        Search...
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded border bg-card">
        /
      </div>
    </button>
  );
}

export function TopNavbar() {
  const { open } = useSearchStore();
  return (
    <header className="grid grid-cols-2 items-center h-16 bg-card border-b px-4 md:px-6 gap-6">
      <div className="flex items-center gap-4">
        <SearchTrigger />
        <Button
          variant="outline"
          size="icon"
          aria-label="Search Dictionary"
          onClick={() => open("dictionary")}
        >
          <BookText className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center justify-end gap-4">
        <ContextualNav />
      </div>
    </header>
  );
}
