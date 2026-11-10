import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Trash2, ExternalLink, Film, Star, Eye } from "lucide-react";
import { toKurdishDigits, formatKurdishRating, formatKurdishViews } from "@/lib/kurdish";
import AdminMovieRowActions from "./AdminMovieRowActions";

export const revalidate = 0;

export default async function AdminMoviesPage() {
  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      genres: { include: { genre: true } },
      servers: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">بەڕێوەبردنی فیلمەکان</h1>
          <p className="text-xs text-text-muted mt-1">
            سەرجەم فیلمە تۆمارکراوەکان ({toKurdishDigits(movies.length)} فیلم)
          </p>
        </div>

        <Link
          href="/admin/movies/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>زیادکردنی فیلمی نوێ</span>
        </Link>
      </div>

      {/* Movies Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-surface-light border-b border-border text-text-muted font-bold">
              <tr>
                <th className="p-4">پۆستەر و ناونیشان</th>
                <th className="p-4">ساڵ</th>
                <th className="p-4">کوالیتی</th>
                <th className="p-4">هەڵسەنگاندن</th>
                <th className="p-4">سێرڤەرەکان</th>
                <th className="p-4">بینین</th>
                <th className="p-4">دۆخ</th>
                <th className="p-4 text-center">کردارەکان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {movies.map((m) => (
                <tr key={m.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-hover border border-border">
                        <Image
                          src={m.poster || "/placeholder-poster.jpg"}
                          alt={m.titleKurdish}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate max-w-xs">
                          {m.titleKurdish}
                        </p>
                        <p className="text-[11px] text-text-dim truncate max-w-xs dir-ltr text-end">
                          {m.titleOriginal}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-text-muted">
                    {toKurdishDigits(m.year)}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent border border-accent/30">
                      {m.quality}
                    </span>
                  </td>
                  <td className="p-4 text-accent font-bold">
                    ★ {formatKurdishRating(m.rating)}
                  </td>
                  <td className="p-4 text-text-muted">
                    {toKurdishDigits(m.servers.length)} سێرڤەر
                  </td>
                  <td className="p-4 text-text-dim">
                    {formatKurdishViews(m.views)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === "PUBLISHED"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {m.status === "PUBLISHED" ? "بڵاوکراوەتەوە" : "ڕەشنووس"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <AdminMovieRowActions movieId={m.id} slug={m.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
