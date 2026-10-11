import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getMoviesData } from '@/lib/services';
import PaginationControls from '@/components/PaginationControls';

export const metadata = {
  title: 'Movies',
  description: 'Daftar film anime yang tersedia.',
};

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  let movies: Awaited<ReturnType<typeof getMoviesData>> | null = null;
  try {
    movies = await getMoviesData(page);
  } catch {
    movies = null;
  }

  const animeList = movies?.data?.animeList || [];
  const pagination = movies?.pagination;

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 pt-[84px] text-white md:pb-12 md:pt-24">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Movies</h1>

        {animeList.length ? (
          <>
            <div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {animeList.map((anime) => (
                <Link key={anime.animeId} href={`/anime/${anime.animeId}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.06]">
                    {anime.poster ? (
                      <Image src={anime.poster} alt={anime.title} fill sizes="180px" className="object-cover transition duration-300 group-hover:scale-105" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400">Tidak ada poster</div>
                    )}
                    <span className="absolute left-2 top-2 rounded-full bg-violet-500 px-2 py-1 text-[10px] font-extrabold text-white">Movie</span>
                  </div>
                  <h2 className="mt-2.5 line-clamp-2 h-[38px] overflow-hidden text-[13px] font-semibold leading-[1.45] text-slate-100">{anime.title}</h2>
                  {anime.status ? <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{anime.status}</p> : null}
                </Link>
              ))}
            </div>
            {pagination ? (
              <div className="mt-8">
                <Suspense fallback={null}>
                  <PaginationControls pagination={pagination} />
                </Suspense>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-10 rounded-2xl bg-white/[0.05] px-5 py-6 text-sm text-slate-300">
            Daftar film lagi kosong dari sumbernya. Coba lagi sebentar ya.
          </p>
        )}
      </div>
    </main>
  );
}
