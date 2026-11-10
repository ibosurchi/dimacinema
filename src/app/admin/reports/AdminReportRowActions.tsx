"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2, Loader2 } from "lucide-react";

export default function AdminReportRowActions({
  reportId,
  currentStatus,
}: {
  reportId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleFixed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reportId,
          status: currentStatus === "FIXED" ? "PENDING" : "FIXED",
        }),
      });
      if (res.ok) router.refresh();
    } catch {
      alert("هەڵە لە گۆڕینی دۆخ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("ئایا دڵنیایت لە سڕینەوەی ئەم ڕاپۆرتە؟")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportId }),
      });
      if (res.ok) router.refresh();
    } catch {
      alert("هەڵە لە سڕینەوە");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={toggleFixed}
        disabled={loading}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
          currentStatus === "FIXED"
            ? "bg-surface hover:bg-surface-light border-border text-text-muted"
            : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30"
        }`}
        title="نیشانەکردن وەک چارەسەرکراو"
      >
        <Check className="w-3.5 h-3.5" />
        <span>{currentStatus === "FIXED" ? "گەڕاندنەوە" : "چارەسەرکرا"}</span>
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1 rounded-lg bg-surface hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-border"
        title="سڕینەوە"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
