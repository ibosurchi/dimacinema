"use client";

import React, { useState } from "react";
import { Film, CheckCircle2, Send, Tv } from "lucide-react";

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent border border-accent/30 flex items-center justify-center mx-auto shadow-gold-glow">
          <Film className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">داواکردنی فیلم یان زنجیرە</h1>
        <p className="text-xs text-text-muted">
          ئەگەر ئەو فیلم یان زنجیرەیەی بەدوایدا دەگەڕێیت لە دیما سینەما نییە، داوای بکە تا بە زووترین کات دابنرێت.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-accent mx-auto" />
            <h3 className="text-base font-bold text-white">داواکارییەکەت تۆمارکرا</h3>
            <p className="text-xs text-text-muted">
              تیمی وەرگێڕان و دابینکردنی دیما سینەما بە زووترین کات فیلمەکە یان زنجیرەکە ئامادە دەکەن.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                جۆری بەرهەم:
              </label>
              <select className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary">
                <option value="movie">فیلم (Movie)</option>
                <option value="series">زنجیرە (Series)</option>
                <option value="animation">ئەنیمەیشن (Animation)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ناوی تەواوی فیلم یان زنجیرە (بە ئینگلیزی یان کوردی):
              </label>
              <input
                type="text"
                required
                placeholder="بۆ نموونە: Gladiator II یان Breaking Bad"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ساڵی دەرچوون (ئەگەر دەیزانیت):
              </label>
              <input
                type="number"
                placeholder="2024"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                تێبینی زیاتر:
              </label>
              <textarea
                rows={3}
                placeholder="ئەگەر بەستەری تایبەت یان وەرزێکی دیاریکراوە بنووسە..."
                className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-xs sm:text-sm shadow-gold-glow transition-all"
            >
              <Send className="w-4 h-4" />
              <span>ناردنی داواکاری</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
