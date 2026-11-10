import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/kurdish";
import { normalizeStreamUrl } from "@/lib/player/providers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      titleKurdish,
      titleOriginal,
      slug: customSlug,
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

    if (!titleKurdish || !titleOriginal) {
      return NextResponse.json({ error: "ناو بە کوردی و ئینگلیزی پێویستە" }, { status: 400 });
    }

    const slug = customSlug ? slugify(customSlug) : slugify(titleOriginal + "-" + (year || 2024));

    // Create Movie
    const movie = await prisma.movie.create({
      data: {
        titleKurdish,
        titleOriginal,
        slug,
        year: parseInt(year) || new Date().getFullYear(),
        duration: parseInt(duration) || 0,
        rating: parseFloat(rating) || 0,
        quality: quality || "HD",
        language: language || "کوردی (ژێرنووس)",
        countryId: countryId || null,
        synopsis: synopsis || "",
        poster: poster || "",
        backdrop: backdrop || poster || "",
        trailerUrl: trailerUrl || null,
        featured: Boolean(featured),
        status: status || "PUBLISHED",
      },
    });

    // Link Genres
    if (genreIds && genreIds.length > 0) {
      for (const gId of genreIds) {
        await prisma.movieGenre.create({
          data: { movieId: movie.id, genreId: gId },
        });
      }
    }

    // Add Streaming Servers
    if (servers && servers.length > 0) {
      for (let i = 0; i < servers.length; i++) {
        const s = servers[i];
        if (s.url && s.url.trim()) {
          const normalized = normalizeStreamUrl(s.url);
          await prisma.server.create({
            data: {
              movieId: movie.id,
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

    // Add Download Links
    if (downloadLinks && downloadLinks.length > 0) {
      for (const dl of downloadLinks) {
        if (dl.url && dl.url.trim()) {
          await prisma.downloadLink.create({
            data: {
              movieId: movie.id,
              label: dl.label || "داگرتن",
              url: dl.url.trim(),
              quality: dl.quality || "1080p",
              fileSize: dl.fileSize || null,
            },
          });
        }
      }
    }

    // Link Cast & Crew Credits
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
              movieId: movie.id,
              personId,
              role: c.role || "ACTOR",
              characterName: c.characterName || null,
              order: i + 1,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, movie });
  } catch (error: any) {
    console.error("Create movie error:", error);
    return NextResponse.json({ error: error.message || "Failed to create movie" }, { status: 500 });
  }
}
