"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MessageSquare, Send, User, Loader2, CheckCircle2 } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

interface CommentItem {
  id: string;
  content: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
}

interface CommentSectionProps {
  movieId?: string;
  episodeId?: string;
  initialComments?: CommentItem[];
}

export default function CommentSection({
  movieId,
  episodeId,
  initialComments = [],
}: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!session?.user) {
      setErrorMsg("تکایە سەرەتا بچۆژوورەوە بۆ ناردنی لێدوان.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, episodeId, content: content.trim() }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setContent("");
        setSuccessMsg("لێدوانەکەت بە سەرکەوتوویی تۆمارکرا.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("نەتوانرا لێدوان بنێردرێت.");
      }
    } catch {
      setErrorMsg("هەڵەیەک ڕوویدا لە کاتی پەیوەندیکردن.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-border">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-base font-extrabold text-white">
          لێدوان و بۆچوونەکان ({toKurdishDigits(comments.length)})
        </h3>
      </div>

      {/* Post Comment Box */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/30 text-xs uppercase">
              {session.user.name?.charAt(0) || "D"}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="ڕا و بۆچوونی خۆت بنووسە دەربارەی ئەم بەرهەمە..."
                rows={3}
                className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          {errorMsg && <p className="text-xs text-red-400 ms-12">{errorMsg}</p>}
          {successMsg && (
            <p className="text-xs text-emerald-400 flex items-center gap-1 ms-12">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {successMsg}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>بڵاوکردنەوە</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-surface-light/60 border border-border flex items-center justify-between text-xs text-text-muted">
          <span>بۆ بەشداریکردن لە گفتوگۆ و نووسینی لێدوان، پێویستە سەرەتا بچیتەژوورەوە.</span>
          <Link
            href="/auth/login"
            className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-purple-glow"
          >
            چوونەژوورەوە
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-text-dim py-6 text-center">
            هیچ لێدوانێک نییە تا ئێستا. یەکەم کەس بە کە ڕای خۆت بڵێیت!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl bg-surface-light/40 border border-border flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-hover text-text-muted flex items-center justify-center shrink-0 border border-border text-xs font-bold">
                {comment.user.name?.charAt(0) || <User className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{comment.user.name}</span>
                  <span className="text-[11px] text-text-dim">
                    {new Date(comment.createdAt).toLocaleDateString("ckb", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
