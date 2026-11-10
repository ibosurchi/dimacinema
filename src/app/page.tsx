import React from "react";
import { prisma } from "@/lib/prisma";
import HeroSlider, { FeaturedItem } from "@/components/common/HeroSlider";
import MediaRow from "@/components/common/MediaRow";
import GenreChips from "@/components/common/GenreChips";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  // 1. Fetch Slider Settings
  const [speedSetting, itemsSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "slider_speed_seconds" } }),
    prisma.siteSetting.findUnique({ where: { key: "slider_items" } }),
  ]);

  const sliderSpeed = speedSetting?.value ? parseInt(speedSetting.value) : 7;

  // 2. Resolve Hero Slider Items
  let heroItems: FeaturedItem[] = [];

  if (itemsSetting?.value) {
    try {
      const configuredSlides: { id: string; type: "movie" | "series" }[] = JSON.parse(
        itemsSetting.value
      );

      const movieIds = configuredSlides.filter((s) => s.type === "movie").map((s) => s.id);
      const seriesIds = configuredSlides.filter((s) => s.type === "series").map((s) => s.id);

      const [movies, series] = await Promise.all([
        prisma.movie.findMany({
          where: { id: { in: movieIds }, status: "PUBLISHED" },
          include: { genres: { include: { genre: true } } },
        }),
        prisma.series.findMany({
          where: { id: { in: seriesIds }, status: "PUBLISHED" },
          include: { genres: { include: { genre: true } } },
        }),
      ]);

      // Re-order according to configured order
      for (const slide of configuredSlides) {
        if (slide.type === "movie") {
          const m = movies.find((item) => item.id === slide.id);
          if (m) heroItems.push({ ...m, type: "movie" });
        } else {
          const s = series.find((item) => item.id === slide.id);
          if (s) heroItems.push({ ...s, type: "series" });
        }
      }
    } catch {
      heroItems = [];
    }
  }

  // Fallback if no custom slider configured
  if (heroItems.length === 0) {
    const [featuredMovies, featuredSeries] = await Promise.all([
      prisma.movie.findMany({
        where: { featured: true, status: "PUBLISHED" },
        take: 4,
        include: { genres: { include: { genre: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.series.findMany({
        where: { featured: true, status: "PUBLISHED" },
        take: 3,
        include: { genres: { include: { genre: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    heroItems = [
      ...featuredMovies.map((m) => ({ ...m, type: "movie" as const })),
      ...featuredSeries.map((s) => ({ ...s, type: "series" as const })),
    ];
  }

  // 3. Fetch Genres for quick chips
  const genres = await prisma.genre.findMany({
    orderBy: { order: "asc" },
    take: 12,
  });

  // 4. Primary Sections Requested:
  // { فیلمەکان, زنجیرەکان, زۆرترین بینراو (تێکەڵە لە فیلم و زنجیرە) }
  const [latestMovies, latestSeries, topMovies, topSeries] = await Promise.all([
    prisma.movie.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.series.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.movie.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 8,
    }),
    prisma.series.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 8,
    }),
  ]);

  // Mixed Most Viewed
  const mostViewedMixed = [
    ...topMovies.map((m) => ({ ...m, type: "movie" as const })),
    ...topSeries.map((s) => ({ ...s, type: "series" as const })),
  ]
    .sort((a, b) => b.views - a.views)
    .slice(0, 12);

  // Extra Genre Rows from DB
  const extraRows = await prisma.homeRow.findMany({
    where: {
      active: true,
      rule: "GENRE",
      genreId: { not: null },
    },
    orderBy: { order: "asc" },
    include: { genre: true },
    take: 4,
  });

  const extraRowsWithData = await Promise.all(
    extraRows.map(async (row) => {
      const movieGenres = await prisma.movieGenre.findMany({
        where: { genreId: row.genreId!, movie: { status: "PUBLISHED" } },
        include: { movie: true },
        take: 10,
      });
      return {
        id: row.id,
        title: row.titleKurdish,
        type: "movie" as const,
        items: movieGenres.map((mg) => ({ ...mg.movie, type: "movie" as const })),
        viewAllHref: `/movies?genre=${row.genre?.slug}`,
      };
    })
  );

  return (
    <div className="w-full pb-16">
      {/* Hero Carousel Slider */}
      <HeroSlider items={heroItems} sliderSpeed={sliderSpeed} />

      {/* Genre Pills */}
      <GenreChips genres={genres} />

      {/* Media Rows */}
      <div className="space-y-4">
        {/* Row 1: فیلمەکان (Movies) */}
        <MediaRow
          title="تازەترین فیلمەکان"
          items={latestMovies.map((m) => ({ ...m, type: "movie" as const }))}
          type="movie"
          viewAllHref="/movies"
        />

        {/* Row 2: زنجیرەکان (Series) */}
        <MediaRow
          title="تازەترین زنجیرەکان"
          items={latestSeries.map((s) => ({ ...s, type: "series" }))}
          type="series"
          viewAllHref="/series"
        />

        {/* Row 3: زۆرترین بینراو (Most Viewed mixed) */}
        <MediaRow
          title="زۆرترین بینراو لە دیما سینەما"
          items={mostViewedMixed}
          type="mixed"
          viewAllHref="/movies"
        />

        {/* Extra Category / Genre Rows */}
        {extraRowsWithData.map((row) => (
          <MediaRow
            key={row.id}
            title={row.title}
            items={row.items}
            type={row.type}
            viewAllHref={row.viewAllHref}
          />
        ))}
      </div>
    </div>
  );
}
