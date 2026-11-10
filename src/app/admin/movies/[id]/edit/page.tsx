import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MovieForm from "@/components/admin/MovieForm";

interface EditMoviePageProps {
  params: { id: string };
}

export default async function EditMovieAdminPage({ params }: EditMoviePageProps) {
  const [movie, genres, countries] = await Promise.all([
    prisma.movie.findUnique({
      where: { id: params.id },
      include: {
        genres: true,
        servers: { orderBy: { order: "asc" } },
        downloadLinks: true,
        credits: {
          include: { person: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.genre.findMany({ orderBy: { order: "asc" } }),
    prisma.country.findMany({ orderBy: { nameKurdish: "asc" } }),
  ]);

  if (!movie) {
    notFound();
  }

  return (
    <MovieForm
      initialData={movie}
      genres={genres}
      countries={countries}
      isEdit={true}
    />
  );
}
