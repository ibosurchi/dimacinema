"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  PlaySquare, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  Clock, 
  Check, 
  Loader2, 
  Film, 
  Tv, 
  Search,
  Star
} from "lucide-react";
import { toKurdishDigits, formatKurdishRating } from "@/lib/kurdish";

export interface SliderMediaItem {
  id: string;
  titleKurdish: string;
  titleOriginal: string;
  slug: string;
  poster: string;
  backdrop: string;
  year: number;
  rating: number;
  type: "movie" | "series";
}

interface AdminSliderManagerProps {
  initialSpeed: number;
  initialSliderItems: SliderMediaItem[];
  allAvailableItems: SliderMediaItem[];
}

export default function AdminSliderManager({
  initialSpeed,
  initialSliderItems,
  allAvailableItems,
}: AdminSliderManagerProps) {
  const [speed, setSpeed] = useState<number>(initialSpeed || 7);
  const [sliderItems, setSliderItems] = useState<SliderMediaItem[]>(initialSliderItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Move slide up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sliderItems];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setSliderItems(updated);
  };

  // Move slide down
  const moveDown = (index: number) => {
    if (index === sliderItems.length - 1) return;
    const updated = [...sliderItems];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setSliderItems(updated);
  };

  // Remove from slider
  const removeSlide = (id: string) => {
    setSliderItems(sliderItems.filter((item) => item.id !== id));
  };

  // Add to slider
  const addSlide = (item: SliderMediaItem) => {
    if (sliderItems.some((s) => s.id === item.id)) return;
    setSliderItems([...sliderItems, item]);
  };

  // Save to SiteSetting via API
  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const payload = {
        slider_speed_seconds: String(speed),
        slider_items: JSON.stringify(
          sliderItems.map((item) => ({ id: item.id, type: item.type }))
        ),
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("کێشەیەک لە پاشەکەوتکردن ڕوویدا");
      }
    } catch {
      alert("هەڵە لە پەیوەندی بە سێرڤەر");
    } finally {
      setLoading(false);
    }
  };

  const filteredAvailable = allAvailableItems.filter((item) => {
    const isAlreadyInSlider = sliderItems.some((s) => s.id === item.id);
    if (isAlreadyInSlider) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.titleKurdish.toLowerCase().includes(q) ||
      item.titleOriginal.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <PlaySquare className="w-5 h-5 text-primary" />
            <span>دەستکاریکردنی سلایدەری سەرەکی (Hero Slider)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            دەتوانیت ئەو فیلم و زنجیرانە دیاری بکەیت کە لە سلایدەری سەرەوە پیشان دەدرێن، ڕیزبەندییان بکەیت و خێرایی مانەوەیان بگۆڕیت.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>پاشەکەوتکردنی سلایدەر</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>ڕێکخستنەکانی سلایدەر بە سەرکەوتوویی پاشەکەوتکران!</span>
        </div>
      )}

      {/* Speed Setting Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">ماوەی مانەوەی هەر سلایدێک (بە چرکە):</h3>
            <p className="text-xs text-text-dim">
              هەر چەند چرکە جارێک سلایدەکە ئۆتۆماتیک بگۆڕێت بۆ دانەی دواتر
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="number"
            min="3"
            max="30"
            value={speed}
            onChange={(e) => setSpeed(Math.max(3, parseInt(e.target.value) || 7))}
            className="w-24 bg-surface-light border border-border rounded-xl px-4 py-2 text-sm text-white font-black text-center outline-none focus:border-primary"
          />
          <span className="text-xs font-bold text-text-muted">چرکە</span>
        </div>
      </div>

      {/* Active Slider Items in Order */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>سلایدە چالاکەکان بەپێی ڕیزبەندی (ژمارە ١ یەکەم سلاید دەبێت):</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
              {toKurdishDigits(sliderItems.length)} دانە
            </span>
          </h3>
        </div>

        {sliderItems.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted border border-dashed border-border rounded-xl">
            هیچ ئایتمێک لەناو سلایدەر نییە. لە بەشی خوارەوە فیلم یان زنجیرە زیاد بکە.
          </div>
        ) : (
          <div className="space-y-3">
            {sliderItems.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-surface-light border border-border hover:border-primary/40 flex items-center justify-between gap-4 transition-all"
              >
                {/* Order & Thumbnail */}
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-surface border border-border text-accent font-black text-xs flex items-center justify-center">
                    {toKurdishDigits(index + 1)}
                  </span>

                  <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-surface border border-border shrink-0">
                    <Image
                      src={item.poster || item.backdrop}
                      alt={item.titleKurdish}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary flex items-center gap-1">
                        {item.type === "movie" ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                        {item.type === "movie" ? "فیلم" : "زنجیرە"}
                      </span>
                      <span className="text-[11px] text-text-dim">{toKurdishDigits(item.year)}</span>
                      <span className="flex items-center gap-0.5 text-[11px] text-accent">
                        <Star className="w-3 h-3 fill-accent" />
                        {formatKurdishRating(item.rating)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1">{item.titleKurdish}</h4>
                    <p className="text-[11px] text-text-dim dir-ltr text-right">{item.titleOriginal}</p>
                  </div>
                </div>

                {/* Move & Remove Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-surface hover:bg-surface-hover text-text-muted hover:text-white border border-border disabled:opacity-30 transition-all"
                    title="بردن بۆ سەرەوە (پێشتر پیشان دەدرێت)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === sliderItems.length - 1}
                    className="p-2 rounded-lg bg-surface hover:bg-surface-hover text-text-muted hover:text-white border border-border disabled:opacity-30 transition-all"
                    title="بردن بۆ خوارەوە"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeSlide(item.id)}
                    className="p-2 rounded-lg bg-surface hover:bg-rose-500/20 text-text-dim hover:text-rose-400 border border-border transition-all ms-2"
                    title="سڕینەوە لە سلایدەر"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Content to Add */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">فیلم و زنجیرە بڵاوکراوەکانی تر:</h3>
            <p className="text-[11px] text-text-dim">
              کلیک لە &quot;زیادکردن بۆ سلایدەر&quot; بکە بۆ ئەوەی بخرێتە ناو ڕیزبەندی سلایدەر
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute start-3 top-2.5 w-4 h-4 text-text-dim" />
            <input
              type="text"
              placeholder="گەڕان بە ناوی فیلم یان زنجیرە..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-light border border-border rounded-xl ps-9 pe-4 py-2 text-xs text-white outline-none focus:border-primary"
            />
          </div>
        </div>

        {filteredAvailable.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-6">
            هیچ فیلم یان زنجیرەیەکی تر نەدۆزرایەوە.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
            {filteredAvailable.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-surface-light border border-border hover:border-primary/40 flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-surface border border-border shrink-0">
                    <Image
                      src={item.poster || item.backdrop}
                      alt={item.titleKurdish}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-primary">
                      {item.type === "movie" ? "فیلم" : "زنجیرە"} • {toKurdishDigits(item.year)}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">{item.titleKurdish}</h4>
                    <p className="text-[10px] text-text-dim truncate">{item.titleOriginal}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addSlide(item)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-bold transition-all shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>زیادکردن</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
