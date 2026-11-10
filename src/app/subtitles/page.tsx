import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/common/MovieCard";
import { Subtitles, Film, Tv } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

export const revalidate = 60;

export default async function SubtitlesPage() {
  const [movies, seriesList] = await Promise.all([
    prisma.movie.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
    prisma.series.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ]);

  const allItems = [
    ...movies.map((m) => ({ ...m, type: "movie" as const })),
    ...seriesList.map((s) => ({ ...s, type: "series" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 mb-8 border-b border-border flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
          <Subtitles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            بەرهەمە ژێرنووسکراوەکان بە کوردی
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            سەرجەم فیلم و زنجیرەکان کە بە ژێرنووسی فەرمی کوردی سۆرانی ئامادەکراون ({toKurdishDigits(allItems.length)} ناونیشان)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {allItems.map((item) => (
          <MovieCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
        ))}
      </div>
    </div>
  );
}
