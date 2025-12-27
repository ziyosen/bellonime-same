import { getSearchData } from '@/lib/services/SearchService';

import AnimeCard from '@/components/AnimeCard';
import PaginationControls from '@/components/PaginationControls';
import { Search, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }) {
    const query = searchParams.q || '';
    return {
        title: query ? `Pencarian: ${query} - Bellonime` : 'Pencarian - Bellonime',
        description: `Hasil pencarian untuk ${query} di Bellonime`,
    };
}

type Props = {
    searchParams: { q?: string; page?: string };
};

export default async function SearchPage({ searchParams }: Props) {
    const query = searchParams.q || '';
    const page = Number(searchParams.page) || 1;

    if (!query) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                            <Search size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Mulai Pencarian
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Ketik judul anime yang ingin kamu cari di kolom pencarian.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    try {
        const response = await getSearchData(query, page);
        const searchData = response.data;
        const pagination = response.pagination;

        if (!searchData || searchData.animeList.length === 0) {
            return (
                <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-xl">
                                    <Search size={28} className="text-accent" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                        Hasil Pencarian: <span className="text-accent">{query}</span>
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        Tidak ditemukan hasil yang cocok
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Tidak Ditemukan
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                                Maaf, kami tidak dapat menemukan anime dengan kata kunci &quot;{query}&quot;. Coba gunakan kata kunci lain.
                            </p>
                        </div>
                    </div>
                </main>
            );
        }

        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-xl">
                                <Search size={28} className="text-accent" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    Hasil Pencarian: <span className="text-accent">{query}</span>
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Halaman {page}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {searchData.animeList.map((anime) => (
                                <AnimeCard key={anime.animeId} anime={anime} />
                            ))}
                        </div>
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
                    <p className="text-slate-600 dark:text-slate-400">Gagal memuat hasil pencarian.</p>
                </div>
            </div>
        );
    }
}
