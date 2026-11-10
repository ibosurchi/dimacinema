import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");
    const seriesId = searchParams.get("seriesId");

    const count = await prisma.reaction.count({
      where: {
        movieId: movieId || null,
        seriesId: seriesId || null,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;
    const { movieId, seriesId, emoji = "❤️", clientToken } = await req.json();

    if (!movieId && !seriesId) {
      return NextResponse.json({ error: "Missing movieId or seriesId" }, { status: 400 });
    }

    const sessionId = userId || clientToken || "guest";

    // Check if existing reaction from this user/session
    const existing = await prisma.reaction.findFirst({
      where: {
        movieId: movieId || null,
        seriesId: seriesId || null,
        OR: [
          ...(userId ? [{ userId }] : []),
          { sessionId },
        ],
      },
    });

    if (existing) {
      if (existing.emoji === emoji) {
        // Toggle off if same emoji clicked
        await prisma.reaction.delete({ where: { id: existing.id } });
        const newCount = await prisma.reaction.count({
          where: { movieId: movieId || null, seriesId: seriesId || null },
        });
        return NextResponse.json({ active: false, emoji: null, count: newCount });
      } else {
        // Change emoji
        await prisma.reaction.update({
          where: { id: existing.id },
          data: { emoji },
        });
        const newCount = await prisma.reaction.count({
          where: { movieId: movieId || null, seriesId: seriesId || null },
        });
        return NextResponse.json({ active: true, emoji, count: newCount });
      }
    } else {
      // Add new reaction
      await prisma.reaction.create({
        data: {
          userId,
          sessionId,
          movieId: movieId || null,
          seriesId: seriesId || null,
          emoji,
        },
      });
      const newCount = await prisma.reaction.count({
        where: { movieId: movieId || null, seriesId: seriesId || null },
      });
      return NextResponse.json({ active: true, emoji, count: newCount });
    }
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json({ error: "Failed to react" }, { status: 500 });
  }
}
