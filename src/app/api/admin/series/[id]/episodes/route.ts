import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeStreamUrl } from "@/lib/player/providers";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seriesId = params.id;
    const body = await req.json();
    const { action, seasonId, number, titleKurdish, duration, rating, linksText, serverUrl, provider, episodeId } = body;

    // Action 1: Add new season
    if (action === "ADD_SEASON") {
      const highestSeason = await prisma.season.findFirst({
        where: { seriesId },
        orderBy: { number: "desc" },
      });
      const nextNum = (highestSeason?.number || 0) + 1;
      const season = await prisma.season.create({
        data: {
          seriesId,
          number: nextNum,
          titleKurdish: `وەرزی ${nextNum}`,
        },
      });
      return NextResponse.json({ success: true, season });
    }

    // Action 2: BULK ADD EPISODES (Paste many links, one per line)
    if (action === "BULK_ADD") {
      if (!seasonId || !linksText) {
        return NextResponse.json({ error: "تکایە وەرز و لینکەکان دیاریبکە" }, { status: 400 });
      }

      const lines = linksText
        .split("\n")
        .map((l: string) => l.trim())
        .filter((l: string) => Boolean(l));

      // Find current highest episode in this season
      const highestEp = await prisma.episode.findFirst({
        where: { seasonId },
        orderBy: { number: "desc" },
      });
      let nextEpNum = (highestEp?.number || 0) + 1;

      const createdEpisodes = [];

      for (const line of lines) {
        const normalized = normalizeStreamUrl(line);
        const ep = await prisma.episode.create({
          data: {
            seasonId,
            seriesId,
            number: nextEpNum,
            titleKurdish: `ئەڵقەی ${nextEpNum}`,
            duration: 45,
            rating: 0,
          },
        });

        // Add stream server for this episode
        await prisma.server.create({
          data: {
            episodeId: ep.id,
            label: "سێرڤەر ١",
            provider: normalized.provider || "vidmoly",
            url: normalized.embedUrl || line,
            quality: "1080p",
            subtitleNote: "ژێرنووسی کوردی",
            order: 1,
            active: true,
          },
        });

        createdEpisodes.push(ep);
        nextEpNum++;
      }

      return NextResponse.json({ success: true, count: createdEpisodes.length });
    }

    // Action 3: Single Episode Add
    if (action === "ADD_SINGLE") {
      const ep = await prisma.episode.create({
        data: {
          seasonId,
          seriesId,
          number: parseInt(number) || 1,
          titleKurdish: titleKurdish || `ئەڵقەی ${number}`,
          duration: parseInt(duration) || 45,
          rating: parseFloat(rating) || 0,
        },
      });

      if (serverUrl && serverUrl.trim()) {
        const normalized = normalizeStreamUrl(serverUrl);
        await prisma.server.create({
          data: {
            episodeId: ep.id,
            label: "سێرڤەر ١",
            provider: normalized.provider || provider || "vidmoly",
            url: normalized.embedUrl || serverUrl.trim(),
            quality: "1080p",
            subtitleNote: "ژێرنووسی کوردی",
            order: 1,
            active: true,
          },
        });
      }

      return NextResponse.json({ success: true, episode: ep });
    }

    // Action 4: Edit Episode (Rating, Title, Duration)
    if (action === "EDIT_EPISODE" && episodeId) {
      const updated = await prisma.episode.update({
        where: { id: episodeId },
        data: {
          number: number ? parseInt(number) : undefined,
          titleKurdish: titleKurdish || undefined,
          duration: duration ? parseInt(duration) : undefined,
          rating: rating !== undefined ? parseFloat(rating) : undefined,
        },
      });
      return NextResponse.json({ success: true, episode: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Episode API error:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { episodeId, seasonId } = await req.json();

    if (episodeId) {
      await prisma.episode.delete({ where: { id: episodeId } });
      return NextResponse.json({ success: true });
    }

    if (seasonId) {
      await prisma.season.delete({ where: { id: seasonId } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
