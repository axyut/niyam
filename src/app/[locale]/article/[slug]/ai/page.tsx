"use client";

import { useArticle } from "@/contexts/article-context";
import { Loader2, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AskAiPage() {
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
        <h3 className="text-xl font-bold text-foreground">Ask AI</h3>
        <p className="text-sm text-muted-foreground">
          Get insights on: "{article.title.en}"
        </p>
        <div className="border-b my-4"></div>
      </div>

      <div className="flex-grow overflow-y-auto flex flex-col items-center justify-center text-center p-4">
        <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h4 className="font-semibold">AI Assistant</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Ask questions or get a summary of this document.
        </p>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Summarize Document
        </Button>
      </div>

      <div className="shrink-0 border-t pt-4">
        <input
          placeholder="Ask a question about this document..."
          className="w-full p-2 bg-background border-border rounded-md focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
