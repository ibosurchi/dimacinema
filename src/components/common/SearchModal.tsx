"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Film, Tv, Star, Loader2 } from "lucide-react";
import { toKurdishDigits, formatKurdishRating } from "@/lib/kurdish";

interface SearchResult {
  id: string;
  titleKurdish: string;
  titleOriginal: string;
  slug: string;
  year: number;
  rating: number;
  poster: string;
  quality: string;
  type: "movie" | "series";
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.items || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md transition-all">
      <div 
        className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-card overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3 bg-surface-light/50">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ناوی فیلم یان زنجیرە بنووسە (بۆ نموونە: ئۆپنهایمەر، Dune...)"
            className="w-full bg-transparent text-text-primary placeholder:text-text-dim text-sm md:text-base outline-none"
          />
          {loading && <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />}
          {query && !loading && (
            <button 
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/10 text-xs px-2.5 font-medium border border-border"
          >
            داخستن
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
          {query.trim() === "" ? (
            <div className="py-12 text-center text-text-muted">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30 text-primary" />
              <p className="text-sm">دەستبکە بە نووسین بۆ گەڕان لە ناو هەزاران کاتژمێر فیلم و زنجیرەدا</p>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-text-muted space-y-2">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <p className="text-xs">گەڕان ئەنجام دەدرێت...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <p className="text-base font-semibold text-text-primary mb-1">هیچ ئەنجامێک نەدۆزرایەوە</p>
              <p className="text-xs text-text-dim">دڵنیابەرەوە لە ڕاستنووسی ناوەکە یان وشەی تر تاقی بکەرەوە</p>
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-surface-light border border-transparent hover:border-border transition-all group"
              >
                <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-hover">
                  <Image
                    src={item.poster || "/placeholder-poster.jpg"}
                    alt={item.titleKurdish}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary flex items-center gap-1">
                      {item.type === "movie" ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                      {item.type === "movie" ? "فیلم" : "زنجیرە"}
                    </span>
                    <span className="text-xs text-text-dim">{toKurdishDigits(item.year)}</span>
                    <span className="text-xs text-accent font-medium flex items-center gap-0.5 ms-auto">
                      <Star className="w-3 h-3 fill-accent" />
                      {formatKurdishRating(item.rating)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                    {item.titleKurdish}
                  </h4>
                  <p className="text-xs text-text-dim truncate dir-ltr text-end">
                    {item.titleOriginal}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
