"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Play, 
  Server as ServerIcon, 
  Maximize, 
  Minimize, 
  AlertCircle, 
  Share2, 
  Bookmark, 
  Download, 
  Sun, 
  Moon, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw,
  Check,
  Tv,
  ListVideo
} from "lucide-react";
import BrokenReportModal from "./BrokenReportModal";
import WatchlistButton from "@/components/common/WatchlistButton";
import { toKurdishDigits } from "@/lib/kurdish";

export interface StreamServer {
  id: string;
  label: string;
  provider: string;
  url: string;
  quality?: string | null;
  subtitleNote?: string | null;
  order: number;
}

export interface PlayerEpisode {
  id: string;
  number: number;
  titleKurdish: string;
  duration?: number;
  thumbnail?: string | null;
  slug?: string;
}

interface PlayerWrapperProps {
  title: string;
  originalTitle?: string;
  backdrop: string;
  servers: StreamServer[];
  movieId?: string;
  episodeId?: string;
  seriesSlug?: string;
  currentSeasonNumber?: number;
  currentEpisodeNumber?: number;
  prevEpisodeUrl?: string;
  nextEpisodeUrl?: string;
  episodesList?: PlayerEpisode[];
  downloadLinks?: { label: string; url: string; quality: string; fileSize?: string | null }[];
}

export default function PlayerWrapper({
  title,
  originalTitle,
  backdrop,
  servers,
  movieId,
  episodeId,
  seriesSlug,
  currentSeasonNumber,
  currentEpisodeNumber,
  prevEpisodeUrl,
  nextEpisodeUrl,
  episodesList = [],
  downloadLinks = [],
}: PlayerWrapperProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isLightsOff, setIsLightsOff] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isEpisodesDrawerOpen, setIsEpisodesDrawerOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [serverTimedOut, setServerTimedOut] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Restore preferred server from localStorage if available
  useEffect(() => {
    const savedServerLabel = localStorage.getItem("dima_preferred_server");
    if (savedServerLabel && servers.length > 0) {
      const idx = servers.findIndex((s) => s.label === savedServerLabel);
      if (idx !== -1) setActiveServerIndex(idx);
    }
  }, [servers]);

  // Handle server switch
  const handleSelectServer = (idx: number) => {
    setActiveServerIndex(idx);
    setServerTimedOut(false);
    if (servers[idx]) {
      localStorage.setItem("dima_preferred_server", servers[idx].label);
    }
    // Reset timeout watcher for iframe
    resetTimeoutWatcher();
  };

  const resetTimeoutWatcher = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setServerTimedOut(false);
    timeoutRef.current = setTimeout(() => {
      setServerTimedOut(true);
    }, 12000);
  };

  const handleStartPlay = () => {
    setIsPlaying(true);
    resetTimeoutWatcher();

    // Track view count (debounced once per session)
    try {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, episodeId }),
      }).catch(() => {});
    } catch {}
  };

  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setServerTimedOut(false);
  };

  // Fullscreen container
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Share watch link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const currentServer = servers[activeServerIndex] || servers[0];

  return (
    <>
      {/* Lights Off Dim Backdrop */}
      {isLightsOff && (
        <div 
          onClick={() => setIsLightsOff(false)}
          className="fixed inset-0 bg-black/95 z-40 transition-opacity duration-500 cursor-pointer"
        />
      )}

      {/* Main Player Component Container */}
      <div 
        ref={containerRef}
        className={`relative z-30 transition-all duration-300 ${
          isTheaterMode 
            ? "w-full max-w-full px-0 sm:px-4 my-2" 
            : "w-full max-w-5xl mx-auto my-4 px-2 sm:px-0"
        } ${isLightsOff ? "!z-50" : ""}`}
      >
        {/* Outer Frame with glow */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0E0E14] border border-border shadow-card group">
          {/* Top Bar Header */}
          <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-surface border-b border-border text-xs gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <h1 className="font-extrabold text-white text-sm truncate max-w-xs sm:max-w-md">
                {title}
              </h1>
              {currentSeasonNumber && currentEpisodeNumber && (
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold text-[11px] shrink-0">
                  وەرزی {toKurdishDigits(currentSeasonNumber)} • ئەڵقەی {toKurdishDigits(currentEpisodeNumber)}
                </span>
              )}
            </div>

            {/* Quality and Subtitle notes */}
            <div className="flex items-center gap-2 text-text-dim text-[11px] ms-auto">
              {currentServer?.quality && (
                <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold">
                  {currentServer.quality}
                </span>
              )}
              {currentServer?.subtitleNote && (
                <span className="hidden sm:inline px-2 py-0.5 rounded bg-white/5 border border-white/5 text-text-muted">
                  {currentServer.subtitleNote}
                </span>
              )}
            </div>
          </div>

          {/* 16:9 Video Canvas */}
          <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
            {!isPlaying ? (
              /* Big Play Poster Shell */
              <div 
                onClick={handleStartPlay}
                className="relative w-full h-full cursor-pointer flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={backdrop || "/placeholder-backdrop.jpg"}
                  alt={title}
                  fill
                  className="object-cover brightness-60 hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

                {/* Center Play Button Badge */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-purple-glow transform group-hover:scale-110 transition-all duration-300 border-2 border-white/20">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ms-1" />
                  </div>
                  <span className="text-white font-extrabold text-sm sm:text-base drop-shadow-md bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
                    دەستپێکردنی پەخش • {currentServer?.label || "سێرڤەر ١"}
                  </span>
                </div>
              </div>
            ) : (
              /* Player Iframe */
              <div className="relative w-full h-full">
                {currentServer?.url ? (
                  <iframe
                    src={currentServer.url}
                    title={title}
                    onLoad={handleIframeLoad}
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
                    referrerPolicy="origin-when-cross-origin"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-2">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                    <p className="text-sm">هیچ بەستەرێکی پەخش بەردەست نییە بۆ ئەم سێرڤەرە</p>
                  </div>
                )}

                {/* Server Timeout Warning Box */}
                {serverTimedOut && (
                  <div className="absolute top-4 start-4 end-4 p-3 rounded-xl bg-black/90 border border-accent/40 backdrop-blur-md flex items-center justify-between text-xs z-20 animate-in fade-in">
                    <div className="flex items-center gap-2 text-accent">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>ئەم سێرڤەرە وەڵام ناداتەوە، سێرڤەرێکی تر تاقی بکەرەوە</span>
                    </div>
                    {servers.length > 1 && (
                      <button
                        onClick={() => handleSelectServer((activeServerIndex + 1) % servers.length)}
                        className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold transition-all text-[11px]"
                      >
                        سێرڤەری دواتر
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Player Controls & Server Selector Toolbar */}
          <div className="p-3 bg-surface border-t border-border flex flex-wrap items-center justify-between gap-3">
            {/* Server Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-text-dim flex items-center gap-1 me-1 shrink-0">
                <ServerIcon className="w-3.5 h-3.5 text-primary" />
                سێرڤەرەکان:
              </span>
              {servers.map((srv, idx) => (
                <button
                  key={srv.id || idx}
                  onClick={() => handleSelectServer(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeServerIndex === idx
                      ? "bg-primary text-white shadow-purple-glow"
                      : "bg-surface-light hover:bg-surface-hover text-text-muted hover:text-white border border-border"
                  }`}
                >
                  {srv.label}
                </button>
              ))}
            </div>

            {/* Quick Action Toolbar Buttons */}
            <div className="flex items-center gap-1.5 ms-auto">
              {/* Episodes List Drawer (Series only) */}
              {episodesList.length > 0 && (
                <button
                  onClick={() => setIsEpisodesDrawerOpen(!isEpisodesDrawerOpen)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                    isEpisodesDrawerOpen
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-surface-light hover:bg-surface-hover border-border text-text-muted hover:text-white"
                  }`}
                  title="لیستی ئەڵقەکان"
                >
                  <ListVideo className="w-4 h-4" />
                  <span className="hidden sm:inline">ئەڵقەکان</span>
                </button>
              )}

              {/* Theater Mode Toggle */}
              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className={`p-2 rounded-xl border transition-all ${
                  isTheaterMode
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-surface-light hover:bg-surface-hover border-border text-text-muted hover:text-white"
                }`}
                title={isTheaterMode ? "دەرچوون لە دۆخی سینەما" : "دۆخی سینەما (Theater Mode)"}
              >
                {isTheaterMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>

              {/* Lights Switch */}
              <button
                onClick={() => setIsLightsOff(!isLightsOff)}
                className={`p-2 rounded-xl border transition-all ${
                  isLightsOff
                    ? "bg-accent/20 border-accent text-accent"
                    : "bg-surface-light hover:bg-surface-hover border-border text-text-muted hover:text-white"
                }`}
                title="تاریککردنی ڕووناکی دەوروبەر"
              >
                {isLightsOff ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Report Broken Server */}
              <button
                onClick={() => setIsReportOpen(true)}
                className="p-2 rounded-xl bg-surface-light hover:bg-surface-hover border border-border text-red-400 hover:text-red-300 transition-all"
                title="سێرڤەر کار ناکات؟ ڕاپۆرت بنێرە"
              >
                <AlertCircle className="w-4 h-4" />
              </button>

              {/* Share Watch Link */}
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-surface-light hover:bg-surface-hover border border-border text-text-muted hover:text-white transition-all relative"
                title="هاوبەشکردنی بەستەر"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Watchlist Toggle */}
              <WatchlistButton
                movieId={movieId}
                episodeId={episodeId}
                className="w-8 h-8 rounded-xl"
              />
            </div>
          </div>

          {/* Series Navigation (Next / Prev Episode) */}
          {(prevEpisodeUrl || nextEpisodeUrl) && (
            <div className="px-4 py-2.5 bg-surface-light/40 border-t border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {prevEpisodeUrl ? (
                  <Link
                    href={prevEpisodeUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-hover border border-border text-text-muted hover:text-white transition-all font-semibold"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>ئەڵقەی پێشوو</span>
                  </Link>
                ) : (
                  <span className="text-text-dim text-[11px] px-2 py-1">سەرەتای زنجیرە</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="hidden sm:flex items-center gap-1.5 text-[11px] text-text-dim cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoPlayNext}
                    onChange={(e) => setAutoPlayNext(e.target.checked)}
                    className="accent-primary rounded"
                  />
                  <span>پەخشی خۆکاری ئەڵقەی دواتر</span>
                </label>

                {nextEpisodeUrl ? (
                  <Link
                    href={nextEpisodeUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white transition-all font-bold shadow-purple-glow"
                  >
                    <span>ئەڵقەی دواتر</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="text-text-dim text-[11px] px-2 py-1">کۆتایی زنجیرە</span>
                )}
              </div>
            </div>
          )}

          {/* Series Episodes Drawer Panel */}
          {isEpisodesDrawerOpen && episodesList.length > 0 && (
            <div className="p-4 bg-surface-light border-t border-border animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-primary" />
                  <span>سەرجەم ئەڵقەکانی ئەم وەرزە ({toKurdishDigits(episodesList.length)})</span>
                </h4>
                <button
                  onClick={() => setIsEpisodesDrawerOpen(false)}
                  className="text-xs text-text-muted hover:text-white"
                >
                  داخستن
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto p-1">
                {episodesList.map((ep) => {
                  const isCurrent = ep.number === currentEpisodeNumber;
                  const epUrl = `/watch/series/${seriesSlug}/s${currentSeasonNumber}e${ep.number}`;
                  return (
                    <Link
                      key={ep.id}
                      href={epUrl}
                      onClick={() => setIsEpisodesDrawerOpen(false)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? "bg-primary border-primary text-white shadow-purple-glow font-bold"
                          : "bg-surface hover:bg-surface-hover border-border text-text-muted hover:text-white text-xs"
                      }`}
                    >
                      <p className="text-xs font-extrabold">ئەڵقەی {toKurdishDigits(ep.number)}</p>
                      <p className="text-[10px] text-text-dim truncate mt-0.5">{ep.titleKurdish}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Broken Report Modal */}
      <BrokenReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        movieId={movieId}
        episodeId={episodeId}
        serverId={currentServer?.id}
        serverLabel={currentServer?.label}
      />
    </>
  );
}
