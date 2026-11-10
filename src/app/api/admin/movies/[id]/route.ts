import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/kurdish";
import { normalizeStreamUrl } from "@/lib/player/providers";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      titleKurdish,
      titleOriginal,
      year,
      duration,
      rating,
      quality,
      language,
      countryId,
      synopsis,
      poster,
      backdrop,
      trailerUrl,
      featured,
      status,
      genreIds = [],
      servers = [],
      downloadLinks = [],
      credits = [],
    } = body;

    // Update Movie
    const updated = await prisma.movie.update({
      where: { id },
      data: {
        titleKurdish,
        titleOriginal,
        year: parseInt(year) || undefined,
        duration: parseInt(duration) || undefined,
        rating: parseFloat(rating) || undefined,
        quality,
        language,
        countryId: countryId || null,
        synopsis,
        poster,
        backdrop,
        trailerUrl,
        featured: Boolean(featured),
        status,
      },
    });

    // Re-link Genres
    await prisma.movieGenre.deleteMany({ where: { movieId: id } });
    for (const gId of genreIds) {
      await prisma.movieGenre.create({
        data: { movieId: id, genreId: gId },
      });
    }

    // Re-link Servers
    await prisma.server.deleteMany({ where: { movieId: id } });
    if (servers && servers.length > 0) {
      for (let i = 0; i < servers.length; i++) {
        const s = servers[i];
        if (s.url && s.url.trim()) {
          const normalized = normalizeStreamUrl(s.url);
          await prisma.server.create({
            data: {
              movieId: id,
              label: s.label || `سێرڤەر ${i + 1}`,
              provider: normalized.provider || s.provider || "custom",
              url: normalized.embedUrl || s.url.trim(),
              quality: s.quality || "1080p",
              subtitleNote: s.subtitleNote || "ژێرنووسی کوردی",
              order: i + 1,
              active: s.active !== false,
            },
          });
        }
      }
    }

    // Re-link Download links
    await prisma.downloadLink.deleteMany({ where: { movieId: id } });
    if (downloadLinks && downloadLinks.length > 0) {
      for (const dl of downloadLinks) {
        if (dl.url && dl.url.trim()) {
          await prisma.downloadLink.create({
            data: {
              movieId: id,
              label: dl.label || "داگرتن",
              url: dl.url.trim(),
              quality: dl.quality || "1080p",
              fileSize: dl.fileSize || null,
            },
          });
        }
      }
    }

    // Re-link Cast & Crew Credits
    await prisma.credit.deleteMany({ where: { movieId: id } });
    if (credits && credits.length > 0) {
      for (let i = 0; i < credits.length; i++) {
        const c = credits[i];
        let personId = c.personId;

        if (!personId && (c.nameKurdish || c.nameOriginal)) {
          const nameK = c.nameKurdish || c.nameOriginal;
          const nameO = c.nameOriginal || c.nameKurdish;
          let p = await prisma.person.findFirst({
            where: {
              OR: [{ nameKurdish: nameK }, { nameOriginal: nameO }],
            },
          });
          if (!p) {
            p = await prisma.person.create({
              data: {
                nameKurdish: nameK,
                nameOriginal: nameO,
                slug: slugify(nameO) + "-" + Date.now().toString(36).slice(-4),
                photo: c.photo || null,
              },
            });
          }
          personId = p.id;
        }

        if (personId) {
          await prisma.credit.create({
            data: {
              movieId: id,
              personId,
              role: c.role || "ACTOR",
              characterName: c.characterName || null,
              order: i + 1,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, movie: updated });
  } catch (error: any) {
    console.error("Update movie error:", error);
    return NextResponse.json({ error: error.message || "Failed to update movie" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await prisma.movie.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
