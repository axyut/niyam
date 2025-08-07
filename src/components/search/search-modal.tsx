"use client";

import React, { useState, useEffect } from "react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useSearchStore, SearchFilter } from "@/lib/search-store";
import { useDebounce } from "@/hooks/use-debounce";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { FileText, Book, User, File, Search } from "lucide-react";
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
  const { isOpen, close, query, setQuery, filters, toggleFilter } =
    useSearchStore();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  // FIX: The global keyboard listener has been removed from this component.
  // It will be moved to the SearchTrigger component.

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
            <div className="flex items-center border-b border-border px-3">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Search articles, documents, and more..."
                className="flex h-14 w-full bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
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
            <Command.List className="max-h-96 overflow-y-auto p-2">
              <Command.Empty className="py-12 text-center text-sm">
                {/* ... (empty state UI remains the same) ... */}
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
