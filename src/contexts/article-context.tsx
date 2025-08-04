"use client";

import { createContext, useContext, ReactNode } from "react";
import { components } from "@/lib/api-types";

type Article = components["schemas"]["ArticleOutputBody"];

// Define the shape of our context data
interface ArticleContextType {
  article: Article | null;
}

// Create the context with a default value
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Create a provider component
export function ArticleProvider({
  children,
  article,
}: {
  children: ReactNode;
  article: Article | null;
}) {
  return (
    <ArticleContext.Provider value={{ article }}>
      {children}
    </ArticleContext.Provider>
  );
}

// Create a custom hook to easily access the context
export function useArticle() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticle must be used within an ArticleProvider");
  }
  return context;
}
