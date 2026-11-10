"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-purple-glow">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">پەیوەندیکردن بە دیما سینەما</h1>
        <p className="text-xs text-text-muted">
          بۆ هەر پرسیار، پێشنیار، یان ڕەخنەیەک دەتوانن لە ڕێگەی ئەم فۆڕمەوە پەیوەندیمان پێوە بکەن.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">پەیامەکەت بە سەرکەوتوویی گەیشت</h3>
            <p className="text-xs text-text-muted">سوپاس بۆ پەیوەندیکردنت، بە زووترین کات وەڵامت دەدەینەوە.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">ناو:</label>
              <input
                type="text"
                required
                placeholder="ناوی خۆت بنووسە"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">ئیمەیڵ:</label>
              <input
                type="email"
                required
                placeholder="example@dima.krd"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">پەیام:</label>
              <textarea
                required
                rows={4}
                placeholder="پەیامەکەت بنووسە..."
                className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-purple-glow transition-all"
            >
              <Send className="w-4 h-4" />
              <span>ناردنی پەیام</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
