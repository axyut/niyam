"use client";

import { useArticle } from "@/contexts/article-context";
import { Loader2, Calendar, Tag, User } from "lucide-react";

export default function InfoPage() {
  const { article } = useArticle();

  if (!article) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-secondary rounded-lg p-6 flex flex-col">
      <div className="shrink-0">
        <h3 className="text-xl font-bold text-foreground">Information</h3>
        <p className="text-sm text-muted-foreground">
          Metadata for: "{article.title.en}"
        </p>
        <div className="border-b my-4"></div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Published Date</p>
            <p className="font-medium">
              {new Date(
                article.publishedAt || article.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Author Type</p>
            <p className="font-medium capitalize">{article.authorType}</p>
          </div>
        </div>
        {article.tags && article.tags.length > 0 && (
          <div className="flex items-start gap-3">
            <Tag className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {article.tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-background text-foreground text-xs font-semibold px-2 py-1 rounded"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
