"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { ArticleList } from "@/components/feed/article-list";
import { RightPanelDefault } from "@/components/feed/right-panel-default";
import { RightPanelHover } from "@/components/feed/right-panel-hover";
// import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { motion, AnimatePresence } from "framer-motion";

type Article = components["schemas"]["ArticleOutputBody"];

export default function RootPage() {
  const { hoveredArticleId } = useAuthStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hoveredArticle = articles.find(
    (article) => article.id === hoveredArticleId
  );

  // The initial fetch is now handled inside ArticleList,
  // so this page component just needs to manage the state.

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel: Shows the list of articles */}
      <div className="bg-card border rounded-lg h-full overflow-hidden">
        {/* FIX: Pass the required setArticles and setIsLoading props */}
        <ArticleList
          articles={articles}
          setArticles={setArticles}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>

      {/* Right Panel: Shows default content or a preview on hover */}
      <div className="hidden md:block h-full overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredArticle ? hoveredArticle.id : "default"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {hoveredArticle ? (
              <RightPanelHover article={hoveredArticle} />
            ) : (
              <RightPanelDefault />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
