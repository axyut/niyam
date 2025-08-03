"use client";

import { components } from "@/lib/api-types";
import { useAuthStore } from "@/lib/store";
import { MessageSquare, ArrowUp, ArrowDown, Tag } from "lucide-react";

// The type for a single article from our API
type Article = components["schemas"]["ArticleOutputBody"];

interface FeedCardProps {
  article: Article;
}

export function FeedCard({ article }: FeedCardProps) {
  const { setActiveArticle } = useAuthStore();

  const handleCardClick = () => {
    setActiveArticle({ id: article.id, title: article.title.en });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-card border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-all duration-200 group"
    >
      {/* Card Header */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {article.title.en}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Published on{" "}
          {new Date(
            article.publishedAt || article.createdAt
          ).toLocaleDateString()}
        </p>
      </div>

      {/* Summary */}
      <p className="text-foreground/80 mb-4">{article.summary.en}</p>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded"
            >
              <Tag size={12} />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer with Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-2">
          <ArrowUp size={16} />
          <span>{article.stats.upvoteCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDown size={16} />
          <span>{article.stats.downvoteCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span>{article.stats.commentCount}</span>
        </div>
      </div>
    </div>
  );
}
