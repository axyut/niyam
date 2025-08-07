"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { DocumentView } from "@/components/feed/document-view";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { ArticleProvider } from "@/contexts/article-context"; // Import the provider

type Article = components["schemas"]["ArticleOutputBody"];
type DocumentContent = components["schemas"]["LegalDocumentContent"];

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ slug: string }>();
  const { setActiveArticle } = useAuthStore();

  const [article, setArticle] = useState<Article | null>(null);
  const [documentContent, setDocumentContent] =
    useState<DocumentContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const slug = params.slug;
      if (!slug) return;

      try {
        setIsLoading(true);
        const articleData = await apiClient.getArticleBySlug(slug);
        setArticle(articleData);
        setActiveArticle({ id: articleData.id, title: articleData.title.en });

        setDocumentContent({});
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load article."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      setActiveArticle(null);
    };
  }, [params.slug, setActiveArticle]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article || !documentContent) {
    return (
      <div className="flex items-center justify-center h-full text-destructive bg-destructive/10 p-4 rounded-md">
        {error || "Article could not be loaded."}
      </div>
    );
  }

  return (
    // Wrap the entire layout in our new ArticleProvider
    <ArticleProvider article={article}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
        <div className="bg-card border rounded-lg h-full overflow-hidden">
          <DocumentView article={article} content={documentContent} />
        </div>
        <div className="hidden md:block h-full overflow-hidden">
          {/* The child page (e.g., discuss/page.tsx) will now be rendered here */}
          {children}
        </div>
      </div>
    </ArticleProvider>
  );
}
