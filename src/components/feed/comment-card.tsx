"use client";

import React, { useState } from "react";
import Image from "next/image";
import { components } from "@/lib/api-types";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

type Comment = components["schemas"]["CommentOutputBody"];

interface CommentCardProps {
  comment: Comment;
  onReplySuccess: (newReply: Comment) => void;
}

export function CommentCard({ comment, onReplySuccess }: CommentCardProps) {
  const { user } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;

    setIsReplying(true);
    try {
      const newReply = await apiClient.createReply(comment.id, {
        content: replyContent,
      });
      onReplySuccess(newReply);
      setShowReplyForm(false);
      setReplyContent("");
      toast.success("Reply posted!");
    } catch (err) {
      console.log(err);

      toast.error("Failed to post reply.");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Image
        src={
          comment.author.imageUrl ||
          `https://placehold.co/40x40/1a1a1a/ffffff/png?text=${comment.author.name.charAt(
            0
          )}`
        }
        alt={comment.author.name}
        width={40}
        height={40}
        className="rounded-full h-10 w-10 mt-1"
      />
      <div className="flex-grow">
        <div className="bg-background p-3 rounded-lg">
          <p className="font-semibold text-sm">{comment.author.name}</p>
          <p className="text-foreground/90">{comment.content}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground px-3 pt-1">
          <button className="hover:text-primary flex items-center gap-1">
            <ThumbsUp size={14} /> {comment.stats.upvoteCount}
          </button>
          <button className="hover:text-primary flex items-center gap-1">
            <ThumbsDown size={14} /> {comment.stats.downvoteCount}
          </button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="hover:text-primary flex items-center gap-1"
          >
            <MessageSquare size={14} /> Reply
          </button>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>

        {showReplyForm && user && (
          <form onSubmit={handleReplySubmit} className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-grow p-2 text-sm bg-background border rounded-md"
            />
            <Button size="sm" type="submit" disabled={isReplying}>
              {isReplying ? "Replying..." : "Reply"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
