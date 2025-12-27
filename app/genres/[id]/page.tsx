import { getGenresDetailData } from '@/lib/services';
import type { Anime } from '@/types/anime';
import AnimeCard from '@/components/AnimeCard';
import PaginationControls from '@/components/PaginationControls';
import Link from 'next/link';
import { Tags, ArrowLeft } from 'lucide-react';

type Props = {
  params: { id: string };
  searchParams: { page?: string };
};

// Fungsi untuk SEO: Mengatur judul tab browser
export async function generateMetadata({ params }: Props) {
  const genreTitle = params.id.charAt(0).toUpperCase() + params.id.slice(1).replace(/-/g, ' ');
  return {
    title: `Genre: ${genreTitle} - Bellonime`,
  };
}

export default async function GenreDetailPage({ params, searchParams }: Props) {
  const page = Number(searchParams.page) || 1;

  try {
    const response = await getGenresDetailData(params.id, page);
    const genreData = response.data;
    const pagination = response.pagination;

    if (!genreData || genreData.animeList.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tidak Ada Anime</h1>
            <p className="text-slate-600 dark:text-slate-400">Tidak ada anime untuk genre ini.</p>
            <Link
              href="/genres"
              className="inline-block mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
            >
              Kembali ke Daftar Genre
            </Link>
          </div>
        </div>
      );
    }

    const genreTitle = params.id.charAt(0).toUpperCase() + params.id.slice(1).replace(/-/g, ' ');

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-xl">
                  <Tags size={28} className="text-accent" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Genre: <span className="text-accent">{genreTitle}</span>
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Menampilkan anime dengan genre {genreTitle}
                  </p>
                </div>
              </div>

              <Link
                href="/genres"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors self-start sm:self-center"
              >
                <ArrowLeft size={16} />
                <span>Semua Genre</span>
              </Link>
            </div>
          </div>

          {/* Anime Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {genreData.animeList.map((anime: Anime) => (
                <AnimeCard key={anime.animeId} anime={anime} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              {pagination && <PaginationControls pagination={pagination} />}
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
          <p className="text-slate-600 dark:text-slate-400">Gagal memuat data genre.</p>
        </div>
      </div>
    );
  }
}