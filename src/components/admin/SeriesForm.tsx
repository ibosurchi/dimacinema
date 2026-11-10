"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, Check, AlertCircle, Loader2, Search } from "lucide-react";
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

interface SeriesFormProps {
  initialData?: any;
  genres: Genre[];
  countries: Country[];
  isEdit?: boolean;
}

export default function SeriesForm({
  initialData,
  genres,
  countries,
  isEdit = false,
}: SeriesFormProps) {
  const router = useRouter();

  const [titleKurdish, setTitleKurdish] = useState(initialData?.titleKurdish || "");
  const [titleOriginal, setTitleOriginal] = useState(initialData?.titleOriginal || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [rating, setRating] = useState(initialData?.rating || 8.5);
  const [quality, setQuality] = useState(initialData?.quality || "1080p BluRay");
  const [language, setLanguage] = useState(initialData?.language || "کوردی (ژێرنووس)");
  const [countryId, setCountryId] = useState(initialData?.countryId || "");
  const [synopsis, setSynopsis] = useState(initialData?.synopsis || "");
  const [poster, setPoster] = useState(initialData?.poster || "");
  const [backdrop, setBackdrop] = useState(initialData?.backdrop || "");
  const [trailerUrl, setTrailerUrl] = useState(initialData?.trailerUrl || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");

  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>(
    initialData?.genres?.map((g: any) => g.genreId) || []
  );

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

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // TMDB
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [tmdbResults, setTmdbResults] = useState<any[]>([]);
  const [showTmdbModal, setShowTmdbModal] = useState(false);

  const toggleGenre = (id: string) => {
    if (selectedGenreIds.includes(id)) {
      setSelectedGenreIds(selectedGenreIds.filter((gId) => gId !== id));
    } else {
      setSelectedGenreIds([...selectedGenreIds, id]);
    }
  };

  const searchTmdb = async () => {
    if (!tmdbQuery.trim()) return;
    setTmdbLoading(true);
    try {
      const res = await fetch(`/api/tmdb?query=${encodeURIComponent(tmdbQuery)}&type=tv`);
      const data = await res.json();
      setTmdbResults(data.results || []);
    } catch {
      alert("هەڵە لە گەڕانی TMDB");
    } finally {
      setTmdbLoading(false);
    }
  };

  const selectTmdbSeries = (s: any) => {
    setTitleOriginal(s.name || s.original_name || "");
    if (!titleKurdish) setTitleKurdish(s.name || "");
    if (s.first_air_date) {
      setYear(new Date(s.first_air_date).getFullYear());
    }
    if (s.vote_average) {
      setRating(Number(s.vote_average.toFixed(1)));
    }
    if (s.overview && !synopsis) {
      setSynopsis(s.overview);
    }
    if (s.poster_path) {
      setPoster(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${s.poster_path}`);
    }
    if (s.backdrop_path) {
      setBackdrop(`https://image.tmdb.org/t/p/original${s.backdrop_path}`);
    }
    setShowTmdbModal(false);
  };

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
      credits,
    };

    try {
      const url = isEdit ? `/api/admin/series/${initialData.id}` : "/api/admin/series";
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
        setSuccessMsg(isEdit ? "زنجیرەکە بە سەرکەوتوویی نوێکرایەوە!" : "زنجیرەکە بە سەرکەوتوویی زیادکرا!");
        setTimeout(() => {
          router.push("/admin/series");
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEdit ? "دەستکاریکردنی زنجیرە" : "زیادکردنی زنجیرەی نوێ"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              دوای زیادکردنی زنجیرەکە، دەتوانیت ئەڵقەکانیش لە بەشی ئەڵقەکان زیاد بکەیت
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
              <span>{isEdit ? "پاشەکەوتکردنی گۆڕانکاری" : "بڵاوکردنەوەی زنجیرە"}</span>
            </button>
          </div>
        </div>

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

        {/* Section 1: Basic Info */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-border pb-2.5">
            زانیارییە سەرەکییەکان
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                ناوی کوردی زنجیرە: *
              </label>
              <input
                type="text"
                required
                value={titleKurdish}
                onChange={(e) => setTitleKurdish(e.target.value)}
                placeholder="نموونە: برێکینگ باد"
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
                placeholder="Breaking Bad"
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
                placeholder="خۆی ئۆتۆماتیک دروست دەبێت"
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary dir-ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                placeholder="1080p WEB-DL, BluRay..."
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
              placeholder="کورتەی چیرۆکی زنجیرەکە لێرە بنووسە..."
              className="w-full bg-surface-light border border-border rounded-xl p-3 text-xs sm:text-sm text-white outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Section 2: Media with Direct Upload */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-border pb-2.5">
            وێنە و ڤیدیۆ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadField
              label="پۆستەری زنجیرە (Poster 2:3):"
              value={poster}
              onChange={setPoster}
              placeholder="https://... یان ئەپلۆدی وێنە بکە"
              aspectRatio="poster"
            />

            <ImageUploadField
              label="باکدرۆپی زنجیرە (Backdrop 16:9):"
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

        {/* Section 4: Publishing & Featured */}
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

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-purple-glow transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEdit ? "پاشەکەوتکردنی گۆڕانکارییەکان" : "بڵاوکردنەوەی زنجیرە"}</span>
          </button>
        </div>
      </form>

      {/* TMDB Search Modal */}
      {showTmdbModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">هێنانی زنجیرە لە بنکەدراوەی TMDB</h3>
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
                  placeholder="ناوی زنجیرە بە ئینگلیزی (بۆ نموونە: Breaking Bad)..."
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

              <div className="space-y-2">
                {tmdbResults.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => selectTmdbSeries(s)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-light hover:bg-surface-hover border border-border hover:border-primary/50 cursor-pointer transition-all"
                  >
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-surface shrink-0">
                      {s.poster_path && (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${s.poster_path}`}
                          alt={s.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{s.name}</h4>
                      <p className="text-[11px] text-text-dim">
                        {s.first_air_date ? s.first_air_date.split("-")[0] : "نادیار"} • ⭐{" "}
                        {s.vote_average ? s.vote_average.toFixed(1) : "0"}
                      </p>
                      <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{s.overview}</p>
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
