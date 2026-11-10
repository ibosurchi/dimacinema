import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/common/MovieCard";
import { Film } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

interface GenrePageProps {
  params: { slug: string };
}

export const revalidate = 60;

export default async function GenrePage({ params }: GenrePageProps) {
  const genre = await prisma.genre.findUnique({
    where: { slug: params.slug },
  });

  if (!genre) {
    notFound();
  }

  const [movieGenres, seriesGenres] = await Promise.all([
    prisma.movieGenre.findMany({
      where: { genreId: genre.id, movie: { status: "PUBLISHED" } },
      include: { movie: true },
      take: 30,
    }),
    prisma.seriesGenre.findMany({
      where: { genreId: genre.id, series: { status: "PUBLISHED" } },
      include: { series: true },
      take: 30,
    }),
  ]);

  const items = [
    ...movieGenres.map((mg) => ({ ...mg.movie, type: "movie" as const })),
    ...seriesGenres.map((sg) => ({ ...sg.series, type: "series" as const })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 mb-8 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
          بەشی: {genre.nameKurdish} ({genre.nameOriginal})
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          سەرجەم فیلم و زنجیرەکانی تایبەت بە ژانەری {genre.nameKurdish} ({toKurdishDigits(items.length)} بەرهەم)
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center bg-surface border border-border rounded-2xl p-8">
          <Film className="w-12 h-12 text-primary mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-white mb-1">هیچ بەرهەمێک لەم بەشەدا نییە</h3>
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
