"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { FeedCard } from "@/components/ui/feed-card";
import { Loader2 } from "lucide-react";

type Article = components["schemas"]["ArticleOutputBody"];

export default function FeedPage() {
  const t = useTranslations("HomePage");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getFeed();
        setArticles(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load feed.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("welcome")}</h1>
      <div className="space-y-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <FeedCard key={article.id} article={article} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold">No articles found</h3>
            <p className="text-muted-foreground">
              The feed is currently empty. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
