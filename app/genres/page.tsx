import { getGenresData } from '@/lib/services';
import Link from 'next/link';
import { Tags } from 'lucide-react';
import type { Genres } from '@/types/anime';

// Fungsi untuk SEO
export const metadata = {
  title: 'Daftar Genre - Bellonime',
  description: 'Jelajahi semua genre anime yang tersedia.',
};

// Komponen Halaman
export default async function GenresPage() {
  let genresData: Genres;

  try {
    const response = await getGenresData();
    genresData = response.data;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h1>
          <p className="text-slate-600 dark:text-slate-400">Gagal memuat daftar genre.</p>
        </div>
      </div>
    );
  }

  if (!genresData || genresData.genreList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tidak Ada Genre</h1>
          <p className="text-slate-600 dark:text-slate-400">Tidak ada genre yang ditemukan.</p>
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
              <Tags size={28} className="text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Daftar Genre
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {genresData.genreList.length} genre tersedia
              </p>
            </div>
          </div>
        </div>

        {/* Genre Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {genresData.genreList.map((genre) => (
              <Link
                key={genre.genreId}
                href={`/genres/${genre.genreId}`}
                className="block p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-medium text-slate-700 dark:text-slate-300 hover:bg-accent hover:text-white hover:border-accent dark:hover:bg-accent transition-all duration-200"
              >
                {genre.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}