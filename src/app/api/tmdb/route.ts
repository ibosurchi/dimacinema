import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();
    const tmdbId = searchParams.get("id")?.trim();
    const type = searchParams.get("type") || "movie"; // movie or tv

    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        warning: "کلیل (TMDB_API_KEY) لە فایلی .env دانەنراوە. تکایە لە .env دایبنێ بۆ گەڕانی ئۆتۆماتیکی.",
        results: [],
      });
    }

    if (tmdbId) {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${apiKey}&language=en-US&append_to_response=credits,videos`
      );
      if (!res.ok) return NextResponse.json({ error: "Not found on TMDB" }, { status: 404 });
      const data = await res.json();
      return NextResponse.json({ data });
    }

    if (query) {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}&language=en-US`
      );
      if (!res.ok) return NextResponse.json({ results: [] });
      const data = await res.json();
      return NextResponse.json({ results: data.results || [] });
    }

    return NextResponse.json({ results: [] });
  } catch (error) {
    return NextResponse.json({ error: "TMDB request failed" }, { status: 500 });
  }
}
