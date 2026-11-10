"use client";

import React, { useState, useEffect, useRef } from "react";
import { toKurdishDigits } from "@/lib/kurdish";
import { Loader2 } from "lucide-react";

interface ReactionButtonProps {
  movieId?: string;
  seriesId?: string;
  initialCount?: number;
  className?: string;
}

const EMOJIS = [
  { emoji: "❤️", label: "دڵ" },
  { emoji: "🔥", label: "بەهێز" },
  { emoji: "😍", label: "سەرنجڕاکێش" },
  { emoji: "👏", label: "بێ وێنە" },
  { emoji: "🍿", label: "سینەمایی" },
];

export default function ReactionButton({
  movieId,
  seriesId,
  initialCount = 0,
  className = "",
}: ReactionButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const pickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load client token from localStorage for guest reaction persistence
  const getClientToken = () => {
    let token = localStorage.getItem("dima_client_reaction_token");
    if (!token) {
      token = "user_" + Math.random().toString(36).substring(2) + Date.now();
      localStorage.setItem("dima_client_reaction_token", token);
    }
    return token;
  };

  useEffect(() => {
    const saved = localStorage.getItem(`dima_reacted_${movieId || seriesId}`);
    if (saved) {
      setActiveEmoji(saved);
    }
  }, [movieId, seriesId]);

  const handleSelectEmoji = async (emoji: string) => {
    setShowPicker(false);
    setLoading(true);

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          seriesId,
          emoji,
          clientToken: getClientToken(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
        if (data.active) {
          setActiveEmoji(data.emoji);
          localStorage.setItem(`dima_reacted_${movieId || seriesId}`, data.emoji);
        } else {
          setActiveEmoji(null);
          localStorage.removeItem(`dima_reacted_${movieId || seriesId}`);
        }
      }
    } catch (err) {
      console.error("Failed to react:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    if (pickerTimeoutRef.current) clearTimeout(pickerTimeoutRef.current);
    setShowPicker(true);
  };

  const handleMouseLeave = () => {
    pickerTimeoutRef.current = setTimeout(() => {
      setShowPicker(false);
    }, 400);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Emoji Picker */}
      {showPicker && (
        <div className="absolute bottom-full mb-2 start-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-2 bg-[#1A1A26] border border-border/80 rounded-2xl shadow-card backdrop-blur-xl animate-in zoom-in-95 duration-150">
          {EMOJIS.map((item) => (
            <button
              key={item.emoji}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectEmoji(item.emoji);
              }}
              className="text-lg hover:scale-135 transform transition-transform duration-150 p-1 rounded-xl hover:bg-white/10 active:scale-95"
              title={item.label}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      )}

      {/* Main Like Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSelectEmoji(activeEmoji || "❤️");
        }}
        disabled={loading}
        className={`flex items-center gap-2 px-3.5 py-3 rounded-btn border transition-all text-xs font-bold ${
          activeEmoji
            ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
            : "bg-surface-light/80 hover:bg-surface-hover border-border text-text-muted hover:text-white"
        } ${className}`}
        title="ڵایک کردن و کاردانەوە"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        ) : (
          <span className="text-base leading-none transform transition-transform group-hover:scale-110">
            {activeEmoji || "❤️"}
          </span>
        )}
        <span className="font-extrabold text-white text-xs">
          {toKurdishDigits(count)}
        </span>
      </button>
    </div>
  );
}
