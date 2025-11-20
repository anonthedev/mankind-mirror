"use client";

import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";

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

      // Update local state
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

      // Update via API
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments }),
      });

      if (!response.ok) {
        console.error("Failed to add comment:", response.statusText);
      }

      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding comment:", error);
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
      <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-50 to-orange-300 flex items-center justify-center">
        <div className="text-gray-800 text-lg font-light">
          Loading stories...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-300">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-block mb-6">
            <h1 className="text-5xl font-bold text-gray-800">Community</h1>
            <div className="h-1 w-24 bg-orange-400 rounded-full mt-2"></div>
          </div>
          <p className="text-gray-600 text-lg font-light">
            Shared stories and experiences. You're never alone in this journey.
          </p>
        </div>

        {/* Share Success Message */}
        {shareMessage && (
          <div className="mb-6 bg-green-400 text-gray-800 px-6 py-3 rounded-full font-medium text-center animate-pulse">
            {shareMessage}
          </div>
        )}

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={post.id} className="group">
                {/* Main Card */}
                <div className="bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  {/* Header with date and icon */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-400 rounded-full mt-1"></div>
                      <span className="text-orange-400 text-sm font-semibold tracking-wide">
                        {formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="text-gray-600 text-2xl">💭</div>
                  </div>

                  {/* Content */}
                  <p className="text-white text-lg leading-relaxed mb-8 whitespace-pre-wrap font-light">
                    {post.content}
                  </p>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-700">
                    <span className="bg-orange-400 text-gray-800 text-xs font-bold px-4 py-2 rounded-full hover:bg-orange-300 transition-colors cursor-pointer">
                      Community
                    </span>
                    <span className="bg-gray-700 text-orange-400 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-600 transition-colors cursor-pointer">
                      Support
                    </span>
                    <span className="bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-600 transition-colors cursor-pointer">
                      Anonymous
                    </span>
                  </div>

                  {/* Engagement Footer */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors group/btn"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            post.liked ? "fill-orange-400 text-orange-400" : ""
                          }`}
                        />
                        <span className="text-xs font-semibold">
                          {post.likes_count || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => handleToggleComments(post.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors group/btn"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs font-semibold">
                          {post.comments.length}
                        </span>
                      </button>
                      <button
                        onClick={() => handleShare(post.id, post.content)}
                        className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors group/btn"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="text-xs font-semibold">Share</span>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      #{String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Comments Section */}
                  {post.showComments && (
                    <div className="pt-6 border-t border-gray-700 space-y-4">
                      {/* Previous Comments */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {post.comments.map((comment: any) => (
                            <div
                              key={comment.id}
                              className="bg-gray-700 rounded-lg p-3"
                            >
                              <p className="text-gray-300 text-sm">
                                {comment.text}
                              </p>
                              <p className="text-gray-500 text-xs mt-2">
                                {comment.timestamp}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input */}
                      {replyingTo === post.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(post.id);
                              }
                            }}
                            placeholder="Share your support..."
                            className="flex-1 bg-gray-700 text-white text-sm rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            autoFocus
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="bg-orange-400 text-gray-800 font-bold px-4 py-2 rounded-lg hover:bg-orange-300 transition-colors"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="text-gray-400 hover:text-gray-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(post.id)}
                          className="w-full bg-gray-700 text-orange-400 font-semibold py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
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
          <div className="bg-gray-800 rounded-3xl p-16 text-center shadow-lg">
            <div className="text-5xl mb-4">💭</div>
            <p className="text-gray-400 text-lg font-light">
              No stories yet. Be the first to share your thoughts.
            </p>
            <p className="text-gray-600 text-sm mt-3">
              Your story could inspire and support someone today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
