import { getMoviesData } from '@/lib/services';
import type { Anime } from '@/types/anime';
import AnimeCard from '@/components/AnimeCard';
import PaginationControls from '@/components/PaginationControls';
import { Film } from 'lucide-react';
import { Suspense } from 'react';

// Fungsi untuk SEO
export const metadata = {
  title: 'Daftar Film - Bellonime',
  description: 'Jelajahi semua film anime yang tersedia.',
};

// Komponen Halaman
export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  try {
    const response = await getMoviesData(page);
    const moviesData = response.data;
    const pagination = response.pagination;

    if (!moviesData || moviesData.animeList.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tidak Ada Film</h1>
            <p className="text-slate-600 dark:text-slate-400">Tidak ada film yang ditemukan.</p>
          </div>
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-xl">
                <Film size={28} className="text-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Semua Film
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Halaman {page}
                </p>
              </div>
            </div>
          </div>

          {/* Movies Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {moviesData.animeList.map((anime: Anime) => (
                <AnimeCard key={anime.animeId} anime={anime} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              {pagination && (
                <Suspense fallback={null}>
                  <PaginationControls pagination={pagination} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h1>
          <p className="text-slate-600 dark:text-slate-400">Gagal memuat daftar film.</p>
        </div>
      </div>
    );
  }
}