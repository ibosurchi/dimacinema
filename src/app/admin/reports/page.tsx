import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";
import AdminReportRowActions from "./AdminReportRowActions";

export const revalidate = 0;

export default async function AdminReportsPage() {
  const reports = await prisma.brokenReport.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      movie: true,
      episode: {
        include: { series: true },
      },
      server: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-black text-white">ڕاپۆرتی کێشەی سێرڤەرەکان</h1>
        <p className="text-xs text-text-muted mt-1">
          سەرجەم ئەو کێشانەی کە لەلایەن بەکارهێنەرانەوە ڕاپۆرتکراون ({toKurdishDigits(reports.length)} ڕاپۆرت)
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-text-muted space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">هیچ کێشەیەکی سێرڤەر تۆمار نەکراوە</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-surface-light border-b border-border text-text-muted font-bold">
                <tr>
                  <th className="p-4">فیلم / ئەڵقە</th>
                  <th className="p-4">سێرڤەر</th>
                  <th className="p-4">تێبینی بینەر</th>
                  <th className="p-4">بەروار</th>
                  <th className="p-4">دۆخ</th>
                  <th className="p-4 text-center">کردارەکان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((r) => {
                  const title = r.movie
                    ? r.movie.titleKurdish
                    : r.episode
                    ? `${r.episode.series?.titleKurdish} - ${r.episode.titleKurdish}`
                    : "نادیار";

                  const watchUrl = r.movie
                    ? `/watch/movie/${r.movie.slug}`
                    : r.episode && r.episode.series
                    ? `/series/${r.episode.series.slug}`
                    : "#";

                  return (
                    <tr key={r.id} className="hover:bg-surface-light/40 transition-colors">
                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <Link href={watchUrl} target="_blank" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span>{title}</span>
                            <ExternalLink className="w-3 h-3 text-text-dim" />
                          </Link>
                        </div>
                      </td>
                      <td className="p-4 text-text-muted">
                        {r.server?.label || "گشتی"}
                      </td>
                      <td className="p-4 text-text-dim max-w-xs truncate">
                        {r.note || "کێشە لە بەستەر"}
                      </td>
                      <td className="p-4 text-text-dim">
                        {new Date(r.createdAt).toLocaleDateString("ckb", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === "FIXED"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {r.status === "FIXED" ? "چارەسەرکراوە" : "چاوەڕوانە"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <AdminReportRowActions reportId={r.id} currentStatus={r.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
