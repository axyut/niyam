"use client";

import { components } from "@/lib/api-types";
import { FileText, Calendar, GitCommit } from "lucide-react";

type LegalDocument = components["schemas"]["LegalDocument"];

interface RightPanelDocPreviewProps {
  document: LegalDocument;
}

export function RightPanelDocPreview({ document }: RightPanelDocPreviewProps) {
  const latestVersion = document.Versions?.[document.Versions.length - 1];

  return (
    <div className="h-full bg-secondary rounded-lg p-6 animate-fade-in-fast flex flex-col">
      <div className="shrink-0">
        <FileText className="h-10 w-10 text-primary mb-4" />
        <h3 className="text-xl font-bold text-foreground">{document.Title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Document ID: {document.DocumentIDString}
        </p>
        <div className="border-t my-4"></div>
      </div>

      <div className="flex-grow space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
          <div>
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium">
              {new Date(document.UpdatedAt).toLocaleString()}
            </p>
          </div>
        </div>
        {latestVersion && (
          <div className="flex items-start gap-3">
            <GitCommit className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
              <p className="text-muted-foreground">Latest Version</p>
              <p className="font-medium">{latestVersion.versionNumber}</p>
              <p className="text-xs text-muted-foreground">
                {latestVersion.amendmentNotes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
