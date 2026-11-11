import React from "react";

export default function MoviesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-surface-light rounded-xl" />
          <div className="h-4 w-64 bg-surface-light/60 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-surface-light rounded-xl" />
          <div className="h-8 w-24 bg-surface-light rounded-xl" />
          <div className="h-8 w-24 bg-surface-light rounded-xl" />
        </div>
      </div>

      {/* Grid of Posters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-[2/3] w-full rounded-poster bg-surface-light/50 border border-border/40" />
            <div className="h-4 w-3/4 bg-surface-light/60 rounded" />
            <div className="h-3 w-1/2 bg-surface-light/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
