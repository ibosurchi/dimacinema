"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2, User } from "lucide-react";

export default function AdminCommentsManager({ initialComments }: { initialComments: any[] }) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved: !currentStatus }),
      });
      if (res.ok) {
        setComments(
          comments.map((c) => (c.id === id ? { ...c, approved: !currentStatus } : c))
        );
        router.refresh();
      }
    } catch {
      alert("هەڵە لە نوێکردنەوە");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ئایا دڵنیایت لە سڕینەوەی ئەم لێدوانە؟")) return;
    try {
      const res = await fetch("/api/admin/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id));
        router.refresh();
      }
    } catch {
      alert("هەڵە لە سڕینەوە");
    }
  };

  if (comments.length === 0) {
    return (
      <div className="p-12 text-center text-text-muted bg-surface rounded-2xl border border-border">
        هیچ لێدوانێک نەدۆزرایەوە
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
      <div className="divide-y divide-border">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-light/40 transition-colors"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{c.user.name}</span>
                <span className="text-[11px] text-text-dim">
                  {c.movie ? `فیلم: ${c.movie.titleKurdish}` : c.episode ? `ئەڵقە: ${c.episode.titleKurdish}` : ""}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.approved
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {c.approved ? "پەسەندکراو" : "چاوەڕوان"}
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => toggleApproval(c.id, c.approved)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  c.approved
                    ? "bg-surface hover:bg-surface-light border-border text-text-muted"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                }`}
              >
                {c.approved ? "ڕاگرتن" : "پەسەندکردن"}
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 rounded-lg bg-surface hover:bg-red-500/10 text-red-400 border border-border"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
