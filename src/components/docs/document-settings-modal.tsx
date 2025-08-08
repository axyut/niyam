"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Settings,
  ChevronRight,
  Archive,
  Globe,
} from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { components } from "@/lib/api-types";

type LegalDocument = components["schemas"]["LegalDocument"];
type DocumentStatus =
  components["schemas"]["UpdateDocumentStatusInputBody"]["status"];

const statusTabs: DocumentStatus[] = ["private", "public", "archived"];

interface DocumentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh the main list
}

export function DocumentSettingsModal({
  isOpen,
  onClose,
  onUpdate,
}: DocumentSettingsModalProps) {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DocumentStatus>("private");
  const [selectedDocument, setSelectedDocument] =
    useState<LegalDocument | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDocs = async () => {
    setIsLoading(true);
    apiClient
      .getMyLegalDocuments()
      .then((response) => setDocuments(response.data || []))
      .catch((err) =>
        toast.error("Failed to fetch documents", { description: err.message })
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocs();
    }
  }, [isOpen]);

  const filteredDocuments = documents.filter((d) => d.Status === activeTab);

  const handleStatusChange = async (newStatus: DocumentStatus) => {
    if (!selectedDocument) return;
    setIsUpdating(true);
    try {
      await apiClient.updateDocumentStatus(selectedDocument.ID, newStatus);
      toast.success(`Document status updated to "${newStatus}"`);
      setSelectedDocument(null); // Clear selection
      onUpdate(); // Trigger a refresh on the parent component's list
      fetchDocs(); // Re-fetch the documents within the modal
    } catch (err) {
      toast.error("Failed to update status", {
        description: (err as Error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in-fast p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col relative">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings /> Document Management
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="flex-grow grid grid-cols-3 overflow-hidden">
          {/* Left Panel: Status Tabs */}
          <div className="col-span-1 border-r flex flex-col">
            <div className="p-2 space-y-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedDocument(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Middle Panel: Document List */}
          <div className="col-span-1 border-r overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="p-2">
                {filteredDocuments.map((doc) => (
                  <button
                    key={doc.ID}
                    onClick={() => setSelectedDocument(doc)}
                    className={`w-full text-left p-3 rounded-md ${
                      selectedDocument?.ID === doc.ID
                        ? "bg-secondary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <p className="font-semibold truncate">{doc.Title}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated: {new Date(doc.UpdatedAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Details & Actions */}
          <div className="col-span-1 p-4 overflow-y-auto">
            {selectedDocument ? (
              <div className="space-y-4">
                <h4 className="font-bold text-lg">{selectedDocument.Title}</h4>
                <p className="text-sm text-muted-foreground">
                  ID: {selectedDocument.DocumentIDString}
                </p>
                <div className="border-t pt-4">
                  <h5 className="font-semibold mb-2">Change Status</h5>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("public")}
                      disabled={isUpdating}
                    >
                      <Globe className="mr-2 h-4 w-4" /> Make Public
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("archived")}
                      disabled={isUpdating}
                    >
                      <Archive className="mr-2 h-4 w-4" /> Archive
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <ChevronRight className="h-12 w-12 mb-2" />
                <p>Select a document to view details and manage its status.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
