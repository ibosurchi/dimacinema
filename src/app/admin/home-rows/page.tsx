import React from "react";
import { prisma } from "@/lib/prisma";
import { Sliders, Plus } from "lucide-react";
import AdminHomeRowsManager from "./AdminHomeRowsManager";

export const revalidate = 0;

export default async function AdminHomeRowsPage() {
  const [rows, genres] = await Promise.all([
    prisma.homeRow.findMany({
      orderBy: { order: "asc" },
      include: { genre: true },
    }),
    prisma.genre.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-black text-white">بەڕێوەبردنی ڕیزەکانی لاپەڕەی سەرەکی</h1>
        <p className="text-xs text-text-muted mt-1">
          دیاریکردنی ناو و بەش و شێوازی دەرهێنانی فیلم و زنجیرەکان لەسەر ڕووبەری لاپەڕەی سەرەکی
        </p>
      </div>

      <AdminHomeRowsManager initialRows={rows} genres={genres} />
    </div>
  );
}
