"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Plus, 
  Trash2, 
  Play, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2, 
  Search,
  ExternalLink
} from "lucide-react";
import { normalizeStreamUrl } from "@/lib/player/providers";
import ImageUploadField from "./ImageUploadField";
import CastManagerField, { CastMember } from "./CastManagerField";

interface Genre {
  id: string;
  nameKurdish: string;
}

interface Country {
  id: string;
  nameKurdish: string;
}

interface ServerRow {
  label: string;
  provider: string;
  url: string;
  quality: string;
  subtitleNote: string;
  active: boolean;
}

interface DownloadRow {
  label: string;
  url: string;
  quality: string;
  fileSize: string;
}

interface MovieFormProps {
  initialData?: any;
  genres: Genre[];
  countries: Country[];
  isEdit?: boolean;
}

export default function MovieForm({
  initialData,
  genres,
  countries,
  isEdit = false,
}: MovieFormProps) {
  const router = useRouter();

  // Basic Fields
  const [titleKurdish, setTitleKurdish] = useState(initialData?.titleKurdish || "");
  const [titleOriginal, setTitleOriginal] = useState(initialData?.titleOriginal || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [duration, setDuration] = useState(initialData?.duration || 120);
  const [rating, setRating] = useState(initialData?.rating || 8.0);
  const [quality, setQuality] = useState(initialData?.quality || "1080p BluRay");
  const [language, setLanguage] = useState(initialData?.language || "کوردی (ژێرنووس)");
  const [countryId, setCountryId] = useState(initialData?.countryId || "");
  const [synopsis, setSynopsis] = useState(initialData?.synopsis || "");
  const [poster, setPoster] = useState(initialData?.poster || "");
  const [backdrop, setBackdrop] = useState(initialData?.backdrop || "");
  const [trailerUrl, setTrailerUrl] = useState(initialData?.trailerUrl || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");

  // Selected Genre IDs
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>(
    initialData?.genres?.map((g: any) => g.genreId) || []
  );

  // Cast & Crew
  const [credits, setCredits] = useState<CastMember[]>(
    initialData?.credits?.map((c: any) => ({
      id: c.id,
      personId: c.personId,
      nameKurdish: c.person?.nameKurdish || "",
      nameOriginal: c.person?.nameOriginal || "",
      characterName: c.characterName || "",
      photo: c.person?.photo || "",
      role: c.role || "ACTOR",
    })) || []
  );

  // Streaming Servers
  const [servers, setServers] = useState<ServerRow[]>(
    initialData?.servers?.map((s: any) => ({
      label: s.label,
      provider: s.provider,
      url: s.url,
      quality: s.quality || "1080p",
      subtitleNote: s.subtitleNote || "ژێرنووسی کوردی",
      active: s.active !== false,
    })) || [
      { label: "سێرڤەر ١ - خێرا (Vidmoly)", provider: "vidmoly", url: "", quality: "1080p", subtitleNote: "ژێرنووسی کوردی", active: true },
    ]
  );

  // Download Links
  const [downloadLinks, setDownloadLinks] = useState<DownloadRow[]>(
    initialData?.downloadLinks?.map((dl: any) => ({
      label: dl.label,
      url: dl.url,
      quality: dl.quality || "1080p",
      fileSize: dl.fileSize || "",
    })) || []
  );

  // State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Live test preview state
  const [testPreviewUrl, setTestPreviewUrl] = useState<string | null>(null);

  // TMDB Search Modal state
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [tmdbResults, setTmdbResults] = useState<any[]>([]);
  const [showTmdbModal, setShowTmdbModal] = useState(false);

  // Server management helpers
  const addServerRow = () => {
    setServers([
      ...servers,
      {
        label: `سێرڤەر ${servers.length + 1}`,
        provider: "vidmoly",
        url: "",
        quality: "1080p",
        subtitleNote: "ژێرنووسی کوردی",
        active: true,
      },
    ]);
  };

  const removeServerRow = (index: number) => {
    setServers(servers.filter((_, idx) => idx !== index));
  };

  const updateServerField = (index: number, field: keyof ServerRow, value: any) => {
    const updated = [...servers];
    updated[index] = { ...updated[index], [field]: value };
    // Auto-detect provider if url changed
    if (field === "url") {
      const norm = normalizeStreamUrl(value);
      if (norm.provider) {
        updated[index].provider = norm.provider;
      }
    }
    setServers(updated);
  };

  // Download links helpers
  const addDownloadRow = () => {
    setDownloadLinks([
      ...downloadLinks,
      { label: "داگرتن بە کوالیتی 1080p", url: "", quality: "1080p", fileSize: "2.1 GB" },
    ]);
  };

  const removeDownloadRow = (index: number) => {
    setDownloadLinks(downloadLinks.filter((_, idx) => idx !== index));
  };

  const updateDownloadField = (index: number, field: keyof DownloadRow, value: any) => {
    const updated = [...downloadLinks];
    updated[index] = { ...updated[index], [field]: value };
    setDownloadLinks(updated);
  };

  // Genre toggle
  const toggleGenre = (id: string) => {
    if (selectedGenreIds.includes(id)) {
      setSelectedGenreIds(selectedGenreIds.filter((gId) => gId !== id));
    } else {
      setSelectedGenreIds([...selectedGenreIds, id]);
    }
  };

  // TMDB Import function
  const searchTmdb = async () => {
    if (!tmdbQuery.trim()) return;
    setTmdbLoading(true);
    try {
      const res = await fetch(`/api/tmdb?query=${encodeURIComponent(tmdbQuery)}&type=movie`);
      const data = await res.json();
      setTmdbResults(data.results || []);
    } catch {
      alert("هەڵە لە گەڕانی TMDB");
    } finally {
      setTmdbLoading(false);
    }
  };

  const selectTmdbMovie = (m: any) => {
    setTitleOriginal(m.title || m.original_title || "");
    if (!titleKurdish) setTitleKurdish(m.title || "");
    if (m.release_date) {
      setYear(new Date(m.release_date).getFullYear());
    }
    if (m.vote_average) {
      setRating(Number(m.vote_average.toFixed(1)));
    }
    if (m.overview && !synopsis) {
      setSynopsis(m.overview);
    }
    if (m.poster_path) {
      setPoster(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${m.poster_path}`);
    }
    if (m.backdrop_path) {
      setBackdrop(`https://image.tmdb.org/t/p/original${m.backdrop_path}`);
    }
    setShowTmdbModal(false);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      titleKurdish,
      titleOriginal,
      slug,
      year,
      duration,
      rating,
      quality,
      language,
      countryId: countryId || null,
      synopsis,
      poster,
      backdrop,
      trailerUrl,
      featured,
      status,
      genreIds: selectedGenreIds,
      servers,
      downloadLinks,
      credits,
    };

    try {
      const url = isEdit ? `/api/admin/movies/${initialData.id}` : "/api/admin/movies";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "تۆمارکردن سەرکەوتوو نەبوو");
      } else {
        setSuccessMsg(isEdit ? "فیلمەکە بە سەرکەوتوویی نوێکرایەوە!" : "فیلمەکە بە سەرکەوتوویی زیادکرا!");
        setTimeout(() => {
          router.push("/admin/movies");
          router.refresh();
        }, 1200);
      }
    } catch {
      setErrorMsg("هەڵەیەک لە پەیوەندی هەیە");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEdit ? "دەستکاریکردنی فیلم" : "زیادکردنی فیلمی نوێ"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              تکایە زانیاری و بەستەرەکانی پەخش بە تەواوی بنووسە
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTmdbModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25 text-xs font-bold transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>هێنانی زانیاری لە TMDB</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEdit ? "پاشەکەوتکردنی گۆڕانکاری" : "بڵاوکردنەوەی فیلم"}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-border pb-2.5">
            زانیارییە سەرەکییەکان
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ناوی کوردی فیلم: *
              </label>
              <input
                type="text"
                required
                value={titleKurdish}
                onChange={(e) => setTitleKurdish(e.target.value)}
                placeholder="نموونە: دیوون: بەشی دووەم"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ناوی ئۆرجیناڵ (ئینگلیزی): *
              </label>
              <input
                type="text"
                required
                value={titleOriginal}
                onChange={(e) => setTitleOriginal(e.target.value)}
                placeholder="Dune: Part Two"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary dir-ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Slug (بەستەری ناونیشان):
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="خۆی ئۆتۆماتیک لە ناوی ئینگلیزی دروست دەبێت"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary dir-ltr"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  ساڵ:
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                  className="w-full bg-surface-light border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  ماوە (خولەک):
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full bg-surface-light border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  نمرە (Rating):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
                  className="w-full bg-surface-light border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                کوالیتی (Quality):
              </label>
              <input
                type="text"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                placeholder="4K Ultra HD, 1080p BluRay..."
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                زمان و ژێرنووس:
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="کوردی (ژێرنووس)"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                وڵات:
              </label>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary"
              >
                <option value="">هەڵبژاردنی وڵات...</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameKurdish}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ژانەرەکان:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-surface-light rounded-xl border border-border">
                {genres.map((g) => {
                  const isSelected = selectedGenreIds.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGenre(g.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-surface hover:bg-surface-hover text-text-muted"
                      }`}
                    >
                      {g.nameKurdish}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              کورتەی چیرۆک (بە کوردی):
            </label>
            <textarea
              rows={4}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="کورتەی فیلمەکە لێرە بنووسە..."
              className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs sm:text-sm text-white outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Section 2: Media & Images with Direct Upload */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-border pb-2.5">
            وێنە و ڤیدیۆ (پۆستەر و باکدرۆپ)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadField
              label="پۆستەری فیلم (Poster 2:3):"
              value={poster}
              onChange={setPoster}
              placeholder="https://... یان ئەپلۆدی وێنە بکە"
              aspectRatio="poster"
            />

            <ImageUploadField
              label="باکدرۆپی فیلم (Backdrop 16:9):"
              value={backdrop}
              onChange={setBackdrop}
              placeholder="https://... یان ئەپلۆدی وێنە بکە"
              aspectRatio="backdrop"
            />

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                لینکی تڕەیلەری یوتیوب (Trailer URL):
              </label>
              <input
                type="url"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary dir-ltr"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Cast & Crew */}
        <CastManagerField value={credits} onChange={setCredits} />

        {/* Section 4: STREAMING SERVERS (THE CORE FEATURE) */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                <span>سێرڤەرەکانی پەخشی ڕاستەوخۆ (Streaming Servers)</span>
              </h3>
              <p className="text-[11px] text-text-dim">
                دەتوانیت لینکی ئاسایی یان کۆدی تەواوی &lt;iframe&gt; دابنێیت؛ سیستەمەکە ئۆتۆماتیکی نۆرماڵایزی دەکات.
              </p>
            </div>

            <button
              type="button"
              onClick={addServerRow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>زیادکردنی سێرڤەر</span>
            </button>
          </div>

          <div className="space-y-4">
            {servers.map((srv, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-light border border-border space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={srv.label}
                      onChange={(e) => updateServerField(idx, "label", e.target.value)}
                      placeholder="ناوی سێرڤەر (بۆ نموونە: سێرڤەری خێرا Vidmoly)"
                      className="bg-surface border border-border rounded-lg px-3 py-1 text-xs text-white font-bold outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live Test Button */}
                    {srv.url && (
                      <button
                        type="button"
                        onClick={() => {
                          const norm = normalizeStreamUrl(srv.url);
                          setTestPreviewUrl(norm.embedUrl || srv.url);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-hover text-accent border border-border text-[11px] font-bold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>تاقیکردنەوەی پەخش</span>
                      </button>
                    )}

                    <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={srv.active}
                        onChange={(e) => updateServerField(idx, "active", e.target.checked)}
                        className="rounded accent-primary"
                      />
                      <span>چالاک</span>
                    </label>

                    {servers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeServerRow(idx)}
                        className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] text-text-dim mb-1">
                      لینکی سێرڤەر (Embed URL یان تەواوی iframe):
                    </label>
                    <input
                      type="text"
                      required
                      value={srv.url}
                      onChange={(e) => updateServerField(idx, "url", e.target.value)}
                      placeholder="https://vidmoly.to/embed-... یان کۆدی تەواوی <iframe>"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-text-dim mb-1">
                      دابینکەر (Provider):
                    </label>
                    <select
                      value={srv.provider}
                      onChange={(e) => updateServerField(idx, "provider", e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary"
                    >
                      <option value="vidmoly">Vidmoly (خێرا)</option>
                      <option value="sharevids">Sharevids</option>
                      <option value="gdrive">Google Drive</option>
                      <option value="streamsb">StreamSB</option>
                      <option value="doodstream">DoodStream</option>
                      <option value="streamtape">Streamtape</option>
                      <option value="direct">Direct MP4 / HLS (.m3u8)</option>
                      <option value="custom">دیاری نەکراو / سێرڤەری تر</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Download Links */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold text-white">بەستەرەکانی داگرتن (Download Links)</h3>
            <button
              type="button"
              onClick={addDownloadRow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-light hover:bg-surface-hover text-white text-xs font-bold transition-all border border-border"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>زیادکردنی لینکی داگرتن</span>
            </button>
          </div>

          {downloadLinks.length === 0 ? (
            <p className="text-xs text-text-dim text-center py-4">
              هیچ بەستەرێکی داگرتن دانەنراوە. ئەگەر بەستەری داگرتن هەیە زیادی بکە.
            </p>
          ) : (
            <div className="space-y-3">
              {downloadLinks.map((dl, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center p-3 rounded-xl bg-surface-light border border-border"
                >
                  <input
                    type="text"
                    value={dl.label}
                    onChange={(e) => updateDownloadField(idx, "label", e.target.value)}
                    placeholder="ناونیشان (داگرتنی 1080p)"
                    className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
                  />
                  <input
                    type="url"
                    value={dl.url}
                    onChange={(e) => updateDownloadField(idx, "url", e.target.value)}
                    placeholder="لینکی داگرتن https://..."
                    className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary dir-ltr sm:col-span-2"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={dl.fileSize}
                      onChange={(e) => updateDownloadField(idx, "fileSize", e.target.value)}
                      placeholder="قەبارە (2.4 GB)"
                      className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-primary text-center"
                    />
                    <button
                      type="button"
                      onClick={() => removeDownloadRow(idx)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 6: Publishing & Featured */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-border pb-2.5">
            دۆخی بڵاوکردنەوە
          </h3>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span className="text-xs font-bold text-white">
                دانان لە سلایدەری سەرەکی (Featured Hero Slider)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">دۆخ:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-surface-light border border-border rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
              >
                <option value="PUBLISHED">بڵاوکراوەتەوە (دیارە بۆ هەمووان)</option>
                <option value="DRAFT">ڕەشنووس (شاراوە)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-purple-glow transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEdit ? "پاشەکەوتکردنی گۆڕانکارییەکان" : "بڵاوکردنەوەی فیلم لە سایت"}</span>
          </button>
        </div>
      </form>

      {/* Live Stream Test Modal */}
      {testPreviewUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-accent" />
                <span>تاقیکردنەوەی ڕاستەوخۆی پەخش</span>
              </h3>
              <button
                type="button"
                onClick={() => setTestPreviewUrl(null)}
                className="text-text-muted hover:text-white text-xs font-bold px-3 py-1 rounded-lg bg-surface-light"
              >
                داخستن
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={testPreviewUrl}
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                referrerPolicy="origin-when-cross-origin"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* TMDB Search Modal */}
      {showTmdbModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">هێنانی فیلم لە بنکەدراوەی TMDB</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTmdbModal(false)}
                className="text-text-muted hover:text-white text-xs font-bold px-3 py-1 rounded-lg bg-surface-light"
              >
                داخستن
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tmdbQuery}
                  onChange={(e) => setTmdbQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchTmdb())}
                  placeholder="ناوی فیلم بە ئینگلیزی بنووسە (بۆ نموونە: Dune 2)..."
                  className="flex-1 bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-primary dir-ltr"
                />
                <button
                  type="button"
                  onClick={searchTmdb}
                  disabled={tmdbLoading}
                  className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-black font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {tmdbLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>گەڕان</span>
                </button>
              </div>

              {/* Results */}
              <div className="space-y-2">
                {tmdbResults.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => selectTmdbMovie(m)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-light hover:bg-surface-hover border border-border hover:border-primary/50 cursor-pointer transition-all"
                  >
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-surface shrink-0">
                      {m.poster_path && (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                          alt={m.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                      <p className="text-[11px] text-text-dim">
                        {m.release_date ? m.release_date.split("-")[0] : "نادیار"} • ⭐{" "}
                        {m.vote_average ? m.vote_average.toFixed(1) : "0"}
                      </p>
                      <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{m.overview}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-[11px] font-bold shrink-0">
                      هەڵبژاردن
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
