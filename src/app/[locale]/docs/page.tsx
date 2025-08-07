"use client";

import { useEffect, useState } from "react";
import { useDocsStore } from "@/lib/docs-store";
import { DocumentList } from "@/components/docs/document-list";
import { RightPanelDefault } from "@/components/feed/right-panel-default";
import { RightPanelDocPreview } from "@/components/docs/right-panel-doc-preview";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { motion, AnimatePresence } from "framer-motion";

type LegalDocument = components["schemas"]["LegalDocument"];

export default function DocsPage() {
  const { hoveredDocumentId } = useDocsStore();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);

  // This logic finds the full document object that is currently being hovered
  const hoveredDocument = documents.find((doc) => doc.ID === hoveredDocumentId);

  // We can fetch the full list here once to avoid re-fetching in the child
  useEffect(() => {
    apiClient.getAllPublicDocuments().then((res) => {
      setDocuments(res.data || []);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel: Shows the list of documents */}
      <div className="bg-card border rounded-lg h-full overflow-hidden">
        {/* We can pass the pre-fetched documents down to the list */}
        <DocumentList />
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
