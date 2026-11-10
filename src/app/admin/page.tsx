import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { 
  Film, 
  Tv, 
  AlertTriangle, 
  Eye, 
  Users, 
  Layers, 
  Plus, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { toKurdishDigits, formatKurdishViews } from "@/lib/kurdish";

export const revalidate = 0; // Dynamic admin data

export default async function AdminDashboardPage() {
  const [
    totalMovies,
    totalSeries,
    totalEpisodes,
    totalUsers,
    pendingReports,
    recentMovies,
    recentReports,
  ] = await Promise.all([
    prisma.movie.count(),
    prisma.series.count(),
    prisma.episode.count(),
    prisma.user.count(),
    prisma.brokenReport.count({ where: { status: "PENDING" } }),
    prisma.movie.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.brokenReport.findMany({
      where: { status: "PENDING" },
      take: 5,
      include: { movie: true, episode: true, server: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Aggregate total views
  const movieViews = await prisma.movie.aggregate({ _sum: { views: true } });
  const seriesViews = await prisma.series.aggregate({ _sum: { views: true } });
  const totalViews = (movieViews._sum.views || 0) + (seriesViews._sum.views || 0);

  const stats = [
    { label: "سەرجەم فیلمەکان", value: totalMovies, icon: Film, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "سەرجەم زنجیرەکان", value: totalSeries, icon: Tv, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "سەرجەم ئەڵقەکان", value: totalEpisodes, icon: Layers, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "کۆی بینینەکان", value: formatKurdishViews(totalViews), icon: Eye, color: "text-accent", bg: "bg-accent/10", isString: true },
    { label: "ڕاپۆرتی کێشەی سێرڤەر", value: pendingReports, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "بەکارهێنەرانی تۆمارکراو", value: totalUsers, icon: Users, color: "text-sky-400", bg: "bg-sky-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">داشبۆردی بەڕێوەبەر</h1>
          <p className="text-xs text-text-muted mt-1">
            کورتەی گشتی دۆخی فیلم، زنجیرە، سێرڤەرەکان و بینەران
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/movies/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-purple-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>زیادکردنی فیلم</span>
          </Link>
          <Link
            href="/admin/series/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-light hover:bg-surface-hover border border-border text-white text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>زیادکردنی زنجیرە</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-text-dim">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">
                {s.isString ? s.value : toKurdishDigits(s.value as number)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two columns: Pending Reports & Latest Additions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Broken Reports */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>ڕاپۆرتی کێشەی بەستەرەکان ({toKurdishDigits(pendingReports)})</span>
            </h3>
            <Link href="/admin/reports" className="text-xs text-primary hover:underline font-bold">
              هەمووی ببینە
            </Link>
          </div>

          <div className="space-y-2">
            {recentReports.length === 0 ? (
              <p className="text-xs text-emerald-400 py-6 text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                سەرجەم بەستەر و سێرڤەرەکان بە تەواوی کار دەکەن!
              </p>
            ) : (
              recentReports.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-surface-light border border-border flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">
                      {r.movie?.titleKurdish || r.episode?.titleKurdish || "ناونیشانی نادیار"}
                    </p>
                    <p className="text-[11px] text-text-dim truncate">
                      تێبینی: {r.note || "کێشە لە پەخش"} {r.server && `• ${r.server.label}`}
                    </p>
                  </div>
                  <Link
                    href={`/admin/reports`}
                    className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 font-bold shrink-0 hover:bg-red-500/30 text-[11px]"
                  >
                    پشکنین
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Movies Added */}
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-primary" />
              <span>دواین فیلمە زیادکراوەکان</span>
            </h3>
            <Link href="/admin/movies" className="text-xs text-primary hover:underline font-bold">
              هەمووی ببینە
            </Link>
          </div>

          <div className="space-y-2">
            {recentMovies.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-surface-light border border-border flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{m.titleKurdish}</p>
                  <p className="text-[11px] text-text-dim truncate dir-ltr text-end">{m.titleOriginal} ({toKurdishDigits(m.year)})</p>
                </div>
                <Link
                  href={`/admin/movies/${m.id}/edit`}
                  className="px-3 py-1 rounded-lg bg-surface hover:bg-surface-hover border border-border text-text-muted hover:text-white font-semibold text-[11px]"
                >
                  دەستکاری
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
