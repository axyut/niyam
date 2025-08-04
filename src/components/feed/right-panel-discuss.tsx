"use client";

import { components } from "@/lib/api-types";
import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

type Article = components["schemas"]["ArticleOutputBody"];

interface RightPanelDiscussProps {
  article: Article;
}

export function RightPanelDiscuss({ article }: RightPanelDiscussProps) {
  return (
    // FIX: The root element is now a flex container.
    <div className="h-full bg-secondary rounded-lg p-6 flex flex-col">
      {/* Header (will not scroll) */}
      <div className="shrink-0">
        <h3 className="text-xl font-bold text-foreground">Discussion</h3>
        <p className="text-sm text-muted-foreground">
          Regarding: "{article.title.en}"
        </p>
        <div className="border-b my-4"></div>
      </div>

      {/* FIX: This middle section will now grow and scroll if content overflows. */}
      <div className="flex-grow overflow-y-auto flex flex-col items-center justify-center text-center p-4">
        <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h4 className="font-semibold">No comments yet</h4>
        <p className="text-sm text-muted-foreground">
          Be the first to share your thoughts!
        </p>
      </div>

      {/* Footer (will not scroll) */}
      <div className="shrink-0 border-t pt-4">
        <textarea
          placeholder="Add a comment..."
          className="w-full p-2 bg-background border-border rounded-md focus:ring-2 focus:ring-ring"
          rows={3}
        />
        <Button className="w-full mt-2">Submit</Button>
      </div>
    </div>
  );
}
