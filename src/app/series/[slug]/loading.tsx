import React from "react";

export default function SeriesDetailLoading() {
  return (
    <div className="w-full pb-16 animate-pulse">
      {/* Header Backdrop Skeleton */}
      <div className="relative w-full min-h-[460px] bg-surface-light/30 border-b border-border/40 flex items-end">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="w-56 sm:w-64 aspect-[2/3] shrink-0 rounded-poster bg-surface-light/60 border border-border" />
          <div className="flex-1 space-y-4 w-full">
            <div className="h-8 w-2/3 bg-surface-light rounded-xl" />
            <div className="h-5 w-1/3 bg-surface-light/60 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-surface-light/50 rounded-full" />
              <div className="h-6 w-16 bg-surface-light/50 rounded-full" />
            </div>
            <div className="h-16 w-full bg-surface-light/40 rounded-xl" />
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-36 bg-primary/40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-6 w-36 bg-surface-light rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-surface-light/40 rounded-poster border border-border/30" />
          ))}
        </div>
      </div>
    </div>
  );
}
