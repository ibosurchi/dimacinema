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
    const { movieId, episodeId, content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        movieId: movieId || null,
        episodeId: episodeId || null,
        content: content.trim(),
        approved: true, // auto-approve or can be moderated from admin
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment API error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
