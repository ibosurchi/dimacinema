import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/common/MovieCard";
import { Film, Filter, SlidersHorizontal } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

interface MoviesPageProps {
  searchParams: {
    genre?: string;
    year?: string;
    quality?: string;
    sort?: string;
    search?: string;
  };
}

export const revalidate = 30;

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { genre, year, quality, sort = "newest", search } = searchParams;

  // Filter clauses
  const where: any = { status: "PUBLISHED" };

  if (search) {
    where.OR = [
      { titleKurdish: { contains: search } },
      { titleOriginal: { contains: search } },
    ];
  }

  if (year) {
    where.year = parseInt(year);
  }

  if (quality) {
    where.quality = { contains: quality };
  }

  if (genre) {
    where.genres = {
      some: {
        genre: { slug: genre },
      },
    };
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "views") orderBy = { views: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };
  if (sort === "oldest") orderBy = { year: "asc" };

  // Fetch movies and filter options
  const [movies, allGenres] = await Promise.all([
    prisma.movie.findMany({
      where,
      orderBy,
      take: 40,
    }),
    prisma.genre.findMany({ orderBy: { order: "asc" } }),
  ]);

  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2015, 2010, 2008, 1972];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-6 rounded-full bg-primary" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">هەموو فیلمەکان</h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted">
            بەرزترین کوالیتی و سەیرکردنی ڕاستەوخۆ بە ژێرنووسی کوردی ({toKurdishDigits(movies.length)} فیلم)
          </p>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            href="/movies?sort=newest"
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              sort === "newest"
                ? "bg-primary text-white shadow-purple-glow"
                : "bg-surface hover:bg-surface-light border border-border text-text-muted"
            }`}
          >
            نوێترینەکان
          </Link>
          <Link
            href="/movies?sort=views"
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              sort === "views"
                ? "bg-primary text-white shadow-purple-glow"
                : "bg-surface hover:bg-surface-light border border-border text-text-muted"
            }`}
          >
            زۆرترین بینراو
          </Link>
          <Link
            href="/movies?sort=rating"
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              sort === "rating"
                ? "bg-primary text-white shadow-purple-glow"
                : "bg-surface hover:bg-surface-light border border-border text-text-muted"
            }`}
          >
            بەرزترین هەڵسەنگاندن
          </Link>
        </div>
      </div>

      {/* Genre Filter Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        <Link
          href="/movies"
          className={`px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
            !genre
              ? "bg-accent text-black font-black"
              : "bg-surface hover:bg-surface-light border border-border text-text-muted"
          }`}
        >
          هەموو ژەنەرەکان
        </Link>
        {allGenres.map((g) => (
          <Link
            key={g.id}
            href={`/movies?genre=${g.slug}`}
            className={`px-3.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
              genre === g.slug
                ? "bg-accent text-black font-black"
                : "bg-surface hover:bg-surface-light border border-border text-text-muted"
            }`}
          >
            {g.nameKurdish}
          </Link>
        ))}
      </div>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div className="py-20 text-center bg-surface border border-border rounded-2xl p-8">
          <Film className="w-12 h-12 text-primary mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-white mb-1">هیچ فیلمێک بەم تایبەتمەندییانە نەدۆزرایەوە</h3>
          <p className="text-xs text-text-dim mb-4">تکایە فلتەرەکان لابدە بۆ بینینی هەموو بەرهەمەکان</p>
          <Link
            href="/movies"
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold inline-block"
          >
            پاککردنەوەی فلتەر
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} item={{ ...movie, type: "movie" }} type="movie" />
          ))}
        </div>
      )}
    </div>
  );
}
