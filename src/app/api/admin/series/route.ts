import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/kurdish";

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
      credits = [],
    } = body;

    if (!titleKurdish || !titleOriginal) {
      return NextResponse.json({ error: "ناو بە کوردی و ئینگلیزی پێویستە" }, { status: 400 });
    }

    const slug = customSlug ? slugify(customSlug) : slugify(titleOriginal);

    const series = await prisma.series.create({
      data: {
        titleKurdish,
        titleOriginal,
        slug,
        year: parseInt(year) || new Date().getFullYear(),
        rating: parseFloat(rating) || 0,
        quality: quality || "1080p BluRay",
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

    if (genreIds && genreIds.length > 0) {
      for (const gId of genreIds) {
        await prisma.seriesGenre.create({
          data: { seriesId: series.id, genreId: gId },
        });
      }
    }

    // Link credits
    if (credits && credits.length > 0) {
      for (let i = 0; i < credits.length; i++) {
        const c = credits[i];
        let personId = c.personId;

        if (!personId && (c.nameKurdish || c.nameOriginal)) {
          const nameK = c.nameKurdish || c.nameOriginal;
          const nameO = c.nameOriginal || c.nameKurdish;
          let p = await prisma.person.findFirst({
            where: { OR: [{ nameKurdish: nameK }, { nameOriginal: nameO }] },
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
              seriesId: series.id,
              personId,
              role: c.role || "ACTOR",
              characterName: c.characterName || null,
              order: i + 1,
            },
          });
        }
      }
    }

    // Create default Season 1
    await prisma.season.create({
      data: {
        seriesId: series.id,
        number: 1,
        titleKurdish: "وەرزی یەکەم",
      },
    });

    return NextResponse.json({ success: true, series });
  } catch (error: any) {
    console.error("Create series error:", error);
    return NextResponse.json({ error: error.message || "Failed to create series" }, { status: 500 });
  }
}
