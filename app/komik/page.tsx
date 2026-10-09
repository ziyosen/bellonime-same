'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import KomikCard from '@/components/komik/KomikCard';
import {
  fetchWestHome,
  fetchWestGenres,
  WEST_CATEGORIES,
  type WestCard,
  type WestGenre,
  type WestHome,
} from '@/lib/westmanga';

function Row({ title, items, href }: { title: string; items: WestCard[]; href?: string }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">{title}</h2>
        {href ? (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-rose-300 hover:text-rose-200"
          >
            SEMUA <ChevronRight size={14} />
          </Link>
        ) : null}
      </div>
      <div className="flex gap-4 overflow-x-auto px-0.5 pb-5 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.slice(0, 18).map((item) => (
          <KomikCard key={`${title}-${item.slug}`} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function KomikHomePage() {
  const [home, setHome] = useState<WestHome | null>(null);
  const [genres, setGenres] = useState<WestGenre[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [h, g] = await Promise.allSettled([fetchWestHome(), fetchWestGenres()]);
        if (!alive) return;
        if (h.status === 'fulfilled') setHome(h.value);
        if (g.status === 'fulfilled') setGenres(g.value);
        if (h.status === 'rejected') setError('Sumber komik belum bisa diambil saat ini. Coba lagi sebentar ya.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-7xl px-3 pt-[74px] sm:px-6 md:pt-20 lg:px-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Baca Komik</h1>
            <p className="mt-1 text-sm text-slate-400">Manga, manhwa & manhua sub Indo — tanpa chat, tanpa login, bersih.</p>
          </div>
        </div>

        <form action="komik/search" method="get" className="mt-5 hidden gap-2 md:flex">
          <div className="relative flex-1">
            <input
              name="q"
              type="search"
              placeholder="Cari komik..."
              className="h-12 w-full rounded-full bg-white/[0.06] pl-11 pr-5 text-sm text-white placeholder:text-slate-400 outline-none ring-rose-500 focus:ring-2"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          </div>
          <button type="submit" className="h-12 rounded-full bg-rose-500 px-5 text-sm font-extrabold text-white transition hover:bg-rose-400">
            Cari
          </button>
        </form>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">Memuat komik...</div>
        ) : error || !home ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
            {error || 'Sumber komik belum bisa diambil saat ini. Coba lagi sebentar ya.'}
          </div>
        ) : (
          <>
            {genres.length ? (
              <section className="mt-7">
                <h2 className="mb-4 text-lg font-extrabold tracking-tight text-white sm:text-xl">Genre</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {genres.map((g) => (
                    <Link
                      key={`${g.id}-${g.name}`}
                      href={`/komik/genre/${g.id}`}
                      className="shrink-0 rounded-full bg-white/[0.06] px-4 py-2.5 text-[12px] font-semibold text-slate-200 transition hover:bg-rose-500 hover:text-white"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-7">
              <h2 className="mb-4 text-lg font-extrabold tracking-tight text-white sm:text-xl">Kategori</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {WEST_CATEGORIES.map((c) => (
                  <Link
                    key={c.kind}
                    href={`/komik/${c.kind}`}
                    className="shrink-0 rounded-full bg-white/[0.06] px-4 py-2.5 text-[12px] font-semibold text-slate-200 transition hover:bg-rose-500 hover:text-white"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </section>

            <Row title="Update Terbaru" items={home.mirrorUpdate} href="/komik/latest" />
            <Row title="Populer" items={home.popular} href="/komik/popular" />
            <Row title="Project Baru" items={home.newProject} href="/komik/projects" />
            <Row title="Project Update" items={home.projectUpdate} href="/komik/projects" />
          </>
        )}
      </div>
    </main>
  );
}
