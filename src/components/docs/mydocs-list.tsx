"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDocsStore } from "@/lib/docs-store";
import { components } from "@/lib/api-types";
import { Link } from "@/i18n/navigation";
import { FileText, PlusCircle, RefreshCw, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { CreateDocumentModal } from "./create-document-modal";
import { DocumentSettingsModal } from "./document-settings-modal"; // Import the new modal
import { apiClient } from "@/lib/api";

type LegalDocument = components["schemas"]["LegalDocument"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const MyDocumentListItem = ({ doc }: { doc: LegalDocument }) => {
  const { setHoveredDocumentId } = useDocsStore();

  return (
    <motion.li variants={itemVariants}>
      <Link
        href={`/docs/${doc.DocumentIDString}`}
        onMouseEnter={() => setHoveredDocumentId(doc.ID)}
        className="block p-4 rounded-lg hover:bg-secondary transition-all duration-200"
      >
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-primary mt-1 shrink-0" />
          <div>
            <h4 className="font-bold text-foreground">{doc.Title}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Status:{" "}
              <span className="font-medium text-foreground">{doc.Status}</span>
            </p>
          </div>
        </div>
      </Link>
    </motion.li>
  );
};

const EmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => (
  <div className="text-center py-12">
    <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
    <p className="text-muted-foreground text-sm mb-6">
      Create your first legal document to get started.
    </p>
    <Button onClick={onCreateNew}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Create Your First Document
    </Button>
  </div>
);

export function MyDocumentList({
  documents: initialDocuments,
  onDocumentsUpdate,
  onRefresh,
}: {
  documents: LegalDocument[];
  onDocumentsUpdate?: (documents: LegalDocument[]) => void;
  onRefresh?: () => void;
}) {
  const { setHoveredDocumentId } = useDocsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState(initialDocuments);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // Update local state when props change
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);
  const fetchMyDocuments = useCallback(async () => {
    try {
      // setIsLoading(true);
      const response = await apiClient.getMyLegalDocuments();
      setDocuments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch user documents:", err);
    } finally {
      // setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyDocuments();
  }, [fetchMyDocuments]);

  const handleDocumentCreated = (newDocument: LegalDocument) => {
    const updatedDocuments = [newDocument, ...documents];
    setDocuments(updatedDocuments);
    onDocumentsUpdate?.(updatedDocuments);
  };

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  return (
    <>
      <CreateDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDocumentCreated={handleDocumentCreated}
      />
      <DocumentSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onUpdate={fetchMyDocuments}
      />

      <div className="h-full flex flex-col">
        <div className="p-4 border-b shrink-0 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">My Documents</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsSettingsModalOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" /> Manage
          </Button>
        </div>

        <div
          className="flex-grow overflow-y-auto"
          onMouseLeave={() => setHoveredDocumentId(null)}
        >
          {documents.length > 0 ? (
            <motion.ul
              className="space-y-1 p-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {documents.map((doc) => (
                <MyDocumentListItem key={doc.ID} doc={doc} />
              ))}
            </motion.ul>
          ) : (
            <EmptyState onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>
    </>
  );
}
