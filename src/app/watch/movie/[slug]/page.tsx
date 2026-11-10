import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PlayerWrapper from "@/components/player/PlayerWrapper";
import MediaRow from "@/components/common/MediaRow";
import CommentSection from "@/components/common/CommentSection";
import { Film, Info, Calendar, Clock, Star } from "lucide-react";
import { toKurdishDigits, formatKurdishDuration, formatKurdishRating } from "@/lib/kurdish";

interface WatchMoviePageProps {
  params: { slug: string };
}

export const revalidate = 60;

export default async function WatchMoviePage({ params }: WatchMoviePageProps) {
  const movie = await prisma.movie.findUnique({
    where: { slug: params.slug },
    include: {
      servers: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
      downloadLinks: true,
      genres: { include: { genre: true } },
      comments: {
        where: { approved: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!movie || movie.status !== "PUBLISHED") {
    notFound();
  }

  // Similar movies
  const genreIds = movie.genres.map((g) => g.genreId);
  const similarMovies = await prisma.movie.findMany({
    where: {
      id: { not: movie.id },
      status: "PUBLISHED",
      genres: { some: { genreId: { in: genreIds } } },
    },
    take: 8,
  });

  return (
    <div className="w-full pb-16">
      {/* Player Wrapper Component */}
      <PlayerWrapper
        title={movie.titleKurdish}
        originalTitle={movie.titleOriginal}
        backdrop={movie.backdrop || movie.poster}
        servers={movie.servers}
        movieId={movie.id}
        downloadLinks={movie.downloadLinks}
      />

      {/* Movie Details Under Player */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold text-xs">
                  فیلم
                </span>
                <span className="text-xs text-text-dim">{toKurdishDigits(movie.year)}</span>
                <span className="text-xs text-accent font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-accent" />
                  {formatKurdishRating(movie.rating)}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {movie.titleKurdish}
              </h1>
              <p className="text-xs text-text-dim mt-0.5 dir-ltr text-end sm:text-start">
                {movie.titleOriginal}
              </p>
            </div>

            <Link
              href={`/movie/${movie.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-light hover:bg-surface-hover border border-border text-text-muted hover:text-white text-xs font-semibold shrink-0"
            >
              <Info className="w-4 h-4 text-primary" />
              <span>لاپەڕەی زانیاری تەواو</span>
            </Link>
          </div>

          {/* Synopsis */}
          <div className="pt-4">
            <h4 className="text-xs font-bold text-text-dim mb-1.5">کورتەی فیلم:</h4>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {movie.synopsis}
            </p>
          </div>
        </div>

        {/* Comments */}
        <CommentSection movieId={movie.id} initialComments={movie.comments} />
      </div>

      {/* Similar Titles */}
      {similarMovies.length > 0 && (
        <div className="mt-12">
          <MediaRow
            title="فیلمە هاوشێوەکان"
            items={similarMovies.map((m) => ({ ...m, type: "movie" }))}
            type="movie"
          />
        </div>
      )}
    </div>
  );
}
