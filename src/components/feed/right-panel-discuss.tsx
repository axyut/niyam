"use client";

import React, { useEffect, useState } from "react";
import { components } from "@/lib/api-types";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { CommentCard } from "./comment-card";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

type Article = components["schemas"]["ArticleOutputBody"];
type Comment = components["schemas"]["CommentOutputBody"];

interface RightPanelDiscussProps {
  article: Article;
}

export function RightPanelDiscuss({ article }: RightPanelDiscussProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.getArticleComments(article.id);
        setComments(response.data || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [article.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsPosting(true);
    try {
      const createdComment = await apiClient.createComment(article.id, {
        content: newComment,
      });
      setComments([createdComment, ...comments]);
      setNewComment("");
      toast.success("Comment posted successfully!");
    } catch (err) {
      console.log(err);

      toast.error("Failed to post comment.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleReplySuccess = (newReply: Comment) => {
    console.log(newReply);

    // This is a placeholder for a more complex state update logic
    // For now, we'll just refetch all comments to show the new reply
    apiClient
      .getArticleComments(article.id)
      .then((res) => setComments(res.data || []));
  };

  return (
    <div className="h-full bg-secondary rounded-lg p-6 flex flex-col">
      <div className="shrink-0">
        <h3 className="text-xl font-bold text-foreground">
          Discussion ({article.stats.commentCount})
        </h3>
        <p className="text-sm text-muted-foreground">
          Regarding: "{article.title.en}"
        </p>
        <div className="border-b my-4"></div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 -mr-2 pr-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReplySuccess={handleReplySuccess}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h4 className="font-semibold">No comments yet</h4>
            <p className="text-sm text-muted-foreground">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>

      {user && (
        <form onSubmit={handleCommentSubmit} className="shrink-0 border-t pt-4">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 bg-background border-border rounded-md focus:ring-2 focus:ring-ring"
            rows={3}
          />
          <Button className="w-full mt-2" type="submit" disabled={isPosting}>
            {isPosting ? "Posting..." : "Submit"}
          </Button>
        </form>
      )}
    </div>
  );
}
