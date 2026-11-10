import React from "react";
import { Clapperboard, Film, Shield, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-purple-glow">
          <Clapperboard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">دەربارەی دیما سینەما</h1>
        <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
          سەکۆی پێشەنگی فیلم و زنجیرە جیهانییەکان بە ژێرنووسی کوردی سۆرانی، بە دیزاینێکی سینەمایی خاوێن، بێ ڕیکلام و هاوچەرخ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">بەرزترین کوالیتی</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            پەخشی سەرجەم بەرهەمەکان بە کوالیتی 4K و 1080p بە سێرڤەری خێرا بێ پچڕان.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">خاوێن و بێ ڕیکلام</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            ماڵپەڕەکە لەسەر بنەمای ئەزموونی بەکارهێنەر داڕێژراوە، دوور لە پۆپ-ئەپ و ڕیکلامە بێزارکەرەکان.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">بە زمانی کوردی</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            ڕووکاری تەواو کوردی ڕاست-بۆ-چەپ (RTL) و ژێرنووسی باوەڕپێکراو بۆ بینەرانی کورد.
          </p>
        </div>
      </div>
    </div>
  );
}
