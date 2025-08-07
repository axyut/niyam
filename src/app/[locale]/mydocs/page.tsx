"use client";

import { useEffect, useState } from "react";
import { useDocsStore } from "@/lib/docs-store";
import { MyDocumentList } from "@/components/docs/mydocs-list";
import { RightPanelDefault } from "@/components/feed/right-panel-default";
import { RightPanelDocPreview } from "@/components/docs/right-panel-doc-preview";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type LegalDocument = components["schemas"]["LegalDocument"];

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
    <Loader2 className="h-12 w-12 animate-spin mb-4" />
    <p className="text-lg font-medium">Loading your documents...</p>
    <p className="text-sm text-muted-foreground">
      Please wait while we fetch your legal documents
    </p>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2">Failed to load documents</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      We couldn't load your documents right now. Please check your connection
      and try again.
    </p>
    <Button onClick={onRetry}>
      <RefreshCw className="mr-2 h-4 w-4" />
      Try Again
    </Button>
  </div>
);

export default function MyDocumentsPage() {
  const { hoveredDocumentId } = useDocsStore();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hoveredDocument = documents.find((doc) => doc.ID === hoveredDocumentId);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getMyLegalDocuments();
      setDocuments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDocumentUpdate = (updatedDocuments: LegalDocument[]) => {
    setDocuments(updatedDocuments);
  };

  const handleRetry = () => {
    fetchDocuments();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
        <div className="bg-card border rounded-lg h-full overflow-hidden">
          <LoadingState />
        </div>
        <div className="hidden md:block h-full overflow-hidden">
          <RightPanelDefault />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
        <div className="bg-card border rounded-lg h-full overflow-hidden">
          <ErrorState onRetry={handleRetry} />
        </div>
        <div className="hidden md:block h-full overflow-hidden">
          <RightPanelDefault />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel: Shows the user's list of documents */}
      <div className="bg-card border rounded-lg h-full overflow-hidden">
        <MyDocumentList
          documents={documents}
          onDocumentsUpdate={handleDocumentUpdate}
          onRefresh={fetchDocuments}
        />
      </div>

      {/* Right Panel: Shows default or hover content with animation */}
      <div className="hidden md:block h-full overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredDocument ? hoveredDocument.ID : "default"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {hoveredDocument ? (
              <RightPanelDocPreview document={hoveredDocument} />
            ) : (
              <RightPanelDefault />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
