"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import MovieCard, { MediaItem } from "./MovieCard";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  viewAllHref?: string;
  type?: "movie" | "series" | "mixed";
}

export default function MediaRow({ title, items, viewAllHref, type = "movie" }: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="my-8">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-6 rounded-full bg-primary" />
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-semibold text-text-muted hover:text-primary transition-colors me-2"
            >
              هەمووی ببینە
            </Link>
          )}

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("right")}
              className="p-1.5 rounded-lg bg-surface hover:bg-surface-light border border-border text-text-muted hover:text-white transition-colors"
              aria-label="پێشوو"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("left")}
              className="p-1.5 rounded-lg bg-surface hover:bg-surface-light border border-border text-text-muted hover:text-white transition-colors"
              aria-label="دواتر"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Media List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={rowRef}
          className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 snap-x snap-mandatory"
        >
          {items.map((item) => (
            <div
              key={`${item.type || type}-${item.id}`}
              className="w-[150px] sm:w-[170px] md:w-[190px] shrink-0 snap-start"
            >
              <MovieCard item={item} type={type === "mixed" ? (item.type || "movie") : type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
