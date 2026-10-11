'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import KomikCard from '@/components/komik/KomikCard';
import PopulerSection from '@/components/komik/PopulerSection';
import {
  fetchWestDetail,
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
            className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-orange-300 hover:text-orange-200"
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
        if (h.status === 'fulfilled') {
          setHome(h.value);
          // Project Baru dari sumber tidak membawa lastChapters — lengkapi dari detail (maks 6)
          const need = h.value.newProject.filter((c) => !c.lastChapters?.length).slice(0, 6);
          for (const card of need) {
            try {
              const det = await fetchWestDetail(card.slug);
              if (!alive) return;
              const latest = det.chapters?.[0];
              const countryId = det.countryId;
              setHome((prev) =>
                prev
                  ? {
                      ...prev,
                      newProject: prev.newProject.map((c) =>
                        c.slug === card.slug
                          ? {
                              ...c,
                              countryId: c.countryId || countryId,
                              lastChapters: latest ? [latest] : c.lastChapters,
                            }
                          : c,
                      ),
                    }
                  : prev,
              );
            } catch {
              // biarkan kartu tampil tanpa CH bila detail gagal
            }
          }
        }
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
      <div className="mx-auto max-w-[1500px] px-3 pt-[58px] sm:px-6 md:pt-16 lg:px-8">
        <form action="komik/search" method="get" className="mt-5 hidden gap-2 md:flex">
          <div className="relative flex-1">
            <input
              name="q"
              type="search"
              placeholder="Cari komik..."
              className="h-12 w-full rounded-full bg-white/[0.06] pl-11 pr-5 text-sm text-white placeholder:text-slate-400 outline-none ring-orange-500 focus:ring-2"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          </div>
          <button type="submit" className="h-12 rounded-full bg-orange-500 px-5 text-sm font-extrabold text-white transition hover:bg-orange-400">
            Cari
          </button>
        </form>

        <h1 className="mt-0 bg-gradient-to-r from-orange-300 via-orange-500 to-amber-400 bg-clip-text text-center font-black italic leading-tight tracking-tight text-transparent text-[26px] sm:text-4xl">
          Baca komik sub Indonesia
        </h1>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">Memuat komik...</div>
        ) : error || !home ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
            {error || 'Sumber komik belum bisa diambil saat ini. Coba lagi sebentar ya.'}
          </div>
        ) : (
          <>
            <PopulerSection />

            {genres.length ? (
              <section className="mt-7">
                <h2 className="mb-4 text-lg font-extrabold tracking-tight text-white sm:text-xl">Genre</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {genres.map((g) => (
                    <Link
                      key={`${g.id}-${g.name}`}
                      href={`/komik/genre/${g.id}`}
                      className="shrink-0 rounded-full bg-white/10 px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-orange-500 hover:text-white"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <Row title="Update Terbaru" items={home.mirrorUpdate} href="/komik/latest" />
            <Row title="Project Baru" items={home.newProject} href="/komik/projects" />
            <Row title="Project Update" items={home.projectUpdate} href="/komik/projects" />

            <section className="mt-7">
              <h2 className="mb-4 text-lg font-extrabold tracking-tight text-white sm:text-xl">Kategori</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {WEST_CATEGORIES.map((c) => (
                  <Link
                    key={c.kind}
                    href={`/komik/${c.kind}`}
                    className="shrink-0 rounded-full bg-white/10 px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-orange-500 hover:text-white"
                  >
                    {c.label}
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
