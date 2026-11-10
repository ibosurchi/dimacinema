import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  Play, 
  Star, 
  Calendar, 
  Tv, 
  Globe, 
  Layers, 
  Clock, 
  Video,
  Users,
  Eye
} from "lucide-react";
import { toKurdishDigits, formatKurdishRating } from "@/lib/kurdish";
import WatchlistButton from "@/components/common/WatchlistButton";
import ReactionButton from "@/components/common/ReactionButton";
import CastSlider from "@/components/common/CastSlider";
import MediaRow from "@/components/common/MediaRow";
import CommentSection from "@/components/common/CommentSection";

interface SeriesDetailProps {
  params: { slug: string };
  searchParams: { season?: string };
}

export const revalidate = 60;

export default async function SeriesDetailPage({ params, searchParams }: SeriesDetailProps) {
  const series = await prisma.series.findUnique({
    where: { slug: params.slug },
    include: {
      genres: { include: { genre: true } },
      country: true,
      credits: {
        include: { person: true },
        orderBy: { order: "asc" },
      },
      reactions: true,
      seasons: {
        orderBy: { number: "asc" },
        include: {
          episodes: {
            orderBy: { number: "asc" },
          },
        },
      },
    },
  });

  if (!series || series.status !== "PUBLISHED") {
    notFound();
  }

  const selectedSeasonNumber = searchParams.season 
    ? parseInt(searchParams.season) 
    : (series.seasons[0]?.number || 1);

  const activeSeason = series.seasons.find((s) => s.number === selectedSeasonNumber) || series.seasons[0];

  // Similar series
  const genreIds = series.genres.map((g) => g.genreId);
  const similarSeries = await prisma.series.findMany({
    where: {
      id: { not: series.id },
      status: "PUBLISHED",
      genres: { some: { genreId: { in: genreIds } } },
    },
    take: 8,
  });

  const firstEpisode = activeSeason?.episodes[0];
  const firstEpisodeWatchUrl = firstEpisode
    ? `/watch/series/${series.slug}/s${activeSeason.number}e${firstEpisode.number}`
    : "#";

  return (
    <div className="w-full pb-16">
      {/* Blurred Backdrop Header */}
      <div className="relative w-full min-h-[500px] sm:min-h-[580px] -mt-20 overflow-hidden flex items-end">
        <Image
          src={series.backdrop || series.poster}
          alt={series.titleKurdish}
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
              src={series.poster}
              alt={series.titleKurdish}
              fill
              className="object-cover"
              unoptimized
            />
            {series.quality && (
              <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-xs font-black uppercase bg-black/70 backdrop-blur-md text-accent border border-accent/40 shadow">
                {series.quality}
              </span>
            )}
            <span className="absolute top-3 end-3 px-2 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white/90 border border-white/20 flex items-center gap-1 shadow">
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>{toKurdishDigits(series.views)}</span>
            </span>
          </div>

          {/* Text Information */}
          <div className="flex-1 space-y-4 text-center md:text-right">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-purple-glow flex items-center gap-1">
                <Tv className="w-3.5 h-3.5" />
                زنجیرە
              </span>

              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-surface border border-border text-white">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                {formatKurdishRating(series.rating)}
              </span>

              <span className="flex items-center gap-1 text-xs text-text-muted bg-surface/80 px-2.5 py-1 rounded-full border border-border">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {toKurdishDigits(series.year)}
              </span>

              <span className="flex items-center gap-1 text-xs text-text-muted bg-surface/80 px-2.5 py-1 rounded-full border border-border">
                <Layers className="w-3.5 h-3.5 text-accent" />
                {toKurdishDigits(series.seasons.length)} وەرز
              </span>

              {series.country && (
                <span className="flex items-center gap-1 text-xs text-text-muted bg-surface/80 px-2.5 py-1 rounded-full border border-border">
                  <Globe className="w-3.5 h-3.5 text-text-dim" />
                  {series.country.nameKurdish}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {series.titleKurdish}
              </h1>
              <p className="text-sm sm:text-base text-text-dim font-medium mt-1 dir-ltr md:text-start">
                {series.titleOriginal}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {series.genres.map((g) => (
                <Link
                  key={g.genre.id}
                  href={`/series?genre=${g.genre.slug}`}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-surface-light hover:bg-surface-hover border border-border text-text-muted hover:text-white transition-all"
                >
                  {g.genre.nameKurdish}
                </Link>
              ))}
            </div>

            {/* Actions: Play, Trailer, Watchlist, Reaction */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              {firstEpisode && (
                <Link
                  href={firstEpisodeWatchUrl}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-purple-glow transition-all transform hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>دەستپێکردنی سەیرکردن</span>
                </Link>
              )}

              {series.trailerUrl && (
                <a
                  href={series.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-btn bg-surface-light hover:bg-surface-hover border border-border text-text-primary text-sm font-bold transition-all"
                >
                  <Video className="w-4 h-4 text-accent" />
                  <span>تڕەیلەر</span>
                </a>
              )}

              <WatchlistButton seriesId={series.id} className="w-12 h-12 rounded-btn" />
              <ReactionButton seriesId={series.id} initialCount={series.reactions.length} className="h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Episodes - Open Clean Cinematic Flow (No Boxes) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Kurdish Synopsis (Clean Open Flow) */}
        <div className="space-y-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-primary rounded-full shadow-purple-glow" />
            <span>کورتەی چیرۆکی زنجیرە</span>
          </h3>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed whitespace-pre-line max-w-4xl">
            {series.synopsis}
          </p>
        </div>

        {/* Cast & Crew Horizontal Scroll Slider */}
        {series.credits && series.credits.length > 0 && (
          <CastSlider credits={series.credits} />
        )}

        {/* Season Selector & Episodes (No Outer Box) */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-primary" />
              <span>وەرزەکان و ئەڵقەکان</span>
            </h3>

            {/* Season buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {series.seasons.map((season) => {
                const isActive = season.number === activeSeason?.number;
                return (
                  <Link
                    key={season.id}
                    href={`/series/${series.slug}?season=${season.number}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? "bg-primary text-white shadow-purple-glow"
                        : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-text-muted hover:text-white"
                    }`}
                  >
                    وەرزی {toKurdishDigits(season.number)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Episodes Grid List */}
          {activeSeason?.episodes && activeSeason.episodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSeason.episodes.map((ep) => (
                <Link
                  key={ep.id}
                  href={`/watch/series/${series.slug}/s${activeSeason.number}e${ep.number}`}
                  className="bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-primary/50 backdrop-blur-md rounded-2xl overflow-hidden group hover:shadow-purple-glow transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-surface overflow-hidden">
                    <Image
                      src={ep.thumbnail || series.backdrop || series.poster}
                      alt={ep.titleKurdish}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-purple-glow">
                        <Play className="w-4 h-4 fill-white ms-0.5" />
                      </div>
                    </div>

                    {/* Top corner: Episode Rating */}
                    {ep.rating > 0 && (
                      <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-black text-accent flex items-center gap-1 border border-accent/30 shadow-md z-10">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span>{formatKurdishRating(ep.rating)}</span>
                      </span>
                    )}

                    <span className="absolute bottom-2 start-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                      ئەڵقەی {toKurdishDigits(ep.number)}
                    </span>

                    {ep.duration > 0 && (
                      <span className="absolute bottom-2 end-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[11px] text-text-dim flex items-center gap-1 border border-white/10">
                        <Clock className="w-3 h-3 text-accent" />
                        {toKurdishDigits(ep.duration)} خولەک
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                      {ep.titleKurdish}
                    </h4>
                    <p className="text-[11px] text-text-dim mt-1">
                      بە کوالیتی بەرز و ژێرنووسی کوردی
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-text-muted bg-white/[0.02] rounded-2xl border border-white/[0.06]">
              هیچ ئەڵقەیەک بۆ ئەم وەرزە دانەنراوە
            </div>
          )}
        </div>
      </div>

      {/* Similar Series Row */}
      {similarSeries.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <MediaRow
            title="زنجیرە هاوشێوەکان"
            items={similarSeries.map((s) => ({ ...s, type: "series" }))}
            type="series"
          />
        </div>
      )}
    </div>
  );
}
