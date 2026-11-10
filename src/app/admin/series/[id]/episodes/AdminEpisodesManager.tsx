"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Layers, 
  Plus, 
  Trash2, 
  Tv, 
  Play, 
  Check, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  ListPlus,
  Star
} from "lucide-react";
import { toKurdishDigits, formatKurdishRating } from "@/lib/kurdish";

interface AdminEpisodesManagerProps {
  series: any;
  currentSeason: any;
  selectedSeasonNumber: number;
}

export default function AdminEpisodesManager({
  series,
  currentSeason,
  selectedSeasonNumber,
}: AdminEpisodesManagerProps) {
  const router = useRouter();

  // Mode: "LIST" | "ADD_SINGLE" | "BULK_ADD"
  const [activeTab, setActiveTab] = useState<"LIST" | "ADD_SINGLE" | "BULK_ADD">("LIST");

  // Single Add form
  const [epNumber, setEpNumber] = useState(
    (currentSeason?.episodes?.length ? currentSeason.episodes[currentSeason.episodes.length - 1].number + 1 : 1).toString()
  );
  const [epTitle, setEpTitle] = useState("");
  const [epDuration, setEpDuration] = useState("45");
  const [epRating, setEpRating] = useState("8.5");
  const [epServerUrl, setEpServerUrl] = useState("");

  // Bulk Add form
  const [bulkLinks, setBulkLinks] = useState("");

  // Loading & status
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Add New Season
  const handleAddSeason = async () => {
    if (!confirm("ئایا دڵنیایت لە دروستکردنی وەرزێکی نوێ؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/series/${series.id}/episodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_SEASON" }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      alert("هەڵە لە دروستکردنی وەرز");
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Single Episode
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeason) return;

    setLoading(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await fetch(`/api/admin/series/${series.id}/episodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_SINGLE",
          seasonId: currentSeason.id,
          number: parseInt(epNumber),
          titleKurdish: epTitle.trim() || `ئەڵقەی ${epNumber}`,
          duration: parseInt(epDuration),
          rating: parseFloat(epRating) || 0,
          serverUrl: epServerUrl.trim(),
        }),
      });

      if (res.ok) {
        setStatusMsg("ئەڵقەکە بە سەرکەوتوویی زیادکرا!");
        setEpNumber((parseInt(epNumber) + 1).toString());
        setEpTitle("");
        setEpServerUrl("");
        setActiveTab("LIST");
        router.refresh();
      } else {
        setErrorMsg("زیادکردن سەرکەوتوو نەبوو");
      }
    } catch {
      setErrorMsg("هەڵەی پەیوەندی");
    } finally {
      setLoading(false);
    }
  };

  // 3. BULK ADD EPISODES (PASTE MANY LINKS)
  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeason || !bulkLinks.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await fetch(`/api/admin/series/${series.id}/episodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BULK_ADD",
          seasonId: currentSeason.id,
          linksText: bulkLinks,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg(`بە سەرکەوتوویی ${toKurdishDigits(data.count)} ئەڵقە زیادکران!`);
        setBulkLinks("");
        setActiveTab("LIST");
        router.refresh();
      } else {
        setErrorMsg(data.error || "هەڵە لە زیادکردنی بەکۆمەڵ");
      }
    } catch {
      setErrorMsg("هەڵەی پەیوەندی");
    } finally {
      setLoading(false);
    }
  };

  // 4. Delete Episode
  const handleDeleteEpisode = async (episodeId: string) => {
    if (!confirm("ئایا دڵنیایت لە سڕینەوەی ئەم ئەڵقەیە؟")) return;

    try {
      const res = await fetch(`/api/admin/series/${series.id}/episodes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId }),
      });
      if (res.ok) router.refresh();
    } catch {
      alert("سڕینەوە سەرکەوتوو نەبوو");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/series" className="text-xs text-primary hover:underline font-bold">
              زنجیرەکان
            </Link>
            <span className="text-text-dim text-xs">/</span>
            <span className="text-xs text-text-muted">{series.titleKurdish}</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            بەڕێوەبردنی ئەڵقەکانی {series.titleKurdish}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("BULK_ADD")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-xs shadow-gold-glow transition-all"
          >
            <ListPlus className="w-4 h-4" />
            <span>زیادکردنی ئەڵقە بەکۆمەڵ (Bulk)</span>
          </button>

          <button
            onClick={() => setActiveTab("ADD_SINGLE")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-purple-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>زیادکردنی یەک ئەڵقە</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Season Selector Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-border gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {series.seasons.map((season: any) => {
            const isActive = season.number === selectedSeasonNumber;
            return (
              <Link
                key={season.id}
                href={`/admin/series/${series.id}/episodes?season=${season.number}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-white shadow-purple-glow"
                    : "bg-surface hover:bg-surface-light border border-border text-text-muted hover:text-white"
                }`}
              >
                وەرزی {toKurdishDigits(season.number)}
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleAddSeason}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-light hover:bg-surface-hover text-primary hover:text-white border border-border text-xs font-bold shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>وەرزی نوێ</span>
        </button>
      </div>

      {/* Tab: BULK ADD EPISODES */}
      {activeTab === "BULK_ADD" && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-accent" />
                <span>زیادکردنی ئەڵقەکان بەکۆمەڵ بۆ {currentSeason?.titleKurdish || "وەرز"}</span>
              </h3>
              <p className="text-[11px] text-text-dim">
                لینکەکانی پەخش (Vidmoly, Google Drive, Sharevids...) دابنێ، یەک لینک لە هەر دێڕێکدا.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("LIST")}
              className="text-xs text-text-muted hover:text-white"
            >
              داخستن
            </button>
          </div>

          <form onSubmit={handleBulkAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                لینکی ئەڵقەکان (هەر لینکێک لە دێڕێکدا):
              </label>
              <textarea
                required
                rows={8}
                value={bulkLinks}
                onChange={(e) => setBulkLinks(e.target.value)}
                placeholder="https://vidmoly.to/embed-ep1.html&#10;https://vidmoly.to/embed-ep2.html&#10;https://vidmoly.to/embed-ep3.html"
                className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs text-white outline-none focus:border-primary font-mono dir-ltr"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("LIST")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-white"
              >
                پاشگەزبوونەوە
              </button>
              <button
                type="submit"
                disabled={loading || !bulkLinks.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-black font-extrabold text-xs shadow-gold-glow transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>زیادکردنی سەرجەم ئەڵقەکان</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: SINGLE ADD EPISODE (WITH RATING FIELD) */}
      {activeTab === "ADD_SINGLE" && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <span>زیادکردنی یەک ئەڵقە بۆ {currentSeason?.titleKurdish || "وەرز"}</span>
            </h3>
            <button
              onClick={() => setActiveTab("LIST")}
              className="text-xs text-text-muted hover:text-white"
            >
              داخستن
            </button>
          </div>

          <form onSubmit={handleAddSingle} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  ژمارەی ئەڵقە:
                </label>
                <input
                  type="number"
                  required
                  value={epNumber}
                  onChange={(e) => setEpNumber(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  ناونیشانی ئەڵقە:
                </label>
                <input
                  type="text"
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  placeholder={`ئەڵقەی ${epNumber}`}
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  ماوە (خولەک):
                </label>
                <input
                  type="number"
                  value={epDuration}
                  onChange={(e) => setEpDuration(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 flex items-center gap-1 text-accent">
                  <Star className="w-3.5 h-3.5 fill-accent" />
                  <span>ڕەیتینگی ئەڵقە (Rating):</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={epRating}
                  onChange={(e) => setEpRating(e.target.value)}
                  placeholder="8.5"
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary text-center font-bold text-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                لینکی سێرڤەری پەخش (Vidmoly, Google Drive, Sharevids):
              </label>
              <input
                type="text"
                required
                value={epServerUrl}
                onChange={(e) => setEpServerUrl(e.target.value)}
                placeholder="https://vidmoly.to/embed-..."
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary font-mono dir-ltr"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("LIST")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-muted hover:text-white"
              >
                پاشگەزبوونەوە
              </button>
              <button
                type="submit"
                disabled={loading || !epServerUrl.trim()}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-purple-glow transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>پاشەکەوتکردنی ئەڵقە</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Episodes List in Current Season */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
        <div className="p-4 bg-surface-light border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Tv className="w-4 h-4 text-primary" />
            <span>ئەڵقەکانی {currentSeason?.titleKurdish} ({toKurdishDigits(currentSeason?.episodes?.length || 0)} ئەڵقە)</span>
          </h3>
        </div>

        <div className="divide-y divide-border">
          {!currentSeason?.episodes || currentSeason.episodes.length === 0 ? (
            <p className="text-xs text-text-dim p-8 text-center">
              هیچ ئەڵقەیەک لەم وەرزەدا نییە. دەتوانیت لە ڕێگەی دوگمەی سەرەوە ئەڵقە زیاد بکەیت.
            </p>
          ) : (
            currentSeason.episodes.map((ep: any) => (
              <div
                key={ep.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-surface-light/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary font-black flex items-center justify-center text-xs shrink-0">
                    {toKurdishDigits(ep.number)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{ep.titleKurdish}</p>
                      {ep.rating > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-[10px]">
                          <Star className="w-2.5 h-2.5 fill-accent" />
                          <span>{toKurdishDigits(ep.rating.toFixed(1))}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-dim mt-0.5">
                      ماوە: {toKurdishDigits(ep.duration)} خولەک • {toKurdishDigits(ep.servers?.length || 0)} سێرڤەر
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/watch/series/${series.slug}/s${currentSeason.number}e${ep.number}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-surface hover:bg-surface-hover text-text-muted hover:text-white border border-border"
                    title="پەخشکردن"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDeleteEpisode(ep.id)}
                    className="p-1.5 rounded-lg bg-surface hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-border"
                    title="سڕینەوە"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
