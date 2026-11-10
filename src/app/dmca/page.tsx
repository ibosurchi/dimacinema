"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Send, AlertTriangle } from "lucide-react";

export default function DmcaPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent border border-accent/30 flex items-center justify-center mx-auto shadow-gold-glow">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          مافی لەبەرگرتنەوە و خاوەندارێتی (DMCA Notice)
        </h1>
        <p className="text-xs text-text-muted max-w-xl mx-auto leading-relaxed">
          ئێمە لە دیما سینەما ڕێز لە مافی خاوەندارێتی و بیرۆکەی هەموو بەرهەمهێنەران و خاوەن مافەکان دەگرین.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            تێبینی گرنگ: ماڵپەڕی <strong>دیما سینەما (DIMA Cinema)</strong> هیچ فایل یان ڤیدیۆیەک لەسەر سێرڤەرەکانی خۆی هەڵناگرێت. سەرجەم بەستەرەکانی پەخش لە ڕێگەی Embed و لە سێرڤەرە دەرەکییەکانەوە (وەک Vidmoly, Google Drive, Sharevids, YouTube) نیشان دەدرێن.
          </p>
        </div>

        <p>
          ئەگەر تۆ خاوەنی مافی لەبەرگرتنەوەی هەر بەرهەمێکیت و پێتوایە ناوەڕۆکەکە بەبێ ڕەزامەندی تۆ پەخشکراوە، تکایە لە ڕێگەی ئەم فۆڕمەی خوارەوە بەڵگە و لینکی پەیوەندیدار بنێرە. ئێمە بە زووترین کات (لە ماوەی کەمتر لە ٢٤ کاتژمێردا) بەستەرەکە لە ماڵپەڕ دەسڕینەوە.
        </p>
      </div>

      {/* Takedown Form */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-4">فۆڕمی داواکاری سڕینەوەی بەرهەم (Takedown Request)</h3>

        {submitted ? (
          <div className="py-10 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">داواکارییەکەت وەرگیرا</h4>
            <p className="text-xs text-text-muted">
              تیمی یاسایی دیما سینەما پشکنین بۆ بەستەرەکە دەکەن و ڕێوشوێنی پێویست دەگرنەبەر.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ناوی تەواوی خاوەن ماف یان کۆمپانیا:
              </label>
              <input
                type="text"
                required
                placeholder="ناوی خاوەن ماف"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ئیمەیڵی پەیوەندیکردن:
              </label>
              <input
                type="email"
                required
                placeholder="copyright@company.com"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                لینکی لاپەڕەکە لە دیما سینەما:
              </label>
              <input
                type="url"
                required
                placeholder="https://dima.krd/movie/oppenheimer-2023"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ڕوونکردنەوە و بەڵگەی خاوەندارێتی:
              </label>
              <textarea
                required
                rows={4}
                placeholder="بەڵگەی خاوەندارێتی یاسایی بخەرەڕوو..."
                className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              <span>ناردنی داواکاری سڕینەوە</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
