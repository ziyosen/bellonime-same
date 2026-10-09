'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { fetchWestList, type WestCard } from '@/lib/westmanga';
import KomikCard from './KomikCard';

const PERIODS = [
  { key: 'popular', label: 'Populer', endpoint: 'popular' },
  { key: 'manhwa', label: 'Manhwa', endpoint: 'manhwa' },
  { key: 'manhua', label: 'Manhua', endpoint: 'manhua' },
  { key: 'manga', label: 'Manga', endpoint: 'manga' },
] as const;

export default function PopulerSection() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]['key']>('popular');
  const [items, setItems] = useState<WestCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      const active = PERIODS.find((p) => p.key === period) || PERIODS[0];
      const list = await fetchWestList(active.endpoint, 1).catch(() => [] as WestCard[]);
      if (!alive) return;
      setItems(list.slice(0, 6)); // grid 3 kolom x 2 baris seperti westmanga
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [period]);

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">Populer</h2>
        <Link
          href={`/komik/${(PERIODS.find((p) => p.key === period) || PERIODS[0]).endpoint}`}
          className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-rose-300 hover:text-rose-200"
        >
          SEMUA <ChevronRight size={14} />
        </Link>
      </div>

      {/* tab jenis komik: pill horizontal, aktif = pill terang */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
              period === p.key
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* grid 3 kolom mobile */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-[18px] bg-slate-800/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-6">
          {items.map((it) => (
            <div key={it.slug} className="[&>a]:w-full">
              <KomikCard item={it} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
