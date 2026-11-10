import React from "react";
import Link from "next/link";
import { Film, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center mb-6 shadow-purple-glow">
        <Film className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-6xl font-black text-primary mb-2">٤٠٤</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">لاپەڕەکە نەدۆزرایەوە</h2>
      <p className="text-xs sm:text-sm text-text-muted max-w-md mb-8 leading-relaxed">
        ببورە، ئەو لاپەڕەیەی کە بەدوایدا دەگەڕێیت بوونی نییە یان ڕەنگە لابرا بێت.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-purple-glow transition-all"
        >
          <Home className="w-4 h-4" />
          <span>گەڕانەوە بۆ لاپەڕەی سەرەکی</span>
        </Link>
        <Link
          href="/movies"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-surface-light border border-border text-text-muted hover:text-white text-xs sm:text-sm font-semibold transition-all"
        >
          <Search className="w-4 h-4" />
          <span>گەڕان لەناو فیلمەکان</span>
        </Link>
      </div>
    </div>
  );
}
