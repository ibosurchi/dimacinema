import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({ items: [] });
    }

    // Search in movies and series
    const [movies, series] = await Promise.all([
      prisma.movie.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { titleKurdish: { contains: query } },
            { titleOriginal: { contains: query } },
          ],
        },
        take: 6,
        select: {
          id: true,
          titleKurdish: true,
          titleOriginal: true,
          slug: true,
          year: true,
          rating: true,
          poster: true,
          quality: true,
        },
      }),
      prisma.series.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { titleKurdish: { contains: query } },
            { titleOriginal: { contains: query } },
          ],
        },
        take: 6,
        select: {
          id: true,
          titleKurdish: true,
          titleOriginal: true,
          slug: true,
          year: true,
          rating: true,
          poster: true,
          quality: true,
        },
      }),
    ]);

    const formattedMovies = movies.map((m) => ({ ...m, type: "movie" }));
    const formattedSeries = series.map((s) => ({ ...s, type: "series" }));

    return NextResponse.json({
      items: [...formattedMovies, ...formattedSeries],
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
