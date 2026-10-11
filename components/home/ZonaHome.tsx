import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Play, Star } from 'lucide-react';
import { fetchUnifiedLatest, type UnifiedItem } from '@/lib/unified';
import { getCompletedData, getGenresData, getMoviesData, getOngoingData, getPopularData, getScheduleData } from '@/lib/services';
import type { Anime } from '@/types/anime';

function RowCard({ item }: { item: { title: string; poster: string; href: string; score?: string; meta?: string; episodes?: string } }) {
  const episodeLabel = item.episodes
    ? `Ep ${item.episodes}`
    : item.meta && /ep(isode)?\s*\d+/i.test(item.meta)
      ? item.meta
      : '';
  return (
    <Link href={item.href} className="group w-[118px] shrink-0 sm:w-[136px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.06]">
        {item.poster ? (
          <Image src={item.poster} alt={item.title} fill sizes="136px" className="object-cover transition duration-300 group-hover:scale-105" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400">Tidak ada poster</div>
        )}
        {item.score ? (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold text-amber-300">
            <Star size={10} fill="currentColor" /> {item.score}
          </span>
        ) : null}
        {episodeLabel ? (
          <span className="absolute bottom-2 left-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-extrabold text-white">{episodeLabel}</span>
        ) : null}
      </div>
      <h3 className="mt-2.5 line-clamp-2 h-[38px] overflow-hidden text-[13px] font-semibold leading-[1.45] text-slate-100">{item.title}</h3>
      {item.meta ? <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{item.meta}</p> : null}
    </Link>
  );
}

function Row({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">{title}</h2>
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-orange-300 hover:text-orange-200">
          Semua <ChevronRight size={14} />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto px-0.5 pb-5 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </section>
  );
}

function toItem(anime: Anime) {
  const meta = [anime.type, anime.status].filter(Boolean).join(' • ');
  return {
    title: anime.title,
    poster: anime.poster,
    href: `/anime/${anime.animeId}`,
    score: typeof anime.score === 'string' ? anime.score : '',
    meta,
    episodes: anime.episodes ? String(anime.episodes) : '',
  };
}

export default async function ZonaHome() {
  const [latest, popularResult, ongoingResult, completedResult, moviesResult, scheduleResult, genresResult] = await Promise.allSettled([
    fetchUnifiedLatest(),
    getPopularData(1),
    getOngoingData(1),
    getCompletedData(1),
    getMoviesData(1),
    getScheduleData(),
    getGenresData(),
  ]);

  const latestItems: UnifiedItem[] = latest.status === 'fulfilled'
    ? latest.value.filter((item) => item.href.startsWith('/anime/'))
    : [];
  const hero = latestItems[0];
  const popular = popularResult.status === 'fulfilled' ? popularResult.value.data.animeList.slice(0, 14).map(toItem) : [];
  const ongoing = ongoingResult.status === 'fulfilled' ? ongoingResult.value.data.animeList.slice(0, 14).map(toItem) : [];
  const completed = completedResult.status === 'fulfilled' ? completedResult.value.data.animeList.slice(0, 14).map(toItem) : [];
  const movies = moviesResult.status === 'fulfilled' ? moviesResult.value.data.animeList.slice(0, 14).map(toItem) : [];
  const scheduleDays = scheduleResult.status === 'fulfilled'
    ? scheduleResult.value.days.filter((day) => day.animeList.length > 0).slice(0, 7)
    : [];
  const genres = genresResult.status === 'fulfilled' ? genresResult.value.data.genreList : [];

  return (
    <>
      {hero ? (
        <section className="relative -mx-3 overflow-hidden sm:-mx-6 lg:-mx-8">
          <div className="relative min-h-[430px] sm:min-h-[420px]">
            {hero.poster ? (
              <Image src={hero.poster} alt={hero.title} fill priority sizes="100vw" className="object-cover object-top opacity-60" unoptimized />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1500px] px-3 pb-6 pt-24 sm:px-6 lg:px-8">
              <span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">New Update</span>
              <h1 className="mt-3 max-w-2xl text-[27px] font-black leading-[1.15] text-white sm:text-5xl sm:leading-tight">{hero.title}</h1>
              <p className="mt-2 text-sm text-slate-300">{hero.meta || 'Anime terbaru hari ini'}</p>
              <Link href={hero.href} className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400">
                <Play size={17} fill="currentColor" /> Tonton Sekarang
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {genres.length ? (
        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">Genre</h2>
            <Link href="/genres" className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-orange-300 hover:text-orange-200">
              Semua <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {genres.map((genre) => (
              <Link
                key={genre.genreId}
                href={`/genres/${genre.genreId}`}
                className="shrink-0 rounded-full bg-white/[0.06] px-4 py-2.5 text-[12px] font-semibold text-slate-200 transition hover:bg-orange-500 hover:text-white"
              >
                {genre.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {latestItems.length ? (
        <Row title="Terbaru" href="/terbaru">
          {latestItems.slice(0, 18).map((item) => (
            <RowCard key={item.key} item={{ title: item.title, poster: item.poster, href: item.href, score: item.score, meta: item.episodes || item.meta }} />
          ))}
        </Row>
      ) : null}

      {popular.length ? <Row title="Terpopuler" href="/popular">{popular.map((item) => <RowCard key={item.href} item={item} />)}</Row> : null}
      {ongoing.length ? <Row title="Sedang Tayang" href="/ongoing">{ongoing.map((item) => <RowCard key={item.href} item={item} />)}</Row> : null}
      {completed.length ? <Row title="Complete / Tamat" href="/completed">{completed.map((item) => <RowCard key={item.href} item={item} />)}</Row> : null}
      {movies.length ? <Row title="Movies" href="/movies">{movies.map((item) => <RowCard key={item.href} item={item} />)}</Row> : null}

      {scheduleDays.length ? (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">Jadwal Rilis</h2>
            <Link href="/jadwal" className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-orange-300 hover:text-orange-200">
              Semua <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {scheduleDays.map((day) => (
              <Link key={day.day} href="/jadwal" className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.05] px-4 py-3 transition hover:bg-white/[0.08]">
                <span className="w-24 shrink-0 text-sm font-extrabold capitalize text-white">{day.day}</span>
                <span className="line-clamp-1 flex-1 text-[13px] text-slate-300">
                  {day.animeList.slice(0, 4).map((anime) => anime.title).join(' • ')}
                </span>
                <ChevronRight size={16} className="shrink-0 text-slate-500" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
