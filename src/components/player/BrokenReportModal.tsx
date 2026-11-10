"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Check, Loader2 } from "lucide-react";

interface BrokenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId?: string;
  episodeId?: string;
  serverId?: string;
  serverLabel?: string;
}

export default function BrokenReportModal({
  isOpen,
  onClose,
  movieId,
  episodeId,
  serverId,
  serverLabel,
}: BrokenReportModalProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          episodeId,
          serverId,
          note: note.trim() || `کێشە لە ${serverLabel || "سێرڤەر"}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setNote("");
          onClose();
        }, 2200);
      } else {
        setError("نەتوانرا ڕاپۆرت بنێردرێت، تکایە دواتر هەوڵبدەرەوە.");
      }
    } catch {
      setError("هەڵەیەک لە پەیوەندی هەیە.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-card p-6 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-surface-light border border-border"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">ڕاپۆرتکردنی کێشەی سێرڤەر</h3>
            <p className="text-xs text-text-dim">
              {serverLabel ? `سێرڤەری هەڵبژێردراو: ${serverLabel}` : "ئەگەر ڤیدیۆکە کار ناکات یان کێشەی هەیە بەڕێوەبەر ئاگاداربکەرەوە"}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">سوپاس بۆ هاوکاریت!</h4>
            <p className="text-xs text-text-muted">ڕاپۆرتەکەت گەیشتە تیمی دیما سینەما و بە زووترین کات چارەسەر دەکرێت.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                تێبینی زیاتر (ئارەزوومەندانە):
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="بۆ نموونە: ڤیدیۆکە ناوەستێت، دەنگ لەگەڵ ڕەسم ناڕوات، ژێرنووس نییە..."
                rows={3}
                className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs text-white placeholder:text-text-dim outline-none focus:border-primary resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-white hover:bg-surface-light"
              >
                پاشگەزبوونەوە
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>ناردنی ڕاپۆرت</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
