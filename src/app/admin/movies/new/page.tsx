import React from "react";
import { prisma } from "@/lib/prisma";
import MovieForm from "@/components/admin/MovieForm";

export default async function NewMovieAdminPage() {
  const [genres, countries] = await Promise.all([
    prisma.genre.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKurdish: "asc" } }),
  ]);

  return <MovieForm genres={genres} countries={countries} isEdit={false} />;
}
