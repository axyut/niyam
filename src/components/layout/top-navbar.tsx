"use client";

import React from "react";
import { GlobalSearch } from "./global-search";
import { DocumentTools } from "./document-tools";
import { ContextualNav } from "./contextual-nav";

export function TopNavbar() {
  return (
    <header className="grid grid-cols-2 items-center h-16 bg-card border-b px-4 md:px-6 gap-6">
      {/* Left Column: Global Context */}
      <div className="flex items-center gap-4">
        <GlobalSearch />
        <DocumentTools />
      </div>

      {/* Right Column: Item-Specific Context */}
      <div className="flex items-center justify-end gap-4">
        <ContextualNav />
      </div>
    </header>
  );
}
