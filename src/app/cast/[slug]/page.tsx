import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/common/MovieCard";
import { User, Film, Tv, Star } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

interface CastPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export default async function CastPage({ params }: CastPageProps) {
  const person = await prisma.person.findUnique({
    where: { slug: params.slug },
    include: {
      credits: {
        include: {
          movie: true,
          series: true,
        },
      },
    },
  });

  if (!person) {
    notFound();
  }

  // Collect unique movies and series
  const movies = person.credits
    .filter((c) => c.movie && c.movie.status === "PUBLISHED")
    .map((c) => ({ ...c.movie!, characterName: c.characterName, type: "movie" as const }));

  const seriesList = person.credits
    .filter((c) => c.series && c.series.status === "PUBLISHED")
    .map((c) => ({ ...c.series!, characterName: c.characterName, type: "series" as const }));

  const allItems = [...movies, ...seriesList];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Actor Profile Header */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shrink-0 border-2 border-primary shadow-purple-glow bg-surface-light">
          {person.photo ? (
            <Image
              src={person.photo}
              alt={person.nameKurdish}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary">
              <User className="w-16 h-16" />
            </div>
          )}
        </div>

        <div className="space-y-3 text-center sm:text-right">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold inline-block mb-1">
              ئەکتەر / کەسایەتی
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {person.nameKurdish}
            </h1>
            <p className="text-sm text-text-dim dir-ltr sm:text-right font-medium">
              {person.nameOriginal}
            </p>
          </div>

          {person.biography && (
            <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
              {person.biography}
            </p>
          )}

          <p className="text-xs text-text-dim">
            بەشداری کردووە لە ({toKurdishDigits(allItems.length)}) بەرهەم لە دیما سینەما
          </p>
        </div>
      </div>

      {/* Filmography Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Film className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-white">
            بەرهەمەکانی {person.nameKurdish}
          </h2>
        </div>

        {allItems.length === 0 ? (
          <div className="py-16 text-center text-text-muted bg-surface rounded-2xl border border-border">
            هیچ فیلم یان زنجیرەیەکی ئەم ئەکتەرە لە ماڵپەڕ تۆمار نەکراوە تا ئێستا.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {allItems.map((item: any) => (
              <MovieCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
