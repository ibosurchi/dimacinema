"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Genre {
  id: string;
  nameKurdish: string;
  slug: string;
}

interface GenreChipsProps {
  genres: Genre[];
  activeSlug?: string;
}

export default function GenreChips({ genres, activeSlug }: GenreChipsProps) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2">
        <Link
          href="/movies"
          className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
            !activeSlug
              ? "bg-primary text-white shadow-purple-glow"
              : "bg-surface hover:bg-surface-light border border-border text-text-muted hover:text-white"
          }`}
        >
          هەموو بەشەکان
        </Link>
        {genres.map((g) => {
          const isActive = activeSlug === g.slug;
          return (
            <Link
              key={g.id}
              href={`/genre/${g.slug}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? "bg-primary text-white shadow-purple-glow"
                  : "bg-surface hover:bg-surface-light border border-border text-text-muted hover:text-white"
              }`}
            >
              {g.nameKurdish}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
