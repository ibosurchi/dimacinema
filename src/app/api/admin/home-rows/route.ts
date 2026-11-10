import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { titleKurdish, rule, type, genreId, order } = body;

    const row = await prisma.homeRow.create({
      data: {
        titleKurdish,
        rule: rule || "LATEST",
        type: type || "MOVIE",
        genreId: genreId || null,
        order: parseInt(order) || 0,
        active: true,
      },
    });

    return NextResponse.json({ success: true, row });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create home row" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await prisma.homeRow.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
