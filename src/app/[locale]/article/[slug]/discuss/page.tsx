"use client";

import { RightPanelDiscuss } from "@/components/feed/right-panel-discuss";
import { useArticle } from "@/contexts/article-context"; // Import the custom hook
import { Loader2 } from "lucide-react";

// This page no longer needs to receive props
export default function DiscussPage() {
  // Consume the article data from the context
  const { article } = useArticle();

  // It's good practice to handle the case where the article might still be loading
  if (!article) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <RightPanelDiscuss article={article} />;
}
