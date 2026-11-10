import React from "react";
import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/common/MovieCard";
import { Search, Film } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || "";

  let items: any[] = [];
  if (query) {
    const [movies, series] = await Promise.all([
      prisma.movie.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { titleKurdish: { contains: query } },
            { titleOriginal: { contains: query } },
          ],
        },
      }),
      prisma.series.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { titleKurdish: { contains: query } },
            { titleOriginal: { contains: query } },
          ],
        },
      }),
    ]);

    items = [
      ...movies.map((m) => ({ ...m, type: "movie" as const })),
      ...series.map((s) => ({ ...s, type: "series" as const })),
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header and Search Form */}
      <div className="pb-8 mb-8 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-4">
          گەڕان لە دیما سینەما
        </h1>

        <form method="GET" action="/search" className="max-w-xl flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="ناوی فیلم یان زنجیرە بنووسە..."
              className="w-full bg-surface border border-border rounded-xl ps-10 pe-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all"
          >
            گەڕان
          </button>
        </form>

        {query && (
          <p className="text-xs text-text-muted mt-4">
            ئەنجامەکانی گەڕان بۆ &quot;<strong className="text-white">{query}</strong>&quot; ({toKurdishDigits(items.length)} بەرهەم)
          </p>
        )}
      </div>

      {query && items.length === 0 ? (
        <div className="py-20 text-center bg-surface border border-border rounded-2xl p-8">
          <Film className="w-12 h-12 text-primary mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-white mb-1">هیچ بەرهەمێک نەدۆزرایەوە</h3>
          <p className="text-xs text-text-dim">
            دڵنیابەرەوە لە ڕاستنووسی وشەکان یان ناوی فیلمەکە بە زمانی ئینگلیزی بنووسە.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <MovieCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
          ))}
        </div>
      )}
    </div>
  );
}
