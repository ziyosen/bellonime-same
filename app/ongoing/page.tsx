import { getOngoingData } from '@/lib/services';
import type { Anime } from '@/types/anime';
import AnimeCard from '@/components/AnimeCard';
import PaginationControls from '@/components/PaginationControls';
import { Play } from 'lucide-react';

export const metadata = {
  title: 'Anime Ongoing - Bellonime',
  description: 'Daftar anime yang sedang tayang.',
};

type Props = {
  searchParams: { page?: string };
};

export default async function OngoingPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;

  try {
    const response = await getOngoingData(page);
    const ongoingData = response.data;
    const pagination = response.pagination;

    if (!ongoingData || ongoingData.animeList.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tidak Ada Anime</h1>
            <p className="text-slate-600 dark:text-slate-400">Tidak ada anime ongoing yang ditemukan.</p>
          </div>
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-xl">
                <Play size={28} className="text-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Anime Ongoing
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Halaman {page}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {ongoingData.animeList.map((anime: Anime) => (
                <AnimeCard key={anime.animeId} anime={anime} />
              ))}
            </div>
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
          <p className="text-slate-600 dark:text-slate-400">Gagal memuat daftar anime ongoing.</p>
        </div>
      </div>
    );
  }
}