"use client";

import { useArticle } from "@/contexts/article-context";
import { Loader2, Link as LinkIcon } from "lucide-react";

export default function ReferencesPage() {
  const { article } = useArticle();

  if (!article) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-secondary rounded-lg p-6 flex flex-col">
      <div className="shrink-0">
        <h3 className="text-xl font-bold text-foreground">References</h3>
        <p className="text-sm text-muted-foreground">
          Linked documents and citations for: "{article.title.en}"
        </p>
        <div className="border-b my-4"></div>
      </div>

      <div className="flex-grow overflow-y-auto flex flex-col items-center justify-center text-center p-4">
        <LinkIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h4 className="font-semibold">No References Found</h4>
        <p className="text-sm text-muted-foreground">
          This article does not have any cross-references linked yet.
        </p>
      </div>
    </div>
  );
}
