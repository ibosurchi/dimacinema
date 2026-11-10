import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/common/MovieCard";
import { User, Bookmark, History, Settings, Film, Tv } from "lucide-react";
import { toKurdishDigits } from "@/lib/kurdish";

interface ProfilePageProps {
  searchParams: { tab?: string };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/profile");
  }

  const userId = (session.user as any).id;
  const currentTab = searchParams.tab || "watchlist";

  // Fetch Watchlist
  const watchlist = await prisma.watchlist.findMany({
    where: { userId },
    include: {
      movie: true,
      series: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const watchlistItems = watchlist.map((w) => {
    if (w.movie) return { ...w.movie, type: "movie" as const };
    if (w.series) return { ...w.series, type: "series" as const };
    return null;
  }).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-black text-2xl uppercase shadow-purple-glow">
          {session.user.name?.charAt(0) || "D"}
        </div>
        <div className="text-center sm:text-right space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">{session.user.name}</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/20 text-primary border border-primary/30">
              {(session.user as any).role === "ADMIN" ? "بەڕێوەبەر (ADMIN)" : "ئەندام"}
            </span>
          </div>
          <p className="text-xs text-text-dim">{session.user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-8 text-xs font-bold">
        <a
          href="/profile?tab=watchlist"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            currentTab === "watchlist"
              ? "bg-primary text-white shadow-purple-glow"
              : "bg-surface hover:bg-surface-light border border-border text-text-muted hover:text-white"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>لیستی دڵخوازەکان ({toKurdishDigits(watchlistItems.length)})</span>
        </a>
      </div>

      {/* Watchlist Tab Content */}
      {currentTab === "watchlist" && (
        <div>
          {watchlistItems.length === 0 ? (
            <div className="py-20 text-center bg-surface border border-border rounded-2xl p-8">
              <Bookmark className="w-12 h-12 text-accent mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-white mb-1">لیستی دڵخوازەکانت بەتاڵە</h3>
              <p className="text-xs text-text-dim">
                دەتوانیت لە کاتی سەیرکردنی فیلم یان زنجیرە، نیشانەی دڵخواز (Bookmark) دابگریت تا لێرە پاشەکەوت بکرێت.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {watchlistItems.map((item: any) => (
                <MovieCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
