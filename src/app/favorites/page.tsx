"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { useLocalLists } from "@/hooks/useLocalLists";
import { showToast } from "@/components/Toast";
import { getMediaType } from "@/lib/tmdb";

export default function FavoritesPage() {
  const { favorites, clearFavorites, ready, exportData, importData, removeFromFavorites } =
    useLocalLists();
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const [showClear, setShowClear] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!ready) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center text-zinc-500">
        Loading...
      </div>
    );
  }

  const filtered = favorites.filter((m) => {
    if (filter === "all") return true;
    return getMediaType(m) === filter;
  });

  const moviesCount = favorites.filter((m) => getMediaType(m) === "movie").length;
  const tvCount = favorites.filter((m) => getMediaType(m) === "tv").length;

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cinesearch-lists.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported successfully");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(reader.result as string);
      showToast(ok ? "Imported successfully" : "Import failed", ok ? "success" : "error");
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-red-500">♥</span> Favorites
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {favorites.length} title{favorites.length !== 1 ? "s" : ""} saved on this device
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fileRef.current?.click()}
            className="text-sm px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            Import
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button
            onClick={handleExport}
            className="text-sm px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            Export
          </button>
          {favorites.length > 0 && (
            <button
              onClick={() => setShowClear(true)}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[
          { id: "all", label: `All ${favorites.length}` },
          { id: "movie", label: `Movies ${moviesCount}` },
          { id: "tv", label: `TV Shows ${tvCount}` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              filter === f.id
                ? "bg-white text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4 opacity-30">♥</div>
          <h2 className="text-xl font-semibold text-zinc-300 mb-2">No favorites yet</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Heart the movies and shows you love — they&apos;ll be stored on this device.
          </p>
          <Link
            href="/discover"
            className="inline-block px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium"
          >
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="relative">
              <MovieCard item={item} />
              <button
                onClick={() => {
                  removeFromFavorites(item.id);
                  showToast("Removed from favorites");
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white text-xs hover:bg-red-600 z-10"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {showClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Clear your favorites?</h3>
            <p className="text-sm text-zinc-400 mb-6">
              This removes all {favorites.length} titles. This can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClear(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearFavorites();
                  setShowClear(false);
                  showToast("Cleared your favorites");
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
