"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";

export default function AdminMovieRowActions({
  movieId,
  slug,
}: {
  movieId: string;
  slug: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("ئایا دڵنیایت لە سڕینەوەی ئەم فیلمە؟ ئەم کردارە ناگەڕێتەوە.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/movies/${movieId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("سڕینەوە سەرکەوتوو نەبوو");
      }
    } catch {
      alert("هەڵەیەک لە پەیوەندی هەیە");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      <Link
        href={`/movie/${slug}`}
        target="_blank"
        className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover text-text-muted hover:text-white border border-border"
        title="بینین لە ماڵپەڕ"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
      <Link
        href={`/admin/movies/${movieId}/edit`}
        className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover text-primary hover:text-primary-hover border border-border"
        title="دەستکاری"
      >
        <Edit className="w-3.5 h-3.5" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 rounded-lg bg-surface hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-border disabled:opacity-50"
        title="سڕینەوە"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
