"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Users } from "lucide-react";

export interface CastItem {
  id: string;
  characterName?: string | null;
  person: {
    nameKurdish: string;
    nameOriginal: string;
    slug: string;
    photo?: string | null;
  };
}

interface CastSliderProps {
  credits: CastItem[];
  title?: string;
}

export default function CastSlider({
  credits,
  title = "ئەکتەرە سەرەکییەکان (Cast)",
}: CastSliderProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!credits || credits.length === 0) return null;

  return (
    <div className="space-y-4 pt-4">
      {/* Header with Title and Scroll Arrows (No Outer Box) */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-white flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-primary rounded-full shadow-purple-glow" />
          <span>{title}</span>
        </h3>

        {/* Scroll Controls for Desktop / Quick Nav */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-primary/20 border border-white/10 hover:border-primary/50 text-text-muted hover:text-white flex items-center justify-center transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-primary/20 border border-white/10 hover:border-primary/50 text-text-muted hover:text-white flex items-center justify-center transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Row (Single continuous line, Never wraps) */}
      <div
        ref={rowRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 -mx-2 px-2"
      >
        {credits.map((credit) => (
          <Link
            key={credit.id}
            href={`/cast/${credit.person.slug}`}
            className="w-32 sm:w-36 shrink-0 snap-start p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-primary/50 transition-all text-center flex flex-col items-center group backdrop-blur-md hover:shadow-purple-glow"
          >
            {/* Avatar Circle */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-white/10 group-hover:border-primary group-hover:scale-105 transition-all bg-surface shadow-md">
              {credit.person.photo ? (
                <Image
                  src={credit.person.photo}
                  alt={credit.person.nameKurdish}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-dim text-sm font-bold bg-surface-light">
                  {credit.person.nameKurdish.charAt(0)}
                </div>
              )}
            </div>

            {/* Kurdish Name */}
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary transition-colors truncate w-full">
              {credit.person.nameKurdish}
            </h4>

            {/* Character / Original Name */}
            {credit.characterName ? (
              <p className="text-[11px] text-accent truncate w-full mt-0.5 font-medium">
                {credit.characterName}
              </p>
            ) : (
              <p className="text-[11px] text-text-dim truncate w-full mt-0.5 dir-ltr">
                {credit.person.nameOriginal}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
