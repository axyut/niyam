import { create } from "zustand";

export type SearchFilter =
  | "articles"
  | "documents"
  | "professionals"
  | "dictionary";

interface SearchState {
  isOpen: boolean;
  query: string;
  context: SearchFilter | "global";
  filters: Record<SearchFilter, boolean>;

  open: (context?: SearchState["context"]) => void;
  close: () => void;
  setQuery: (query: string) => void;
  toggleFilter: (filter: SearchFilter) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: "",
  context: "global",
  filters: {
    articles: true,
    documents: true,
    professionals: true,
    dictionary: true,
  },

  open: (context = "global") =>
    set((state) => {
      // Create a fresh filter state
      const newFilters: Record<SearchFilter, boolean> = {
        articles: false,
        documents: false,
        professionals: false,
        dictionary: false,
      };

      // If a specific context is provided, enable only that filter.
      // Otherwise (for 'global'), enable all filters.
      if (context !== "global") {
        newFilters[context] = true;
      } else {
        for (const key in newFilters) {
          newFilters[key as SearchFilter] = true;
        }
      }

      return { isOpen: true, context, filters: newFilters, query: "" };
    }),
  close: () => set({ isOpen: false, query: "" }),
  setQuery: (query) => set({ query }),
  toggleFilter: (filter) =>
    set((state) => ({
      filters: { ...state.filters, [filter]: !state.filters[filter] },
    })),
}));
