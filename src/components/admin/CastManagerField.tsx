"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Users, Search, Upload, Loader2, User } from "lucide-react";

export interface CastMember {
  id?: string;
  personId?: string;
  nameKurdish: string;
  nameOriginal: string;
  characterName: string;
  photo?: string;
  role: string;
}

interface CastManagerFieldProps {
  value: CastMember[];
  onChange: (cast: CastMember[]) => void;
}

export default function CastManagerField({ value, onChange }: CastManagerFieldProps) {
  const [people, setPeople] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Search existing people from DB
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPeople([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await fetch(`/api/admin/people?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setPeople(Array.isArray(data) ? data : []);
      } catch {
        setPeople([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const addEmptyCastRow = () => {
    onChange([
      ...value,
      {
        nameKurdish: "",
        nameOriginal: "",
        characterName: "",
        photo: "",
        role: "ACTOR",
      },
    ]);
  };

  const addExistingPerson = (p: any) => {
    onChange([
      ...value,
      {
        personId: p.id,
        nameKurdish: p.nameKurdish,
        nameOriginal: p.nameOriginal,
        characterName: "",
        photo: p.photo || "",
        role: "ACTOR",
      },
    ]);
    setShowPicker(false);
    setSearchQuery("");
  };

  const updateCastRow = (index: number, field: keyof CastMember, val: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const removeCastRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUploadPhoto = async (index: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        updateCastRow(index, "photo", data.url);
      }
    } catch {
      alert("هەڵە لە ئەپلۆدکردنی وێنەی ئەکتەر");
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>ئەکتەرەکان و ستاف (Cast & Crew)</span>
          </h3>
          <p className="text-[11px] text-text-dim">
            دەتوانیت ئەکتەری هەڵبژێردراو زیاد بکەیت یان ناوی نوێ بنووسیت
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-light hover:bg-surface-hover border border-border text-text-muted hover:text-white text-xs font-bold transition-all"
          >
            <Search className="w-3.5 h-3.5 text-accent" />
            <span>هەڵبژاردن لە داتابەیس</span>
          </button>

          <button
            type="button"
            onClick={addEmptyCastRow}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>زیادکردنی ئەکتەر</span>
          </button>
        </div>
      </div>

      {/* Database Search Picker Drawer */}
      {showPicker && (
        <div className="p-4 rounded-xl bg-surface-light border border-border space-y-3">
          <div className="relative">
            <Search className="absolute start-3 top-2.5 w-4 h-4 text-text-dim" />
            <input
              type="text"
              placeholder="گەڕان بە ناوی ئەکتەر (کوردی یان ئینگلیزی)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl ps-9 pe-4 py-2 text-xs text-white outline-none focus:border-primary"
            />
          </div>

          {loadingSearch && (
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-accent" />
              <span>دەگەڕێت...</span>
            </p>
          )}

          {people.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {people.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addExistingPerson(p)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-start text-xs text-white transition-all group"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-surface-light shrink-0">
                    {p.photo ? (
                      <Image src={p.photo} alt={p.nameKurdish} fill className="object-cover" unoptimized />
                    ) : (
                      <User className="w-4 h-4 m-2 text-text-dim" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate text-white group-hover:text-primary">{p.nameKurdish}</p>
                    <p className="text-[10px] text-text-dim truncate">{p.nameOriginal}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cast Rows List */}
      {value.length === 0 ? (
        <div className="text-center py-6 text-xs text-text-muted border border-dashed border-border rounded-xl">
          هیچ ئەکتەرێک دیاری نەکراوە. دوگمەی &quot;زیادکردنی ئەکتەر&quot; دابگرە بۆ زیادکردن.
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((cast, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-light border border-border flex flex-col md:flex-row items-center gap-3"
            >
              {/* Photo Preview & Upload */}
              <div className="relative group shrink-0">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-border bg-surface flex items-center justify-center">
                  {cast.photo ? (
                    <Image src={cast.photo} alt={cast.nameKurdish} fill className="object-cover" unoptimized />
                  ) : (
                    <User className="w-6 h-6 text-text-dim" />
                  )}
                </div>
                <label className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <Upload className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleUploadPhoto(idx, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Kurdish Name */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="ناوی ئەکتەر (کوردی)"
                  value={cast.nameKurdish}
                  onChange={(e) => updateCastRow(idx, "nameKurdish", e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary"
                />
              </div>

              {/* Original Name */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Original Name (English)"
                  value={cast.nameOriginal}
                  onChange={(e) => updateCastRow(idx, "nameOriginal", e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary dir-ltr"
                />
              </div>

              {/* Character Name in movie */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="ڕۆڵ / کەسایەتی لە فیلمدا"
                  value={cast.characterName}
                  onChange={(e) => updateCastRow(idx, "characterName", e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary"
                />
              </div>

              {/* Photo URL manual input */}
              <div className="w-full md:w-36">
                <input
                  type="url"
                  placeholder="لینکی وێنە"
                  value={cast.photo || ""}
                  onChange={(e) => updateCastRow(idx, "photo", e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-2.5 py-2 text-[11px] text-white outline-none focus:border-primary dir-ltr"
                />
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeCastRow(idx)}
                className="p-2 rounded-lg bg-surface hover:bg-rose-500/20 text-text-dim hover:text-rose-400 border border-border transition-colors shrink-0"
                title="سڕینەوە"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
