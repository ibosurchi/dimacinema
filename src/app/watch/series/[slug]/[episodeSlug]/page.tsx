import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PlayerWrapper from "@/components/player/PlayerWrapper";
import CommentSection from "@/components/common/CommentSection";
import { Tv, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { toKurdishDigits, formatKurdishRating } from "@/lib/kurdish";

interface WatchSeriesEpisodeProps {
  params: {
    slug: string;
    episodeSlug: string; // e.g., "s1e1" or "s1e2"
  };
}

export const revalidate = 60;

export default async function WatchSeriesEpisodePage({ params }: WatchSeriesEpisodeProps) {
  const { slug, episodeSlug } = params;

  // Parse s{season}e{episode} format
  const match = episodeSlug.toLowerCase().match(/s(\d+)e(\d+)/);
  if (!match) {
    notFound();
  }

  const seasonNum = parseInt(match[1]);
  const episodeNum = parseInt(match[2]);

  // Fetch Series and current Episode
  const series = await prisma.series.findUnique({
    where: { slug },
    include: {
      seasons: {
        where: { number: seasonNum },
        include: {
          episodes: {
            orderBy: { number: "asc" },
            include: {
              servers: {
                where: { active: true },
                orderBy: { order: "asc" },
              },
              downloadLinks: true,
            },
          },
        },
      },
      genres: { include: { genre: true } },
    },
  });

  if (!series || !series.seasons[0]) {
    notFound();
  }

  const season = series.seasons[0];
  const episode = season.episodes.find((e) => e.number === episodeNum);

  if (!episode) {
    notFound();
  }

  // Calculate Next and Previous Episode URLs
  const currentIndex = season.episodes.findIndex((e) => e.id === episode.id);
  const prevEp = currentIndex > 0 ? season.episodes[currentIndex - 1] : null;
  const nextEp = currentIndex < season.episodes.length - 1 ? season.episodes[currentIndex + 1] : null;

  const prevEpisodeUrl = prevEp ? `/watch/series/${series.slug}/s${season.number}e${prevEp.number}` : undefined;
  const nextEpisodeUrl = nextEp ? `/watch/series/${series.slug}/s${season.number}e${nextEp.number}` : undefined;

  // Fetch comments for episode
  const comments = await prisma.comment.findMany({
    where: { episodeId: episode.id, approved: true },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full pb-16">
      <PlayerWrapper
        title={`${series.titleKurdish} - ${episode.titleKurdish}`}
        originalTitle={series.titleOriginal}
        backdrop={episode.thumbnail || series.backdrop || series.poster}
        servers={episode.servers}
        episodeId={episode.id}
        seriesSlug={series.slug}
        currentSeasonNumber={season.number}
        currentEpisodeNumber={episode.number}
        prevEpisodeUrl={prevEpisodeUrl}
        nextEpisodeUrl={nextEpisodeUrl}
        episodesList={season.episodes}
        downloadLinks={episode.downloadLinks}
      />

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold text-xs flex items-center gap-1">
                  <Tv className="w-3 h-3" />
                  زنجیرە
                </span>
                <span className="text-xs text-text-dim">
                  وەرزی {toKurdishDigits(season.number)} • ئەڵقەی {toKurdishDigits(episode.number)}
                </span>
                <span className="text-xs text-accent font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-accent" />
                  {formatKurdishRating(episode.rating > 0 ? episode.rating : series.rating)}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {series.titleKurdish}: {episode.titleKurdish}
              </h1>
              <p className="text-xs text-text-dim mt-0.5 dir-ltr text-end sm:text-start">
                {series.titleOriginal}
              </p>
            </div>

            <Link
              href={`/series/${series.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-light hover:bg-surface-hover border border-border text-text-muted hover:text-white text-xs font-semibold shrink-0"
            >
              <Info className="w-4 h-4 text-primary" />
              <span>هەموو وەرز و ئەڵقەکان</span>
            </Link>
          </div>

          <div className="pt-4">
            <h4 className="text-xs font-bold text-text-dim mb-1.5">کورتەی زنجیرە:</h4>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {series.synopsis}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection episodeId={episode.id} initialComments={comments} />
      </div>
    </div>
  );
}
