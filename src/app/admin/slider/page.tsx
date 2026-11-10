import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSliderManager, { SliderMediaItem } from "./AdminSliderManager";

export const dynamic = "force-dynamic";

export default async function AdminSliderPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin/slider");
  }

  // Fetch Settings
  const [speedSetting, itemsSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "slider_speed_seconds" } }),
    prisma.siteSetting.findUnique({ where: { key: "slider_items" } }),
  ]);

  const sliderSpeed = speedSetting?.value ? parseInt(speedSetting.value) : 7;

  // Fetch all published movies and series
  const [allMovies, allSeries] = await Promise.all([
    prisma.movie.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        titleKurdish: true,
        titleOriginal: true,
        slug: true,
        poster: true,
        backdrop: true,
        year: true,
        rating: true,
        featured: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.series.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        titleKurdish: true,
        titleOriginal: true,
        slug: true,
        poster: true,
        backdrop: true,
        year: true,
        rating: true,
        featured: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const allAvailableItems: SliderMediaItem[] = [
    ...allMovies.map((m) => ({ ...m, type: "movie" as const })),
    ...allSeries.map((s) => ({ ...s, type: "series" as const })),
  ];

  // Resolve current slider items in order
  let initialSliderItems: SliderMediaItem[] = [];

  if (itemsSetting?.value) {
    try {
      const parsedItems: { id: string; type: string }[] = JSON.parse(itemsSetting.value);
      for (const p of parsedItems) {
        const found = allAvailableItems.find((item) => item.id === p.id);
        if (found) {
          initialSliderItems.push(found);
        }
      }
    } catch {
      // fallback to featured
    }
  }

  // If no saved slider items, fall back to featured ones
  if (initialSliderItems.length === 0) {
    initialSliderItems = allAvailableItems.filter((i: any) => (i as any).featured);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminSliderManager
        initialSpeed={sliderSpeed}
        initialSliderItems={initialSliderItems}
        allAvailableItems={allAvailableItems}
      />
    </div>
  );
}
