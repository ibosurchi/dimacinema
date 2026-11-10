"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, Star, Bookmark, Film, Tv, ChevronRight, ChevronLeft } from "lucide-react";
import { toKurdishDigits, formatKurdishRating } from "@/lib/kurdish";
import WatchlistButton from "./WatchlistButton";

export interface FeaturedItem {
  id: string;
  titleKurdish: string;
  titleOriginal: string;
  slug: string;
  year: number;
  rating: number;
  quality: string;
  synopsis: string;
  poster: string;
  backdrop: string;
  type: "movie" | "series";
  genres?: { genre: { nameKurdish: string } }[];
}

interface HeroSliderProps {
  items: FeaturedItem[];
  sliderSpeed?: number;
}

export default function HeroSlider({ items, sliderSpeed = 7 }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, (sliderSpeed || 7) * 1000); // configurable auto-slide duration

    return () => clearInterval(interval);
  }, [items.length, isPaused, sliderSpeed]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex];
  const watchUrl = current.type === "movie" 
    ? `/watch/movie/${current.slug}` 
    : `/series/${current.slug}`;
  const detailUrl = current.type === "movie" 
    ? `/movie/${current.slug}` 
    : `/series/${current.slug}`;

  return (
    <div 
      className="relative w-full h-[600px] sm:h-[680px] lg:h-[750px] overflow-hidden -mt-20 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrops with crossfade */}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Image
            src={item.backdrop || item.poster}
            alt={item.titleKurdish}
            fill
            priority={idx === 0}
            className="object-cover object-top sm:object-center brightness-75 scale-105 transition-transform duration-10000"
            unoptimized
          />
          {/* Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-24 sm:pb-28">
        <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-primary text-white shadow-purple-glow flex items-center gap-1.5">
              {current.type === "movie" ? <Film className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
              {current.type === "movie" ? "فیلمی تایبەت" : "زنجیرەی تایبەت"}
            </span>

            {current.quality && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-accent/20 border border-accent/40 text-accent">
                {current.quality}
              </span>
            )}

            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-surface/80 border border-border text-white">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              {formatKurdishRating(current.rating)}
            </span>

            <span className="text-xs text-text-muted font-bold">
              {toKurdishDigits(current.year)}
            </span>

            {/* Genre Chips */}
            {current.genres?.slice(0, 3).map((g) => (
              <span key={g.genre.nameKurdish} className="text-xs text-text-dim px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                {g.genre.nameKurdish}
              </span>
            ))}
          </div>

          {/* Titles */}
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {current.titleKurdish}
            </h1>
            <p className="text-sm sm:text-base text-text-dim font-medium mt-1 dir-ltr text-end max-w-lg">
              {current.titleOriginal}
            </p>
          </div>

          {/* Kurdish Synopsis */}
          <p className="text-xs sm:text-sm text-text-muted line-clamp-3 leading-relaxed max-w-xl">
            {current.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={watchUrl}
              className="flex items-center gap-2 px-6 py-3 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-purple-glow transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ئێستا ببینە</span>
            </Link>

            <Link
              href={detailUrl}
              className="flex items-center gap-2 px-5 py-3 rounded-btn bg-surface-light/80 hover:bg-surface-hover border border-border text-text-primary text-sm font-bold transition-all"
            >
              <Info className="w-4 h-4 text-text-muted" />
              <span>زانیاری زیاتر</span>
            </Link>

            <WatchlistButton
              movieId={current.type === "movie" ? current.id : undefined}
              seriesId={current.type === "series" ? current.id : undefined}
              className="w-12 h-12 rounded-btn"
            />
          </div>
        </div>

        {/* Slider Bottom Indicators & Controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`سلاید ${toKurdishDigits(idx + 1)}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
              className="p-2 rounded-full bg-surface/80 hover:bg-surface-light border border-border text-white text-xs"
              aria-label="پێشوو"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              className="p-2 rounded-full bg-surface/80 hover:bg-surface-light border border-border text-white text-xs"
              aria-label="دواتر"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
