"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface WatchlistButtonProps {
  movieId?: string;
  seriesId?: string;
  episodeId?: string;
  initialSaved?: boolean;
  className?: string;
}

export default function WatchlistButton({
  movieId,
  seriesId,
  episodeId,
  initialSaved = false,
  className = "",
}: WatchlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, seriesId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    } catch (err) {
      console.error("Watchlist toggle failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`p-2 rounded-xl transition-all flex items-center justify-center ${
        saved
          ? "bg-accent text-black font-bold shadow-gold-glow"
          : "bg-surface/80 hover:bg-surface-light text-text-muted hover:text-white border border-border"
      } ${className}`}
      title={saved ? "لابردن لە دڵخوازەکان" : "زیادکردن بۆ دڵخوازەکان"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className={`w-4 h-4 ${saved ? "fill-black" : ""}`} />
      )}
    </button>
  );
}
