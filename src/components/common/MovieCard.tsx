"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Film, Tv, Play, Eye } from "lucide-react";
import { toKurdishDigits, formatKurdishRating, formatKurdishViews } from "@/lib/kurdish";
import WatchlistButton from "./WatchlistButton";

export interface MediaItem {
  id: string;
  titleKurdish: string;
  titleOriginal: string;
  slug: string;
  year: number;
  rating: number;
  poster: string;
  quality: string;
  views?: number;
  type?: "movie" | "series";
  genres?: { genre: { nameKurdish: string } }[];
}

interface MovieCardProps {
  item: MediaItem;
  type?: "movie" | "series";
}

export default function MovieCard({ item, type = "movie" }: MovieCardProps) {
  const itemType = item.type || type;
  const href = itemType === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`;

  return (
    <div className="group relative flex flex-col transition-all duration-300">
      <Link href={href} className="relative block aspect-[2/3] w-full overflow-hidden rounded-poster bg-surface-light border border-border group-hover:border-primary/50 group-hover:shadow-purple-glow transition-all duration-300">
        <Image
          src={item.poster || "/placeholder-poster.jpg"}
          alt={item.titleKurdish}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          unoptimized
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          {/* Left-hand Corner: Views Count Badge */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 backdrop-blur-md text-white/95 border border-white/15 shadow">
            <Eye className="w-3 h-3 text-accent" />
            <span>{toKurdishDigits(item.views || 0)}</span>
          </div>

          {/* Right-hand Corner: Quality Badge & Watchlist */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {item.quality && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-accent border border-accent/30 shadow-sm">
                {item.quality}
              </span>
            )}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <WatchlistButton
                movieId={itemType === "movie" ? item.id : undefined}
                seriesId={itemType === "series" ? item.id : undefined}
                className="w-7 h-7 p-1 rounded-full !bg-black/70 backdrop-blur-md"
              />
            </div>
          </div>
        </div>

        {/* Play Overlay Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-purple-glow">
            <Play className="w-5 h-5 fill-white ms-0.5" />
          </div>
        </div>

        {/* Bottom Details on Image */}
        <div className="absolute bottom-2.5 start-2.5 end-2.5 flex items-center justify-between z-10 text-[11px] font-medium text-white/90">
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10">
            {itemType === "movie" ? <Film className="w-3 h-3 text-primary" /> : <Tv className="w-3 h-3 text-primary" />}
            {toKurdishDigits(item.year)}
          </span>

          <span className="flex items-center gap-0.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10 text-accent font-bold">
            <Star className="w-3 h-3 fill-accent text-accent" />
            {formatKurdishRating(item.rating)}
          </span>
        </div>
      </Link>

      {/* Title & Subtitle Below Card */}
      <div className="mt-2.5 flex flex-col">
        <Link href={href} className="group-hover:text-primary transition-colors">
          <h3 className="text-sm font-bold text-text-primary line-clamp-1 leading-snug">
            {item.titleKurdish}
          </h3>
        </Link>
        <span className="text-[11px] text-text-dim line-clamp-1 font-medium mt-0.5 dir-ltr text-end">
          {item.titleOriginal}
        </span>
      </div>
    </div>
  );
}
