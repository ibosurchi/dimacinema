import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/kurdish";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const people = await prisma.person.findMany({
      where: q
        ? {
            OR: [
              { nameKurdish: { contains: q } },
              { nameOriginal: { contains: q } },
            ],
          }
        : undefined,
      take: 30,
      orderBy: { nameKurdish: "asc" },
    });

    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nameKurdish, nameOriginal, photo, biography } = await req.json();

    if (!nameKurdish || !nameOriginal) {
      return NextResponse.json({ error: "ناوی ئەکتەر بە کوردی و ئینگلیزی پێویستە" }, { status: 400 });
    }

    const baseSlug = slugify(nameOriginal || nameKurdish);
    let slug = baseSlug;
    let count = 1;
    while (await prisma.person.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const person = await prisma.person.create({
      data: {
        nameKurdish,
        nameOriginal,
        slug,
        photo: photo || null,
        biography: biography || null,
      },
    });

    return NextResponse.json(person);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create person" }, { status: 500 });
  }
}
