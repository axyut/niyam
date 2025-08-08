"use client";

import React, { useState } from "react";
import { X, Loader2, FilePlus } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { components } from "@/lib/api-types";

type Article = components["schemas"]["ArticleOutputBody"];

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleCreated: (newArticle: Article) => void;
}

export function CreateArticleModal({
  isOpen,
  onClose,
  onArticleCreated,
}: CreateArticleModalProps) {
  const [titleEn, setTitleEn] = useState("");
  const [titleNp, setTitleNp] = useState("");
  const [summaryEn, setSummaryEn] = useState("");
  const [summaryNp, setSummaryNp] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newArticle = await apiClient.createArticle({
        title: { en: titleEn, np: titleNp },
        summary: { en: summaryEn, np: summaryNp },
        content: {
          en: "<p>Initial content...</p>",
          np: "<p>प्रारम्भिक सामग्री...</p>",
        }, // Placeholder content
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: "draft",
      });
      toast.success("Article created successfully!", {
        description: "You can now link a document to it.",
      });
      onArticleCreated(newArticle);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error("Failed to create article", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in-fast p-4">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-2xl relative">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Create New Article</h3>
          <p className="text-sm text-muted-foreground">
            Start by providing the basic details. You can link a document in the
            next step.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title (English)</label>
                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full mt-1 p-2 bg-secondary border-border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title (Nepali)</label>
                <input
                  value={titleNp}
                  onChange={(e) => setTitleNp(e.target.value)}
                  className="w-full mt-1 p-2 bg-secondary border-border rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Summary (English)</label>
              <textarea
                value={summaryEn}
                onChange={(e) => setSummaryEn(e.target.value)}
                className="w-full mt-1 p-2 bg-secondary border-border rounded-md"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Summary (Nepali)</label>
              <textarea
                value={summaryNp}
                onChange={(e) => setSummaryNp(e.target.value)}
                className="w-full mt-1 p-2 bg-secondary border-border rounded-md"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., privacy, technology, law"
                className="w-full mt-1 p-2 bg-secondary border-border rounded-md"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate tags with a comma.
              </p>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FilePlus className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Creating..." : "Create Draft Article"}
            </Button>
          </div>
        </form>

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
