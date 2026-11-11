import React from "react";

export default function RootLoading() {
  return (
    <div className="w-full min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      {/* Hero Banner Skeleton */}
      <div className="w-full h-64 sm:h-96 rounded-2xl bg-surface-light/40 border border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Row Title Skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-6 rounded-full bg-primary/60" />
        <div className="h-6 w-40 bg-surface-light rounded-lg" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-[2/3] w-full rounded-poster bg-surface-light/50 border border-border/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="h-4 w-3/4 bg-surface-light/60 rounded" />
            <div className="h-3 w-1/2 bg-surface-light/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
