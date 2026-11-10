import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminEpisodesManager from "./AdminEpisodesManager";

interface SeriesEpisodesPageProps {
  params: { id: string };
  searchParams: { season?: string };
}

export const revalidate = 0;

export default async function SeriesEpisodesAdminPage({
  params,
  searchParams,
}: SeriesEpisodesPageProps) {
  const series = await prisma.series.findUnique({
    where: { id: params.id },
    include: {
      seasons: {
        orderBy: { number: "asc" },
        include: {
          episodes: {
            orderBy: { number: "asc" },
            include: { servers: true },
          },
        },
      },
    },
  });

  if (!series) {
    notFound();
  }

  const selectedSeasonNumber = searchParams.season
    ? parseInt(searchParams.season)
    : series.seasons[0]?.number || 1;

  const currentSeason =
    series.seasons.find((s) => s.number === selectedSeasonNumber) || series.seasons[0];

  return (
    <AdminEpisodesManager
      series={series}
      currentSeason={currentSeason}
      selectedSeasonNumber={selectedSeasonNumber}
    />
  );
}
