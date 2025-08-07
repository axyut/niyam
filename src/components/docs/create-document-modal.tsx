"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud, FileText, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { components } from "@/lib/api-types";

type LegalDocument = components["schemas"]["LegalDocument"];

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (newDocument: LegalDocument) => void;
}

export function CreateDocumentModal({
  isOpen,
  onClose,
  onDocumentCreated,
}: CreateDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("generic");
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.processNewDocument(file, documentType);
      toast.success("Document uploaded successfully!", {
        description: "It is now being processed and structured.",
      });
      onDocumentCreated(response.LegalDocument);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error("Upload Failed", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in-fast p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-lg relative">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Create a New Document</h3>
          <p className="text-sm text-muted-foreground">
            Upload a file to be scanned, structured, and added to your
            documents.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadCloud className="h-10 w-10" />
              {file ? (
                <p className="font-semibold text-foreground">{file.name}</p>
              ) : (
                <p>
                  {isDragActive
                    ? "Drop the file here..."
                    : "Drag & drop a file here, or click to select"}
                </p>
              )}
              <p className="text-xs">PDF or Image files accepted</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full mt-1 p-2 bg-secondary border-border rounded-md"
            >
              <option value="generic">Generic</option>
              <option value="act">Act</option>
              <option value="policy">Policy</option>
              <option value="regulation">Regulation</option>
              <option value="law">Law</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !file}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Processing..." : "Upload & Structure"}
          </Button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent z-10"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
