"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "../ui/button";

// Define the types for the props for type safety
type FilterType = "trending" | "recent" | "popular";
type SortOrderType = "asc" | "desc";

interface FeedFiltersProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  sortOrder: SortOrderType;
  setSortOrder: (order: SortOrderType) => void;
}

const filterOptions: { id: FilterType; label: string }[] = [
  { id: "trending", label: "Trending" },
  { id: "recent", label: "Recent" },
  { id: "popular", label: "Popular" },
];

export function FeedFilters({
  activeFilter,
  setActiveFilter,
  sortOrder,
  setSortOrder,
}: FeedFiltersProps) {
  return (
    <div className="flex justify-between items-center">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeFilter === option.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter(option.id)}
            className="px-4"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Sort Order Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        className="w-28"
      >
        {sortOrder === "desc" ? (
          <ArrowDown className="mr-2 h-4 w-4" />
        ) : (
          <ArrowUp className="mr-2 h-4 w-4" />
        )}
        {sortOrder === "desc" ? "Newest" : "Oldest"}
      </Button>
    </div>
  );
}
