"use client";

import React, { useState } from "react";
import { Link as LinkIcon, Play, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { normalizeStreamUrl, detectProvider } from "@/lib/player/providers";

export default function AdminLinkTesterPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    const normalized = normalizeStreamUrl(inputUrl);
    const provider = detectProvider(inputUrl);

    setResult({
      ...normalized,
      providerName: provider.name,
      providerNameKurdish: provider.nameKurdish,
    });
    setPreviewKey((k) => k + 1);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-black text-white">ئامرازی تاقیکردنەوەی بەستەری پەخش</h1>
        <p className="text-xs text-text-muted mt-1">
          پشکنینی شێوازی بەستەری سێرڤەر و نۆرماڵایزکردنی خۆکار و پێشبینینی پەخش پێش تۆمارکردن
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-card space-y-4">
        <form onSubmit={handleTest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2">
              بەستەری ڤیدیۆ یان کۆدی تەواوی &lt;iframe&gt; بنووسە:
            </label>
            <textarea
              rows={3}
              required
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="بۆ نموونە: https://vidmoly.to/embed-xyz.html یان https://drive.google.com/file/d/1BxiMVs0XRA5n.../view"
              className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-text-dim outline-none focus:border-primary font-mono dir-ltr resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-text-dim">
              <span>پشتگیریکراو بۆ:</span>
              <span className="text-primary font-bold">Vidmoly</span>
              <span>•</span>
              <span className="text-primary font-bold">Google Drive</span>
              <span>•</span>
              <span className="text-primary font-bold">Sharevids</span>
              <span>•</span>
              <span className="text-primary font-bold">YouTube</span>
            </div>

            <button
              type="submit"
              disabled={loading || !inputUrl.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>پشکنین و پەخش</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result & Live Preview */}
      {result && (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-card space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  result.success
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {result.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {result.success ? "بەستەرەکە دروستە و نۆرماڵایزکرا" : "کێشە هەیە لە بەستەر"}
                </h3>
                <p className="text-xs text-text-dim">
                  پێشکەشکار: <strong className="text-accent">{result.providerNameKurdish}</strong> ({result.providerName})
                </p>
              </div>
            </div>

            {result.success && (
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="p-2 rounded-xl bg-surface-light hover:bg-surface-hover border border-border text-text-muted hover:text-white"
                title="نوێکردنەوەی پەخش"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {result.success && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-muted">
                بەستەری نۆرماڵایزکراوی کۆتایی (Normalized Embed URL):
              </label>
              <div className="p-3 rounded-xl bg-surface-light border border-border font-mono text-xs text-primary dir-ltr select-all break-all">
                {result.embedUrl}
              </div>
            </div>
          )}

          {result.error && (
            <p className="text-xs text-red-400">{result.error}</p>
          )}

          {/* Live Player Container */}
          {result.success && result.embedUrl && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-muted">پێشبینینی ڕاستەوخۆ (Live Sandbox Embed):</h4>
              <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-border">
                <iframe
                  key={previewKey}
                  src={result.embedUrl}
                  title="Link Test Preview"
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
                  referrerPolicy="origin-when-cross-origin"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
