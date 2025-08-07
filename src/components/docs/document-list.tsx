"use client";

import React, { useEffect, useState } from "react";
import { useDocsStore } from "@/lib/docs-store";
import { apiClient } from "@/lib/api";
import { components } from "@/lib/api-types";
import { Link } from "@/i18n/navigation";
import { Loader2, FileText } from "lucide-react";
import { motion } from "framer-motion";

type LegalDocument = components["schemas"]["LegalDocument"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const DocumentListItem = ({ doc }: { doc: LegalDocument }) => {
  const { setHoveredDocumentId } = useDocsStore();

  return (
    <motion.li variants={itemVariants}>
      <Link
        href={`/docs/${doc.DocumentIDString}`}
        onMouseEnter={() => setHoveredDocumentId(doc.ID)}
        className="block p-4 rounded-lg hover:bg-secondary transition-all duration-200 hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-primary mt-1 shrink-0" />
          <div>
            <h4 className="font-bold text-foreground">{doc.Title}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date(doc.UpdatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Link>
    </motion.li>
  );
};

export function DocumentList() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setHoveredDocumentId } = useDocsStore();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await apiClient.getAllPublicDocuments();
        setDocuments(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b shrink-0">
        <h2 className="text-2xl font-bold">Laws & Policies</h2>
      </div>
      <div
        className="flex-grow overflow-y-auto"
        onMouseLeave={() => setHoveredDocumentId(null)}
      >
        <motion.ul
          className="space-y-1 p-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {documents.length > 0 ? (
            documents.map((doc) => <DocumentListItem key={doc.ID} doc={doc} />)
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No documents found</h3>
              <p className="text-muted-foreground text-sm">
                Please check back later.
              </p>
            </div>
          )}
        </motion.ul>
      </div>
    </div>
  );
}
