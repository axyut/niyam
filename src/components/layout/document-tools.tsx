"use client";

import { FileText, GitCommit, BookText } from "lucide-react";
import { Button } from "../ui/button";

export function DocumentTools() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" aria-label="View PDF">
        <FileText className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon" aria-label="View Versions">
        <GitCommit className="h-5 w-5" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Open Dictionary">
        <BookText className="h-5 w-5" />
      </Button>
    </div>
  );
}
