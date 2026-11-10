import React from "react";
import { prisma } from "@/lib/prisma";
import SeriesForm from "@/components/admin/SeriesForm";

export default async function NewSeriesAdminPage() {
  const [genres, countries] = await Promise.all([
    prisma.genre.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKurdish: "asc" } }),
  ]);

  return <SeriesForm genres={genres} countries={countries} isEdit={false} />;
}
