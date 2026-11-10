import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { movieId, seriesId } = body;

    if (!movieId && !seriesId) {
      return NextResponse.json({ error: "Missing movieId or seriesId" }, { status: 400 });
    }

    // Check if already in watchlist
    const existing = await prisma.watchlist.findFirst({
      where: {
        userId,
        movieId: movieId || null,
        seriesId: seriesId || null,
      },
    });

    if (existing) {
      await prisma.watchlist.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.watchlist.create({
        data: {
          userId,
          movieId: movieId || null,
          seriesId: seriesId || null,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("Watchlist API error:", error);
    return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 });
  }
}
