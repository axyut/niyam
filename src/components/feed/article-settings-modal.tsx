"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Settings,
  ChevronRight,
  Send,
  Check,
  Archive,
  Eye,
} from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { components } from "@/lib/api-types";

type Article = components["schemas"]["ArticleOutputBody"];
type ArticleStatus =
  components["schemas"]["UpdateArticleStatusInputBody"]["status"];

const statusTabs: ArticleStatus[] = [
  "draft",
  "pending_admin_review",
  "reviewed",
  "published",
  "archived",
];

interface ArticleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArticleSettingsModal({
  isOpen,
  onClose,
}: ArticleSettingsModalProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ArticleStatus>("draft");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      apiClient
        .getAllArticles()
        .then((response) => setArticles(response.data || []))
        .catch((err) =>
          toast.error("Failed to fetch articles", { description: err.message })
        )
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const filteredArticles = articles.filter((a) => a.status === activeTab);

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    if (!selectedArticle) return;
    setIsUpdating(true);
    try {
      await apiClient.updateArticleStatus(selectedArticle.id, newStatus);
      toast.success(`Article status updated to "${newStatus}"`);
      // Refresh the list and clear selection
      const response = await apiClient.getAllArticles();
      setArticles(response.data || []);
      setSelectedArticle(null);
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
            <Settings /> Article Management
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
                    setSelectedArticle(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {tab
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Middle Panel: Article List */}
          <div className="col-span-1 border-r overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="p-2">
                {filteredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`w-full text-left p-3 rounded-md ${
                      selectedArticle?.id === article.id
                        ? "bg-secondary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <p className="font-semibold truncate">{article.title.en}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated:{" "}
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Details & Actions */}
          <div className="col-span-1 p-4 overflow-y-auto">
            {selectedArticle ? (
              <div className="space-y-4">
                <h4 className="font-bold text-lg">
                  {selectedArticle.title.en}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedArticle.summary.en}
                </p>
                <div className="border-t pt-4">
                  <h5 className="font-semibold mb-2">Change Status</h5>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("pending_admin_review")}
                      disabled={isUpdating}
                    >
                      <Send className="mr-2 h-4 w-4" /> Submit for Review
                    </Button>
                    <Button
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("reviewed")}
                      disabled={isUpdating}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Mark as Reviewed
                    </Button>
                    <Button
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStatusChange("published")}
                      disabled={isUpdating}
                    >
                      <Check className="mr-2 h-4 w-4" /> Publish
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
                <p>Select an article to view details and manage its status.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
