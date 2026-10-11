import Image from 'next/image';
import Link from 'next/link';
import AnimeCard from '@/components/AnimeCard';
import { getCompletedData, getMoviesData, getOngoingData, getPopularData, getScheduleData } from '@/lib/services';

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-[22px] font-semibold leading-tight tracking-tight text-white sm:text-[26px]">{title}</h2>
      <Link href={href} className="shrink-0 text-sm font-semibold text-orange-400 hover:text-orange-300">
        Lihat Semua &gt;
      </Link>
    </div>
  );
}

export default async function AnimeHomeSections() {
  const [popularResult, completedResult, scheduleResult, ongoingResult, moviesResult] = await Promise.allSettled([
    getPopularData(1),
    getCompletedData(1),
    getScheduleData(),
    getOngoingData(1),
    getMoviesData(1),
  ]);

  const popular = popularResult.status === 'fulfilled' ? popularResult.value.data.animeList.slice(0, 12) : [];
  const completed = completedResult.status === 'fulfilled' ? completedResult.value.data.animeList.slice(0, 12) : [];
  const ongoing = ongoingResult.status === 'fulfilled' ? ongoingResult.value.data.animeList.slice(0, 12) : [];
  const movies = moviesResult.status === 'fulfilled' ? moviesResult.value.data.animeList.slice(0, 12) : [];
  const scheduleDays = scheduleResult.status === 'fulfilled' ? scheduleResult.value.days : [];

  return (
    <>
      {popular.length ? (
        <section className="mt-10">
          <SectionHeader title="Terpopuler" href="/popular" />
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {popular.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>
      ) : null}

      {ongoing.length ? (
        <section className="mt-10">
          <SectionHeader title="Sedang Tayang" href="/ongoing" />
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {ongoing.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>
      ) : null}

      {completed.length ? (
        <section className="mt-10">
          <SectionHeader title="Complete / Tamat" href="/completed" />
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {completed.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>
      ) : null}

      {movies.length ? (
        <section className="mt-10">
          <SectionHeader title="Movies" href="/movies" />
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {movies.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} />
            ))}
          </div>
        </section>
      ) : null}

      {scheduleDays.length ? (
        <section className="mt-10">
          <SectionHeader title="Jadwal Rilis" href="/jadwal" />
          <div className="space-y-5">
            {scheduleDays.map((day) => (
              <div key={day.day}>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-orange-300">{day.day}</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {day.animeList.slice(0, 12).map((anime) => (
                    <Link key={anime.animeId} href={`/anime/${anime.animeId}`} className="group w-[104px] shrink-0">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-800">
                        {anime.poster ? (
                          <Image src={anime.poster} alt={anime.title} fill className="object-cover transition duration-300 group-hover:scale-105" unoptimized />
                        ) : null}
                        {anime.estimation ? (
                          <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                            {anime.estimation}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 line-clamp-2 break-words text-xs font-medium leading-snug text-slate-100">{anime.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
