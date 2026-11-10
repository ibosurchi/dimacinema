import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  Play, 
  Star, 
  Clock, 
  Calendar, 
  Film, 
  Globe, 
  Download, 
  Video,
  Users,
  Eye
} from "lucide-react";
import { toKurdishDigits, formatKurdishDuration, formatKurdishRating } from "@/lib/kurdish";
import WatchlistButton from "@/components/common/WatchlistButton";
import ReactionButton from "@/components/common/ReactionButton";
import CastSlider from "@/components/common/CastSlider";
import MediaRow from "@/components/common/MediaRow";
import CommentSection from "@/components/common/CommentSection";

interface MovieDetailProps {
  params: { slug: string };
}

export const revalidate = 60;

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  const movie = await prisma.movie.findUnique({
    where: { slug: params.slug },
    include: {
      genres: { include: { genre: true } },
      country: true,
      downloadLinks: true,
      credits: {
        include: { person: true },
        orderBy: { order: "asc" },
      },
      reactions: true,
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

  // Fetch similar movies sharing any genre
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
      {/* Blurred Backdrop Header */}
      <div className="relative w-full min-h-[500px] sm:min-h-[580px] -mt-20 overflow-hidden flex items-end">
        <Image
          src={movie.backdrop || movie.poster}
          alt={movie.titleKurdish}
          fill
          priority
          className="object-cover object-top brightness-40 blur-sm scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Content Details */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Poster Card (2:3) */}
          <div className="relative w-56 sm:w-64 aspect-[2/3] shrink-0 rounded-poster overflow-hidden shadow-card border border-border bg-surface-light group">
            <Image
              src={movie.poster}
              alt={movie.titleKurdish}
              fill
              className="object-cover"
              unoptimized
            />
            {movie.quality && (
              <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-xs font-black uppercase bg-black/70 backdrop-blur-md text-accent border border-accent/40 shadow">
                {movie.quality}
              </span>
            )}
            <span className="absolute top-3 end-3 px-2 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white/90 border border-white/20 flex items-center gap-1 shadow">
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>{toKurdishDigits(movie.views)}</span>
            </span>
          </div>

          {/* Text Information */}
          <div className="flex-1 space-y-4 text-center md:text-right">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-purple-glow">
                فیلم
              </span>

              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-surface border border-border text-white">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                {formatKurdishRating(movie.rating)}
              </span>

              <span className="flex items-center gap-1 text-xs text-text-muted bg-surface/80 px-2.5 py-1 rounded-full border border-border">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {toKurdishDigits(movie.year)}
              </span>

              <span className="flex items-center gap-1 text-xs text-text-muted bg-surface/80 px-2.5 py-1 rounded-full border border-border">
                <Clock className="w-3.5 h-3.5 text-accent" />
                {formatKurdishDuration(movie.duration)}
              </span>

              {movie.country && (
                <span className="flex items-center gap-1 text-xs text-text-muted bg-surface/80 px-2.5 py-1 rounded-full border border-border">
                  <Globe className="w-3.5 h-3.5 text-text-dim" />
                  {movie.country.nameKurdish}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {movie.titleKurdish}
              </h1>
              <p className="text-sm sm:text-base text-text-dim font-medium mt-1 dir-ltr md:text-start">
                {movie.titleOriginal}
              </p>
            </div>

            {/* Genre tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {movie.genres.map((g) => (
                <Link
                  key={g.genre.id}
                  href={`/movies?genre=${g.genre.slug}`}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-surface-light hover:bg-surface-hover border border-border text-text-muted hover:text-white transition-all"
                >
                  {g.genre.nameKurdish}
                </Link>
              ))}
            </div>

            {/* Action Buttons: Watch, Trailer, Bookmark, and LIKE REACTION BUTTON */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <Link
                href={`/watch/movie/${movie.slug}`}
                className="flex items-center gap-2 px-8 py-3.5 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-purple-glow transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>سەیرکردنی ڕاستەوخۆ</span>
              </Link>

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-btn bg-surface-light hover:bg-surface-hover border border-border text-text-primary text-sm font-bold transition-all"
                >
                  <Video className="w-4 h-4 text-accent" />
                  <span>تڕەیلەر</span>
                </a>
              )}

              {/* Bookmark Button */}
              <WatchlistButton movieId={movie.id} className="w-12 h-12 rounded-btn" />

              {/* Like Reaction Button with Emojis */}
              <ReactionButton movieId={movie.id} initialCount={movie.reactions.length} className="h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Unified Body - Open Clean Cinematic Flow (No Boxes) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Kurdish Synopsis (Clean Open Flow) */}
        <div className="space-y-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-primary rounded-full shadow-purple-glow" />
            <span>کورتەی چیرۆک</span>
          </h3>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed whitespace-pre-line max-w-4xl">
            {movie.synopsis}
          </p>
        </div>

        {/* Actors / Cast & Crew Horizontal Scroll Slider */}
        {movie.credits && movie.credits.length > 0 && (
          <CastSlider credits={movie.credits} />
        )}

        {/* Download Links Section */}
        {movie.downloadLinks.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-black text-white flex items-center gap-2.5">
              <Download className="w-5 h-5 text-accent" />
              <span>بەستەرەکانی داگرتن (Download)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {movie.downloadLinks.map((dl) => (
                <a
                  key={dl.id}
                  href={dl.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-accent/40 transition-all group backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-black text-xs border border-accent/20">
                      {dl.quality}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-accent transition-colors">
                        {dl.label}
                      </p>
                      {dl.fileSize && (
                        <p className="text-[11px] text-text-dim">قەبارەی فایل: {dl.fileSize}</p>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-text-muted group-hover:text-white transition-colors">
                    داگرتن
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentSection movieId={movie.id} initialComments={movie.comments} />
      </div>

      {/* Similar Titles Row */}
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
