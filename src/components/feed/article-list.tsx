"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { components } from "@/lib/api-types";
import { Link } from "@/i18n/navigation";
import { Loader2, MessageSquare, ArrowUp, ArrowDown, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { FeedFilters } from "./feed-filters"; // Import the new component
import { apiClient } from "@/lib/api";

type Article = components["schemas"]["ArticleOutputBody"];
type FilterType = "trending" | "recent" | "popular";
type SortOrderType = "asc" | "desc";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ArticleListItem = ({ article }: { article: Article }) => {
  const { setHoveredArticleId } = useAuthStore();
  return (
    <motion.li variants={itemVariants}>
      <Link
        href={`/article/${article.slug}`}
        onMouseEnter={() => setHoveredArticleId(article.id)}
        className="block p-4 rounded-lg hover:bg-secondary transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
      >
        <h4 className="font-bold text-foreground">{article.title.en}</h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {article.summary.en}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <ArrowUp size={12} /> {article.stats.upvoteCount}
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown size={12} /> {article.stats.downvoteCount}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={12} /> {article.stats.commentCount}
          </div>
          <div className="flex items-center gap-1">
            <Eye size={12} /> {article.stats.viewCount}
          </div>
        </div>
      </Link>
    </motion.li>
  );
};

interface ArticleListProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ArticleList({
  articles,
  setArticles,
  isLoading,
  setIsLoading,
}: ArticleListProps) {
  const { setHoveredArticleId } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>("trending");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("desc");

  // This effect now re-fetches data whenever the filter or sort order changes
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getFeed(
          1,
          10,
          activeFilter,
          sortOrder
        );
        setArticles(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeed();
  }, [activeFilter, sortOrder, setArticles, setIsLoading]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b shrink-0">
        <FeedFilters
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>
      <div
        className="flex-grow overflow-y-auto"
        onMouseLeave={() => setHoveredArticleId(null)}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.ul
            className="space-y-2 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeFilter + sortOrder} // Re-trigger animation on change
          >
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No articles found</h3>
                <p className="text-muted-foreground text-sm">
                  Try selecting a different filter.
                </p>
              </div>
            )}
          </motion.ul>
        )}
      </div>
    </div>
  );
}
