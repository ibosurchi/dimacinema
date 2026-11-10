import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/kurdish";

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

    const series = await prisma.series.update({
      where: { id },
      data: {
        titleKurdish,
        titleOriginal,
        year: parseInt(year) || undefined,
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

    await prisma.seriesGenre.deleteMany({ where: { seriesId: id } });
    for (const gId of genreIds) {
      await prisma.seriesGenre.create({
        data: { seriesId: id, genreId: gId },
      });
    }

    // Re-link Credits
    await prisma.credit.deleteMany({ where: { seriesId: id } });
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
              seriesId: id,
              personId,
              role: c.role || "ACTOR",
              characterName: c.characterName || null,
              order: i + 1,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, series });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update series" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await prisma.series.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
