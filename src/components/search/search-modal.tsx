"use client";

import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useSearchStore, SearchFilter } from "@/lib/search-store";
import { useDebounce } from "@/hooks/use-debounce";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { FileText, Book, User, File, Loader2, Search } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

type SearchResult = components["schemas"]["SearchResultItem"];

const filterConfig: Record<
  SearchFilter,
  { icon: React.ElementType; label: string }
> = {
  articles: { icon: FileText, label: "Articles" },
  documents: { icon: File, label: "Documents" },
  professionals: { icon: User, label: "Professionals" },
  dictionary: { icon: Book, label: "Dictionary" },
};

export function SearchModal() {
  const { isOpen, open, close, query, setQuery, filters, toggleFilter } =
    useSearchStore();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        open();
      }
      if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const activeFilters = Object.entries(filters)
          .filter(([, isActive]) => isActive)
          .map(([key]) => key as SearchFilter);
        const searchPromises = activeFilters.map((filter) => {
          switch (filter) {
            case "articles":
              return apiClient.searchArticles(debouncedQuery);
            case "documents":
              return apiClient.searchDocuments(debouncedQuery);
            case "professionals":
              return apiClient.searchProfessionals(debouncedQuery);
            case "dictionary":
              return apiClient.searchDictionary(debouncedQuery);
            default:
              return Promise.resolve({ results: [] });
          }
        });
        const allResults = await Promise.all(searchPromises);
        const combinedResults = allResults.flatMap((res) => res.results || []);
        setResults(combinedResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    performSearch();
  }, [debouncedQuery, filters]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={close}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search for articles, legal documents, professionals, and dictionary
            terms.
          </Dialog.Description>

          <Command className="w-full">
            {/* Search input with icon */}
            <div className="flex items-center border-b border-border px-3">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Search articles, documents, and more..."
                className="flex h-14 w-full bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex items-center border-b border-border bg-muted/30">
              {Object.entries(filterConfig).map(
                ([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key as SearchFilter)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                      filters[key as SearchFilter]
                        ? "text-primary bg-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {filters[key as SearchFilter] && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                )
              )}
            </div>

            {/* Results */}
            <Command.List className="max-h-96 overflow-y-auto p-2">
              <Command.Empty className="py-12 text-center text-sm">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : !debouncedQuery ? (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Search className="h-12 w-12 text-muted-foreground/30" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Start typing to search
                      </p>
                      <p className="text-xs">
                        Use{" "}
                        <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">
                          ⌘K
                        </kbd>{" "}
                        or{" "}
                        <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">
                          /
                        </kbd>{" "}
                        to open search
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Search className="h-12 w-12 text-muted-foreground/30" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">No results found</p>
                      <p className="text-xs">
                        No results for "{debouncedQuery}". Try adjusting your
                        search or filters.
                      </p>
                    </div>
                  </div>
                )}
              </Command.Empty>

              {!isLoading &&
                results.map((result) => {
                  const IconComponent =
                    result.type === "article"
                      ? FileText
                      : result.type === "document"
                      ? File
                      : result.type === "professional"
                      ? User
                      : Book;

                  return (
                    <Command.Item
                      key={result.id}
                      value={result.title}
                      onSelect={() => {
                        if (result.url) router.push(result.url);
                        close();
                      }}
                      className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md data-[selected]:bg-accent data-[selected]:text-accent-foreground"
                    >
                      <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-medium text-sm leading-none truncate">
                          {result.title}
                        </p>
                        {result.summary && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {result.summary}
                          </p>
                        )}
                        {result.type && (
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                              {result.type}
                            </span>
                          </div>
                        )}
                      </div>
                    </Command.Item>
                  );
                })}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
