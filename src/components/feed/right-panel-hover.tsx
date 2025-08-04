"use client";

import { components } from "@/lib/api-types";
import { ArrowUp, ArrowDown, MessageSquare, Tag } from "lucide-react";

type Article = components["schemas"]["ArticleOutputBody"];

interface RightPanelHoverProps {
  article: Article;
}

export function RightPanelHover({ article }: RightPanelHoverProps) {
  return (
    <div className="h-full bg-secondary rounded-lg p-6 animate-fade-in-fast flex flex-col">
      <h3 className="text-xl font-bold text-foreground">{article.title.en}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Published on{" "}
        {new Date(
          article.publishedAt || article.createdAt
        ).toLocaleDateString()}
      </p>

      <div className="border-t my-4"></div>

      <p className="text-foreground/80 text-sm flex-grow">
        {article.summary.en}
      </p>

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1.5 bg-background text-foreground text-xs font-semibold px-2 py-1 rounded"
            >
              <Tag size={12} />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-around text-sm text-muted-foreground border-t pt-4 shrink-0">
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
