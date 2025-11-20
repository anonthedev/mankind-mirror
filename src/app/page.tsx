"use client";

import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ModerationErrorModal } from "@/components/moderation-error-modal";

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  shares_count: number;
  comments: Comment[];
}

interface PostWithInteractions extends Post {
  liked: boolean;
  showComments: boolean;
}

interface Comment {
  id: string;
  text: string;
  timestamp: string;
}

export default function Home() {
  const [posts, setPosts] = useState<PostWithInteractions[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [showModerationModal, setShowModerationModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const postsWithInteractions = (data || []).map((post: any) => ({
          ...post,
          comments: Array.isArray(post.comments) ? post.comments : [],
          likes_count: post.likes_count || 0,
          shares_count: post.shares_count || 0,
          liked: false,
          showComments: false,
        }));

        setPosts(postsWithInteractions);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);

    try {
      const newLikesCount = post?.liked
        ? (post.likes_count || 0) - 1
        : (post?.likes_count || 0) + 1;

      // Update local state
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked: !p.liked,
                likes_count: newLikesCount,
              }
            : p
        )
      );

      // Update via API
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes_count: newLikesCount }),
      });

      if (!response.ok) {
        console.error("Failed to update like:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleToggleComments = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  const handleAddComment = async (postId: string) => {
    if (!replyText.trim()) return;

    const post = posts.find((p) => p.id === postId);
    setIsSubmittingComment(true);

    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const updatedComments = [...(post?.comments || []), newComment];

      // Update via API (backend will moderate the comment)
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the comment was flagged by moderation
        if (data.flagged) {
          setModerationError(
            data.error || 
            "Your comment contains inappropriate content. Please revise it to be more supportive."
          );
          setShowModerationModal(true);
        } else {
          setModerationError("Failed to add comment. Please try again.");
          setShowModerationModal(true);
        }
        console.error("Failed to add comment:", data.error);
        return;
      }

      // Update local state only after successful moderation
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: updatedComments,
              }
            : p
        )
      );

      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      setModerationError("An error occurred while posting your comment. Please try again.");
      setShowModerationModal(true);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = async (postId: string, content: string) => {
    const post = posts.find((p) => p.id === postId);
    const text = `${content.substring(0, 100)}...`;

    try {
      // Try native share first
      if (navigator.share) {
        await navigator.share({
          text: text,
          title: "Community Story",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(content);
        setShareMessage("✓ Post copied to clipboard!");
        setTimeout(() => setShareMessage(""), 2000);
      }

      const newSharesCount = (post?.shares_count || 0) + 1;

      // Update local state
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, shares_count: newSharesCount } : p
        )
      );

      // Update via API
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shares_count: newSharesCount }),
      });

      if (!response.ok) {
        console.error("Failed to update shares:", response.statusText);
      }
    } catch (error) {
      console.log("Share handled");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-foreground text-lg font-light">
          Loading stories...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-block mb-6">
            <h1 className="text-5xl font-bold text-foreground">Community</h1>
            <div className="h-1 w-24 bg-primary rounded-full mt-2"></div>
          </div>
          <p className="text-muted-foreground text-lg font-light">
            Shared stories and experiences. You're never alone in this journey.
          </p>
        </div>

        {/* Share Success Message */}
        {shareMessage && (
          <div className="mb-6 bg-green-400 text-foreground px-6 py-3 rounded-full font-medium text-center animate-pulse">
            {shareMessage}
          </div>
        )}

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={post.id} className="group">
                {/* Main Card */}
                <div className="bg-card text-card-foreground border-2 border-border rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  {/* Header with date and icon */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
                      <span className="text-primary text-sm font-semibold tracking-wide">
                        {formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-2xl">💭</div>
                  </div>

                  {/* Content */}
                  <p className="text-foreground text-lg leading-relaxed mb-8 whitespace-pre-wrap font-light">
                    {post.content}
                  </p>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-colors cursor-pointer">
                      Community
                    </span>
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-colors cursor-pointer">
                      Support
                    </span>
                    <span className="bg-muted text-muted-foreground text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-colors cursor-pointer">
                      Anonymous
                    </span>
                  </div>

                  {/* Engagement Footer */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/btn"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            post.liked ? "fill-primary text-primary" : ""
                          }`}
                        />
                        <span className="text-xs font-semibold">
                          {post.likes_count || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => handleToggleComments(post.id)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/btn"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs font-semibold">
                          {post.comments.length}
                        </span>
                      </button>
                      <button
                        onClick={() => handleShare(post.id, post.content)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/btn"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="text-xs font-semibold">Share</span>
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      #{String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Comments Section */}
                  {post.showComments && (
                    <div className="pt-6 border-t border-border space-y-4">
                      {/* Previous Comments */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {post.comments.map((comment: any) => (
                            <div
                              key={comment.id}
                              className="bg-muted/50 rounded-lg p-3"
                            >
                              <p className="text-foreground text-sm">
                                {comment.text}
                              </p>
                              <p className="text-muted-foreground text-xs mt-2">
                                {comment.timestamp}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input */}
                      {replyingTo === post.id ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !isSubmittingComment) {
                                  handleAddComment(post.id);
                                }
                              }}
                              placeholder="Share your support..."
                              className="flex-1 bg-muted text-foreground text-sm rounded-lg px-4 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                              autoFocus
                              disabled={isSubmittingComment}
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={isSubmittingComment || !replyText.trim()}
                              className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[80px] justify-center"
                            >
                              {isSubmittingComment ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span className="hidden sm:inline">Checking...</span>
                                </>
                              ) : (
                                "Send"
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              disabled={isSubmittingComment}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          {isSubmittingComment && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Checking content safety...</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(post.id)}
                          className="w-full bg-muted text-foreground font-semibold py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm"
                        >
                          Write a reply...
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-3xl p-16 text-center shadow-lg border border-border">
            <div className="text-5xl mb-4">💭</div>
            <p className="text-muted-foreground text-lg font-light">
              No stories yet. Be the first to share your thoughts.
            </p>
            <p className="text-muted-foreground/70 text-sm mt-3">
              Your story could inspire and support someone today.
            </p>
          </div>
        )}
      </div>

      <ModerationErrorModal
        open={showModerationModal}
        onOpenChange={setShowModerationModal}
        message={moderationError || ""}
      />
    </div>
  );
}
