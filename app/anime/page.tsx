import { getAnimeListData } from "@/lib/services";
import Link from 'next/link';
import LetterNav from "@/components/anime-list/LetterNav";
import { List } from 'lucide-react';

export const metadata = {
  title: 'Daftar Semua Anime',
  description: 'Cari semua judul anime favoritmu berdasarkan abjad.',
};

export default async function DaftarAnimePage() {
  let animeData;
  try {
    animeData = await getAnimeListData();
  } catch (error) {
    console.error(error);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Gagal Memuat Daftar Anime
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Silakan coba lagi nanti.</p>
        </div>
      </div>
    );
  }

  if (!animeData?.list?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Daftar Anime Kosong</h1>
          <p className="text-slate-600 dark:text-slate-400">Tidak ada anime yang ditemukan.</p>
        </div>
      </div>
    );
  }

  const availableLetters = animeData.list.map((g) => g.startWith);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-xl">
              <List size={28} className="text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Daftar Semua Anime
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {animeData.list.length} kategori abjad
              </p>
            </div>
          </div>
        </div>

        {/* Letter Navigation */}
        <div className="sticky top-0 md:top-16 z-20 bg-slate-50 dark:bg-slate-950">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
            <LetterNav letters={availableLetters} />
          </div>
        </div>

        {/* Anime List Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-12">
            {animeData.list.map((group) => (
              <section
                key={group.startWith}
                id={group.startWith}
                className="scroll-mt-32"
              >
                <h2 className="text-3xl font-bold text-accent border-b-2 border-accent/30 pb-2 mb-6">
                  {group.startWith}
                </h2>

                <ul className="columns-2 md:columns-3 lg:columns-4 gap-x-6">
                  {group.animeList.map((anime) => (
                    <li
                      key={anime.animeId}
                      className="mb-2 break-inside-avoid"
                    >
                      <Link
                        href={`/anime/${anime.animeId}`}
                        className="text-slate-700 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors font-medium"
                      >
                        {anime.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
