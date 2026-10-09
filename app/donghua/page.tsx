'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Play, Star, ChevronRight } from 'lucide-react';
import {
  fetchDonghuaHome,
  fetchDonghuaList,
  fetchDonghuaGenres,
  fetchDonghuaSchedule,
  fetchDonghuaDetail,
  type DonghuaCard,
} from '@/lib/donghua';
import staticPosterMap from '@/lib/donghua-posters.json';

function Card({ item }: { item: DonghuaCard }) {
  return (
    <Link href={`/donghua/${item.slug}`} className="group w-[118px] shrink-0 sm:w-[136px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.06]">
        {item.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.poster} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-900 via-slate-900 to-slate-950 px-3 text-center">
            <span className="text-[13px] font-extrabold leading-snug text-slate-200">{item.title}</span>
          </div>
        )}
        {item.episodeLabel ? (
          <span className="absolute bottom-2 left-2 rounded-full bg-sky-500 px-2 py-1 text-[10px] font-extrabold text-white">{item.episodeLabel}</span>
        ) : null}
      </div>
      <h3 className="mt-2.5 line-clamp-2 h-[38px] overflow-hidden text-[13px] font-semibold leading-[1.45] text-slate-100">{item.title}</h3>
      <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{[item.type, item.status].filter(Boolean).join(' • ')}</p>
    </Link>
  );
}

function Row({ title, items }: { title: string; items: DonghuaCard[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto px-0.5 pb-5 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.slice(0, 18).map((item) => (
          <Card key={`${title}-${item.slug}`} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function DonghuaPage() {
  const [latest, setLatest] = useState<DonghuaCard[]>([]);
  const [latestList, setLatestList] = useState<DonghuaCard[]>([]);
  const [ongoing, setOngoing] = useState<DonghuaCard[]>([]);
  const [completed, setCompleted] = useState<DonghuaCard[]>([]);
  const [genres, setGenres] = useState<{ name: string; slug: string }[]>([]);
  const [schedule, setSchedule] = useState<{ day: string; list: DonghuaCard[] }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [home, on, genresData, scheduleData, latestData] = await Promise.allSettled([
          fetchDonghuaHome(1),
          fetchDonghuaList('ongoing', 1),
          fetchDonghuaGenres(),
          fetchDonghuaSchedule(),
          fetchDonghuaList('latest', 1),
        ]);
        if (!alive) return;
        if (home.status === 'fulfilled') {
          setLatest(home.value.latest);
          setCompleted(home.value.completed);
        }
        if (on.status === 'fulfilled') setOngoing(on.value);
        if (genresData.status === 'fulfilled') setGenres(genresData.value);
        if (scheduleData.status === 'fulfilled') setSchedule(scheduleData.value);
        if (latestData.status === 'fulfilled') setLatestList(latestData.value);
        if (home.status === 'rejected' && on.status === 'rejected') {
          setError('Sumber Donghua belum bisa diambil saat ini. Coba lagi sebentar ya.');
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const hero = latest[0];

  const posterMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of [...latest, ...latestList, ...ongoing, ...completed]) {
      if (item.slug && item.poster && !map.has(item.slug)) map.set(item.slug, item.poster);
    }
    return map;
  }, [latest, latestList, ongoing, completed]);

  const [posterOverrides, setPosterOverrides] = useState<Record<string, string>>({});

  const withPoster = (item: DonghuaCard): DonghuaCard =>
    item.poster
      ? item
      : {
          ...item,
          poster:
            posterMap.get(item.slug) ||
            posterOverrides[item.slug] ||
            (staticPosterMap as Record<string, string>)[item.slug] ||
            '',
        };

  useEffect(() => {
    if (!schedule.length) return;
    const missing: string[] = [];
    for (const day of schedule) {
      for (const item of day.list) {
        if (!item.poster && !posterMap.get(item.slug) && !missing.includes(item.slug)) {
          missing.push(item.slug);
        }
      }
    }
    if (!missing.length) return;

    let cache: Record<string, { p: string; at: number }> = {};
    try {
      cache = JSON.parse(localStorage.getItem('donghua-poster-cache') || '{}');
    } catch {
      cache = {};
    }
    const now = Date.now();
    const fresh: Record<string, string> = {};
    const toFetch: string[] = [];
    for (const slug of missing.slice(0, 40)) {
      const hit = cache[slug];
      if (hit && now - hit.at < 24 * 60 * 60 * 1000 && hit.p) fresh[slug] = hit.p;
      else toFetch.push(slug);
    }
    if (Object.keys(fresh).length) setPosterOverrides((prev) => ({ ...prev, ...fresh }));
    if (!toFetch.length) return;

    let alive = true;
    (async () => {
      let idx = 0;
      const worker = async () => {
        while (idx < toFetch.length) {
          const slug = toFetch[idx++];
          try {
            const detail = await fetchDonghuaDetail(slug);
            if (!alive) return;
            if (detail.poster) {
              cache[slug] = { p: detail.poster, at: Date.now() };
              setPosterOverrides((prev) => ({ ...prev, [slug]: detail.poster }));
            }
          } catch {
            // Sumber tidak menjawab; biarkan placeholder.
          }
        }
      };
      await Promise.all([worker(), worker()]);
      try {
        localStorage.setItem('donghua-poster-cache', JSON.stringify(cache));
      } catch {
        // Penyimpanan penuh/diabaikan saja.
      }
    })();
    return () => {
      alive = false;
    };
  }, [schedule, posterMap]);

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-7xl px-3 pt-0 sm:px-6 md:pt-16 lg:px-8">
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center pt-24 text-sm text-slate-400">Memuat Donghua...</div>
        ) : error ? (
          <div className="mx-auto mt-24 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">{error}</div>
        ) : (
          <>
            {hero ? (
              <section className="relative -mx-3 overflow-hidden sm:-mx-6 lg:-mx-8">
                <div className="relative min-h-[430px] sm:min-h-[420px]">
                  {hero.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={hero.poster} alt={hero.title} className="absolute inset-0 h-full w-full object-cover object-top opacity-60" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-3 pb-6 pt-24 sm:px-6 lg:px-8">
                    <span className="rounded-full bg-sky-500 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">Donghua Terbaru</span>
                    <h1 className="mt-3 max-w-2xl text-[27px] font-black leading-[1.15] text-white sm:text-5xl sm:leading-tight">{hero.title}</h1>
                    <p className="mt-2 text-sm text-slate-300">{hero.episodeLabel ? `${hero.episodeLabel} baru saja rilis` : 'Donghua terbaru hari ini'}</p>
                    <Link href={`/donghua/${hero.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400">
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
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {genres.map((genre) => (
                    <Link
                      key={genre.slug}
                      href={`/donghua/genre/${genre.slug}`}
                      className="shrink-0 rounded-full bg-white/[0.06] px-4 py-2.5 text-[12px] font-semibold text-slate-200 transition hover:bg-sky-500 hover:text-white"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <form action="donghua/search" method="get" className="mt-7 hidden gap-2 md:flex">
              <input
                name="q"
                type="search"
                placeholder="Cari donghua..."
                className="h-12 flex-1 rounded-full bg-white/[0.06] px-5 text-sm text-white placeholder:text-slate-400 outline-none ring-sky-500 focus:ring-2"
              />
              <button type="submit" className="h-12 rounded-full bg-sky-500 px-5 text-sm font-extrabold text-white transition hover:bg-sky-400">
                Cari
              </button>
            </form>

            <section className="mt-7">
              <h2 className="mb-4 text-lg font-extrabold tracking-tight text-white sm:text-xl">Per Tahun</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {['2026', '2025', '2024', '2023', '2022', '2021', '2020'].map((year) => (
                  <Link
                    key={year}
                    href={`/donghua/season/${year}`}
                    className="shrink-0 rounded-full bg-white/[0.06] px-4 py-2.5 text-[12px] font-semibold text-slate-200 transition hover:bg-sky-500 hover:text-white"
                  >
                    {year}
                  </Link>
                ))}
              </div>
            </section>

            <Row title="Terbaru" items={latest} />
            <Row title="Sedang Tayang" items={ongoing} />
            <Row title="Complete / Tamat" items={completed} />

            {schedule.length ? (
              <section className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">Jadwal Rilis</h2>
                </div>
                <div className="space-y-5">
                  {schedule.map((day) => (
                    <div key={day.day}>
                      <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-sky-300">{day.day}</h3>
                      <div className="flex gap-4 overflow-x-auto px-0.5 pb-4 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {day.list.slice(0, 12).map((item) => (
                          <Card key={`${day.day}-${item.slug}`} item={withPoster(item)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-10">
              <h2 className="mb-4 text-lg font-extrabold tracking-tight text-white sm:text-xl">Daftar A-Z</h2>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                  <Link
                    key={letter}
                    href={`/donghua/az/${letter.toLowerCase()}`}
                    className="flex aspect-square items-center justify-center rounded-xl bg-white/[0.06] text-[13px] font-extrabold text-slate-200 transition hover:bg-sky-500 hover:text-white"
                  >
                    {letter}
                  </Link>
                ))}
              </div>
            </section>

          </>
        )}
      </div>
    </main>
  );
}
