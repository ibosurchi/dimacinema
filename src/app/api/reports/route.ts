import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { movieId, episodeId, serverId, note } = body;

    const report = await prisma.brokenReport.create({
      data: {
        movieId: movieId || null,
        episodeId: episodeId || null,
        serverId: serverId || null,
        note: note || "کێشە لە کارکردنی بەستەر",
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error) {
    console.error("Report submit error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
