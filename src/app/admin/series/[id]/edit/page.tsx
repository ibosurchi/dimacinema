import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SeriesForm from "@/components/admin/SeriesForm";

interface EditSeriesPageProps {
  params: { id: string };
}

export default async function EditSeriesAdminPage({ params }: EditSeriesPageProps) {
  const [series, genres, countries] = await Promise.all([
    prisma.series.findUnique({
      where: { id: params.id },
      include: {
        genres: true,
        credits: {
          include: { person: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.genre.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKurdish: "asc" } }),
  ]);

  if (!series) {
    notFound();
  }

  return (
    <SeriesForm
      initialData={series}
      genres={genres}
      countries={countries}
      isEdit={true}
    />
  );
}
