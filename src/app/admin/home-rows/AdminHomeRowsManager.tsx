"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Sliders, Check, Loader2 } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

export default function AdminHomeRowsManager({
  initialRows,
  genres,
}: {
  initialRows: any[];
  genres: any[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [showAddModal, setShowAddModal] = useState(false);

  // New row form
  const [titleKurdish, setTitleKurdish] = useState("");
  const [rule, setRule] = useState("LATEST");
  const [type, setType] = useState("MOVIE");
  const [genreId, setGenreId] = useState("");
  const [order, setOrder] = useState((rows.length + 1).toString());
  const [loading, setLoading] = useState(false);

  const handleAddRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleKurdish.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/home-rows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleKurdish,
          rule,
          type,
          genreId: rule === "GENRE" ? genreId : null,
          order: parseInt(order),
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setTitleKurdish("");
        router.refresh();
      }
    } catch {
      alert("هەڵە لە دروستکردنی ڕیز");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ئایا دڵنیایت لە سڕینەوەی ئەم ڕیزە؟")) return;
    try {
      const res = await fetch("/api/admin/home-rows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setRows(rows.filter((r) => r.id !== id));
        router.refresh();
      }
    } catch {
      alert("هەڵە لە سڕینەوە");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>زیادکردنی ڕیزی نوێ</span>
        </button>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
        <div className="divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-surface-light/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-surface-light border border-border flex items-center justify-center font-bold text-xs text-text-muted">
                  {toKurdishDigits(row.order)}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{row.titleKurdish}</h4>
                  <p className="text-[11px] text-text-dim">
                    یاسا: <span className="text-accent">{row.rule}</span> • جۆر: {row.type}
                    {row.genre && ` • بەش: ${row.genre.nameKurdish}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(row.id)}
                className="p-1.5 rounded-lg bg-surface hover:bg-red-500/10 text-red-400 border border-border"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Row Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-border pb-2.5">
              زیادکردنی ڕیزی نوێ بۆ لاپەڕەی سەرەکی
            </h3>

            <form onSubmit={handleAddRow} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  ناونیشانی ڕیزەکە (بە کوردی):
                </label>
                <input
                  type="text"
                  required
                  value={titleKurdish}
                  onChange={(e) => setTitleKurdish(e.target.value)}
                  placeholder="بۆ نموونە: فیلمە کۆمیدییەکان"
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">یاسای هێنان:</label>
                  <select
                    value={rule}
                    onChange={(e) => setRule(e.target.value)}
                    className="w-full bg-surface-light border border-border rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="LATEST">نوێترینەکان (LATEST)</option>
                    <option value="MOST_VIEWED">زۆرترین بینراو (MOST_VIEWED)</option>
                    <option value="GENRE">بەپێی ژانەر (GENRE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">جۆر:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-surface-light border border-border rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="MOVIE">تەنها فیلم</option>
                    <option value="SERIES">تەنها زنجیرە</option>
                    <option value="MIXED">تێکەڵ</option>
                  </select>
                </div>
              </div>

              {rule === "GENRE" && (
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">هەڵبژاردنی ژانەر:</label>
                  <select
                    value={genreId}
                    onChange={(e) => setGenreId(e.target.value)}
                    className="w-full bg-surface-light border border-border rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="">هەڵبژاردن...</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>{g.nameKurdish}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">ڕیزبەندی (Order):</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-text-muted hover:text-white"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>دروستکردن</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
