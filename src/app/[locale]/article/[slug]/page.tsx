"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { DocumentView } from "@/components/feed/document-view";
import { RightPanelDiscuss } from "@/components/feed/right-panel-discuss";
import { Loader2 } from "lucide-react";

type Article = components["schemas"]["ArticleOutputBody"];
type DocumentContent = components["schemas"]["LegalDocumentContent"];

export default function SelectedArticlePage() {
  const params = useParams<{ slug: string }>();

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

        if (articleData.id) {
          apiClient.recordArticleView(articleData.id).catch((err) => {
            // We can log an error if it fails, but we don't need to block the UI.
            console.error("Failed to record view:", err);
          });
        }
        // Using mock document content for now
        setDocumentContent({
          sections: [
            {
              section_id: "1",
              heading: "Chapter 1: Introduction",
              paragraphs: Array.from({ length: 10 }, (_, i) => ({
                paragraph_id: `p1-${i}`,
                original_text:
                  "This is a paragraph of the introductory chapter. It is repeated to demonstrate scrolling behavior.",
              })),
            },
            {
              section_id: "2",
              heading: "Chapter 2: Core Principles",
              paragraphs: Array.from({ length: 15 }, (_, i) => ({
                paragraph_id: `p2-${i}`,
                original_text:
                  "This section outlines the core principles of the document. It is also repeated to ensure the content is long enough to scroll.",
              })),
            },
          ],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load article."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* FIX: Added overflow-hidden to ensure the panel itself never scrolls */}
      <div className="bg-card border rounded-lg h-full overflow-hidden">
        <DocumentView article={article} documentContent={documentContent} />
      </div>
      <div className="hidden md:block h-full overflow-hidden">
        <RightPanelDiscuss article={article} />
      </div>
    </div>
  );
}
