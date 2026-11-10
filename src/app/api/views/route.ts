import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { movieId, episodeId } = body;

    if (movieId) {
      await prisma.movie.update({
        where: { id: movieId },
        data: { views: { increment: 1 } },
      });
    } else if (episodeId) {
      const episode = await prisma.episode.update({
        where: { id: episodeId },
        data: { views: { increment: 1 } },
      });
      // also increment series view count
      if (episode.seriesId) {
        await prisma.series.update({
          where: { id: episode.seriesId },
          data: { views: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to increment view" }, { status: 500 });
  }
}
