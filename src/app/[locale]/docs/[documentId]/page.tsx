"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { StructuredDocumentView } from "@/components/docs/structured-document-view";
import { Loader2 } from "lucide-react";

type LegalDocument = components["schemas"]["LegalDocument"];
type DocumentContent = components["schemas"]["LegalDocumentContent"];

export default function SelectedDocumentPage() {
  const params = useParams<{ documentId: string }>();

  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [content, setContent] = useState<DocumentContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const documentId = params.documentId as string;
      if (!documentId) return;

      try {
        setIsLoading(true);
        const [docResponse, contentResponse] = await Promise.all([
          apiClient.getDocumentById(documentId),
          apiClient.getStructuredDocument(documentId),
        ]);

        setDocument(docResponse.LegalDocument);
        setContent(contentResponse);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load document."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.documentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !document || !content) {
    return (
      <div className="flex items-center justify-center h-full text-destructive bg-destructive/10 p-4 rounded-md">
        {error || "Document could not be loaded."}
      </div>
    );
  }

  return (
    // This page now has a single column layout to focus on the document
    <div className="bg-card border rounded-lg h-[calc(100vh-8rem)] overflow-y-auto">
      <StructuredDocumentView document={document} content={content} />
    </div>
  );
}
